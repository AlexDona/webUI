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
                class="ercode-box"
                v-show="erCodeVisible"
              >
                <VueQrcode
                  class="ercode"
                  :value="erCodeString"
                />
              </div>
            </transition>
            <p
              class="scan-btn"
              @mouseover="toggleErCode(1)"
              @mouseleave="toggleErCode(0)"
            >
              <!-- 扫码下载ios、Android版 -->
              <span v-if="isNeedIOS">{{$t('M.about_footer_info_down3')}}</span>
              <span v-else>{{$t('M.about_footer_info_down3_withoutIOS')}}</span>
            </p>
            <!-- <p>随时关注 快速交易</p> -->
            <p>{{$t('M.about_footer_info_down4')}}</p>
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
<!--请严格按照如下书写书序-->
<script>
import {mapState, mapGetters} from 'vuex'
import {domain} from '../utils/env'
import IconFont from '../components/Common/IconFontCommon'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
// import {returnAjaxMsg} from '../../utils/commonFunc'
export default {
  components: {
    IconFont,
    // 二维码组件
    VueQrcode: resolve => {
      require([('@xkeshi/vue-qrcode')], resolve)
    }
  },
  // props,
  data () {
    return {
      erCodeVisible: false,
      erCodeString: `${domain}/downloadApp?language=${this.language}`,
      isOpen: true
    }
  },
  created () {
    console.log(this.isNeedIOS)
  },
  mounted () {},
  activited () {},
  updated () {},
  beforeRouteUpdate () {},
  methods: {
    toggleIsOpen (data) {
      this.isOpen = data
    },
    toggleErCode (data) {
      this.erCodeVisible = data
    }
  },
  filter: {},
  computed: {
    ...mapGetters('common', {
      isNeedIOS: 'isNeedIOS'
    }),
    ...mapState({
      language: state => state.common.language
    }),
    windowHeight () {
      return window.innerHeight
    }
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../static/css/scss/index';

  .download-box {
    width: 100%;
    height: 100%;
    margin-top: 66px;
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

            > .ercode-box {
              /* transition: all .5s; */
              position: absolute;
              top: -160px;
              left: 50%;
              width: 170px;
              height: 170px;
              padding: 5px;
              background-color: #fff;
              transform: translate(-50%, 0);

              > .ercode {
                /* width:160px; */

                /* height:160px; */
                width: 100%;
                height: 100%;
                background-color: #fff;
              }
            }

            > .scan-btn {
              width: 220px;
              height: 50px;
              margin-top: 20px;
              border-radius: 25px;
              line-height: 50px;
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
