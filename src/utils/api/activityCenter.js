import {
  // post,
  get
  // put,
  // postWithURLencoded
} from './axios'
import {handleRequest} from '../commonFunc'
// 获取邀请排行榜数据
export const getRankingList = () => handleRequest(() => get('user/inviters', {'loading': true}))
// 获取资产列表下载地址
export const getCurrencyApplicationDownloadUrl = params => handleRequest(() => get('getCurrencyApplicationDownloadUrl', params))
