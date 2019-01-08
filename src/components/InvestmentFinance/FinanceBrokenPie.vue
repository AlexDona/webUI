<template>
  <div class="financePie-box">
    <div
      id="financePie"
      class="financePie"
    >
    </div>
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
      investment: '',
      getMoney: '',
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
          // selectedMode: false,
          y: 'bottom',
          type: 'plain',
          show: 'true',
          textStyle: {
            color: '#fff',
            fontSize: 10
          },
          data: ['存币', '收益']
        },
        // 设置颜色
        color: ['#008069', '#B73C36'],
        // 设置线的颜色
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['30%', '80%'],
            // 设置饼状图不可点击
            // selectedMode: 'single',
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
              {value: '', name: '存币'},
              {value: '', name: '收益'}
            ]
          }
        ]
      }
    }
  },
  created () {
    // console.log(this.investmentValue)
    // console.log(this.getMoneyValue)
    // console.log(this.options)
  },
  mounted () {
    this.resetOptions()
    this.resetChart(this.options)
  },
  activated () {},
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
      this.options.series[0].data[0].value = this.investmentValue
      this.options.series[0].data[1].value = this.getMoneyValue
      this.options.legend.data[0] = this.$t('M.finance_invest')
      this.options.legend.data[1] = this.$t('M.finance_earnings')
      this.options.series[0].data[0].name = this.$t('M.finance_invest')
      this.options.series[0].data[1].name = this.$t('M.finance_earnings')
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language // 当前选中语言
    })
  },
  watch: {
    language () {
      this.resetOptions()
      this.resetChart(this.options)
    },
    theme () {
      this.resetOptions()
      this.resetChart(this.options)
    },
    investmentValue (val, oldval) {
      this.investment = oldval
      this.resetOptions()
      this.resetChart(this.options)
    },
    getMoneyValue (val) {
      this.getMoney = val
      this.resetOptions()
      this.resetChart(this.options)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
.financePie-box {
  width: 250px;

  > .financePie {
    width: 100%;
    height: 300px;
  }
}
</style>
