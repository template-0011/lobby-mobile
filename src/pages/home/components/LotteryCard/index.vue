<script setup lang="ts">
import type { IObject } from '@/01-kk-system/allHttp/types/common'

defineOptions({
  name: 'LotteryCard',
})

defineProps({
  itemData: {
    type: Object,
    default: () => ({}),
    required: true,
  },
})

const emit = defineEmits<{
  onFinish: [void]
  onBet: [data: IObject]
}>()
</script>

<template>
  <div class="kk-lottery-card-keep-px h-full w-full p-3">
    <div class="flex items-center justify-between">
      <p class="text-12px color-[var(--kk-count-down-text-color)]">
        {{ itemData.gameName }}
      </p>
      <van-count-down
        style="--van-count-down-text-color: var(--kk-count-down-text-color)"
        :time="itemData.time" @finish="emit('onFinish')"
      />
    </div>
    <div class="h-60px flex-center gap-2">
      <div
        v-for="(num, idx) in itemData.lastLuckyNumberArr" :key="`${idx}-num`"
        class="lottery-ball flex-center text-12px"
      >
        <span>{{ num }}</span>
      </div>
    </div>
    <div class="flex items-center justify-between">
      <p class="text-12px color-[var(--text-gray-color)]">
        {{ itemData.currentIssueCode }}
      </p>
      <KKButton
        :title="$t('web.i18nFront.game.onBet')" size="mini" :round="false"
        style="--kk-btn-bg-color-start: none;--kk-btn-bg-color-end: none; --kk-btn-text-color: var(--primary-color);--kk-btn-border: 1px solid var(--primary-color)"
        @on-click="emit('onBet', itemData)"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.kk-lottery-card-keep-px {
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.25);
  padding: 12px;
  background: url('@/assets/images/bg/card-lottery-bg-light.png') no-repeat 50% / cover;
}
html.dark .kk-lottery-card-keep-px {
  border: 1px solid rgba(132, 145, 165, 0.4);
  box-shadow: unset;
  background: url('@/assets/images/bg/card-lottery-bg-dark.png') no-repeat 50% / cover;
}
.lottery-ball {
  width: 30px;
  height: 30px;
  border-radius: 30px;
  color: var(--kk-lottery-ball-text-color);
  background: url(@/assets/images/bg/icon-ball-light.png) no-repeat 50% / 100%;
}

html.dark .lottery-ball {
  background: url(@/assets/images/bg/icon-ball-dark.png) no-repeat 50% / 100%;
}
</style>
