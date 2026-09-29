<template>
  <div class="min-h-screen bg-[#050608] text-white">
    <main class="max-w-6xl mx-auto px-3 sm:px-4 pt-8 pb-20" v-if="game">
      <!-- Breadcrumbs -->
      <nav class="mb-6 text-xs md:text-sm flex items-center gap-2 text-[#818898]">
        <NuxtLink to="/" class="hover:text-white transition-colors">{{ $t('nav.home') }}</NuxtLink>
        <span>›</span>
        <NuxtLink to="/games" class="hover:text-white transition-colors">{{ $t('nav.games') }}</NuxtLink>
        <span>›</span>
        <span class="text-white">{{ game.title }}</span>
      </nav>

      <!-- Header section -->
      <section class="grid gap-10 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.1fr)] items-start mb-12">
        <div>
          <div class="mb-3 flex flex-wrap items-center gap-2">
            <span
              class="inline-flex items-center rounded-full bg-[#111827] border border-[#F6B021] px-3 py-1 text-xs md:text-sm text-[#F6B021]"
            >
              {{ game.provider }}
            </span>
            <span
              v-if="game.categoryLabel"
              class="inline-flex items-center rounded-full bg-[#111827] border border-[#818898] px-3 py-1 text-xs md:text-sm text-[#E5E7EB]"
            >
              {{ game.categoryLabel }}
            </span>
          </div>

          <h1
            class="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#F6B021] to-[#F27F10] bg-clip-text text-transparent"
          >
            {{ game.title }}
          </h1>

          <p class="text-sm md:text-base text-[#E6E6E6] mb-6 leading-relaxed max-w-2xl">
            {{ game.shortDescription }}
          </p>

          <!-- Rating / RTP / Volatility / Release -->
          <div class="mb-6 flex flex-wrap items-center gap-4 text-sm md:text-base">
            <div class="flex items-center gap-1">
              <span class="flex items-center gap-0.5 text-[#F6B021] text-base md:text-lg">
                ★★★★★
              </span>
              <span class="ml-1 text-[#E5E7EB]">
                ({{ game.rating }}) 
              </span>
            </div>
            <span class="text-[#818898]">•</span>
            <span class="text-[#E5E7EB]">
              {{ $t('games.rtp') }} <span class="font-semibold">{{ game.rtp }}</span>
            </span>
            <span class="text-[#818898]">•</span>
            <span class="text-[#E5E7EB]">
              {{ $t('games.volatility') }} <span class="font-semibold">{{ game.volatility }}</span>
            </span>
            <span class="text-[#818898]">•</span>
            <span class="text-[#E5E7EB]">
              {{ $t('games.released') }} <span class="font-semibold">{{ game.released }}</span>
            </span>
          </div>

          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F6B021] to-[#F27F10] text-black text-sm md:text-base px-6 py-2.5 font-semibold hover:opacity-90 transition"
          >
            <span>{{ $t('games.playNow') }}</span>
            <span class="inline-flex items-center justify-center">
              <svg
                class="w-4 h-4"
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
        </div>

        <!-- Game image -->
        <div class="flex justify-center md:justify-end">
          <div class="w-full max-w-xs md:max-w-sm rounded-2xl overflow-hidden bg-black/40 border border-[#1F2933]">
            <img
              :src="game.imageUrl"
              :alt="game.title"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <!-- Game overview -->
      <section class="mb-10">
        <h2 class="text-2xl md:text-3xl font-bold mb-4">
          {{ $t('games.gameOverview') }}
        </h2>
        <div class="bg-[#171717] rounded-2xl border border-[#64748B]/50 px-7 py-7 flex flex-col shadow-[0_0_0_1px_rgba(15,23,42,0.6)] transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/20">
          <p class="text-sm md:text-base text-white/80 leading-relaxed">
            {{ game.overview }}
          </p>
        </div>
      </section>

      <!-- How to play -->
      <section v-if="game.howToPlay && game.howToPlay.length">
        <h2 class="text-2xl md:text-3xl font-bold mb-4">
          {{ $t('games.howToPlay') }}
        </h2>
        <div class="grid gap-6 md:grid-cols-3">
          <article
            v-for="(step, index) in game.howToPlay"
            :key="index"
            class="bg-[#171717] rounded-2xl border border-[#64748B]/50 px-7 py-7 flex flex-col shadow-[0_0_0_1px_rgba(15,23,42,0.6)] transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/20"
          >
            <div
              class="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#050608] text-sm font-semibold text-[#F6B021]"
            >
              {{ index + 1 }}
            </div>
            <h3 class="mb-2 text-sm md:text-lg font-semibold">
              {{ step.title }}
            </h3>
            <p class="text-xs md:text-sm text-white/70 leading-relaxed">
              {{ step.description }}
            </p>
          </article>
        </div>
      </section>
    </main>

    <main v-else class="max-w-4xl mx-auto px-3 sm:px-4 pt-16 pb-20 text-center">
      <p class="text-lg text-[#E6E6E6] mb-4">{{ $t('games.notFound') }}</p>
      <NuxtLink
        to="/games"
        class="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#F6B021] to-[#F27F10] text-black text-sm md:text-base px-6 py-2.5 font-semibold hover:opacity-90 transition"
      >
        {{ $t('games.backToGames') }}
      </NuxtLink>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#imports'

const { t } = useI18n()

// Returns the translation if found; falls back to the English string when the key is missing.
const tx = (key: string, fallback: string): string => {
  const result = t(key)
  return result !== key ? result : fallback
}

interface HowToPlayStep {
  title: string
  description: string
}

interface GameDetail {
  slug: string
  title: string
  provider: string
  categoryLabel?: string
  imageUrl: string
  shortDescription: string
  rating: string
  rtp: string
  volatility: string
  released: string
  overview: string
  howToPlay: HowToPlayStep[]
}

const allGameDetails: GameDetail[] = [
  {
    slug: 'super-ace',
    title: 'Super ACE',
    provider: 'JILI',
    categoryLabel: 'Slot',
    imageUrl:
      'https://download.ocms.cloud/v2/common/JILIV2/PlatformGameList.7489.3.webp?version=15',
    shortDescription:
      'The most popular slot in Southeast Asia featuring card-based mechanics and massive multipliers.',
    rating: '4.8 / 5',
    rtp: '97%',
    volatility: 'Medium',
    released: '2022-03-15',
    overview:
      'Super ACE is a medium volatility slot game developed by JILI. With an RTP of 97% and a player rating of 4.8/5, it stands as one of the most popular titles in the JILI lineup. Key features include Free Spins, Multipliers and Wild Cards, giving players the chance to hit massive wins from card-style symbols and stacked rewards.',
    howToPlay: [
      {
        title: 'Choose your bet',
        description: 'Set your preferred bet amount before spinning the reels.'
      },
      {
        title: 'Spin & watch for wins',
        description:
          'Press the spin button and watch for matching card symbols and wilds that can trigger big payouts.'
      },
      {
        title: 'Trigger free spins',
        description:
          'Land the required scatter symbols to unlock free spins with increasing multipliers for even larger rewards.'
      }
    ]
  },
  {
    slug: 'fortune-rabbit',
    title: 'Fortune Rabbit',
    provider: 'PG Soft',
    categoryLabel: 'Slot',
    imageUrl:
      'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/game/thailand/heng9999/top-game.jpg',
    shortDescription:
      'A charming slot inspired by the Year of the Rabbit, offering surprise features and big win potential.',
    rating: '4.7 / 5',
    rtp: '135.00%',
    volatility: 'Medium',
    released: '2025-03-30',
    overview:
      'Fortune Rabbit from PG Soft blends a cute art style with rewarding mechanics. The game focuses on simple, approachable gameplay with random features that can boost your wins. It is popular among players who enjoy medium volatility and frequent bonus hits.',
    howToPlay: [
      {
        title: 'Set your stake',
        description: 'Adjust the bet size to fit your bankroll before you begin spinning the reels.'
      },
      {
        title: 'Trigger bonus features',
        description:
          'Spin to land winning combinations and watch for random bonus features that can boost your total payout.'
      },
      {
        title: 'Manage your session',
        description:
          'Use win and loss limits to keep your gaming session fun and controlled while chasing big wins.'
      }
    ]
  },
  {
    slug: 'caishen-wins',
    title: 'Caishen Wins',
    provider: 'PG Soft',
    categoryLabel: 'Slot',
    imageUrl:
      'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/game/thailand/luk666/pg-caishen-wins.webp',
    shortDescription:
      'A fan-favourite Asian-themed slot featuring the God of Wealth and an exciting free spins feature.',
    rating: '4.6 / 5',
    rtp: '96.20%',
    volatility: 'High',
    released: '2025-09-02',
    overview:
      'Caishen Wins combines vibrant visuals with engaging gameplay. Climb the temple steps to unlock free spins and multipliers, and enjoy a mix of base-game hits and bonus rounds built around the God of Wealth theme.',
    howToPlay: [
      {
        title: 'Select your wager',
        description: 'Use the bet controls to set your wager level based on your budget.'
      },
      {
        title: 'Collect winning symbols',
        description:
          'Spin the reels to collect winning combinations. Special symbols can help you unlock free spins and higher multipliers.'
      },
      {
        title: 'Enter free spins mode',
        description:
          'Land the required scatter symbols to trigger free spins, where multipliers can significantly increase your total win.'
      }
    ]
  },
  {
    slug: 'sexy-baccarat',
    title: 'Sexy Baccarat Classic',
    provider: 'Evolution',
    categoryLabel: 'Live Casino',
    imageUrl:
      'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/game/thailand/777ww/sexy-baccarat-classic-%E0%B9%80%E0%B8%81%E0%B8%A1%E0%B8%AE%E0%B8%B4%E0%B8%95-%E0%B9%81%E0%B8%88%E0%B8%81%E0%B9%82%E0%B8%AB%E0%B8%94.jpg',
    shortDescription:
      'A live-dealer baccarat table featuring professional hosts, side bets and real-time streaming.',
    rating: '4.5 / 5',
    rtp: '97.00%',
    volatility: 'Medium',
    released: '2025-07-29',
    overview:
      'Sexy Baccarat Classic is a live baccarat experience streamed in HD with friendly dealers and a stylish studio setting. Players can place standard Player, Banker or Tie bets as well as select side bets for more variety.',
    howToPlay: [
      {
        title: 'Join the live table',
        description: 'Open the game and wait for the next betting round to begin before placing your chips.'
      },
      {
        title: 'Place your bets',
        description:
          'Choose between Player, Banker, Tie or available side bets, then confirm your wager before the timer expires.'
      },
      {
        title: 'Watch the outcome',
        description:
          'The dealer draws the cards and the side with the closest total to nine wins. Payouts are made automatically.'
      }
    ]
  },
  {
    slug: 'jackpot-joker',
    title: 'Jackpot Joker',
    provider: 'JILI',
    categoryLabel: 'Slot',
    imageUrl:
      'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/game/thailand/betluckmak/%E0%B9%81%E0%B8%95%E0%B8%81%E0%B8%AD%E0%B8%B5%E0%B8%81%E0%B9%81%E0%B8%A5%E0%B9%89%E0%B8%A7%20500x300.jpg',
    shortDescription:
      'A classic-style slot with modern graphics and the chance to hit impressive jackpot-style wins.',
    rating: '4.4 / 5',
    rtp: '96.70%',
    volatility: 'High',
    released: '2025-06-06',
    overview:
      'Jackpot Joker offers a familiar slot experience with bold symbols and straightforward mechanics. The focus is on chasing larger wins through stacked symbols and bonus features designed around the Joker character.',
    howToPlay: [
      {
        title: 'Adjust the coin value',
        description: 'Choose your coin value and number of lines to set your total bet per spin.'
      },
      {
        title: 'Spin and match symbols',
        description:
          'Press spin and land matching symbols on active paylines from left to right to receive payouts.'
      },
      {
        title: 'Aim for jackpot-style wins',
        description:
          'Watch for special Joker symbols and bonus rounds that can unlock the largest potential rewards.'
      }
    ]
  },
  {
    slug: 'super-niubi',
    title: 'Super Niubi',
    provider: 'JDB',
    categoryLabel: 'Table Game',
    imageUrl:
      'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/game/thailand/550ww/top-game.jpg',
    shortDescription:
      'An energetic table-style game with fast rounds and multiple betting options for experienced players.',
    rating: '4.3 / 5',
    rtp: '120.00%',
    volatility: 'Medium',
    released: '2025-07-28',
    overview:
      'Super Niubi is tailored for players who enjoy fast-paced betting and table action. With simple rules but many bet combinations, it rewards both strategy and luck across quick-fire rounds.',
    howToPlay: [
      {
        title: 'Learn the betting options',
        description: 'Review the paytable to understand the different bets and their respective payouts.'
      },
      {
        title: 'Place your chips',
        description:
          'Use the chip controls to select your wager amount and place bets on the layout before the round starts.'
      },
      {
        title: 'Follow the game result',
        description:
          'Once bets are closed, watch the round resolve and see which bets are paid out according to the results.'
      }
    ]
  },
  {
    slug: 'dragon-tiger-deluxe',
    title: 'Dragon Tiger Deluxe',
    provider: 'Evolution',
    categoryLabel: 'Live Casino',
    imageUrl:
      'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/game/thailand/88fed/sexy-baccarat.jpg',
    shortDescription:
      'A streamlined live table game where Dragon and Tiger go head to head in quick rounds.',
    rating: '4.4 / 5',
    rtp: '98.12%',
    volatility: 'Medium',
    released: '2025-07-25',
    overview:
      'Dragon Tiger Deluxe keeps rules simple: two cards are dealt, one to Dragon and one to Tiger. Players bet on which side will receive the higher card or on a Tie, making it ideal for those who enjoy rapid live casino action.',
    howToPlay: [
      {
        title: 'Join a table',
        description: 'Enter the live lobby, select Dragon Tiger Deluxe and wait for the next betting window.'
      },
      {
        title: 'Place Dragon or Tiger bets',
        description:
          'Bet on Dragon, Tiger or Tie, and confirm your wager before the countdown ends to join the round.'
      },
      {
        title: 'Check the winning side',
        description:
          'The dealer reveals both cards. The higher card wins and payouts are awarded automatically to winning bets.'
      }
    ]
  },
  {
    slug: 'sugar-rush-1000',
    title: 'Sugar Rush 1000',
    provider: 'Pragmatic Play',
    categoryLabel: 'Slot',
    imageUrl:
      'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/game/thailand/gxy888/gxy888-pp-slot-sugar-rush-1000.webp',
    shortDescription:
      'A high-volatility candy slot packed with multipliers and tumbling wins for massive potential payouts.',
    rating: '4.8 / 5',
    rtp: '96.20%',
    volatility: 'High',
    released: '2024-12-02',
    overview:
      'Sugar Rush 1000 is a fast-paced video slot from Pragmatic Play featuring a colourful candy theme, cascading reels and multiplier spots that can build up for huge wins. Match candy symbols across the reels, trigger free spins and watch multipliers stack up as you land consecutive hits.',
    howToPlay: [
      {
        title: 'Choose your bet',
        description: 'Set your preferred stake per spin using the bet controls before you start playing.'
      },
      {
        title: 'Spin the reels',
        description:
          'Press the spin button and aim to land clusters of matching candy symbols anywhere on the grid for a win.'
      },
      {
        title: 'Build multipliers',
        description:
          'Winning clusters increase multipliers on their positions. Trigger free spins to fully benefit from stacked multipliers.'
      }
    ]
  },
  {
    slug: 'lucky-gold-pots',
    title: 'Lucky Gold Pots',
    provider: 'Pragmatic Play',
    categoryLabel: 'Slot',
    imageUrl:
      'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/game/thailand/betluckmak/%E0%B9%81%E0%B8%95%E0%B8%81%E0%B8%AD%E0%B8%B5%E0%B8%81%E0%B9%81%E0%B8%A5%E0%B9%89%E0%B8%A7%20500x300.jpg',
    shortDescription:
      'An Irish-themed slot packed with wilds, multipliers and colourful animations around pots of gold.',
    rating: '4.2 / 5',
    rtp: '96.50%',
    volatility: 'High',
    released: '2025-01-05',
    overview:
      'Lucky Gold Pots invites players to chase pots of gold across the reels. With stacked wilds, scatter payouts and a feature-packed free spins round, the game delivers both charm and solid win potential.',
    howToPlay: [
      {
        title: 'Set your coin size',
        description: 'Adjust the coin value and number of lines to control the total cost per spin.'
      },
      {
        title: 'Spin for winning lines',
        description:
          'Press spin and line up matching symbols on active paylines from left to right to secure standard payouts.'
      },
      {
        title: 'Trigger bonus features',
        description:
          'Land scatter symbols or special bonus icons to unlock free spins and other bonus features with higher rewards.'
      }
    ]
  },
  {
    slug: 'ocean-treasure-hunt',
    title: 'Ocean Treasure Hunt',
    provider: 'JDB',
    categoryLabel: 'Fishing Game',
    imageUrl:
      'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/game/thailand/550ww/top-game.jpg',
    shortDescription:
      'An underwater-themed fishing game where you shoot at colourful sea creatures for instant rewards.',
    rating: '4.1 / 5',
    rtp: '110.00%',
    volatility: 'Low',
    released: '2025-08-18',
    overview:
      'Ocean Treasure Hunt reimagines slot-style payouts as a fishing shooter. Players select their bullet value and fire at targets on screen, with different sea creatures paying out at different rates.',
    howToPlay: [
      {
        title: 'Pick your bullet value',
        description: 'Set the cost per shot according to your bankroll before entering the fishing room.'
      },
      {
        title: 'Aim at targets',
        description:
          'Use the controls to move your cannon and fire at fish and special targets that swim across the screen.'
      },
      {
        title: 'Collect instant wins',
        description:
          'Each defeated target pays out according to its multiplier. Keep an eye out for rare creatures with the biggest rewards.'
      }
    ]
  }
]

const route = useRoute()

const game = computed(() => {
  const base = allGameDetails.find((g) => g.slug === String(route.params.slug))
  if (!base) return null

  const key = `gameDetails.${base.slug}`

  return {
    ...base,
    shortDescription: tx(`${key}.shortDescription`, base.shortDescription),
    overview: tx(`${key}.overview`, base.overview),
    howToPlay: base.howToPlay.map((step, i) => ({
      title: tx(`${key}.howToPlay.${i}.title`, step.title),
      description: tx(`${key}.howToPlay.${i}.description`, step.description),
    })),
  }
})
</script>

