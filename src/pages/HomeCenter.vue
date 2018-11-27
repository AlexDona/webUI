<template>
  <!--首页盒子-->
  <div class="home-box home">
    <!--banner-->
    <keep-alive>
      <BannerHome/>
    </keep-alive>

    <!--交易区-->
    <MarketListHome class="margin-1"/>

    <!--底部-->
  </div>
</template>
<script>
import NoticeHome from '../components/Home/NoticeHome'
import BannerHome from '../components/Home/BannerHome'
import MarketListHome from '../components/Home/MarketListHome'
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
    this.changeLanguage('en-us')
    // onlineText/offlineText：按钮文本,繁中（線上客服），英语（Online Service），日语（オンラインサービス），韩语（온라인 고객지원）
    // language：语言：英语（en-us），繁中（zh-TW），日语（ja），韩语（ko），西班牙语（es），阿拉伯语（ar），法语（fr），泰语（th），印尼语（id），葡萄牙语（pt），俄罗斯语（ru）
    // pos_flag：按钮位置，1）形状： h(横向) v(纵向) c(圆形) i(图片)；2）位置： lt(左上) mt(中上) rt(右上) lm(左中) mm(正中) rm(右中) lb(左下) mb(中下) rb(右下)默认值：crb（pc），hrb（mobile）
    // isInvite：主动会话邀请，true开启，false关闭
    // mode:窗口模式，独立blank,内嵌inner
    // color：按钮颜色
    // mobile：设为为响应式布局，可用于移动页面
  },
  methods: {
    doAdd () {
      this.addServiceForCustomer(window, document, 'script', 'http://assets-cli.udesk.cn/im_client/js/udeskApi.js', 'ud')
      ud({
        'code': '311h1067', // 标识
        'link': 'https://fubt.udesk.cn/im_client/?web_plugin_id=59660', // IM链接地址
        'isInvite': false,
        'mode': 'inner',
        'color': '#338ff5',
        'pos_flag': 'hrb',
        'language': this.msgLanguage,
        'onlineText': '',
        'offlineText': '',
        'mobile': {
          'mode': 'inner',
          'color': '#338ff5',
          'pos_flag': 'crb',
          'language': '',
          'onlineText': '',
          'offlineText': ''
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
      console.log(this.msgLanguage)
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
    ...mapState({
      language: state => state.common.language
    })
  },
  watch: {
    language (newVal) {
      $('#udesk_btn_text').text(this.$t('M.common_onlineText'))
      console.log(newVal)
      this.onlineText = this.$t('M.common_onlineText')
      this.changeLanguage(newVal)
    }
  }
}
</script>
<style scoped lang="scss">
  .home-box{
    min-width: 1130px;
    overflow: hidden;
    .margin-1{
      margin-top:-1px;
    }
    >.fixed{
      position: fixed;
      z-index: 2009;
    }
  }
</style>
