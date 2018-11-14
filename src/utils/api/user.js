import {
  postWithURLencoded,
  get,
  postWithFormData} from './axios'
/**
 * User
 */
// 发送邮件
// export const sendMsgByEmailUser = (params) => postWithURLencoded('user/sendMail', params)
/**
 * 发送短信、邮箱 验证码
 * @param type: 发送类型：0：手机验证码 1:邮箱验证码
 * @param params ： 参数
 * @returns {*}
 */
export const sendMsgByPhoneOrEmial = (type, params) => {
  let result
  console.log(type)
  switch (type) {
    // 短信验证码
    case 0:
      result = get('sendSms', params)
      break
    // 邮箱验证码
    case 1:
      result = get('sendMail', params)
      break
  }
  return result
}
// 检测用户是否存在
export const checkUserExist = (params) => postWithURLencoded('user/checkUserExist', params)
// 用户注册
export const sendRegisterUser = (params) => postWithURLencoded('user/reg', params)
// 用户登录第一步
export const userLoginForStep1 = (params) => postWithFormData('user/userLoginForStep1', params)
// 用户登录第二步
export const userLoginForStep2 = (params) => postWithURLencoded('user/userLoginForStep2', params)
// 退出登录
export const userLoginOut = () => postWithURLencoded('user/logout')
// 找回密码步骤1
export const findPasswordStep1 = (params) => postWithURLencoded('user/forgetPassword1', params)
// 找回密码步骤2
export const findPasswordStep2 = (params) => postWithURLencoded('user/forgetPassword2', params)
// 找回密码步骤3
export const findPasswordStep3 = (params) => postWithURLencoded('user/forgetPassword3', params)
// 二维码登录生成二维码
export const getLoginErcode = () => get('/user/qrcode')
// 获取app下载地址
export const getAppDownLoadUrlAjax = () => get('appDown')
