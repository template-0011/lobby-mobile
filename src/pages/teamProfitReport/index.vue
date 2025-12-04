<script setup lang="ts">
import { showLoadingToast } from 'vant'
import ProfitCell from './components/ProfitCell/index.vue'
import ProfitDetail from './components/ProfitDetail/index.vue'
import type { IObject } from '@/01-kk-system/allHttp/types/common'
import { teamHttp } from '@/01-kk-system/allHttp/userHall/team'
import { getDateStartAndEnd } from '@/01-kk-system/allUtils/utils'
import { type BreadcrumbUser, useBreadcrumb } from '@/components/CustomBreadcrumb/useBreadcrumb'
import useUserStore from '@/store/modules/user'

defineOptions({
  name: 'TeamMoneyChange',
})

const userStore = useUserStore()
const { breadcrumbUsers, getRootUser } = useBreadcrumb()

const loading = ref(false)
const refreshing = ref(false)
const showSearch = ref(false)
const showDetail = ref(false)
const listData = ref<IObject[]>([])
const totalObj = ref<IObject>({})
const currentRow = ref<IObject>({})

const initDateVal = ref(-30)

const initDate = getDateStartAndEnd(initDateVal.value)
let currentDate: {
  dateFrom: string
  dateTo: string
  dateLabelKey: string
  includeZero: number
} = {
  dateFrom: initDate.start,
  dateTo: initDate.end,
  dateLabelKey: 'web.i18nFront.title.last030',
  includeZero: 1,
}

async function fetchList(userId: string) {
  if (refreshing.value) {
    refreshing.value = false
  }
  const toast = showLoadingToast({
    duration: 0,
    forbidClick: true,
  })
  const { walletType, currencyCode } = userStore.currentWalletInfo
  const { dateFrom, dateTo, includeZero } = currentDate || {}
  const params = {
    walletType,
    currencyCode,
    dateFrom: dateFrom.split(' ')[0],
    dateTo: dateTo.split(' ')[0],
    superiorID: userId,
  }
  loading.value = true
  const res = await teamHttp.subUserFundList(params).catch(() => null)
  const { code, data, aggregationSum } = res || {}
  if (code === '0') {
    const list = data || []
    if (includeZero === 0) {
      const newL = list.filter((n: IObject) => {
        return !n.isAllZero
      })
      listData.value = newL
    }
    else {
      listData.value = list
    }
    totalObj.value = aggregationSum || {}
  }
  loading.value = false
  toast.close()
}

function onRefresh(superiorID?: string) {
  loading.value = true
  if (!superiorID) {
    const rootUser = getRootUser()
    fetchList(rootUser.userID)
  }
  else {
    fetchList(superiorID)
  }
}

function updateDate(date: { dateFrom: string, dateTo: string, game: string, dateLabelKey: string, includeZero: number }) {
  const { dateFrom, dateTo, dateLabelKey, includeZero } = date || {}
  currentDate = {
    dateFrom,
    dateTo,
    dateLabelKey,
    includeZero,
  }
  showSearch.value = false
  onRefresh()
}

// 面包屑点击
function onClickCrumb(currentUser: BreadcrumbUser) {
  if (currentUser) {
    onRefresh(currentUser.userID)
  }
}

function getUserList(row: IObject) {
  if (loading.value) {
    return
  }
  const { userID, userName } = row
  if (breadcrumbUsers.value[breadcrumbUsers.value.length - 1]?.userID === userID) {
    return
  }
  breadcrumbUsers.value.push({
    userID,
    userName,
  })
  onRefresh(userID)
}

function onClickItem(row: IObject) {
  currentRow.value = JSON.parse(JSON.stringify(row))
  console.log('------', JSON.parse(JSON.stringify(row)))
  showDetail.value = true
}

onBeforeMount(() => {
  onRefresh()
})
</script>

<template>
  <Container :title="$t('web.i18nFront.label.teamProfit')">
    <div class="h-full flex flex-col">
      <CommonHits class="mx-3" />
      <CustomBreadcrumb v-model="breadcrumbUsers" :show-filter="true" @on-filter="showSearch = !showSearch" @on-click="onClickCrumb" />
      <div class="mx-3 flex-1 overflow-auto">
        <van-pull-refresh v-model="refreshing" class="h-full !overflow-y-scroll" @refresh="onRefresh">
          <van-list
            v-model:loading="loading"
            :finished="true"
          >
            <template v-if="listData && listData.length > 0">
              <ProfitCell key="total" :item-data="totalObj" :is-total="true" @on-detail="onClickItem" />
              <ProfitCell
                v-for="(data, i) in listData"
                :key="i"
                :item-data="data"
                :date-key="currentDate.dateLabelKey"
                @on-sub-user="getUserList"
                @on-detail="onClickItem"
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
      <van-action-sheet v-model:show="showSearch" :title="$t('web.i18nFront.title.search')" class="bottom-search">
        <DateSearch v-model="initDateVal" :show-include-zero="true" @send-data="updateDate" />
      </van-action-sheet>
    </div>
    <ProfitDetail v-model="showDetail" :item-data="currentRow" />
  </Container>
</template>

<style lang="less" scoped></style>
