<script setup lang="ts">
import { outerGameHttp } from '@/01-kk-system/allHttp/userHall/games'
import { useGameStore } from '@/store/modules/game'

defineOptions({
  name: 'KKGameContent',
})

const props = defineProps<{
  fullData: Record<string, any>
}>()

const loading = ref(false)
const currentList = ref<Record<string, any>[]>([])
const iconStr = ref('')
const titleStr = ref('')

const gameStore = useGameStore()
const router = useRouter()

async function fetchGameList(game: Record<string, any>) {
  try {
    loading.value = true
    const { outerGamerAgentCode, outerGamerID, contentCategory } = game || {}
    const params = {
      outerGamerAgentCode,
      outerGamerID,
      contentCategory,
      current: 1,
      size: 8,
    }
    const { data } = await outerGameHttp.fetchSubGamePage(params)
    const { recordList } = data || {}
    currentList.value = recordList || []
  }
  catch (error) {
    console.error(error)
  }
  finally {
    loading.value = false
  }
}

function goTo() {
  console.log('props.fullData', props.fullData)
  // router.push({ path: '/game-lobby' })
  if (props.fullData.type === 'hot') {
    router.push({ path: '/subgame-lobby', query: { group: props.fullData.contentCategory } })
  }
  else if (props.fullData.type === 'lottery') {
    router.push({ path: '/game-lobby' })
  }
  else if (props.fullData.type === 'outerGame') {
    router.push({ path: '/subgame-lobby', query: { category: props.fullData.contentCategory } })
  }
}

async function getLotteryList() {
  try {
    loading.value = true
    const cateList = await gameStore.getAllSeriesAndGamesList()
    const gameList = cateList[0].children || []
    currentList.value = gameList.slice(0, 8)
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  const { children, data, gamerIndex, type, icon, title } = props?.fullData as Record<string, any> || {}
  iconStr.value = icon || ''
  titleStr.value = title || ''
  const gamerInfo = data[gamerIndex ?? 0]
  if (children && children.length > 0) {
    currentList.value = children
  }
  else if (type !== 'sports' && gamerInfo && gamerInfo.contentCategory) {
    fetchGameList(gamerInfo)
  }
  else if (type === 'lottery') {
    getLotteryList()
  }
})
</script>

<template>
  <div class="w-full">
    <template v-if="currentList.length > 0">
      <KKSwiper :swiper-list="currentList" swiper-width="160px" :icon="iconStr" :title="titleStr" @on-click-right="goTo">
        <template #default="{ itemData }">
          <GameCard
            :item="itemData"
            :type="itemData.contentCategory ? 'outer' : 'lottery'"
          />
        </template>
      </KKSwiper>
    </template>
    <template v-if="loading">
      <div class="flex-center">
        <van-loading color="#1989fa" />
      </div>
    </template>
  </div>
</template>

<style lang="less" scoped>
.home-top-container {
  --home__header-carousel-width: 840;
  --home__header-carousel-height: 320;
  --home__header-base-width: 1410;
  margin-bottom: 15px;
  padding-bottom: calc(100% / (var(--home__header-base-width) / var(--home__header-carousel-height)));
  position: relative;
}
</style>
