import {
  CHANGE_THEME,
  CHANGE_LANGUAGE,
  CHANGE_CONVERT_CURRENCY,
  CHANGE_BANNER_ACTIVE,
  CHANGE_BANNER_BACKGROUND,
  CHANGE_COLLECT_LIST,
  CHANGE_USER_CENTER_ACTIVE_NAME
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
  },
  [CHANGE_BANNER_ACTIVE] (state, data) {
    state.bannerActive = data
  },
  [CHANGE_BANNER_BACKGROUND] (state, data = '') {
    state.bannerBackgroundImage = data
  },
  [CHANGE_COLLECT_LIST] (state, data) {
    state.globalCollectList = data
  },
  [CHANGE_USER_CENTER_ACTIVE_NAME] (state, data) {
    state.userCenterActiveName = data
  }
}
