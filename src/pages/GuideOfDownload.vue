<template>
  <div
    class="download-box"
    :style="{
      height: windowHeight+'px'
    }"
  >
    <div class="inner-box">
      <div class="title">
        <h3>全平台终端接入</h3>
        <p>iOS、Android、Mac、Windows 多个平台支持全业务功能</p>
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
            >扫码下载ios、Android版</p>
            <p>随时关注 快速交易</p>
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
                Mac 版本下载
              </button>
              <button>
                <IconFont
                  icon-name="icon-windows"
                  class-name="icon"
                />
                WIN 版本下载
              </button>
            </div>
          <div
              class="r-right"
              v-show="!isOpen"
            >
              <p
                class="please-wait"
              >暂未开放，敬请期待</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
import {domain} from '../utils/env'
import IconFont from '../components/Common/IconFontCommon'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
// import {returnAjaxMessage} from '../../utils/commonFunc'
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
      erCodeString: `${domain}/downloadApp`,
      isOpen: true
    }
  },
  created () {},
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
    ...mapState([
    ]),
    windowHeight () {
      return window.innerHeight
    }
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../static/css/scss/index';
  .download-box{
    margin-top:66px;
    width:100%;
    height:100%;
    background: url(../assets/develop/download-bg.png) no-repeat center center ;
    background-size: 100% 100%;
    >.inner-box{
      height:100%;
      overflow: hidden;
      >.title{
        margin:135px auto;
        text-align: center;
        >h3{
          font-size:40px;
          font-family:MicrosoftYaHei-Bold;
          font-weight:bold;
          color:#fff;
          line-height:44px;
        }
        >p{
          font-size:18px;
          font-family:MicrosoftYaHei;
          font-weight:400;
          color:#fff;
          line-height:44px;
        }
      }
      >.download-item{
        width:813px;
        margin:0 auto;
        display:flex;
        height:113px;
        >.left{
          flex:1;
          display: flex;
          >.l-left{
            .icon-cellphoneiphone{
              font-size: 120px;
              color:#fff;
            }
          }
          >.l-right{
            position: relative;
            text-align: center;
            line-height: 40px;
            color:$mainColor;
            >.ercode-box{
              /*transition: all .5s;*/
              position: absolute;
              top:-160px;
              left:50%;
              transform: translate(-50%,0);
              width:170px;
              height:170px;
              border-radius: 10px;
              >.ercode{
                margin-top:5px;
                width:160px;
                height:160px;
              }
            }
            >.scan-btn{
              margin-top:20px;
              width:220px;
              height:50px;
              line-height:50px;
              background:linear-gradient(90deg,rgba(43,78,129,1) 0%,rgba(43,60,112,1) 100%);
              border-radius:25px;
              text-align: center;
              color:#fff;
            }
          }
        }
        >.right{
          flex:1;
          display: flex;
          >.r-left{
            >.icon-diannao{
              color:#fff;
              font-size: 120px;
            }
          }
          >.r-right{
            transition: all .5s;
            >button{
              display: block;
              color:$mainColor;
              font-size: 18px;
              margin:20px 0 0 20px;
              >.icon{
                color:#ccc;
                margin-right:5px;
                font-size: 28px;
              }
            }
            >.please-wait{
              color:$mainColor;
              line-height: 113px;
              font-size: 28px;
              margin-left:30px;
            }
          }
        }
      }
    }
  }
</style>
