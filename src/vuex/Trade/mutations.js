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
  CHANGE_ACTIVITY_STATUS,
  REFRESH_CONTENT_STATUS
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
  [CHANGE_ACTIVITY_STATUS] (state, status) {
    state.isActivityEnd = status
  },
  [REFRESH_CONTENT_STATUS] (state, status) {
    state.isChangeContent = status
  }
}
