<script setup lang="ts">
import { PlatformImageCode } from '@/01-kk-system/allHttp/models/common'
import { localImg } from '@/01-kk-system/allUtils/utils'
import useAppStore from '@/store/modules/app'
import { useChatStore } from '@/store/modules/chat'

defineOptions({
  name: 'KKFooter',
})

const chatStore = useChatStore()
const appStore = useAppStore()
const router = useRouter()

const logo = ref('')

const { t } = useI18n()

const footerMenus = computed(() => {
  return [
    {
      title: t('web.i18nFront.title.egame'),
      id: 7,
      route: '/games',
      routeName: 'EGame',
      type: 'egame',
      isHot: false,
      children: null,
    },
    {
      title: t('web.i18nFront.title.fish'),
      id: 6,
      route: '/games',
      routeName: 'Fish',
      type: 'fish',
      isHot: false,
      children: null,
    },
    {
      title: t('web.i18nFront.title.lottery'),
      id: 2,
      route: '/games',
      routeName: 'GamesLobby',
      type: 'lottery',
      isHot: true,
    },
    {
      title: t('web.i18nFront.title.sports'),
      id: 3,
      route: '/sports',
      routeName: 'Sports',
      isHot: false,
      type: 'sport',
      children: null,
    },
    {
      title: t('web.i18nFront.title.realbet'),
      id: 4,
      route: '/games',
      routeName: 'Realbet',
      type: 'realbet',
      isHot: false,
      children: null,
    },
    {
      title: t('web.i18nFront.title.chess'),
      id: 5,
      route: '/games',
      routeName: 'chess',
      type: 'chess',
      isHot: false,
      children: null,
    },
  ]
})

function openService() {
  chatStore.openChat()
}

function goTo(path: string) {
  router.push({ path })
}

function goToGamePage(item: any) {
  console.log('onClickMenu', item)
  if (item.routeName === 'Home') {
    router.push('/home')
  }
  else if (item.routeName === 'Sports') {
    router.push('/sports')
  }
  else if (item.type === 'hot') {
    router.push({ path: '/subgame-lobby', query: { group: item.routeName } })
  }
  else {
    router.push({ path: '/subgame-lobby', query: { category: item.type } })
  }
}

async function fetchLogo() {
  if (window.location.origin.includes('kk-template')) {
    logo.value = localImg('custom-images/app/logo.png')
    return
  }
  logo.value = await appStore.getAppLogoByCode(PlatformImageCode.PC_LOGO)
}

onBeforeMount(() => {
  fetchLogo()
})
</script>

<template>
  <footer class="mx-auto min-h-200px w-1200px bg-[#1d4268] p-30px text-white">
    <div class="mb-12 flex items-center">
      <div class="h-5 min-w-12">
        <img v-if="logo" :src="logo" alt="logo" class="h-full w-full object-contain">
      </div>
      <div class="kk-divider-line" />
    </div>
    <div class="w-full">
      <div class="mr-35px grow-[0.2] text-12px leading-14px">
        <h5 class="mb-2 text-10px text-white">
          我们
        </h5>
        <ul class="flex flex-wrap gap-2 color-white">
          <li class="footer-menu-item" @click="goTo('/about')">
            <a>{{ $t("web.i18nFront.label.aboutUs") }}</a>
          </li>
          <li class="footer-menu-item" @click="goTo('/about')">
            <a>{{ $t("web.i18nFront.label.gameBiling2") }}</a>
          </li>
        </ul>
      </div>
      <div class="mr-35px mt-5 grow-[0.2] text-12px leading-14px">
        <h5 class="mb-10 mb-2 text-10px color-[#5a647a]">
          类别
        </h5>
        <ul class="flex flex-wrap gap-2 color-white">
          <li v-for="menu in footerMenus" :key="`footer-menu-${menu.id}`" class="footer-menu-item" @click="goToGamePage(menu)">
            <a>{{ menu.title }}</a>
          </li>
        </ul>
      </div>
      <div class="my-4 h-1px bg-[#5c72a380]" />
      <div class="flex gap-3">
        <div class="h-42px w-full flex cursor-pointer items-center justify-between border border-[#ffffff26] rounded-3 border-solid px-4 transition-all">
          <div class="flex items-center gap-2 color-white">
            <svg-icon icon-class="icon-ios" size="20px" />
            <div>
              <p class="text-8px color-[#ffffff80] leading-10px">
                应用
              </p>
              <p class="text-10px color-[#ffffff] leading-12px">
                iOS版本
              </p>
            </div>
          </div>
          <van-icon color="#ffffff" size="12px" name="arrow" />
        </div>
        <div class="h-42px w-full flex cursor-pointer items-center justify-between border border-[#ffffff26] rounded-3 border-solid px-4 transition-all">
          <div class="flex items-center gap-2 color-white">
            <img src="@/assets/images/icons/icon-android2.svg" alt="android" class="h-20px w-20px">
            <div>
              <p class="text-8px color-[#ffffff80] leading-10px">
                应用
              </p>
              <p class="text-10px color-[#ffffff] leading-12px">
                Android版本
              </p>
            </div>
          </div>
          <van-icon color="#ffffff" size="12px" name="arrow" />
        </div>
      </div>
      <div class="kk-footer-contact justify-between">
        <div class="max-w-150px grow-1">
          <div class="text-10px color-white font-600 leading-14px">
            24/7 支持
          </div>
          <div class="text-8px color-[#8692aca6]">
            如果您仍有疑问，请与我们联系
          </div>
        </div>
        <div class="kk-contact-btn" @click="openService">
          聊天
        </div>
      </div>
      <div class="story-container mt-3">
        <div class="color-white">
          <p class="mb-1 w-[50%] text-14px color-[#f0f2f5] font-600 leading-5">
            创始人的博客
          </p>
          <p class="mb-1 w-[55%] text-12px color-[#9aa1b1] leading-4">
            关于公司、业务及更多信息
          </p>
        </div>
      </div>
    </div>
    <div class="my-6 h-1px bg-[#5c72a380]" />
    <div class="flex items-stretch justify-end overflow-hidden">
      <div class="kk-language-box kk-btn-bg">
        <LanguageSwitch2 />
      </div>
      <BackToTop target=".kk-layout-body" />
    </div>
    <div class="my-6 h-1px bg-[#5c72a380]" />

    <div class="text-10px color-[#8391af] leading-14px">
      <div class="logo-container relative w-full flex flex-wrap items-center justify-center pb-5">
        <div class="i-carbon:facebook h-4 w-4" />
        <div class="group h-50px w-93px cursor-pointer transition-all">
          <img class="block h-full group-hover:hidden" src="@/assets/images/home/icon-ag.png" alt="">
          <img class="hidden h-full group-hover:block" src="@/assets/images/home/icon-ag-a.png" alt="">
        </div>
        <div class="group h-50px w-65px cursor-pointer transition-all">
          <img class="block h-full group-hover:hidden" src="@/assets/images/home/icon-yoo.png" alt="">
          <img class="hidden h-full group-hover:block" src="@/assets/images/home/icon-yoo-a.png" alt="">
        </div>
        <div class="group h-50px w-93px cursor-pointer transition-all">
          <img class="block h-full group-hover:hidden" src="@/assets/images/home/icon-im.png" alt="">
          <img class="hidden h-full group-hover:block" src="@/assets/images/home/icon-im-a.png" alt="">
        </div>
        <div class="group h-50px w-100px cursor-pointer transition-all">
          <img class="block h-full group-hover:hidden" src="@/assets/images/home/icon-xm.png" alt="">
          <img class="hidden h-full group-hover:block" src="@/assets/images/home/icon-xm-a.png" alt="">
        </div>
        <div class="group h-50px w-108px cursor-pointer transition-all">
          <img class="block h-full group-hover:hidden" src="@/assets/images/home/icon-win.png" alt="">
          <img class="hidden h-full group-hover:block" src="@/assets/images/home/icon-win-a.png" alt="">
        </div>
        <div class="group h-50px w-74px cursor-pointer transition-all">
          <img class="block h-full group-hover:hidden" src="@/assets/images/home/icon-fb.png" alt="">
          <img class="hidden h-full group-hover:block" src="@/assets/images/home/icon-fb-a.png" alt="">
        </div>
        <div class="group h-50px w-112px cursor-pointer transition-all">
          <img class="block h-full group-hover:hidden" src="@/assets/images/home/icon-bg.png" alt="">
          <img class="hidden h-full group-hover:block" src="@/assets/images/home/icon-bg-a.png" alt="">
        </div>
      </div>
      <ul class="footer-menu flex-center py-4">
        <li class="footer-menu-item" @click="goTo('aboutUs')">
          <a>{{ $t("web.i18nFront.label.aboutUs") }}</a>
        </li>
        <li class="footer-menu-item" @click="goTo('response')">
          <a>{{ $t("web.i18nFront.label.gameBiling2") }}</a>
        </li>
        <li class="footer-menu-item" @click="openService">
          <a>{{ $t("web.i18nFront.label.contact") }}</a>
        </li>
      </ul>
      <p class="text-center">
        版权所有 ©2012-2024 kkgame保留所有权
      </p>
    </div>
  </footer>
</template>

<style lang="less" scoped>
footer {
  width: 100%;
  background-color: #1d4268;
  font-size: 13px;
}
.kk-divider-line {
  flex: 1;
  margin-left: 20px;
  margin-right: 18px;
  height: 1px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.2) 9.92%, rgba(0, 0, 0, 0) 100%);
}
.story-container {
  background: #1c263c;
  background-image: url(@/assets/images/footer/angel.png);
  background-position: bottom right;
  background-repeat: no-repeat;
  background-size: 243px auto;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: space-between;
  min-height: 148px;
  padding: 16px;
  width: 100%;
}
.kk-footer-contact {
  margin-top: 15px;
  display: flex;
  background: linear-gradient(107.15deg, #1e283f 0%, rgba(20, 27, 46, 0.6) 100%);
  padding: 10px;
  border-radius: 12px;
}
.kk-contact-btn {
  flex: none;
  padding: 0 10px;
  height: 25px;
  min-width: 75px;
  color: #ffffff;
  border-radius: 290486px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  background-image: linear-gradient(107.15deg, #0095ff 0%, #0855c4 100%);
  box-shadow: 0 6px 22px #056dda4d;
  font-weight: 600;
  font-size: 11px;
  line-height: 13px;
  letter-spacing: 0.06px;
  text-shadow: 0 3px 5px rgba(9, 15, 30, 0.2);
}
.kk-language-box {
  align-items: center;
  border-radius: 6px;
  display: flex;
  flex-shrink: 0;
  font-size: 12px;
  height: 24px;
  margin-left: 10px;
  min-width: 18px;
  overflow: hidden;
  padding: 0 8px;
  position: relative;
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
}
.kk-btn-bg {
  background-image: linear-gradient(112deg, #1e283f, rgba(20, 27, 46, 0.6) 100%);
}
</style>
