<script setup>
definePageMeta({ middleware: "auth" });

import { ref, onMounted } from "vue";
import { useApi } from "@/composables/useApi";

const owners  = ref([]);
const loading = ref(true);
const error   = ref(null);

// ── Create Owner ──────────────────────────────────────────────────────────
const showCreateForm  = ref(false);
const formName        = ref("");
const formEmail       = ref("");
const formPassword    = ref("");
const formError       = ref(null);
const formLoading     = ref(false);
const formSuccess     = ref(null);

// ── Reset Password ────────────────────────────────────────────────────────
const resetTarget    = ref(null);   // owner being reset
const resetPassword  = ref("");
const resetError     = ref(null);
const resetLoading   = ref(false);
const resetSuccess   = ref(null);

const loadOwners = async () => {
  loading.value = true;
  error.value   = null;
  try {
    owners.value = await useApi("/admin/owners");
  } catch (e) {
    error.value = e?.data?.message || "Failed to load owners";
  } finally {
    loading.value = false;
  }
};

const openCreateForm = () => {
  showCreateForm.value = true;
  formName.value = formEmail.value = formPassword.value = "";
  formError.value = formSuccess.value = null;
};

const createOwner = async () => {
  formError.value   = null;
  formSuccess.value = null;

  if (!formName.value || !formEmail.value || !formPassword.value) {
    formError.value = "All fields are required"; return;
  }
  if (formPassword.value.length < 6) {
    formError.value = "Password must be at least 6 characters"; return;
  }

  formLoading.value = true;
  try {
    const res = await useApi("/admin/owners", "POST", {
      name:     formName.value.trim(),
      email:    formEmail.value.trim(),
      password: formPassword.value
    });
    formSuccess.value = `Owner account created for ${res.user.email}`;
    owners.value.unshift(res.user);
    formName.value = formEmail.value = formPassword.value = "";
  } catch (e) {
    formError.value = e?.data?.message || "Failed to create owner";
  } finally {
    formLoading.value = false;
  }
};

const openReset = (owner) => {
  resetTarget.value  = owner;
  resetPassword.value = "";
  resetError.value   = null;
  resetSuccess.value = null;
};

const closeReset = () => { resetTarget.value = null; };

const submitReset = async () => {
  resetError.value   = null;
  resetSuccess.value = null;

  if (!resetPassword.value || resetPassword.value.length < 6) {
    resetError.value = "New password must be at least 6 characters"; return;
  }

  resetLoading.value = true;
  try {
    const res = await useApi(`/admin/owners/${resetTarget.value._id || resetTarget.value.id}/reset-password`, "PUT", {
      newPassword: resetPassword.value
    });
    resetSuccess.value = res.message;
    // Update owner status in list — they'll need to redo setup
    const idx = owners.value.findIndex(o => (o._id || o.id) === (resetTarget.value._id || resetTarget.value.id));
    if (idx !== -1) owners.value[idx] = { ...owners.value[idx], isFirstLogin: true };
    resetPassword.value = "";
    setTimeout(closeReset, 2500);
  } catch (e) {
    resetError.value = e?.data?.message || "Failed to reset password";
  } finally {
    resetLoading.value = false;
  }
};

const logout = () => {
  ["token","userRole","userEmail","isFirstLogin"].forEach(k => localStorage.removeItem(k));
  navigateTo("/login");
};

const fmtDate    = (d) => d ? new Date(d).toLocaleDateString() : "-";
const setupLabel = (o) => o.isFirstLogin ? "Pending Setup" : "Active";
const setupClass = (o) => o.isFirstLogin ? "badge-pending" : "badge-active";

onMounted(() => {
  if (localStorage.getItem("userRole") !== "superadmin") return navigateTo("/dashboard");
  loadOwners();
});
</script>

<template>
  <div class="admin-shell page">
    <header class="admin-header">
      <div class="admin-logo">
        <span class="admin-logo-icon">♠</span>
        <span class="admin-logo-text">ACEPlay <em>Admin</em></span>
      </div>
      <nav class="admin-nav">
        <NuxtLink to="/dashboard" class="admin-nav-link">Dashboard</NuxtLink>
        <NuxtLink to="/casinos"   class="admin-nav-link">Casinos</NuxtLink>
        <NuxtLink to="/users"     class="admin-nav-link nav-highlight active">Create User</NuxtLink>
        <NuxtLink to="/logs"      class="admin-nav-link">Logs</NuxtLink>
        <button class="admin-logout" @click="logout">Logout</button>
      </nav>
    </header>

    <main class="admin-main">
      <div class="toolbar">
        <div>
          <div class="role-badge role-superadmin">Super Admin</div>
          <h1 class="admin-title" style="margin:0">User Management</h1>
          <p class="toolbar-sub">{{ owners.length }} owner account{{ owners.length !== 1 ? 's' : '' }}</p>
        </div>
        <button class="admin-btn-primary" @click="openCreateForm">+ Create Owner</button>
      </div>

      <!-- Create Owner Panel -->
      <div v-if="showCreateForm" class="panel-card">
        <div class="panel-header">
          <h3>New Owner Account</h3>
          <button class="close-btn" @click="showCreateForm = false">✕</button>
        </div>

        <div v-if="formSuccess" class="msg-success">{{ formSuccess }}</div>
        <div v-if="formError"   class="msg-error">{{ formError }}</div>

        <div class="form-grid">
          <div class="form-field">
            <label>Full Name</label>
            <input v-model="formName" type="text" placeholder="Owner's full name" />
          </div>
          <div class="form-field">
            <label>Email Address</label>
            <input v-model="formEmail" type="email" placeholder="owner@example.com" />
          </div>
          <div class="form-field">
            <label>Temporary Password</label>
            <input v-model="formPassword" type="password" placeholder="Min. 6 characters" />
          </div>
          <div class="form-field">
            <label>Role</label>
            <div class="role-static">Owner</div>
          </div>
        </div>

        <p class="panel-note">The owner will be required to change their password and set up 2FA on first login.</p>

        <div class="form-actions">
          <button class="admin-btn-primary" :disabled="formLoading" @click="createOwner">
            {{ formLoading ? "Creating…" : "Create Owner Account" }}
          </button>
          <button class="btn-cancel" @click="showCreateForm = false">Cancel</button>
        </div>
      </div>

      <!-- Owners Table -->
      <div v-if="loading" class="admin-state">Loading…</div>
      <div v-else-if="error" class="admin-state admin-state-error">{{ error }}</div>
      <div v-else-if="owners.length === 0" class="admin-state">
        No owner accounts yet. Create the first one using the button above.
      </div>

      <div v-else class="table-wrap">
        <table class="owners-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="o in owners" :key="o._id || o.id">
              <td class="td-name">{{ o.name || '—' }}</td>
              <td>{{ o.email }}</td>
              <td><span :class="['status-chip', setupClass(o)]">{{ setupLabel(o) }}</span></td>
              <td class="td-date">{{ fmtDate(o.createdAt) }}</td>
              <td>
                <button class="btn-reset" @click="openReset(o)">Reset Password</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <!-- Reset Password Modal -->
    <div v-if="resetTarget" class="modal-backdrop" @click.self="closeReset">
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <h3>Reset Password</h3>
            <p class="modal-sub">{{ resetTarget.name || resetTarget.email }}</p>
          </div>
          <button class="close-btn" @click="closeReset">✕</button>
        </div>

        <div v-if="resetSuccess" class="msg-success">{{ resetSuccess }}</div>

        <template v-else>
          <div v-if="resetError" class="msg-error">{{ resetError }}</div>

          <div class="modal-info">
            After reset, the owner must log in with this temporary password and complete the account setup (new password + 2FA).
          </div>

          <div class="form-field" style="margin-bottom:16px">
            <label>New Temporary Password</label>
            <input
              v-model="resetPassword"
              type="password"
              placeholder="Min. 6 characters"
              @keyup.enter="submitReset"
            />
          </div>

          <div class="form-actions">
            <button class="btn-danger" :disabled="resetLoading" @click="submitReset">
              {{ resetLoading ? "Resetting…" : "Reset Password" }}
            </button>
            <button class="btn-cancel" @click="closeReset">Cancel</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; }
.toolbar { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.toolbar-sub { font-size: 12px; color: var(--ace-text-muted); margin: 4px 0 0; }

.nav-highlight { color: var(--ace-gold) !important; font-weight: 700; }

.role-badge { display: inline-block; padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px; }
.role-superadmin { background: rgba(139,92,246,0.15); color: #a78bfa; border: 1px solid rgba(139,92,246,0.3); }

/* Shared panel */
.panel-card {
  background: var(--ace-bg-card); border: 1px solid var(--ace-border);
  border-radius: var(--ace-radius); padding: 24px; margin-bottom: 24px;
}
.panel-header {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px;
}
.panel-header h3 { font-size: 16px; font-weight: 700; color: var(--ace-text); margin: 0; }

.close-btn {
  background: none; border: none; color: var(--ace-text-muted);
  font-size: 16px; cursor: pointer; padding: 4px 8px; border-radius: 4px;
}
.close-btn:hover { color: var(--ace-text); }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
@media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }

.form-field { display: flex; flex-direction: column; gap: 5px; }
.form-field label {
  font-size: 11px; font-weight: 700; color: var(--ace-text-muted);
  text-transform: uppercase; letter-spacing: 0.5px;
}
.form-field input {
  padding: 10px 12px; border: 1px solid var(--ace-border); border-radius: 7px;
  background: var(--ace-bg-input); color: var(--ace-text);
  font-size: 14px; outline: none; transition: border-color 0.2s;
}
.form-field input:focus { border-color: var(--ace-gold); }
.role-static {
  padding: 10px 12px; border: 1px solid var(--ace-border); border-radius: 7px;
  background: var(--ace-bg-input); color: var(--ace-text-muted); font-size: 14px;
}

.panel-note {
  font-size: 12px; color: var(--ace-text-muted);
  background: rgba(246,176,33,0.06); border: 1px solid rgba(246,176,33,0.15);
  border-radius: 6px; padding: 10px 12px; margin-bottom: 16px;
}

.form-actions { display: flex; gap: 10px; }
.btn-cancel {
  padding: 10px 20px; background: transparent; border: 1px solid var(--ace-border);
  border-radius: 8px; color: var(--ace-text-muted); font-size: 13px;
  font-weight: 600; cursor: pointer; transition: all 0.2s;
}
.btn-cancel:hover { border-color: rgba(220,38,38,0.4); color: #fca5a5; }

.btn-danger {
  padding: 10px 20px; background: rgba(220,38,38,0.15); border: 1px solid rgba(220,38,38,0.4);
  border-radius: 8px; color: #fca5a5; font-size: 13px; font-weight: 700;
  cursor: pointer; transition: all 0.2s;
}
.btn-danger:hover { background: rgba(220,38,38,0.25); }
.btn-danger:disabled { opacity: 0.5; cursor: not-allowed; }

.msg-success {
  background: rgba(34,197,94,0.1); color: #4ade80;
  border: 1px solid rgba(34,197,94,0.3);
  border-radius: 8px; padding: 10px 14px; margin-bottom: 14px; font-size: 13px;
}
.msg-error {
  background: rgba(220,38,38,0.1); color: #fca5a5;
  border: 1px solid rgba(220,38,38,0.3);
  border-radius: 8px; padding: 10px 14px; margin-bottom: 14px; font-size: 13px;
}

/* Table */
.table-wrap { overflow-x: auto; border-radius: var(--ace-radius); border: 1px solid var(--ace-border); }
.owners-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.owners-table th {
  padding: 12px 16px; text-align: left; background: var(--ace-bg-input);
  color: var(--ace-text-muted); font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.4px;
  border-bottom: 1px solid var(--ace-border);
}
.owners-table td {
  padding: 13px 16px; border-bottom: 1px solid rgba(255,255,255,0.04);
  color: var(--ace-text); vertical-align: middle;
}
.owners-table tr:last-child td { border-bottom: none; }
.owners-table tr:hover td { background: rgba(255,255,255,0.02); }
.td-name { font-weight: 600; }
.td-date { color: var(--ace-text-muted); font-size: 12px; }

.status-chip { padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.badge-active  { background: rgba(34,197,94,0.12); color: #4ade80; }
.badge-pending { background: rgba(251,191,36,0.12); color: #fbbf24; }

.btn-reset {
  padding: 5px 14px; background: rgba(246,176,33,0.1); border: 1px solid rgba(246,176,33,0.3);
  border-radius: 6px; color: var(--ace-gold); font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.btn-reset:hover { background: rgba(246,176,33,0.2); }

/* Modal */
.modal-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,0.7);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 20px;
}
.modal-card {
  background: #12151c; border: 1px solid #2a3142; border-top: 3px solid var(--ace-gold);
  border-radius: 14px; padding: 28px; width: 100%; max-width: 440px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
}
.modal-header {
  display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px;
}
.modal-header h3 { font-size: 17px; font-weight: 700; color: var(--ace-text); margin: 0 0 3px; }
.modal-sub { font-size: 13px; color: var(--ace-text-muted); margin: 0; }
.modal-info {
  font-size: 12px; color: var(--ace-text-muted); line-height: 1.6;
  background: rgba(246,176,33,0.06); border: 1px solid rgba(246,176,33,0.15);
  border-radius: 6px; padding: 10px 12px; margin-bottom: 16px;
}
</style>
