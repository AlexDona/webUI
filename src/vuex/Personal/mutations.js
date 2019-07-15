import {
  CHANGE_USER_CENTER_ACTIVE_NAME,
  CHANGE_REF_SECURITY_CENTER_INFO,
  CHANGE_REF_ACCOUNT_CREDITED_STATE,
  SET_LEGAL_TENDER_LIST,
  SET_LEGAL_TENDER_REFLASH_STATUS,
  CHANGE_LEGAL_PAGE,
  // 更改重新渲染交易中订单列表状态
  CHANGE_RE_RENDER_TRADING_LIST_STATUS,
  SET_NEW_WITHDRAW_ADDRESS,
  SET_NEW_WITHDRAW_RECORD_STATUS,
  SET_NEW_WITHDRAW_RECORD,
  UPDATE_ACTIVE_LINK_NAMES_M,
  UPDATE_LINK_NAMES_M,
  // 改变清除交易中数据方法的状态
  CHANGE_CLEAR_DATA_STATUS_M
} from './mutations-types.js'

// import {setStore, getStore} from '../utils'
// import {localapi, proapi} from 'src/config/env'

export default {
  // 更改重新渲染交易中订单列表状态
  [CHANGE_RE_RENDER_TRADING_LIST_STATUS] (state, data) {
    state.reRenderTradingListStatus = data
  },
  [CHANGE_USER_CENTER_ACTIVE_NAME] (state, data) {
    state.userCenterActiveName = data
  },
  [CHANGE_REF_SECURITY_CENTER_INFO] (state, data) {
    state.refSecurityCenterStatus = data
  },
  [CHANGE_REF_ACCOUNT_CREDITED_STATE] (state, data) {
    state.refsAccountCenterStatus = data
  },
  // 获取法币交易订单
  [SET_LEGAL_TENDER_LIST] (state, data) {
    switch (data.type) {
      case 'TRADING':
        state.legalTraderTradingList = data.data
        break
      case 'COMPLETED':
        state.legalTraderCompletedList = data.data
        break
      case 'CANCELED':
        state.legalTraderCanceledList = data.data
        break
      case 'FROZEN':
        state.legalTraderForzenList = data.data
        break
      case 'ENTRUSTED':
        state.legalTraderEntrustList = data.data
        break
    }
  },
  [SET_LEGAL_TENDER_REFLASH_STATUS] (state, {type, status}) {
    switch (type) {
      case 'TRADING':
        state.legalTraderTradingReflashStatus = status
        break
      case 'COMPLETED':
        state.legalTraderCompletedReflashStatus = status
        break
      case 'CANCELED':
        state.legalTraderCancelReflashStatus = status
        break
      case 'FROZEN':
        state.legalTraderFrozenReflashStatus = status
        break
      case 'ENTRUSTED':
        state.legalTraderEntrustReflashStatus = status
        break
    }
  },
  [CHANGE_LEGAL_PAGE] (state, {
    legalTradePageSize,
    legalTradePageNum,
    legalTradePageTotals
  }) {
    if (legalTradePageSize) {
      state.legalTradePageSize = legalTradePageSize
    }
    if (legalTradePageNum) {
      state.legalTradePageNum = legalTradePageNum
    }
    if (legalTradePageTotals) {
      state.legalTradePageTotals = legalTradePageTotals
    }
  },
  // 我的资产跳转到提币地址携带提币参数
  [SET_NEW_WITHDRAW_ADDRESS] (state, data) {
    state.paramOfJumpToAddWithdrawAdress = data
  },
  // 我的资产跳转到账单明细提币携带参数
  [SET_NEW_WITHDRAW_RECORD] (state, data) {
    state.assetJumpStatementDetails = data
  },
  // 我的资产跳转到账单明细提币携带提币充值类型
  [SET_NEW_WITHDRAW_RECORD_STATUS] (state, data) {
    state.assetJumpStatementDetailsType = data
  },
  // 更新全局链名称
  [UPDATE_ACTIVE_LINK_NAMES_M] (state, activeLinkName) {
    state.activeLinkName_S = activeLinkName
  },
  // 更新全局链名称
  [UPDATE_LINK_NAMES_M] (state, linknames) {
    state.linkNames_S = linknames
  },
  // 改变清除交易中数据方法的状态
  [CHANGE_CLEAR_DATA_STATUS_M] (state, data) {
    state.clearTradingOrderArrDataStatus = data
  }
}
