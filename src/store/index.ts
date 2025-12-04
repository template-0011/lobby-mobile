import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import type { App } from 'vue'

const store = createPinia()
store.use(createPersistedState({
  key: id => `__kk_ps__${id}`,
}))
// 全局注册 store
export function setupStore(app: App<Element>) {
  app.use(store)
}
export { store }
// export default store
