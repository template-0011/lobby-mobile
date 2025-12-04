import useUserStore from '@/store/modules/user'

export interface BreadcrumbUser {
  userName: string
  userID: string
}

export function useBreadcrumb() {
  const userStore = useUserStore()
  let rootUser: BreadcrumbUser

  const breadcrumbUsers = ref<BreadcrumbUser[]>([])

  /**
   * 面包屑点击,并获取当前用户信息
   * @param index
   * @returns object
   */
  function clickToSwitchCrumb(index: number) {
    if (index + 1 === breadcrumbUsers.value.length) {
      return
    }
    const item = breadcrumbUsers.value[index]
    breadcrumbUsers.value = breadcrumbUsers.value.slice(0, index + 1)
    return item
  }

  function getRootUser() {
    return rootUser
  }

  onBeforeMount(() => {
    rootUser = {
      userID: userStore.userInfo?.userID || '',
      userName: userStore.userInfo?.userName || '',
    }
    breadcrumbUsers.value.push(rootUser)
  })

  return {
    breadcrumbUsers,
    getRootUser,
    clickToSwitchCrumb,
  }
}
