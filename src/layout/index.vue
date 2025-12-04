<script setup lang="ts">
import NavTop from './components/NavTop/index.vue'
import NoticePannel from './components/NoticePannel.vue'
import Footer from './components/Footer/index.vue'

defineOptions({
  name: 'Layout',
})
const showNotice = ref(false)

const currRoute = useRoute()
const hideFooter = computed(() => currRoute.meta.hideFooter)
</script>

<template>
  <div class="kk-layout-body flex-1 overflow-hidden overflow-y-auto bg-#090f1e">
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
