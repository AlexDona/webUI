export default {
  isChineseLanguage (state) {
    return state.language === 'zh_CN' || state.language === 'zh_TW'
  }
}
