<template>
  <div class="min-h-screen bg-[#050608] text-white">
    <main class="max-w-6xl mx-auto px-3 sm:px-4 pt-8 pb-20">
      <!-- Breadcrumbs -->
      <nav class="mb-6 text-xs md:text-sm flex items-center gap-2 text-[#818898]">
        <NuxtLink to="/" class="hover:text-white transition-colors">{{ $t('nav.home') }}</NuxtLink>
        <span class="text-[#818898]">›</span>
        <span class="text-white">{{ $t('nav.games') }}</span>
      </nav>

      <!-- Heading & description -->
      <header class="mb-8">
        <h1 class="text-3xl md:text-5xl font-bold mb-8">
          {{ $t('games.pageTitle') }}
        </h1>
        <p class="text-base md:text-lg text-white/90 leading-relaxed">
          {{ $t('games.pageDesc') }}
        </p>
      </header>

      <!-- Search + filters -->
      <section class="mb-10 space-y-4">

        <!-- Search bar -->
        <div class="max-w-xl">
          <div
            class="rounded-full bg-gradient-to-r from-[#F6B021] to-[#F27F10] p-[1px] mb-12"
          >
            <div class="flex items-center gap-3 rounded-full bg-[#050608] px-4 py-2.5">
              <svg
                class="w-5 h-5 text-[#F6B021]"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="9"
                  cy="9"
                  r="5"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path
                  d="M12.5 12.5L16 16"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
              <input
                v-model="searchTerm"
                type="text"
                :placeholder="$t('games.searchPlaceholder')"
                class="w-full bg-transparent text-sm md:text-base text-[#E6E6E6] placeholder:text-[#64748B] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <!-- Category filters -->
        <div class="flex flex-wrap gap-3">
          <button
            v-for="category in categories"
            :key="category.id"
            type="button"
            class="px-5 py-2 rounded-lg text-xs md:text-sm border transition-all duration-200"
            :class="
              activeCategory === category.id

              
                ? 'bg-gradient-to-r from-[#F6B021] to-[#F27F10] text-black border-transparent'
                : 'bg-transparent text-[#F6B021] border-[#F6B021] hover:border-[#818898] hover:text-[#818898]'
            "
            @click="activeCategory = category.id"
          >
            {{ category.label }}
          </button>
        </div>
      </section>

      <!-- All Providers -->
      <section class="mb-12">
        <div class="flex flex-wrap items-center gap-4">
          <button
            type="button"
            class="px-5 py-2 rounded-md text-xs md:text-sm border bg-gradient-to-r from-[#F6B021] to-[#F27F10] text-black border-transparent"
          >
            {{ $t('games.allProviders') }}
          </button>

          <div class="flex flex-wrap items-center gap-3 flex-1">
            <div
              v-for="provider in providers"
              :key="provider.id"
              class="group h-14 w-24 rounded-lg bg-transparent flex items-center justify-center cursor-pointer transition duration-200 hover:-translate-y-0.5"
            >
              <div class="h-10 w-16 rounded-md overflow-hidden flex items-center justify-center">
                <img
                  :src="provider.logo"
                  :alt="provider.name"
                  class="h-full w-full object-contain transition duration-200 group-hover:scale-110"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Games grid -->
      <section>
        <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="game in filteredGames"
            :key="game.id"
            class="bg-[#171717] rounded-4xl border border-[#64748B]/50 px-7 py-7 flex flex-col shadow-[0_0_0_1px_rgba(15,23,42,0.6)] transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/20"
          >
            <!-- Thumbnail -->
            <div class="mb-4 -mt-8 -mx-7 rounded-t-2xl overflow-hidden">
              <img
                :src="game.imageUrl"
                :alt="game.title"
                class="w-full h-36 md:h-44 object-cover"
              />
            </div>

            <div class="flex-1 flex flex-col">
              <!-- Title + provider -->
              <p class="mb-3">
                <span
                  class="bg-gradient-to-r from-[#F6B021] to-[#F27F10] bg-clip-text text-transparent font-semibold text-base md:text-md"
                >
                  {{ game.title }}
                </span>
                <span class="ml-1 align-baseline text-xs md:text-sm text-white/90 font-normal">
                  • {{ game.provider }}
                </span>
              </p>

              <!-- Stats -->
              <div class="mb-4 space-y-2 text-xs md:text-sm">
                <p>
                  <span class="text-[#818898]">{{ $t('games.winningRate') }}: </span>
                  <span class="text-white/90">
                    {{ game.winningRate }}
                  </span>
                </p>
                <p>
                  <span class="text-[#21E850]">{{ $t('games.highestWinning') }}</span>
                  <span class="text-white/90">
                    • {{ game.highestWinning }}
                  </span>
                </p>
                <p class="flex items-center gap-3">
                  <span>
                    <span class="text-[#818898]">{{ $t('games.bet') }}: </span>
                    <span class="text-white/90">
                      {{ game.bet }}
                    </span>
                  </span>
                  <span>
                    <span class="text-[#818898]">{{ $t('games.win') }}: </span>
                    <span class="text-white/90">
                      {{ game.win }}
                    </span>
                  </span>
                  <span class="ml-auto">
                    <span
                      class="inline-flex items-center rounded-md bg-gradient-to-r from-[#F6B021] to-[#F27F10] font-bold px-3 py-2 md:text-xs text-black"
                    >
                      {{ game.turnover }}
                    </span>
                  </span>
                </p>
              </div>

              <!-- Buttons -->
              <div class="mt-auto flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  class="w-full rounded-xl bg-gradient-to-r from-[#F6B021] to-[#F27F10] text-black text-sm md:text-base py-2.5 flex items-center justify-center gap-2 hover:opacity-90 transition"
                >
                  <span>{{ $t('games.playNow') }}</span>
                  <span class="inline-flex items-center justify-center">
                    <svg
                      class="w-3.5 h-3.5"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="3.5"
                        y="3.5"
                        width="13"
                        height="13"
                        rx="2"
                        stroke="currentColor"
                        stroke-width="1.4"
                      />
                      <path
                        d="M8 12L12 8"
                        stroke="currentColor"
                        stroke-width="1.4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M8 8H12V12"
                        stroke="currentColor"
                        stroke-width="1.4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span>
                </button>

                <NuxtLink
                  :to="`/games/${game.id}`"
                  class="w-full rounded-xl border border-[#F6B021] text-[#F6B021] text-sm md:text-base py-2.5 flex items-center justify-center transition hover:border-[#818898] hover:text-[#818898]"
                >
                  {{ $t('games.moreReviews') }}
                </NuxtLink>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const { t } = useI18n()

type GameCategoryId =
  | 'all'
  | 'slots'
  | 'live'
  | 'table'
  | 'fishing'
  | 'sports'
  | 'other'

const categoryIds: GameCategoryId[] = ['all', 'slots', 'live', 'table', 'fishing', 'sports', 'other']

const categories = computed(() =>
  categoryIds.map((id) => ({ id, label: t(`games.categories.${id}`) }))
)

const providers = [
  { id: 'nolimit', name: 'Nolimit', logo: 'https://aceplay.bet/_vercel/image?url=%2Fimg%2Fplatform%2F34.png&w=1536&q=100' },
  { id: 'five', name: 'Five', logo: 'https://aceplay.bet/_vercel/image?url=%2Fimg%2Fplatform%2F33.png&w=1536&q=100' },
  { id: 'ug', name: 'UG', logo: 'https://aceplay.bet/_vercel/image?url=%2Fimg%2Fplatform%2F32.png&w=1536&q=100' },
  { id: 'jdb', name: 'JDB', logo: 'https://aceplay.bet/_vercel/image?url=%2Fimg%2Fplatform%2F39.png&w=1536&q=100' },
  { id: '5dots', name: '5DOTS', logo: 'https://aceplay.bet/_vercel/image?url=%2Fimg%2Fplatform%2F31.png&w=1536&q=100' },
  { id: 'gclub', name: 'G Club', logo: 'https://aceplay.bet/_vercel/image?url=%2Fimg%2Fplatform%2F29.png&w=1536&q=100' },
  { id: 'blue-print', name: 'Blue Print', logo: 'https://aceplay.bet/_vercel/image?url=%2Fimg%2Fplatform%2F28.png&w=1536&q=100' },
  { id: 'evoplay', name: 'Evo Play', logo: 'https://aceplay.bet/_vercel/image?url=%2Fimg%2Fplatform%2F27.png&w=1536&q=100' },
  { id: 'bbin', name: 'bbin', logo: 'https://aceplay.bet/_vercel/image?url=%2Fimg%2Fplatform%2F26.png&w=1536&q=100' },
  { id: 'e', name: 'E', logo: 'hhttps://aceplay.bet/_vercel/image?url=%2Fimg%2Fplatform%2F35.png&w=1536&q=100' },
  { id: 'ezugi', name: 'Ezugi', logo: 'https://aceplay.bet/_vercel/image?url=%2Fimg%2Fplatform%2F25.png&w=1536&q=100' },
  { id: 'saba', name: 'SA BA', logo: 'https://aceplay.bet/_vercel/image?url=%2Fimg%2Fplatform%2F24.png&w=1536&q=100' },
  { id: 'arrow', name: 'arrow', logo: 'https://aceplay.bet/_vercel/image?url=%2Fimg%2Fplatform%2F23.png&w=1536&q=100' },
  { id: 'r88', name: 'R88', logo: 'https://aceplay.bet/_vercel/image?url=%2Fimg%2Fplatform%2F22.png&w=1536&q=100' },
  { id: 'tree', name: 'tree', logo: 'https://aceplay.bet/_vercel/image?url=%2Fimg%2Fplatform%2F21.png&w=1536&q=100' },
  { id: 'wm', name: 'wm', logo: 'hhttps://aceplay.bet/_vercel/image?url=%2Fimg%2Fplatform%2F20.png&w=1536&q=100' },
]

type GameCard = {
  id: string
  title: string
  provider: string
  category: GameCategoryId
  imageUrl: string
  winningRate: string
  highestWinning: string
  bet: string
  win: string
  turnover: string
}

const allGames: GameCard[] = [
  {
    id: 'super-ace',
    title: 'Super ACE',
    provider: 'JILI',
    category: 'slots',
    imageUrl:
      'https://download.ocms.cloud/v2/common/JILIV2/PlatformGameList.7489.3.webp?version=15',
    winningRate: '98.12%',
    highestWinning: '25 Jul 2025 - 19:20🏆',
    bet: '฿20,000',
    win: '฿40,000',
    turnover: '2x',
  },
  {
    id: 'fortune-rabbit',
    title: 'Fortune Rabbit',
    provider: 'PG Soft',
    category: 'slots',
    imageUrl:
      'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/game/thailand/heng9999/top-game.jpg',
    winningRate: '135.00%',
    highestWinning: '30 Mar 2025 - 00:59🏆',
    bet: '฿5,000',
    win: '฿2,742,500',
    turnover: '549x',
  },
  {
    id: 'caishen-wins',
    title: 'Caishen Wins',
    provider: 'PG Soft',
    category: 'slots',
    imageUrl:
      'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/game/thailand/luk666/pg-caishen-wins.webp',
    winningRate: '96.20%',
    highestWinning: '2 Sep 2025 - 6:18:23🏆',
    bet: '฿100',
    win: '฿498,200',
    turnover: '4,982x',
  },
  {
    id: 'sexy-baccarat',
    title: 'Sexy Baccarat Classic',
    provider: 'Evolution',
    category: 'live',
    imageUrl:
      'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/game/thailand/777ww/sexy-baccarat-classic-%E0%B9%80%E0%B8%81%E0%B8%A1%E0%B8%AE%E0%B8%B4%E0%B8%95-%E0%B9%81%E0%B8%88%E0%B8%81%E0%B9%82%E0%B8%AB%E0%B8%94.jpg',
    winningRate: '97.00%',
    highestWinning: '29 Jul 2025 - 12:06🏆',
    bet: '฿1,800',
    win: '฿54,000',
    turnover: '30x',
  },
  {
    id: 'jackpot-joker',
    title: 'Jackpot Joker',
    provider: 'JILI',
    category: 'slots',
    imageUrl:
      'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/game/thailand/betluckmak/%E0%B9%81%E0%B8%95%E0%B8%81%E0%B8%AD%E0%B8%B5%E0%B8%81%E0%B9%81%E0%B8%A5%E0%B9%89%E0%B8%A7%20500x300.jpg',
    winningRate: '96.70%',
    highestWinning: '6 Jun 2025 - 23:41🏆',
    bet: '฿100',
    win: '฿100,000',
    turnover: '1,000x',
  },
  {
    id: 'super-niubi',
    title: 'Super Niubi',
    provider: 'JDB',
    category: 'table',
    imageUrl:
      'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/game/thailand/550ww/top-game.jpg',
    winningRate: '120.00%',
    highestWinning: '28 Jul 2025 - 16:43🏆',
    bet: '฿1,250',
    win: '฿300,000',
    turnover: '240x',
  },
  {
    id: 'dragon-tiger-deluxe',
    title: 'Dragon Tiger Deluxe',
    provider: 'Evolution',
    category: 'live',
    imageUrl:
      'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/game/thailand/88fed/sexy-baccarat.jpg',
    winningRate: '98.12%',
    highestWinning: '25 Jul 2025 - 19:20🏆',
    bet: '฿20,000',
    win: '฿40,000',
    turnover: '2x',
  },
  {
    id: 'lucky-gold-pots',
    title: 'Lucky Gold Pots',
    provider: 'Pragmatic Play',
    category: 'slots',
    imageUrl:
      'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/game/thailand/betluckmak/%E0%B9%81%E0%B8%95%E0%B8%81%E0%B8%AD%E0%B8%B5%E0%B8%81%E0%B9%81%E0%B8%A5%E0%B9%89%E0%B8%A7%20500x300.jpg',
    winningRate: '96.50%',
    highestWinning: '5 Jan 2025 - 14:20🏆',
    bet: '฿500',
    win: '฿350,000',
    turnover: '700x',
  },
  {
    id: 'sugar-rush-1000',
    title: 'Sugar Rush 1000',
    provider: 'Pragmatic Play',
    category: 'slots',
    imageUrl:
      'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/game/thailand/gxy888/gxy888-pp-slot-sugar-rush-1000.webp',
    winningRate: '96.20%',
    highestWinning: '2 Dec 2024 - 3:43:45🏆',
    bet: '฿1,000',
    win: '฿2,691,332',
    turnover: '2,691x',
  },
]

const searchTerm = ref('')
const activeCategory = ref<GameCategoryId>('all')

const filteredGames = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()

  return allGames.filter((game) => {
    const matchesCategory =
      activeCategory.value === 'all' || game.category === activeCategory.value

    const matchesSearch =
      !term ||
      game.title.toLowerCase().includes(term) ||
      game.provider.toLowerCase().includes(term)

    return matchesCategory && matchesSearch
  })
})
</script>

