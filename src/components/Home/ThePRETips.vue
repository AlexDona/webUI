<!--
  author: zhaoxinlei
  create: 20190825
  description: 当前组件为首页信息展示组件
-->
<template lang="pug">
  .the-pre-tips(
    v-show="isShowTips"
    @click="PREJumpToTradeCenter"
  )
    span.title {{$projectName_S_X}}
    span.desc {{$stepDesc_S_X}}
    span.time-down
      span.time {{PRE_Days}}
      span {{$isChineseLanguage_G_X?'天':'Day'}}
      span.time {{PRE_Hours}}
      span {{$isChineseLanguage_G_X?'时':'Hou'}}
      span.time {{PRE_Minutes}}
      span {{$isChineseLanguage_G_X?'分':'Min'}}
      span.time {{PRE_Seconds}}
      span {{$isChineseLanguage_G_X?'秒':'Sec'}}
    span.status {{$PREStatus_S_X=='coming' ? $t('M.trade_langstart') : $t('M.trade_langEnd')}}
</template>
<script>
import mixins from '../../mixins/PRE'
export default {
  mixins: [mixins],
  // components: {},
  // props,
  // data () {
  //   return {}
  // }
  // created () {},
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  // methods: {},
  // filters: {},
  computed: {
    isShowTips () {
      console.log(this.$route)
      const {path} = this.$route
      return this.isShowPREActivity && path === `/${this.$routes_X.home}`
    }
  }
  // watch: {}
}
</script>

<style scoped lang="stylus">
  @import '../../assets/CSS/index.styl'
  .the-pre-tips
    background url('../../assets/PRE/home-pre-bg.png') no-repeat center center/100%
    height 60px
    line-height 60px
    text-align center
    cursor pointer
    >span
      margin 0 10px
    >.title
      color S_main_color
      font-size 20px
      font-weight 700
    >.desc
      color #fff
      font-size 12px
      font-weight 700
    >.time-down
      font-size 16px
      color #fff
      display inline-block
      >.time
        padding 8px
        text-align center
        margin 0 10px
        box-sizing border-box
        background url('../../assets/PRE/pre-timer-bg.png') no-repeat center center/100% 100%
    >.status
      font-size 20px
      color S_main_color
      font-weight 700
</style>
