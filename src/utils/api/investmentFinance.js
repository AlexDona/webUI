/**
 * author: zhaoxinlei
 * update: 20190614
 * sescription: 投资理财 相关接口
 */
import {get, post} from './axios'
import {handleRequest} from '../commonFunc'

// 1. 投资理财请求数据
export const getFinancialManagement = params => handleRequest(() => get('financialManagement', params))
// 2. 投资理财立投资请求接口
export const immediateInvestment = params => handleRequest(() => post('financialManagement', params))
// 3. 投资理财取消投资接口
export const cancelInvestment = params => handleRequest(() => get(`financialManagement/${params}`), 1)
// 4. 投资理财添加理财记录接口
export const getFinancialRecord = params => handleRequest(() => get('financialManagement/recordInfo', params))
