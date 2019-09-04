<!--
  author: wt
  create: 20190902
  description: 当前页面为 轮动策略 组件
-->
<template lang="pug">
  .container(:class="{'day':$isDayTheme_G_X,'night':!$isDayTheme_G_X}")
    .inner-box
      .banner-box
        .banner
      .content.text-center
        .content-box
          .navs
            a.nav-list1(@click.prevent="handleToQuantization") 我的策略 &nbsp;>&nbsp;
            span.nav-list2 轮动策略配置
          .navs-detail
            el-form.form1()
              el-form-item(label="活动时间" label-width="80px")
                el-date-picker(
                  v-model="startTime"
                  type="datetimerange"
                  align="right"
                  range-separator="~"
                  :start-placeholder="'开始时间'"
                  :end-placeholder="'结束时间'"
                  :default-time="['00:00:00', '00:00:00']"
                  :picker-options="pickerOptionsTime"
                )
              // 趋势策略
              el-form-item(label="参数" label-width="80px" v-if=" searchData.strategyType === 'TREND_STRATEGY' ")
                .params
                  .select-text 计价币种
                  el-select(placeholder="BTC")
                    el-option(label="BTC" value="'ssss'")
                .params-content
                  .add-params
                    .add-params-text
                      .params-text-l 基础币种
                      .params-text-r 占比
                    .add-params-content
                      .params-content-l BTC
                      .params-content-r 1%
                        IconFont.delete(iconName= "icon-shanchu")
                button.addCurrency 添加币种
              .footer-btns
                button.started 开启
                  IconFont.active(icon-name="icon-kaiqi")
                button.saved  保存
                  IconFont.active(icon-name="icon-baocun")
              el-form.form2()
                el-form-item(label="账户信息" label-width="80px")
                  table.accounts-info-content(border="1")
                    tr.accounts-info-header
                      td.header-cell 平台
                      td.header-cell 基础货币
                      td.header-cell 计价货币
                      td.header-cell 买卖续费
                      td.header-cell 卖手续费
                      td.header-cell 累计盈亏
                        IconFont.warn(icon-name="icon-jinggao")
                    tr.accounts-info-body
                      td.body-cell FUBT
                      td.body-cell BTC
                      td.body-cell BTC
                      td.body-cell 0.326 BTC
                      td.body-cell 5.6234 FUBT
                      td.body-cell 5.6234 FUBT
                el-form-item(label="浮动盈亏" label-width="80px")
                  .floating-panel
                    input(id="panel1" type="radio" name="panel" checked)
                    label.panel-item(for="panel1") FUBT_BTC/FBT
                    input(id="panel2" type="radio" name="panel")
                    label.panel-item(for="panel2") FUBT_BTC/FBT
                    input(id="panel3" type="radio" name="panel")
                    label.panel-item(for="panel3") FUBT_BTC/FBT
                .echarts-title
                  h5 历史盈亏走势图
                  .echarts-title-des
                    span.des 初始净值：
                      span.des-details 5000BTC
                    span.des 累计盈亏：
                      span.des-details 555FBT
                    span.des 当前持仓均价：
                      span.des-details 1.253FBT
                #charts-content()
    el-dialog(:title="'添加币种'" :visible.sync="addCurrencyVisible" class="dialog-buy")
      el-form()
</template>
<script>
import echarts from 'echarts/lib/echarts'
import IconFont from '../Common/IconFontCommon'
import {routesVariable} from '../../router/routesVariable'
// import {mapState} from 'vuex'
// import { getLanguagesAJAX } from '../utils/API/common'
export default {
  // name 为必填项
  name: 'rotation-strategy',
  components: {
    IconFont
  },
  // mixins: [],
  // components: {},
  // props,
  data () {
    return {
      startTime: [], // 开始时间
      pickerOptionsTime: {
        disabledDate: (time) => {
          let curDate = new Date(this.$route.params.endTime).getTime()
          let three = 90 * 24 * 3600 * 1000
          let threeMonths = curDate - three
          return time.getTime() > Date.now() || time.getTime() < threeMonths
        }
      },
      addCurrencyVisible: false,
      searchData: JSON.parse(sessionStorage.getItem('SEARCH_STRATEGY_DATA')),
      chartOptions: {
        backgroundColor: '',
        title: {},
        textStyle: {
          color: '#b2b7d0'
        },
        dataZoom: [
          {
            type: 'inside',
            filterMode: 'filter',
            minSpan: 12,
            startValue: 0
          },
          {
            type: 'inside',
            filterMode: 'filter'
          }
        ],
        grid: {
          left: '8%',
          top: '8%',
          right: '3%'
          // bottom: '6%'
        },
        tooltip: {
          trigger: 'item',
          backgroundColor: '#262A42',
          borderColor: '#262A42',
          borderRadius: 3,
          padding: 10,
          // hideDelay: 8000,
          confine: true,
          snap: true,
          position: 'top',
          textStyle: {
            fontSize: 12
          },
          formatter: (params) => {
            // 浮动盈亏
            return `<span>${params.name}</span><br/>
                      <span style="color: #338ff5">${this.$t('M.hold_bonus_position_label')}：${params.value} ${this.englishCoinName}</span>
                      `
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [],
          axisLine: {
            lineStyle: {
              color: '#3B4967'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#3B4967'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(59,73,103,.2)'
            }
          },
          axisLabel: {
            margin: 10,
            formatter: newNum => {
              if (newNum > 1000000) {
                newNum = `${this.$keep2Num(newNum / 1000000)}M`
              } else if (newNum > 1000) {
                newNum = `${this.$keep2Num(newNum / 1000)}K`
              }
              return newNum
            }
          }
        },
        series: [{
          type: 'line',
          // smooth: true, //是否平滑曲线显示
          // symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
          showAllSymbol: true,
          // symbol: 'image://./static/images/guang-circle.png',
          symbolSize: 8,
          lineStyle: {
            normal: {
              color: '#338ff5' // 线条颜色
            }
            // borderColor: '#f0f'
          },
          // 图标
          // label: {
          //   // show: true,
          //   position: 'top',
          //   textStyle: {
          //     color: 'red'
          //   }
          // },
          itemStyle: {
            normal: {
              color: '#338ff5'
            }
          },
          areaStyle: { // 区域填充样式
            normal: {
              color: 'rgba(51,143,245,.1)'
            }
          },
          data: []
        }],
        animation: false
      },
      charts: null
    }
  },
  async created () {
    // debugger
    // const data = await getLanguagesAJAX()
    // console.log(data)
    this.renderChart()
  },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    handleToQuantization () {
      console.log(this.searchData)
      this.$router.replace({
        name: routesVariable.quantization,
        params: {
          tab: 1
        }
      })
    },
    // 绘制图表
    renderChart () {
      this.resetOptions()
      this.charts = echarts.init(document.getElementById('echarts-content'))
      this.charts.setOption(this.chartOptions)
      window.addEventListener('resize', _.debounce(this.charts.resize, 100))
    },
    // 重置图表
    resetOptions () {
      if (this.$isDayTheme_G_X == 'day') {
        this.chartOptions.tooltip.backgroundColor = '#fff'
        this.chartOptions.tooltip.borderColor = '#fff'
        this.chartOptions.tooltip.textStyle.color = '#7D90AC'
        this.chartOptions.tooltip.extraCssText = 'box-shadow: 0px 2px 3px 0px rgba(198,212,228,1);'
        this.chartOptions.xAxis.axisLine.lineStyle.color = '#7D90AC'
        this.chartOptions.yAxis.axisLine.lineStyle.color = '#7D90AC'
      } else {
        this.chartOptions.tooltip.backgroundColor = '#262A42'
        this.chartOptions.tooltip.borderColor = '#262A42'
        this.chartOptions.tooltip.textStyle.color = '#fff'
        this.chartOptions.xAxis.axisLine.lineStyle.color = '#3B4967'
        this.chartOptions.yAxis.axisLine.lineStyle.color = '#3B4967'
        this.chartOptions.tooltip.extraCssText = 'box-shadow: 0px 2px 4px 0px rgba(29,37,55,1);'
      }
      // 默认显示 最新7条数据
      const xAxisLength = this.chartOptions.xAxis.data.length
      this.chartOptions.dataZoom[0].startValue = xAxisLength >= 7 ? xAxisLength - 7 : 0
    }
  },
  // filters: {},
  // computed: {
  // }
  watch: {
    $isDayTheme_G_X () {
      this.resetChart()
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../assets/CSS/index.styl'
  .container
    >.inner-box
      >.banner-box
        background #110c38
        >.banner
          background url('../../assets/quantization/banner.png') center no-repeat
          height 229px
      >.content
        margin-top 31px
        margin-bottom 200px
        >.content-box
          width 1300px
          margin 0 auto
          .navs
            padding 0 26px
            height 40px
            line-height 40px
            font-size 14px
            >.nav-list1
              cursor pointer
              color S_night_main_text_color
            >.nav-list2
              cursor pointer
              color S_main_color
          .navs-detail
            padding 36px 60px 60px 66px
            .el-form.form1
              .params-content
                margin-top 18px
                display flex
                flex-wrap wrap
                .add-params
                  width 192px
                  margin-right 33px
                  .add-params-text
                    display flex
                    .params-text-l
                      flex 1
                      text-align left
                    .params-text-r
                      width 59px
                      text-align center
                  .add-params-content
                    display flex
                    height 32px
                    line-height 32px
                    border-radius 2px
                    .params-content-l
                      padding-left 15px
                      flex 1
                    .params-content-r
                      width 59px
                      text-align center
                      position relative
                      .delete
                        position absolute
                        top -8px
                        right -8px
              .addCurrency
                width 77px
                height 28px
                border 1px solid S_main_color
                color S_main_color
                margin-top 33px
                cursor pointer
              .footer-btns
                margin 39px 0 50px 0
                text-align center
                font-size 14px
                footStyles()
                  width 146px
                  height 38px
                  line-height 38px
                  border-radius 4px
                  margin-right 40px
                  color S_day_bg
                  cursor pointer
                  .active
                    position absolute
                    margin 0 auto
                    left 28px
                    top 9px
                .started
                  footStyles()
                  position relative
                  background #30C296
                .saved
                  footStyles()
                  position relative
                  background S_main_color
            .el-form.form2
              padding 30px 0
              .el-form-item
                .accounts-info-content
                  font-size 12px
                  .header-cell
                    padding 10px 60px
                    white-space nowrap
                    .warn
                      color S_main_color
                      cursor pointer
                  .body-cell
                    padding 11px
                    text-align center
              .el-form-item
                .floating-panel
                  display flex
                  flex-wrap wrap
                  checkedStyle()
                    border 1px solid S_main_color
                    color S_main_color
                  input
                    display none
                    &:checked+.panel-item
                      checkedStyle()
                  .panel-item
                    display inline-block
                    width 111px
                    height 24px
                    line-height 24px
                    font-size 12px
                    text-align center
                    border-radius 2px
                    cursor pointer
                    overflow hidden
                    white-space nowrap
                    text-overflow ellipsis
                    margin 10px 32px 8px 0
              .echarts-title
                margin-top 51px
                text-align center
                .echarts-title-des
                  font-size 12px
                  margin-top 15px
                  .des
                    padding-right 30px
              #charts-content
                width 100%
                height 255px
  /deep/
    .el-input__inner
      width 192px
      height 32px
      border none
      .el-range__icon
        line-height 27px
    .el-form-item__content
      padding-left 55px
  &.night
    .content-box
      box-shadow 0 2px 2px 0 rgba(20, 23, 37, 1)
      .navs
        background S_night_main_bg
        border-bottom 1px solid #141725
      .navs-detail
        background S_night_main_bg
        .params
          >.select-text
            color S_night_main_text_color
      .el-form.form1
        .add-params
          color S_night_main_text_color
          .add-params-content
            background S_color1
            .params-content-r
              border-left 1px solid S_night_main_bg
      .el-form.form2
        border-top 1px solid #272b41
        border-bottom  1px solid #272b41
        .el-form-item
          .accounts-info-content
            border 1px solid #272b41
            .header-cell
              color S_night_main_text_color
            .body-cell
              color S_day_bg
        .el-form-item
          .floating-panel
            input
              &:unchecked+.panel-item
                border 1px solid S_color5
                color S_color5
            .panel-item
              border 1px solid S_color5
              color S_color5
        .echarts-title
          h5
            color S_day_bg
          .echarts-title-des
            color S_color5
            >.des
              >.des-details
                color S_night_main_text_color
  /deep/
    .el-form-item__label
      color #fff
    .el-input__inner
      background S_color1
      .el-range-separator
        color S_night_main_text_color
</style>
<!--<style scoped lang="scss" type="text/scss">-->
<!--.demo-box {-->
<!--background-color: $mainBG;-->
<!--}-->
<!--</style>-->
