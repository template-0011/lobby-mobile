import { defineStore } from 'pinia'
import { Locale } from 'vant'
import en from 'vant/es/locale/lang/en-US'
import { CURRENT_LANGUAGE } from '@/01-kk-system/allDefine/common/const'
import { getLanguage } from '@/i18n'
import { importOneComponentLanguage } from '@/utils/i18n'
import { store } from '@/store'
import { platformHttp } from '@/01-kk-system/allHttp/userHall/platform'
import type { IObject } from '@/01-kk-system/allHttp/types/common'
import { PlatformImageCode } from '@/01-kk-system/allHttp/models/common'
import { localImg } from '@/01-kk-system/allUtils/utils'

// 导入 Element Plus 中英文语言包
function getAllUILibLanguage() {
  const language = importOneComponentLanguage(
    import.meta.glob('@/02-kk-i18n-system/uiLibVant/**/*.js', { eager: true }),
  )
  return language
}

const useAppStore = defineStore('app', () => {
  const language = useStorage(CURRENT_LANGUAGE, getLanguage())
  const showTopBar = useStorage('kk_show_top_bar', true)
  const sidebarOpen = ref(false)
  const logo = ref('')
  const favicon = ref('')
  const activeMenu = ref('egame')
  const banners = ref<string[]>([])
  const platformConfig = ref<IObject>()
  const platDiffConfig = ref<IObject>({})

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  /**
   * 根据语言标识读取对应的语言包 get ui lib language messages by current lang
   */
  const locale = computed(() => {
    const langKey = language?.value || 'en'
    const languageObj = getAllUILibLanguage()
    const currLocale = (languageObj[langKey] || en) as IObject
    const langK = currLocale.langKey || 'en' // vant多语言配置key
    Locale.use(langK, currLocale)
    return currLocale
  })

  /**
   * 获取平台配置
   */
  async function getPlatformConfig() {
    if (platformConfig.value) {
      return platformConfig.value
    }
    const res = await platformHttp.getConfig()
    const { code, data } = res || {}
    if (code === '0') {
      platformConfig.value = data || {}
    }
    if (data.brandName) {
      window.document.title = data.brandName
    }
    return data || {}
  }

  /**
   * switch language
   *
   * @param val
   */
  function changeLanguage(val: string) {
    language.value = val
  }
  /**
   * fetch app images
   *  @pramas code 1: favicon 2: logo
   */
  async function getAppLogoByCode(code: PlatformImageCode) {
    if ([PlatformImageCode.H5_LOGO, PlatformImageCode.PC_LOGO].includes(code) && logo.value) {
      return logo.value
    }
    else if ([PlatformImageCode.H5_FAVICON, PlatformImageCode.PC_FAVICON].includes(code) && favicon.value) {
      return favicon.value
    }
    const res = await platformHttp.getPlatformImageByCode(code).catch(() => null)
    if ([PlatformImageCode.H5_FAVICON, PlatformImageCode.PC_FAVICON].includes(code) && res) {
      favicon.value = res || ''
      setFavicon()
    }
    else if ([PlatformImageCode.H5_LOGO, PlatformImageCode.PC_LOGO].includes(code) && res) {
      logo.value = res || ''
    }
    return res
  }
  /**
   * fetch app banner images
   *  @pramas code = ['10002', '10003', '10004', '10005', '10006']
   */
  async function getAppBanners(isLocal: boolean = false) {
    const pathOrigin = window.location?.origin ?? ''
    if (isLocal || pathOrigin.includes('kk-template') || pathOrigin.includes('localhost:4000')) {
      return [
        localImg(`custom-images/banner/banner01.png`),
        localImg(`custom-images/banner/banner02.png`),
        localImg(`custom-images/banner/banner03.png`),
      ]
    }
    if (banners.value && banners.value.length > 0) {
      return banners.value
    }
    const allBannerFetch = [];
    ['10002', '10003', '10004', '10005', '10006'].forEach((code) => {
      allBannerFetch.push(platformHttp.getPlatformImageByCode(code))
    })
    const res = await Promise.allSettled(allBannerFetch).catch(() => [])
    if (res && res.length > 0) {
      const tempBans: string[] = []
      res.forEach((result) => {
        if (result.status === 'fulfilled' && result?.value) {
          tempBans.push(result.value)
        }
      })
      banners.value = tempBans
    }
    return banners.value
  }

  function setFavicon() {
    const icon = useFavicon()
    icon.value = favicon.value
  }
  async function getDiffConfig() {
    try {
      if (Object.keys(platDiffConfig.value).length > 0) {
        return platDiffConfig.value
      }
      const res = await platformHttp.diffConfig()
      const { data = [] } = res || {}
      const result: IObject = {}
      data?.forEach((item) => {
        const { confKey, conf } = item
        result[confKey] = conf
      })
      platDiffConfig.value = result
      return platDiffConfig.value
    }
    catch (error) {
      console.error('get diff config error:', error)
    }
  }

  const setShowTopBar = (value: boolean) => {
    showTopBar.value = value
  }

  return {
    sidebarOpen,
    language,
    locale,
    activeMenu,
    showTopBar,
    changeLanguage,
    toggleSidebar,
    getAppLogoByCode,
    getAppBanners,
    getPlatformConfig,
    getDiffConfig,
    setShowTopBar,
  }
}, {
  persist: true,
})

export default useAppStore

// 非setup
export function useAppStoreHook() {
  return useAppStore(store)
}
