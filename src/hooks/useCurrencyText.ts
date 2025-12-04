import type { IObject } from '@/01-kk-system/allHttp/types/common'
import { getFlatAvailableWalletsInfo } from '@/01-kk-system/middleware/fusionApi/wallets'

export function useCurrencyText() {
  const walletsList = ref<IObject[]>([])

  const getAvailableWC = async () => {
    const flatList = await getFlatAvailableWalletsInfo().catch(() => null)
    walletsList.value = flatList || []
  }

  const getCurrency = (wallet: string, currency: string) => {
    const code = `${wallet}-${currency}`
    const target = walletsList.value.find(item => item.value === code) || {}
    return target.abbreviation ? target.abbreviation : '-'
  }

  onBeforeMount(() => {
    getAvailableWC()
  })

  return {
    getAvailableWC,
    getCurrency,
  }
}
