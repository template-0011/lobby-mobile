<script setup lang="ts">
import NavTop from './components/NavTop/index.vue'
import NoticePannel from './components/NoticePannel.vue'
import Footer from './components/Footer/index.vue'
import useAppStore from '@/store/modules/app'

defineOptions({
  name: 'Layout',
})
const showNotice = ref(false)
const appStore = useAppStore()
const currRoute = useRoute()
const hideFooter = computed(() => currRoute.meta.hideFooter)

const showTopBar = computed(() => appStore.showTopBar)
</script>

<template>
  <div class="kk-layout-body flex-1 overflow-hidden overflow-y-auto bg-#090f1e" :class="{ 'pt-[57px]': showTopBar }">
    <NavTop @on-notice="showNotice = true" />
    <router-view v-slot="{ Component, route }">
      <transition name="zoom-fade" mode="out-in" appear>
        <component :is="Component" :key="route.name" />
      </transition>
    </router-view>
    <Footer v-if="!hideFooter" />
    <NoticePannel v-model:showNotice="showNotice" />
  </div>
</template>

<style lang="scss" scoped></style>
