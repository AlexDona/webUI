import mutations from './mutations'
import actions from './action'
// import {getStore} from '../../utils'
// import getters from './getters'

// Vue.use(Vuex)

const state = {
  newsAndNoticeActiveName: '',
  end: ''// 占位
}

export default {
  namespaced: true,
  state,
  // getters,
  actions,
  mutations
}
