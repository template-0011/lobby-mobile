import { defineStore } from 'pinia'
import { useRouteCacheStoreHook } from './routeCache'
import { store } from '@/store'
import { contractHttp, userHttp } from '@/01-kk-system/allHttp/userHall/user'
import { kkAuth } from '@/01-kk-system/allUtils/kkAuth'
import type { GameUserInfo, LoginRequestData } from '@/01-kk-system/allHttp/types/common'
import type { BalanceType } from '@/types/type'
import { getWalletAndCurrencyList } from '@/01-kk-system/middleware/cacheHttp'
import { getAvailableWalletsWithCurrency, getFlatAvailableWalletsInfo } from '@/01-kk-system/middleware/fusionApi/wallets'
import { CURRENT_WALLET_CURRENT } from '@/01-kk-system/allDefine/common/const'
import { authenticationHttp } from '@/01-kk-system/allHttp/userHall/login'

const routeCacheStore = useRouteCacheStoreHook()

const useUserStore = defineStore('user', () => {
  const token = ref(kkAuth.getToken() || '')
  const userInfo = ref<GameUserInfo>(kkAuth.getUserInfo() || {})
  const showLogin = ref(false)
  const showRegester = ref(false)
  const hasFundPwd = ref(false)
  const currentWalletInfo = useStorage(CURRENT_WALLET_CURRENT, {
    walletType: '1',
    currencyCode: '1',
    abbreviation: 'CNY',
    symbol: 'CN¥',
    name: '',
  })
  const balanceInfo = ref<BalanceType>({})
  const walletAndCurrency = ref<Record<string, any>[]>([])
  const avalableWallets = ref<Record<string, any>[]>([])
  const avalableFlatWallets = ref<Record<string, any>[]>([])
  const myContractSalary = ref<Record<string, any>[]>([])

  function setLoginModalState(state: boolean) {
    showLogin.value = state
  }

  function setRegesterModalState(state: boolean) {
    showRegester.value = state
  }

  /**
   * 登录
   * @params loginData
   * @returns any
   */
  function login(loginData: LoginRequestData) {
    return new Promise<void>((resolve, reject) => {
      const { userName, password } = loginData || {}
      authenticationHttp
        .login({ userName: userName.trim(), password })
        .then((response) => {
          const { code, data } = response || {}
          if (code === '0') {
            const tempToken = data?.userToken || ''
            token.value = tempToken
            kkAuth.setToken(tempToken)
            getUserInfo()
              .then(() => resolve())
              .catch(error => reject(error))
          }
          else {
            reject()
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  // 试玩登录
  async function guestLogin() {
    try {
      const response = await authenticationHttp.visitorLogin()
      const { loginPassword, userName } = response?.data || {}
      const res = await authenticationHttp.login({ userName, password: loginPassword })
      const { code, data } = res || {}
      if (code === '0') {
        const tempToken = data?.userToken || ''
        token.value = tempToken
        kkAuth.setToken(tempToken)
        await getUserInfo()
      }
      else {
        throw new Error('login failed')
      }
    }
    catch (error: any) {
      throw new Error(error?.message ?? 'login failed')
    }
  }

  // 获取信息
  async function getUserInfo() {
    const res = await userHttp.getAccount()
    const { data, code } = res || {}
    if (code === '0') {
      userInfo.value = data
      const { currentCurrencyCode, currentWalletType } = data || {}
      currentWalletInfo.value.walletType = currentWalletType
      currentWalletInfo.value.currencyCode = currentCurrencyCode
      kkAuth.setUserInfo(data)
      // get balance
      getUserBanlance()
    }
  }

  // user logout
  function logout() {
    return new Promise<void>((resolve) => {
      userHttp.logout().then(() => {
        resolve()
      })
    })
  }

  const resetToken = () => {
    kkAuth.clearToken()
    kkAuth.clearUserInfo()
    token.value = ''
    userInfo.value = {}
    routeCacheStore.clearRouteCache()
  }

  // 获取钱包和币种列表
  async function fetchWallets() {
    if (walletAndCurrency.value && walletAndCurrency.value.length > 0) {
      return walletAndCurrency.value
    }
    const list = await getWalletAndCurrencyList().catch(() => null)
    walletAndCurrency.value = list || []
    return list || []
  }

  // 列表查询【平台钱包disable】信息
  async function getAvailableWallets() {
    const list = await getAvailableWalletsWithCurrency().catch(() => null)
    avalableWallets.value = list || []
    return list || []
  }
  // 获取可用钱包列表
  async function getFlatAvailableWalletList() {
    const list = await getFlatAvailableWalletsInfo().catch(() => null)
    avalableFlatWallets.value = list || []
    return list || []
  }
  // 获取余额
  async function getUserBanlance(params?: {
    walletType: string
    currencyCode: string
  }) {
    const { walletType, currencyCode } = params || currentWalletInfo.value
    if (!walletType || !currencyCode) {
      return
    }
    const res = await userHttp
      .getBalance(walletType, currencyCode)
      .catch(() => null)
    const { code, data } = res || {}
    if (code === '0' && data) {
      balanceInfo.value = data
    }
    else {
      balanceInfo.value = {}
    }
    return balanceInfo.value
  }
  // 设置钱包和币种信息
  function setCurrentWalletInfo(data: {
    walletType: string
    currencyCode: string
    abbreviation: string
    symbol: string
    name: string
  }) {
    currentWalletInfo.value = data
  }
  // 更新用户的钱包、币种、用户信息
  async function updateUserInfo() {
    // 更新用户信息和余额
    getUserInfo()
  }
  // 更新用户的钱包、币种、用户信息
  async function updateUserWalletInfo({ walletType, currencyCode }: { walletType: string, currencyCode: string }) {
    // 更新当前钱包信息
    const params = {
      currentWalletType: walletType ?? currentWalletInfo.value.walletType,
      currentCurrencyCode: currencyCode ?? currentWalletInfo.value.currencyCode,
    }
    const res = await userHttp
      .updateCurrentwallet(params)
      .catch(() => null)
    const { code } = res || {}
    if (code === '0') {
      // 更新用户信息和余额
      await getUserInfo()
    }
  }
  // 获取我的契约 - 列表 - 使用第一个数据
  async function getMyContractSalary() {
    if (myContractSalary.value.length > 0) {
      return myContractSalary.value
    }
    const res = await contractHttp.getMySalary().catch(() => null)
    const { code, data } = res || {}
    if (code === '0') {
      myContractSalary.value = data || []
    }
  }
  // 是否有资金密码
  async function checkFundPwdExist() {
    const res = await userHttp.checkFundpassword().catch(() => null)
    const { data } = res || {}
    hasFundPwd.value = data as unknown as boolean
    return hasFundPwd.value
  }

  return {
    token,
    userInfo,
    showLogin,
    showRegester,
    currentWalletInfo,
    walletAndCurrency,
    avalableWallets,
    balanceInfo,
    myContractSalary,
    hasFundPwd,
    login,
    getUserInfo,
    logout,
    resetToken,
    setLoginModalState,
    setRegesterModalState,
    getAvailableWallets,
    fetchWallets,
    setCurrentWalletInfo,
    updateUserInfo,
    getUserBanlance,
    getMyContractSalary,
    checkFundPwdExist,
    guestLogin,
    getFlatAvailableWalletList,
    updateUserWalletInfo,
  }
}, {
  persist: true,
})

export default useUserStore

// 非setup
export function useUserStoreHook() {
  return useUserStore(store)
}
