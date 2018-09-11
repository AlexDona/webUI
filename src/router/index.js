import Vue from 'vue'
import Router from 'vue-router'
import store from '../vuex'

Vue.use(Router)
/**
 * Common
 */

const HomeCenter = r => require.ensure([], () => r(require('@/components/Home/HomeCenter')), 'home-center')
/**
 * Personal
 */
const PersonalCenter = r => require.ensure([], () => r(require('@/components/Personal/UserAssets/PersonalCenter')), 'user-center')
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
 * OTC
 */
const OTCCenter = r => require.ensure([], () => r(require('@/components/OTC/OTCCenter')), 'otc-center')
const OTCPublishBuyAndSell = r => require.ensure([], () => r(require('@/components/OTC/OTCPublishBuyAndSell')), 'otc-publish-buy-and-sell')
const OTCOnlineTraderBuySell = r => require.ensure([], () => r(require('@/components/OTC/OTCOnlineTraderBuySell')), 'otc-online-trader-buy-sell')
const OTCPublishAD = r => require.ensure([], () => r(require('@/components/OTC/OTCPublishAD')), 'otc-publish-AD')
const OTCADManage = r => require.ensure([], () => r(require('@/components/OTC/OTCADManage')), 'otc-AD-manage')
const OTCMerchantsOrders = r => require.ensure([], () => r(require('@/components/OTC/OTCMerchantsOrders')), 'otc-merchants-orders')
const OTCReportFormStatistics = r => require.ensure([], () => r(require('@/components/OTC/OTCReportFormStatistics')), 'otc-report-form-statistics')
const OTCBusinessApply = r => require.ensure([], () => r(require('@/components/OTC/OTCBusinessApply')), 'otc-business-apply')
/**
 * User
 */
// 登录
const Login = r => require.ensure([], () => r(require('@/components/User/LoginUser')), 'login')
// 注册
const Register = r => require.ensure([], () => r(require('@/components/User/RegisterUser')), 'login')
const ForgetPassword = r => require.ensure([], () => r(require('@/components/User/ForgetPassword')), 'forget-password')
/**
 * TradeCenter
 */
// 币币交易
const TradeCenter = r => require.ensure([], () => r(require('@/components/Trade/TradeCenter')), 'trade-center')

/**
 * ActivityCenter
 */
const ActivityCenter = r => require.ensure([], () => r(require('@/components/ActivityCenter/ActivityCenter')), 'activity-center')

const router = new Router({
  routes: [
    {
      // 首页
      path: '/',
      // name: 'HomeCenter',
      component: HomeCenter
    },
    {
      // 个人中心
      path: '/PersonalCenter',
      // name: 'PersonalCenter',
      component: PersonalCenter,
      meta: {
        auth: true
      }
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
      path: '/OTCPublishBuyAndSell',
      // name: 'OTCPublishBuyAndSell',
      component: OTCPublishBuyAndSell,
      meta: {
        auth: true
      }
    },
    // {
    //   // OTC在线交易买卖
    //   path: '/OTCOnlineTraderBuySell/:styleId',
    //   // name: 'OTCOnlineTraderBuySell',
    //   component: OTCOnlineTraderBuySell
    // },
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
        auth: true
      }
    },
    {
      // OTC广告管理
      path: '/OTCADManage',
      // name: 'OTCADManage',
      component: OTCADManage,
      meta: {
        auth: true
      }
    },
    {
      // OTC商家订单
      path: '/OTCMerchantsOrders',
      // name: 'OTCMerchantsOrders',
      component: OTCMerchantsOrders,
      meta: {
        auth: true
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
        auth: true
      }
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
      path: '/Register',
      // name: 'Register',
      component: Register
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
      component: ActivityCenter
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path !== '/login') {
    store.commit('common/CHANGE_ROUTER_PATH', to.path)
  }

  if (to.matched.some(m => m.meta.auth)) {
    // 对路由进行验证
    if (store.state.common.isLogin) { // 已经登陆
      next() // 正常跳转到你设置好的页面
    } else {
      // 未登录则跳转到登陆界面，query:{ Rurl: to.fullPath}表示把当前路由信息传递过去方便登录后跳转回来；
      next({path: '/login', query: {Rurl: to.fullPath}})
    }
  } else {
    next()
  }
})

export default router
