import {post, get, put} from './axios'

/**
 * 币币交易
 */
// 新增委单
export const saveEntrustTrade = params => post('saveEntrust', Object.assign({'loading': true}, params))
// 我的委托单
export const getMyEntrust = (params) => get('queryMyEntrust', params)
// 历史委单
export const getHistoryEntrust = (params) => get('queryMyHisEntrust', params)
// 成交明细
export const getMakeDetail = (params) => get('queryMyEntrustOrder', params)
// 撤销当前委单
export const repealMyEntrustAjax = (params) => put('cancelEntrust', Object.assign({'loading': true}, params))
// 全球行情
// params 格式： ETH_BTC
export const getGlobalMarket = (params) => get(`market3rd/${params}`)
// 默认交易对
export const getDefaultSymbol = params => get('trade/default', params)
// 获取用户默认交易对资产
export const getUserAssetOfActiveSymbol = (params) => get('push/getTotalByTradeId', params)
// 获取当前交易对信息
export const getActiveSymbolDataAjax = (params) => get('market/bbMarket/market', params)
// 获取币币交易市场
export const getTradeMarketDataAjax = (params) => get('market/bbMarket/ticker', params)
// 获取K线接口
export const getKlineDataAjax = (params) => get('market/kline', params)
// 撤销所有委单
export const cancelAllEntrustAjax = params => put('cancelEntrustBatch', Object.assign({'loading': true}, params))
