<script setup lang="ts">
import { showLoadingToast } from 'vant'
import type { IObject } from '@/01-kk-system/allHttp/types/common'
import { fundhistoryHttp } from '@/01-kk-system/allHttp/userHall/games'
import { getDateStartAndEnd } from '@/01-kk-system/allUtils/utils'
import { getFlatAvailableWalletsInfo } from '@/01-kk-system/middleware/fusionApi/wallets'
import useUserStore from '@/store/modules/user'

defineOptions({
  name: 'MyBill',
})

const userStore = useUserStore()

const businessCode = ref('')
const reasonCode = ref('')
const walletsList = ref<IObject[]>([])
const list = ref<IObject[]>([])
const pagination = ref({
  pageSize: 10,
  totalPage: 0,
  currentPage: 1,
})

const loading = ref(false)
const refreshing = ref(false)
const showSearch = ref(false)

const initDate = getDateStartAndEnd(0)
let currentDate: { dateFrom: string, dateTo: string } = {
  dateFrom: initDate.start,
  dateTo: initDate.end,
}
function updateDate(date: { dateFrom: string, dateTo: string }) {
  currentDate = date
  showSearch.value = false
  onRefresh()
}

async function getAvailableWC() {
  const flatList = await getFlatAvailableWalletsInfo().catch(() => null)
  walletsList.value = flatList || []
}

function pageChange() {
  if (loading.value) {
    return
  }
  fetchList()
}

async function fetchList() {
  if (refreshing.value) {
    // list.value = []
    refreshing.value = false
  }
  const toast = showLoadingToast({
    duration: 0,
    forbidClick: true,
  })
  const { walletType, currencyCode } = userStore.currentWalletInfo
  const { dateFrom, dateTo } = currentDate || {}
  const params = {
    walletType,
    currencyCode,
    current: pagination.value.currentPage,
    size: pagination.value.pageSize,
    operateTimeFromFrom: dateFrom,
    operateTimeFromTo: dateTo,
    businessCode: businessCode.value === '0' ? null : businessCode.value,
    reasonCode: reasonCode.value === '0' ? null : reasonCode.value,
  }
  loading.value = true
  const res = await fundhistoryHttp.listBy(params).catch(() => null)
  const { code, data } = res || {}
  if (code === '0') {
    const { recordList, pages } = data || {}
    list.value = recordList || []
    pagination.value.totalPage = Number(pages || 0)
  }
  loading.value = false
  toast.close()
}

function onRefresh() {
  // reload data
  pagination.value.currentPage = 1
  loading.value = true
  fetchList()
}

onBeforeMount(() => {
  onRefresh()
  getAvailableWC()
})
</script>

<template>
  <div class="h-screen flex flex-col">
    <TopNav :title="$t('web.i18nFront.label.accountDetail')" />
    <CommonHits class="mx-3" />
    <div class="flex justify-end text-sm filter">
      <div class="px-2 py-3" @click="showSearch = !showSearch">
        <span>{{ $t('web.i18nFront.title.filter') }}</span>
        <van-icon name="filter-o" />
      </div>
    </div>
    <div class="mx-3 flex-1 overflow-auto">
      <van-pull-refresh v-model="refreshing" class="h-full !overflow-y-scroll" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="true"
        >
          <template v-if="list && list.length > 0">
            <BillItem v-for="(data, i) in list" :key="i" :item-data="data" :wallets-list="walletsList" />
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
    <van-pagination v-model="pagination.currentPage" :page-count="pagination.totalPage" mode="simple" @change="pageChange" />
    <van-action-sheet v-model:show="showSearch" :title="$t('web.i18nFront.title.search')" class="bottom-search">
      <DateSearch @send-data="updateDate" />
    </van-action-sheet>
  </div>
</template>

<style lang="less" scoped></style>
