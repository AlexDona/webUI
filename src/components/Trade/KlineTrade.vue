<template>
  <!--K线-->
  <div
    id="tv_chart_container"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
  </div>
</template>
<script>
import Tv from '../../utils/tradingview'
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
        symbol: this.activeSymbol.sellsymbol + this.activeSymbol.area,
        interval: this.interval,
        paneProperties: this.paneProperties
      }, // K线请求参数
      interval: '1' // 时间周期
    }
  },
  created () {
    require('../../../static/charting_library/static/css/t-night.css')
    require('../../../static/css/theme/day/Trade/KlieneDay.css')
    console.log(this.paneProperties)
  },
  mounted () {
    // this.paneProperties.background = this.theme === 'night' ? '#10172d' : '#fff'
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
      activeTradeArea: state => state.common.activeTradeArea
    })
  },
  watch: {
    theme (newVal) {
      // this.paneProperties.background = newVal === 'night' ? '#10172d' : '#fff'
      // Tv.init({
      //   symbol: this.activeSymbol.sellsymbol + this.activeSymbol.area,
      //   interval: this.interval,
      //   paneProperties: this.paneProperties
      // })
    },
    activeTradeArea (newVal) {
      console.log(newVal)
      if (newVal.id) {
        // console.log(this.params)
        // this.resetKline(this.params)
      }
    }
  }
}
</script>
<style scoped lang="scss">
  #tv_chart_container {
    /*position: absolute;*/
    /*margin: 10px auto;*/
    width: 100%;
    height: 445px;
    /*left: 50%;*/
    /*transform: translate(-50%, 0);*/
    /*width: 1923px;*/
    /*height: 480px;*/
    &.night {
      /*background-color: pink;*/
    }
  }
</style>
