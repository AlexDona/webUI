import mutations from './mutations'
import actions from './action'
// import getters from './getters'
// import {getStoreWithJson} from '../../utils'
// Vue.use(Vuex)

const state = {
  refreshEntrustStatus: false, // 刷新委单状态
  activeTabId: '', // 币币交易市场当前选中交易区id
  end: '' // 占位
}

export default {
  namespaced: true,
  state,
  // getters,
  actions,
  mutations
}
