<script setup>
import { ref, onMounted } from "vue";

const token   = ref("");
const error   = ref(null);
const loading = ref(false);

let userId = null;

onMounted(() => {
  userId = sessionStorage.getItem("2fa_userId");
  if (!userId) navigateTo("/login");
});

const verify = async () => {
  if (!token.value || token.value.length !== 6) {
    error.value = "Please enter the 6-digit code from your authenticator app";
    return;
  }
  error.value   = null;
  loading.value = true;
  try {
    const config = useRuntimeConfig();
    const res = await $fetch(config.public.apiBase + "/auth/verify-2fa", {
      method: "POST",
      body:   { userId, token: token.value }
    });
    sessionStorage.removeItem("2fa_userId");
    localStorage.setItem("token",        res.token);
    if (res.user?.role)  localStorage.setItem("userRole",      res.user.role);
    if (res.user?.email) localStorage.setItem("userEmail",     res.user.email);
    if (res.user?.name)  localStorage.setItem("userName",      res.user.name);
    localStorage.setItem("isFirstLogin", res.user?.isFirstLogin ? "true" : "false");
    navigateTo(res.user?.isFirstLogin ? "/setup" : "/dashboard");
  } catch (e) {
    error.value = e?.data?.message || "Invalid or expired code. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-brand">
        <span class="brand-icon">🔐</span>
        <span class="brand-text">ACEPlay <em>Admin</em></span>
      </div>
      <h1 class="auth-title">Two-Factor Authentication</h1>
      <p class="auth-sub">Enter the 6-digit code from Google Authenticator</p>

      <div v-if="error" class="auth-error">{{ error }}</div>

      <div class="auth-form">
        <div class="auth-field">
          <label>Authenticator Code</label>
          <input
            v-model="token"
            type="text"
            inputmode="numeric"
            maxlength="6"
            placeholder="Enter 6-digit code"
            class="otp-input"
            @keyup.enter="verify"
          />
        </div>
        <button class="auth-btn" :disabled="loading" @click="verify">
          {{ loading ? "Verifying…" : "Verify & Continue" }}
        </button>
      </div>

      <p class="auth-footer"><NuxtLink to="/login">← Back to login</NuxtLink></p>
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
  width: 100%; max-width: 400px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid #2a3142; border-top: 4px solid var(--ace-gold);
}
.auth-brand { display: flex; align-items: center; gap: 10px; justify-content: center; margin-bottom: 24px; }
.brand-icon { font-size: 30px; }
.brand-text { font-size: 22px; font-weight: 800; color: #e8eaed; letter-spacing: -0.02em; }
.brand-text em { color: var(--ace-gold); font-style: normal; }
.auth-title { font-size: 24px; font-weight: 800; color: #e8eaed; text-align: center; margin: 0 0 6px; }
.auth-sub { color: #9aa0ab; font-size: 13px; text-align: center; margin: 0 0 24px; }
.auth-error {
  background: rgba(220, 38, 38, 0.12); color: #fca5a5; border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 8px; padding: 12px 14px; margin-bottom: 16px; font-size: 13px;
}
.auth-form { display: flex; flex-direction: column; gap: 16px; }
.auth-field { display: flex; flex-direction: column; gap: 6px; }
.auth-field label {
  font-size: 11px; font-weight: 700; color: #9aa0ab;
  text-transform: uppercase; letter-spacing: 0.6px;
}
.otp-input {
  padding: 11px 14px; border: 1px solid #2a3142; border-radius: 8px;
  font-size: 14px; font-weight: 600; letter-spacing: 4px; text-align: center;
  outline: none; transition: all 0.2s; background: #1a1f2e; color: #e8eaed;
}
.otp-input::placeholder { color: #6b7280; font-weight: 400; letter-spacing: 0; }
.otp-input:focus {
  border-color: var(--ace-gold);
  box-shadow: 0 0 0 3px rgba(246, 176, 33, 0.12);
}
.auth-btn {
  padding: 13px; background: var(--ace-gradient); color: var(--ace-black);
  border: none; border-radius: 10px; font-size: 14px; font-weight: 600;
  cursor: pointer; transition: opacity 0.2s, transform 0.15s;
  box-shadow: 0 4px 14px rgba(246, 176, 33, 0.35); margin-top: 4px;
}
.auth-btn:hover { opacity: 0.92; transform: translateY(-1px); }
.auth-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
.auth-footer { text-align: center; margin-top: 20px; font-size: 13px; color: #9aa0ab; }
.auth-footer a { color: var(--ace-gold); text-decoration: none; font-weight: 600; }
.auth-footer a:hover { color: var(--ace-orange); }
</style>
