import {setStore} from '../../utils'
import {
  // OTC改变选中的可用币种名字
  CHANGE_OTC_AVAILABLE_CURRENCY_NAME,
  // OTC改变选中的可用币种id
  CHANGE_OTC_AVAILABLE_CURRENCY_ID,
  // OTC改变选中的可用币种partnerCoinId
  CHANGE_OTC_AVAILABLE_PARTNER_COIN_ID,
  // OTC改变 购买或者出售成功后跳转到交易中订单（首页的）的锚点地方
  CHANGE_OTC_ANCHOR_STATUS,
  // 委托定单撤单后，更新首页挂单列表
  UPDATE_OTC_HOME_LIST_STATUS,
  // 发布订单（商家和普通用户公用）后页面跳转到首页顶部状态
  CHANGE_PUBLISH_ORDER_JUMP_TOP_STATUS,
  // 普通用户点击otc导航弹窗提示点击申请按钮跳转到申请商家组件底部状态
  CHANGE_OTC_APPLY_JUMP_BOTTOM_STATUS,
  // 设置otc币种里诶包
  SET_OTC_COIN_LIST_M
} from './mutations-types.js'

// import {setStore, getStore} from '../utils'

// import {localapi, proapi} from 'src/config/env'

export default {
  // OTC改变选中的可用币种名字
  [CHANGE_OTC_AVAILABLE_CURRENCY_NAME] (state, data) {
    state.selectedOTCAvailableCurrencyName = data
  },
  // OTC改变选中的可用币种id
  [CHANGE_OTC_AVAILABLE_CURRENCY_ID] (state, data) {
    state.selectedOTCAvailableCurrencyCoinID = data
  },
  // OTC改变选中的可用币种partnerCoinId
  [CHANGE_OTC_AVAILABLE_PARTNER_COIN_ID] (state, data) {
    state.selectedOTCAvailablePartnerCoinId = data
  },
  // OTC改变 购买或者出售成功后跳转到交易中订单（首页的）的锚点地方
  [CHANGE_OTC_ANCHOR_STATUS] (state, data) {
    state.anchorStatus = data
  },
  // 委托定单撤单后，更新首页挂单列表
  [UPDATE_OTC_HOME_LIST_STATUS] (state, data) {
    state.updateOTCHomeListStatus = data
  },
  // 发布订单（商家和普通用户公用）后页面跳转到首页顶部状态
  [CHANGE_PUBLISH_ORDER_JUMP_TOP_STATUS] (state, data) {
    state.publishOrderJumpTopStatus = data
  },
  // 普通用户点击otc导航弹窗提示点击申请按钮跳转到申请商家组件底部状态
  [CHANGE_OTC_APPLY_JUMP_BOTTOM_STATUS] (state, data) {
    state.otcApplyJumpBottomStatus = data
  },
  // 设置otc币种列表
  [SET_OTC_COIN_LIST_M] (state, OTCCoinList) {
    state.OTCCoinList = OTCCoinList
    setStore('OTCCoinList', OTCCoinList)
    setStore('OTCCoinListTimeStamp', new Date().getTime())
  }
}
