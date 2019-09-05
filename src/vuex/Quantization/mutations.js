import {UPDATE_MY_STRATERGY_DATA, SET_SEARCH_STRATEGY_DATA} from './mutations-types'

export default {
  [UPDATE_MY_STRATERGY_DATA] (state, formData) {
    state.strategyData = formData
    // 设置点击查看单列我的策略数据缓存
    sessionStorage.setItem('MY_STRATEGY_DATA', JSON.stringify(state.strategyData, null, '\t'))
  },
  [SET_SEARCH_STRATEGY_DATA] (state, data) {
    state.searchData = _.get(data, 'data')
    // 设置查看策略请求的数据缓存
    sessionStorage.setItem('SEARCH_STRATEGY_DATA', JSON.stringify(state.searchData, null, '\t'))
  }
}
