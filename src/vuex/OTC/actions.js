import {GET_OTC_COIN_LIST_ACTION} from './actions-types'
import {getOTCAvailableCurrency} from '../../utils/api/OTC'
import {getNestedData} from '../../utils/commonFunc'
import {getStore, getStoreWithJson} from '../../utils'

export default {
  async [GET_OTC_COIN_LIST_ACTION] ({commit}) {
    let localOTCCoinList = getStoreWithJson('OTCCoinList')
    let OTCCoinListTimeStamp = getStore('OTCCoinListTimeStamp')
    let nowTimeStamp = new Date().getTime()
    const ONE_DAY = 86400000
    let diffTime = Math.abs(nowTimeStamp - OTCCoinListTimeStamp)
    if (localOTCCoinList && diffTime < ONE_DAY) {
      commit('SET_OTC_COIN_LIST_M', localOTCCoinList)
    } else {
      const data = await getOTCAvailableCurrency()
      if (!data) return false
      commit('SET_OTC_COIN_LIST_M', getNestedData(data, 'data'))
    }
  }
}
