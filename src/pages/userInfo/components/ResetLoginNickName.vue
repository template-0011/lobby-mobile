<script setup lang="ts">
import { showNotify } from 'vant'
import { userHttp } from '@/01-kk-system/allHttp/userHall/user'
// import { translateTextBy } from '@/utils/i18n'
// import type { IObject } from '@/01-kk-system/allHttp/types/common'
import useUserStore from '@/store/modules/user'

defineOptions({
  name: 'ResetLoginNicenameModal',
})
// const emit = defineEmits<{
//   onUpdateClick: [editData: IObject]
// }>()

const namePattern = /^[\s\S]{3,50}$/

const modalVisible = defineModel({ required: true, default: false })

const userStore = useUserStore()
const { t } = useI18n()

// 修改用户信息
interface NameForm {
  nickName: string
}
const nameForm = reactive<NameForm>({
  nickName: '',
})
const loading = ref(false)

function handleCloseModal() {
  nameForm.nickName = ''
  modalVisible.value = false
}

async function onSubmit() {
  loading.value = true
  const { nickName } = nameForm
  const res = await userHttp.updateAccount({ nickName }).catch(() => null)
  const { code } = res || {}
  if (code === '0') {
    handleCloseModal()
    showNotify({
      message: t('system.i18nSystem.hint.editSuccess'),
      type: 'success',
    })
    userStore.getUserInfo()
  }
  loading.value = false
}
</script>

<template>
  <van-dialog
    v-model:show="modalVisible"
    :append-to-body="true"
    :close-on-click-overlay="true"
    :before-close="handleCloseModal"
  >
    <van-form @submit="onSubmit">
      <h3 class="my-4 text-center text-sm">
        {{ $t('system.i18nSystem.label.nickName') }}
      </h3>
      <van-cell-group inset class="border border-[var(--cp-color52)] border-solid">
        <van-field
          v-model="nameForm.nickName"
          name="userName"
          :placeholder="$t('system.i18nSystem.hint.rightName')"
          clearable
          :rules="[{ required: true, pattern: namePattern, message: $t('system.i18nSystem.hint.rightName') }]"
        />
      </van-cell-group>
      <div class="mx-5 my-4">
        <van-button
          round
          block
          type="warning"
          style="
          background: var(--van-action-bar-button-danger-color);
          height: var(--van-dialog-round-button-height);
          border: none
        " native-type="submit"
          :loading="loading"
        >
          {{ $t("system.i18nSystem.opration.confirm") }}
        </van-button>
      </div>
    </van-form>
    <template #footer />
  </van-dialog>
</template>

<style lang="scss" scoped></style>
