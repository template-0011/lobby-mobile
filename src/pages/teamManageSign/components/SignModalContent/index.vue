<script setup lang="ts">
import { showLoadingToast, showNotify } from 'vant'
import cloneDeep from 'lodash-es/cloneDeep'
import { contractHttp } from '@/01-kk-system/allHttp/userHall/user'
import type { IObject } from '@/01-kk-system/allHttp/types/common'
import { contractCircle } from '@/01-kk-system/allDefine/enum/frontend/contract'

defineOptions({
  name: 'SignModalContent',
})

const props = defineProps({
  itemData: {
    type: Object,
    default: () => ({}),
  },
  subName: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'create',
  },
})

const emit = defineEmits<{
  refresh: [void]
}>()

const visible = defineModel({ required: true, default: false })
const { t } = useI18n()
const route = useRoute()

const editData = ref<IObject>({})

// 契约金额模式判断（1百分比 2固定金额）
function moneyChange(value: number, model: number) {
  if (model * 1 === 1) {
    return Number.parseFloat((value * 100).toFixed(2))
  }
  else if (model * 1 === 2) {
    return value
  }
}

function onOpen() {
  if (props.itemData.contractID) {
    const temp = cloneDeep(props.itemData)
    if (props.type === 'edit') {
      const configList = temp.configList
      configList.forEach((item: IObject) => {
        item.value = moneyChange(item.value, temp.contractCalcMod)
        item.originValue = moneyChange(item.originValue, temp.contractCalcMod)
      })
      temp.configList = configList
    }
    editData.value = temp
  }
}

const titleObj = {
  create: 'web.i18nFront.label.sign',
  delete: 'system.i18nSystem.label.delete',
  edit: 'system.i18nSystem.label.edit',
}

function onCancel() {
  visible.value = false
}

function onConfirm() {
  if (props.type === 'create') {
    createContract()
  }
  else if (props.type === 'delete') {
    deleteContract()
  }
  else if (props.type === 'edit') {
    updateContract()
  }
}

async function createContract() {
  const toast = showLoadingToast({
    duration: 0,
    forbidClick: true,
  })
  const routeParams = route.params as Record<string, any>
  const params = {
    parentContractID: props.itemData.contractID,
    partyBUserID: routeParams.userId,
  }
  const res = await contractHttp.createSubContract(params).catch(() => null)
  if (res?.code === '0') {
    showNotify({
      type: 'success',
      message: t('web.i18nFront.hint.signOk'),
    })
    visible.value = false
    // update list
    emit('refresh')
  }
  toast.close()
}

// edit
async function updateContract() {
  const toast = showLoadingToast({
    duration: 0,
    forbidClick: true,
  })
  const configList = cloneDeep(editData.value.configList)
  // validate number and convert percent to value number
  for (let i = 0; i < configList.length; i++) {
    const config = configList[i]
    if (config.value > config.originValue || config.value < 0) {
      const msg = t('web.i18nFront.hint.contractEditTip', { min: 0, max: config.originValue })
      showNotify({
        type: 'danger',
        message: msg,
      })
      return
    }
    if (editData.value.contractCalcMod * 1 === 1) {
      config.value = Number(config.value) / 100
    }
  }
  const res = await contractHttp.editSubContract(props.itemData.child_contractID, { jsonConf: JSON.stringify(configList || '') }).catch(() => null)
  if (res?.code === '0') {
    showNotify({
      type: 'success',
      message: t('system.i18nSystem.hint.editSuccess'),
    })
    visible.value = false
    // update list
    emit('refresh')
  }
  toast.close()
}
async function deleteContract() {
  const toast = showLoadingToast({
    duration: 0,
    forbidClick: true,
  })
  const res = await contractHttp.delSubContract(props.itemData.child_contractID).catch(() => null)
  if (res.code === '0') {
    showNotify({
      type: 'success',
      message: t('system.i18nSystem.hint.deleteSuccess'),
    })
    visible.value = false
    // update list
    emit('refresh')
  }
  toast.close()
}

function onClose() {
  editData.value = {}
}
</script>

<template>
  <van-popup v-model:show="visible" closeable position="bottom" :style="{ height: '100%' }" @close="onClose" @open="onOpen">
    <div class="h-full flex flex-col px-3">
      <div class="flex-1 overflow-auto">
        <div class="h-11 flex-center text-sm -mb-4">
          <h3>{{ $t(titleObj[type] || '') }}</h3>
        </div>
        <template v-if="type !== 'delete'">
          <ContractItem
            :item-data="itemData"
            show-head
            value-key="originValue"
          >
            <template #header>
              <span>{{ `${$t('web.i18nFront.hint.mine')}${itemData?.contractName}` }}</span>
            </template>
          </ContractItem>
          <ContractItem
            :item-data="editData"
            show-head
            :edit="type === 'edit'"
          >
            <template #header>
              <span>{{ `${$t('web.i18nFront.hint.sub')}${itemData?.contractName}` }}</span>
            </template>
          </ContractItem>
        </template>
        <template v-if="type === 'delete'">
          <div class="my-10 border border-gray-300 rounded-2 border-solid bg-[var(--card-bg-color)] p-3 text-sm">
            <van-notice-bar color="#f07355" background="var(--card-bg-color)" left-icon="warning">
              {{ $t('web.i18nFront.hint.confirmDelSubC') }}
            </van-notice-bar>
            <p class="leading-200%">
              {{ `${$t('web.i18nFront.label.subAccount')}: ${subName}` }}
            </p>
            <p class="leading-200%">
              {{ `${$t('web.i18nFront.label.contracttp')}: ${itemData?.contractName}` }}
            </p>
            <p class="leading-200%">
              {{ `${$t('web.i18nFront.label.contractcr')}: ${$t(contractCircle.getDes(itemData.contractCircle || '') || '')}` }}
            </p>
            <p class="leading-200%">
              {{ `${$t('system.i18nSystem.label.createTime')}: ${itemData?.createTime}` }}
            </p>
          </div>
        </template>
      </div>
      <div class="flex-center gap-4 py-5">
        <van-button type="default" size="small" class="px-10" @click="onCancel">
          {{ $t('system.i18nSystem.opration.cancel') }}
        </van-button>
        <van-button type="danger" size="small" class="px-10" @click="onConfirm">
          {{ $t('system.i18nSystem.opration.confirm') }}
        </van-button>
      </div>
    </div>
  </van-popup>
</template>

<style lang="less" scoped></style>
