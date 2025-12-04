<script setup lang="ts">
import type { IObject } from '@/01-kk-system/allHttp/types/common'
import { localImg } from '@/01-kk-system/allUtils/utils'

defineOptions({
  name: 'GameCard',
})
const props = defineProps({
  gameData: {
    type: Object,
    required: true,
  },
  collectedList: {
    type: Array<IObject>,
  },
})

const emit = defineEmits<{
  onCollect: [data: IObject]
}>()

const collectedIds = computed(() => {
  const res = []
  for (const item of props.collectedList) {
    res.push(item.lottoID)
  }
  return res
})

function onFinish() {

}

function getImage(info: Record<string, any>) {
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
</script>

<template>
  <div class="game-card relative h-82px flex flex-1 flex-col overflow-hidden rounded-2 bg-[var(--card-bg-color)] p-2">
    <p class="title text-12px">
      {{ gameData.lottoName }}
    </p>
    <van-count-down
      style="--van-count-down-text-color: var(--kk-game-card-countdown-color);--van-count-down-font-size:12px;"
      :time="60 * 1000" @finish="onFinish"
    />
    <div class="h-6 w-11 flex items-center justify-start" @click.stop="emit('onCollect', gameData)">
      <div class="favorite h-5 w-5" :class="{ collected: collectedIds.includes(gameData.lottoID) }" />
    </div>
    <div class="absolute bottom-1 right-0 h-13 w-13 overflow-hidden rounded-1">
      <img class="h-full w-full object-cover" :src="getImage(gameData)" alt="">
    </div>
  </div>
</template>

<style lang="less" scoped>
.game-card {
  background: url(@/assets/images/games/bg-game-card-light.png) no-repeat 50% / 100%;
}
html.dark .game-card {
  background: url(@/assets/images/games/bg-game-card-dark.png) no-repeat 50% / 100%;
}
.favorite {
  background: url(@/assets/images/games/icon-collect-light.png) no-repeat 50% / 100%;
}
html.dark .favorite {
  background: url(@/assets/images/games/icon-collect-dark.png) no-repeat 50% / 100%;
}
.favorite.collected {
  background: url(@/assets/images/games/icon-collected-light.png) no-repeat 50% / 100%;
}
html.dark .favorite.collected {
  background: url(@/assets/images/games/icon-collected-dark.png) no-repeat 50% / 100%;
}
.title {
  width: 100%;
  font-size: 12px;
  color: var(--kk-game-card-title-color);
  font-weight: 500;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-top: 4px;
}
</style>
