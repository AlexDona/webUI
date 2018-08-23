import mutations from './mutations'
import actions from './action'
// import getters from './getters'

// Vue.use(Vuex)

const state = {
  // OTC改变选中的可用币种名字
  selectedOTCAvailableCurrencyName: '',
  // OTC改变选中的可用币种id
  selectedOTCAvailableCurrencyCoinID: ''
}

export default {
  state,
  // getters,
  actions,
  mutations
}
