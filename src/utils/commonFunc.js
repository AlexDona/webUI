/**
 * 和业务逻辑相关的全局方法
 */
import {
  repealMyEntrustAjax
} from '../utils/api/trade'
import {
  userRefreshUser,
  getQueryAllOrdersList,
  statusSecurityCenter,
  accountPaymentTerm
  // modificationAccountPaymentTerm
} from '../utils/api/personal'

import {
  sendMsgByPhoneOrEmial
  // sendByPhoneOrEmial
} from '../utils/api/user'
import {
  addUserCollectionAjax,
  removeCollectionAjax,
  getCollectionListAjax
} from '../utils/api/home'
import {
  getCountryList,
  getServiceProtocoDataAjax,
  getTransitionCurrencyRateAjax,
  getFooterInfo1,
  getFooterInfo2,
  getConfigAjax,
  getLanguageList
} from '../utils/api/header'
import store from '../vuex'
import {
  removeStore,
  getStore,
  setStore,
  getStoreWithJson,
  keep2Num
} from './index'
import {PHONE_REG, EMAIL_REG, ID_REG, PWD_REG, ALIPAY_REG, BANK_REG, GOOGLE_REG, TPED_REG, URL_REG, WITHDRAWAL_REG} from './regExp'
// 请求接口后正确或者错误的提示提示信息：
// 如果返回 错误 了就提示错误并不能继续往下进行；
// 如果返回了 正确 的数据：不需要正确的提示noTip传0；需要正确的提示noTip传1；
// 使用方法：returnAjaxMessage(data, this, 0) 或者 returnAjaxMessage(data, this, 1)
export const returnAjaxMessage = (data, self, noTip, errorTip) => {
  const meta = data.data.meta
  if (meta) {
    if (!meta.success && !errorTip) {
      if (meta.code !== 500) {
        self.$message({
          type: 'error',
          // duration: 5000000,
          message: (!meta.params || !meta.params.length) ? self.$t(`M.${meta.i18n_code}`) : self.$t(`M.${meta.i18n_code}`).format(meta.params)
        })
      }
      // 登录失效
      switch (meta.code) {
        case 401:
          removeStore('loginStep1Info')
          self.$router.push({path: '/login'})
          store.commit('user/USER_LOGOUT')
          break
        case 500:
          // self.$router.push({path: '/500'})
          break
      }
      return 0
    } else {
      if (noTip) {
        self.$message({
          type: 'success',
          message: self.$t(`M.${meta.i18n_code}`)
        })
      }
      return 1
    }
  }
}
/**
 * 用户输入验证
 * @param type : 验证类型： phone email ID-card password alipay bank-card google
 * @param targetNum 目标输入号码
 * @returns {number} 0：正确 1： 未输入 2：不正确
 */
export const validateNumForUserInput = (type, targetNum) => {
  console.log(type)
  console.log(targetNum)
  let returnNum = 0
  let validateType
  switch (type) {
    case 'phone':
      validateType = PHONE_REG
      break
    case 'email':
      validateType = EMAIL_REG
      break
    case 'ID-card':
      validateType = ID_REG
      break
    case 'password':
      validateType = PWD_REG
      break
    case 'alipay':
      validateType = ALIPAY_REG
      break
    case 'bank-card':
      validateType = BANK_REG
      break
    case 'google':
      validateType = GOOGLE_REG
      break
    case 'tran-password':
      validateType = TPED_REG
      break
    case 'url-address':
      validateType = URL_REG
      break
    case 'withdrawal-address':
      validateType = WITHDRAWAL_REG
      break
  }

  if (!targetNum) {
    returnNum = 1
  } else if (!validateType.test(targetNum)) {
    returnNum = 2
  } else {
    returnNum = 0
  }

  console.log(returnNum)
  return returnNum
}
// api 发送验证码（短信、邮箱）
export const sendPhoneOrEmailCodeAjax = async (type, params, that, isNewPhone = 0, callback) => {
  const data = await sendMsgByPhoneOrEmial(type, params)
  if (!returnAjaxMessage(data, that)) {
    return false
  } else {
    switch (type) {
      case 0:
        store.commit('user/SET_USER_BUTTON_STATUS', {
          loginType: 0,
          type: isNewPhone,
          status: true
        })
        break
      case 1:
        store.commit('user/SET_USER_BUTTON_STATUS', {
          loginType: 1,
          type: isNewPhone,
          status: true
        })
        break
    }
    if (callback) {
      callback(data)
    }
  }
}
/**
 * 撤销委单
 */
export const repealMyEntrustCommon = async (params, that, callback) => {
  const data = await repealMyEntrustAjax(params)
  if (!returnAjaxMessage(data, that, 1)) {
    return false
  } else {
    callback(data)
  }
}

// /**
//  * 商家订单列表请求
//  */
export const getMerchantsOrdersList = async (params, callback) => {
  const repealData = await getQueryAllOrdersList(params)
  callback(repealData)
}

// 法币交易分页切换
export const changeCurrentPageForLegalTrader = (currentPage, type, that) => {
  that.CHANGE_LEGAL_PAGE({
    legalTradePageNum: currentPage
  })
  that.SET_LEGAL_TENDER_REFLASH_STATUS({
    type,
    status: true
  })
}
// 获取国家列表
export const getCountryListAjax = async (that, callback) => {
  let localCountry = getStoreWithJson('countryList')
  let saveTimeStamp = getStore('timeStamp')
  let nowTimeStamp = new Date().getTime()
  let diffTime = Math.abs(nowTimeStamp - saveTimeStamp)
  let data
  if (localCountry && diffTime < 86400000) {
    data = localCountry
    that.SET_COUNTRY_AREA_LIST(data)
    return false
  } else {
    data = await getCountryList()
    if (!returnAjaxMessage(data, that)) {
      return false
    } else {
      that.SET_COUNTRY_AREA_LIST(data.data.data)
      setStore('countryList', data.data.data)
      setStore('timeStamp', new Date().getTime())
      if (callback) {
        callback(data)
      }
    }
  }
}
// 服务条款接口
export const getServiceProtocolData = async (that, params, callback) => {
  const data = await getServiceProtocoDataAjax(params)
  if (!returnAjaxMessage(data, that)) {
    return false
  } else {
    callback(data)
  }
}
/**
 *  刷新用户信息
 */
export const reflashUserInfo = async (that) => {
  console.log(store)
  const data = await userRefreshUser({
    token: store.state.user.loginStep1Info.token
  })
  if (!(returnAjaxMessage(data, that))) {
    return false
  } else {
    store.commit('user/SET_STEP1_INFO', data.data.data)
  }
}
/**
 *  刷新用户安全状态
 */
export const getSecurityCenter = async (that, params, callback) => {
  console.log(store)
  const data = await statusSecurityCenter(params)
  if (!(returnAjaxMessage(data, that))) {
    return false
  } else {
    callback(data)
  }
}
/**
 *  刷新收款方式状态
 */
export const getAccountPaymentTerm = async (that, callback) => {
  console.log(store)
  const data = await accountPaymentTerm({})
  if (!(returnAjaxMessage(data, that))) {
    return false
  } else {
    callback(data)
  }
}
// 首页、币币交易切换收藏
export const toggleUserCollection = async (type, tradeId, that) => {
  const params = {
    tradeId
  }
  let data
  if (type === 'add') {
    data = await addUserCollectionAjax(params)
  } else if (type === 'remove') {
    data = await removeCollectionAjax(params)
  }
  if (!returnAjaxMessage(data, that)) {
    return false
  }
}

// 获取用户收藏列表
export const getCollectionList = async (that, callback) => {
  const data = await getCollectionListAjax()
  if (!returnAjaxMessage(data, that)) {
    return false
  } else {
    callback(data)
  }
}
// 协议跳转
export const jumpToOtherPageForFooter = (router, activeName, that) => {
  that.$router.push({path: router})
  that.$store.commit('footerInfo/CHANGE_FOOTER_ACTIVENAME', {
    activeName,
    type: router
  })
}

// 首页、币币交易页面socket数据替换
// socket数据替换
export const setSocketData = (oldContent, newContent, targetList, targetIndex, that) => {
  oldContent.buy = newContent.buy
  oldContent.chg = newContent.chg // 涨幅
  oldContent.high = newContent.high
  oldContent.kai = newContent.kai
  oldContent.last = newContent.last // 最新价
  oldContent.low = newContent.low
  oldContent.sell = newContent.sell
  oldContent.triduumSampling = newContent.triduumSampling // 趋势
  oldContent.vol = newContent.vol
  oldContent.vol24hour = newContent.vol24hour
  that.$set(targetList, targetIndex, oldContent)
}
// 首页获取目标汇率
// 获取目标汇率
export const getTransitionCurrencyRate = async (params, that, activeConvertCurrencyObj) => {
  const data = await getTransitionCurrencyRateAjax(params)
  console.log(data)
  if (!returnAjaxMessage(data, that)) {
    return false
  } else {
    that.CHANGE_CURRENCY_RATE_LIST({
      currencyRateList: data.data.data,
      activeConvertCurrencyObj: activeConvertCurrencyObj
    })
  }
}
export const getLanguageListAjax = async (that, language) => {
  const data = await getLanguageList()
  if (!returnAjaxMessage(data, that)) {
    return false
  } else {
    that.languageList = data.data.data
    let localLanguage = language || getStore('language') || store.state.common.defaultLanguage
    console.log(localLanguage)
    _.forEach(that.languageList, item => {
      if (item.shortName === localLanguage) {
        console.log(item)
        store.commit('common/CHANGE_LANGUAGE', item)
        return false
      }
    })
  }
}
// 获取底部信息
export const getFooterInfo = async (language, that) => {
  const params = {
    language
  }
  const data1 = await getFooterInfo1(params)
  const data2 = await getFooterInfo2(params)
  const data3 = await getConfigAjax()

  if (
    !returnAjaxMessage(data1, that) &&
    !returnAjaxMessage(data2, that) &&
    !returnAjaxMessage(data3, that)
  ) {
    return false
  } else {
    console.log(data1)
    console.log(data2)
    console.log(data3) // 包含公司名称、邮箱等信息
    let footerInfo1 = data1.data.data
    let footerInfo2 = data2.data.data
    let configInfo = data3.data.data
    that.SET_FOOTER_INFO({
      footerInfo1,
      footerInfo2,
      configInfo
    })
    // favicon 添加
    addFavicon(
      footerInfo1.headTitleLogo,
      footerInfo1.title
    )
    that.$store.commit('common/SET_LOGO_URL', {
      logoSrc: footerInfo1.headLogo,
      title: footerInfo1.title
    })
  }
}
// 动态添加favicon
export const addFavicon = (href, title) => {
  // 动态生成favicon
  let link = document.querySelector("link[rel*='icon']") || document.createElement('link')
  link.type = 'image/x-icon'
  link.rel = 'shortcut icon'
  link.href = href
  document.getElementsByTagName('head')[0].appendChild(link)
  document.querySelector('title').innerText = title
}
// 成交量格式化
export const formatCount = (targetNum) => {
  let newNum = targetNum - 0
  switch (store.state.common.language) {
    case 'zh_CN':
      if (newNum > 100000000) {
        newNum = keep2Num(newNum / 100000000) + '亿'
      } else if (newNum > 10000) {
        newNum = keep2Num(newNum / 10000) + '万'
      }
      return newNum
    default :
      if (newNum > 1000000) {
        newNum = keep2Num(newNum / 1000000) + 'M'
      } else if (newNum > 1000) {
        newNum = keep2Num(newNum / 1000) + 'K'
      }
      return newNum
  }
}
// eslint-disable-next-line
String.prototype.format = function (args) {
  var result = this
  const arr = result.split('')
  let newArr = ''
  if (args.length) {
    _.forEach(arr, item => {
      newArr += item
      if (item === '{') {
        newArr += '0'
      }
    })
  }
  result = newArr
  if (arguments.length > 0) {
    if (arguments.length == 1 && !Array.isArray(args)) {
      for (var key in args) {
        if (args[key] != undefined) {
          let reg = new RegExp('({' + key + '})', 'g')
          console.log(reg)
          result = result.replace(reg, args[key])
        }
      }
    } else {
      for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] != undefined) {
          let reg = new RegExp('({)' + i + '(})', 'g')
          result = result.replace(reg, arguments[i])
        }
      }
    }
  }
  return result
}
