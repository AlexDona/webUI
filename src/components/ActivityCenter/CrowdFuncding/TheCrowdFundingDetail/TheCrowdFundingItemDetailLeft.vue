<!--
  author: zhaoxinlei
  create: 20190605
  description: 当前页面为 众筹页面 详情页 左侧 当前众筹项目详情
-->
<template lang="pug">
  .the-crowd-funding-item-detail-left(
    v-show="ieoTotal"
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
  )
    .left
      .top
        .t-left
          Pie(
            :remaining="ieoRemained"
            :total="ieoTotal"
          )
        .t-right
          // 总额度
          .detail
            span.label {{$t(label.total)}}
            span.value {{ieoTotal |$moneyFilter_F_X}} {{ieoCoinName}}
          // 剩余额度
          .detail
            span.label {{$t(label.ieoRemained)}}
            span.value {{ieoRemained | $moneyFilter_F_X}} {{ieoCoinName}}
          // 单人限额
          .detail
            span.label {{$t(label.limit)}}
            span.value {{buyUpLimit | $moneyFilter_F_X}} {{ieoCoinName}}
          // 起购量
          .detail
            span.label {{$t(label.buyDownLimit)}}
            span.value {{buyDownLimit |$moneyFilter_F_X}} {{ieoCoinName}}
          // 最低持仓
          .detail
            span.label {{$t(label.holdCoinAmount)}}
            span.value {{holdCoinAmount |$moneyFilter_F_X}} {{holdCoinName}}
      //  时间线
      .detail.time-line
        .line
          .left
          .center
          .right
        .time
          // 截止时间
          .end-time
            span {{applyEndTime | timerFormat1_F_X('date')}}
            span {{applyEndTime | timerFormat1_F_X('time')}}
            span.time ({{$t(label.applyEndTime)}})
          //  计息时间
          .start-interest-time.text-align-c
            span {{interestStartTime | timerFormat1_F_X('date')}}
            span {{interestStartTime | timerFormat1_F_X('time')}}
            span.time ({{$t(label.interestStartTime)}})
          //  到期时间
          .over-time.text-align-r
            span {{interestEndTime | timerFormat1_F_X('date')}}
            span {{interestEndTime | timerFormat1_F_X('time')}}
            span.time ({{$t(label.interestEndTime)}})
</template>
<script>
import mixins from '../../../../mixins/crowdFunding'
import Pie from '../ThePie'
export default {
  name: 'the-crowd-funding-item-detail-left',
  mixins: [mixins],
  components: {
    Pie
  },
  props: {
    detail: {
      type: Object
    },
    label: {
      type: Object
    }
  },
  // data () {
  //   return {}
  // }
  // created () {
  // },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  // methods: {},
  filters: {
  },
  computed: {
    ieoTotal () {
      return _.get(this.detail, 'ieoTotal')
    },
    projectName () {
      return _.get(this.detail, 'projectName')
    },
    ieoCoinName () {
      return _.get(this.detail, 'ieoCoinName')
    },
    ieoRemained () {
      return _.get(this.detail, 'ieoRemained')
    },
    buyUpLimit () {
      return _.get(this.detail, 'buyUpLimit')
    },
    buyDownLimit () {
      return _.get(this.detail, 'buyDownLimit')
    },
    interestReturnWay () {
      return _.get(this.detail, 'interestReturnWay')
    },
    holdCoinAmount () {
      return _.get(this.detail, 'holdCoinAmount')
    },
    // 最低持仓币种
    holdCoinName () {
      return _.get(this.detail, 'holdCoinName')
    },
    applyEndTime () {
      return _.get(this.detail, 'applyEndTime')
    },
    // 计息开始时间
    interestStartTime () {
      return _.get(this.detail, 'interestStartTime')
    },
    // 计息结束时间
    interestEndTime () {
      return _.get(this.detail, 'interestEndTime')
    }
  }
  // watch: {}
}
</script>

<style scoped lang="stylus">
  @import '../../../../assets/CSS/index.styl'
  .the-crowd-funding-item-detail-left
    .left
      .top
        display flex
        .t-left
          flex 4
        .t-right
          flex 5
          >.detail
            display flex
            justify-content space-between
            line-height 30px
      >.time-line
        display flex
        justify-content space-between
        margin-top 10px
        flex-direction column
        >.line
          width 100%
          height 1px
          background-color #35587E
          /*display flex*/
          /*justify-content space-between*/
          position relative
          >.center,>.left,>.right
            width 8px
            height 8px
            background-color S_main_color
            border-radius 50%
            margin -4px auto 0
          >.left
            position absolute
            left 0
            top 0
          >.right
            position absolute
            right 0
            top 0
        >.time
          margin-top 20px
          height 40px
          width 100%
          display flex
          justify-content space-between
          >div
            flex 1
            >span
              display block
              line-height 20px
          >.start-interest-time
            text-align center
    &.day
      .left
        background-color #fff
        color #2F363D
        >.detail
          &.time-line
            >.line
              background-color #E6E6EB
              >.center,>.left,>.right
                background-color S_main_color
            >.time
              .time
                color #8A9099
</style>
