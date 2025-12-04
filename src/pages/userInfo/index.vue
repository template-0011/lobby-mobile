<script setup lang="ts">
import { showNotify } from 'vant'
import ResetLoginNickName from './components/ResetLoginNickName.vue'
import ResetLoginPwd from './components/ResetLoginPwd.vue'
import ResetRealName from './components/ResetRealName.vue'
import IpListModal from './components/IpListModal.vue'
import FundPwd from './components/FundPwd.vue'
import { userTypes } from '@/01-kk-system/allDefine/enum/frontend/user'
import { userHttp } from '@/01-kk-system/allHttp/userHall/user'
import useUserStore from '@/store/modules/user'
import { translateTextBy } from '@/utils/i18n'

defineOptions({
  name: 'UserInfo',
})

const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()

const showLoginPwd = ref(false)
const showFundPwd = ref(false)
const pwdLoading = ref(false)
const showNickNamePwd = ref(false)
const hasFundPwd = ref(false)
const realName = ref('')
const realNameLoading = ref(false)
const showRealName = ref(false)
const showIpList = ref(false)

const userTypeTxt = computed(() => {
  const i18nTxt = userTypes.getDes(userStore.userInfo.userType || '')
  return i18nTxt ? t(i18nTxt) : '--'
})

async function checkFundPwdExist() {
  const res = await userHttp.checkFundpassword().catch(() => null)
  const { code, data } = res || {}
  console.log(code, data)
  hasFundPwd.value = data as unknown as boolean
  return hasFundPwd.value
}

async function onShowPwdModal() {
  pwdLoading.value = true
  await checkFundPwdExist()
  pwdLoading.value = false
  showFundPwd.value = true
}

async function onShowRealNameModal() {
  realNameLoading.value = true
  const hasPwd = await checkFundPwdExist()
  realNameLoading.value = false
  if (hasPwd) {
    showRealName.value = true
  }
  else {
    showNotify({
      message: translateTextBy('web.i18nFront.hint.confirmFundPwd'),
      type: 'warning',
    })
  }
}

async function checkRealName() {
  const res = await userHttp.getRealinfo()
  const { code, data } = res || {}
  if (code === '0') {
    realName.value = data?.realName
  }
}

onBeforeMount(() => {
  checkFundPwdExist()
  checkRealName()
})
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden">
    <van-nav-bar
      :title="$t('web.i18nFront.label.myPofile')"
      left-arrow
      @click-left="router.back"
    />
    <div class="flex-1 overflow-auto">
      <div class="card color-white">
        <div class="basic-info-item">
          <span> {{ `${$t("web.i18nFront.label.account")}：` }}</span>
          <span>{{ userStore.userInfo.userName }}</span>
        </div>
        <div class="basic-info-item">
          <span>{{ `${$t("web.i18nFront.label.nickname")}：` }}</span>
          <div class="flex items-center justify-end gap-4">
            <span>{{ userStore.userInfo.nickName }}</span>
            <button class="modify-btn" @click="showNickNamePwd = true">
              {{ $t("system.i18nSystem.opration.edit") }}
            </button>
          </div>
        </div>
        <div class="basic-info-item text-overflow">
          <span>{{ `${$t("web.i18nFront.label.memberType")}：` }}</span>
          {{ userTypeTxt }}
        </div>
        <div class="basic-info-item text-overflow">
          <span>
            {{ `${$t("web.i18nFront.label.availableMemory")}：` }}
          </span>
          {{ userStore.balanceInfo?.balance || "0.00" }}
        </div>
        <div class="basic-info-item">
          <span>
            {{ `${$t("web.i18nFront.label.lastLoginTime")}：` }}
          </span>
          <span>{{ userStore.userInfo.lastLoginDate }}</span>
        </div>
        <div class="basic-info-item text-overflow">
          <span>{{ `${$t("web.i18nFront.label.lastLoginIp")}：` }}</span>
          <div class="flex items-center justify-end gap-4">
            <span>{{ userStore.userInfo.lastLoginIP }}</span>
            <button class="modify-btn" @click="() => (showIpList = true)">
              {{ $t("web.i18nFront.label.ipHistory") }}
            </button>
          </div>
        </div>
      </div>
      <div class="mt-4 px-3">
        <div class="w-full">
          <ul class="account-safety-box">
            <li
              class="safety-login border-b-3px border-b-[#8b85fa]"
            >
              <div class="txt">
                <span class="title">{{ $t("web.i18nFront.label.loginPwd") }}</span>
                <span class="content">
                  {{ $t("web.i18nFront.hint.loginPwdDesc") }}
                </span>
              </div>
              <van-button
                class="btn"
                size="small"
                @click="showLoginPwd = true"
              >
                {{ $t("system.i18nSystem.opration.edit") }}
              </van-button>
            </li>
            <li class="safety-login border-b-3px border-b-[#d58bf4]">
              <div class="txt">
                <div class="title items-center gap-1 !flex">
                  <span>{{ $t("web.i18nFront.label.moneyPwd") }}</span>
                </div>
                <span class="content">
                  {{ $t("web.i18nFront.hint.moneyPwdDesc") }}
                </span>
              </div>
              <van-button
                class="text-center btn"
                size="small"
                :loading="pwdLoading"
                @click="onShowPwdModal"
              >
                {{
                  hasFundPwd
                    ? $t("system.i18nSystem.label.edit")
                    : $t("system.i18nSystem.label.unSet")
                }}
              </van-button>
            </li>
            <li class="safety-login border-b-3px border-b-[#d58bf4]">
              <div class="txt">
                <div class="title items-center gap-1 !flex">
                  <span>{{ $t("web.i18nFront.label.realname") }}</span>
                </div>
                <span class="content">
                  {{ $t("web.i18nFront.hint.realNameHint") }}
                </span>
              </div>
              <van-button
                class="text-center btn"
                size="small"
                :loading="realNameLoading"
                @click="onShowRealNameModal"
              >
                {{
                  realName
                    ? $t("system.i18nSystem.label.edit")
                    : $t("system.i18nSystem.label.unSet")
                }}
              </van-button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <ResetLoginNickName v-model="showNickNamePwd" />
    <ResetLoginPwd v-model="showLoginPwd" />
    <ResetRealName v-model="showRealName" :real-name="realName" @refresh="checkRealName" />
    <FundPwd v-model="showFundPwd" :has-fund-pwd="hasFundPwd" @on-refresh-pwd="checkFundPwdExist" />
    <IpListModal v-model="showIpList" />
  </div>
</template>

<style lang="less" scoped>
.basic-info-item {
  border-bottom: 1px solid #d3d1d126;
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 400;
  padding: 0 12px;
}
.basic-info-item .modify-btn {
  border-radius: 3px;
  line-height: 25px;
  text-align: center;
  cursor: pointer;
  background: #43434d;
  border: none;
  color: #fff;
  padding: 0 10px;
  right: 10px;
  transition: 0.25s linear;
  font-size: 12px;
}
.account-safety-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: -12px 0 0;
  padding: 0;
}
.account-safety-box li {
  list-style: none;
  position: relative;
  padding: 16px;
  margin-top: 12px;
  width: 455px;
  height: 78px;
  box-shadow: inset 0 0 16px hsla(0, 0%, 100%, 0.11);
  background-image: linear-gradient(104deg, #1e283f -22%, rgba(20, 27, 46, 0.6) 91%);
  border-radius: 10px;
  line-height: 22px;
}
.account-safety-box li .title {
  margin-bottom: 4px;
  padding: 0;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  display: block;
  color: #ffffff;
}
.account-safety-box li .content {
  font-size: 12px;
  color: var(--kk-card-content-color);
}
.account-safety-box li .btn {
  position: absolute;
  right: 12px;
  top: 8px;
  padding: 0 5px;
  min-width: 46px;
  height: 24px;
  line-height: 23px;
  border: none;
  color: #fff;
  font-size: 12px;
}
.account-safety-box .unset-btn {
  --el-button-bg-color: #f54a4a;
  --el-button-hover-bg-color: #f54a4a;
}
</style>
