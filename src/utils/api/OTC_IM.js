/**
 * author: zhaoxinlei
 * create: 20190712
 * description: OTC 及时通讯相关接口
 */
import {get, postWithURLencoded} from './axios'
import {handleRequest} from '../commonFunc'

// 获取 交易历史记录
export const getIMHistoryRecordAJAX = params => handleRequest(() => get('/otcOrder/websoc/seeHistoryChatRecord', params))
// 更新订单状态
export const updateIMStatusAJAX = params => handleRequest(() => postWithURLencoded('/otcOrder/websoc/updateChatState', params))
