const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  companyId: { type: String, default: null },
  name:      { type: String, default: "" },

  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["superadmin", "owner"],
    default: "owner"
  },

  // Set to true when Super Admin creates the account.
  // Owner must complete password change + 2FA setup before accessing the dashboard.
  isFirstLogin: { type: Boolean, default: false },

  // 2FA
  twoFactorEnabled:    { type: Boolean, default: false },
  twoFactorSecret:     { type: String,  default: null },
  twoFactorTempSecret: { type: String,  default: null }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
