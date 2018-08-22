/**
 * api接口文档
 * */
import {post, get} from './axios'

export const changeLang = (params) => {
  return post('real/switchlan', params)
}

export const getCnyRate = () => get('real/CNYRate', {})

// 1.0 OTC 模块接口
// 1.01 otc可用币种查询：我要购买/我要出售的币种列表
export const getOTCAvailableCurrency = (params) => get('otcCOin/getAvailOTCCoins', params)
// 1.02 otc主页面查询otc挂单列表
export const getOTCPutUpOrders = (params) => get('otcEntrust/selectByParams', params)
// 1.03 查询用户所有otc挂单列表（分页）:也就是订单中的 委托中的订单
export const getOTCEntrustingOrders = (params) => get('otcEntrust/selectEntrustsPage', params)
// 1.04 查询3天内用户otc各状态交易---otc订单中 交易中 的订单
// export const getOTCTradingOrders = (params) => get('selectUserOrdersIn3Day', params)
// 1.05 查询3天内用户otc各状态交易---otc订单中 已完成 的订单
// export const getOTCCompletedOrders = (params) => get('selectUserOrdersIn3Day', params)
// 1.06 查询3天内用户otc各状态交易---otc订单中 已取消 的订单
// export const getOTCCanceledOrders = (params) => get('selectUserOrdersIn3Day', params)
// 1.07 查询3天内用户otc各状态交易---otc订单中 冻结中 的订单
export const getOTCFrezzingOrders = (params) => get('selectUserOrdersIn3Day', params)
// 1.08 添加otc挂单
export const addOTCPutUpOrders = (params) => post('otcEntrust/addOtcEntrustForCommon', params)
// 2.0 币币交易 模块接口
// 3.0 投资理财 模块接口
// 4.0 活动中心 模块接口
// 5.0 个人中心 模块接口
// 6.0 头部     模块接口
// 6.01 查询某商户可用法币币种列表
export const getMerchantAvailablelegalTender = (params) => get('otcCOin/getAvailCurrencyCoins', params)
