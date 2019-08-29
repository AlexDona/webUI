import {get} from './axios'
import {handleRequest} from '../commonFunc'
// 获取策略列表
export const getStrategyList = params => handleRequest(() => get('/strategyConfig/list', params))
// 获取我的策略列表
export const getMyStrategyList = params => handleRequest(() => get('/strategyUser/ownStrategy', params))
