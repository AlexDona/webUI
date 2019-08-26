<!--
  author: zhaoxinlei
  create: 20190720
  description: 当前组件为 注册 组件
-->
<template lang="pug">
  .the-register-container(
    :class="{'day':$isDayTheme_G_X,'night':!$isDayTheme_G_X }"
  )
    // 切换注册方式
    .header
      // 手机注册
      span.router-item(
        @click="changeRegType(phone_X)"
        :class="{active: isPhoneRegist}"
      ) {{$t('M.user_security_phone1')}}
      // 邮箱注册
      span.router-item(
        @click="changeRegType(email_X)"
        :class="{active: !isPhoneRegist}"
      ) {{$t('M.user_security_email1')}}
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
          TheCountriesSelect.country-select(
            :countries="countries"
            :width="isPhoneRegist ? '80px': '294px'"
            :isShowCode="isPhoneRegist ? true : false"
          )
          // 手机号
          el-input.phone(
            v-show="isPhoneRegist"
            type="text"
            v-model="form.phone"
            :placeholder="$t('M.user_security_phone') + $t('M.user_security_number')"
            :autofocus="true"
            autocomplete="off"
            @keyup.enter.native="submitForm"
            @keyup.native="formatPhone"
            @input.native="formatPhone"
            clearable
            maxlength="11"
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
            :placeholder="$t('M.user_security_email') + $t('M.comm_site')"
            autocomplete="off"
            @keyup.enter.native="submitForm"
            maxlength="50"
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
            :placeholder="isPhoneRegist ? $t(phonePlaceHolder) : $t(emailPlaceHolder)"
            autocomplete="off"
            @keyup.enter.native="submitForm"
            @keyup.native="formatValidateCode"
            @input.native="formatValidateCode"
            clearable
            maxlength="6"
          )
            // 发送验证码
            template(
              slot="append"
            )
              CountDownButton.count-down(
                v-if="isPhoneRegist"
                :key="phone_X"
                :status="$disabledOfPhoneBtn_X"
                @run="sendPhoneOrEmailCode(0)"
              )
              CountDownButton.count-down(
                v-else
                :key="email_X"
                :status="$disabledOfEmailBtn_X"
                @run="sendPhoneOrEmailCode(1)"
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
            :placeholder="$t('M.login_tips2')"
            autocomplete="off"
            @keyup.enter.native="submitForm"
            clearable
            maxlength="20"
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
            :placeholder="$t('M.login_welcome_register_pwd2')"
            autocomplete="off"
            @keyup.enter.native="submitForm"
            clearable
            maxlength="20"
          )
        //  邀请码
        el-form-item(
          label=""
          label-width="0px"
        )
          el-input(
            type="text"
            v-model.trim="form.inviteCode"
            :placeholder="$t('M.invite_code_tips')"
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
            span {{$t(agreementTips)}}
            a.agreement(
              @click.prevent="jumpToUserAgreement"
            ) {{$t(agreementText)}}
        el-form-item.error-tips-form(
          label=""
          label-width="0px"
        )
          Iconfont.iconfont(
            icon-name="icon-tishi1-copy"
            v-show="loginErrorTips"
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
          ) {{$t(regButtonText)}}
      //      滑块验证
      el-dialog.slider(
        :title="$t('M.login_dialog_title_label_04')"
        :visible.sync="isShowSlider"
        width="486px"
        :close-on-click-modal="false"
      )
        TheCommonSlider(
          :propMaxWidth="433"
          :height="46"
          :barWidth="60"
          @successCallback="successCallback"
        )
</template>
<script>
import TheCommonSlider from '../../../Common/CommonSlider'
import CountDownButton from '../../../Common/CountDownCommon'
import {EMAIL_REG} from '../../../../utils/regExp'
import mixins from '../../../../mixins/user'
import TheCountriesSelect from './TheCountriesSelect'
import {
  mapState,
  mapActions,
  mapMutations
} from 'vuex'
import {sendPhoneOrEmailCodeAjax, validateNumForUserInput} from '../../../../utils/commonFunc'
import {newCheckUserExist, newRegisterAJAX} from '../../../../utils/api/user'
import {formatNumber} from '../../../../utils'
import {encrypt} from '../../../../utils/encrypt'
export default {
  name: 'the-register-container',
  mixins: [mixins],
  components: {
    TheCommonSlider,
    CountDownButton,
    TheCountriesSelect
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
      } else if (!EMAIL_REG.test(value)) {
        callback(new Error(' '))
        this.loginErrorTips = this.$t('M.user-fail-reg-mail')
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
      } else if (!this.PASS_REG_X.test(value)) {
        this.loginErrorTips = this.$t('M.user_security_info1')
        // 密码请输入8-20位字母和数字组合
        callback(new Error(' '))
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
      } else if (value !== this.form.password) {
        this.loginErrorTips = this.$t('M.user_security_info2')
        // 密码不一致，请重新确认
        callback(new Error(' '))
      } else if (!this.PASS_REG_X.test(value)) {
        this.loginErrorTips = this.$t('M.user_security_info1')
        // 密码请输入8-20位字母和数字组合
        callback(new Error(' '))
      } else {
        this.loginErrorTips = ''
        callback()
      }
    }
    // 用户协议
    let validateAgreement = (rule, value, callback) => {
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
      // 当前选中国家 国家码
      activeNationCode: '',
      // 是否记住账号
      isRememberUsername: true,
      username: 'username',
      phonePlaceHolder: 'M.phone_code_label',
      emailPlaceHolder: 'M.forgetPassword_verify_style4',
      // 是否显示滚动条
      isShowSlider: false,
      // isShowSlider: true,
      // 登录表单错误提示
      loginErrorTips: '',
      regButtonText: 'M.comm_register_time',
      // 我已阅读并同意
      agreementTips: 'M.forgetPassword_hint6',
      agreementText: 'M.forgetPassword_hint7',
      hasInviteCode: false
    }
  },
  async created () {
    await this.GET_COUNTRY_LIST_ACTION()
    this.initInviteStatus()
    this.initCountry()
    if (this.$isLogin_S_X) this.USER_LOGOUT()
    if (this.inviteId !== this.$routes_X.default && this.isMobile) {
      this.$goToPage(`/${this.$routes_X.register}/${this.$routes_X.invite}/${this.inviteId}`)
    }
  },
  mounted () {
    this.resetForm()
  },
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    ...mapActions([
      'GET_COUNTRY_LIST_ACTION'
    ]),
    ...mapMutations([
      'SET_LOGIN_TYPE',
      'SET_STEP1_INFO',
      'USER_LOGIN',
      'USER_LOGOUT',
      'CHANGE_FOOTER_ACTIVE_NAME',
      'SET_COUNTRY_AREA_LIST'
    ]),
    formatValidateCode () {
      this.form.validateCode = formatNumber(this.form.validateCode, 0)
    },
    formatPhone () {
      this.form.phone = formatNumber(this.form.phone, 0)
    },
    // 发送验证码（短信、邮箱）
    async sendPhoneOrEmailCode (type) {
      this.$refs[this.formRef].validateField(this.isPhoneRegist ? this.phone_X : this.email_X, async (err) => {
        if (err) return
        if (this.$disabledOfPhoneBtn_X || this.$disabledOfEmailBtn_X) {
          return false
        }
        const {phone, email} = this.form
        let params = {
          nationCode: this.activeNationCode
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
      })
    },
    initInviteStatus () {
      this.hasInviteCode = this.inviteId && this.inviteId !== this.$routes_X.default ? true : false
      if (!this.hasInviteCode) return
      this.form.inviteCode = this.inviteId
    },
    changeRegType (type) {
      if (type == this.regType) return
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
                          this.isShowSlider = true
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        } else {
          return false
        }
      })
    },
    // 重置表单
    resetForm () {
      this.$refs[this.formRef].resetFields()
      this.loginErrorTips = ''
    },
    successCallback: _.debounce(async function () {
      this.isShowSlider = false
      // this.isShowStep3Dialog = true
      if (!await this.checkUserExistAjax()) return
      await this.doRegister()
    }, 500),
    // 检测用户名是否存在
    async checkUserExistAjax () {
      const {phone, email} = this.form
      const userName = this.isPhoneRegist ? phone : email
      if (!validateNumForUserInput(this.regType, userName)) {
        let params = {
          userName,
          regType: this.regType
        }
        const data = await newCheckUserExist(params)
        if (!data) return false
        return data
      } else {
        switch (this.regType) {
          case 'phone':
            if (this.checkoutInputFormat(0, userName)) return false
            break
          case 'email':
            if (this.checkoutInputFormat(1, userName)) return false
            break
        }
      }
    },
    jumpToUserAgreement () {
      let routeData = this.$router.resolve({
        path: '/ServiceAndProtocol'
      })
      this.CHANGE_FOOTER_ACTIVE_NAME({
        type: '/ServiceAndProtocol',
        activeName: 'UserProtocol'
      })
      window.open(routeData.href, '_blank')
    },
    // 确定注册
    async doRegister () {
      const { phone, email, password, validateCode } = this.form
      let params = {
        country: this.activeNationCode,
        userName: this.isPhoneRegist ? phone : email,
        password: encrypt(password),
        checkCode: validateCode,
        inviter: this.currentInviteId,
        regType: this.regType
      }
      const data = await newRegisterAJAX(params)
      if (!data) return
      this.resetForm()
      this.$goToPage(`${this.$PCRegisterSuccessRouter_G_X}/${this.inviteId}`)
    },
    initCountry () {
      if (this.countries.length) {
        const { nationCode } = this.countries[0]
        this.activeNationCode = nationCode
      }
    }
  },
  // filters: {},
  computed: {
    ...mapState({
      countries: state => state.common.countryAreaList,
      isMobile: state => state.user.isMobile
    }),
    // 映射真实 邀请码
    currentInviteId () {
      return this.inviteId && this.inviteId !== this.$routes_X.default ? this.inviteId : this.form.inviteCode
    },
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
      return (targetValidate && validateCode && password && checkPassword && agreement)
    }
  },
  watch: {
    $language_S_X () {
      this.loginErrorTips = ''
    },
    countries () {
      this.initCountry()
    },
    'form.username' (New) {
      // 判断登录方式
      if (EMAIL_REG.test(New)) {
        // email
        this.SET_LOGIN_TYPE(1)
      } else {
        // phone
        this.SET_LOGIN_TYPE(0)
      }
    },
    isMobile (New) {
      console.log(New)
      this.$goToPage(
        New ? `/${this.$routes_X.login}/${this.$routes_X.register}/${this.currentInviteId}`
          : `/${this.$routes_X.register}/m/${this.currentInviteId}`
      )
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../../../assets/CSS/index.styl'
  .the-register-container
    width S_userWidth
    height 572px
    border-radius 10px
    overflow hidden
    >.header
      height 130px
      padding-bottom 50px
      padding-top 40px
      text-align center
      >.router-item
        cursor pointer
        display inline-block
        margin 0 14px
        height 50px
        line-height 50px
        vertical-align top
        font-size 16px
        font-weight 700
    /deep/
      /* 滑块弹窗 */
      .slider
        display flex
        flex-direction column
        justify-content center
        .el-dialog
          margin-top 0 !important
          height 280px
          border-radius 10px
          overflow hidden
          .el-dialog__header
            height 44px
            line-height 12px
            padding-top 0
            .el-dialog__headerbtn
              top 10px
              .el-dialog__close
                font-size 26px
            .el-dialog__title
              height 44px
              line-height 44px
              display inline-block
          .el-dialog__body
            padding 80px 25px
      /* 注册表单 */
      .el-form.register
        padding 0 38px
        .el-form-item
          /* WebKit browsers */
          ::-webkit-input-placeholder
            color: #8B9197
          /* Mozilla Firefox 19+ */
          ::-moz-placeholder
            color: #8B9197
          /* Internet Explorer 10+ */
          :-ms-input-placeholder
            color #8B9197
          margin-bottom 14px
          .el-input__suffix
            right 15px
          &.error-tips-form
            margin-bottom 0 !important
            height 40px
            .iconfont
              font-size 16px
              vertical-align middle
            .error-tips
              vertical-align middle
              margin-left 10px
              font-size 12px
          &.agreement
            margin-bottom 0 !important
            height 20px !important
            .el-form-item__content
              line-height 20px
          .validate-code
            .el-input__inner
              border-radius 20px 0 0 20px
            .el-input-group__append
              padding 0 10px
              border-radius 0 20px 20px 0
              /* 发送验证码 */
              .count-down
                padding 0 10px 0 10px
                margin 0 -8px 0 0
                span
                  font-size 12px !important
          /* 邮箱注册国家选择器 */
          .country-select
            .current-country
              border-radius 20px
              padding-left 20px
              vertical-align middle
              .iconfont
                right 20px
          /* 手机国家选择器 */
          &.phone
            .country-select
              .current-country
                border-radius 20px 0 0 20px
                padding-left 20px
                vertical-align middle
                position relative
                &:after
                  position absolute
                  right -2px
                  top 50%
                  transform translateY(-50%)
                  content ''
                  width 0
                  height 14px
                  padding 0
                .iconfont
                  right 5px
            .el-form-item__content
              display flex
              height 40px
              border-radius 20px
              /*overflow hidden*/
            .el-input
              &.phone
                .el-input__inner
                  border-radius 0 20px 20px 0
          .el-input__inner
            border-radius 20px
            font-size 12px
          .el-checkbox__label
            font-size 12px
          .el-checkbox__input
            .el-checkbox__inner
              &:after
                top 3000px
                width 0
                height 0
                left 3000px
          &.error-tips-form
            margin-bottom 10px
            height 40px
            .error-tips
              font-size 12px
          &.submit
            text-align center
            margin-bottom 20px
            .el-button
              padding 12px 30px
              border-radius 20px
              font-size 16px
        &.phone
          .el-form-item
            margin-bottom 19px
    /* 深色主题 */
    &.night
      background linear-gradient(201deg,rgba(52,59,98,1) 0%,rgba(37,40,61,1) 100%)
      box-shadow 0 4px 9px 0 rgba(28,31,50,0.6)
      >.header
        >.router-item
          color #8494A6
          &.active
            color S_main_color
            border-bottom 1px solid S_main_color
      /deep/
        /* 滑块弹窗 */
        .slider
          background rgba(11,12,20,.8)
          .el-dialog
            background-color #2b304c
            .el-dialog__header
              background-color #25283D
              .el-dialog__title
                color S_day_bg
        /* 注册表单 */
        .el-form.register
          .el-form-item
            &.phone
              .el-form-item__content
                background-color #3f4769
            .el-input
              &.is-disabled
                .el-input__inner
                  background #303757
                  color #636777
                  box-shadow none
            &.error-tips-form
              .iconfont
                color S_error_color
              .error-tips
                color S_error_color
            .validate-code
              .el-input-group__append
                background-color #3f4769
                border: none
                /* 发送验证码 */
                .count-down
                  color S_main_color
                  border-left 1px solid S_main_color
                  background-color #3f4769
                  &.is-disabled
                    span
                      color #fff
            /* 邮箱注册国家选择器 */
            .country-select
              .current-country
                background-color #3f4769
            /* 手机国家选择器 */
            &.phone
              .country-select
                .current-country
                  background-color #3f4769
                  &:after
                    border-left 1px solid S_main_color
            .el-input__inner
              background-color #3f4769
              border-color transparent
              color S_day_bg
            .el-checkbox
              &.is-checked
                .el-checkbox__label
                  color S_main_color
              .agreement
                color S_main_color
            .el-checkbox__inner
              background-color transparent
              border-color #8B9197
            .el-checkbox__label
              color #8B9197
            .el-checkbox__input
              &.is-checked
                .el-checkbox__inner
                  border-color S_main_color
                  background S_main_color url('../../../../assets/user/checkbox-success-bg.png') no-repeat center center/90% 90%
            &.error-tips-form
              .error-tips
                color S_error_color
            &.submit
              .el-button
                color S_day_bg
                background linear-gradient(81deg,rgba(18,71,133,1), rgba(42,59,97,1))
                box-shadow 0 3px 8px 0 rgba(0, 0, 0, 0.25)
                border none
                &.is-disabled
                  background #303757
                  color #636777
                  box-shadow none
    /* 白色主题 */
    &.day
      background #fff
      box-shadow 0 2px 6px 0 rgba(0, 0, 0, 0.1)
      >.header
        >.router-item
          color #aaa
          &.active
            color S_main_color
            border-bottom 1px solid S_main_color
      /deep/
        /* 滑块弹窗 */
        .slider
          background rgba(204,204,204,0.5)
          .el-dialog
            background-color #fff
            .el-dialog__header
              background-color rgba(220,231,243,1)
              .el-dialog__title
                color #333
        /* 注册表单 */
        .el-form.register
          .el-form-item
            &.phone
              .el-form-item__content
                background-color #eee
            .el-input
              &.is-disabled
                .el-input__inner
                  background #DBDBDB
                  color #fff
                  box-shadow none
            &.error-tips-form
              .iconfont
                color S_error_color
              .error-tips
                color S_error_color
            .validate-code
              .el-input-group__append
                background-color #eee
                border: none
                overflow hidden
                /* 发送验证码 */
                .count-down
                  color S_main_color
                  border-left 1px solid #aaa
                  background-color #eee
                  &.is-disabled
                    span
                      color #1C1F32
            /* 邮箱注册国家选择器 */
            .country-select
              .current-country
                background-color #eee
                color #1C1F32
            /* 手机国家选择器 */
            &.phone
              .country-select
                .current-country
                  background-color #eee
                  color #1C1F32
                  &:after
                    border-left 1px solid #aaa
            .el-input__inner
              background-color #eee
              border-color transparent
              color #1C1F32
            .el-checkbox
              &.is-checked
                .el-checkbox__label
                  color S_main_color
              .agreement
                color S_main_color
            .el-checkbox__inner
              background-color transparent
              border-color #8B9197
            .el-checkbox__label
              color #8B9197
            .el-checkbox__input
              &.is-checked
                .el-checkbox__inner
                  border-color S_main_color
                  background S_main_color url('../../../../assets/user/checkbox-success-bg.png') no-repeat center center/90% 90%
            &.error-tips-form
              .error-tips
                color S_error_color
            &.submit
              .el-button
                color #fff
                background linear-gradient(81deg,rgba(106,182,244,1), rgba(49,135,218,1))
                box-shadow 0 3px 6px 0 rgba(26,42,71,0.27)
                border none
                &.is-disabled
                  background rgba(204,204,204,1)
                  box-shadow 0 3px 8px 0 rgba(26,42,71,0.4)
</style>
