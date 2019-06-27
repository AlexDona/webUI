<!--
  author: zhaoxinlei
  create: 20190619
  description: 当前组件为 众筹详情页面 扇形图 组件
-->
<template lang="pug">
  .pie-container
    #pie-box
</template>
<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'

export default {
  name: 'pie',
  // mixins: [],
  // components: {},
  props: {
    // 剩余额度
    remaining: {
      type: String
    },
    // 总额度
    total: {
      type: String
    },
    // 状态码
    statusCode: {
      type: String
    }
  },
  data () {
    return {
      chart: '',
      options: {
        backgroundColor: 'transparent',
        title: {
          left: 'center',
          top: 20,
          textStyle: {
            // color: '#ccc'
          }
        },

        tooltip: {
          trigger: 'item',
          textStyle: {
            fontSize: 12
          },
          formatter: function (params) {
            return `${params.name}：${params.percent}%`
          }
        },
        // visualMap: {
        //   show: false,
        //   min: 80,
        //   max: 600,
        //   inRange: {
        //     colorLightness: [0, 1]
        //   }
        // },
        color: ['#338ff5', '#303957'],
        series: [
          {
            type: 'pie',
            radius: '70px',
            center: ['50%', '50%'],
            data: [
              // 已投
              {value: this.compTotal - this.compRemaining, name: this.$t('M.crowd_funding_have_been_voted')},
              // 剩余
              {value: this.compRemaining, name: this.$t('M.crowd_funding_remained')}
            ],
            selectedOffset: 1,
            // 半径梯度增加
            // roseType: 'radius',
            label: {
              normal: {
                show: true,
                position: 'inner',
                align: 'center',
                color: '#fff',
                verticalAlign: 'middle',
                formatter: (params) => {
                  console.log(params)
                  const {dataIndex, percent} = params
                  // 不显示 100%

                  // let notNeedLabel = (dataIndex == 1 && (this.isUnStart || percent == 100)) || (dataIndex == 1 && (this.isEnded || percent == 0))
                  let notNeedLabel = (dataIndex == 0 && !percent) || (dataIndex == 1 && !percent)
                  if (notNeedLabel) {
                    return ''
                  } else {
                    return `${params.percent.toFixed(2)}%`
                  }
                }
              }
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: 'rgba(255, 255, 255, 0.3)'
                },
                smooth: 2,
                length: 10,
                length2: 14
              }
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  let colors = ['#338ff5', '#303957']
                  return colors[params.dataIndex]
                }
                // shadowBlur: 200,
                // shadowColor: 'rgba(0, 0, 0, 0.5)',
                // shadowOffsetX: -5,
                // shadowOffsetY: 5
              }
            }
            // animationType: 'scale',
            // animationEasing: 'elasticOut',
            // animationDelay: function (idx) {
            //   return Math.random() * 200
            // }
          }
        ]
      }
    }
  },
  // created () {
  // },
  mounted () {
    this.resetChart()
  },
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    resetChart () {
      this.chart = echarts.init(document.getElementById('pie-box'))
      this.options.series[0].data[0].name = this.$t('M.crowd_funding_have_been_voted')
      this.options.series[0].data[1].name = this.$t('M.crowd_funding_remained')
      // this.options.series[0].label.normal.formatter = (params) {
      //   console.log(params)
      //   const {dataIndex, percent} = params
      //   let notNeedLabel = dataIndex == 0 && (this.isUnStart || this.isEnded || percent == 0 || percent == 100)
      //   if (notNeedLabel) {
      //     return ''
      //   } else {
      //     return `${params.percent.toFixed(2)}%`
      //   }
      // }
      this.chart.setOption(this.options)
    }
  },
  // filters: {},
  computed: {
    compRemaining () {
      return this.remaining - 0
    },
    compTotal () {
      return this.total - 0
    },
    totalAndRemain () {
      return `${this.compRemaining}/${this.compTotal}`
    },
    compStatusCode () {
      return this.statusCode
    },
    isUnStart () {
      return this.compStatusCode == 'coming'
    },
    isEnded () {
      return this.compStatusCode == 'ended'
    }
  },
  watch: {
    $language_S_X () {
      this.resetChart()
    },
    totalAndRemain (New) {
      const remain = New.split('/')[0] - 0
      const total = New.split('/')[1] - 0
      console.log(New)
      this.options.series[0].data[0].value = total - remain
      this.options.series[0].data[1].value = remain
      if (!remain || remain == total) this.options.series[0].label.normal.position = 'center'
      this.resetChart()
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../../assets/CSS/index.styl'
  .pie-container
    width 160px
    height 160px
    #pie-box
      width 160px
      height 160px
</style>
