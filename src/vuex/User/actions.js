import {REFRESH_USER_INFO_ACTION} from './actions-types'
// import store from "../index"
import {userRefreshUser} from '../../utils/api/personal'
import {returnAjaxMsg} from '../../utils/commonFunc'
export default {
  async [REFRESH_USER_INFO_ACTION] ({commit, state}, self) {
    console.log(state)
    const data = await userRefreshUser({
      token: state.loginStep1Info.token
    })
    if (!(returnAjaxMsg(data, self))) {
      return false
    } else {
      console.log(data)
      commit('SET_STEP1_INFO', data.data.data)
    }
  }
}
