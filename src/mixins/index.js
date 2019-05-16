import {
  keep2Num,
  keep8Num,
  keep4Num,
  scientificToNumber,
  cutOutPointLength,
  formatSeconds,
  setStore,
  getStore,
  getStoreWithJson
} from '../utils'
import {
  jumpToOtherPageForFooter,
  formatCount,
  getNestedData,
  http2https
} from '../utils/commonFunc'
import {
  mapGetters,
  mapState
} from 'vuex'

let mixin = {
  data () {
    return {}
  },
  methods: {
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
      $activityInfo_S_X: state => state.trade.activity
    })
  }
}
export default mixin
