/**
 * author: renfuwei
 * create: 20190829
 * description: 当前页面为 OTC模块 相关路由
 */
import {createBaseRoute, routesVariable as routers} from './routesVariable'

const OTCRoutes = [
  // 1 OTC中心
  {
    ...createBaseRoute({
      path: `/${routers.OTCCenter}`,
      name: `${routers.OTCCenter}`
    }),
    component: () => import(/* webpackChunkName: "OTCCenter" */ '../pages/OTC/OTCCenter')
  },

  // 2 OTC发布购买和出售
  {
    ...createBaseRoute({
      path: `/${routers.OTCPublishBuyAndSell}/:styleID/:partnerCoinId/:currencyID`,
      name: `${routers.OTCPublishBuyAndSell}`
    }),
    component: () => import(/* webpackChunkName: "OTCPublishBuyAndSell" */ '../components/OTC/OTCPublishBuyAndSell'),
    meta: {
      auth: true
    }
  },

  // 3 OTC在线交易买卖
  {
    ...createBaseRoute({
      path: `/${routers.OTCOnlineTraderBuySell}/:styleId/:id/:partnerCoinId`,
      name: `${routers.OTCOnlineTraderBuySell}`
    }),
    component: () => import(/* webpackChunkName: "OTCOnlineTraderBuySell" */ '../components/OTC/OTCOnlineTraderBuySell'),
    meta: {
      auth: true
    }
  },

  // 4 OTC发布广告
  {
    ...createBaseRoute({
      path: `/${routers.OTCPublishAD}`,
      name: `${routers.OTCPublishAD}`
    }),
    component: () => import(/* webpackChunkName: "OTCPublishAD" */ '../pages/OTC/OTCPublishAD'),
    meta: {
      auth: true,
      isMerchant: true
    }
  },

  // 5 OTC广告管理
  {
    ...createBaseRoute({
      path: `/${routers.OTCADManage}`,
      name: `${routers.OTCADManage}`
    }),
    component: () => import(/* webpackChunkName: "OTCADManage" */ '../pages/OTC/OTCADManage'),
    meta: {
      auth: true,
      isMerchant: true
    }
  },

  // 6 OTC商家订单
  {
    ...createBaseRoute({
      path: `/${routers.OTCMerchantsOrders}`,
      name: `${routers.OTCMerchantsOrders}`
    }),
    component: () => import(/* webpackChunkName: "OTCMerchantsOrders" */ '../pages/OTC/OTCMerchantsOrders'),
    meta: {
      auth: true,
      isMerchant: true
    }
  },

  // 7 OTC商家申请
  {
    ...createBaseRoute({
      path: `/${routers.OTCBusinessApply}`,
      name: `${routers.OTCBusinessApply}`
    }),
    component: () => import(/* webpackChunkName: "OTCBusinessApply" */ '../pages/OTC/OTCBusinessApply'),
    meta: {
      auth: true
    }
  },

  // 8 OTC报表统计
  {
    ...createBaseRoute({
      path: `/${routers.OTCReportFormStatistics}`,
      name: `${routers.OTCReportFormStatistics}`
    }),
    component: () => import(/* webpackChunkName: "OTCReportFormStatistics" */ '../pages/OTC/OTCReportFormStatistics'),
    meta: {
      auth: true,
      isMerchant: true
    }
  },

  // 9 OTC商家信息
  {
    ...createBaseRoute({
      path: `/${routers.OTCViewMerchantInfo}`,
      name: `${routers.OTCViewMerchantInfo}`
    }),
    component: () => import(/* webpackChunkName: "OTCViewMerchantInfo" */ '../components/OTC/OTCViewMerchantInfo'),
    meta: {
      auth: true,
      isMerchant: true
    }
  },

  // 10 OTC一键买币
  {
    ...createBaseRoute({
      path: `/${routers.OTCOneTrade}`,
      name: `${routers.OTCOneTrade}`
    }),
    component: () => import(/* webpackChunkName: "OTCOneTrade" */ '../components/OTC/OTCOneTrade')
  }
]
export default OTCRoutes
