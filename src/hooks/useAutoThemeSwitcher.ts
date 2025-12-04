import type { DesignSettingStore } from '@/store/modules/designSetting'

export default function useAutoThemeSwitcher(appStore: DesignSettingStore) {
  const handleAttributeChange = () => {
    const rootElement = document.documentElement
    if (rootElement.classList.contains('dark'))
      appStore.setDarkMode('dark')
    else
      appStore.setDarkMode('light')
  }

  const observerOptions = {
    attributes: true,
    attributeFilter: ['class'],
  }

  const observer = new MutationObserver(handleAttributeChange)

  const targetElement = document.querySelector('html')

  const initializeThemeSwitcher = () => {
    observer.observe(targetElement, observerOptions)
  }

  return { initializeThemeSwitcher }
}
