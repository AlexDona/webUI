<!--
  author: zhaoxinlei
  create: 20190722
  description: 当前组件为 忘记密码 步骤1 组件
-->
<template lang="pug">
  .the-forget-pass-step1
    el-form(
      :model="forgetForm"
      :rules="forgetRule"
      :ref="forgetFormRef"
      label-width="232px"
      label-position="right"
    )
      el-form-item(
        label="登录账号123123123123"
        prop="username"
      )
        el-input(
          type="text"
          v-model="forgetForm.username"
          @keyup.enter.native="next"
          placeholder="账号"
          clearable
        )
      el-form-item.slider-box(
        :label="$t('M.login_dialog_title_label_04')"
        prop="isSliderSuccess"
      )
        CommonSlider.slider(
          propMaxWidth="410"
          height="46"
          barWidth="60"
          @successCallback="successCallback"
        )
        el-checkbox.checkbox(v-model="forgetForm.isSliderSuccess")
      el-form-item.error-tips-form(
        label=""
        prop=""
      )
        span.error-tips {{errorTips}}
      el-form-item.submit(
        label=""
      )
        // 下一步
        el-button(
        type="primary"
        :disabled="!isSuccessValidate"
        @click="next"
        ) {{$t(nextBtnText)}}
</template>
<script>
import CommonSlider from '../../Common/CommonSlider'
export default {
  name: 'the-forget-pass',
  // mixins: [],
  components: {
    CommonSlider
  },
  // props,
  data () {
    let validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error(' '))
        this.errorTips = '请输入用户名'
      } else {
        this.errorTips = ''
        callback()
      }
    }
    let validateSlider = (rule, value, callback) => {
      if (!value) {
        callback(new Error(' '))
        this.errorTips = '请通过滑块验证'
      } else {
        this.errorTips = ''
        callback()
      }
    }
    return {
      forgetForm: {
        username: '',
        isSliderSuccess: false
      },
      forgetRule: {
        username: [
          { validator: validateUsername, trigger: 'blur' },
          { validator: validateUsername, trigger: 'change' }
        ],
        isSliderSuccess: [
          { validator: validateSlider, trigger: 'change' }
        ]
      },
      forgetFormRef: 'forgetPass',
      nextBtnText: 'M.forgetPassword_next_step',
      // 错误提示
      errorTips: ''
    }
  },
  // created () {},
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    successCallback () {
      this.forgetForm.isSliderSuccess = true
    },
    next () {
      this.$refs[this.forgetFormRef].validate((valid) => {
        if (!valid) return
        this.$router.replace(`/${this.$routes_X.forgetPass}/${this.$routes_X.forgetPassStep2}/${this.forgetForm.username}`)
      })
    }
  },
  // filters: {},
  computed: {
    isSuccessValidate () {
      const {username, isSliderSuccess} = this.forgetForm
      return username && isSliderSuccess
    }
  }
  // watch: {}
}
</script>

<style scoped lang="stylus">
  @import '../../../assets/CSS/index.styl'
  .the-forget-pass-step1
    /*background-color pink*/
    /deep/
      .el-form
        .el-form-item__label
          height 46px
          line-height 46px
          color #fff
        .el-form-item
          margin-bottom 30px
          .el-form-item__content
            width 410px
          .el-input__inner
            border 1px solid #3F4769
            background-color transparent
            height 46px
            color #60678B
          &.error-tips-form
            margin-bottom 10px
            height 40px
            .error-tips
              font-size 12px
              color S_error_color
          &.slider-box
            position relative
            margin-bottom 0
            /*background-color pink*/
            .slider
              position absolute
              z-index 1
              .drag
                border-color #3F4769
              .handler
                height 46px !important
                top -1px
            .checkbox
              position absolute
              display none
          &.submit
            .el-form-item__content
              margin 0
              width 100%
            .el-button
              width 235px
              height 46px
              background linear-gradient(81deg,rgba(42,59,97,1),rgba(18,71,133,1))
              box-shadow 0 3px 8px 0 rgba(0, 0, 0, 0.25)
              border none
              border-radius 4px
              &.is-disabled
                background #303757
                color #636777
                box-shadow none
        .forget-tips
          color S_fontColor
</style>
