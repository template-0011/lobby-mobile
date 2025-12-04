import { showNotify } from 'vant'
import { eventEmitter } from '@/01-kk-system/allUtils/eventEmitter'
import {
  HTTP_ERROR,
  TOKEN_AUTH_FAIL,
} from '@/01-kk-system/allDefine/common/const'
import { useUserStoreHook } from '@/store/modules/user'

// token fail
eventEmitter.on(TOKEN_AUTH_FAIL, (data: any) => {
  // ElMessage.closeAll()
  // showMessage(data)
  console.log('TOKEN_AUTH_FAIL', data)
  const userStore = useUserStoreHook()
  userStore.resetToken()
  userStore.setLoginModalState(true)
})

// http error
eventEmitter.on(HTTP_ERROR, (data: any) => {
  // ElMessage.closeAll()
  showMessage(data)
})

function showMessage(data: any) {
  showNotify({
    type: 'danger',
    duration: 3000,
    message: data?.message || 'error',
  })
}
