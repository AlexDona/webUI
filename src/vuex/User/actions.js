import {REFRESH_USER_INFO_ACTION} from './actions-types'
// import store from "../index"
import {userRefreshUser} from '../../utils/api/personal'
import {getNestedData} from '../../utils/commonFunc'
export default {
  async [REFRESH_USER_INFO_ACTION] ({commit, state}) {
    commit('CHANGE_USER_REFRESH_SUCCESS', false)
    const data = await userRefreshUser()
    console.log(data)
    if (!data) return false
    commit('SET_STEP1_INFO', getNestedData(data, 'data'))
    console.log(state.isUserRefreshSuccess)
    // 接口回来了改变状态
    commit('CHANGE_USER_REFRESH_SUCCESS', true)
    console.log(state.isUserRefreshSuccess)
  }
}
