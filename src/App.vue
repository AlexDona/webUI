<!--
  author: zhaoxinlei
  update: 20190823
-->
<template lang="pug">
  #app.body-container(
    :class="{'is-mobile': isMobile}"
    v-loading.fullscreen.lock="$loading_S_X"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  )
    ThePRETips
    NoticeHome( v-if="isNeedNotice")
    HeaderCommon(v-if="isNeedHeader")
    .inner-box
      router-view
    FooterCommon(v-if="isNeedFooter")
</template>
<script>
import NoticeHome from './components/Home/NoticeHome'
import HeaderCommon from './components/Common/HeaderCommonForPC'
import HeaderCommonForMobile from './components/Common/HeaderForMobile'
import ThePRETips from './components/Home/ThePRETips'

import FooterCommon from './components/Common/Footer/FooterCommon'
import {
  mapMutations,
  mapState
} from 'vuex'
import {getNavigationsAJAX} from './utils/api/common'
import {getStore} from './utils'
// import {encrypt} from './utils/encrypt'
export default {
  name: 'App',
  components: {
    HeaderCommon,
    NoticeHome,
    FooterCommon,
    HeaderCommonForMobile,
    ThePRETips
  },
  data () {
    return {
      isNeedHeader: false,
      isNeedFooter: false,
      isNeedNotice: false
    }
  },
  async created () {
    // 取主题
    const theme = getStore('theme') || 'night'
    this.CHANGE_THEME(theme)
    this.setBodyClassName(true, theme)
    // 取折算货币
    const convertCurrency = getStore('convertCurrency')
    this.CHANGE_CONVERT_CURRENCY(convertCurrency)
  },
  // mounted () {},
  // updated () {},
  methods: {
    ...mapMutations([
      'CHANGE_THEME',
      'CHANGE_CONVERT_CURRENCY',
      'CHANGE_ROUTER_PATH',
      'SET_NAVIGATOR_M',
      'UPDATE_INNER_NAVIGATORS_M',
      'UPDATE_ACTIVE_LINK_M'
    ]),
    setBodyClassName (type, className) {
      type ? document.body.classList.add(className) : document.body.classList.remove(className)
    },
    // 检测链接类型是否为内部类型（内部链接、外部链接）
    checkIsInnerLink (link) {
      // 外部 https://www.fubt.co www.fubt.co
      // 内部 /TradeCenter
      const isInnerLink = !link.includes('.')
      return isInnerLink
    },
    // 自定义导航
    async getNavigations () {
      const params = {
        language: this.$language_S_X
      }
      const data = await getNavigationsAJAX(params)
      if (!data) return
      this.navigation = _.get(data, 'data')
      let innerNavigations = []
      // 导航自定义处理
      _.forEach(this.navigation, (nav, index) => {
        const {link} = nav
        nav['isInnerLink'] = this.checkIsInnerLink(link) ? true : false
        nav['isInnerLink'] ? innerNavigations.push(nav) : null
        nav.link = nav['isInnerLink'] && !link.startsWith('/') && link ? `/${link}` : link
        nav['index'] = `${index}/${0}`
        if (nav.children.length) {
          _.forEach(nav.children, (childNav, childIndex) => {
            childNav['isInnerLink'] = this.checkIsInnerLink(childNav.link) ? true : false
            childNav['isInnerLink'] ? innerNavigations.push(childNav) : null
            childNav.link = childNav['isInnerLink'] && !childNav.link.startsWith('/') && childNav.link ? `/${childNav.link}` : childNav.link
            childNav['index'] = `${index}/${childIndex}`
          })
        }
      })
      this.UPDATE_INNER_NAVIGATORS_M(innerNavigations)
      this.SET_NAVIGATOR_M(this.navigation)
    },
    // 切换 PC/H5 移动端适配
    toggleViewPortMeta () {
      let metaContent = {
        mobile: 'width=device-width, initial-scale=0.3, minimum-scale=0.1, maximum-scale=1, user-scalable=no',
        PC: 'width=device-width, initial-scale=0.3, minimum-scale=0.1, maximum-scale=1, user-scalable=yes'
      }
      const meta = document.querySelector('meta[name="viewport"]')
      const {path} = this.$route

      const userDisScalabledRoutes = [
        `${this.$routes_X.downloadApp}`,
        `/${this.$routes_X.register}/${this.$routes_X.invite}`
      ]
      const notNeedUserScalable = _.some(userDisScalabledRoutes, route => (route.toLowerCase() === path.toLowerCase() || path.startsWith(route)))

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
      isMobile: state => state.user.isMobile,
      innerNavigators_S: state => state.common.innerNavigators_S
    })
  },
  watch: {
    $language_S_X () {
      this.getNavigations()
    },
    async '$route' (to, from) {
      this.toggleViewPortMeta()
      let path = to.path
      if (!this.$navigators_S_X.length) {
        await this.getNavigations()
      }
      // 检测是否命中路由
      let activeIndex = -1
      _.forEach(this.innerNavigators_S, innerNav => {
        const {link} = innerNav
        const links = link.split('/')
        _.forEach(links, (linkItem, linkIndex) => {
          if (linkItem && path.toLowerCase().indexOf(linkItem.toLowerCase()) != -1) {
            activeIndex = linkIndex
            this.UPDATE_ACTIVE_LINK_M(innerNav)
            return false
          }
        })

        if (activeIndex == -1) this.UPDATE_ACTIVE_LINK_M({index: '-1/-1'})
      })

      if (from.path === '/PersonalCenter') {
        this.$setStore('active-target', 'assets')
      }
      this.isNeedNotice = path === `/${this.$routes_X.home}` || path === '/' ? 1 : 0
      this.isNeedHeader = (
        !path.startsWith(`/${this.$routes_X.login}`) &&
        path.toLowerCase() !== `${this.$routes_X.downloadApp}`.toLowerCase() &&
        !path.startsWith(`/${this.$routes_X.register}/m`) &&
        !path.startsWith(`/${this.$routes_X.register}/${this.$routes_X.invite}`) &&
        !path.startsWith(`/${this.$routes_X.registerSuccess}/m`) &&
        !path.startsWith(`/${this.$routes_X.forgetPass}/m`)
      ) ? 1 : 0
      this.isNeedFooter = (
        path.startsWith(`/${this.$routes_X.login}`) ||
        path.toLowerCase() === `${this.$routes_X.downloadApp}`.toLowerCase() ||
        path.startsWith('/invitationRegister') ||
        path.startsWith(`/${this.$routes_X.forgetPass}`) ||
        path.startsWith(`/${this.$routes_X.register}/m`) ||
        path.startsWith(`/${this.$routes_X.register}/${this.$routes_X.invite}`) ||
        path.startsWith(`/${this.$routes_X.registerSuccess}/m`)
      ) ? 0 : 1
      switch (path) {
        case '/register':
          this.setBodyClassName(true, 'register')
          break
      }
    },
    isMobile (newVal) {
      this.setBodyClassName(newVal, 'mobile')
      this.toggleViewPortMeta()
    },
    isNeedNotice (newVal) {
      if (document.querySelector('#udesk_container')) {
        if (newVal) {
          document.querySelector('#udesk_container').style.display = 'block'
        } else {
          document.querySelector('#udesk_container').style.display = 'none'
        }
      }
    }
  }
}
</script>

<style lang="scss">
  @import '../static/css/font-family/font.css';

  .body-container {
    min-width: 1300px;
    height: 100%;
    min-height: 1000px;
    font-size: 14px;
    font-family: "MicrosoftYaHei", "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    &.is-mobile {
      min-height: 2000px;

      > .inner-box {
        /* margin-top: 0; */
      }
    }

    > .inner-box {
      margin-top: 50px;
    }
  }
</style>
