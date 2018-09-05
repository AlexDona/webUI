import mutations from './mutations'
import actions from './action'
import {getStore} from '../../utils'
// import getters from './getters'

// Vue.use(Vuex)

const state = {
  // 首页 banner 图背景
  bannerBackgroundImage: 'http://fubt-3.oss-cn-hongkong.aliyuncs.com/5dd01753-6e61-4cf0-b24b-3e49c1343de2',
  // 首页banner 默认 背景图
  bannerDefaultBackground: 'http://fubt-3.oss-cn-hongkong.aliyuncs.com/5dd01753-6e61-4cf0-b24b-3e49c1343de2',
  // 首页banner激活
  bannerActive: false,
  globalCollectList: JSON.parse(getStore('collectList')) || [], // 收藏列表
  globalCollectStatusList: JSON.parse(getStore('collectStatusList')) || [], // 收藏状态列表

  end: ''// 占位
}

export default {
  namespaced: true,
  state,
  // getters,
  actions,
  mutations
}
