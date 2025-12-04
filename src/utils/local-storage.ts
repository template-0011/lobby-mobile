import store from 'store'
import expirePlugin from 'store/plugins/expire'

// plugin usage:
store.addPlugin(expirePlugin)

export function setItemWithExpire(key: string, value: any, expire: number = 0) {
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
  store.set(key, value, new Date().getTime() + expire)
}

export { store as localStorage }

export default store
