import { defineStore } from 'pinia'
import { LOCAL_FAVORITE_GAMES } from '@/01-kk-system/allDefine/common/const'
import type { IObject } from '@/01-kk-system/allHttp/types/common'

export const useGameCollectionStore = defineStore('gameCollection', () => {
  const favoriteGames = ref<IObject[]>([])
  const lotteryFavoriteIds = ref<string[]>([])
  const outerFavoriteIds = ref<string[]>([])

  const getLotteryKey = (item: IObject) => {
    return `${item.lottoClassify}-${item.lottoClassifyCountry}-${item.lottoID}`
  }

  const getOuterKey = (item: IObject) => {
    return `${item.subgameCode}-${item.outerGamerID}-${item.outerGamerAgentCode}-${item.contentCategory}`
  }

  const getLocalCollections = () => {
    const locals = localStorage.getItem(LOCAL_FAVORITE_GAMES)
    if (locals) {
      favoriteGames.value = JSON.parse(locals)
    }
  }

  const setLocalCollections = (game: any) => {
    if (favoriteGames.value.length <= 0) {
      getLocalCollections()
    }

    const isIn = favoriteGames.value.some((item) => {
      if (item.lottoClassify) {
        return getLotteryKey(item) === getLotteryKey(game)
      }
      if (item.contentCategory) {
        return getOuterKey(item) === getOuterKey(game)
      }
      return false
    })
    let newList: IObject[] = []
    if (isIn) {
      newList = favoriteGames.value.filter((item) => {
        if (item.lottoClassify) {
          return getLotteryKey(item) !== getLotteryKey(game)
        }
        if (item.contentCategory) {
          return getOuterKey(item) !== getOuterKey(game)
        }
        return false
      })
    }
    else {
      newList = [game, ...favoriteGames.value]
    }
    favoriteGames.value = newList
    localStorage.setItem(LOCAL_FAVORITE_GAMES, JSON.stringify(newList))
  }

  watch(favoriteGames, (newVal) => {
    if (newVal.length > 0) {
      const lotteryIds: string[] = []
      const outerIds: string[] = []
      favoriteGames.value.forEach((item) => {
        if (item.lottoClassify) {
          lotteryIds.push(getLotteryKey(item))
        }
        if (item.contentCategory) {
          outerIds.push(getOuterKey(item))
        }
      })
      lotteryFavoriteIds.value = lotteryIds
      outerFavoriteIds.value = outerIds
    }
    else {
      lotteryFavoriteIds.value = []
      outerFavoriteIds.value = []
    }
  })

  return {
    getLocalCollections,
    setLocalCollections,
    getLotteryKey,
    getOuterKey,
    favoriteGames,
    lotteryFavoriteIds,
    outerFavoriteIds,
  }
})
