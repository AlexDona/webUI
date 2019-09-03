import {SET_FORM_STRATEGY_DATA, SET_SEARCH_STRATEGY_DATA} from './mutations-types'

export default {
  [SET_FORM_STRATEGY_DATA] (state, data) {
    state.formData = data
  },
  [SET_SEARCH_STRATEGY_DATA] (state, data) {
    state.searchData = _.get(data, 'data')
  }
}
