<template>
  <article
    class="bg-[#171717] rounded-2xl border border-[#64748B]/50 px-7 py-7 flex flex-col h-full shadow-[0_0_0_1px_rgba(15,23,42,0.6)] transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/20"
  >
    <!-- Flag -->
    <div class="mb-5 flex justify-center">
      <div class="h-20 w-28 rounded-xl overflow-hidden bg-black/40 flex items-center justify-center">
        <img
          :src="flagUrl"
          :alt="`${countryName} flag`"
          class="h-full w-full object-cover"
        />
      </div>
    </div>

    <!-- Country name + count on same line -->
    <div class="mb-4 flex items-baseline gap-1">
      <h2
        class="text-sm md:text-base font-semibold bg-gradient-to-r from-[#F6B021] to-[#F27F10] bg-clip-text text-transparent"
      >
        {{ countryName }}
      </h2>
      <p class="text-xs md:text-sm text-[#64748B]">
        • {{ casinosCount }} Casinos
      </p>
    </div>

    <!-- Payments -->
    <div class="mb-5">
      <p class="text-sm md:text-base text-[#64748B] mb-2">{{ $t('casino.payment') }}</p>
      <div class="rounded-lg bg-[#21242B] px-3 py-2">
        <div class="flex flex-wrap gap-1.5">
          <div
            v-for="(logo, index) in paymentLogos"
            :key="index"
            class="h-7 w-7 rounded-lg bg-black/40 flex items-center justify-center overflow-hidden"
          >
          <img :src="logo" alt="Payment method" class="h-full w-full object-contain" />
        </div>
        </div>
      </div>
    </div>

    <!-- Top casinos -->
    <div class="mb-6">
      <p class="text-sm md:text-base font-medium text-white mb-2">{{ $t('casino.topCasinos') }}</p>
      <div class="rounded-lg bg-[#21242B] px-3 py-2">
        <div class="flex flex-wrap gap-2">
          <div
            v-for="(logo, index) in topCasinoLogos"
            :key="index"
            class="h-8 w-8 rounded-lg bg-black/40 flex items-center justify-center overflow-hidden"
          >
            <img :src="logo" alt="Casino logo" class="h-full w-full object-contain" />
          </div>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="mt-auto pt-2">
      <NuxtLink
        v-if="ctaTo"
        :to="ctaTo"
        class="w-full rounded-xl bg-gradient-to-r from-[#F6B021] to-[#F27F10] text-black text-sm md:text-base py-3 flex items-center justify-center gap-2"
      >
        <span>{{ $t('casino.findLocalCasino') }}</span>
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
        class="w-full rounded-xl bg-gradient-to-r from-[#F6B021] to-[#F27F10] text-black text-sm md:text-base py-3 flex items-center justify-center gap-2"
      >
        <span>{{ $t('casino.findLocalCasino') }}</span>
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
  </article>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    countryName: string
    casinosCount: string | number
    paymentLogos: string[]
    topCasinoLogos: string[]
    flagUrl?: string
    ctaTo?: string | null
  }>(),
  {
    flagUrl: 'https://dummyimage.com/120x80/020617/e5e7eb.png&text=FLAG',
    ctaTo: null,
  }
)
</script>

