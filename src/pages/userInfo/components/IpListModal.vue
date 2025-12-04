<script setup lang="ts">
import type { IObject } from '@/01-kk-system/allHttp/types/common'
import { userHttp } from '@/01-kk-system/allHttp/userHall/user'

defineOptions({
  name: 'IpListModal',
})

const modalVisible = defineModel({ required: true, default: false })

const list = ref<IObject[]>([])
const loading = ref(false)

async function fetchData() {
  loading.value = true
  const res = await userHttp.ipList({ limit: 10 })
  const { data } = res ?? {}
  list.value = data ?? []
  loading.value = false
}

watch(() => modalVisible.value, () => {
  if (modalVisible.value && list.value?.length <= 0) {
    fetchData()
  }
})
</script>

<template>
  <van-popup
    v-model:show="modalVisible"
    teleport="body"
    position="bottom"
    round
    safe-area-inset-bottom
  >
    <div class="my-3">
      <van-cell
        :value="$t('system.i18nSystem.label.lastLoginDate')"
        :title="$t('web.i18nFront.label.ipList')"
      />
      <van-cell
        v-for="(item, i) in list"
        :key="`${i}-login-ip`"
        :value="item.lastLoginDate"
        :title="item.lastLoginIP"
      />
    </div>
  </van-popup>
</template>

<style lang="scss" scoped></style>
