<script setup lang="ts">
defineOptions({
  name: 'MyAvatar',
})
withDefaults(defineProps<{
  size?: number
}>(), {
  size: 50,
})
</script>

<template>
  <div
    class="avatar flex-center rounded-full" :style="{ height: `${size}px`, width: `${size}px` }"
  >
    <img class="object-contain" :style="{ width: `${size - 4}px` }" src="@/assets/custom-images/mine/avatar-01.png" alt="">
  </div>
</template>

<style lang="less" scoped>
.avatar {
  border: 1px solid #0000004d;
}
html.dark .avatar {
  border: 1px solid #fff;
}
</style>
