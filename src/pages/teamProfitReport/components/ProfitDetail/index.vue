<script setup lang="ts">
import { formatNum, totalSell, totalWin } from '@/01-kk-system/allUtils/utils'
import useUserStore from '@/store/modules/user'

defineOptions({
  name: 'ProfitDetail',
})

const props = defineProps({
  itemData: {
    type: Object,
    default: () => ({}),
  },
})

const visible = defineModel({ required: true, default: false })

const userStore = useUserStore()

const unit = computed(() => userStore.currentWalletInfo.abbreviation)

function onOpen() {
  console.log(props.itemData)
}
</script>

<template>
  <van-action-sheet v-model:show="visible" :title="$t('web.i18nFront.label.detail')" @open="onOpen">
    <div class="content mb-10" style="--van-cell-group-inset-padding: 0">
      <van-cell-group inset>
        <van-cell v-if="itemData.userName" :title="$t('system.i18nSystem.label.userName')" :value="itemData.userName" />
        <van-cell v-if="itemData.userID" :title="$t('web.i18nFront.label.userId')" :value="itemData.userID" />
        <van-cell :title="$t('web.i18nFront.label.allActivity')" :value="`${formatNum(itemData.totalActivityMoney, 2)}${unit}`" />
        <van-cell :title="$t('web.i18nFront.label.rechargeAll')" :value="`${formatNum(itemData.totalDepositeMoney, 2)}${unit}`" />
        <van-cell :title="$t('web.i18nFront.label.allContract')" :value="`${formatNum(itemData.totalContractMoney, 2)}${unit}`" />
        <van-cell :title="$t('web.i18nFront.label.allRebate')" :value="`${formatNum(itemData.totalRebateMoney, 2)}${unit}`" />
        <van-cell :title="$t('web.i18nFront.title.allSell')" :value="`${totalSell(itemData, 2)}${unit}`" />
        <van-cell :title="$t('web.i18nFront.label.winAll')" :value="`${totalWin(itemData, 2)}${unit}`" />
        <van-cell :title="$t('web.i18nFront.label.withdrawAll')" :value="`${formatNum(itemData.totalWithdrawMoney, 2)}${unit}`" />
        <van-cell :title="$t('web.i18nFront.label.allProfit')" :value="`${formatNum(itemData.totalProfitMoney, 2)}${unit}`" />
      </van-cell-group>
    </div>
  </van-action-sheet>
</template>

<style lang="less" scoped></style>
