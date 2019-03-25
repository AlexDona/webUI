/**
 * 手机号
 * */
export const PHONE_REG = /^[0-9]*$/
/**
 *  身份证
 */
export const ID_REG = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
/**
 * 邮箱
 */
export const EMAIL_REG = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
/**
 * 登录密码
 */
export const PWD_REG = /^(?=.*[\d])(?=.*[a-zA-Z])(?=.*[`~!@#$%^&*\(\)_\-\+=<>?:"\{\}\|,.\/;'\\[\]])?.{8,20}$/
/**
 * 交易密码
 */
export const TPED_REG = /^\d{6}$/
/**
 * 支付宝
 */
export const ALIPAY_REG = /^(?:\w+\.?)*\w+@(?:\w+\.)+\w+|\d{9,11}$/
/**
 * 银行卡
 */
export const BANK_REG = /^(\d{16}|\d{17}|\d{18}|\d{19})$/
/**
 *  正整数
 */
export const INTEGER_REG = /^[0-9]*$/
/**
 *  数字 英文字母组合
 */
export const WITHDRAWAL_REG = /^([A-Za-z0-9])+(\:)?(\-)?[A-Za-z0-9]+$/
/**
 * 谷歌
 */
export const GOOGLE_REG = /^\d{6}$/
/**
 *  验证不能为http https
 */
export const URL_REG = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/
/**
 *  数字，字母(必须)，特殊字符（非必须）
 */
export const CHECKPASSWORD_REG = /^(?=.*[\d])(?=.*[a-zA-Z])(?=.*[`~!@#$%^&*\(\)_\-\+=<>?:"\{\}\|,.\/;'\\[\]])?.{8,20}$/

/**
 * 特殊字符 special
 */
export const SPECIAL_REG = /(?=.*[`~!#$%^&*\(\)\-\+=<>?:"\{\}\|,\/;'\\[\]·！#￥（——）：；“”‘、，|《。》？、【】])/im

/**
 * 中文字符
 */
export const CHINESE_REG = /[\u4e00-\u9fa5]/
/**
 * IP校验
 */
export const IP_REG = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/
/**
 * 只允许输入字母
 */
export const ALPHABET = /^[a-zA-Z]$/

export const EMAILADDRESS_REG = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z]{2,8}$/
