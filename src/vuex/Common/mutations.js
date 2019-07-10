/**
 * author: zhaoxinlei
 * create: 201803015
 * description: 当前 js 为 common(基础信息) mutations
 */
import {
  CHANGE_THEME,
  CHANGE_LANGUAGE,
  CHANGE_CONVERT_CURRENCY,
  CHANGE_SOCKET_REFRESH_STATUS,
  CHANGE_SOCKET_AND_AJAX_DATA,
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
  CHANGE_SYMBOL_CHANGED_STATUS,
  SET_WINDOW_WIDTH,
  SET_NOTICE_ID,
  CHANGE_PASSWORD_USEABLE,
  UPDATE_PAY_PASSWORD_DIALOG_M,
  UPDATE_PAY_PASSWORD_M,
  SET_LANGUAGES_M,
  // eslint-disable-next-line
  CHANGE_ROUTER_PATH,
  // 增加改变全局存储选中的交易对小数位方法
  CHANGE_CHECKED_BITS,
  SET_REQUEST_COUNT_M,
  SAVE_FOOTER_HEIGHT,
  SET_ACTIVE_LINK_NAME_M,
  SET_NAVIGATOR_M
} from './mutations-types.js'

import {setStore} from '../../utils'
import {getNestedData} from '../../utils/commonFunc'
// import {localapi, proapi} from 'src/config/env'

export default {
  // 改变全局存储的选中的交易对小数位的值
  [CHANGE_CHECKED_BITS] (state, data) {
    state.globalCheckedBits = data
  },
  [SET_COUNT_DOWN_RESET_STATUS] (state, data) {
    state.countDownResetStatus = data
  },
  // 切换主题
  [CHANGE_THEME] (state, data) {
    state.theme = data
    setStore('theme', data)
  },
  [SET_LANGUAGES_M] (state, languages) {
    state.languages_S = languages
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
    // console.log(ajaxData)
    // console.log(type, ajaxData, socketData)
    switch (type) {
      case 'ajax':
        // 交易对深度小数位数据
        if (ajaxData.depthDecimal) {
          state.klineAjaxData.depthDecimal = ajaxData.depthDecimal
        }
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
          state.socketData.symbol = socketData.symbol
          state.socketData.depthData = getNestedData(socketData, 'depthData')
          // console.log(socketData.buyAndSellData)
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
    console.log(state.routerTo)
  },
  // 切换主题
  [USER_ASSETS_LIST] (state, data) {
    state.withdrawDepositList = data
  },
  [SET_COUNTRY_AREA_LIST] (state, data) {
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
  [SET_WINDOW_WIDTH] (state, width) {
    state.clientWidth = width
    // console.log(state.clientWidth)
  },
  [SET_NOTICE_ID] (state, noticeId) {
    state.newsItemId = noticeId
  },
  [CHANGE_PASSWORD_USEABLE] (state, data) {
    state.isLockedPayPassword = data
  },
  [UPDATE_PAY_PASSWORD_DIALOG_M] (state, status) {
    state.isShowGlobalPayPass_S = status
    if (!status) state.globalPayPassword_S = ''
    // console.log(status)
  },
  [UPDATE_PAY_PASSWORD_M] (state, payPassword) {
    state.globalPayPassword_S = payPassword
  },
  // 更新当前正在请求次数
  [SET_REQUEST_COUNT_M] (state, type) {
    switch (type) {
      case 'ADD':
        state.requestCount_S += 1
        break
      case 'SUBTRACT':
        if (state.requestCount_S > 0) state.requestCount_S -= 1
        break
      case 'RESET':
        state.requestCount_S = 0
        break
    }
    console.log(state.requestCount_S)
    state.loading_S = state.requestCount_S <= 0 ? false : true
  },
  [SAVE_FOOTER_HEIGHT] (state, height) {
    state.footerHeight = height
  },
  [SET_ACTIVE_LINK_NAME_M] (state, name) {
    state.activeLinkIndex_S = name
    console.log(state.activeLinkIndex_S)
  },
  [SET_NAVIGATOR_M] (state, navigators) {
    state.navigators_S = navigators
  }
}
