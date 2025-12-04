<script setup lang="ts">
import type { IObject } from '@/01-kk-system/allHttp/types/common'
import { noticeHttp } from '@/01-kk-system/allHttp/userHall/notice'

defineOptions({
  name: 'KKLogo',
})
const loading = ref(false)
const announceList = ref<IObject[]>([])

const showNotice = defineModel<boolean>('showNotice', { required: true })

function handleClose() {
  showNotice.value = !showNotice.value
}

async function getNoticeList() {
  loading.value = true
  const res = await noticeHttp.getAllList('3').catch(() => null)
  const { code, data } = res || {}
  if (code === '0') {
    announceList.value = data || []
  }
  loading.value = false
}

watch(showNotice, (val) => {
  if (val) {
    getNoticeList()
  }
})

onMounted(() => {
  getNoticeList()
})

onBeforeMount(() => {
})
</script>

<template>
  <van-popup
    v-model:show="showNotice"
    round
    position="bottom"
    :style="{ height: '90%' }"
  >
    <div class="h-full w-full">
      <div class="h-64px w-full overflow-hidden border-b-1 border-b-[#77829b33] border-b-solid bg-white">
        <div class="h-68px w-full flex items-center justify-between border-b-1 border-b-[#77829b33] px-5">
          <span class="text-6 font-600">
            {{ $t("web.i18nFront.title.notice") }}
          </span>
          <div class="h-7 w-7 flex-center cursor-pointer rounded-2 bg-[#edf2ff]" @click="handleClose">
            <van-icon size="16px" name="cross" />
          </div>
        </div>
      </div>
      <div class="h-[calc(100%-64px)] overflow-hidden bg-white">
        <div class="h-full overflow-x-hidden overflow-y-auto px-5 pt-4">
          <div v-for="item in announceList" :key="item.pressID" class="notice-item">
            <p class="mb-2 text-12px text-[#77829b]">
              {{ item?.createTime }}
            </p>
            <h3 class="mb-4 text-5 text-[#090f1e] font-600">
              {{ item?.title ?? '-' }}
            </h3>
            <SafeRichText :content="item?.content ?? ''" />
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<style scoped>
.kk-notice-list::after {
  bottom: 0;
  box-shadow: 0 2px 10px #41414126;
  content: '';
  display: block;
  height: 100%;
  left: 0;
  opacity: 1;
  pointer-events: none;
  position: absolute;
  transition: opacity 0.3s ease-in-out;
  width: 100%;
}

.notice-item {
  background-color: #edf2ff;
  border: 1px solid rgba(119, 130, 155, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 8px -2px #0e10110d;
  overflow: hidden;
  padding: 16px;
  position: relative;
  margin-bottom: 16px;
}
</style>
