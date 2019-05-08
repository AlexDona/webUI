<template>
  <div
    class="download-box"
    :style="{
      height:windowHeight+'px'
    }"
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-background="rgba(0, 0, 0, 0.6)"
  >
    <HeaderCommonForMobile
      :style="{
        display:'none'
      }"
    />
    <div
      class="inner-box"
    >
      <div class="logo">
        <img
          :src="logoSrc"
        >
      </div>
      <div class="content">
        <img
          :src="isChineseLanguage ? zh_CNSrc : en_USSrc"
          v-if="isChineseLanguage"
        >
        <button
          class="download-btn"
          @click="downloadApp"
        >
          <!-- 立即安装 -->
          {{isChineseLanguage ? '立即安装' : 'Install' }}
        </button>
        <a
          :href="downloadUrl"
          ref="download"
          download="android"
          :style="{
            'display':'none'
          }"
        ></a>
      </div>
    </div>
    <WeChatMask
      :isAndroid="isAndroid"
      :isIOS="isIOS"
      :language="language"
      :isWXBrowserStatus="isWXBrowserStatus"
    />
  </div>
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
      zh_CNSrc: require('../assets/develop/download-bg-cn.png'),
      en_USSrc: require('../assets/develop/download-bg-en.png'),
      downloadUrl: '',
      isAndroid: false,
      isIOS: false,
      isWXBrowserStatus: true,
      fullscreenLoading: true
    }
  },
  async created () {
    let u = navigator.userAgent
    this.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
    this.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
    this.isWXBrowserStatus = u.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' ? 1 : 0
    await this.getAppDownLoadUrl()
    console.log(this.language)
  },
  mounted () {
  },
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapActions([
      'GET_APP_URL_ACTION'
    ]),
    ...mapMutations([
      'SET_FOOTER_INFO'
    ]),
    // 获取app下载地址
    async getAppDownLoadUrl () {
      await this.GET_APP_URL_ACTION()
      this.fullscreenLoading = false
      if (this.isAndroid) {
        window.location.href = 'scheme: //fubt.com/'
        this.downloadUrl = this.androidUrl
      } else if (this.isIOS) {
        this.downloadUrl = `itms-services://?action=download-manifest&;amp;url=${this.iosUrl}`
      }
    },
    downloadApp () {
      this.$refs['download'].click()
    }
  },
  filter: {},
  computed: {
    ...mapState({
      logoSrc: state => state.common.logoSrc,
      androidUrl: state => state.footerInfo.downloadUrl.android,
      iosUrl: state => state.footerInfo.downloadUrl.ios
    }),
    windowHeight () {
      return window.innerHeight
    },
    isChineseLanguage () {
      return this.language === 'zh_CN' ||
        this.language === 'zh_TW'
    },
    language () {
      return (navigator.browserLanguage || navigator.language).startsWith('zh') ? 'zh_CN' : 'en_US'
    }
    // isWXBrowserStatus () {
    //   return isWXBrowser()
    // }
  },
  watch: {
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  .download-box {
    width: 100%;

    > .inner-box {
      border: 1px solid transparent;

      > .logo {
        width: 6rem;
        margin: 4rem auto 2rem;
        border-radius: 10px;

        > img {
          -webkit-box-reflect: below 0 -webkit-gradient(linear, left top, left bottom, from(transparent), to(rgba(250, 250, 250, .1)));
          width: 100%;
        }
      }

      > .content {
        width: 100%;
        text-align: center;

        > img {
          display: block;
          width: 60%;
          margin: 0 auto;
        }

        > .download-btn {
          width: 10rem;
          height: 2rem;
          margin: 200px auto;
          border-radius: 40px;
          font-size: .8rem;
          line-height: 2rem;
          color: #fff;
          background: rgba(70, 150, 245, 1);
        }
      }
    }
  }
</style>
