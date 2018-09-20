import {
  FINANCE_LINE_RENDER_TIME_LIST,
  FINANCE_LINE_RENDER_PRICE_LIST
} from './mutations-types.js'

// import {setStore, getStore} from '../utils'

// import {localapi, proapi} from 'src/config/env'

export default {
  [FINANCE_LINE_RENDER_TIME_LIST] (state, data) {
    state.financeLineRenderTimeList = data
  },
  [FINANCE_LINE_RENDER_PRICE_LIST] (state, data) {
    state.financeLineRenderPriceList = data
  }
}
