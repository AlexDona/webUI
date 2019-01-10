import {get} from './axios'

/**
 * 新闻相关接口
 */
// 获取不同语言 新闻详情
export const changeNewDetailByLanguage = (params) => get('newsBulletin/select', params)
