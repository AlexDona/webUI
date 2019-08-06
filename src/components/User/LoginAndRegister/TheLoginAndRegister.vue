<!--
  author: zhaoxinlei
  create: 20190622
  description: 当前页面为 登录页面、注册父页面
-->
<template lang="pug">
  .the-login-container(
    :style="{height: `${windowHeight}px`}"
    :class="{'day':$isDayTheme_G_X,'night':!$isDayTheme_G_X }"
  )
    HeaderCommonForPC
    .inner-box
      .left
        // 欢迎登录、欢迎注册
        h3.title {{welcomeText}}
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
  created () {
    this.$SET_ACTIVE_LINK_NAME_M_X(-1)
  },
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
      const paths = this.$route.path.split('/')
      return !paths[2].includes(`${this.$routes_X.register}`) ? this.loginWelcomeText : this.registerWelcomeText
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
    display flex
    flex-direction column
    justify-content center
    .inner-box
      display flex
      width 976px
      margin 0 auto
      >.left
        flex 12
        display flex
        flex-direction column
        width 606px
        >.title
          height 56px
          line-height 56px
          font-size 26px
          font-weight 400
        >.bg
          height 464px
          margin-right 86px
        >.download
          height 104px
          margin-top -50px
          border-radius 10px
          box-sizing border-box
          padding 12px 16px
          display flex
          .d-left
            margin-right 24px
            .qr-code-box
              width 80px
              height 80px
              overflow hidden
          .d-right
            display flex
            flex-direction column
            justify-content space-between
            >.top
              font-size 18px
            >.bottom
              >.scan-download
                margin-right 10px
      >.right
        flex 11
        display flex
        flex-direction column
        justify-content center
        max-width 370px
        >.container
          box-sizing border-box
          >.inner-box
            width S_userWidth
            height 330px
            border-radius 10px
            overflow hidden
            >.header
              height 50px
              line-height 50px
              >.tips
                display inline-block
                box-sizing border-box
                padding 0 8px
                font-size 12px
              >.toggle-box
                cursor pointer
                width 50px
                height 50px
                vertical-align top
    &.night
      background S_login_black_bg
      .inner-box
        >.left
          >.title
            color #fff
          >.bg
            background url('../../../assets/develop/login_black_bg.png') no-repeat center -10px
          >.download
            background linear-gradient(90deg,rgba(50,57,94,1),rgba(39,43,65,0))
            color #fff
            .d-left
              background-color transparent
              .qr-code-box
                background-color #272b41
            .d-right
              >.top
              >.bottom
                >.scan-download
                  color #ECD358
        >.right
          >.container
            background-color transparent
            >.inner-box
              background linear-gradient(201deg, #2a5889 0%, #2b3a6f 100%)
              box-shadow 0 4px 21px 0 #1a2a47
              >.header
                >.tips
                  color S_day_bg
                  background url('../../../assets/develop/login-tips-bg.png') no-repeat center center/100%
    &.day
      background #f5f5fa
      .inner-box
        >.left
          >.title
            color #1C1F32
          >.bg
            background url('../../../assets/develop/login_white_bg.png') no-repeat center -10px
          >.download
            background linear-gradient(90deg,rgba(221,221,221,1),rgba(245,245,250,0))
            color #1C1F32
            .d-left
              background-color transparent
              .qr-code-box
                background-color #272b41
            .d-right
              >.top
              >.bottom
                >.scan-download
                  color #F65711
        >.right
          >.container
            background-color transparent
            >.inner-box
              background linear-gradient(201deg, #2a5889 0%, #2b3a6f 100%)
              box-shadow 0 4px 21px 0 #1a2a47
              >.header
                >.tips
                  color S_day_bg
                  background url('../../../assets/develop/login-tips-bg.png') no-repeat center center/100%
</style>
