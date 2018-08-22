/**
 * 和业务逻辑相关的全局方法
 */
import {PHONE_REG} from './regExp'

export const returnAjaxMessage = (data, self) => {
  const meta = data.data.meta
  if (meta.code !== 200) {
    self.$message({
      type: 'error',
      message: self.$t(`M.${meta.i18n_code}`)
    })
    return false
  } else {
    self.$message({
      type: 'success',
      message: self.$t(`M.${meta.i18n_code}`)
    })
  }
}
// 手机号验证
export const validatePhoneNum = (phoneNum) => {
  if (!phoneNum || !PHONE_REG.test(phoneNum)) {
    return 0
  }
}
