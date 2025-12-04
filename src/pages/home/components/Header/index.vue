<script setup lang="ts">
import Sidebar from '../Sidebar/index.vue'
import MyAvatar from '../../../mine/components/MyAvatar/index.vue'
import useUserStore from '@/store/modules/user'
import useAppStore from '@/store/modules/app'
import { PlatformImageCode } from '@/01-kk-system/allHttp/models/common'
import { localImg } from '@/01-kk-system/allUtils/utils'

defineOptions({
  name: 'HeaderCp',
})

const appStore = useAppStore()
const userStore = useUserStore()

const logo = ref('')
const openSider = ref(false)

function handleShowLogin() {
  userStore.setLoginModalState(true)
}

async function fetchAppLogo() {
  if (window.location.origin.includes('kk-template')) {
    logo.value = localImg('custom-images/app/logo.png')
    return
  }
  logo.value = await appStore.getAppLogoByCode(PlatformImageCode.H5_LOGO)
}

onBeforeMount(() => {
  fetchAppLogo()
})
</script>

<template>
  <div class="header h-50px w-full flex items-center justify-between bg-[var(--cp-color1)] px-1 px-3">
    <div class="flex items-center">
      <div class="min-w-40px flex items-center">
        <van-image
          class="min-w-10"
          height="32"
          fit="contain"
          :src="logo"
        />
      </div>
    </div>
    <div v-if="!userStore.token">
      <van-button size="small" type="primary" @click="handleShowLogin">
        {{ $t("system.i18nSystem.opration.login") }}
      </van-button>
    </div>
    <div v-else class="flex items-center gap-1">
      <div class="h-full w-10 flex-center" @click="() => openSider = true">
        <MyAvatar :size="34" />
      </div>
    </div>
    <van-popup
      v-model:show="openSider"
      position="right"
      :style="{ width: '65%', height: '100%' }"
      teleport="#app"
    >
      <Sidebar @on-close="() => openSider = false" />
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
.header {
  --van-button-primary-background: #f24f4b;
  --van-button-primary-border-color: #f24f4b;
  background: #fafafa;
}
html.dark .header {
  background: #31303a;
}
.header {
  :deep(.van-image__img) {
    width: auto;
  }
}
</style>
