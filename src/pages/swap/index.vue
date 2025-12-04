<script setup lang="ts">
import { showLoadingToast, showNotify } from 'vant'
import { platformHttp } from '@/01-kk-system/allHttp/userHall/platform'
import { userHttp } from '@/01-kk-system/allHttp/userHall/user'
import useUserStore from '@/store/modules/user'

// 响应式状态
const formWallet = ref('')
const toWallet = ref('')
const curFromWallet = ref<Record<string, any>>({})
const curToWallet = ref<Record<string, any>>({})
const refreshBalance = ref(false)
const fromMoney = ref('')
const toMoney = ref('')
const walletexchange = ref<Record<string, any>[]>([])
const loading = ref(false)

const showPicker = ref(false)
const pickerType = ref<1 | 2>(1)
const defauleIndex = ref(0)

const { t } = useI18n()

const walletList = ref<Record<string, any>[]>([])
const canUseWalletList = ref<Record<string, any>[]>([])

const userStore = useUserStore()

// 获取可用钱包列表
async function getOkWalletList() {
  try {
    const list = await userStore.getFlatAvailableWalletList()
    // 移除点数钱包
    const finalList = []
    list.forEach((data: any, index: number) => {
      if (data.abbreviation !== 'POINT') {
        finalList.push({
          ...data,
          text: `${t(data.name)}-${data.abbreviation}`,
          index,
        })
      }
    })
    canUseWalletList.value = finalList ?? []
    walletList.value = finalList ?? []
  }
  catch (error) {
    console.error(error)
  }
}

function initWallet() {
  const curToWallet = canUseWalletList.value.find((data: any) => data.abbreviation !== userStore.currentWalletInfo.abbreviation)
  const curFromWallet = canUseWalletList.value.find((data: any) => data.abbreviation === userStore.currentWalletInfo.abbreviation)
  curFromWallet.value = curFromWallet ?? {}
  formWallet.value = curFromWallet.value.abbreviation ?? ''
  curToWallet.value = curToWallet ?? {}
  toWallet.value = curToWallet.value.abbreviation ?? ''
}

async function getLobbyAccountBalanceHandler() {
  const { walletType, currencyCode } = curFromWallet.value
  if (!walletType || !currencyCode)
    return
  try {
    refreshBalance.value = true
    const res = await userHttp.getBalance(walletType, currencyCode)
    if (res.code === '0') {
      curFromWallet.value.balance = res.data.balance
    }
  }
  finally {
    refreshBalance.value = false
  }
}

async function getWalletexchangeHandler() {
  try {
    const res = await platformHttp.getWalletexchange()
    if (res.code === '0')
      walletexchange.value = res.data
  }
  catch (error) {
    console.error(error)
  }
}

function allMoney() {
  fromMoney.value = curFromWallet.value.balance
}

function exchange() {
  const from = formWallet.value
  const to = toWallet.value
  formWallet.value = to
  toWallet.value = from
  fromMoney.value = ''
  toMoney.value = ''
}

function fromChange() {
  const fromMoneyNum = Number(fromMoney.value ?? 0)
  if (!fromMoneyNum) {
    toMoney.value = ''
    return
  }
  if (!walletexchange.value.length) {
    showNotify(t('web.i18nFront.tips.exchangeFail'))
    return
  }

  let from = 0
  let to = 0
  for (const element of walletexchange.value) {
    if (element.walletType === curFromWallet.value.walletType
      && element.currencyCode === curFromWallet.value.currencyCode) {
      from = Number(element.exchangeRate)
    }
    if (element.walletType === curToWallet.value.walletType
      && element.currencyCode === curToWallet.value.currencyCode) {
      to = Number(element.exchangeRate)
    }
  }

  toMoney.value = ((fromMoneyNum / from) * to).toFixed(2)
}

async function sureChange() {
  if (!walletexchange.value.length) {
    showNotify(t('web.i18nFront.tips.exchangeFail'))
    return
  }
  if (!fromMoney.value || !toMoney.value) {
    showNotify(t('web.i18nFront.tips.exchangeError'))
    return
  }

  if (curFromWallet.value.abbreviation !== curToWallet.value.abbreviation) {
    const params = {
      fromCurrencyCode: curFromWallet.value.currencyCode,
      fromWalletType: curFromWallet.value.walletType,
      money: fromMoney.value,
      toCurrencyCode: curToWallet.value.currencyCode,
      toWalletType: curToWallet.value.walletType,
    }

    loading.value = true
    try {
      const res = await userHttp.exchange(params)
      if (res?.code === '0') {
        showNotify(t('web.i18nFront.tips.exchangeSuccess'))
        fromMoney.value = ''
        toMoney.value = ''
        getLobbyAccountBalanceHandler()
      }
    }
    finally {
      loading.value = false
    }
  }
  else {
    showNotify(t('web.i18nFront.tips.exchangeSame'))
  }
}

// 弹窗显示
function showPickerFun(type: 1 | 2) {
  console.log('curFromWallet.value====', type)
  // 从钱包 默认下标
  if (type === 1) {
    defauleIndex.value = curFromWallet.value.index
  }
  else {
    // 至钱包 默认下标
    defauleIndex.value = curToWallet.value.index
  }

  pickerType.value = type
  showPicker.value = true
}

function onConfirm(value: any) {
  // 从钱包选择完请求余额接口
  const { selectedValues } = value ?? {}
  if (pickerType.value === 1) {
    formWallet.value = selectedValues[0] ?? ''
    fromMoney.value = ''
  }
  else {
    toWallet.value = selectedValues[0] ?? ''
    if (fromMoney.value)
      fromChange()
  }
  showPicker.value = false
}
// 监听器
watch(fromMoney, () => {
  fromChange()
})

watch(formWallet, () => {
  const target = canUseWalletList.value.find((data: any) => data.abbreviation === formWallet.value)
  curFromWallet.value = target ?? {}
  fromMoney.value = ''
  getLobbyAccountBalanceHandler()
})

watch(toWallet, () => {
  const target = canUseWalletList.value.find((data: any) => data.abbreviation === toWallet.value)
  curToWallet.value = target ?? {}
  if (fromMoney.value && target) {
    fromChange()
  }
})

// watch(canUseWalletList, () => {
//   initWallet()
// })

async function init() {
  const toast = showLoadingToast({
    duration: 0,
    forbidClick: true,
  })
  try {
    await Promise.allSettled([
      getOkWalletList(),
      getWalletexchangeHandler(),
    ])
    if (!formWallet.value && canUseWalletList.value.length)
      initWallet()
    setTimeout(() => {
      document.getElementById('moneyInput')?.focus()
    }, 60)
  }
  finally {
    toast.close()
  }
}

// 生命周期钩子
onMounted(() => {
  init()
})
</script>

<template>
  <Container :title="$t('web.i18nFront.label.swap')">
    <div class="container">
      <!-- 从钱包 -->
      <div class="card" style="margin-top: 20px">
        <van-row>
          <van-col span="12">
            <p class="top">
              {{ $t('web.i18nFront.label.from') }}
            </p>
            <div class="center" @click="showPickerFun(1)">
              {{ curFromWallet?.name ? $t(curFromWallet.name) : '' }}  - {{ curFromWallet?.abbreviation }}
              <van-icon name="play" class="jiantou" />
            </div>
          </van-col>
          <van-col span="12" class="right">
            <p class="top">
              {{ $t('web.i18nFront.label.availableBalance') }}：
              <span @click="getLobbyAccountBalanceHandler">{{ curFromWallet.balance }} {{ curFromWallet.unit }}
                <van-loading v-if="refreshBalance" type="spinner" size="16" />
                <van-icon v-else name="replay" class="refresh" />
              </span>
            </p>
            <div class="center">
              <input id="moneyInput" v-model="fromMoney" type="number" autofocus class="fromMoney" placeholder="请输入">
            </div>
            <div class="bottom" @click="allMoney">
              {{ $t('web.i18nFront.label.all') }}
            </div>
          </van-col>
        </van-row>
      </div>
      <div class="exChangeDiv" @click="exchange">
        <van-icon name="exchange" />
      </div>
      <!-- 至钱包 -->
      <div class="card">
        <van-row>
          <van-col span="12">
            <p class="top">
              {{ $t('web.i18nFront.label.to') }}
            </p>
            <div class="center" @click="showPickerFun(2)">
              {{ curToWallet?.name ? $t(curToWallet.name) : '' }} - {{ curToWallet?.abbreviation }}
              <van-icon name="play" class="jiantou" />
            </div>
          </van-col>
          <van-col span="12" class="right">
            <div class="center" style="margin-top: 28px">
              <input v-model="toMoney" type="number" class="fromMoney" placeholder="" disabled>
            </div>
          </van-col>
        </van-row>
      </div>

      <p class="hrefText">
        {{ $t('web.i18nFront.tips.exchangeDesc3') }}
      </p>

      <div class="sureChange">
        <van-button :loading="loading" type="primary" round :loading-text="$t('web.i18nFront.operation.exchangeLoading')" block @click="sureChange">
          {{ $t('web.i18nFront.title.sureChange') }}
        </van-button>
      </div>
      <van-popup v-model:show="showPicker" round position="bottom">
        <van-picker
          title=""
          show-toolbar
          :columns="canUseWalletList"
          :default-index="defauleIndex"
          :columns-field-names="{ text: 'text', value: 'abbreviation' }"
          @confirm="onConfirm"
          @cancel="showPicker = false"
        />
      </van-popup>
    </div>
  </Container>
</template>

<style lang="less" scoped>
.container {
  width: 100%;
  padding-bottom: 50px;
  padding-top: 8px;
  overflow-y: auto;
  .card {
    background: linear-gradient(107.15deg, #1e283f, rgba(20, 27, 46, 0.6));
    border-radius: 10px;
    margin: 10px 15px;
    padding: 15px;
    .right {
      text-align: right;
    }
    .top {
      font-size: 12px;
      color: #ffffff;
      .refresh {
        font-weight: bold;
      }
    }
    .center {
      font-size: 14px;
      color: #ffffff;
      margin-top: 15px;
      .jiantou {
        transform: rotate(90deg);
      }
      .fromMoney {
        border: 1px solid #ffffff3d;
        border-radius: 4px;
        padding: 0 10px;
        font-size: 14px;
        width: 120px;
        text-align: right;
        height: 30px;
        background: transparent;
      }
    }
    .bottom {
      margin-top: 10px;
      color: orange;
      font-size: 12px;
    }
  }
  .exChangeDiv {
    width: 40px;
    height: 40px;
    position: absolute;
    left: 50%;
    background: #f4f4f5;
    border-radius: 50%;
    padding: 6px;
    transform: rotate(90deg) translateY(50%);
    font-size: 23px;
    color: #969799;
    margin-top: -27px;
    border: 1px solid #fff;
  }
  .sureChange {
    color: #fff;
    font-size: 16px;
    text-align: center;
    width: 90%;
    margin: 0 auto;
    line-height: 40px;
    margin-top: 30px;
  }
  .hrefText {
    color: #969799;
    font-size: 12px;
    margin: 0 15px;
  }
}
.van-loading {
  display: inline-block;
}
</style>
