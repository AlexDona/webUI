import {GET_USDT_LINK_NAMES_A} from './action-types'
import {getUSDTLinkNamesAJAX} from '../../utils/api/personal'

export default {
  async [GET_USDT_LINK_NAMES_A] ({commit}) {
    const data = await getUSDTLinkNamesAJAX()
    if (!data) return
    commit('UPDATE_LINK_NAMES_M', _.get(data, 'data'))
  }
}
