import dayjs from 'dayjs'

/**
 * @param {*} days 间隔天数 ，当天 days = 0， 前一天days = -1
 */
export function getDateStartAndEnd(days: number = 0, format: string = 'YYYY-MM-DD HH:mm:ss') {
  const now = new Date()
  const nowStarTime = new Date(now.setHours(0, 0, 0, 0)) // 今天的开始时间
  const nowEndTime = new Date(now.setHours(23, 59, 59, 999)) // 今天的结束时间

  if (days > 0) {
    nowEndTime.setDate(nowStarTime.getDate() + days)
    return {
      startTime: dayjs(nowStarTime).format(format),
      endTime: dayjs(nowEndTime).format(format),
    }
  }
  else {
    nowStarTime.setDate(nowStarTime.getDate() + days)
    return {
      startTime: dayjs(nowStarTime).format(format),
      endTime: dayjs(nowEndTime).format(format),
    }
  }
}
