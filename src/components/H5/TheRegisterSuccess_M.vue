<!--
  author: zhaoxinlei
  create: 20190817
  description: 当前页面为 移动端注册成功 页面
-->
<template lang="pug">
  .the-register-success-m
    MobileHeader(:isShowLogo="false")
    .content
      img.logo(:src="logoSrc")
      p
        Iconfont.iconfont(icon-name="icon-chenggong2")
      // 注册成功
      p.text {{$t('M.invitation_register_Registration_Successful')}}
      p
        span.second {{successCountDown}}
        // 秒后跳转登录页面...
        span.tips {{ $t('M.forgetPassword_hint8') }}
      router-link(:to="$mobileLoginDefaultRouter_G_X") {{ $t('M.forgetPassword_text3') }}
</template>
<script>
import MobileHeader from '../Common/HeaderForMobile'
import {mapState} from 'vuex'
export default {
  name: 'the-register-success-m',
  // mixins: [],
  components: {
    MobileHeader
  },
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
          this.$goToPage(`/${this.$routes_X.login}/m`)
        }
      }, 1000)
    }
  },
  // filters: {},
  computed: {
    ...mapState({
      logoSrc: state => state.common.logoSrc
    })
  }
  // watch: {}
}
</script>

<style scoped lang="stylus">
  @import '../../assets/CSS/index.styl'
  .the-register-success-m
    >.content
      min-height 20rem
      text-align center
      height calc(100% - 70px)
      padding 2rem 0
      color #fff
      >.logo
        width 3.66rem
        margin-bottom 2rem
      .iconfont
        font-size 2rem
      p
        font-size .7rem
        line-height 1.2rem
        .second
          font-size 1.2rem
        &.text
          margin-top 1rem
      >a
        margin-top 2rem
        display inline-block
        font-size: .7rem
        padding .4rem 2rem
        border-radius 4px
        background linear-gradient(81deg,rgba(42,59,97,1),rgba(18,71,133,1))
        box-shadow 0 3px 8px 0 rgba(0, 0, 0, 0.25)
        border-radius 4px
        color #fff
</style>
