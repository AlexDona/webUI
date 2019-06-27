<!--
  author: zhaoxinlei
  createTime: 2019-04-25
  description: 币币交易交易未登录时展示的按钮
-->
<template>
  <div class="unlogin-btn">
    <!-- 登录 或 注册-->
    <router-link to="/login">{{$t('M.comm_login')}}</router-link>
    {{$t('M.trade_coin_text2')}}
    <router-link to="/register">{{$t('M.comm_register_time')}}</router-link>
  </div>
</template>
<script>
import {mapState} from 'vuex'
// import {returnAjaxMsg} from '../../utils/commonFunc'
export default {
  components: {
  },
  // props,
  data () {
    return {}
  },
  created () {},
  mounted () {},
  activated () {},
  updated () {},
  beforeRouteUpdate () {},
  beforeDestroy () {},
  destroyed () {},
  methods: {},
  filter: {},
  computed: {
    ...mapState([
    ])
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../assets/CSS/index';

  .unlogin-btn {
    width: 100%;
    text-align: center;

    > a {
      color: $mainColor;
    }
  }
</style>
