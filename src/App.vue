<template>
  <div
    id="app"
    class="body-container"
    v-loading.fullscreen.lock="isAjaxReady"
    element-loading-background="rgba(0, 0, 0, 0.6)"
  >
    <NoticeHome
      v-if="isNeedNotice"
    />
    <keep-alive>
      <HeaderCommon
        v-if="isNeedHeader"
      />
    </keep-alive>
      <router-view />
    <keep-alive>
      <FooterCommon
        v-if="isNeedFooter"
      />
    </keep-alive>
  </div>
</template>
<script>
import {getStore} from './utils'
import NoticeHome from './components/Home/NoticeHome'
import HeaderCommon from './components/Common/HeaderCommonForPC'
import HeaderCommonForMobile from './components/Common/HeaderForMobile'
import FooterCommon from './components/Common/FooterCommon'
import {
  mapMutations,
  mapState
} from 'vuex'
export default {
  name: 'App',
  components: {
    HeaderCommon,
    NoticeHome,
    FooterCommon,
    HeaderCommonForMobile
  },
  data () {
    return {
      isNeedHeader: false,
      isNeedFooter: false,
      isNeedNotice: false
    }
  },
  async created () {
    // require('../static/css/common.css')
    // require('../static/css/list/Common/HeaderCommon/HeaderCommon.css')
    // require('../static/css/theme/night/Common/HeaderCommonNight.css')
    // 取主题
    const theme = getStore('theme') || 'night'
    this.CHANGE_THEME(theme)
    this.setBodyClassName(true, theme)
    // 取折算货币
    const convertCurrency = getStore('convertCurrency')
    this.CHANGE_CONVERT_CURRENCY(convertCurrency)
  },
  mounted () {},
  activated () {},
  update () {},
  methods: {
    ...mapMutations([
      'CHANGE_THEME',
      'CHANGE_CONVERT_CURRENCY'
    ]),
    setBodyClassName (type, className) {
      type ? document.body.classList.add(className) : document.body.classList.remove(className)
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      isLogin: state => state.user.isLogin,
      isMobile: state => state.user.isMobile,
      userInfo: state => state.user.loginStep1Info,
      isAjaxReady: state => state.common.isAjaxReady
    })
  },
  watch: {
    '$route' (to, from) {
      console.log(to.path)
      let path = to.path
      this.isNeedNotice = path === '/home' || path === '/' ? 1 : 0
      this.isNeedHeader = (
        path !== '/login' &&
        !path.startsWith('/register') &&
        path !== '/downloadApp' &&
        !path.startsWith('/invitationRegister')
      ) ? 1 : 0
      this.isNeedFooter = (
        path === '/login' ||
        path.startsWith('/register') ||
        path === '/downloadApp' ||
        path.startsWith('/invitationRegister') ||
        path === '/ForgetPassword'
      ) ? 0 : 1
      // let isLoginOrRigister = path === '/login' || path === '/register'
      // document.querySelector('meta[name="viewport"]').setAttribute('content', `width=device-width, initial-scale=0.3, minimum-scale=${isLoginOrRigister ? '0.3' : '0.1'}, maximum-scale=${isLoginOrRigister ? '0.3' : '1'}, user-scalable=${isLoginOrRigister ? 'no' : 'yes'}`)
      switch (path) {
        case '/register':
          this.setBodyClassName(true, 'register')
          break
      }
    },
    isMobile (newVal) {
      this.setBodyClassName(newVal, 'mobile')
    },
    isNeedNotice (newVal) {
      if (newVal) {
        $('#udesk_container').fadeIn()
      } else {
        $('#udesk_container').fadeOut()
      }
    }
  }
}
</script>

<style>

  .body-container {
    height: 100%;
    font-size: 14px;
    font-family: "MicrosoftYaHei", "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
