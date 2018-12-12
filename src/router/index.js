import Vue from 'vue'
import Router from 'vue-router'
// eslint-disable-next-line
import store from '../vuex'

Vue.use(Router)
/**
 * Common
 */

const HomeCenter = r => require.ensure([], () => r(require('@/pages/HomeCenter')), 'home-center')
/**
 * Personal
 */
const PersonalCenter = r => require.ensure([], () => r(require('@/pages/PersonalCenter')), 'user-center')
// 银行卡设置
const AddBankCard = r => require.ensure([], () => r(require('@/components/Personal/AccountReceivableAccount/AddBankCard')), 'add-bank')
// 微信设置
const AddWeChat = r => require.ensure([], () => r(require('@/components/Personal/AccountReceivableAccount/AddWeChat')), 'add-chat')
// 支付宝设置
const AddSetAlipay = r => require.ensure([], () => r(require('@/components/Personal/AccountReceivableAccount/AddSetAlipay')), 'add-alipay')
// paypal设置
const AddSetPaypal = r => require.ensure([], () => r(require('@/components/Personal/AccountReceivableAccount/AddSetPaypal')), 'add-payment')
// 西联汇款设置
const AddWesternUnion = r => require.ensure([], () => r(require('@/components/Personal/AccountReceivableAccount/AddWesternUnion')), 'add-western')
// 安全邮箱设置
const SecureEmail = r => require.ensure([], () => r(require('@/components/Personal/UserSecuritySettings/UserSecureEmail')), 'set-email')
// 安全手机设置
const SecurePhone = r => require.ensure([], () => r(require('@/components/Personal/UserSecuritySettings/UserSecurePhone')), 'set-phone')
// 谷歌验证
const GoogleBinding = r => require.ensure([], () => r(require('@/components/Personal/UserSecuritySettings/UserGoogleBinding')), 'binding-google')
// 设置交易密码
const TransactionPassword = r => require.ensure([], () => r(require('@/components/Personal/UserSecuritySettings/UserTransactionPassword')), 'transaction-password')
// 修改登录密码
const LoginPassword = r => require.ensure([], () => r(require('@/components/Personal/UserSecuritySettings/UserLoginPassword')), 'login-password')
/**
 * VIP
 */
const VipMainContent = r => require.ensure([], () => r(require('@/pages/VipMainContent')), 'vip-main')
/**
 * OTC
 */
const OTCCenter = r => require.ensure([], () => r(require('@/pages/OTC/OTCCenter')), 'otc-center')
const OTCPublishBuyAndSell = r => require.ensure([], () => r(require('@/components/OTC/OTCPublishBuyAndSell')), 'otc-publish-buy-and-sell')
const OTCOnlineTraderBuySell = r => require.ensure([], () => r(require('@/components/OTC/OTCOnlineTraderBuySell')), 'otc-online-trader-buy-sell')
const OTCPublishAD = r => require.ensure([], () => r(require('@/pages/OTC/OTCPublishAD')), 'otc-publish-AD')
const OTCADManage = r => require.ensure([], () => r(require('@/pages/OTC/OTCADManage')), 'otc-AD-manage')
const OTCMerchantsOrders = r => require.ensure([], () => r(require('@/pages/OTC/OTCMerchantsOrders')), 'otc-merchants-orders')
const OTCReportFormStatistics = r => require.ensure([], () => r(require('@/pages/OTC/OTCReportFormStatistics')), 'otc-report-form-statistics')
const OTCBusinessApply = r => require.ensure([], () => r(require('@/pages/OTC/OTCBusinessApply')), 'otc-business-apply')
/**
 * 投资理财
 */
const FinanceCenter = r => require.ensure([], () => r(require('@/components/InvestmentFinance/FinanceCenter')), 'finance-center')
const FinanceInvestmentRecord = r => require.ensure([], () => r(require('@/components/InvestmentFinance/FinanceInvestmentRecord')), 'finance-investment-record')
/**
 * User
 */
// 登录
const Login = r => require.ensure([], () => r(require('@/pages/LoginUser')), 'login')
// 注册
const Register = r => require.ensure([], () => r(require('@/pages/RegisterUser')), 'register')
const InvitationRegister = r => require.ensure([], () => r(require('@/pages/InvitationRegister')), 'invitationRegister')
const ForgetPassword = r => require.ensure([], () => r(require('@/components/User/ForgetPassword')), 'forget-password')
/**
 * TradeCenter
 */
// 币币交易
const TradeCenter = r => require.ensure([], () => r(require('@/pages/TradeCenter')), 'trade-center')

/**
 * ActivityCenter
 */
const RankingListOfInvitation = r => require.ensure([], () => r(require('@/components/ActivityCenter/RankingListOfInvitation')), 'ranking-list-of-invitation')
// 上币申请
const currencyApplication = r => require.ensure([], () => r(require('@/components/ActivityCenter/currencyApplication')), 'currency-application')

/**
 * 新闻公告
 */
const NewsAndNoticeCenter = r => require.ensure([], () => r(require('@/components/NoticeAndNews/NewAndNoticeCenter')), 'news-andNotice-center')
/**
 * 新闻列表
 */
// const NewsAndNoticeList = r => require.ensure([], () => r(require('@/components/NoticeAndNews/NewsAndNoticeList')), 'news-andNotice-list')
/**
 * 新闻详情
 */
const NewsAndNoticeItem = r => require.ensure([], () => r(require('@/components/NoticeAndNews/NewsAndNoticeItem')), 'news-andNotice-item')

const HelpCenter = r => require.ensure([], () => r(require('@/components/FooterInfo/HelpCenter')), 'news-andNotice-list')
/**
 * FooterInfo
 */
// aboutUs
const AboutUs = r => require.ensure([], () => r(require('@/components/FooterInfo/AboutUs')), 'about-us')
const ServiceAndProtocol = r => require.ensure([], () => r(require('@/components/FooterInfo/ServiceAndProtocol')), 'service-protocol')
/**
 * appDownload
 */
const DownloadApp = r => require.ensure([], () => r(require('@/pages/DownloadApp')), 'download-app')
const GuideOfDownload = r => require.ensure([], () => r(require('@/pages/GuideOfDownload')))
const errorFor404And500 = r => require.ensure([], () => r(require('@/pages/ErrorFor500And404')), 'error')
const router = new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      // 首页
      path: '/home',
      name: 'HomeCenter',
      component: HomeCenter
    },
    {
      // 个人中心
      path: '/PersonalCenter',
      // name: 'PersonalCenter',
      component: PersonalCenter
    },
    {
      // VIP
      path: '/VipMainContent',
      // name: 'VipMainContent',
      component: VipMainContent
    },
    {
      path: '/TradeCenter',
      name: 'TradeCenter',
      component: TradeCenter
    },
    {
      // 银行卡设置
      path: '/AddBankCard',
      name: 'AddBankCard',
      component: AddBankCard,
      meta: {
        auth: true
      }
    },
    {
      // 支付宝设置
      path: '/AddSetAlipay',
      // name: 'AddSetAlipay',
      component: AddSetAlipay,
      meta: {
        auth: true
      }
    },
    {
      // 微信设置
      path: '/AddWeChat',
      // name: 'AddWeChat',
      component: AddWeChat,
      meta: {
        auth: true
      }
    },
    {
      // paypal设置
      path: '/AddSetPaypal',
      // name: 'AddSetPaypal',
      component: AddSetPaypal,
      meta: {
        auth: true
      }
    },
    {
      // 西联汇款设置
      path: '/AddWesternUnion',
      // name: 'AddWesternUnion',
      component: AddWesternUnion,
      meta: {
        auth: true
      }
    },
    {
      // 安全邮箱设置
      path: '/SecureEmail',
      // name: 'SecureEmail',
      component: SecureEmail,
      meta: {
        auth: true
      }
    },
    {
      // 安全手机设置
      path: '/SecurePhone',
      // name: 'SecurePhone',
      component: SecurePhone,
      meta: {
        auth: true
      }
    },
    {
      // 绑定谷歌验证
      path: '/GoogleBinding',
      // name: 'GoogleBinding',
      component: GoogleBinding,
      meta: {
        auth: true
      }
    },
    {
      // 设置交易密码
      path: '/TransactionPassword',
      // name: 'TransactionPassword',
      component: TransactionPassword,
      meta: {
        auth: true
      }
    },
    {
      // 修改登录密码
      path: '/LoginPassword',
      // name: 'LoginPassword',
      component: LoginPassword,
      meta: {
        auth: true
      }
    },
    {
      // OTC中心
      path: '/OTCCenter',
      // name: 'OTCCenter',
      component: OTCCenter
    },
    {
      // OTC发布购买和出售
      // path: '/OTCPublishBuyAndSell',
      // 买卖类型：styleID；可用商户币种id:partnerCoinId; 可用法币id：currencyID
      path: '/OTCPublishBuyAndSell/:styleID/:partnerCoinId/:currencyID',
      // name: 'OTCPublishBuyAndSell',
      component: OTCPublishBuyAndSell,
      meta: {
        auth: true
      }
    },
    {
      // OTC在线交易买卖
      path: '/OTCOnlineTraderBuySell/:styleId/:id/:partnerCoinId',
      // name: 'OTCOnlineTraderBuySell',
      component: OTCOnlineTraderBuySell,
      meta: {
        auth: true
      }
    },
    {
      // OTC发布广告
      path: '/OTCPublishAD',
      // name: 'OTCPublishAD',
      component: OTCPublishAD,
      meta: {
        auth: true,
        isMerchant: true
      }
    },
    {
      // OTC广告管理
      path: '/OTCADManage',
      // name: 'OTCADManage',
      component: OTCADManage,
      meta: {
        auth: true,
        isMerchant: true
      }
    },
    {
      // OTC商家订单
      path: '/OTCMerchantsOrders',
      // name: 'OTCMerchantsOrders',
      component: OTCMerchantsOrders,
      meta: {
        auth: true,
        isMerchant: true
      }
    },
    {
      // OTC商家申请
      path: '/OTCBusinessApply',
      // name: 'OTCBusinessApply',
      component: OTCBusinessApply,
      meta: {
        auth: true
      }
    },
    {
      // OTC报表统计
      path: '/OTCReportFormStatistics',
      // name: 'OTCReportFormStatistics',
      component: OTCReportFormStatistics,
      meta: {
        auth: true,
        isMerchant: true
      }
    },
    {
      // 投资理财中心
      path: '/FinanceCenter',
      name: 'FinanceCenter',
      component: FinanceCenter
    },
    {
      path: '/FinanceInvestmentRecord',
      name: 'FinanceInvestmentRecord',
      component: FinanceInvestmentRecord
    },
    // 币币交易
    {
      path: '/TradeCenter',
      name: 'TradeCenter',
      component: TradeCenter
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    // 注册
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/invitationRegister',
      component: InvitationRegister
    },
    // 忘记密码
    {
      path: '/ForgetPassword',
      name: 'forgetPassword',
      component: ForgetPassword
    },
    {
      // 活动中心
      path: '/ActivityCenter',
      redirect: '/CurrencyApplication'
    },
    {
      // 上币申请
      path: '/CurrencyApplication',
      component: currencyApplication
    },
    {
      path: '/RankingListOfInvitation',
      component: RankingListOfInvitation
    },
    {
      // 新闻中心
      path: '/NewsAndNoticeCenter',
      component: NewsAndNoticeCenter
    },
    {
      path: '/NewsAndNoticeItem/:id',
      name: 'news-and-notice-item',
      component: NewsAndNoticeItem
    },
    {
      // 关于我们
      path: '/AboutUs',
      component: AboutUs
    },
    {
      path: '/HelpCenter',
      component: HelpCenter
    },
    {
      path: '/ServiceAndProtocol',
      component: ServiceAndProtocol
    },
    {
      path: '/downloadApp',
      component: DownloadApp
    },
    {
      path: '/guideOfDownload',
      component: GuideOfDownload
    },
    {
      path: '/500',
      component: errorFor404And500
    },
    {
      path: '*',
      component: errorFor404And500
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log(to)
  console.log(from)
  console.log(to.path, from.path)
  if (from.path !== '/login' || from.path !== '/register') {
    store.commit('common/CHANGE_ROUTER_PATH', from.path)
    console.log(store.state.common.routerTo)
  }
  console.log(store.state.user.isLogin)
  console.log(store.state.user.loginStep1Info.userInfo)
  if (store.state.user.loginStep1Info.userInfo) {
    store.commit('user/USER_LOGIN', store.state.user.loginStep1Info)
  }
  // 原来的
  // if (to.matched.some(m => m.meta.auth)) {
  //   console.log(to)
  //   // 对路由进行验证
  //   if (store.state.user.isLogin) { // 已经登陆
  //     console.log(store.state.user)
  //     next() // 正常跳转到你设置好的页面
  //   } else {
  //     // 未登录则跳转到登陆界面，query:{ Rurl: to.fullPath}表示把当前路由信息传递过去方便登录后跳转回来；
  //     next({path: '/login', query: {Rurl: to.fullPath}})
  //   }
  // } else {
  //   next()
  // }
  // 增加普通用户不能点击OTC导航功能
  if (to.matched.some(m => m.meta.auth)) {
    console.log(to)
    // 对路由进行验证
    if (store.state.user.isLogin) { // 已经登陆
      // console.log(store.state.user)
      // console.log(store.state.user.loginStep1Info.userInfo.type)
      if (to.meta.isMerchant) {
        if (store.state.user.loginStep1Info.userInfo.type === 'MERCHANT') {
          next()
        } else {
          next({path: '/OTCBusinessApply'})
        }
      } else {
        next() // 正常跳转到你设置好的页面
      }
    } else {
      // 未登录则跳转到登陆界面，query:{ Rurl: to.fullPath}表示把当前路由信息传递过去方便登录后跳转回来；
      next({path: '/login', query: {Rurl: to.fullPath}})
    }
  } else {
    next()
  }
})

export default router
