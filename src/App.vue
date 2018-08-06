<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import {getStore} from './utils'
// import {getCnyRate} from './utils/api/apiDoc'

export default {
  name: 'App',
  components: {},
  data () {
    return {}
  },
  async created () {
    require('../static/css/list/Common/HeaderCommon/HeaderCommon.css')
    require('../static/css/theme/night/Common/HeaderCommonNight.css')
    require('../static/css/theme/day/Common/HeaderCommonDay.css')
    // 取主题
    const theme = getStore('theme') || 'night'
    this.CHANGE_THEME(theme)

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
    ])
  },
  filter: {},
  computed: {
    ...mapState([
      'theme'
    ])
  },
  watch: {}
}
</script>

<style>
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 14px;
  }
</style>
