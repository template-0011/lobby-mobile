<script setup lang="ts">
import type { IObject } from '@/01-kk-system/allHttp/types/common'
import { formatNum } from '@/01-kk-system/allUtils/utils'
import { useMoneyChangeTypes } from '@/hooks/useMoneyChangeTypes'

defineOptions({
  name: 'BillItem',
})

const props = defineProps({
  itemData: {
    type: Object,
    default: () => ({}),
  },
  walletsList: {
    type: Array<IObject>,
    default: () => ([]),
  },
  headerType: {
    type: String,
    default: 'uuid',
  },
})

const { getCurrentChangeTxt } = useMoneyChangeTypes()

function getCurrency(wallet: string, currency: string) {
  const code = `${wallet}-${currency}`
  const target = props.walletsList.find(item => item.value === code) || {}
  return target.abbreviation ? target.abbreviation : '-'
}

function getChangeMoney(item: IObject) {
  const change = Number(item.balanceAfterChange) - Number(item.balanceBeforeChange)
  if (!Number.isNaN(change)) {
    return change >= 0 ? `+${formatNum(item.money, 8)}` : `-${formatNum(item.money, 8)}`
  }
  return '--'
}
</script>

<template>
  <div class="mb-4 rounded-2 bg-[var(--card-bg-color)] px-3 py-2 text-sm">
    <van-row class="h-11 items-center">
      <van-col v-if="headerType === 'uuid'" :span="12">
        <div class="text-overflow color-[var(--primary-color)]">
          {{ $t('web.i18nFront.label.hisUUID') }}
          <span>:{{ itemData.uuid }}</span>
        </div>
      </van-col>
      <van-col v-else :span="12">
        <div class="text-overflow color-[var(--primary-color)]">
          <van-icon name="contact mr-1" />{{ itemData.userName }}
        </div>
      </van-col>
      <van-col class="text-right" :span="12">
        <span class="custom-change text-overflow text-12px">{{ getCurrentChangeTxt(itemData) }}</span>
      </van-col>
    </van-row>
    <van-row class="border-y-1 border-y-[var(--kk-border-color)] border-y-solid py-3">
      <van-col class="border-r-1 border-r-[var(--kk-border-color)] border-r-solid" :span="12">
        <div class="text-center">
          <p class="mb-3">
            {{ $t('web.i18nFront.label.moneyChange') }}
          </p>
          <p class="color-[var(--primary-color)]">
            {{ getChangeMoney(itemData) }}
          </p>
        </div>
      </van-col>
      <van-col :span="12">
        <div class="text-center">
          <p class="mb-3">
            {{ $t('web.i18nFront.label.balance') }}
          </p>
          <p>{{ formatNum(itemData.balanceAfterChange, 8) }}</p>
        </div>
      </van-col>
    </van-row>
    <van-row class="h-10 items-center">
      <van-col :span="12">
        <div class="text-overflow color-[var(--primary-color)]">
          {{ itemData.operateTime }}
        </div>
      </van-col>
      <van-col class="text-right" :span="12">
        <span class="text-overflow border border-color-[var(--primary-color)] rounded-2px border-solid px-1 py-2px text-12px color-[var(--primary-color)]">{{ getCurrency(itemData.walletType, itemData.currencyCode) }}</span>
      </van-col>
    </van-row>
  </div>
</template>

<style lang="less" scoped>
.custom-change {
  color: rgb(153, 153, 153);
  border: 1px solid rgb(153, 153, 153);
  padding: 2px 4px;
  border-radius: 2px;
}
</style>
