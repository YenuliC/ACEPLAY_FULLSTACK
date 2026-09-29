const Log = require("../models/Log");

// ─── GET LOGS ─────────────────────────────────────────────────────────────
// Superadmin only. Supports filters: action, userId, date range, targetId.

exports.getLogs = async (req, res) => {
  try {
    const filter = {};

    if (req.query.action)   filter.action   = req.query.action;
    if (req.query.targetId) filter.targetId = req.query.targetId;
    if (req.query.userId)   filter.userId   = req.query.userId;

    if (req.query.from || req.query.to) {
      filter.timestamp = {};
      if (req.query.from) filter.timestamp.$gte = new Date(req.query.from);
      if (req.query.to)   filter.timestamp.$lte = new Date(req.query.to + "T23:59:59.999Z");
    }

    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 50);
    const skip  = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      Log.find(filter)
        .populate("userId",   "email name role")
        .populate("targetId", "slug country data")
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit),
      Log.countDocuments(filter)
    ]);

    res.json({ logs, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
