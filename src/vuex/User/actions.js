import {REFRESH_USER_INFO_ACTION} from './actions-types'
// import store from "../index"
import {userRefreshUser} from '../../utils/api/personal'
import {getNestedData} from '../../utils/commonFunc'
export default {
  async [REFRESH_USER_INFO_ACTION] ({commit}) {
    const data = await userRefreshUser()
    if (!data) return false
    commit('SET_STEP1_INFO', getNestedData(data, 'data'))
    // 接口回来了改变状态
    commit('CHANGE_USER_REFRESH_SUCCESS', true)
  }
}
