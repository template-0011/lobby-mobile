<script setup lang="ts">
import useAutoThemeSwitcher from './hooks/useAutoThemeSwitcher'
import useAppStore from './store/modules/app'
import { useChatStore } from './store/modules/chat'
import { useDesignSettingStore } from './store/modules/designSetting'
import useRouteCacheStore from './store/modules/routeCache'
import useUserStore from './store/modules/user'
import Tabbar from './layout/components/Tabbar/index.vue'
import SvgDefs from './components/SvgDefs/index.vue'
import { PlatformImageCode } from './01-kk-system/allHttp/models/common'
import { useGameStore } from './store/modules/game'
import { transOut2System } from '@/04-kk-component-mobile/hooks/commonUtil'
import { localImg } from '@/01-kk-system/allUtils/utils'
import PwaModal from '@/04-kk-component-mobile/PwaModal/index.vue'
import TopBar from '@/components/TopBar/index.vue'

const userStore = useUserStore()
const chatStore = useChatStore()
const appStore = useAppStore()
const gameStore = useGameStore()
const designStore = useDesignSettingStore()

const getDarkMode = computed(() => designStore.darkMode)
const isDark = useDark()
const toggleDark = useToggle(isDark)
const showSidebar = ref(false)

useHead({
  title: 'lottery mobile web',
  meta: [
    {
      name: 'description',
      content: 'template-0003',
    },
    {
      name: 'theme-color',
      content: () => '#ffffff',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: () => '/favicon.ico',
    },
  ],
})

const show = computed(() => userStore.showLogin)
const keepAliveRouteNames = computed(() => {
  return useRouteCacheStore().routeCaches as string[]
})

const { initializeThemeSwitcher } = useAutoThemeSwitcher(designStore)

async function init() {
  getIosPwaThumb()
  appStore.getPlatformConfig()
  await Promise.allSettled([
    chatStore.loadChat(true), // 客服
    appStore.getDiffConfig(), // 差异化
    gameStore.fetchAllGroups(), // 游戏分组
    gameStore.getOuterGamerList(), // 外游游戏列表
  ])
  if (userStore.userInfo?.userID) {
    // 登陆状态，需要先获取余额
    userStore.getUserBanlance()
    chatStore.setContactInfo({
      name: userStore.userInfo?.nickName,
      description: userStore.userInfo?.userName,
      userID: userStore.userInfo?.userID,
    })
    transOut2System()
  }
  // gameStore.getAvailableOuterSubGamesEntry()
  // favicon
  if (window.location.origin.includes('kk-template')) {
    const icon = useFavicon()
    icon.value = localImg('custom-images/app/favicon.ico')
  }
  else {
    appStore.getAppLogoByCode(PlatformImageCode.H5_FAVICON)
  }
}

// for tabbar
const currRoute = useRoute()
const showTabbar = computed(() => currRoute.meta.showTabbar)

async function getIosPwaThumb() {
  appStore.getAppLogoByCode(PlatformImageCode.PWA_LOGO).then((pwaLogo) => {
    // 选取所有的apple-touch-icon链接
    const links = document.querySelectorAll('link[rel=\'apple-touch-icon\']')
    // 遍历链接并修改它们的href属性
    for (let i = 0; i < links.length; i++) {
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-expect-error
      links[i].href = `/_always_win_/lobby/platform/images/content/${pwaLogo.name}`
    }
  })
}

onBeforeMount(() => {
  init()
})
onMounted(() => {
  toggleDark(false)
  initializeThemeSwitcher()
})
</script>

<template>
  <VanConfigProvider safe-area-inset-top :theme="getDarkMode" class="h-full">
    <SvgDefs />
    <van-nav-bar style="--van-nav-bar-height:0;overflow:hidden;" safe-area-inset-top />
    <div class="box-border h-full max-w-600px w-full w-screen flex flex-col justify-start overflow-hidden">
      <TopBar />
      <router-view v-slot="{ Component, route }" class="flex-1">
        <keep-alive :include="keepAliveRouteNames">
          <component :is="Component" :key="route.name" />
        </keep-alive>
      </router-view>
      <transition name="zoom-fade" mode="out-in" appear>
        <div v-if="showTabbar" class="h-60px">
          <Tabbar @on-menu="showSidebar = true" />
        </div>
      </transition>
    </div>
    <Login v-model="show" />
    <PwaModal />
    <IframePage />
    <SidebarMenu v-model:show="showSidebar" />
  </VanConfigProvider>
</template>
