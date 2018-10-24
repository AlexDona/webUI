import {
  // post,
  get
  // put,
  // postWithURLencoded
} from './axios'

/**
 * 头部
 */
// 获取语言列表
export const getLanguageList = () => get('lan/selectList')
// 获取货币转换汇率价格
export const getTransitionCurrencyRateAjax = (params) => get('exchangeRate/tradeAreaPrice', params)
// 获取国家列表
export const getCountryList = () => get('country/selectList')
// 底部信息(1)
export const getFooterInfo1 = (params) => get('foot', params)
// 底部信息(2)
export const getFooterInfo2 = (params) => get('home/bottom', params)
// 服务条款币种资料列表
export const getCurrencyInfoList = (params) => get('cms/coinInformation/all', params)
// 服务条款币种列表对应的单个币种详细资料
export const getCurrencyDetails = (params) => get(`cms/coinInformation/select/${params}`)
// 获取服务协议
export const getServiceProtocoDataAjax = (params) => get('cms/terms/selectAll', params)
// 分页获取服务协议
export const getServiceProtocoDataAjaxByPageNum = (params) => get('cms/terms/pageQuery', params)
// 获取关于我们信息
export const getAboutUsDataAjax = (params) => get('cms/aboutUs/selectAll', params)
// 获取网站配置信息
export const getConfigAjax = () => get('config')
