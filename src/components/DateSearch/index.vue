<script setup lang="ts">
import type { IObject } from '@/01-kk-system/allHttp/types/common'
import { getDateStartAndEnd, removeEmptyKey } from '@/01-kk-system/allUtils/utils'
import { isIncludeList, quckDateList } from '@/utils/const'

defineOptions({
  name: 'DateSearch',
})

const props = defineProps({
  gameList: {
    type: Array<IObject>,
    default: () => ([]),
  },
  nameKey: {
    type: String,
    default: 'label',
  },
  valueKey: {
    type: String,
    default: 'value',
  },
  showIncludeZero: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  sendData: [data: IObject]
}>()

const currentValue = defineModel({ required: false, default: 0 })
const searchParam = {
  dateFrom: '',
  dateTo: '',
  includeZero: 1,
  dateLabelKey: '',
  game: '',
}

const showGames = ref(false)
const showInclude = ref(false)
const currentGame = ref<IObject>({})
const includeVal = ref<IObject>({})

function onSubmit() {
  getDatePickerDate()
  searchParam.game = currentGame.value[props.valueKey]
  searchParam.includeZero = includeVal.value.value
  const postData = removeEmptyKey(searchParam)
  emit('sendData', postData)
}

function getDatePickerDate() {
  const { start, end } = getDateStartAndEnd(currentValue.value)
  searchParam.dateFrom = start
  searchParam.dateTo = end
  const target = quckDateList.find(item => item.value === currentValue.value)
  if (target) {
    searchParam.dateLabelKey = target.labelKey
  }
  return searchParam
}
function resetForm() {
  currentValue.value = 0
  setTimeout(() => {
    currentGame.value = {}
    includeVal.value = {}
    onSubmit()
  }, 500)
}
function onselect(game: IObject) {
  currentGame.value = game
  showGames.value = false
}

function onSelectInclude(item: IObject) {
  includeVal.value = item
  showInclude.value = false
}

defineExpose({ getDatePickerDate })
</script>

<template>
  <div class="search-container pt-4">
    <van-cell
      v-if="gameList.length > 0"
      class="mb-4"
      :title="$t('web.i18nFront.label.allGames')"
      :value="$t(currentGame[nameKey] || 'web.i18nFront.label.allGames')"
      @click="showGames = true"
    />
    <van-cell
      v-if="showIncludeZero"
      class="mb-4"
      :title="$t('web.i18nFront.title.inZeroUser')"
      :value="$t(includeVal.labelKey || 'web.i18nFront.title.include')"
      @click="showInclude = true"
    />
    <DateSelector v-model="currentValue" />
    <div class="mx-3">
      <van-divider />
    </div>
    <div class="mx-3 mb-8 mt-4 flex items-center gap-5">
      <van-button type="default" block size="small" @click="resetForm">
        {{ $t('system.i18nSystem.opration.reset') }}
      </van-button>
      <van-button color="#e6ac57" block size="small" @click="onSubmit">
        {{ $t('system.i18nSystem.opration.confirm') }}
      </van-button>
    </div>
    <van-popup v-if="gameList.length > 0" v-model:show="showGames" round position="bottom" style="height: 50%">
      <div class="my-3">
        <van-cell v-for="game in gameList" :key="`${game[valueKey]}-game`" :title="$t(game[nameKey] || '')" @click="onselect(game)">
          <template v-if="currentGame[valueKey] === game[valueKey]" #right-icon>
            <van-icon color="#dd7447" size="20px" name="success" />
          </template>
        </van-cell>
      </div>
    </van-popup>
    <van-action-sheet v-model:show="showInclude" :title="$t('web.i18nFront.title.inZeroUser')">
      <div class="content mb-10">
        <van-cell v-for="item in isIncludeList" :key="item.labelKey" :title="$t(item.labelKey)" @click="onSelectInclude(item)">
          <template v-if="item.value === includeVal.value" #right-icon>
            <van-icon name="success" color-red />
          </template>
        </van-cell>
      </div>
    </van-action-sheet>
  </div>
</template>

<style lang="less" scoped>
</style>
