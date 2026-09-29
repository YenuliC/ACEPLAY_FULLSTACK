<template>
  <div class="min-h-screen bg-[#050608] text-white">
    <!-- Hero section -->
    <section class="max-w-6xl mx-auto px-3 sm:px-4 pt-12 pb-16 text-center">

      <h1
        class="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-[#F6B021] to-[#F27F10] bg-clip-text text-transparent"
      >
        {{ $t('hero.title') }}
      </h1>

      <p class="mx-auto text-sm md:text-lg text-[#E6E6E6] mb-12 leading-relaxed">
        {{ $t('hero.subtitle') }}
        <br class="hidden md:block" />
        <span class="mt-1 inline-block">{{ $t('hero.subtitle2') }}</span>
      </p>

      <div class="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
        <!-- Country selector dropdown -->
        <div class="flex flex-col gap-3 w-full max-w-xs sm:max-w-sm">
          <button
            type="button"
            class="w-full px-6 py-3 rounded-xl text-sm md:text-base font-semibold bg-gradient-to-r from-[#F6B021] to-[#F27F10] text-black shadow-lg shadow-orange-500/30 flex items-center justify-between"
            @click="showCountryDropdown = !showCountryDropdown"
          >
            <span class="flex items-center gap-2">
              <img :src="currentCountry.flagUrl" :alt="currentCountry.label" class="w-6 h-auto rounded-sm" />
              <span>{{ currentCountry.label }}</span>
            </span>
            <span class="ml-3 text-xs text-black/80">▼</span>
          </button>

          <div v-if="showCountryDropdown" class="flex flex-col gap-2">
            <button
              v-for="country in otherCountries"
              :key="country.code"
              type="button"
              class="w-full px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#F6B021] to-[#F27F10] text-black shadow-md shadow-orange-500/30 flex items-center justify-between"
              @click="selectCountry(country.code)"
            >
              <span class="flex items-center gap-2">
                <img :src="country.flagUrl" :alt="country.label" class="w-6 h-auto rounded-sm" />
                <span>{{ country.label }}</span>
              </span>
              <span class="ml-3 text-xs text-black/80">▼</span>
            </button>
          </div>
        </div>

        <!-- All casinos button with gradient border -->
        <NuxtLink
          to="/casino"
          class="mt-2 sm:mt-0 rounded-xl bg-gradient-to-r from-[#F6B021] to-[#F27F10] p-[1px]"
        >
          <span
            class="block rounded-xl bg-[#151921] px-8 py-3 text-sm md:text-base font-semibold text-white"
          >
            {{ $t('hero.allCasinos') }}
          </span>
        </NuxtLink>
      </div>
    </section>

    <!-- Top casinos -->
    <section class="max-w-6xl mx-auto px-3 sm:px-4 pb-16">
      <div class="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 class="text-3xl md:text-5xl font-bold mb-8">{{ topCasinosTitle }}</h2>
          <p class="text-base md:text-lg text-[#E6E6E6] leading-relaxed">
            {{ $t('sections.topCasinosDesc') }}
            <span class="ml-1 font-semibold text-[#21E850]">{{ $t('sections.discoverMore') }}</span>
          </p>
        </div>
      </div>

      <CasinoCarousel :key="'casino-' + countryStore.selectedCountry" :cards="activeCasinoCards" />
    </section>

    <!-- Popular games -->
    <section class="max-w-6xl mx-auto px-3 sm:px-4 pb-16">
      <div class="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 class="text-3xl md:text-5xl font-bold mb-8">{{ popularGamesTitle }}</h2>
          <p class="text-base md:text-lg text-[#E6E6E6] leading-relaxed">
            {{ $t('sections.popularGamesDesc') }}
            <span class="ml-1 font-semibold text-[#21E850]">{{ $t('sections.discoverMore') }}</span>
          </p>
        </div>
      </div>

      <CasinoCarousel :key="'game-' + countryStore.selectedCountry" :cards="activeGameCards" :perPage="3" variant="game" />
    </section>

    <!-- Exclusive promotions -->
    <section class="max-w-6xl mx-auto px-3 sm:px-4 pb-16">
      <div class="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 class="text-3xl md:text-5xl font-bold mb-8">
            {{ $t('sections.promotions') }}
          </h2>
          <p class="text-base md:text-lg text-[#E6E6E6] leading-relaxed">
            {{ $t('sections.promotionsDesc') }}
            <span class="ml-1 font-semibold text-[#21E850]">{{ $t('sections.discoverMore') }}</span>
          </p>
        </div>
      </div>

      <CasinoCarousel :key="'promo-' + countryStore.selectedCountry" :cards="activePromotionCards" :perPage="3" variant="promotion" />
    </section>

    <!-- Beginner guide -->
    <section class="max-w-6xl mx-auto px-3 sm:px-4 pb-20">
      <div class="mb-6">
        <h2 class="text-3xl md:text-5xl font-bold mb-8">{{ $t('sections.beginnerGuide') }}</h2>
        <p class="text-base md:text-lg text-[#E6E6E6] leading-relaxed">
          {{ $t('sections.beginnerGuideDesc') }}
        </p>
      </div>

      <div class="grid gap-5 md:grid-cols-3">
        <article
          v-for="(topic, index) in guideTopics"
          :key="index"
          class="bg-[#171717] rounded-2xl border border-[#64748B]/50 px-7 py-7 flex flex-col shadow-[0_0_0_1px_rgba(15,23,42,0.6)] transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/20"
        >
          <div>
            <div class="mb-3 flex items-start gap-3">
              <div class="h-10 w-10 rounded-xl bg-[#050608] flex items-center justify-center">
                <div class="h-9 w-9 rounded-xl bg-[#2B271F] flex items-center justify-center">
                  <span
                    class="bg-gradient-to-r from-[#F6B021] to-[#F27F10] bg-clip-text text-transparent text-lg"
                  >
                    {{ topic.icon }}
                  </span>
                </div>
              </div>
              <div>
                <h3 class="text-base md:text-lg font-semibold mb-2 leading-snug">
                  {{ topic.title }}
                </h3>
              </div>
            </div>
            <p class="text-sm md:text-base text-white/80 leading-relaxed">
              {{ topic.description }}
            </p>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useCountryStore } from '~/stores/country'
import CasinoCarousel from '~/components/CasinoCarousel.vue'

const { t } = useI18n()

type CountryCode = 'thailand' | 'bangladesh' | 'philippines'

interface CountryOption {
  code: CountryCode
  label: string
  flagUrl: string
}

const countryOptions = computed<CountryOption[]>(() => [
  {
    code: 'thailand',
    label: t('country.thailand'),
    flagUrl: 'https://flagcdn.com/w20/th.png'
  },
  {
    code: 'bangladesh',
    label: t('country.bangladesh'),
    flagUrl: 'https://flagcdn.com/w20/bd.png'
  },
  {
    code: 'philippines',
    label: t('country.philippines'),
    flagUrl: 'https://flagcdn.com/w20/ph.png'
  }
])

const countryStore = useCountryStore()
const showCountryDropdown = ref(false)

const currentCountry = computed(() => {
  return countryOptions.value.find((c) => c.code === (countryStore.selectedCountry as CountryCode)) ?? countryOptions.value[0]
})

const otherCountries = computed(() => {
  return countryOptions.value.filter((c) => c.code !== currentCountry.value.code)
})

const selectCountry = (code: CountryCode) => {
  countryStore.selectedCountry = code
  showCountryDropdown.value = false
}

const guideTopics = computed(() => [
  { title: t('guides.g1.title'), description: t('guides.g1.description'), icon: '🛡' },
  { title: t('guides.g2.title'), description: t('guides.g2.description'), icon: '🎁' },
  { title: t('guides.g3.title'), description: t('guides.g3.description'), icon: '💰' },
  { title: t('guides.g4.title'), description: t('guides.g4.description'), icon: '🏦' },
  { title: t('guides.g5.title'), description: t('guides.g5.description'), icon: '🎮' },
  { title: t('guides.g6.title'), description: t('guides.g6.description'), icon: '💵' },
])

type CasinoCard = {
  id: string
  name: string
  logoText?: string
  logoImage?: string
  description: string
  rating: string
  badge?: string
  bonus?: string
  reviews?: number
}

type GameCard = {
  id: string
  casinoName: string
  thumbnailImage: string
  winningRate: string
  highestWinning: string
  bet: string
  win: string
  turnover: string
}

type PromotionCard = {
  id: string
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


// ── Thailand ────────────────────────────────────────────────────────────────

const thailandCasinoCards = computed<CasinoCard[]>(() => [
  {
    id: 'GXY888',
    name: 'GXY888',
    logoImage: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/thailand/gxy888.png',
    description: t('cards.desc.gxy888'),
    rating: '4.8 / 5'
  },
  {
    id: 'LUK666',
    name: 'LUK666',
    logoImage: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/thailand/luk666.jpg',
    description: t('cards.desc.luk666'),
    rating: '4.9 / 5'
  },
  {
    id: 'Heng9999',
    name: 'Heng9999',
    logoImage: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/thailand/heng9999.png',
    description: t('cards.desc.heng9999'),
    rating: '4.6 / 5'
  },
  {
    id: '777WW',
    name: 'New Member Bonus',
    logoImage: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/thailand/777ww.png',
    description: t('cards.desc.777ww'),
    rating: '4.1 / 5'
  },
  {
    id: 'Ubet89',
    name: 'Ubet89',
    logoImage: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/thailand/ubet89.png',
    description: t('cards.desc.ubet89'),
    rating: '4.5 / 5'
  },
  {
    id: '88FED',
    name: '88FED',
    logoImage: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/thailand/88fed.png',
    description: t('cards.desc.88fed'),
    rating: '4.1 / 5'
  },
  {
    id: 'BETLUCKMAK',
    name: 'BETLUCKMAK',
    logoImage: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/thailand/betluckmak.jpg',
    description: t('cards.desc.betluckmak'),
    rating: '4.6 / 5'
  },
  {
    id: '550ww',
    name: '550WW',
    logoImage: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/thailand/550ww.png',
    description: t('cards.desc.550ww'),
    rating: '4.6 / 5'
  }
])

const thailandGameCards: GameCard[] = [
  {
    id: 'PP - Sugar Rush 1000',
    casinoName: 'GXY888',
    thumbnailImage: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/game/thailand/gxy888/gxy888-pp-slot-sugar-rush-1000.webp',
    winningRate: '96.20%',
    highestWinning: '2 Dec 2024 - 3:43:45🏆',
    bet: '฿1,000',
    win: '฿2,691,332',
    turnover: '2,691x',
  },
  {
    id: 'PG - Fortune Rabbit',
    casinoName: 'HENG9999',
    thumbnailImage: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/game/thailand/heng9999/top-game.jpg',
    winningRate: '135.00%',
    highestWinning: '30 Mar 2025 - 00:59🏆',
    bet: '฿5,000',
    win: '฿2,742,500',
    turnover: '549x',
  },
  {
    id: 'PG - Caishen Wins',
    casinoName: 'LUK666',
    thumbnailImage: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/game/thailand/luk666/pg-caishen-wins.webp',
    winningRate: '96.20%',
    highestWinning: '2 Sep 2025 - 6:18:23🏆',
    bet: '฿100',
    win: '฿498,200',
    turnover: '4,982x',
  },
  {
    id: 'SEXY - Baccarat Classic',
    casinoName: '777WW',
    thumbnailImage: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/game/thailand/777ww/sexy-baccarat-classic-%E0%B9%80%E0%B8%81%E0%B8%A1%E0%B8%AE%E0%B8%B4%E0%B8%95-%E0%B9%81%E0%B8%88%E0%B8%81%E0%B9%82%E0%B8%AB%E0%B8%94.jpg',
    winningRate: '97.00%',
    highestWinning: '29 Jul 2025 - 12:06🏆',
    bet: '฿1,800',
    win: '฿54,000',
    turnover: '30x',
  },
  {
    id: 'AWC - Sexy Baccarat',
    casinoName: '88FED',
    thumbnailImage: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/game/thailand/88fed/sexy-baccarat.jpg',
    winningRate: '98.12%',
    highestWinning: '25 Jul 2025 - 19:20🏆',
    bet: '฿20,000',
    win: '฿40,000',
    turnover: '2x',
  },
  {
    id: 'JILI - Jackpot Joker',
    casinoName: 'BETLUCKMAK',
    thumbnailImage: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/game/thailand/betluckmak/%E0%B9%81%E0%B8%95%E0%B8%81%E0%B8%AD%E0%B8%B5%E0%B8%81%E0%B9%81%E0%B8%A5%E0%B9%89%E0%B8%A7%20500x300.jpg',
    winningRate: '96.70%',
    highestWinning: '6 Jun 2025 - 23:41🏆',
    bet: '฿100',
    win: '฿100,000',
    turnover: '1,000x',
  },
  {
    id: 'AWC - Sexy Baccarat',
    casinoName: 'UBET89',
    thumbnailImage: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/game/thailand/ubet89/awc-sexy-baccarat.jpg',
    winningRate: '98.12%',
    highestWinning: '25 Jul 2025 - 19:20🏆',
    bet: '฿20,000',
    win: '฿40,000',
    turnover: '2x',
  },
  {
    id: 'JDB - Super Niubi',
    casinoName: '550WW',
    thumbnailImage: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/game/thailand/550ww/top-game.jpg',
    winningRate: '120.00%',
    highestWinning: '28 Jul 2025 - 16:43🏆',
    bet: '฿1,250',
    win: '฿300,000',
    turnover: '240x',
  }
]

const thailandPromotionCards = computed<PromotionCard[]>(() => [
  {
    id: 'GXY888',
    casinoName: 'GXY888',
    imageUrl:
      'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/promotion/thailand/gxy888/%E0%B8%9F%E0%B8%A3%E0%B8%B5%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%94%E0%B8%B4%E0%B8%95%20100%20%E0%B8%9A%E0%B8%B2%E0%B8%97.jpg',
    description: t('cards.desc.gxy888'),
    deposit: '฿0',
    bonus: '฿100',
    turnover: 'x10',
    totalWins: '-',
    maxWithdrawal: '฿100',
    gameType: 'Slot'
  },
  {
    id: 'Heng9999',
    casinoName: 'Heng9999',
    imageUrl:
      'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/promotion/thailand/heng9999/welcome-bonus.jpg',
    description: t('cards.desc.heng9999'),
    deposit: '฿10',
    bonus: '฿90',
    turnover: 'x5',
    totalWins: '-',
    maxWithdrawal: '฿100',
    gameType: 'Slot'
  },
  {
    id: 'Heng9999 Welcome',
    casinoName: 'LUK666',
    imageUrl:
      'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/promotion/thailand/luk666/%E0%B8%A2%E0%B8%B4%E0%B8%99%E0%B8%94%E0%B8%B5%E0%B8%95%E0%B9%89%E0%B8%AD%E0%B8%99%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%AA%E0%B8%A1%E0%B8%B2%E0%B8%8A%E0%B8%B4%E0%B8%81%E0%B9%83%E0%B8%AB%E0%B8%A1%E0%B9%88.jpg',
    description: t('cards.desc.luk666'),
    deposit: '฿100',
    bonus: '฿400',
    turnover: '฿12,500',
    totalWins: '-',
    maxWithdrawal: '฿1,000',
    gameType: 'Slot | Fishing'
  },
  {
    id: '777WW',
    casinoName: '777WW',
    imageUrl:
      'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/promotion/thailand/777ww/%E0%B8%AA%E0%B8%A1%E0%B8%B2%E0%B8%8A%E0%B8%B4%E0%B8%81%E0%B9%83%E0%B8%AB%E0%B8%A1%E0%B9%88%20%E0%B8%97%E0%B9%89%E0%B8%B2%E0%B9%83%E0%B8%AB%E0%B9%89%E0%B8%A5%E0%B8%AD%E0%B8%87%20%E0%B8%9D%E0%B8%B2%E0%B8%8120%E0%B8%A3%E0%B8%B1%E0%B8%9A200.jpg',
    description: t('cards.desc.777ww'),
    deposit: '฿20',
    bonus: '฿200',
    turnover: '฿6,000',
    totalWins: '-',
    maxWithdrawal: '฿200',
    gameType: 'Slot'
  },
  {
    id: '88FED',
    casinoName: '88FED',
    imageUrl:
      'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/promotion/thailand/88fed/%E0%B9%82%E0%B8%9B%E0%B8%A3%E0%B8%AA%E0%B8%A1%E0%B8%B2%E0%B8%8A%E0%B8%B4%E0%B8%81%E0%B9%83%E0%B8%AB%E0%B8%A1%E0%B9%88.jpg',
    description: t('cards.desc.88fed'),
    deposit: '฿50',
    bonus: '฿150',
    turnover: '฿5,000',
    totalWins: '-',
    maxWithdrawal: '฿300',
    gameType: 'Slot'
  },
  {
    id: 'BETLUCKMAK',
    casinoName: 'BETLUCKMAK',
    imageUrl:
      'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/promotion/thailand/betluckmak/%E0%B8%9D%E0%B8%B2%E0%B8%81%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B8%A0%E0%B8%B2%E0%B8%A2%E0%B9%83%E0%B8%99%2024%20%E0%B8%8A%E0%B8%A1.jpg',
    description: t('cards.desc.betluckmak'),
    deposit: '฿200',
    bonus: '฿100',
    turnover: '฿100',
    totalWins: '-',
    maxWithdrawal: 'Unlimited',
    gameType: 'Slot'
  },
  {
    id: 'Ubet89',
    casinoName: 'Ubet89',
    imageUrl:
      'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/promotion/thailand/ubet89/%E0%B8%95%E0%B9%89%E0%B8%AD%E0%B8%99%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%AA%E0%B8%A1%E0%B8%B2%E0%B8%8A%E0%B8%B4%E0%B8%81%E0%B9%83%E0%B8%AB%E0%B8%A1%E0%B9%88%E0%B9%80%E0%B8%82%E0%B9%89%E0%B8%B2%20ubet89.jpg',
    description: t('cards.desc.ubet89'),
    deposit: '฿50',
    bonus: '฿150',
    turnover: '฿5,000',
    totalWins: '-',
    maxWithdrawal: '฿300',
    gameType: 'Slot'
  },
  {
    id: '550WW',
    casinoName: '550WW',
    imageUrl:
      'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/promotion/thailand/550ww/welcome-bonus.jpg',
    description: t('cards.desc.550ww'),
    deposit: '฿10',
    bonus: '฿90',
    turnover: '-',
    totalWins: '฿300',
    maxWithdrawal: '฿100',
    gameType: 'Slot'
  },
])

// ── Bangladesh ───────────────────────────────────────────────────────────────

const bangladeshCasinoCards = computed<CasinoCard[]>(() => [
  {
    id: 'BoroJeet',
    name: 'BoroJeet',
    logoImage: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/bangladesh/borojeet.png',
    description: t('cards.desc.borojeet'),
    rating: '4.8 / 5'
  }
])

const bangladeshGameCards: GameCard[] = [
  {
    id: 'YB - Royal Ace',
    casinoName: 'BOROJEET',
    thumbnailImage: 'https://download.ocms.cloud/v2/common/YB/PlatformGameList.33843.3.webp?version=8',
    winningRate: '96.70%',
    highestWinning: '8 July 2025 - 14:08:12🏆',
    bet: '৳3,000',
    win: '৳668,550',
    turnover: '223x',
  }
]

const bangladeshPromotionCards = computed<PromotionCard[]>(() => [
  {
    id: 'BoroJeet-welcome',
    casinoName: 'BoroJeet',
    imageUrl: 'https://download.ocms.cloud/v2/bjt/PromotionInfoLanguage.3_3_1.webp?version=2',
    description: t('cards.desc.borojeet'),
    deposit: '$10',
    bonus: '$90',
    turnover: '-',
    totalWins: '$300',
    maxWithdrawal: '$100',
    gameType: 'Slot'
  }
])

// ── Philippines ───────────────────────────────────────────────────────────────

const philippinesCasinoCards = computed<CasinoCard[]>(() => [
  {
    id: 'JiliNo1',
    name: 'JiliNo1',
    logoImage: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/philippines/jilino1.png',
    description: t('cards.desc.welcome500'),
    rating: '4.8 / 5'
  },
  {
    id: 'BetSo88',
    name: 'BetSo88',
    logoImage: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/philippines/betso88.png',
    description: t('cards.desc.welcome500'),
    rating: '4.8 / 5'
  },
  {
    id: 'Swerte99',
    name: 'Swerte99',
    logoImage: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/philippines/swerte99.png',
    description: t('cards.desc.welcome500'),
    rating: '4.8 / 5'
  },
  {
    id: 'Milyon88',
    name: 'Milyon88',
    logoImage: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/philippines/milyon88.png',
    description: t('cards.desc.welcome500'),
    rating: '4.8 / 5'
  },
  {
    id: 'SSBet77',
    name: 'SSBet77',
    logoImage: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/philippines/ssbet77.webp',
    description: t('cards.desc.welcome500'),
    rating: '4.8 / 5'
  },
  {
    id: '7Spin',
    name: '7Spin',
    logoImage: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/philippines/7spin.png',
    description: t('cards.desc.firstDeposit400'),
    rating: '4.8 / 5'
  },
])

const philippinesGameCards: GameCard[] = [
  {
    id: 'PP - Sugar Rush 1000',
    casinoName: 'JILINO1',
    thumbnailImage: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/game/thailand/gxy888/gxy888-pp-slot-sugar-rush-1000.webp',
    winningRate: '96.20%',
    highestWinning: '2 Dec 2024 - 3:43:45🏆',
    bet: '฿1,000',
    win: '฿2,691,332',
    turnover: '2,691x',
  },
  {
    id: 'PP - Sugar Rush 1000',
    casinoName: 'BETSO88',
    thumbnailImage: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/game/thailand/gxy888/gxy888-pp-slot-sugar-rush-1000.webp',
    winningRate: '96.20%',
    highestWinning: '2 Dec 2024 - 3:43:45🏆',
    bet: '฿1,000',
    win: '฿2,691,332',
    turnover: '2,691x',
  },
  {
    id: 'PP - Sugar Rush 1000',
    casinoName: 'SWERTE99',
    thumbnailImage: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/game/thailand/gxy888/gxy888-pp-slot-sugar-rush-1000.webp',
    winningRate: '96.20%',
    highestWinning: '2 Dec 2024 - 3:43:45🏆',
    bet: '฿1,000',
    win: '฿2,691,332',
    turnover: '2,691x',
  },
  {
    id: 'PP - Sugar Rush 1000',
    casinoName: 'SSBET77',
    thumbnailImage: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/game/thailand/gxy888/gxy888-pp-slot-sugar-rush-1000.webp',
    winningRate: '96.20%',
    highestWinning: '2 Dec 2024 - 3:43:45🏆',
    bet: '฿1,000',
    win: '฿2,691,332',
    turnover: '2,691x',
  },
  {
    id: 'PP - Sugar Rush 1000',
    casinoName: 'MILYON88',
    thumbnailImage: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/game/thailand/gxy888/gxy888-pp-slot-sugar-rush-1000.webp',
    winningRate: '96.20%',
    highestWinning: '2 Dec 2024 - 3:43:45🏆',
    bet: '฿1,000',
    win: '฿2,691,332',
    turnover: '2,691x',
  },
  {
    id: 'JILI - Super Ace',
    casinoName: '7SPIN',
    thumbnailImage: 'https://download.ocms.cloud/v2/common/JILIV2/PlatformGameList.7489.3.webp?version=15',
    winningRate: '97.00%',
    highestWinning: '2 Nov 2025 - 11:59:15🏆',
    bet: '₱200',
    win: '₱174,400 ',
    turnover: '872x',
  }
]

const philippinesPromotionCards = computed<PromotionCard[]>(() => [
  {
    id: 'JiliNo1',
    casinoName: 'JiliNo1',
    imageUrl: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/promotion/thailand/gxy888/%E0%B8%9F%E0%B8%A3%E0%B8%B5%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%94%E0%B8%B4%E0%B8%95%20100%20%E0%B8%9A%E0%B8%B2%E0%B8%97.jpg',
    description: t('cards.desc.welcome500'),
    deposit: '฿0',
    bonus: '฿100',
    turnover: 'x10',
    totalWins: '-',
    maxWithdrawal: '฿100',
    gameType: 'Slot | Fishing'
  },
  {
    id: 'BetSo88',
    casinoName: 'BetSo88',
    imageUrl: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/promotion/thailand/gxy888/%E0%B8%9F%E0%B8%A3%E0%B8%B5%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%94%E0%B8%B4%E0%B8%95%20100%20%E0%B8%9A%E0%B8%B2%E0%B8%97.jpg',
    description: t('cards.desc.welcome500'),
    deposit: '฿0',
    bonus: '฿100',
    turnover: 'x10',
    totalWins: '-',
    maxWithdrawal: '฿100',
    gameType: 'Slot | Fishing'
  },
  {
    id: 'Swerte99',
    casinoName: 'Swerte99',
    imageUrl: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/promotion/thailand/gxy888/%E0%B8%9F%E0%B8%A3%E0%B8%B5%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%94%E0%B8%B4%E0%B8%95%20100%20%E0%B8%9A%E0%B8%B2%E0%B8%97.jpg',
    description: t('cards.desc.welcome500'),
    deposit: '฿0',
    bonus: '฿100',
    turnover: 'x10',
    totalWins: '-',
    maxWithdrawal: '฿100',
    gameType: 'Slot | Fishing'
  },
  {
    id: 'SSBet77',
    casinoName: 'SSBet77',
    imageUrl: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/promotion/thailand/gxy888/%E0%B8%9F%E0%B8%A3%E0%B8%B5%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%94%E0%B8%B4%E0%B8%95%20100%20%E0%B8%9A%E0%B8%B2%E0%B8%97.jpg',
    description: t('cards.desc.welcome500'),
    deposit: '฿0',
    bonus: '฿100',
    turnover: 'x10',
    totalWins: '-',
    maxWithdrawal: '฿100',
    gameType: 'Slot | Fishing'
  },
  {
    id: 'Milyon88',
    casinoName: 'Milyon88',
    imageUrl: 'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/promotion/thailand/gxy888/%E0%B8%9F%E0%B8%A3%E0%B8%B5%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%94%E0%B8%B4%E0%B8%95%20100%20%E0%B8%9A%E0%B8%B2%E0%B8%97.jpg',
    description: t('cards.desc.welcome500'),
    deposit: '฿0',
    bonus: '฿100',
    turnover: 'x10',
    totalWins: '-',
    maxWithdrawal: '฿100',
    gameType: 'Slot | Fishing'
  },
  {
    id: '7Spin',
    casinoName: '7Spin',
    imageUrl: 'https://7spin.com/_next/image?url=https%3A%2F%2Fcdn2.bearspace101.com%2FWeb.Portal%2FSP001-01.Portal%2FUpload%2FPromotion%2Fff9d15d9df46417f9bb705d0b205dc7f.png&w=1920&q=75',
    description: t('cards.desc.firstDeposit400'),
    deposit: '₱50',
    bonus: '₱200',
    turnover: 'x25',
    totalWins: '-',
    maxWithdrawal: '₱250',
    gameType: 'Slot | Fishing'
  }
])

// ── Active content (computed by selected country) ────────────────────────────

const isBangladesh = computed(() => countryStore.selectedCountry === 'bangladesh')
const isPhilippines = computed(() => countryStore.selectedCountry === 'philippines')

const topCasinosTitle = computed(() => {
  if (isBangladesh.value) return t('sections.topCasinosBangladesh')
  if (isPhilippines.value) return t('sections.topCasinosPhilippines')
  return t('sections.topCasinos')
})

const popularGamesTitle = computed(() => {
  if (isBangladesh.value) return t('sections.popularGamesBangladesh')
  if (isPhilippines.value) return t('sections.popularGamesPhilippines')
  return t('sections.popularGames')
})

const activeCasinoCards = computed(() => {
  if (isBangladesh.value) return bangladeshCasinoCards.value
  if (isPhilippines.value) return philippinesCasinoCards.value
  return thailandCasinoCards.value
})

const activeGameCards = computed(() => {
  if (isBangladesh.value) return bangladeshGameCards
  if (isPhilippines.value) return philippinesGameCards
  return thailandGameCards
})

const activePromotionCards = computed(() => {
  if (isBangladesh.value) return bangladeshPromotionCards.value
  if (isPhilippines.value) return philippinesPromotionCards.value
  return thailandPromotionCards.value
})

</script>