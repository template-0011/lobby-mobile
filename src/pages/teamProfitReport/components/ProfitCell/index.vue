<script setup lang="ts">
import type { IObject } from '@/01-kk-system/allHttp/types/common'
import { formatNum, totalSell, totalWin } from '@/01-kk-system/allUtils/utils'
import useUserStore from '@/store/modules/user'

defineOptions({
  name: 'ProfitCell',
})

defineProps({
  itemData: {
    type: Object,
    default: () => ({}),
  },
  isTotal: {
    type: Boolean,
    default: false,
  },
  dateKey: {
    type: String,
    default: '',
  },
})

const emit = defineEmits<{
  onSubUser: [data: IObject]
  onDetail: [data: IObject]
}>()

const userStore = useUserStore()

const unit = computed(() => userStore.currentWalletInfo.abbreviation)
</script>

<template>
  <div class="card m-3 rounded-6px bg-[var(--card-bg-color)] px-2 py-4 text-12px">
    <template v-if="isTotal">
      <van-row class="text-13px">
        <van-col class="text-center">
          <p class="pb-4 color-[var(--primary-color)]">
            {{ $t('web.i18nFront.title.total') }}
          </p>
        </van-col>
      </van-row>
      <van-row class="text-13px">
        <van-col class="van-hairline--right text-center" :span="8">
          <p class="leading-200%">
            {{ $t('web.i18nFront.title.allBet') }}
          </p>
          <p class="leading-200%">
            {{ totalSell(itemData) }} {{ unit }}
          </p>
        </van-col>
        <van-col class="van-hairline--right text-center" :span="8">
          <p class="leading-200%">
            {{ $t('web.i18nFront.title.allWin') }}
          </p>
          <p class="leading-200%">
            {{ totalWin(itemData) }} {{ unit }}
          </p>
        </van-col>
        <van-col class="text-center" :span="8">
          <p class="leading-200%">
            {{ $t('web.i18nFront.title.allwinOrLose') }}
          </p>
          <p class="leading-200%">
            {{ formatNum(itemData.totalProfitMoney, 2) }} {{ unit }}
          </p>
        </van-col>
      </van-row>
      <van-divider />
      <van-row>
        <van-col class="text-center" :span="24">
          <van-button color="#f07355" size="mini" class="px-4" @click="emit('onDetail', itemData)">
            {{ $t('web.i18nFront.label.seeDetail') }}
          </van-button>
        </van-col>
      </van-row>
    </template>
    <template v-else>
      <van-row class="pb-4 text-13px">
        <van-col span="12" class="text-sm color-[var(--primary-color)]" @click.stop="emit('onSubUser', itemData)">
          <van-icon name="contact" class="mr-1" />{{ itemData.userName }}
        </van-col>
        <van-col span="12" class="text-right text-12px color-[var(--primary-color)]">
          {{ dateKey ? $t(dateKey) : '' }}
        </van-col>
      </van-row>
      <van-row class="text-13px">
        <van-col class="van-hairline--right text-center" :span="8">
          <p class="leading-200%">
            {{ $t('web.i18nFront.title.allBet') }}
          </p>
          <p class="leading-200%">
            {{ totalSell(itemData) }} {{ unit }}
          </p>
        </van-col>
        <van-col class="van-hairline--right text-center" :span="8">
          <p class="leading-200%">
            {{ $t('web.i18nFront.title.allWin') }}
          </p>
          <p class="leading-200%">
            {{ totalWin(itemData) }} {{ unit }}
          </p>
        </van-col>
        <van-col class="text-center" :span="8">
          <p class="leading-200%">
            {{ $t('web.i18nFront.title.allwinOrLose') }}
          </p>
          <p class="leading-200%">
            {{ formatNum(itemData.totalProfitMoney, 2) }} {{ unit }}
          </p>
        </van-col>
      </van-row>
      <van-divider />
      <van-row>
        <van-col class="text-center" :span="24">
          <van-button color="#f07355" size="mini" class="px-4" @click="emit('onDetail', itemData)">
            {{ $t('web.i18nFront.label.seeDetail') }}
          </van-button>
        </van-col>
      </van-row>
    </template>
  </div>
</template>

<style lang="less" scoped></style>
