/**
 * 和业务逻辑相关的全局方法
 */
import {PHONE_REG} from './regExp'

// export const returnAjaxMessage = (data, self) => {
//   const meta = data.data.meta
//   if (meta.code !== 200) {
//     self.$message({
//       type: 'error',
//       message: self.$t(`M.${meta.i18n_code}`)
//     })
//     return false
//   } else {
//     self.$message({
//       type: 'success',
//       message: self.$t(`M.${meta.i18n_code}`)
//     })
//   }
// }
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
    return false
  } else {
    if (noTip) {
      self.$message({
        type: 'success',
        message: self.$t(`M.${meta.i18n_code}`)
      })
    }
    return true
  }
}
// 手机号验证
export const validatePhoneNum = (phoneNum) => {
  if (!phoneNum || !PHONE_REG.test(phoneNum)) {
    return 0
  }
}
