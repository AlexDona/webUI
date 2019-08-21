<!--
  author: zhaoxinlei
  create: 20190820
  description: 当前页面为 移动端 忘记密码 页面
-->
<template lang="pug">
  .the-forget-pass(
    :style="{height: `${windowHeight}px`}"
    :class="{'day':$isDayTheme_G_X,'night':!$isDayTheme_G_X }"
  )
    MobileHeader
    .inner-box
      // 找回密码
      .header
        // 找回密码
        span.router-item {{$t('M.login_forgot_pwd_find1')}}
        // 找回密码后，24h无法提币
        span.tips
          Iconfont.iconfont(icon-name="icon-tishi1-copy")
          span {{$t('M.unraise_recovering_password')}}
      .content
        router-view
</template>
<script>
import MobileHeader from '../../Common/HeaderForMobile'
export default {
  name: 'the-forget-pass',
  // mixins: [],
  components: {
    MobileHeader
  },
  // props,
  data () {
    return {
      currentStep: 'step1',
      successImg: require('../../../assets/user/checkbox-success-bg.png')
    }
  },
  created () {
    this.$SET_ACTIVE_LINK_NAME_M_X(-1)
  },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  // methods: {},
  // filters: {},
  computed: {
    windowHeight () {
      return window.innerHeight
    },
    isStep1 () {
      return this.currentStep === 'step1'
    },
    isStep2 () {
      return this.currentStep === 'step2'
    },
    isStep3 () {
      return this.currentStep === 'step3'
    }
  },
  watch: {
    '$route' (New) {
      const {name} = New
      this.currentStep = name
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../../assets/CSS/index.styl'
  .the-forget-pass
    fontSize = .5rem
    width 100%
    .inner-box
      /*width 780px*/
      min-height 517px
      /*background-color pink*/
      border-radius 10px
      overflow hidden
      padding 0 1.83rem
      .header
        margin 2.4rem 0 1rem
        font-size fontSize
        .router-item
          padding-bottom .2rem
          border-bottom .016rem solid #fff
        .tips
          white-space nowrap
          display block
          margin-left 10px
          vertical-align middle
          font-size .4rem
          line-height 1.5rem
          >.iconfont
            margin-right .3rem
            font-size .4rem
            vertical-align middle
            color S_error_color
          >span
            vertical-align middle
    &.night
      background-color #272b41
      .inner-box
        .header
          color #fff
          .iconfont
            color S_error_color
          .tips
            color S_error_color
    &.day
      background-color #f5f5fa
      .inner-box
        background fff
        box-shadow 0 3px 6px 0 rgba(0, 0, 0, 0.25)
        .header
          background-color #DCE7F3
          color #333
          .iconfont
            color S_error_color
          .tips
            color S_error_color
</style>
