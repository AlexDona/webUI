import mutations from './mutations'
import actions from './action'
// import getters from './getters'

// Vue.use(Vuex)

const state = {
  // OTC改变选中的可用币种名字
  selectedOTCAvailableCurrencyName: '',
  // OTC改变选中的可用币种id
  selectedOTCAvailableCurrencyCoinID: '',
  // OTC改变选中的可用币种partnerCoinId
  selectedOTCAvailablePartnerCoinId: '',
  // OTC交易首页锚点状态
  anchorStatus: false,
  // 委托定单撤单后，更新首页挂单列表状态：false为不刷新 true为刷新
  updateOTCHomeListStatus: false,
  // 发布订单（商家和普通用户公用）后页面跳转到首页顶部状态
  publishOrderJumpTopStatus: false
}

export default {
  namespaced: true,
  state,
  // getters,
  actions,
  mutations
}
