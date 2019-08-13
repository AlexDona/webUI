<<<<<<< HEAD
<!--
  author: zhaoxinlei
  update: 20190803
  description: 当前页面为 币币交易 深度图组件
-->
<template lang="pug">
  .depth-box.trade(:class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }" ref="depth-box")
    #depth-container
    .logo-mask
      img(:src="logoSrc")
</template>
<script>
import {mapState} from 'vuex'
import echarts from 'echarts/lib/echarts'
require('echarts/lib/chart/line')
require('echarts/lib/component/tooltip')
export default {
  name: 'the-depth',
  components: {},
  // props,
  data () {
    return {
      buys: [],
      sells: [],
      depthCharts: '',
      options: {
        backgroundColor: '',
        name: '123',
        title: {},
        textStyle: {
          color: '#b2b7d0'
        },
        grid: {
          left: '1.5%',
          top: '30px',
          right: '4%',
          bottom: '6%'
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#262A42',
          borderColor: '#262A42',
          borderRadius: 3,
          padding: 10,
          hideDelay: 8000,
          confine: true,
          style: {
            // color: '#c7cce6',
            // color: '#000',
            // width: '250px'
          },
          textStyle: {
            color: ''
          },
          // alwaysShowContent: true,
          axisPointer: {
            snap: true,
            confine: true,
            type: 'line',
            lineStyle: {
              // color: 'transparent'
              type: 'dashed'
            }
            // label: {
            //   show: true,
            //   formatter: '委托价:{value} ',
            // }
          },
          formatter: (params) => {
            console.log(params)
            const originColor = this.options.tooltip.axisPointer.lineStyle.color
            this.options.tooltip.axisPointer.lineStyle.color = params[0].seriesIndex == 0 ? '#F03E3E' : '#41B37D'
            const newColor = this.options.tooltip.axisPointer.lineStyle.color
            if (originColor !== newColor) this.resetChart(this.options)
            // 委托量
            return `${this.$t('M.trade_coin_entrusted_price')}：${this.$scientificToNumber(params[0].data[0])} ${this.$activeBuyName_X}<br/>
                      ${this.$t('M.trade_coin_entrusted_amount')}：${this.$scientificToNumber(params[0].data[1])} ${this.$activeSellName_X}
                      `
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#61688a'
            }
          }
        },
        yAxis: {
          position: 'right',
          // y轴分割线
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#61688a'
            }
          },
          axisLabel: {
            margin: 2,
            formatter: newNum => {
              switch (this.$language_S_X) {
                case 'zh_CN':
                  if (newNum > 100000000) {
                    newNum = `${this.$keep2Num(newNum / 100000000)}亿`
                  } else if (newNum > 10000) {
                    newNum = `${this.$keep2Num(newNum / 10000)}万`
                  }
                  return newNum
                default :
                  if (newNum > 1000000) {
                    newNum = `${this.$keep2Num(newNum / 1000000)}M`
                  } else if (newNum > 1000) {
                    newNum = `${this.$keep2Num(newNum / 1000)}K`
                  }
                  return newNum
              }
            }
          }
        },
        animation: false
      },
      series: [
        // 买
        {
          // 委托量
          name: this.$t('M.trade_coin_entrusted_amount'),
          type: 'line',
          color: 'rgba(240,62,62,0.3)',
          itemStyle: {
            normal: {
            }
          },
          lineStyle: {
            width: 2,
            color: '#F03E3E'
          },
          areaStyle: {},
          data: this.buys,
          symbolSize: 0
        },
        // 卖
        {
          // 委托量
          name: this.$t('M.trade_coin_entrusted_amount'),
          type: 'line',
          color: 'rgba(65,179,125,.3)',
          lineStyle: {
            width: 2,
            color: '#41B37D'
          },
          areaStyle: {},
          data: this.sells,
          symbolSize: 0
        }
      ]
    }
  },
  // created () {},
  // mounted () {},
  // activated () {},
  // update () {},
  // beforeRouteUpdate () {},
  methods: {
    mouseOver (e) {
      this.options.tooltip.hideDelay = 10000
      this.resetChart(this.options)
    },
    mouseLeave () {
      this.options.tooltip.hideDelay = 100
      this.resetChart(this.options)
    },
    // 切换内容显示隐藏
    toggleShowContent () {
      this.contentShowStatus = !this.contentShowStatus
    },
    // 重新绘制图标
    resetChart (params) {
      this.depthCharts = echarts.init(document.getElementById('depth-container'))
      for (let k in params) {
        this.options[k] = params[k]
      }
      this.depthCharts.setOption(this.options)
      // window.addEventListener('resize', this.depthCharts.resize)
      console.log(this.depthCharts.resize)
      window.addEventListener('resize', _.debounce(this.depthCharts.resize, 100))
    },
    // 重新设置 options
    resetOptions () {
      this.options.tooltip.borderColor = this.$theme_S_X === 'night' ? this.mainColor.$mainNightBgColor : this.mainColor.$mainDayBgColor
      this.options.backgroundColor = this.$theme_S_X === 'night' ? this.mainColor.$mainNightBgColor : this.mainColor.$mainDayBgColor
    },
    setWatchData (newVal) {
      if (newVal) {
        if (newVal.buy) {
          this.series[0].data = newVal.buy
        }
        if (newVal.sell) {
          this.series[1].data = newVal.sell
        }
        this.options.series = this.series
        this.resetOptions()
        this.resetChart(this.options)
      }
    }
  },
  // filter: {},
  computed: {
    ...mapState({
      socketData: state => state.common.socketData,
      depthDataByAjax: state => state.common.klineAjaxData.depthData,
      depthDataBySocket: state => state.common.socketData.depthData,
      mainColor: state => state.common.mainColor,
      showKlineOrDepth_S: state => state.trade.showKlineOrDepth_S,
      logoSrc: state => state.common.logoSrc
    }),
    isShowKline () {
      return this.showKlineOrDepth_S == 'kline'
    }
  },
  watch: {
    isShowKline (New) {
      if (!New) {
        this.depthCharts.resize()
      }
    },
    depthDataByAjax (newVal) {
      this.setWatchData(newVal)
    },
    depthDataBySocket (newVal) {
      this.setWatchData(newVal)
    },
    $theme_S_X () {
      this.resetOptions()
      this.resetChart(this.options)
    }
  }
}
</script>
<style lang="stylus">
  @import '../../assets/CSS/index.styl'
  .depth-box
    width 100%
    height 528px
    position relative
    #depth-container
      height 528px
    > .logo-mask
      position absolute
      z-index 2
      bottom 190px
      left 66px
      opacity .2
      pointer-events none
      > img
        height 30px
</style>
