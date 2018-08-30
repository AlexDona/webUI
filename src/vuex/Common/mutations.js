import {
  CHANGE_THEME,
  CHANGE_LANGUAGE,
  CHANGE_CONVERT_CURRENCY,
  CHANGE_SOCKET_REFRESH_STATUS,
  CHANGE_SOCKET_DATA
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
  // 改变socket刷新状态
  [CHANGE_SOCKET_REFRESH_STATUS] (state, data) {
    state.reqRefreshStatus = data
  },
  // 改变socket 数据
  [CHANGE_SOCKET_DATA] (state, data) {
    state.socketData.depthData = data.depthData
    state.socketData.buyAndSellData = data.buyAndSellData
    state.socketData.tardeRecordList = data.tardeRecordList
  }
}
