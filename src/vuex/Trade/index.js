import mutations from './mutations'
import actions from './actions'
import getters from './getters'
// import {getStoreWithJson} from '../../utils'
// Vue.use(Vuex)

const state = {
  // 刷新委单状态
  refreshEntrustStatus: false,
  // 币币交易市场当前选中交易区id
  activeTabId: '',
  // 当前选中交易区
  activeTabSymbolStr: '',
  // 用户手动选择买卖价格
  activePriceItem: '',
  // 中部当前交易对选中数据
  middleTopData: {},
  // 中部当前交易对选中socket数据
  middleTopSocketData: {},
  // 是否从其他页面跳转到币币交易页面
  isJumpToTradeCenter: false,
  // 跳转到币币交易时带来的当前交易对
  jumpSymbol: {},
  // K线数据是否得到
  isKlineDataReady: false,
  // 限价买卖数量、单价
  limitExchange: {
    buyPrice: 0,
    buyCount: 0,
    sellPrice: 0,
    sellCount: 0
  },
  // 市价买卖数量、单价
  marketExchange: {
    buyCount: 0,
    sellCount: 0
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
