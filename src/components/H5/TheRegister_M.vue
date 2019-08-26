<!--
  author: zhaoxinlei
  create: 20190815
  description: 当前页面为 移动端注册 页面
-->
<template lang="pug">
  .the-register-m(:style="{height: `${windowHeight}px`}")
    el-collapse-transition
      // 国家选择列表
      .country-select(v-show="isShowCountries")
        el-input.search-area(
          v-model.trim="keyword"
          clearable
          v-show="isShowCountries"
          :placeholder="$t('M.country_select_placeholder')"
          :class="{active: keyword}"
        )
          Iconfont.iconfont(
            icon-name="icon-sousuo"
            slot="prefix"
          )
          // 取消
          template(slot="append")
            // 取消
            el-button.cancel-button(@click="toggleShowCountries") {{$t('M.register_m_cancel')}}
        .countries
          li.country(
            v-for="country in filterCountries"
            @click.stop="toggleCountry(country)"
          )
            span.left {{country[$isChineseLanguage_G_X ? 'chinese': 'english']}}
            span.right {{country['nationCode']}}
    .inner-box
      MobileHeader(:isShowLogo="false")
      img.logo(:src="logoSrc")
      // 切换注册方式
      .header
        .left
          // 手机注册
          span.router-item(
            @click="changeRegType(phone_X)"
            :class="{active: isPhoneRegist}"
          ) {{$t('M.user_security_phone1')}}
        .right
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
          // 当前选中国家
          el-form-item.country-select(
          label=""
          label-width="0px"
          :class="{'phone':isPhoneRegist, 'email': !isPhoneRegist}"
          prop="phone"
          )
            span.current-country(@click="toggleShowCountries")
              span {{isPhoneRegist ? currentNationCode : $isChineseLanguage_G_X ? currentChineseName : currentEnglishName}}
              Iconfont.iconfont(icon-name="icon-jiantou")
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
          el-form-item.validate-code-form(
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
          :class="{disabled: hasInviteCode}"
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
          //    已有账号？ 去登录！
          el-form-item.login(
            label=""
            label-width="0px"
          )
            span {{$t('M.register_m_has_username')}} ？
            router-link(:to="loginRouter") {{$t('M.forget_pass_jump_login_tips')}}
        //      滑块验证
        el-dialog.slider(
          :title="$t('M.login_dialog_title_label_04')"
          :visible.sync="isShowSlider"
          width="11rem"
          :close-on-click-modal="false"
        )
          TheCommonSlider(
          :propMaxWidth="10 * remWidth_S"
          :height="1.2 * remWidth_S"
          :barWidth="1.3 * remWidth_S"
          @successCallback="successCallback"
          )
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
import {newCheckUserExist, newRegisterAJAX} from '../../utils/api/user'
import {encrypt} from '../../utils/encrypt'
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
      hasInviteCode: false
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
      console.log(`${this.$mobileRegisterSuccessRouter_G_X}/${this.currentInviteId}`)
      this.$goToPage(`${this.$mobileRegisterSuccessRouter_G_X}/${this.currentInviteId || 'default'}`)
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
    formatValidateCode () {
      this.form.validateCode = formatNumber(this.form.validateCode, 0)
    },
    toggleShowCountries () {
      this.isShowCountries = !this.isShowCountries
    },
    initInviteStatus () {
      this.hasInviteCode = this.inviteId && this.inviteId !== this.$routes_X.default ? true : false
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
      return (targetValidate && validateCode && password && checkPassword && agreement)
    },
    // 映射真实 邀请码
    currentInviteId () {
      return this.inviteId && this.inviteId !== this.$routes_X.default ? this.inviteId.trim() : this.form.inviteCode
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
      return this.isMobile ? `/${this.$routes_X.login}/m` : `/${this.$routes_X.login}/${this.$routes_X.normalLogin}`
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
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../assets/CSS/index.styl'
  fontSize = .5rem
  .the-register-m
    background-color #24293e
    top 0
    //transform translateX(-50%)
    height 100%
    /* 国家选择列表 */
    >.country-select
      width 100%
      height 100%
      position fixed
      top 0
      z-index 10
      background-color #272b41
      padding .37rem
      >.countries
        margin-top .3rem
        overflow-y auto
        height 100%
        >.country
          height 1.2rem
          line-height 1.2rem
          font-size fontSize
          border-bottom .01rem solid #32364C
          padding 0 .3rem
          display flex
          justify-content space-between
          color #fff
      /deep/
        .search-area
          width 100%
          height 1.2rem
          &.active
            >.el-input__inner
              border-color S_main_color
              height 1.2rem
              font-size fontSize
            >.el-input-group__append
              background-color S_main_color
              border-color S_main_color
              >.cancel-button
                padding 0 .3rem
                font-size fontSize
                border-radius 0.06rem
                color #fff
          >.el-input__inner
            width 100%
            padding 0 1rem
            background-color transparent
            height 1.2rem
            border-radius 0.06rem 0 0 0.06rem
            border .016rem solid #4C5060
            font-size fontSize
            color S_main_color
          >.el-input__suffix
            >.el-input__suffix-inner
              >.el-input__clear
                font-size fontSize
                line-height 1.2rem
                width .8rem
          >.el-input__prefix
            left .3rem
            line-height 1.2rem
            >.iconfont
              font-size fontSize
          >.el-input-group__append
            background-color #4C5060
            border-color #4c5060
            >.cancel-button
              padding 0 .3rem
              font-size fontSize
              border-radius 0.06rem
    >.inner-box
      /*min-height 20rem*/
      height 100%
      background url('../../assets/h5/register-bg-m.png') no-repeat center center/100%
      >.logo
        display block
        width 3rem
        margin .85rem auto 1.44rem
      // 切换注册方式
      >.header
        font-size .8rem
        justify-content center
        margin-bottom .4rem
        display flex
        >.left,>.right
          flex 1
          >.router-item
            white-space nowrap
            padding .3rem 0
            color #8494A6
            &.active
              border-bottom .03rem solid S_main_color
              color S_main_color
        >.left
          text-align right
          margin-right 1.5rem
          >.router-item
            text-align right
      >.content
        margin-top 1.2rem
        overflow hidden
        /deep/
          .el-form
            margin .5rem 2rem
            background-color transparent
            >.el-form-item
              margin-bottom .72rem
              /* WebKit browsers */
              ::-webkit-input-placeholder
                color: #8B9197
              /* Mozilla Firefox 19+ */
              ::-moz-placeholder
                color: #8B9197
              /* Internet Explorer 10+ */
              :-ms-input-placeholder
                color #8B9197
              &.login
                background-color transparent
                text-align center
                >.el-form-item__content
                  font-size fontSize
                  line-height 1.2rem
                  >a
                    color S_main_color
              >.el-form-item__content
                height 1.2rem
                >.el-input
                  height 1.2rem
                  &.is-disabled
                    >.el-input__inner
                      border-radius .6rem
                      background #303757
                      color #636777
                      box-shadow none
                  >.el-input__inner
                    border none
                    height 1.2rem
                    font-size fontSize
                    color #fff
                    border-radius .6rem
                    background-color #3f4769
                    padding 0 .5rem
                  >.el-input__suffix
                    >.el-input__suffix-inner
                      >.el-input__clear
                        font-size fontSize
                        line-height 1.2rem
                        width .8rem
                  >.el-input-group__append
                    width auto
                    background-color transparent
                    border none
                    color S_main_color
                    text-align right
                    >.count-down
                      border-left .016rem solid S_main_color
                      text-align right
                      >span
                        font-size fontSize !important
              /* 国家选择 */
              &.country-select
                >.el-form-item__content
                  display flex
                  background-color #3f4769
                  border-radius .6rem
                  padding 0 .6rem
                  >.current-country
                    position relative
                    min-width 2rem
                    height 1.2rem
                    line-height 1.2rem
                    font-size fontSize
                    color #fff
                    display flex
                    justify-content space-between
                    align-items center
                    >span
                      vertical-align middle
                    >.iconfont
                      font-size .3rem
                      vertical-align middle
                      margin-right .3rem
                    &:before
                      position absolute
                      content ''
                      width 1px
                      height .7rem
                      background-color S_main_color
                      right 0
                      top 50%
                      transform translateY(-50%)
                  >.el-input
                    height 1.2rem
                    >.el-input__inner
                      padding-left .5rem
                      height 1.2rem
                &.email
                  >.el-form-item__content
                    >.current-country
                      flex 1
                      width 100%
                      &:before
                        background-color transparent
              &.validate-code-form
                >.el-form-item__content
                  display flex
                  background-color #3f4769
                  border-radius .6rem
                  padding 0 .6rem
                  .el-input__inner
                    padding 0
              &.agreement
                margin-bottom 0
                background-color transparent
                >.el-form-item__content
                  >.el-checkbox
                    >.el-checkbox__input
                      line-height 1.2rem
                      vertical-align middle
                      .el-checkbox__inner
                        background-color transparent
                        border-color #8B9197
                        border-radius .03rem
                        &:after
                          top 3000px
                          width 0
                          height 0
                          left 3000px
                      &.is-checked
                        .el-checkbox__inner
                          border-color S_main_color
                          background S_main_color url('../../assets/user/checkbox-success-bg.png') no-repeat center center/90% 90%
                      >.el-checkbox__inner
                        vertical-align middle
                        width .4rem
                        height .4rem
                        margin-right .3rem
                        margin-top -.1rem
                    >.el-checkbox__label
                      font-size fontSize
                      line-height 1.2rem
                      vertical-align middle
                      >.agreement
                        color S_main_color
              &.error-tips-form
                background-color transparent
                margin-bottom .2rem
                height .5rem
                .el-form-item__content
                  line-height .5rem
                  >.iconfont
                    font-size .4rem
                    vertical-align middle
                    margin-right .3rem
                  >.error-tips
                    vertical-align middle
                    color S_error_color
                    font-size .4rem
              /* 提交按钮 */
              &.submit
                text-align center
                margin-bottom .5rem
                >.el-form-item__content
                  >.el-button
                    height 1.2rem
                    width 100%
                    background linear-gradient(81deg,rgba(18,71,133,1), rgba(42,59,97,1))
                    box-shadow 0 3px 8px 0 rgba(0, 0, 0, 0.25)
                    border none
                    font-size fontSize
                    color S_day_bg
                    border-radius .6rem
                    &.is-disabled
                      background #303757
                      color #636777
                      box-shadow none
                      border-radius .6rem
          .slider
            background-color rgba(11,12,20,.8)
            display flex
            flex-direction column
            justify-content center
            >.el-dialog
              margin-top 0 !important
              background-color #2b304c
              height 5rem
              border-radius .15rem
              overflow hidden
              >.el-dialog__header
                height 1.2rem
                line-height 1.2rem
                background-color #25283d
                padding 0
                >.el-dialog__title
                  padding 0 .5rem
                  height 1.2rem
                  line-height 1.2rem
                  font-size fontSize
                  color #fff
                >.el-dialog__headerbtn
                  top .3rem
                  right .48rem
                  >.el-icon-close
                    font-size fontSize
              >.el-dialog__body
                margin-top 1rem
                display flex
                justify-content center
</style>
