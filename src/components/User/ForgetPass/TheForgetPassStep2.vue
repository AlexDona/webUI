<!--
  author: zhaoxinlei
  create: 20190722
  description: 当前组件为 忘记密码 步骤2 组件
-->
<template lang="pug">
  .the-forget-pass-step2(
    :class="{'day':$isDayTheme_G_X,'night':!$isDayTheme_G_X }"
  )
    .inner-box
      el-form(
      :model="form"
      :rules="forgetRule"
      :ref="formRef"
      label-width="232px"
      )
        // 登录账号
        el-form-item(
          :label="$t('M.forget_pass_username_label')"
          prop="username"
        )
          el-input(
            type="text"
            v-model="username"
            :disabled="true"
          )
        // 短信验证码
        el-form-item(
          :label="$t('M.forgetPassword_verify_style2')"
          prop="phoneCode"
          v-if="$isBindPhone_X"
        )
          el-input.validate-code(
            type="text"
            :placeholder="$t('M.login_please_input1')"
            v-model="form.phoneCode"
            @keyup.enter.native="next"
            :autofocus="true"
            clearable
          )
            // 发送验证码
            template(slot="append")
              CountDownButton.count-down(
                :status="$disabledOfPhoneBtn_X"
                @run="sendPhoneOrEmailCode(0)"
              )
        //  邮箱验证码
        el-form-item(
          :label="$t('M.forgetPassword_verify_style4')"
          prop="emailCode"
          v-if="$isBindEmail_X"
        )
          el-input.validate-code(
            type="text"
            :placeholder="$t('M.login_please_input2')"
            v-model="form.emailCode"
            :autofocus="true"
            @keyup.enter.native="next"
            clearable
          )
            // 发送验证码
            template(slot="append")
              CountDownButton.count-down(
                :status="$disabledOfEmailBtn_X"
                @run="sendPhoneOrEmailCode(1)"
              )
        //  googleCode
        el-form-item(
          :label="$t('M.forgetPassword_verify_style5')"
          prop="googleCode"
          :autofocus="true"
          v-if="$isBindGoogle_X"
        )
          el-input(
            type="text"
            :placeholder="$t('M.user_please_input9')"
            v-model="form.googleCode"
            clearable
          )
        //  新密码
        el-form-item(
          :label="$t('M.forgetPassword_new_login')"
          prop="password"
        )
          el-input(
          type="password"
          v-model="form.password"
          :placeholder="$t('M.forget_pass_new_username_tips')"
          autocomplete="off"
          @keyup.enter.native="next"
          clearable
          )
        //  确认新密码
        el-form-item(
          :label="$t('M.forget_pass_check_pass_label')"
          prop="checkPassword"
        )
          el-input(
          type="password"
          v-model="form.checkPassword"
          :placeholder="$t('M.forget_pass_check_pass_tips')"
          autocomplete="off"
          @keyup.enter.native="next"
          clearable
          )
        //  错误提示
        el-form-item.error-tips-form(
          label=""
          prop=""
        )
          Iconfont.iconfont(
            icon-name="icon-tishi1-copy"
            v-show="errorTips"
          )
          span.error-tips {{errorTips}}
        el-form-item.submit(
          label=""
        )
          el-button(
            type="primary"
            @click="next"
            :disabled="!isSuccessValidate"
          ) {{$t(nextBtnText)}}
</template>
<script>
import CountDownButton from '../../Common/CountDownCommon'
import {sendPhoneOrEmailCodeAjax} from '../../../utils/commonFunc'
import mixins from '../../../mixins/user'
import {updatePasswordAJAX} from '../../../utils/api/user'
export default {
  name: 'the-forget-pass-step2',
  mixins: [mixins],
  components: {
    CountDownButton
  },
  props: ['username'],
  data () {
    let validatePhoneCode = (rule, value, callback) => {
      if (this.$isBindPhone_X) {
        if (!value) {
          callback(new Error(' '))
          // 请输入短信验证码
          this.errorTips = this.$t('M.login_please_input1')
        } else {
          this.errorTips = ''
          callback()
        }
      } else {
        this.errorTips = ''
        callback()
      }
    }
    let validateEmailCode = (rule, value, callback) => {
      if (this.$isBindEmail_X) {
        if (!value) {
          callback(new Error(' '))
          // 请输入邮箱验证码
          this.errorTips = this.$t('M.login_please_input2')
        } else {
          this.errorTips = ''
          callback()
        }
      } else {
        this.errorTips = ''
        callback()
      }
    }
    let validateGoogleCode = (rule, value, callback) => {
      if (this.$isBindGoogle_X) {
        if (!value) {
          callback(new Error(' '))
          // 请输入谷歌验证码
          this.errorTips = this.$t('M.user_please_input9')
        } else {
          this.errorTips = ''
          callback()
        }
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
      form: {
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
      // 密码是否检验成功
      isPasswordValidateSuccess: false,
      formRef: 'forgetPass',
      nextBtnText: 'M.forgetPassword_next_step',
      // 错误提示
      errorTips: ''
    }
  },
  created () {
    if (!this.$userInfo_X) this.$router.replace(`/${this.$routes_X.forgetPass}`)
  },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    // 发送验证码（短信、邮箱）
    async sendPhoneOrEmailCode (type) {
      if (this.$disabledOfPhoneBtn_X || this.$disabledOfEmailBtn_X) {
        return false
      }
      const {phone, email, country} = this.$userInfo_X
      let params = {
        nationCode: country
      }
      switch (type) {
        case 0:
          params.phone = phone
          break
        case 1:
          params.email = email
          break
      }
      await sendPhoneOrEmailCodeAjax(type, params, this)
    },
    successCallback () {
      this.form.isSliderSuccess = true
    },
    next () {
      this.$refs[this.formRef].validate(async (valid) => {
        if (!valid) return
        await this.updatePassword()
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
    },
    updatePassword: _.debounce(async function () {
      const {phoneCode, emailCode, googleCode, password} = this.form
      const params = {
        phoneCode,
        newPassword: password,
        mailCode: emailCode,
        googleCode
      }
      const data = await updatePasswordAJAX(params)
      if (!data) return
      this.resetForm()
      this.$router.replace(`/${this.$routes_X.forgetPass}/${this.$routes_X.forgetPassStep3}/${this.username}`)
    }, 500),
    // 重置表单
    resetForm () {
      this.$refs[this.formRef].resetFields()
      this.errorTips = ''
    }
  },
  // filters: {},
  computed: {
    isSuccessValidate () {
      const {phoneCode, emailCode, googleCode} = this.form
      const googleValidateSuccess = (this.$isBindGoogle_X && googleCode) || !this.$isBindGoogle_X
      const phoneValidateSuccess = (this.$isBindPhone_X && phoneCode) || !this.$isBindPhone_X
      const emailValidateSuccess = (this.$isBindEmail_X && emailCode) || !this.$isBindEmail_X
      return googleValidateSuccess && phoneValidateSuccess && emailValidateSuccess && this.isPasswordValidateSuccess
    }
  },
  watch: {
    $language_S_X () {
      this.errorTips = ''
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../../assets/CSS/index.styl'
  .the-forget-pass-step2
    /deep/
    .el-form
        .el-form-item__label
          height 46px
          line-height 46px
        .el-form-item
          margin-bottom 30px
          /* WebKit browsers */
          ::-webkit-input-placeholder
            color: #8B9197
          /* Mozilla Firefox 19+ */
          ::-moz-placeholder
            color: #8B9197
          /* Internet Explorer 10+ */
          :-ms-input-placeholder
            color #8B9197
          .el-input__suffix
            right 15px
          .validate-code
            .el-input__inner
              border-radius 4px 0 0 4px
              border-right none
              height 46px
              vertical-align middle
            .el-input-group__append
              height 45px
              padding 0 10px
              border-left none
              border-radius 0 4px 4px 0
              /* 发送验证码 */
              .count-down
                padding 0 15px
                span
                  font-size 12px !important
          .el-form-item__content
            width 410px
          .el-input
            &.is-disabled
              .el-input__inner
                border none
          .el-input__inner
            height 46px
            font-size 12px
          &.error-tips-form
            margin-bottom 10px
            margin-top -30px
            height 40px
            .iconfont
              font-size 16px
              vertical-align middle
            .error-tips
              margin-left 10px
              font-size 12px
              vertical-align middle
          &.submit
            .el-form-item__content
              margin 0 !important
              width 100%
              text-align center
            .el-button
              width 235px
              height 46px
              border-radius 4px
              &.is-disabled
                background #303757
                color #636777
                box-shadow none
        .forget-tips
          color S_fontColor
    &.night
      /deep/
        .el-form
        .el-form-item__label
          color #fff
        .el-form-item
          .validate-code
            .el-input__inner
              border-right none
            .el-input-group__append
              background-color transparent
              border 1px solid #3F4769
              border-left none
              /* 发送验证码 */
              .count-down
                color S_main_color
                border-left 1px solid S_main_color
                &.is-disabled
                  span
                    color #fff
          .el-input
            &.is-disabled
              .el-input__inner
                border none
          .el-input__inner
            border 1px solid #3F4769
            background-color transparent
            color #fff
          &.error-tips-form
            .iconfont
              color S_error_color
            .error-tips
              color S_error_color
          &.submit
            .el-button
              background linear-gradient(81deg,rgba(42,59,97,1),rgba(18,71,133,1))
              box-shadow 0 3px 8px 0 rgba(0, 0, 0, 0.25)
              border none
              &.is-disabled
                background #303757
                color #636777
                box-shadow none
        .forget-tips
          color S_fontColor
    &.day
      /deep/
        .el-form
          .el-form-item__label
            color #333
          .el-form-item
            .validate-code
              .el-input__inner
                border-right none
              .el-input-group__append
                background-color transparent
                border 1px solid #ddd
                border-left none
                /* 发送验证码 */
                .count-down
                  color S_main_color
                  border-left 1px solid S_main_color
                  &.is-disabled
                    span
                      color #333
            .el-input
              &.is-disabled
                .el-input__inner
                  border none
            .el-input__inner
              border 1px solid #ddd
              background-color transparent
              color #333
            &.error-tips-form
              .iconfont
                color S_error_color
              .error-tips
                color S_error_color
            &.submit
              .el-button
                background linear-gradient(81deg,rgba(49,135,218,1),rgba(106,182,244,1))
                box-shadow 0 3px 6px 0 rgba(26,42,71,0.27)
                border none
                &.is-disabled
                  background rgba(204,204,204,1)
                  box-shadow 0 3px 8px 0 rgba(26,42,71,0.4)
                  color #fff
          .forget-tips
            color S_fontColor
</style>
