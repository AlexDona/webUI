import personalChildren from './personalChildren'
import activity from './activity'
import {routesVariable} from './routesVariable'
import user from './user'
import mobile from './mobile'
import personal from './personal'
// OTC
const OTCCenter = () => import('@/pages/OTC/OTCCenter')
const OTCPublishBuyAndSell = () => import('@com/OTC/OTCPublishBuyAndSell')
const OTCOnlineTraderBuySell = () => import('@com/OTC/OTCOnlineTraderBuySell')
const OTCPublishAD = () => import('@/pages/OTC/OTCPublishAD')
const OTCADManage = () => import('@/pages/OTC/OTCADManage')
const OTCMerchantsOrders = () => import('@/pages/OTC/OTCMerchantsOrders')
const OTCReportFormStatistics = () => import('@/pages/OTC/OTCReportFormStatistics')
const OTCBusinessApply = () => import('@/pages/OTC/OTCBusinessApply')
const OTCViewMerchantInfo = () => import('@com/OTC/OTCViewMerchantInfo')
const errorFor404And500 = () => import('@/pages/ErrorFor500And404')

const routes = [
  ...mobile,
  ...user,
  ...activity,
  ...personal,
  {
    path: '/',
    redirect: `/${routesVariable.home}`
  },
  {
    // 首页
    path: `/${routesVariable.home}`,
    name: 'HomeCenter',
    component: () => import('@/pages/HomeCenter')
  },
  {
    // 个人中心
    path: '/PersonalCenter',
    name: 'PersonalCenter',
    component: () => import('@/pages/PersonalCenter'),
    children: personalChildren
  },
  {
    // OTC中心
    path: '/OTCCenter',
    name: 'OTCCenter',
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
    // OTC商家信息
    path: '/OTCViewMerchantInfo',
    // name: 'OTCViewMerchantInfo',
    component: OTCViewMerchantInfo,
    meta: {
      auth: true,
      isMerchant: true
    }
  },
  // 币币交易
  {
    path: '/TradeCenter/:tradeId',
    name: 'TradeCenter',
    component: () => import('@/pages/TradeCenter')
  },
  {
    // 量化
    path: '/QuantizationCenter',
    component: () => import('@com/Quantization/QuantizationCenter')
  },
  {
    path: '/RankingListOfInvitation',
    component: () => import('@com/ActivityCenter/RankingListOfInvitation')
  },
  {
    // 新闻中心
    path: `/${routesVariable.news}`,
    component: () => import('@com/NoticeAndNews/TheNewsList.vue')
  },
  {
    path: `/${routesVariable.newsItem}/:detailId`,
    name: 'news-and-notice-item',
    component: () => import('@com/NoticeAndNews/NewsAndNoticeItem'),
    props: true
  },
  {
    // 关于我们
    path: '/AboutUs',
    component: () => import('@com/FooterInfo/AboutUs')
  },
  {
    path: '/HelpCenter',
    component: () => import('@com/FooterInfo/HelpCenter')
  },
  {
    path: '/ServiceAndProtocol',
    component: () => import('@com/FooterInfo/ServiceAndProtocol')
  },
  {
    path: '/guideOfDownload',
    component: () => import('@/pages/GuideOfDownload')
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
export default routes
