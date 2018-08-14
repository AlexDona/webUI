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
  bannerActive: false,
  // 当前选中交易对
  activeSymbol: {
    id: 0, // 交易对id
    image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    sellsymbol: 'FUC', // 币种简称
    sellname: '富链', // 币种全程
    area: 'BTC', // 交易区
    price: 0.21761239, // 最新价格
    high: 0.21761232, // 最高价
    low: 0.21761232, // 最低价
    volume: 21761232, // 24小时成交量
    rose: -0.16123, // 涨跌
    tendency: [2.35, 1.23, 1.89, 1.24, 2.1, 1.59, 0.1, 2.35],
    hot: false // 是否为最热交易对
  },
  globalCollectList: JSON.parse(getStore('collectList')) || [] // 收藏列表
}

export default new Vuex.Store({
  state,
  // getters,
  actions,
  mutations
})
