<script setup lang="ts">
import { showToast } from 'vant'
import { contractCircle, contractType } from '@/01-kk-system/allDefine/enum/frontend/contract'
import type { IObject } from '@/01-kk-system/allHttp/types/common'
import { valiadtePositiveIntOrDecimal } from '@/01-kk-system/allUtils/utils'

defineOptions({
  name: 'ContractItem',
})

defineProps({
  itemData: {
    type: Object,
    default: () => ({}),
  },
  showHead: {
    type: Boolean,
    default: false,
  },
  edit: {
    type: Boolean,
    default: false,
  },
  valueKey: {
    type: String,
    default: 'value',
  },
})

const emit = defineEmits<{
  onSign: [data: IObject]
  onDelete: [data: IObject]
  onEdit: [data: IObject]
}>()

const { t } = useI18n()

function getI18ntxt(key: string) {
  return t(key || '')
}

function getSupportGame(acceptBetInner: string, acceptBetOuter: string) {
  if (acceptBetInner === '1' && acceptBetOuter === '1') {
    return t('web.i18nFront.label.all')
  }
  else if (acceptBetInner === '1') {
    return t('web.i18nFront.label.lottGm')
  }
  else if (acceptBetOuter === '1') {
    return t('web.i18nFront.label.otherGm')
  }
  else {
    return '--'
  }
}

// 契约金额模式判断（1百分比 2固定金额）
function moneyChange(value: number, model: number) {
  if (model * 1 === 1) {
    return Number.parseFloat((value * 100).toFixed(2))
  }
  else if (model * 1 === 2) {
    return value
  }
}

const validateValue = useThrottleFn((val: number, item: IObject) => {
  const num = Number(val)
  if (!valiadtePositiveIntOrDecimal(val) || num > item.originValue) {
    const msg = t('web.i18nFront.hint.contractEditTip', { min: 0, max: item.originValue })
    showToast(msg)
    item.value = 0
  }
}, 100)
</script>

<template>
  <div class="card mt-4 border border-[--text-gray-color] rounded-2 border-solid bg-[--card-bg-color] p-3 color-[-text-gray-color]">
    <div v-if="showHead" class="flex items-center justify-between pb-4 pt-1 text-sm">
      <slot name="header">
        <span>{{ itemData?.contractName }}</span>
        <div class="action">
          <template v-if="itemData?.contractSigned">
            <van-button color="#f07355" class="px-4" size="mini" @click="emit('onEdit', itemData)">
              {{ $t('system.i18nSystem.opration.edit') }}
            </van-button>
            <van-button color="#f07355" class="px-4" size="mini" @click="emit('onDelete', itemData)">
              {{ $t('system.i18nSystem.label.delete') }}
            </van-button>
          </template>
          <template v-else>
            <van-button color="#f07355" size="mini" class="px-4" @click="emit('onSign', itemData)">
              {{ $t('web.i18nFront.label.sign') }}
            </van-button>
          </template>
        </div>
      </slot>
    </div>
    <div class="w-full flex text-sm color-#d58b08">
      <div class="flex flex-1 flex-col items-center justify-center gap-2 border border-r-0 border-[--text-gray-color] border-solid py-2">
        <p>
          {{ $t('web.i18nFront.label.contracttp') }}
        </p>
        <p>
          {{ getI18ntxt(contractType.getDes(itemData.contractType)) }}
        </p>
      </div>
      <div class="flex flex-1 flex-col items-center justify-center gap-2 border border-[--text-gray-color] border-solid">
        <p>{{ $t('web.i18nFront.label.contractcr') }}</p>
        <p>{{ getI18ntxt(contractCircle.getDes(itemData.contractCircle)) }}</p>
      </div>
      <div class="flex flex-1 flex-col items-center justify-center gap-2 border border-l-0 border-[--text-gray-color] border-solid">
        <p>{{ $t('web.i18nFront.label.supportGm') }}</p>
        <p>
          {{
            getSupportGame(itemData.acceptBetInner, itemData.acceptBetOuter)
          }}
        </p>
      </div>
    </div>
    <div class="bottom w-fullw-full border border-t-0 border-[--text-gray-color] border-solid">
      <div class="head flex items-center bg-[var(--card-bg-color)] py-2 text-sm">
        <div class="item flex-1 text-center">
          <span>{{ $t('web.i18nFront.title.range') }}</span>
        </div>
        <div class="item flex-1 text-center">
          <span>{{ itemData.contractCalcMod === '1' ? `${$t('web.i18nFront.title.rate')}(%)` : $t('web.i18nFront.label.contractAmount') }}</span>
        </div>
      </div>
      <div v-for="(item, k) in itemData.configList" :key="`${k}-item`" class="row flex items-center py-2 text-sm">
        <div class="item flex-1 text-center">
          <span>{{ `≥${item.min}` }}</span>
        </div>
        <div class="item flex-1 text-center">
          <van-cell-group v-if="edit" inset style="--van-cell-vertical-padding: 4px">
            <van-field v-model.number="item.value" type="number" :placeholder="$t('system.i18nSystem.placeholder.input')" autocomplete="false" @update:model-value="validateValue($event, item)" />
          </van-cell-group>
          <span v-else>{{ moneyChange(item[valueKey], itemData.contractCalcMod) }} <span v-if="itemData.contractCalcMod === '1'">%</span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
