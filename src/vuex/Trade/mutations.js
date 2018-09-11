import {
  TOGGLE_REFRESH_ENTRUST_LIST_STATUS,
  CHANGE_ACTIVE_TAB_ID,
  CHANGE_ACTIVE_PRICE_ITEM
} from './mutations-types.js'

// import {setStore} from '../../utils'

// import {localapi, proapi} from 'src/config/env'

export default {
  // 切换委托列表刷新状态
  [TOGGLE_REFRESH_ENTRUST_LIST_STATUS] (state, data) {
    state.refreshEntrustStatus = data
  },
  [CHANGE_ACTIVE_TAB_ID] (state, data) {
    state.activeTabId = data
  },
  [CHANGE_ACTIVE_PRICE_ITEM] (state, data) {
    state.activePriceItem = data
  }
}
