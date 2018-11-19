import {
  CHANGE_THEME,
  CHANGE_LANGUAGE,
  CHANGE_CONVERT_CURRENCY,
  CHANGE_SOCKET_REFRESH_STATUS,
  CHANGE_SOCKET_AND_AJAX_DATA,
  CHANGE_ACTIVE_SYMBOL,
  CHANGE_ACTIVE_TRADE_AREA,
  CHANGE_PALTE_LIST,
  CHANGE_CURRENCY_RATE_LIST,
  USER_ASSETS_LIST,
  SET_COUNTRY_AREA_LIST,
  USER_INFORMATION_REFRESH,
  SET_USER_INFO_REFRESH_STATUS,
  SET_LOGO_URL,
  SET_FOOTER_INFO,
  SET_COUNT_DOWN_RESET_STATUS,
  // eslint-disable-next-line
  CHANGE_ROUTER_PATH
} from './mutations-types.js'

import {setStore} from '../../utils'

// import {localapi, proapi} from 'src/config/env'

export default {
  [SET_COUNT_DOWN_RESET_STATUS] (state, data) {
    state.countDownResetStatus = data
  },
  // 切换主题
  [CHANGE_THEME] (state, data) {
    state.theme = data
    setStore('theme', data)
  },
  // 切换语言
  [CHANGE_LANGUAGE] (state, data) {
    state.activeLanguage = data
    state.language = data.shortName
    setStore('language', data.shortName)
  },
  // 设置折算货币
  [CHANGE_CONVERT_CURRENCY] (state, data) {
    state.activeConvertCurrency = data
    setStore('convertCurrency', data || 'CNY')
  },
  // 改变socket刷新状态
  [CHANGE_SOCKET_REFRESH_STATUS] (state, data) {
    state.reqRefreshStatus = data
  },
  // 改变socket 数据
  [CHANGE_SOCKET_AND_AJAX_DATA] (state, {
    socketData,
    ajaxData,
    type
  }) {
    console.log(ajaxData)
    console.log(type, ajaxData, socketData)
    switch (type) {
      case 'ajax':
        if (ajaxData.depthData) {
          state.klineAjaxData.depthData = ajaxData.depthData
        }
        if (ajaxData.buyAndSellData) {
          state.klineAjaxData.buyAndSellData = ajaxData.buyAndSellData
        }
        state.klineAjaxData.tardeRecordList = ajaxData.tardeRecordList
        state.klineAjaxData.tradeMarketList = ajaxData.tradeMarketList
        break
      case 'socket':
        if (socketData.depthData) {
          state.socketData.depthData = socketData.depthData
        }
        console.log(socketData.buyAndSellData)
        state.socketData.buyAndSellData = socketData.buyAndSellData
        if (!state.socketData.buyAndSellData) {
          state.socketData.buyAndSellData.sells.list = []
        }
        state.socketData.tardeRecordList = socketData.tardeRecordList
        state.socketData.tradeMarkeContentItem = socketData.tradeMarkeContentItem
        break
    }
  },
  // 更改当前选中交易对
  [CHANGE_ACTIVE_SYMBOL] (state, {activeSymbol, previousSymbol}) {
    if (activeSymbol) {
      state.activeSymbol = activeSymbol
    }
    if (previousSymbol) {
      state.previousSymbol = previousSymbol
    }
  },
  // 更改当前选中交易区
  [CHANGE_ACTIVE_TRADE_AREA] (state, data) {
    state.activeTradeArea = data
  },
  // 更改板块
  [CHANGE_PALTE_LIST] (state, data) {
    state.plateList = data
  },
  [CHANGE_CURRENCY_RATE_LIST] (state, data) {
    state.currencyRateList = data.currencyRateList
    if (data.activeConvertCurrencyObj) {
      state.activeConvertCurrencyObj = data.activeConvertCurrencyObj
    }
  },
  // 登录后路由跳转
  CHANGE_ROUTER_PATH (state, path) {
    state.routerTo = path
  },
  // 切换主题
  [USER_ASSETS_LIST] (state, data) {
    state.withdrawDepositList = data
  },
  [SET_COUNTRY_AREA_LIST] (state, data) {
    state.contryAreaList = data
  },
  [USER_INFORMATION_REFRESH] (state, data) {
    state.userRefreshUserList = data
  },
  [SET_USER_INFO_REFRESH_STATUS] (state, data) {
    state.userInfoRefreshStatus = data
  },
  [SET_LOGO_URL] (state, {logoSrc, title}) {
    state.logoSrc = logoSrc
    state.title = title
  },
  [SET_FOOTER_INFO] (state, data) {
    state.footerInfo = data
  }
}
