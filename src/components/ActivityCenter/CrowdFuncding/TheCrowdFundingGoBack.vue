<!--
  author: zhaoxinlei
  create: 20190610
  description: 当前页面为 众筹页面 返回众筹列表组件
-->
<template lang="pug">
  .right
    // 返回
    router-link.back(:to="`/${$routes_X.crowdFunding}`") {{$t('M.investment_return_investment')}}
    Iconfont.iconfont(
     icon-name="icon-fanhui"
    )
</template>

<style scoped lang="stylus">
  @import '../../../assets/CSS/index.styl'
  .right
    .back
      font-size 12px
      color S_main_color
    .iconfont
      font-size 12px
</style>
