<!--
  author: zhaoxinlei
  createTime: 2019-04-25
  description: 币币交易交易未登录时展示的按钮
-->
<template lang="pug">
  .unlogin-btn
    router-link(:to="`/${$routes_X.login}`") {{$t('M.comm_login')}}
    span {{$t('M.trade_coin_text2')}}
    router-link(:to="`/${$routes_X.login}/${$routes_X.register}/default`") {{$t('M.comm_register_time')}}
</template>
<script>
export default {
  // components: {},
  // props,
  // data () {
  //   return {}
  // },
  // created () {},
  // mounted () {},
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  // methods: {},
  // filter: {},
  // computed: {
  //   ...mapState([
  //   ])
  // },
  // watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../assets/CSS/index';

  .unlogin-btn {
    width: 100%;
    text-align: center;
    color: #d9e1f1;

    > a {
      color: $mainColor;
    }
  }
</style>
