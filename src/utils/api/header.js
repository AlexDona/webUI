import {
  // post,
  get
  // put,
  // postWithURLencoded
} from './axios'

/**
 * 头部
 */
// 获取语言列表
export const getLanguageList = () => get('lan/selectList')
// 获取货币转换汇率价格
export const getTransitionCurrencyRate = (params) => get('exchangeRate/tradeAreaPrice', params)
