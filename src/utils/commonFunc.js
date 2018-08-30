/**
 * 和业务逻辑相关的全局方法
 */
import {sendMsgByPhoneOrEmial, sendMsgByPushPhoneOrEmial} from '../utils/api/apiDoc'
import {PHONE_REG, EMAIL_REG, ID_REG, PWD_REG, ALIPAY_REG, BANK_REG, GOOGLE_REG} from './regExp'
// 请求接口后正确或者错误的提示提示信息：
// 如果返回 错误 了就提示错误并不能继续往下进行；
// 如果返回了 正确 的数据：不需要正确的提示noTip传0；需要正确的提示noTip传1；
// 使用方法：returnAjaxMessage(data, this, 0) 或者 returnAjaxMessage(data, this, 1)
export const returnAjaxMessage = (data, self, noTip) => {
  const meta = data.data.meta
  if (meta.code !== 200) {
    self.$message({
      type: 'error',
      message: self.$t(`M.${meta.i18n_code}`)
    })
    return 0
  } else {
    if (noTip) {
      self.$message({
        type: 'success',
        message: self.$t(`M.${meta.i18n_code}`)
      })
    }
    return 1
  }
}
/**
 * 用户输入验证
 * @param type : 验证类型： phone email ID-card password alipay bank-card google
 * @param targetNum 目标输入号码
 * @returns {number} 0：正确 1： 未输入 2：不正确
 */
export const validateNumForUserInput = (type, targetNum) => {
  let returnNum = 0
  let validateType
  switch (type) {
    case 'phone':
      validateType = PHONE_REG
      break
    case 'email':
      validateType = EMAIL_REG
      break
    case 'ID-card':
      validateType = ID_REG
      break
    case 'password':
      validateType = PWD_REG
      break
    case 'alipay':
      validateType = ALIPAY_REG
      break
    case 'bank-card':
      validateType = BANK_REG
      break
    case 'google':
      validateType = GOOGLE_REG
      break
  }
  if (!targetNum) {
    returnNum = 1
  } else if (!validateType.test(targetNum)) {
    returnNum = 2
  }
  return returnNum
}
// 发送验证码（短信、邮箱）
export const sendPhoneOrEmailCodeAjax = async (type, params, callback) => {
  const data = await sendMsgByPhoneOrEmial(type, params)
  callback(data)
}
// 发送验证码（短信、邮箱）
export const pushSendPhoneOrEmailCodeAjax = async (type, params, callback) => {
  const data = await sendMsgByPushPhoneOrEmial(type, params)
  callback(data)
}
