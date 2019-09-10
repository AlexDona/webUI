import {post, get, put, putWithURLencoded, postWithURLencoded, deleteMethod, notLoading} from './axios'
import {handleRequest} from '../commonFunc'
/**
 * 个人中心
 */
// 我的资产币种列表
export const assetCurrenciesList = params => handleRequest(() => get('personal/getUserFinanceList', params))
// 提币地址列表查询
export const inquireWithdrawalAddressList = params => handleRequest(() => get('personal/getWithdrawAddress', params))
// 根据币种id查询提币地址
export const inquireWithdrawalAddressId = params => handleRequest(() => get('personal/getCoinWithdrawAddress', params))
// 账单明细—冲提记录
export const statusRushedToRecordList = (params) => handleRequest(() => get('queryWithdrawRecording', params))
// 账单明细—获取商户币种列表
export const getMerchantCurrencyList = (params) => handleRequest(() => get('personal/queryPartnerCoinList', params))
// 账单明细—提币记录撤销
export const deleteCancelWithdraw = (params) => handleRequest(() => postWithURLencoded('/cancelWithdraw', params))
// 账单明细—个人资产综合查询
export const getComprehensiveRecordsList = (params) => handleRequest(() => get('personal/queryColligate', params))
// 提币
export const statusSubmitWithdrawButton = (params) => handleRequest(() => post('addWithdraw', params), 1)
// 新增用户提币地址
export const addNewWithdrawalAddress = (params) => handleRequest(() => post('personal/addWithdrawAddress', params), 1)
// 验证提币地址是否正确
export const checkCurrencyAddress = (params) => handleRequest(() => get('personal/validateAddress', params))
// 提币地址删除
export const deleteUserWithdrawAddress = (params) => handleRequest(() => put('personal/deleteUserWithdrawAddress', params), 1)
// 查询充币地址
export const inquireRechargeAddressList = params => handleRequest(() => get('personal/getRechargeAddress', params))
// 获取提币信息
export const withdrawalInformation = params => handleRequest(() => get('queryWithdrawInfo', params))
// 根据coinid查询交易信息
export const queryTransactionInformation = (params) => handleRequest(() => get('personal/getTradeUrl', {
  ...params,
  ...notLoading
}))
// 刷新用户信息
export const userRefreshUser = params => handleRequest(() => get('user/refreshUser', params))
// 币币交易跳转到个人中心、我的资产提币校验
export const getCoinRechargeWithdraw = (params) => handleRequest(() => get('queryCoinRechargeWithdraw', params))
/**
 * 安全中心
 * */
// 修改昵称
export const changeNickName = (params) => handleRequest(() => putWithURLencoded('user/changeNickName', params))
// 安全中心
export const statusSecurityCenter = (params) => get('user/security/index', params)
// 绑定邮箱
export const bindEmailAddress = (params) => handleRequest(() => postWithURLencoded('user/security/bindMail', params), 1)
// 绑定手机
export const bindPhoneAddress = (params) => handleRequest(() => postWithURLencoded('user/security/bindPhone', params), 1)
// 解绑手机
export const changeMobilePhone = (params) => handleRequest(() => postWithURLencoded('user/security/changePhone', params), 1)
// 绑定谷歌页面
export const bindGoogleAddressPage = (params) => handleRequest(() => get('user/security/bindGoogle', params))
// 绑定谷歌
export const bindGoogleAddress = (params) => handleRequest(() => postWithURLencoded('user/security/bindGoogle', params), 1)
// 解绑谷歌
export const unbindCheckGoogle = (params) => handleRequest(() => postWithURLencoded('user/security/unBindGoogle', params), 1)
// 设置交易密码
export const setTransactionPassword = (params) => handleRequest(() => postWithURLencoded('user/security/payPassword', params), 1)
// 重置交易密码
export const resetUpdatePayPassword = (params) => handleRequest(() => postWithURLencoded('user/security/updatePayPassword', params), 1)
// 修改登录密码
export const modifyLoginPassword = (params) => handleRequest(() => postWithURLencoded('user/security/password', params), 1)
// 启用关闭手机邮箱验证
export const enableTheClosing = (params) => handleRequest(() => postWithURLencoded('user/security/enable', params), 1)
/**
 * 身份认证
 * */
// 提交实名认证
export const submitRealNameAuthentication = (params) => handleRequest(() => postWithURLencoded('user/center/realNameAuth', params), 1)
// 提交高级认证
export const submitSeniorCertification = (params) => handleRequest(() => postWithURLencoded('user/center/advancedAuth', params), 1)
// 获取用户实名信息
export const realNameInformation = (params) => handleRequest(() => get('user/center/userauth', params))
/**
 * push资产
 * */
// push资产记录列表/push币种列表/默认余额total
export const getPushAssetList = (params) => handleRequest(() => get('push/getPushList', params))
// push根据币种id获取可用余额
export const getPushTotalByCoinId = (params) => handleRequest(() => get('push/getTotalByCoinId', params))
// 交易区列表查询
export const getEntrustSelectBox = (params) => handleRequest(() => get('queryEntrustSelectBox', params))
// push资产提交
export const pushAssetsSubmit = (params) => handleRequest(() => post('push/pushSub', params), 1)
// push资产撤销
export const revocationPushProperty = (params) => handleRequest(() => put('push/pushCancel', params))
// push资产成交
export const pushPropertyTransaction = (params) => handleRequest(() => put('push/pushPay', params), 1)
/**
 * 邀请推广
 * */
// 直接推广 间接推广列表
export const userPromotionList = (params) => handleRequest(() => get('user/center/inviterShowList', params))
// 推荐用户币种列表
export const getRecommendUserPromotionList = (params) => handleRequest(() => get('user/center/inviterShowCoin', params))
/**
 * 收款方式
 * */
// 收款方式
export const accountPaymentTerm = () => handleRequest(() => get('user/bank/'))
// 收款方式设置
export const statusCardSettings = params => handleRequest(() => postWithURLencoded('user/bank/save', params), 1)
// 开启关闭收款方式设置
export const openAndCloseModeSetting = params => handleRequest(() => postWithURLencoded('user/bank/enable', params))
// 获取支付方式信息
export const modificationAccountPaymentTerm = params => handleRequest(() => get('user/bank/info', params))
/**
 * 法币订单
 * */
// 分页查询所有用户otc各状态交易订单列表
export const getQueryAllOrdersList = params => get('otcOrder/selectUserOrdersPage', params)
/**
 * API
 * */
// 获取多个用户api信息
export const multipleUserAPIInfo = params => handleRequest(() => get('userApi', params))
// 添加用户api信息
export const stateCreationApi = params => handleRequest(() => post('userApi', params), 1)
// 获取秘钥
export const accessAecretKeyInfo = params => handleRequest(() => get('userApi/secretKey', params))
// 修改用户api信息
export const modifyUserInformation = params => handleRequest(() => put('userApi', params), 1)
// 删除用户api信息
export const deleteUserInformation = params => handleRequest(() => deleteMethod('userApi', params))
// 可用api数量
export const remainApiInfo = params => handleRequest(() => get('userApi/setting', params))
/**
 * VIP
 * */
// vip价格
export const vipPriceInfo = params => handleRequest(() => get('vip/price', params))
// 购买vip
export const buyVipPriceInfo = params => handleRequest(() => postWithURLencoded('vip/buy', params), 1)
// 购买vip
export const currencyApplicationDownloadUrl = params => handleRequest(() => get('getCurrencyApplicationDownloadUrl', params))

// 获取购买vip应支付的价格
export const getVipUserPayCount = params => handleRequest(() => get('vip/price/get', params))
// 汇率转换
export const currencyTransform = params => handleRequest(() => get('exchangeRate/coinPrice', params))
// 取消用户设置密码弹框
export const cancelPasswdDialog = params => handleRequest(() => post('user/payPasswordSet', params))

// 文件上传
export const uploadImageAjax = params => handleRequest(() => post('uploadfile', params), 1)

// 获取 USDT 链名称
export const getUSDTLinkNamesAJAX = () => handleRequest(() => get('personal/getUSDTRechargeEnum'))
