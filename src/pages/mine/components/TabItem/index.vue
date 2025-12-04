<script setup lang="ts">
defineOptions({
  name: 'TabItem',
})

defineProps({
  image: String,
  title: String,
  showRigthLine: {
    type: Boolean,
    default: true,
  },
})
</script>

<template>
  <div
    :class="{ 'item-card': showRigthLine }"
    class="relative flex flex-col items-center gap-1 text-12px"
  >
    <div class="w-8 flex-center">
      <slot>
        <img class="w-full object-contain" :src="image" alt="">
      </slot>
    </div>
    <div class="text-center">
      <span>{{ title }}</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.item-card::after {
  content: '';
  height: 60%;
  width: 1px;
  background-color: #cfd7e859;
  position: absolute;
  top: 5%;
  right: 0;
}
</style>
