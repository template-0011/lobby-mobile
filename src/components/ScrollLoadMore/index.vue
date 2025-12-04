<script setup lang="ts">
import type { UseIntersectionObserverReturn } from '@vueuse/core'

defineOptions({
  name: 'KKScrollLoadMore',
})

const props = defineProps<{
  finished: boolean
}>()

const emit = defineEmits<{
  (e: 'loadMore'): void
}>()

const scrollLoadMoreRef = ref<HTMLDivElement>()
const targetIsVisible = ref(false)

let observer: UseIntersectionObserverReturn | null = null

onMounted(() => {
  if (scrollLoadMoreRef.value) {
    observer = useIntersectionObserver(scrollLoadMoreRef, ([entry]) => {
      targetIsVisible.value = entry?.isIntersecting || false
      if (targetIsVisible.value && !props.finished) {
        emit('loadMore')
      }
    })
  }
})

onBeforeUnmount(() => {
  observer?.stop()
})
</script>

<template>
  <div ref="scrollLoadMoreRef" class="relative flex-center py-8 text-sm color-#fff">
    <div v-if="!finished" class="flex-center flex-col gap-2">
      <KKLoading />
      <p>{{ '加载更多' }}</p>
    </div>
    <p v-else>
      {{ '没有更多了' }}
    </p>
  </div>
</template>
