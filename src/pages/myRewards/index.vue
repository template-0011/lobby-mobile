<script setup lang="ts">
import { showLoadingToast } from 'vant'
import type { IObject } from '@/01-kk-system/allHttp/types/common'
import { contractHttp } from '@/01-kk-system/allHttp/userHall/user'

defineOptions({
  name: 'MyRewards',
})

const list = ref<IObject[]>([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)

async function onLoad() {
  if (refreshing.value) {
    list.value = []
    refreshing.value = false
  }
  const toast = showLoadingToast({
    duration: 0,
    forbidClick: true,
  })
  const res = await contractHttp.getMyContractList().catch(() => null)
  const { code, data } = res || {}
  if (code === '0') {
    const tempList = data || []
    tempList.forEach((item) => {
      if (typeof item.jsonConf === 'string') {
        item.configList = JSON.parse(item.jsonConf)
      }
    })
    list.value = tempList
  }
  loading.value = false
  toast.close()
}

function onRefresh() {
  // reset finished to false
  finished.value = false
  // reload data
  loading.value = true
  onLoad()
}

onBeforeMount(() => {
  onRefresh()
})
</script>

<template>
  <div class="h-screen flex flex-col">
    <TopNav :title="$t('web.i18nFront.label.myRewards')" />
    <div class="mx-3 flex-1 overflow-auto">
      <template v-if="list && list.length > 0">
        <van-pull-refresh v-model="refreshing" class="h-full !overflow-y-scroll" @refresh="onRefresh">
          <van-list
            v-model:loading="loading"
            :finished="true"
            @load="onLoad"
          >
            <ContractItem v-for="(data, i) in list" :key="i" :item-data="data" />
            <div class="h-10" />
          </van-list>
        </van-pull-refresh>
      </template>
      <template v-else>
        <div class="h-full flex flex-col justify-center">
          <van-empty image-size="100" :description="$t('web.i18nFront.hint.noData')" />
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
