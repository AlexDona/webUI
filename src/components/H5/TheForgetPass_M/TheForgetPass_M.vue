<!--
  author: zhaoxinlei
  create: 20190820
  description: 当前页面为 移动端 忘记密码 页面
-->
<template lang="pug">
  .the-forget-pass-m(
    :style="{height: `${windowHeight}px`}"
    :class="{'day':$isDayTheme_G_X,'night':!$isDayTheme_G_X }"
  )
    MobileHeader(:isAllowLinkJump="false")
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
  name: 'the-forget-pass-m',
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
  .the-forget-pass-m
    fontSize = .5rem
    width 100%
    background-color #24293e
    margin-top -50px
    .inner-box
      /*width 780px*/
      min-height 517px
      border-radius 10px
      overflow hidden
      padding 0 1.83rem
      .header
        margin 2.4rem 0 1rem
        font-size .8rem
        color #fff
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
          color S_error_color
          >.iconfont
            color S_error_color
            margin-right .3rem
            font-size .4rem
            vertical-align middle
            color S_error_color
          >span
            vertical-align middle
</style>
