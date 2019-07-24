<!--
  author: zhaoxinlei
  create: 20190722
  description: 当前罪案为 忘记密码 步骤2 组件
-->
<template lang="pug">
  .the-forget-pass-step2
    .inner-box
      el-form(
      :model="forgetForm"
      :rules="forgetRule"
      :ref="forgetFormRef"
      label-width="232px"
      )
        // 登录账号
        el-form-item(
          label="登录账号"
          prop="username"
        )
          el-input(
          type="text"
          v-model="username"
          :disabled="true"
          )
        // 短信验证码
        el-form-item(
          :label="phonePlaceHolder"
          prop="phoneCode"
        )
          el-input.validate-code(
            type="text"
            :placeholder="phonePlaceHolder"
            v-model="forgetForm.phoneCode"
            :autofocus="true"
          )
            // 发送验证码
            template(slot="append")
              CountDownButton.count-down(
                :status="disabledOfPhoneBtn"
                @run="sendPhoneOrEmailCode()"
              )
        //  邮箱验证码
        el-form-item(
          :label="emailPlaceHolder"
          prop="emailCode"
        )
          el-input.validate-code(
            type="text"
            :placeholder="emailPlaceHolder"
            v-model="forgetForm.emailCode"
            :autofocus="true"
          )
            // 发送验证码
            template(slot="append")
              CountDownButton.count-down(
                :status="disabledOfEmailBtn"
                @run="sendPhoneOrEmailCode()"
              )
        //  googleCode
        el-form-item(
          label="谷歌验证码"
          prop="googleCode"
          :autofocus="true"
        )
          el-input(
            type="text"
            :placeholder="googlePlaceholder"
            v-model="forgetForm.googleCode"
            @keyup.native="googleAutoSave"
            @input.native="googleAutoSave"
          )
        //  新密码
        el-form-item(
        label="新登录密码"
        prop="password"
        )
          el-input(
          type="password"
          v-model="forgetForm.password"
          placeholder="密码"
          autocomplete="off"
          @keyup.enter.native="submitForm"
          clearable
          )
        //  确认新密码
        el-form-item(
          label="确认登录密码"
          prop="checkPassword"
        )
          el-input(
          type="password"
          v-model="forgetForm.checkPassword"
          placeholder="确认密码"
          autocomplete="off"
          @keyup.enter.native="submitForm"
          clearable
          )
        //  错误提示
        el-form-item.error-tips-form(
          label=""
          prop=""
        )
          span.error-tips {{errorTips}}
        el-form-item.submit(
          label=""
        )
          el-button(
          type="primary"
          @click="next"
          ) {{$t(nextBtnText)}}
</template>
<script>
import CountDownButton from '../../Common/CountDownCommon'
export default {
  name: 'the-forget-pass-step2',
  // mixins: [],
  components: {
    CountDownButton
  },
  props: ['username'],
  data () {
    let validatePhoneCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error(' '))
        // 请输入短信验证码
        this.errorTips = this.$t('M.login_please_input1')
      } else {
        this.errorTips = ''
        callback()
      }
    }
    let validateEmailCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error(' '))
        // 请输入邮箱验证码
        this.errorTips = this.$t('M.login_please_input2')
      } else {
        this.errorTips = ''
        callback()
      }
    }
    let validateGoogleCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error(' '))
        // 请输入谷歌验证码
        this.errorTips = this.$t('M.user_please_input9')
      } else {
        this.errorTips = ''
        callback()
      }
    }
    // 密码校验
    let validatePass = (rule, value, callback) => {
      if (!value) {
        this.errorTips = this.$t('M.login_tips2')
        // 请输入密码
        callback(new Error(' '))
        this.isPasswordValidateSuccess = false
      } else if (!this.PASS_REG_X.test(value)) {
        this.errorTips = this.$t('M.user_security_info1')
        // 密码请输入8-20位字母和数字组合
        callback(new Error(' '))
        this.isPasswordValidateSuccess = false
      } else {
        this.$refs[this.formRef].validateField('checkPassword')
        this.errorTips = ''
        callback()
      }
    }
    // 确认密码校验
    let validateCheckPass = (rule, value, callback) => {
      if (!value) {
        // 请输入确认密码
        callback(new Error(' '))
        this.errorTips = this.$t('M.comm_please_enter') + this.$t('M.forgetPassword_affirm_password')
        this.isPasswordValidateSuccess = false
      } else if (value !== this.form.password) {
        this.errorTips = this.$t('M.user_security_info2')
        this.isPasswordValidateSuccess = false
        // 密码不一致，请重新确认
        callback(new Error(' '))
      } else if (!this.PASS_REG_X.test(value)) {
        this.errorTips = this.$t('M.user_security_info1')
        // 密码请输入8-20位字母和数字组合
        callback(new Error(' '))
        this.isPasswordValidateSuccess = false
      } else {
        this.errorTips = ''
        this.isPasswordValidateSuccess = true
        callback()
      }
    }
    return {
      forgetForm: {
        phoneCode: '',
        emailCode: '',
        googleCode: '',
        password: '',
        checkPassword: ''
      },
      forgetRule: {
        phoneCode: [
          { validator: validatePhoneCode, trigger: 'blur' },
          { validator: validatePhoneCode, trigger: 'change' }
        ],
        emailCode: [
          { validator: validateEmailCode, trigger: 'blur' },
          { validator: validateEmailCode, trigger: 'change' }
        ],
        googleCode: [
          { validator: validateGoogleCode, trigger: 'blur' },
          { validator: validateGoogleCode, trigger: 'change' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' },
          { validator: validatePass, trigger: 'change' }
        ],
        checkPassword: [
          { validator: validateCheckPass, trigger: 'blur' },
          { validator: validateCheckPass, trigger: 'change' }
        ]
      },
      forgetFormRef: 'forgetPass',
      nextBtnText: 'M.forgetPassword_next_step',
      // 错误提示
      errorTips: '',
      googlePlaceholder: '谷歌验证码',
      validatePlaceholder: '谷歌验证码',
      phonePlaceHolder: '手机验证码',
      emailPlaceHolder: '邮箱验证码'
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
    },
    submitForm () {
      let targetProp = this.isPhoneRegist ? this.phone_X : this.email_X

      this.$refs[this.formRef].validateField(targetProp, (err) => {
        if (!err) {
          this.$refs[this.formRef].validateField('validateCode', (err) => {
            if (!err) {
              this.$refs[this.formRef].validateField('password', (err) => {
                if (!err) {
                  this.$refs[this.formRef].validateField('checkPassword', (err) => {
                    if (!err) {
                      this.$refs[this.formRef].validateField('agreement', (err) => {
                        if (!err) {
                          console.log('success')
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
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
  .the-forget-pass-step2
    /*background-color pink*/
    /deep/
    .el-form
      .el-form-item__label
        height 46px
        line-height 46px
        color #fff
      .el-form-item
        margin-bottom 30px
        .validate-code
          .el-input__inner
            border-radius 4px 0 0 4px
            border-right none
            height 46px
            vertical-align middle
          .el-input-group__append
            background-color transparent
            height 45px
            padding 0 10px
            border 1px solid #3F4769
            border-left none
            border-radius 0 4px 4px 0
            /* 发送验证码 */
            .count-down
              padding 0 15px
              color #2f78ca
              border-left 1px solid #375683
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
