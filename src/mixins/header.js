/**
 * author: zhaoxinlei
 * create: 20190620
 * description: header(公共顶部) 相关 mixins
 */
import {
  mapGetters,
  mapState,
  mapActions,
  mapMutations
} from 'vuex'
import {userLogOut} from '../utils/api/user'

let mixin = {
  data () {
    return {}
  },
  methods: {
    ...mapActions([]),
    ...mapMutations([
      'USER_LOGOUT'
    ]),
    // 用户登出
    async $userLogOut_X () {
      const data = await userLogOut()
      if (!data) return false
      this.USER_LOGOUT()
      this.$goToPage(`/${this.$routes_X.home}`)
    }
  },
  computed: {
    ...mapGetters({}),
    ...mapState({
    })
  }
  // destroyed () {
  // },
  // watch: {}
}
export default mixin
