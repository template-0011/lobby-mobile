<script setup lang="ts">
import { showNotify } from 'vant'
import OuterBalanceCardList from './components/OuterBalanceCardList/index.vue'
import { outerGameHttp } from '@/01-kk-system/allHttp/userHall/games'
import useUserStore from '@/store/modules/user'

defineOptions({
  name: 'TransforPage',
})

const userStore = useUserStore()
const backLoading = ref(false)
const refreshLoading = ref(false)
const listKey = ref(1)

const { t } = useI18n()

provide('Outer-Game-Provider', {
  onRefresh,
})

const balance = computed(() => {
  const money = userStore?.balanceInfo?.balance
    ? userStore.balanceInfo.balance
    : '0.00'
  const symbol = userStore?.currentWalletInfo?.symbol || ''
  return `${symbol} ${money}` || '0.00'
})

async function onRefresh() {
  refreshLoading.value = true
  await userStore.getUserBanlance()
  refreshLoading.value = false
}

const getAllBack = useThrottleFn(async () => {
  backLoading.value = true
  const res = await outerGameHttp.getAllOuterBalanceBack().catch(() => null)
  if (res?.code === '0') {
    showNotify({
      message: t('web.i18nFront.hint.outer2sOk'),
      type: 'success',
    })
    setTimeout(() => {
      onRefresh()
      listKey.value += 1
    }, 1000)
  }
  backLoading.value = false
}, 2000)
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden text-center">
    <TopNav :title="$t('web.i18nFront.label.transfor')" />
    <div
      class="h-46px w-full flex items-center px-2 text-sm color-white"
    >
      <h3>{{ $t("web.i18nFront.label.centerWlt") }}:</h3>
      <span class="money mx-2 text-15px color-[--primary-color]">{{ balance }}</span>
      <van-button
        icon="replay"
        type="warning"
        size="small"
        :loading="refreshLoading"
        @click="onRefresh"
      />
      <div class="flex flex-1 justify-end">
        <van-button
          type="warning"
          size="small"
          :loading="backLoading"
          round
          @click="getAllBack"
        >
          {{ $t("web.i18nFront.label.getBack") }}
        </van-button>
      </div>
    </div>
    <MoneySwitchThird />
    <h3 class="mb-4 mt-5 pl-3 text-left text-14px color-white font-500">
      {{ $t("web.i18nFront.title.walletList") }}:
    </h3>
    <div class="flex-1 overflow-y-auto">
      <OuterBalanceCardList :key="listKey" />
      <div class="h-5" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
