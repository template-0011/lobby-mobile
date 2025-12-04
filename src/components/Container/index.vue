<script setup lang="ts">
defineOptions({
  name: 'PageContainer',
})
defineProps({
  title: String,
  clickLeft: Function,
})
</script>

<template>
  <div class="h-screen flex flex-col">
    <TopNav :title="title" @click-left="clickLeft" />
    <div class="content flex-1">
      <slot />
    </div>
  </div>
</template>

<style lang="less" scoped>
.content {
  height: calc(100vh - 46px);
}
</style>
