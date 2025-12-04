<script setup lang="ts">
import { showNotify } from 'vant'
import type { IObject } from '@/01-kk-system/allHttp/types/common'
import { userHttp } from '@/01-kk-system/allHttp/userHall/user'
import { translateTextBy } from '@/utils/i18n'

defineOptions({
  name: 'FundPwdModal',
})
const props = defineProps({
  hasFundPwd: Boolean,
})
const emit = defineEmits<{
  onUpdateClick: [editData: IObject]
  onRefreshPwd: [void]
}>()

const modalVisible = defineModel({ required: true, default: false })

const { t } = useI18n()

// 忘记密码
interface FundPwdForm {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

const fundPwdForm = reactive<FundPwdForm>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const loading = ref(false)

function handleCloseModal() {
  modalVisible.value = false
  fundPwdForm.confirmPassword = ''
  fundPwdForm.newPassword = ''
  fundPwdForm.oldPassword = ''
}

function validatePwd2(value: string) {
  if (fundPwdForm.newPassword === value) {
    return true
  }
  else {
    return translateTextBy('system.i18nSystem.hint.pwdDiff')
  }
}

async function onSubmit() {
  loading.value = true
  const { newPassword, oldPassword } = fundPwdForm
  if (props.hasFundPwd) {
    const res = await userHttp
      .updateFundpassword({ newPassword, oldPassword })
      .catch(() => null)
    const { code } = res || {}
    if (code === '0') {
      handleCloseModal()
      showNotify({
        message: t('system.i18nSystem.hint.editSuccess'),
        type: 'success',
      })
    }
  }
  else {
    const res = await userHttp
      .addFundpassword({ newPassword })
      .catch(() => null)
    const { code } = res || {}
    if (code === '0') {
      handleCloseModal()
      showNotify({
        message: t('system.i18nSystem.hint.createSuccess'),
        type: 'success',
      })
      emit('onRefreshPwd')
    }
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
    :title="$t('web.i18nFront.label.moneyPwd')"
    @close="handleCloseModal"
  >
    <h2 class="py-5 text-center text-14px color-#e5b781">
      {{ $t("system.i18nSystem.hint.rightUserpwd") }}
    </h2>
    <van-form @submit="onSubmit">
      <van-cell-group v-if="hasFundPwd" inset class="mt-3 border border-[var(--cp-color52)] border-solid">
        <van-field
          v-model="fundPwdForm.oldPassword"
          name="oldPassword"
          type="password"
          :placeholder="$t('system.i18nSystem.label.oldPassword')"
          clearable
          :rules="[{ required: true, message: $t('system.i18nSystem.placeholder.input') }]"
        />
      </van-cell-group>
      <van-cell-group inset class="mt-3 border border-[var(--cp-color52)] border-solid">
        <van-field
          v-model="fundPwdForm.newPassword"
          name="newPassword"
          type="password"
          :placeholder="$t('system.i18nSystem.label.newPassword')"
          clearable
          :rules="[
            { required: true, message: $t('system.i18nSystem.placeholder.input') },
            { pattern: /^(?!\d+$)(?![a-z]+$)[0-9A-Z]{8,16}$/i, message: $t('system.i18nSystem.hint.rightUserpwd') },
          ]"
        />
      </van-cell-group>
      <van-cell-group inset class="mt-3 border border-[var(--cp-color52)] border-solid">
        <van-field
          v-model="fundPwdForm.confirmPassword"
          name="confirmPassword"
          type="password"
          :placeholder="$t('system.i18nSystem.label.cfPassword')"
          clearable
          :rules="[
            { required: true, validator: validatePwd2, message: $t('system.i18nSystem.placeholder.input') },
          ]"
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
