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
  activeConvertCurrency: 'CNY',
  // 首页 banner 图背景
  bannerBackgroundImage: 'https://fubt.oss-ap-southeast-1.aliyuncs.com/fubt/upload/args/0c2a11e3ee9145819210f96f004ec9f2n.jpg',
  // 首页banner 默认 背景图
  bannerDefaultBackground: 'https://fubt.oss-ap-southeast-1.aliyuncs.com/fubt/upload/args/0c2a11e3ee9145819210f96f004ec9f2n.jpg',
  // 首页banner激活
  bannerActive: false
}

export default new Vuex.Store({
  state,
  // getters,
  actions,
  mutations
})
