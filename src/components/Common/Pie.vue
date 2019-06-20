<!--
  author: zhaoxinlei
  create: 20190619
  description: 当前组件为 通用 扇形图 组件
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
    remaining: {
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
              {value: 335, name: '已投'},
              {value: 310, name: '未投'}
            ],
            selectedOffset: 1,
            // 半径梯度增加
            // roseType: 'radius',
            label: {
              normal: {
                show: true,
                position: 'inner',
                formatter: function (params) {
                  // console.log(params)
                  return `${params.percent}%`
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
                  let colors = ['#303957', '#338ff5']
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
      this.chart.setOption(this.options)
    }
  },
  // filters: {},
  // computed: {},
  watch: {}
}
</script>

<style scoped lang="stylus">
  @import '../../assets/CSS/index.styl'
  .pie-container
    width 160px
    height 160px
    #pie-box
      width 160px
      height 160px
</style>
