import {get, postWithURLencoded, notLoading} from './axios'
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
export const getAllNewsNotices = params => handleRequest(() => get('newsBulletin/all', params))
// 获取部分新闻列表
export const getPartNewsNotices = params => handleRequest(() => get('newsBulletin/Carousel', params))
// 获取新闻详情
export const getNewsDetail = params => handleRequest(() => get(`newsBulletin/${params}`))
// 添加收藏
export const addUserCollectionAjax = params => handleRequest(() => postWithURLencoded('user/collection', {...params, ...notLoading}))
// 取消收藏
export const removeCollectionAjax = params => handleRequest(() => postWithURLencoded('user/collection/cancel', {...params, ...notLoading}))
// 收藏列表
export const getCollectionListAjax = () => handleRequest(() => get('user/collection'))
// 首页行情
// export const getHomeMarketByAjax = params => handleRequest(() => get('market/homeMarket', params))
// 通过邀请ID获取用户信息
export const findUserInfoByShowId = params => handleRequest(() => get('user/findByShowId', params))

// 获取板块信息
export const getPlatesAJAX = params => handleRequest(() => get('/market/getTradePlate', params))
// 根据板块id 获取定义的交易区信息
export const getTradeAreaAJAX = params => handleRequest(() => get('market/plate/getInfo', params))

export const getAllTradeAreasAJAX = params => handleRequest(() => get('market/plate/getAllInfo', params))
// 获取所有交易区
export const getAllSymbolsAJAX = params => handleRequest(() => get('market/getTradeData', params))
