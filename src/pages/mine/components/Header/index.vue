<script setup lang="ts">
// import TabItem from '../TabItem/index.vue'
// import { useDesignSetting } from '@/hooks/useDesignSetting'
// import { useChatStore } from '@/store/modules/chat'
import useUserStore from '@/store/modules/user'

defineOptions({
  name: 'MineHeaderCp',
})

const emit = defineEmits<{ openWallet: [type: 'deposit' | 'withdraw'] }>()

const router = useRouter()
const userStore = useUserStore()
// const chatStore = useChatStore()

// const { isDark } = useDesignSetting()
// const refreshLoading = ref(false)

const balance = computed(() => {
  const money = userStore?.balanceInfo?.balance
    ? userStore.balanceInfo.balance
    : '0.00'
  const symbol = userStore?.currentWalletInfo.abbreviation ?? ''
  return `${symbol} ${money || '0.00'}`
})

// async function onRefresh() {
//   refreshLoading.value = true
//   await userStore.getUserBanlance()
//   refreshLoading.value = false
// }

// function onLogin() {
//   userStore.setLoginModalState(true)
// }

// function openService() {
//   chatStore.openChat()
// }

function goToSwap() {
  router.push('/swap')
}

function goToTransfor() {
  router.push('/transfor')
}
</script>

<template>
  <div class="money-header mx-4 mt-4">
    <div class="flex flex-col gap-4 px-4">
      <div class="money-row">
        <p class="text-12px text-[#94a6cd]">
          {{ $t('web.i18nFront.label.money') }}
        </p>
        <div class="mt-2 text-20px color-white font-400 leading-20px">
          {{ balance }}
        </div>
      </div>
    </div>
    <div class="mt-4 flex items-center justify-between gap-4 px-3 text-14px color-white">
      <div class="h-10 flex-center grow-1 rounded-3 bg-#97aee11c" @click="emit('openWallet', 'withdraw')">
        {{ $t('web.i18nFront.label.withdraw') }}
      </div>
      <div class="kk-recharge-btn h-10 flex-center grow-1 rounded-3 bg-#97aee11c" @click="emit('openWallet', 'deposit')">
        {{ $t('web.i18nFront.label.recharge') }}
      </div>
    </div>
    <div class="mx-3 my-4 border-1 border-#97aee11c border-solid" />
    <div class="flex items-center justify-between gap-4 px-3 color-white" @click="goToSwap">
      <div class="flex items-center gap-3 text-12px">
        <van-icon size="24px" name="exchange" color="#ffffff" />
        <span>{{ $t('web.i18nFront.label.swap') }}</span>
      </div>
      <van-icon name="arrow" />
    </div>
    <div class="mx-3 my-4 border-1 border-#97aee11c border-solid" />
    <div class="flex items-center justify-between gap-4 px-3 color-white" @click="goToTransfor">
      <div class="flex items-center gap-3 text-12px">
        <van-icon size="24px" name="refund-o" color="#ffffff" />
        <span>{{ $t('web.i18nFront.label.transfor2') }}</span>
      </div>
      <van-icon name="arrow" />
    </div>
  </div>
  <!-- <div class="header w-full">
    <div class="flex items-center justify-between px-4 pt-5 text-14px">
      <h3>{{ $t('web.i18nFront.label.mineC') }}</h3>
      <div class="flex gap-4">
        <div class="icon-email h-30px w-30px flex-center rounded-full bg-#fff">
          <IconEmail :is-dark="isDark" size="18px" />
        </div>
        <div class="icon-email h-30px w-30px flex-center rounded-full bg-#fff" @click="openService">
          <img v-if="!isDark" class="w-18px object-contain" src="@/assets/images/icons/icon-kh.png" alt="">
          <img v-else class="w-18px object-contain" src="@/assets/images/icons/icon-kh2.png" alt="">
        </div>
      </div>
    </div>
    <div v-if="userStore.token" class="user-info mx-4 my-4 rounded-full p-3">
      <div class="flex items-center gap-2">
        <MyAvatar />
        <div class="flex flex-col">
          <p class="welcome text-base">
            {{ $t('web.i18nFront.hint.hello') }},
            {{ userStore?.userInfo?.userName }}
          </p>
          <div class="custom-btn flex-center">
            <WalletAndCurrencySelector padding="0 4px 0 0" min-h="20px" :show-label="false" />
            <span class="money ml-2 text-15px color-[var(--primary-color)]">{{ balance }}</span>
          </div>
        </div>
      </div>
      <div class="flex items-center">
        <van-button size="mini" icon="replay" :loading="refreshLoading" @click="onRefresh" />
      </div>
    </div>
    <div v-else class="mt-4 px-4">
      <div class="flex items-center">
        <div class="kk-button text-12px" @click="onLogin">
          {{ $t('system.i18nSystem.opration.login') }}
        </div>
      </div>
      <p class="pb-5 pt-2 text-12px color-[var(--text-gray-color)]">
        {{ $t('web.i18nFront.hint.loginFirst') }}
      </p>
    </div>
    <van-row>
      <van-col span="6">
        <TabItem
          :title="$t('web.i18nFront.label.recharge')" :show-rigth-line="false"
          @click="emit('openWallet', 'deposit')"
        >
          <IconWithdraw />
        </TabItem>
      </van-col>
      <van-col span="6">
        <TabItem
          :title="$t('web.i18nFront.label.withdraw')" :show-rigth-line="false"
          @click="emit('openWallet', 'withdraw')"
        >
          <IconTopup />
        </TabItem>
      </van-col>
      <van-col span="6">
        <TabItem :title="$t('web.i18nFront.label.transfor')" :show-rigth-line="false" @click="router.push('/transfor')">
          <IconWallet />
        </tabitem>
      </van-col>
      <van-col span="6">
        <TabItem :title="$t('web.i18nFront.label.swapShort')" :show-rigth-line="false" @click="router.push('/swap')">
          <IconWallet />
        </tabitem>
      </van-col>
    </van-row>
  </div> -->
</template>

<style lang="less" scoped>
.money-header {
  background: linear-gradient(107.15deg, #1e283f, rgba(20, 27, 46, 0.6));
  border-radius: 10px;
  padding: 15px 0;
}
.money-row {
  display: flex;
  flex-direction: column;
  padding-left: 15px;
  position: relative;
}
.money-row::before {
  border-radius: 10px;
  content: '';
  display: block;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 5px;
  background: linear-gradient(to top, #00ff86, #00a858);
}
.kk-recharge-btn {
  background-image: linear-gradient(79deg, #31bc69 -8%, #089e4e 93%);
  box-shadow: 0 6px 18px #0ea1514d;
  flex-grow: 1;
}
</style>
