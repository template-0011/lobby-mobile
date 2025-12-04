<script setup lang="ts">
import { showLoadingToast } from 'vant'
import RowCell from './components/RowCell.vue'
import useUserStore from '@/store/modules/user'
import { translateTextBy } from '@/utils/i18n'
import { useChatStore } from '@/store/modules/chat'
import { eventEmitter } from '@/01-kk-system/allUtils/eventEmitter'
import useIframeOpenFunc from '@/04-kk-component-mobile/hooks/useIframeOpenFunc'

export interface MenuItem {
  title: string
  path: string
  icon: string
  image: string
  active: boolean
  size?: string
  name: string
}

// const emits = defineEmits(['pushPath'])
const router = useRouter()
const userStore = useUserStore()
const chatStore = useChatStore()
const refreshLoading = ref(false)
const showConfirm = ref(false)
const isLoggedIn = computed(() => userStore.token)

const { goToPayment } = useIframeOpenFunc()

const isShow = defineModel<boolean>('show', { required: true })

function onClose() {
  setTimeout(() => {
    isShow.value = false
    eventEmitter.emit('close-sider-pop')
  }, 0)
}

function goToPay(type: 'deposit' | 'withdraw') {
  goToPayment(type)
  onClose()
}

function goToUserCenter() {
  router.push({ path: '/mine' })
  onClose()
}

function onShowLogin() {
  userStore.setLoginModalState(true)
  onClose()
}

const menuList = [
  {
    icon: `i-carbon:chart-histogram`,
    path: '',
    title: translateTextBy('web.i18nFront.label.gameRecord'),
    onClick: () => {
      console.log('onClickItem----', router)
      router.push({ path: '/my-report-lottery' })
    },
  },
]

const balance = computed(() => {
  const money = userStore?.balanceInfo?.balance
    ? userStore.balanceInfo.balance
    : '0.00'
  return money || '0.00'
})

const moneySymbol = computed(() => {
  const symbol = userStore?.currentWalletInfo?.symbol || ''
  return symbol || '¥'
})

async function onRefresh() {
  refreshLoading.value = true
  await userStore.getUserBanlance()
  refreshLoading.value = false
}

function onClickItem(item: any) {
  onClose()
  if (item.path === 'custom-server') {
    chatStore.openChat()
  }
  else if (item.onClick) {
    item.onClick()
  }
}

function logout() {
  const toast = showLoadingToast({
    duration: 0,
    forbidClick: true,
  })
  userStore.logout().then(() => {
    userStore.resetToken()
    router.replace({ path: '/' })
    showConfirm.value = false
    onClose()
  }).finally(() => {
    toast.close()
  })
}

function handleSideContainerClick(event: Event) {
  event.stopPropagation()
}

onUnmounted(() => onClose())
</script>

<template>
  <div>
    <transition name="kk-side-bg" mode="out-in" appear>
      <div v-if="isShow" class="sidebar-backdrop fixed right-0 top-0 z-1001 h-full w-full bg-[#1f1f1fba]" @click.stop="onClose" />
    </transition>
    <transition name="kk-side-right" mode="out-in" appear>
      <div v-if="isShow" class="side-container absolute right-0 top-0 z-1002 box-border h-full w-70% overflow-hidden overflow-y-auto bg-[var(--card-bg-color)] p-4" @click="handleSideContainerClick">
        <div class="absolute right-5 top-5" @click="onClose">
          <van-icon color="#ffffff" size="20px" name="close" />
        </div>
        <div class="info-box rounded-2 p-3">
          <div class="flex items-center gap-2">
            <MyAvatar v-if="isLoggedIn" />
            <div v-if="isLoggedIn" class="flex-center gap-2" @click="goToUserCenter">
              <p class="welcome text-5 text-white font-600 capitalize">
                {{ userStore?.userInfo?.userName }}
              </p>
              <van-icon class="mt-1" color="#ffffff" size="20px" name="arrow" />
            </div>
            <button v-else class="kk-login-btn kk-button mr-10px text-12px !border-none !py-6px" @click="onShowLogin">
              <span class="color-white">
                {{ $t("system.i18nSystem.opration.login") }}
              </span>
            </button>
          </div>
          <div class="promotion-item promotion-money p-item-bg-01 my-5">
            <div class="text-black">
              <p class="overflow-hidden text-ellipsis whitespace-nowrap text-13px font-500">
                Free Money
              </p>
              <p class="whitespace-nowrap text-10px">
                Get 100% Free
              </p>
            </div>
            <img class="pointer-events-none absolute bottom-0 right-0 h-43px w-117px rounded-r-3" src="@/assets/images/home/free-m-bg.png" alt="">
            <img class="pointer-events-none absolute h-29px w-26px -left-10px -top-2px" src="@/assets/images/home/icon-coin.png" alt="">
          </div>
          <div class="wallet mt-3 pb-2 text-sm text-white">
            <div class="flex items-center gap-2">
              <div class="wallet-icon" />
              <span>{{ $t('web.i18nFront.label.wallet') }}</span>
              <van-button size="mini" icon="replay" color="#ffffff00" :loading="refreshLoading" @click="onRefresh" />
            </div>
            <p class="pt-1 color-white">
              {{ `${moneySymbol} ${balance}` }}
            </p>
          </div>
          <div class="action mt-3 flex items-center justify-between pb-2 text-sm">
            <KKButton :title="$t('web.i18nFront.label.recharge')" size="small" style="--kk-btn-bg-color-start: var(--primary-color);--kk-btn-bg-color-end: var(--primary-color);" @click="goToPay('deposit')" />
            <KKButton :title="$t('web.i18nFront.label.withdraw2')" size="small" style="--kk-btn-bg-color-start: none;--kk-btn-bg-color-end: none; --kk-btn-text-color: var(--primary-color);--kk-btn-border: 1px solid var(--primary-color)" @click="goToPay('withdraw')" />
          </div>
        </div>
        <div class="info-box mt-3 flex flex-col gap-3 rounded-2 p-3 text-13px color-[var(--text-gray-color)]">
          <RowCell v-for="(item, index) in menuList" :key="`${index}-sider`" :item-data="item" @on-click="onClickItem" />
        </div>
        <div class="info-box mt-3 rounded-2 p-3 text-13px color-[var(--text-gray-color)]">
          <div class="mt-1 flex items-center gap-2" @click="onClickItem({ path: 'custom-server' })">
            <div class="i-carbon:customer-service h-4 w-4" />
            <span>{{ $t('web.i18nFront.label.server') }}</span>
          </div>
        </div>
        <div class="info-box mt-3 flex items-center gap-2 rounded-2 p-3 text-13px color-[var(--text-gray-color)]" @click="showConfirm = true">
          <van-icon name="clear" />
          <span>{{ $t('web.i18nFront.label.logout2') }}</span>
        </div>
      </div>
    </transition>
  </div>
  <CustomDialog
    v-model:show="showConfirm"
    :close-on-click-overlay="true"
    :desc="$t('system.i18nSystem.hint.cfmLogout')"
    @on-cancel="showConfirm = false"
    @on-confirm="logout"
  />
</template>

<style lang="less" scoped>
.wallet-icon {
  width: 16px;
  height: 14px;
  background: url('@/assets/images/icons/icon-wallet-light.png') no-repeat;
  background-size: 100%;
}
.wallet {
  box-shadow: inset 0 -0.75px 0 0 rgba(28, 116, 255, 0.1);
}
html.dark .info-box {
  background: #302e38;
}
.side-container {
  border-radius: 20px 0 0 20px;
  background: linear-gradient(173deg, rgba(37, 46, 76, 0.98) 2%, rgba(25, 32, 51, 0.98));
}
html.dark .side-container {
  background: #232229;
}
html.dark .wallet-icon {
  background: url('@/assets/images/icons/icon-wallet-dark.png') no-repeat;
  background-size: 100%;
}
html.dark .wallet {
  box-shadow: inset 0 -0.75px 0 0 hsla(0, 0%, 70.2%, 0.2);
}

.promotion-item {
  border-radius: 12px;
  display: flex;
  align-items: center;
  min-height: 50px;
  padding: 8px 130px 8px 16px;
  position: relative;
  font-size: 13px;
  background-image: linear-gradient(92deg, #01c2ff, #0009da), linear-gradient(0deg, #fff, #fff);
  grid-area: bonus;
  min-width: 0;
}
.kk-login-btn {
  background-image: linear-gradient(to bottom right, #0095ff, #0855c4);
  box-shadow: 0 6px 22px #056dda4d;
}

/* 进入动画 */
.kk-side-right-enter-active {
  transition: transform 0.3s ease-out;
}

.kk-side-right-enter-from {
  transform: translateX(100%);
}

.kk-side-right-enter-to {
  transform: translateX(0);
}

/* 离开动画 */
.kk-side-right-leave-active {
  transition: transform 0.3s ease-in;
}

.kk-side-right-leave-from {
  transform: translateX(0);
}

.kk-side-right-leave-to {
  transform: translateX(100%);
}
</style>
