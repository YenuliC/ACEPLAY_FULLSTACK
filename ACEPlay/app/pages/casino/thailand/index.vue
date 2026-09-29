<template>
  <div class="min-h-screen bg-[#050608] text-white">
    <main class="max-w-6xl mx-auto px-3 sm:px-4 pt-8 pb-20">

      <nav class="mb-6 text-xs md:text-sm flex items-center gap-2">
        <NuxtLink to="/" class="text-[#818898] hover:text-white transition-colors">{{ $t('nav.home') }}</NuxtLink>
        <span class="text-[#818898]">›</span>
        <NuxtLink to="/casino" class="text-[#818898] hover:text-white transition-colors">{{ $t('nav.casinos') }}</NuxtLink>
        <span class="text-[#818898]">›</span>
        <span class="text-white">Thailand</span>
      </nav>

      <!-- Heading & description (same styles as other pages) -->
      <header class="mb-10">
        <h1
          class="text-3xl md:text-5xl font-bold mb-8"
        >
          {{ $t('casino.popularCasinosThailand') }}
        </h1>
        <p class="text-base md:text-lg text-[#E6E6E6] leading-relaxed">
          {{ $t('casino.popularCasinosDesc') }}
        </p>
      </header>

      <!-- Casino detail cards: 3 columns grid -->
      <section class="grid gap-6 lg:gap-7 md:grid-cols-2 xl:grid-cols-3">
        <CasinoDetailCard
          v-for="casino in sortedThailandCasinos"
          :key="casino.id"
          v-bind="casino"
          :view-more-to="'/casino/thailand/' + casino.id.toLowerCase()"
        />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import CasinoDetailCard, { type CasinoDetail } from '~/components/CasinoDetailCard.vue'

const route = useRoute()

const thailandCasinos: CasinoDetail[] = [
  {
    id: 'GXY888',
    name: 'GXY888',
    sinceLabel: 'Since 2019 (7 Years)',
    description: 'Welcome to the casino 🎁 Get 500 baht free 🎁',
    imageUrl: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/thailand/gxy888.png',
    deposit: '0',
    bonus: '100',
    receive: '100',
    turnoverText: 'Turnover 10× • Max Withdrawal 100',
    depositRange: '1 – 100000',
    withdrawalRange: '100 – 10,000,000',
  },
  {
    id: 'LUK666',
    name: 'LUK666',
    sinceLabel: 'Since 2019 (7 Years)',
    description: 'Welcome to LUK666! Huge first deposit bonus!!!',
    imageUrl: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/thailand/luk666.jpg',
    deposit: '100',
    bonus: '400',
    receive: '500',
    turnoverText: 'Turnover 12,500× • Max Withdrawal 1,000',
    depositRange: '1 – 100,000',
    withdrawalRange: '100 – 50,000',
  },
  {
    id: 'Heng9999',
    name: 'Heng9999',
    sinceLabel: 'Since 2018 (8 Years)',
    description: ' First deposit bonus of 2,490.',
    imageUrl: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/thailand/heng9999.png',
    deposit: '10',
    bonus: '90',
    receive: '100',
    turnoverText: 'Turnover 5× • Max Withdrawal 100',
    depositRange: '10 – Unlimited',
    withdrawalRange: '100 – 999999',
  },
  {
    id: '777WW',
    name: '777WW',
    sinceLabel: 'Since 2018 (8 Years)',
    description: 'New members, try it out and receive a full bonus!',
    imageUrl: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/thailand/777ww.png',
    deposit: '20',
    bonus: '200',
    receive: '220',
    turnoverText: 'Turnover 6,000× • Max Withdrawal 200',
    depositRange: '1 – 100,000',
    withdrawalRange: '100 – 500,000',
  },
  {
    id: 'Ubet89',
    name: 'Ubet89',
    sinceLabel: 'Since 2018 (8 Years)',
    description: 'Ubet89, the hottest casino of 2025.',
    imageUrl: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/thailand/ubet89.png',
    deposit: '50',
    bonus: '150',
    receive: '200',
    turnoverText: 'Turnover 5,000× • Max Withdrawal 300',
    depositRange: '10 – 200,000',
    withdrawalRange: '100 – 200,000',
  },
  {
    id: '88FED',
    name: '88FED',
    sinceLabel: 'Since 2018 (8 Years)',
    description: '88FED is a direct casino website offering a full range of services.',
    imageUrl: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/thailand/88fed.png',
    deposit: '50',
    bonus: '150',
    receive: '300',
    turnoverText: 'Turnover 5,000× • Max Withdrawal 300',
    depositRange: '50 – 200,000',
    withdrawalRange: '300 – 200,000',
  },
  {
    id: 'BETLUCKMAK',
    name: 'BETLUCKMAK',
    sinceLabel: 'Since 2018 (8 Years)',
    description: 'Sign up today and receive free credit! No deposit required. Withdrawals are real.',
    imageUrl: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/thailand/betluckmak.jpg',
    deposit: '200',
    bonus: '100',
    receive: '300',
    turnoverText: 'Turnover 100× • Max Withdrawal Unlimited',
    depositRange: '100 – 500,000',
    withdrawalRange: '300 – Unlimited',
  },
  {
    id: '550WW',
    name: '550WW',
    sinceLabel: 'Since 2015 (11 Years)',
    description: 'New members get 100 baht free with 550WW credit.',
    imageUrl: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/thailand/550ww.png',
    deposit: '10',
    bonus: '90',
    receive: '100',
    turnoverText: 'Turnover 0× • Max Withdrawal 100',
    depositRange: '10 – Unlimited',
    withdrawalRange: '100 – Unlimited',
  },
]

const sortedThailandCasinos = computed(() => {
  const queryCasino = route.query.casino
  if (!queryCasino || typeof queryCasino !== 'string') return thailandCasinos
  const q = queryCasino.trim().toLowerCase()
  if (!q) return thailandCasinos
  const index = thailandCasinos.findIndex((c) => c.id.toLowerCase() === q)
  if (index === -1 || index === 0) return thailandCasinos
  return [
    thailandCasinos[index],
    ...thailandCasinos.slice(0, index),
    ...thailandCasinos.slice(index + 1),
  ]
})
</script>
