<template>
  <div class="financeline-box">
    <div id="finance" class="finance"></div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import echarts from 'echarts/lib/echarts'
import {mapState} from 'vuex'
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
          lineStyle: {
            color: ''
          },
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
    // this.drawLine()
    this.resetOptions()
    this.resetChart(this.options)
  },
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    drawLine () {
      this.financeCharts = echarts.init(document.getElementById('finance'))
      this.financeCharts.setOption(this.options)
      window.onresize = this.financeCharts.resize
    },
    // 重新绘制图标
    resetChart (params) {
      this.financeCharts = echarts.init(document.getElementById('finance'))
      for (let k in params) {
        this.options[k] = params[k]
      }
      // console.log(params)
      this.financeCharts.setOption(this.options)
      window.onresize = this.financeCharts.resize
    },
    resetOptions () {
      // 设置监听颜色
      this.options.xAxis.axisLabel.textStyle.color = this.theme === 'night' ? '#404d64' : '#ccc'
      // 设置图形渐变的颜色
      if (this.theme === 'night') {
        this.options.series[0].areaStyle.normal = {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(112, 183, 247,1)'
          }, {
            offset: 1,
            color: 'rgba(112, 183, 247,0.2)'
          }])
        }
      } else {
          this.options.series[0].areaStyle.normal = {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(112, 183, 247,1)'
          }, {
            offset: 1,
            color: 'rgba(112, 183, 247,0.2)'
          }])
        }
      }
      // 设置坐标背横杠为虚线
      this.options.yAxis.splitLine.lineStyle.type = this.theme === 'night' ? 'solid' : 'dotted'
      this.options.yAxis.splitLine.lineStyle.color = this.theme === 'night' ? '#1e2636' :'rgba(30,38,54,0.2)' 
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme
    })
  },
  watch: {
    theme (newVal) {
      console.log(newVal)
      this.resetOptions()
      this.resetChart(this.options)
    }
  }
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
