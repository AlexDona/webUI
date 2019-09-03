import {SEARCH_STRATEGY_ACTION} from '../Quantization/actions-types'
import {searchStrategy} from '../../utils/api/quantizationCenter'

export default {
  async [SEARCH_STRATEGY_ACTION] ({commit, state}, formData) {
    const data = await searchStrategy({
      strategyUserId: formData.id
    })
    console.log(data)
    if (!data) return false
    commit('SET_SEARCH_STRATEGY_DATA', data)
  }
}
