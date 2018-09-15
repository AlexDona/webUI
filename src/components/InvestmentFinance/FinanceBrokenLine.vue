<template>
  <div class="financeline-box">
    <div id="finance" class="finance"></div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import echarts from 'echarts/lib/echarts'
require('echarts/lib/chart/line')
// 引入提示框
require('echarts/lib/component/tooltip')
export default {
  data () {
    return {
      financeCharts: '',
      options: {
        xAxis: {
          type: 'category',
          boundaryGap: ['10%', '0%'],
          axisLabel: {
            show: true,
            textStyle: {
              color: '#404d64'
            }
          },
          minInterval: '10',
          data: ['6/10', '2/3', '3/4', '4/5', '5/6', '6/7', '7/8', '8/9', '9/10', '10/11', '11/12', '12/13', '13/14', '14/15', '15/16']
        },
        yAxis: {
          type: 'value',
          bottom: '3%',
          min: '0',
          max: '100',
          splitNumber: 5,
          splitLine: {
            lineStyle: {
              type: 'solid',
              color: '#1e2636'
            }
          },
          axisLine: {show: false},
          axisTick: {show: false},
          axisLabel: {
            show: true,
            textStyle: {
              color: '#2b7cd1'
            }
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: '',
            label: {
              backgroundColor: '#1e2636'
            }
          }
        },
        series: [{
          data: [80, 10, 80, 35, 15, 40, 50, 60, 70, 80, 90, 75, 20, 60, 10],
          type: 'line',
          smooth: 'none',
          symbol: 'none',
          itemStyle: {
            normal: {
              color: '#2b7cd',
              lineStyle: {
                color: '#2b7cd1'
              }
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(28, 95, 155,1)'
              }, {
                offset: 1,
                color: 'rgba(28, 95, 155,0.2)'
              }])
            }
          }
        }]
      }
    }
  },
  created () {},
  mounted () {
    this.drawLine()
  },
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    drawLine () {
      this.financeCharts = echarts.init(document.getElementById('finance'))
      this.financeCharts.setOption(this.options)
      // window.onresize = this.financeCharts.resize
    }
  },
  filter: {},
  computed: {},
  watch: {}
}
</script>
<style scoped lang="scss">
    .financeline-box{
        width: 1000px;
        margin:80px auto;
        >.finance{
            width: 100%;
            height: 450px;
            margin-left: -100px;
        }
    }
</style>
