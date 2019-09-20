/**
 * author: renfuwei
 * create: 20190920
 * description: h5下载APP mixins
 */
import {
  mapState,
  mapActions,
  mapMutations
} from 'vuex'

let mixin = {
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
    // 禁止双击
    let lastTouchEnd = 0
    document.documentElement.addEventListener('touchend', function (event) {
      let now = Date.now()
      if (now - lastTouchEnd <= 300) {
        event.preventDefault()
      }
      lastTouchEnd = now
    }, false)
  },
  beforeDestroy () {
    clearTimeout(this.timer)
    clearTimeout(this.downloadTimer)
  },
  methods: {
    ...mapActions(['GET_APP_URL_ACTION']),
    ...mapMutations(['SET_FOOTER_INFO']),
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
        if (!this.androidDownloadSwitch) {
          this.$error_tips_X(this.isChineseLanguage ? 'Android 暂未开放，敬请期待' : 'IOS is coming soon')
          return false
        }
        if (!this.androidUrl) {
          this.$error_tips_X(this.isChineseLanguage ? '获取下载链接失败，请稍后再试！' : 'Android is coming soon')
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
        if (!this.iosDownloadSwitch) {
          this.$error_tips_X(this.isChineseLanguage ? 'IOS 暂未开放，敬请期待' : 'IOS is coming soon')
          return false
        }
        // 获取下载链接失败，请稍后再试！
        if (!this.iosUrl) {
          this.$error_tips_X(this.isChineseLanguage ? '获取下载链接失败，请稍后再试！' : 'Failed to get the download link, please try again later!')
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
  computed: {
    ...mapState({
      logoSrc: state => state.common.logoSrc,
      androidUrl: state => state.footerInfo.downloadUrl.android,
      iosUrl: state => state.footerInfo.downloadUrl.ios,
      androidDownloadSwitch: state => state.footerInfo.downloadUrl.androidDownloadSwitch,
      iosDownloadSwitch: state => state.footerInfo.downloadUrl.iosDownloadSwitch
    }),
    isBaiDuBrowser () {
      let u = navigator.userAgent
      return u.toLowerCase().indexOf('baidu') > -1
    },
    isWeiBoBrowser () {
      let u = navigator.userAgent.toLowerCase()
      return u.match(/WeiBo/i) == 'weibo'
    },
    isSouGouBrowser () {
      let u = navigator.userAgent.toLowerCase()
      return u.indexOf('sogou') > -1
    },
    isIPad () {
      let u = navigator.userAgent.toLowerCase()
      return u.indexOf('iPad'.toLowerCase()) > -1
    },
    isChineseLanguage () {
      return this.language === 'zh_CN' ||
        this.language === 'zh_TW'
    },
    language () {
      return (navigator.browserLanguage || navigator.language).startsWith('zh') ? 'zh_CN' : 'en_US'
    }
  },
  destroyed () {},
  watch: {}
}
export default mixin
