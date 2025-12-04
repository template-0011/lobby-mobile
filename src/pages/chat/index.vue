<script setup lang="ts">
// const { t } = useI18n()

// const visible = computed(() => showModal.value.date || showModal.value.game || showModal.value.other)

// const gameList = ref<Array<GameListItem>>([])

// function onClickMenu(type?: 'date' | 'other' | 'game') {
//   if (type) {
//     showModal.value[type] = !showModal.value[type]
//   }
//   Object.keys(showModal.value).forEach((key) => {
//     if (key !== type) {
//       showModal.value[key] = false
//     }
//   })
// }

// async function onLoad() {
//   const { startTime, endTime } = getDateStartAndEnd(selectDate.value.value || 0, 'YYYY-MM-DD')
//   const params = {
//     pageSize: 10,
//     page: currentPage,
//     gameCode: selectGame.value.gameCode,
//     startTime,
//     endTime,
//     state: selectState.value.value,
//   }
//   const res = await findMyBetOrders(params).catch(() => null)
//   const { success, data } = res || {}
//   if (success) {
//     const { list: newList, totalPage, page } = data || {}

//     if (page < totalPage) {
//       currentPage++
//       finished.value = false
//     }
//     else {
//       finished.value = true
//     }
//     if (+page === 1) {
//       list.value = newList
//     }
//     else {
//       list.value = [...list.value, ...newList]
//     }
//     console.log('--------', newList)
//     console.log('----list.value----', list.value)
//   }
//   else {
//     finished.value = true
//   }
//   refreshing.value = false
//   loading.value = false
// }

// function onRefresh() {
//   // 清空列表数据
//   currentPage = 1
//   finished.value = true
//   loading.value = true
//   onLoad()
// }
// // 获取全部游戏
// async function fetchAllOpenGame() {
//   gameList.value = await fetchAllOpenGameCache()
// }

// function initData() {
//   fetchAllOpenGame()
// }

onBeforeMount(() => {
  // initData()
})

// function onDateSelect(data: any) {
//   selectDate.value = data
//   onRefresh()
// }
// function onGameSelect(data: any) {
//   const { gameCode, gameName } = data || {}
//   selectGame.value = { gameCode, gameName }
//   onRefresh()
// }
// function onOtherSelect(data: any) {
//   selectState.value = data
//   onRefresh()
// }
</script>

<template>
  <div class="flex flex-col color-#ffffff">
    <h4 class="color-#fff">
      聊天
    </h4>
  </div>
</template>

<style scoped>
.discovery-top {
  --van-tabs-line-height: 56px;
  --van-tabs-nav-background: linear-gradient(180deg, #72afff, #95c3ff 32%, #bad7ff);
  --van-tab-font-size: 16px;
  --van-tabs-bottom-bar-color: #000000;
  --van-tabs-bottom-bar-height: 2px;
}
:deep(.van-tabs__nav) {
  padding-left: 10%;
  padding-right: 10%;
}
</style>
