import {createBaseRoute, routesVariable} from './routesVariable'

export default [
  {
    // 活动中心
    path: '/ActivityCenter',
    redirect: '/RankingListOfInvitation'
  },
  // 众筹
  {
    ...createBaseRoute({
      name: `${routesVariable.crowdFunding}`
    }),
    component: () => import('@/pages/Activity/TheCrowdFunding.vue')
  },
  {
    ...createBaseRoute({
      name: `${routesVariable.crowdFunding}`,
      path: `/${routesVariable.crowdFunding}/:detailId`,
      props: true
    }),
    component: () => import('@/pages/Activity/TheCrowdFundingDetail.vue')
  },
  {
    ...createBaseRoute({
      name: `${routesVariable.crowdFundingRecord}`,
      path: `/${routesVariable.crowdFundingRecord}`,
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

  {
    // 封神榜
    path: '/FSB',
    component: () => import('@/pages/FSB')
  }
]
