<template>
  <div
    id="app"
    class="body-container"
  >
    <NoticeHome
      v-if="needNotice"
    />
    <keep-alive>
      <HeaderCommon
        v-if="needHeader"
      />
    </keep-alive>
      <router-view />
    <keep-alive>
      <FooterCommon
        v-if="needFooter"
      />
    </keep-alive>
  </div>
</template>
<script>
import {getStore} from './utils'
import {
  mapState,
  createNamespacedHelpers
} from 'vuex'
import NoticeHome from './components/Home/NoticeHome'
import HeaderCommon from './components/Common/HeaderCommonForPC'
import HeaderCommonForMobile from './components/Common/HeaderForMobile'
import FooterCommon from './components/Common/FooterCommon'
const { mapMutations } = createNamespacedHelpers('common')

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
      needHeader: false,
      needFooter: false,
      needNotice: false
    }
  },
  async created () {
    require('../static/css/common.css')
    require('../static/css/list/Common/HeaderCommon/HeaderCommon.css')
    require('../static/css/theme/night/Common/HeaderCommonNight.css')
    require('../static/css/theme/day/Common/HeaderCommonDay.css')
    // 取主题
    const theme = getStore('theme') || 'night'
    this.CHANGE_THEME(theme)
    this.setBodyClassName(true, theme)
    // 取折算货币
    const convertCurrency = getStore('convertCurrency')
    this.CHANGE_CONVERT_CURRENCY(convertCurrency)
  },
  mounted () {
  },
  activited () {},
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
      userInfo: state => state.user.loginStep1Info
    })
  },
  watch: {
    '$route' (to, from) {
      console.log(to.path)
      let path = to.path
      this.needNotice = path === '/home' || path === '/' ? 1 : 0
      this.needHeader = (
        path !== '/login' &&
        path !== '/register' &&
        path !== '/downloadApp' &&
        path !== '/InvitationRegister'
      ) ? 1 : 0
      this.needFooter = (
        path === '/login' ||
        path === '/register' ||
        path === '/downloadApp' ||
        path === '/InvitationRegister'
      ) ? 0 : 1
      // let isLoginOrRigister = path === '/login' || path === '/register'
      // document.querySelector('meta[name="viewport"]').setAttribute('content', `width=device-width, initial-scale=0.3, minimum-scale=${isLoginOrRigister ? '0.3' : '0.1'}, maximum-scale=${isLoginOrRigister ? '0.3' : '1'}, user-scalable=${isLoginOrRigister ? 'no' : 'yes'}`)
      switch (path) {
        case '/register':
          this.setBodyClassName(true, 'register')
          break
      }
    },
    needFooter (newVal) {
      console.log(newVal)
    },
    userInfo (newVal) {
    },
    isMobile (newVal) {
      this.setBodyClassName(newVal, 'mobile')
    },
    needNotice (newVal) {
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
    font-family: MicrosoftYaHei,"Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 14px;
    height:100%;
  }
</style>
