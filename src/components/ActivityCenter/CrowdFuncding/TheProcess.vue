<!--
  author: zhaoxinlei
  create: 20190604
  description: 当前页面为 众筹 进度条组件
-->
<template lang="pug">
  .the-process
    .the-process-bg(:class="{all: isAll,'not-all':!isAll}")
      .the-min-width(
        :style="{width: `${process}%`}"
      )
        .bar(v-show="!isAll")
    .text {{process}} %
</template>
<script>
export default {
  name: 'the-process',
  // mixins: [],
  // components: {},
  props: {
    process: {
      type: Number
    }
  },
  // data () {
  //   return {}
  // }
  // created () {
  // },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  // methods: {},
  // filters: {},
  computed: {
    isAll () {
      return this.process >= 100
    }
  }
  // watch: {}
}
</script>

<style scoped lang="stylus">
  @import '../../../assets/CSS/index.styl'
  .the-process
    display flex
    width 100%
    /*background-color pink*/
    justify-content space-around
    height 12px
    margin 15px 0
    /*overflow hidden*/
    >.the-process-bg
      flex 6
      box-shadow 0 3px 49px 0 rgba(24,26,41,1)
      border-radius 6px
      background #353f61
      >.the-min-width
        background-color S_main_color
        margin-top 1px
        margin-left 1px
        height 10px
        border-radius 6px
        position relative
        >.bar
          position absolute
          content ''
          right -13px
          top 50%
          transform translateY(-50%)
          width 26px
          height 26px
          border-radius 50%
          background url('../../../assets/images/crowd-funding-process-bar-black-bg.png') no-repeat center center
      &.all
        background-color transparent
      &.not-all
        >.the-min-width
          margin-top 2px
          margin-left 2px
          height 8px
    >.text
      flex 1
      color S_main_color
      text-align right
      line-height 14px
      font-size 12px
</style>
