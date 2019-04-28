import {getAllNewsNotices} from '../../utils/api/home'
import {getNestedData} from '../../utils/commonFunc'
import {GET_ALL_NOTICE_ACTION} from './actions-types'
export default {
  // 获取所有新闻公告
  async [GET_ALL_NOTICE_ACTION] ({commit, state}, language) {
    const data = await getAllNewsNotices({language})
    if (!data) return false
    commit('SET_HOME_NOTICE_LIST', getNestedData(data, 'data'))
  }
}
