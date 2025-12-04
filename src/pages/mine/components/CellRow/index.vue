<script setup lang="ts">
defineOptions({
  name: 'CellRow',
})

defineProps({
  image: String,
  title: String,
  icon: String,
  showBottomLine: {
    type: Boolean,
    default: true,
  },
  subTitle: String,
})
</script>

<template>
  <div class="kk-row-item flex justify-between gap-3 py-3 text-sm">
    <div class="flex-1 overflow-hidden color-white">
      <p class="pl-3">
        {{ title }}
      </p>
      <p class="mt-10px pl-3 text-13px color-#5c72a3">
        {{ subTitle }}
      </p>
    </div>
    <div class="mr-3 h-30px w-30px flex flex-1 items-center justify-end">
      <img v-if="icon" class="w-30px object-contain" :src="icon" alt="">
      <slot name="left" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.kk-row-item {
  background: linear-gradient(107.15deg, #1e283f, rgba(20, 27, 46, 0.6));
  border-radius: 10px;
  padding: 15px 0;
}
</style>
