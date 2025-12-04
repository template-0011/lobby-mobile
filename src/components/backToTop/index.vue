<script setup lang="ts">
defineOptions({
  name: 'KKBackToTop',
})

const props = withDefaults(defineProps<{
  target?: string
}>(), {
  target: '',
})

function handleBackToTop() {
  if (props.target) {
    document.querySelector(props.target ?? '.kk-layout-body')?.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
  else {
    document.body.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
}
</script>

<template>
  <div class="kk-language-box kk-btn-bg" @click="handleBackToTop">
    <van-icon name="back-top" color="#ffffff" size="15px" />
  </div>
</template>

<style lang="less" scoped>
.kk-language-box {
  align-items: center;
  border-radius: 6px;
  display: flex;
  flex-shrink: 0;
  font-size: 12px;
  height: 24px;
  margin-left: 10px;
  min-width: 18px;
  overflow: hidden;
  padding: 0 8px;
  position: relative;
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
}
.kk-btn-bg {
  background-image: linear-gradient(112deg, #1e283f, rgba(20, 27, 46, 0.6) 100%);
}
</style>
