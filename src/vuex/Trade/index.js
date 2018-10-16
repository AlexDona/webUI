import mutations from './mutations'
import actions from './action'
// import getters from './getters'
// import {getStoreWithJson} from '../../utils'
// Vue.use(Vuex)

const state = {
  refreshEntrustStatus: false, // 刷新委单状态
  activeTabId: '', // 币币交易市场当前选中交易区id
  activeTabSymbolStr: '', // 当前选中交易区
  activePriceItem: '', // 用户手动选择买卖价格
  middleTopData: {}, // 中部当前交易对选中数据
  middleTopSocketData: {}, // 中部当前交易对选中socket数据
  isJumpToTradeCenter: false, // 是否从其他页面跳转到币币交易页面
  jumpSymbol: {}, // 跳转到币币交易时带来的当前交易对
  end: '' // 占位
}

export default {
  namespaced: true,
  state,
  // getters,
  actions,
  mutations
}
