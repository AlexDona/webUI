import {get} from './axios'
/**
 * 首页
 */
// 板块列表
export const getPartnerList = (params) => get('queryPartnerForm', params)
// 获取轮播图
export const getBanner = (params) => get('banner/', params)
// 分页查询新闻公告
export const getNewsNoticeList = (params) => get('newsBulletin/pageQuery', params)
