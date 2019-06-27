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
  CHANGE_TOKEN_AVAILABILITY,
  UPDATE_INVITATIONS_M
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
    const {token} = data
    setCookie('loginStep1Info', data)
    if (token) {
      setCookie('token', token)
    }
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
  [CHANGE_TOKEN_AVAILABILITY] (state, data) {
    state.isTokenDisable = data
  },
  [UPDATE_INVITATIONS_M] (state, data) {
    state.invitation_S = data
  }
}
