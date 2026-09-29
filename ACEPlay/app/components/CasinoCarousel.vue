<template>
  <div class="relative">
    <!-- Left arrow -->
    <button
      type="button"
      class="hidden md:flex pointer-events-auto absolute inset-y-0 left-0 z-10 h-full items-center pl-1"
      @click="prev"
    >
      <span
        class="h-9 w-9 rounded-full flex items-center justify-center text-transparent border border-[#F6B021]/70 bg-gradient-to-r from-[#F6B021] to-[#F27F10] bg-clip-text"
      >
        ‹
      </span>
    </button>

    <!-- Right arrow -->
    <button
      type="button"
      class="hidden md:flex pointer-events-auto absolute inset-y-0 right-0 z-10 h-full items-center pr-1"
      @click="next"
    >
      <span
        class="h-9 w-9 rounded-full flex items-center justify-center text-transparent border border-[#F6B021]/70 bg-gradient-to-r from-[#F6B021] to-[#F27F10] bg-clip-text"
      >
        ›
      </span>
    </button>

    <!-- Carousel track -->
    <div class="overflow-hidden">
      <div
        class="flex transition-transform duration-500 ease-out"
        :style="{ transform: `translateX(-${activePage * 100}%)` }"
      >
        <div
          v-for="(page, pageIndex) in pages"
          :key="pageIndex"
          class="w-full flex-shrink-0 flex justify-center gap-7 md:gap-8 px-2 md:px-3"
        >
          <article
            v-for="(card, index) in page"
            :key="card.id ?? index"
            class="w-full max-w-[360px] bg-[#171717] rounded-2xl border border-[#64748B]/50 px-7 py-7 md:px-8 md:py-8 flex flex-col shadow-[0_0_0_1px_rgba(15,23,42,0.6)] transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/20"
          >
            <!-- Popular game layout -->
            <template v-if="variant === 'game'">
              <!-- Thumbnail -->
              <div class="mb-4 -mt-8 -mx-7 md:-mx-8 rounded-t-2xl overflow-hidden">
                <img
                  :src="(card as GameCard).thumbnailImage"
                  :alt="(card as GameCard).id + ' thumbnail'"
                  class="w-full h-36 md:h-44 object-cover"
                />
              </div>

              <!-- ID + casino name -->
              <p class="mb-3">
                <span
                  class="bg-gradient-to-r from-[#F6B021] to-[#F27F10] bg-clip-text text-transparent font-semibold text-base md:text-md"
                >
                  {{ (card as GameCard).id }}
                </span>
                <span
                  class="ml-1 align-baseline text-xs md:text-sm text-white/90 font-normal"
                >
                  • {{ (card as GameCard).casinoName }}
                </span>
              </p>

              <!-- Stats -->
              <div class="space-y-2 text-xs md:text-sm">
                <p>
                  <span class="text-[#818898]">{{ t('games.winningRate') }}: </span>
                  <span class="text-white/90">
                    {{ (card as GameCard).winningRate }}
                  </span>
                </p>
                <p>
                  <span class="text-[#21E850]">{{ t('games.highestWinning') }}</span>
                  <span class="text-white/90">
                    • {{ (card as GameCard).highestWinning }}
                  </span>
                </p>
                <p class="flex items-center gap-3">
                  <span>
                    <span class="text-[#818898]">{{ t('games.bet') }}: </span>
                    <span class="text-white/90">
                      {{ (card as GameCard).bet }}
                    </span>
                  </span>
                  <span>
                    <span class="text-[#818898]">{{ t('games.win') }}: </span>
                    <span class="text-white/90">
                      {{ (card as GameCard).win }}
                    </span>
                  </span>
                  <span class="ml-auto">
                    <span
                      class="inline-flex items-center rounded-md bg-gradient-to-r from-[#F6B021] to-[#F27F10] px-3 py-1 text-[11px] md:text-xs text-black"
                    >
                      {{ (card as GameCard).turnover }}
                    </span>
                  </span>
                </p>
              </div>

              <!-- Play button -->
              <div class="mt-5 flex justify-center">
                <button
                  type="button"
                  class="w-full rounded-xl bg-gradient-to-r from-[#F6B021] to-[#F27F10] text-black text-sm md:text-base py-2.5 flex items-center justify-center gap-2"
                >
                  <span>{{ t('games.playNow') }}</span>
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
              </div>
            </template>

            <!-- Promotion layout -->
            <template v-else-if="variant === 'promotion'">
              <!-- Banner image -->
              <div class="mb-4 -mt-7 -mx-7 md:-mx-8 rounded-t-2xl overflow-hidden">
                <img
                  :src="(card as PromotionCard).imageUrl"
                  :alt="(card as PromotionCard).casinoName + ' promotion'"
                  class="w-full h-36 md:h-44 object-cover"
                />
              </div>

              <!-- Description + brand -->
              <p class="mb-2 text-base md:text-lg font-semibold text-white leading-relaxed">
                {{ (card as PromotionCard).description }}
              </p>
              <p class="mb-4 text-sm md:text-base text-white/80 uppercase tracking-wide">
                {{ (card as PromotionCard).casinoName }}
              </p>

              <!-- Deposit / Bonus -->
              <div
                class="mb-4 rounded-xl bg-[#11131A] px-4 py-3 flex items-center justify-between text-sm md:text-base"
              >
                <div>
                  <p class="text-[#64748B] font-semibold">{{ t('casino.deposit') }}</p>
                  <p class="text-white">
                    {{ (card as PromotionCard).deposit }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-[#64748B] font-semibold">{{ t('casino.bonus') }}</p>
                  <p class="text-white">
                    {{ (card as PromotionCard).bonus }}
                  </p>
                </div>
              </div>

              <!-- Stats icons row -->
              <div class="mb-4 grid grid-cols-2 gap-3 text-xs md:text-sm">
                <div class="flex items-center gap-2">
                  <div class="h-9 w-9 rounded-xl bg-[#2B271F] flex items-center justify-center">
                    <span
                      class="bg-gradient-to-r from-[#F6B021] to-[#F27F10] bg-clip-text text-transparent text-base"
                    >
                      T
                    </span>
                  </div>
                  <div>
                    <p class="text-[#64748B] font-semibold">{{ t('promo.turnover') }}</p>
                    <p class="text-white">
                      {{ (card as PromotionCard).turnover }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <div class="h-9 w-9 rounded-xl bg-[#2B271F] flex items-center justify-center">
                    <span
                      class="bg-gradient-to-r from-[#F6B021] to-[#F27F10] bg-clip-text text-transparent text-base"
                    >
                      W
                    </span>
                  </div>
                  <div>
                    <p class="text-[#64748B] font-semibold">{{ t('promo.totalWins') }}</p>
                    <p class="text-white">
                      {{ (card as PromotionCard).totalWins }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <div class="h-9 w-9 rounded-xl bg-[#2B271F] flex items-center justify-center">
                    <span
                      class="bg-gradient-to-r from-[#F6B021] to-[#F27F10] bg-clip-text text-transparent text-base"
                    >
                      M
                    </span>
                  </div>
                  <div>
                    <p class="text-[#64748B] font-semibold">{{ t('promo.maxWithdrawal') }}</p>
                    <p class="text-white">
                      {{ (card as PromotionCard).maxWithdrawal }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <div class="h-9 w-9 rounded-xl bg-[#2B271F] flex items-center justify-center">
                    <span
                      class="bg-gradient-to-r from-[#F6B021] to-[#F27F10] bg-clip-text text-transparent text-base"
                    >
                      G
                    </span>
                  </div>
                  <div>
                    <p class="text-[#64748B] font-semibold">{{ t('promo.gameType') }}</p>
                    <p class="text-white">
                      {{ (card as PromotionCard).gameType }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Promotion buttons -->
              <div class="mt-auto flex w-full gap-3 pt-3">
                <button
                  type="button"
                  class="flex-1 rounded-xl bg-gradient-to-r from-[#F6B021] to-[#F27F10] text-black text-sm md:text-base py-2.5 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>{{ t('promo.joinNow') }}</span>
                  <span class="inline-flex items-center justify-center flex-shrink-0">
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
                <button
                  type="button"
                  class="flex items-stretch rounded-xl bg-gradient-to-r from-[#F6B021] to-[#F27F10] p-[1px] text-sm md:text-base"
                >
                  <span
                    class="flex items-center justify-center rounded-[10px] bg-[#151921] py-2.5 px-4 text-gray-100 whitespace-nowrap"
                  >
                    {{ t('promo.allPromotions') }}
                  </span>
                </button>
              </div>
            </template>

            <!-- Top casino layout -->
            <template v-else>
              <!-- Logo -->
              <div class="mb-4 flex justify-center">
                <div
                  class="h-20 w-20 md:h-24 md:w-24 rounded-3xl bg-black/40 flex items-center justify-center overflow-hidden"
                >
                  <img
                    v-if="(card as CasinoCard).logoImage"
                    :src="(card as CasinoCard).logoImage"
                    :alt="(card as CasinoCard).name + ' logo'"
                    class="h-full w-full object-contain"
                  />
                  <span v-else-if="(card as CasinoCard).logoText" class="text-xs font-semibold text-white">
                    {{ (card as CasinoCard).logoText }}
                  </span>
                  <span v-else class="text-xs font-semibold text-white">
                    Logo
                  </span>
                </div>
              </div>

              <!-- Description -->
              <p class="mb-4 text-sm md:text-base font-semibold text-white leading-relaxed text-center">
                {{ (card as CasinoCard).description }}
              </p>

              <!-- ID + name -->
              <p class="mb-2 text-xs md:text-sm tracking-wide text-center">
                <span
                  class="bg-gradient-to-r from-[#F6B021] to-[#F27F10] bg-clip-text text-transparent font-semibold text-base md:text-lg uppercase"
                >
                  {{ (card as CasinoCard).id }}
                </span>
                <span
                  v-if="(card as CasinoCard).name && (card as CasinoCard).name !== (card as CasinoCard).id"
                  class="block text-[11px] md:text-xs text-gray-300 mt-1"
                >
                  {{ (card as CasinoCard).name }}
                </span>
              </p>

              <!-- Rating -->
              <div class="mb-5 flex items-center justify-center gap-1.5 text-base md:text-lg text-gray-200">
                <div class="flex items-center gap-0.5 text-[#F6B021] text-base md:text-lg">
                  <span v-for="n in 5" :key="n">★</span>
                </div>
                <span class="ml-2 text-sm md:text-base font-semibold">{{ (card as CasinoCard).rating }}</span>
              </div>

              <!-- Buttons -->
              <div class="mt-auto flex w-full gap-3 pt-3">
                <button
                  type="button"
                  class="flex-1 rounded-xl bg-gradient-to-r from-[#F6B021] to-[#F27F10] text-black text-sm md:text-base py-2.5 flex items-center justify-center gap-2"
                >
                  <span>{{ t('games.playNow') }}</span>
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
                <button
                  type="button"
                  class="rounded-xl bg-gradient-to-r from-[#F6B021] to-[#F27F10] p-[1px] text-sm md:text-base"
                >
                  <span
                    class="block w-full rounded-[10px] bg-[#151921] py-2.5 px-4 text-center text-gray-100 whitespace-nowrap"
                  >
                    {{ t('common.more') }}
                  </span>
                </button>
              </div>
            </template>
          </article>
        </div>
      </div>
    </div>

    <!-- Dots -->
    <div class="mt-4 flex justify-center gap-2">
      <button
        v-for="pageIndex in pages.length"
        :key="pageIndex"
        type="button"
        class="h-2.5 w-2.5 rounded-full border border-[#64748B]/50 transition-colors"
        :class="pageIndex - 1 === activePage ? 'bg-[#F6B021] border-[#F6B021]' : 'bg-transparent'"
        @click="goTo(pageIndex - 1)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const { t } = useI18n()

interface BaseCard {
  id: string | number
}

interface CasinoCard extends BaseCard {
  name: string
  logoText?: string
  logoImage?: string
  description: string
  rating: string
  badge?: string
  bonus?: string
  reviews?: number
}

interface GameCard extends BaseCard {
  casinoName: string
  thumbnailImage: string
  winningRate: string
  highestWinning: string
  bet: string
  win: string
  turnover: string
}

interface PromotionCard extends BaseCard {
  casinoName: string
  description: string
  imageUrl: string
  deposit: string
  bonus: string
  turnover: string
  totalWins: string
  maxWithdrawal: string
  gameType: string
}

type CarouselCard = CasinoCard | GameCard | PromotionCard

const props = defineProps<{
  cards: CarouselCard[]
  perPage?: number
  variant?: 'casino' | 'game' | 'promotion'
}>()

const perPage = computed(() => props.perPage ?? 3)

const pages = computed<CarouselCard[][]>(() => {
  const result: CarouselCard[][] = []
  const chunkSize = perPage.value || 1

  for (let i = 0; i < props.cards.length; i += chunkSize) {
    result.push(props.cards.slice(i, i + chunkSize))
  }

  return result
})

const activePage = ref(0)

const goTo = (index: number) => {
  const total = pages.value.length
  if (!total) return
  const normalised = ((index % total) + total) % total
  activePage.value = normalised
}

const prev = () => {
  goTo(activePage.value - 1)
}

const next = () => {
  goTo(activePage.value + 1)
}
</script>

