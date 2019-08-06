import mutations from './mutations'
import actions from './actions'
// import getters from './getters'
import {
  getCookieWithJSON
} from '../../utils'
// Vue.use(Vuex)

const state = {
  isLogin: false, // 用户登录状态
  isMobile: false, // 移动端标识
  loginStep: {
    step1: true, // 用户是否在步骤一:用户名密码验证
    step2: false, // 用户是否在步骤二:图片验证码验证
    step3: false // 用户是否在步骤三：短信验证码验证或谷歌验证器验证
  },
  loginStep1Info: getCookieWithJSON('loginStep1Info') || {
    failureNum: 0, // 短时间登录失败次数
    countryCode: '', // 国籍码
    isEnableGoogle: false,
    isEnableMail: false,
    isEnablePhone: true,
    token: '',
    userId: '',
    userInfo: '' // 用户详细信息
  },
  loginType: 0, // 用户登录方式（0:手机号登录,1：邮箱登录）
  loginImageValidateStatus: false, // 登录页面图片验证码显示隐藏状态
  disabledOfPhoneBtn: false, // 短信验证码按钮可用状态
  disabledOfOldPhoneBtn: false, // 旧短信验证码按钮可用状态
  disabledOfEmailBtn: false, // 邮箱验证码按钮可用状态
  disabledOfMobilePhoneBtn: false,
  disabledOfMobileEmailBtn: false,
  vip: {
    // 当前选中
    activeSelectLevel: '',
    // vip 价格信息
    VipPriceInfoList: [],
    // vip操作： open、renew、update
    vipAction: ''
  },
  isUserRefreshSuccess: false,
  // 登录是否失效
  isTokenDisable: false,
  // 邀请 推广 数据
  invitation_S: {},
  // 登录二次确认弹窗 是否显示
  isShowLoginStep2Dialog_S: false,
  // 是否显示图片验证码
  isShowLoginImageDialog_S: false,
  // 忘记密码 当前步骤
  forgetPassStep_S: 1,
  // 图片验证码
  imageCode_S: ''
}

export default {
  state,
  // getters,
  actions,
  mutations
}
