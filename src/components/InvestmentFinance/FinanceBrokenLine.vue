<template>
  <div class="financeline-box">
    <div
      id="finance"
      class="finance-line"
      v-show="!noDataStatus"
    >
    </div>
    <div
      class="no-data"
      v-show="noDataStatus"
    >
      <img src="../../assets/finance/no-data.png">
      <div class="text">
        <!--暂无数据-->
        {{$t('M.comm_no_data')}}
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts/lib/echarts'
import {timeFilter} from '../../utils'
import {createNamespacedHelpers, mapState} from 'vuex'
const {mapMutations} = createNamespacedHelpers('finance')
require('echarts/lib/chart/line')
// 引入提示框
require('echarts/lib/component/tooltip')
export default {
  data () {
    return {
      noDataStatus: false,
      financeCharts: '',
      options: {
        animation: false,
        xAxis: {
          type: 'category',
          boundaryGap: ['10%', '0%'],
          axisLine: {
            lineStyle: {
              color: ''
            }
          },
          axisLabel: {
            show: true,
            rotate: 45,
            textStyle: {
              color: '#77839b',
              fontSize: 10
            }
          },
          minInterval: '10',
          data: []
        },
        yAxis: {
          type: 'value',
          bottom: '3%',
          min: '',
          max: '',
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
          backgroundColor: '#000',
          textStyle: {
            color: '#338FF5'
          },
          axisPointer: {
            type: '',
            label: {
              backgroundColor: '#1e2636'
            }
          },
          formatter: function (params) {
            // console.log(params)
            return `时间：${params[0].axisValue}<br/>价格：${params[0].data}`
          }
        },
        series: [{
          data: [],
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
      },
      arrTime: []
    }
  },
  created () {},
  mounted () {
    this.resetOptions()
    this.resetChart(this.options)
  },
  activited () {},
  update () {
  },
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([]),
    timeFormatting (data) {
      return timeFilter(data, 'date')
    },
    drawLine () {
      this.financeCharts = echarts.init(document.getElementById('finance'))
      this.financeCharts.setOption(this.options, true)
      window.onresize = this.financeCharts.resize
    },
    // 重新绘制图表
    resetChart (params) {
      this.financeCharts = echarts.init(document.getElementById('finance'))
      for (let k in params) {
        this.options[k] = params[k]
      }
      // console.log(params)
      this.financeCharts.setOption(this.options, true)
      window.onresize = this.financeCharts.resize
    },
    // 监听主题变化options之后重绘列表
    resetOptions () {
      // 任增加图示国际化
      this.options.tooltip.formatter = (params) => {
        return `${this.$t('M.comm_time')}：${params[0].axisValue}<br/>${this.$t('M.comm_price_metre')}：${params[0].data}`
      }
      // 设置监听颜色改变
      this.options.xAxis.axisLabel.textStyle.color = this.theme === 'night' ? '#404d64' : '#ccc'
      // 设置x轴线颜色
      this.options.xAxis.axisLine.lineStyle.color = this.theme === 'night' ? '' : '#ccc'
      // 设置线条的颜色
      this.options.series[0].itemStyle.normal.lineStyle.color = this.theme === 'night' ? '#2b7cd1' : '#499df6'
      // 设置图形渐变的颜色
      if (this.theme === 'night') {
        this.options.series[0].areaStyle.normal = {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(28, 95, 155,1)'
          }, {
            offset: 1,
            color: 'rgba(28, 95, 155,0.2)'
          }])
        }
      } else {
        this.options.series[0].areaStyle.normal = {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(122, 183, 247,1)'
          }, {
            offset: 1,
            color: 'rgba(112, 183, 247,0.2)'
          }])
        }
      }
      // 设置坐标背横杠为虚线
      this.options.yAxis.splitLine.lineStyle.type = this.theme === 'night' ? 'solid' : 'dotted'
      // 设置背景坐标颜色
      this.options.yAxis.splitLine.lineStyle.color = this.theme === 'night' ? '#1e2636' : '#ccc'
      // 设置x轴的文字颜色
      this.options.xAxis.axisLabel.textStyle.color = this.theme === 'night' ? '#4E5C77' : '#4E5C77'
      // 监听x轴数组的变化
      let [...financeLineRenderTimeList] = this.financeLineRenderTimeList
      this.options.xAxis.data = financeLineRenderTimeList.map(item => {
        return this.timeFormatting(+item)
      })
      // 监听y轴数组的变化
      // this.$set(this.options.series, 'data', this.financeLineRenderPriceList.reverse())
      // 将时间数组倒序
      let [...financeLineRenderPriceList] = this.financeLineRenderPriceList
      // this.options.series[0].data = financeLineRenderPriceList
      if (financeLineRenderPriceList.length) {
        this.options.series[0].data = financeLineRenderPriceList
        this.noDataStatus = false
      } else {
        this.noDataStatus = true
      }
      // 将价钱数组从小到打排序
      this.arrTime = this.financeLineRenderPriceList.sort((a, b) => a - b)
      // y轴最小值是数组的最小项
      this.options.yAxis.min = 0
      // y轴最大值是数组的最大值
      this.options.yAxis.max = this.arrTime[this.arrTime.length - 1]
      console.log(this.options)
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      // 从全局获取时间数组
      financeLineRenderTimeList: state => state.finance.financeLineRenderTimeList,
      // 冲全局获取价钱数组
      financeLineRenderPriceList: state => state.finance.financeLineRenderPriceList,
      // 监听全部status的变化，
      status: state => state.finance.status
    })
  },
  watch: {
    theme (newVal) {
      this.resetOptions()
      this.resetChart(this.options)
    },
    status (newVal) {
      this.resetOptions()
      this.resetChart(this.options)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
.financeline-box {
  width: 1000px;
  margin: 80px auto;

  > .finance-line {
    width: 100%;
    height: 450px;
    margin-left: -100px;
  }

  > .no-data {
    position: relative;
    width: 1000px;
    height: 274px;
    margin: 100px 0 100px -100px;
    line-height: 274px;
    text-align: center;

    > .text {
      position: absolute;
      top: 0;
      left: 50%;
      color: #338ff5;
    }
  }
}
</style>
