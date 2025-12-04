<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { showToast } from 'vant'
import Header from './components/Header/index.vue'
import CellRow from './components/CellRow/index.vue'
import useUserStore from '@/store/modules/user'
import { localImg } from '@/01-kk-system/allUtils/utils'
import useIframeOpenFunc from '@/04-kk-component-mobile/hooks/useIframeOpenFunc'

defineOptions({
  name: 'Mine',
})

const userStore = useUserStore()
const router = useRouter()
const { t } = useI18n()
const { goToPayment } = useIframeOpenFunc()

const list = [
  {
    title: t('web.i18nFront.label.myPofile'),
    subTitle: t('web.i18nFront.label.aboutUsSub', '影响余额变化的所有操作'),
    image: localImg('images/zl.png'),
    path: '/userInfo',
  },
  {
    title: t('web.i18nFront.label.myRewards'),
    subTitle: t('web.i18nFront.label.aboutUsSub', '影响余额变化的所有操作'),
    image: localImg('images/fy.png'),
    path: '/my-rewards',
  },
  {
    title: t('web.i18nFront.label.reChargeWdR'),
    subTitle: t('web.i18nFront.label.aboutUsSub', '影响余额变化的所有操作'),
    image: localImg('images/cqjl.png'),
    path: '',
  },
  {
    title: t('web.i18nFront.label.myReport'),
    subTitle: t('web.i18nFront.label.aboutUsSub', '影响余额变化的所有操作'),
    image: localImg('images/grbb.png'),
    path: '/my-report-menu',
  },
  {
    title: t('web.i18nFront.label.accountDetail'),
    subTitle: t('web.i18nFront.label.aboutUsSub', '影响余额变化的所有操作'),
    image: localImg('images/mx.png'),
    path: '/my-bill',
  },
  {
    title: t('web.i18nFront.label.agentShare'),
    subTitle: t('web.i18nFront.label.aboutUsSub', '影响余额变化的所有操作'),
    image: localImg('images/tg.png'),
    path: '/open-account',
  },
  {
    title: t('web.i18nFront.label.agentReport'),
    subTitle: t('web.i18nFront.label.aboutUsSub', '影响余额变化的所有操作'),
    image: localImg('images/dlbb.png'),
    path: '/team-report-menu',
  },
  {
    title: t('web.i18nFront.label.platNoti'),
    subTitle: t('web.i18nFront.label.aboutUsSub', '影响余额变化的所有操作'),
    image: localImg('images/xx.png'),
    path: '/notice',
  },
  {
    title: t('web.i18nFront.label.collection'),
    subTitle: t('web.i18nFront.label.collectionSub', '影响余额变化的所有操作'),
    image: localImg('images/games/icon-collected.png'),
    path: '/favorite',
  },
  {
    title: t('web.i18nFront.label.helpCenter'),
    subTitle: t('web.i18nFront.label.helpCenterSub', '影响余额变化的所有操作'),
    image: localImg('images/wm.png'),
    path: '/help-center',
  },
  {
    title: t('web.i18nFront.label.aboutUs'),
    subTitle: t('web.i18nFront.label.aboutUsSub', '影响余额变化的所有操作'),
    image: localImg('images/wm.png'),
    path: '/about',
  },
]

function onClickItem(item: Record<string, any>) {
  const { path } = item || {}
  if (!path) {
    showToast(t('web.i18nFront.hint.noData'))
    return
  }
  if (path) {
    router.push({ path })
  }
}

function hasFundPwd() {
  userStore.checkFundPwdExist()
}

async function openPayCenter(type: 'withdraw' | 'deposit') {
  goToPayment(type)
}

onBeforeMount(() => {
  hasFundPwd()
})
</script>

<template>
  <div class="flex flex-col">
    <Header @open-wallet="openPayCenter" />
    <div class="mx-4 mt-4">
      <div class="mb-3 flex flex-col gap-3">
        <CellRow
          v-for="(item, i) in list"
          :key="i"
          :title="item.title"
          :icon="item.image"
          :sub-title="item.subTitle"
          :show-bottom-line="i !== (list.length - 1)"
          @click="onClickItem(item)"
        />
      </div>
    </div>
  </div>
</template>
