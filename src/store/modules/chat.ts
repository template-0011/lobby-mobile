import { defineStore } from 'pinia'
import { showToast } from 'vant'
import { store } from '@/store'
import { translateTextBy } from '@/utils/i18n'
import { type ContactInfo, useKKTalk } from '@/04-kk-component-mobile/hooks/useKKTalk'

// setup
export const useChatStore = defineStore('chat', () => {
  const { loadChat: loadKKTalkChat, openChat: openKKTalkChat, setCustomData: setKKTalkCustomData } = useKKTalk()

  /**
   * 加载chat
   * @param hide
   * @param chatCustomUrl
   */
  async function loadChat(hide?: boolean, chatCustomUrl?: string) {
    loadKKTalkChat(hide, chatCustomUrl)
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
    setKKTalkCustomData({
      name,
      email,
      phone,
      description,
      userID,
    })
  }
  /**
   * 设置客户信息
   * @param data
   */
  function setCustomData(data: ContactInfo) {
    setKKTalkCustomData(data)
  }
  /**
   * 打开客服
   */
  function openChat() {
    if (window.Tawk_API && window.Tawk_API.toggle) {
      openKKTalkChat()
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
