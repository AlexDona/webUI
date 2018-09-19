import {get} from './axios'
/**
 * 首页
 */
// 板块列表
export const getPartnerList = (params) => get('queryPartnerForm', params)
// 获取轮播图
export const getBanner = (params) => get('banner/', params)
// 获取所有新闻类型
export const getAllNewsTypeList = (params) => get('cms/newsType/selectAll', params)
// 分页查询新闻公告
export const getNewsNoticeList = (params) => get('newsBulletin/pageQuery', params)
// 获取新闻详情
export const getNewsDetail = (params) => get(`newsBulletin/${params}`)
