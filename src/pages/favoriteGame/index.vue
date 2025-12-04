<script setup lang="ts">
import { useGameCollectionStore } from '@/store/modules/gameCollection'

defineOptions({
  name: 'FavoriteGamePage',
})

const gameCollectionStore = useGameCollectionStore()

const gameCollectionList = computed(() => {
  return gameCollectionStore.favoriteGames
})

onBeforeMount(() => {
  gameCollectionStore.getLocalCollections()
})
</script>

<template>
  <Container class="h-screen" :title="$t('web.i18nFront.label.collection')">
    <div class="h-full overflow-y-auto">
      <div v-if="gameCollectionList.length > 0" class="grid grid-cols-2 mx-4 mt-5 gap-4 pb-10">
        <GameCard v-for="item in gameCollectionList" :key="item.id" :item="item" />
      </div>
      <div v-else>
        <van-empty image-size="100" :description="$t('web.i18nFront.hint.noData')" />
      </div>
    </div>
  </Container>
</template>

<style lang="less" scoped>
.container {
  width: 100%;
  padding-bottom: 50px;
  padding-top: 8px;
  overflow-y: auto;
  .card {
    background: linear-gradient(107.15deg, #1e283f, rgba(20, 27, 46, 0.6));
    border-radius: 10px;
    margin: 10px 15px;
    padding: 15px;
    .right {
      text-align: right;
    }
    .top {
      font-size: 12px;
      color: #ffffff;
      .refresh {
        font-weight: bold;
      }
    }
    .center {
      font-size: 14px;
      color: #ffffff;
      margin-top: 15px;
      .jiantou {
        transform: rotate(90deg);
      }
      .fromMoney {
        border: 1px solid #ffffff3d;
        border-radius: 4px;
        padding: 0 10px;
        font-size: 14px;
        width: 120px;
        text-align: right;
        height: 30px;
        background: transparent;
      }
    }
    .bottom {
      margin-top: 10px;
      color: orange;
      font-size: 12px;
    }
  }
  .exChangeDiv {
    width: 40px;
    height: 40px;
    position: absolute;
    left: 50%;
    background: #f4f4f5;
    border-radius: 50%;
    padding: 6px;
    transform: rotate(90deg) translateY(50%);
    font-size: 23px;
    color: #969799;
    margin-top: -27px;
    border: 1px solid #fff;
  }
  .sureChange {
    color: #fff;
    font-size: 16px;
    text-align: center;
    width: 90%;
    margin: 0 auto;
    line-height: 40px;
    margin-top: 30px;
  }
  .hrefText {
    color: #969799;
    font-size: 12px;
    margin: 0 15px;
  }
}
.van-loading {
  display: inline-block;
}
</style>
