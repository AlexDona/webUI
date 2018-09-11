import {
  CHANGE_USER_CENTER_ACTIVE_NAME,
  CHANGE_REF_SECURITY_CENTER_INFO,
  CHANGE_REF_ACCOUNT_CREDITED_STATE
} from './mutations-types.js'

// import {setStore, getStore} from '../utils'

// import {localapi, proapi} from 'src/config/env'

export default {
  [CHANGE_USER_CENTER_ACTIVE_NAME] (state, data) {
    state.userCenterActiveName = data
  },
  [CHANGE_REF_SECURITY_CENTER_INFO] (state, data) {
    state.refSecurityCenterStatus = data
  },
  [CHANGE_REF_ACCOUNT_CREDITED_STATE] (state, data) {
    state.refsAccountCenterStatus = data
  }
}
