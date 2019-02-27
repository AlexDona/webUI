import {keep2Num, keep8Num, scientificToNumber} from '../utils'
import {jumpToOtherPageForFooter, formatCount} from '../utils/commonFunc'

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
    $scientificToNumber (num) {
      return scientificToNumber(num)
    },
    $footerJump (router, activeName) {
      jumpToOtherPageForFooter(router, activeName)
    },
    $formatCount (num) {
      return formatCount(num)
    }
  }
}
export default mixin
