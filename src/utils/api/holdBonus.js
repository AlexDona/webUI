/**
 * author: zhaoxinlei
 * create: 20190712
 * description: OTC 及时通讯相关接口
 */
import {get} from './axios'
import {handleRequest} from '../commonFunc'
// 确认是否显示 持仓分红页面
export const getShowHoldStatusAJAX = () => handleRequest(() => get('/holdBonus/getShowState'))
// 获取当前用户持仓参与情况
export const getUserHoldInfoAJAX = params => handleRequest(() => get('/holdBonus/getUserHoldMsg', params))
// 获取当前用户分红记录
export const getUserHoldRecordAJAX = params => handleRequest(() => get('/holdBonus/findSendBonusByPage', params))
