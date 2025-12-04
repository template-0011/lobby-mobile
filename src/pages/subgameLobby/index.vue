<script setup lang="ts">
import { showLoadingToast } from 'vant'
import GameCateMenu from './components/GameCateMenu.vue'
import SearchComponent from './components/SearchComponent.vue'
import { useGameStore } from '@/store/modules/game'
import { outerGameHttp } from '@/01-kk-system/allHttp/userHall/games'
import { useGameCollectionStore } from '@/store/modules/gameCollection'

defineOptions({
  name: 'SubgameLobbyPage',
})

let toast: any = null
const router = useRouter()
const route = useRoute()
const gameStore = useGameStore()
const gameCollectionStore = useGameCollectionStore()
const showFavorite = ref(false)
// const { onClickOuterSubGame } = useIframeOpenFunc()

const gameList = ref<Record<string, any>[]>([])
const searchValue = ref('')
const gameCateMenuRef = ref<InstanceType<typeof GameCateMenu>>()
const providers = ref<Record<string, any>[]>([])
const currentProvider = ref<Record<string, any>>({
  name: '',
  outerGamerID: '',
})
// 列表相关
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(true)
const pageSize = 20
let currentPage = 1

const routeQuery = computed(() => {
  return route.query ?? {}
})

const hotGameList = computed(() => gameStore.allGroups || [])

const gameCollectionList = computed(() => {
  return gameCollectionStore.favoriteGames
})

async function getProvideruList(type: string) {
  switch (type) {
    case 'egame':
      providers.value = gameStore.allSubGameEntrance?.egame || []
      break
    case 'lottery':
      providers.value = gameStore.allSubGameEntrance?.lottery || []
      break
    case 'fish':
      providers.value = gameStore.allSubGameEntrance?.fish || []
      break
    case 'realbet':
      providers.value = gameStore.allSubGameEntrance?.realbet || []
      break
    case 'chess':
      providers.value = gameStore.allSubGameEntrance?.chess || []
      break
    default:
      providers.value = []
      break
  }
}

function onGoBack() {
  router.replace('/')
}

async function getLotteryList() {
  providers.value = await gameStore.getAllSeriesAndGamesList()
  currentProvider.value = providers.value[0] || {}
  gameList.value = currentProvider.value.children || []
  finished.value = true
  loading.value = false
}

function getHotGameList(id?: string) {
  providers.value = []
  if (id) {
    currentProvider.value = hotGameList.value.find(item => `${item.id}` === `${id}`) || {}
  }
  else {
    currentProvider.value = hotGameList.value[0] || {}
  }
  gameList.value = currentProvider.value.data || []
  finished.value = true
  loading.value = false
}

function getOuterGameList(type: string) {
  toast = showLoadingToast({
    duration: 0,
    forbidClick: true,
  })
  getProvideruList(type)
  currentProvider.value = providers.value[0] || {}
  onRefresh()
}

function handleIinitFirstMenu() {
  if (hotGameList.value.length > 0) {
    getHotGameList()
    gameCateMenuRef.value?.handleInitMenu({ group: currentProvider.value.routeName })
  }
  else {
    providers.value = gameStore.allSubGameEntrance?.egame || []
    currentProvider.value = providers.value[0] || {}
    onRefresh()
    gameCateMenuRef.value?.handleInitMenu({ type: 'egame' })
  }
}

async function initData() {
  gameCollectionStore.getLocalCollections()
  await Promise.allSettled([
    gameStore.getAvailableOuterSubGamesEntry(),
    gameStore.getAllSeriesAndGamesList(),
  ])
  setTimeout(() => {
    // 默认选取第一个菜单内容展示
    if (Object.keys(routeQuery.value ?? {}).length === 0) {
      handleIinitFirstMenu()
    }
    else if (routeQuery.value.group) {
      gameCateMenuRef.value?.handleInitMenu({ group: routeQuery.value.group })
      getHotGameList(routeQuery.value.group as string)
    }
    else if (routeQuery.value.category === 'lottery') {
      getLotteryList()
      gameCateMenuRef.value?.handleInitMenu({ type: 'lottery' })
    }
    else {
      getOuterGameList(routeQuery.value.category as string)
      gameCateMenuRef.value?.handleInitMenu({ type: routeQuery.value.category })
    }
  }, 300)
}

onBeforeMount(() => {
  initData()
})

async function onRefresh() {
  if (loading.value) {
    return false
  }
  currentPage = 1
  finished.value = false
  refreshing.value = true
  await onLoad()
}

function onSearch(text: string) {
  console.log('onSearch', text)
  searchValue.value = text
  currentPage = 1
  onLoad()
}

function onClickProvider(game: any) {
  console.log('onClickProvider', game)
  currentProvider.value = game
  if (game.contentCategory) {
    toast = showLoadingToast({
      duration: 0,
      forbidClick: true,
    })
    onRefresh()
  }
  else if (game.lottoClassify) {
    currentProvider.value = game || {}
    gameList.value = currentProvider.value.children || []
    finished.value = true
    loading.value = false
  }
}

async function onLoad() {
  try {
    loading.value = true
    const { outerGamerAgentCode, outerGamerID, contentCategory } = currentProvider.value || {}
    const params = {
      outerGamerAgentCode,
      outerGamerID,
      contentCategory,
      current: currentPage,
      size: pageSize,
    }
    const finalParams = searchValue.value ? { ...params, subgameDes: searchValue.value } : params
    const { code, data } = await outerGameHttp.fetchSubGamePage(finalParams)
    if (code === '0') {
      const { recordList, pages, current } = data || {}
      if (current < +pages) {
        finished.value = false
      }
      else {
        finished.value = true
      }
      if (+current === 1) {
        gameList.value = recordList
      }
      else {
        gameList.value = [...gameList.value, ...recordList]
      }
    }
    else {
      finished.value = true
    }
  }
  catch (error) {
    console.error(error)
  }
  finally {
    refreshing.value = false
    loading.value = false
    if (toast) {
      toast?.close()
      toast = null
    }
  }
}

function loadMore() {
  if (finished.value || loading.value)
    return
  console.log('loadMore')
  currentPage++
  onLoad()
}

function onClickMenu(item: any) {
  console.log('onClickMenu', item)
  if (item.type === 'lottery') {
    getLotteryList()
  }
  else if (item.type === 'hot') {
    getHotGameList(item.id)
  }
  else {
    getOuterGameList(item.type)
  }
}

function onClickFavorite() {
  console.log('onClickFavorite')
  showFavorite.value = true
}

function onCloseFavorite() {
  showFavorite.value = false
}
</script>

<template>
  <div class="h-screen">
    <GameCateMenu ref="gameCateMenuRef" @click-menu="onClickMenu" @click-favorite="onClickFavorite" />
    <div class="flex items-center gap-6px px-3 py-2 color-white" @click="onGoBack">
      <van-icon class="font-bold" name="arrow-left" size="14" />
      <span class="text-13px">
        {{ $t('web.i18nFront.label.back') }}
      </span>
    </div>
    <SearchComponent
      :providers="providers"
      :menu-list="providers"
      :selected-game="currentProvider"
      @on-search="onSearch"
      @on-favorite="onClickFavorite"
      @on-select="onClickProvider"
    />
    <div id="list-body-id" class="list-body">
      <template v-if="gameList.length <= 0 && !loading">
        <van-empty class="mx-auto" image-size="100" />
      </template>
      <template v-else>
        <div class="grid grid-cols-2 flex-wrap gap-3">
          <GameCard
            v-for="(item, i) in gameList"
            :key="`${i}-subgame`"
            :item="item"
            :type="item.contentCategory ? 'outer' : 'lottery'"
          />
        </div>
      </template>
      <ScrollLoadMore v-if="gameList.length > 0" :finished="finished" @load-more="loadMore" />
    </div>

    <van-popup
      v-model:show="showFavorite"
      position="bottom"
      :style="{ height: '100%' }"
      safe-area-inset-top
      safe-area-inset-bottom
    >
      <div class="mt-3 h-10 flex items-center gap-6px px-3 py-2 color-white" @click="onCloseFavorite">
        <van-icon class="font-bold" name="arrow-left" size="14" />
        <span class="text-13px">
          {{ $t('web.i18nFront.label.back') }}
        </span>
      </div>
      <div class="h-[calc(100%-52px)] overflow-y-auto">
        <div v-if="gameCollectionList.length > 0" class="grid grid-cols-2 mx-4 mt-5 gap-4 pb-10">
          <GameCard v-for="item in gameCollectionList" :key="item.id" :item="item" />
        </div>
        <div v-else>
          <van-empty image-size="100" :description="$t('web.i18nFront.hint.noData')" />
        </div>
      </div>
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
.list-body {
  padding: 0 3.589744vw 0;
}
:deep(.van-tabs__content) {
  height: calc(100vh - 90px);
}
:deep(.van-popup) {
  background: #090f1e;
}
</style>
