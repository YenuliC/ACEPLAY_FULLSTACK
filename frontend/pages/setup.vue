<script setup>
definePageMeta({ middleware: "auth" });

import { ref, watch } from "vue";
import { useApi } from "@/composables/useApi";

// ── wizard step: 1 = change password, 2 = setup 2FA ──────────────────────
const step = ref(1);

// ── Step 1: Change Password ───────────────────────────────────────────────
const currentPwd  = ref("");
const newPwd      = ref("");
const confirmPwd  = ref("");
const pwdLoading  = ref(false);
const pwdError    = ref(null);
const pwdSuccess  = ref(false);

const submitPassword = async () => {
  pwdError.value = null;

  if (!currentPwd.value || !newPwd.value || !confirmPwd.value) {
    pwdError.value = "All fields are required"; return;
  }
  if (newPwd.value.length < 8) {
    pwdError.value = "New password must be at least 8 characters"; return;
  }
  if (newPwd.value !== confirmPwd.value) {
    pwdError.value = "Passwords do not match"; return;
  }

  pwdLoading.value = true;
  try {
    await useApi("/auth/change-password", "POST", {
      currentPassword: currentPwd.value,
      newPassword:     newPwd.value
    });
    pwdSuccess.value = true;
    setTimeout(() => { step.value = 2; }, 800);
  } catch (e) {
    pwdError.value = e?.data?.message || "Failed to update password";
  } finally {
    pwdLoading.value = false;
  }
};

// ── Step 2: Setup 2FA ─────────────────────────────────────────────────────
const qrUrl         = ref(null);
const secret2fa     = ref(null);
const otpCode       = ref("");
const qrLoading     = ref(false);
const qrError       = ref(null);
const otpLoading    = ref(false);
const otpError      = ref(null);
const setupComplete = ref(false);

const loadQR = async () => {
  qrLoading.value = true;
  qrError.value   = null;
  try {
    const res    = await useApi("/auth/enable-2fa", "POST");
    qrUrl.value  = res.qr;
    secret2fa.value = res.secret;
  } catch (e) {
    qrError.value = e?.data?.message || "Failed to generate QR code";
  } finally {
    qrLoading.value = false;
  }
};

const verifyOtp = async () => {
  otpError.value = null;

  if (!otpCode.value || otpCode.value.length !== 6) {
    otpError.value = "Please enter the 6-digit code"; return;
  }

  otpLoading.value = true;
  try {
    await useApi("/auth/verify-2fa-setup", "POST", { token: otpCode.value });
    // Mark setup complete in localStorage
    localStorage.setItem("isFirstLogin", "false");
    setupComplete.value = true;
    setTimeout(() => navigateTo("/dashboard"), 1500);
  } catch (e) {
    otpError.value = e?.data?.message || "Invalid code. Try again.";
  } finally {
    otpLoading.value = false;
  }
};

// Auto-load QR when step 2 becomes active (watch is reliable on plain elements)
watch(step, (newStep) => {
  if (newStep === 2 && !qrUrl.value) loadQR();
});
</script>

<template>
  <div class="setup-page">
    <div class="setup-card">
      <!-- Brand -->
      <div class="setup-brand">
        <span class="brand-icon">♠</span>
        <span class="brand-text">ACEPlay <em>Admin</em></span>
      </div>

      <!-- Progress indicator -->
      <div class="setup-steps">
        <div :class="['setup-step', { active: step === 1, done: step > 1 }]">
          <span class="step-num">{{ step > 1 ? '✓' : '1' }}</span>
          <span class="step-lbl">Change Password</span>
        </div>
        <div class="step-connector"></div>
        <div :class="['setup-step', { active: step === 2, done: setupComplete }]">
          <span class="step-num">{{ setupComplete ? '✓' : '2' }}</span>
          <span class="step-lbl">Setup 2FA</span>
        </div>
      </div>

      <!-- ══ STEP 1: Change Password ══════════════════════════════ -->
      <div v-if="step === 1" class="setup-section">
        <h2 class="setup-title">Set Your Password</h2>
        <p class="setup-sub">Create a new password to replace the temporary one provided by your administrator.</p>

        <div v-if="pwdSuccess" class="setup-success-mini">Password updated. Moving to 2FA setup…</div>

        <template v-else>
          <div v-if="pwdError" class="setup-error">{{ pwdError }}</div>

          <div class="setup-form">
            <div class="setup-field">
              <label>Temporary Password</label>
              <input v-model="currentPwd" type="password" placeholder="Enter your temporary password" />
            </div>
            <div class="setup-field">
              <label>New Password</label>
              <input v-model="newPwd" type="password" placeholder="At least 8 characters" @keyup.enter="submitPassword" />
            </div>
            <div class="setup-field">
              <label>Confirm New Password</label>
              <input v-model="confirmPwd" type="password" placeholder="Repeat new password" @keyup.enter="submitPassword" />
            </div>
            <button class="setup-btn" :disabled="pwdLoading" @click="submitPassword">
              {{ pwdLoading ? "Saving…" : "Continue →" }}
            </button>
          </div>
        </template>
      </div>

      <!-- ══ STEP 2: Setup 2FA ════════════════════════════════════ -->
      <div v-if="step === 2" class="setup-section">
        <h2 class="setup-title">Setup Two-Factor Authentication</h2>
        <p class="setup-sub">Scan the QR code with Google Authenticator, then enter the 6-digit code to activate 2FA on your account.</p>

        <div v-if="setupComplete" class="setup-complete">
          <div class="setup-complete-icon">✓</div>
          <p>Account setup complete! Redirecting to dashboard…</p>
        </div>

        <template v-else>
          <div v-if="qrLoading" class="admin-state">Generating QR code…</div>
          <div v-else-if="qrError" class="setup-error">
            {{ qrError }}
            <button class="retry-btn" @click="loadQR">Retry</button>
          </div>

          <template v-else-if="qrUrl">
            <div class="qr-wrap">
              <img :src="qrUrl" alt="QR Code" class="qr-img" />
            </div>

            <div v-if="secret2fa" class="secret-wrap">
              <p class="secret-label">Can't scan? Enter this key manually:</p>
              <code class="secret-code">{{ secret2fa }}</code>
            </div>

            <div v-if="otpError" class="setup-error">{{ otpError }}</div>

            <div class="setup-form">
              <div class="setup-field">
                <label>6-Digit Verification Code</label>
                <input
                  v-model="otpCode"
                  type="text"
                  inputmode="numeric"
                  maxlength="6"
                  placeholder="Enter code from app"
                  class="otp-input"
                  @keyup.enter="verifyOtp"
                />
              </div>
              <button class="setup-btn" :disabled="otpLoading" @click="verifyOtp">
                {{ otpLoading ? "Verifying…" : "Activate & Go to Dashboard" }}
              </button>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.setup-page {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  background: var(--ace-bg-dark); font-family: var(--ace-font); padding: 20px;
}
.setup-card {
  background: #12151c; border-radius: 16px; padding: 40px 36px;
  width: 100%; max-width: 460px; box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  border: 1px solid #2a3142; border-top: 4px solid var(--ace-gold);
}

.setup-brand { display: flex; align-items: center; gap: 10px; justify-content: center; margin-bottom: 28px; }
.brand-icon  { font-size: 28px; color: var(--ace-gold); }
.brand-text  { font-size: 20px; font-weight: 800; color: #e8eaed; letter-spacing: -0.02em; }
.brand-text em { color: var(--ace-gold); font-style: normal; }

/* Step indicators */
.setup-steps {
  display: flex; align-items: center; justify-content: center;
  gap: 0; margin-bottom: 28px;
}
.setup-step {
  display: flex; align-items: center; gap: 8px;
  font-size: 12px; font-weight: 600; color: #6b7280;
}
.setup-step.active { color: var(--ace-gold); }
.setup-step.done   { color: #4ade80; }
.step-num {
  width: 26px; height: 26px; border-radius: 50%;
  background: #2a3142; color: #6b7280;
  font-size: 11px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: all 0.3s;
}
.setup-step.active .step-num { background: var(--ace-gradient); color: var(--ace-black); }
.setup-step.done   .step-num { background: rgba(34,197,94,0.2); color: #4ade80; }
.step-connector {
  flex: 1; height: 1px; background: #2a3142;
  margin: 0 12px; min-width: 40px;
}

.setup-section {}
.setup-title { font-size: 20px; font-weight: 800; color: #e8eaed; margin: 0 0 8px; }
.setup-sub   { color: #9aa0ab; font-size: 13px; margin: 0 0 20px; line-height: 1.6; }

.setup-error {
  background: rgba(220,38,38,0.12); color: #fca5a5;
  border: 1px solid rgba(220,38,38,0.3);
  border-radius: 8px; padding: 10px 14px; margin-bottom: 14px; font-size: 13px;
  display: flex; align-items: center; justify-content: space-between;
}
.setup-success-mini {
  background: rgba(34,197,94,0.12); color: #4ade80;
  border: 1px solid rgba(34,197,94,0.3);
  border-radius: 8px; padding: 10px 14px; font-size: 13px; text-align: center;
}

.setup-form  { display: flex; flex-direction: column; gap: 14px; }
.setup-field { display: flex; flex-direction: column; gap: 5px; }
.setup-field label {
  font-size: 11px; font-weight: 700; color: #9aa0ab;
  text-transform: uppercase; letter-spacing: 0.6px;
}
.setup-field input {
  padding: 11px 14px; border: 1px solid #2a3142; border-radius: 8px;
  font-size: 14px; outline: none; transition: all 0.2s;
  background: #1a1f2e; color: #e8eaed;
}
.setup-field input::placeholder { color: #6b7280; }
.setup-field input:focus {
  border-color: var(--ace-gold);
  box-shadow: 0 0 0 3px rgba(246,176,33,0.12);
}
.otp-input { letter-spacing: 4px; text-align: center; font-weight: 600; }

.setup-btn {
  padding: 13px; background: var(--ace-gradient); color: var(--ace-black);
  border: none; border-radius: 10px; font-size: 14px; font-weight: 800;
  cursor: pointer; transition: opacity 0.2s, transform 0.15s;
  box-shadow: 0 4px 14px rgba(246,176,33,0.35);
}
.setup-btn:hover    { opacity: 0.92; transform: translateY(-1px); }
.setup-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.qr-wrap { display: flex; justify-content: center; margin: 20px 0; }
.qr-img  {
  width: 220px; height: 220px;
  background: #ffffff; padding: 12px;
  border: none; border-radius: 0;
  display: block;
}

.secret-wrap { text-align: center; margin-bottom: 16px; }
.secret-label { font-size: 12px; color: #9aa0ab; margin: 0 0 6px; }
.secret-code {
  display: inline-block; padding: 6px 14px; background: #1a1f2e;
  border: 1px solid #2a3142; border-radius: 6px;
  font-size: 13px; letter-spacing: 2px; color: var(--ace-gold); font-family: monospace;
}

.retry-btn {
  background: none; border: none; color: #fca5a5; text-decoration: underline;
  cursor: pointer; font-size: 13px;
}

.setup-complete { text-align: center; padding: 30px 0; }
.setup-complete-icon {
  width: 60px; height: 60px; border-radius: 50%;
  background: rgba(34,197,94,0.15); color: #4ade80;
  font-size: 28px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px;
}
.setup-complete p { color: #9aa0ab; font-size: 14px; }
</style>
