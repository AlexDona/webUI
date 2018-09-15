import {post, get, put} from './axios'
/**
 * 币币交易
 */
// 新增委单
export const saveEntrustTrade = (params) => post('saveEntrust', params)
// 我的委托单
export const getMyEntrust = (params) => get('queryMyEntrust', params)
// 历史委单
export const getHistoryEntrust = (params) => get('queryMyHisEntrust', params)
// 成交明细
export const getMakeDetail = (params) => get('queryMyEntrustOrder', params)
// 撤销当前委单
export const repealMyEntrustAjax = (params) => put('cancelEntrust', params)
// 全球行情
// params 格式： ETH_BTC
export const getGLobalMarket = (params) => get(`market3rd/${params}`)
// 交易区信息
export const getPartnerAreaList = (params) => get('queryPartnerArea', params)
// 默认交易对
export const getDefaultSymbol = () => get('trade/default')
// 获取用户默认交易对资产
export const getUserAssetOfActiveSymbol = (params) => get('push/getTotalByTradeId', params)
