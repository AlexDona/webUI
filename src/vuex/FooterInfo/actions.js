import {
  GET_APP_URL_ACTION,
  GET_CURRENCY_URL_ACTION
} from './actions-types'
import {
  getAppDownLoadUrlAjax
} from '../../utils/api/user'
import {getCurrencyApplicationDownloadUrl} from '../../utils/api/activityCenter'
import {
  getNestedData,
  handleRequest,
  http2https
} from '../../utils/commonFunc'

export default {
  async [GET_APP_URL_ACTION] ({commit}) {
    const data = await handleRequest(getAppDownLoadUrlAjax)
    if (!data) return false
    commit('SET_APP_DOWNLOAD_URL', {
      android: http2https(getNestedData(data, 'data.android')),
      ios: http2https(getNestedData(data, 'data.ios')),
      iosIpa: http2https(getNestedData(data, 'data.ios_ipa'))
    })
  },
  async [GET_CURRENCY_URL_ACTION] ({commit}, params) {
    const data = await getCurrencyApplicationDownloadUrl(params)
    if (!data) return false
    console.log(data)
    return http2https(getNestedData(data, 'data.url'))
  }
}
