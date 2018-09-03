/**
 * api接口文档
 * */
import {post, get, put, postWithURLencoded} from './axios'

export const changeLang = (params) => {
  return postWithURLencoded('real/switchlan', params)
}

export const getCnyRate = () => get('real/CNYRate', {})

/**
 *OTC
 */
// otc可用币种查询：我要购买/我要出售的币种列表
export const getOTCAvailableCurrency = (params) => get('otcCOin/getAvailOTCCoins', params)
// otc主页面查询otc挂单列表
export const getOTCPutUpOrders = (params) => get('otcEntrust/selectByParams', params)
// 查询用户所有otc挂单列表（分页）:也就是订单中的 委托中的订单
export const getOTCEntrustingOrders = (params) => get('otcEntrust/selectEntrustsPage', params)
// 查询3天内用户otc各状态交易---otc订单中 交易中 的订单
export const getOTCTradingOrders = (params) => get('otcOrder/selectUserOrdersIn3Day', params)
// 查询3天内用户otc各状态交易---otc订单中 已完成 的订单
export const getOTCCompletedOrders = (params) => get('otcOrder/selectUserOrdersIn3Day', params)
// 查询3天内用户otc各状态交易---otc订单中 已取消 的订单
export const getOTCCanceledOrders = (params) => get('otcOrder/selectUserOrdersIn3Day', params)
// 查询3天内用户otc各状态交易---otc订单中 冻结中 的订单
export const getOTCFrezzingOrders = (params) => get('otcOrder/selectUserOrdersIn3Day', params)
// 添加otc挂单(商家与普通用户都可用)
export const addOTCPutUpOrders = (params) => postWithURLencoded('otcEntrust/addOtcEntrustForCommon', params)
// 添加otc挂单(仅商家可用)
export const addOTCPutUpOrdersMerchantdedicated = (params) => postWithURLencoded('otcEntrust/addOtcEntrustForMerch', params)
// otc摘单买入
export const pickOrdersToBuy = (params) => postWithURLencoded('otcOrder/pickEntrustBuy', params)
// otc摘单卖出
export const pickOrdersToSell = (params) => postWithURLencoded('otcOrder/pickEntrustSell', params)
// 查询otc挂单详情-商家和普通用户通用
export const querySelectedOrdersDetails = (params) => get('otcEntrust/selectUserEntrustDetail', params)
// 查询otc挂单用户交易币种手续费率以及币种详情
export const queryUserTradeFeeAndCoinInfo = (params) => get('otcCOin/getUserTradeFeeAndCoinInfo', params)
// otc广告管理一键撤销用户所有挂单--商家专用
export const cancelAllOrdersOnekey = (params) => get('otcEntrust/cancelAllEntrusts', {})
// otc交易中订单，otc买家确认付款
export const buyerPayForOrder = (params) => postWithURLencoded('otcOrder/payForOrder', params)
/**
 * 币币交易
 */
/**
 * 投资理财
 */
/**
 * 活动中心
 */
/**
 * 个人中心
 */
/**
 * 我的资产
 */
// 我的资产币种列表
export const assetCurrenciesList = (params) => get('personal/getUserFinanceList', params)
// 查询充币地址
export const inquireRechargeAddressList = (params) => get('personal/getRechargeAddress', params)
// 提币地址列表查询
export const inquireWithdrawalAddressList = (params) => get('personal/getWithdrawAddress', params)
// 新增用户提币地址
export const addNewWithdrawalAddress = (params) => post('personal/addWithdrawAddress', params)
// 提币地址删除
export const deleteUserWithdrawAddress = (params) => put('personal/deleteUserWithdrawAddress', params)
// 账单明细—冲提记录
export const statusRushedToRecordList = (params) => get('queryWithdrawRecording', params)
// 提币
export const statusSubmitWithdrawButton = (params) => post('addWithdraw', params)
/**
 * 实名认证
 * */
// 查询国家列表
export const queryCountryList = (params) => get('country/selectList', params)
// 提交实名认证
export const submitRealNameAuthentication = (params) => postWithURLencoded('user/center/realNameAuth', params)
// 提交高级认证
export const submitSeniorCertification = (params) => postWithURLencoded('user/center/advancedAuth', params)
//  获取用户实名信息
export const realNameInformation = (params) => get('user/center/userauth', params)
/**
 * 安全中心
 * */
// 安全中心
export const statusSecurityCenter = (params) => get('user/security/index', params)
// 绑定邮箱
export const bindEmailAddress = (params) => postWithURLencoded('user/security/bindMail', params)
// 绑定手机
export const bindPhoneAddress = (params) => postWithURLencoded('user/security/bindPhone', params)
// 绑定谷歌页面
export const bindGoogleAddressPage = (params) => get('user/security/bindGoogle', params)
// 绑定谷歌
export const bindGoogleAddress = (params) => postWithURLencoded('user/security/bindGoogle', params)
// 交易区列表查询
export const getEntrustSelectBox = (params) => get('queryEntrustSelectBox', params)
/**
 * push资产
 * */
// push资产记录列表/push币种列表/默认余额total
export const getPushAssetList = (params) => get('push/getPushList', params)
// push根据币种id获取可用余额
export const getPushTotalByCoinId = (params) => get('push/getTotalByCoinId', params)
// push资产提交
export const pushAssetsSubmit = (params) => post('push/pushSub', params)
// push资产撤销
export const revocationPushProperty = (params) => put('push/pushCancel', params)
// push资产成交
export const pushPropertyTransaction = (params) => put('push//pushPay', params)
// push短信发送接口
export const sendMsgByPushPhoneOrEmial = (type, params) => {
  let result
  switch (type) {
    // 短信验证码
    case 0:
      result = get('push/sendSMS', params)
      break
    // 邮箱验证码
    case 1:
      result = get('push/sendMail', params)
      break
  }
  return result
}
/**
 * 头部
 */
// 查询某商户可用法币币种列表
export const getMerchantAvailablelegalTender = (params) => get('otcCOin/getAvailCurrencyCoins', params)

/**
/**
 * User
 */
export const testAjax = (params) => postWithURLencoded('user/test', params)
// 发送邮件
// export const sendMsgByEmailUser = (params) => postWithURLencoded('user/sendMail', params)
/**
 * 发送短信、邮箱 验证码
 * @param type: 发送类型：0：手机验证码 1:邮箱验证码
 * @param params ： 参数
 * @returns {*}
 */
export const sendMsgByPhoneOrEmial = (type, params) => {
  let result
  switch (type) {
    // 短信验证码
    case 0:
      result = postWithURLencoded('user/sendSms', params)
      break
    // 邮箱验证码
    case 1:
      result = postWithURLencoded('user/sendMail', params)
      break
  }
  return result
}
// 检测用户是否存在
export const checkUserExist = (params) => postWithURLencoded('user/checkUserExist', params)
// 用户注册
export const sendRegisterUser = (params) => postWithURLencoded('user/reg', params)
// 用户登录第一步
export const userLoginForStep1 = (params) => postWithURLencoded('user/userLoginForStep1', params)
// 用户登录第二步
export const userLoginForStep2 = (params) => postWithURLencoded('user/userLoginForStep2', params)
/**
 * 币币交易
 */
// 新增委单
export const saveEntrustTrade = (params) => post('saveEntrust', params)
// 我的委托单
export const getMyEntrust = (params) => get('queryMyEntrust', params)
// 历史委单
export const getHistoryEntrust = (params) => get('queryMyHisEntrust', params)
// 撤销当前委单
export const repealMyEntrustAjax = (params) => put('cancelEntrust', params)
