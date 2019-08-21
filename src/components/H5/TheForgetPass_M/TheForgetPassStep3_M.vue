<!--
  author: zhaoxinlei
  create: 20190725
  description: 当前组件为 移动端 找回密码 修改 密码成功页面
-->
<template lang="pug">
  .the-forget-pass-success-m(
    :class="{'day':$isDayTheme_G_X,'night':!$isDayTheme_G_X }"
  )
    .top
      Iconfont.iconfont(
        icon-name="icon-chenggong1"
        v-show="!$isDayTheme_G_X"
      )
      Iconfont.iconfont(
        icon-name="icon-chenggong1-copy-copy"
        v-show="$isDayTheme_G_X"
      )
      // 新密码设置成功
      span {{$t('M.forgetPassword_text1')}}
    .bottom
      span {{$t('M.forgetPassword_text2')}}
      // 去登陆
      router-link(:to="`/${$routes_X.login}/m`") {{$t('M.forget_pass_jump_login_tips')}}
</template>
<script>
import mixins from '../../../mixins/user'
export default {
  name: 'the-forget-pass-success-m',
  mixins: [mixins],
  // components: {},
  props: ['username'],
  data () {
    return {
      timer: null
    }
  },
  created () {
    if (!this.$userInfo_X) this.$router.replace(`/${this.$routes_X.forgetPass}`)
    this.$setStore('username', this.username)
    this.timer = setTimeout(() => {
      this.$goToPage(`/${this.$routes_X.login}/m`)
    }, 3000)
  },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  beforeDestroy () {
    clearTimeout(this.timer)
  }
  // destroyed () {},
  // methods: {},
  // filters: {},
  // computed: {
  // },
  // watch: {}
}
</script>

<style scoped lang="stylus">
  @import '../../../assets/CSS/index.styl'
  .the-forget-pass-success-m
    fontSize = .5rem
    text-align center
    .top
      margin-bottom .5rem
      margin-top 2rem
      overflow hidden
      .iconfont
        font-size 1.5rem
        vertical-align middle
        margin-bottom 1rem
      span
        display block
        margin-left .5rem
        vertical-align middle
        font-size fontSize
    .bottom
      span,a
        font-size fontSize
    &.night
      .top
        .iconfont
          color S_main_color
        span
          color #fff
      .bottom
        span,a
          color #fff
        a
          color S_main_color
    &.day
      .top
        .iconfont
          color S_main_color
        span
          color #333
      .bottom
        span,a
          color #333
        a
          color S_main_color
</style>
