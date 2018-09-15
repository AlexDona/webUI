import {
  // post,
  get
  // put,
  // postWithURLencoded
} from './axios'
// 获取邀请排行榜数据
export const getRankingList = () => get('user/inviters')
