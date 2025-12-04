<script setup lang="ts">
import { showConfirmDialog, showLoadingToast, showNotify } from 'vant'
import { useQRCode } from '@vueuse/integrations/useQRCode'
import LinkCell from './LinkCell.vue'
import type { IObject } from '@/01-kk-system/allHttp/types/common'
import { subordinateHttp } from '@/01-kk-system/allHttp/userHall/team'

defineOptions({
  name: 'LinkManage',
})

const { t } = useI18n()

const loading = ref(false)
const refreshing = ref(false)
const listData = ref<IObject[]>([])

async function getLinksList() {
  const toast = showLoadingToast({
    duration: 0,
    forbidClick: true,
  })
  loading.value = true
  const res = await subordinateHttp.getLinks().catch(() => null)
  const { data, code } = res || {}
  if (code === '0') {
    listData.value = data || []
  }
  loading.value = false
  if (refreshing.value) {
    refreshing.value = false
  }
  toast.close()
}

async function onDelete(row: IObject) {
  const confirm = await showConfirmDialog({
    title: t('system.i18nSystem.hint.warning'),
    message: t('system.i18nSystem.hint.confirmDele'),
  }).catch(() => null)
  if (!confirm) {
    return
  }
  loading.value = true
  const res = await subordinateHttp.deleteLinks(row.recordID).catch(() => null)
  const { code } = res || {}
  if (code === '0') {
    showNotify({
      type: 'success',
      message: t('system.i18nSystem.hint.deleteSuccess'),
    })
    onRefresh()
  }
  else {
    loading.value = false
  }
}

function onRefresh() {
  loading.value = true
  getLinksList()
}

// 二维码
const qrcodeTxt = shallowRef('')
// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
const qrcode = useQRCode(qrcodeTxt)
const showQr = ref(false)

function onShowQR(row: IObject) {
  qrcodeTxt.value = row.invitationURL
  showQr.value = true
}

onBeforeMount(() => {
  onRefresh()
})
</script>

<template>
  <div class="">
    <van-pull-refresh v-model="refreshing" class="h-full !overflow-y-scroll" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="true"
      >
        <template v-if="listData && listData.length > 0">
          <LinkCell v-for="(data, i) in listData" :key="i" :link-data="data" @delete="onDelete" @show-qr="onShowQR" />
        </template>
        <template v-else>
          <div class="h-full flex flex-col justify-center">
            <van-empty image-size="100" :description="$t('web.i18nFront.hint.noData')" />
          </div>
        </template>
        <div class="h-10" />
      </van-list>
    </van-pull-refresh>
  </div>
  <van-dialog v-model:show="showQr" theme="round-button">
    <div class="mx-auto mb-5 mt-10 h-200px w-200px flex-center border-1 border-white rounded-2 bg-[#eef2fe] p-4">
      <!-- @vue-ignore -->
      <img class="h-160px w-160px" :src="qrcode" alt="APP QR Code">
    </div>
  </van-dialog>
</template>

<style lang="less" scoped></style>
