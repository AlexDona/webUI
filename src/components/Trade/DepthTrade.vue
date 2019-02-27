<template>
  <div
    class="depth-box trade"
    :class="{
      'day':theme == 'day',
      'night':theme == 'night'
    }"
  >
    <div
      class="title font-size16 cursor-pointer"
      @click="toggleShowContent"
    >
        <span class="text">
          <!--深度-->
          {{ $t('M.common_depth_map') }}
          <!-- 深度图 -->
        </span>
    </div>
    <el-collapse-transition>
      <div
        class="depth"
        id="depth"
        v-show="contentShowStatus"
      ></div>
    </el-collapse-transition>
  </div>
</template>
<script>
import echarts from 'echarts/lib/echarts'
import {mapState} from 'vuex'
require('echarts/lib/chart/line')
require('echarts/lib/component/tooltip')
export default {
  components: {},
  // props,
  data () {
    return {
      contentShowStatus: true,
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
          left: '4%',
          top: '30px',
          right: '6%',
          bottom: '14%'
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#262A42',
          borderColor: '#262A42',
          borderRadius: 3,
          padding: 10,
          style: {
            // color: '#c7cce6',
            // color: '#000',
            // width: '250px'
          },
          textStyle: {
            color: ''
          },
          axisPointer: {
            snap: true,
            confine: true,
            type: 'line',
            lineStyle: {
              color: 'transparent'
            }
            // label: {
            //   show: true,
            //   formatter: '委托价:{value} ',
            // }
          },
          formatter: (params) => {
            console.log(this)
            // 委托价
            // 委托量
            return `
                      ${this.$t('M.trade_coin_entrusted_price')}：${this.$scientificToNumber(params[0].data[0])}<br/>
                      ${this.$t('M.trade_coin_entrusted_amount')}：${this.$scientificToNumber(params[0].data[1])}
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
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#61688a'
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
          color: 'rgba(212,88,88,0.2)',
          itemStyle: {
            normal: {
            }
          },
          lineStyle: {
            width: 0
          },
          areaStyle: {
          },
          data: this.buys,
          symbolSize: 0
        },
        // 卖
        {
          // 委托量
          name: this.$t('M.trade_coin_entrusted_amount'),
          type: 'line',
          color: 'rgba(0,128,105,0.2)',
          lineStyle: {
            width: 0
          },
          areaStyle: {},
          data: this.sells,
          symbolSize: 0
        }
      ]
    }
  },
  created () {
  },
  mounted () {
  },
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 切换内容显示隐藏
    toggleShowContent () {
      this.contentShowStatus = !this.contentShowStatus
    },
    // 重新绘制图标
    resetChart (params) {
      this.depthCharts = echarts.init(document.getElementById('depth'))
      for (let k in params) {
        this.options[k] = params[k]
      }
      // console.log(params)
      this.depthCharts.setOption(this.options)
      window.onresize = this.depthCharts.resize
    },
    // 重新设置 options
    resetOptions () {
      this.options.tooltip.backgroundColor = this.theme === 'night' ? this.mainColor.$mainNightBgColor : this.mainColor.$mainDayBgColor
      this.options.tooltip.textStyle.color = this.theme === 'night' ? '#fff' : 'rgb(102,102,102)'
      this.options.tooltip.borderColor = this.theme === 'night' ? this.mainColor.$mainNightBgColor : this.mainColor.$mainDayBgColor
      this.options.backgroundColor = this.theme === 'night' ? this.mainColor.$mainNightBgColor : this.mainColor.$mainDayBgColor
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
  filter: {},
  computed: {
    ...mapState({
      socketData: state => state.common.socketData,
      depthDataByAjax: state => state.common.klineAjaxData.depthData,
      depthDataBySocket: state => state.common.socketData.depthData,
      theme: state => state.common.theme,
      mainColor: state => state.common.mainColor
    })
  },
  watch: {
    depthDataByAjax (newVal) {
      this.setWatchData(newVal)
    },
    depthDataBySocket (newVal) {
      this.setWatchData(newVal)
    },
    theme () {
      this.resetOptions()
      this.resetChart(this.options)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../../static/css/scss/index.scss';
  @import '../../../static/css/scss/Trade/TradeCenter.scss';

  .depth-box {
    margin: 10px auto;

    > .title {
      box-sizing: border-box;
      height: 34px;
      padding: 0 2.1%;

      /* font-weight: 700; */
      margin-bottom: 1px;
      line-height: 34px;

      > .text {
        display: inline-block;
        height: 100%;
        border-bottom: 2px solid $mainColor;
        text-indent: 4px;
        color: $mainColor;
      }
    }

    > .depth {
      width: 100%;
      height: 332px;
    }

    &.night {
      > .title {
        color: $nightMainTitleColor;
        background-color: $mainContentNightBgColor;
        box-shadow: 2px 0 3px rgba(27, 35, 49, 1);
      }
    }

    &.day {
      > .title {
        color: $dayMainTitleColor;
        background-color: $dayMainBgColor;
        box-shadow: 2px 0 3px rgba(239, 239, 239, 1);
      }
    }
  }
</style>
