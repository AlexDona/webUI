import {post, get, put, postWithURLencoded} from './axios'
/**
 * 个人中心
 */
// 查询国家列表
export const queryCountryList = (params) => get('country/selectList', params)
// 我的资产币种列表
export const assetCurrenciesList = (params) => get('personal/getUserFinanceList', params)
// 提币地址列表查询
export const inquireWithdrawalAddressList = (params) => get('personal/getWithdrawAddress', params)
// 账单明细—冲提记录
export const statusRushedToRecordList = (params) => get('queryWithdrawRecording', params)
// 账单明细—获取商户币种列表
export const getMerchantCurrencyList = (params) => get('queryPartnerCoinList', params)
// 提币
export const statusSubmitWithdrawButton = (params) => post('addWithdraw', params)
// 新增用户提币地址
export const addNewWithdrawalAddress = (params) => post('personal/addWithdrawAddress', params)
// 提币地址删除
export const deleteUserWithdrawAddress = (params) => put('personal/deleteUserWithdrawAddress', params)
// 查询充币地址
export const inquireRechargeAddressList = (params) => get('personal/getRechargeAddress', params)
// 获取提币信息
export const withdrawalInformation = (params) => get('queryWithdrawInfo', params)
// 根据coinid查询交易信息
export const queryTransactionInformation = (params) => get('personal/getTradeUrl', params)
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
/**
 * 开启关闭验证
 * */
// 邮箱、短信、谷歌验证码验证
export const securityVerificationOnOff = (params) => postWithURLencoded('user/validate', params)
// 启用关闭手机邮箱验证
export const enableTheClosing = (params) => postWithURLencoded('user/security/enable', params)
// 提交实名认证
export const submitRealNameAuthentication = (params) => postWithURLencoded('user/center/realNameAuth', params)
// 提交高级认证
export const submitSeniorCertification = (params) => postWithURLencoded('user/center/advancedAuth', params)
//  获取用户实名信息
export const realNameInformation = (params) => get('user/center/userauth', params)
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
// push资产成交
export const userPromotionList = (params) => get('user/center/inviter', params)

/**
 * 收款方式
 * */
// 收款方式
export const accountPaymentTerm = () => get('user/bank/', {})
// 收款方式设置
export const statusCardSettings = (params) => postWithURLencoded('user/bank/save', params)
// 开启关闭收款方式设置
export const openAndCloseModeSetting = (params) => postWithURLencoded('user/bank/enable', params)
