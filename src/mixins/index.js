import {
  keep2Num,
  keep8Num,
  scientificToNumber,
  cutOutPointLength
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
    $keep2Num (num) {
      return keep2Num(num)
    },
    $keep8Num (num) {
      return keep8Num(num)
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
    }
  },
  computed: {
    ...mapGetters({
      '$isNeedLimitExchange_G': 'isNeedLimitExchange_G',
      '$isNeedYST_G_X': 'isNeedYST'
    }),
    ...mapState({
      // 交易对是否改变l
      $isSymbolChanged_X: state => state.common.isSymbolChanged,
      // 是否显示限价交易
      $isLimitShow_S_X: state => state.trade.serverData.isLimitShow,
      $middleTopData_S_X: state => state.trade.middleTopData,
      $serverTime_S_X: state => state.trade.serverData.serverTime,
      $isShowServerPort_S_X: state => state.trade.serverData.isShowServerPort
    })
  }
}
export default mixin
