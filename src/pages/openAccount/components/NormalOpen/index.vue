<script setup lang="ts">
import { showNotify } from 'vant'
import { subordinateHttp } from '@/01-kk-system/allHttp/userHall/team'
import useUserStore from '@/store/modules/user'

defineOptions({
  name: 'NormalOpen',
})

interface RuleForm {
  bonusGroupOffi: number
  bonusGroupSelf: number
  bonusGroupThird: number
  loginPassword: string
  nickName: string
  userName: string
}

const { t } = useI18n()

const userStore = useUserStore()

const bonusGroupOffi = computed(() => userStore.userInfo.bonusGroupOffi)
const bonusGroupSelf = computed(() => userStore.userInfo.bonusGroupSelf)
const bonusGroupThird = computed(() => userStore.userInfo.bonusGroupThird)

const openForm = ref<RuleForm>({
  bonusGroupOffi: Number(bonusGroupOffi.value || 0),
  bonusGroupSelf: Number(bonusGroupSelf.value || 0),
  bonusGroupThird: Number(bonusGroupThird.value || 0),
  loginPassword: '',
  nickName: '',
  userName: '',
})
const showPwd = ref(false)
const loading = ref(false)

function resetForm() {
  openForm.value = {
    bonusGroupOffi: Number(bonusGroupOffi.value || 0),
    bonusGroupSelf: Number(bonusGroupSelf.value || 0),
    bonusGroupThird: Number(bonusGroupThird.value || 0),
    loginPassword: '',
    nickName: '',
    userName: '',
  }
}

async function submitForm() {
  loading.value = true
  const res = await subordinateHttp.create(openForm.value).catch(() => null)
  const { code } = res || {}
  if (code === '0') {
    showNotify({
      message: t('system.i18nSystem.hint.createSuccess'),
      type: 'success',
    })
    resetForm()
  }

  loading.value = false
}

const onSubmit = useThrottleFn(submitForm, 3000)

function validateClassicLott(val: string) {
  if (typeof val === 'undefined') {
    return t('system.i18nSystem.placeholder.input')
  }
  const numVal = Number(val)
  if (numVal < 0 || numVal > Number(bonusGroupOffi.value || 0)) {
    return t('web.i18nFront.hint.rangeError', { max: bonusGroupOffi.value })
  }
  return true
};

function validateHotLott(val: string) {
  if (typeof val === 'undefined') {
    return t('system.i18nSystem.placeholder.input')
  }
  const numVal = Number(val)
  if (numVal < 0 || numVal > Number(bonusGroupSelf.value || 0)) {
    return t('web.i18nFront.hint.rangeError', { max: bonusGroupSelf.value })
  }
  return true
};

function validateAboradLott(val: string) {
  if (typeof val === 'undefined') {
    return t('system.i18nSystem.placeholder.input')
  }
  const numVal = Number(val)
  if (numVal < 0 || numVal > Number(bonusGroupThird.value || 0)) {
    return t('web.i18nFront.hint.rangeError', { max: bonusGroupThird.value })
  }
  return true
};
</script>

<template>
  <van-form @submit="onSubmit">
    <h3 class="mx-4 my-4 text-left text-sm">
      {{ $t("web.i18nFront.label.baseSet") }}
    </h3>
    <van-cell-group inset class="border border-[var(--card-bg-color)] border-solid">
      <van-field
        v-model="openForm.userName"
        name="userName"
        :label="`${$t('system.i18nSystem.label.userName')}:`"
        :placeholder="$t('web.i18nFront.hint.userNameR')"
        clearable
        required
        :rules="[{ required: true, pattern: /^[a-z][a-z0-9]{5,15}$/i, message: $t('web.i18nFront.hint.userNameR') }]"
      />
      <van-field
        v-model="openForm.nickName"
        name="nickName"
        :label="`${$t('system.i18nSystem.label.nickName')}:`"
        :placeholder="$t('system.i18nSystem.label.nickName')"
        clearable
      />
      <van-field
        v-model="openForm.loginPassword"
        :type="showPwd ? 'text' : 'password'"
        name="loginPassword"
        :label="`${$t('system.i18nSystem.label.password')}:`"
        clearable
        required
        :placeholder="$t('web.i18nFront.hint.pwdR')"
        :right-icon="showPwd ? 'closed-eye' : 'eye'"
        :rules="[{ required: true, pattern: /^\w{4,16}$/, message: $t('web.i18nFront.hint.pwdR') }]"
        @click-right-icon="showPwd = !showPwd"
      />
    </van-cell-group>

    <h3 class="mx-4 my-4 text-left text-sm">
      {{ $t("web.i18nFront.label.rebateSet") }}
    </h3>
    <van-cell-group inset class="border border-[var(--card-bg-color)] border-solid">
      <van-field
        v-model.number="openForm.bonusGroupOffi"
        name="bonusGroupOffi"
        label-width="100px"
        colon
        required
        :label="$t('web.i18nFront.label.classicLott')"
        :placeholder="$t('system.i18nSystem.placeholder.input')"
        clearable
        :rules="[{ required: true, validator: validateClassicLott, message: $t('system.i18nSystem.placeholder.input') }]"
      />
      <van-field
        v-model.number="openForm.bonusGroupSelf"
        name="bonusGroupSelf"
        label-width="100px"
        :label="$t('web.i18nFront.label.hotLott')"
        colon
        required
        :placeholder="$t('system.i18nSystem.placeholder.input')"
        clearable
        :rules="[{ required: true, validator: validateHotLott, message: $t('system.i18nSystem.placeholder.input') }]"
      />
      <van-field
        v-model.number="openForm.bonusGroupThird"
        name="bonusGroupThird"
        label-width="100px"
        colon
        required
        :label="$t('web.i18nFront.label.aboradLott')"
        :placeholder="$t('system.i18nSystem.placeholder.input')"
        clearable
        :rules="[{ required: true, validator: validateAboradLott, message: $t('system.i18nSystem.placeholder.input') }]"
      />
    </van-cell-group>

    <div class="mx-4 my-8">
      <van-button round block type="danger" native-type="submit" :loading="loading">
        {{ $t("system.i18nSystem.opration.confirm") }}
      </van-button>
    </div>
  </van-form>
  <div class="m-4 color-white">
    <van-divider>
      <span class="text-4">{{ $t("web.i18nFront.tips.normalOpen") }}</span>
    </van-divider>
    <p class="text-sm leading-200%">
      1. {{ $t("web.i18nFront.tips.normalOpen1") }}
    </p>
    <p class="text-sm leading-200%">
      2. {{ $t("web.i18nFront.tips.normalOpen2") }}
    </p>
    <p class="text-sm color-#f07354 leading-200%">
      3. {{ $t("web.i18nFront.tips.normalOpen3") }}
    </p>
  </div>
</template>
