<script setup lang="ts">
import { showNotify } from 'vant'
import type { IObject } from '@/01-kk-system/allHttp/types/common'
import { foreverLinkTime } from '@/utils/const'

defineOptions({
  name: 'LinkCell',
})

defineProps({
  linkData: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits<{
  delete: [data: IObject]
  showQr: [data: IObject]
}>()

const { t } = useI18n()

function onCopy(row: IObject) {
  const oInput = document.createElement('input')
  oInput.value = row.invitationURL
  document.body.appendChild(oInput)
  oInput.select() // 选择对象;
  document.execCommand('Copy') // 执行浏览器复制命令
  showNotify({
    type: 'success',
    message: t('web.i18nFront.hint.copyOk'),
  })
  oInput.remove()
}

function deleteInvitationUrl(data: IObject) {
  emit('delete', data)
}

function onShowQR(row: IObject) {
  emit('showQr', row)
}
</script>

<template>
  <div class="card m-3 overflow-hidden rounded-6px bg-[var(--card-bg-color)] px-3 py-2 text-12px">
    <van-row type="flex" justify="center" align="center" class="mt-2">
      <van-col span="24">
        <p>{{ $t('system.i18nSystem.label.expireTime') }}：<span>{{ linkData.expiryTime === foreverLinkTime ? $t('web.i18nFront.title.forever') : linkData.expiryTime }}</span></p>
      </van-col>
    </van-row>
    <van-row type="flex" justify="center" align="center" class="my-4">
      <van-col span="24">
        <p>{{ $t('system.i18nSystem.label.remark') }}：<span>{{ linkData.remark }}</span></p>
      </van-col>
    </van-row>
    <van-row align="center" class="center links">
      <van-col span="20" class="text-overflow">
        <span class="van-ellipsis">{{ linkData.invitationURL }}</span>
      </van-col>
      <van-col span="4" class="text-center">
        <van-row :gutter="[16, 16]">
          <van-col span="24">
            <van-button type="primary" hairline plain color="#f07355" size="mini" @click="onCopy(linkData)">
              {{ $t('system.i18nSystem.opration.copy') }}
            </van-button>
          </van-col>
          <van-col span="24">
            <van-button type="primary" hairline plain color="#f07355" size="mini" @click="onShowQR(linkData)">
              {{ $t('system.i18nSystem.opration.qrcode') }}
            </van-button>
          </van-col>
        </van-row>
      </van-col>
    </van-row>
    <van-divider />
    <div class="text-center">
      <van-button type="danger" class="px-4" hairline size="mini" @click="deleteInvitationUrl(linkData)">
        {{ $t('system.i18nSystem.label.delete') }}
      </van-button>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
