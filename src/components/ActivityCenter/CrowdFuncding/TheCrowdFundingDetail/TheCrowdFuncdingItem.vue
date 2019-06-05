<!--
  author: zhaoxinlei
  create: 20190604
  description: 当前页面为 众筹页面 单个众筹项目 组件
-->
<template lang="pug">
  .the-crowd-funding-item
    // 项目详情
    .header
      .h-top
        span.logo(
          :style="{background: `url(${logo}) no-repeat center center/50px`}"
        )
        span.title {{projectName}}
      .h-bottom
        span.start-end {{startEndTimeText}}
        span {{applyStartTime | timerFormat1}}~{{applyEndTime | timerFormat1}}
    //  年化收益
    .middle
      h3.interest {{interestRate}} %
      span.interest {{interestRateText}}
      // 分隔符
      span.split
    //  详情
    .desc
      // 总额度
      .total
        span.label {{totalText}}
        span.value {{total |$moneyFilter_F_X}} {{ieoCoinName}}
      //  已锁
      .locked
        span.label {{lockedText}}
        span.value {{locked |$moneyFilter_F_X}}
      //  参与人数
      .nums
        span.label {{numsText}}
        span.value {{joinUserCount}} {{$t('M.user_invite_people')}}
      // 进度条
      .process
        TheProcess(:process="process")
      //  立即抢购、已结束、抢购未开始
      button.submit(
        :class="{active: statusCode === 'ongoing'}"
        @click="buyNow"
      ) {{statusName}}
</template>
<script>
import TheProcess from '../TheProcess'
export default {
  name: 'the-crowd-funding-item',
  // mixins: [],
  components: {
    TheProcess
  },
  props: {
    crowdFunding: {
      type: Object
    }
  },
  data () {
    return {
      startEndTimeText: '起止时间',
      interestRateText: '年化收益率',
      totalText: '总额度',
      lockedText: '已锁',
      numsText: '参与人数'
    }
  },
  // async created () {
  // },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    buyNow () {
      this.$goToPage(`/${this.$routes_X.crowdFunding}/${this.crowdFundingId}`)
    }
  },
  filters: {
    timerFormat1 (date) {
      console.log(date, new Date(date).getMonth())
      const newDate = new Date(date)
      const months = `${newDate.getMonth() + 1}`.padStart(2, '0')
      const days = `${newDate.getDate()}`.padStart(2, '0')
      const hours = `${newDate.getHours()}`.padStart(2, '0')
      const minutes = `${newDate.getMinutes()}`.padStart(2, '0')
      return `${months}/${days} ${hours}:${minutes}`
    }
  },
  computed: {
    logo () {
      return _.get(this.crowdFunding, 'logo')
    },
    applyEndTime () {
      return _.get(this.crowdFunding, 'applyEndTime')
    },
    applyStartTime () {
      return _.get(this.crowdFunding, 'applyStartTime')
    },
    projectName () {
      return _.get(this.crowdFunding, 'projectName')
    },
    interestRate () {
      return _.get(this.crowdFunding, 'interestRate')
    },
    total () {
      return _.get(this.crowdFunding, 'ieoTotal')
    },
    locked () {
      return _.get(this.crowdFunding, 'ieoAppliedAmount')
    },
    ieoCoinName () {
      return _.get(this.crowdFunding, 'ieoCoinName')
    },
    joinUserCount () {
      return _.get(this.crowdFunding, 'joinUserCount')
    },
    process () {
      return _.get(this.crowdFunding, 'process')
      // return 10
    },
    statusName () {
      /**
       * coming("coming", "即将开始"),
       * ongoing("ongoing", "进行中"),
       * sell_out("sell_out", "已满额"),
       * ended("ended", "已结束");
       */
      return _.get(this.crowdFunding, 'statusName')
    },
    statusCode () {
      return _.get(this.crowdFunding, 'statusCode')
    },
    crowdFundingId () {
      return _.get(this.crowdFunding, 'id')
    }
    /**
     * applyEndTime: 1559632607098
     applyStartTime: 1559650607088
     id: "1"
     ieoAppliedAmount: 50100
     ieoCoinId: "492724615412449280"
     ieoCoinName: "FUC"
     ieoTotal: 1000000
     joinUserCount: 103
     logo: "https://fubt-3.oss-cn-hongkong.aliyuncs.com/5834fe0c-6f80-4380-b198-274f2e4f82f6"
     process: 5.01
     projectName: "VDS 超级节点募集"
     statusCode: "coming"
     statusName: "即将开始"
     */
  },
  watch: {
    crowdFunding (New) {
      console.log(New)
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../../../assets/CSS/index.styl'
  .the-crowd-funding-item
    background rgba(21,27,48,1)
    box-shadow 0 3px 4px 0 #181A29
    border-radius 6px
    >.header
      display flex
      flex-direction column
      padding 20px 26px
      box-sizing border-box
      height 92px
      background-color #1d2440
      >.h-top
        display flex
        justify-content space-between
        color S_font_color
        .logo
          width 34px
          height 34px
          border-radius 50%
          background-color yellow
      >.h-bottom
        display flex
        justify-content space-between
        color S_font_color
    >.middle
      padding 27px
      box-sizing border-box
      text-align center
      >h3.interest
        font-size 36px
        /*line-height 50px*/
        color S_main_color
      >span.interest
        font-size 12px
        line-height 40px
        color S_font_color
      >.split
        display inline-block
        width 100%
        height 1px#1D2440#1D2440
        background-color #1D2440
    >.desc
      padding 0 27px
      >.total,.locked,.nums
        display flex
        justify-content space-between
        line-height 24px
        >span
          /*background-color pink*/
        >.label
          color S_font_color
        >.value
          color #fff
      >.submit
        width 100%
        height 44px
        background #1D2440
        border-radius 6px
        color #5E6891
        cursor pointer
        &.active
          background-color #1d2440
          color S_main_color
        &:hover
          background-color S_main_color
          color #fff
</style>
