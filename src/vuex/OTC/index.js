import mutations from './mutations'
import actions from './actions'
// import getters from './getters'

// Vue.use(Vuex)

const state = {
  // OTC改变选中的可用币种名字
  selectedOTCAvailableCurrencyName: '',
  // OTC改变选中的可用币种id
  selectedOTCAvailableCurrencyCoinID: '',
  // OTC改变选中的可用币种partnerCoinId
  // selectedOTCAvailablePartnerCoinId: '',
  // OTC交易首页锚点状态
  anchorStatus: false,
  // 委托定单撤单后，更新首页挂单列表状态：false为不刷新 true为刷新
  updateOTCHomeListStatus: false,
  // 发布订单（商家和普通用户公用）后页面跳转到首页顶部状态
  publishOrderJumpTopStatus: false,
  // 普通用户点击otc导航弹窗提示点击申请按钮跳转到申请商家组件底部状态
  otcApplyJumpBottomStatus: false,
  // otc可用币种列表
  OTCCoinList: [],
  // otc主页国家列表筛选框选中的国家id
  otcSelectedCountryId: '',
  // otc主页法币列表筛选框选中的法币类型id
  otcSelectedCurrencyId: '',
  // 即时通讯弹窗显示隐藏状态
  IMBoxShowStatusMap_S: {},
  // OTC及时通讯
  OTCIMSocket_S: null
}

export default {
  state,
  // getters,
  actions,
  mutations
}
