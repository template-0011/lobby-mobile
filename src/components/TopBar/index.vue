<script setup lang="ts">
import useAppStore from '@/store/modules/app'

defineOptions({
  name: 'KkTopBar',
})

const stars = ref(4.5)

const appStore = useAppStore()

function handleClose() {
  appStore.setShowTopBar(false)
}
</script>

<template>
  <div v-if="appStore.showTopBar" class="fixed left-0 top-0 z-100 h-[57px] w-full flex items-center justify-between bg-[var(--color-n700)] px-3 text-white">
    <div class="flex items-center gap-2">
      <van-icon name="cross" color="#fff" size="18" @click="handleClose" />
      <div class="h-8 w-8 overflow-hidden rounded-2 bg-white">
        <img src="@/assets/custom-images/app/logo.png" alt="logo" class="h-6 w-6">
      </div>
      <div class="flex flex-col items-start gap-1">
        <span class="text-14px">app name</span>
        <van-rate v-model="stars" size="14" color="#fff" void-color="#eee" readonly allow-half />
      </div>
    </div>
    <div class="flex items-center justify-end gap-2">
      <span class="text-14px font-bold">{{ $t('web.i18nFront.label.download') }}</span>
      <span class="text-16px font-bold">
        <div class="i-carbon:download text-5 font-bold" />
      </span>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
