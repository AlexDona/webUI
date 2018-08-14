<template>
  <!--K线-->
  <div id="tv_chart_container">
  </div>
</template>
<script>
import Tv from '../../utils/tradingview'
export default {
  components: {},
  // props,
  data () {
    return {}
  },
  created () {},
  mounted () {
    Tv.init({symbol: 'AA', interval: '1'})
    // 开启交易面板
    const eventList = [
      {name: 'init', price: undefined},
      {name: 'setBuy', price: 478},
      {name: 'setSell', price: 358},
      {name: 'setSpread', price: 120}
    ]
    setTimeout(() => {
      eventList.forEach(elm => {
        frames[0].window.postMessage({eventType: elm.name, value: elm.price}, '*')
      })
    }, 300)
  },
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {},
  filter: {},
  computed: {},
  watch: {}
}
</script>
<style scoped>
  #tv_chart_container {
    /*position: absolute;*/
    /*margin: 10px auto;*/
    width: 100%;
    height: 445px;
    /*left: 50%;*/
    /*transform: translate(-50%, 0);*/
    /*width: 1923px;*/
    /*height: 480px;*/
  }
</style>
