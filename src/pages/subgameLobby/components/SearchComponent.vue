<script setup lang="ts">
import { debounce } from 'lodash-es'
import ProviderItem from './ProviderItem.vue'
import type { IObject } from '@/01-kk-system/allHttp/types/common'

defineOptions({
  name: 'KKSearchComponent',
})

const props = withDefaults(defineProps<{
  providers?: Record<string, any>[]
  menuList?: Record<string, any>[]
  selectedGame?: Record<string, any>
}>(), {
  providers: () => [],
  menuList: () => [],
})

const emit = defineEmits(['onSearch', 'onFavorite', 'onSelect'])
const searchValue = ref('')
const isCollect = ref(false)
const showBottom = ref(false)
const currentProvider = ref('')
const isHot = computed(() => {
  const selectedGame = props.selectedGame ?? {}
  return selectedGame.type === 'hot'
})
const isLottery = computed(() => {
  const selectedGame = props.selectedGame ?? {}
  return selectedGame.lottoClassify
})

function onInput() {
  emit('onSearch', searchValue.value)
}
const debounceInput = debounce(onInput, 500, { leading: false, trailing: true })

function onClickCollection() {
  isCollect.value = !isCollect.value
  emit('onFavorite', isCollect.value)
}

function onShowProvider() {
  console.log('onShowProvider')
  showBottom.value = true
}

function onSelect(game: IObject) {
  isCollect.value = false
  showBottom.value = false
  currentProvider.value = game.outerGamerName || game.name
  emit('onSelect', game)
}

watch(() => props.selectedGame, (newVal) => {
  if (newVal.type === 'hot') {
    currentProvider.value = ''
  }
  else {
    currentProvider.value = newVal.outerGamerName || newVal.name
  }
}, { immediate: true })
</script>

<template>
  <div v-if="!isHot" class="m-4">
    <header v-if="!isLottery" class="mb-3 flex shrink-0 gap-2">
      <div class="relative h-9 flex flex-1 items-center rounded-2 bg-#161d2e">
        <van-icon class="ml-2" name="search" size="20" color="#7388b6" />
        <input
          v-model="searchValue"
          type="text"
          class="h-full flex-1 rounded-2 border-none bg-transparent pl-2 text-14px color-#7388b6 outline-none"
          :placeholder="$t('web.i18nFront.title.search')"
          @input="debounceInput"
        >
      </div>
      <div class="kk-collect-c" :class="{ 'cc-active': isCollect }" @click="onClickCollection">
        <van-icon name="star" size="18px" />
      </div>
    </header>
    <div class="h-9 flex items-center justify-between rounded-2 bg-#161d2e px-3" @click="onShowProvider">
      <div class="text-14px color-#94a6cd">
        <span>{{ currentProvider || '提供商' }}</span>
      </div>
      <svg class="dropdown-arrow h-9 w-6 color-#94a6cd" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
    <van-popup
      v-model:show="showBottom"
      position="bottom"
      round
      :style="{ 'height': '50%', '--van-popup-background': '#161d2e' }"
    >
      <div class="flex flex-col gap-2 bg-#161d2e">
        <ProviderItem
          v-for="item in menuList"
          :key="item.outerGamerID"
          :game="item"
          @on-select="onSelect"
        />
      </div>
    </van-popup>
  </div>
</template>

<!-- :is-select="item.lottoClassify ? item.name === selectedGame?.name : item.outerGamerID === selectedGame?.outerGamerID" -->
<style lang="less" scoped>
.kk-collect-c {
  width: 32px;
  height: 36px;
  border-radius: 6px;
  color: #ffd031;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffd0311a;
}
.kk-collect-c.cc-active {
  background: #ffd031;
  color: #141b2f;
}
</style>
