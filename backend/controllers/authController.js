const User      = require("../models/User");
const bcrypt    = require("bcryptjs");
const jwt       = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const QRCode    = require("qrcode");

// ─── Helper: sign JWT ──────────────────────────────────────────────────────

const signToken = (userId) =>
  jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

// Helper: safe user payload for responses
const userPayload = (u) => ({
  id:               u._id,
  email:            u.email,
  name:             u.name,
  companyId:        u.companyId,
  role:             u.role,
  isFirstLogin:     u.isFirstLogin,
  twoFactorEnabled: u.twoFactorEnabled
});

// ─── CHECK SUPERADMIN EXISTS ──────────────────────────────────────────────
// Public GET — lets the register page show/hide the form.

exports.checkSuperAdminExists = async (_req, res) => {
  try {
    const existing = await User.findOne({ role: "superadmin" });
    res.json({ exists: !!existing });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─── REGISTER SUPER ADMIN ─────────────────────────────────────────────────
// Public. Only succeeds when NO superadmin exists yet.
// Owner accounts are created exclusively by Super Admin via /api/admin/owners.

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("[register] Attempt:", email);

    // Block if superadmin already exists
    const existing = await User.findOne({ role: "superadmin" });
    if (existing) {
      console.log("[register] Blocked — superadmin already exists");
      return res.status(409).json({
        message: "A Super Admin account already exists. Please login."
      });
    }

    if (!email || !password)
      return res.status(400).json({ message: "email and password are required" });

    if (password.length < 8)
      return res.status(400).json({ message: "Password must be at least 8 characters" });

    const emailTaken = await User.findOne({ email: email.toLowerCase().trim() });
    if (emailTaken)
      return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 12);
    const user   = await User.create({
      name:  name || "Super Admin",
      email,
      password:         hashed,
      role:             "superadmin",
      isFirstLogin:     false,   // superadmin skips the owner setup wizard
      twoFactorEnabled: false    // will set up 2FA on first login
    });
    user.companyId = user._id.toString();
    await user.save();

    console.log("[register] Super Admin created:", user.email);

    res.status(201).json({
      message: "Super Admin account created. Please login and set up 2FA.",
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("[register]", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── LOGIN (Step 1) ────────────────────────────────────────────────────────

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("[login] Attempt:", email);

    if (!email || !password)
      return res.status(400).json({ message: "email and password are required" });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      console.log("[login] User not found:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("[login] User found:", user.email, "| role:", user.role, "| 2FA:", user.twoFactorEnabled);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log("[login] Password mismatch for:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("[login] Password OK for:", email);

    // First-login owners: skip 2FA, issue token so they can complete setup
    if (user.isFirstLogin) {
      console.log("[login] First login — issuing token for setup wizard");
      const token = signToken(user._id);
      return res.json({ token, user: userPayload(user) });
    }

    // 2FA enabled → client completes Step 2
    if (user.twoFactorEnabled) {
      console.log("[login] 2FA required — sending userId");
      return res.json({ twoFactor: true, userId: user._id });
    }

    // No 2FA yet (new superadmin) → issue token, frontend sends to /enable-2fa
    console.log("[login] No 2FA — issuing token for 2FA setup");
    const token = signToken(user._id);
    res.json({ token, user: userPayload(user) });
  } catch (err) {
    console.error("[login]", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── VERIFY 2FA (Step 2 of login) ─────────────────────────────────────────

exports.verify2FA = async (req, res) => {
  try {
    const { userId, token } = req.body;

    if (!userId || !token)
      return res.status(400).json({ message: "userId and token are required" });

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (!user.twoFactorEnabled || !user.twoFactorSecret)
      return res.status(400).json({ message: "2FA is not enabled for this account" });

    const verified = speakeasy.totp.verify({
      secret:   user.twoFactorSecret,
      encoding: "base32",
      token,
      window:   1
    });

    if (!verified) {
      console.log("[verify2FA] Invalid OTP for:", user.email);
      return res.status(401).json({ message: "Invalid or expired 2FA code" });
    }

    console.log("[verify2FA] OTP OK for:", user.email);
    const jwtToken = signToken(user._id);
    res.json({ token: jwtToken, user: userPayload(user) });
  } catch (err) {
    console.error("[verify2FA]", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── CHANGE PASSWORD ──────────────────────────────────────────────────────
// Owners: only allowed during first-login setup (isFirstLogin === true).
// Super Admin: allowed at any time.

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: "currentPassword and newPassword are required" });

    // Re-fetch with password included — the auth middleware strips it
    const user = await User.findById(req.user._id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // Owners can only change password during first-login setup
    if (user.role === "owner" && !user.isFirstLogin)
      return res.status(403).json({ message: "Password changes are not permitted after account setup" });

    if (newPassword.length < 8)
      return res.status(400).json({ message: "New password must be at least 8 characters" });

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid)
      return res.status(401).json({ message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    console.log("[changePassword] Password updated for:", user.email);
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("[changePassword]", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── ENABLE 2FA (Step 1 of setup) ─────────────────────────────────────────

exports.enableTwoFA = async (req, res) => {
  try {
    const user = req.user;

    if (user.twoFactorEnabled)
      return res.status(400).json({ message: "2FA is already enabled" });

    const secret = speakeasy.generateSecret({
      name:   `ACEPlay (${user.email})`,
      length: 20
    });

    // Re-fetch to save twoFactorTempSecret (req.user has no password but can save other fields)
    const fullUser = await User.findById(user._id);
    fullUser.twoFactorTempSecret = secret.base32;
    await fullUser.save();

    // Generate larger QR for easier scanning (400x400)
    const qrDataUrl = await QRCode.toDataURL(secret.otpauth_url, {
      width:  400,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" }
    });

    console.log("[enableTwoFA] QR generated for:", user.email);

    res.json({
      message: "Scan the QR code with Google Authenticator, then verify with the 6-digit code.",
      qr:      qrDataUrl,
      secret:  secret.base32
    });
  } catch (err) {
    console.error("[enableTwoFA]", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── VERIFY 2FA SETUP ─────────────────────────────────────────────────────
// Activates 2FA. If isFirstLogin, marks setup complete.

exports.verifyTwoFASetup = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token || token.length !== 6)
      return res.status(400).json({ message: "A 6-digit OTP is required" });

    // Re-fetch to get twoFactorTempSecret (auth middleware excludes password but keeps secrets)
    const user = await User.findById(req.user._id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (!user.twoFactorTempSecret)
      return res.status(400).json({ message: "No pending 2FA setup found. Please restart the setup." });

    const verified = speakeasy.totp.verify({
      secret:   user.twoFactorTempSecret,
      encoding: "base32",
      token,
      window:   1
    });

    if (!verified) {
      console.log("[verifyTwoFASetup] Invalid OTP for:", user.email);
      return res.status(401).json({ message: "Invalid or expired OTP. Make sure your phone clock is correct." });
    }

    user.twoFactorSecret     = user.twoFactorTempSecret;
    user.twoFactorTempSecret = null;
    user.twoFactorEnabled    = true;

    if (user.isFirstLogin) user.isFirstLogin = false;

    await user.save();

    console.log("[verifyTwoFASetup] 2FA activated for:", user.email);
    res.json({ message: "2FA enabled successfully.", isFirstLogin: false });
  } catch (err) {
    console.error("[verifyTwoFASetup]", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── DISABLE 2FA ──────────────────────────────────────────────────────────

exports.disableTwoFA = async (req, res) => {
  try {
    const user = req.user;
    const { token } = req.body;

    if (!user.twoFactorEnabled)
      return res.status(400).json({ message: "2FA is not enabled" });

    if (!token)
      return res.status(400).json({ message: "Current 2FA code is required to disable 2FA" });

    const verified = speakeasy.totp.verify({
      secret:   user.twoFactorSecret,
      encoding: "base32",
      token,
      window:   1
    });

    if (!verified)
      return res.status(401).json({ message: "Invalid 2FA code" });

    user.twoFactorEnabled = false;
    user.twoFactorSecret  = null;
    await user.save();

    res.json({ message: "2FA disabled successfully" });
  } catch (err) {
    console.error("[disableTwoFA]", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── CHANGE PASSWORD DIRECT (no JWT) ─────────────────────────────────────
// Public endpoint for Super Admin. Verifies email + current password, then
// updates to the new password. Accessible from the login-page "Change Password" link.

exports.changePasswordDirect = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword)
      return res.status(400).json({ message: "email, currentPassword, and newPassword are required" });

    if (newPassword.length < 8)
      return res.status(400).json({ message: "New password must be at least 8 characters" });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    // Only superadmin can use this route
    if (user.role !== "superadmin")
      return res.status(403).json({ message: "This route is for Super Admin only" });

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      console.log("[changePasswordDirect] Wrong current password for:", email);
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    if (currentPassword === newPassword)
      return res.status(400).json({ message: "New password must be different from the current password" });

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    console.log("[changePasswordDirect] Password updated for:", user.email);
    res.json({ message: "Password updated successfully. Please login with your new password." });
  } catch (err) {
    console.error("[changePasswordDirect]", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── GET ME ───────────────────────────────────────────────────────────────

exports.getMe = async (req, res) => {
  try {
    res.json({ ...userPayload(req.user), createdAt: req.user.createdAt });
  } catch (err) {
    console.error("[getMe]", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
