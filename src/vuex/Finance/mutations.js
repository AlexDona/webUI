import {
  FINANCE_LINE_SELECT_COIDINFOR,
  FINANCE_PIE_INVESTMENT_VALUE,
  FINANCE_PIE_GET_MONEY_VALUE,
} from './mutations-types.js'

// import {setStore, getStore} from '../utils'

// import {localapi, proapi} from 'src/config/env'

export default {
  [FINANCE_LINE_SELECT_COIDINFOR] (state, data) {
    state.financeLineSelecteCoindInfor = data
  },
  [FINANCE_PIE_INVESTMENT_VALUE] (state, data) {
    state.financePieInvestmentValue = data
  },
  [FINANCE_PIE_GET_MONEY_VALUE] (state, data) {
    state.financePieGetMoneyValue = data
  }
}
