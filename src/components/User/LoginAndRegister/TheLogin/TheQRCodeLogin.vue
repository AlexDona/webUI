<!--
  author: zhaoxinlei
  create: 20190624
  description: 当前组件为 登录页面  扫码登录 组件
-->
<template lang="pug">
  .the-qr-code-login
    // 切换登录方式
    .header
      // 账号登录
      router-link.router-item(:to="`/${$routes_X.login}/${$routes_X.normalLogin}`") {{$t('M.login_with_ercode_tips')}}
      span.router-item.active {{$t('M.login_with_password_tips')}}
    // 主要内容
    .content
      // 正在扫码
      .scan(v-if="!isScanSuccess")
        // 未失效
        .effective
          h3.title
            span {{$t(title1)}}
          .qr-box
            .inner-box(@click="getQrCode")
              QrCode.cursor-pointer(
              v-if="qrCode"
              :value="qrCode"
              :size="186"
              )
          .tips(v-show="qrCode")
            span {{$t(tips)}}
      // 扫描成功
      .scan-success(v-else)
        Iconfont.icon-font(icon-name="iconscan-success")
        p.tips {{$t(scanSuccessTips1)}}
        p.tips {{$t(scanSuccessTips2)}}
        el-button.back-btn(@click="backToScan") {{$t(backToScanText)}}
    // 已失效
    .disabled(v-show="isQrCodeDisabled")
      el-button.refresh-btn(@click="getQrCode")
       Iconfont.icon-font(icon-name="icon-shuaxin")
      p {{$t(refreshText)}}
</template>
<script>
import TheCommonSlider from '../../../Common/CommonSlider'
import {getLoginErcode} from '../../../../utils/api/user'
import {loginSocketUrl} from '../../../../utils/env'
import socket from '../../../../utils/datafeeds/socket'
export default {
  name: 'the-qr-code-login',
  // mixins: [],
  components: {
    TheCommonSlider
  },
  // props,
  data () {
    return {
      isScanSuccess: false,
      title1: 'M.login_scan_safe_login',
      qrCode: '',
      tips: 'M.login_scanLogin',
      refreshText: 'M.login_erweimaReflesh',
      scanSuccessTips1: 'M.user_login_scan_success',
      scanSuccessTips2: 'M.user_login_phone_confirm_login',
      backToScanText: 'M.user_login_return_QR',
      isQrCodeDisabled: false,
      qrCodeEffectiveTime: this.ONE_MINUTE,
      ONE_MINUTE: 60
    }
  },
  created () {
    this.getQrCode()
  },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    // 刷新二维码
    getQrCode: _.throttle(async function () {
      this.isScanSuccess = false
      if (this.socket) this.socket.doClose()
      const data = await getLoginErcode()
      if (!data) return false
      this.isQrCodeDisabled = false
      console.log(data)
      this.qrCode = _.get(data, 'data.qrcode')
      this.socket = new socket(this.url = loginSocketUrl + this.erCodeString)
      this.socket.doOpen()
      this.socket.on('open', () => {
        this.socket.send(this.erCodeString)
        this.initQrCodeTimer()
        this.qrCodeTimer = setInterval(() => {
          if (this.qrCodeEffectiveTime > 0) {
            this.qrCodeEffectiveTime--
            // console.log(this.qrCodeEffectiveTime)
          } else {
            clearInterval(this.qrCodeTimer)
            this.isQrCodeDisabled = true
          }
        }, 1000)
        this.socket.on('message', (data) => {
          console.log(data)
          let socketData = data
          // 用户已扫码
          if (socketData.scan === 'scaned') {
            this.isScanSuccess = true
          } else if (socketData.scan === 'canceled') {
            this.backToScan()
          }
          // 登录成功
          if (socketData.data && socketData.data.userInfo) {
            this.userLoginSuccess(socketData.data)
          }
        })
      })
    }, 1000),
    initQrCodeTimer () {
      clearInterval(this.qrCodeTimer)
      this.qrCodeEffectiveTime = this.ONE_MINUTE
    },
    // 返回登录
    backToScan () {
      this.isScanSuccess = false
      this.refreshCode()
    }
  }
  // filters: {},
  // computed: {
  // },
  // watch: {}
}
</script>

<style scoped lang="stylus">
  @import '../../../../assets/CSS/index.styl'
  .the-qr-code-login
    width S_userWidth
    height 442px
    border-radius 10px
    overflow hidden
    background linear-gradient(201deg,rgba(52,59,98,1) 0%,rgba(37,40,61,1) 100%)
    box-shadow 0 4px 9px 0 rgba(28,31,50,0.6)
    position relative
    >.header
      height 130px
      padding-bottom 50px
      padding-top 40px
      text-align center
      >.router-item
        cursor pointer
        display inline-block
        margin 0 30px
        /*background-color pink*/
        height 50px
        line-height 50px
        vertical-align top
        font-size 16px
        font-weight 700
        color #8494A6
        &.active
          color #fff
          border-bottom 1px solid #fff
    .content
      position relative
      width S_userWidth
      height 310px
      /*background-color #39393b*/
      margin 0 auto
      padding 0 20px
      color #fff
      >.scan
        >.effective
          >.title
            /*font-weight 400*/
            height 50px
            text-align center
            span
              padding 0 10px
          >.qr-box
            > .inner-box
              margin 0 auto
              width 186px
          >.tips
            margin-top 10px
            max-height 40px
            text-align center
            font-weight 600
      >.scan-success
        text-align center
        padding-top 80px
        >.icon-font
          font-size 60px
        >.tips
          line-height 30px
          font-weight 600
        >.back-btn
          margin-top 30px
          background-color transparent
          border none
          color #2F78CA
          font-weight 600
          font-size 12px
    >.disabled
      position absolute
      left 0
      top 0
      background-color rgba(28, 31, 50, .9)
      width S_userWidth
      height 442px
      text-align center
      display flex
      flex-direction column
      justify-content center
      >p
        margin-top 20px
        color #fff
        font-weight 600
      /deep/
        .refresh-btn
          margin 0 auto
          background-color transparent
          border-color transparent
          &:hover
            color #000
          .icon-font
            font-size 44px
            background-color #fff
            border-radius 50%
            padding 10px
            box-sizing border-box
</style>
