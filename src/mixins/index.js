import {
  keep2Num,
  keep8Num,
  keep4Num,
  scientificToNumber,
  cutOutPointLength,
  formatSeconds,
  setStore,
  getStore,
  getStoreWithJson, timeFilter
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

import {routesVariable} from '../router/routesVariable'

let mixin = {
  data () {
    return {}
  },
  methods: {
    ...mapMutations({
      '$UPDATE_PAY_PASSWORD_DIALOG_M_X': 'UPDATE_PAY_PASSWORD_DIALOG_M'
    }),
    $goToPage (routerName, param) {
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
      return type == 'json' ? getStoreWithJson(name) : getStore(name)
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
    }
  },
  computed: {
    ...mapGetters({
      '$isNeedLimitExchange_G_X': 'isNeedLimitExchange_G',
      '$isNeedYST_G_X': 'isNeedYST',
      '$isChineseLanguage_G_X': 'isChineseLanguage'
    }),
    ...mapState({
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
      $isVIPEnable_S_X: state => state.common.footerInfo.configInfo.vipEnabled
    }),
    $activeBuyName_X () {
      return (this.$middleTopData_S_X.area || '').toUpperCase()
    },
    $activeSellName_X () {
      return (this.$middleTopData_S_X.sellsymbol || '').toUpperCase()
    },
    $routes_X () {
      return routesVariable
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
