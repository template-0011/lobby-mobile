import { computed } from 'vue'
import { useDesignSettingStore } from '@/store/modules/designSetting'

export function useDesignSetting() {
  const designStore = useDesignSettingStore()

  const isDark = computed(() => designStore.darkMode === 'dark')

  const getAppTheme = computed(() => designStore.appTheme)

  return {
    isDark,
    getAppTheme,
  }
}
