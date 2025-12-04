<script setup lang="ts">
import { localImg } from '@/01-kk-system/allUtils/utils'

defineOptions({
  name: 'CommonCard',
})

const props = defineProps({
  game: {
    type: Object,
    required: true,
  },
  nameKey: {
    type: String,
    default: 'name',
  },
  logoType: {
    type: String,
    default: 'lottery',
  },
})

const emit = defineEmits<{
  onClick: [data: any]
}>()

function getImage(info: Record<string, any>) {
  if (props.logoType === 'lottery') {
    const country = info.country ? info.country.toLowerCase() : ''
    console.log(`custom-images/lottery/${country}-${info.lottoClassify}.png`)
    // return info.logo
    return localImg(`custom-images/lottery/${country}-${info.lottoClassify}.png`)
  }
  else {
    const type = info.lobbyCode ? info.lobbyCode.toLowerCase() : ''
    return localImg(`custom-images/${type}/${info.image}`)
  }
}
</script>

<template>
  <div class="w-full overflow-hidden rounded-2" @click="emit('onClick', game)">
    <div class="game-thumb">
      <img class="w-full object-contain" alt="" :src="getImage(game)">
    </div>
    <div class="game-span">
      <h4 class="text-overflow">
        {{ game[nameKey] }}
      </h4>
    </div>
  </div>
</template>

<style lang="less" scoped>
.game-span {
  width: 100%;
  text-align: center;
}
.game-span h4 {
  transition: 0.25s linear;
  color: #fff;
  font-size: 12px;
  font-weight: 400;
  padding: 6px 0;
  text-shadow: 1px 1px 2px #3b3b3b;
}
</style>
