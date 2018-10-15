import {
  CHANGE_BANNER_BACKGROUND,
  CHANGE_BANNER_ACTIVE,
  CHANGE_COLLECT_SYMBOL,
  CHANGE_SYMBOL_MAP
} from './mutations-types.js'
import Vue from 'vue'
// import {setStore, getStore} from '../utils'

// import {localapi, proapi} from 'src/config/env'

export default {
  [CHANGE_BANNER_ACTIVE] (state, data) {
    state.bannerActive = data
  },
  [CHANGE_BANNER_BACKGROUND] (state, data = '') {
    state.bannerBackgroundImage = data
  },
  // 设置收藏标记
  [CHANGE_COLLECT_SYMBOL] (state, {
    type,
    collectSymbol
  }) {
    if (type === 'add') {
      Vue.set(state.collectSymbol, collectSymbol, collectSymbol)
    } else if (type === 'cancel') {
      Vue.delete(state.collectSymbol, collectSymbol)
    } else if (type === 'reset') {
      state.collectSymbol = collectSymbol
    }
  },
  // 设置交易对map映射
  [CHANGE_SYMBOL_MAP] (state, {key, val}) {
    state.symbolMap.set(key, val)
  }
}
