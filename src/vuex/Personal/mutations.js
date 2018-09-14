import {
  CHANGE_USER_CENTER_ACTIVE_NAME,
  CHANGE_REF_SECURITY_CENTER_INFO,
  CHANGE_REF_ACCOUNT_CREDITED_STATE,
  CHANGE_MERCHANTS_ORDERS_LIST,
  CHANGE_COMPLETED_ORDERS_LIST,
  CHANGE_CANCELED_ORDERS_LIST,
  CHANGE_FROZEN_ORDERS_LIST,
  CHANGE_ENTRUST_ORDERS_LIST
} from './mutations-types.js'

// import {setStore, getStore} from '../utils'
// import {localapi, proapi} from 'src/config/env'

export default {
  [CHANGE_USER_CENTER_ACTIVE_NAME] (state, data) {
    state.userCenterActiveName = data
  },
  [CHANGE_REF_SECURITY_CENTER_INFO] (state, data) {
    state.refSecurityCenterStatus = data
  },
  [CHANGE_REF_ACCOUNT_CREDITED_STATE] (state, data) {
    state.refsAccountCenterStatus = data
  },
  // 获取交易中的订单
  [CHANGE_MERCHANTS_ORDERS_LIST] (state, data) {
    state.merchantsOrdersList = data
  },
  // 获取已完成的订单
  [CHANGE_COMPLETED_ORDERS_LIST] (state, data) {
    state.completedOrdersList = data
    // state.completedOrdersList.forEach((item, index) => {
    //   state.completedExpands.push(item.fid)
    // })
  },
  // 获取已取消的订单
  [CHANGE_CANCELED_ORDERS_LIST] (state, data) {
    state.getOTCCanceledOrderList = data
    // state.canceledList.forEach((item, index) => {
    //   state.canceledExpands.push(item.fid)
    // })
  },
  // 获取冻结中的订单[CHANGE_FROZEN_ORDERS_LIST]
  [CHANGE_FROZEN_ORDERS_LIST] (state, data) {
    state.getOTCFreezingOrderList = data
    // 展开默认行
    // state.forzenList.forEach((item, index) => {
    //   state.forzenExpands.push(item.fid)
    // })
  },
  // 获取委托订单
  [CHANGE_ENTRUST_ORDERS_LIST] (state, data) {
    state.OTCEntrustOrderList = data
  }
}
