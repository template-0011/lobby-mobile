<script setup lang="ts">
defineOptions({
  name: 'KKLoading',
})

defineProps<{
  color?: string
}>()
</script>

<template>
  <span class="kk-loader1" :style="{ borderColor: color }" />
</template>

<style scoped>
.kk-loader1 {
  width: 24px;
  height: 24px;
  border: 4px dotted #515151;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  animation: kk-l1-rotation 2s linear infinite;
}

@keyframes kk-l1-rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
