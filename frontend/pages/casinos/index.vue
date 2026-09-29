<script setup>
definePageMeta({ middleware: "auth" });

import { ref, onMounted, computed } from "vue";
import { useApi } from "@/composables/useApi";

const casinos  = ref([]);
const loading  = ref(true);
const error    = ref(null);
const role     = ref("");

const isSuperAdmin = computed(() => role.value === "superadmin");

const load = async () => {
  loading.value = true;
  error.value   = null;
  try {
    casinos.value = await useApi("/casinos");
  } catch (e) {
    error.value = e?.data?.message || "Failed to load casinos";
  } finally {
    loading.value = false;
  }
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
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userEmail");
  navigateTo("/login");
};

onMounted(() => {
  role.value = localStorage.getItem("userRole") || "owner";
  load();
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
        <NuxtLink to="/casinos"   class="admin-nav-link active">Casinos</NuxtLink>
        <template v-if="isSuperAdmin">
          <NuxtLink to="/users" class="admin-nav-link" style="color:var(--ace-gold);font-weight:700">Create User</NuxtLink>
          <NuxtLink to="/logs"  class="admin-nav-link">Logs</NuxtLink>
        </template>
        <button class="admin-logout" @click="logout">Logout</button>
      </nav>
    </header>

    <main class="admin-main">
      <div class="toolbar">
        <div>
          <h1 class="admin-title" style="margin:0">
            {{ isSuperAdmin ? 'All Casinos' : 'Manage Casinos' }}
          </h1>
          <p v-if="!loading" class="toolbar-sub">
            {{ casinos.length }} casino{{ casinos.length !== 1 ? 's' : '' }}
          </p>
        </div>
        <NuxtLink to="/casinos/create" class="admin-btn-primary">+ New Casino</NuxtLink>
      </div>

      <div v-if="loading" class="admin-state">Loading…</div>
      <div v-else-if="error" class="admin-state admin-state-error">{{ error }}</div>
      <div v-else-if="casinos.length === 0" class="admin-state">
        No casinos found. <NuxtLink to="/casinos/create">Create the first one →</NuxtLink>
      </div>

      <div v-else class="casino-list">
        <CasinoCard
          v-for="c in casinos"
          :key="c._id"
          :casino="c"
          :is-super-admin="isSuperAdmin"
          @delete="deleteCasino"
        />
      </div>
    </main>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; }
.toolbar { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.toolbar-sub { font-size: 12px; color: var(--ace-text-muted); margin: 4px 0 0; }
.casino-list { display: flex; flex-direction: column; gap: 12px; }
</style>
