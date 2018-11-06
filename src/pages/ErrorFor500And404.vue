<template>
  <div
    class="error-box"
    :style="{
        height:windowHeight+'px'
    }"
  >
    <div class="inner-box"
    >
      <div
        class="error404"
        v-if="!is500"
      >
        <img src="../assets/develop/404.png">
        <router-link
          to="/"
          class="back-to-home"
        >
          <!-- 返回首页 -->
          {{$t('M.invitation_register_return_home')}}
        </router-link>
      </div>
      <div
        class="error500"
        v-else
      >
        <img src="../assets/develop/500.png">
        <p>
          <!-- 非常抱歉 服务器出错了 -->
          {{$t('M.invitation_register_server_err')}}
        </p>
        <router-link
          to="/"
          class="back-to-home"
        >
          <!-- 返回首页 -->
          {{$t('M.invitation_register_return_home')}}
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
// import {returnAjaxMessage} from '../../utils/commonFunc'
export default {
  components: {
  },
  // props,
  data () {
    return {
      is500: false
    }
  },
  created () {
    console.log(this.$route.path)
    if (this.$route.path === '/500') {
      this.is500 = true
    }
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {},
  filter: {},
  computed: {
    ...mapState([
    ]),
    windowHeight () {
      return window.innerHeight
    }
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  .error-box{
    width:100%;
    /*height:600px;*/
    background-color: #272b41;
    >.inner-box{
      height:100%;
      >.error404,>.error500{
        width:500px;
        height:70%;
        margin:0 auto;
        text-align: center;
        >img{
          margin: 100px auto;
        }
        >p{
          font-size:22px;
          font-family:HYk2gj;
          font-weight:400;
          color:rgba(51,143,245,1);
        }
        >a{
          margin:40px auto;
          display: inline-block;
          width:140px;
          height:44px;
          line-height:44px;
          background:linear-gradient(81deg,rgba(43,57,110,1) 0%,rgba(42,80,130,1) 100%);
          border-radius:4px;
          color:#fff;
        }
      }
    }
  }
</style>
