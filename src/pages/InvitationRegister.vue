<template>
  <div
    class="invitation-register-box"
  >
    <div class="logo">
      <img :src="logoSrc">
    </div>
    <div class="inner-box">
      <p>您的好友{{phoneNumberFormat(inviter)}}</p>
      <p class="strong">邀请您注册 <span class="yellow">{{configInfo.otcAd}}</span></p>
      <div class="bg">
        <img src="../assets/develop/register-big-url.png">
      </div>
      <router-link
        :to="`/register?showId=${$route.query.showId}`"
        class="register-btn"
      >立即注册领取</router-link>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {
  getFooterInfo,
  // getLanguageListAjax,
  returnAjaxMessage
} from '../utils/commonFunc'
import {
  findUserInfoByShowId
} from '../utils/api/home'
import {
  phoneNumberFormat
} from '../utils'
import HeaderCommonForMobile from '../components/Common/HeaderForMobile'
import {createNamespacedHelpers, mapState} from 'vuex'
const {mapMutations} = createNamespacedHelpers('common')
export default {
  components: {
    HeaderCommonForMobile
  },
  // props,
  data () {
    return {
      inviter: ''
    }
  },
  async created () {
    console.log()
    // await getLanguageListAjax(this)
    let language = this.$route.query.lang || this.defaultLanguage
    await getFooterInfo(language, this)
    await this.findUserInfoByShowId()
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
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
      if (!returnAjaxMessage(data, this)) {
        return false
      } else {
        console.log(data)
        this.inviter = data.data.data.userName
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      isMobile: state => state.user.isMobile,
      logoSrc: state => state.common.logoSrc,
      configInfo: state => state.common.footerInfo.configInfo,
      language: state => state.common.language,
      defaultLanguage: state => state.common.defaultLanguage
    })
  },
  watch: {
    async language () {
      await getFooterInfo(this.language, this)
    },
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
      padding:4rem;
      /*background-color: pink;*/
      .strong{
        font-weight: 700;
        font-size: 1.2rem;
        line-height: 2.4rem;
        >.yellow{
          color:#ffec2d;
        }
      }
      >.bg{
        /*background-color: pink;*/
        height:18rem;
        >img{
          margin: 2rem auto;
          width:80%;
        }
      }
      >.register-btn{
        width:10rem;
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
