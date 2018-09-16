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
  //  已取消的订单
  legalTraderCanceledList: [],
  //  冻结中的订单
  legalTraderForzenList: [],
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
  refsAccountCenterStatus: false
}

export default {
  namespaced: true,
  state,
  // getters,
  actions,
  mutations
}
