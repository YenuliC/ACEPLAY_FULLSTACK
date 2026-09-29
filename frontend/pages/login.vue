<script setup>
import { ref, onMounted } from "vue";

const config = useRuntimeConfig();

const email    = ref("");
const password = ref("");
const error    = ref(null);
const loading  = ref(false);

// Show "Register" link only when no superadmin exists yet
const showRegisterLink = ref(false);
onMounted(async () => {
  try {
    const res = await $fetch(config.public.apiBase + "/auth/superadmin-exists");
    showRegisterLink.value = !res.exists;
  } catch {
    showRegisterLink.value = false;
  }
});

const storeUser = (user) => {
  if (user?.role)  localStorage.setItem("userRole",  user.role);
  if (user?.email) localStorage.setItem("userEmail", user.email);
  if (user?.name)  localStorage.setItem("userName",  user.name);
  localStorage.setItem("isFirstLogin", user?.isFirstLogin ? "true" : "false");
};

const login = async () => {
  if (!email.value || !password.value) {
    error.value = "Email and password are required"; return;
  }
  loading.value = true;
  error.value   = null;
  try {
    const res = await $fetch(config.public.apiBase + "/auth/login", {
      method: "POST",
      body:   { email: email.value, password: password.value }
    });

    if (res.twoFactor) {
      // 2FA already set up → go to OTP verification
      sessionStorage.setItem("2fa_userId", res.userId);
      await navigateTo("/verify-2fa");
    } else if (res.token) {
      localStorage.setItem("token", res.token);
      storeUser(res.user);

      if (res.user?.isFirstLogin) {
        // Owner first login — must complete setup wizard
        navigateTo("/setup");
      } else if (!res.user?.twoFactorEnabled) {
        // New superadmin — must set up 2FA before using the system
        navigateTo("/enable-2fa");
      } else {
        navigateTo("/dashboard");
      }
    } else {
      error.value = "Login failed. Please try again.";
    }
  } catch (e) {
    error.value = e?.data?.message || e?.data || "Invalid credentials";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-brand">
        <span class="brand-icon">♠</span>
        <span class="brand-text">ACEPlay <em>Admin</em></span>
      </div>
      <h1 class="auth-title">Sign In</h1>
      <p class="auth-sub">Manage your casino content</p>

      <div v-if="error" class="auth-error">{{ error }}</div>

      <div class="auth-form">
        <div class="auth-field">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="Enter your email address" @keyup.enter="login" />
        </div>
        <div class="auth-field">
          <label>Password</label>
          <input v-model="password" type="password" placeholder="Enter your password" @keyup.enter="login" />
          <NuxtLink to="/change-password" class="pwd-link">Change Password</NuxtLink>
        </div>
        <button class="auth-btn" :disabled="loading" @click="login">
          {{ loading ? "Signing in…" : "Sign In" }}
        </button>
      </div>

      <p v-if="showRegisterLink" class="auth-footer">
        No admin account yet?
        <NuxtLink to="/register">Create Account</NuxtLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  background: var(--ace-bg-dark); font-family: var(--ace-font);
}
.auth-card {
  background: #12151c; border-radius: 16px; padding: 40px 36px;
  width: 100%; max-width: 400px; box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  border: 1px solid #2a3142; border-top: 4px solid var(--ace-gold);
}
.auth-brand { display: flex; align-items: center; gap: 10px; justify-content: center; margin-bottom: 24px; }
.brand-icon { font-size: 30px; color: var(--ace-gold); }
.brand-text { font-size: 22px; font-weight: 800; color: #e8eaed; letter-spacing: -0.02em; }
.brand-text em { color: var(--ace-gold); font-style: normal; }
.auth-title { font-size: 24px; font-weight: 800; color: #e8eaed; text-align: center; margin: 0 0 6px; }
.auth-sub   { color: #9aa0ab; font-size: 14px; text-align: center; margin: 0 0 24px; }
.auth-error {
  background: rgba(220,38,38,0.12); color: #fca5a5;
  border: 1px solid rgba(220,38,38,0.3);
  border-radius: 8px; padding: 12px 14px; margin-bottom: 16px; font-size: 13px;
}
.auth-form  { display: flex; flex-direction: column; gap: 16px; }
.auth-field { display: flex; flex-direction: column; gap: 6px; }
.auth-field label {
  font-size: 11px; font-weight: 700; color: #9aa0ab;
  text-transform: uppercase; letter-spacing: 0.6px;
}
.auth-field input {
  padding: 11px 14px; border: 1px solid #2a3142; border-radius: 8px;
  font-size: 14px; outline: none; transition: all 0.2s;
  background: #1a1f2e; color: #e8eaed;
}
.auth-field input::placeholder { color: #6b7280; }
.auth-field input:focus {
  border-color: var(--ace-gold);
  box-shadow: 0 0 0 3px rgba(246,176,33,0.12);
}
.auth-btn {
  padding: 13px; background: var(--ace-gradient); color: var(--ace-black);
  border: none; border-radius: 10px; font-size: 15px; font-weight: 800;
  cursor: pointer; transition: opacity 0.2s, transform 0.15s;
  box-shadow: 0 4px 14px rgba(246,176,33,0.35); margin-top: 4px;
}
.auth-btn:hover    { opacity: 0.92; transform: translateY(-1px); }
.auth-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
.pwd-link {
  align-self: flex-end; font-size: 12px; color: #9aa0ab;
  text-decoration: none; margin-top: 2px;
}
.pwd-link:hover { color: var(--ace-gold); text-decoration: underline; }
.auth-footer {
  text-align: center; font-size: 13px; color: #6b7280; margin-top: 20px; margin-bottom: 0;
}
.auth-footer a { color: var(--ace-gold); text-decoration: none; font-weight: 600; }
.auth-footer a:hover { text-decoration: underline; }
</style>
