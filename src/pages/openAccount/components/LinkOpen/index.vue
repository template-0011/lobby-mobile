<script setup lang="ts">
import { showNotify } from 'vant'
import { subordinateHttp } from '@/01-kk-system/allHttp/userHall/team'
import useUserStore from '@/store/modules/user'
import { expireTimeList, foreverLinkTime } from '@/utils/const'
import { getDateStartAndEnd } from '@/01-kk-system/allUtils/utils'

defineOptions({
  name: 'LinkOpen',
})

interface RuleForm {
  bonusGroupOffi: number
  bonusGroupSelf: number
  bonusGroupThird: number
  expiryTime: string
  remark: string
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
  remark: '',
  expiryTime: '',
})
const loading = ref(false)
const showSelectTime = ref(false)
const expireInfo = ref({
  day: 0,
  label: '',
})

function onSelectedTime() {
  showSelectTime.value = false
  const target = expireTimeList.find(item => item.value === expireInfo.value.day)
  if (!target) {
    return
  }
  expireInfo.value.label = target.label
  if (expireInfo.value.day === 9999) {
    openForm.value.expiryTime = foreverLinkTime
  }
  else {
    if (target.calculater) {
      openForm.value.expiryTime = target.calculater()
    }
    else {
      const date = getDateStartAndEnd(expireInfo.value.day, 'YYYY-MM-DD')
      openForm.value.expiryTime = `${date.end} 00:00:00`
    }
  }
}

function resetForm() {
  openForm.value = {
    bonusGroupOffi: Number(bonusGroupOffi.value || 0),
    bonusGroupSelf: Number(bonusGroupSelf.value || 0),
    bonusGroupThird: Number(bonusGroupThird.value || 0),
    remark: '',
    expiryTime: '',
  }
  expireInfo.value = {
    day: 0,
    label: '',
  }
}

async function submitForm() {
  loading.value = true
  const res = await subordinateHttp
    .createLink(openForm.value)
    .catch(() => null)
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
}

function validateHotLott(val: string) {
  if (typeof val === 'undefined') {
    return t('system.i18nSystem.placeholder.input')
  }
  const numVal = Number(val)
  if (numVal < 0 || numVal > Number(bonusGroupSelf.value || 0)) {
    return t('web.i18nFront.hint.rangeError', { max: bonusGroupSelf.value })
  }
  return true
}

function validateAboradLott(val: string) {
  if (typeof val === 'undefined') {
    return t('system.i18nSystem.placeholder.input')
  }
  const numVal = Number(val)
  if (numVal < 0 || numVal > Number(bonusGroupThird.value || 0)) {
    return t('web.i18nFront.hint.rangeError', { max: bonusGroupThird.value })
  }
  return true
}

onBeforeMount(() => {
  expireInfo.value.day = 90
  onSelectedTime()
})
</script>

<template>
  <van-form @submit="onSubmit">
    <h3 class="mx-4 my-4 text-left text-sm">
      {{ $t("web.i18nFront.label.rebateSet") }}
    </h3>
    <van-cell-group inset class="border border-[var(--card-bg-color)] border-solid">
      <van-field
        v-model.number="openForm.bonusGroupOffi"
        name="bonusGroupOffi"
        label-width="100px"

        :label="$t('web.i18nFront.label.classicLott')"
        :placeholder="$t('system.i18nSystem.placeholder.input')"
        clearable colon required
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
      <van-field
        v-model="openForm.expiryTime"
        name="expiryTime"

        label-width="100px"

        :label="`${$t('web.i18nFront.label.expiryTime')}:`"
        :placeholder="$t('system.i18nSystem.placeholder.select')"
        :rules="[{ required: true, message: $t('system.i18nSystem.placeholder.select') }]"
        required is-link clearable readonly
        @click="showSelectTime = true"
      >
        <template #input>
          <span :class="{ active: expireInfo.day === 9999 }">{{ expireInfo.label }}</span>
        </template>
      </van-field>
      <van-field
        v-model="openForm.remark"
        name="remark"
        label-width="100px"
        :label="`${$t('system.i18nSystem.label.remark')}:`"
        :placeholder="$t('system.i18nSystem.label.remark')"
        clearable
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
      <span class="text-4">{{ $t("web.i18nFront.tips.linkOpen") }}</span>
    </van-divider>
    <p class="text-sm leading-200%">
      1. {{ $t("web.i18nFront.tips.linkOpen1") }}
    </p>
    <p class="text-sm leading-200%">
      2. {{ $t("web.i18nFront.tips.linkOpen2") }}
    </p>
  </div>
  <van-popup v-model:show="showSelectTime">
    <div class="date-box">
      <div class="date-head">
        {{ $t('web.i18nFront.label.expiryTime') }}
      </div>
      <van-radio-group v-model="expireInfo.day" @change="onSelectedTime">
        <van-cell-group v-for="(item, index) in expireTimeList" :key="index">
          <van-cell clickable @click="expireInfo.day = item.value">
            <template #title>
              <span class="custom-title" :class="{ active: item.value === 9999 }">{{ item.label }}</span>
            </template>
            <template #right-icon>
              <van-radio checked-color="var(--primary-color)" :name="item.value" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </div>
  </van-popup>
</template>

<style scoped>
.date-box {
  width: 280px;
  border-radius: 8px;
  overflow: hidden;
}
.active {
  color: var(--primary-color);
}
.date-head {
  height: 44px;
  line-height: 44px;
  font-size: 14px;
  text-align: center;
  background-color: var(--card-bg-color);
}
</style>
