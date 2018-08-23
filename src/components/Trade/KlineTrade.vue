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
    return {}
  },
  created () {
    // require('../../../static/charting_library/static/css/t-night.css')
  },
  mounted () {
    Tv.init({symbol: 'FUCFBT', interval: '1'})
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
  methods: {},
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme
    })
  },
  watch: {
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
      background-color: pink;
    }
  }
</style>
