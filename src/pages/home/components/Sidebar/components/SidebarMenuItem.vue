<script setup lang="ts">
import useAppStore from '@/store/modules/app'

defineOptions({
  name: 'SidebarMenuItem',
  inheritAttrs: false,
})
defineProps({
  item: {
    type: Object,
    default: () => ({}),
    required: true,
  },
})
const emit = defineEmits<{
  onClick: [data: any]
}>()
const appStore = useAppStore()
const activePath = computed(() => appStore.activeMenu)
</script>

<template>
  <a
    href="javascript:void(0)"
    class="menu-item relative h-50px w-45% flex-center flex-col cursor-pointer overflow-hidden rounded-10px decoration-none hover:text-[var(--cp-color46)]"
    :class="{ active: item.name === activePath }"
    @click="emit('onClick', item)"
  >
    <div class="h-20px w-9 flex flex-center">
      <svg-icon
        :icon-class="item.icon"
        :size="item.size"
        class="h-4 w-4 transition"
      />
    </div>
    <p class="text-14px transition">
      {{ item.title }}
    </p>
  </a>
</template>

<style lang="less" scoped>
.menu-item {
  background: linear-gradient(var(--cp-color69), var(--cp-color70));
  color: #ffffff;
  // background: var(--cp-color70);
}
.menu-item.active {
  color: #ffa119;
}
.menu-item.active::after,
.menu-item:hover::after {
  background-color: #ffa119;
}
.menu-item::after {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  content: ' ';
  height: 4px;
  background-color: var(--cp-color45);
  transition: 0.25s linear;
}
</style>
