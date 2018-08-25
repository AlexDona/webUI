import {
  TOGGLE_REFRESH_ENTRUST_LIST_STATUS
} from './mutations-types.js'

// import {setStore} from '../../utils'

// import {localapi, proapi} from 'src/config/env'

export default {
  // 切换委托列表刷新状态
  [TOGGLE_REFRESH_ENTRUST_LIST_STATUS] (state, data) {
    state.refreshEntrustStatus = data
  }
}
