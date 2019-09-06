<!--
  author: zxl
  update: 20190905
  description: 当前页面为app下载引导页
-->
<template lang="pug">
  .download-box(:style="{height: windowHeight+'px'}")
    .inner-box
      .title
        //全平台终端接入
        h3 {{$t('M.about_footer_info_down1')}}
        p {{$t('M.about_footer_info_down2')}}
        //  移动端
      .download-item
        .left
          .l-left
            IconFont(
              icon-name="icon-cellphoneiphone"
              class-name="icon-cellphoneiphone"
              )
          .l-right
            transition(
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
            )
              .qrcode-box(v-show="qrcodeVisible")
                Qrcode.qrcode(
                  :value="qrcodeString"
                  :logoSrc="logoSrc"
                )
            p
              span.scan-btn.cursor-pointer(
                @click="downloadApp('android')"
                @mouseover="toggleQrcode('android',1)"
                @mouseleave="toggleQrcode('android',0)"
              ) {{AndroidText}}
              span.scan-btn.cursor-pointer(
                @mouseover="toggleQrcode('iphone',1)"
                @mouseleave="toggleQrcode('iphone',0)"
                @click="downloadApp('ios')"
              ) {{iphoneText}}
            a(
              :href="downloadUrl"
              ref="download-link"
              download="android"
              :style="{display:'none'}"
            )
        // pc端
        .right(
          @mouseenter="toggleIsOpen(0)"
          @mouseleave="toggleIsOpen(1)"
        )
          .r-left
            IconFont(
              icon-name="icon-computer_icon"
              class-name="icon-diannao"
            )
          .r-right(v-show="isOpen")
            button
              IconFont(
                icon-name="icon-pingguo"
                class-name="icon"
              )
              // Mac 版本下载
              span {{$t('M.about_footer_info_down5')}}
            button
              IconFont(
                icon-name="icon-windows"
                class-name="icon"
              )
              //  WIN 版本下载
              span {{$t('M.about_footer_info_down6')}}
          .r-right( v-show="!isOpen")
            // 暂未开放，敬请期待
            p.please-wait {{$t('M.about_footer_info_down7')}}
</template>
<script>
import {
  mapState,
  mapGetters,
  mapActions
} from 'vuex'
import {
  domain
} from '../utils/env'
import IconFont from '../components/Common/IconFontCommon'
import Qrcode from '../components/Common/Qrcode'
import {routesVariable} from '../router/routesVariable'
export default {
  components: {
    IconFont,
    Qrcode
  },
  // props,
  data () {
    return {
      qrcodeVisible: false,
      qrcodeString: `${domain}${routesVariable.downloadApp}`,
      isOpen: true,
      downloadUrl: '',
      AndroidText: 'Android',
      iphoneText: 'iphone'
      // 二维码logo
      // logoSrc: ''
    }
  },
  async created () {
    this.GET_APP_URL_ACTION()
  },
  // mounted () {
  // },
  // updated () {
  // },
  // beforeRouteUpdate () {
  // },
  methods: {
    ...mapActions([
      'GET_APP_URL_ACTION'
    ]),
    downloadApp (type) {
      if (this.isMobile) {
        switch (type) {
          case 'android':
            window.location.href = 'scheme: //fubt.com/'
            this.downloadUrl = this.androidUrl
            break
          case 'ios':
            this.downloadUrl = `itms-services://?action=download-manifest&;amp;url=${this.iosUrl}`
            break
        }
        this.$refs['download-link'].click()
      } else {
        switch (type) {
          case 'android':
            if (!this.androidDownloadSwitch) {
              return false
            } else {
              window.location.href = this.androidUrl
            }
            break
          case 'ios':
            if (!this.iosDownloadSwitch) {
              return false
            } else {
              window.location.href = this.iosIpaUrl
            }
            break
        }
      }
    },
    toggleIsOpen (data) {
      this.isOpen = data
    },
    toggleQrcode (type, data) {
      if (type) {
        switch (type) {
          case 'iphone':
            if (!this.iosDownloadSwitch) {
              if (data) {
                // 暂未开放，敬请期待
                this.iphoneText = this.$t('M.about_footer_info_down7')
                return false
              } else {
                this.iphoneText = 'iphone'
                this.qrcodeVisible = data
              }
            } else {
              this.qrcodeVisible = data
            }
            break
          case 'android':
            if (!this.androidDownloadSwitch) {
              if (data) {
                // 暂未开放，敬请期待
                this.AndroidText = this.$t('M.about_footer_info_down7')
                return false
              } else {
                this.iphoneText = 'Android'
                this.qrcodeVisible = data
              }
            } else {
              this.qrcodeVisible = data
            }
            break
        }
      }
    }
  },
  filter: {},
  computed: {
    ...mapGetters({
      isNeedIOS: 'isNeedIOS'
    }),
    ...mapState({
      language: state => state.common.language,
      androidUrl: state => state.footerInfo.downloadUrl.android,
      iosUrl: state => state.footerInfo.downloadUrl.ios,
      iosIpaUrl: state => state.footerInfo.downloadUrl.iosIpa,
      isMobile: state => state.user.isMobile,
      logoSrc: state => state.common.footerInfo.footerInfo1.downLoadAppQrCodeLogo,
      androidDownloadSwitch: state => state.footerInfo.downloadUrl.androidDownloadSwitch,
      iosDownloadSwitch: state => state.footerInfo.downloadUrl.iosDownloadSwitch
    }),
    windowHeight () {
      return window.innerHeight
    }
  }
  // watch: {
  // }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../assets/CSS/index';

  .download-box {
    width: 100%;
    height: 100%;
    margin-top: 50px;
    background: url(https://fubt-3.oss-cn-hongkong.aliyuncs.com/de7782c2-1e5c-4c99-8e4b-4bf94f40bf20) no-repeat center center;
    background-size: 100% 100%;

    > .inner-box {
      height: 100%;
      overflow: hidden;

      > .title {
        margin: 135px auto;
        text-align: center;

        > h3 {
          font-weight: bold;
          font-size: 40px;
          font-family: "MicrosoftYaHei-Bold";
          line-height: 44px;
          color: #fff;
        }

        > p {
          font-weight: 400;
          font-size: 18px;
          font-family: "MicrosoftYaHei";
          line-height: 44px;
          color: #fff;
        }
      }

      > .download-item {
        display: flex;
        width: 813px;
        height: 113px;
        margin: 0 auto;

        > .left {
          display: flex;
          flex: 1;

          > .l-left {
            .icon-cellphoneiphone {
              font-size: 120px;
              color: #fff;
            }
          }

          > .l-right {
            position: relative;
            line-height: 40px;
            text-align: center;
            color: $mainColor;

            > .qrcode-box {
              /* transition: all .5s; */
              position: absolute;
              top: -180px;
              left: 50%;
              width: 170px;
              height: 170px;
              padding: 5px;
              border-radius: 6px;
              background-color: #fff;
              transform: translate(-50%, 0);

              > .qrcode {
                width: 100% !important;
                height: 100% !important;
                background-color: #fff;
              }
            }

            > p {
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: space-between;

              > .scan-btn {
                display: block;
                width: 220px;
                height: 40px;
                border-radius: 25px;
                line-height: 40px;
                text-align: center;
                color: #fff;
                background: linear-gradient(90deg, rgba(43, 78, 129, 1) 0%, rgba(43, 60, 112, 1) 100%);
              }
            }
          }
        }

        > .right {
          display: flex;
          flex: 1;

          > .r-left {
            > .icon-diannao {
              font-size: 120px;
              color: #fff;
            }
          }

          > .r-right {
            transition: all .5s;

            > button {
              display: block;
              margin: 20px 0 0 20px;
              font-size: 18px;
              color: $mainColor;

              > .icon {
                margin-right: 5px;
                font-size: 22px;
                color: #ccc;
              }
            }

            > .please-wait {
              margin-left: 30px;
              font-size: 22px;
              line-height: 113px;
              color: $mainColor;
            }
          }
        }
      }
    }
  }
</style>
