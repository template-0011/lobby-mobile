<script setup lang="ts">
import { showLoadingToast } from 'vant'
import GameCard from './GameCard.vue'
import { useGameStore } from '@/store/modules/game'
import useIframeOpenFunc from '@/04-kk-component-mobile/hooks/useIframeOpenFunc'
import { LOCAL_FAVORITE_GAMES } from '@/01-kk-system/allDefine/common/const'
import type { IObject } from '@/01-kk-system/allHttp/types/common'

defineOptions({
  name: 'LotteryMenuContent',
})

const currentList = ref([])
const activeGame = ref('')
const gameList = ref<Record<string, any>[]>([])
const { t } = useI18n()

const gameStore = useGameStore()
const { onClickClassiGame } = useIframeOpenFunc()
const { favoriteGames, getLocalCollections, setLocalCollections } = useLocalCollection()

const userCollected = {
  name: t('web.i18nFront.label.collect'),
  id: 0,
  children: favoriteGames.value,
}

function onClickMenu(menu: any) {
  if (menu.id === 0) {
    // 收藏
    currentList.value = favoriteGames.value
  }
  else {
    currentList.value = menu.children
  }
  activeGame.value = menu.name
}

function onClickGame(game: any) {
  onClickClassiGame(game)
}

function useLocalCollection() {
  const favoriteGames = ref<IObject[]>([])

  const getLocalCollections = () => {
    const locals = localStorage.getItem(LOCAL_FAVORITE_GAMES)
    if (locals) {
      favoriteGames.value = JSON.parse(locals)
    }
  }

  const setLocalCollections = (game: any) => {
    if (favoriteGames.value.length <= 0) {
      getLocalCollections()
    }
    const isIn = favoriteGames.value.some(item => item.lottoID === game.lottoID)
    let newList: IObject[] = []
    if (isIn) {
      newList = favoriteGames.value.filter(item => item.lottoID !== game.lottoID)
    }
    else {
      newList = [game, ...favoriteGames.value]
    }
    favoriteGames.value = newList
    localStorage.setItem(LOCAL_FAVORITE_GAMES, JSON.stringify(newList))
  }

  return {
    getLocalCollections,
    setLocalCollections,
    favoriteGames,
  }
}

function onCollect(game: IObject) {
  setLocalCollections(game)
  if (userCollected.name === activeGame.value) {
    currentList.value = favoriteGames.value
  }
  gameList.value = [...gameList.value]
}

async function init() {
  const toast = showLoadingToast({
    duration: 0,
    forbidClick: true,
  })
  const games = await gameStore.getAllSeriesAndGamesList()
  if (games && games.length > 0) {
    getLocalCollections()
    gameList.value = [userCollected, ...games]
    const first = gameList.value[1] || {}
    activeGame.value = first.name
    currentList.value = first.children || []
  }
  toast.close()
}

onBeforeMount(() => {
  init()
})
</script>

<template>
  <van-row class="menu-body">
    <van-col span="6" class="left-menu">
      <div
        v-for="(item, i) in gameList"
        :key="`${i}left`"
        class="game-name"
        :class="{ active: item.name === activeGame }" @click="onClickMenu(item)"
      >
        <span>{{ item.name }}</span>
      </div>
    </van-col>
    <van-col span="18" class="right-content">
      <div class="game-list">
        <template v-if="currentList.length === 0">
          <div class="h-full w-full flex-center">
            <van-empty image-size="100" :description="$t('web.i18nFront.hint.noData')" />
          </div>
        </template>
        <template v-else>
          <div class="grid grid-cols-2 gap-x-2 gap-y-1">
            <GameCard
              v-for="(game) in currentList"
              :key="`${game.lottoID}game`"
              :game-data="game"
              :collected-list="favoriteGames"
              @click="onClickGame(game)"
              @on-collect="onCollect"
            />
          </div>
        </template>
      </div>
    </van-col>
  </van-row>
</template>

<style lang="less" scoped>
.menu-body {
  width: 100vw;
  height: 100%;
  box-sizing: border-box;
  .left-menu {
    height: 100%;
    overflow: auto;
    padding: 2px 4px;
  }
  .right-content {
    height: 100%;
    overflow: auto;
  }
  .game-name {
    box-sizing: border-box;
    color: #777;
    height: 44px;
    line-height: 44px;
    text-align: center;
    font-size: 12px;
    transition: all 0.2s;
    border-left: 2px solid transparent;
    border-radius: 10px;
    background: var(--card-bg-color);
    margin: 4px 0;
  }
  .active {
    background-color: var(--primary-color);
    color: #ffffff;
  }
  .game-list {
    box-sizing: border-box;
    padding: 14px 10px;
    // display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>
