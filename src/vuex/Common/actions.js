// common
import {
  GET_COUNTRY_LIST_ACTION,
  GET_TRANSITION_RATE_ACTION,
  GET_LANGUAGE_LIST_ACTION,
  SET_PARTNER_INFO_ACTION
} from './actions-types'
import {
  getStoreWithJson,
  getStore,
  setStore
} from '../../utils'
import {
  getConfigAjax,
  getCountryList, getFooterInfo1, getFooterInfo2, getLanguageList,
  getTransitionCurrencyRateAjax
} from '../../utils/api/header'
import {
  addFavicon,
  getNestedData,
  returnAjaxMsg,
  changeLanguage
} from '../../utils/commonFunc'
// import store from "../index";
export default {
  // 获取国家列表
  async [GET_COUNTRY_LIST_ACTION] ({commit}, {self, callback}) {
    let localCountry = getStoreWithJson('countryList')
    let saveTimeStamp = getStore('timeStamp')
    let nowTimeStamp = new Date().getTime()
    let diffTime = Math.abs(nowTimeStamp - saveTimeStamp)
    let data
    if (localCountry && diffTime < 86400000) {
      data = localCountry
      commit('SET_COUNTRY_AREA_LIST', data)
      return false
    } else {
      data = await getCountryList()
      if (!returnAjaxMsg(data, self)) {
        return false
      } else {
        commit('SET_COUNTRY_AREA_LIST', data.data.data)
        setStore('countryList', data.data.data)
        setStore('timeStamp', new Date().getTime())
        if (callback) {
          callback(data)
        }
      }
    }
  },
  // 获取目标汇率
  async [GET_TRANSITION_RATE_ACTION] ({commit}, {params, self, activeConvertCurrencyObj}) {
    const data = await getTransitionCurrencyRateAjax(params)
    if (!returnAjaxMsg(data, self)) {
      return false
    } else {
      commit('CHANGE_CURRENCY_RATE_LIST', {
        currencyRateList: data.data.data,
        activeConvertCurrencyObj
      })
    }
  },
  // 获取语言列表信息
  async [GET_LANGUAGE_LIST_ACTION] ({commit, state}, {self}) {
    console.log(state)
    const data = await getLanguageList()
    if (!returnAjaxMsg(data, self)) {
      return false
    } else {
      self.languageList = data.data.data
      const data1 = await getConfigAjax()
      if (!returnAjaxMsg(data1, self)) {
        return false
      } else {
        let configInfo = getNestedData(data1, 'data.data')
        console.log(configInfo, self.languageList)
        changeLanguage(getStore('language') || configInfo.defaultLanguage, self, commit)
        commit('SET_FOOTER_INFO', {
          configInfo
        })
      }
      // let localLanguage = language || getStore('language') || state.defaultLanguage
      // console.log(localLanguage)
      // changeLanguage(localLanguage, this, commit)
    }
  },
  // 设置用户信息
  async [SET_PARTNER_INFO_ACTION] ({commit, state}, {self, language}) {
    const params = {
      language
    }
    const data1 = await getFooterInfo1(params)
    const data2 = await getFoovterInfo2(params)
    if (
      !returnAjaxMsg(data1, self) &&
      !returnAjaxMsg(data2, self)
    ) {
      return false
    } else {
      // eslint-disable-next-line
      let footerInfo1 = getNestedData(data1, 'data.data')
      let footerInfo2 = getNestedData(data2, 'data.data')
      commit('SET_FOOTER_INFO', {
        footerInfo1,
        footerInfo2
      })
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
}
