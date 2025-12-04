<script setup lang="ts">
import { showConfirmDialog } from 'vant'
import useUserStore from '@/store/modules/user'

defineOptions({
  name: 'Setting',
})

const userStore = useUserStore()
const router = useRouter()
const { t } = useI18n()

function onLogout() {
  showConfirmDialog({
    message: t('web.i18nFront.hint.confirmOut'),
  })
    .then(() => {
      logout()
    })
    .catch(() => null)
}

function logout() {
  userStore.logout().then(() => {
    userStore.resetToken()
    router.replace({ path: '/' })
  })
}

function onClickLeft() {
  router.back()
}
</script>

<template>
  <div class="h-screen flex flex-col color-#fff">
    <van-nav-bar
      :title="$t('web.i18nFront.label.setting')"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="flex-1 overflow-auto">
      <LanguageSwitch />
      <div class="mx-4 mt-10">
        <van-button type="danger" size="small" round block @click="onLogout">
          {{ $t('web.i18nFront.label.logout') }}
        </van-button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>

</style>
