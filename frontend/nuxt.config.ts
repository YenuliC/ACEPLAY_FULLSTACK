export default defineNuxtConfig({
  // Admin panel — no SEO needed, SPA mode prevents SSR auth flash
  ssr: false,

  css: ["~/assets/css/theme.css"],

  compatibilityDate: "2024-11-01",

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:5000/api"
    }
  }
});
