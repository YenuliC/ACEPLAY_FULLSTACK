const router = require("express").Router();
const auth = require("../middleware/auth");
const casinoController = require("../controllers/casinoController");

router.post("/",       auth, casinoController.createCasino);
router.get("/",        auth, casinoController.getMyCasinos);
router.get("/:id",     auth, casinoController.getCasino);
router.put("/:id",     auth, casinoController.updateCasino);
router.delete("/:id",  auth, casinoController.deleteCasino);

module.exports = router;
