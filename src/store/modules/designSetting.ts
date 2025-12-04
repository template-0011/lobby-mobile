import { defineStore } from 'pinia'
import type { ConfigProviderTheme } from 'vant'
import { store } from '@/store'
import designSetting from '@/settings/designSetting'

export interface DesignSettingStore {
  setDarkMode: (val: ConfigProviderTheme) => void
}

const prefersDark
= window.matchMedia
&& window.matchMedia('(prefers-color-scheme: dark)').matches

export const useDesignSettingStore = defineStore('designSetting', () => {
  const darkMode = ref<'light' | 'dark'>(prefersDark ? 'dark' : 'light')
  const appTheme = ref<string>(designSetting.appTheme)

  const setDarkMode = (mode: 'light' | 'dark'): void => {
    darkMode.value = mode
  }

  const setAppTheme = (theme: string): void => {
    appTheme.value = theme
  }

  return {
    darkMode,
    appTheme,
    setDarkMode,
    setAppTheme,
  }
}, {
  persist: {
    key: 'DESIGN-SETTING',
    storage: localStorage,
  },
})

// Need to be used outside the setup
export function useDesignSettingWithOut() {
  return useDesignSettingStore(store)
}
