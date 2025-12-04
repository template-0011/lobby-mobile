<script setup lang="ts">
import { type ToastWrapperInstance, showLoadingToast } from 'vant'
import SignModalContent from './components/SignModalContent/index.vue'
import type { SignActionType } from './type'
import type { IObject } from '@/01-kk-system/allHttp/types/common'
import { contractHttp } from '@/01-kk-system/allHttp/userHall/user'
// import useUserStore from '@/store/modules/user'
import { teamHttp } from '@/01-kk-system/allHttp/userHall/team'

defineOptions({
  name: 'TeamManageSign',
})

const { t } = useI18n()
// const userStore = useUserStore()
const route = useRoute()
const subUserInfo = ref<IObject>({})
const contractInfoList = ref<IObject[]>([]) // 契约数据
let myContract = [] // 我的契约数据
const contractModalShow = ref(false) // 修改下级契约数据
const loading = ref(false)
const refreshing = ref(false)
const currentData = ref<IObject>({})
const actionType = ref<SignActionType>('create')

// const balance = computed(() => userStore.balanceInfo.balance)
// const unit = computed(() => userStore.currentWalletInfo.abbreviation)

// // 契约金额模式判断（1百分比 2固定金额）
// function moneyChange(value: number, model: number) {
//   if (model * 1 === 1) {
//     return Number.parseFloat((value * 100).toFixed(2))
//   }
//   else if (model * 1 === 2) {
//     return value
//   }
// }
// 我的契约名字
function contractName(val: string) {
  // （1投注工资 2中单工资 3挂单工资 4中奖返水 5团队分红）
  switch (val) {
    case '1':
      return t('web.i18nFront.enum.betContract')
    case '2':
      return t('web.i18nFront.enum.winContract')
    case '3':
      return t('web.i18nFront.enum.chaseContract')
    case '4':
      return t('web.i18nFront.enum.rebateContract')
    case '5':
      return t('web.i18nFront.enum.teamRdContract')
    case '6':
      return t('web.i18nFront.enum.rAndWContract')
    default:
      return t('web.i18nFront.enum.noContract')
  }
}
// 获取下级用户详情
async function getSubordinateDetails(userId) {
  const res = await teamHttp.subUserDetail(userId).catch(() => null)
  if (res?.code === '0') {
    subUserInfo.value = res?.data || {}
  }
}

// 获取我的契约
async function getMyContract() {
  if (refreshing.value) {
    refreshing.value = false
  }
  const toast = showLoadingToast({
    duration: 0,
    forbidClick: true,
  })
  myContract = []
  const res = await contractHttp.getMyContractList({ canSubSign: 1 }).catch(() => null)
  if (res?.code === '0') {
    const list = res.data || []
    list.forEach((item, i) => {
      list[i].configList = JSON.parse(item.jsonConf || '[]')
    })
    myContract = res?.data || []
    // get Subordinate if success
    getSubordinateContract(toast)
  }
  else {
    toast.close()
  }
}
// 获取我的下级契约
async function getSubordinateContract(toast: ToastWrapperInstance) {
  let subordinateContractAll = []
  const routeParams = route.params as Record<string, any>
  const params = {
    partyBUserID: routeParams.userId,
  }
  const res = await contractHttp.getSubContractList(params)
  const { code, data } = res || {}
  if (code === '0') {
    subordinateContractAll = data || []
  }

  // loop for find the sub user contract if it signed【匹配下级用户是不是已经签约】
  for (let index = 0; index < myContract.length; index++) {
    const target = myContract[index]
    target.contractSigned = false
    target.contractName = contractName(target.contractType)
    // match from sub user contract list【匹配下级用户签约数据】
    if (subordinateContractAll.length > 0) {
      for (let index_child = 0; index_child < subordinateContractAll.length; index_child++) {
        const element = subordinateContractAll[index_child]
        if (element?.templateID === target?.templateID) {
          target.contractSigned = true
          target.child_contractID = element.contractID
          target.configList = JSON.parse(element.jsonConf || '[]')
          const originConfigList = JSON.parse(target.jsonConf || '[]')
          // jsonConf copy my contract value
          for (let i = 0; i < target.configList.length; i++) {
            const temp = originConfigList[i]
            target.configList[i].originValue = temp.value
            // temp.value = moneyChange(
            //   temp.value,
            //   target.contractCalcMod,
            // )
          }
          break
        }
      }
    }
  }
  contractInfoList.value = myContract
  loading.value = false
  toast.close()
}

function onShowSign(data: IObject) {
  actionType.value = 'create'
  currentData.value = data
  contractModalShow.value = true
}

function onShowEdit(data: IObject) {
  actionType.value = 'edit'
  currentData.value = data
  contractModalShow.value = true
}

function onShowDelete(data: IObject) {
  actionType.value = 'delete'
  currentData.value = data
  contractModalShow.value = true
}

function onRefresh() {
  loading.value = true
  getMyContract()
}

onBeforeMount(() => {
  // init
  onRefresh()
  // get subordinate detail
  const routeParams = route.params as Record<string, any>
  getSubordinateDetails(routeParams.userId)
})
</script>

<template>
  <Container :title="$t('web.i18nFront.label.teamSign')">
    <div class="h-full flex flex-col">
      <div class="h-11 flex items-center bg-[var(--card-bg-color)] px-4 text-sm color-[var(--text-gray-color)]">
        <span>{{ $t('web.i18nFront.label.subAccount') }}:</span><span>{{ subUserInfo.nickName }}</span>
      </div>
      <div class="flex-1 overflow-auto px-3">
        <van-pull-refresh v-model="refreshing" class="h-full !overflow-y-scroll" @refresh="onRefresh">
          <van-list
            v-model:loading="loading"
            :finished="true"
          >
            <template v-if="contractInfoList && contractInfoList.length > 0">
              <ContractItem
                v-for="(data, i) in contractInfoList"
                :key="i"
                show-head
                :item-data="data"
                @on-sign="onShowSign"
                @on-edit="onShowEdit"
                @on-delete="onShowDelete"
              />
            </template>
            <template v-else>
              <div class="h-full flex flex-col justify-center">
                <van-empty image-size="100" :description="$t('web.i18nFront.hint.noData')" />
              </div>
            </template>
            <div class="h-10" />
          </van-list>
        </van-pull-refresh>
      </div>
      <SignModalContent
        v-model="contractModalShow"
        :type="actionType"
        :sub-name="subUserInfo.nickName"
        :item-data="currentData"
        @refresh="onRefresh"
      />
    </div>
  </Container>
</template>

<style lang="less" scoped></style>
