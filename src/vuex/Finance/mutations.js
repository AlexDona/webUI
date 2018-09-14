import {
  CHANGE_BANNER_BACKGROUND,
  CHANGE_COLLECT_LIST,
  CHANGE_COLLECT_STATUS_LIST,
  CHANGE_BANNER_ACTIVE
} from './mutations-types.js'

// import {setStore, getStore} from '../utils'

// import {localapi, proapi} from 'src/config/env'

export default {
  [CHANGE_BANNER_ACTIVE] (state, data) {
    state.bannerActive = data
  },
  [CHANGE_BANNER_BACKGROUND] (state, data = '') {
    state.bannerBackgroundImage = data
  },
  [CHANGE_COLLECT_LIST] (state, data) {
    state.globalCollectList = data
  },
  [CHANGE_COLLECT_STATUS_LIST] (state, data) {
    state.globalCollectStatusList = data
  }
}
