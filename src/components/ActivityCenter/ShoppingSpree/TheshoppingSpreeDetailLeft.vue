<!--
  author: zxl
  create: 20190905
  description: 当前页面为 闪兑专区详情页面 左侧状态展示 组件
-->
<template lang="pug">
  .the-shopping-spree-detail-left
    // 顶部状态
    .status-tips {{projectStatusName}}
    .content
      h3.title {{projectName}}
      // 抢购进度
      .progress(v-if="!isProjectComing")
        // p.label 抢购进度
        p.label {{labelOBJ.shopping_spree_process1}}
        el-progress(
          :show-text="false"
          :stroke-width="12"
          :percentage="appliedPercentComp"
        )
        .desc
          .left {{appliedPercent}} %
          .right
            // span.label 已抢购：
            span.label {{labelOBJ.shopping_spree_have_to_snap_up}}：
            span.value {{appliedAmount}}
            span.coinname {{coinName}}
      // 倒计时
      .count-down(v-if="isProjectComing")
        p.label {{labelOBJ.countDownLabel}}
        p.inner
          span.value.day {{Days}}
          span.label {{$isChineseLanguage_G_X?'天':'Day'}}
          span.value.hour {{Hours}}
          span.label {{$isChineseLanguage_G_X?'时':'Hou'}}
          span.value.minute {{Minutes}}
          span.label {{$isChineseLanguage_G_X?'分':'Min'}}
          span.value.second {{Seconds}}
          span.label {{$isChineseLanguage_G_X?'秒':'Sec'}}
      // 抢购详情
      .detail
        .left
          // 抢购价格
          p.label {{labelOBJ.shopping_spree_price}}
          p.value.price 1 {{coinName}} = {{price}}{{priceCoinName}}
          // 接受币种
          p.label
            span.label {{labelOBJ.shopping_spree_accept_the_currency}}:
            span.value {{priceCoinName}}
          //  目标总额
          p.label
            span.label {{labelOBJ.shopping_spree_total_amount}}：{{amount}} {{coinName}}
        .right
          // 开始时间
          p.label
            span.label {{labelOBJ.startTime}}：
            span.value {{startTime}}
          // 结束时间
          p.label
            span.label {{labelOBJ.endTime}}：
            span.value {{endTime}}
          // 起购量
          p.label
            span.label {{labelOBJ.downLimit}}：
            span.value {{downLimit}} {{priceCoinName}}
          // 限额
          p.label
            span.label {{labelOBJ.priceLimit}}：
            span.value {{upLimit}} {{priceCoinName}}
</template>
<script>
import mixins from '../../../mixins/shoppingSpree'

export default {
  name: 'the-shopping-spree-detail-left',
  mixins: [mixins],
  // components: {},
  props: {
    // 详情
    details: {},
    countDown: {
      type: Number
    }
  },
  data () {
    return {
      // 开始时间倒计时timer
      countDownTimer: null,
      // 开始时间倒计时
      countDownTime: 0
    }
  },
  created () {},
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  beforeDestroy () {
    clearInterval(this.countDownTimer)
  },
  // destroyed () {},
  methods: {
    // 开始时间倒计时
    startTimeCountDown (countDown) {
      // clearInterval(this.countDownTimer)
      this.countDownTime = countDown * 1000
      this.countDownTimer = setInterval(() => {
        this.countDownTime -= 1000
        if (this.countDownTime < 0) {
          clearInterval(this.countDownTimer)
        }
      }, 1000)
    }
  },
  // filters: {},
  computed: {
    // 倒计时天
    Days () {
      return `${this.$formatSeconds(this.countDownTime)}`.split('_')[0]
    },
    // 倒计时 小时
    Hours () {
      return `${this.$formatSeconds(this.countDownTime)}`.split('_')[1]
    },
    Minutes () {
      return `${this.$formatSeconds(this.countDownTime)}`.split('_')[2]
    },
    Seconds () {
      return `${this.$formatSeconds(this.countDownTime)}`.split('_')[3]
    },
    // 项目名称
    projectName () {
      return _.get(this.details, 'projectName')
      // return 'FUC project to open a new value-for-money exchange multiple'
    },
    // 抢购进度
    appliedPercent () {
      return _.get(this.details, 'appliedPercent') - 0
    },
    // 抢购进度
    appliedPercentComp () {
      if (this.appliedPercent >= 100) {
        return 100
      } else {
        return this.appliedPercent || 0
      }
    },
    // 已抢购数量
    appliedAmount () {
      return _.get(this.details, 'appliedAmount')
    },
    // 抢购币种
    coinName () {
      return _.get(this.details, 'coinName')
    },
    // 兑换币种
    priceCoinName () {
      return _.get(this.details, 'priceCoinName')
    },
    // 抢购价格
    price () {
      return _.get(this.details, 'price')
    },
    // 起购量
    downLimit () {
      return _.get(this.details, 'downLimit')
    },
    // 限额
    upLimit () {
      return _.get(this.details, 'upLimit')
    },
    // 项目状态
    status () {
      return _.get(this.details, 'status')
    },
    // 项目是否即将开始
    isProjectComing () {
      return this.status === 'coming'
    },
    projectStatusName () {
      const {coming, ongoing, ended} = this.labelOBJ
      const statusMap = {
        coming,
        ongoing,
        ended
      }
      return statusMap[this.status]
    },
    // 目标总额
    amount () {
      return _.get(this.details, 'amount')
    },
    // 开始时间
    startTime () {
      const time = _.get(this.details, 'startTime')
      if (!time) return
      const date = `${time.split(' ')[0]}`
      const filterTime = `${time.split(' ')[1]}`
      const chnSplit = ['月', '日']
      const enSplit = ['Mon', 'Day']
      const targetStr = `${date.split('-')[1]} {} ${date.split('-')[2]} {} ${filterTime.split(':')[0]}:${filterTime.split(':')[1]}`
      return targetStr.format(this.$isChineseLanguage_G_X ? chnSplit : enSplit)
    },
    // 结束时间
    endTime () {
      const time = _.get(this.details, 'endTime')
      if (!time) return
      const date = `${time.split(' ')[0]}`
      const filterTime = `${time.split(' ')[1]}`
      const chnSplit = ['月', '日']
      const enSplit = ['Mon', 'Day']
      const targetStr = `${date.split('-')[1]} {} ${date.split('-')[2]} {} ${filterTime.split(':')[0]}:${filterTime.split(':')[1]}`
      return targetStr.format(this.$isChineseLanguage_G_X ? chnSplit : enSplit)
    }
  },
  watch: {
    countDownTime (New) {
      // 当前状态为 进行中 并且 倒计时为零
      if (New <= 0) {
        // coming => ongoing
        this.$emit('updateDetails', {
          status: 'ongoing'
        })
      }
    },
    countDown (New) {
      this.startTimeCountDown(New)
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../../assets/CSS/index.styl'
  .the-shopping-spree-detail-left
    height 442px
    position relative
    padding 70px 110px 0
    >.status-tips
      position absolute
      min-width 98px
      height 54px
      line-height 54px
      box-sizing border-box
      padding 0 27px
      background linear-gradient(48deg,rgba(252,76,27,1) 0%,rgba(245,124,59,1) 100%)
      box-shadow 0 4px 6px 0 rgba(21,24,37,1)
      top 8px
      left -8px
      font-size 16px
      font-weight 700
      color #fff
    >.content
      >.title
        color #fff
        font-size 24px
        margin-bottom 40px
        max-width 430px
        overflow-wrap break-word
      /* 进度条 */
      >.progress
        >.label
          font-size 16px
          text-align center
          color #D9E1F1
          margin-bottom 23px
        /* 进度条颜色 */
        /deep/
          .el-progress
            >.el-progress-bar
              >.el-progress-bar__outer
                background-color #31354A
        >.desc
          margin-top 17px
          display flex
          justify-content space-between
          font-size 14px
          color #66718F
      >.count-down
        >.label
          color #D9E1F1
          font-size 16px
          text-align center
          margin-bottom 30px
        >.inner
          text-align center
          >.value
            color #fff
            font-size 20px
            font-weight 700
            padding 8px
            margin 5px
            background url("../../../assets/PRE/pre-timer-bg.png") no-repeat center center
          >.label
            color #fff
            font-size 16px
      /* 抢购详情 */
      >.detail
        margin-top 45px
        display flex
        justify-content space-between
        position relative
        &:before
          position absolute
          content ''
          width 1px
          height 120px
          background-color rgba(102,113,143,.3)
          left 50%
          transform translateX(-50%)
        >.left
          font-size 14px
          color #66718F
          width 50%
          max-width 215px
          >.label
            color #66718F
            line-height 35px
            >.value
              color S_main_color
              margin-left 5px
          >.price
            font-size 22px
            color S_main_color
            font-weight 700
        >.right
          max-width 215px
          color #66718F
          line-height 30px
          >.label
            white-space nowrap
</style>
