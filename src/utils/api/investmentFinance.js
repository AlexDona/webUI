import {get, post} from './axios'
/**
 *投资理财
 */
// 1. 投资理财请求数据
export const getFinancialManagement = (params) => get('financialManagement', params)
// 2. 投资理财立投资请求接口
export const imediateInvestment = (params) => post('financialManagement', Object.assign({'loading': true}, params))
// 3. 投资理财取消投资接口
export const cancelInvestment = (params) => get(`financialManagement/${params}`, {'loading': true})
// 4. 投资理财添加理财记录接口
export const getFinancialRecord = (params) => get('financialManagement/recordInfo', Object.assign({'loading': true}, params))
