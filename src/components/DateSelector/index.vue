<script setup lang="ts">
import { getDateStartAndEnd } from '@/01-kk-system/allUtils/utils'
import { quckDateList } from '@/utils/const'

defineOptions({
  name: 'DateSelector',
})

const currentValue = defineModel({ required: true, default: 0 })
const searchParam = {
  dateFrom: '',
  dateTo: '',
}

function getCurrentDate() {
  const { start, end } = getDateStartAndEnd(currentValue.value)
  searchParam.dateFrom = start
  searchParam.dateTo = end
  return searchParam
}

function onClickDate(val: number) {
  currentValue.value = val
}

defineExpose({ getCurrentDate })
</script>

<template>
  <div>
    <div class="button-group">
      <div class="mx-3 flex items-center justify-between">
        <div
          v-for="(val, i) in quckDateList"
          :key="i"
          class="custombtn min-w-60px flex-center border border-[var(--custom-color)] rounded-full border-solid py-1 text-sm color-[var(--custom-color)]"
          :class="{ active: currentValue === val.value }"
          @click="onClickDate(val.value)"
        >
          {{ $t(val.labelKey) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.button-group {
  --van-button-small-padding: 0 12px;
  --custom-color: #c2c4cd;
}
.custombtn {
  transition: color 0.3s ease;
}
.custombtn.active {
  border: 1px solid #e6ac57;
  background: #e6ac57;
  color: #ffffff;
}
</style>
