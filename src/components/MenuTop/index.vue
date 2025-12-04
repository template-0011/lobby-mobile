<script setup lang="ts">
import { useGameStore } from '@/store/modules/game'

defineOptions({
  name: 'NavTop',
})

const props = defineProps<{
  onlyGame?: boolean
}>()

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()
const currMenuName = ref<string>('')

watch(() => route.name, (newVal) => {
  if (!props.onlyGame) {
    currMenuName.value = newVal as string
  }
}, { immediate: true })

const menus = computed(() => {
  const groupList = gameStore.allGroups || []
  return [
    {
      title: t('web.i18nFront.label.home'),
      id: 1,
      route: '/home',
      routeName: 'Home',
      css: '',
      type: 'home',
      isHot: false,
      children: null,
    },
    ...groupList,
    {
      title: t('web.i18nFront.title.egame'),
      id: 7,
      route: '/games',
      routeName: 'EGame',
      type: 'egame',
      contentCategory: 1003,
      isHot: false,
      children: null,
    },
    {
      title: t('web.i18nFront.title.fish'),
      id: 6,
      route: '/games',
      routeName: 'Fish',
      type: 'fish',
      contentCategory: 1004,
      isHot: false,
      children: null,
    },
    {
      title: t('web.i18nFront.title.lottery'),
      id: 2,
      route: '/games',
      routeName: 'GamesLobby',
      type: 'lottery',
      isHot: true,
    },
    {
      title: t('web.i18nFront.title.sports'),
      id: 3,
      route: '/sports',
      routeName: 'Sports',
      isHot: false,
      type: 'sport',
      contentCategory: 1006,
      children: null,
    },
    {
      title: t('web.i18nFront.title.realbet'),
      id: 4,
      route: '/games',
      routeName: 'Realbet',
      type: 'realbet',
      contentCategory: 1005,
      isHot: false,
      children: null,
    },
    {
      title: t('web.i18nFront.title.chess'),
      id: 5,
      route: '/games',
      routeName: 'chess',
      type: 'chess',
      contentCategory: 1002,
      isHot: false,
      children: null,
    },
  ]
})

function onClickSearch() {
  router.push({ path: '/subgame-lobby', query: { group: 'EGame' } })
}

function onClickMenu(item: any) {
  console.log('onClickMenu', item)
  if (item.routeName === 'Home') {
    router.push('/home')
  }
  else if (item.routeName === 'Sports') {
    router.push('/sports')
  }
  else if (item.type === 'hot') {
    router.push({ path: '/subgame-lobby', query: { group: item.routeName } })
  }
  else {
    router.push({ path: '/subgame-lobby', query: { category: item.type } })
  }
}
</script>

<template>
  <div class="h-45px flex items-center justify-between overflow-hidden border-b-1 border-b-[#141b2e] border-b-solid">
    <section class="menu-bar">
      <div
        v-for="item in menus"
        :key="item.id"
        class="menu-bar-item"
        :class="{ active: currMenuName === item.routeName }"
        @click="onClickMenu(item)"
      >
        <span>
          {{ item.title }}
        </span>
      </div>
      <div class="menu-bar-item holder" />
    </section>
    <div class="menu-search" @click="onClickSearch">
      <van-icon name="search" color="#fff" size="18px" />
    </div>
  </div>
</template>

  <style lang="less" scoped>
  .menu-search {
  display: flex;
  min-height: 100%;
  justify-content: flex-end;
  align-items: center;
  padding: 0 15px 0 4px;
  position: relative;
}
.menu-bar {
  align-items: center;
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  padding: 0 10px;
  scrollbar-width: none;
  width: 100%;
  mask-image: linear-gradient(to left, transparent 0%, #000 var(--navigation__tint-width, 85px));
  -webkit-overflow-scrolling: touch;
}
.menu-bar-item {
  align-items: center;
  border-radius: 290486px;
  color: #fff;
  display: flex;
  flex: none;
  font-size: 14px;
  font-weight: 400;
  height: 24px;
  line-height: 1;
  padding: 0 10px;
  white-space: nowrap;
  gap: 5px;
}
.menu-bar-item.active {
  background-image: linear-gradient(to bottom right, #0095ff, #0855c4);
  box-shadow: 0 6px 22px #056dda4d;
}
</style>
