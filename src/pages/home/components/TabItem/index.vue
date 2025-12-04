<script setup lang="ts">
// import useAppStore from '@/store/modules/app'

defineOptions({
  name: 'TabItem',
  inheritAttrs: false,
})
defineProps({
  item: {
    type: Object,
    default: () => ({}),
    required: true,
  },
  active: Boolean,
})
const emit = defineEmits<{
  onClick: [data: any]
}>()
</script>

<template>
  <a
    href="javascript:void(0)"
    class="menu-item relative h-55px w-full flex-center flex-col cursor-pointer overflow-hidden rounded-10px decoration-none"
    :class="{ active }"
    @click="emit('onClick', item)"
  >
    <div class="h-20px w-9 flex flex-center color-[--primary-color]">
      <svg-icon
        :icon-class="item.icon"
        :size="item.size"
        class="h-4 w-4 transition"
      />
    </div>
    <p class="pt-1 text-12px transition">
      {{ item.title }}
    </p>
  </a>
</template>

<style lang="less" scoped>
.menu-item {
  color: var(--tab-title-inactive-color);
  min-width: 55px;
  height: 55px;
}
.menu-item.active {
  background-image: linear-gradient(180deg, #fcfdff, #e6f0fe);
  box-shadow: 0 0 0 0.053rem #f3f5fb;
}
html.dark .menu-item.active {
  background-image: linear-gradient(180deg, #302e38, #302e38);
  box-shadow:
    inset 0 0.027rem 0.027rem 0 hsla(0, 0%, 100%, 0.3),
    inset 0 -0.027rem 0.027rem 0 rgba(0, 0, 0, 0.3);
}
// .menu-item.active::after,
// .menu-item:hover::after {
//   background-color: #ffa119;
// }
// .menu-item::after {
//   position: absolute;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   content: ' ';
//   height: 4px;
//   background-color: var(--cp-color45);
//   transition: 0.25s linear;
// }
</style>
