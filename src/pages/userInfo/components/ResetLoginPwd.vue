<script setup lang="ts">
import { showNotify } from 'vant'
import { userHttp } from '@/01-kk-system/allHttp/userHall/user'
import { translateTextBy } from '@/utils/i18n'

defineOptions({
  name: 'ResetLoginPwdModal',
})

const modalVisible = defineModel({ required: true, default: false })

const { t } = useI18n()

function handleCloseModal() {
  modalVisible.value = false
}

// 忘记密码
interface PwdForm {
  newPassword: string
  oldPassword: string
  confirmPassword: string
}
const pwdForm = reactive<PwdForm>({
  newPassword: '',
  oldPassword: '',
  confirmPassword: '',
})

const loading = ref(false)

function validatePwd2(value: string) {
  if (pwdForm.newPassword === value) {
    return true
  }
  else {
    return translateTextBy('system.i18nSystem.hint.pwdDiff')
  }
}

async function onSubmit() {
  loading.value = true
  const { newPassword, oldPassword } = pwdForm
  const res = await userHttp
    .updateLoginpassword({ newPassword, oldPassword })
    .catch(() => null)
  const { code } = res || {}
  if (code === '0') {
    handleCloseModal()
    showNotify({
      message: t('system.i18nSystem.hint.resetSuccess'),
      type: 'success',
    })
  }
  loading.value = false
}

function beforeClose() {
  pwdForm.confirmPassword = ''
  pwdForm.newPassword = ''
  pwdForm.oldPassword = ''
  handleCloseModal()
}
</script>

<template>
  <van-dialog v-model:show="modalVisible" show-cancel-button :close-on-click-overlay="true" :before-close="beforeClose">
    <div class="h-8 flex justify-end pr-3 pt-3">
      <van-icon name="close" @click="handleCloseModal" />
    </div>
    <van-form @submit="onSubmit">
      <h2 class="mb-5 text-center text-4">
        {{ $t('system.i18nSystem.opration.resetPasswordLogin') }}
      </h2>
      <van-cell-group inset class="border border-[var(--cp-color52)] border-solid">
        <van-field
          v-model="pwdForm.oldPassword"
          name="oldPassword"
          :placeholder="$t('system.i18nSystem.label.oldPassword')"
          clearable
          :rules="[{ required: true, message: $t('system.i18nSystem.placeholder.input') }]"
        />
      </van-cell-group>
      <van-cell-group inset icon="location-o" class="mt-4 border border-[var(--cp-color52)] border-solid">
        <van-field
          v-model="pwdForm.newPassword"
          type="password"
          name="newPassword"
          :placeholder="$t('system.i18nSystem.label.password')"
          :rules="[
            { required: true, message: $t('system.i18nSystem.message.password_required') },
            { pattern: /^(?!\d+$)(?![a-z]+$)[0-9A-Z]{8,16}$/i, message: $t('system.i18nSystem.hint.rightUserpwd') },
          ]"
        />
      </van-cell-group>
      <van-cell-group inset icon="location-o" class="mt-4 border border-[var(--cp-color52)] border-solid">
        <van-field
          v-model="pwdForm.confirmPassword"
          type="password"
          name="confirmPassword"
          clearable
          :placeholder="$t('system.i18nSystem.label.cfPassword')"
          :rules="[
            { required: true, validator: validatePwd2, message: $t('system.i18nSystem.message.password_required') },
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

<style lang="less" scoped></style>
