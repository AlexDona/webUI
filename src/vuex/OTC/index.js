import mutations from './mutations'
import actions from './action'
// import getters from './getters'

// Vue.use(Vuex)

const state = {
  // OTC改变选中的可用币种名字
  selectedOTCAvailableCurrencyName: '',
  // OTC改变选中的可用币种id
  selectedOTCAvailableCurrencyCoinID: '',
  // otc 商家和普通用户通用挂单页面可用币种起订量
  merchantAndCommonPutOnOrderMinCount: ''
}

export default {
  namespaced: true,
  state,
  // getters,
  actions,
  mutations
}
