/**
 * author: zhaoxinlei
 * update: 20190524
 * description:user mutations
 */
import {
  TOGGLE_PC_MOBILE,
  ENTER_STEP1,
  ENTER_STEP2,
  ENTER_STEP3,
  SET_LOGIN_TYPE,
  SET_STEP1_INFO,
  SET_USER_BUTTON_STATUS,
  USER_LOGIN,
  USER_LOGOUT,
  CHANGE_CURRENT_VIP_LEVEL,
  CHANGE_VIP_PRICE_INFO_LIST,
  CHANGE_RENEW_STATUS,
  CHANGE_USER_REFRESH_SUCCESS,
  UPDATE_INVITATIONS_M,
  UPDATE_LOGIN_STEP2_DIALOG_STATUS,
  UPDATE_FORGET_PASS_STEP_M,
  UPDATE_LOGIN_IMAGE_DIALOG_STATUS_M,
  UPDATE_IMAGE_CODE_M
} from './mutations-types.js'

import {
  setCookie,
  removeCookie,
  setStore
} from '../../utils'

// import {localapi, proapi} from 'src/config/env'

export default {
  // pc 移动端切换
  [TOGGLE_PC_MOBILE] (state, data) {
    state.isMobile = data
  },
  // 登录进入步骤1：
  [ENTER_STEP1] (state) {
    state.loginStep = {
      step1: true,
      step2: false,
      step3: false
    }
  },
  // 登录进入步骤2：
  [ENTER_STEP2] (state) {
    state.loginStep = {
      step1: false,
      step2: true,
      step3: false
    }
  },
  // 登录进入步骤3：
  [ENTER_STEP3] (state) {
    state.loginStep = {
      step1: false,
      step2: false,
      step3: true
    }
  },
  // 切换用户登录方式
  [SET_LOGIN_TYPE] (state, data) {
    state.loginType = data
  },
  // 获取用户登录步骤一状态
  [SET_STEP1_INFO] (state, data) {
    state.loginStep1Info = data
    setCookie('loginStep1Info', data)
  },
  // 设置登录步骤3发送验证码按钮状态
  [SET_USER_BUTTON_STATUS] (state, data) {
    switch (data.loginType) {
      case 0 :
        switch (data.type) {
          case 0:
            state.disabledOfPhoneBtn = data.status
            break
          case 1:
            state.disabledOfOldPhoneBtn = data.status
            break
        }
        state.disabledOfMobilePhoneBtn = data.status
        break
      case 1:
        state.disabledOfEmailBtn = data.status
        state.disabledOfMobileEmailBtn = data.status
        break
    }
  },
  // 用户登录
  [USER_LOGIN] (state, data) {
    state.isLogin = true
    state.loginStep1Info = data
  },
  // 用户出
  [USER_LOGOUT] (state) {
    state.isLogin = false
    state.loginStep1Info = {}
    removeCookie('loginStep1Info')
    removeCookie('token')
  },
  // 修改选中vip等级
  [CHANGE_CURRENT_VIP_LEVEL] (state, {activeSelectLevel}) {
    state.vip.activeSelectLevel = activeSelectLevel
    setStore('activeSelectLevel', activeSelectLevel)
  },
  [CHANGE_VIP_PRICE_INFO_LIST] (state, VipPriceInfoList) {
    state.vip.VipPriceInfoList = VipPriceInfoList
    setStore('VipPriceInfoList', VipPriceInfoList)
  },
  // 修改是否续费状态
  [CHANGE_RENEW_STATUS] (state, action) {
    state.vip.vipAction = action
    setStore('vipAction', action)
  },
  // 用户信息接口是否返回成功
  [CHANGE_USER_REFRESH_SUCCESS] (state, data) {
    state.isUserRefreshSuccess = data
  },
  [UPDATE_INVITATIONS_M] (state, data) {
    state.invitation_S = data
  },
  // 更改登录二次校验弹窗状态
  [UPDATE_LOGIN_STEP2_DIALOG_STATUS] (state, status) {
    state.isShowLoginStep2Dialog_S = status
  },
  [UPDATE_FORGET_PASS_STEP_M] (state, step) {
    state.forgetPassStep_S = step
  },
  [UPDATE_LOGIN_IMAGE_DIALOG_STATUS_M] (state, status) {
    state.isShowLoginImageDialog_S = status
  },
  [UPDATE_IMAGE_CODE_M] (state, imgCode) {
    state.imageCode_S = imgCode
  }
}
