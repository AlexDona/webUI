import {
  CHANGE_FOOTER_ACTIVENAME
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
  }
}
