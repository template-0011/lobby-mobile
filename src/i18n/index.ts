// eslint-disable-next-line ts/ban-ts-comment
// @ts-nocheck
import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import merge from 'lodash-es/merge'
import { CURRENT_LANGUAGE } from '@/01-kk-system/allDefine/common/const'
import { enumSupportLanguage } from '@/01-kk-system/allDefine/common/support'

const messages = {}

// get all language keys
const allLangCodes = enumSupportLanguage.getAllCodes()

console.log('--codes--', allLangCodes)

// get all language sources
export function importAll(componentFiles: Record<string, unknown>) {
  const componentFilesEntries = Object.entries(componentFiles)
  componentFilesEntries.forEach(([componentPath, moduleImport]) => {
    const langKeyFromFile: string | undefined = componentPath
      .split('/')
      .slice(-2)[0]
    if (allLangCodes.includes(langKeyFromFile)) {
      const langContent = moduleImport.default
      const currentContent = messages[langKeyFromFile]
      if (currentContent) {
        merge(currentContent, langContent)
      }
      else {
        messages[langKeyFromFile] = langContent
      }
    }
  })
}

importAll(import.meta.glob('@/02-kk-i18n-system/system/**/*.js', { eager: true })) // 全量导入system的多语言文件
importAll(
  import.meta.glob('@/02-kk-i18n-admin/webUser/**/*.js', { eager: true }),
) // 根据自己的项目导入对应项目多语言的目录下的全量文件

console.log('--messages--', messages)

export function getLanguage() {
  const chooseLanguage = localStorage.getItem(CURRENT_LANGUAGE)
  if (chooseLanguage) {
    return chooseLanguage
  }

  const language = (
    window.navigator.language || window.navigator.browserLanguage
  ).toLowerCase()
  const locales = Object.keys(messages)
  if (locales.includes(language)) {
    return locale
  }
  // return 'en'
  return 'zh_CN'
}

const i18n = createI18n({
  legacy: false,
  locale: getLanguage(),
  messages,
  globalInjection: true,
})

export function switchlanguage(lang: any) {
  localStorage.setItem(CURRENT_LANGUAGE, lang)
  // eslint-disable-next-line ts/no-unused-expressions
  i18n && (i18n.global.locale = lang)
}

export function setupI18n(app: App<Element>) {
  app.use(i18n)
}

export default i18n
