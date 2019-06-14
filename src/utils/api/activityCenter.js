import {
  post,
  get
  // put,
  // postWithURLencoded
} from './axios'
import {handleRequest} from '../commonFunc'
// 获取邀请排行榜数据
export const getRankingList = () => handleRequest(() => get('user/inviters'))
// 获取资产列表下载地址
export const getCurrencyApplicationDownloadUrl = params => handleRequest(() => get('getCurrencyApplicationDownloadUrl', params))
// 获取众筹列表
export const getCrowdFundingAJAX = params => handleRequest(() => get('/ieo/ieoList', params))
// 获取当前众筹项目详情
export const getCrowdFundingDetailAJAX = (detailId, params) => handleRequest(() => get(`/ieo/${detailId}`, params))
// 众筹项目申购
export const applyCrowdFundingAJAX = params => handleRequest(() => post(`/ieo/apply`, params), true)
// 获取存币记录列表
export const getCrowdFundingRecordAJAX = params => handleRequest(() => get('/ieo/applyRecords', params))
