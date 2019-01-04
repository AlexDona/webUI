import {get, post} from './axios'
/**
 *投资理财
 */
// 1. 投资理财请求数据
export const getFinancialManagement = (params) => get('financialManagement', Object.assign({
  'not-loading': true
}, params))
// 2. 投资理财立投资请求接口
export const imediateInvestment = (params) => post('financialManagement', params)
// 3. 投资理财取消投资接口
export const cancleInvestment = (params) => get(`financialManagement/${params}`)
// 4. 投资理财添加理财记录接口
export const getFinancialRecord = (params) => get('financialManagement/recordInfo', params)
