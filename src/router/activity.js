/**
 * author: zhaoxinlei
 * update: 20190902
 * description: 当前页面为 活动 相关路由
 */
import {createBaseRoute, routesVariable as routers, routesVariable} from './routesVariable'

const {shoppingSpree, crowdFunding, crowdFundingRecord} = routesVariable
export default [
  {
    // 活动中心
    path: '/ActivityCenter',
    redirect: '/RankingListOfInvitation'
  },
  // 众筹
  {
    ...createBaseRoute({
      name: `${crowdFunding}`
    }),
    component: () => import('@/pages/Activity/TheCrowdFunding.vue')
  },
  {
    ...createBaseRoute({
      name: `${crowdFunding}`,
      path: `/${crowdFunding}/:detailId`,
      props: true
    }),
    component: () => import('@/pages/Activity/TheCrowdFundingDetail.vue')
  },
  {
    ...createBaseRoute({
      name: `${crowdFundingRecord}`,
      path: `/${crowdFundingRecord}`,
      auth: true
    }),
    component: () => import('@/pages/Activity/TheCrowdFundingRecord.vue')
  },
  {
    // 超级节点
    path: '/SuperNodes',
    component: () => import('@/pages/SuperNodes')
  },
  {
    // 上币申请
    path: '/CurrencyApplication',
    component: () => import('@com/ActivityCenter/currencyApplication')
  },

  {
    // 投资理财中心
    path: '/FinanceCenter',
    name: 'FinanceCenter',
    component: () => import('@com/InvestmentFinance/FinanceCenter')
  },

  {
    path: '/FinanceInvestmentRecord',
    name: 'FinanceInvestmentRecord',
    component: () => import('@com/InvestmentFinance/FinanceInvestmentRecord')
  },
  {
    // Fuc生态
    path: '/FucCenter',
    component: () => import('@/pages/FucCenter')
  },
  // 打折抢购
  {
    ...createBaseRoute({
      name: `${shoppingSpree}`
    }),
    component: () => import('@/pages/Activity/ShoppingSpree/TheShoppingSpree')
  },
  // 抢购详情
  {
    ...createBaseRoute({
      name: `${shoppingSpree}-detail`,
      path: `/${shoppingSpree}/:detailId`,
      props: true
    }),
    component: () => import('@/pages/Activity/ShoppingSpree/TheShoppingSpreeDetail')
  },
  // 抢购记录
  {
    ...createBaseRoute({
      name: `${shoppingSpree}-record`,
      path: `/record/${shoppingSpree}`,
      auth: true
    }),
    component: () => import('@/pages/Activity/ShoppingSpree/TheShoppingSpreeRecord')
  },
  // 封神榜
  {
    ...createBaseRoute({
      path: `/${routers.FSB}`,
      name: `${routers.FSB}`
    }),
    component: () => import(/* webpackChunkName: "FSB" */ '../pages/FSB')
  },
  // 合伙人返佣排行榜
  {
    ...createBaseRoute({
      path: `/${routers.RebateRankList}`,
      name: `${routers.RebateRankList}`
    }),
    component: () => import(/* webpackChunkName: "RebateRankList" */ '../pages/RebateRankList')
  }
]
