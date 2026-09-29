<template>
  <div class="min-h-screen bg-[#050608] text-white">
    <main class="max-w-6xl mx-auto px-3 sm:px-4 pt-8 pb-20">
      <!-- Breadcrumbs -->
      <nav class="mb-6 text-xs md:text-sm flex items-center gap-2 text-[#818898]">
        <NuxtLink to="/" class="hover:text-white transition-colors">{{ $t('nav.home') }}</NuxtLink>
        <span class="text-[#818898]">›</span>
        <span class="text-white">{{ $t('nav.casinos') }}</span>
      </nav>

      <!-- Heading & description -->
      <header class="mb-10">
        <h1
          class="text-3xl md:text-5xl font-bold mb-8"
        >
          {{ $t('casino.pageTitle') }}
        </h1>
        <p class="text-base md:text-lg text-white/90 leading-relaxed">
          {{ $t('casino.pageDesc') }}
        </p>
      </header>

      <!-- Country cards -->
      <section class="grid gap-6 md:grid-cols-3">
        <CasinoListcard
          country-name="Thailand"
          casinos-count="8"
          flag-url="https://aceplay.bet/_vercel/image?url=%2Fimg%2Fcountry%2Fth.webp&w=1536&q=100"
          :top-casino-logos="thailandTopCasinos"
          :payment-logos="thailandpayment"
          cta-to="/casino/thailand"
        />

        <CasinoListcard
          country-name="Philippines"
          casinos-count="6"
          flag-url="https://aceplay.bet/_vercel/image?url=%2Fimg%2Fcountry%2Fph.webp&w=1536&q=100"
          :top-casino-logos="philippinesTopCasinos"
          :payment-logos="philippinespayment"
          cta-to="/casino/philippines"
        />

        <CasinoListcard
          country-name="Bangladesh"
          casinos-count="1"
          flag-url="https://aceplay.bet/_vercel/image?url=%2Fimg%2Fcountry%2Fbd.webp&w=1536&q=100"
          :top-casino-logos="bangladeshTopCasinos"
          :payment-logos="bangladeshpayment"
          cta-to="/casino/bangladesh"
        />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import CasinoListcard from '~/components/casinoListcard.vue'

const thailandpayment = [
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/payment/promptpay.png',
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/payment/truemoney.png',
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/payment/usdt.png',
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/payment/bitcoin.png',
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/payment/ethereum.png',
]

const philippinespayment = [
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/payment/gcash.png',
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/payment/paymaya.jpg',
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/payment/gotyme.jpeg',
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/payment/grabpay.png',
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/payment/qrph.jpg',
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/payment/usdt.png',
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/payment/bitcoin.png',
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/payment/ethereum.png',
]

const bangladeshpayment = [
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/payment/bkash.png',
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/payment/nagad.jpeg',
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/payment/rocket.jpg',
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/payment/upay.png',
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/payment/usdt.png',
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/payment/bitcoin.png',
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/payment/ethereum.png',
]

const thailandTopCasinos = [
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/thailand/gxy888.png',
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/thailand/betluckmak.jpg',
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/thailand/550ww.png',
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/thailand/heng9999.png',
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/thailand/ubet89.png',
]

const philippinesTopCasinos = [
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/philippines/7spin.png',
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/philippines/jilino1.png',
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/philippines/betso88.png',
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/philippines/ssbet77.webp',
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/philippines/milyon88.png',
]

const bangladeshTopCasinos = [
  'https://j99jfc6l8uchv7rv.public.blob.vercel-storage.com/logo/bangladesh/borojeet.png',
]

</script>
