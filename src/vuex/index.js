import mutations from './mutations'
import actions from './action'
import {getStore} from '../utils'
// import getters from './getters'

// Vue.use(Vuex)

const state = {
  // 网页主题
  theme: getStore('theme') || 'night',
  // 国际化语言
  language: 'zh_CN',
  // 折算货币
  activeConvertCurrency: 'CNY'
}

export default new Vuex.Store({
  state,
  // getters,
  actions,
  mutations
})
