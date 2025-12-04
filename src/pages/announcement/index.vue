<script setup lang="ts">
import { showLoadingToast } from 'vant'
import type { IObject } from '@/01-kk-system/allHttp/types/common'
import { noticeHttp } from '@/01-kk-system/allHttp/userHall/notice'
import useRouteCacheStore from '@/store/modules/routeCache'

defineOptions({
  name: 'Announcement',
})

const list = ref<IObject>([])
const routeCacheStore = useRouteCacheStore()
const route = useRoute()

async function getNoticeList() {
  const toast = showLoadingToast({
    duration: 0,
    forbidClick: true,
  })
  const res = await noticeHttp.getAllList('3').catch(() => null)
  const { code, data } = res || {}
  if (code === '0') {
    list.value = data || []
  }
  toast.close()
}

function goBack() {
  routeCacheStore.removeRoute(route)
}

onBeforeMount(() => {
  getNoticeList()
})
</script>

<template>
  <div class="h-screen flex flex-col">
    <TopNav :title="$t('web.i18nFront.label.notice', '公告')" @click-left="goBack" />
    <div class="kk-announcement-cell-group mx-3 flex-1 overflow-auto">
      <van-cell-group v-for="(item, i) in list" :key="i" class="mt-5 overflow-hidden rounded-lg">
        <van-cell
          icon="bullhorn-o"
          is-link
          class="kk-announcement-cell"
          center
          :to="`/notice/${item.pressOwnership}/${item.pressID}`"
          :title="item.title"
          :label="item.createTime"
        >
          <template #icon>
            <img class="mr-2 w-5 object-contain" src="@/assets/images/notice.png" alt="">
          </template>
        </van-cell>
      </van-cell-group>
      <div class="h-10" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.kk-announcement-cell-group {
  --van-cell-group-background: transparent;
  --van-border-width: 0;
}
.kk-announcement-cell {
  --van-cell-text-color: #ffffff;
  --van-border-color: #ffffff00;
  --van-cell-background: linear-gradient(104deg, #1e283f -22%, rgba(20, 27, 46, 0.6) 91%);
}
</style>
