import {
  CHANGE_THEME,
  CHANGE_LANGUAGE,
  CHANGE_CONVERT_CURRENCY,
  CHANGE_SOCKET_REFRESH_STATUS,
  CHANGE_SOCKET_AND_AJAX_DATA,
  CHANGE_ACTIVE_SYMBOL,
  CHANGE_ACTIVE_TRADE_AREA,
  CHANGE_CURRENCY_RATE_LIST,
  USER_ASSETS_LIST,
  SET_COUNTRY_AREA_LIST,
  USER_INFORMATION_REFRESH,
  SET_USER_INFO_REFRESH_STATUS,
  SET_LOGO_URL,
  SET_FOOTER_INFO,
  SET_COUNT_DOWN_RESET_STATUS,
  CHANGE_DEFAULT_LANGUAGE,
  CHANGE_AJAX_READY_STATUS,
  CHANGE_SYMBOL_CHANGED_STATUS,
  SET_WINDOW_WIDTH,
  // eslint-disable-next-line
  CHANGE_ROUTER_PATH
} from './mutations-types.js'

import {setStore} from '../../utils'
import {getNestedData} from '../../utils/commonFunc'
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
        if (socketData) {
          state.socketData.depthData = getNestedData(socketData, 'depthData')
          console.log(socketData.buyAndSellData)
          if (socketData.buyAndSellData) {
            state.socketData.buyAndSellData = getNestedData(socketData, 'buyAndSellData')
          }
          if (!state.socketData.buyAndSellData) {
            state.socketData.buyAndSellData.sells.list = []
          }
          state.socketData.tardeRecordList = socketData.tardeRecordList
          state.socketData.tradeMarkeContentItem = socketData.tradeMarkeContentItem
        }
        break
    }
  },
  // 更改当前选中交易对
  [CHANGE_ACTIVE_SYMBOL] (state, {activeSymbol, previousSymbol}) {
    console.log(activeSymbol)
    if (activeSymbol) {
      state.activeSymbol = activeSymbol
    }
    if (previousSymbol) {
      state.previousSymbol = previousSymbol
    }
  },
  [CHANGE_SYMBOL_CHANGED_STATUS] (state, status) {
    state.isSymbolChanged = status
  },
  // 更改当前选中交易区
  [CHANGE_ACTIVE_TRADE_AREA] (state, data) {
    state.activeTradeArea = data
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
    console.log(data)
    state.countryAreaList = data
    setStore('countryList', data)
    setStore('timeStamp', new Date().getTime())
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
  [SET_FOOTER_INFO] (state, {
    footerInfo1,
    footerInfo2,
    configInfo
  }) {
    if (footerInfo1) {
      state.footerInfo.footerInfo1 = footerInfo1
    }
    if (footerInfo2) {
      state.footerInfo.footerInfo2 = footerInfo2
    }
    if (configInfo) {
      state.footerInfo.configInfo = configInfo
    }
  },
  [CHANGE_DEFAULT_LANGUAGE] (state, data) {
    state.defaultLanguage = data
  },
  [CHANGE_AJAX_READY_STATUS] (state, data) {
    state.isAjaxReady = data
  },
  [SET_WINDOW_WIDTH] (state, width) {
    state.clientWidth = width
    console.log(state.clientWidth)
  }
}
