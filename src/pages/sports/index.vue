<script setup lang="ts">
import { localImg } from '@/01-kk-system/allUtils/utils'
import type { GameLineTypes } from '@/01-kk-system/middleware/fusionApi/game'
import useIframeOpenFunc from '@/04-kk-component-mobile/hooks/useIframeOpenFunc'
import { useGameStore } from '@/store/modules/game'

const gameStore = useGameStore()

const { onClickOuterGame } = useIframeOpenFunc()

onBeforeMount(() => {
  gameStore.getAvailableOuterGames()
})

const gameTxt = [
  '真实、及时的赛事资讯和比赛情报，详尽的赛事、球队、球员数据资料。提供多种赔率模式与玩法，带给您最佳的体育投注体验！',
  '倾力打造刺激火爆的体育娱乐游戏，多种娱乐方式选择，超高游戏赔付率，每天为您提供千场精彩体育赛事。',
  '清爽界面，便捷操作，高清画质，您将置身于世界体育盛事，尽情享受比赛带来的无尽激情，确保您不错过任何精彩瞬间。',
  '线上竞技，无限可能！畅享体育游戏，精彩瞬间，尽在掌握！一起开启胜利之旅！',
  '线上体育游戏带来无尽刺激！与全球玩家实时下注，体验最真实的体育快感，赢得胜利从未如此激动人心！',
  '与全球玩家同场，尽享线上体育游戏的无限激情！实时对战，真实体验，成就巅峰荣耀。立即加入，赢得每一场胜利！',
  '业界赔率最佳、赛事最全，涵盖海量热门体育赛事，提供视频直播、专业体育数据统计，满足对体育赛事的一切需求！',
]

const sportsList = computed(() => {
  const list = gameStore.sportGameList || []
  const data = list.map((game, index) => ({
    ...game,
    icon: localImg(`custom-images/sport/sports-icon-${game.outerGamerID}.png`),
    activeIcon: localImg(`custom-images/sport/sports-icon-${game.outerGamerID}-active.png`),
    title: game.outerGamerName,
    titleIcon: localImg(`custom-images/outergameicon/title-sport-${game.outerGamerID}.png`),
    subTxt: gameTxt[index],
    image: localImg(`custom-images/sport/sports-${game.outerGamerID}.png`),
  }))
  return data
})

function goToGame(game: GameLineTypes) {
  if (game) {
    onClickOuterGame(game)
  }
}
</script>

<template>
  <div class="mb-6 px-4 color-#ffffff">
    <MenuTop />
    <div v-for="item in sportsList" :key="item.outerGamerID" class="kk-sports-card mt-5 w-full">
      <div class="relative col-span-4 h-full w-full flex items-center">
        <div class="">
          <img class="h-60px w-60px object-contain" :src="item.activeIcon" alt="">
          <p class="pb-5 pt-3 text-16px color-white leading-6">
            {{ item.subTxt }}
          </p>
          <div class="kk-jump-btn" style="--kk-jump-btn-bg: linear-gradient(255deg, #fac82e, #fac82e); --kk-jump-btn-text-color: #000;" @click="goToGame(item)">
            {{ $t('web.i18nFront.game.goToGame') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kk-sports-card {
  background: linear-gradient(180.11deg, rgba(0, 0, 0, 0) 30.82%, rgba(31, 3, 80, 0.2) 99.91%),
    radial-gradient(64.3% 77.79% at 50.04% 90.29%, #4a0ab3 0%, rgba(112, 44, 246, 0) 100%),
    linear-gradient(123.86deg, #7572fc 6.33%, #702cf6 48.47%, #5110bc 98.95%), #7742e8;
  padding: 30px;
  border-radius: 20px;
  position: relative;
}

.kk-jump-btn {
  height: 45px;
  border-radius: 8px;
  background-image: linear-gradient(255deg, #fac82e, #fac82e);
  padding: 0 25px;
  cursor: pointer;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  position: relative;
  overflow: hidden;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  margin-top: 10px;
  color: #000;
}
.kk-jump-btn::before {
  content: '';
  position: absolute;
  height: 100%;
  width: 20%;
  background-color: #fff3;
  left: -25%;
  transform: skew(-20deg);
}
</style>
