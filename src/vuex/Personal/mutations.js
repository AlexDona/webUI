import {
  CHANGE_USER_CENTER_ACTIVE_NAME
} from './mutations-types.js'

// import {setStore, getStore} from '../utils'

// import {localapi, proapi} from 'src/config/env'

export default {
  [CHANGE_USER_CENTER_ACTIVE_NAME] (state, data) {
    state.userCenterActiveName = data
  }
}
