<template>
  <!--K线-->
  <div
    id="tv_chart_container"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
  </div>
</template>
<script>
// import Tv from '../../utils/tradingview'
import {mapState} from 'vuex'
export default {
  components: {},
  // props,
  data () {
    return {
      paneProperties: {
        background: '',
        vertGridProperties: {
          color: ''
        },
        horzGridProperties: {
          color: ''
        }
      },
      params: {
        // symbol: this.activeSymbol.sellsymbol + this.activeSymbol.area,
        symbol: '',
        previousSymbol: '', // 上一个交易对（取消用）
        interval: this.interval,
        // paneProperties: this.paneProperties
        paneProperties: {}
      }, // K线请求参数
      interval: '1' // 时间周期
    }
  },
  created () {
    require('../../../static/charting_library/static/css/t-night.css')
    require('../../../static/css/theme/day/Trade/KlieneDay.css')
    // console.log(this.paneProperties)
  },
  mounted () {
    // Tv.init({
    //   symbol: 'ASASSWEWES',
    //   interval: '1',
    //   paneProperties: this.paneProperties
    // })
    // console.log(this.paneProperties)
    //
    // this.paneProperties.background = this.theme === 'night' ? '#10172d' : '#fff'
    // this.params = {
    //   symbol: this.activeSymbol.sellsymbol + this.activeSymbol.area,
    //   interval: this.interval,
    //   paneProperties: this.paneProperties
    // }
    // console.log(this.)
    // this.resetKline(this.params)
    // Tv.init({symbol: 'AA', interval: '1'})
    // 开启交易面板
    // const eventList = [
    //   {name: 'init', price: undefined},
    //   {name: 'setBuy', price: 478},
    //   {name: 'setSell', price: 358},
    //   {name: 'setSpread', price: 120}
    // ]
    // setTimeout(() => {
    //   eventList.forEach(elm => {
    //     frames[0].window.postMessage({eventType: elm.name, value: elm.price}, '*')
    //   })
    // }, 100)
  },
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    resetKline (params) {
      Tv.init(params)
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      activeSymbol: state => state.common.activeSymbol,
      activeSymbolId: state => state.common.activeSymbol.id,
      activeTradeArea: state => state.common.activeTradeArea,
      activeTabId: state => state.trade.activeTabId,
      mainColor: state => state.common.mainColor
    })
  },
  watch: {
    theme (newVal) {
      console.log(newVal)
      // 更新K线主题
      Tv.applyOverrides({
        'paneProperties.background': this.theme === 'night' ? this.mainColor.$mainNightBgColor : this.mainColor.$mainDayBgColor,
        'paneProperties.vertGridProperties.color': this.theme === 'night' ? 'rgba(57,66,77,.2)' : '', // 行分割线
        'paneProperties.horzGridProperties.color': this.theme === 'night' ? 'rgba(57,66,77,.2)' : '' // 列分割线
      })
      // Tv.init({
      //   symbol: this.activeSymbol.sellsymbol + this.activeSymbol.area,
      //   interval: this.interval,
      //   paneProperties: this.paneProperties
      // })
    },
    activeTradeArea (newVal) {
      if (newVal.id) {
      }
    },
    activeSymbol (newVal) {
    },
    activeSymbolId (newVal) {
      console.log(this.activeSymbol.id)
      this.params.symbol = newVal
      this.params.areaId = this.activeTabId
      this.params.paneProperties.background = this.theme === 'night' ? this.mainColor.$mainNightBgColor : this.mainColor.$mainDayBgColor
      this.params.interval = '1'
      console.log(this.params)
      this.resetKline(this.params)
    }
  }
}
</script>
<style scoped lang="scss">
  @import '../../../static/css/scss/index';
  #tv_chart_container {
    width: 100%;
    height: 445px;
    &.night {
      background-color: $mainNightBgColor;
    }
    &.day{
      background-color: #fff;
    }
  }
</style>
