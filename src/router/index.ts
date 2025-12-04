import { type RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router/auto'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import type { EnhancedRouteLocation } from './types'
import { kkAuth } from '@/01-kk-system/allUtils/kkAuth'
import { useUserStoreHook } from '@/store/modules/user'
import { useRouteCacheStoreHook } from '@/store/modules/routeCache'

NProgress.configure({ showSpinner: true, parent: '#app' })

const Layout = () => import('@/layout/index.vue')

const routeCacheStore = useRouteCacheStoreHook()

const userStore = useUserStoreHook()

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'root',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/pages/home/index.vue'),
        name: 'Home',
        meta: {
          title: 'system.i18nSystem.label.dashboard',
          keepAlive: true,
          showTabbar: true,
          alwaysShow: false,
        },
      },
      {
        path: '/activity',
        component: () => import('@/pages/activity/index.vue'),
        name: 'Activity',
        meta: {
          title: 'web.i18nFront.label.mine',
          keepAlive: true,
          showTabbar: true,
          alwaysShow: false,
        },
      },
      {
        path: '/sports',
        component: () => import('@/pages/sports/index.vue'),
        name: 'Sports',
        meta: {
          title: 'web.i18nFront.label.sports',
          keepAlive: true,
          showTabbar: true,
          alwaysShow: false,
        },
      },
      {
        path: '/recharge',
        component: () => import('@/pages/recharge/index.vue'),
        name: 'Recharge',
        meta: {
          title: 'web.i18nFront.label.mine',
          keepAlive: true,
          showTabbar: true,
          alwaysShow: false,
        },
      },
      {
        path: '/chat',
        component: () => import('@/pages/chat/index.vue'),
        name: 'Chat',
        meta: {
          title: 'web.i18nFront.label.mine',
          keepAlive: true,
          showTabbar: true,
          alwaysShow: false,
        },
      },
      {
        path: '/mine',
        component: () => import('@/pages/mine/index.vue'),
        name: 'Mine',
        meta: {
          title: 'web.i18nFront.label.mine',
          keepAlive: true,
          // needLogin: true,
          showTabbar: true,
          alwaysShow: false,
        },
      },
      {
        path: '/subgame-lobby',
        name: 'SubgameLobbyPage',
        component: () => import('@/pages/subgameLobby/index.vue'),
        meta: {
          title: 'lobby',
          showTabbar: true,
          alwaysShow: false,
          hideFooter: true,
        },
      },
    ],
  },
  {
    path: '/setting',
    name: 'Setting',
    component: () => import('@/pages/setting/index.vue'),
    meta: { hidden: true },
  },
  {
    path: '/transfor',
    name: 'Transfor',
    component: () => import('@/pages/transfor/index.vue'),
    meta: { hidden: true },
  },
  {
    path: '/userinfo',
    name: 'Userinfo',
    component: () => import('@/pages/userInfo/index.vue'),
    meta: { hidden: true },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/pages/about/index.vue'),
    meta: { hidden: true },
  },
  {
    path: '/my-rewards',
    name: 'MyRewards',
    component: () => import('@/pages/myRewards/index.vue'),
    meta: { hidden: true },
  },
  {
    path: '/my-rewards-all',
    name: 'MyRewordsAll',
    component: () => import('@/pages/myRewordsAll/index.vue'),
    meta: { hidden: true },
  },
  {
    path: '/my-bill',
    name: 'MyBill',
    component: () => import('@/pages/myBill/index.vue'),
    meta: { hidden: true },
  },
  {
    path: '/notice',
    name: 'Announcement',
    component: () => import('@/pages/announcement/index.vue'),
    meta: { hidden: true, keepAlive: true },
  },
  {
    path: '/notice/:ownership/:pressID',
    name: 'AnnouncementDetail',
    component: () => import('@/pages/announcementDetail/index.vue'),
  },
  {
    path: '/help-center',
    name: 'helpCenter',
    component: () => import('@/pages/helpCenter/index.vue'),
    meta: { hidden: true, keepAlive: true },
  },
  {
    path: '/favorite',
    name: 'FavoriteGame',
    component: () => import('@/pages/favoriteGame/index.vue'),
  },
  {
    path: '/my-report-menu',
    name: 'MyReportMenu',
    component: () => import('@/pages/myReportMenu/index.vue'),
  },
  {
    path: '/my-report-all',
    name: 'MyReportAll',
    component: () => import('@/pages/myReportAll/index.vue'),
  },
  {
    path: '/my-report-chase',
    name: 'MyReportChase',
    component: () => import('@/pages/myReportChase/index.vue'),
  },
  {
    path: '/my-report-game',
    name: 'MyReportGame',
    component: () => import('@/pages/myReportGame/index.vue'),
  },
  {
    path: '/my-report-lottery',
    name: 'MyReportLottery',
    component: () => import('@/pages/myReportLottery/index.vue'),
  },
  {
    path: '/my-report-other',
    name: 'myReportOther',
    component: () => import('@/pages/myReportOther/index.vue'),
  },
  {
    path: '/open-account',
    name: 'OpenAccount',
    component: () => import('@/pages/openAccount/index.vue'),
  },
  {
    path: '/team-report-menu',
    name: 'TeamReportMenu',
    component: () => import('@/pages/teamReportMenu/index.vue'),
  },
  {
    path: '/team-manage',
    name: 'TeamManage',
    component: () => import('@/pages/teamManage/index.vue'),
  },
  {
    path: '/team-statistics',
    name: 'TeamStatistics',
    component: () => import('@/pages/teamStatistics/index.vue'),
  },
  {
    path: '/team-profit-report',
    name: 'TeamProfitReport',
    component: () => import('@/pages/teamProfitReport/index.vue'),
  },
  {
    path: '/team-money-change',
    name: 'TeamMoneyChange',
    component: () => import('@/pages/teamMoneyChange/index.vue'),
  },
  {
    path: '/team-report-lottery',
    name: 'TeamReportLottery',
    component: () => import('@/pages/teamReportLottery/index.vue'),
  },
  {
    path: '/team-report-chase',
    name: 'teamReportChase',
    component: () => import('@/pages/teamReportChase/index.vue'),
  },
  {
    path: '/team-report-other',
    name: 'TeamReportOther',
    component: () => import('@/pages/teamReportOther/index.vue'),
  },
  {
    path: '/team-manage-sign/:userId',
    name: 'TeamManageSign',
    component: () => import('@/pages/teamManageSign/index.vue'),
  },
  {
    path: '/game-lobby',
    name: 'GameLobbyPage',
    component: () => import('@/pages/gameLobby/index.vue'),
  },
  {
    path: '/swap',
    name: 'Swap',
    component: () => import('@/pages/swap/index.vue'),
  },

  {
    path: '/404',
    component: () => import('@/pages/error-page/404.vue'),
    meta: { hidden: true },
  },
  { path: '/:catchAll(.*)', redirect: '/404', meta: { hidden: true } },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_APP_PUBLIC_PATH),
  routes,
})

router.beforeEach((to: EnhancedRouteLocation, _, next) => {
  NProgress.start()
  // for cache routes
  routeCacheStore.addRoute(to)
  // token auth
  const token = kkAuth.getToken()
  const userInfo = kkAuth.getUserInfo()
  if (to.meta.needLogin && !token && !userInfo.userID) {
    next('/')
    userStore.setLoginModalState(true)
  }
  else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
