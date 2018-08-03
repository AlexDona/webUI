import {
  CHANGE_THEME,
  CHANGE_LANGUAGE,
  CHANGE_CONVERT_CURRENCY
} from './mutations-types.js'

// import {setStore, getStore} from '../utils'

// import {localapi, proapi} from 'src/config/env'

export default {
  // 切换主题
  [CHANGE_THEME] (state, data) {
    state.theme = data
  },
  // 切换语言
  [CHANGE_LANGUAGE] (state, data) {
    state.language = data
  },
  // 设置折算货币
  [CHANGE_CONVERT_CURRENCY] (state, data) {
    state.activeConvertCurrency = data
  }
}
