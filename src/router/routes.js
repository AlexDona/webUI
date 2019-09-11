import personalChildren from './personalChildren'
import activity from './activity'
import {routesVariable} from './routesVariable'
import user from './user'
import mobile from './mobile'
import personal from './personal'
import OTCRoutes from './OTC'

const errorFor404And500 = () => import('@/pages/ErrorFor500And404')

const routes = [
  ...mobile,
  ...user,
  ...activity,
  ...personal,
  // OTC模块
  ...OTCRoutes,
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
  // 币币交易
  {
    path: '/TradeCenter/:tradeId',
    name: 'TradeCenter',
    component: () => import('@/pages/TradeCenter')
  },
  {
    // 量化
    path: `/${routesVariable.quantization}`,
    name: `${routesVariable.quantization}`,
    component: () => import('@com/Quantization/QuantizationCenter')
  },
  {
    // 轮动策略
    path: `/${routesVariable.strategy}`,
    name: `${routesVariable.strategy}`,
    component: () => import('@com/Quantization/RotationStrategy')
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
    path: `/${routesVariable.guideOfDownload}`,
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
