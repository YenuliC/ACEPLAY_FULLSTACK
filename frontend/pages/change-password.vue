<script setup>
import { ref } from "vue";

const config = useRuntimeConfig();

const email       = ref("");
const currentPwd  = ref("");
const newPwd      = ref("");
const confirmPwd  = ref("");
const loading     = ref(false);
const error       = ref(null);
const success     = ref(false);

const submit = async () => {
  error.value = null;

  if (!email.value || !currentPwd.value || !newPwd.value || !confirmPwd.value) {
    error.value = "All fields are required"; return;
  }
  if (newPwd.value.length < 8) {
    error.value = "New password must be at least 8 characters"; return;
  }
  if (newPwd.value !== confirmPwd.value) {
    error.value = "New passwords do not match"; return;
  }

  loading.value = true;
  try {
    await $fetch(config.public.apiBase + "/auth/change-password-direct", {
      method: "POST",
      body: {
        email:           email.value,
        currentPassword: currentPwd.value,
        newPassword:     newPwd.value
      }
    });
    success.value = true;
  } catch (e) {
    error.value = e?.data?.message || "Failed to update password. Check your details and try again.";
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

      <!-- Success state -->
      <template v-if="success">
        <div class="success-icon-wrap">✓</div>
        <h1 class="auth-title">Password Updated</h1>
        <p class="auth-sub">Your password has been changed successfully.<br />Please sign in with your new password.</p>
        <NuxtLink to="/login" class="auth-btn auth-btn-link">Go to Sign In →</NuxtLink>
      </template>

      <!-- Form -->
      <template v-else>
        <h1 class="auth-title">Change Password</h1>
        <p class="auth-sub">Enter your current password and choose a new one.</p>

        <div v-if="error" class="auth-error">{{ error }}</div>

        <div class="auth-form">
          <div class="auth-field">
            <label>Email</label>
            <input v-model="email" type="email" placeholder="Your admin email address" @keyup.enter="submit" />
          </div>
          <div class="auth-field">
            <label>Current Password</label>
            <input v-model="currentPwd" type="password" placeholder="Your current password" @keyup.enter="submit" />
          </div>
          <div class="field-divider"></div>
          <div class="auth-field">
            <label>New Password</label>
            <input v-model="newPwd" type="password" placeholder="At least 8 characters" @keyup.enter="submit" />
          </div>
          <div class="auth-field">
            <label>Confirm New Password</label>
            <input v-model="confirmPwd" type="password" placeholder="Repeat new password" @keyup.enter="submit" />
          </div>
          <button class="auth-btn" :disabled="loading" @click="submit">
            {{ loading ? "Updating…" : "Update Password" }}
          </button>
        </div>

        <p class="auth-footer"><NuxtLink to="/login">← Back to Sign In</NuxtLink></p>
      </template>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  background: var(--ace-bg-dark); font-family: var(--ace-font); padding: 20px;
}
.auth-card {
  background: #12151c; border-radius: 16px; padding: 40px 36px;
  width: 100%; max-width: 420px; box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  border: 1px solid #2a3142; border-top: 4px solid var(--ace-gold);
}
.auth-brand { display: flex; align-items: center; gap: 10px; justify-content: center; margin-bottom: 24px; }
.brand-icon { font-size: 30px; color: var(--ace-gold); }
.brand-text { font-size: 22px; font-weight: 800; color: #e8eaed; letter-spacing: -0.02em; }
.brand-text em { color: var(--ace-gold); font-style: normal; }

.auth-title { font-size: 22px; font-weight: 800; color: #e8eaed; text-align: center; margin: 0 0 8px; }
.auth-sub   { color: #9aa0ab; font-size: 14px; text-align: center; margin: 0 0 24px; line-height: 1.6; }

.auth-error {
  background: rgba(220,38,38,0.12); color: #fca5a5;
  border: 1px solid rgba(220,38,38,0.3);
  border-radius: 8px; padding: 12px 14px; margin-bottom: 16px; font-size: 13px;
}

.auth-form  { display: flex; flex-direction: column; gap: 14px; }
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

.field-divider { height: 1px; background: #2a3142; margin: 4px 0; }

.auth-btn {
  padding: 13px; background: var(--ace-gradient); color: var(--ace-black);
  border: none; border-radius: 10px; font-size: 15px; font-weight: 800;
  cursor: pointer; transition: opacity 0.2s, transform 0.15s;
  box-shadow: 0 4px 14px rgba(246,176,33,0.35); margin-top: 4px;
  width: 100%;
}
.auth-btn:hover    { opacity: 0.92; transform: translateY(-1px); }
.auth-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
.auth-btn-link {
  display: block; text-align: center; text-decoration: none;
  padding: 13px; margin-top: 0;
}

.success-icon-wrap {
  width: 56px; height: 56px; border-radius: 50%;
  background: rgba(34,197,94,0.15); color: #4ade80;
  font-size: 26px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px;
}

.auth-footer {
  text-align: center; font-size: 13px; color: #6b7280; margin-top: 20px; margin-bottom: 0;
}
.auth-footer a { color: var(--ace-gold); text-decoration: none; font-weight: 600; }
.auth-footer a:hover { text-decoration: underline; }
</style>
