import {GET_APP_URL_ACTION} from './actions-types'
import {getAppDownLoadUrlAjax} from '../../utils/api/user'
import {
  getNestedData,
  handleRequest,
  http2https
} from '../../utils/commonFunc'

export default {
  async [GET_APP_URL_ACTION] ({commit}) {
    const data = await handleRequest(getAppDownLoadUrlAjax)
    commit('SET_APP_DOWNLOAD_URL', {
      android: http2https(getNestedData(data, 'data.android')),
      ios: http2https(getNestedData(data, 'data.ios')),
      iosIpa: http2https(getNestedData(data, 'data.ios_ipa'))
    })
  }
}
