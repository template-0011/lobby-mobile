<script setup lang="ts">
import type { BreadcrumbUser } from './useBreadcrumb'

defineOptions({
  name: 'CustomBreadcrumb',
})

defineProps({
  showFilter: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  onClick: [current: BreadcrumbUser]
  onFilter: [void]
}>()

const breadcrumbUsers = defineModel<BreadcrumbUser[]>({
  required: true,
  default: [],
})

function onClickCrumb(index: number) {
  if (index + 1 === breadcrumbUsers.value.length) {
    return
  }
  const item = breadcrumbUsers.value[index]
  breadcrumbUsers.value = breadcrumbUsers.value.slice(0, index + 1)
  emit('onClick', item)
}
</script>

<template>
  <van-cell class="filter">
    <template #title>
      <span class="custom-title">
        {{ $t("web.i18nFront.label.currentPlace") }}:
        <span
          v-for="(item, index) in breadcrumbUsers"
          :key="item.userID"
        >
          <span v-if="index >= breadcrumbUsers.length - 1">{{ item.userName }}</span>
          <span
            v-else
            class="text"
            style="padding: 0"
            @click="onClickCrumb(index)"
          >{{ item.userName }}>
          </span>
        </span>
      </span>
    </template>
    <template v-if="showFilter" #value>
      <div class="px-1 text-sm color-#c5c8db" @click="emit('onFilter')">
        <span>{{ $t('web.i18nFront.title.filter') }}</span>
        <van-icon name="filter-o" />
      </div>
    </template>
  </van-cell>
</template>

<style lang="less" scoped>
.filter {
  .custom-title {
    .text {
      text-decoration: underline;
      color: #f07355;
    }
  }
  .fifter-icon {
    margin: 5px 0 0 5px;
  }
}
</style>
