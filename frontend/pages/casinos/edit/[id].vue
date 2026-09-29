<script setup>
definePageMeta({ middleware: "auth" });

import { ref, onMounted, computed } from "vue";
import { useApi } from "@/composables/useApi";

const route         = useRoute();
const loading       = ref(false);
const fetching      = ref(true);
const error         = ref(null);
const casino        = ref(null);
const role          = ref("");
const casinoFormRef = ref(null);

const isSuperAdmin = computed(() => role.value === "superadmin");

const loadCasino = async () => {
  fetching.value = true;
  error.value    = null;
  try {
    casino.value = await useApi(`/casinos/${route.params.id}`);
  } catch (e) {
    error.value = e?.data?.message || "Failed to load casino";
  } finally {
    fetching.value = false;
  }
};

const handleSubmit = async ({ slug, country, data }) => {
  if (!data.casino.name) {
    error.value = "Casino name is required.";
    return;
  }
  loading.value = true;
  error.value   = null;
  try {
    await useApi(`/casinos/${route.params.id}`, "PUT", { slug, country, data });
    casinoFormRef.value?.clearDraft();   // clear draft on success
    navigateTo("/casinos");
  } catch (e) {
    error.value = e?.data?.message || "Failed to update casino";
  } finally {
    loading.value = false;
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
  loadCasino();
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

    <main class="admin-main admin-main-wide">
      <div class="admin-breadcrumb">
        <NuxtLink to="/casinos">← Back to Casinos</NuxtLink>
      </div>
      <h1 class="admin-title">
        Edit Casino
        <span v-if="casino">— {{ casino.data?.casino?.name || casino.slug }}</span>
      </h1>

      <div v-if="error" class="admin-error">{{ error }}</div>

      <div v-if="fetching" class="admin-state">Loading casino data…</div>

      <div v-else-if="casino" class="admin-card">
        <CasinoForm
          ref="casinoFormRef"
          :draft-key="`casino_draft_edit_${route.params.id}`"
          :initial-data="casino.data"
          :initial-slug="casino.slug"
          :initial-country="casino.country"
          :loading="loading"
          @submit="handleSubmit"
        />
      </div>
    </main>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; }
</style>
