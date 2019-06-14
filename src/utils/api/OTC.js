import {get, postWithURLencoded, post} from './axios'
import {handleRequest} from '../commonFunc'

/**
 *OTC
 */
// 1.0 查询某商户可用法币币种列表
export const getMerchantAvailableLegalTender = (params) => handleRequest(() => get('otcCOin/getAvailCurrencyCoins', params))
// 2.0 otc可用币种查询：我要购买/我要出售的币种列表
export const getOTCAvailableCurrency = (params) => handleRequest(() => get('otcCOin/getAvailOTCCoins', params))
// 3.0 otc主页面查询otc挂单列表
export const getOTCPutUpOrders = (params) => handleRequest(() => get('otcEntrust/selectByParams', params))
// 4.0 查询用户所有otc挂单列表（分页）:也就是订单中的 委托中的订单
export const getOTCEntrustingOrders = (params) => handleRequest(() => get('otcEntrust/selectEntrustsPage', params))
// 5.0 查询3天内用户otc各状态交易订单
export const getOTCOrdersThreeDay = (params) => handleRequest(() => get('otcOrder/selectUserOrdersIn3Day', params))
// 6.0 添加otc挂单(商家与普通用户都可用)
// export const addOTCPutUpOrders = (params) => handleRequest(() => postWithURLencoded('otcEntrust/addOtcEntrustForCommon', params), 1)
export const addOTCPutUpOrders = (params) => handleRequest(() => postWithURLencoded('otcEntrust/addOtcEntrustForCommon', params), 1)
// 7.0 添加otc挂单(仅商家可用)
// export const addOTCPutUpOrdersMerchantDedicated = (params) => handleRequest(() => postWithURLencoded('otcEntrust/addOtcEntrustForMerch', params), 1)
export const addOTCPutUpOrdersMerchantDedicated = (params) => handleRequest(() => postWithURLencoded('otcEntrust/addOtcEntrustForMerch', params), 1)
// 8.0 otc摘单买入
// export const pickOrdersToBuy = (params) => handleRequest(() => postWithURLencoded('otcOrder/pickEntrustBuy', params), 1)
export const pickOrdersToBuy = (params) => handleRequest(() => postWithURLencoded('otcOrder/pickEntrustBuy', params), 1)
// 9.0 otc摘单卖出
// export const pickOrdersToSell = (params) => handleRequest(() => postWithURLencoded('otcOrder/pickEntrustSell', params), 1)
export const pickOrdersToSell = (params) => handleRequest(() => postWithURLencoded('otcOrder/pickEntrustSell', params), 1)
// 10 查询otc挂单详情-商家和普通用户通用
// export const querySelectedOrdersDetails = (params) => handleRequest(() => get('otcEntrust/selectUserEntrustDetail', params))
export const querySelectedOrdersDetails = (params) => handleRequest(() => get('otcEntrust/selectUserEntrustDetail', params))
// 11 查询otc挂单撤销
export const querySelectedOrdersRevocation = (params) => handleRequest(() => postWithURLencoded('otcEntrust/cancelOtcEntrust', params), 1)
// 12 查询otc挂单用户交易币种手续费率以及币种详情
// export const queryUserTradeFeeAndCoinInfo = (params) => handleRequest(() => get('otcCOin/getUserTradeFeeAndCoinInfo', params))
export const queryUserTradeFeeAndCoinInfo = (params) => handleRequest(() => get('otcCOin/getUserTradeFeeAndCoinInfo', params))
// 13 otc广告管理一键撤销用户所有挂单--商家专用
export const cancelAllOrdersOnekey = (params) => handleRequest(() => postWithURLencoded('otcEntrust/cancelAllEntrusts', params), 1)
// 14 otc交易中订单，otc买家确认付款
export const buyerPayForOrder = (params) => handleRequest(() => postWithURLencoded('otcOrder/payForOrder', params), 1)
// 15 otc交易中订单， otc卖家确认收款
export const sellerConfirmGetMoney = (params) => handleRequest(() => postWithURLencoded('otcOrder/confirmReceiveForOrder', params), 1)
// 16 otc交易中订单， otc卖家申诉
export const sellerSendAppeal = (params) => handleRequest(() => postWithURLencoded('otcAppeal/sellerApplyOtcAppeal', params), 1)
// 16 otc交易中订单， otc买家申诉
export const buyerSendAppeal = (params) => handleRequest(() => postWithURLencoded('otcAppeal/buyerApplyOtcAppeal', params), 1)
// 17 提交otc商家申请
// export const businessApply = (params) => handleRequest(() => postWithURLencoded('otcMerchApply/applyOTCMerch', params), 1)
export const businessApply = (params) => handleRequest(() => postWithURLencoded('otcMerchApply/applyOTCMerch', params), 1)
// 18 首次进入otc商家申请页面
// export const firstEnterBusinessApply = (params) => handleRequest(() => get('otcMerchApply/getUserMerchInfo', params))
export const firstEnterBusinessApply = (params) => handleRequest(() => get('otcMerchApply/getUserMerchInfo', params))
// 19 商家申请页面点击用户协议
// export const argumentBusinessApply = (params) => handleRequest(() => get('cms/terms/selectAll', params))
export const argumentBusinessApply = (params) => handleRequest(() => get('cms/terms/selectAll', params))
// 20 广告管理列表请求
export const getOTCADManageApplyList = (params) => handleRequest(() => get('otcEntrust/selectMerchEntrustsPage', params))
// 21 商家订单列表请求
export const getOTCMerchantsOrdersList = (params) => handleRequest(() => get('otcOrder/selectMerchOrdersPage', params))
// 22 报表统计
// export const getOTCReportFormStatisticsData = (params) => handleRequest(() => get('otcOrder/selectMerchStatics', params))
export const getOTCReportFormStatisticsData = (params) => handleRequest(() => get('otcOrder/selectMerchStatics', params))
// 23 币种详情：商家和普通用户挂单页面请求币种详情渲染页面
export const getOTCCoinInfo = (params) => handleRequest(() => get('otcCOin/getCoinInfo', params))
// 24 撤销otc用户定单（过期买家未付款）
export const cancelUserOtcOrder = (params) => handleRequest(() => post('otcOrder/cancelUserOtcOrder', params))
// 25 成交otc用户定单（过期卖家未收款）
export const completeUserOtcOrder = (params) => handleRequest(() => post('otcOrder/completeUserOtcOrder', params))
// 26 广告管理中订单点击修改跳转到商家专用发布广告页面，修改数据后再发布广告调取的接口
export const addModifyPublishADOrder = (params) => handleRequest(() => postWithURLencoded('otcEntrust/upShelfOtcEntrust', params), 1)
// 27 校验otc普通用户是否能挂单
export const getCommonPutUpOrderStatus = (params) => handleRequest(() => get('otcEntrust/otcCommonFlag', params))
// 28  增加国家-查询法币联动国家列表
export const getCurrencyCountrys = (params) => handleRequest(() => get('otcCOin/getCurrencyCountrys', params))
