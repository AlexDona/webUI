import {REFLASH_USER_INFO} from './actions-types'
// import store from "../index"
import {userRefreshUser} from '../../utils/api/personal'
import {returnAjaxMsg} from '../../utils/commonFunc'
export default {
  async [REFLASH_USER_INFO] ({commit, state}, {that}) {
    console.log(state)
    const data = await userRefreshUser({
      token: state.loginStep1Info.token
    })
    if (!(returnAjaxMsg(data, that))) {
      return false
    } else {
      console.log(data)
      commit('SET_STEP1_INFO', data.data.data)
    }
  }
}
