<template>
  <div
    class="download-box"
    :style="{
      height: windowHeight+'px'
    }"
  >
    <div class="inner-box">
      <div class="title">
        <!-- <h3>全平台终端接入</h3> -->
        <h3>{{$t('M.about_footer_info_down1')}}</h3>
        <!-- <p>iOS、Android、Mac、Windows 多个平台支持全业务功能</p> -->
        <p>{{$t('M.about_footer_info_down2')}}</p>
      </div>
      <div class="download-item">
        <!--移动端-->
        <div class="left">
          <div class="l-left">
            <IconFont
              icon-name="icon-cellphoneiphone"
              class-name="icon-cellphoneiphone"
            />
          </div>
          <div class="l-right">
            <transition
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
            >
              <div
                class="qrcode-box"
                v-show="qrcodeVisible"
              >
                <Qrcode
                  class="qrcode"
                  :value="qrcodeString"
                  :logoSrc="logoSrc"
                />
              </div>
            </transition>
            <p
              @mouseover="toggleQrcode(1)"
              @mouseleave="toggleQrcode(0)"
            >
              <span
                class="scan-btn cursor-pointer"
                @click="downloadApp('android')"
              >Android</span>
              <span
                class="scan-btn cursor-pointer"
                @click="downloadApp('ios')"
              >iPhone</span>
              <!-- 扫码下载ios、Android版 -->
              <!--<span v-if="isNeedIOS">{{$t('M.about_footer_info_down3')}}</span>-->
              <!--<span v-else>{{// $t('M.about_footer_info_down3_withoutIOS')}}</span>-->
            </p>
            <a
              :href="downloadUrl"
              ref="download-link"
              download="android"
              :style="{
                display:'none'
              }"
            ></a>
            <!-- 下载app -->
          </div>
        </div>
        <!--pc端-->

        <div
          class="right"
          @mouseenter="toggleIsOpen(0)"
          @mouseleave="toggleIsOpen(1)"
        >
          <div class="r-left">
            <IconFont
              icon-name="icon-computer_icon"
              class-name="icon-diannao"
            />
          </div>
          <div class="r-right"
               v-show="isOpen"
          >
            <button>
              <IconFont
                icon-name="icon-pingguo"
                class-name="icon"
              />
              <!-- Mac 版本下载 -->
              {{$t('M.about_footer_info_down5')}}
            </button>
            <button>
              <IconFont
                icon-name="icon-windows"
                class-name="icon"
              />
              <!-- WIN 版本下载 -->
              {{$t('M.about_footer_info_down6')}}
            </button>
          </div>
          <div
            class="r-right"
            v-show="!isOpen"
          >
            <p
              class="please-wait"
            >
              <!-- 暂未开放，敬请期待 -->
              {{$t('M.about_footer_info_down7')}}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
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
      downloadUrl: ''
      // 二维码logo
      // logoSrc: ''
    }
  },
  async created () {
    this.$SET_ACTIVE_LINK_NAME_M_X(-1)
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
        window.location.href = type == 'android' ? this.androidUrl : this.iosIpaUrl
      }
    },
    toggleIsOpen (data) {
      this.isOpen = data
    },
    toggleQrcode (data) {
      this.qrcodeVisible = data
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
      logoSrc: state => state.common.footerInfo.footerInfo1.downLoadAppQrCodeLogo
    }),
    windowHeight () {
      return window.innerHeight
    }
  },
  watch: {
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../assets/CSS/index';

  .download-box {
    width: 100%;
    height: 100%;
    margin-top: 50px;
    background: url(../assets/develop/download-bg.png) no-repeat center center;
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
              background-color: #fff;
              transform: translate(-50%, 0);

              > .qrcode {
                width: 100% !important;
                height: 100% !important;
                background-color: #fff;
              }
            }

            .scan-btn {
              display: block;
              width: 220px;
              height: 40px;
              margin-bottom: 20px;
              border-radius: 25px;
              line-height: 40px;
              text-align: center;
              color: #fff;
              background: linear-gradient(90deg, rgba(43, 78, 129, 1) 0%, rgba(43, 60, 112, 1) 100%);
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
