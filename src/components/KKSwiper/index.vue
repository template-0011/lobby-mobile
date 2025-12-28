<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import './kkSwiper.less'
import { Navigation } from 'swiper/modules'
import type { IObject } from '@/01-kk-system/allHttp/types/common'
import { translateTextBy } from '@/utils/i18n'

defineOptions({
  name: 'KKSwiper',
})

const props = withDefaults(defineProps<{
  swiperList: IObject[]
  title?: string
  description?: string
  swiperWidth?: string
  showNav?: boolean
  classKey?: string
  icon?: string
}>(), {
  description: translateTextBy('web.i18nFront.label.seeMore'),
  swiperList: () => [],
  showNav: false,
  classKey: '01',
})

const emit = defineEmits<{
  onClickRight: [void]
}>()

const swiperDom = shallowRef<any>()
const navigation = ref({
  nextEl: `.swiper-btn-next-${props.classKey}`,
  prevEl: `.swiper-btn-prev-${props.classKey}`,
})

function onSwiper(swiper: any) {
  swiperDom.value = swiper
}

// function onNext() {
//   if (swiperDom.value) {
//     swiperDom.value?.sliderNext()
//   }
// }
// function onPre() {
//   if (swiperDom.value) {
//     swiperDom.value?.sliderPre()
//   }
// }
</script>

<template>
  <div class="kk-swiper-c">
    <div v-if="title" class="relative mx-2 mb-4 h-30px flex items-center justify-between color-[#224f7c]">
      <div class="title flex items-center gap-2 py-2 text-base font-600">
        <div class="bg-01 h-30px w-30px flex-center rounded-2 bg-[#2c3756] color-[#224f7c]">
          <svg-icon
            :icon-class="icon"
            size="20px"
            class="h-5 w-5 color-white transition"
          />
        </div>
        <p class="text-5 font-700 transition">
          {{ title }}
        </p>
      </div>
      <div class="flex items-center gap-1 text-12px" @click="emit('onClickRight')">
        <div class="text-right text-13px color-[#224f7c] font-500">
          {{ $t('system.i18nSystem.label.all') }}
        </div>
        <!-- <div class="text-11px color-[#94a6cd] lowercase">
          {{ description }}
        </div> -->
      </div>
    </div>
    <div class="relative">
      <Swiper
        slides-per-view="auto"
        :modules="[Navigation]"
        :navigation="showNav ? navigation : undefined"
        :space-between="0"
        :class="`kkSwiper-${classKey}`"
        @swiper="onSwiper"
      >
        <SwiperSlide v-for="(game, index) in swiperList" :key="index" :style="{ width: swiperWidth }">
          <slot :item-data="game" :index="index" />
        </SwiperSlide>
      </Swiper>
      <div v-if="showNav" :class="`swiper-btn-next-${classKey} navigation-btns -right-18px`">
        <van-icon name="arrow" />
      </div>
      <div v-if="showNav" :class="`swiper-btn-prev-${classKey} navigation-btns -left-18px`">
        <van-icon name="arrow-left" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
html.dark .navigation-btns {
  color: #ffffff;
}
.bg-01 {
  background-image: linear-gradient(
    320deg,
    rgba(252, 84, 21, 1) 0%,
    rgba(252, 84, 21, 1) 59%,
    rgba(237, 221, 83, 1) 100%
  );
}
</style>
