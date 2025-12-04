<script setup lang="ts">
import { useThirdGameMoney } from '@/04-kk-component-mobile/hooks/useThirdGameMoney'

defineOptions({
  name: 'OuterBalanceCard',
})
defineProps({
  game: {
    type: Object,
    default: () => ({}),
  },
})

const injectObj = inject<{ onRefresh: () => void }>('Outer-Game-Provider')

const { trans2Out, onRefresh, loading, refreshLoading, balance } = useThirdGameMoney()

function trans2OutFunc(game: Record<string, any>) {
  trans2Out(game, injectObj?.onRefresh)
}
</script>

<template>
  <div class="wallet-card">
    <div class="wallet-info flex items-center justify-between color-white">
      <span class="single-text wallet-name flex-1 text-overflow text-sm">{{
        game.outerGamerName
      }}</span>
      <van-button type="danger" size="mini" :loading="loading" round @click="trans2OutFunc(game)">
        {{ $t("web.i18nFront.label.sys2outer") }}
      </van-button>
    </div>
    <div class="h-26px w-full flex items-center pt-1 line-height-26px">
      <b class="text-one-line flex-1 text-left text-16px color-#bab5c9 font-500">
        {{ balance }}
      </b>
      <van-button
        style="--van-button-border-width: 0" :loading="refreshLoading" size="mini" icon="replay"
        @click="onRefresh(game)"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.wallet-card {
  width: 100%;
  height: 70px;
  border: 1px solid #373343;
  border-radius: 5px;
  padding: 10px 8px;
  vertical-align: top;
  position: relative;
}

.wallet-info {
  text-align: left;
  --el-color-danger: #4a4a54;
}
</style>
