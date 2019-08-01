<!--
  author: zhaoxinlei
  create: 20190722
  description: 当前页面为 忘记密码页面
-->
<template lang="pug">
  .the-forget-pass(
    :style="{height: `${windowHeight}px`}"
    :class="{'day':$isDayTheme_G_X,'night':!$isDayTheme_G_X }"
  )
    .inner-box
      // 忘记密码
      .header {{$t('M.login_tips3')}}
        Iconfont.iconfont(
          icon-name="icon-tishi1-copy"
        )
        // 找回密码后，24h无法提币
        span.tips {{$t('M.unraise_recovering_password')}}
      .content
        // 步骤条
        .step-box
          .step-item(
            :class="{'have-down': !isStep1, 'current': isStep1}"
          )
            .line
            p.step-number
              img(
                :src="successImg"
                v-show="!isStep1"
              )
            // 填写账户名
            p.step-desc {{$t('M.login_forgot_pwd_find2')}}
          .step-item(
            :class="{'have-down': isStep3, 'current': isStep2}"
          )
            .line
            p.step-number
              img(
                :src="successImg"
                v-show="isStep3"
              )
            // 设置新密码
            p.step-desc  {{ $t('M.login_forgot_pwd_find4') }}
          .step-item(
            :class="{'have-down': isStep3, 'current': isStep3}"
          )
            .line
            p.step-number
              img(
                :src="successImg"
                v-show="isStep3"
              )
            // 完成
            p.step-desc {{ $t('M.forgetPassword_achieve') }}
        router-view
</template>
<script>
export default {
  name: 'the-forget-pass',
  // mixins: [],
  // components: {},
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
    width 100%
    display flex
    justify-content center
    flex-direction column
    align-items center
    .inner-box
      width 780px
      min-height 517px
      border-radius 10px
      overflow hidden
      .header
        height 70px
        line-height 70px
        padding-left 30px
        font-size 20px
        vertical-align middle
        .iconfont
          margin-left 30px
          font-size 16px
          vertical-align middle
          color S_error_color
        .tips
          margin-left 10px
          vertical-align middle
          font-size 12px
          line-height 50px
      .content
        /* 步骤条 */
        .step-box
          display flex
          justify-content center
          height 100px
          text-align center
          margin-bottom 75px
          .step-item
            position relative
            flex 1
            max-width 212px
            height 100px
            vertical-align top
            /* 已完成 */
            &.have-down,&.current
              .line,
              .step-number
                background-color S_main_color
              .step-desc
                color S_main_color
            .line
              position relative
              top 50%
              width 212px
              height 2px
            .step-number
              position absolute
              top 56%
              left 44%
              width 24px
              height 24px
              border-radius 5px
              margin 0 auto
              font-weight 700
              font-size 12px
              line-height 24px
              transform rotate(45deg) translate(-50%, -50%)
              padding 0
              >img
                position absolute
                left 60%
                top 24%
                transform rotate(-45deg) translate(-50%, -50%)
                width 15px
            .step-desc
              margin-top 70px
              font-size 12px
    &.night
      background-color #272b41
      .inner-box
        background linear-gradient(201deg,rgba(52,59,98,1) 0%,rgba(37,40,61,1) 100%)
        box-shadow 0 4px 9px 0 rgba(28,31,50,0.6)
        .header
          background-color #1c1f32
          color #fff
          .iconfont
            color S_error_color
          .tips
            color S_error_color
        .content
          /* 步骤条 */
          .step-box
            .step-item
              /* 已完成 */
              &.have-down,&.current
                .line,
                .step-number
                  background-color S_main_color
                .step-desc
                  color S_main_color
              .line
                background-color #4E5475
              .step-number
                color #fff
                background-color #4E5475
              .step-desc
                color #4E5475
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
        .content
          /* 步骤条 */
          .step-box
            .step-item
              /* 已完成 */
              &.have-down,&.current
                .line,
                .step-number
                  background-color S_main_color
                .step-desc
                  color S_main_color
              .line
                background-color #ccc
              .step-number
                color #fff
                background-color #ccc
              .step-desc
                color #ccc
</style>
