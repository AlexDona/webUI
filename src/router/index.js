import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const HomeCenter = r => require.ensure([], () => r(require('@/components/Home/HomeCenter')), 'home-center')
// 个人中心
const PersonalCenter = r => require.ensure([], () => r(require('@/components/Personal/PersonalCenter')), 'user-center')
// 个人中心-账户资产
const AccountAssets = r => require.ensure([], () => r(require('@/components/Personal/AccountAssets')), 'account-box')
// 个人中心-身份认证
const IdentityAuthentication = r => require.ensure([], () => r(require('@/components/Personal/IdentityAuthentication')), 'identity-box')
// 个人中心-收款账户
const AccountCredited = r => require.ensure([], () => r(require('@/components/Personal/AccountCredited')), 'credited-box')
// 个人中心-邀请推广
const InvitingPromotion = r => require.ensure([], () => r(require('@/components/Personal/InvitingPromotion')), 'invitation-box')
// 个人中心-安全中心
const SecurityCenter = r => require.ensure([], () => r(require('@/components/Personal/SecurityCenter')), 'security-box')
// 个人中心-API管理
// 我的交易
const APIManagement = r => require.ensure([], () => r(require('@/components/Personal/APIManagement')), 'api-box')
// 我的交易-币币订单
const CoinOrders = r => require.ensure([], () => r(require('@/components/Personal/CoinOrders')), 'api-box')
// 我的交易-法币订单
const FiatOrders = r => require.ensure([], () => r(require('@/components/Personal/FiatOrders')), 'api-box')
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
      path: '/PersonalCenter',
      // name: 'PersonalCenter',
      component: PersonalCenter
    },
    {
      // 个人中心-账户资产
      path: '/AccountAssets',
      // name: 'AccountAssets',
      component: AccountAssets
    },
    {
      // 个人中心-身份认证
      path: '/IdentityAuthentication',
      // name: 'IdentityAuthentication',
      component: IdentityAuthentication
    },
    {
      // 个人中心-收款账户
      path: '/AccountCredited',
      // name: 'AccountCredited',
      component: AccountCredited
    },
    {
      // 个人中心-邀请推广
      path: '/InvitingPromotion',
      // name: 'InvitingPromotion',
      component: InvitingPromotion
    },
    {
      // 个人中心-安全中心
      path: '/SecurityCenter',
      // name: 'SecurityCenter',
      component: SecurityCenter
    },
    {
      // 个人中心-API管理
      path: '/APIManagement',
      // name: 'APIManagement',
      component: APIManagement
    },
    {
      // 我的交易-API管理
      path: '/CoinOrders',
      // name: 'CoinOrders',
      component: CoinOrders
    },
    {
      // 我的交易-API管理
      path: '/FiatOrders',
      // name: 'FiatOrders',
      component: FiatOrders
    }
  ]
})
