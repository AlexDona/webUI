import {
  CHANGE_THEME,
  CHANGE_LANGUAGE,
  CHANGE_CONVERT_CURRENCY,
  CHANGE_BANNER_ACTIVE,
  CHANGE_BANNER_BACKGROUND,
  CHANGE_COLLECT_LIST,
  CHANGE_COLLECT_STATUS_LIST,
  CHANGE_ACTIVE_SYMBOL,
  CHANGE_USER_CENTER_ACTIVE_NAME,
  CHANGE_SOCKET_REFRESH_STATUS,
  // OTC模块
  // OTC改变选中的可用币种名字
  CHANGE_OTC_AVAILABLE_CURRENCY_NAME,
  // OTC改变选中的可用币种id
  CHANGE_OTC_AVAILABLE_CURRENCY_ID
} from './mutations-types.js'

// import {setStore, getStore} from '../utils'

// import {localapi, proapi} from 'src/config/env'

export default {
  // 公共部分
  // 首页
  // 币币交易
  // OTC交易
  // 投资理财
  // 活动中心
  // 个人中心
  // 注册登录

  // 切换主题
  [CHANGE_THEME] (state, data) {
    state.theme = data
  },
  // 切换语言
  [CHANGE_LANGUAGE] (state, data) {
    state.language = data
  },
  // 设置折算货币
  [CHANGE_CONVERT_CURRENCY] (state, data) {
    state.activeConvertCurrency = data
  },
  [CHANGE_BANNER_ACTIVE] (state, data) {
    state.bannerActive = data
  },
  [CHANGE_BANNER_BACKGROUND] (state, data = '') {
    state.bannerBackgroundImage = data
  },
  [CHANGE_COLLECT_LIST] (state, data) {
    state.globalCollectList = data
  },
  [CHANGE_COLLECT_STATUS_LIST] (state, data) {
    state.globalCollectStatusList = data
  },
  // 设置当前交易对
  [CHANGE_ACTIVE_SYMBOL] (state, data) {
    state.activeSymbol = data
  },
  [CHANGE_USER_CENTER_ACTIVE_NAME] (state, data) {
    state.userCenterActiveName = data
  },
  // 设置币币交易K线req请求刷新标识
  [CHANGE_SOCKET_REFRESH_STATUS] (state, data) {
    state.reqRefreshStatus = data
  },
  // OTC 模块数据
  // OTC改变选中的可用币种名字
  [CHANGE_OTC_AVAILABLE_CURRENCY_NAME] (state, data) {
    state.selectedOTCAvailableCurrencyName = data
  },
  // OTC改变选中的可用币种id
  [CHANGE_OTC_AVAILABLE_CURRENCY_ID] (state, data) {
    state.selectedOTCAvailableCurrencyCoinID = data
  }
}
