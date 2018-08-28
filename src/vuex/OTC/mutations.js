import {
  // OTC改变选中的可用币种名字
  CHANGE_OTC_AVAILABLE_CURRENCY_NAME,
  // OTC改变选中的可用币种id
  CHANGE_OTC_AVAILABLE_CURRENCY_ID,
  // otc 商家和普通用户通用挂单页面可用币种起订量:选中不同的币种获得不同币种的起订量
  CHANGE_OTC_MERCHANT_AND_COMMON_MINCOUNT
} from './mutations-types.js'

// import {setStore, getStore} from '../utils'

// import {localapi, proapi} from 'src/config/env'

export default {
  // OTC改变选中的可用币种名字
  [CHANGE_OTC_AVAILABLE_CURRENCY_NAME] (state, data) {
    state.selectedOTCAvailableCurrencyName = data
  },
  // OTC改变选中的可用币种id
  [CHANGE_OTC_AVAILABLE_CURRENCY_ID] (state, data) {
    state.selectedOTCAvailableCurrencyCoinID = data
  },
  // otc 商家和普通用户通用挂单页面可用币种起订量:选中不同的币种获得不同币种的起订量
  [CHANGE_OTC_MERCHANT_AND_COMMON_MINCOUNT] (state, data) {
    state.merchantAndCommonPutOnOrderMinCount = data
  }
}
