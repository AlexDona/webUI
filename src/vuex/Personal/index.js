import mutations from './mutations'
import actions from './action'
// import getters from './getters'

// Vue.use(Vuex)

const state = {
  // 交易中的订单
  legalTraderTradingList: [],
  legalTraderTradingReflashStatus: false, // 刷新状态
  //  已完成的订单
  legalTraderCompletedList: [],
  legalTraderCompletedReflashStatus: false,
  //  已取消的订单
  legalTraderCanceledList: [],
  legalTraderCancelReflashStatus: false,
  //  冻结中的订单
  legalTraderForzenList: [],
  legalTraderFrozenReflashStatus: false,
  //  委托订单
  legalTraderEntrustList: [],
  legalTraderEntrustReflashStatus: false,
  // 个人中心默认显示第一个
  userCenterActiveName: 'assets',
  // 个人中心默认显示第一个
  fiatMoneyOrdersName: 'trade-order',
  // 安全中心默认
  refSecurityCenterStatus: false,
  // 收款方式
  refsAccountCenterStatus: false,
  legalTradePageSize: 10, // 每页数据量
  legalTradePageNum: 1, // 开始页码
  legalTradePageTotals: 0 // 总页数
}

export default {
  namespaced: true,
  state,
  // getters,
  actions,
  mutations
}
