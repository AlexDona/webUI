/**
 * author: zhaoxinlei
 * create: 20190826
 * description: 当前js 为 注册 相关 mixins
 */
import {
  // mapGetters,
  mapState,
  mapActions,
  mapMutations
} from 'vuex'
import {formatNumber} from '../utils'
import {validateNumForUserInput} from '../utils/commonFunc'
import {newCheckUserExist, newRegisterAJAX} from '../utils/api/user'
import {encrypt} from '../utils/encrypt'

let mixin = {
  // data () {
  //   return {}
  // },
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
    formatPhone () {
      this.form.phone = formatNumber(this.form.phone, 0)
    },
    formatValidateCode () {
      this.form.validateCode = formatNumber(this.form.validateCode, 0)
    },
    formatInviteCode () {
      this.form.inviteCode = formatNumber(this.form.inviteCode, 0)
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
      if (this.isMobile) {
        this.$goToPage(`${this.$mobileRegisterSuccessRouter_G_X}/${this.currentInviteId || 'default'}`)
      } else {
        this.$goToPage(`${this.$PCRegisterSuccessRouter_G_X}/${this.currentInviteId || 'default'}`)
      }
    },
    initCountry () {
      if (this.countries.length) {
        const { nationCode } = this.countries[0]
        this.activeNationCode = nationCode
      }
    }
  },
  computed: {
    // ...mapGetters({}),
    ...mapState({
      isMobile: state => state.user.isMobile
    }),
    isPhoneRegist () {
      return this.regType == this.phone_X
    },
    isSuccessValidate () {
      const {phone, email, validateCode, password, checkPassword, agreement} = this.form
      let targetValidate = this.isPhoneRegist ? phone : email
      return (targetValidate && validateCode && password && checkPassword && agreement)
    },
    currentInviteId () {
      return this.inviteId && this.inviteId !== this.$routes_X.default ? this.inviteId.trim() : this.form.inviteCode
    }
  }
  // destroyed () {},
  // watch: {}
}
export default mixin
