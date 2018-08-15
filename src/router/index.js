import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const HomeCenter = r => require.ensure([], () => r(require('@/components/Home/HomeCenter')), 'home-center')
// 个人中心
const PersonalCenter = r => require.ensure([], () => r(require('@/components/Personal/PersonalCenter')), 'user-center')
const OTCCenter = r => require.ensure([], () => r(require('@/components/OTC/OTCCenter')), 'otc-center')
// 币币交易
const TradeCenter = r => require.ensure([], () => r(require('@/components/Trade/TradeCenter')), 'trade-center')
const OTCPublishBuyAndSell = r => require.ensure([], () => r(require('@/components/OTC/OTCPublishBuyAndSell')), 'otc-publish-buy-and-sell')
const OTCOnlineTraderBuySell = r => require.ensure([], () => r(require('@/components/OTC/OTCOnlineTraderBuySell')), 'otc-online-trader-buy-sell')
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
      path: '/TradeCenter',
      name: 'TradeCenter',
      component: TradeCenter
    },
    {
      // OTC在线交易买卖
      path: '/OTCOnlineTraderBuySell',
      // name: 'OTCOnlineTraderBuySell',
      component: OTCOnlineTraderBuySell
    }
  ]
})
