import {get, postWithURLencoded} from './axios'
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
// 首页获取所有新闻列表
export const getAllNewsNoticeListForHomePage = (params) => get('newsBulletin/all', params)
// 获取新闻详情
export const getNewsDetail = (params) => get(`newsBulletin/${params}`)
// 添加收藏
export const addUserCollectionAjax = (params) => postWithURLencoded('collection', params)
// 取消收藏
export const removeCollectionAjax = (params) => postWithURLencoded('collection/cancel', params)
// 收藏列表
export const getCollectionListAjax = () => get('collection')
// 首页行情
export const getHomeMarketByAjax = (params) => get('market/homeMarket', params)
