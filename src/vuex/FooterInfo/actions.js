import {GET_APP_URL_ACTION} from './actions-types'
import {getAppDownLoadUrlAjax} from '../../utils/api/user'
import {
  getNestedData,
  handleRequest
} from '../../utils/commonFunc'

export default {
  async [GET_APP_URL_ACTION] ({commit}) {
    const data = await handleRequest(getAppDownLoadUrlAjax)
    commit('SET_APP_DOWNLOAD_URL', {
      android: getNestedData(data, 'data.android'),
      ios: getNestedData(data, 'data.ios'),
      iosIpa: getNestedData(data, 'data.ios_ipa')
    })
  }
}
