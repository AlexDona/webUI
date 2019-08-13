/**
 * author: zhaoxinlei
 * create: 201803015
 * description: 当前 js 为 common(基础信息) getters
 */
import {xDomain} from '../../utils/env'

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
  }
}
