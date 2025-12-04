<script setup lang="ts">
import { useDesignSetting } from '@/hooks/useDesignSetting'
import { useDesignSettingStore } from '@/store/modules/designSetting'

defineOptions({
  name: 'ThemeSwitch',
})

withDefaults(defineProps<{
  size?: string
}>(), {
  size: '26px',
})

const { isDark } = useDesignSetting()

const designStore = useDesignSettingStore()

function toggle() {
  toggleDark()
  designStore.darkMode = isDark.value ? 'dark' : 'light'
}
</script>

<template>
  <div class="theme-switch w-full flex items-center rounded-full" :style="{ height: size }" @click="toggle()">
    <div class="item-keep-px flex-center flex-1 rounded-full" :class="{ active: isDark }">
      <img class="object-contain" src="@/assets/images/icons/icon-dark.png" alt="">
    </div>
    <div class="item-keep-px flex-center flex-1 rounded-full" :class="{ active: !isDark }">
      <img class="object-contain" src="@/assets/images/icons/icon-light.png" alt="">
    </div>
  </div>
</template>

<style lang="less" scoped>
.theme-switch {
  background: #fafafa;
  box-shadow: inset 0 0 0.16rem 0 rgba(0, 0, 0, 0.04);
  padding: 4px;
  font-size: 13px;
  max-width: 100px;
}
.active {
  background-image: linear-gradient(180deg, #fff, #e6e6e6);
  box-shadow:
    inset 0 0.027rem 0.08rem 0 rgba(0, 0, 0, 0.06),
    inset 0 -0.027rem 0.08rem 0 rgba(0, 0, 0, 0.06);
  color: #4d4d4d !important;
  font-weight: 500;
}
html.dark .theme-switch {
  background: #2c2a33;
  box-shadow: inset 0 0 0.053rem 0 hsla(0, 0%, 70.2%, 0.3);
}
html.dark .active {
  color: #fff !important;
  background-image: linear-gradient(180deg, #575466, #212026);
  box-shadow:
    inset 0 0.027rem 0.08rem 0 rgba(0, 0, 0, 0.1),
    inset 0 -0.027rem 0.08rem 0 rgba(0, 0, 0, 0.1);
  font-family: PingFangSC-Medium;
}
.item-keep-px {
  height: 20px;
  img {
    height: 16px;
  }
}
</style>
