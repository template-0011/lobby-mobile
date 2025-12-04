<script setup lang="ts">
defineOptions({
  name: '',
})
</script>

<template>
  <div class="h-full flex flex-col justify-center color-#ffffff">
    <van-empty image-size="100" :description="$t('web.i18nFront.hint.noData')" />
  </div>
</template>

<style lang="scss" scoped></style>
