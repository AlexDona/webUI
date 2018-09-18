/**
 * 和业务逻辑相关的全局方法
 */
import {
  repealMyEntrustAjax
} from '../utils/api/trade'
import {
  assetCurrenciesList,
  statusSecurityCenter,
  getQueryAllOrdersList
} from '../utils/api/personal'
// import {
//   sendMsgByPushPhoneOrEmial
// } from '../utils/api/personal'
import {
  sendMsgByPhoneOrEmial
} from '../utils/api/user'
import {
  getPartnerList
} from '../utils/api/home'
import {
  getCountryList,
  getServiceProtocoDataAjax
} from '../utils/api/header'
import {PHONE_REG, EMAIL_REG, ID_REG, PWD_REG, ALIPAY_REG, BANK_REG, GOOGLE_REG} from './regExp'
// import {
//   CHANGE_CANCELED_ORDERS_LIST,
//   CHANGE_COMPLETED_ORDERS_LIST,
//   CHANGE_ENTRUST_ORDERS_LIST,
//   CHANGE_FROZEN_ORDERS_LIST,
//   CHANGE_MERCHANTS_ORDERS_LIST
// } from "../vuex/Personal/mutations-types";
// 请求接口后正确或者错误的提示提示信息：
// 如果返回 错误 了就提示错误并不能继续往下进行；
// 如果返回了 正确 的数据：不需要正确的提示noTip传0；需要正确的提示noTip传1；
// 使用方法：returnAjaxMessage(data, this, 0) 或者 returnAjaxMessage(data, this, 1)
export const returnAjaxMessage = (data, self, noTip) => {
  const meta = data.data.meta
  if (meta.code !== 200) {
    self.$message({
      type: 'error',
      message: self.$t(`M.${meta.i18n_code}`)
    })
    return 0
  } else {
    if (noTip) {
      self.$message({
        type: 'success',
        // duration: 5000000,
        message: self.$t(`M.${meta.i18n_code}`)
      })
    }
    return 1
  }
}
/**
 * 用户输入验证
 * @param type : 验证类型： phone email ID-card password alipay bank-card google
 * @param targetNum 目标输入号码
 * @returns {number} 0：正确 1： 未输入 2：不正确
 */
export const validateNumForUserInput = (type, targetNum) => {
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
  }
  if (!targetNum) {
    returnNum = 1
  } else if (!validateType.test(targetNum)) {
    returnNum = 2
  }
  return returnNum
}
// 发送验证码（短信、邮箱）
export const sendPhoneOrEmailCodeAjax = async (type, params, callback) => {
  const data = await sendMsgByPhoneOrEmial(type, params)
  callback(data)
}
/**
 * 撤销委单
 */
export const repealMyEntrustCommon = async (params, callback) => {
  const repealData = await repealMyEntrustAjax(params)
  callback(repealData)
}
/**
 * 安全中心状态
 */
export const stateSafeCentral = async (params, callback) => {
  const repealData = await statusSecurityCenter(params)
  callback(repealData)
}
// /**
//  * 商家订单列表请求
//  */
export const getMerchantsOrdersList = async (params, callback) => {
  const repealData = await getQueryAllOrdersList(params)
  callback(repealData)
}
/**
 * 个人资产信息
 * 币种
 * 总数量
 * 冻结数量
 * 可用数量 = 总数量 + 冻结数量
 */
export const globalPersonalAssetsInformation = async (params, callback) => {
  const assetData = await assetCurrenciesList(params)
  callback(assetData)
}
// socket 请求类型参数分割
export const splitSocketParams = (params) => {
  // console.log(params)
  let resultArr = []
  if (params.rep) {
    resultArr = params.rep.split('.')
  } else if (params.sub) {
    resultArr = params.sub.split('.')
  }
  return resultArr
}
// 获取板块信息
export const getPartnerListAjax = async (params, callback) => {
  const data = await getPartnerList(params)
  callback(data)
}

// 封装全部请求方法
export const getAllList = async (params, callback) => {
  const data = await getMerchantsOrdersList(params)
  callback(data)
  // Promise.all([
  //   getMerchantsOrdersList('c2cOrderSublist', message)
  // ]).then((res) => {
  //   store.commit('CHANGE_MERCHANTS_ORDERS_LIST', res[0].data.data) // 交易中订单
  //   store.commit('CHANGE_COMPLETED_ORDERS_LIST', res[1].data.data) // 已完成订单
  //   store.commit('CHANGE_CANCELED_ORDERS_LIST', res[2].data.data) // 已取消订单
  //   store.commit('CHANGE_FROZEN_ORDERS_LIST', res[3].data.data) // 冻结中的订单
  //   store.commit('CHANGE_ENTRUST_ORDERS_LIST', res[4].data.data) // 委托订单
  // })
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
export const getCountryListAjax = async (that, callback) => {
  const data = await getCountryList()
  if (!returnAjaxMessage(data, that)) {
    return false
  } else {
    callback(data)
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
