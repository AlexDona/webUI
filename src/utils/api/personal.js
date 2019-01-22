import {post, get, put, postWithURLencoded, deleteMethod} from './axios'
import {handleRequest} from '../commonFunc'

/**
 * 个人中心
 */
// 我的资产币种列表
export const assetCurrenciesList = params => get('personal/getUserFinanceList', params)
// 提币地址列表查询
export const inquireWithdrawalAddressList = params => get('personal/getWithdrawAddress', params)
// 根据币种id查询提币地址
export const inquireWithdrawalAddressId = (params) => get('personal/getCoinWithdrawAddress', params)
// 账单明细—冲提记录
export const statusRushedToRecordList = (params) => get('queryWithdrawRecording', params)
// 账单明细—获取商户币种列表
export const getMerchantCurrencyList = (params) => get('personal/queryPartnerCoinList', params)
// 账单明细—个人资产综合查询
export const getComprehensiveRecordsList = (params) => get('personal/queryColligate', params)
// 提币
export const statusSubmitWithdrawButton = (params) => post('addWithdraw', params)
// 新增用户提币地址
export const addNewWithdrawalAddress = (params) => post('personal/addWithdrawAddress', params)
// 验证提币地址是否正确
export const checkCurrencyAddress = (params) => get('personal/validateAddress', params)
// 提币地址删除
export const deleteUserWithdrawAddress = (params) => put('personal/deleteUserWithdrawAddress', params)
// 查询充币地址
export const inquireRechargeAddressList = (params) => get('personal/getRechargeAddress', params)
// 获取提币信息
export const withdrawalInformation = (params) => get('queryWithdrawInfo', params)
// 根据coinid查询交易信息
export const queryTransactionInformation = (params) => get('personal/getTradeUrl', params)
//  刷新用户信息
export const userRefreshUser = (params) => get('user/refreshUser', params)
/**
 * 安全中心
 * */
// 安全中心
export const statusSecurityCenter = (params) => get('user/security/index', params)
// 绑定邮箱
export const bindEmailAddress = (params) => postWithURLencoded('user/security/bindMail', params)
// 绑定手机
export const bindPhoneAddress = (params) => postWithURLencoded('user/security/bindPhone', params)
// 解绑手机
export const changeMobilePhone = (params) => postWithURLencoded('user/security/changePhone', params)
// 绑定谷歌页面
export const bindGoogleAddressPage = (params) => get('user/security/bindGoogle', params)
// 绑定谷歌
export const bindGoogleAddress = (params) => postWithURLencoded('user/security/bindGoogle', params)
// 解绑谷歌
export const unbindCheckGoogle = (params) => postWithURLencoded('user/security/unBindGoogle', params)
// 设置交易密码
export const setTransactionPassword = (params) => postWithURLencoded('user/security/payPassword', params)
// 重置交易密码
export const resetUpdatePayPassword = (params) => postWithURLencoded('user/security/updatePayPassword', params)
// 修改登录密码
export const modifyLoginPassword = (params) => postWithURLencoded('user/security/password', params)
// 启用关闭手机邮箱验证
export const enableTheClosing = (params) => postWithURLencoded('user/security/enable', params)
/**
 * 身份认证
 * */
// 提交实名认证
export const submitRealNameAuthentication = (params) => postWithURLencoded('user/center/realNameAuth', params)
// 提交高级认证
export const submitSeniorCertification = (params) => postWithURLencoded('user/center/advancedAuth', params)
//  获取用户实名信息
export const realNameInformation = (params) => get('user/center/userauth', params)
/**
 * push资产
 * */
// push资产记录列表/push币种列表/默认余额total
export const getPushAssetList = (params) => get('push/getPushList', params)
// push根据币种id获取可用余额
export const getPushTotalByCoinId = (params) => get('push/getTotalByCoinId', params)
// 交易区列表查询
export const getEntrustSelectBox = (params) => get('queryEntrustSelectBox', params)
// push资产提交
export const pushAssetsSubmit = (params) => post('push/pushSub', params)
// push资产撤销
export const revocationPushProperty = (params) => put('push/pushCancel', params)
// push资产成交
export const pushPropertyTransaction = (params) => put('push/pushPay', params)
/**
 * 邀请推广
 * */
// 直接推广 间接推广列表
export const userPromotionList = (params) => get('user/center/inviter', params)
// 推荐用户币种列表
export const getRecommendUserPromotionList = (params) => get('user/center/inviterCoin', params)
/**
 * 收款方式
 * */
// 收款方式
export const accountPaymentTerm = () => get('user/bank/', {})
// 收款方式设置
export const statusCardSettings = params => postWithURLencoded('user/bank/save', params)
// 开启关闭收款方式设置
export const openAndCloseModeSetting = params => postWithURLencoded('user/bank/enable', params)
// 获取支付方式信息
export const modificationAccountPaymentTerm = params => handleRequest(() => get('user/bank/info', {...params, 'loading': true}))
/**
 * 法币订单
 * */
// 分页查询所有用户otc各状态交易订单列表
export const getQueryAllOrdersList = params => get('otcOrder/selectUserOrdersPage', params)
/**
 * API
 * */
// 获取多个用户api信息
export const multipleUserAPIInfo = params => get('userApi', params)
// 添加用户api信息
export const stateCreationApi = params => post('userApi', params)
//  获取秘钥
export const accessAecretKeyInfo = params => get('userApi/secretKey', params)
//  修改用户api信息
export const modifyUserInformation = params => put('userApi', params)
//   删除用户api信息
export const deleteUserInformation = params => deleteMethod('userApi', params)
/**
 * VIP
 * */
// vip价格
export const vipPriceInfo = params => get('vip/price', params)
// 购买vip
export const buyVipPriceInfo = params => postWithURLencoded('vip/buy', params)
// 购买vip
export const currencyApplicationDownloadUrl = params => get('getCurrencyApplicationDownloadUrl', params)

// 获取购买vip应支付的价格
export const getVipUserPayCount = params => get('vip/price/get', params)
// 汇率转换
export const currencyTransform = params => get('exchangeRate/coinPrice', params)

export const cancelPasswdDialog = params => post('user/payPasswordSet', params)

// 文件上传
export const uploadImageAjax = params => handleRequest(() => post('uploadfile', params), 1)
