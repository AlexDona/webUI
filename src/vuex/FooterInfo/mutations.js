import {
  CHANGE_FOOTER_ACTIVE_NAME,
  CHANGE_PROTOCOL_DATA,
  CHANGE_NEWS_DETAIL_JUMP_ID,
  CHANGE_NEWS_TYPE_ACTIVE_NAME,
  SET_APP_DOWNLOAD_URL
} from './mutations-types.js'
import {routesVariable} from '../../router/routesVariable'

// import {setStore, getStore} from '../utils'

// import {localapi, proapi} from 'src/config/env'

export default {
  [CHANGE_FOOTER_ACTIVE_NAME] (state, {type, activeName}) {
    switch (type) {
      case `/${routesVariable.news}`:
        state.newsAndNoticeActiveName = activeName
        break
      case '/ServiceAndProtocol':
        state.serviceActiveName = activeName
    }
  },
  [CHANGE_PROTOCOL_DATA] (state, {
    userProtocolData,
    clauseExplainData,
    legislationExplainData,
    privacyClauseData,
    AML,
    OTCMerchant,
    OTCServices,
    rateData,
    tradingWarningData
  }) {
    state.serviceProtocolData.userProtocolData = userProtocolData || {}
    state.serviceProtocolData.clauseExplainData = clauseExplainData || {}
    state.serviceProtocolData.legislationExplainData = legislationExplainData || {}
    state.serviceProtocolData.privacyClauseData = privacyClauseData || {}
    state.serviceProtocolData.AML = AML || {}
    state.serviceProtocolData.OTCServices = OTCServices || {}
    state.serviceProtocolData.rateData = rateData || {}
    state.serviceProtocolData.tradingWarningData = tradingWarningData || {}
    state.serviceProtocolData.OTCMerchant = OTCMerchant || {}
  },
  [CHANGE_NEWS_DETAIL_JUMP_ID] (state, data) {
    state.newsDetailJumpId = data
  },
  [CHANGE_NEWS_TYPE_ACTIVE_NAME] (state, {activeName}) {
    console.log(activeName)
    state.newsTypeActiveName = activeName
    console.log(state.newsTypeActiveName)
  },
  [SET_APP_DOWNLOAD_URL] (state, {android, ios, iosIpa, androidDownloadSwitch, iosDownloadSwitch}) {
    state.downloadUrl.android = android
    state.downloadUrl.ios = ios
    state.downloadUrl.iosIpa = iosIpa
    state.downloadUrl.androidDownloadSwitch = androidDownloadSwitch
    state.downloadUrl.iosDownloadSwitch = iosDownloadSwitch
  }
}
