import {
  CHANGE_FOOTER_ACTIVENAME,
  CHANGE_PROTOCOL_DATA,
  CHANGE_NEWS_DETAIL_JUMP_ID
} from './mutations-types.js'

// import {setStore, getStore} from '../utils'

// import {localapi, proapi} from 'src/config/env'

export default {
  [CHANGE_FOOTER_ACTIVENAME] (state, data) {
    console.log(data)
    switch (data.type) {
      case '/NewsAndNoticeList':
        state.newsAndNoticeActiveName = data.activeName
        break
      case '/ServiceAndProtocol':
        state.serviceActiveName = data.activeName
    }
  },
  [CHANGE_PROTOCOL_DATA] (state, {
    userProtocolData,
    clauseExplainData,
    legislationExplainData,
    privacyClauseData,
    APIDocumentData,
    rateData
  }) {
    if (userProtocolData) {
      state.serviceProtocolData.userProtocolData = userProtocolData
    }
    if (clauseExplainData) {
      state.serviceProtocolData.clauseExplainData = clauseExplainData
    }
    if (legislationExplainData) {
      state.serviceProtocolData.legislationExplainData = legislationExplainData
    }
    if (privacyClauseData) {
      state.serviceProtocolData.privacyClauseData = privacyClauseData
    }
    if (APIDocumentData) {
      state.serviceProtocolData.APIDocumentData = APIDocumentData
    }
    if (rateData) {
      state.serviceProtocolData.rateData = rateData
    }
  },
  [CHANGE_NEWS_DETAIL_JUMP_ID] (state, data) {
    state.newsDetailJumpId = data
  }
}
