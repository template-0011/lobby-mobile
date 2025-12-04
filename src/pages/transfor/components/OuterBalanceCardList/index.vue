<script setup lang="ts">
import OuterBalanceCard from '../OuterBalanceCard/index.vue'
import { useGameStore } from '@/store/modules/game'

defineOptions({
  name: 'OuterBalanceCardList',
})

const { t } = useI18n()
const gameStore = useGameStore()
const gameList = ref<Record<string, any>[]>([])

async function handleGameList() {
  const allGames = await gameStore.getAvailableOuterGamesLine()
  let list: Record<string, any>[] = []
  for (const key in allGames) {
    if (Object.hasOwnProperty.call(allGames, key)) {
      const games = allGames[key]
      for (let i = 0; i < games.length; i++) {
        const game = games[i]
        switch (game.outerGamerID) {
          case '1001':
            {
              const gameName = 'AG'
              game.tips = t('web.i18nFront.tips.outer', { game: gameName })
            }
            break
          case '1002':
            {
              const gameName = 'BBIN'
              game.tips = t('web.i18nFront.tips.outer', { game: gameName })
            }
            break
          case '1008':
            {
              const gameName = 'DG'
              game.tips = t('web.i18nFront.tips.outer', { game: gameName })
            }
            break
          default:
            break
        }
      }
      list = list.concat(games)
    }
  }
  gameList.value = list
}

onBeforeMount(() => {
  handleGameList()
})
</script>

<template>
  <div class="grid grid-cols-2 min-h-50 flex-wrap justify-between gap-4 px-3">
    <OuterBalanceCard v-for="(item, i) in gameList" :key="i" :game="item" />
  </div>
</template>

<style lang="less" scoped>
.more {
  width: 100%;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  color: #949494;
  margin: 20px auto;
}
</style>
