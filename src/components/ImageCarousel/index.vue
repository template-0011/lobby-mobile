<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { EffectCoverflow, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

defineOptions({
  name: 'ImageCarousel',
})

const props = withDefaults(defineProps<{
  images: ImageItem[]
  showNavigation?: boolean
  showPagination?: boolean
  autoplay?: boolean
  autoplayDelay?: number
  height?: string
  onSlideClick?: (item: ImageItem, index: number) => void
}>(), {
  images: () => [],
  showNavigation: true,
  showPagination: true,
  autoplay: false,
  autoplayDelay: 3000,
  height: '300px',
})

const emit = defineEmits<{
  slideChange: [currentIndex: number, currentItem: ImageItem]
  slideClick: [item: ImageItem, index: number]
}>()

interface ImageItem {
  id: string | number
  src: string
  alt?: string
  title?: string
  description?: string
}

const swiperRef = shallowRef<any>()
const currentIndex = ref(0)

// Swiper modules
const modules = [EffectCoverflow, Navigation, Pagination]

// Swiper 实例回调
function onSwiper(swiper: any) {
  swiperRef.value = swiper
}

// 滑动变化回调
function onSlideChange(swiper: any) {
  currentIndex.value = swiper.activeIndex
  const currentItem = props.images[swiper.activeIndex]
  if (currentItem) {
    emit('slideChange', swiper.activeIndex, currentItem)
  }
}

// 点击滑块
function onSlideClick(item: ImageItem, index: number) {
  emit('slideClick', item, index)
  props.onSlideClick?.(item, index)
}

// 跳转到指定滑块
function slideTo(index: number) {
  if (swiperRef.value) {
    swiperRef.value.slideTo(index)
  }
}

// 下一张
function slideNext() {
  if (swiperRef.value) {
    swiperRef.value.slideNext()
  }
}

// 上一张
function slidePrev() {
  if (swiperRef.value) {
    swiperRef.value.slidePrev()
  }
}

console.log('images', props.images)

// 暴露方法给父组件
defineExpose({
  slideTo,
  slideNext,
  slidePrev,
  getCurrentIndex: () => currentIndex.value,
  getCurrentItem: () => props.images[currentIndex.value],
})
</script>
<!-- effect="coverflow" -->
<!-- :coverflow-effect="{
  rotate: 0,
  stretch: 0,
  depth: 0,
  modifier: 1.5,
  slideShadows: false,
}" -->

<template>
  <div class="image-carousel" :style="{ height }">
    <Swiper
      ref="swiperRef"
      :modules="modules"
      effect="creative"
      :grab-cursor="true"
      :centered-slides="true"
      :slides-per-view="1.1"
      :space-between="10"
      :loop="true"
      :autoplay="autoplay ? { delay: autoplayDelay, disableOnInteraction: false } : false"
      :creative-effect="{
        prev: {
          shadow: true,
          translate: ['-110%', 0, -500],
        },
        next: {
          shadow: true,
          translate: ['110%', 0, -500],
        },
      }"
      :pagination="showPagination ? { clickable: true } : false"
      :navigation="showNavigation"
      class="image-carousel-swiper"
      @swiper="onSwiper"
      @slide-change="onSlideChange"
    >
      <SwiperSlide
        v-for="(image, index) in images"
        :key="image.id"
        class="image-carousel-slide"
        @click="onSlideClick(image, index)"
      >
        <div class="slide-content">
          <img
            :src="image.src"
            :alt="image.alt || `Image ${index + 1}`"
            class="slide-image"
          >
          <div v-if="image.title || image.description" class="slide-info">
            <h3 v-if="image.title" class="slide-title">
              {{ image.title }}
            </h3>
            <p v-if="image.description" class="slide-description">
              {{ image.description }}
            </p>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<style lang="less" scoped>
.image-carousel {
  --carousel-primary-color: var(--primary-color, #007bff);
  --carousel-bg-color: #090f1e;
  --carousel-text-color: #333333;
  --carousel-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

html.dark .image-carousel {
  --carousel-bg-color: #1a1a1a;
  --carousel-text-color: #ffffff;
  --carousel-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

// 确保 swiper 正确加载
.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 0;
}

// 修复可能的样式冲突
.image-carousel-swiper {
  .swiper-wrapper {
    align-items: center;
  }
}
.image-carousel {
  width: 100%;
  position: relative;

  .image-carousel-swiper {
    width: 100%;
    height: 100%;

    .image-carousel-slide {
      // width: calc(100% - 30px);
      cursor: pointer;
      transition: all 0.3s ease;

      .slide-content {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;

        &:hover {
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }

        .slide-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .slide-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: auto;
          padding: 8px 12px;
          text-align: left;

          .slide-title {
            font-size: 14px;
            font-weight: 600;
            margin: 0 0 4px 0;
            color: #333;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .slide-description {
            font-size: 12px;
            margin: 0;
            color: #666;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }

    // 当前激活的滑块样式
    .swiper-slide-active .slide-content {
      transform: scaleY(1);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    }

    // 相邻滑块样式
    .swiper-slide-next,
    .swiper-slide-prev {
      .slide-content {
        transform: scaleY(0.8);
        opacity: 0.7;
      }
    }
  }

  // 分页器样式
  :deep(.swiper-pagination) {
    bottom: 0px;

    .swiper-pagination-bullet {
      background: rgba(255, 255, 255, 0.5);
      opacity: 1;

      &.swiper-pagination-bullet-active {
        background: var(--primary-color, #007bff);
      }
    }
  }

  // 导航按钮样式
  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    color: var(--primary-color, #007bff);
    background: rgba(255, 255, 255, 0.9);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-top: -20px;

    &:after {
      font-size: 16px;
      font-weight: 600;
    }

    &:hover {
      background: rgba(255, 255, 255, 1);
      transform: scale(1.1);
    }
  }

  :deep(.swiper-button-next) {
    right: 20px;
  }

  :deep(.swiper-button-prev) {
    left: 20px;
  }
}

// 暗色模式适配
html.dark .image-carousel {
  .slide-info {
    background: rgba(30, 30, 30, 0.95) !important;

    .slide-title {
      color: #fff !important;
    }

    .slide-description {
      color: #ccc !important;
    }
  }

  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    background: rgba(30, 30, 30, 0.9);
    color: #fff;

    &:hover {
      background: rgba(30, 30, 30, 1);
    }
  }

  :deep(.swiper-pagination-bullet) {
    background: rgba(255, 255, 255, 0.3);

    &.swiper-pagination-bullet-active {
      background: var(--primary-color, #007bff);
    }
  }
}
</style>
