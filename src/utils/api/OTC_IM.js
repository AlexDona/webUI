/**
 * author: zhaoxinlei
 * create: 20190712
 * description: OTC 及时通讯相关接口
 */
import {get, putWithURLencoded} from './axios'
import {handleRequest} from '../commonFunc'

// 获取 交易历史记录
export const getIMHistoryRecordAJAX = params => handleRequest(() => get('/otcOrder/websoc/seeHistoryChatRecord', params))
// 更新订单状态
export const updateIMStatusAJAX = params => handleRequest(() => putWithURLencoded('/otcOrder/websoc/updateChatState', params))
// 查询30天成交量
// export const get30DaysTradeAmountAJAX = params => handleRequest(() => get('/otcOrder/get30DaysTradeAmount', params))
