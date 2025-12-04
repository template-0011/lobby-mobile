<script setup lang="ts">
const props = withDefaults(defineProps<{
  game: Record<string, any>
  type: string
  isSelect: boolean
}>(), {
  type: 'outer',
  isSelect: false,
})

const emit = defineEmits(['onSelect'])

function getImage() {
  if (props.game?.lottoClassify) {
    const { lottoClassify, country } = props.game || {}
    const ctry = country?.toLowerCase()
    if (lottoClassify && ctry) {
      return `${ctry}-${lottoClassify}`
    }
    return 'cn-101'
  }
  else {
    const { outerGamerID } = props.game || {}
    console.log('getImage---', outerGamerID)
    if (outerGamerID) {
      return outerGamerID
    }
    return '1001'
  }
}

const title = computed(() => {
  const { outerGamerName, name } = props.game || {}
  return outerGamerName || name
})

function onClick() {
  emit('onSelect', props.game)
}
</script>

<template>
  <div
    class="relative h-45px select-none overflow-hidden rounded-3 before:absolute before:left-3 before:right-3 before:h-1px before:b-0 before:bg-[#262e4880] hover:bg-[#262e4880] before:content-[''] hover:before:bg-transparent"
    :class="{ 'selected-menu before:bg-transparent': isSelect }"
    @click="onClick"
  >
    <div class="min-h-43px flex cursor-pointer items-center px-3 py-2">
      <div class="h-6 w-6 flex-center shrink-0 rounded-1 bg-[#5B9AFD]">
        <svg-icon
          :icon-class="getImage()"
          class="color-#fff"
          size="20px"
        />
      </div>
      <p class="text-one-line ml-2 mr-5px text-12px color-#fff font-600">
        {{ title }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.game-list-box {
  margin-top: 20px;
  min-height: 600px;
  -webkit-flex-flow: column nowrap;
  flex-flow: column nowrap;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  -webkit-align-items: center;
  align-items: center;
  position: relative;
}

.list-container {
  width: 100%;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
  display: flex;
  gap: 0 16px;
}
.selected-menu {
  background-image: linear-gradient(260deg, #00ff86, #00a858 48%, #00a858);
  box-shadow: 0 2px 14px #00bc6333;
}
</style>
