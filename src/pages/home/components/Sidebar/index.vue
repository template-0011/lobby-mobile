<script setup lang="ts">
import { showLoadingToast } from 'vant'
import MyAvatar from '../../../mine/components/MyAvatar/index.vue'
import RowCell from './components/RowCell.vue'
import useUserStore from '@/store/modules/user'
import { translateTextBy } from '@/utils/i18n'
import { useChatStore } from '@/store/modules/chat'

const emit = defineEmits(['onClose'])

const router = useRouter()
const userStore = useUserStore()
const chatStore = useChatStore()
const refreshLoading = ref(false)

const showConfirm = ref(false)

export interface MenuItem {
  title: string
  path: string
  icon: string
  image: string
  active: boolean
  size?: string
  name: string
}

const menuList = [
  {
    icon: `i-carbon:chart-histogram`,
    path: '',
    title: translateTextBy('web.i18nFront.label.gameRecord'),
    onClick: () => {
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

function toggleSideBar() {
  emit('onClose')
}

async function onRefresh() {
  refreshLoading.value = true
  await userStore.getUserBanlance()
  refreshLoading.value = false
}

function onClickItem(item: any) {
  toggleSideBar()
  console.log(item)
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
    toggleSideBar()
  }).finally(() => toast.close())
}

onUnmounted(() => toggleSideBar())
</script>

<template>
  <div class="side-container box-border h-full w-full overflow-hidden overflow-y-auto bg-[var(--card-bg-color)] p-4">
    <div class="info-box rounded-2 p-3">
      <div class="flex items-center gap-2">
        <MyAvatar />
        <div class="flex flex-col">
          <p class="welcome text-sm">
            {{ $t('web.i18nFront.hint.hello') }},
            {{ userStore?.userInfo?.userName }}
          </p>
        </div>
      </div>
      <div class="wallet mt-3 pb-2 text-sm">
        <div class="flex items-center gap-2">
          <div class="wallet-icon" />
          <span>{{ $t('web.i18nFront.label.wallet') }}</span>
          <van-button size="mini" icon="replay" :loading="refreshLoading" @click="onRefresh" />
        </div>
        <p class="pt-1 color-[--kk-sidebar-money-text-color]">
          {{ `${moneySymbol} ${balance}` }}
        </p>
      </div>
      <div class="action mt-3 flex items-center justify-between pb-2 text-sm">
        <KKButton :title="$t('web.i18nFront.label.recharge')" size="small" style="--kk-btn-bg-color-start: var(--primary-color);--kk-btn-bg-color-end: var(--primary-color);" />
        <KKButton :title="$t('web.i18nFront.label.withdraw2')" size="small" style="--kk-btn-bg-color-start: none;--kk-btn-bg-color-end: none; --kk-btn-text-color: var(--primary-color);--kk-btn-border: 1px solid var(--primary-color)" />
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
  <CustomDialog
    v-model:show="showConfirm"
    :close-on-click-overlay="true"
    :desc="$t('system.i18nSystem.hint.cfmLogout')"
    @on-cancel="showConfirm = false"
    @on-confirm="logout"
  />
</template>

<style lang="less" scoped>
.info-box {
  background: #ffffff;
}
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
  background: #f3f5f9;
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
</style>
