<!--
  author: zhaoxinlei
  create: 20190725
  description: 当前组件为 忘记密码 修改 密码成功页面
-->
<template lang="pug">
  .the-forget-pass-success
    .top
      Iconfont.iconfont(icon-name="icon-chenggong1")
      // 新密码设置成功
      span {{$t('M.forgetPassword_text1')}}
    .bottom
      span {{$t('M.forgetPassword_text2')}}
      // 去登陆
      router-link(:to="`/${$routes_X.login}`") {{$t('M.forget_pass_jump_login_tips')}}
</template>
<script>
import mixins from '../../../mixins/user'
export default {
  name: 'the-forget-pass-success',
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
      this.$goToPage(`/${this.$routes_X.login}`)
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
  .the-forget-pass-success
    text-align center
    .top
      margin-bottom 30px
      .iconfont
        color #2f72b7
        font-size 30px
        vertical-align middle
      span
        margin-left 30px
        vertical-align middle
        font-size 16px
        color #fff
    .bottom
      span,a
        color #fff
        font-size 16px
      a
        color #2f72b7
</style>
