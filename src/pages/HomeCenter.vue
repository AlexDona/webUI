<!--
  author: zhaoxinlei
  update: 20190825
  description: 当前页面为 PC 首页内容
-->
<template lang="pug">
  .home-box.home(:class="{mobile: isMobile}")
    BannerHome
    MarketListHome.margin-1
</template>
<script>
import NoticeHome from '../components/Home/NoticeHome'
import BannerHome from '../components/Home/BannerHome'
import MarketListHome from '../components/Home/MarketListHome'
import {
  mapState,
  mapGetters
} from 'vuex'
import {getdynamicCsConfigAJAX} from '../utils/api/common'
export default {
  components: {
    NoticeHome,
    BannerHome,
    MarketListHome
  },
  data () {
    return {
      msgLanguage: 'en-us',
      onlineText: this.$t('M.common_onlineText')
    }
  },
  created () {
    this.$SET_ACTIVE_LINK_NAME_M_X(-1)
    // this.doAdd()
  },
  methods: {
    doAdd: _.debounce(async function () {
      const data = await getdynamicCsConfigAJAX()
      if (!data) return
      const {code, link, webStatus} = _.get(data, 'data')
      if (!webStatus || !code || !link) return

      this.addServiceForCustomer(window, document, 'script', 'https://assets-cli.udesk.cn/im_client/js/udeskApi.js', 'ud')
      ud({
        // 标识
        code,
        // IM链接地址
        link,
        'isInvite': false,
        'mode': 'inner',
        'color': '#338ff5',
        'pos_flag': 'crm',
        'language': this.msgLanguage,
        'css': {
          'width': '50px',
          'height': '50px',
          'border-radius': '50%',
          'text-align': 'center',
          'right': '40px',
          'padding': '6px 5px 5px'
        },
        'pop': {
          'css': {
          }
        },
        'mobile': {
          'mode': 'inner',
          'color': '#338ff5',
          'pos_flag': 'crm',
          'language': ''
        }
      })
    }, 500),
    changeLanguage (newVal) {
      switch (newVal) {
        case 'zh_CN':
          this.msgLanguage = 'zh-cn'
          break
        case 'en_US':
          this.msgLanguage = 'en-us'
          break
        case 'ja_JP':
          this.msgLanguage = 'ja'
          break
        case 'ko_KR':
          this.msgLanguage = 'ko'
          break
        case 'zh_TW':
          this.msgLanguage = 'zh-TW'
          break
        default:
          this.msgLanguage = 'en-us'
      }
      this.doAdd()
    },
    addServiceForCustomer (a, h, c, b, f, g) {
      a['UdeskApiObject'] = f
      a[f] = a[f] || function () { (a[f].d = a[f].d || []).push(arguments) }
      g = h.createElement(c)
      g.async = 1
      g.charset = 'utf-8'
      g.src = b
      c = h.getElementsByTagName(c)[0]
      c.parentNode.insertBefore(g, c)
    }
  },
  computed: {
    ...mapGetters({
      '$isNeedYST_G_X': 'isNeedYST'
    }),
    ...mapState({
      language: state => state.common.language,
      defaultLanguage: state => state.common.defaultLanguage,
      isMobile: state => state.user.isMobile
    })
  },
  watch: {
    language (newVal) {
      this.changeLanguage(newVal)
    },
    defaultLanguage (newVal) {
      this.changeLanguage(newVal)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  .home-box {
    min-width: 1130px;
    margin-top: -50px;
    overflow: hidden;

    &.mobile {
      margin-top: 0;
    }

    .margin-1 {
      margin-top: -1px;
    }

    > .fixed {
      position: fixed;
      z-index: 2009;
    }
  }
</style>
