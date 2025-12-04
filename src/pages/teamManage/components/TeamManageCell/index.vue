<script setup lang="ts">
import type { IObject } from '@/01-kk-system/allHttp/types/common'
import { teamUserStatus } from '@/01-kk-system/allDefine/enum/frontend/user'
import useUserStore from '@/store/modules/user'

defineOptions({
  name: 'TeamManageCell',
})

defineProps({
  itemData: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits<{
  onSubUser: [data: IObject]
  onTransfor: [data: IObject]
}>()

const { t } = useI18n()
const userStore = useUserStore()
const router = useRouter()

// 是否是直属下级 is an immediate subordinate
function isDirectSub(item: IObject) {
  return Number(userStore.userInfo.userLevel) - Number(item.userLevel) === -1
}
// 是否是直属下级 is an immediate subordinate with i18n
function isDirectSubTxt(item: IObject) {
  return isDirectSub(item) ? t('web.i18nFront.title.yes') : t('web.i18nFront.title.no')
}

function goToSign(itemData: IObject) {
  router.push({ path: `/team-manage-sign/${itemData.userID}` })
}
</script>

<template>
  <div class="card m-3 rounded-6px bg-[var(--card-bg-color)] px-2 py-2 text-12px color-[var(--text-gray-color)]">
    <van-row
      type="flex"
      class="header"
      justify="center"
    >
      <van-col span="12" class="text-sm color-#f07355" @click="emit('onSubUser', itemData)">
        <van-icon name="contact" />{{ itemData.userName }}
      </van-col>
      <van-col span="12" class="text-right text-12px">
        {{ itemData.lastLoginDate }}
      </van-col>
    </van-row>
    <van-divider />
    <van-row>
      <van-col span="12">
        <span class="title">{{ `${$t('system.i18nSystem.label.state')}: ` }}</span>
        <span>{{ $t(teamUserStatus.getDes(itemData.status || '')) }}</span>
      </van-col>
      <van-col span="12">
        <span class="title">{{ `${$t('web.i18nFront.label.isDown')}: ` }}</span>
        <span>{{ isDirectSubTxt(itemData) }}</span>
      </van-col>
    </van-row>
    <van-row>
      <van-col span="12">
        <span class="title">{{ `${$t('web.i18nFront.label.playerBalance')}: ` }}</span>
        <span>{{ itemData.availableBalance }}</span>
      </van-col>
      <van-col span="12">
        <span class="title">{{ `${$t('web.i18nFront.label.classicLott')}: ` }}</span>
        <span>{{ itemData.bonusGroupOffi }}</span>
      </van-col>
    </van-row>
    <van-row>
      <van-col span="12">
        <span class="title">{{ `${$t('web.i18nFront.label.hotLott')}: ` }}</span>
        <span>{{ itemData.bonusGroupSelf }}</span>
      </van-col>
      <van-col span="12">
        <span class="title">{{ `${$t('web.i18nFront.label.aboradLott')}: ` }}</span>
        <span>{{ itemData.bonusGroupThird }}</span>
      </van-col>
    </van-row>
    <van-row>
      <van-col span="24">
        <span class="title">{{ `${$t('web.i18nFront.label.lastLoginIp')}: ` }}</span>
        <span>{{ itemData.lastLoginIP }}</span>
      </van-col>
    </van-row>
    <van-divider />
    <van-row>
      <van-col span="24">
        <div class="flex-center gap-4">
          <van-button v-if="isDirectSub(itemData)" type="danger" size="mini" class="px-4" @click="emit('onTransfor', itemData)">
            {{ $t('web.i18nFront.label.transfor') }}
          </van-button>
          <van-button type="danger" size="mini" class="px-4" @click="goToSign(itemData)">
            {{ $t('web.i18nFront.label.sign') }}
          </van-button>
        </div>
      </van-col>
    </van-row>
  </div>
</template>

<style lang="less" scoped>
.card {
  .van-divider {
    margin: 5px 0;
  }
  .title {
    display: inline-block;
    min-width: 50px;
    padding-right: 6px;
  }
  .footer {
    color: #f07355;
    height: 74px;
    display: flex;
    > span {
      text-align: center;
      padding: 2px 8px;
      font-size: 12px;
      display: inline-block;
      margin: auto;
      border: 1px solid #f07355;
      border-radius: 5px;
    }
  }
  .van-row {
    padding: 3px 0;
    .black {
      color: #111111;
      text-decoration: underline;
      font-size: 14px;
    }
  }
}
</style>
