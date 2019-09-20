<!--
  author: zhaoxinlei
  update: 20190817
  description: 当前页面为邀请注册页面
-->
<template lang="pug">
  .invitation-register-box(
    @ondblclick="ondblclick"
    @touchmove="touchmove"
  )
    HeaderCommonForMobile(:style="{display: 'none'}")
    .logo
      img(:src="logoSrc")
    .inner-box
      // 您的好友
      p {{isChineseLanguage? '您的好友': 'Your friend'}}{{phoneNumberFormat(inviter)}}
      // 邀请您注册
      p.strong {{isChineseLanguage ? '邀请您注册' : 'Invites you to sign up'}}
        span.active(v-if="configInfo") {{configInfo.otcAd}}
      .bg
        img(src="../assets/develop/register-big-url.png")
      //  立即注册领取
      router-link.register-btn(:to="`/${$routes_X.register}/m/${showId}`") {{isChineseLanguage ? '立即注册': 'Sign up now'}}
    WeChatMask(
      :isAndroid="isAndroid"
      :isIOS="isIOS"
      :isWXBrowserStatus="isWXBrowserStatus"
      :isChineseLanguage="isChineseLanguage"
    )
    .bottom-download
      .text.text-align-l
        span {{isChineseLanguage? '更安全、更便捷、更稳定': 'Safer, more convenient and stable'}}
      .immediately.text-align-r
        button.border-radius4(
          :disabled="isLoading"
          @click="downloadApp"
          @ondblclick="ondblclick"
        ) {{isChineseLanguage? '立即下载': 'Download now'}}

</template>
<script>
import mixins from '../mixins/downAPP'
import {
  isWXBrowser,
  getNestedData
} from '../utils/commonFunc'
import {
  findUserInfoByShowId
} from '../utils/api/home'
import {
  phoneNumberFormat
} from '../utils'
import HeaderCommonForMobile from '../components/Common/HeaderForMobile'
import WeChatMask from '../components/User/WeChatMask'
import {
  /* mapMutations, */
  mapState
} from 'vuex'
export default {
  mixins: [mixins],
  components: {
    HeaderCommonForMobile,
    WeChatMask
  },
  props: ['showId'],
  data () {
    return {
      inviter: '',
      queryLanguage: '' // 参数语言
      /* isAndroid: false,
      isIOS: false */
    }
  },
  async created () {
    /* let u = navigator.userAgent
    this.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
    this.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端 */
    console.log('created')
    this.findUserInfoByShowId()
  },
  mounted () {
    // 禁止横屏
    /* window.addEventListener('orientationchange', function (e) {
      this.orient()
      e.preventDefault()
      return false
    }, false) */
    // 禁止拖动
    /* document.ondragstart = document.onselectstart = function () {
      return false
    } */
    // 禁止滑动
    /* document.addEventListener('touchmove', function (event) {
      event.preventDefault()
    }) */
    // 禁止双击
    /* let lastTouchEnd = 0
    document.documentElement.addEventListener('touchend', function (event) {
      var now = Date.now()
      if (now - lastTouchEnd <= 300) {
        event.preventDefault()
      }
      lastTouchEnd = now
    }, false) */
  },
  // update () {},
  // destroyed () {},
  methods: {
    /* ...mapMutations(['SET_FOOTER_INFO']), */
    // 横屏
    /* orient () {
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
    }, */
    phoneNumberFormat (target) {
      return phoneNumberFormat(target)
    },
    async findUserInfoByShowId () {
      const params = {
        showId: this.showId
      }
      const data = await findUserInfoByShowId(params)
      if (!data) return false
      this.inviter = getNestedData(data, 'data.userName')
    }
  },
  // filter: {},
  computed: {
    ...mapState({
      isMobile: state => state.user.isMobile,
      /* logoSrc: state => state.common.logoSrc, */
      configInfo: state => state.common.footerInfo.configInfo
      // language: state => state.common.language,
    }),
    /* isChineseLanguage () {
      return this.language === 'zh_CN' ||
        this.language === 'zh_TW'
    },
    language () {
      return (navigator.browserLanguage || navigator.language).startsWith('zh') ? 'zh_CN' : 'en_US'
    }, */
    isWXBrowserStatus () {
      return isWXBrowser()
    }
  }
  // watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  .invitation-register-box {
    position: fixed;
    top: 0;
    left: 50%;
    width: 100%;
    height: 100%;
    padding: .3rem;
    overflow: hidden;
    background: #272b41;
    transform: translateX(-50%);

    > .logo {
      box-sizing: border-box;
      width: 2rem;
      padding: 0 20px;

      > img {
        display: inline-block;
        width: 3rem;
      }
    }

    > .inner-box {
      padding: 1rem;
      margin: 0 auto;
      font-size: .5rem;
      text-align: center;
      color: #fff;

      .strong {
        font-weight: 700;
        font-size: .8rem;
        line-height: 2.4rem;
        white-space: nowrap;

        > .active {
          border-bottom: 1px solid #2debf7;
          line-height: 1rem;
          color: #2debf7;
        }
      }

      > .bg {
        > img {
          width: 60%;
          margin: 1rem auto;
        }
      }

      > .register-btn {
        /* width: 6.77rem; */
        height: 1.06rem;
        padding: .5rem 1rem;
        border-radius: .06rem;
        font-size: .8rem;
        color: #fff;
        background: linear-gradient(81deg, rgba(42, 59, 97, 1), rgba(18, 71, 133, 1));
        box-shadow: 0 3px 8px 0 rgba(0, 0, 0, .25);
      }
    }

    > .bottom-download {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 2.2rem;
      background: url("../assets/develop/register-bottom-bgm.png") no-repeat center;
      background-size: 100%;
      display: flex;
      align-items: center;

      > .text {
        width: 75%;
        color: #ececff;
        font-size: 0.6rem;
        padding-left: 3rem;
      }

      > .immediately {
        width: 25%;
        padding-right: 0.25rem;

        button {
          height: 1rem;
          font-size: 0.5rem;
          background-color: #c9daff;
          color: #120961;
          padding: 0 0.24rem;
        }
      }
    }
  }
</style>
