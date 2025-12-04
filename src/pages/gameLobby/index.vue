<script setup lang="ts">
import { showLoadingToast } from 'vant'
import useIframeOpenFunc from '@/04-kk-component-mobile/hooks/useIframeOpenFunc'
import { useGameStore } from '@/store/modules/game'

defineOptions({
  name: 'GameLobbyPage',
})

const router = useRouter()
const gameStore = useGameStore()
const { onClickClassiGame } = useIframeOpenFunc()

const gameList = ref<Record<string, any>[]>([])
const activeMenuName = ref('')

function onClickMenu(name: string, index: number) {
  activeMenuName.value = name
  const gameContent = document.querySelector(`#id${index}`)
  if (gameContent) {
    gameContent.scrollIntoView({ behavior: 'smooth' })
  }
}

function onGoBack() {
  router.replace('/')
}

async function init() {
  const toast = showLoadingToast({
    duration: 0,
    forbidClick: true,
  })
  gameList.value = await gameStore.getAllSeriesAndGamesList()
  const first = gameList.value[0] || {}
  activeMenuName.value = first.name
  toast.close()
}

onBeforeMount(() => {
  init()
})
</script>

<template>
  <Container :title="$t('web.i18nFront.label.lottGm')" :click-left="onGoBack">
    <div class="h-full flex overflow-hidden bg-#eef2fe text-13px color-#303442">
      <div class="left min-h-100% w-100px overflow-auto py-4 pl-4">
        <div
          v-for="(menu, k) in gameList"
          :key="`${k}-menu`"
          :class="{ active: activeMenuName === menu.name }"
          class="game-menu relative mb-3 h-55px w-75px flex-center flex-col gap-1 overflow-hidden rounded-2 text-#303442"
          @click="onClickMenu(menu.name, k)"
        >
          <span class="z-1">{{ menu.name }}</span>
        </div>
      </div>
      <div class="right flex-1 overflow-auto px-3 py-4">
        <div v-for="(cate, i) in gameList" :id="`id${i}`" :key="`${i}-cate`">
          <div class="pb-4 font-600">
            {{ cate.name }}
          </div>
          <div class="mb-5 flex flex-wrap gap-3">
            <div
              v-for="(game, k) in cate.children"
              :key="`${k}-game`"
              class="w-45% flex-center rounded-1 bg-#fff py-2 color-#303442"
              @click="onClickClassiGame(game)"
            >
              <span>{{ game.lottoName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Container>
</template>

<style lang="less" scoped>
.game-menu::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(@/assets/images/home/tab-bg.png);
  transition: linear 0.25s;
}
.game-menu {
  transition: all 0.3s ease-in;
}
.game-menu.active {
  color: #ffffff;
}
.game-menu.active::after {
  content: '';
  background-image: url(@/assets/images/home/active-tab-bg.png);
}
</style>
