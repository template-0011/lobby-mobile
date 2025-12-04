<script setup lang="ts">
defineOptions({
  name: 'RowCell',
})

defineProps(['itemData'])

const emit = defineEmits<{
  onClick: [any]
}>()
</script>

<template>
  <div class="flex items-center gap-2 text-13px color-[var(--text-gray-color)]" @click="emit('onClick', itemData)">
    <div class="h-4 w-4" :class="itemData?.icon" />
    <span>{{ itemData?.title }}</span>
    <div class="flex flex-1 justify-end">
      <slot name="right" />
    </div>
  </div>
</template>

<style lang="less" scoped></style>
