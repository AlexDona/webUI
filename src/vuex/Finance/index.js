import mutations from './mutations'
import actions from './action'
import {getStore} from '../../utils'
// import getters from './getters'

// Vue.use(Vuex)

const state = {
  // 设置父组件向线性图上传数据
  financeLineSelecteCoindInfor: {},
  // 设置父组件向饼状图上传数据
  financePieInvestmentValue: '',
  // 设置投资理财父组件向饼状图上传递数据
  financePieGetMoneyValue: ''
}

export default {
  namespaced: true,
  state,
  // getters,
  actions,
  mutations
}
