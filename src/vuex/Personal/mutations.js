import {
  CHANGE_USER_CENTER_ACTIVE_NAME,
  CHANGE_REF_SECURITY_CENTER_INFO,
  CHANGE_REF_ACCOUNT_CREDITED_STATE,
  SET_LEGAL_TENDER_LIST,
  SET_LEGAL_TENDER_REFLASH_STATUS,
  CHANGE_LEGAL_PAGE,
  // 更改重新渲染交易中订单列表状态
  CHANGE_RE_RENDER_TRADING_LIST_STATUS
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
  }
}
