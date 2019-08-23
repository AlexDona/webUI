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
// import {returnAjaxMsg} from '../../utils/commonFunc'
export default {
  components: {},
  // props,
  data () {
    return {
      is500: false
    }
  },
  created () {
    if (this.$route.path === '/500') {
      this.is500 = true
      if (this.routerTo !== '/') {
        localStorage.setItem('routerTo', this.routerTo)
      }
      window.onbeforeunload = e => {
        this.beforeunloadFn(e)
      }
    }
  },
  /* mounted () {},
  },
  update () {
  },
  beforeRouteUpdate () {
  }, */
  methods: {
    beforeunloadFn (e) {
      this.$router.replace(localStorage.getItem('routerTo'))
    }

  },
  // filter: {},
  computed: {
    ...mapState({
      'routerTo': state => state.common.routerTo
    }),
    windowHeight () {
      return window.innerHeight
    }
  },
  // watch: {},
  destroyed () {
    window.removeEventListener('beforeunload', e => this.beforeunloadFn(e))
  }
}
</script>
<style scoped lang="scss" type="text/scss">
.error-box {
  width: 100%;

  /* height:600px; */
  background-color: #272b41;

  > .inner-box {
    height: 100%;

    > .error404,
    > .error500 {
      width: 500px;
      height: 70%;
      margin: 0 auto;
      text-align: center;

      > img {
        margin: 200px 0 30px;
      }

      > p {
        font-weight: 400;
        font-size: 22px;
        font-family: "HYk2gj";
        color: rgba(51, 143, 245, 1);
      }

      > a {
        display: inline-block;
        width: 140px;
        height: 36px;
        margin: 40px auto;
        border-radius: 4px;
        font-size: 12px;
        line-height: 36px;
        color: #fff;
        background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
      }
    }
  }
}
</style>
