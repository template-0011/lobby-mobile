import { defineStore } from 'pinia'
import { outerGameHttp } from '@/01-kk-system/allHttp/userHall/games'
import { kkAuth } from '@/01-kk-system/allUtils/kkAuth'
import type {
  GameLineTypes,
} from '@/01-kk-system/middleware/fusionApi/game'
import {
  getAllLotteryInfoBy,
  getAllOuterSubGamesEntry,
  getAllSeriesLotteryInfoBy,
  getAvailableOuterGameList,
  getLotteryFullSeries,
} from '@/01-kk-system/middleware/fusionApi/game'
import { translateTextBy } from '@/utils/i18n'
import type { GameGroupParams } from '@/01-kk-system/allHttp/userHall/model/gameModels'
import type { TopMenuType } from '@/types/type'
import { getAllGroups, getValidOuterGameLine } from '@/01-kk-system/middleware/cacheHttp'
import { localImg } from '@/01-kk-system/allUtils/utils'
import { contentDicHttp } from '@/01-kk-system/allHttp/alldic'
import type { IObject } from '@/01-kk-system/allHttp/types/common'

function getLotterySeriesList(lottiInfo: Record<string, any>) {
  let classifyListFull: Record<string, any>[] = []
  for (const key in lottiInfo) {
    if (Object.hasOwnProperty.call(lottiInfo, key)) {
      const element = JSON.parse(JSON.stringify(lottiInfo[key]))
      classifyListFull = classifyListFull.concat(element)
    }
  }
  return classifyListFull
}

export const useGameStore = defineStore('game', () => {
  const chessGameList = ref<GameLineTypes[]>([]) // 1002
  const eGameList = ref<GameLineTypes[]>([]) // 1003
  const fishGameList = ref<GameLineTypes[]>([]) // 1004
  const liveGameList = ref<GameLineTypes[]>([]) // 1005
  const sportGameList = ref<GameLineTypes[]>([]) // 1006
  const fullCountrySeries = ref<Record<string, any>>()
  const allSubGameEntrance = ref<Record<string, any>>({})
  // const fullLotterys = ref<Record<string, any[]>>({});
  const currentEntrance = ref<Record<string, any>>({})
  const allGroups = ref<TopMenuType[]>([])
  const outerGamerList = ref<Record<string, any>[]>([])
  const allGameLines = ref<IObject>()

  /**
   * 获取全部可用的外部游戏线路
   */
  async function getAvailableOuterGamesLine() {
    if (allGameLines.value && Object.keys(allGameLines.value).length > 0) {
      return allGameLines.value
    }
    const allGamesLine = await getValidOuterGameLine().catch(() => null)
    allGameLines.value = allGamesLine as unknown as IObject || {}
    return allGameLines.value
  }

  /**
   * 获取全部可用的外部游戏对象
   */
  async function getAvailableOuterGames() {
    const allGames = await getAvailableOuterGameList().catch(() => null)
    if (allGames) {
      chessGameList.value = allGames.chess
      eGameList.value = allGames.egame
      fishGameList.value = allGames.fish
      liveGameList.value = allGames.realbet
      sportGameList.value = allGames.sports
    }
    return allGames || {}
  }
  /**
   * 获取全部可用的外部游戏对象
   */
  async function getAvailableOuterSubGamesEntry() {
    if (Object.keys(allSubGameEntrance.value).length > 0) {
      return allSubGameEntrance.value
    }
    const allGames = await getAllOuterSubGamesEntry().catch(() => null)
    allSubGameEntrance.value = allGames || {}
    // console.log('--getAvailableOuterSubGamesEntry--', allSubGameEntrance.value)
    return allGames || {}
  }
  /**
   * 获取全部国家菜系及对应菜种 list: 合并为列表的菜系， dic: 按照国家分类的菜系对象
   */
  async function getFullSeries(type: 'list' | 'dic' = 'list') {
    if (fullCountrySeries.value) {
      return type === 'dic'
        ? fullCountrySeries.value
        : getLotterySeriesList(fullCountrySeries.value)
    }
    const fullSeries = await getLotteryFullSeries()
    fullCountrySeries.value = fullSeries
    return type === 'dic' ? fullSeries : getLotterySeriesList(fullSeries)
  }
  /**
   * 获取对应菜系下面的菜种列表
   */
  async function getGamesListBy(lotteryCategory: Record<string, any>) {
    const list = await getAllLotteryInfoBy(lotteryCategory).catch(() => [])
    return list || []
  }
  /**
   * 获取对应菜系下面的菜种列表
   */
  async function getAllSeriesAndGamesList(needLogo: boolean = false) {
    const list = await getAllSeriesLotteryInfoBy(needLogo).catch(() => [])
    return list || []
  }
  /**
   * 登陆外部游戏
   */
  function loginOuterGame(
    info: Record<string, any>,
  ): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      const userInfo = kkAuth.getUserInfo()
      if (userInfo && userInfo.userType === '2' && !info.isSupportDemo) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return reject({ code: 1001, msg: translateTextBy('web.i18nFront.hint.tryUserForbidden') })
      }
      const params = {
        contentCategory: info.contentCategory,
        lobbyCode: info.lobbyCode,
        outerGamerAgentCode: info.outerGamerAgentCode,
        outerGamerID: info.outerGamerID,
        sourceType: 3,
      }
      outerGameHttp
        .login(params)
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * 登陆外部子游戏
   */
  function loginOuterSubGame(
    info: Record<string, any>,
  ): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      const userInfo = kkAuth.getUserInfo()
      if (userInfo && userInfo.userType === '2' && !info.isSupportDemo) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return reject({ code: 1001, msg: translateTextBy('web.i18nFront.hint.tryUserForbidden') })
      }
      const params = {
        contentCategory: info.contentCategory,
        subgameCode: info.subgameCode,
        outerGamerAgentCode: info.outerGamerAgentCode,
        outerGamerID: info.outerGamerID,
        sourceType: 2,
      }
      outerGameHttp
        .loginSubGame(params)
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  /**
   * 获取全部分组
   */
  async function fetchAllGroups(
    params?: GameGroupParams,
  ): Promise<Record<string, any>[]> {
    if (allGroups.value && allGroups.value.length > 0) {
      return allGroups.value
    }
    const list = await getAllGroups(params)
    const groupList = (list as unknown as TopMenuType[] || []).map((group: any) => {
      return {
        id: group.groupID,
        title: group.groupName,
        name: group.groupID,
        route: `/group/${group.groupID}`,
        routeName: `${group.groupID}`,
        css: '',
        image: localImg('images/icon_hot.png'),
        isGrooup: true,
        icon: 'icon_game_hot',
        data: group.children,
        type: 'hot',
      }
    })
    allGroups.value = groupList
    return groupList
  }

  const getOuterGamerList = async () => {
    try {
      if (outerGamerList.value && outerGamerList.value.length > 0) {
        return outerGamerList.value
      }
      const res = await contentDicHttp.getSysOuterGamer()
      const { data } = res || {}
      outerGamerList.value = data || []
      return data || []
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

  const getOuterGamerByID = async (outerGamerID: string) => {
    const gamerList = await getOuterGamerList()
    const target = gamerList.find((gamer: Record<string, any>) => gamer.outerGamerID === outerGamerID)
    return target || {}
  }

  return {
    chessGameList,
    eGameList,
    fishGameList,
    liveGameList,
    sportGameList,
    allSubGameEntrance,
    currentEntrance,
    allGroups,
    getAvailableOuterGames,
    getFullSeries,
    getGamesListBy,
    loginOuterGame,
    loginOuterSubGame,
    getAllSeriesAndGamesList,
    getAvailableOuterSubGamesEntry,
    fetchAllGroups,
    getOuterGamerByID,
    getOuterGamerList,
    getAvailableOuterGamesLine,
  }
})
