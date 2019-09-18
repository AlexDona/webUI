<!--
  author: zxl
  create: 20190912
  description: 当前页面为 "闪兑专区" 详情页 抢购成功 loading 组件
-->
<template lang="pug">
  .the-queuing-loading(v-show="isShow")
    .loader
      span.spinner
    .text {{$isChineseLanguage_G_X ? '当前抢购人数过多，正在排队，请耐心等待...' : ''}}
</template>
<script>
export default {
  name: 'the-queuing-loading',
  // mixins: [],
  // components: {},
  props: {
    isShow: {
      default: false
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import '../../../assets/CSS/index.styl'
  @keyframes spinner
    50%
      border-radius 50%
      transform scale(.5) rotate(360deg)
      background  S_main_color url("../../../assets/ShoppingSpree/queueing/ETH.png") no-repeat center center/30%
    100%
      transform scale(1) rotate(720deg)
      background #FC4C1B  url("../../../assets/ShoppingSpree/queueing/BTC.png") no-repeat center center/30%
  .the-queuing-loading
    position fixed
    width 100%
    height 100%
    left 0
    top 0
    background-color rgba(0, 0, 0, .6)
    z-index 3000

    > .loader
      position absolute
      top 30%
      left 50%
      transform translate(-50%, -50%)
      text-align center
      user-select none
      cursor default
      .spinner
        position relative
        color #fff
        &:before,
        &:after
          content ""
          position relative
          display block
        &:before
          animation spinner 2s cubic-bezier(0.750, 0.000, 0.500, 1.000) infinite normal
          width 100px
          height 100px
          background #FC4C1B url("../../../assets/ShoppingSpree/queueing/BTC.png") no-repeat center center/30%
    > .text
      text-align center
      position absolute
      left 50%
      top 36%
      transform translate(-50%, -50%)
      color #fff
      font-size 16px
      user-select none
</style>
