<script setup lang="ts">
import { useGameStore } from '@/store/modules/game'

defineOptions({
  name: 'GameCateMenu',
})

const emit = defineEmits(['clickMenu', 'clickFavorite'])

const { t } = useI18n()
const gameStore = useGameStore()
const currentName = ref('')

const gameMenus = computed(() => {
  const groupList = gameStore.allGroups || []
  return [
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
      contentCategory: 1001,
      isHot: true,
    },
    {
      title: t('web.i18nFront.title.realbet'),
      id: 4,
      route: '/games',
      routeName: 'Realbet',
      contentCategory: 1005,
      type: 'realbet',
      isHot: false,
      children: null,
    },
    {
      title: t('web.i18nFront.title.chess'),
      id: 5,
      route: '/games',
      routeName: 'Chess',
      contentCategory: 1002,
      type: 'chess',
      isHot: false,
      children: null,
    },
  ]
})

function onClickMenu(item: any) {
  currentName.value = item.routeName
  emit('clickMenu', item)
}

function handleInitMenu(query: Record<string, any> = {}) {
  console.log('handleInitMenu', query)
  if (query.group) {
    const target = gameMenus.value.find(item => item.routeName === query.group)
    if (target) {
      currentName.value = target.routeName
    }
  }
  else {
    const target = gameMenus.value.find(item => item.type === query.type)
    if (target) {
      currentName.value = target.routeName
    }
  }
}

defineExpose({
  handleInitMenu,
})
</script>

<template>
  <div class="h-45px flex items-center justify-between overflow-hidden border-b-1">
    <section class="menu-bar">
      <div
        v-for="item in gameMenus"
        :key="item.id"
        class="menu-bar-item"
        :class="{ active: currentName === item.routeName }"
        @click="onClickMenu(item)"
      >
        <span>
          {{ item.title }}
        </span>
      </div>
      <div class="menu-bar-item holder" />
    </section>
    <!-- <div class="menu-search" @click="onClickFavorite">
      <van-icon name="star" color="#e9ab0f" size="18px" />
    </div> -->
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
