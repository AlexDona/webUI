import {get, postWithURLencoded} from './axios'
import {handleRequest} from '../commonFunc'

/**
 * 关注拉黑
 * */
// 1 获得关注列表
export const getFocusListsAJAX = params => handleRequest(() => get('otcRelation/selectAttentionByFromId', params))
// 2 取消关注或解除
export const cancelFocusAJAX = (params) => handleRequest(() => postWithURLencoded('otcRelation/deleteRelation', params), 1)
// 3 获得拉黑列表
export const getBlackListsAJAX = params => handleRequest(() => get('otcRelation/selectBlackByFromId', params))
// 4 进入OTC首页查看登录用户信息
export const getViewInfoAJAX = params => handleRequest(() => get('otcRelation/selectCurrentUserDetailInfo', params))
// 5 查看商家信息页面数据
export const getMerchantInfoAJAX = params => handleRequest(() => get('otcRelation/seeOneUserOtcDetailInfo', params))
// 6 关注或拉黑
export const addFocusBlackListAJAX = (params) => handleRequest(() => postWithURLencoded('otcRelation/addOtcRelation', params), 1)
// 7 判断此用户是否被当前用户正处于拉黑中状态
export const getUserIsBlackingAJAX = params => handleRequest(() => get('otcRelation/selectRelationByFromAndToId', params))
