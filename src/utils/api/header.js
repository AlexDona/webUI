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
