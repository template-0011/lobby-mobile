<script setup lang="ts">
import { showLoadingToast, showNotify } from 'vant'
import TeamManageCell from './components/TeamManageCell/index.vue'
import TransforMoney from './components/TransforMoney/index.vue'
import type { IObject } from '@/01-kk-system/allHttp/types/common'
import { teamHttp } from '@/01-kk-system/allHttp/userHall/team'
import { type BreadcrumbUser, useBreadcrumb } from '@/components/CustomBreadcrumb/useBreadcrumb'
import useUserStore from '@/store/modules/user'

defineOptions({
  name: 'TeamManage',
})

const { breadcrumbUsers, getRootUser } = useBreadcrumb()
const { t } = useI18n()
const userStore = useUserStore()

const loading = ref(false)
const refreshing = ref(false)
const showTransfor = ref(false)
const list = ref<IObject[]>([])
const currenRow = ref<IObject>()
const pagination = ref({
  pageSize: 10,
  totalPage: 0,
  currentPage: 1,
})

// 面包屑点击
function onClickCrumb(currentUser: BreadcrumbUser) {
  if (currentUser) {
    onRefresh(currentUser.userID)
  }
}

// const canSubSign = computed(
//   () => Number(userStore.myContractSalary[0] || 0) === 1,
// )

async function fetchTeamUserList(superiorID: string) {
  if (refreshing.value) {
    refreshing.value = false
  }
  const toast = showLoadingToast({
    duration: 0,
    forbidClick: true,
  })
  const params = {
    superiorID,
    current: pagination.value.currentPage,
    size: pagination.value.pageSize,
  }
  loading.value = true
  const res = await teamHttp.teamUserPage(params).catch(() => null)
  const { code, data } = res || {}
  if (code === '0') {
    const { recordList, pages } = data || {}
    list.value = recordList || []
    pagination.value.totalPage = Number(pages || 10)
  }
  loading.value = false
  toast.close()
}

function pageChange() {
  if (loading.value) {
    return
  }
  if (breadcrumbUsers.value.length <= 0) {
    showNotify({
      type: 'success',
      message: t('web.i18nFront.hint.userError'),
    })
    return
  }
  fetchTeamUserList(breadcrumbUsers.value[0].userID)
}

function getUserList(row: IObject) {
  if (loading.value) {
    return
  }
  const { userID, userName } = row
  breadcrumbUsers.value.push({
    userID,
    userName,
  })
  onRefresh(userID)
}

// transfor
function transforTo(row: IObject) {
  currenRow.value = row
  showTransfor.value = true
}

function onRefresh(superiorID?: string) {
  pagination.value.currentPage = 1
  loading.value = true
  if (!superiorID) {
    const rootUser = getRootUser()
    fetchTeamUserList(rootUser.userID)
  }
  else {
    fetchTeamUserList(superiorID)
  }
}

onBeforeMount(() => {
  onRefresh()
  // get my contract salary
  userStore.getMyContractSalary()
  // get balance
  userStore.getUserBanlance()
})
</script>

<template>
  <Container :title="$t('web.i18nFront.label.teamM')">
    <div class="h-full flex flex-col">
      <div>
        <CustomBreadcrumb v-model="breadcrumbUsers" @on-click="onClickCrumb" />
      </div>
      <div class="flex-1 overflow-auto">
        <van-pull-refresh v-model="refreshing" class="h-full !overflow-y-scroll" @refresh="onRefresh">
          <van-list
            v-model:loading="loading"
            :finished="true"
          >
            <template v-if="list && list.length > 0">
              <TeamManageCell
                v-for="(data, i) in list"
                :key="i"
                :item-data="data"
                @on-sub-user="getUserList"
                @on-transfor="transforTo"
              />
            </template>
            <template v-else>
              <div class="h-full flex flex-col justify-center">
                <van-empty image-size="100" :description="$t('web.i18nFront.hint.noData')" />
              </div>
            </template>
            <div class="h-10" />
          </van-list>
        </van-pull-refresh>
      </div>
      <van-pagination v-model="pagination.currentPage" :page-count="pagination.totalPage" mode="simple" @change="pageChange" />
      <TransforMoney v-model="showTransfor" :user-data="currenRow" />
    </div>
  </Container>
</template>

<style lang="less" scoped>

</style>
