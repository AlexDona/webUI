<template>
  <div class="financePie-box">
    <div id="financePie" class="financePie"></div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import echarts from 'echarts/lib/echarts'
import {mapState} from 'vuex'
require('echarts/lib/chart/pie')
// 引入提示框
require('echarts/lib/component/tooltip')
// 引入图例
require('echarts/lib/component/legend')
export default {
  props: ['investmentValue', 'getMoneyValue'],
  data () {
    return {
      financePieCharts: '',
      options: {
        tooltip: {
          trigger: 'item',
          // 显示提示数据
          formatter: function (params) {
            // console.log(params)
            return `${params.name}:${params.percent}%`
          }
        // formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        // 设置图例
        legend: {
          orient: 'horizontal',
          selectedMode: false,
          y: 'bottom',
          type: 'plain',
          show: 'true',
          textStyle: {
            color: '#fff',
            fontSize: 10
          },
          data: ['投资', '收益']
        },
        // 设置颜色
        color: ['#008069', '#D45858'],
        // 设置线的颜色
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['30%', '80%'],
            selectedMode: 'single',
            avoidLabelOverlap: false,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              normal: {
                show: false,
                position: 'inner'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '22',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {value: '30', name: '投资'},
              {value: '70', name: '收益'}
            ]
          }
        ]
      }
    }
  },
  created () {
    console.log(typeof this.investmentValue)
    console.log(typeof this.getMoneyValue)
  },
  mounted () {
    this.resetOptions()
    this.resetChart(this.options)
    // this.drawLine()
  },
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    resetChart (params) {
      this.financePieCharts = echarts.init(document.getElementById('financePie'))
      for (let k in params) {
        this.options[k] = params[k]
      }
      // console.log(params)
      this.financePieCharts.setOption(this.options)
      window.onresize = this.financePieCharts.resize
    },
    drawLine () {
      this.financePieCharts = echarts.init(document.getElementById('financePie'))
      this.financePieCharts.setOption(this.options)
      window.onresize = this.financePieCharts.resize
    },
    resetOptions () {
      this.options.legend.textStyle.color = this.theme === 'night' ? '#fff' : '#666'
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme
    })
  },
  watch: {
    theme () {
      this.resetOptions()
      this.resetChart(this.options)
    }
  }
}
</script>
<style scoped lang="scss">
    .financePie-box{
        width: 250px;
        >.financePie{
            width: 100%;
            height: 300px;
        }
    }
</style>
