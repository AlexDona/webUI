import mutations from './mutations'
import actions from './actions'
// import {getStore} from '../../utils'
// import getters from './getters'

// Vue.use(Vuex)

const state = {
  // newsAndNoticeActiveName: '1', // 新闻公告全局当前激活标签
  serviceActiveName: 'UserProtocol', // 服务条款激活标签
  serviceProtocolData: {
    userProtocolData: {}, // 用户协议
    clauseExplainData: {}, // 条款说明
    legislationExplainData: {}, // 法律声明
    privacyClauseData: {}, // 隐私条款
    AML: {}, // 反洗钱策略
    // OTC 服务协议
    OTCServices: {},
    OTCMerchant: {},
    rateData: {}, // 费率
    newsDetailJumpId: '', // 首页跳转公告id
    // 交易须知
    tradingWarningData: {}
  },
  // 最新的类型
  newsTypeActiveName: '',
  // 下载地址
  downloadUrl: {
    android: '',
    ios: '',
    iosIpa: '',
    androidDownloadSwitch: true,
    iosDownloadSwitch: true
  }
}

export default {
  state,
  // getters,
  actions,
  mutations
}
