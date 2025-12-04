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
  <div class="card-container">
    <div class="">
      <slot name="title">
        <h6 class="py-2 text-sm font-500">
          {{ title }}
        </h6>
      </slot>
      <slot name="right" />
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>

<style lang="less" scoped>
.card-container {
  background: var(--card-bg-color);
  border-radius: 12px;
  padding: 10px 16px;
  box-shadow: 0 0.027rem 0.053rem rgba(0, 0, 0, 0.1);
}
</style>
