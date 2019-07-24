<!--
  author: zhaoxinlei
  create: 20190720
  description: 当前组件为 注册 组件
-->
<template lang="pug">
  .the-phone-register
    // 切换注册方式
    .header
      span.router-item(
        @click="changeRegType(phone_X)"
        :class="{active: isPhoneRegist}"
      ) 手机注册
      span.router-item(
        @click="changeRegType(email_X)"
        :class="{active: !isPhoneRegist}"
      ) 邮箱注册
    // 主要内容
    .content
      el-form.register(
        :model="form"
        :rules="rules"
        :ref="formRef"
        label-width="100px"
        :class="{'phone': isPhoneRegist}"
      )
        // 国家选择
        el-form-item(
          label=""
          label-width="0px"
          :class="{'phone':isPhoneRegist}"
          prop="phone"
        )
          el-select.countries(
            v-model="location"
            :popper-class="`${$theme_S_X == 'day' ? 'day': 'night'} countries`"
            placeholder=""
          )
            el-option(
              v-for="country in countries"
              :key="country['chinese']"
              :value="country.abbreviation"
              :label="!isPhoneRegist ? `${country[$isChineseLanguage_G_X ? 'chinese': 'english']}`: `${country['nationCode']}`"
            )
              span.float-left {{country[$isChineseLanguage_G_X ? 'chinese': 'english']}}
              span.float-right {{country['nationCode']}}
          // 手机号
          el-input.phone(
            v-show="isPhoneRegist"
            type="text"
            v-model="form.phone"
            placeholder="手机号"
            :autofocus="true"
            autocomplete="off"
            @keyup.enter.native="submitForm"
            clearable
            max-length="11"
          )
        //  邮箱地址
        el-form-item(
          label=""
          label-width="0px"
          prop="email"
          v-show="!isPhoneRegist"
        )
          el-input(
            type="text"
            v-model="form.email"
            placeholder="邮箱地址"
            autocomplete="off"
            @keyup.enter.native="submitForm"
            clearable
          )
        // 邮箱验证码、短信验证码
        el-form-item(
          label=""
          label-width="0px"
          prop="validateCode"
        )
          el-input.validate-code(
          type="text"
          v-model="form.validateCode"
          :placeholder="isPhoneRegist ? phonePlaceHolder : emailPlaceHolder"
          autocomplete="off"
          @keyup.enter.native="submitForm"
          clearable
          )
            // 发送验证码
            template(slot="append")
              CountDownButton.count-down(
                :status="isPhoneRegist ? disabledOfPhoneBtn : disabledOfEmailBtn"
                @run="sendPhoneOrEmailCode()"
              )
        //  密码
        el-form-item(
          label=""
          label-width="0px"
          prop="password"
        )
          el-input(
          type="password"
          v-model="form.password"
          placeholder="密码"
          autocomplete="off"
          @keyup.enter.native="submitForm"
          clearable
          )
        //  确认密码
        el-form-item(
          label=""
          label-width="0px"
          prop="checkPassword"
        )
          el-input(
          type="password"
          v-model="form.checkPassword"
          placeholder="确认密码"
          autocomplete="off"
          @keyup.enter.native="submitForm"
          clearable
          )
        //  邀请码
        el-form-item(
          label=""
          label-width="0px"
        )
          el-input(
            type="text"
            v-model="form.inviteCode"
            placeholder="邀请码"
            autocomplete="off"
            :disabled="hasInviteCode"
            @keyup.enter.native="submitForm"
            clearable
          )
        //  用户协议
        el-form-item.agreement(
          label=""
          label-width="0px"
          prop="agreement"
        )
          el-checkbox(v-model="form.agreement")
            span {{agreementTips}}
            a.agreement(
            :href="`/${$routes_X.userAgreement}`"
            target="_blank"
            ) 《{{agreementText}}》
        el-form-item.error-tips-form(
          label=""
          label-width="0px"
        )
          span.error-tips {{loginErrorTips}}
        //    点击注册
        el-form-item.submit(
        label=""
        label-width="0px"
        )
          el-button.reg-button(
            type="primary"
            :disabled="!isSuccessValidate"
            @click="submitForm"
          ) {{regButtonText}}
      //      滑块验证
      el-dialog.slider(
        :label="$t('M.login_dialog_title_label_04')"
        :visible.sync="isShowSlider"
        width="400px"
      )
        CommonSlider(
        propMaxWidth="330"
        height="50"
        barWidth="50"
        @successCallback="successCallback"
        :initAfterSuccess="true"
        )
</template>
<script>
import TheCommonSlider from '../../../Common/CommonSlider'
import CountDownButton from '../../../Common/CountDownCommon'
import {EMAIL_REG} from '../../../../utils/regExp'
import mixins from '../../../../mixins/user'
import {
  mapState,
  mapMutations
} from 'vuex'
import {sendPhoneOrEmailCodeAjax} from '../../../../utils/commonFunc'
export default {
  name: 'the-phone-register',
  mixins: [mixins],
  components: {
    TheCommonSlider,
    CountDownButton
  },
  props: ['inviteId'],
  data () {
    // 手机号校验
    let validatePhone = (rule, value, callback) => {
      if (!value && this.isPhoneRegist) {
        this.loginErrorTips = this.$t('M.user_modify_input_phone')
        // 请输入手机号
        callback(new Error(' '))
      } else {
        this.loginErrorTips = ''
        callback()
      }
    }
    // 邮箱校验
    let validateEmail = (rule, value, callback) => {
      if (!value && !this.isPhoneRegist) {
        // 请输入邮箱地址
        callback(new Error(' '))
        this.loginErrorTips = this.$t('M.login_please_input3')
      } else {
        this.loginErrorTips = ''
        callback()
      }
    }
    // 短信验证码、邮箱验证码校验
    let validateCode = (rule, value, callback) => {
      // 请输入验证码
      if (!value) {
        callback(new Error(' '))
        this.loginErrorTips = this.$t('M.user_please_input12')
      } else {
        this.loginErrorTips = ''
        callback()
      }
    }
    // 密码校验
    let validatePass = (rule, value, callback) => {
      if (!value) {
        this.loginErrorTips = this.$t('M.login_tips2')
        // 请输入密码
        callback(new Error(' '))
        this.isPasswordValidateSuccess = false
      } else if (!this.PASS_REG_X.test(value)) {
        this.loginErrorTips = this.$t('M.user_security_info1')
        // 密码请输入8-20位字母和数字组合
        callback(new Error(' '))
        this.isPasswordValidateSuccess = false
      } else {
        this.$refs[this.formRef].validateField('checkPassword')
        this.loginErrorTips = ''
        callback()
      }
    }
    // 确认密码校验
    let validateCheckPass = (rule, value, callback) => {
      if (!value) {
        // 请输入确认密码
        callback(new Error(' '))
        this.loginErrorTips = this.$t('M.comm_please_enter') + this.$t('M.forgetPassword_affirm_password')
        this.isPasswordValidateSuccess = false
      } else if (value !== this.form.password) {
        this.loginErrorTips = this.$t('M.user_security_info2')
        this.isPasswordValidateSuccess = false
        // 密码不一致，请重新确认
        callback(new Error(' '))
      } else if (!this.PASS_REG_X.test(value)) {
        this.loginErrorTips = this.$t('M.user_security_info1')
        // 密码请输入8-20位字母和数字组合
        callback(new Error(' '))
        this.isPasswordValidateSuccess = false
      } else {
        this.loginErrorTips = ''
        this.isPasswordValidateSuccess = true
        callback()
      }
    }
    // 用户协议
    let validateAgreement = (rule, value, callback) => {
      console.log(value)
      if (!value) {
        // 请勾选用户协议
        callback(new Error(' '))
        this.loginErrorTips = this.$t('M.forgetPassword_hint13')
      } else {
        this.loginErrorTips = ''
        callback()
      }
    }
    return {
      form: {
        phone: '',
        email: '',
        validateCode: '',
        password: '',
        checkPassword: '',
        agreement: false,
        inviteCode: ''
      },
      formRef: 'the-register-form-ref',
      rules: {
        phone: [
          { validator: validatePhone, trigger: 'change' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        email: [
          { validator: validateEmail, trigger: 'blur' },
          { validator: validateEmail, trigger: 'change' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' },
          { validator: validatePass, trigger: 'change' }
        ],
        checkPassword: [
          { validator: validateCheckPass, trigger: 'blur' },
          { validator: validateCheckPass, trigger: 'change' }
        ],
        validateCode: [
          { validator: validateCode, trigger: 'blur' },
          { validator: validateCode, trigger: 'change' }
        ],
        agreement: [
          { validator: validateAgreement, trigger: 'change' }
        ]
      },
      phone_X: 'phone',
      email_X: 'email',
      regType: 'phone',
      // 当前选中国家
      location: '',
      // 是否记住账号
      isRememberUsername: true,
      username: 'username',
      phonePlaceHolder: '短信验证码',
      emailPlaceHolder: '邮箱验证码',
      // 是否显示滚动条
      isShowSlider: false,
      // isShowSlider: true,
      hiddenUsername: '',
      // 步骤3 手机验证码
      step3PhoneMsgCode: '',
      // 步骤3 邮箱验证码
      step3EmailMsgCode: '',
      // 步骤3 谷歌验证码
      step3GoogleMsgCode: '',
      // 登录表单错误提示
      loginErrorTips: '',
      regButtonText: '注册',
      agreementTips: '我已阅读并同意',
      agreementText: '用户协议',
      hasInviteCode: false,
      // 密码是否检验成功
      isPasswordValidateSuccess: false
    }
  },
  created () {
    this.initInviteStatus()
  },
  mounted () {
    this.resetForm()
  },
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    ...mapMutations([
      'SET_LOGIN_TYPE',
      'SET_STEP1_INFO',
      'USER_LOGIN'
    ]),
    // 发送验证码（短信、邮箱）
    async sendPhoneOrEmailCode (type) {
      this.activeCountryCodeWithEmail = _.filter(this.countries, {abbreviation: this.location})[0].nationCode
      if (this.disabledOfPhoneBtn || this.disabledOfEmailBtn) {
        return false
      }
      let params = {}
      switch (type) {
        case 0:
          // if (!this.checkoutInputFormat(type, this.phoneNum)) {
          //   return false
          // }
          params.phone = this.phoneNum
          params.nationCode = this.activeCountryCodeWithPhone
          break
        case 1:
          // if (!this.checkoutInputFormat(type, this.emailNum)) {
          //   return false
          // }
          params.email = this.emailNum
          params.nationCode = this.activeCountryCodeWithEmail
          break
      }
      await sendPhoneOrEmailCodeAjax(type, params, this)
    },
    initInviteStatus () {
      this.hasInviteCode = this.inviteId && this.inviteId !== 'default' ? true : false
      if (!this.hasInviteCode) return
      this.form.inviteCode = this.inviteId
    },
    changeRegType (type) {
      this.regType = type
      this.resetForm()
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
    // 重置表单
    resetForm () {
      this.$refs[this.formRef].resetFields()
      this.loginErrorTips = ''
    },
    successCallback () {
      console.log('success')
      this.isShowSlider = false
      // this.isShowStep3Dialog = true
      const abnormalLogin = this.$firstLogin_X || !this.$loginIpEquals_X || this.$isBindGoogle_X
      if (abnormalLogin) {
        // 登录第三步(第一次登录、异常ip)
        // this.isShowStep3Dialog = true
        this.$UPDATE_LOGIN_STEP2_DIALOG_STATUS_X(true)
        if (!this.$isBindGoogle_X) {
          this.$sendPhoneOrEmailCode_X()
        }
      } else {
      }
    },
    userLoginSuccess () {
      this.USER_LOGIN()
      console.log(this.$routerTo_X)
      const {isJumpToPersonal, type, coinName} = this.$route.query
      if (isJumpToPersonal) {
        this.CHANGE_USER_CENTER_ACTIVE_NAME('assets')
        this.$goToPage('/PersonalCenter', {
          coinName,
          type
        })
        return false
      }
      let notNeedJump = [
        `/${this.$routes_X.register}`,
        `/${this.$routes_X.login}`,
        `/${this.$routes_X.ForgetPassword}`,
        `/${this.$routes_X.nofind404}`,
        `/${this.$routes_X.serverError}`
      ]
      console.log(_.every(notNeedJump, route => !this.$routes_X.startsWith(route)))
      if (this.$routerTo_X &&
        _.every(notNeedJump, route => !this.$routes_X.startsWith(route))
      // !this.$routerTo_X.startsWith('/register') &&
      // !this.$routerTo_X.startsWith('/login') &&
      // !this.$routerTo_X.startsWith('/ForgetPassword') &&
      // !this.$routerTo_X.startsWith('/nofind404') &&
      // !this.$routerTo_X.startsWith('/500')
      ) {
        this.$goToPage(this.$routerTo_X)
      } else {
        this.$goToPage(`/${this.$routes_X.home}`)
      }
    }
  },
  // filters: {},
  computed: {
    ...mapState({
      countries: state => state.common.countryAreaList,
      disabledOfPhoneBtn: state => state.user.disabledOfPhoneBtn,
      disabledOfEmailBtn: state => state.user.disabledOfEmailBtn
    }),
    isSubmitButtonDisabled () {
      const {username, password} = this.form
      return !username || !password
    },
    isPhoneRegist () {
      return this.regType == this.phone_X
    },
    isSuccessValidate () {
      const {phone, email, validateCode, password, checkPassword, agreement} = this.form
      let targetValidate = this.isPhoneRegist ? phone : email
      return (targetValidate && validateCode && password && checkPassword && this.isPasswordValidateSuccess && agreement)
    }
  },
  watch: {
    countries () {
      if (this.countries.length) {
        const { nationCode } = this.countries[0]
        this.location = nationCode
      }
    },
    'form.username' (New) {
      // 判断登录方式
      if (EMAIL_REG.test(New)) {
        console.log('email')
        let str = `${New}`.split('@')[0]
        let str1 = New.split('@')[1]
        this.hiddenUsername = `${str.substring(0, 3)} **** @${str1}`
        this.SET_LOGIN_TYPE(1)// email
      } else {
        this.SET_LOGIN_TYPE(0)// phone
        let str = `${New}`
        this.hiddenUsername = `${str.substring(0, 3)} **** ${str.substring(7)}`
      }
    },
    isPasswordValidateSuccess (New) {
      console.log(New)
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../../../assets/CSS/index.styl'
  .the-phone-register
    width S_userWidth
    height 572px
    border-radius 10px
    overflow hidden
    background linear-gradient(201deg,rgba(52,59,98,1) 0%,rgba(37,40,61,1) 100%)
    box-shadow 0 4px 9px 0 rgba(28,31,50,0.6)
    >.header
      height 130px
      padding-bottom 50px
      padding-top 40px
      text-align center
      >.router-item
        cursor pointer
        display inline-block
        margin 0 30px
        /*background-color pink*/
        height 50px
        line-height 50px
        vertical-align top
        font-size 16px
        font-weight 700
        color #8494A6
        &.active
          color #fff
          border-bottom 1px solid #fff
    /deep/
      /* 滑块弹窗 */
      .slider
        display flex
        flex-direction column
        justify-content center
        background rgba(11,12,20,.8)
        .el-dialog
          margin-top 0
          height 280px
          border-radius 10px
          overflow hidden
          background-color #2b304c
          .el-dialog__header
            height 44px
            line-height 12px
            background-color #25283D
            padding-top 0
            .el-dialog__headerbtn
              top 10px
              .el-dialog__close
                font-size 26px
            .el-dialog__title
              color S_day_bg
              height 44px
              line-height 44px
              display inline-block
          .el-dialog__body
            padding 80px 25px
      /* 注册表单 */
      .el-form.register
        padding 0 38px
        .el-form-item
          margin-bottom 14px
          &.error-tips-form
            margin-bottom 0 !important
            height 40px
            .error-tips
              font-size 12px
              color S_error_color
          &.agreement
            margin-bottom 0 !important
            height 20px !important
            .el-form-item__content
              line-height 20px
          .validate-code
            .el-input__inner
              border-radius 20px 0 0 20px
            .el-input-group__append
              background-color #3f4769
              padding 0 10px
              border: none
              border-radius 0 20px 20px 0
              /* 发送验证码 */
              .count-down
                color #2f78ca
                border-left 1px solid #375683
                padding 0 20px 0 10px
                span
                  font-size 12px !important
          /* 邮箱注册国家选择器 */
          .el-select
            display block
          /* 手机国家选择器 */
          &.phone
            .el-form-item__content
              display flex
            .el-select
              >.el-input
                >.el-input__inner
                  width 80px
                  border-radius 20px 0 0 20px
            .el-input
              &.phone
                .el-input__inner
                  border-radius 0 20px 20px 0
          .el-input__inner
            border-radius 20px
            background-color #3f4769
            border-color transparent
            color S_day_bg
            font-size 12px
          .el-checkbox
            &.is-checked
              .el-checkbox__label
                color #2F78CA
            .agreement
              color #2F78CA
          .el-checkbox__inner
            background-color transparent
            border-color #8B9197
          .el-checkbox__label
            font-size 12px
            color #8B9197
          .el-checkbox__input
            .el-checkbox__inner
              &:after
                top 3000px
                width 0
                height 0
                left 3000px
            &.is-checked
              .el-checkbox__inner
                border-color S_main_color
                background #2F78CA url('../../../../assets/user/checkbox-success-bg.png') no-repeat center center/90% 90%
          &.error-tips-form
            margin-bottom 10px
            height 40px
            .error-tips
              font-size 12px
              color S_error_color
          &.submit
            text-align center
            margin-bottom 20px
            .el-button
              padding 12px 30px
              border-radius 20px
              color S_day_bg
              background linear-gradient(81deg,rgba(42,59,97,1),rgba(18,71,133,1))
              box-shadow 0 3px 8px 0 rgba(0, 0, 0, 0.25)
              border none
              font-size 16px
              &.is-disabled
                background #303757
                color #636777
                box-shadow none
        &.phone
          .el-form-item
            margin-bottom 19px
</style>
<style lang="scss">
  .el-select-dropdown.el-popper.countries {
    width: 294px;
    transform: translateY(4%);
  }

  .el-select-dropdown.el-popper.countries.night {
    background-color: #25293d;
  }

  .el-select-dropdown.el-popper.countries.night .popper__arrow::after {
    top: -14px !important;
    border-width: 10px;
    border-bottom-color: #25293d;
  }

  .el-select-dropdown.el-popper.countries.night .el-select-dropdown__item.hover,
  .el-select-dropdown.el-popper.countries.night .el-select-dropdown__item:hover {
    background-color: #16192b !important;
  }
</style>
