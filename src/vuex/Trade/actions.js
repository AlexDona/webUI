import {GET_PRE_INFO_A} from './action-types'
import {getPREInfoAJAX} from '../../utils/api/trade'

export default {
  async [GET_PRE_INFO_A] ({commit, state}) {
    const data = await getPREInfoAJAX()
    commit('SET_PRE_INFO_M', {...data.data})
    console.log(state.activity)
  }
}
