<template>
  <div class="min-h-screen bg-[#050608] text-white">

    <!-- Loading -->
    <main v-if="pending" class="max-w-6xl mx-auto px-3 sm:px-4 pt-8 pb-20 text-center">
      <div class="flex flex-col items-center gap-4 pt-20">
        <div class="h-10 w-10 rounded-full border-2 border-[#F6B021] border-t-transparent animate-spin" />
        <p class="text-white/60">Loading…</p>
      </div>
    </main>

    <!-- Casino detail -->
    <main v-else-if="casino" class="max-w-6xl mx-auto px-3 sm:px-4 pt-8 pb-20">

      <!-- Breadcrumb -->
      <nav class="mb-6 text-xs md:text-sm flex items-center gap-2 text-[#818898]">
        <NuxtLink to="/" class="hover:text-white transition-colors">{{ $t('nav.home') }}</NuxtLink>
        <span>›</span>
        <NuxtLink to="/casino" class="hover:text-white transition-colors">{{ $t('nav.casinos') }}</NuxtLink>
        <span>›</span>
        <NuxtLink :to="`/casino/${route.params.country}`" class="hover:text-white transition-colors capitalize">
          {{ countryLabel }}
        </NuxtLink>
        <span>›</span>
        <span class="text-white">{{ casino.casino?.name }}</span>
      </nav>

      <!-- Casino header -->
      <section class="grid gap-8 md:grid-cols-[1fr_auto] items-start mb-12">
        <div>
          <h1 class="text-4xl font-bold mb-3 bg-gradient-to-r from-[#F6B021] to-[#F27F10] bg-clip-text text-transparent">
            {{ casino.casino?.name }}
          </h1>
          <p class="text-sm md:text-base text-white/90 leading-relaxed mb-6">
            {{ casino.casino?.description }}
          </p>
          <div class="flex flex-wrap gap-3">
            <a
              v-if="casino.casino?.url?.main"
              :href="casino.casino.url.main"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-xl bg-gradient-to-r from-[#F6B021] to-[#F27F10] text-black text-sm md:text-base px-7 py-2.5 hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              {{ $t('games.playNow') }}
              <svg class="w-4 h-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3.5" y="3.5" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.4" />
                <path d="M8 12L12 8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M8 8H12V12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </a>
            <a
              v-if="casino.casino?.url?.referral || casino.casino?.url?.backup?.[0]"
              :href="casino.casino.url.referral || casino.casino.url.backup[0]"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-xl border border-[#F6B021] text-white text-sm md:text-base px-6 py-2.5 hover:bg-[#F6B021]/10 transition-colors"
            >
              {{ $t('casino.alternativeLink') }}
            </a>
            <button
              type="button"
              class="rounded-xl border border-[#F6B021] text-white text-sm md:text-base px-6 py-2.5 hover:bg-[#F6B021]/10 transition-colors"
            >
              {{ $t('casino.viewAllPromotions') }}
            </button>
          </div>
        </div>
        <div class="flex justify-center md:justify-end">
          <div class="h-28 w-28 md:h-32 md:w-32 rounded-2xl overflow-hidden bg-black/40 border border-[#1E2633] flex items-center justify-center">
            <img
              v-if="casino.casino?.url?.logo"
              :src="casino.casino.url.logo"
              :alt="casino.casino?.name"
              class="h-full w-full object-contain"
            />
            <span v-else class="text-2xl font-bold text-[#F6B021]">{{ casino.casino?.name?.charAt(0) }}</span>
          </div>
        </div>
      </section>

      <!-- Feature cards (static marketing cards, same as original) -->
      <section class="grid gap-4 md:grid-cols-3 mb-10">
        <div class="bg-[#171717] rounded-2xl border border-[#64748B]/50 px-7 py-7 flex items-center gap-4 shadow-[0_0_0_1px_rgba(15,23,42,0.6)] transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/20">
          <div class="h-12 w-12 rounded-xl bg-[#2B271F] flex items-center justify-center">
            <span class="text-xl">📦</span>
          </div>
          <div>
            <p class="text-lg font-semibold text-white">100+</p>
            <p class="text-sm text-[#818898]">{{ $t('casino.gameCategories') }}</p>
          </div>
        </div>
        <div class="bg-[#171717] rounded-2xl border border-[#64748B]/50 px-7 py-7 flex items-center gap-4 shadow-[0_0_0_1px_rgba(15,23,42,0.6)] transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/20">
          <div class="h-12 w-12 rounded-xl bg-[#2B271F] flex items-center justify-center">
            <span class="text-xl">🏆</span>
          </div>
          <div>
            <p class="text-lg font-semibold text-white">{{ $t('casino.jackpot') }}</p>
            <p class="text-sm text-[#818898]">฿1,000,000</p>
          </div>
        </div>
        <div class="bg-[#171717] rounded-2xl border border-[#64748B]/50 px-7 py-7 flex items-center gap-4 shadow-[0_0_0_1px_rgba(15,23,42,0.6)] transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/20">
          <div class="h-12 w-12 rounded-xl bg-[#2B271F] flex items-center justify-center">
            <span class="text-xl">🎁</span>
          </div>
          <div>
            <p class="text-lg font-semibold text-white">{{ $t('casino.vipClub') }}</p>
            <p class="text-sm text-[#818898]">{{ $t('casino.exclusiveRewards') }}</p>
          </div>
        </div>
      </section>

      <!-- Game category buttons (from MongoDB casino.casino.url.game) -->
      <section class="mb-10">
        <div class="flex flex-wrap gap-2">
          <a
            v-for="(url, cat) in casino.casino?.url?.game"
            :key="cat"
            :href="(url as string) || '#'"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-lg border border-[#1E2633] bg-[#151921] px-4 py-2 text-sm text-white/90 hover:bg-[#F6B021]/50 hover:border-[#F6B021] transition-colors capitalize"
          >
            {{ cat }}
          </a>
        </div>
      </section>

      <!-- Welcome bonus / large promotion (from MongoDB welcomeBonus) -->
      <section
        v-if="casino.welcomeBonus?.image || casino.welcomeBonus?.title"
        class="rounded-2xl border border-[#1E2933] hover:border-[#F6B021] overflow-hidden bg-[#050608] mb-12"
      >
        <div class="grid md:grid-cols-[1.2fr_1.1fr]">
          <!-- Left: bonus image -->
          <div class="bg-[#050608]">
            <img
              v-if="casino.welcomeBonus.image"
              :src="casino.welcomeBonus.image"
              :alt="`Promotion for ${casino.casino?.name}`"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Right: copy and CTA -->
          <div class="px-8 py-8 flex flex-col justify-center bg-[#11131A]">
            <p class="text-xl md:text-2xl font-semibold bg-gradient-to-r from-[#F6B021] to-[#F27F10] bg-clip-text text-transparent mb-2">
              {{ $t('casino.newMembersWith') }} {{ casino.casino?.name }}
            </p>
            <p class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#F6B021] to-[#F27F10] bg-clip-text text-transparent mb-6">
              {{ receiveAmount }} {{ $t('casino.bahtForFree') }}
            </p>

            <div class="flex flex-wrap items-center gap-3 mb-3">
              <span class="inline-flex rounded-full bg-gradient-to-r from-[#F6B021] to-[#F27F10] p-[1px]">
                <span class="inline-flex items-center rounded-full bg-[#11131A] px-4 py-1.5 text-sm text-[#F6B021]">
                  {{ $t('casino.deposit') }} {{ casino.welcomeBonus.deposit }}
                </span>
              </span>
              <span class="text-[#F6B021]">→</span>
              <span class="inline-flex rounded-full bg-gradient-to-r from-[#F6B021] to-[#F27F10] p-[1px]">
                <span class="inline-flex items-center rounded-full bg-[#11131A] px-4 py-1.5 text-sm text-[#F6B021]">
                  {{ $t('casino.bonus') }} {{ casino.welcomeBonus.bonus }}
                </span>
              </span>
              <span class="text-[#F6B021]">→</span>
              <span class="inline-flex rounded-full bg-gradient-to-r from-[#F6B021] to-[#F27F10] p-[1px]">
                <span class="inline-flex items-center rounded-full bg-[#11131A] px-4 py-1.5 text-sm text-[#F6B021]">
                  {{ $t('casino.receive') }} {{ receiveAmount }}
                </span>
              </span>
            </div>

            <p v-if="turnoverText" class="text-xs text-white/70 mb-6">({{ turnoverText }})</p>

            <a
              :href="casino.welcomeBonus.url || casino.casino?.url?.main || '#'"
              target="_blank"
              rel="noopener noreferrer"
              class="w-full md:w-auto rounded-xl bg-gradient-to-r from-[#F6B021] to-[#F27F10] text-black text-sm md:text-base py-3 px-8 hover:opacity-90 transition-opacity text-center"
            >
              {{ $t('casino.joinPromotion') }}
            </a>
          </div>
        </div>
      </section>

      <!-- Celebrate your big victory (from MongoDB bigWinHistory) -->
      <section v-if="bigWinCards.length" class="mb-12">
        <h2 class="text-2xl md:text-3xl font-bold mb-10 text-white">
          {{ $t('casino.celebrateVictory') }} {{ casino.casino?.name }}!
        </h2>
        <CasinoCarousel :cards="bigWinCards" :per-page="3" variant="game" />
      </section>

      <!-- A popular game loved by players nationwide (from MongoDB topGames) -->
      <section v-if="topGamesCards.length" class="mb-12">
        <h2 class="text-2xl md:text-3xl font-bold mb-10 text-white">
          {{ $t('casino.popularGameNationwide') }}
        </h2>
        <CasinoCarousel :cards="topGamesCards" :per-page="3" variant="game" />
      </section>

      <!-- Don't miss this amazing special promotion (from MongoDB promotions) -->
      <section v-if="promotionCards.length" class="mb-12">
        <h2 class="text-2xl md:text-3xl font-bold mb-10 text-white">
          {{ $t('casino.dontMissPromotion') }}
        </h2>
        <CasinoCarousel :cards="promotionCards" :per-page="3" variant="promotion" />
      </section>

    </main>

    <!-- Not found -->
    <main v-else class="max-w-6xl mx-auto px-3 sm:px-4 pt-8 pb-20 text-center">
      <p class="text-white/80">{{ $t('casino.notFound') }}</p>
      <NuxtLink :to="`/casino/${route.params.country}`" class="text-[#F6B021] hover:underline mt-4 inline-block">
        {{ $t('casino.backToThailand') }}
      </NuxtLink>
    </main>

  </div>
</template>

<script setup lang="ts">
import CasinoCarousel from '~/components/CasinoCarousel.vue'

const route  = useRoute()
const config = useRuntimeConfig()

const country = computed(() => (route.params.country as string).toLowerCase())
const slug    = computed(() => (route.params.slug    as string).toLowerCase())

// Fetch client-side so the browser reaches the backend directly
const apiUrl = computed(
  () => `${config.public.apiBase}/public/casino/${country.value}/${slug.value}`
)

const { data: rawData, pending, error } = await useFetch<any>(apiUrl, {
  key: `casino-${country.value}-${slug.value}`,
  server: false,
})

// Debug logs in browser console
watchEffect(() => {
  if (!import.meta.client) return
  console.log('[Casino] URL :', apiUrl.value)
  console.log('[Casino] raw :', JSON.stringify(rawData.value))
  if (error.value) console.error('[Casino] err :', error.value)
})

// Backend returns { success: true, data: { casino, keyFeatures, payment, ... } }
const casino = computed(() => {
  if (!rawData.value) return null
  return rawData.value?.success ? (rawData.value.data ?? null) : rawData.value
})

const countryLabel = computed(() =>
  String(country.value).charAt(0).toUpperCase() + String(country.value).slice(1)
)

// "Receive" amount: use netwin when available, otherwise fall back to bonus
const receiveAmount = computed(() => {
  const wb = casino.value?.welcomeBonus
  if (!wb) return 0
  return wb.netwin && wb.netwin > 0 ? wb.netwin : wb.bonus
})

// Turnover text: "Turnover X× • Max Withdrawal Y"
const turnoverText = computed(() => {
  const wb = casino.value?.welcomeBonus
  if (!wb) return ''
  const parts: string[] = []
  if (wb.turnover) parts.push(`Turnover ${wb.turnover}×`)
  if (wb.maxWithdrawal) parts.push(`Max Withdrawal ${wb.maxWithdrawal}`)
  return parts.join(' • ')
})

// ── GameCard interface (CasinoCarousel game variant) ──────────────────────
interface GameCard {
  id: string | number
  casinoName: string
  thumbnailImage: string
  winningRate: string
  highestWinning: string
  bet: string
  win: string
  turnover: string
}

// bigWinHistory: { date, time, gameName, gamePlatform, betAmount, winAmount, image.cover }
// Fields are at root — NOT nested under highestWon
const bigWinCards = computed<GameCard[]>(() =>
  (casino.value?.bigWinHistory || []).map((e: any, i: number): GameCard => ({
    id: e.gameName || `bigwin-${i}`,
    casinoName: e.gamePlatform || '',
    thumbnailImage: e.image?.cover || '',
    winningRate: '-',
    highestWinning: (e.date || e.time) ? `${e.date || ''} ${e.time || ''}🏆`.trim() : '-',
    bet:      e.betAmount ? `฿${Number(e.betAmount).toLocaleString()}` : '-',
    win:      e.winAmount ? `฿${Number(e.winAmount).toLocaleString()}` : '-',
    turnover: (e.betAmount && e.winAmount)
      ? `${Math.round(e.winAmount / e.betAmount)}x` : '-',
  }))
)

// topGames: { gameName, gamePlatform, rtp, url, highestWon.{ date, time, betAmount, winAmount, image.cover } }
const topGamesCards = computed<GameCard[]>(() =>
  (casino.value?.topGames || []).map((e: any, i: number): GameCard => ({
    id: e.gameName || `topgame-${i}`,
    casinoName: e.gamePlatform || '',
    thumbnailImage: e.highestWon?.image?.cover || '',
    winningRate: e.rtp != null ? `${(e.rtp * 100).toFixed(2)}%` : '-',
    highestWinning: e.highestWon?.date
      ? `${e.highestWon.date} • ${e.highestWon.time || ''}🏆`.trim()
      : '-',
    bet: e.highestWon?.betAmount != null
      ? `฿${Number(e.highestWon.betAmount).toLocaleString()}` : '-',
    win: e.highestWon?.winAmount != null
      ? `฿${Number(e.highestWon.winAmount).toLocaleString()}` : '-',
    turnover: (e.highestWon?.betAmount && e.highestWon?.winAmount)
      ? `${Math.round(e.highestWon.winAmount / e.highestWon.betAmount)}x` : '-',
  }))
)

// ── PromotionCard (CasinoCarousel promotion variant) ──────────────────────
// promotions: { name, tag, image, deposit, bonus, turnover, netwin, gameTypes[], maxWithdrawal, availability, url }
interface PromotionCard {
  id: string | number
  casinoName: string
  imageUrl: string
  description: string
  deposit: string
  bonus: string
  turnover: string
  totalWins: string
  maxWithdrawal: string
  gameType: string
}

const promotionCards = computed<PromotionCard[]>(() => {
  const name = casino.value?.casino?.name || ''
  return (casino.value?.promotions || []).map((p: any, i: number): PromotionCard => ({
    id: `promo-${i}`,
    casinoName: name,
    imageUrl: p.image || '',
    description: p.name || '',
    deposit:       p.deposit       != null ? String(p.deposit)       : '-',
    bonus:         p.bonus         != null ? String(p.bonus)         : '-',
    turnover:      p.turnover      != null ? String(p.turnover)      : '-',
    totalWins:     '-',
    maxWithdrawal: p.maxWithdrawal != null ? String(p.maxWithdrawal) : '-',
    gameType:      p.gameTypes?.join(' | ') || '-',
  }))
})
</script>
