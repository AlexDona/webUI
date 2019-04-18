import {
  mapGetters,
  mapState,
  mapActions
} from 'vuex'

let mixin = {
  data () {
    return {
      timer: null,
      currentTime: 0,
      maskBg: require('../assets/develop/pre-bg.png')
    }
  },
  methods: {
    ...mapActions([])
  },
  computed: {
    ...mapGetters({}),
    ...mapState({
      startTime: state => state.trade.activity.startTime,
      endTime: state => state.trade.activity.endTime,
      $projectName_S_X: state => state.trade.activity.projectName,
      $sellCoinName_S_X: state => state.trade.activity.sellCoinName,
      $buyCoinName_S_X: state => state.trade.activity.buyCoinName,
      $status_S_X: state => state.trade.activity.status,
      $publishCount_S_X: state => state.trade.activity.publishCount,
      $exchangeRatio_S_X: state => state.trade.activity.exchangeRatio,
      $limitAmount_S_X: state => state.trade.activity.limitAmount,
      $stepDesc_S_X: state => state.trade.activity.stepDesc,
      $shadeImg_S_X: state => state.trade.activity.shadeImg,
      $projectDesc_S_X: state => state.trade.activity.projectDesc,
      $activityRule_S_X: state => state.trade.activity.activityRule
    }),
    days () {
      return `${this.$formatSeconds(this.currentTime)}`.split('_')[0]
    },
    hours () {
      return `${this.$formatSeconds(this.currentTime)}`.split('_')[1]
    },
    minutes () {
      return `${this.$formatSeconds(this.currentTime)}`.split('_')[2]
    },
    seconds () {
      return `${this.$formatSeconds(this.currentTime)}`.split('_')[3]
    }
  },
  destroyed () {
    clearInterval(this.timer)
  },
  watch: {
    // 活动开始倒计时
    startTime (newVal) {
      if (newVal - 0 < 0) return
      clearInterval(this.timer)
      this.currentTime = newVal
      this.timer = setInterval(() => {
        this.currentTime -= 1000
        if (this.currentTime < 1000) clearInterval(this.timer)
      }, 1000)
    },
    // 活动结束倒计时
    endTime (newVal) {
      if (newVal == 0) return
      clearInterval(this.timer)
      this.currentTime = newVal
      this.timer = setInterval(() => {
        this.currentTime -= 1000
        if (this.currentTime < 1000) {
          clearInterval(this.timer)
        }
      }, 1000)
    }
  }
}
export default mixin
