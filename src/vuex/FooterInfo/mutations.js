import {
  CHANGE_NEWS_AND_NOTICE_ACTIVENAME
} from './mutations-types.js'

// import {setStore, getStore} from '../utils'

// import {localapi, proapi} from 'src/config/env'

export default {
  [CHANGE_NEWS_AND_NOTICE_ACTIVENAME] (state, data) {
    state.newsAndNoticeActiveName = data
  }
}
