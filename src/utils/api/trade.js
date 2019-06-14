import {post, get, put} from './axios'
import {handleRequest} from '../commonFunc'

/**
 * 币币交易
 */
// 新增委单
export const saveEntrustTrade = params => handleRequest(() => post('saveEntrust', params), 1)
// 我的委托单
export const getMyEntrust = params => handleRequest(() => get('queryMyEntrust', params))
// 历史委单
export const getHistoryEntrust = params => handleRequest(() => get('queryMyHisEntrust', params))
// 成交明细
export const getMakeDetail = params => handleRequest(() => get('queryMyEntrustOrder', params))
// 撤销当前委单
export const repealMyEntrustAjax = params => handleRequest(() => put('cancelEntrust', params), 1)
// 全球行情
// params 格式： ETH_BTC
export const getGlobalMarket = params => handleRequest(() => get(`market3rd/${params}`), 0, 1)
// 默认交易对
export const getDefaultSymbol = params => handleRequest(() => get('trade/default', params))
// 获取用户默认交易对资产
export const getUserAssetOfActiveSymbol = params => handleRequest(() => get('push/getTotalByTradeId', params))
// 获取当前交易对信息
export const getActiveSymbolDataAjax = params => handleRequest(() => get('market/bbMarket/market', params))
// 获取币币交易市场
export const getTradeMarketDataAjax = params => handleRequest(() => get('market/bbMarket/ticker', params))
// 获取K线接口
export const getKlineDataAjax = params => handleRequest(() => get('market/kline', params))
// 撤销所有委单
export const cancelAllEntrustAjax = params => handleRequest(() => put('cancelEntrustBatch', params))
// 获取PRE活动信息
export const getPREInfoAJAX = () => handleRequest(() => get('pre/check'))
