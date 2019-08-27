import {
  // mapGetters,
  mapState,
  mapMutations
  // mapActions
} from 'vuex'

let mixin = {
  data () {
    return {
      PRETimer: null,
      PRE_currentTime: 0,
      maskBg: require('../assets/PRE/pre-bg-mask.png')
    }
  },
  // created () {},
  methods: {
    // ...mapActions([])
    ...mapMutations([
      'SET_JUMP_STATUS',
      'SET_JUMP_SYMBOL',
      'CHANGE_ACTIVE_TRADE_AREA',
      'SET_MIDDLE_TOP_DATA',
      'CHANGE_SYMBOL_CHANGED_STATUS'
    ]),
    PREJumpToTradeCenter () {
      const {areaId, name, id} = this.PRESymbolInfo
      const {path} = this.$route
      if (path.startsWith(`/${this.$routes_X.home}`)) {
        this.SET_JUMP_STATUS(true)
        this.SET_JUMP_SYMBOL(this.PRESymbolInfo)
        // 设置当前交易区
        this.CHANGE_ACTIVE_TRADE_AREA({
          id: areaId,
          name
        })
        this.$goToPage(`/${this.$routes_X.exchange}/${id}`)
      } else {
        this.$setStore('activeSymbol', id)
        this.SET_MIDDLE_TOP_DATA(this.PRESymbolInfo)
        this.CHANGE_SYMBOL_CHANGED_STATUS(true)
        const TradeStr = `/${this.$routes_X.exchange}/`
        this.$goToPage(`${TradeStr}${id}`)
        let {href} = window.location

        window.location.href = `${href.split(TradeStr)[0]}${TradeStr}${id}`
      }
    }
  },
  computed: {
    // ...mapGetters({}),
    ...mapState({
      startTime: state => state.trade.activity.startTime,
      endTime: state => state.trade.activity.endTime,
      $projectName_S_X: state => state.trade.activity.projectName,
      $sellCoinName_S_X: state => state.trade.activity.sellCoinName,
      $buyCoinName_S_X: state => state.trade.activity.buyCoinName,
      $PREStatus_S_X: state => state.trade.activity.status,
      $publishCount_S_X: state => state.trade.activity.publishCount,
      $exchangeRatio_S_X: state => state.trade.activity.exchangeRatio,
      $limitAmount_S_X: state => state.trade.activity.limitAmount,
      $stepDesc_S_X: state => state.trade.activity.stepDesc,
      $shadeImg_S_X: state => state.trade.activity.shadeImg,
      $projectDesc_S_X: state => state.trade.activity.projectDesc,
      $activityRule_S_X: state => state.trade.activity.activityRule
    }),
    PRE_Days () {
      return `${this.$formatSeconds(this.PRE_currentTime)}`.split('_')[0]
    },
    PRE_Hours () {
      return `${this.$formatSeconds(this.PRE_currentTime)}`.split('_')[1]
    },
    PRE_Minutes () {
      return `${this.$formatSeconds(this.PRE_currentTime)}`.split('_')[2]
    },
    PRE_Seconds () {
      return `${this.$formatSeconds(this.PRE_currentTime)}`.split('_')[3]
    },
    isShowPREActivity () {
      return (this.$PREStatus_S_X == 'coming' || (this.$PREStatus_S_X == 'ongoing' && this.PRE_currentTime > 1000)) && this.$activityInfo_S_X.showCountDown
    },
    PRESymbolInfo () {
      const symbolJSON = this.$getStore('symbolJSON', 'JSON')
      let preSymbolName = `${this.$sellCoinName_S_X}${this.$buyCoinName_S_X}`.toLowerCase()
      return symbolJSON[preSymbolName]
    }
  },
  destroyed () {
    clearInterval(this.PRETimer)
  },
  watch: {
    // 活动开始倒计时
    startTime (newVal) {
      if (newVal - 0 < 0) return
      clearInterval(this.PRETimer)
      this.PRE_currentTime = newVal
      this.PRETimer = setInterval(() => {
        this.PRE_currentTime -= 1000
        if (this.PRE_currentTime < 1000) clearInterval(this.PRETimer)
      }, 1000)
    },
    // 活动结束倒计时
    endTime (newVal) {
      if (newVal == 0) return
      clearInterval(this.PRETimer)
      this.PRE_currentTime = newVal
      this.PRETimer = setInterval(() => {
        this.PRE_currentTime -= 1000
        if (this.PRE_currentTime < 1000) {
          clearInterval(this.PRETimer)
        }
      }, 1000)
    }
  }
}
export default mixin
