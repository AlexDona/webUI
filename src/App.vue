<template>
  <div
    id="app"
    class="body-container"
    v-loading.fullscreen.lock="$loading_S_X"
    element-loading-background="rgba(0, 0, 0, 0.8)"
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
      'CHANGE_CONVERT_CURRENCY',
      'CHANGE_ROUTER_PATH'
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
      routerTo: state => state.common.routerTo
    })
  },
  watch: {
    '$route' (to, from) {
      // console.log(to.path, from.path)
      let path = to.path
      if (from.path === '/PersonalCenter') {
        this.$setStore('active-target', 'assets')
      }
      this.isNeedNotice = path === `/${this.$routes_X.home}` || path === '/' ? 1 : 0
      this.isNeedHeader = (
        path !== `/${this.$routes_X.login}` &&
        !path.startsWith('/register') &&
        path !== '/downloadApp' &&
        !path.startsWith('/invitationRegister')
      ) ? 1 : 0
      this.isNeedFooter = (
        path === `/${this.$routes_X.login}` ||
        path.startsWith('/register') ||
        path === '/downloadApp' ||
        path.startsWith('/invitationRegister') ||
        path === '/ForgetPassword'
      ) ? 0 : 1
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
    },
    routerTo (New) {
      console.log(New)
    }
  }
}
</script>

<style>
  @import '../static/css/font-family/font.css';

  .body-container {
    min-width: 1366px;
    height: 100%;
    min-height: 1000px;
    font-size: 14px;
    font-family: "MicrosoftYaHei", "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
