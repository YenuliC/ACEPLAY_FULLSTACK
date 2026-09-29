<template>
  <footer class="border-t border-[#111827] bg-[#050608] py-8">
    <div class="max-w-6xl mx-auto px-3 sm:px-4 text-center">
      <div class="mb-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <p class="text-sm text-[#E5E7EB]">
          <span class="font-semibold text-[#F6B021]">ACEPlay</span>
          <span class="ml-1">{{ $t('footer.certifiedBy') }}</span>
        </p>
        <div class="flex flex-wrap items-center justify-center gap-3 sm:ml-3">
          <img src="https://aceplay.bet/_vercel/image?url=%2Fimg%2Fcertify%2Ftruste.webp&w=1536&q=100" alt="Certification 1" class="h-6 object-contain" />
          <img src="https://aceplay.bet/_vercel/image?url=%2Fimg%2Fcertify%2Fsucun.webp&w=1536&q=100" alt="Certification 2" class="h-6 object-contain" />
          <img src="https://aceplay.bet/_vercel/image?url=%2Fimg%2Fcertify%2Fnorton.webp&w=1536&q=100" alt="Certification 3" class="h-6 object-contain" />
          <img src="https://aceplay.bet/_vercel/image?url=%2Fimg%2Fcertify%2Fgpwa.webp&w=1536&q=100" alt="Certification 4" class="h-6 object-contain" />
          <img src="https://aceplay.bet/_vercel/image?url=%2Fimg%2Fcertify%2Fdmca.webp&w=1536&q=100" alt="Certification 5" class="h-6 object-contain" />
        </div>
      </div>

      <p class="text-xs text-[#9CA3AF]">
        Copyright © 2018 - {{ new Date().getFullYear() }} ACEPlay. {{ $t('footer.copyright') }}
      </p>
    </div>
  </footer>
</template>
