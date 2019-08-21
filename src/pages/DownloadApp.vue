<!--
  author: zhaoxinlei
  update: 20190815
  description: app下载页
-->
<template lang="pug">
  .download-box(
    @ondblclick="ondblclick"
    @touchmove="touchmove"
    )
    HeaderCommonForMobile(:style="{display:'none'}")
    .inner-box
      .logo
        img(:src="logoSrc")
      .content
        // 立即安装
      button.download-btn(
        :disabled="isLoading"
        @click="downloadApp"
        @ondblclick="ondblclick"
      ) {{isChineseLanguage ? '立即安装' : 'Install' }}
      a(
        :href="downloadUrl"
        ref="download"
        download="android"
        :style="{'display':'none'}"
        )
    WeChatMask(
      :isAndroid="isAndroid"
      :isIOS="isIOS"
      :language="language"
      :isWXBrowserStatus="isWXBrowserStatus"
    )
</template>
<!--请严格按照如下书写书序-->
<script>
// import {downloadFileWithUserDefined} from '../utils'
import HeaderCommonForMobile from '../components/Common/HeaderForMobile'
import WeChatMask from '../components/User/WeChatMask'
import {
  mapMutations,
  mapState,
  mapActions
} from 'vuex'

export default {
  components: {
    HeaderCommonForMobile,
    WeChatMask
  },
  // props,
  data () {
    return {
      downloadUrl: '',
      isAndroid: false,
      isIOS: false,
      isWXBrowserStatus: true,
      isLoading: false,
      timer: null,
      // 下载延时器
      downloadTimer: null
    }
  },
  async created () {
    document.getElementsByTagName('body')[0].style.zoom = 1
    let u = navigator.userAgent
    this.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
    this.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端\

    this.isWXBrowserStatus = this.isQQAppBrowser() || this.isWXBrowser()
  },
  mounted: function () {
    // 禁止横屏
    window.addEventListener('orientationchange', function (e) {
      this.orient()
      e.preventDefault()
      return false
    }, false)
    // 禁止拖动
    document.ondragstart = document.onselectstart = function () {
      return false
    }
    // 禁止滑动
    document.addEventListener('touchmove', function (event) {
      event.preventDefault()
    })
    var lastTouchEnd = 0
    document.documentElement.addEventListener('touchend', function (event) {
      var now = Date.now()
      if (now - lastTouchEnd <= 300) {
        event.preventDefault()
      }
      lastTouchEnd = now
    }, false)
  },
  // activated () {},
  // update () {},
  beforeDestroy () {
    clearTimeout(this.timer)
    clearTimeout(this.downloadTimer)
  },
  // beforeRouteUpdate () {},
  methods: {
    ...mapActions(['GET_APP_URL_ACTION']),
    ...mapMutations(['SET_FOOTER_INFO']),
    isBaiDuBrowser () {
      let u = navigator.userAgent
      return u.toLowerCase().indexOf('baidu') > -1
    },
    isQQAppBrowser () {
      let u = navigator.userAgent
      let isIosQQ = (/(iPhone|iPad|iPod|iOS)/i.test(u) && /\sQQ/i.test(u))
      let isAndroidQQ = (/(Android)/i.test(u) && /MQQBrowser/i.test(u) && /\sQQ/i.test((u).split('MQQBrowser')))
      return isIosQQ || isAndroidQQ
    },
    isWXBrowser () {
      let u = navigator.userAgent
      this.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
      this.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端\
      return u.toLowerCase().match(/MicroMessenger/i) == 'micromessenger'
    },
    // 横屏
    orient () {
      if (window.orientation == 0 || window.orientation == 180) {
        orientation = 'portrait'
        return false
      } else if (window.orientation == 90 || window.orientation == -90) {
        orientation = 'landscape'
        return false
      }
    },
    touchmove (e) {
      e.preventDefault()
    },
    ondblclick (e) {
      e.preventDefault()
      return false
    },
    // 获取app下载地址
    async getAppDownLoadUrl () {
      await this.GET_APP_URL_ACTION()
      if (this.isAndroid) {
        // window.location.href = 'scheme: //fubt.com/'
        this.downloadUrl = this.androidUrl
        if (!this.androidUrl) {
          this.$error_tips_X(this.$t('M.download_app_error_tips'))
          return false
        }
        this.downloadTimer = setTimeout(() => {
          if (this.isBaiDuBrowser) {
            this.$refs['download'].click()
          } else {
            window.location.href = this.downloadUrl
          }
        }, 1000)
      } else if (this.isIOS) {
        this.downloadUrl = `itms-services://?action=download-manifest&;amp;url=${this.iosUrl}`
        // 获取下载链接失败，请稍后再试！
        if (!this.iosUrl) {
          this.$error_tips_X(this.$t('M.download_app_error_tips'))
          return false
        }
        window.location.href = this.downloadUrl
      }
      this.isLoading = false
    },
    downloadApp: _.debounce(async function () {
      this.isLoading = true
      await this.getAppDownLoadUrl()
      this.timer = setTimeout(() => {
        this.isLoading = false
      }, 2000)
    }, 500)
  },
  // filter: {},
  computed: {
    ...mapState({
      logoSrc: state => state.common.logoSrc,
      androidUrl: state => state.footerInfo.downloadUrl.android,
      iosUrl: state => state.footerInfo.downloadUrl.ios
    }),
    isChineseLanguage () {
      return this.language === 'zh_CN' ||
        this.language === 'zh_TW'
    },
    language () {
      return (navigator.browserLanguage || navigator.language).startsWith('zh') ? 'zh_CN' : 'en_US'
    }
  }
  // watch: {
  // }
}
</script>
<style scoped lang="scss" type="text/scss">
  .download-box {
    position: fixed;
    top: 0;
    left: 50%;
    box-sizing: border-box;
    width: 100%;
    min-width: 750px;
    height: 100%;
    background-color: #272940;
    transform: translateX(-50%);

    > .inner-box {
      position: relative;
      height: 100%;
      min-height: 2000px;
      border: 1px solid transparent;

      > .logo {
        position: absolute;
        top: 2rem;
        left: 50%;
        width: 6.2rem;
        border-radius: 10px;
        transform: translateX(-50%);

        > img {
          -webkit-box-reflect: below 0 -webkit-gradient(linear, left top, left bottom, from(transparent), to(rgba(250, 250, 250, .1)));
          width: 100%;
        }
      }

      > .content {
        position: fixed;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 8.5rem;
        text-align: center;
        background: url(../assets/develop/downloadapp.bg.png) no-repeat center center/contain;
        transform: translate(-50%, -50%);

        > img {
          display: none;
          width: 60%;
        }
      }

      > .download-btn {
        position: fixed;
        bottom: 3rem;
        left: 50%;
        width: 14rem;
        height: 2.2rem;
        border-radius: 4px;
        font-size: .9rem;
        color: #fff;
        background: linear-gradient(81deg, rgba(42, 59, 97, 1), rgba(18, 71, 133, 1));
        box-shadow: 0 3px 8px 0 rgba(0, 0, 0, .25);
        transform: translateX(-50%);

        &:disabled {
          color: #636777;
          background: #303757;
        }
      }
    }
  }
</style>
