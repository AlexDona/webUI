<template>
  <div id="app" class="body-container">
    <router-view/>
  </div>
</template>

<script>
import {getStore} from './utils'
import {mapState, createNamespacedHelpers} from 'vuex'
const { mapMutations } = createNamespacedHelpers('common')
// import {testAjax} from './utils/api/apiDoc'

export default {
  name: 'App',
  components: {},
  data () {
    return {}
  },
  async created () {
    // console.log(this.isLogin)
    require('../static/css/common.css')
    require('../static/css/list/Common/HeaderCommon/HeaderCommon.css')
    require('../static/css/theme/night/Common/HeaderCommonNight.css')
    require('../static/css/theme/day/Common/HeaderCommonDay.css')
    // 取主题
    const theme = getStore('theme') || 'night'
    this.CHANGE_THEME(theme)
    this.setBodyClassName(true, theme)
    // 取折算货币
    const convertCurrency = getStore('convertCurrency')
    this.CHANGE_CONVERT_CURRENCY(convertCurrency)
  },
  mounted () {
  },
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_THEME',
      'CHANGE_CONVERT_CURRENCY'
    ]),
    setBodyClassName (type, className) {
      type ? document.body.classList.add(className) : document.body.classList.remove(className)
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      isLogin: state => state.user.isLogin,
      userInfo: state => state.user.loginStep1Info,
      isMobile: state => state.user.isMobile
    })
  },
  watch: {
    '$route' (to, from) {
      switch (to.path) {
        case '/Register':
          this.setBodyClassName(true, 'register')
          break
      }
    },
    userInfo (newVal) {
    },
    isMobile (newVal) {
      console.log(newVal)
      this.setBodyClassName(newVal, 'mobile')
    }
  }
}
</script>

<style>
  .body-container {
    font-family: MicrosoftYaHei,"Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 14px;
    height:100%;
  }
</style>
