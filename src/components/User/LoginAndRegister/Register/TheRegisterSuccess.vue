<!--
  author: zhaoxinlei
  create: 20190724
  description: 当前页面为 注册成功页面
-->
<template lang="pug">
 .the-register-success(
    :style="{height: `${windowHeight}px`}"
    :class="{'day':$isDayTheme_G_X,'night':!$isDayTheme_G_X }"
 )
  .inner-box
    .header {{$t('M.register_success_title_tips')}}
    .content
      p
        Iconfont.iconfont(icon-name="icon-chenggong2")
      // 注册成功
      p {{$t('M.invitation_register_Registration_Successful')}}
      p
        span.second {{successCountDown}}
        // 秒后跳转登录页面...
        span.tips {{ $t('M.forgetPassword_hint8') }}
      router-link(:to="$PCLoginDefaultRouter_G_X") {{ $t('M.forgetPassword_text3') }}
</template>
<script>
export default {
  name: 'the-register-success',
  // mixins: [],
  // components: {},
  props: ['inviteId'],
  data () {
    return {
      successCountDown: 3,
      timer: null
    }
  },
  created () {
    this.successJump()
  },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  beforeDestroy () {
    clearInterval(this.timer)
  },
  // destroyed () {},
  methods: {
    // 登录成功自动跳转
    successJump () {
      this.timer = setInterval(() => {
        this.successCountDown--
        if (this.successCountDown < 1) {
          clearInterval(this.timer)
          this.$goToPage(`/${this.$routes_X.login}`)
        }
      }, 1000)
    }
  },
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
  @import '../../../../assets/CSS/index.styl'
  .the-register-success
    display flex
    justify-content center
    flex-direction column
    align-items center
    >.inner-box
      width 780px
      height 517px
      border-radius 10px
      overflow hidden
      >.header
        height 70px
        line-height 70px
        font-size 20px
        padding-left 30px
      >.content
        text-align center
        height calc(100% - 70px)
        padding-top 90px
        .iconfont
          font-size 50px
        p
          font-size 14px
          line-height 40px
          .second
            font-size 20px
        >a
          margin-top 70px
          display inline-block
          width 235px
          height 46px
          line-height 46px
          border-radius 4px
    &.night
      >.inner-box
        >.header
          background-color #1c1f32
          color #fff
        >.content
          background linear-gradient(201deg,rgba(52,59,98,1) 0%,rgba(37,40,61,1) 100%)
          box-shadow 0 4px 9px 0 rgba(28,31,50,0.6)
          p
            color #fff
          >a
            background linear-gradient(81deg,rgba(18,71,133,1), rgba(42,59,97,1))
            box-shadow 0 3px 8px 0 rgba(0, 0, 0, 0.25)
            color #fff
    &.day
      >.inner-box
        box-shadow 0 3px 6px 0 rgba(0, 0, 0, 0.25)
        >.header
          background-color #DCE7F3
          color #333
        >.content
          background #fff
          p
            color #1C1F32
          >a
            background linear-gradient(81deg,rgba(106,182,244,1), rgba(49,135,218,1))
            box-shadow 0 3px 6px 0 rgba(26,42,71,0.27)
            color #fff
</style>
