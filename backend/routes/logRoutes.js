const router  = require("express").Router();
const auth    = require("../middleware/auth");
const { requireSuperAdmin } = require("../middleware/roles");
const { getLogs } = require("../controllers/logController");

router.get("/", auth, requireSuperAdmin, getLogs);

module.exports = router;
