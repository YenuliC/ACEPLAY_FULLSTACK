<script setup>
definePageMeta({ middleware: "auth" });

import { ref, onMounted } from "vue";
import { useApi } from "@/composables/useApi";

const role    = ref("");
const loading = ref(true);
const error   = ref(null);

// Owner
const casinos = ref([]);

// Superadmin
const stats      = ref(null);
const recentLogs = ref([]);

const loadOwnerData = async () => {
  casinos.value = await useApi("/casinos");
};

const loadSuperAdminData = async () => {
  const res        = await useApi("/admin/stats");
  stats.value      = res;
  recentLogs.value = res.recentLogs || [];
};

const deleteCasino = async (id) => {
  if (!confirm("Delete this casino? This cannot be undone.")) return;
  try {
    await useApi(`/casinos/${id}`, "DELETE");
    casinos.value = casinos.value.filter(c => c._id !== id);
  } catch (e) {
    alert(e?.data?.message || "Delete failed");
  }
};

const logout = () => {
  ["token","userRole","userEmail","userName","isFirstLogin"].forEach(k => localStorage.removeItem(k));
  navigateTo("/login");
};

const fmtDate    = (d) => d ? new Date(d).toLocaleDateString() : "-";
const actionClass = (a) => ({ CREATE: "action-CREATE", UPDATE: "action-UPDATE", DELETE: "action-DELETE" }[a] || "");

onMounted(async () => {
  role.value = localStorage.getItem("userRole") || "owner";
  try {
    if (role.value === "superadmin") await loadSuperAdminData();
    else                             await loadOwnerData();
  } catch (e) {
    error.value = e?.data?.message || "Failed to load data";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="admin-shell dash">
    <header class="admin-header">
      <div class="admin-logo">
        <span class="admin-logo-icon">♠</span>
        <span class="admin-logo-text">ACEPlay <em>Admin</em></span>
      </div>
      <nav class="admin-nav">
        <NuxtLink to="/dashboard" class="admin-nav-link active">Dashboard</NuxtLink>
        <NuxtLink to="/casinos"   class="admin-nav-link">Casinos</NuxtLink>
        <template v-if="role === 'superadmin'">
          <NuxtLink to="/users" class="admin-nav-link" style="color:var(--ace-gold);font-weight:700">Create User</NuxtLink>
          <NuxtLink to="/logs"  class="admin-nav-link">Logs</NuxtLink>
        </template>
        <button class="admin-logout" @click="logout">Logout</button>
      </nav>
    </header>

    <main class="admin-main">
      <div v-if="loading" class="admin-state">Loading…</div>
      <div v-else-if="error" class="admin-state admin-state-error">{{ error }}</div>

      <!-- ══ SUPER ADMIN ══════════════════════════════════════════ -->
      <template v-else-if="role === 'superadmin'">
        <div class="role-badge role-superadmin">Super Admin</div>
        <h1 class="admin-title" style="margin-bottom:20px">Dashboard</h1>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-num">{{ stats?.totalOwners ?? 0 }}</div>
            <div class="stat-label">Total Owners</div>
          </div>
          <div class="stat-card">
            <div class="stat-num">{{ stats?.totalCasinos ?? 0 }}</div>
            <div class="stat-label">Total Casinos</div>
          </div>
          <div class="stat-card">
            <div class="stat-num">{{ stats?.totalLogs ?? 0 }}</div>
            <div class="stat-label">Total Log Entries</div>
          </div>
          <NuxtLink to="/logs" class="stat-card stat-action">
            <div class="stat-num">→</div>
            <div class="stat-label">View Logs</div>
          </NuxtLink>
        </div>

        <div class="section-header" style="margin-top:8px">
          <h2>Recent Activity</h2>
          <NuxtLink to="/logs" class="admin-btn-primary">View All →</NuxtLink>
        </div>

        <div v-if="recentLogs.length === 0" class="admin-state">No recent activity</div>
        <div v-else class="log-table-wrap">
          <table class="log-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>Casino</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in recentLogs" :key="log._id">
                <td class="td-date">{{ fmtDate(log.timestamp) }}</td>
                <td>{{ log.userId?.email || log.operatorName || '-' }}</td>
                <td>{{ log.targetId?.slug || '-' }}</td>
                <td><span :class="['action-badge', actionClass(log.action)]">{{ log.action }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- ══ OWNER ════════════════════════════════════════════════ -->
      <template v-else>
        <div class="role-badge role-owner">Owner</div>

        <div class="owner-stats">
          <div class="stat-card">
            <div class="stat-num">{{ casinos.length }}</div>
            <div class="stat-label">My Casinos</div>
          </div>
          <NuxtLink to="/casinos/create" class="stat-card stat-action">
            <div class="stat-num">+</div>
            <div class="stat-label">New Casino</div>
          </NuxtLink>
        </div>

        <div class="section-header">
          <h2>Your Casinos</h2>
          <NuxtLink to="/casinos/create" class="admin-btn-primary">+ Create Casino</NuxtLink>
        </div>

        <div v-if="casinos.length === 0" class="admin-state">
          No casinos yet. <NuxtLink to="/casinos/create">Create your first one →</NuxtLink>
        </div>
        <div v-else class="casino-grid">
          <CasinoCard
            v-for="c in casinos"
            :key="c._id"
            :casino="c"
            :is-super-admin="false"
            @delete="deleteCasino"
          />
        </div>
      </template>
    </main>
  </div>
</template>

<style scoped>
.dash { min-height: 100vh; }

.role-badge { display: inline-block; padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px; }
.role-superadmin { background: rgba(139,92,246,0.15); color: #a78bfa; border: 1px solid rgba(139,92,246,0.3); }
.role-owner      { background: rgba(246,176,33,0.12);  color: var(--ace-gold); border: 1px solid rgba(246,176,33,0.3); }

.stats-grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 16px; margin-bottom: 28px;
}
@media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }

.owner-stats {
  display: grid; grid-template-columns: 200px 200px;
  gap: 16px; margin-bottom: 28px;
}
@media (max-width: 480px) { .owner-stats { grid-template-columns: 1fr 1fr; } }

.stat-card {
  background: var(--ace-bg-card); border-radius: var(--ace-radius);
  padding: 22px; text-align: center; border: 1px solid var(--ace-border);
  transition: border-color 0.2s; text-decoration: none; display: block;
}
.stat-card:hover   { border-color: rgba(246,176,33,0.4); }
.stat-action       { background: var(--ace-gradient); border-color: transparent; }
.stat-action:hover { opacity: 0.95; box-shadow: 0 6px 20px rgba(246,176,33,0.25); }
.stat-action .stat-num, .stat-action .stat-label { color: var(--ace-black); }
.stat-num   { font-size: 32px; font-weight: 700; color: var(--ace-text); }
.stat-label { font-size: 11px; color: var(--ace-text-muted); font-weight: 600; text-transform: uppercase; margin-top: 6px; letter-spacing: 0.4px; }

.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 12px; }
.section-header h2 { font-size: 18px; font-weight: 700; color: var(--ace-text); margin: 0; }
.casino-grid { display: flex; flex-direction: column; gap: 12px; }

.log-table-wrap { overflow-x: auto; border-radius: var(--ace-radius); border: 1px solid var(--ace-border); }
.log-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.log-table th { padding: 12px 16px; text-align: left; background: var(--ace-bg-input); color: var(--ace-text-muted); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; border-bottom: 1px solid var(--ace-border); }
.log-table td { padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.04); color: var(--ace-text); vertical-align: middle; }
.log-table tr:last-child td { border-bottom: none; }
.log-table tr:hover td { background: rgba(255,255,255,0.02); }
.td-date { white-space: nowrap; color: var(--ace-text-muted); font-size: 12px; }

.action-badge { padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }
.action-CREATE { background: rgba(34,197,94,0.12);  color: #4ade80; }
.action-UPDATE { background: rgba(246,176,33,0.12); color: var(--ace-gold); }
.action-DELETE { background: rgba(220,38,38,0.12);  color: #fca5a5; }
</style>
