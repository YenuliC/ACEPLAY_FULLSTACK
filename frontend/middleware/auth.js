const PUBLIC_PATHS     = ["/login", "/register", "/verify-2fa", "/change-password"];
const SETUP_PATH       = "/setup";
const ENABLE_2FA_PATH  = "/enable-2fa";
const SUPERADMIN_PATHS = ["/logs", "/users"];

export default defineNuxtRouteMiddleware((to) => {
  if (!import.meta.client) return;

  const token        = localStorage.getItem("token");
  const role         = localStorage.getItem("userRole");
  const isFirstLogin = localStorage.getItem("isFirstLogin") === "true";

  // Not logged in — allow public pages, redirect everything else to login
  if (!token) {
    if (PUBLIC_PATHS.includes(to.path)) return;
    return navigateTo("/login");
  }

  // Logged in users:

  // First-login owners must complete setup before accessing anything else
  if (isFirstLogin && to.path !== SETUP_PATH) {
    return navigateTo(SETUP_PATH);
  }

  // After setup, block access to the setup wizard
  if (!isFirstLogin && to.path === SETUP_PATH) {
    return navigateTo("/dashboard");
  }

  // /enable-2fa is accessible to any authenticated user
  if (to.path === ENABLE_2FA_PATH) return;

  // Only superadmin can access logs and users pages
  if (role === "owner" && SUPERADMIN_PATHS.some(p => to.path.startsWith(p))) {
    return navigateTo("/dashboard");
  }
});
