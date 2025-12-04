<script setup lang="ts">
import { translateTextBy } from '@/utils/i18n'

defineOptions({
  name: 'CustomDialog',
})

defineProps({
  title: {
    type: String,
    default: translateTextBy('system.i18nSystem.label.hint'),
  },
  desc: {
    type: String,
  },
})

const emit = defineEmits(['onCancel', 'onConfirm'])
</script>

<template>
  <van-dialog v-bind="$attrs" teleport="body">
    <div class="absolute right-3 top-3" @click="emit('onCancel')">
      <van-icon size="20" name="close" />
    </div>
    <div v-if="$slots.title" class="px-6">
      <slot name="title" />
    </div>
    <div v-else class="flex-center px-6 pt-5 text-18px">
      <h4 class="color-[--kk-dialog-title]">
        {{ title }}
      </h4>
    </div>
    <div v-if="$slots.default" class="px-6 pb-2 pt-5">
      <slot name="default" />
    </div>
    <div v-else class="flex flex-col items-center px-6 pb-2 pt-5">
      <div class="h-144px w-144px flex-center">
        <IconConfirm />
      </div>
      <p v-if="desc" class="pt-4 text-center text-sm color-[var(--normal-text-color)]">
        {{ desc }}
      </p>
    </div>
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>
    <template v-if="!$slots.footer" #footer>
      <div class="flex items-center justify-between px-6 pb-7 pt-4">
        <div class="cancel-btn kk-d-btn flex-center" @click="emit('onCancel')">
          {{ $t('system.i18nSystem.opration.cancel') }}
        </div>
        <div class="kk-d-btn ok-btn flex-center" @click="emit('onConfirm')">
          {{ $t('system.i18nSystem.opration.confirm2') }}
        </div>
      </div>
    </template>
  </van-dialog>
</template>

<style lang="less" scoped>
.kk-d-btn {
  width: 125px;
  height: 44px;
  border-radius: 44px;
}

.ok-btn {
  color: #fff;
  background-image: linear-gradient(180deg, #8bbcff, #5387fd);
}

.cancel-btn {
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  background-image: none;
}
html.dark .cancel-btn {
  color: var(--normal-text-color);
  border: 1px solid var(--normal-text-color);
  background-image: none;
}
html.dark .ok-btn {
  color: #fff;
  background-image: linear-gradient(180deg, #f96, #ff780d);
}
</style>
