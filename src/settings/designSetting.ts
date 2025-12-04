// app theme preset color

export interface DesignSettingState {
  // 系统主题
  darkMode: 'light' | 'dark'
  // 系统风格
  appTheme: string
}

const setting: DesignSettingState = {
  // 深色主题
  darkMode: 'light',
  // 系统主题色
  appTheme: '#5d9dfe',
}

export default setting
