<script setup lang="ts">
import { showNotify } from 'vant'
import type { FormInstance } from 'vant'
import { userHttp } from '@/01-kk-system/allHttp/userHall/user'
import { translateTextBy } from '@/utils/i18n'

defineOptions({
  name: 'ResetRealNameModal',
})

const props = defineProps({
  realName: {
    type: String,
    required: true,
  },
})

const emit = defineEmits<{
  refresh: [void]
}>()

const modalVisible = defineModel({ required: true, default: false })

const { t } = useI18n()

function handleCloseModal() {
  modalVisible.value = false
}

// 忘记密码
interface RealNameForm {
  realName: string
  fundPwd: string
}
const realNameForm = reactive<RealNameForm>({
  realName: '',
  fundPwd: '',
})

const loading = ref(false)
const realNameFormRef = ref<FormInstance>()

watch(() => modalVisible.value, () => {
  if (modalVisible.value) {
    // eslint-disable-next-line regexp/optimal-quantifier-concatenation
    realNameForm.realName = props.realName ? props.realName?.replace(/^(.).*/, '$1**') : ''
  }
})

function validateCN(value: string) {
  const reg = /^[\u4E00-\u9FA5]+$/
  if (value === '') {
    return translateTextBy('system.i18nSystem.placeholder.input')
  }
  else {
    if (!reg.test(value)) {
      return translateTextBy('web.i18nFront.tips.needRealName')
    }
    return true
  }
}

async function onSubmit() {
  try {
    loading.value = true
    const { realName, fundPwd } = realNameForm
    const pwdRes = await userHttp.validateFundpassword(fundPwd).catch(() => null)
    const { code: pwdCode, data: pwdData } = pwdRes || {}
    if (pwdCode !== '0' || !pwdData) {
      realNameForm.fundPwd = ''
      realNameFormRef.value?.validate('fundPwd')
      return
    }
    const res = await userHttp
      .updateRealfo({ realName })
      .catch(() => null)
    const { code } = res || {}
    if (code === '0') {
      handleCloseModal()
      const msg = props.realName ? t('system.i18nSystem.hint.editSuccess') : t('system.i18nSystem.hint.createSuccess')
      showNotify({
        message: msg,
        type: 'success',
      })
      emit('refresh')
    }
  }
  catch (error) {
    console.log(error)
  }
  finally {
    loading.value = false
  }
}

function beforeClose() {
  realNameForm.realName = ''
  realNameForm.fundPwd = ''
  handleCloseModal()
}

const title = computed(() => {
  return props.realName ? `${t('system.i18nSystem.label.edit')}${t('web.i18nFront.label.realname')}` : `${t('web.i18nFront.label.setting')}${t('web.i18nFront.label.realname')}`
})
</script>

<template>
  <van-dialog v-model:show="modalVisible" show-cancel-button :close-on-click-overlay="true" :before-close="beforeClose">
    <div class="h-8 flex justify-end pr-3 pt-3">
      <van-icon name="close" @click="handleCloseModal" />
    </div>
    <van-form ref="realNameFormRef" required="auto" @submit="onSubmit">
      <h2 class="mb-5 text-center text-4">
        {{ title }}
      </h2>
      <van-cell-group inset class="border border-[var(--cp-color52)] border-solid">
        <van-field
          v-model="realNameForm.realName"
          name="realName"
          :placeholder="$t('web.i18nFront.label.realname')"
          clearable
          :rules="[{ required: true, validator: validateCN, message: $t('system.i18nSystem.placeholder.input') }]"
        />
      </van-cell-group>
      <van-cell-group inset class="mt-4 border border-[var(--cp-color52)] border-solid">
        <van-field
          v-model="realNameForm.fundPwd"
          name="fundPwd"
          type="password"
          :placeholder="$t('web.i18nFront.label.mpwd')"
          clearable
          :rules="[{ required: true, message: $t('web.i18nFront.hint.confirmFundPwd2') }]"
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
