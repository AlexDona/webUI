import {get} from './axios'
import {handleRequest} from '../commonFunc'
// 获取策略列表
export const getStrategyList = params => handleRequest(() => get('/strategyConfig/list', params))
// 获取我的策略列表
export const getMyStrategyList = params => handleRequest(() => get('/strategyUser/ownStrategy', params))
// 立即购买
export const getBuyDialogList = params => handleRequest(() => get('/strategyConfig/getStrategyConfigById', params))
// 购买策略
export const buyStrategy = params => handleRequest(() => get('/strategyUser/buyStrategy', params))
