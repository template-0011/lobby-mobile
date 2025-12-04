import { createApp } from 'vue'
import { createHead } from '@unhead/vue'
import { setupI18n } from './i18n'
import { setupStore } from './store'
import App from '@/App.vue'
import router from '@/router'
import 'virtual:uno.css'
import SvgIcon from '@/04-kk-component-mobile/SvgIcon/index.vue'

// Vant 桌面端适配
import '@vant/touch-emulator'
// 本地SVG图标
import 'virtual:svg-icons-register'

import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import 'vant/es/image-preview/style'
import '@/styles/app.less'
import './handleHttpError'

const app = createApp(App)
const head = createHead()

app.use(head)
app.use(router)
setupStore(app)
setupI18n(app)

app.component('SvgIcon', SvgIcon)

app.mount('#app')
