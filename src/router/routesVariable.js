/**
 * author zhaoxinlei
 * create 20190604
 * description 当前文件为 route 中的常量封装和 方法封装
 */

export const createBaseRoute = ({name, path = `/${name}`, redirect = '', children = [], auth = false, params = {}, props}) => {
  if (!name) return false
  if (children.length) {
    children.forEach(route => {
      if (route.path.startsWith('/')) route.path = route.path.substring(1)
    })
  }
  return {
    path,
    name,
    redirect,
    params,
    caseSensitive: true,
    meta: {
      // 是否进行权限认证
      auth
    },
    props,
    children
  }
}
export const routesVariable = {
  home: 'home',
  // 众筹
  crowdFunding: 'crowdFunding',
  exchange: 'TradeCenter',
  // 登录
  login: 'login',
  // 设置交易密码
  TransactionPassword: 'TransactionPassword',
  crowdFundingRecord: 'crowdFundingRecord',
  news: 'NewsAndNoticeCenter',
  newsItem: 'NewsAndNoticeItem',
  // OTC模块首页
  OTCCenter: 'OTCCenter',
  // OTC发布购买和出售
  OTCPublishBuyAndSell: 'OTCPublishBuyAndSell',
  // OTC在线交易买卖
  OTCOnlineTraderBuySell: 'OTCOnlineTraderBuySell',
  // OTC发布广告
  OTCPublishAD: 'OTCPublishAD',
  // OTC广告管理
  OTCADManage: 'OTCADManage',
  // OTC商家订单
  OTCMerchantsOrders: 'OTCMerchantsOrders',
  // OTC商家申请
  OTCBusinessApply: 'OTCBusinessApply',
  // OTC报表统计
  OTCReportFormStatistics: 'OTCReportFormStatistics',
  // OTC商家信息
  OTCViewMerchantInfo: 'OTCViewMerchantInfo',
  // OTC一键买币
  OTCOneTrade: 'OTCOneTrade',
  ForgetPassword: 'ForgetPassword',
  forgetPass: 'forgetPass',
  forgetPassStep1: 'step1',
  forgetPassStep2: 'step2',
  forgetPassStep3: 'step3',
  register: 'register',
  registerSuccess: 'success',
  phoneRegister: 'phone',
  emailRegister: 'email',
  normalLogin: 'normal',
  scanLogin: 'scan',
  // 登录二次确认页面
  confirmUserInfo: 'confirm',
  nofind404: 'nofind404',
  serverError: '500',
  downloadApp: '/downloadApp',
  // 邀请注册
  invite: 'invite',
  default: 'default',
  // 量化中心
  quantization: 'QuantizationCenter',
  // 轮动策略
  strategy: 'RotationStrategy',
  guideOfDownload: 'guideOfDownload',
  // 打折抢购
  shoppingSpree: 'shoppingSpree',
  // 个人中心导航
  personalName: {
    identityAuthentication: 'identity-authentication'
  },
  personalCenter: '/PersonalCenter'
}

export const globalLabel = {
  login: 'M.comm_login',
  forgetPassword: 'M.login_tips3',
  registerImmediately: 'M.login_tips4'
}
