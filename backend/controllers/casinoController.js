const Casino = require("../models/Casino");
const Log    = require("../models/Log");

// ─── Helper: build ownership filter ──────────────────────────────────────
// Superadmin sees all casinos; owners see only their own.

const ownerFilter = (req) => {
  if (req.user.role === "superadmin") return {};
  return { companyId: req.user.companyId };
};

// ─── Helper: write an audit log ──────────────────────────────────────────

const writeLog = async (req, action, casino, before = null, after = null) => {
  await Log.create({
    userId:       req.user._id,
    companyId:    req.user.companyId,
    action,
    target:       "CASINO",
    targetId:     casino._id,
    timestamp:    new Date(),
    changes:      { before, after },
    operatorName: req.user.name || req.user.email,
    operatorRole: req.user.role,
    ip:           req.ip
  });
};

// ─── CREATE ───────────────────────────────────────────────────────────────

exports.createCasino = async (req, res) => {
  try {
    const { country, slug, data } = req.body;

    if (!data || !data.casino || !data.casino.name) {
      return res.status(400).json({ message: "data.casino.name is required" });
    }

    const casino = await Casino.create({
      companyId: req.user.companyId,
      ownerId:   req.user._id,
      country,
      slug,
      data
    });

    await writeLog(req, "CREATE", casino, null, data);

    res.status(201).json(casino);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Casino with this slug & country already exists" });
    }
    res.status(500).json({ message: err.message });
  }
};

// ─── GET ALL ──────────────────────────────────────────────────────────────

exports.getMyCasinos = async (req, res) => {
  try {
    const filter = ownerFilter(req);
    if (req.query.country) filter.country = req.query.country;

    const casinos = await Casino.find(filter)
      .populate("ownerId", "email name")
      .sort({ createdAt: -1 });

    res.json(casinos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET ONE ──────────────────────────────────────────────────────────────

exports.getCasino = async (req, res) => {
  try {
    const filter = { _id: req.params.id, ...ownerFilter(req) };

    const casino = await Casino.findOne(filter).populate("ownerId", "email name");
    if (!casino) return res.status(404).json({ message: "Casino not found" });

    res.json(casino);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── UPDATE ───────────────────────────────────────────────────────────────
// Changes are applied immediately for all roles. A log entry records the diff.

exports.updateCasino = async (req, res) => {
  try {
    const filter = { _id: req.params.id, ...ownerFilter(req) };
    const casino = await Casino.findOne(filter);

    if (!casino) return res.status(404).json({ message: "Casino not found" });

    const before = casino.data.toObject ? casino.data.toObject() : JSON.parse(JSON.stringify(casino.data));

    if (req.body.country) casino.country = req.body.country;
    if (req.body.slug)    casino.slug    = req.body.slug;

    if (req.body.data) {
      casino.data = req.body.data;
      casino.markModified("data");
    }

    await casino.save();

    await writeLog(req, "UPDATE", casino, before, casino.data);

    res.json(casino);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Slug/country combination already exists" });
    }
    res.status(500).json({ message: err.message });
  }
};

// ─── DELETE ───────────────────────────────────────────────────────────────

exports.deleteCasino = async (req, res) => {
  try {
    const filter = { _id: req.params.id, ...ownerFilter(req) };
    const casino = await Casino.findOneAndDelete(filter);

    if (!casino) return res.status(404).json({ message: "Casino not found" });

    const before = casino.data.toObject ? casino.data.toObject() : JSON.parse(JSON.stringify(casino.data));
    await writeLog(req, "DELETE", casino, before, null);

    res.json({ message: "Casino deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
