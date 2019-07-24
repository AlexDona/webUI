<!--
  author: zhaoxinlei
  create: 20190722
  description: 当前页面为 忘记密码页面
-->
<template lang="pug">
  .the-forget-pass(
    :style="{height: `${windowHeight}px`}"
  )
    .inner-box
      // 忘记密码
      .header {{$t('M.login_tips3')}}
        span.tips 找回密码后，24h无法提币
      .content
        // 步骤条
        .step-box
          .step-item(
            :class="{'have-down': true, 'current': false}"
          )
            .line
            p.step-number
            // 填写账户名
            p.step-desc {{$t('M.login_forgot_pwd_find2')}}
          .step-item.step2
            .line
            p.step-number
            // 设置新密码
            p.step-desc  {{ $t('M.login_forgot_pwd_find4') }}
          .step-item
            .line
            p.step-number
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
  // data () {
  //   return {}
  // }
  // created () {},
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
    }
  }
  // watch: {}
}
</script>

<style scoped lang="stylus">
  @import '../../../assets/CSS/index.styl'
  .the-forget-pass
    width 100%
    background-color #272b41
    display flex
    justify-content center
    flex-direction column
    align-items center
    .inner-box
      width 780px
      min-height 517px
      border-radius 10px
      background linear-gradient(201deg,rgba(52,59,98,1) 0%,rgba(37,40,61,1) 100%)
      box-shadow 0 4px 9px 0 rgba(28,31,50,0.6)
      overflow hidden
      .header
        height 70px
        line-height 70px
        background-color #1c1f32
        padding-left 30px
        color #fff
        font-size 20px
        vertical-align middle
        .tips
          margin-left 30px
          vertical-align middle
          font-size 12px
          color S_error_color
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
            &.have-down
              .line,
              .step-number
                background-color #3A8FDE
              .step-desc
                color #3A8FDE
            /* 当前项 */
            &.current
              background-color pink
            .line
              position relative
              top 50%
              width 212px
              height 2px
              background-color #8494A6
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
              color #fff
              background-color #8494A6
              transform rotate(45deg) translate(-50%, -50%)
            .step-desc
              margin-top 70px
              color #8494A6
              font-size 12px
</style>
