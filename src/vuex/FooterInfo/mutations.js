import {
  CHANGE_FOOTER_ACTIVENAME,
  CHANGE_PROTOCOL_DATA,
  CHANGE_NEWS_DETAIL_JUMP_ID
} from './mutations-types.js'

// import {setStore, getStore} from '../utils'

// import {localapi, proapi} from 'src/config/env'

export default {
  [CHANGE_FOOTER_ACTIVENAME] (state, {type, activeName}) {
    switch (type) {
      case '/NewsAndNoticeCenter':
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
    APIDocumentData,
    rateData,
    tradingWarningData
  }) {
    state.serviceProtocolData.userProtocolData = userProtocolData || {}
    state.serviceProtocolData.clauseExplainData = clauseExplainData || {}
    state.serviceProtocolData.legislationExplainData = legislationExplainData || {}
    state.serviceProtocolData.privacyClauseData = privacyClauseData || {}
    state.serviceProtocolData.APIDocumentData = APIDocumentData || {}
    state.serviceProtocolData.rateData = rateData || {}
    state.serviceProtocolData.tradingWarningData = tradingWarningData || {}
  },
  [CHANGE_NEWS_DETAIL_JUMP_ID] (state, data) {
    state.newsDetailJumpId = data
  }
}
