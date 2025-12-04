// eslint-disable-next-line ts/ban-ts-comment
// @ts-nocheck
import i18n from '@/i18n/index'

export function translateRouteTitle(title: any) {
  // 判断是否存在国际化配置，如果没有原生返回
  const hasKey = i18n.global.te(title)
  if (hasKey) {
    const translatedTitle = i18n.global.t(title)
    return translatedTitle
  }
  return title
}
export function translateTextBy(text: any) {
  // 判断是否存在国际化配置，如果没有原生返回
  const hasKey = i18n.global.te(text)
  if (hasKey) {
    const translatedTitle = i18n.global.t(text)
    return translatedTitle
  }
  return text
}
/**
 * 导入单个目录的多语种，如UI库的全部多语言文件，返回多语言对象
 * @param componentFiles
 */
export function importOneComponentLanguage(
  componentFiles: Record<string, unknown>,
) {
  const componentFilesEntries = Object.entries(componentFiles)
  const language = {}
  componentFilesEntries.forEach(([componentPath, moduleImport]) => {
    const langKey: string | undefined = componentPath.split('/').slice(-2)[0]
    const langContent = moduleImport.default
    language[langKey] = langContent
  })
  return language
}
