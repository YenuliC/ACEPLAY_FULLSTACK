// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  ssr: true,

  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:5000/api'
    }
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/i18n'
  ],

  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'en',
    langDir: 'locales/',
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'th', iso: 'th-TH', file: 'th.json', name: 'Thai' },
      { code: 'fil', iso: 'fil-PH', file: 'fil.json', name: 'Filipino' },
      { code: 'bn', iso: 'bn-BD', file: 'bn.json', name: 'Bengali' },
      { code: 'zh', iso: 'zh-CN', file: 'zh.json', name: 'Chinese' },
      { code: 'km', iso: 'km-KH', file: 'km.json', name: 'Khmer' },
      { code: 'vi', iso: 'vi-VN', file: 'vi.json', name: 'Vietman' },
      { code: 'id', iso: 'id-ID', file: 'id.json', name: 'Bahasa' }
    ],
    detectBrowserLanguage: false
  },

  app: {
    head: {
      title: 'ACEPlay - Online Casino Reviews',
      meta: [
        {
          name: 'description',
          content: 'Best Online Casino Reviews in Thailand, Philippines and Bangladesh'
        }
      ]
    }
  }
})
