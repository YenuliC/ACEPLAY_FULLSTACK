<template>
  <div class="min-h-screen bg-[#050608] text-white">
    <main class="max-w-6xl mx-auto px-3 sm:px-4 pt-8 pb-20">

      <nav class="mb-6 text-xs md:text-sm flex items-center gap-2">
        <NuxtLink to="/" class="text-[#818898] hover:text-white transition-colors">{{ $t('nav.home') }}</NuxtLink>
        <span class="text-[#818898]">›</span>
        <NuxtLink to="/casino" class="text-[#818898] hover:text-white transition-colors">{{ $t('nav.casinos') }}</NuxtLink>
        <span class="text-[#818898]">›</span>
        <span class="text-white">Philippines</span>
      </nav>

      <!-- Heading & description (same styles as other pages) -->
      <header class="mb-10">
        <h1
          class="text-3xl md:text-5xl font-bold mb-8"
        >
          {{ $t('casino.popularCasinosPhilippines') }}
        </h1>
        <p class="text-base md:text-lg text-[#E6E6E6] leading-relaxed">
          {{ $t('casino.popularCasinosDesc') }}
        </p>
      </header>

      <!-- Casino detail cards: 3 columns grid -->
      <section class="grid gap-6 lg:gap-7 md:grid-cols-2 xl:grid-cols-3">
        <CasinoDetailCard
          v-for="casino in philippinesCasinos"
          :key="casino.id"
          v-bind="casino"
        />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import CasinoDetailCard, { type CasinoDetail } from '~/components/CasinoDetailCard.vue'

const philippinesCasinos: CasinoDetail[] = [
  {
    id: 'SSBET77',
    name: 'SSBET77',
    sinceLabel: 'Since 2019 (7 Years)',
    description: 'Welcome to the casino 🎁 Get 500 baht free 🎁',
    imageUrl: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/philippines/ssbet77.webp',
    deposit: '0',
    bonus: '100',
    receive: '100',
    turnoverText: 'Turnover 10× • Max Withdrawal 100',
    depositRange: '1 – 100000',
    withdrawalRange: '100 – 10,000,000',
  },
  {
    id: 'BETSO88',
    name: 'BETSO88',
    sinceLabel: 'Since 2019 (7 Years)',
    description: 'Welcome to the casino 🎁 Get 500 baht free 🎁',
    imageUrl: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/philippines/betso88.png',
    deposit: '100',
    bonus: '400',
    receive: '500',
    turnoverText: 'Turnover 10× • Max Withdrawal 100',
    depositRange: '1 – 100,000',
    withdrawalRange: '100 – 10, 000,000',
  },
  {
    id: '7SPIN',
    name: '7SPIN',
    sinceLabel: 'Since 2025 (1 Year)',
    description: 'First Deposit 400% Bonus.',
    imageUrl: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/philippines/7spin.png',
    deposit: '50',
    bonus: '200',
    receive: '250',
    turnoverText: 'Turnover 25× • Max Withdrawal 250',
    depositRange: '50 – 50,000',
    withdrawalRange: '100 – 50,000',
  },
  {
    id: 'JILINO1',
    name: 'JILINO1',
    sinceLabel: 'ince 2019 (7 Years)',
    description: 'Welcome to the casino 🎁 Get 500 baht free 🎁',
    imageUrl: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/philippines/jilino1.png',
    deposit: '0',
    bonus: '100',
    receive: '100',
    turnoverText: 'Turnover 6,000× • Max Withdrawal 200',
    depositRange: '1 – 100,000',
    withdrawalRange: '100 – 10,000,000',
  },
  {
    id: 'SWERTE99',
    name: 'SWERTE99',
    sinceLabel: 'Since 2019 (7 Years)',
    description: 'Welcome to the casino 🎁 Get 500 baht free 🎁',
    imageUrl: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/philippines/swerte99.png',
    deposit: '0',
    bonus: '100',
    receive: '100',
    turnoverText: 'Turnover 10× • Max Withdrawal 100',
    depositRange: '1 – 100,000',
    withdrawalRange: '100 – 10,000,000',
  },
  {
    id: 'MILYON88',
    name: 'MILYON88',
    sinceLabel: 'Since 2019 (7 Years)',
    description: '88FED is a direct casino website offering a full range of services.',
    imageUrl: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/philippines/milyon88.png',
    deposit: '0',
    bonus: '100',
    receive: '100',
    turnoverText: 'Turnover 10× • Max Withdrawal 100',
    depositRange: '1 – 100,000',
    withdrawalRange: '100 – 10,000,000',
  },
]
</script>
