/**
 * author: zhaoxinlei
 * create: 201803015
 * description: 当前 js 为 common(基础信息) getters
 */
import {xDomain} from '../../utils/env'
import {routesVariable} from '../../router/routesVariable'

const {login, register, registerSuccess} = routesVariable

export default {
  isChineseLanguage (state) {
    return state.language === 'zh_CN' || state.language === 'zh_TW'
  },
  isNeedApp () {
    return xDomain !== ''
  },
  isNeedIOS () {
    return xDomain !== 'kbbt.com' && xDomain !== 'bithumber.com'
  },
  isDayTheme (state) {
    return state.theme == 'day'
  },
  // 移动端默认登录地址
  mobileLoginDefaultRouter_G () {
    return `/${login}/m`
  },
  // PC默认登录地址
  PCLoginDefaultRouter_G () {
    return `/${login}`
  },
  // 移动端默认注册地址
  mobileRegisterDefaultRouter_G () {
    return `/${register}/m/default`
  },
  // PC端默认注册地址
  PCRegisterDefaultRouter_G () {
    return `/${login}/${register}/default`
  },
  // 移动端注册成功
  mobileRegisterSuccessRouter_G () {
    return `/${registerSuccess}/m/${register}`
  },
  // PC端注册成功
  PCRegisterSuccessRouter_G () {
    return `/${registerSuccess}/${register}`
  }
}
