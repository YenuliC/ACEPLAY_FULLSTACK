const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  companyId: { type: String, required: true },

  action:   { type: String, enum: ["CREATE", "UPDATE", "DELETE"], required: true },
  target:   { type: String, default: "CASINO" },
  targetId: { type: mongoose.Schema.Types.ObjectId, ref: "Casino" },

  timestamp: { type: Date, default: Date.now },

  changes: {
    before: { type: mongoose.Schema.Types.Mixed, default: null },
    after:  { type: mongoose.Schema.Types.Mixed, default: null }
  },

  operatorName: String,
  operatorRole: String,
  ip:           String
}, { timestamps: false });

logSchema.index({ companyId: 1, timestamp: -1 });

module.exports = mongoose.model("Log", logSchema);
