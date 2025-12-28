<script setup lang="ts">
defineOptions({
  name: 'KKFooter',
})
</script>

<template>
  <div class="mt-12 pb-20 text-white">
    <div class="footer flex flex-col">
      <div class="flex flex-1 items-stretch">
        <div class="left w-[60%] flex shrink-0 flex-col items-center justify-end pb-7">
          <p>{{ $t('web.i18nFront.label.contact') }}</p>
          <div class="mt-3 flex-center gap-3">
            <a href="">
              <img class="w-7 object-contain" src="@/assets/custom-images/mine/telegram.png" alt="">
            </a>
            <a href="">
              <img class="w-7 object-contain" src="@/assets/custom-images/mine/youtube.png" alt="">
            </a>
            <a href="">
              <img class="w-7 object-contain" src="@/assets/custom-images/mine/facebook.png" alt="">
            </a>
          </div>
        </div>
        <div class="right flex flex-1 flex-col items-center">
          <img class="w-full object-contain" src="@/assets/custom-images/mine/person.png" alt="">
          <img class="max-w-100px w-full object-contain" src="@/assets/custom-images/mine/site-hint.png" alt="">
        </div>
      </div>
      <div class="mx-4 h-1">
        <svg width="100%" height="10" xmlns="http://www.w3.org/2000/svg"><line data-v-02c94589="" x1="0" y1="0" x2="100%" y2="0" stroke="rgba(157,163,173,0.4)" stroke-width="1" stroke-linecap="round" stroke-dasharray="3,3" /></svg>
      </div>
      <div class="mx-5">
        <img class="w-full object-contain" src="@/assets/custom-images/mine/site-right.png" alt="">
      </div>
      <div class="copyright flex-center text-10px color-#9da3ad99">
        <span>@ 2014-2024 6.0.7 <span>kk-game.</span><span>{{ $t('web.i18nFront.tips.siteRight') }}</span></span>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.footer {
  height: 240px;
  background: transparent url(@/assets/images/bg/bg_light.png) no-repeat;
  background-size: cover;
}

html.dark .footer {
  background: transparent url(@/assets/images/bg/bg2_dark.png) no-repeat;
  background-size: cover;
}
</style>
