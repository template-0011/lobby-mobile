<script lang="ts" setup>
const router = useRouter()
function goHome() {
  if (window.history.state.back)
    history.back()
  else
    router.replace('/')
}
</script>

<template>
  <div class="page-container flex flex-col justify-center">
    <div class="text-center">
      <img src="~@/assets/icons/exception/404.svg" alt="">
    </div>
    <div class="text-center">
      <p class="m-4 text-base">
        {{ $t('system.i18nSystem.noPage.tips') }}
      </p>
      <van-button size="normal" type="primary" @click="goHome">
        {{ $t('system.i18nSystem.noPage.backHome') }}
      </van-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.page-container {
  height: 100%;

  .text-center {
    h1 {
      color: #666;
      padding: 20px 0;
    }
  }

  img {
    width: 350px;
    margin: 0 auto;
  }
}
</style>
