import {SET_FORM_STRATEGY_DATA, SET_SEARCH_STRATEGY_DATA} from './mutations-types'

export default {
  [SET_FORM_STRATEGY_DATA] (state, data) {
    state.formData = data
  },
  [SET_SEARCH_STRATEGY_DATA] (state, data) {
    state.searchData = _.get(data, 'data')
    // 设置查看策略请求的数据缓存
    sessionStorage.setItem('SEARCH_STRATEGY_DATA', JSON.stringify(state.searchData, null, '\t'))
  }
}
