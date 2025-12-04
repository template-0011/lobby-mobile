<script setup lang="ts">
import { showLoadingToast } from 'vant'
import type { IObject } from '@/01-kk-system/allHttp/types/common'
import { teamHttp } from '@/01-kk-system/allHttp/userHall/team'
import { formatNum, getDateStartAndEnd, totalSell, totalWin } from '@/01-kk-system/allUtils/utils'
import useUserStore from '@/store/modules/user'

defineOptions({
  name: 'MyReportAll',
})

const { t } = useI18n()
const userStore = useUserStore()
const teamSubAllFund = ref<IObject>({})
const loading = ref(false)
const refreshing = ref(false)
const refreshChart = ref(false)
const chartData = ref<any[]>([])
const barChartRef = ref<any>()
const showSearch = ref(false)

const totalSellVal = computed(() => totalSell(teamSubAllFund.value, 4))
const totalWinVal = computed(() => totalWin(teamSubAllFund.value, 4))
const unit = computed(() => userStore.currentWalletInfo.abbreviation)

const initDate = getDateStartAndEnd(0)
let currentDate: { dateFrom: string, dateTo: string } = {
  dateFrom: initDate.start,
  dateTo: initDate.end,
}

function updateDate(date: { dateFrom: string, dateTo: string }) {
  currentDate = date
  showSearch.value = false
  onRefreshMoneyAll()
}

async function fetchList() {
  const toast = showLoadingToast({
    duration: 0,
    forbidClick: true,
  })
  const { walletType, currencyCode } = userStore.currentWalletInfo
  const { dateFrom, dateTo } = currentDate || {}
  const params = {
    currencyCode,
    walletType,
    dateFrom: dateFrom.split(' ')[0],
    dateTo: dateTo.split(' ')[0],
  }
  loading.value = true
  const res = await teamHttp.selfAll(params).catch(() => null)
  const { code, data } = res || {}
  if (code === '0') {
    teamSubAllFund.value = data
  }
  loading.value = false
  toast.close()
  if (refreshing.value) {
    refreshing.value = false
  }
}

async function getLatest10Day() {
  const { walletType, currencyCode } = userStore.currentWalletInfo
  const { start, end } = getDateStartAndEnd(-10)
  const params = {
    currencyCode,
    walletType,
    dateFrom: start.split(' ')[0],
    dateTo: end.split(' ')[0],
  }
  refreshChart.value = true
  const res = await teamHttp.selfByDate(params).catch(() => null)
  const { code, data = [] } = res || {}
  if (code === '0') {
    const list: any[] = []
    data.forEach((element: IObject) => {
      element = element || {}
      const temp = {
        product: element.date,
        [t('web.i18nFront.label.allActivity')]: element.totalActivityMoney,
        [t('web.i18nFront.title.allRewards')]: element.totalBonusMoney,
        [t('web.i18nFront.title.allRecharge')]: element.totalDepositeMoney,
        [t('web.i18nFront.title.allLost')]: element.totalLossMoney,
        [t('web.i18nFront.label.allProfit')]: element.totalProfitMoney,
        [t('web.i18nFront.label.allRebate')]: element.totalRebateMoney,
        [t('web.i18nFront.title.allSalary')]: element.totalSalaryMoney,
        [t('web.i18nFront.title.allSell')]: element.totalSellMoney,
        [t('web.i18nFront.title.allWin')]: element.totalWinMoney,
        [t('web.i18nFront.title.allWithdraw')]: element.totalWithdrawMoney,
      }
      list.push(temp)
    })
    chartData.value = list
    updateChartData()
  }
  refreshChart.value = false
}

function updateChartData() {
  const option = {
    legend: {
      top: 10,
      bottom: 0,
    },
    tooltip: {},
    dataset: {
      dimensions: [
        'product',
        t('web.i18nFront.label.allActivity'),
        t('web.i18nFront.title.allRewards'),
        t('web.i18nFront.title.allRecharge'),
        t('web.i18nFront.title.allLost'),
        t('web.i18nFront.label.allProfit'),
        t('web.i18nFront.label.allRebate'),
        t('web.i18nFront.title.allSalary'),
        t('web.i18nFront.title.allSell'),
        t('web.i18nFront.title.allWin'),
        t('web.i18nFront.title.allWithdraw'),
      ],
      source: chartData.value,
    },
    xAxis: { type: 'category' },
    yAxis: {},
    grid: {
      top: 110,
    },
    series: [
      { type: 'bar' },
      { type: 'bar' },
      { type: 'bar' },
      { type: 'bar' },
      { type: 'bar' },
      { type: 'bar' },
      { type: 'bar' },
      { type: 'bar' },
      { type: 'bar' },
      { type: 'bar' },
      { type: 'bar' },
    ],
  }
  if (barChartRef.value && barChartRef.value.updateChart) {
    barChartRef.value.updateChart(option)
  }
  refreshChart.value = false
}

function onRefreshLast10() {
  getLatest10Day()
}

function onRefreshMoneyAll() {
  // reload data
  loading.value = true
  fetchList()
}

function init() {
  onRefreshMoneyAll()
  getLatest10Day()
}

onBeforeMount(() => {
  init()
})
</script>

<template>
  <div class="h-screen flex flex-col">
    <TopNav :title="$t('web.i18nFront.label.personCompReport')" />
    <CommonHits class="mx-3" :p2="true" />
    <div class="flex justify-end text-sm filter">
      <div class="px-2 py-3" @click="showSearch = !showSearch">
        <span>{{ $t('web.i18nFront.title.filter') }}</span>
        <van-icon name="filter-o" />
      </div>
    </div>
    <div class="flex-1 overflow-auto px-3">
      <van-pull-refresh v-model="refreshing" @refresh="init">
        <van-list
          v-model:loading="loading"
          :finished="true"
        >
          <van-divider />
          <van-row class="text-sm">
            <van-col class="van-hairline--right text-center" :span="12">
              <p class="mb-2">
                {{ $t("web.i18nFront.label.sellAll") }}
              </p>
              <p>{{ totalSellVal }}{{ unit }}</p>
            </van-col>
            <van-col class="text-center" :span="12">
              <p class="mb-2">
                {{ $t("web.i18nFront.label.winAll") }}
              </p>
              <p>{{ totalWinVal }}{{ unit }}</p>
            </van-col>
          </van-row>
          <van-divider />
          <van-row class="text-sm">
            <van-col class="van-hairline--right text-center" :span="12">
              <p class="mb-2">
                {{ $t("web.i18nFront.label.rechargeAll") }}
              </p>
              <p>{{ formatNum(teamSubAllFund.rechargeAll) }}{{ unit }}</p>
            </van-col>
            <van-col class="text-center" :span="12">
              <p class="mb-2">
                {{ $t("web.i18nFront.label.withdrawAll") }}
              </p>
              <p>{{ formatNum(teamSubAllFund.totalWithdrawMoney) }}{{ unit }}</p>
            </van-col>
          </van-row>
          <van-divider />
          <van-row class="text-sm">
            <van-col class="van-hairline--right text-center" :span="12">
              <p class="mb-2">
                {{ $t("web.i18nFront.label.allActivity") }}
              </p>
              <p>{{ formatNum(teamSubAllFund.totalActivityMoney) }}{{ unit }}</p>
            </van-col>
            <van-col class="text-center" :span="12">
              <p class="mb-2">
                {{ $t("web.i18nFront.label.allContract") }}
              </p>
              <p>{{ formatNum(teamSubAllFund.totalContractMoney) }}{{ unit }}</p>
            </van-col>
          </van-row>
          <van-divider />
          <van-row class="text-sm">
            <van-col class="van-hairline--right text-center" :span="12">
              <p class="mb-2">
                {{ $t("web.i18nFront.label.allRebate") }}
              </p>
              <p>{{ formatNum(teamSubAllFund.totalRebateMoney) }}{{ unit }}</p>
            </van-col>
            <van-col class="text-center" :span="12">
              <p class="mb-2">
                {{ $t("web.i18nFront.label.allProfit") }}
              </p>
              <p>{{ formatNum(teamSubAllFund.totalProfitMoney) }}{{ unit }}</p>
            </van-col>
          </van-row>
          <van-divider />
          <van-row>
            <van-col span="24" class="">
              <div class="my-5 flex-center gap-x-4">
                <span>{{ $t("web.i18nFront.label.last10Trend") }}</span>
                <van-button
                  icon="replay"
                  size="mini"
                  :loading="refreshChart"
                  @click="onRefreshLast10"
                />
              </div>
              <div class="h-450px w-full bg-[var(--card-bg-color)]">
                <BarChart ref="barChartRef" />
              </div>
            </van-col>
          </van-row>
          <div class="h-20" />
        </van-list>
      </van-pull-refresh>
    </div>
    <van-action-sheet v-model:show="showSearch" :title="$t('web.i18nFront.title.search')" class="bottom-search">
      <DateSearch @send-data="updateDate" />
    </van-action-sheet>
  </div>
</template>

<style lang="less" scoped></style>
