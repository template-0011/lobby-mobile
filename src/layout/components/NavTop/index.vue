<script setup lang="ts">
import KKLogo from '../Logo/index.vue'
import useUserStore from '@/store/modules/user'
import useIframeOpenFunc from '@/04-kk-component-mobile/hooks/useIframeOpenFunc'

defineOptions({
  name: 'NavTop',
})

const emit = defineEmits<{
  (e: 'onNotice'): void
}>()

const router = useRouter()
const userStore = useUserStore()
const { goToPayment } = useIframeOpenFunc()

const isLoggedIn = computed(() => userStore.token)

const balance = computed(() => {
  const money = userStore?.balanceInfo?.balance
    ? userStore.balanceInfo.balance
    : '0.00'
  return `${money}`
})

function onShowLogin() {
  userStore.setLoginModalState(true)
}

function handleClick(type: 'deposit' | 'withdraw') {
  goToPayment(type)
}

function onClickUser() {
  router.push({ path: '/mine' })
}
</script>

<template>
  <div class="sticky top-0 z-100 h-60px flex items-center justify-between overflow-hidden border-b-1 border-b-[#141b2e] border-b-solid bg-[#205583] px-3">
    <KKLogo />
    <div v-if="!isLoggedIn" class="flex shrink-0 items-center">
      <button class="kk-login-btn kk-button mr-10px text-12px !border-none !py-6px" @click="onShowLogin">
        <span class="color-white">
          {{ $t("system.i18nSystem.opration.login") }}
        </span>
      </button>
      <button class="kk-register-btn kk-button flex-center text-12px !border-none !py-6px" @click="onShowLogin">
        <span class="color-white">
          {{ $t("system.i18nSystem.opration.register") }}
        </span>
      </button>
    </div>
    <div v-else class="flex items-center">
      <div class="mr-10px flex-center gap-2 overflow-hidden rounded-2 bg-[var(--color-n700)] py-1">
        <div class="flex flex-col items-end">
          <WalletAndCurrencySelector2 :show-label="false" />
          <div class="px-3 text-12px color-white font-400 leading-12px">
            {{ balance }}
          </div>
        </div>
        <div class="recharge-btn z-101 mr-2px h-7 flex-center shrink-0 cursor-pointer rounded-2 px-3 color-white font-600 -ml-2" @click.prevent="handleClick('deposit')">
          <span class="whitespace-nowrap text-13px">
            {{ $t("web.i18nFront.label.recharge") }}
          </span>
        </div>
      </div>
      <div class="small-icon-btn mr-2" @click="onClickUser">
        <van-icon color="#fff" name="contact" />
      </div>
      <div class="small-icon-btn" @click="emit('onNotice')">
        <van-icon color="#fff" name="bell" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.kk-login-btn {
  background-image: linear-gradient(to bottom right, #276aa5, #276aa5);
  box-shadow: 0 6px 22px #056dda4d;
}

.kk-register-btn {
  background-image: linear-gradient(80deg, #7eac2f -8%, #7eac2f 93%);
  box-shadow: 0 6px 18px #0ea1514d;
}
.recharge-btn {
  background-image: linear-gradient(89deg, var(--color-gd-green));
}
.small-icon-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 6px;
  background-color: #276aa5;
}
</style>
