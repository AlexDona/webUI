import {
  CHANGE_THEME,
  CHANGE_CONVERT_CURRENCY
} from './mutations-types'
export default {
  // 更改设置
  changeSettingAction (context, {theme, activeConvertCurrency}) {
    context.commit(CHANGE_THEME, theme)
    context.commit(CHANGE_CONVERT_CURRENCY, activeConvertCurrency)
  }
}
