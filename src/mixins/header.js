/**
 * author: zhaoxinlei
 * create: 20190620
 * description: header(公共顶部) 相关 mixins
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
    ...mapActions([]),
    $toggleBox_X (type, status) {
      // console.log(1)
      switch (type) {
        case 'notice':
          this.showNoticeList = status
          break
        case 'setting':
          this.showSetting = status
          this.initSettings()
          break
        case 'lang':
          this.langSelecting = status
          break
        // case 'otc':
        //   this.otcSubNavStatus = status
        //   break
        // case 'activity':
        //   this.activityCenterSubNavStatus = status
        //   break
      }
    }
  },
  computed: {
    ...mapGetters({}),
    ...mapState({
    })
  },
  destroyed () {
  },
  watch: {}
}
export default mixin
