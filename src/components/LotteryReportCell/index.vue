<script setup lang="ts">
import dayjs from 'dayjs'
import { formatNum } from '@/01-kk-system/allUtils/utils'
import {
  winStatus,
} from '@/01-kk-system/allDefine/enum/frontend/game'

defineOptions({
  name: 'LotteryReportCell',
})

defineProps({
  itemData: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<template>
  <div class="card m-3 rounded-6px bg-[var(--card-bg-color)] px-2 py-2 text-12px">
    <van-row
      type="flex"
      class="header"
      justify="center"
    >
      <van-col span="12" class="text-sm color-[var(--primary-color)]">
        <van-icon name="contact" />{{ itemData.userName }}
      </van-col>
      <van-col span="12" class="text-right text-12px">
        {{ dayjs(itemData.betTime).format('YYYY-MM-DD HH:mm:ss') }}
        <van-icon name="arrow" color="var(--primary-color)" />
      </van-col>
    </van-row>
    <van-divider />
    <van-row>
      <van-col span="18" class="content">
        <van-row>
          <van-col span="12">
            <span class="title">{{ $t('web.i18nFront.label.lotteryName') }}</span>
          </van-col>
          <van-col span="12">
            <span class="title">{{ $t('web.i18nFront.label.plays') }}</span>
          </van-col>
        </van-row>
        <van-row>
          <van-col span="12">
            <span class="text">{{ itemData.lottoName }}</span>
          </van-col>
          <van-col span="12">
            <span class="text">{{ itemData.methodDes }}</span>
          </van-col>
        </van-row>
        <van-row class="mt-2">
          <van-col span="12">
            <span class="title">{{ $t('web.i18nFront.label.issue') }}</span>
          </van-col>
          <van-col span="12">
            <span class="title">{{ $t('web.i18nFront.label.betMoney') }}</span>
          </van-col>
        </van-row>
        <van-row>
          <van-col span="12">
            <span class="text">{{ itemData.issueCode }}</span>
          </van-col>
          <van-col span="12">
            <span class="text">{{ formatNum(itemData.theoryBuyMoney) }}</span>
          </van-col>
        </van-row>
      </van-col>
      <van-col span="6" class="footer">
        <span>{{ $t(winStatus.getDes(`${itemData.winStatus}` || "")) }}</span>
      </van-col>
    </van-row>
  </div>
</template>

<style lang="less" scoped>
.card {
  .van-divider {
    margin: 5px 0;
  }
  .content {
    span {
      text-align: right;
      color: #bdbdbd;
    }
  }
  .footer {
    color: var(--primary-color);
    height: 74px;
    display: flex;
    > span {
      text-align: center;
      padding: 2px 8px;
      font-size: 12px;
      display: inline-block;
      margin: auto;
      border: 1px solid var(--primary-color);
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
    .title {
      color: var(--kk-game-card-countdown-color);
    }
    .text {
      color: var(--kk-game-card-title-color);
    }
  }
}
</style>
