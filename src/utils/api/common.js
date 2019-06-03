import {
  // post,
  get
  // put,
  // postWithURLencoded
} from './axios'
import {handleRequest} from '../commonFunc'

/**
 * 头部
 */
// 获取语言列表
export const getLanguageList = () => handleRequest(() => get('lan/selectList'))
// 获取货币转换汇率价格
export const getTransitionCurrencyRateAjax = params => handleRequest(() => get('exchangeRate/tradeAreaPrice', params))
// 获取国家列表
export const getCountryList = () => handleRequest(() => get('country/selectList'))
// 底部信息(1)
export const getFooterInfo1 = params => handleRequest(() => get('foot', params))
// 底部信息(2)
export const getFooterInfo2 = params => handleRequest(() => get('home/bottom', params))
// 服务条款币种资料列表
export const getCurrencyInfoList = params => handleRequest(() => get('cms/coinInformation/all', params))
// 服务条款币种列表对应的单个币种详细资料
export const getCurrencyDetails = params => handleRequest(() => get(`cms/coinInformation/select/${params}`))
// 获取服务协议
export const getServiceProtocoDataAjax = params => handleRequest(() => get('cms/terms/selectAll', {
  ...params,
  'loading': true
}))
// 获取关于我们信息
export const getAboutUsDataAjax = params => handleRequest(() => get('cms/aboutUs/selectAll', {
  ...params,
  'loading': true
}))
// 获取网站配置信息
export const getConfigAjax = () => handleRequest(() => get('config'))
// 获取交易对费率
export const getSymbolRate = () => handleRequest(() => get('/trade/rate', {'loading': true}))
// 获取币种费率
export const getCurrencyRate = () => handleRequest(() => get('/selectCoinRate', {'loading': true}))
// fuc回购计划进度
export const getSchedule = () => handleRequest(() => get('/banner/release'))
// 获取自定义导航
export const getNavigationsAJAX = params => handleRequest(() => get('/partnerMenu/partnermenu', params))
