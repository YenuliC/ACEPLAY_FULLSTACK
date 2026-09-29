const router    = require("express").Router();
const auth      = require("../middleware/auth");
const { requireSuperAdmin } = require("../middleware/roles");
const adminCtrl = require("../controllers/adminController");

router.post("/owners",                        auth, requireSuperAdmin, adminCtrl.createOwner);
router.get( "/owners",                        auth, requireSuperAdmin, adminCtrl.getOwners);
router.put( "/owners/:id/reset-password",     auth, requireSuperAdmin, adminCtrl.resetOwnerPassword);
router.get( "/stats",                         auth, requireSuperAdmin, adminCtrl.getDashboardStats);

module.exports = router;
