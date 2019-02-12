import mutations from './mutations'
import actions from './action'
// import {getStore} from '../../utils'
// import getters from './getters'

// Vue.use(Vuex)

const state = {
  // 首页 banner 图背景
  // bannerBackgroundImage: 'http://fubt-3.oss-cn-hongkong.aliyuncs.com/5dd01753-6e61-4cf0-b24b-3e49c1343de2',
  bannerBackgroundImage: require('../../assets/develop/default-banner.jpg'),
  // 首页banner 默认 背景图
  bannerDefaultBackground: '',
  // 首页banner激活
  bannerActive: false,
  collectSymbol: {}, // 收藏交易对列表
  symbolMap: new Map(), // 交易对map映射 key： 交易对名称 value： 交易对json
  noticeCloseVisible: true,
  // 首页新闻列表
  noticeList: []
}

export default {
  state,
  // getters,
  actions,
  mutations
}
