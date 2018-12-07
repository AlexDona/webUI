import {
  TOGGLE_PC_MOBILE,
  ENTER_STEP1,
  ENTER_STEP2,
  ENTER_STEP3,
  SET_LOGIN_TYPE,
  SET_STEP1_INFO,
  SET_USER_BUTTON_STATUS,
  USER_LOGIN,
  USER_LOGOUT
} from './mutations-types.js'

import {
  setStore,
  removeStore
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
    setStore('loginStep1Info', data)
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
    // if (!data.loginType) {
    //   if (!data.type) {
    //     state.disabledOfPhoneBtn = data.status
    //   } else {
    //     state.disabledOfOldPhoneBtn = data.status
    //   }
    //   state.disabledOfMobilePhoneBtn = data.status
    // } else {
    //   state.disabledOfEmailBtn = data.status
    //   state.disabledOfMobileEmailBtn = data.status
    // }
  },
  // 用户登录
  [USER_LOGIN] (state, data) {
    state.isLogin = true
    state.loginStep1Info = data
    setStore('loginStep1Info', data)
  },
  // 用户出
  [USER_LOGOUT] (state) {
    state.isLogin = false
    state.loginStep1Info = {}
    removeStore('loginStep1Info')
  }
}
