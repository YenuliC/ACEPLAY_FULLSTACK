<template>
  <div class="bg-gradient-to-r from-[#F6B021]/50 to-[#F27F10]/50 rounded-2xl p-[0.5px] h-full">
    <article
      class="bg-[#171717] rounded-2xl border border-[#64748B]/50 px-7 py-7 flex flex-col h-full shadow-[0_0_0_1px_rgba(15,23,42,0.6)] transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/20"
    >
      <!-- Casino logo: top center -->
      <div class="mb-4 flex justify-center">
        <div class="h-20 w-20 md:h-24 md:w-24 rounded-2xl overflow-hidden bg-black/40 flex items-center justify-center">
          <img :src="imageUrl" :alt="`${name} logo`" class="h-full w-full object-contain" />
        </div>
      </div>

      <!-- Casino name -->
      <div class="mb-3 flex flex-wrap items-baseline gap-2 text-left">
        <h2
          class="text-lg md:text-lg font-bold bg-gradient-to-r from-[#F6B021] to-[#F27F10] bg-clip-text text-transparent"
        >
          {{ name }}
        </h2> 
        <p class="text-xs md:text-sm text-[#818898] font-normal"> • 
          {{ sinceLabel }}
        </p>
      </div>

      <!-- Description -->
      <p class="mb-4 text-sm md:text-base font-medium text-white leading-relaxed">
        {{ description }}
      </p>

      <!-- Deposit, Bonus, Receive-->
      <div class="mb-3 rounded-xl bg-[#151921] px-4 py-3 border border-[#F6B021]/40">
        <div class="flex items-center justify-between gap-2">
          <div class="flex-1 text-center">
            <p class="text-xs md:text-sm text-[#818898] mb-1">{{ $t('casino.deposit') }}</p>
            <p class="text-base md:text-lg font-semibold text-white">{{ deposit }}</p>
          </div>
          <span class="text-[#818898] text-sm">→</span>
          <div class="flex-1 text-center">
            <p class="text-xs md:text-sm text-[#818898] mb-1">{{ $t('casino.bonus') }}</p>
            <p class="text-base md:text-lg font-semibold text-white">{{ bonus }}</p>
          </div>
          <span class="text-[#818898] text-sm">→</span>
          <div class="flex-1 text-center">
            <p class="text-xs md:text-sm text-[#818898] mb-1">{{ $t('casino.receive') }}</p>
            <p class="text-base md:text-lg font-semibold text-white">{{ receive }}</p>
          </div>
        </div>
        <p class="mt-3 text-xs md:text-xs text-[#e6e6e6] text-center">
          {{ turnoverText }}
        </p>
      </div>

      <!-- Deposit Range / Withdrawal -->
      <div class="mb-4 space-y-2">
        <div class="flex items-center justify-between rounded-lg bg-[#221F18] px-3 py-3">
          <p class="text-xs md:text-sm text-[#818898]">{{ $t('casino.depositRange') }}:</p>
          <p class="text-sm md:text-sm text-white">{{ depositRange }}</p>
        </div>
        <div class="flex items-center justify-between rounded-lg bg-[#221F18] px-3 py-2.5">
          <p class="text-xs md:text-sm text-[#818898]">{{ $t('casino.withdrawalRange') }}:</p>
          <p class="text-xs md:text-sm text-white">{{ withdrawalRange }}</p>
        </div>
      </div>

      <!-- View More -->
      <div class="mt-auto flex flex-col gap-2 pt-2">
        <NuxtLink
          v-if="viewMoreTo"
          :to="viewMoreTo"
          class="w-full rounded-xl bg-gradient-to-r from-[#F6B021] to-[#F27F10] text-black text-sm md:text-base py-2.5 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span>{{ $t('casino.viewMore') }}</span>
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
      </NuxtLink>
        <button
          v-else
          type="button"
          class="w-full rounded-xl bg-gradient-to-r from-[#F6B021] to-[#F27F10] text-black text-sm md:text-base py-2.5 flex items-center justify-center gap-2"
        >
          <span>{{ $t('casino.viewMore') }}</span>
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

        <button
          type="button"
          class="w-full rounded-xl bg-[#151921] border border-[#F6B021] text-white text-sm md:text-base py-2.5 flex items-center justify-center"
        >
          {{ $t('casino.getPromotion') }}
        </button>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
export interface CasinoDetail {
  id: string
  name: string
  sinceLabel: string
  description: string
  imageUrl: string
  deposit: string
  bonus: string
  receive: string
  turnoverText: string
  depositRange: string
  withdrawalRange: string
}

withDefaults(
  defineProps<CasinoDetail & { viewMoreTo?: string | null }>(),
  { viewMoreTo: null }
)
</script>

