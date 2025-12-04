<script setup lang="ts">
import { showConfirmDialog, showNotify } from 'vant'
import useUserStore from '@/store/modules/user'
import { subordinateHttp } from '@/01-kk-system/allHttp/userHall/team'

defineOptions({
  name: 'TransforMoney',
})

const props = defineProps({
  userData: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits<{
  onRefresh: [void]
}>()
const userStore = useUserStore()
const { t } = useI18n()

const modalVisible = defineModel({ required: true, default: false })
const balance = computed(() => userStore?.balanceInfo?.balance || 0)

const formData = ref({
  userID: '',
  userName: '',
  sedMoney: '',
  pwd: '',
  remark: '',
  balance: balance.value,
})
const loading = ref(false)

function opened() {
  formData.value.userID = props.userData.userID
  formData.value.userName = props.userData.userName
  formData.value.balance = balance.value
}

async function onSubmit() {
  const confirm = await showConfirmDialog({
    title: t('web.i18nFront.hint.confirmTrans'),
    message: `${t('web.i18nFront.hint.confirmTransInfo', { name: props.userData.userName, money: formData.value.sedMoney })}`,
    allowHtml: true,
  }).catch(() => null)

  if (!confirm) {
    return
  }
  const { walletType, currencyCode } = userStore.currentWalletInfo
  const params = {
    currencyCode,
    walletType,
    money: formData.value.sedMoney,
    subUserId: props.userData.userID,
  }
  loading.value = true
  const res = await subordinateHttp.transfor2Sub(params).catch(() => null)
  if (res?.code === '0') {
    showNotify({
      type: 'success',
      message: t('web.i18nFront.hint.transOk'),
    })
    modalVisible.value = false
    userStore.getUserBanlance()
    emit('onRefresh')
  }
  loading.value = false
  modalVisible.value = false
  resetForm()
}

function resetForm() {
  formData.value.sedMoney = ''
  formData.value.pwd = ''
  formData.value.remark = ''
  formData.value.balance = balance.value
}

function validateInputMoney(val: string) {
  if (!val) {
    return false
  }
  const num = Number(val)
  if (num <= 0) {
    return t('web.i18nFront.hint.inputNum')
  }
  else if (num > Number(balance.value)) {
    return t('web.i18nFront.hint.moreThBalance')
  }
  return true
}
</script>

<template>
  <van-action-sheet
    v-model:show="modalVisible"
    closeable
    close-icon="close"
    @opened="opened"
  >
    <div class="">
      <h3 class="py-3 text-center text-15px color-#fff">
        {{ $t('web.i18nFront.title.transforSub') }}
      </h3>
      <van-form @submit="onSubmit">
        <van-field
          v-model="formData.userName"
          label-width="8em"
          :label="$t('web.i18nFront.label.subAccount')"
          placeholder=""
          disabled
        />
        <van-field
          v-model="formData.balance"
          label-width="8em"
          readonly
          :label="$t('web.i18nFront.label.yourBalance')"
          placeholder=""
          disabled
        />
        <van-field
          v-model.number="formData.sedMoney"
          label-width="8em"
          colon
          autocomplete="off"
          :label="$t('web.i18nFront.label.rechargeM')"
          type="number"
          :placeholder="$t('system.i18nSystem.placeholder.input') "
          :rules="[{ required: true, validator: validateInputMoney, message: $t('system.i18nSystem.placeholder.input') }]"
        />
        <van-field
          v-model="formData.pwd"
          colon
          label-width="8em"
          autocomplete="off"
          type="password"
          :label="$t('web.i18nFront.label.mpwd')"
          :placeholder="$t('system.i18nSystem.placeholder.input') "
          :rules="[{ required: true, message: $t('system.i18nSystem.placeholder.input') }]"
        />
        <van-field
          v-model="formData.remark"
          colon
          label-width="8em"
          :label="$t('system.i18nSystem.label.remark')"
          :placeholder="$t('system.i18nSystem.placeholder.input') "
        />
        <div class="mb-8 mt-4 flex-center gap-5">
          <van-button class="!px-10" type="default" size="small" @click="resetForm">
            {{ $t('system.i18nSystem.opration.reset') }}
          </van-button>
          <van-button class="!px-10" type="danger" :loading="loading" size="small" native-type="submit" color="#f07355">
            {{ $t('system.i18nSystem.opration.confirm') }}
          </van-button>
        </div>
      </van-form>
    </div>
  </van-action-sheet>
</template>

<style lang="less" scoped></style>
