import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const HomeCenter = r => require.ensure([], () => r(require('@/components/Home/HomeCenter')), 'home-center')
// 个人中心
const PersonalCenter = r => require.ensure([], () => r(require('@/components/Personal/PersonalCenter')), 'user-center')
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
const OTCCenter = r => require.ensure([], () => r(require('@/components/OTC/OTCCenter')), 'otc-center')

const OTCPublishBuyAndSell = r => require.ensure([], () => r(require('@/components/OTC/OTCPublishBuyAndSell')), 'otc-publish-buy-and-sell')
const OTCOnlineTraderBuySell = r => require.ensure([], () => r(require('@/components/OTC/OTCOnlineTraderBuySell')), 'otc-online-trader-buy-sell')

const OTCPublishAD = r => require.ensure([], () => r(require('@/components/OTC/OTCPublishAD')), 'otc-publish-AD')
const OTCADManage = r => require.ensure([], () => r(require('@/components/OTC/OTCADManage')), 'otc-AD-manage')
const OTCMerchantsOrders = r => require.ensure([], () => r(require('@/components/OTC/OTCMerchantsOrders')), 'otc-merchants-orders')
const OTCReportFormStatistics = r => require.ensure([], () => r(require('@/components/OTC/OTCReportFormStatistics')), 'otc-report-form-statistics')
const OTCBusinessApply = r => require.ensure([], () => r(require('@/components/OTC/OTCBusinessApply')), 'otc-business-apply')
// 登录
const Login = r => require.ensure([], () => r(require('@/components/User/LoginUser')), 'login')
// 注册
const Register = r => require.ensure([], () => r(require('@/components/User/RegisterUser')), 'login')

// 币币交易
const TradeCenter = r => require.ensure([], () => r(require('@/components/Trade/TradeCenter')), 'trade-center')
export default new Router({
  routes: [
    {
      // 首页
      path: '/',
      // name: 'HomeCenter',
      component: HomeCenter
    },
    {
      // 个人中心
      path: '/PersonalCenter/:id',
      // name: 'PersonalCenter',
      component: PersonalCenter
    },
    {
      path: '/TradeCenter',
      name: 'TradeCenter',
      component: TradeCenter
    },
    {
      // 银行卡设置
      path: '/AddBankCard',
      // name: 'AddBankCard',
      component: AddBankCard
    },
    {
      // 支付宝设置
      path: '/AddSetAlipay',
      // name: 'AddSetAlipay',
      component: AddSetAlipay
    },
    {
      // 微信设置
      path: '/AddWeChat',
      // name: 'AddWeChat',
      component: AddWeChat
    },
    {
      // paypal设置
      path: '/AddSetPaypal',
      // name: 'AddSetPaypal',
      component: AddSetPaypal
    },
    {
      // 西联汇款设置
      path: '/AddWesternUnion',
      // name: 'AddWesternUnion',
      component: AddWesternUnion
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
      component: OTCPublishBuyAndSell
    },
    {
      // OTC在线交易买卖
      path: '/OTCOnlineTraderBuySell/:styleId',
      // name: 'OTCOnlineTraderBuySell',
      component: OTCOnlineTraderBuySell
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      // OTC发布广告
      path: '/OTCPublishAD',
      // name: 'OTCPublishAD',
      component: OTCPublishAD
    },
    {
      // OTC广告管理
      path: '/OTCADManage',
      // name: 'OTCADManage',
      component: OTCADManage
    },
    {
      // OTC商家订单
      path: '/OTCMerchantsOrders',
      // name: 'OTCMerchantsOrders',
      component: OTCMerchantsOrders
    },
    {
      // OTC商家申请
      path: '/OTCBusinessApply',
      // name: 'OTCBusinessApply',
      component: OTCBusinessApply
    },
    {
      // OTC报表统计
      path: '/OTCReportFormStatistics',
      // name: 'OTCReportFormStatistics',
      component: OTCReportFormStatistics
    },
    {
      // 注册
      path: '/Register',
      // name: 'Register',
      component: Register
    }
  ]
})
