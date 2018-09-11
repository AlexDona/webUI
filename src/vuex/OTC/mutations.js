import {
  // OTC改变选中的可用币种名字
  CHANGE_OTC_AVAILABLE_CURRENCY_NAME,
  // OTC改变选中的可用币种id
  CHANGE_OTC_AVAILABLE_CURRENCY_ID,
  // OTC改变选中的可用币种partnerCoinId
  CHANGE_OTC_AVAILABLE_PARTNER_COIN_ID
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
  // OTC改变选中的可用币种partnerCoinId
  [CHANGE_OTC_AVAILABLE_PARTNER_COIN_ID] (state, data) {
    state.selectedOTCAvailablePartnerCoinId = data
  }
}
