import mutations from './mutations'
import actions from './action'
import {getStore} from '../../utils'
// import getters from './getters'

// Vue.use(Vuex)

const state = {
  // 首页 banner 图背景
  bannerBackgroundImage: 'https://fubt.oss-ap-southeast-1.aliyuncs.com/fubt/upload/args/0c2a11e3ee9145819210f96f004ec9f2n.jpg',
  // 首页banner 默认 背景图
  bannerDefaultBackground: 'https://fubt.oss-ap-southeast-1.aliyuncs.com/fubt/upload/args/0c2a11e3ee9145819210f96f004ec9f2n.jpg',
  // 首页banner激活
  bannerActive: false,
  globalCollectList: JSON.parse(getStore('collectList')) || [], // 收藏列表
  globalCollectStatusList: JSON.parse(getStore('collectStatusList')) || [], // 收藏状态列表
  // 首页 板块
  plateList: [
    {
      id: 0,
      name: 'main',
      label: '主区'
    },
    {
      id: 1,
      name: 'Innovation',
      label: '创新区'
    }
  ], // 板块列表
  end: ''// 占位
}

export default {
  state,
  // getters,
  actions,
  mutations
}
