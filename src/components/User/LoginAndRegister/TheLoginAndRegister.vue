<!--
  author: zhaoxinlei
  create: 20190622
  description: 当前页面为 登录页面、注册父页面
-->
<template lang="pug">
  .the-login-container(
    :style="{height: `${windowHeight}px`}"
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
  )
    HeaderCommonForPC
    .inner-box
      .left
        // 欢迎登录、欢迎注册
        h3.title {{$t('M.login_welcome')}}{{$t('M.comm_login')}}
        //  背景图
        .bg
        //  下载
        .download
          .d-left
            .qr-code-box
              QrCode(
                :value="qrCodeString"
                :size="80"
                :backgroundColor="'#fff'"
                :logoBackgroundColor="'transparent'"
                :margin="1"
                :colorDark="'#31385e'"
              )
          .d-right
            // 全平台接入
            p.top {{$t('M.about_footer_info_down1')}}
            // iOS、Android、Mac、Windows多个平台支持全业务功能
            p.middle {{$t('M.about_footer_info_down2')}}
            p.bottom
              // 扫码下载APP
              span.scan-download {{$t('M.login_scan_tips1')}}
              // 随时随地进行交易
              span.tips {{$t('M.login_scan_tips2')}}
      .right
        .container
          router-view
</template>
<script>
import HeaderCommonForPC from '../../Common/HeaderCommonForPC'
import TheNormalLogin from './TheLogin/TheNormalLogin'
import {domain} from '../../../utils/env'
export default {
  name: 'the-login',
  // mixins: [],
  components: {
    HeaderCommonForPC,
    TheNormalLogin
  },
  // props,
  data () {
    return {
      // 登录方式： normal QRCode
      loginType: 'normal',
      qrCodeButtonBg: require('../../../assets/develop/er-code-icon.png'),
      normalButtonBg: require('../../../assets/develop/pc-login-icon.png'),
      qrCodeString: `${domain}/downloadApp`
    }
  },
  // created () {},
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    toggleLoginType () {
      this.loginType = this.loginType == 'normal' ? 'QRCode' : 'normal'
    }
  },
  // filters: {},
  computed: {
    windowHeight () {
      return window.innerHeight
    },
    // 提示信息
    tipsText () {
      return this.loginType == 'normal' ? 'M.login_with_password_tips' : 'M.login_with_ercode_tips'
    },
    targetTipsButtonBg () {
      return this.loginType == 'normal' ? this.qrCodeButtonBg : this.normalButtonBg
    },
    loginWelcomeText () {
      return `${this.$t('M.login_welcome')}${this.$t('M.comm_login')}`
    },
    registerWelcomeText () {
      return `${this.$t('M.login_welcome_register')}`
    },
    // 欢迎文案
    welcomeText () {
      return this.$route.path.endsWith(`${this.$routes_X.login}`) ? this.loginWelcomeText : this.registerWelcomeText
    }
  }
  // watch: {}
}
</script>

<style scoped lang="stylus">
  @import '../../../assets/CSS/index.styl'
  @import '../../../assets/CSS/login_register.styl'
  .the-login-container
    width 100%
    min-height 1000px
    background S_login_black_bg
    display flex
    flex-direction column
    justify-content center
    .inner-box
      display flex
      width 1300px
      margin 0 auto
      >.left
        flex 12
        display flex
        flex-direction column
        >.title
          height 56px
          line-height 56px
          font-size 26px
          font-weight 400
        >.bg
          height 464px
          margin-right 200px
        >.download
          height 104px
          margin-top -50px
          background linear-gradient(90deg,rgba(50,57,94,1),rgba(39,43,65,0))
          border-radius 10px
          box-sizing border-box
          padding 12px 16px
          display flex
          .d-left
            background-color transparent
            margin-right 24px
            .qr-code-box
              width 80px
              height 80px
              overflow hidden
              background-color #272b41
          .d-right
            display flex
            flex-direction column
            justify-content space-between
            >.top
              font-size 18px
            >.bottom
              >.scan-download
                color #ECD358
                margin-right 10px
      >.right
        flex 11
        display flex
        flex-direction column
        justify-content center
        >.container
          box-sizing border-box
          background-color transparent
          >.inner-box
            width S_userWidth
            height 330px
            border-radius 10px
            overflow hidden
            background linear-gradient(201deg, #2a5889 0%, #2b3a6f 100%)
            box-shadow 0 4px 21px 0 #1a2a47
            >.header
              height 50px
              line-height 50px
              >.tips
                display inline-block
                box-sizing border-box
                padding 0 8px
                font-size 12px
                color S_day_bg
                background url('../../../assets/develop/login-tips-bg.png') no-repeat center center/100%
              >.toggle-box
                cursor pointer
                /*background-color yellow*/
                width 50px
                height 50px
                vertical-align top
    &.night
      .inner-box
        >.left
          /*background url('../../../assets/develop/login_black_bg.png') no-repeat 70% 300px*/
          color #fff
          >.bg
            background url('../../../assets/develop/login_black_bg.png') no-repeat center -10px
    &.day
      .inner-box
        >.left
          >.bg
            background url('../../../assets/develop/login_white_bg.png') no-repeat center -10px
        background #f9f9f9
</style>
