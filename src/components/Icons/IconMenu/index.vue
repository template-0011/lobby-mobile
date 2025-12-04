<script setup lang="ts">
defineOptions({
  name: 'IconMenu',
})

withDefaults(defineProps<{
  size?: string
  active?: boolean
}>(), {
  size: '24px',
  active: false,
})
</script>

<template>
  <!-- width="21" height="19" -->
  <svg :width="size" :height="size" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 19" aria-hidden="true" role="img" class="icon icon-burger_icon sm square Tabs__link-icon Tabs__link-icon">
    <g fill="none" fill-rule="evenodd">
      <g fill="currentColor">
        <path d="M19.5 16a1.5 1.5 0 010 3h-18a1.5 1.5 0 010-3h18zm0-8a1.5 1.5 0 010 3h-18a1.5 1.5 0 010-3h18zm0-8a1.5 1.5 0 010 3h-18a1.5 1.5 0 010-3h18z" />
      </g>
    </g>
  </svg>
</template>

<style lang="less" scoped></style>
