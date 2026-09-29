const router = require("express").Router();
const Casino = require("../models/Casino");

// Public: get casino by country + slug (no auth required, case-insensitive)
router.get("/casino/:country/:slug", async (req, res) => {
  const { country, slug } = req.params;

  console.log(`[PUBLIC] GET casino  country="${country}"  slug="${slug}"`);

  try {
    const casino = await Casino.findOne({
      country: new RegExp(`^${country}$`, "i"),
      slug:    new RegExp(`^${slug}$`,    "i")
    });

    if (!casino) {
      console.log(`[PUBLIC] 404 – no casino found for country="${country}" slug="${slug}"`);
      return res.status(404).json({ success: false, message: "Casino not found" });
    }

    console.log(`[PUBLIC] 200 – found: "${casino.data?.casino?.name}"`);
    res.json({ success: true, data: casino.data });

  } catch (err) {
    console.error("[PUBLIC] Server error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Public: list all casinos for a country (no auth required, case-insensitive)
router.get("/casinos/:country", async (req, res) => {
  const { country } = req.params;

  console.log(`[PUBLIC] GET casinos  country="${country}"`);

  try {
    const casinos = await Casino.find({
      country: new RegExp(`^${country}$`, "i")
    }).select("slug country data.casino.name data.casino.url.logo createdAt");

    console.log(`[PUBLIC] 200 – found ${casinos.length} casino(s) for "${country}"`);
    res.json({ success: true, data: casinos });

  } catch (err) {
    console.error("[PUBLIC] Server error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
