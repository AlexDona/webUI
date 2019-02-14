import mutations from './mutations'
import actions from './actions'
// import {getStore} from '../../utils'
// import getters from './getters'

// Vue.use(Vuex)

const state = {
  // 设置父组件向线性图上传x轴数据
  financeLineRenderTimeList: [],
  // 设置父组件向线性图上传y轴数据
  financeLineRenderPriceList: [],
  status: 1
}

export default {
  state,
  // getters,
  actions,
  mutations
}
