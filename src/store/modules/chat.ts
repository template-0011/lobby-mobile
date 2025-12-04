import { defineStore } from 'pinia'
import { showToast } from 'vant'
import { store } from '@/store'
import { getLanguage } from '@/i18n'
import { kkAuth } from '@/01-kk-system/allUtils/kkAuth'
import { platformHttp } from '@/01-kk-system/allHttp/userHall/platform'
import { translateTextBy } from '@/utils/i18n'

interface ContactInfo {
  name?: string
  email?: string
  phone?: string
  description?: string
  userID?: string
}

// setup
export const useChatStore = defineStore('chat', () => {
  // const chatUrl = "//code.jivosite.com/widget/hqVvZCsJiG";
  const chatBaseUrl = '//code.jivosite.com/widget/'
  const scriptID = 'JIVOChat-Script'

  let chatLoaded = false
  let chatConfig: Record<string, any> = {}

  /**
   * 加载chat
   * @param chatCustomUrl
   */
  async function loadChat(chatCustomUrl?: string) {
    if (chatLoaded) {
      return
    }
    const res = await platformHttp.getChatConfig()
    const { data } = res || {}
    if (data) {
      chatConfig = data
    }
    removeScript()
    if (!chatConfig.jivochatID) {
      return
    }
    let url = chatCustomUrl || `${chatBaseUrl}${chatConfig.jivochatID}`
    url = url.includes('//') ? url : `//${url}`
    const head = document.getElementsByTagName('head')[0]
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.defer = true
    script.id = scriptID
    const lang = getLanguage()
    script.src = `${url}?locale=${lang}`
    script.onload = () => {
      chatLoaded = true
    }
    head.appendChild(script)
  }
  /**
   * 移除chat脚本
   */
  function removeScript() {
    const script = document.getElementById(scriptID)
    const ukefu = document.getElementById('jivo-iframe-container')
    // eslint-disable-next-line ts/no-unused-expressions
    script && document.head.removeChild(script)
    // eslint-disable-next-line ts/no-unused-expressions
    ukefu && document.body.removeChild(ukefu)
  }
  /**
   * 配置信息
   * @params name
   * @params email
   * @params phone
   * @params description
   */
  function setContactInfo({
    name = '',
    email = '',
    phone = '',
    description = '',
    userID = '',
  }: ContactInfo) {
    if ((window as any).jivo_api) {
      (window as any).jivo_api.setContactInfo({
        name,
        email,
        phone,
        description,
        userID,
      })
    }
  }
  /**
   * 设置客户信息
   * @param data
   */
  function setCustomData(data: any[]) {
    if ((window as any).jivo_api) {
      (window as any).jivo_api.setCustomData(data)
    }
  }
  /**
   * 打开客服
   */
  function openChat() {
    const userInfo = kkAuth.getUserInfo()
    const {
      userName = '',
      nickName = '',
      platformID = '',
      userID = '',
    } = userInfo || {}
    setContactInfo({ name: nickName })
    setCustomData([
      {
        title: '用户名：',
        content: userName,
      },
      {
        title: '用户ID',
        content: userID,
      },
      {
        title: '平台ID',
        content: platformID,
      },
    ])
    if ((window as any)?.jivo_api?.open) {
      (window as any).jivo_api.open()
    }
    else {
      showToast(translateTextBy('web.i18nFront.hint.serverNotReady'))
    }
  }

  return {
    loadChat,
    setContactInfo,
    openChat,
    setCustomData,
  }
})

// 手动提供给 useStore() 函数 pinia 实例
export function useChatStoreHook() {
  return useChatStore(store)
}
