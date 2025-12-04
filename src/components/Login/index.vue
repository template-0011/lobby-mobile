<script setup lang="ts">
import { platformHttp } from '@/01-kk-system/allHttp/userHall/platform'
import { getDomainName } from '@/01-kk-system/allUtils/utils'
import { getUserLocalInfo, saveUserLocalInfo } from '@/04-kk-component-mobile/hooks/commonUtil'
import useAppStore from '@/store/modules/app'
import useUserStore from '@/store/modules/user'

defineOptions({
  name: 'LoginCp',
})

const userStore = useUserStore()
const appStore = useAppStore()

const visible = defineModel<boolean>({ required: true })

const fromData = ref({
  userName: '',
  password: '',
})
const loading = ref(false)
const showPwd = ref(false)
const rememberPwd = ref(false)
const showTryGames = ref(false)
const regesterLink = ref('')
const showInviteBtn = ref(false)

watch(() => visible.value, (val) => {
  if (val) {
    getLocalLoginInfo()
    // 配置查询
    handleDiffConfig()
    // 查询注册链接
    fetchInviteUrl()
  }
})

async function fetchInviteUrl() {
  const res = await platformHttp.inviteUrl()
  if (res?.code === '0') {
    const list = res?.data ?? []
    const currentDomainName = getDomainName()
    const target = list.find((item) => {
      const url = item.invitationURL ?? ''
      if (url && url.includes(currentDomainName)) {
        return url.startsWith('http')
      }
      return undefined
    })
    if (target) {
      regesterLink.value = target.invitationURL
    }
    else {
      regesterLink.value = list[0]?.invitationURL ?? ''
    }
  }
}

async function handleDiffConfig() {
  const diffConfig = await appStore.getDiffConfig()
  if (diffConfig?.SHOW_BUTTON_SHIWAN) {
    showTryGames.value = diffConfig?.SHOW_BUTTON_SHIWAN.value === '1'
  }
  else {
    showTryGames.value = true
  }
  if (diffConfig?.SHOW_BUTTON_ZHUCE) {
    showInviteBtn.value = diffConfig?.SHOW_BUTTON_ZHUCE.value === '1'
  }
  else {
    showInviteBtn.value = false
  }
}

function handleClose() {
  userStore.setLoginModalState(false)
}

function beforeClose() {
  userStore.setLoginModalState(false)
  fromData.value = {
    userName: '',
    password: '',
  }
}

function getLocalLoginInfo() {
  const localInfo = getUserLocalInfo()
  fromData.value.userName = localInfo?.userName ?? ''
  fromData.value.password = localInfo?.password ?? ''
  rememberPwd.value = !!localInfo?.userName
}

// 登录
async function onSubmit() {
  loading.value = true
  userStore
    .login(fromData.value)
    .then(() => {
      handleClose()
      // 若记住密码，则本地存储, 否则删除本地信息
      if (rememberPwd.value) {
        saveUserLocalInfo(fromData.value)
      }
      else {
        saveUserLocalInfo(null)
      }
      setTimeout(() => {
        // eventEmitter.emit(REFRESH_AFTER_LOGIN)
        window.location.reload()
      }, 1000)
    })
    .finally(() => {
      loading.value = false
    })
}

async function onVisitorLogin() {
  try {
    loading.value = true
    await userStore.guestLogin()
    handleClose()
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }
  catch (error) {
    console.error(error)
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <van-dialog v-model:show="visible" class="login-container" show-cancel-button :close-on-click-overlay="true" :before-close="beforeClose">
    <div class="h-8 flex justify-end pr-3 pt-3">
      <van-icon name="close" @click="handleClose" />
    </div>
    <van-form @submit="onSubmit">
      <h2 class="mb-5 text-center text-5">
        {{ $t('system.i18nSystem.opration.login') }}
      </h2>
      <van-cell-group inset class="border border-[var(--text-gray-color)] border-solid">
        <van-field
          v-model="fromData.userName"
          name="userName"
          autocomplete="off"
          left-icon="user"
          :placeholder="$t('system.i18nSystem.label.userName')"
          clearable
          :rules="[{ required: true, message: $t('system.i18nSystem.hint.needUseName') }]"
        />
      </van-cell-group>
      <van-cell-group inset icon="location-o" class="mt-4 border border-[var(--text-gray-color)] border-solid">
        <van-field
          v-model="fromData.password"
          :type="showPwd ? 'text' : 'password'"
          name="password"
          autocomplete="off"
          left-icon="lock"
          clearable
          :placeholder="$t('system.i18nSystem.label.password')"
          :right-icon="showPwd ? 'closed-eye' : 'eye'"
          :rules="[{ required: true, message: $t('system.i18nSystem.message.password_required') }]"
          @click-right-icon="showPwd = !showPwd"
        />
      </van-cell-group>
      <div class="flex px-4 pt-3 text-sm">
        <van-checkbox v-model="rememberPwd" icon-size="14" class="flex-1">
          <span>{{ $t('web.i18nFront.label.keepPwd') }}</span>
        </van-checkbox>
      </div>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit" :loading="loading">
          {{ $t("system.i18nSystem.opration.login") }}
        </van-button>
        <van-button v-if="showTryGames" class="mt-3" round block :loading="loading" @click="onVisitorLogin">
          {{ $t("web.i18nFront.label.tryPlay") }}
        </van-button>
        <van-button v-if="showInviteBtn && regesterLink" class="mt-3" round block :loading="loading" :url="regesterLink">
          {{ $t("system.i18nSystem.opration.register") }}
        </van-button>
      </div>
    </van-form>
    <template #footer />
  </van-dialog>
  <!-- <van-popup
    v-model:show="showRegist"
    teleport="body"
    position="bottom"
    safe-area-inset-bottom
  >
    <div class="my-3">
      <van-cell
        v-for="(url, i) in registerList"
        :key="`${i}-register`"
        :url="url"
      >
        <template #title>
          <a class="h-full w-full text-[#1989fa]" target="_blank" :href="url">{{ $t("web.i18nFront.label.registLink") + (i + 1) }}</a>
        </template>
      </van-cell>
    </div>
  </van-popup> -->
</template>

<style lang="less" scoped>

</style>
