<!--
  author: zhaoxinlei
  create: 20190817
  description: 当前页面为 移动端注册 父 页面
-->
<template lang="pug">
  .the-register-container-m(:style="{height: `${windowHeight}px`}")
    // 国家选择列表
    MobileHeader(:isShowLogo="false")
    .inner-box
      img.logo(:src="logoSrc")
      router-view
</template>
<script>
import {mapState, mapActions, mapMutations} from 'vuex'
import {EMAIL_REG} from '../../utils/regExp'
import mixins from '../../mixins/user'
import MobileHeader from '../Common/HeaderForMobile'
import CountDownButton from '../Common/CountDownCommon'
import TheCommonSlider from '../Common/CommonSlider'
import {formatNumber} from '../../utils'
import {sendPhoneOrEmailCodeAjax, validateNumForUserInput} from '../../utils/commonFunc'
import {newCheckUserExist} from '../../utils/api/user'
export default {
  name: 'the-register-m',
  mixins: [mixins],
  components: {
    MobileHeader,
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
      currentCountry: {},
      keyword: '',
      isShowCountries: false,
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
      hasInviteCode: false,
      // 密码是否检验成功
      isPasswordValidateSuccess: false
    }
  },
  async created () {
    await this.GET_COUNTRY_LIST_ACTION()
    this.initInviteStatus()
    this.initCountry()
    if (this.$isLogin_S_X) this.USER_LOGOUT()
    if (this.countries) {
      this.currentCountry = this.countries[0]
    }
  },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    ...mapActions(['GET_COUNTRY_LIST_ACTION']),
    ...mapMutations(['CHANGE_FOOTER_ACTIVE_NAME']),
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
    formatValidateCode () {
      this.form.validateCode = formatNumber(this.form.validateCode, 0)
    },
    toggleShowCountries () {
      this.isShowCountries = !this.isShowCountries
    },
    initInviteStatus () {
      this.hasInviteCode = this.inviteId && this.inviteId !== 'default' ? true : false
      if (!this.hasInviteCode) return
      this.form.inviteCode = this.inviteId
    },
    toggleCountry (country) {
      this.currentCountry = country
      console.log(this.currentCountry)
      this.isShowCountries = false
    },
    initCountry () {
      if (this.countries.length) {
        const { nationCode } = this.countries[0]
        this.activeNationCode = nationCode
      }
    },
    // 重置表单
    resetForm () {
      this.$refs[this.formRef].resetFields()
      this.loginErrorTips = ''
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
    formatPhone () {
      this.form.phone = formatNumber(this.form.phone, 0)
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
        }
      })
    },
    changeRegType (type) {
      if (type == this.regType) return
      this.regType = type
      this.resetForm()
    }
  },
  // filters: {},
  computed: {
    ...mapState({
      countries: state => state.common.countryAreaList,
      logoSrc: state => state.common.logoSrc,
      remWidth_S: state => state.common.remWidth_S,
      isMobile: state => state.user.isMobile
    }),
    filterCountries () {
      return _.filter(this.countries, country => {
        const {nationCode, chinese, english, abbreviation} = country
        return (nationCode).indexOf(this.keyword) !== -1 ||
          (chinese).indexOf(this.keyword) !== -1 ||
          (english.toUpperCase()).indexOf(this.keyword.toUpperCase()) !== -1 ||
          (abbreviation.toUpperCase()).indexOf(this.keyword.toUpperCase()) !== -1
      })
    },
    isPhoneRegist () {
      return this.regType == this.phone_X
    },
    isSuccessValidate () {
      const {phone, email, validateCode, password, checkPassword, agreement} = this.form
      let targetValidate = this.isPhoneRegist ? phone : email
      return (targetValidate && validateCode && password && checkPassword && this.isPasswordValidateSuccess && agreement)
    },
    // 映射真实 邀请码
    currentInviteId () {
      return this.inviteId && this.inviteId !== 'default' ? this.inviteId : this.form.inviteCode
    },
    currentNationCode () {
      return _.get(this.currentCountry, 'nationCode')
    },
    currentChineseName () {
      return _.get(this.currentCountry, 'chinese')
    },
    currentEnglishName () {
      return _.get(this.currentCountry, 'english')
    },
    loginRouter () {
      return this.mobile ? `/${this.$routes_X.login}/${this.$routes_X.normalLogin}` : `/${this.$routes_X.login}/${this.$routes_X.normalLogin}`
    },
    windowHeight () {
      return window.innerHeight
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
  @import '../../assets/CSS/index.styl'
  fontSize = .5rem
  .the-register-container-m
    background #272b41 url('../../assets/h5/register-bg-m.png') no-repeat center center/contain
    position relative
    left 50%
    transform translateX(-50%)
    z-index 2400 !important
    >.inner-box
      >.logo
        display block
        width 3rem
        margin .85rem auto 1.44rem
</style>
