<script setup lang="ts">
import { PlatformImageCode } from '@/01-kk-system/allHttp/models/common'
import { localImg } from '@/01-kk-system/allUtils/utils'
import useAppStore from '@/store/modules/app'

defineOptions({
  name: 'KKLogo',
})

const router = useRouter()
const appStore = useAppStore()

const logo = ref('')

function goHome() {
  router.replace('/')
}

async function fetchLogo() {
  if (window.location.origin.includes('kk-template')) {
    logo.value = localImg('custom-images/app/logo.png')
    return
  }
  logo.value = await appStore.getAppLogoByCode(PlatformImageCode.PC_LOGO)
}

onBeforeMount(() => {
  fetchLogo()
})
</script>

<template>
  <div class="mr-4 max-h-60px min-w-100px flex items-center">
    <a class="flex-center" href="javascript:void(0)" @click="goHome">
      <img v-if="logo" class="h-full object-contain" :src="logo" alt="">
    </a>
  </div>
</template>

<style lang="scss" scoped></style>
