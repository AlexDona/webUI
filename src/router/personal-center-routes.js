// 账户资产
const AccountAssets = () => import('@com/Personal/AccountBalance/AccountAssets')
// 账单明细
const BillingDetails = () => import('@com/Personal/AccountBalance/BillingDetails')
// 提币地址
const WithdrawalAddress = () => import('@com/Personal/AccountBalance/WithdrawalAddress')
// 身份认证
const IdentityAuthentication = () => import('@com/Personal/UserAssets/IdentityAuthentication')
// 收款账户
const AccountCredited = () => import('@com/Personal/UserAssets/AccountCredited')
// 邀请推广
const InvitingPromotion = () => import('@com/Personal/UserAssets/InvitingPromotion')
// 安全中心
const SecurityCenter = () => import('@com/Personal/UserAssets/SecurityCenter')
// API管理
const APIManagement = () => import('@com/Personal/UserAssets/APIManagement')
// push资产
const PushAsset = () => import('@com/Personal/UserAssets/PushAsset')
// 币币订单
const CoinOrders = () => import('@com/Personal/TransactionType/CoinOrders')
// 法币订单
const FiatOrders = () => import('@com/Personal/TransactionType/FiatOrders')
// 个人设置
const PersonalSettings = () => import('@com/Personal/Settings/PersonalSettings')

const personalCenterRoutes = [
  {
    path: '',
    component: AccountAssets,
    redirect: 'AccountAssets'
  },
  {
    // 账户资产
    path: 'AccountAssets',
    component: AccountAssets
  },
  {
    // 账单明细
    path: 'BillingDetails',
    component: BillingDetails
  },
  {
    // 提币地址
    path: 'WithdrawalAddress',
    component: WithdrawalAddress
  },
  {
    // 身份认证
    path: 'IdentityAuthentication',
    component: IdentityAuthentication
  },
  {
    // 收款账户
    path: 'AccountCredited',
    component: AccountCredited
  },
  {
    // 邀请推广
    path: 'InvitingPromotion',
    component: InvitingPromotion
  },
  {
    // 安全中心
    path: 'SecurityCenter',
    component: SecurityCenter
  },
  {
    // API管理
    path: 'APIManagement',
    component: APIManagement
  },
  {
    // push资产
    path: 'PushAsset',
    component: PushAsset
  },
  {
    // 币币订单
    path: 'CoinOrders',
    component: CoinOrders
  },
  {
    // 法币订单
    path: 'FiatOrders',
    component: FiatOrders
  },
  {
    // 个人设置
    path: 'PersonalSettings',
    component: PersonalSettings
  }

]

export default personalCenterRoutes
