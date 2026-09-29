<template>
  <div class="min-h-screen bg-[#050608] text-white">
    <main class="max-w-6xl mx-auto px-3 sm:px-4 pt-8 pb-20">

      <nav class="mb-6 text-xs md:text-sm flex items-center gap-2">
        <NuxtLink to="/" class="text-[#818898] hover:text-white transition-colors">{{ $t('nav.home') }}</NuxtLink>
        <span class="text-[#818898]">›</span>
        <NuxtLink to="/casino" class="text-[#818898] hover:text-white transition-colors">{{ $t('nav.casinos') }}</NuxtLink>
        <span class="text-[#818898]">›</span>
        <span class="text-white">Bangladesh</span>
      </nav>

      <!-- Heading & description (same styles as other pages) -->
      <header class="mb-10">
        <h1
          class="text-3xl md:text-5xl font-bold mb-8"
        >
          {{ $t('casino.popularCasinosBangladesh') }}
        </h1>
        <p class="text-base md:text-lg text-[#E6E6E6] leading-relaxed">
          {{ $t('casino.popularCasinosDesc') }}
        </p>
      </header>

      <!-- Casino detail cards: 3 columns grid -->
      <section class="grid gap-6 lg:gap-7 md:grid-cols-2 xl:grid-cols-3">
        <CasinoDetailCard
          v-for="casino in bangladeshCasinos"
          :key="casino.id"
          v-bind="casino"
        />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import CasinoDetailCard, { type CasinoDetail } from '~/components/CasinoDetailCard.vue'

const bangladeshCasinos: CasinoDetail[] = [
  {
    id: 'SSBET77',
    name: 'SSBET77',
    sinceLabel: 'Since 2025 (1 Year)',
    description: 'Welcome to BoroJeet 🇧🇩',
    imageUrl: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/bangladesh/borojeet.png',
    deposit: '100',
    bonus: '400',
    receive: '500',
    turnoverText: 'Turnover 20× • Max Withdrawal 500',
    depositRange: '100 – 50,000',
    withdrawalRange: '100 – 50,000',
  },
]
</script>
