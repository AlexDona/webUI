<!--
  author: zhaoxinlei
  create: 20190807
  description: 当前页面为 个人资产页面 持仓分红 组件
-->
<template lang="pug">
  .the-hold-bonus(
    v-if="isShowHoldInfos"
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
  )
    .hold-item.logo
      .content
        img.logo(:src="logoSrc")
        span.english {{englishFullName}}
    // 当前持仓
    .hold-item.usable
      .content
        p.label {{$t(usable.label)}}
        p.value(v-show="String(usableTotal) !=='NaN'") {{(usableTotal) }}
    // 参与条件： 已满足、未满足
    .hold-item.condition
      .content
        p.label
          span.label {{$t(condition.label)}}：
          span.value {{ifUserHoldSuccessLabel}}
        button.description(@click="toggleShowCondition(true)") {{$t(detailLabel)}}
    // 分红记录
    .hold-item.record
      .content
        p.label {{$t(record.label)}}
        button.description(@click="jumpToRecord") {{$t(detailLabel)}}
    // 备注信息
    .hold-item
      el-popover(
        :popper-class="`remark ${$isDayTheme_G_X ? 'day':'night'}`"
        effect="dark"
        placement="bottom"
        trigger="hover"
        width="275"
      )
        .content.remark-content(v-html="filterRemark")
        .content.remark(
          v-html="filterRemark"
          slot="reference"
        )
    //  参与条件弹窗
    el-dialog.condition-dialog(
      width="700px"
      :title="$t(condition.label)"
      :visible.sync="isShowConditionDialog"
    )
      .top
        // 参与条件
        .condition
          .left
            span.label ① {{$t(condition.label1)}}
          .right
            span.status(:class="{'done': isUserAuth}") {{isUserAuthDoneLabel}}
        .condition
          .left
            span.label ②  {{$t(condition.label2).format([minNumber, englishCoinName])}}
            // 提示信息
            .tips-button
              el-popover(
                :popper-class="`tips-content ${$isDayTheme_G_X ? 'day':'night'}`"
                effect="dark"
                placement="right"
                trigger="hover"
                width="218"
              )
                .content
                  // 举例说明
                  .title {{$t('M.hold_bonus_example_label')}}：
                  // 若分红开始时间为2019年7月1日，则首次快照持仓为2019/7/1 00:00:00 即此刻可用数量必须大于1000FUC!
                  .c-content {{$t('M.hold_bonus_example_1').format([minNumber, englishCoinName])}}
                Iconfont.iconfont(slot="reference" icon-name="icon-wenti")
          .right
            span.status(:class="{'done': isFirstHave}") {{isFirstHaveDoneLabel}}
        .condition
          .left
            span.label ③ {{$t(condition.label3).format([minNumber, englishCoinName])}}
            // 提示信息
            .tips-button
              el-popover(
              :popper-class="`tips-content ${$isDayTheme_G_X ? 'day':'night'}`"
              effect="dark"
              placement="right"
              trigger="hover"
              width="218"
              )
                .content
                  // 举例说明
                  .title {{$t('M.hold_bonus_example_label')}}：
                  // 若分红周期为2019/7/1~2019/7/7，则日均持仓不低于1000FUC，公式：日均持仓=（期初持仓+变动后持仓N+..）/ 变动次数
                  .c-content {{$t('M.hold_bonus_example_2').format([minNumber, englishCoinName])}}
                Iconfont.iconfont(
                  slot="reference"
                  icon-name="icon-wenti"
                  )
          .right
            span.status(:class="{'done': ifEveryHave}") {{ifEveryHaveDoneLabel}}
      .bottom
        // 日均持仓走势图
        h3.title {{$t('M.hold_bonus_title')}}
        //- 走势图
        .hold_chart(id="hold_chart")
      el-button.check-button(@click="toggleShowCondition(false)") {{$t('M.invitation_register_i_know')}}
</template>
<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import {getShowHoldStatusAJAX, getUserHoldInfoAJAX} from '../../../utils/api/holdBonus'
import {mapMutations} from 'vuex'
export default {
  name: 'the-hold-bonus',
  // mixins: [],
  // components: {},
  props: ['isShowHoldInfos'],
  data () {
    return {
      coinName: {
        chinese: '富链',
        english: 'FUCoin'
      },
      usable: {
        // 当前持仓（可用）,
        label: 'M.hold_bonus_current_position',
        value: '10000000'
      },
      // 参与条件
      condition: {
        // 参与条件
        label: 'M.hold_bonus_condition_label',
        // 必须通过身份高级认证
        label1: 'M.user_hold_bonus_condition_label_1',
        // 首次快照持仓不低于{}{}
        label2: 'M.user_hold_bonus_condition_label_2',
        // 日均持仓不低于{}{}
        label3: 'M.user_hold_bonus_condition_label_3'
      },
      record: {
        // 分红记录
        label: 'M.hold_bonus_record_label'
      },
      // 查看详情
      detailLabel: 'M.hold_bonus_detail_label',
      // 持仓分红信息
      holdInfos: {},
      chartOptions: {
        backgroundColor: '',
        title: {},
        textStyle: {
          color: '#b2b7d0'
        },
        grid: {
          left: '7%',
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
            // 持仓
            return `<span>${params.name}</span><br/>
                      <span style="color: #338ff5">${this.$t('M.hold_bonus_position_label')}：${params.value}</span>
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
          label: {
            show: true,
            position: 'top',
            textStyle: {
              color: '#fff'
            }
          },
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
      // 图表实例
      charts: null,
      // 参与条件显示状态
      isShowConditionDialog: false
    }
  },
  // async created () {
  // },
  // mounted () {
  // },
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    ...mapMutations([
      'CHANGE_USER_CENTER_ACTIVE_NAME'
    ]),
    // 跳转到 分红记录
    jumpToRecord () {
      this.$setStore('billingDetailsActiveName', 'hold-bonus')
      this.CHANGE_USER_CENTER_ACTIVE_NAME('billing-details')
    },
    toggleShowCondition (status) {
      this.isShowConditionDialog = status
      this.$nextTick(() => {
        this.resetChart()
      })
    },
    // 重新绘制图标
    resetChart () {
      this.charts = echarts.init(document.getElementById('hold_chart'))
      this.charts.setOption(this.chartOptions)
      window.addEventListener('resize', _.debounce(this.charts.resize, 100))
    },
    async confirmIsShowHoldInfo () {
      const data = await getShowHoldStatusAJAX()
      if (!data) return false
      this.isShowHoldInfos = _.get(data, 'data.ifShow')
      return this.isShowHoldInfos
    },
    async getUserHoldInfo () {
      let params = {}
      const data = await getUserHoldInfoAJAX(params)
      if (!data) return
      this.holdInfos = _.get(data, 'data')
    }
  },
  // filters: {},
  computed: {
    logoSrc () {
      return _.get(this.holdInfos, 'coinLogo')
    },
    // 币种全称
    englishFullName () {
      return _.get(this.holdInfos, 'coinEnglishName')
    },
    // 持仓可用
    usableTotal () {
      let num = parseFloat(_.get(this.holdInfos, 'coinTotal') - 0)
      num = num.toLocaleString()
      return num
    },
    englishCoinName () {
      return _.get(this.holdInfos, 'coinName')
    },
    isUserAuth () {
      return _.get(this.holdInfos, 'holdRequest.ifAuth')
    },
    ifUserHoldSuccess () {
      return _.get(this.holdInfos, 'ifUserHoldSuccess')
    },
    ifUserHoldSuccessLabel () {
      return this.$t(this.ifUserHoldSuccess ? 'M.user_hold_bonus_status_label_true' : 'M.user_hold_bonus_status_label_false')
    },
    isUserAuthDoneLabel () {
      // 已满足、未满足
      return this.$t(this.isUserAuth ? 'M.user_hold_bonus_status_label_true' : 'M.user_hold_bonus_status_label_false')
    },
    // 是否首次持仓
    isFirstHave () {
      return _.get(this.holdInfos, 'holdRequest.ifFirstHave')
    },
    // 是否首次持仓
    isFirstHaveDoneLabel () {
      // 已满足、未满足
      return this.$t(this.isFirstHave ? 'M.user_hold_bonus_status_label_true' : 'M.user_hold_bonus_status_label_false')
    },
    // 是否日均持仓
    ifEveryHave () {
      return _.get(this.holdInfos, 'holdRequest.ifEveryHave')
    },
    // 是否日均持仓
    ifEveryHaveDoneLabel () {
      // 已满足、未满足
      return this.$t(this.ifEveryHave ? 'M.user_hold_bonus_status_label_true' : 'M.user_hold_bonus_status_label_false')
    },
    // 最小持仓量
    minNumber () {
      return _.get(this.holdInfos, 'holdBonusSetting.minNumber')
    },
    // 持仓信息备注
    remark () {
      return _.get(this.holdInfos, 'holdBonusSetting.remark')
    },
    // 持仓信息备注(引文)
    remarkEnglish () {
      return _.get(this.holdInfos, 'holdBonusSetting.remarkEnglish')
    },
    // 过滤后的备注
    filterRemark () {
      return ((this.$isChineseLanguage_G_X ? this.remark : this.remarkEnglish) || '').replace(/\n/gm, '<br/>')
    },
    // 走势图数据
    tendData () {
      const data = _.get(this.holdInfos, 'holdRequest.dayList')
      let xs = []
      let ys = []
      let targetList = []
      if (data) {
        _.forEach(data, dayItem => {
          const {holdNum, dayTime} = dayItem
          const formatMonth = `${(new Date(dayTime - 0)).getMonth() + 1}`.padStart(2, '0')
          const formatDay = `${(new Date(dayTime - 0)).getDate()}`.padStart(2, '0')
          const targetTime = `${formatMonth}/${formatDay}`
          xs.push(targetTime)
          ys.push(holdNum)
        })
      }
      targetList[0] = xs
      targetList[1] = ys
      return targetList
    }
  },
  watch: {
    isShowHoldInfos: {
      handler (New) {
        if (New) this.getUserHoldInfo()
      },
      immediate: true
    },
    tendData (New) {
      const [xs, ys] = New
      this.chartOptions.xAxis.data = xs
      this.chartOptions.series[0].data = ys
      if (!this.isShowConditionDialog) return
      this.resetChart()
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../../assets/CSS/index.styl'
  .the-hold-bonus
    margin-top 10px
    height 100px
    display flex
    > .hold-item
      flex 1
      position relative
      box-sizing border-box
      display flex
      flex-direction column
      justify-content center
      /*max-width 201px*/
      &.logo
        max-width 160px
      &.usable
        max-width 200px
      &.condition
        max-width 238px
      &.record
        max-width 200px
      /deep/
        .content
          &.remark
            padding 0 16px
            overflow hidden
            text-overflow ellipsis
            display -webkit-box
            -webkit-box-orient vertical
            -webkit-line-clamp 5
      > .content
        white-space nowrap
        margin 0 auto
        > .description
          color S_main_color
          cursor pointer
          padding 0
        > .logo
          width 30px
          vertical-align middle
          margin-right 10px
        > span
          vertical-align middle
          font-size 12px
        > p
          line-height 30px
        > .label
          font-size 12px
          white-space nowrap
      &:before
        position absolute
        top 50%
        transform translateY(-50%)
        right 0
        content ''
        width 1px
        height 40px
      &:nth-of-type(5)
        font-size 12px
        &:before
          width 0
    /deep/
      .el-dialog__wrapper
        display flex
        flex-direction column
        justify-content center
        &.condition-dialog
          > .el-dialog
            margin-top 0 !important
            top 0
            height 550px
            > .el-dialog__body
              padding-left 0
              padding-right 0
              >.top
                padding 0 25px
                > .condition
                  display flex
                  height 25px
                  margin-bottom 12px
                  justify-content space-between
                  > .left
                    /*flex 1*/
                    display flex
                    >.label
                      margin-right 5px
                    /*position relative*/
                    >.tips-button
                      position relative
                      top -8px
                    > .label
                      font-size 12px
                  >.right
                    min-width 100px
                    >.status
                      font-size 12px
                      padding 5px 20px
                      border-radius 2px
                      &.done
                        border-color S_main_color
                        color S_main_color
              /* 底部 */
              .bottom
                height 300px
                padding 6px 25px
                >.title
                  font-size 12px
                  padding 0
                  position relative
                  color S_main_color
                  &:after
                    position absolute
                    content ''
                    width 2px
                    height 12px
                    background-color S_main_color
                    top 50%
                    transform translateY(-50%)
                    left -5px
                #hold_chart
                  height 280px
                  width 650px
              .check-button
                margin 14px auto 0
                display block
                border-radius 2px
    &.night
      > .hold-item
        background-color #1c1f32
        > .content
          > .description
            color S_main_color
          > span
            color #fff
          > .label
            color #9da5b3
            > .value
              color #d45858
          > .value
            color #fff
        &:before
          background-color rgba(97,116,153,.1)
      /deep/
        .el-dialog__wrapper
          &.condition-dialog
            > .el-dialog
              > .el-dialog__body
                >.top
                  > .condition
                    > .left
                      >.tips-button
                        .iconfont
                          color S_main_color
                      > .label
                        color #fff
                    >.right
                      >.status
                        color #66718f
                        border 1px solid #66718f
                        &.done
                          border-color S_main_color
                          color S_main_color
                /* 底部 */
                .bottom
                  border-bottom 1px solid #212b3f
                  border-top 1px solid #212b3f
                  >.title
                    color S_main_color
                    &:after
                      background-color S_main_color
                .check-button
                  background linear-gradient(90deg,rgba(18,71,133,1) 0%,rgba(42,59,97,1) 100%)
    &.day
      box-shadow 0 0 6px #cfd5df
      background-color #fff
      > .hold-item
        > .content
          > .description
            color S_main_color
          > span
            color #333
          > .label
            color #9da5b3
            > .value
              color #d45858
          > .value
            color #333
        &:before
          background-color rgba(97,116,153,.1)
      /deep/
        .el-dialog__wrapper
          &.condition-dialog
            > .el-dialog
              > .el-dialog__body
                >.top
                  > .condition
                    > .left
                      >.tips-button
                        .iconfont
                          color S_main_color
                      > .label
                        color #333
                    >.right
                      >.status
                        color #7D90AC
                        border 1px solid #7D90AC
                        &.done
                          border-color S_main_color
                          color S_main_color
                /* 底部 */
                .bottom
                  border-bottom 1px solid #7D90AC
                  border-top 1px solid #7D90AC
                  >.title
                    color S_main_color
                    &:after
                      background-color S_main_color
                .check-button
                  background linear-gradient(90deg,rgba(106,182,244,1) 0%,rgba(49,135,218,1) 100%)
                  color #fff
</style>
<style lang="scss">
  @import "../../../assets/CSS/index.scss";
  // 弹出框按钮
  .tips-content,
.remark {
    &.night {
      /* 内容 */
      .content {
        font-size: 12px;
        color: #d9e1f1;

        > .title {
          color: $mainColor;
        }
      }
    }

    &.day {
      background-color: #fff;

      .content {
        font-size: 12px;
        color: #333;

        > .title {
          color: $mainColor;
        }
      }
    }
  }

  .tips-content {
    &.night {
      background-color: #212b3f !important;

      .popper__arrow {
        &::after {
          border-right-color: #212b3f !important;
        }
      }
    }

    &.day {
      .popper__arrow {
        &::after {
          border-right-color: #fff !important;
        }
      }
    }
  }

  .remark {
    .remark-content {
      line-height: 24px !important;
    }

    .popper__arrow {
      &::after {
        top: 0 !important;
      }
    }

    &.night {
      background-color: #272b41;

      .popper__arrow {
        top: -7px !important;

        &::after {
          border-bottom-color: #272b41 !important;
        }
      }
    }

    &.day {
      .popper__arrow {
        top: -6px !important;

        &::after {
          border-bottom-color: #fff !important;
        }
      }
    }
  }
</style>
