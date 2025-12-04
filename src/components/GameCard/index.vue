<script setup lang="ts">
import { localImg } from '@/01-kk-system/allUtils/utils'
import type { IObject } from '@/01-kk-system/allHttp/types/common'
import { useGameStore } from '@/store/modules/game'
import useLinkOpenFunc from '@/04-kk-component-mobile/hooks/useIframeOpenFunc'
import { useGameCollectionStore } from '@/store/modules/gameCollection'

defineOptions({
  name: 'KKGameCard',
})

const props = defineProps({
  item: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  type: {
    type: String,
    default: 'outer', // outer / lottery
  },
})

const { onClickOuterSubGame, onClickClassiGame } = useLinkOpenFunc()

const gameStore = useGameStore()
const gameCollectionStore = useGameCollectionStore()
const outerGamerName = ref('')

const isLottery = computed(() => {
  return props.item.lottoClassify
})

function getLotteryImage(info: Record<string, any>) {
  const { lottoClassifyCountry, lottoClassify, lottoID } = info || {}
  const countryCode = lottoClassifyCountry ? lottoClassifyCountry.toLowerCase() : ''
  const lottoClassifyImg = localImg(`custom-images/lottery/${countryCode}-${lottoClassify}.png`)
  if (lottoID) {
    const lotteryImg = localImg(`custom-images/lottery-games/${countryCode}-${lottoClassify}-${lottoID}.png`)
    return lotteryImg.includes('undefined') ? lottoClassifyImg : lotteryImg
  }
  else {
    return lottoClassifyImg
  }
}

const contentCategoryObj = {
  1001: 'lottery',
  1002: 'chess',
  1003: 'slot',
  1004: 'fish',
  1005: 'live',
  1006: 'sport',
  1007: 'vSport',
  1008: 'eSport',
}
function getOuterImage(game: IObject) {
  const { outerGamerID, subgameCode, contentCategory } = game || {}

  if (contentCategoryObj[contentCategory]) {
    const path = `${contentCategoryObj[contentCategory]}-subgame`
    const subCode = subgameCode?.toLowerCase()
    const imagepath = localImg(`custom-images/${path}/${outerGamerID}-${subCode}.jpg`)
    if (imagepath.includes('undefined')) {
      return localImg(`custom-images/${path}/${outerGamerID}-${subCode}.png`)
    }
    else {
      return imagepath
    }
  }
}

function getImage(info: Record<string, any>) {
  if (!isLottery.value) {
    return getOuterImage(info)
  }
  else {
    return getLotteryImage(info)
  }
}

function getIcon(info: Record<string, any>) {
  if (!isLottery.value) {
    const { outerGamerID } = info || {}
    return localImg(`custom-images/outergameicon/${outerGamerID}.png`)
  }
  else {
    const country = info.lottoClassifyCountry?.toLowerCase() || ''
    const icon = localImg(`custom-images/lottery-icon/${country}-${info.lottoClassify}.png`)
    return icon
  }
}

async function getOuterGamerName(info: Record<string, any>) {
  if (!isLottery.value) {
    const { outerGamerID } = info || {}
    const target = await gameStore.getOuterGamerByID(outerGamerID)
    outerGamerName.value = target?.outerGamerName ?? ''
  }
  else {
    const lotteryCate = await gameStore.getFullSeries()
    const { lottoClassify, lottoClassifyCountry } = info || {}
    const target = lotteryCate.find((item: Record<string, any>) => item.lottoClassify === lottoClassify && item.country === lottoClassifyCountry)
    outerGamerName.value = target?.name ?? ''
  }
}

function onClickCard(item: Record<string, any>) {
  if (!isLottery.value) {
    onClickOuterSubGame(item)
  }
  else {
    onClickClassiGame(item)
  }
}

function onStar(item: Record<string, any>) {
  gameCollectionStore.setLocalCollections(item)
}

const isFavorite = computed(() => {
  const { item } = props
  const outerFavoriteIds = gameCollectionStore.outerFavoriteIds
  const lotteryFavoriteIds = gameCollectionStore.lotteryFavoriteIds
  if (item.contentCategory) {
    const key = gameCollectionStore.getOuterKey(item)
    return outerFavoriteIds.includes(key)
  }
  else {
    const key = gameCollectionStore.getLotteryKey(item)
    return lotteryFavoriteIds.includes(key)
  }
})

onMounted(async () => {
  await getOuterGamerName(props.item)
})
</script>

<template>
  <div class="list-card-keep-px" @click="onClickCard(item)">
    <div class="card-top-keep-px" :class="{ active: isFavorite }">
      <img class="absolute inset-0 h-full w-full object-cover" :src="getImage(item)" alt="">
    </div>
    <div class="card-bottom">
      <div class="flex items-center">
        <img class="mr-1 h-4 w-4 rounded-2" :src="getIcon(item)" alt="">
        <p class="grow-1 overflow-hidden text-overflow pr-6px text-nowrap text-10px color-#667697 font-500 leading-5">
          {{ outerGamerName }}
        </p>
        <div class="h-4 w-4 flex-center color-#E9AB0F" :style="{ color: isFavorite ? '#E9AB0F' : '#2c3756' }" @click.stop="onStar(item)">
          <svg-icon icon-class="icon-star" />
        </div>
      </div>
      <p class="mt-1 overflow-hidden text-overflow text-14px color-#ffffff font-700 leading-5">
        {{ item.subgameDes || item.lottoName }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.list-card-keep-px {
  width: 100%;
  cursor: pointer;
  -webkit-mask-image: radial-gradient(#fff, #000);
  mask-image: radial-gradient(#fff, #000);
  overflow: hidden;
  position: relative;
  z-index: 2;
}
.list-card-keep-px.active {
  border: 2px solid #e9ab0f00;
  border-radius: 16px;
  overflow: hidden;
  padding-bottom: 90%;
  position: relative;
  transition: border-color 0.3s ease-in-out;
}
.card-top-keep-px {
  border: 2px solid #e9ab0f00;
  overflow: hidden;
  padding-bottom: 90%;
  border-radius: 32px;
  position: relative;
  transition: border-color 0.3s ease-in-out;
}
.card-top-keep-px.active {
  border-color: #e9ab0f;
}

.card-bottom {
  margin-top: 8px;
  color: #303442;
  height: 48px;
  line-height: 48px;
  width: 100%;
  font-size: 14px;
  overflow: hidden;
  font-weight: 500;
}
.card-cover {
  position: absolute;
  text-align: center;
  width: 100%;
  z-index: 10;
  line-height: 214px;
  height: 214px;
  top: -214px;
  background-color: rgba(0, 0, 0, 0.5);
  transition: all 0.5s;
  text-align: center;
  display: block;
}
.list-card:hover .card-cover {
  top: 0;
}
</style>
