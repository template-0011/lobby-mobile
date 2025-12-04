<script setup lang="ts">
import { showLoadingToast } from 'vant'
import { lottoOwnerEnum } from '@/01-kk-system/allDefine/enum/frontend/game'
import type { IObject } from '@/01-kk-system/allHttp/types/common'
import { betRecordTeamHttp } from '@/01-kk-system/allHttp/userHall/games'
import { getDateStartAndEnd } from '@/01-kk-system/allUtils/utils'
import useUserStore from '@/store/modules/user'

defineOptions({
  name: 'TeamReportLottery',
})

const userStore = useUserStore()

const lotteryTypes = [
  {
    value: '',
    label: 'web.i18nFront.label.allGames',
  },
  ...lottoOwnerEnum.data,
]

const loading = ref(false)
const refreshing = ref(false)
const showSearch = ref(false)
const showDetail = ref(false)
const walletsList = ref<IObject[]>([])
const list = ref<IObject[]>([])
const currentRow = ref<IObject>({})
const pagination = ref({
  pageSize: 10,
  totalPage: 0,
  currentPage: 1,
})

const initDate = getDateStartAndEnd(0)
let currentDate: { dateFrom: string, dateTo: string, lottoOwnerShip: string } = {
  dateFrom: initDate.start,
  dateTo: initDate.end,
  lottoOwnerShip: '',
}
function updateDate(date: { dateFrom: string, dateTo: string, game: string }) {
  const { dateFrom, dateTo, game } = date || {}
  currentDate = {
    dateFrom,
    dateTo,
    lottoOwnerShip: game,
  }
  showSearch.value = false
  onRefresh()
}

async function fetchList() {
  if (refreshing.value) {
    refreshing.value = false
  }
  const toast = showLoadingToast({
    duration: 0,
    forbidClick: true,
  })
  const { walletType, currencyCode } = userStore.currentWalletInfo
  const { dateFrom, dateTo, lottoOwnerShip } = currentDate || {}
  const params = {
    walletType,
    currencyCode,
    current: pagination.value.currentPage,
    size: pagination.value.pageSize,
    betTimeFrom: dateFrom,
    betTimeTo: dateTo,
    lottoOwnerShip,
  }
  loading.value = true
  const res = await betRecordTeamHttp.normalBetRecordList(params).catch(() => null)
  const { code, data } = res || {}
  if (code === '0') {
    const { recordList, pages } = data || {}
    list.value = recordList || []
    pagination.value.totalPage = Number(pages || 0)
  }
  loading.value = false
  toast.close()
}

function pageChange() {
  if (loading.value) {
    return
  }
  fetchList()
}

function onRefresh() {
  pagination.value.currentPage = 1
  loading.value = true
  fetchList()
}

function onClickItem(data: IObject) {
  currentRow.value = data
  showDetail.value = true
}

onBeforeMount(() => {
  onRefresh()
})
</script>

<template>
  <Container :title="$t('web.i18nFront.label.teamLottery')">
    <div class="h-full flex flex-col">
      <CommonHits class="mx-3" />
      <div class="flex justify-end text-sm color-#c5c8db filter">
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
              <LotteryReportCell
                v-for="(data, i) in list"
                :key="i"
                :item-data="data"
                :wallets-list="walletsList"
                @click="onClickItem(data)"
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
      <van-pagination v-model="pagination.currentPage" :page-count="pagination.totalPage" mode="simple" @change="pageChange" />
      <van-action-sheet v-model:show="showSearch" :title="$t('web.i18nFront.title.search')" class="bottom-search">
        <DateSearch :game-list="lotteryTypes" @send-data="updateDate" />
      </van-action-sheet>
    </div>
    <LotteryDetail v-model="showDetail" :details="currentRow" />
  </Container>
</template>

<style lang="less" scoped></style>
