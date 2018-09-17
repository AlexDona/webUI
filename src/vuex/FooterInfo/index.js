import mutations from './mutations'
import actions from './action'
// import {getStore} from '../../utils'
// import getters from './getters'

// Vue.use(Vuex)

const state = {
  newsAndNoticeActiveName: 'notice', // 新闻公告全局当前激活标签
  serviceActiveName: 'UserProtocol', // 服务条款激活标签
  end: ''// 占位
}

export default {
  namespaced: true,
  state,
  // getters,
  actions,
  mutations
}
