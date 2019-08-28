import {get} from './axios'
import {handleRequest} from '../commonFunc'
// 获取策略列表
export const getStrategyList = () => handleRequest(() => get('/strategyConfig/list'))
