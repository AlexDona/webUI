import {get} from './axios'
import {handleRequest} from '../commonFunc'

/**
 * 新闻相关接口
 */
// 获取不同语言 新闻详情
export const changeNewDetailByLanguage = params => handleRequest(() => get('newsBulletin/select', params))
