import {
  keep2Num,
  keep8Num,
  keep4Num,
  scientificToNumber,
  otcPricePointShow,
  cutOutPointLength,
  formatSeconds,
  setStore,
  getStore,
  getStoreWithJson, timeFilter, removeStore, formatNumber
} from '../utils'
import {
  jumpToOtherPageForFooter,
  formatCount,
  getNestedData,
  http2https
} from '../utils/commonFunc'
import {
  mapGetters,
  mapState,
  mapMutations
} from 'vuex'

import {
  routesVariable,
  globalLabel
} from '../router/routesVariable'

let mixin = {
  data () {
    return {
      PASS_REG_X: /^(?=.*[\d])(?=.*[a-zA-Z])(?=.*[`~!@#$%^&*\(\)_\-\+=<>?:"\{\}\|,.\/;'\\[\]])?.{8,20}$/
    }
  },
  methods: {
    ...mapMutations({
      '$UPDATE_PAY_PASSWORD_DIALOG_M_X': 'UPDATE_PAY_PASSWORD_DIALOG_M',
      '$SET_ACTIVE_LINK_NAME_M_X': 'SET_ACTIVE_LINK_NAME_M'
    }),
    $goToPage (routerName, param) {
      console.log(routerName)
      if (!routerName) return
      let newRouterPath = routerName
      if (!routerName.startsWith('/')) newRouterPath = `/${routerName}`
      if (param) {
        this.$router.push({path: newRouterPath, query: param})
      } else {
        this.$router.push({path: newRouterPath})
      }
    },
    $setStore (name, content) {
      return setStore(name, content)
    },
    $getStore (name, type = 'string') {
      return type.toLowerCase() == 'json' ? getStoreWithJson(name) : getStore(name)
    },
    $removeStore (name) {
      removeStore(name)
    },
    $keep2Num (num) {
      return keep2Num(num)
    },
    $keep8Num (num) {
      return keep8Num(num)
    },
    keep4Num (num) {
      return keep4Num(num)
    },
    $keepCurrentNum (num, pointLength) {
      return (num - 0).toFixed(pointLength) - 0
    },
    $scientificToNumber (num) {
      return scientificToNumber(num)
    },
    // otc价格小数位显示
    $otcPricePointShow (num) {
      return otcPricePointShow(num)
    },
    $footerJump (router, activeName) {
      jumpToOtherPageForFooter(router, activeName)
    },
    $formatCount (num) {
      return formatCount(num)
    },
    $getNestedData (data, index) {
      return getNestedData(data, index)
    },
    $http2https (str) {
      return http2https(str)
    },
    $cutOutPointLength (num, pointLength) {
      return cutOutPointLength(num, pointLength)
    },
    $formatSeconds (date, type) {
      return formatSeconds(date, type)
    },
    // 成功弹窗
    $success_tips_X (msg, duration = 2000) {
      return this.$message({
        message: msg,
        type: 'success',
        duration
      })
    },
    // 失败弹窗
    $error_tips_X (msg, duration = 2000) {
      return this.$message({
        message: msg,
        type: 'error',
        duration
      })
    },
    $changeCSS_X (selector, changeStyle, target) {
      document.querySelector(selector).style[changeStyle] = `${target}px`
    },
    $toggleEventListener_X (type, mouseMoveFn, mouseUpFn) {
      switch (type) {
        case 'bind':
          document.querySelector('body').addEventListener('mousemove', mouseMoveFn)
          document.querySelector('body').addEventListener('mouseup', mouseUpFn)
          break
        case 'unbind':
          document.querySelector('body').removeEventListener('mousemove', mouseMoveFn)
          document.querySelector('body').removeEventListener('mouseup', mouseUpFn)
          break
      }
    },
    /**
     * 小数：只能输入小数点前一个0，整数限制不可输入多个0
     * 输入限制-首位可为0(只针对小数)，如果首位为0后面为整数，干掉首位的0，显示整数位，
     * @param val
     * @param targetPointLength
     * @returns {string}
     */
    $formatNumber_X (val, pointLength) {
      formatNumber(val, pointLength)
    }
  },
  computed: {
    ...mapGetters({
      '$isNeedLimitExchange_G_X': 'isNeedLimitExchange_G',
      '$isNeedYST_G_X': 'isNeedYST',
      '$isChineseLanguage_G_X': 'isChineseLanguage',
      '$isDayTheme_G_X': 'isDayTheme',
      '$mobileRegisterDefaultRouter_G_X': 'mobileRegisterDefaultRouter_G',
      '$PCRegisterDefaultRouter_G_X': 'PCRegisterDefaultRouter_G',
      '$mobileLoginDefaultRouter_G_X': 'mobileLoginDefaultRouter_G',
      '$PCLoginDefaultRouter_G_X': 'PCLoginDefaultRouter_G',
      '$PCRegisterSuccessRouter_G_X': 'PCRegisterSuccessRouter_G',
      '$mobileRegisterSuccessRouter_G_X': 'mobileRegisterSuccessRouter_G'
    }),
    ...mapState({
      $loading_S_X: state => state.common.loading_S,
      $theme_S_X: state => state.common.theme,
      $language_S_X: state => state.common.language,
      $isLogin_S_X: state => state.user.isLogin,
      // 交易对是否改变l
      $isSymbolChanged_X: state => state.common.isSymbolChanged,
      // 是否显示限价交易
      $middleTopData_S_X: state => state.trade.middleTopData,
      $activeSymbol_S_X: state => state.trade.middleTopData.id,
      $serverTime_S_X: state => state.trade.serverData.serverTime,
      $isShowServerPort_S_X: state => state.trade.serverData.isShowServerPort,
      $clientWidth_S_X: state => state.common.clientWidth,
      $activityInfo_S_X: state => state.trade.activity,
      // 是否显示交易密码弹窗
      $isShowGlobalPayPass_S_X: state => state.common.isShowGlobalPayPass_S,
      // 全局交易密码
      $globalPayPassword_S_X: state => state.common.globalPayPassword_S,
      // VIP是否禁用
      $isVIPEnable_S_X: state => state.common.footerInfo.configInfo.vipEnabled,
      $navigators_S_X: state => state.common.navigators_S,
      $activeLinkIndex_S_X: state => state.common.activeLinkIndex_S
    }),
    $activeBuyName_X () {
      return (this.$middleTopData_S_X.area || '').toUpperCase()
    },
    $activeSellName_X () {
      return (this.$middleTopData_S_X.sellsymbol || '').toUpperCase()
    },
    $routes_X () {
      return routesVariable
    },
    // 全局 公用文本
    $globalLabel_X () {
      return globalLabel
    }
  },
  filters: {
    $timeFilter_F_X: function (date, type, daySplitSymbol) {
      return timeFilter(date, type, daySplitSymbol)
    },
    // 数字 => 货币
    $moneyFilter_F_X: function (val) {
      let num = parseFloat(val)
      num = num.toLocaleString()
      return num
    }
  }
}
export default mixin
