<!--
  author: zhaoxinlei
  create: 20190605
  description: 当前页面为 众筹页面 详情页 右侧 当前众筹项目详情
-->
<template lang="pug">
  .the-crowd-funding-item-detail-right(
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
  )
    .top
      .left
        // 年化收益率
        span.value {{interestRate}}%
        span.label {{$t(label.interestRate)}}
      .center.text-align-c
        // 存币期限 (天)
        span.value {{dayTime}} {{$t('M.finance_day')}}
        span.label {{$t(label.status)}}
      .right
        // 参与人数
        span.value.text-align-r {{joinUserCount}} {{$t('M.user_invite_people')}}
        span.label.text-align-r {{$t(label.joinUserCount)}}
    .bottom
      // 未登录
      .un-login(v-if="!$isLogin_S_X")
        router-link.login(:to="`/${$routes_X.login}`") {{$t('M.user_security_login')}}
      .login(v-else)
        TheCrowdFundingItemDetailLogin(
          :detail="detail"
          :label="label"
          @updatePredict="updatePredict"
        )
</template>
<script>
import TheCrowdFundingItemDetailLogin from './TheCrowdFundingDetailLogin'
import {getDateTime} from '../../../../utils'
export default {
  name: 'the-crowd-funding-item-detail-right',
  // mixins: [],
  components: {
    TheCrowdFundingItemDetailLogin
  },
  props: {
    detail: {
      type: Object
    },
    label: {
      type: Object
    }
  },
  data () {
    return {
      // 存币期限（ 天）
      dayTime: ''
    }
  },
  // created () {
  // },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    updatePredict (e) {
      console.log(e)
      this.dayTime = e
      let time = this.interestEndTime - this.interestStartTime + 1 * 24 * 60 * 60 * 1000
      const timeObj = getDateTime(time)
      let {
        dayTime
      } = timeObj
      this.dayTime = dayTime
    }
  },
  // filters: {},
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
      return this.$t(`M.${_.get(this.detail, 'interestReturnWay')}`)
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
    },
    // 年化收益
    interestRate () {
      return _.get(this.detail, 'interestRate')
    },
    // 当前状态 （文本）
    statusName () {
      return _.get(this.detail, 'statusName')
    },
    // 参与人数
    joinUserCount () {
      return _.get(this.detail, 'joinUserCount')
    }
  },
  watch: {
    detail () {
      this.updatePredict()
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../../../assets/CSS/index.styl'
  .the-crowd-funding-item-detail-right
    display flex
    flex-direction column
    justify-content space-around
    > .top
      /*background-color tranparent*/
      display flex
      justify-content space-between
      > div
        >span
          display block
          line-height 30px
        > .value
          font-size 24px
          color S_error_color
        > .label
          font-size 12px
          color S_font_color
      > .left
        background-color tranparent
      > .center
        background-color tranparent
      > .right
        background-color tranparent
    > .bottom
      >.un-login
        .login
          display inline-block
          width 100%
          height 50px
          line-height 50px
          background-color #2A334F
          color S_main_color
          text-align center
          font-size 14px
          &:hover
            background-color S_main_color
            color #fff
    &.day
      > .top
        > div
          >span
          > .value
            color S_error_color
          > .label
            font-size 12px
            color #2F363D
        > .left
          background-color tranparent
        > .center
          background-color tranparent
        > .right
          background-color tranparent
      > .bottom
        >.un-login
          .login
            display inline-block
            width 100%
            height 50px
            line-height 50px
            background-color #eff1f3
            color S_main_color
            text-align center
            font-size 14px
            &:hover
              background-color S_main_color
              color #fff
</style>
