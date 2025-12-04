<script setup lang="ts">
defineOptions({
  name: 'TopNav',
})

const props = defineProps({
  clickLeft: Function,
})

const router = useRouter()
// const route = useRoute()

function onClickLeft() {
  if (props.clickLeft) {
    props.clickLeft()
  }
  else {
    // console.log('--router---', router)
    // console.log('--route---', route)
    const failure = router.back()
    console.log('--failure---', failure)
  }
}
</script>

<template>
  <van-nav-bar
    v-bind="$attrs"
    left-arrow
    @click-left="onClickLeft"
  >
    <template #right>
      <slot name="right" />
    </template>
  </van-nav-bar>
</template>

<style lang="less" scoped></style>
