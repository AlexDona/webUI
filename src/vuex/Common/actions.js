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
  changeLanguage
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
    if (localCountry && diffTime < 86400000) {
      data = localCountry
      commit('SET_COUNTRY_AREA_LIST', data)
      console.log(data)
    } else {
      data = await getCountryList()
      console.log(data)
      commit('SET_COUNTRY_AREA_LIST', getNestedData(data, 'data'))
      if (callback) {
        callback(data)
      }
    }
  },
  // 获取目标汇率
  async [GET_TRANSITION_RATE_ACTION] ({commit}, {params, activeConvertCurrencyObj}) {
    const DATA = await getTransitionCurrencyRateAjax(params)
    console.log(DATA)
    commit('CHANGE_CURRENCY_RATE_LIST', {
      currencyRateList: getNestedData(DATA, 'data'),
      activeConvertCurrencyObj
    })
  },
  // 获取语言列表信息
  async [GET_LANGUAGE_LIST_ACTION] ({commit, state}, that) {
    console.log(state)
    const LANGUAGE_DATA = await getLanguageList()
    that.languageList = getNestedData(LANGUAGE_DATA, 'data')
    const CONFIG_DATA = await getConfigAjax()
    const CONFIG_INFO = getNestedData(CONFIG_DATA, 'data')
    changeLanguage(getStore('language') || CONFIG_INFO.defaultLanguage, commit, that)
    commit('SET_FOOTER_INFO', {CONFIG_INFO})
  },
  // 设置用户信息
  async [SET_PARTNER_INFO_ACTION] ({commit, state}, {language}) {
    const params = {
      language
    }
    const data1 = await getFooterInfo1(params)
    const data2 = await getFooterInfo2(params)

    let footerInfo1 = getNestedData(data1, 'data')
    let footerInfo2 = getNestedData(data2, 'data')
    commit('SET_FOOTER_INFO', {
      footerInfo1,
      footerInfo2
    })
    console.log(footerInfo1.title)
    // favicon 添加
    addFavicon(
      getNestedData(footerInfo1, 'headTitleLogo'),
      getNestedData(footerInfo1, 'title')
    )
    commit('SET_LOGO_URL', {
      logoSrc: getNestedData(footerInfo1, 'headLogo'),
      title: getNestedData(footerInfo1, 'title')
    })
  }
}
