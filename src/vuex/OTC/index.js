import mutations from './mutations'
import actions from './action'
// import getters from './getters'

// Vue.use(Vuex)

const state = {
  // OTC模块 需要放到全局的数据
  // OTC改变选中的可用币种
  selectedOTCAvailableCurrencyName: '',
  selectedOTCAvailableCurrencyCoinID: ''
}

export default {
  state,
  // getters,
  actions,
  mutations
}
