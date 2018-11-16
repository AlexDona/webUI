<template>
  <div
    class="download-box"
    :style="{
      height:windowHeight+'px'
    }"
  >
    <HeaderCommonForMobile
      :style="{
        display:'none'
      }"
    />
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
          ref="download"
          download="android"
          :style="{
            display:none
          }"
        ></a>
      </div>
    </div>
    <!--微信遮罩-->
    <div
      class="wx-mask"
      v-if="isWXBrowser"
    >
      <div class="img">
        <div
          class="ios-box"
          v-if="isIOS"
        >
          <img
            v-if="language=='zh_CN'"
            src="../assets/develop/zh_CN_weiChat_ios.png"
          >
          <img
            v-else
            src="../assets/develop/en_US_weiChat_ios.png"
          >
        </div>
        <div
          class="android-box"
          v-if="isAndroid"
        >
          <img
            v-if="language=='zh_CN'"
            src="../assets/develop/zh_CN_weiChat_andriod.png"
          >
          <img
            v-else
            src="../assets/develop/en_US_weiChat_andriod.png"
          >
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {
  getAppDownLoadUrlAjax
} from '../utils/api/user'
import {
  returnAjaxMsg,
  getNestedData
} from '../utils/commonFunc'
import HeaderCommonForMobile from '../components/Common/HeaderForMobile'
import {mapState, createNamespacedHelpers} from 'vuex'
const {mapMutations} = createNamespacedHelpers('common')

export default {
  components: {
    HeaderCommonForMobile
  },
  // props,
  data () {
    return {
      zh_CNSrc: require('../assets/develop/download-bg-cn.png'),
      en_USSrc: require('../assets/develop/download-bg-en.png'),
      downloadUrl: '',
      isAndroid: false,
      isIOS: false
    }
  },
  created () {
    console.log(1)
    this.getAppDownLoadUrl()
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
    // 获取app下载地址
    async getAppDownLoadUrl () {
      const data = await getAppDownLoadUrlAjax()
      if (!returnAjaxMsg(data, this)) {
        return false
      } else {
        console.log(data)
        let u = navigator.userAgent
        this.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
        this.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
        if (this.isAndroid) {
          // alert('android')
          window.location.href = 'scheme: //fubt.com/'
          this.downloadUrl = getNestedData(data, 'data.data.android')
        } else if (this.isIOS) {
          // alert('ios')
          window.location = 'com.top.Fubt://' // 打开某手机上的某个app应用
          this.downloadUrl = `itms-services://?action=download-manifest&;amp;url=${getNestedData(data, 'data.data.ios')}`
        }
      }
    },
    downloadApp () {
      this.$refs['download'].click()
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
      return (navigator.browserLanguage || navigator.language).split('-').join('_') || this.$route.query.language
    },
    isWXBrowser () {
      const ua = window.navigator.userAgent.toLowerCase()
      // 通过正则表达式匹配ua中是否含有MicroMessenger字符串
      if (ua.match(/MicroMessenger/i) === 'micromessenger') {
        return 1
      } else {
        return 0
      }
    }
  },
  watch: {
    footerInfo (newVal) {
      console.log(newVal)
    },
    isWXBrowser (newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  .download-box{
    width:100%;
    background:linear-gradient(150deg, #1e2636, #254b75);
    position: relative;
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
    >.wx-mask{
      width:100%;
      height:100%;
      background-color: rgba(0,0,0,.4);
      position: absolute;
      z-index: 1;
      top:0;
      left:0;
      >.img{
        width:100%;
        height:100%;
        text-align: center;
        img{
          width:90%;
        }
      }
    }
  }
</style>
