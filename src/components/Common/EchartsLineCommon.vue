<!--
  echarts折线图封装
-->
<template>
  <div
    class="line-box common"
    :id="id"
    :style="{width: '120px', height: '50px'}"
    :data="data"
  >
  <!--<div class="line-box common" :id="id" :style="{width: '100px', height: '50px'}">-->
  </div>
</template>
<script>
import echarts from 'echarts/lib/echarts'

require('echarts/lib/chart/line')
export default {
  components: {},
  props: ['data', 'id'],
  data () {
    return {
      chart: '',
      options: {
        grid: {
          top: 'middle'
        },
        xAxis: {
          type: 'category',
          show: false
          // data: [2.35, 1.23, 1.89, 1.24, 2.1, 1.59, 0.1, 2.35, 1.23]
        },
        yAxis: {
          type: 'value',
          min: 'dataMin',
          max: 'dataMax',
          // boundaryGap: ['30%', '100%'],
          // boundaryGap: false,
          show: false
        },
        series: [
          {
            type: 'line',
            smooth: 0.3,
            lineStyle: {
              normal: {
                width: 1.5
              }
            },
            color: ['#338ff5'],
            data: this.data,
            symbolSize: 0
          }
        ],
        animation: false
      }
    }
  },
  created () {
  },
  mounted () {
    this.chart = echarts.init(document.getElementById(this.id))
    this.chart.setOption(this.options)
  },
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {},
  filter: {},
  computed: {},
  watch: {
    data (newVal) {
      // console.log(newVal)
      this.options.series[0].data = newVal
      this.chart.setOption(this.options)
    }
  }
}
</script>
<style scoped lang="scss">

</style>
