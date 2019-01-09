import {
  FINANCE_LINE_RENDER_TIME_LIST,
  FINANCE_LINE_RENDER_PRICE_LIST,
  FINANCE_LINE_STATUS
} from './mutations-types.js'

// import {setStore, getStore} from '../utils'

// import {localapi, proapi} from 'src/config/env'

export default {
  [FINANCE_LINE_RENDER_TIME_LIST] (state, data) {
    state.financeLineRenderTimeList = data
    state.financeLineRenderTimeList = state.financeLineRenderTimeList.reverse()
  },
  [FINANCE_LINE_RENDER_PRICE_LIST] (state, data) {
    state.financeLineRenderPriceList = data
    state.financeLineRenderPriceList = state.financeLineRenderPriceList.reverse()
  },
  [FINANCE_LINE_STATUS] (state, data) {
    state.status = data
  }
}
