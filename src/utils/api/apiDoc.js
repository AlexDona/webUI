/**
 * api接口文档
 * */
import {post, get, postWithURLencoded} from './axios'

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
// export const getOTCTradingOrders = (params) => get('selectUserOrdersIn3Day', params)
// 查询3天内用户otc各状态交易---otc订单中 已完成 的订单
// export const getOTCCompletedOrders = (params) => get('selectUserOrdersIn3Day', params)
// 查询3天内用户otc各状态交易---otc订单中 已取消 的订单
// export const getOTCCanceledOrders = (params) => get('selectUserOrdersIn3Day', params)
// 查询3天内用户otc各状态交易---otc订单中 冻结中 的订单
export const getOTCFrezzingOrders = (params) => get('selectUserOrdersIn3Day', params)
// 添加otc挂单
export const addOTCPutUpOrders = (params) => post('otcEntrust/addOtcEntrustForCommon', params)
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
 * 头部
 */
// 查询某商户可用法币币种列表
export const getMerchantAvailablelegalTender = (params) => get('otcCOin/getAvailCurrencyCoins', params)

/**
 * User
 */
// 发送短信验证码
export const sendMsgByPhoneUser = (params) => postWithURLencoded('user/sendSms', params)
// 用户注册
export const sendRegisterUser = (params) => postWithURLencoded('user/reg', params)

/**
 * 币币交易
 */
// 新增委单
export const saveEntrustTrade = (params) => post('saveEntrust', params)
// 我的委托单
export const getMyEntrust = (params) => post('saveEntrust', params)
