// common
import {
  GET_COUNTRY_LIST_ACTION,
  GET_TRANSITION_RATE_ACTION,
  GET_LANGUAGE_LIST_ACTION,
  SET_PARTNER_INFO_ACTION
} from './actions-types'
import {
  getStoreWithJson,
  getStore
} from '../../utils'
import {
  getConfigAjax,
  getCountryList,
  getFooterInfo1,
  getFooterInfo2,
  getLanguageList,
  getTransitionCurrencyRateAjax
} from '../../utils/api/common'
import {
  addFavicon,
  getNestedData,
  http2https
} from '../../utils/commonFunc'
// import store from "../index";
export default {
  // 获取国家列表
  async [GET_COUNTRY_LIST_ACTION] ({commit}, callback) {
    let localCountry = getStoreWithJson('countryList')
    let saveTimeStamp = getStore('timeStamp')
    let nowTimeStamp = new Date().getTime()
    let diffTime = Math.abs(nowTimeStamp - saveTimeStamp)
    let data
    const ONE_DAY = 86400000
    if (localCountry && diffTime < ONE_DAY) {
      data = localCountry
      commit('SET_COUNTRY_AREA_LIST', data)
      return false
    } else {
      data = await getCountryList()
      if (!data) return false
      commit('SET_COUNTRY_AREA_LIST', getNestedData(data, 'data'))
      if (callback) {
        callback(data)
      }
    }
  },
  // 获取目标汇率
  async [GET_TRANSITION_RATE_ACTION] ({commit}, {params, activeConvertCurrencyObj}) {
    const data = await getTransitionCurrencyRateAjax(params)
    if (!data) return false
    commit('CHANGE_CURRENCY_RATE_LIST', {
      currencyRateList: data.data,
      activeConvertCurrencyObj
    })
  },
  // 获取语言列表信息
  async [GET_LANGUAGE_LIST_ACTION] ({commit, state}, self) {
    const data = await getLanguageList()
    if (!data) return false
    commit('SET_LANGUAGES_M', data.data)
    const data1 = await getConfigAjax()
    if (!data1) return false
    let configInfo = getNestedData(data1, 'data')
    const language = getStore('language') || configInfo.defaultLanguage
    _.forEach(state.languages_S, item => {
      if (item.shortName === language) {
        commit('CHANGE_LANGUAGE', item)
        commit('CHANGE_DEFAULT_LANGUAGE', item.shortName)
        return false
      }
    })
    commit('SET_FOOTER_INFO', {
      configInfo
    })
    return true
  },
  // 设置用户信息
  async [SET_PARTNER_INFO_ACTION] ({commit, state}, language) {
    const params = {
      language
    }
    const data1 = await getFooterInfo1(params)
    const data2 = await getFooterInfo2(params)
    if (!data1 || !data2) return false
    let footerInfo1 = getNestedData(data1, 'data')
    let footerInfo2 = getNestedData(data2, 'data')
    commit('SET_FOOTER_INFO', {
      footerInfo1,
      footerInfo2
    })
    // console.log(footerInfo1.title)
    // favicon 添加
    addFavicon(
      http2https(getNestedData(footerInfo1, 'headTitleLogo')),
      getNestedData(footerInfo1, 'title')
    )
    commit('SET_LOGO_URL', {
      logoSrc: http2https(getNestedData(footerInfo1, 'headLogo')),
      title: getNestedData(footerInfo1, 'title')
    })
  }
}
