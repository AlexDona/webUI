import {createBaseRoute, routesVariable} from './routesVariable'

export default [
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
      path: `/${routesVariable.crowdFundingRecord}`
    }),
    component: () => import('@/pages/Activity/TheCrowdFundingRecord.vue')
  }
]
