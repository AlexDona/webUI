<!--
  author: zhaoxinlei
  create: 20190815
  description: 当前页面为 移动端登录 页面
-->
<template lang="pug">
  .the-login-m(:style="{height: `${windowHeight}px`}")
    // 国家选择列表
    MobileHeader(:isShowLogo="false")
    .inner-box
      img.logo(:src="logoSrc")
      .header
        // 登录
        span.router-item {{$t($globalLabel_X.login)}}
      .content
        el-form.login(
        :model="form"
        :rules="rules"
        :ref="formRef"
        label-width="100px"
        )
          // 用户名
          el-form-item(
          label=""
          label-width="0px"
          prop="username"
          )
            // 请输入邮箱/手机号
            el-input(
            type="text"
            v-model="form.username"
            :placeholder="$t('M.login_user_tips')"
            :autofocus="true"
            @keyup.enter.native="submitForm"
            clearable
            )
          // 密码
          el-form-item.password(
          label=""
          label-width="0px"
          prop="password"
          )
            // 请输入密码
            el-input(
            type="password"
            v-model="form.password"
            :placeholder="$t('M.login_tips2')"
            autocomplete="off"
            clearable
            @keyup.enter.native="submitForm"
            )
          //  记住账号
          el-form-item.remember-pass(
          label=""
          label-width="0px"
          )
            .inner-box
              // 记住账号
              el-checkbox(v-model="isRememberUsername") {{$t('M.login_tips7')}}
              //  忘记密码
              a.forget-pass.cursor-pointer(@click="jumpToForgetPass") {{$t($globalLabel_X.forgetPassword)}} ?
          // 登录
          el-form-item.submit(
          label=""
          label-width="0px"
          :class="{disabled: isSubmitButtonDisabled}"
          )
            el-button(
            type="primary"
            @click="submitForm"
            :disabled="isSubmitButtonDisabled"
            ) {{$t($globalLabel_X.login)}}
          .bottom
            // 没有账号？ 立即注册
            span {{$t('M.register_tips')}}
            router-link.forget-pass.font-size12(:to="$mobileRegisterDefaultRouter_G_X") {{$t($globalLabel_X.registerImmediately)}}
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
        TheValidateDialog(@loginForStep2="loginForStep2")
        TheImageDialog(@loginForStep2="loginForStep2")
</template>
<script>
import MobileHeader from '../Common/HeaderForMobile'
import TheCommonSlider from '../Common/CommonSlider'
import CountDownButton from '../Common/CountDownCommon'
import TheValidateDialog from '../User/LoginAndRegister/TheLogin/TheLoginDialog'
import TheImageDialog from '../User/LoginAndRegister/TheLogin/TheImageDialog'
import {EMAIL_REG, GOOGLE_REG} from '../../utils/regExp'
import mixins from '../../mixins/user'
import {
  mapState,
  mapMutations
} from 'vuex'
import {detectOS, getUserAgent, getStore} from '../../utils/index'
import {encrypt} from '../../utils/encrypt'
import {newLoginForStep1AJAX, newLoginForStep2AJAX} from '../../utils/api/user'
export default {
  name: 'the-login-m',
  mixins: [mixins],
  components: {
    TheCommonSlider,
    CountDownButton,
    TheValidateDialog,
    TheImageDialog,
    MobileHeader
  },
  // props,
  data () {
    let validateUserName = (rule, value, callback) => {
      if (!value) {
        // 请输入用户名
        callback(new Error(' '))
        this.loginErrorTips = this.$t('M.login_tips5')
      } else {
        if (!this.form.password) {
          this.$refs[this.formRef].validateField('password')
        }
        this.loginErrorTips = ''
        callback()
      }
    }

    let validatePass = (rule, value, callback) => {
      if (!value) {
        // 请输入密码
        callback(new Error(' '))
        this.loginErrorTips = this.$t('M.login_tips2')
      } else {
        this.loginErrorTips = ''
        callback()
      }
    }

    return {
      form: {
        // 用户名
        username: '',
        // 密码
        password: ''
      },
      formRef: 'the-form-ref',
      rules: {
        username: [
          { validator: validateUserName, trigger: ['blur', 'change'] }
        ],
        password: [
          { validator: validatePass, trigger: ['blur', 'change'] }
        ]
      },

      // 是否记住账号
      isRememberUsername: getStore('rememberUserName') == 'true',
      username: 'username',
      // 是否显示滑块
      isShowSlider: false,
      // isShowSlider: true,
      // 登录表单错误提示
      loginErrorTips: ''
    }
  },
  created () {
    if (this.$isLogin_S_X) {
      this.$goToPage(`/${this.$routes_X.home}`)
    }

    // this.isRememberUserName = this.$getStore('rememberUserName') == 'true'

    this.getLocalUserName()
  },
  mounted () {
    // 禁止双击
    let lastTouchEnd = 0
    document.documentElement.addEventListener('touchend', function (event) {
      let now = Date.now()
      if (now - lastTouchEnd <= 300) {
        event.preventDefault()
      }
      lastTouchEnd = now
    }, false)
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
    jumpToForgetPass (e) {
      e.preventDefault()
      const {username} = this.form
      this.$setStore('username', username)
      this.$goToPage(`/${this.$routes_X.forgetPass}/m`)
    },
    // 获取本地记录密码
    getLocalUserName () {
      let username = this.$getStore(this.username)
      this.isRememberUserName = this.$getStore('rememberUserName') == 'true'
      if (this.isRememberUserName) {
        this.$nextTick(() => {
          this.form.username = username
        })
        this.$forceUpdate()
      }
    },
    submitForm () {
      this.$refs[this.formRef].validate((valid) => {
        if (!valid) return
        this.$setStore(this.username, this.form.username)
        this.loginForStep1()
      })
    },
    successCallback: _.debounce(async function () {
      this.isShowSlider = false
      // this.isShowStep3Dialog = true
      const abnormalLogin = this.$firstLogin_X || !this.$loginIpEquals_X || this.$isBindGoogle_X
      if (this.failureNum >= 3) {
        this.$UPDATE_LOGIN_IMAGE_DIALOG_STATUS_M_X(true)
      } else if (abnormalLogin) {
        // 登录第三步(第一次登录、异常ip)
        this.$UPDATE_LOGIN_STEP2_DIALOG_STATUS_X(true)
      } else {
        this.loginForStep2({})
      }
    }, 500),
    /**
     * 登录第一步
     * @returns {Promise<boolean>}
     */
    async loginForStep1 () {
      const {username, password} = this.form

      // 调用第一接口
      let params = {
        userName: username,
        password: encrypt(password)
      }

      params.type = EMAIL_REG.test(username) ? 'email' : 'phone'
      const data = await newLoginForStep1AJAX(params)
      if (!data) return

      const {googleEnable, mailEnable, phoneEnable, userId, phone, email} = _.get(data, 'data')
      let step1UserInfo = {
        userInfo: {
          phoneEnable,
          mailEnable,
          googleEnable,
          userId,
          phone,
          email,
          notNeedLogin: true
        }
      }
      this.SET_STEP1_INFO({
        ..._.get(data, 'data'),
        ...step1UserInfo
      })
      // 发送验证码
      // 显示滑块验证
      this.isShowSlider = true
    },
    /**
     * 登录第二步
     * @returns {Promise<boolean>}
     */
    loginForStep2: _.debounce(async function ({phoneCode = '', emailCode = '', googleCode = ''}) {
      if (!this.$loginIpEquals_X && this.$firstLogin_X) {
        // 谷歌验证
        if (this.$isBindGoogle_X) {
          if (!googleCode) {
            this.$error_tips_X(`${this.$t('M.comm_please_enter')}${this.$t('M.login_google')}${this.$t('M.comm_code')}`)
            return false
          }
        }

        if (!this.$isBindGoogle_X && this.$isBindPhone_X && !phoneCode) {
          this.$error_tips_X(`${this.$t('M.comm_please_enter')}${this.$t('M.login_telphone')}${this.$t('M.comm_code')}`)
          return false
        }

        if (!this.$isBindGoogle_X && !this.$isBindPhone_X && this.$isBindEmail_X && !emailCode) {
          this.$error_tips_X(`${this.$t('M.comm_please_enter')}${this.$t('M.comm_emailbox')}${this.$t('M.comm_code')}`)
          return false
        }
      }
      if (this.$isBindGoogle_X && !GOOGLE_REG.test(googleCode)) return false
      let params = {
        phone: this.$userInfo_S_X.phone,
        phoneCode,
        email: this.$userInfo_S_X.email,
        emailCode,
        googleCode,
        terminal: getUserAgent(),
        os: detectOS()
      }
      params = this.imageCode ? {...params, code: this.imageCode} : params
      const data = await newLoginForStep2AJAX(params)
      if (!data) return false
      this.SET_STEP1_INFO(_.get(data, 'data'))
      this.$UPDATE_LOGIN_STEP2_DIALOG_STATUS_X(false)
      this.$UPDATE_IMAGE_CODE_M_X('')
      this.userLoginSuccess(_.get(data, 'data'))
    }, 500),
    userLoginSuccess (data) {
      this.USER_LOGIN(data)
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
        `/${this.$routes_X.serverError}`,
        `/${this.$routes_X.registerSuccess}`,
        `/${this.$routes_X.forgetPass}`
      ]
      if (this.$routerTo_X &&
        _.every(notNeedJump, route => !this.$routerTo_X.startsWith(route))
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
      $userInfo_S_X: state => state.user.loginStep1Info,
      // 失败次数
      failureNum: state => state.user.loginStep1Info.failNum,
      imageCode: state => state.user.imageCode_S,
      remWidth_S: state => state.common.remWidth_S,
      logoSrc: state => state.common.logoSrc
    }),
    isSubmitButtonDisabled () {
      const {username, password} = this.form
      return !username || !password
    },
    windowHeight () {
      return window.innerHeight
    }
  },
  watch: {
    $language_S_X () {
      this.loginErrorTips = ''
    },
    'form.username' (New) {
      // 判断登录方式
      if (EMAIL_REG.test(New)) {
        this.SET_LOGIN_TYPE(1)// email
      } else {
        this.SET_LOGIN_TYPE(0)// phone
      }
    },
    isRememberUsername (New) {
      this.$setStore('rememberUserName', New)
      this.$nextTick(() => {
        const { username } = this.form
        New && username ? this.$setStore(this.username, username) : this.$setStore(this.username, '')
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../assets/CSS/index.styl'
  .the-login-m
    fontSize = .5rem
    background-color #24293e
    height 100%
    overflow hidden
    margin-top -50px
    >.inner-box
      padding-bottom 2rem
      background url('../../assets/h5/register-bg-m.png') no-repeat bottom center/100%
      >.logo
        display block
        width 3rem
        margin .85rem auto 1.44rem
      >.header
        text-align center
        margin-bottom 1rem
        .router-item
          color S_main_color
          font-size .8rem
          padding .2rem 0
          border-bottom .03rem solid S_main_color
      >.content
        margin-top 1.6rem
        /deep/
          .el-form.login
            margin .5rem 2rem
            background-color transparent
            >.el-form-item
              margin-bottom .6rem
              >.el-form-item__content
                >.el-input
                  height 1.2rem
                  >.el-input__inner
                    height 1.2rem
                    font-size fontSize
                    border-radius .52rem
                    padding 0 .6rem
                    box-sizing border-box
                    border none
                    background-color #303757
                    color #fff
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
                right 14px
                >.el-input__suffix-inner
                  >.el-input__clear
                    font-size fontSize
                    line-height 1.2rem
                    width .8rem
              /*密码*/
              &.password
                margin-bottom .32rem
              /*记住账号*/
              &.remember-pass
                background-color transparent
                .inner-box
                  display flex
                  justify-content space-between
                  .forget-pass
                    margin-left 5px
                    font-size .4rem
                    color S_main_color
                    line-height .8rem
                  .el-checkbox
                    display flex
                    .el-checkbox__label
                      font-size .4rem
                      line-height .8rem
                      vertical-align middle
                    .el-checkbox__input
                      line-height .8rem
                      vertical-align middle
                      .el-checkbox__inner
                        background-color transparent
                        border-color #8B9197
                        border-radius .03rem
                        vertical-align middle
                        width .4rem
                        height .4rem
                        margin-right .3rem
                        border-width .02rem
                        &:after
                          top 3000px
                          width 0
                          height 0
                          left 3000px
                      &.is-checked
                        .el-checkbox__inner
                          border-color S_main_color
                          background S_main_color url('../../assets/user/checkbox-success-bg.png') no-repeat center center/90% 90%
              &.submit
                text-align center
                margin-bottom .32rem
                .el-button
                  border-radius .6rem
                  border none
                  width 100%
                  height 1.2rem
                  font-size fontSize
                  background linear-gradient(81deg,rgba(18,71,133,1),rgba(42,59,97,1))
                  box-shadow 0 3px 8px 0 rgba(0, 0, 0, 0.25)
                  &.is-disabled
                    background #303757
                    color #636777
                    box-shadow none
            .bottom
              text-align center
              font-size .4rem
              span
                color #8B9197
              a
                color S_main_color
                font-size .4rem
                margin-left .08rem
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
                  font-size fontSize
                  height 1.2rem
                  line-height 1.2rem
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
