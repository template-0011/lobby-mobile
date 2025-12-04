<script setup lang="ts">
import { showLoadingToast } from 'vant'
import { noticeHttp } from '@/01-kk-system/allHttp/userHall/notice'
import type { IObject } from '@/01-kk-system/allHttp/types/common'

defineOptions({
  name: 'AnnouncementDetail',
})

const route = useRoute()

const detailInfo = ref<IObject>({})

async function getNoticeDetail() {
  const toast = showLoadingToast({
    duration: 0,
    forbidClick: true,
  })
  const { params } = route || {}
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
  const res = await noticeHttp.getDerail(params.ownership, params.pressID).catch(() => null)
  const { code, data } = res || {}
  if (code === '0') {
    detailInfo.value = data
  }
  toast.close()
}

onBeforeMount(() => {
  getNoticeDetail()
})
</script>

<template>
  <div class="h-screen flex flex-col">
    <TopNav :title="$t('web.i18nFront.label.noticeDetail')" />
    <div class="mx-3 flex-1 overflow-auto color-#fff">
      <h3 class="my-5 w-full text-center text-16px">
        {{ detailInfo.title }}
      </h3>
      <SafeRichText class="text-sm leading-loose" :content="detailInfo.content" />
      <div class="h-10" />
    </div>
  </div>
</template>

<style lang="less" scoped></style>
