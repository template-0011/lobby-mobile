<script setup lang="ts">
import IconGift from '@/components/Icons/IconGift/index.vue'
import IconHome from '@/components/Icons/IconHome/index.vue'
import IconGame from '@/components/Icons/IconGame/index.vue'
import IconMenu from '@/components/Icons/IconMenu/index.vue'
import IconSports from '@/components/Icons/IconSports/index.vue'
import type { IObject } from '@/01-kk-system/allHttp/types/common'
import { eventEmitter } from '@/01-kk-system/allUtils/eventEmitter'

defineOptions({
  name: 'KKTabbar',
})

defineProps({
  activeName: String,
})

const emit = defineEmits<{
  onMenu: [void]
}>()

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const active = ref('home')
const activeIndex = ref(-1)
const Tabbars = [
  {
    index: 0,
    label: t('system.i18nSystem.label.dashboard'),
    icon: IconHome,
    name: 'home',
    path: '/home',
  },
  {
    index: 1,
    label: t('system.i18nSystem.label.sport'),
    icon: IconSports,
    name: 'sports',
    path: '/sports',
  },
  {
    index: 2,
    label: t('system.i18nSystem.label.activity'),
    icon: IconGift,
    name: 'activity',
    path: '/activity',
  },
  {
    index: 3,
    label: t('system.i18nSystem.label.game'),
    icon: IconGame,
    name: 'game',
    path: '/subgame-lobby',
  },
  {
    index: 4,
    label: t('system.i18nSystem.label.menus'),
    icon: IconMenu,
    name: 'menu',
  },
]

const scrollViewStyle = computed(() => {
  if (activeIndex.value === -1) {
    return {
      transform: `translateX(-999px)`,
      width: '0px',
    }
  }

  const count = Tabbars.length

  return {
    transform: `translateX(calc(min(100vw, 600px) / ${count} * ${activeIndex.value} + 10px))`,
    width: `calc((min(100vw, 600px) / ${count}) - 20px)`,
  }
})

const currPath = computed(() => route.path)

function handleActiveByPath() {
  const target = Tabbars.find(item => item.path === currPath.value)
  activeIndex.value = target?.index ?? -1
  active.value = target?.name ?? ''
}

watch(() => currPath.value, () => {
  handleActiveByPath()
}, { immediate: true })

function onClickTab(name: any) {
  const target = Tabbars.find(item => item.name === name)
  activeIndex.value = target?.index ?? -1
  switchTab(target)
}

function switchTab(target: IObject) {
  active.value = target?.name ?? ''
  switch (target?.name) {
    case 'menu':
      emit('onMenu')
      break
    default:
      if (target?.path) {
        router.push(target.path)
      }
      break
  }
}

onMounted(() => {
  eventEmitter.on('close-sider-pop', () => {
    console.log('close-sider-pop')
    handleActiveByPath()
  })
})
</script>

<template>
  <van-tabbar v-model="active" class="kk-tabbar-class" @change="onClickTab">
    <van-tabbar-item v-for="(tabbar, i) in Tabbars" :key="i" :name="tabbar.name">
      <span>{{ tabbar.label }}</span>
      <template #icon="props">
        <component
          :is="tabbar.icon"
          :key="tabbar.name"
          :active="props.active"
        />
      </template>
    </van-tabbar-item>
    <div class="scroll-index-bar" :style="scrollViewStyle" />
  </van-tabbar>
</template>

<style lang="less" scoped>
.kk-tabbar-class {
  --van-tabbar-background: #ffffff;
  --van-tabbar-item-active-background: #536387;
  --van-tabbar-item-text-color: #536387;
  --van-tabbar-item-active-color: #ffffff;
  --van-border-color: #090f1e;
  --van-tabbar-height: 60px;
  --van-tabbar-item-font-size: 10px;
}
.scroll-index-bar {
  height: 6px;
  background-color: #0854c3;
  box-shadow: 0 0 1px #090f1e;
  position: absolute;
  top: -3px;
  left: 0;
  border-radius: 3px;
  transition:
    transform 0.4s ease-out,
    opacity 0.4s ease-out;
  z-index: 1;
}
</style>
