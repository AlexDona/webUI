import {get, postWithURLencoded} from './axios'
import {handleRequest} from '../commonFunc'

/**
 * 首页
 */
// 获取轮播图
export const getBanner = params => handleRequest(() => get('banner/', params))
// 获取所有新闻类型
export const getAllNewsTypeList = params => handleRequest(() => get('cms/newsType/selectAll', params))
// 分页查询新闻公告
export const getNewsNoticeList = params => handleRequest(() => get('newsBulletin/pageQuery', params))
// 首页获取所有新闻列表
export const getAllNewsNoticeListForHomePage = params => handleRequest(() => get('newsBulletin/all', params))
// 获取新闻详情
export const getNewsDetail = params => handleRequest(() => get(`newsBulletin/${params}`))
// 添加收藏
export const addUserCollectionAjax = params => handleRequest(() => postWithURLencoded('collection', params))
// 取消收藏
export const removeCollectionAjax = params => handleRequest(() => postWithURLencoded('collection/cancel', params))
// 收藏列表
export const getCollectionListAjax = () => handleRequest(() => get('collection'))
// 首页行情
export const getHomeMarketByAjax = params => handleRequest(() => get('market/homeMarket', {...params, 'loading': true}))
// 通过邀请ID获取用户信息
export const findUserInfoByShowId = params => handleRequest(() => get('user/findByShowId', params))
