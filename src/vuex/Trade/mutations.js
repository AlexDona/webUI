import {
  TOGGLE_REFRESH_ENTRUST_LIST_STATUS,
  CHANGE_ACTIVE_TAB_ID,
  CHANGE_ACTIVE_PRICE_ITEM,
  SET_MIDDLE_TOP_DATA,
  SET_JUMP_STATUS,
  SET_JUMP_SYMBOL
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
    console.log(data)
    state.middleTopData = data
  },
  [SET_JUMP_STATUS] (state, data) {
    state.isJumpToTradeCenter = data
  },
  [SET_JUMP_SYMBOL] (state, data) {
    state.jumpSymbol = data
  }
}
