// common
import {
  GET_COUNTRY_LIST_ACTION,
  GET_TRANSITION_RATE_ACTION,
  GET_LANGUAGE_LIST_ACTION
} from './actions-types'
import {
  getStoreWithJson,
  getStore,
  setStore
} from '../../utils'
import {
  getCountryList, getLanguageList,
  getTransitionCurrencyRateAjax
} from '../../utils/api/header'
import {returnAjaxMsg} from '../../utils/commonFunc'
// import store from "../index";
export default {
  // 获取国家列表
  async [GET_COUNTRY_LIST_ACTION] ({commit}, {that, callback}) {
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
      if (!returnAjaxMsg(data, that)) {
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
  async [GET_TRANSITION_RATE_ACTION] ({commit}, {params, that, activeConvertCurrencyObj}) {
    const data = await getTransitionCurrencyRateAjax(params)
    if (!returnAjaxMsg(data, that)) {
      return false
    } else {
      commit('CHANGE_CURRENCY_RATE_LIST', {
        currencyRateList: data.data.data,
        activeConvertCurrencyObj
      })
    }
  },
  async [GET_LANGUAGE_LIST_ACTION] ({commit, state}, {that, language}) {
    console.log(state)
    const data = await getLanguageList()
    if (!returnAjaxMsg(data, that)) {
      return false
    } else {
      that.languageList = data.data.data
      let localLanguage = language || getStore('language') || state.defaultLanguage
      console.log(localLanguage)
      _.forEach(that.languageList, item => {
        if (item.shortName === localLanguage) {
          console.log(item)
          commit('CHANGE_LANGUAGE', item)
          return false
        }
      })
    }
  }
}
