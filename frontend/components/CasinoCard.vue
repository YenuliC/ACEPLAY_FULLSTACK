<script setup>
const props = defineProps({
  casino:       { type: Object,  required: true },
  isSuperAdmin: { type: Boolean, default: false }
});

defineEmits(["delete"]);

const casinoName = (c) => c?.data?.casino?.name || c.slug;
const casinoLogo = (c) => c?.data?.casino?.url?.logo || "";
const ownerEmail = (c) => c?.ownerId?.email || c?.ownerId || null;
</script>

<template>
  <div class="cc-card">
    <div class="cc-logo-wrap">
      <img v-if="casinoLogo(casino)" :src="casinoLogo(casino)" :alt="casinoName(casino)" class="cc-logo" />
      <div v-else class="cc-logo-placeholder">{{ casinoName(casino).charAt(0) }}</div>
    </div>

    <div class="cc-info">
      <div class="cc-name">{{ casinoName(casino) }}</div>
      <div class="cc-meta">
        <span class="cc-badge cc-badge-country">{{ casino.country }}</span>
        <span class="cc-badge cc-badge-slug">{{ casino.slug }}</span>
        <span v-if="casino.data?.casino?.launchYear" class="cc-badge cc-badge-year">
          Est. {{ casino.data.casino.launchYear }}
        </span>
        <span v-if="isSuperAdmin && ownerEmail(casino)" class="cc-badge cc-badge-owner">
          Owner: {{ ownerEmail(casino) }}
        </span>
      </div>
      <div v-if="casino.data?.casino?.description" class="cc-desc">
        {{ casino.data.casino.description.slice(0, 100) }}{{ casino.data.casino.description.length > 100 ? '…' : '' }}
      </div>
    </div>

    <div class="cc-actions">
      <NuxtLink :to="`/casinos/${casino._id}`" class="cc-btn cc-btn-view">View</NuxtLink>
      <NuxtLink :to="`/casinos/edit/${casino._id}`" class="cc-btn cc-btn-edit">Edit</NuxtLink>
      <button class="cc-btn cc-btn-del" @click="$emit('delete', casino._id)">Delete</button>
    </div>
  </div>
</template>

<style scoped>
.cc-card {
  display: flex; align-items: flex-start; gap: 16px;
  background: var(--ace-bg-card); border: 1px solid var(--ace-border);
  border-radius: var(--ace-radius); padding: 16px 18px;
  transition: border-color 0.2s;
}
.cc-card:hover { border-color: rgba(246, 176, 33, 0.4); }

.cc-logo-wrap { flex-shrink: 0; }
.cc-logo {
  width: 64px; height: 64px; object-fit: contain;
  border-radius: 10px; border: 1px solid var(--ace-border); background: var(--ace-bg-input);
}
.cc-logo-placeholder {
  width: 64px; height: 64px; border-radius: 10px;
  background: var(--ace-gradient); color: var(--ace-black);
  font-size: 24px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}

.cc-info { flex: 1; min-width: 0; }
.cc-name { font-size: 16px; font-weight: 600; color: var(--ace-text); margin-bottom: 8px; }
.cc-meta { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
.cc-badge {
  padding: 3px 10px; border-radius: 20px;
  font-size: 11px; font-weight: 500; text-transform: uppercase;
}
.cc-badge-country { background: rgba(246, 176, 33, 0.12); color: var(--ace-gold); }
.cc-badge-slug    { background: var(--ace-bg-input); color: var(--ace-text-muted); }
.cc-badge-year    { background: rgba(34, 197, 94, 0.12); color: #4ade80; }
.cc-badge-owner   { background: rgba(139, 92, 246, 0.12); color: #a78bfa; text-transform: none; }
.cc-desc { font-size: 13px; color: var(--ace-text-muted); line-height: 1.5; }

.cc-actions { display: flex; flex-direction: column; gap: 8px; flex-shrink: 0; }
.cc-btn {
  padding: 8px 14px; border-radius: 8px; border: none;
  font-size: 12px; font-weight: 500; cursor: pointer;
  text-decoration: none; text-align: center; white-space: nowrap;
  display: inline-block; transition: all 0.2s;
}
.cc-btn-view {
  background: rgba(246, 176, 33, 0.1); color: var(--ace-gold);
  border: 1px solid rgba(246, 176, 33, 0.3);
}
.cc-btn-view:hover { background: rgba(246, 176, 33, 0.18); }
.cc-btn-edit {
  background: rgba(34, 197, 94, 0.1); color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.3);
}
.cc-btn-edit:hover { background: rgba(34, 197, 94, 0.18); }
.cc-btn-del {
  background: rgba(220, 38, 38, 0.1); color: #fca5a5;
  border: 1px solid rgba(220, 38, 38, 0.3);
}
.cc-btn-del:hover { background: rgba(220, 38, 38, 0.18); }
</style>
