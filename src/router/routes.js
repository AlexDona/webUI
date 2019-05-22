import personalCenterRoutes from './personal-center-routes'

const HomeCenter = () => import('@/pages/HomeCenter')
const PersonalCenter = () => import('@/pages/PersonalCenter')
// 银行卡设置
const AddBankCard = () => import('@com/Personal/AccountReceivableAccount/AddBankCard')
// 微信设置
const AddWeChat = () => import('@com/Personal/AccountReceivableAccount/AddWeChat')
// 支付宝设置
const AddSetAlipay = () => import('@com/Personal/AccountReceivableAccount/AddSetAlipay')
// paypal设置
const AddSetPaypal = () => import('@com/Personal/AccountReceivableAccount/AddSetPaypal')
// 西联汇款设置
const AddWesternUnion = () => import('@com/Personal/AccountReceivableAccount/AddWesternUnion')
// 安全邮箱设置
const SecureEmail = () => import('@com/Personal/UserSecuritySettings/UserSecureEmail')
// 安全手机设置
const SecurePhone = () => import('@com/Personal/UserSecuritySettings/UserSecurePhone')
// 谷歌验证
const GoogleBinding = () => import('@com/Personal/UserSecuritySettings/UserGoogleBinding')
// 设置交易密码
const TransactionPassword = () => import('@com/Personal/UserSecuritySettings/UserTransactionPassword')
// 修改登录密码
const LoginPassword = () => import('@com/Personal/UserSecuritySettings/UserLoginPassword')
// VIP
const VipMainContent = () => import('@/pages/VIP/VipMainContent')
const OpenVIP = () => import('@/pages/VIP/OpenVIP')
// OTC
const OTCCenter = () => import('@/pages/OTC/OTCCenter')
const OTCPublishBuyAndSell = () => import('@com/OTC/OTCPublishBuyAndSell')
const OTCOnlineTraderBuySell = () => import('@com/OTC/OTCOnlineTraderBuySell')
const OTCPublishAD = () => import('@/pages/OTC/OTCPublishAD')
const OTCADManage = () => import('@/pages/OTC/OTCADManage')
const OTCMerchantsOrders = () => import('@/pages/OTC/OTCMerchantsOrders')
const OTCReportFormStatistics = () => import('@/pages/OTC/OTCReportFormStatistics')
const OTCBusinessApply = () => import('@/pages/OTC/OTCBusinessApply')
// 投资理财
const FinanceCenter = () => import('@com/InvestmentFinance/FinanceCenter')
const FinanceInvestmentRecord = () => import('@com/InvestmentFinance/FinanceInvestmentRecord')
// 登录
const Login = () => import('@/pages/LoginUser')
// 注册
const Register = () => import('@/pages/RegisterUser')
const InvitationRegister = () => import('@/pages/InvitationRegister')
const ForgetPassword = () => import('@com/User/ForgetPassword')
// TradeCenter
const TradeCenter = () => import('@/pages/TradeCenter')
const RankingListOfInvitation = () => import('@com/ActivityCenter/RankingListOfInvitation')

// 上币申请
const currencyApplication = () => import('@com/ActivityCenter/currencyApplication')
// 新闻公告
const NewsAndNoticeCenter = () => import('@com/NoticeAndNews/NewAndNoticeCenter')
// 新闻详情
const NewsAndNoticeItem = () => import('@com/NoticeAndNews/NewsAndNoticeItem')
const HelpCenter = () => import('@com/FooterInfo/HelpCenter')
// FooterInfo
const AboutUs = () => import('@com/FooterInfo/AboutUs')
const ServiceAndProtocol = () => import('@com/FooterInfo/ServiceAndProtocol')
const DownloadApp = () => import('@/pages/DownloadApp')
const GuideOfDownload = () => import('@/pages/GuideOfDownload')
const errorFor404And500 = () => import('@/pages/ErrorFor500And404')

const FucCenter = () => import('@/pages/FucCenter')

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    // 首页
    path: '/home',
    name: 'HomeCenter',
    component: HomeCenter
  },
  {
    // 个人中心
    path: '/PersonalCenter',
    name: 'PersonalCenter',
    component: PersonalCenter,
    children: personalCenterRoutes
  },
  {
    // VIP
    path: '/VipMainContent',
    // name: 'VipMainContent',
    component: VipMainContent
  },
  {
    // 开通vip页面
    path: '/openVIP',
    component: OpenVIP
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
    // 投资理财中心
    path: '/FinanceCenter',
    name: 'FinanceCenter',
    component: FinanceCenter
  },
  {
    path: '/FinanceInvestmentRecord',
    name: 'FinanceInvestmentRecord',
    component: FinanceInvestmentRecord
  },
  // 币币交易
  {
    path: '/TradeCenter/:tradeId',
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
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/invitationRegister',
    component: InvitationRegister
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
    redirect: '/RankingListOfInvitation'
  },
  {
    // Fuc生态
    path: '/FucCenter',
    component: FucCenter
  },
  {
    // 上币申请
    path: '/CurrencyApplication',
    component: currencyApplication
  },
  {
    path: '/RankingListOfInvitation',
    component: RankingListOfInvitation
  },
  {
    // 新闻中心
    path: '/NewsAndNoticeCenter',
    component: NewsAndNoticeCenter
  },
  {
    path: '/NewsAndNoticeItem/:detailId',
    name: 'news-and-notice-item',
    component: NewsAndNoticeItem,
    props: true
  },
  {
    // 关于我们
    path: '/AboutUs',
    component: AboutUs
  },
  {
    path: '/HelpCenter',
    component: HelpCenter
  },
  {
    path: '/ServiceAndProtocol',
    component: ServiceAndProtocol
  },
  {
    path: '/downloadApp',
    component: DownloadApp
  },
  {
    path: '/guideOfDownload',
    component: GuideOfDownload
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
