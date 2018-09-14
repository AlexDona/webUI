<template>
  <div class="financePie-box">
    <div id="financePie" class="financePie"></div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import echarts from 'echarts/lib/echarts'
require('echarts/lib/chart/pie')
// 引入提示框
require('echarts/lib/component/tooltip')
export default {
  data () {
    return {
      financePieCharts: '',
      options: {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        // formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          x: 'left',
          show: 'true',
          data: ['投资', '收益']
        },
        color: ['#008069', '#D45858'],
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
  created () {},
  mounted () {
    this.drawLine()
  },
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    drawLine () {
      this.financePieCharts = echarts.init(document.getElementById('financePie'))
      this.financePieCharts.setOption(this.options)
      // window.onresize = this.financeCharts.resize
    }
  },
  filter: {},
  computed: {},
  watch: {}
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
