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
import {getNavigationsAJAX} from './utils/api/common'
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
    await this.getNavigations()
    // 取主题
    const theme = getStore('theme') || 'night'
    this.CHANGE_THEME(theme)
    this.setBodyClassName(true, theme)
    // 取折算货币
    const convertCurrency = getStore('convertCurrency')
    this.CHANGE_CONVERT_CURRENCY(convertCurrency)
  },
  // mounted () {},
  // activated () {},
  updated () {
    console.log('updated')
  },
  methods: {
    ...mapMutations([
      'CHANGE_THEME',
      'CHANGE_CONVERT_CURRENCY',
      'CHANGE_ROUTER_PATH',
      'SET_NAVIGATOR_M'
    ]),
    setBodyClassName (type, className) {
      type ? document.body.classList.add(className) : document.body.classList.remove(className)
    },
    // 检测链接类型是否为内部类型（内部链接、外部链接）
    checkIsInnerLink (link) {
      // 外部 https://www.fubt.co www.fubt.co
      // 内部 /TradeCenter
      const isInnerLink = !link.includes('.')
      // console.log(isInnerLink)
      return isInnerLink
    },
    // 自定义导航
    async getNavigations () {
      const params = {
        language: this.$language_S_X
      }
      const data = await getNavigationsAJAX(params)
      if (!data) return
      // console.log(data)
      this.navigation = _.get(data, 'data')
      _.forEach(this.navigation, (nav, index) => {
        nav['isInnerLink'] = this.checkIsInnerLink(nav.link) ? true : false
        nav.link = nav['isInnerLink'] && !nav.link.startsWith('/') && nav.link ? `/${nav.link}` : nav.link
        nav['index'] = index
        if (nav.children.length) {
          _.forEach(nav.children, childNav => {
            childNav['isInnerLink'] = this.checkIsInnerLink(childNav.link) ? true : false
          })
        }
      })
      console.log(this.navigation)
      this.SET_NAVIGATOR_M(this.navigation)
    },
    // 切换 PC/H5 移动端适配
    toggleViewPortMeta () {
      let metaContent = {
        mobile: 'width=device-width, initial-scale=0.2, minimum-scale=0.1, maximum-scale=1, user-scalable=0',
        PC: 'width=device-width, initial-scale=0.3, minimum-scale=0.1, maximum-scale=1, user-scalable=yes'
      }
      const meta = document.querySelector('meta[name="viewport"]')
      const {path} = this.$route

      const userDisScalabledRoutes = [
        `/${this.$routes_X.login}`,
        `/${this.$routes_X.register}`,
        `/downloadApp`,
        `/invitationRegister`
      ]
      const notNeedUserScalable = _.some(userDisScalabledRoutes, (route, index) => (route == path || path.startsWith(route)))

      switch (this.isMobile && notNeedUserScalable) {
        case true:
          meta.content = metaContent.mobile
          break
        case false:
          meta.content = metaContent.PC
          break
      }
    }
  },
  // filter: {},
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
    $language_S_X () {
      this.getNavigations()
    },
    async '$route' (to, from) {
      this.toggleViewPortMeta()
      // console.log(to.path, from.path)
      let path = to.path
      if (!this.$navigators_S_X.length) {
        await this.getNavigations()
      }
      console.log(path, this.$navigators_S_X)
      _.forEach(this.$navigators_S_X, (outerRoute, outerIndex) => {
        const {link, children} = outerRoute
        // console.log(path, link)
        // 命中 路由
        if (path == link || path.startsWith(`/${link.split('/')[1]}`)) {
          // console.log(path, outerIndex)
          this.$SET_ACTIVE_LINK_NAME_M_X(outerIndex)
          return false
        }

        _.forEach(children, (childRoute) => {
          const {link} = childRoute
          if (path == link || path.startsWith(`/${link.split('/')[1]}`)) {
            this.$SET_ACTIVE_LINK_NAME_M_X(outerIndex)
            return false
          }
        })
        // if(!hitTarget) this.$SET_ACTIVE_LINK_NAME_M_X(-1)
      })
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
        path.startsWith(`/${this.$routes_X.login}`) ||
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
      console.log(newVal)
      this.toggleViewPortMeta()
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
    min-width: 1300px;
    height: 100%;
    min-height: 1000px;
    font-size: 14px;
    font-family: "MicrosoftYaHei", "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
