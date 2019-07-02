/**
 * author: renfuwei
 * create: 20190701
 * description: OTC模块相关 mixins
 */
import {
  mapGetters,
  mapState,
  mapActions
} from 'vuex'

let mixin = {
  data () {
    return {
      orderType: {
        buy: 'BUY',
        sell: 'SELL'
      },
      payType: {
        Alipay: 'Alipay',
        Bankcard: 'Bankcard',
        WestUnion: 'WestUnion',
        PAYPAL: 'PAYPAL',
        Wechat: 'Wechat'
      }
    }
  },
  methods: {
    ...mapActions([])
  },
  computed: {
    ...mapGetters({}),
    ...mapState({})
  },
  destroyed () {},
  watch: {}
}
export default mixin
