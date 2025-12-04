import type { IObject } from '@/01-kk-system/allHttp/types/common'
import { quckDateList } from '@/01-kk-system/allUtils/const'

export function useMoneyChangeTypes() {
  const { t } = useI18n()

  const businessAndReason = [
    {
      label: 'system.frontend.fundhistory.all',
      value: '',
      children: [
        {
          label: 'system.frontend.fundhistory.all',
          value: '',
        },
      ],
    },
    {
      label: 'system.frontend.fundhistory.manual',
      value: '1',
      children: [
        {
          label: 'system.frontend.fundhistory.manualTopup',
          value: '1',
        },
        {
          label: 'system.frontend.fundhistory.manualWithdraw',
          value: '2',
        },
        {
          label: 'system.frontend.fundhistory.uAltransferI',
          value: '3',
        },
        {
          label: 'system.frontend.fundhistory.uAltransferO',
          value: '4',
        },
        {
          label: 'system.frontend.fundhistory.activityAdd',
          value: '5',
        },
        {
          label: 'system.frontend.fundhistory.sysMtransferI',
          value: '6',
        },
        {
          label: 'system.frontend.fundhistory.sysMtransferO',
          value: '7',
        },
      ],
    },
    {
      label: 'system.frontend.fundhistory.third',
      value: '2',
      children: [
        {
          label: 'system.frontend.fundhistory.topup',
          value: '1',
        },
        {
          label: 'system.frontend.fundhistory.withdraw',
          value: '2',
        },
        {
          label: 'system.frontend.fundhistory.withdrawCancel',
          value: '3',
        },
      ],
    },
    {
      label: 'system.frontend.fundhistory.system',
      value: '3',
      children: [
        {
          label: 'system.frontend.fundhistory.rebate',
          value: '1',
        },
        {
          label: 'system.frontend.fundhistory.rebateCancel',
          value: '2',
        },
        {
          label: 'system.frontend.fundhistory.acctivityBonus',
          value: '3',
        },
        {
          label: 'system.frontend.fundhistory.fundFreeze',
          value: '4',
        },
        {
          label: 'system.frontend.fundhistory.fundUnfreeze',
          value: '5',
        },
      ],
    },
    {
      label: 'system.frontend.fundhistory.lottery',
      value: '4',
      children: [
        {
          label: 'system.frontend.fundhistory.normalBet',
          value: '1',
        },
        {
          label: 'system.frontend.fundhistory.normalCancel',
          value: '2',
        },
        {
          label: 'system.frontend.fundhistory.normalWin',
          value: '3',
        },
        {
          label: 'system.frontend.fundhistory.normalCancelWin',
          value: '4',
        },
        {
          label: 'system.frontend.fundhistory.chaseBet',
          value: '5',
        },
        {
          label: 'system.frontend.fundhistory.chaseCancel',
          value: '6',
        },
        {
          label: 'system.frontend.fundhistory.chaseWin',
          value: '7',
        },
        {
          label: 'system.frontend.fundhistory.chaseCancelWin',
          value: '8',
        },
        {
          label: 'system.frontend.fundhistory.chaseWinStop',
          value: '9',
        },
      ],
    },
    {
      label: 'system.frontend.fundhistory.hash',
      value: '5',
      children: [
        {
          label: 'system.frontend.fundhistory.rtxWin',
          value: '1',
        },
        {
          label: 'system.frontend.fundhistory.rtxBackM',
          value: '2',
        },
        {
          label: 'system.frontend.fundhistory.usdtWin',
          value: '3',
        },
        {
          label: 'system.frontend.fundhistory.usdtBackM',
          value: '4',
        },
      ],
    },
    {
      label: 'system.frontend.fundhistory.chain',
      value: '6',
      children: [
        {
          label: 'system.frontend.fundhistory.TRC10TRXRecharge',
          value: '1',
        },
        {
          label: 'system.frontend.fundhistory.TRC10TRXWithdraw',
          value: '2',
        },
        {
          label: 'system.frontend.fundhistory.TRC10TRXWithdrawCace',
          value: '3',
        },
        {
          label: 'system.frontend.fundhistory.TRC20USDTRecharge',
          value: '4',
        },
        {
          label: 'system.frontend.fundhistory.TRC20USDTWithdraw',
          value: '5',
        },
        {
          label: 'system.frontend.fundhistory.TRC20USDTWithdrawCace',
          value: '6',
        },
      ],
    },
    {
      label: 'system.frontend.fundhistory.outerGame',
      value: '7',
      children: [
        {
          label: 'system.frontend.fundhistory.sys2Out',
          value: '1',
        },
        {
          label: 'system.frontend.fundhistory.sys2OutCace',
          value: '2',
        },
        {
          label: 'system.frontend.fundhistory.out2Sys',
          value: '3',
        },
        {
          label: 'system.frontend.fundhistory.out2SysCace',
          value: '4',
        },
      ],
    },
    {
      label: 'system.frontend.fundhistory.contract',
      value: '8',
      children: [
        {
          label: 'system.frontend.contractType.betSalary',
          value: '1',
        },
        {
          label: 'system.frontend.contractType.winSalary',
          value: '2',
        },
        {
          label: 'system.frontend.contractType.holdSalary',
          value: '3',
        },
        {
          label: 'system.frontend.contractType.winRebate',
          value: '4',
        },
        {
          label: 'system.frontend.contractType.teamBonus',
          value: '5',
        },
        {
          label: 'system.frontend.contractType.rdSalary',
          value: '6',
        },
      ],
    },
  ]

  function getCurrentChangeTxt(row: IObject) {
    const { businessCode, reasonCode } = row || {}
    const target = businessAndReason.find(
      item => item.value === businessCode,
    )
    if (target) {
      const cTarget = target.children.find(
        child => child.value === reasonCode,
      )
      if (cTarget) {
        return `${t(target.label)}-${t(cTarget.label)}`
      }
    }

    return '-'
  }

  return {
    quckDateList,
    businessAndReason,
    getCurrentChangeTxt,
  }
}
