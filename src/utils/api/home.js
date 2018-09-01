import {get} from './axios'
/**
 * 首页
 */
// 板块列表
export const getPartnerList = (params) => get('queryPartnerForm', params)
