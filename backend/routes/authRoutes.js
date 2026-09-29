const router      = require("express").Router();
const rateLimit   = require("express-rate-limit");
const auth        = require("../middleware/auth");
const authCtrl    = require("../controllers/authController");

// ── Rate limiter: max 10 login attempts per 15 minutes per IP ─────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      10,
  message:  { message: "Too many login attempts. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders:   false
});

// ── Public routes ──────────────────────────────────────────────────────────
router.get( "/superadmin-exists",         authCtrl.checkSuperAdminExists);
router.post("/register",                  authCtrl.register);
router.post("/login",                     loginLimiter, authCtrl.login);
router.post("/verify-2fa",                authCtrl.verify2FA);
router.post("/change-password-direct",    authCtrl.changePasswordDirect);

// ── Protected routes (require valid JWT) ───────────────────────────────────
router.get( "/me",               auth, authCtrl.getMe);
router.post("/change-password",  auth, authCtrl.changePassword);
router.post("/enable-2fa",       auth, authCtrl.enableTwoFA);
router.post("/verify-2fa-setup", auth, authCtrl.verifyTwoFASetup);
router.post("/disable-2fa",      auth, authCtrl.disableTwoFA);

module.exports = router;
