<script setup>
definePageMeta({ middleware: "auth" });

import { ref } from "vue";
import { useApi } from "@/composables/useApi";

const loading       = ref(false);
const error         = ref(null);
const casinoFormRef = ref(null);

const DRAFT_KEY = "casino_draft_create";

const handleSubmit = async ({ slug, country, data }) => {
  if (!slug || !country || !data.casino.name) {
    error.value = "Slug, country and casino name are required.";
    return;
  }
  loading.value = true;
  error.value   = null;
  try {
    await useApi("/casinos", "POST", { slug, country, data });
    casinoFormRef.value?.clearDraft();   // clear draft on success
    navigateTo("/casinos");
  } catch (e) {
    error.value = e?.data?.message || "Failed to create casino";
  } finally {
    loading.value = false;
  }
};

const logout = () => {
  localStorage.removeItem("token");
  navigateTo("/login");
};
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
        <NuxtLink to="/casinos" class="admin-nav-link active">Casinos</NuxtLink>
        <button class="admin-logout" @click="logout">Logout</button>
      </nav>
    </header>

    <main class="admin-main admin-main-wide">
      <div class="admin-breadcrumb">
        <NuxtLink to="/casinos">← Back to Casinos</NuxtLink>
      </div>
      <h1 class="admin-title">Create New Casino</h1>

      <div v-if="error" class="admin-error">{{ error }}</div>

      <div class="admin-card">
        <CasinoForm
          ref="casinoFormRef"
          :draft-key="DRAFT_KEY"
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
