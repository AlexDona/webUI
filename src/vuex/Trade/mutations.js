import {
  TOGGLE_REFRESH_ENTRUST_LIST_STATUS,
  CHANGE_ACTIVE_TAB_ID,
  CHANGE_ACTIVE_PRICE_ITEM,
  SET_MIDDLE_TOP_DATA,
  SET_JUMP_STATUS,
  SET_JUMP_SYMBOL,
  SET_IS_KLINE_DATA_READY,
  SET_TARGET_EXCHANGE_DATA,
  GET_SERVER_DATA,
  RETURN_SYMBOL_DATA,
  SET_PRE_INFO_M,
  UPDATE_KLINE_AND_DEPTH_SHOW_STATUS_M
} from './mutations-types.js'

// import {setStore} from '../../utils'

// import {localapi, proapi} from 'src/config/env'

export default {
  // 切换委托列表刷新状态
  [TOGGLE_REFRESH_ENTRUST_LIST_STATUS] (state, data) {
    state.refreshEntrustStatus = data
  },
  [CHANGE_ACTIVE_TAB_ID] (state, {
    activeTabSymbolStr
  }) {
    // state.activeTabId = activeTabId
    state.activeTabSymbolStr = activeTabSymbolStr
  },
  [CHANGE_ACTIVE_PRICE_ITEM] (state, data) {
    state.activePriceItem = data
  },
  [SET_MIDDLE_TOP_DATA] (state, data) {
    // console.log(data)
    state.middleTopData = data
  },
  [SET_JUMP_STATUS] (state, data) {
    state.isJumpToTradeCenter = data
  },
  [SET_JUMP_SYMBOL] (state, data) {
    state.jumpSymbol = data
  },
  [SET_IS_KLINE_DATA_READY] (state, data) {
    state.isKlineDataReady = data
  },
  [SET_TARGET_EXCHANGE_DATA] (state, {
    type,
    buyPrice,
    buyCount,
    sellPrice,
    sellCount,
    buyAmount
  }) {
    switch (type) {
      case 'limit':
        state.limitExchange = {
          buyPrice,
          buyCount,
          sellPrice,
          sellCount
        }
        break
      case 'market':
        state.marketExchange = {
          buyAmount,
          sellCount
        }
        break
    }
    // console.log(state.limitExchange, state.marketExchange)
  },
  // 获取服务器时间数据
  [GET_SERVER_DATA] (state, data) {
    let {serverTime, isShowServerPort, nextCountDown, isLimitShow} = data
    state.serverData.serverTime = serverTime
    state.serverData.isShowServerPort = isShowServerPort
    state.serverData.nextCountDown = nextCountDown
    state.serverData.isLimitShow = isLimitShow
  },
  [RETURN_SYMBOL_DATA] (state, data) {
    state.isReturnSymbolData = data
  },
  [SET_PRE_INFO_M] (state, info) {
    state.activity = {...state.activity, ...info}
  },
  [UPDATE_KLINE_AND_DEPTH_SHOW_STATUS_M] (state, showContent) {
    state.showKlineOrDepth_S = showContent
  }
}
