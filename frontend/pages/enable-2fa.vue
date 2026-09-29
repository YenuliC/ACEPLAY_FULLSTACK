<script setup>
import { ref } from "vue";

definePageMeta({ middleware: "auth" });

const config  = useRuntimeConfig();

const step    = ref("idle");
const qrImg   = ref("");
const secret  = ref("");
const otp     = ref("");
const error   = ref(null);
const loading = ref(false);
const message = ref("");

const startSetup = async () => {
  error.value   = null;
  loading.value = true;
  try {
    const token = import.meta.client ? localStorage.getItem("token") : null;
    const res   = await $fetch(config.public.apiBase + "/auth/enable-2fa", {
      method:  "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    qrImg.value  = res.qr;
    secret.value = res.secret;
    step.value   = "scanning";
  } catch (e) {
    const msg = e?.data?.message || "";
    if (msg.includes("already enabled")) {
      step.value = "already";
    } else {
      error.value = msg || "Failed to generate QR code. Please try again.";
    }
  } finally {
    loading.value = false;
  }
};

const confirmOtp = async () => {
  error.value = null;
  if (!otp.value || otp.value.length !== 6) {
    error.value = "Please enter the 6-digit code shown in Google Authenticator.";
    return;
  }
  loading.value = true;
  try {
    const token = import.meta.client ? localStorage.getItem("token") : null;
    const res   = await $fetch(config.public.apiBase + "/auth/verify-2fa-setup", {
      method:  "POST",
      headers: { Authorization: `Bearer ${token}` },
      body:    { token: otp.value }
    });
    message.value = res.message;
    step.value    = "done";
  } catch (e) {
    error.value = e?.data?.message || "Invalid code. Make sure you scanned correctly and try again.";
    otp.value = "";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="auth-page">
    <div class="auth-card auth-card-wide">
      <div class="auth-top-row">
        <div class="auth-brand">
          <span class="brand-icon">♠</span>
          <span class="brand-text">ACEPlay <em>Admin</em></span>
        </div>
      </div>

      <div class="auth-icon">🔐</div>
      <h1 class="auth-title">Enable Two-Factor Authentication</h1>
      <p class="auth-sub">Secure your account with Google Authenticator</p>

      <div v-if="error" class="auth-error">{{ error }}</div>

      <template v-if="step === 'idle'">
        <div class="info-box">
          <p>After setup, every login will ask for a <strong>6-digit code</strong> from Google Authenticator.</p>
          <p class="info-note">Make sure Google Authenticator is installed on your phone before starting.</p>
        </div>
        <button class="auth-btn" :disabled="loading" @click="startSetup">
          {{ loading ? "Generating…" : "Set Up 2FA" }}
        </button>
      </template>

      <template v-else-if="step === 'scanning'">
        <div class="steps-box">
          <div class="step-item"><span class="step-num">1</span><span>Open <strong>Google Authenticator</strong> on your phone.</span></div>
          <div class="step-item"><span class="step-num">2</span><span>Tap <strong>+</strong> → <strong>Scan a QR code</strong>.</span></div>
          <div class="step-item warn"><span class="step-num warn-num">!</span><span><strong>Do not use your phone camera.</strong> Scan inside Google Authenticator only.</span></div>
          <div class="step-item"><span class="step-num">3</span><span>Scan the QR code below.</span></div>
        </div>

        <div class="qr-wrapper">
          <img :src="qrImg" alt="Scan in Google Authenticator" class="qr-img" />
        </div>

        <details class="manual-entry">
          <summary>Can't scan? Enter the key manually</summary>
          <code class="secret-code">{{ secret }}</code>
        </details>

        <div class="otp-section">
          <p class="otp-label">Enter the 6-digit code from the app:</p>
          <div class="otp-row">
            <input
              v-model="otp"
              type="text"
              inputmode="numeric"
              maxlength="6"
              placeholder="000000"
              class="otp-input"
              @keyup.enter="confirmOtp"
            />
            <button class="auth-btn auth-btn-inline" :disabled="loading || otp.length !== 6" @click="confirmOtp">
              {{ loading ? "Verifying…" : "Confirm" }}
            </button>
          </div>
        </div>
      </template>

      <template v-else-if="step === 'done'">
        <div class="success-box">
          <span class="success-icon">✔</span>
          <p class="success-title">2FA Enabled</p>
          <p>{{ message || "Your account is now protected." }}</p>
        </div>
        <NuxtLink to="/dashboard" class="auth-btn auth-btn-link">Go to Dashboard →</NuxtLink>
      </template>

      <template v-else-if="step === 'already'">
        <div class="info-banner">2FA is already active on your account.</div>
        <NuxtLink to="/dashboard" class="auth-btn auth-btn-link">Go to Dashboard →</NuxtLink>
      </template>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  background: var(--ace-bg-dark); font-family: var(--ace-font); padding: 24px 16px;
}
.auth-card {
  background: #fff; border-radius: 16px; padding: 36px 32px;
  box-shadow: var(--ace-shadow-lg); border-top: 4px solid var(--ace-gold);
}
.auth-card-wide { max-width: 520px; width: 100%; }
.auth-top-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.auth-brand { display: flex; align-items: center; gap: 8px; }
.brand-icon { font-size: 24px; color: var(--ace-gold); }
.brand-text { font-size: 18px; font-weight: 800; color: var(--ace-text); }
.brand-text em { color: var(--ace-gold); font-style: normal; }
.auth-icon { font-size: 32px; text-align: center; margin-bottom: 8px; }
.auth-title { font-size: 22px; font-weight: 800; color: var(--ace-text); text-align: center; margin: 0 0 6px; }
.auth-sub { color: var(--ace-text-muted); font-size: 14px; text-align: center; margin: 0 0 20px; }
.auth-error {
  background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca;
  border-radius: 8px; padding: 12px 14px; margin-bottom: 16px; font-size: 13px;
}
.info-box {
  background: #fafafa; border: 1px solid var(--ace-border); border-radius: 10px;
  padding: 16px; margin-bottom: 20px; font-size: 14px; color: var(--ace-text); line-height: 1.6;
}
.info-note { margin-top: 8px; color: var(--ace-text-muted); font-size: 13px; }
.steps-box {
  background: #fafafa; border: 1px solid var(--ace-border); border-radius: 10px;
  padding: 16px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 10px;
}
.step-item { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: var(--ace-text); line-height: 1.5; }
.step-num {
  flex-shrink: 0; width: 22px; height: 22px; background: var(--ace-gradient);
  color: var(--ace-black); border-radius: 50%; font-size: 11px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.step-item.warn { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 10px; }
.warn-num { background: #f59e0b; color: #fff; }
.qr-wrapper { display: flex; justify-content: center; margin: 16px 0; }
.qr-img {
  width: 220px; height: 220px;
  background: #ffffff; padding: 12px;
  border: 1px solid var(--ace-border);
  border-radius: 0;
  display: block;
}
.manual-entry { margin-bottom: 16px; }
.manual-entry summary { font-size: 13px; color: var(--ace-text-muted); cursor: pointer; padding: 6px 0; }
.secret-code {
  display: block; margin-top: 8px; background: #fafafa; border: 1px solid var(--ace-border);
  border-radius: 8px; padding: 10px; font-size: 13px; word-break: break-all; color: #b45309;
}
.otp-section { background: #fafafa; border: 1px solid var(--ace-border); border-radius: 10px; padding: 16px; }
.otp-label { font-size: 13px; color: var(--ace-text-muted); margin: 0 0 12px; }
.otp-row { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.otp-input {
  flex: 1; min-width: 120px; padding: 12px; border: 1.5px solid var(--ace-border);
  border-radius: 8px; font-size: 22px; font-weight: 700; letter-spacing: 8px;
  text-align: center; outline: none; background: #fff;
}
.otp-input:focus { border-color: var(--ace-gold); box-shadow: 0 0 0 3px rgba(246,176,33,.15); }
.auth-btn {
  width: 100%; padding: 13px; background: var(--ace-gradient); color: var(--ace-black);
  border: none; border-radius: 10px; font-size: 14px; font-weight: 600;
  cursor: pointer; transition: opacity 0.2s; box-shadow: 0 4px 14px rgba(246,176,33,.3);
}
.auth-btn-inline { width: auto; padding: 12px 20px; }
.auth-btn-link { display: block; text-align: center; text-decoration: none; margin-top: 16px; }
.auth-btn:hover { opacity: 0.92; }
.auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.success-box {
  background: #ecfdf5; border: 1px solid #86efac; border-radius: 10px;
  padding: 24px; text-align: center; color: var(--ace-text);
}
.success-icon { font-size: 32px; color: #16a34a; display: block; margin-bottom: 8px; }
.success-title { font-size: 18px; font-weight: 700; color: #15803d; margin: 0 0 8px; }
.info-banner {
  background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px;
  padding: 16px; text-align: center; font-size: 14px; color: #1d4ed8; margin-bottom: 8px;
}
</style>
