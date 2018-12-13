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
export const getMakeDetail = (params) => get('queryMyEntrustOrder', Object.assign({
  'not-loading': true
}, params))
// 撤销当前委单
export const repealMyEntrustAjax = (params) => put('cancelEntrust', params)
// 全球行情
// params 格式： ETH_BTC
export const getGLobalMarket = (params) => get(`market3rd/${params}`, {
  'not-loading': true
})
// 默认交易对
export const getDefaultSymbol = params => get('trade/default', Object.assign({
  'not-loading': true
}, params))
// 获取用户默认交易对资产
export const getUserAssetOfActiveSymbol = (params) => get('push/getTotalByTradeId', Object.assign({
  'not-loading': true
}, params))
// 获取当前交易对信息
export const getActiveSymbolDataAjax = (params) => get('market/bbMarket/market', Object.assign({
  'not-loading': true
}, params))
// 获取币币交易市场
export const getTradeMarketDataAjax = (params) => get('market/bbMarket/ticker', Object.assign({
  'not-loading': true
}, params))
// 获取K线接口
export const getKlineDataAjax = (params) => get('market/kline', Object.assign({
  'not-loading': true
}, params))
// 撤销所有委单
export const cancelAllEntrustAjax = params => put('cancelEntrustBatch', params)
