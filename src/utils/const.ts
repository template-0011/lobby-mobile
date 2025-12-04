import dayjs from 'dayjs'

export const quckDateList = [
  {
    labelKey: 'web.i18nFront.title.today',
    value: 0,
  },
  {
    labelKey: 'web.i18nFront.title.yestoday',
    value: -1,
  },
  {
    labelKey: 'web.i18nFront.title.last07',
    value: -7,
  },
  {
    labelKey: 'web.i18nFront.title.last015',
    value: -15,
  },
  {
    labelKey: 'web.i18nFront.title.last030',
    value: -30,
  },
]

export const isIncludeList = [
  {
    labelKey: 'web.i18nFront.title.include',
    value: 1,
  },
  {
    labelKey: 'web.i18nFront.title.exclude',
    value: 0,
  },
]

export const foreverLinkTime = '3046-01-01 01:01:01'

export const expireTimeList = [
  {
    value: 1,
    langKey: 'web.i18nFront.title.oneD',
    label: '一天',
  },
  {
    value: 3,
    langKey: 'web.i18nFront.title.threeD',
    label: '三天',
  },
  {
    value: 7,
    langKey: 'web.i18nFront.title.sevenD',
    label: '七天',
  },
  {
    value: 15,
    langKey: 'web.i18nFront.title.fifteenD',
    label: '十五天',
  },
  {
    value: 90,
    langKey: 'web.i18nFront.label.threeMonths',
    label: '三个月',
    calculater: () => dayjs().add(3, 'month').format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    value: 180,
    langKey: 'web.i18nFront.label.halfYear',
    label: '六个月',
    calculater: () => dayjs().add(6, 'month').format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    value: 365,
    langKey: 'web.i18nFront.label.oneYear',
    label: '一年',
    calculater: () => dayjs().add(1, 'year').format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    value: 9999,
    langKey: 'web.i18nFront.title.forever',
    label: '永久有效',
  },
]
