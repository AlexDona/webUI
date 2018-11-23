<template>
  <div
    class="invitation-register-box"
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-background="rgba(0, 0, 0, 0.6)"
  >
    <HeaderCommonForMobile
      :style="{
        display: 'none'
      }"
    />
    <div class="logo">
      <img :src="logoSrc">
    </div>
    <div class="inner-box">
      <!-- 您的好友 -->
      <p>{{$t('M.invitation_register_your_friends')}}{{phoneNumberFormat(inviter)}}</p>
      <!-- 邀请您注册 -->
      <p class="strong"> {{this.$t('M.invitation_register_please_you_register')}} <span
        class="yellow"
        v-if="configInfo"
      >{{configInfo.otcAd}}</span></p>
      <div class="bg">
        <img src="../assets/develop/register-big-url.png">
      </div>
      <router-link
        :to="`/register?showId=${$route.query.showId}`"
        class="register-btn"
      >
        <!-- 立即注册领取 -->
        {{$t('M.invitation_register_immediately_register_get')}}
      </router-link>
    </div>
    <WeChatMask
      :isAndroid="isAndroid"
      :language="language"
      :isIOS="isIOS"
      :isWXBrowserStatus="isWXBrowserStatus"
    />
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {
  // getFooterInfo,
  returnAjaxMsg,
  isWXBrowser
} from '../utils/commonFunc'
import {
  findUserInfoByShowId
} from '../utils/api/home'
import {
  phoneNumberFormat
} from '../utils'
import HeaderCommonForMobile from '../components/Common/HeaderForMobile'
import WeChatMask from '../components/User/WeChatMask'
import {createNamespacedHelpers, mapState} from 'vuex'

const {mapMutations} = createNamespacedHelpers('common')
export default {
  components: {
    HeaderCommonForMobile,
    WeChatMask
  },
  // props,
  data () {
    return {
      inviter: '',
      showId: '',
      fullscreenLoading: true,
      queryLanguage: '', // 参数语言
      isAndroid: false,
      isIOS: false
    }
  },
  async created () {
    let u = navigator.userAgent
    this.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
    this.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
    console.log('created')
    this.findUserInfoByShowId()
  },
  mounted () {},
  activited () {
    console.log(2)
  },
  update () {},
  destroyed () {
    // removeStore('language')
  },
  methods: {
    ...mapMutations([
      'CHANGE_LANGUAGE',
      'SET_FOOTER_INFO'
    ]),
    phoneNumberFormat (target) {
      return phoneNumberFormat(target)
    },
    async findUserInfoByShowId () {
      const params = {
        showId: this.$route.query.showId
      }
      const data = await findUserInfoByShowId(params)
      if (!returnAjaxMsg(data, this)) {
        return false
      } else {
        console.log(data)
        this.inviter = data.data.data.userName
        this.fullscreenLoading = false
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      isMobile: state => state.user.isMobile,
      logoSrc: state => state.common.logoSrc,
      configInfo: state => state.common.footerInfo.configInfo
      // language: state => state.common.language,
    }),
    language () {
      return this.$route.query.language
    },
    isChineseLanguage () {
      return this.language === 'zh_CN' ||
        this.language === 'zh_TW'
    },
    isWXBrowserStatus () {
      return isWXBrowser()
    }
  },
  watch: {
    configInfo (newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  .invitation-register-box{
    background: linear-gradient(150deg,rgba(30,38,54,1),rgba(37,75,117,1));
    height:100%;
    width:100%;
    overflow:hidden;
    >.logo{
      height:120px;
      line-height: 120px;
      padding:0 20px;
      box-sizing: border-box;
      >img{
        height:100px;
        display: inline-block;
        margin-top:10px;
      }
    }
    >.inner-box{
      width:100%;
      height:100%;
      color:#fff;
      font-size: .8rem;
      text-align: center;
      padding:4rem 2rem;
      .strong{
        font-weight: 700;
        font-size: 1.2rem;
        line-height: 2.4rem;
        white-space:nowrap;
        >.yellow{
          color:#ffec2d;
        }
      }
      >.bg{
        height:18rem;
        >img{
          margin: 2rem auto;
          width:80%;
        }
      }
      >.register-btn{
        /*width:10rem;*/
        padding:0 .5rem;
        height:3rem;
        font-size: 1.2rem;
        line-height: 3rem;
        background:linear-gradient(81deg,rgba(61,152,249,1) 0%,rgba(71,135,255,1) 100%);
        box-shadow:0px 3px 8px 0px rgba(26,42,71,1);
        border-radius:10px;
        color:#fff;
        display: inline-block;
      }
    }
  }
</style>
