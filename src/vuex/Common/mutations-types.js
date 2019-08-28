/**
 * author: zhaoxinlei
 * create: 201803015
 * description: 当前 js 为 common(基础信息) mutations-types
 */
// 公共部分
export const CHANGE_THEME = 'CHANGE_THEME' // 设置主题
export const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE' // 设置语言
export const CHANGE_CONVERT_CURRENCY = 'CHANGE_CONVERT_CURRENCY' // 设置折算货币
export const CHANGE_SOCKET_REFRESH_STATUS = 'CHANGE_SOCKET_REFRESH_STATUS' // 改变socket刷新状态
export const CHANGE_SOCKET_AND_AJAX_DATA = 'CHANGE_SOCKET_AND_AJAX_DATA' // 改变socket数据
export const CHANGE_ACTIVE_TRADE_AREA = 'CHANGE_ACTIVE_TRADE_AREA' // 更改当前选中交易区
export const CHANGE_CURRENCY_RATE_LIST = 'CHANGE_CURRENCY_RATE_LIST' // 更新当前汇率列表
export const CHANGE_ROUTER_PATH = 'CHANGE_ROUTER_PATH' // 路由跳转
// 改变全局存储的选中的交易对小数位的值
export const CHANGE_CHECKED_BITS = 'CHANGE_CHECKED_BITS'
// 个人中心 我的资产列表
export const USER_ASSETS_LIST = 'USER_ASSETS_LIST' // 我的资产列表
export const SET_COUNTRY_AREA_LIST = 'SET_COUNTRY_AREA_LIST' // 国家列表
export const USER_INFORMATION_REFRESH = 'USER_INFORMATION_REFRESH' // 用户信息刷新
export const SET_USER_INFO_REFRESH_STATUS = 'SET_USER_INFO_REFRESH_STATUS' // 用户信息刷新状态
export const SET_LOGO_URL = 'SET_LOGO_URL' // 设置公共logo
export const SET_FOOTER_INFO = 'SET_FOOTER_INFO' // 设置尾部信息
export const SET_COUNT_DOWN_RESET_STATUS = 'SET_COUNT_DOWN_RESET_STATUS' // 设置倒计时重置状态
// 设置默认语言
export const CHANGE_DEFAULT_LANGUAGE = 'CHANGE_DEFAULT_LANGUAGE'
// 交易对是否更改
export const CHANGE_SYMBOL_CHANGED_STATUS = 'CHANGE_SYMBOL_CHANGED_STATUS'
// 页面宽度修改
export const SET_WINDOW_WIDTH = 'SET_WINDOW_WIDTH'
// 设置全局消息id
export const SET_NOTICE_ID = 'SET_NOTICE_ID'
// 获取交易密码剩余次数
export const CHANGE_PASSWORD_USEABLE = 'CHANGE_PASSWORD_USEABLE'
// 是否显示全局交易密码弹窗
export const UPDATE_PAY_PASSWORD_DIALOG_M = 'UPDATE_PAY_PASSWORD_DIALOG_M'
// 全局交易密码
export const UPDATE_PAY_PASSWORD_M = 'UPDATE_PAY_PASSWORD_M'
// 更新当前正在请求次数
export const SET_REQUEST_COUNT_M = 'SET_REQUEST_COUNT_M'
// 底部盒子高度
export const SAVE_FOOTER_HEIGHT = 'SAVE_FOOTER_HEIGHT'
// 设置当前语言列表
export const SET_LANGUAGES_M = 'SET_LANGUAGES_M'
// 设置 全局导航
export const SET_NAVIGATOR_M = 'SET_NAVIGATOR_M'
// 更新 当前激活链接
export const UPDATE_ACTIVE_LINK_M = 'UPDATE_ACTIVE_LINK_M'
// 更新 内部链接
export const UPDATE_INNER_NAVIGATORS_M = 'UPDATE_INNER_NAVIGATORS_M'
