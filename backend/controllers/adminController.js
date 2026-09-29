const User   = require("../models/User");
const Casino = require("../models/Casino");
const Log    = require("../models/Log");
const bcrypt = require("bcryptjs");

// ─── Helpers ─────────────────────────────────────────────────────────────

const getIp = (req) =>
  (req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "").split(",")[0].trim();

// ─── CREATE OWNER ─────────────────────────────────────────────────────────
// Only Super Admin can call this. Owners cannot self-register.

exports.createOwner = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "name, email, and password are required" });

    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing)
      return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 12);
    const user   = await User.create({
      name,
      email,
      password:     hashed,
      role:         "owner",
      isFirstLogin: true,
      twoFactorEnabled: false
    });

    user.companyId = user._id.toString();
    await user.save();

    res.status(201).json({
      message: "Owner account created successfully",
      user: {
        id:           user._id,
        name:         user.name,
        email:        user.email,
        role:         user.role,
        isFirstLogin: user.isFirstLogin,
        createdAt:    user.createdAt
      }
    });
  } catch (err) {
    console.error("[createOwner]", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── GET ALL OWNERS ───────────────────────────────────────────────────────

exports.getOwners = async (req, res) => {
  try {
    const owners = await User.find({ role: "owner" })
      .select("-password -twoFactorSecret -twoFactorTempSecret")
      .sort({ createdAt: -1 });

    res.json(owners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── RESET OWNER PASSWORD ─────────────────────────────────────────────────
// Only Super Admin can call this.
// Resets an owner's password, sets isFirstLogin = true so they go through
// the setup wizard (change password + 2FA) again on next login.

exports.resetOwnerPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6)
      return res.status(400).json({ message: "New password must be at least 6 characters" });

    const owner = await User.findById(id);
    if (!owner)
      return res.status(404).json({ message: "Owner not found" });

    if (owner.role !== "owner")
      return res.status(400).json({ message: "Only owner accounts can be reset this way" });

    const before = {
      isFirstLogin:     owner.isFirstLogin,
      twoFactorEnabled: owner.twoFactorEnabled
    };

    owner.password         = await bcrypt.hash(newPassword, 12);
    owner.isFirstLogin     = true;   // force setup wizard on next login
    owner.twoFactorEnabled = false;
    owner.twoFactorSecret  = null;
    owner.twoFactorTempSecret = null;
    await owner.save();

    // Audit log
    await Log.create({
      userId:       req.user._id,
      companyId:    req.user.companyId,
      action:       "UPDATE",
      target:       "OWNER",
      targetId:     owner._id,
      operatorName: req.user.name || req.user.email,
      operatorRole: req.user.role,
      ip:           getIp(req),
      changes: {
        before,
        after: { isFirstLogin: true, twoFactorEnabled: false, note: "Password reset by Super Admin" }
      }
    });

    console.log(`[resetOwnerPassword] Reset password for owner: ${owner.email} by ${req.user.email}`);

    res.json({
      message: `Password reset successfully. ${owner.email} must log in with the new temporary password and complete setup.`
    });
  } catch (err) {
    console.error("[resetOwnerPassword]", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── SUPERADMIN DASHBOARD STATS ───────────────────────────────────────────

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalOwners, totalCasinos, totalLogs, recentLogs] = await Promise.all([
      User.countDocuments({ role: "owner" }),
      Casino.countDocuments({}),
      Log.countDocuments({}),
      Log.find({})
        .populate("userId",   "email name role")
        .populate("targetId", "slug country")
        .sort({ timestamp: -1 })
        .limit(10)
    ]);

    res.json({ totalOwners, totalCasinos, totalLogs, recentLogs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
