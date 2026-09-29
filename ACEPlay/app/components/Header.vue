<template>
  <header class="sticky top-0 z-50 bg-black text-white">
    <div class="max-w-6xl mx-auto px-3 sm:px-4 py-4 flex items-center gap-4">
      <NuxtLink to="/" class="font-bold text-3xl text-[#F6B021] hover:opacity-90 transition-opacity">ACEPlay</NuxtLink>

      <div class="flex-1 flex justify-center">
        <nav class="hidden sm:flex items-center gap-6 text-sm md:text-base">
          <NuxtLink to="/" class="hover:text-[#F6B021] transition-colors">{{ t('nav.home') }}</NuxtLink>
          <NuxtLink to="/casino" class="hover:text-[#F6B021] transition-colors">{{ t('nav.casinos') }}</NuxtLink>
          <NuxtLink to="/games" class="hover:text-[#F6B021] transition-colors">{{ t('nav.games') }}</NuxtLink>
        </nav>
      </div>

      <!-- Language selector: flag + language name -->
      <div class="relative" ref="dropdownRef">
        <button
          type="button"
          class="flex items-center gap-1.5 bg-white text-black text-xs md:text-sm font-medium px-3 py-1.5 rounded-md min-w-[120px] justify-between"
          @click="isOpen = !isOpen"
        >
          <span class="flex items-center gap-1.5">
            <img :src="activeLang.flagUrl" :alt="activeLang.name" class="w-5 h-auto rounded-sm" />
            <span class="truncate">{{ activeLang.name }}</span>
          </span>
          <span class="text-[9px] text-black/60 ml-1">▼</span>
        </button>

        <div
          v-if="isOpen"
          class="absolute right-0 mt-1 w-40 rounded-md bg-white shadow-lg border border-gray-200 z-50 overflow-hidden"
        >
          <button
            v-for="lang in dropdownLanguages"
            :key="lang.code"
            type="button"
            class="w-full flex items-center gap-2 px-3 py-2 text-xs md:text-sm text-black hover:bg-gray-100 transition-colors"
            @click="handleSelect(lang.code)"
          >
            <img :src="lang.flagUrl" :alt="lang.name" class="w-5 h-auto rounded-sm" />
            <span>{{ lang.name }}</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { LANGUAGES, saveLocale, getStoredLocale, type LocaleCode } from '~/composables/useLanguage'


const { t, locale, setLocale } = useI18n()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const activeLang = computed(
  () => LANGUAGES.find((l) => l.code === locale.value) ?? LANGUAGES[0]
)

const dropdownLanguages = computed(() =>
  LANGUAGES.filter((l) => l.code !== locale.value)
)

const handleSelect = async (code: LocaleCode) => {
  await setLocale(code)
  saveLocale(code)
  isOpen.value = false
}

const handleOutsideClick = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(async () => {
  const saved = getStoredLocale()
  if (saved && saved !== locale.value) {
    await setLocale(saved)
  }

  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})
</script>
