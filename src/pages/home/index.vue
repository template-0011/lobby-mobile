<script setup lang="ts">
import GameContent from './components/GameContent/index.vue'
import useUserStore from '@/store/modules/user'
import { useGameStore } from '@/store/modules/game'
import { translateTextBy } from '@/utils/i18n'
import { localImg } from '@/01-kk-system/allUtils/utils'
import type { IObject } from '@/01-kk-system/allHttp/types/common'
// import useIframeOpenFunc from '@/04-kk-component-mobile/hooks/useIframeOpenFunc'
import useAppStore from '@/store/modules/app'

defineOptions({
  name: 'Home',
})

const banners = ref<Record<string, any>[]>([])

// const chatStore = useChatStore()
const userStore = useUserStore()
const gameStore = useGameStore()
const appStore = useAppStore()
// const { onClickOuterGame } = useIframeOpenFunc()

const lotteryList = ref<Record<string, any>[]>([])
const activeMenu = ref<IObject>({
  name: 'slot',
})
const currentList = ref([])
const menusList = ref<Record<string, any>[]>([])
const lotteryCategoryList = ref<Record<string, any>[]>([])

const sportsList = computed(() => {
  const list = gameStore.sportGameList || []
  const data = list.map(game => ({
    ...game,
    icon: localImg(`custom-images/outergameicon/${game.outerGamerID}.png`),
    title: game.outerGamerName,
    subTitle: 'Sports',
    image: localImg(`images/dropmenu/sports-${game.outerGamerID}.png`),
  }))
  return data
})
const realBetList = computed(() => {
  const list = gameStore.liveGameList || []
  const data = list.map(game => ({
    ...game,
    icon: localImg(`custom-images/outergameicon/${game.outerGamerID}.png`),
    title: game.outerGamerName,
    subTitle: 'Live',
    image: localImg(`images/dropmenu/live-${game.outerGamerID}.png`),
  }))
  return data
})
const chessList = computed(() => {
  const list = gameStore.chessGameList || []
  const data = list.map(game => ({
    ...game,
    icon: localImg(`custom-images/outergameicon/${game.outerGamerID}.png`),
    title: game.outerGamerName,
    subTitle: 'Live',
    image: localImg(`images/dropmenu/chess-${game.outerGamerID}.png`),
  }))
  return data
})
const fishList = computed(() => {
  const list = gameStore.fishGameList || []
  const data = list.map(game => ({
    ...game,
    icon: localImg(`custom-images/outergameicon/${game.outerGamerID}.png`),
    title: game.outerGamerName,
    subTitle: 'fish',
    image: localImg(`images/dropmenu/fish-${game.outerGamerID}.png`),
  }))
  return data
})
const egameList = computed(() => {
  const list = gameStore.eGameList || []
  const data = list.map(game => ({
    ...game,
    icon: localImg(`custom-images/outergameicon/${game.outerGamerID}.png`),
    title: game.outerGamerName,
    subTitle: 'Live',
    image: localImg(`images/dropmenu/slot-${game.outerGamerID}.png`),
  }))
  return data
})

const tabMenus = computed(() => {
  const groupList = gameStore.allGroups || []
  return [
    ...groupList,
    {
      title: translateTextBy('web.i18nFront.title.egame'),
      i18nTitle: 'egame',
      name: 'slot',
      subTitle: 'slots',
      cardBg: localImg('images/home/icon-text-slot.png'),
      cardImg: localImg('images/home/img_slot.png'),
      image: localImg('images/home/icon_egame.png'),
      type: 'outerGame',
      icon: 'icon_game_egame',
      nameKey: 'outerGamerName',
      data: egameList.value,
      contentCategory: 1003,
      // click: (game: IObject) => {
      //   gameStore.currentEntrance = game
      //   router.push({ path: '/subgame-lobby', query: { outerGamerID: game.outerGamerID } })
      // },
    },
    {
      title: translateTextBy('web.i18nFront.title.fish'),
      i18nTitle: 'fish',
      subTitle: 'fish',
      name: 'fish',
      cardBg: localImg('images/home/icon-text-fish.png'),
      cardImg: localImg('images/home/img_fish.png'),
      image: localImg('images/home/icon_fish.png'),
      type: 'outerGame',
      icon: 'icon_game_fish',
      nameKey: 'outerGamerName',
      data: fishList.value,
      gamerIndex: 1,
      contentCategory: 1004,
      // click: (game: IObject) => {
      //   gameStore.currentEntrance = game
      //   router.push({ path: '/subgame-lobby', query: { outerGamerID: game.outerGamerID } })
      // },
    },
    {
      title: translateTextBy('web.i18nFront.title.lottery'),
      i18nTitle: 'lottery',
      name: 'lottery',
      subTitle: 'Lottery',
      cardBg: localImg('images/home/icon-text-lottery.png'),
      cardImg: localImg('images/home/img_lottery.png'),
      image: localImg('images/home/icon-lottery.png'),
      showMore: true,
      icon: 'icon_game_lottery',
      type: 'lottery',
      contentCategory: 1001,
      data: lotteryCategoryList.value,
      // click: (game?: IObject) => {
      //   gameStore.currentEntrance = game
      //   router.push({ path: '/game-lobby' })
      // },
    },
    {
      title: translateTextBy('web.i18nFront.title.sports'),
      i18nTitle: 'sports',
      subTitle: 'sports',
      name: 'sports',
      cardBg: localImg('images/home/icon-text-sport.png'),
      cardImg: localImg('images/home/img_sport.png'),
      image: localImg('images/home/icon_sport.png'),
      type: 'outerGame',
      nameKey: 'outerGamerName',
      icon: 'icon_game_sports',
      data: sportsList.value,
      contentCategory: 1006,
    },
    {
      title: translateTextBy('web.i18nFront.title.realbet'),
      i18nTitle: 'realbet',
      subTitle: 'realbet',
      name: 'realbet',
      cardBg: localImg('images/home/icon-text-live.png'),
      cardImg: localImg('images/home/img_live.png'),
      image: localImg('images/home/icon_live.png'),
      type: 'outerGame',
      nameKey: 'outerGamerName',
      icon: 'icon_game_real',
      data: realBetList.value,
      contentCategory: 1005,
    },
    {
      title: translateTextBy('web.i18nFront.title.chess'),
      i18nTitle: 'chess',
      subTitle: 'BOARD',
      name: 'chess',
      cardBg: localImg('images/home/icon-text-chess.png'),
      cardImg: localImg('images/home/img_chess.png'),
      image: localImg('images/home/icon_chess.png'),
      type: 'outerGame',
      icon: 'icon_game_chess',
      nameKey: 'outerGamerName',
      data: chessList.value,
      contentCategory: 1002,
    },
  ]
})

async function getFullGames() {
  const list = (await gameStore.getFullSeries()) as unknown as Record<
    string,
    any
  >[]
  lotteryList.value = list.map((game) => {
    const { lottoClassify, country } = game
    const cty = country?.toLowerCase()
    if (lottoClassify && cty) {
      game.icon = localImg(`custom-images/lottery-icon/${cty}-${lottoClassify}.png`)
    }
    return game
  })
}

function onClickMenu(item: any) {
  activeMenu.value = item
  currentList.value = item.data
}

async function initLotteryCategory() {
  const lotteryCate = (await gameStore.getFullSeries()) as unknown as Record<
    string,
    any
  >[]
  lotteryCategoryList.value = lotteryCate.map((item) => {
    const country = item.country?.toLowerCase() || ''
    const icon = localImg(`custom-images/lottery-icon/${country}-${item.lottoClassify}.png`)
    return {
      ...item,
      icon: icon.includes('undefined') ? item.logo : icon,
      title: item.name,
      subTitle: '',
    }
  })
  menusList.value = tabMenus.value
}

async function init() {
  initLotteryCategory()
  getFullGames()
  userStore.getUserBanlance()
  await Promise.allSettled([gameStore.getAvailableOuterGames(), gameStore.getAvailableOuterSubGamesEntry()])
  onClickMenu(tabMenus.value[0])
}

function initBanner() {
  appStore.getAppBanners().then((res) => {
    const list = res.map((imge: any, index: number) => {
      return {
        id: index,
        src: imge,
        title: 'test',
        description: 'desc',
      }
    })
    banners.value = list
  })
}

onBeforeMount(() => {
  initBanner()
  init()
})
</script>

<template>
  <div class="flex flex-col overflow-hidden overflow-y-auto pb-6 color-#ffffff">
    <MenuTop :only-game="false" />
    <div>
      <div class="swiper-container py-3">
        <ImageCarousel
          :images="banners"
          height="165px"
          :show-navigation="false"
          :show-pagination="true"
        />
      </div>
      <div class="promotion-container">
        <div class="promotion-item promotion-money p-item-bg-01">
          <div class="text-black">
            <p class="overflow-hidden text-ellipsis whitespace-nowrap text-13px font-500">
              Free Money
            </p>
            <p class="whitespace-nowrap text-10px">
              Get 100% Free
            </p>
          </div>
          <img class="pointer-events-none absolute bottom-0 right-0 h-43px w-117px rounded-r-3" src="@/assets/images/home/free-m-bg.png" alt="">
          <img class="pointer-events-none absolute h-29px w-26px -left-10px -top-2px" src="@/assets/images/home/icon-coin.png" alt="">
        </div>
        <div class="promotion-item p-item-bg-02">
          <div>
            <p class="overflow-hidden text-ellipsis whitespace-nowrap text-13px text-white">
              促销活动
            </p>
            <p class="text-10px">
              和奖金
            </p>
          </div>
          <img class="pointer-events-none absolute h-95px -right-7 -top-5" src="@/assets/images/home/icon-gift.png" alt="">
        </div>
      </div>
      <div v-for="(gameItem, index) in menusList" :key="`${index}game`" class="mt-3 py-2 pl-2">
        <GameContent :full-data="gameItem" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@tabbar-height: 80px;
@banner-height: 200px;
@top-offset: 20px;

.box-content {
  position: absolute;
  top: @banner-height - @top-offset;
  bottom: @tabbar-height;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  overflow: hidden;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}

html.dark .swiper-container {
  background: #1a1a1a;
}

.fixed-class {
  position: fixed;
  top: 44px;
  bottom: 44px;
  left: 0;
  right: 0;
}

:deep(.fixed-class .van-tabs) {
  height: 100%;
}

:deep(.van-tabs__content) {
  overflow-x: hidden;
}

:deep(.fixed-class .van-tabs__content) {
  height: calc(100% - 74px);
  overflow: auto;
}

:deep(.fixed-class .van-tab__panel) {
  height: 100%;
}

.tab-body {
  background: var(--van-gray-1);
}

html.dark .tab-body {
  background: #1a1a1a;
}

.left-menu-card {
  position: relative;
  align-items: center;
  background-size: 100% 100%;
  flex-shrink: 0;
  width: 9.871795vw;
  height: 13.076923vw;
  border-radius: 2.051282vw;
  background-repeat: no-repeat;
  color: #7981a4;
  width: 11.282051vw;
  height: 13.333333vw;
  margin-bottom: 1.538462vw;
  padding: 0.512821vw 1.794872vw 2.051282vw;
  background-image: url(@/assets/images/home/tab-bg.png);
  box-shadow: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.left-menu-card span {
  font-weight: 400;
  font-size: 2.820513vw;
  line-height: 3.076923vw;
  text-align: center;
}

.menu-card-item {
  width: 7.692308vw;
  height: 7.692308vw;
  object-fit: contain;
}

.left-menu-card.menuactive {
  color: #ffffff;
  animation: menuactiveani 0.3s ease;
  background-image: url(@/assets/images/home/active-tab-bg.png);
}

@keyframes menuactiveani {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

.game-list {
  margin: 4px 0 0 0;
}

.game-list-card {
  height: 28.717949vw;
  position: relative;
  background: #f7f9ff;
  margin-bottom: 3.076923vw;
  background-image: url(@/assets/images/home/game-list-card-bg.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  border-radius: 12px;
  width: 78.487179vw;
  box-shadow: 0 1.025641vw 2.051282vw 0 rgba(50, 79, 129, 0.1);
  background-color: initial;
  padding-bottom: 0.512821vw;
  overflow: hidden;
}

.game-card-body {
  position: relative;
  width: 100%;
  height: 100%;
  background-position: 100% 0;
  background-size: 53.846154vw 40.512821vw;
  background-repeat: no-repeat;
  cursor: inherit;
}

.game-card-body .game-info {
  position: absolute;
  top: 3.076923vw;
  width: 38.461538vw;
  left: 5.128205vw;
  font-size: 3.076923vw;
}

.game-card-body .title {
  font-size: 4.102564vw;
  font-weight: 600;
  color: #303442;
  font-family: PingFang SC;
}

.game-card-body .sub-title {
  font-weight: 500;
  font-size: 2.051282vw;
  color: #949ab6;
  font-family: PingFang SC;
  width: 25.641026vw;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 26.153846vw;
  color: #7981a4;
  text-transform: uppercase;
}

.card-text-bg {
  position: absolute;
  bottom: 5.128205vw;
  left: 5.128205vw;
  width: 75.641026vw;
  height: 19.487179vw;
}

.init-animation {
  animation: initanimation 0.3s ease;
}

@keyframes initanimation {
  0% {
    transform: translate3d(0, 10%, 0);
  }

  100% {
    transform: translateZ(0);
  }
}
.promotion-container {
  padding: 0 13px;
  margin-bottom: -22px;
  margin: 8px 0 20px;
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(2, 1fr);
  grid-template-areas: 'free-money bonus';
}
.promotion-item {
  border-radius: 12px;
  display: flex;
  align-items: center;
  min-height: 50px;
  padding: 8px 130px 8px 16px;
  position: relative;
  font-size: 13px;
  background-image: linear-gradient(92deg, #01c2ff, #0009da), linear-gradient(0deg, #fff, #fff);
  grid-area: bonus;
  min-width: 0;
}
.promotion-money {
  grid-area: free-money;
}
.p-item-bg-01 {
  background-image: linear-gradient(283.27deg, #ffb800 0%, #fff173 138.82%);
  box-shadow: 0 5px 15px #ffd91366;
}
.p-item-bg-02 {
  background: linear-gradient(86.37deg, #d062ff 2.96%, #7bb0ff 99.68%), linear-gradient(90deg, #ed6ea0 0%, #ec8c69 100%);
  box-shadow: 0 5px 15px #c955ff80;
}
</style>
