/**
 * author: zhaoxinlei
 * create: 20190905
 * description: 闪兑专区 相关接口
 */
import {get, post} from './axios'
import {handleRequest} from '../commonFunc'
// 获取闪兑列表
export const getShoppingSpreeListAJAX = params => handleRequest(() => get('/newPre/pageListProject', params))
// 获取闪兑专区 单个详情
export const getShoppingSpreeDetailAJAX = params => handleRequest(() => get('/newPre/getProjectDetails', params))
// 申请抢购
export const doPurchaseAJAX = params => handleRequest(() => post('/newPre/rushToPurchase', params))
// 轮询抢购结果
export const checkIsPurchaseSuccessAJAX = params => handleRequest(() => get('/newPre/getRushResult', params))
// 查询队列标识
export const getQueuingStatusAJAX = params => handleRequest(() => get('/newPre/checkQueueFlag', params))
// 查询活动币种余额和参与条件
export const getJoinTermCoinStatusAJAX = params => handleRequest(() => get('/newPre/getJointTermCoin', params))
// 查询抢购记录
export const getShoppingSpreeRecordAJAX = params => handleRequest(() => get('/newPre/pageListOrder', params))
