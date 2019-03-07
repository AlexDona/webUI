<template>
  <!--首页盒子-->
  <div class="home-box home">
    <!--banner-->
    <keep-alive>
      <BannerHome/>
    </keep-alive>
    <!--交易区-->
    <MarketListHome class="margin-1"/>
  </div>
</template>
<script>
import NoticeHome from '../components/Home/NoticeHome'
import BannerHome from '../components/Home/BannerHome'
import MarketListHome from '../components/Home/MarketListHome'
import {xDomain} from '../utils/env'
import {mapState} from 'vuex'
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
  },
  methods: {
    doAdd () {
      this.addServiceForCustomer(window, document, 'script', 'https://assets-cli.udesk.cn/im_client/js/udeskApi.js', 'ud')
      ud({
        'code': '311h1067', // 标识
        'link': 'https://fubt.udesk.cn/im_client/?web_plugin_id=59660', // IM链接地址
        'isInvite': false,
        'mode': 'inner',
        'color': '#338ff5',
        'pos_flag': 'crm',
        'language': this.msgLanguage,
        'css': {
          'width': '50px',
          'height': '50px',
          'border-radius': '50%',
          'line-height': '50px',
          'text-align': 'center',
          'right': '40px',
          'padding': '5px'
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
    },
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
      }

      if (xDomain.startsWith('fubt')) {
        this.doAdd()
      }
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
    ...mapState({
      language: state => state.common.language,
      defaultLanguage: state => state.common.defaultLanguage
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
    overflow: hidden;

    .margin-1 {
      margin-top: -1px;
    }

    > .fixed {
      position: fixed;
      z-index: 2009;
    }
  }
</style>
