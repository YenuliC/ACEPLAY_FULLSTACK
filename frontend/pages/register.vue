<script setup>
import { ref, onMounted } from "vue";

const config = useRuntimeConfig();

// States: "loading" | "form" | "exists"
const pageState  = ref("loading");
const email      = ref("");
const password   = ref("");
const confirmPwd = ref("");
const error      = ref(null);
const loading    = ref(false);
const success    = ref(false);

onMounted(async () => {
  try {
    const res = await $fetch(config.public.apiBase + "/auth/superadmin-exists");
    pageState.value = res.exists ? "exists" : "form";
  } catch {
    pageState.value = "form"; // fallback — let the API reject if already exists
  }
});

const register = async () => {
  error.value = null;

  if (!email.value || !password.value || !confirmPwd.value) {
    error.value = "All fields are required"; return;
  }
  if (password.value.length < 8) {
    error.value = "Password must be at least 8 characters"; return;
  }
  if (password.value !== confirmPwd.value) {
    error.value = "Passwords do not match"; return;
  }

  loading.value = true;
  try {
    await $fetch(config.public.apiBase + "/auth/register", {
      method: "POST",
      body: { email: email.value, password: password.value }
    });
    success.value = true;
    setTimeout(() => navigateTo("/login"), 2000);
  } catch (e) {
    const msg = e?.data?.message || "";
    if (msg.includes("already exists")) {
      pageState.value = "exists";
    } else {
      error.value = msg || "Registration failed. Please try again.";
    }
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

      <!-- Loading -->
      <div v-if="pageState === 'loading'" class="auth-loading">
        Checking system status…
      </div>

      <!-- Already exists -->
      <template v-else-if="pageState === 'exists'">
        <div class="notice-icon">🔒</div>
        <h1 class="auth-title">Super Admin Exists</h1>
        <p class="auth-sub">
          A Super Admin account has already been created.<br />
          Please log in to access the system.
        </p>
        <NuxtLink to="/login" class="auth-btn auth-btn-link">Sign In →</NuxtLink>
      </template>

      <!-- Registration form -->
      <template v-else>
        <h1 class="auth-title">Create Super Admin</h1>
        <p class="auth-sub">Set up the initial administrator account</p>

        <div v-if="success" class="auth-success">
          Account created! Redirecting to login…
        </div>

        <template v-else>
          <div v-if="error" class="auth-error">{{ error }}</div>

          <div class="auth-form">
            <div class="auth-field">
              <label>Email</label>
              <input v-model="email" type="email" placeholder="Enter your email address" @keyup.enter="register" />
            </div>
            <div class="auth-field">
              <label>Password</label>
              <input v-model="password" type="password" placeholder="At least 8 characters" @keyup.enter="register" />
            </div>
            <div class="auth-field">
              <label>Confirm Password</label>
              <input v-model="confirmPwd" type="password" placeholder="Repeat your password" @keyup.enter="register" />
            </div>
            <button class="auth-btn" :disabled="loading" @click="register">
              {{ loading ? "Creating Account…" : "Create Admin Account" }}
            </button>
          </div>

          <p class="auth-footer">Already have an account? <NuxtLink to="/login">Sign In</NuxtLink></p>
        </template>
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

.auth-loading { color: #9aa0ab; font-size: 14px; text-align: center; padding: 20px 0; }

.notice-icon { font-size: 40px; text-align: center; margin-bottom: 14px; }
.auth-title {
  font-size: 22px; font-weight: 800; color: #e8eaed;
  text-align: center; margin: 0 0 8px;
}
.auth-sub { color: #9aa0ab; font-size: 14px; text-align: center; margin: 0 0 24px; line-height: 1.6; }

.auth-error {
  background: rgba(220,38,38,0.12); color: #fca5a5;
  border: 1px solid rgba(220,38,38,0.3);
  border-radius: 8px; padding: 12px 14px; margin-bottom: 16px; font-size: 13px;
}
.auth-success {
  background: rgba(34,197,94,0.12); color: #4ade80;
  border: 1px solid rgba(34,197,94,0.3);
  border-radius: 8px; padding: 14px; margin-bottom: 16px;
  font-size: 14px; text-align: center;
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
  width: 100%; display: block; text-align: center;
}
.auth-btn:hover    { opacity: 0.92; transform: translateY(-1px); }
.auth-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
.auth-btn-link { text-decoration: none; padding: 13px; display: block; margin-top: 0; }

.auth-footer {
  text-align: center; font-size: 13px; color: #6b7280; margin-top: 20px; margin-bottom: 0;
}
.auth-footer a { color: var(--ace-gold); text-decoration: none; font-weight: 600; }
.auth-footer a:hover { text-decoration: underline; }
</style>
