<script setup lang="ts">
defineOptions({
  name: 'KKButton',
})

withDefaults(defineProps<{
  title: string
  size?: 'large' | 'medium' | 'small' | 'mini'
  round?: boolean
  type?: 'full-color' | 'border-color'
}>(), {
  size: 'medium',
  type: 'full-color',
  round: true,
})

const emit = defineEmits<{
  onClick: [void]
}>()
</script>

<template>
  <button
    class="kk-btn full-color flex-center rounded-1"
    :class="{
      'kk-d-btn-large': size === 'large',
      'kk-d-btn-medium': size === 'medium',
      'kk-d-btn-small': size === 'small',
      'kk-d-btn-mini': size === 'mini',
      'rounded-full': round,
    }"
    @click="emit('onClick')"
  >
    {{ title }}
  </button>
</template>

<style lang="less" scoped>
.kk-btn {
  margin: 0;
  padding: 0;
  border: 1px solid transparent;
  outline: none;
  background: transparent;
}
.kk-d-btn-large {
  width: 125px;
  height: 44px;
  font-size: 18px;
}

.kk-d-btn-medium {
  width: 93px;
  height: 32px;
  font-size: 14px;
}

.kk-d-btn-small {
  width: 73px;
  height: 26px;
  font-size: 12px;
}

.kk-d-btn-mini {
  width: 40px;
  height: 20px;
  font-size: 10px;
}

.full-color {
  color: var(--kk-btn-text-color, #ffffff);
  background-image: linear-gradient(180deg, var(--kk-btn-bg-color-start, #8bbcff), var(--kk-btn-bg-color-end, #5387fd));
  border: var(--kk-btn-border, unset);
}
</style>
