<template>
  <div
    class="download-box"
    :style="{
      height:windowHeight+'px'
    }"
  >
    <div class="inner-box">
      <div class="logo">
        <img
          :src="logoSrc"
        >
      </div>
      <div class="content">
        <img
          :src="zh_CNSrc"
          v-if="isChineseLanguage"
        >
        <img
          :src="en_USSrc"
          v-else
        >
        <button
          class="download-btn"
          v-if="isChineseLanguage"
          @click="downloadApp"
        >
          <!-- 立即安装 -->
          立即安装
        </button>
        <button
          class="download-btn"
          v-else
          @click="downloadApp"
        >
          <!-- 立即安装 -->
          Install
        </button>
        <a
          :href="downloadUrl"
          ref="android-download"
          download="android"
          :style="{
            display:none
          }"
        ></a>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState, createNamespacedHelpers} from 'vuex'
const {mapMutations} = createNamespacedHelpers('common')

export default {
  components: {
  },
  // props,
  data () {
    return {
      zh_CNSrc: require('../assets/develop/download-bg-cn.png'),
      en_USSrc: require('../assets/develop/download-bg-en.png'),
      downloadUrl: ''
    }
  },
  created () {
    // getFooterInfo(this.language, this)
  },
  mounted () {
  },
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'SET_FOOTER_INFO'
    ]),
    downloadApp () {
      let u = navigator.userAgent
      let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
      if (isiOS) {
        // equip = 'ios'
        // alert('isIOS')
      } else if (isAndroid) {
        // equip = 'android'
        // alert('isAndroid')
        this.downloadUrl = 'https://fubt-3.oss-cn-hongkong.aliyuncs.com/4f8f11c8-9921-408c-8671-7dcf2c7fac6atudou.apk'
        this.$refs['android-download'].click()
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      logoSrc: state => state.common.logoSrc
    }),
    windowHeight () {
      return window.innerHeight
    },
    isChineseLanguage () {
      return this.language === 'zh_CN' ||
        this.language === 'zh_TW'
    },
    language () {
      return this.$route.query.language
    }
  },
  watch: {
    footerInfo (newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  .download-box{
    width:100%;
    background:linear-gradient(150deg, #1e2636, #254b75);
    >.inner-box{
      width:100%;
      height:100%;
      overflow: hidden;
      >.logo{
        width:3rem;
        height:3rem;
        border-radius:10px;
        margin:3rem auto;
        >img{
          -webkit-box-reflect: below 0px -webkit-gradient(linear, left top, left bottom, from(transparent), to(rgba(250, 250, 250, 0.1)));
        }
      }
      >.content{
        width:100%;
        height:15rem;
        text-align: center;
        >img{
          height:100%;
        }
        >.download-btn{
          margin: 2rem auto;
          width:10rem;
          height:2rem;
          line-height:2rem;
          background:rgba(70,150,245,1);
          border-radius:40px;
          font-size: 0.8rem;
          color:#fff;
        }
      }
    }
  }
</style>
