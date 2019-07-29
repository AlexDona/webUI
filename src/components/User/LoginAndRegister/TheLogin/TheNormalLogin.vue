<!--
  author: zhaoxinlei
  create: 20190622
  description: 当前组件为 登录页面  用户名密码登录 组件
-->
<template lang="pug">
  .the-normal-login
    // 切换登录方式
    .header
      // 账号登录
      span.router-item.active {{$t('M.login_with_ercode_tips')}}
      // 扫码登录
      router-link.router-item(:to="`/${$routes_X.login}/${$routes_X.scanLogin}`") {{$t('M.login_with_password_tips')}}
    // 主要内容
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
            a.forget-pass.font-size12.cursor-pointer(@click="jumpToForgetPass") {{$t($globalLabel_X.forgetPassword)}} ?
        el-form-item.error-tips-form(
          label=""
          label-width="0px"
        )
          Iconfont.iconfont(
            icon-name="icon-tishi1-copy"
            v-show="loginErrorTips"
          )
          span.error-tips {{loginErrorTips}}
        // 登录
        el-form-item.submit(
        label=""
        label-width="0px"
        )
          el-button(
            type="primary"
            @click="submitForm"
            :disabled="isSubmitButtonDisabled"
          ) {{$t($globalLabel_X.login)}}
        .bottom
          // 没有账号？ 立即注册
          span {{$t('M.register_tips')}}
          router-link.forget-pass.font-size12(:to="`/${$routes_X.login}/${$routes_X.register}/default`") {{$t($globalLabel_X.registerImmediately)}}
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
          :initAfterSuccess="true"
        )
      TheValidateDialog(@loginForStep2="loginForStep2")
      TheImageDialog(@loginForStep2="loginForStep2")
</template>
<script>
import TheCommonSlider from '../../../Common/CommonSlider'
import CountDownButton from '../../../Common/CountDownCommon'
import TheValidateDialog from './TheLoginDialog'
import TheImageDialog from './TheImageDialog'
import {newLoginForStep1AJAX, newLoginForStep2AJAX} from '../../../../utils/api/user'
import {EMAIL_REG, GOOGLE_REG} from '../../../../utils/regExp'
import mixins from '../../../../mixins/user'
import {
  mapState,
  mapMutations
} from 'vuex'
import {detectOS, getUserAgent, getStore} from '../../../../utils/index'
export default {
  name: 'the-normal-login',
  mixins: [mixins],
  components: {
    TheCommonSlider,
    CountDownButton,
    TheValidateDialog,
    TheImageDialog
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
      isRememberUsername: Boolean(getStore('username')),
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
    this.getLocalUserName()
  },
  // mounted () {}
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
      if (username) this.$setStore('username', username)
      this.$goToPage(`/${this.$routes_X.forgetPass}`)
    },
    // 获取本地记录密码
    getLocalUserName () {
      let username = this.$getStore(this.username)
      this.isRememberUserName = Boolean(username)
      if (this.isRememberUserName) {
        this.form.username = username
        this.$forceUpdate()
      }
    },
    submitForm () {
      // this.$setStore(this.username, this.form.username)
      this.$refs[this.formRef].validate((valid) => {
        if (!valid) return
        this.loginForStep1()
      })
    },
    successCallback () {
      this.isShowSlider = false
      // this.isShowStep3Dialog = true
      const abnormalLogin = this.$firstLogin_X || !this.$loginIpEquals_X || this.$isBindGoogle_X
      if (this.failureNum >= 3) {
        this.$UPDATE_LOGIN_IMAGE_DIALOG_STATUS_M_X(true)
      } else if (abnormalLogin) {
        // 登录第三步(第一次登录、异常ip)
        // this.isShowStep3Dialog = true
        this.$UPDATE_LOGIN_STEP2_DIALOG_STATUS_X(true)
      } else {
        this.loginForStep2({})
      }
    },
    /**
     * 登录第一步
     * @returns {Promise<boolean>}
     */
    async loginForStep1 () {
      const {username, password} = this.form

      // 调用第一接口
      // let params = new FormData()
      let params = {
        userName: username,
        password
      }

      params.type = EMAIL_REG.test(username) ? 'email' : 'phone'
      const data = await newLoginForStep1AJAX(params)
      if (!data) return

      this.isRememberUserName ? this.$setStore(this.username, this.form.username) : this.$removeStore(this.username)

      const {googleEnable, mailEnable, phoneEnable, userId, phone, email} = _.get(data, 'data')
      let step1UserInfo = {
        userInfo: {
          phoneEnable,
          mailEnable,
          googleEnable,
          userId,
          phone,
          email
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
    async loginForStep2 ({phoneCode = '', emailCode = '', googleCode = ''}) {
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
    },
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
      imageCode: state => state.user.imageCode_S
    }),
    isSubmitButtonDisabled () {
      const {username, password} = this.form
      return !username || !password
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
      this.$forceUpdate()
      this.$nextTick(() => {
        const { username } = this.form
        New && username ? this.$setStore(this.username, username) : this.$removeStore(this.username)
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../../../assets/CSS/index.styl'
  .the-normal-login
    width S_userWidth
    height 442px
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
        margin 0 14px
        /*background-color pink*/
        height 50px
        line-height 50px
        vertical-align top
        font-size 16px
        font-weight 700
        color #8494A6
        &.active
          color #3a8fde
          border-bottom 1px solid #3a8fde
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
      .el-form.login
        padding 0 38px
        .el-form-item
          margin-bottom 35px
          .el-input__inner
            border-radius 20px
            background-color #3f4769
            border-color transparent
            color S_day_bg
            font-size 12px
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
          .el-checkbox__inner
            background-color transparent
            border-color #8B9197
          .el-checkbox__label
            font-size 12px
            color #8B9197
          .el-checkbox
            &.is-checked
              .el-checkbox__label
                color #3a8fde
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
                background #3a8fde url('../../../../assets/user/checkbox-success-bg.png') no-repeat center center/90% 90%
          /*密码*/
          &.password
            margin-bottom 10px
          /*记住账号*/
          &.remember-pass
            height 30px
            margin-top -10px
            margin-bottom 10px
            .inner-box
              display flex
              justify-content space-between
              .forget-pass
                margin-left 5px
                color #3a8fde
          &.error-tips-form
            margin-bottom 10px
            height 40px
            .iconfont
              font-size 16px
              vertical-align middle
              color S_error_color
            .error-tips
              vertical-align middle
              margin-left 10px
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
        .bottom
          text-align center
          font-size 12px
          span
            color #8B9197
          a
            color #3a8fde
            margin-left 5px
</style>
