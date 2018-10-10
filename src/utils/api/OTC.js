import {get, postWithURLencoded, post} from './axios'
/**
 *OTC
 */
// 查询某商户可用法币币种列表
export const getMerchantAvailablelegalTender = (params) => get('otcCOin/getAvailCurrencyCoins', params)
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
// 查询otc挂单撤销
export const querySelectedOrdersRevocation = (params) => postWithURLencoded('otcEntrust/cancelOtcEntrust', params)
// 查询otc挂单用户交易币种手续费率以及币种详情
export const queryUserTradeFeeAndCoinInfo = (params) => get('otcCOin/getUserTradeFeeAndCoinInfo', params)
// otc广告管理一键撤销用户所有挂单--商家专用
export const cancelAllOrdersOnekey = (params) => postWithURLencoded('otcEntrust/cancelAllEntrusts', {params})
// otc交易中订单，otc买家确认付款
export const buyerPayForOrder = (params) => postWithURLencoded('otcOrder/payForOrder', params)
// otc交易中订单， otc卖家确认收款
export const sellerConfirmGetMoney = (params) => postWithURLencoded('otcOrder/confirmReceiveForOrder', params)
// otc交易中订单， otc卖家申诉
export const sellerSendAppeal = (params) => postWithURLencoded('otcAppeal/applyOtcAppeal', params)
// 提交otc商家申请
export const businessApply = (params) => postWithURLencoded('otcMerchApply/applyOTCMerch', params)
// 首次进入otc商家申请页面
export const firstEnterBusinessApply = (params) => get('otcMerchApply/getUserMerchInfo', params)
// 商家申请页面点击用户协议
export const argumentBusinessApply = (params) => get('cms/terms/selectAll', params)
// 广告管理列表请求
export const getOTCADManageApplyList = (params) => get('otcEntrust/selectMerchEntrustsPage', params)
// 商家订单列表请求
export const getOTCMerchantsOrdersList = (params) => get('otcOrder/selectMerchOrdersPage', params)
// 查询用户现有支付方式
export const queryUserPayTypes = (params) => get('otcCOin/getUserPayTypes', params)
// 报表统计
export const getOTCReportFormStatisticsData = (params) => get('otcOrder/selectMerchStatics', params)
//  汇率转换
export const getOTCChangeRate = (params) => get('otcCOin/changeRate', params)
//  币种详情：商家和普通用户挂单页面请求币种详情渲染页面
export const getOTCCoinInfo = (params) => get('otcCOin/getCoinInfo', params)
// 投资理财请求数据
export const getFinancialManagement = (params) => get('financialManagement', params)
// 投资理财立投资请求接口
export const imediateInvestment = (params) => post('financialManagement', params)
// 投资理财取消投资接口
export const cancleInvestment = (params) => get(`financialManagement/${params}`)
// 投资理财添加理财记录接口
export const getFinancialRecord = (params) => get('financialManagement/recordInfo', params)
// 撤销otc用户定单（过期买家未付款）
export const cancelUserOtcOrder = (params) => post('otcOrder/cancelUserOtcOrder', params)
// 成交otc用户定单（过期卖家未收款）
export const completeUserOtcOrder = (params) => post('otcOrder/completeUserOtcOrder', params)
