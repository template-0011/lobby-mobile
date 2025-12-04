<script setup lang="ts">
defineOptions({
  name: 'AboutUs',
})

const router = useRouter()

const activeName = ref('aboutUs')
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden">
    <van-nav-bar
      :title="$t('web.i18nFront.label.aboutUs')"
      left-arrow
      @click-left="router.back"
    />
    <van-tabs v-model:active="activeName" class="top-tabs flex-1 overflow-hidden">
      <van-tab :title="$t('web.i18nFront.label.aboutUs')" name="aboutUs">
        <div class="content">
          <p>
            {{ $t("web.i18nFront.desc.aboutus") }}
          </p>
        </div>
      </van-tab>
      <van-tab :title="$t('web.i18nFront.label.gameBiling')" name="gameBiling">
        <div class="content">
          <p>
            {{ $t("web.i18nFront.desc.gameBiling") }}
          </p>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<style lang="less" scoped>
.top-tabs {
  --el-color-primary: #fbde8e;
  --el-font-size-base: 16px;
}
.content {
  // color: #c5c8db;
  font-size: 14px;
  line-height: 28px;
  padding: 16px 12px;
  margin-bottom: 40px;
  color: #ffffff;
  // padding-bottom: 20px;
}
.content p {
  margin-bottom: 16px;
  white-space: pre-line;
}
:deep(.van-tabs__content) {
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
}
</style>
