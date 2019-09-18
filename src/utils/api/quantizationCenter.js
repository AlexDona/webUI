import {get, postWithFormData} from './axios'
import {handleRequest} from '../commonFunc'
// 获取策略列表
export const getStrategyList = params => handleRequest(() => get('strategyConfig/list', params))
// 获取我的策略列表
export const getMyStrategyList = params => handleRequest(() => get('strategyUser/ownStrategy', params))
// 立即购买
export const getBuyDialogList = params => handleRequest(() => get('strategyConfig/getStrategyConfigById', params))
// 购买策略
export const buyStrategy = params => handleRequest(() => get('strategyUser/buyStrategy', params), 1)
// 查看策略
export const searchStrategy = params => handleRequest(() => get('strategyUser/getStrategyUserDetail', params))
// 交易对列表
export const coinList = params => handleRequest(() => get('trade/listAllUsable', params))
// 策略查看
export const checkStrategy = params => handleRequest(() => get('strategyUser/getStrategyUserDetail', params))
// 更新策略
export const updateStrategy = params => handleRequest(() => postWithFormData('strategyUser/updateStrategyUserDetail', params), 1)
// 启动策略
export const activeStrategy = params => handleRequest(() => postWithFormData('strategyUser/updateStrategyRobotStatus', params), 1)
// 查看账户信息
export const viewAccountInfo = params => handleRequest(() => get('userRobotYieldLog/getUserRobotYieldSum', params))
// 浮动盈亏
export const getProfitAndLoss = params => handleRequest(() => get('strategyUser/getTradeLogs', params))
