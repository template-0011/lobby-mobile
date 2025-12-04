<script setup lang="ts">
import NormalOpen from './components/NormalOpen/index.vue'
import LinkOpen from './components/LinkOpen/index.vue'
import LinkManage from './components/LinkManage/index.vue'

defineOptions({
  name: '',
})
const active = ref(0)
</script>

<template>
  <div class="h-screen flex flex-col">
    <TopNav :title="$t('web.i18nFront.label.accountDetail')" />
    <div class="open-content h-full flex-1 overflow-hidden">
      <van-tabs v-model:active="active" class="h-full">
        <van-tab :title="$t('web.i18nFront.label.normalOpen')">
          <div class="h-full flex-1 overflow-auto">
            <NormalOpen />
          </div>
        </van-tab>
        <van-tab :title="$t('web.i18nFront.label.linkOpen')">
          <LinkOpen />
        </van-tab>
        <van-tab :title="$t('web.i18nFront.label.linkManage')">
          <LinkManage />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<style lang="less" scoped>
:deep(.van-tabs__content) {
  height: calc(100% - 44px);
  overflow: auto;
}
</style>
