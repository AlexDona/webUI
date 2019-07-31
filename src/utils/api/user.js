import {
  postWithURLencoded,
  get,
  postWithFormData,
  notLoading
} from './axios'
import {handleRequest} from '../commonFunc'
// import {handleRequest} from '../commonFunc'
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
export const sendMsgByPhoneOrEmail = (type, params) => {
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
// 获取手机号
export const getPhoneCodeAJAX = params => handleRequest(() => get('sendSms', params))
// 获取邮箱验证码
export const getEmailCodeAJAX = params => handleRequest(() => get('sendMail', params))
// 检测用户是否存在
export const checkUserExist = (params) => postWithURLencoded('user/checkUserExist', params)
// 用户注册
export const sendRegisterUser = (params) => postWithURLencoded('user/reg', params)
// 用户登录第一步
export const userLoginForStep1 = (params) => handleRequest(() => postWithFormData('user/userLoginForStep1', params))
// 用户登录第二步
export const userLoginForStep2 = params => handleRequest(() => postWithURLencoded('user/userLoginForStep2', params), 1)
// 退出登录
export const userLogOut = () => handleRequest(() => postWithURLencoded('user/logout'))
// 找回密码步骤1
export const findPasswordStep1 = params => handleRequest(() => postWithURLencoded('login/forgetPassword1', params))
// 找回密码步骤2
export const findPasswordStep2 = params => handleRequest(() => postWithURLencoded('user/forgetPassword2', params))
// 找回密码步骤3
export const findPasswordStep3 = params => handleRequest(() => postWithURLencoded('user/forgetPassword3', params))

export const findPassword = params => handleRequest(() => postWithURLencoded('user/forgetPasswordAndSetNewPass', params))
// 二维码登录生成二维码
export const getLoginErcode = () => handleRequest(() => get('user/qrcode'))
// 获取app下载地址
export const getAppDownLoadUrlAjax = () => get('appDown')

// 设置 用户交易密码时长
export const setUserInputPasswordFrequency = params => handleRequest(() => postWithURLencoded('user/notInputPayPasswd', params), 1)

// 是否需要输入交易密码（交易）
export const isNeedPayPassowrd = (params) => get('user/isInputPayPasswd', {...params, ...notLoading})
// 邀请人 回填
export const editInviterAJAX = params => handleRequest(() => get('/user/backInviter', params), 1)
// 新版登录接口
export const newLoginForStep1AJAX = params => handleRequest(() => postWithURLencoded('login/doNewLogin', params))
// 新版登录第二步
export const newLoginForStep2AJAX = params => handleRequest(() => postWithURLencoded('login/doLoginAndCheckCode', params))
// 刷新图片验证码
export const updateImageCodeAJAX = params => handleRequest(() => get('login/refreshCheckCode', params))
// 验证图片验证码
export const checkImageCodeAJAX = params => handleRequest(() => get('login/CheckCode', params))
// 新注册
export const newRegisterAJAX = params => handleRequest(() => postWithURLencoded('login/registerUser', params))
// 检测用户名是否存在
export const newCheckUserExist = params => handleRequest(() => postWithURLencoded('user/checkUserExist', params))
// 更新密码（找回密码）
export const updatePasswordAJAX = params => handleRequest(() => postWithURLencoded('login/forgetPasswordAndSetNewPass', params))
