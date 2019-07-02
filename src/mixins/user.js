/**
 * author: zhaoxinlei
 * create: 20190514
 * description: user相关 mixins
 */
import {
  mapGetters,
  mapState,
  mapActions
} from 'vuex'

let mixin = {
  data () {
    return {}
  },
  methods: {
    ...mapActions([])
  },
  computed: {
    ...mapGetters({}),
    ...mapState({
      // 用户身份
      $userType_X: state => state.user.loginStep1Info.userInfo.type,
      $userInfo_X: state => state.user.loginStep1Info.userInfo
    }),
    $userTypeOptions_X () {
      return {
        // 商家
        merchant: 'MERCHANT',
        // 普通用户
        common: 'COMMON'
      }
    },
    $isMerchant_X () {
      return this.$userType_X === this.$userTypeOptions_X.merchant
    },
    $useMerchantSetName_X () {
      return this.$isMerchant_X && this.nameOfMerchantSet
    }
  },
  destroyed () {
  },
  watch: {}
}
export default mixin
