<!--
  author: zhaoxinlei
  create: 20190625
  description: 当前组件为 登录二次验证 组件
-->
<template lang="pug">
  el-dialog.msg-email-google-dialog(
    :title="currentTitleText"
    :visible="$isShowLoginStep2Dialog_S_X"
    :width="!isMobile ? '486px' : '11rem'"
    :close-on-click-modal="false"
    @close="$UPDATE_LOGIN_STEP2_DIALOG_STATUS_X(false)"
    :class="{'day':$isDayTheme_G_X,'night':!$isDayTheme_G_X, mobile: isMobile }"
  )
    el-form(
      :model="form"
      :rules="rules"
      :ref="formRef"
      label-width="100px"
      @submit.native.prevent="'@submit.native.prevent'"
    )
      // 短信验证码
      el-form-item.validate-code(
        label=""
        label-width="0px"
        prop="phone"
        v-if="needPhoneValidate"
      )
        el-input(
          type="text"
          v-model="form.phone"
          :autofocus="true"
          :placeholder="`${$t('M.login_please_input1')}`"
          @keyup.enter.native.stop="loginForStep2"
          clearable
        )
          template(slot="append")
            CountDownButton(
              v-if="$isShowLoginStep2Dialog_S_X"
              class="send-code-btn cursor-pointer"
              :status="$disabledOfPhoneBtn_X"
              @run="sendPhoneOrEmailCode(0)"
            )
      // 邮件验证码
      el-form-item(
        label=""
        label-width="0px"
        prop="email"
        v-if="needEmailValidate"
      )
        el-input(
          type="text"
          v-model="form.email"
          :placeholder="`${$t('M.login_please_input2')}`"
          :autofocus="true"
          @keyup.enter.native.stop="loginForStep2"
          clearable
        )
          template(slot="append")
            CountDownButton(
              v-if="$isShowLoginStep2Dialog_S_X"
              class="send-code-btn cursor-pointer"
              :status="$disabledOfEmailBtn_X"
              @run="sendPhoneOrEmailCode(1)"
            )
      //  google 验证码
      el-form-item.google-validate(
        label=""
        label-width="0px"
        prop="google"
        v-if="needGoogleValidate"
      )
        el-input(
          type="text"
          v-model="form.google"
          :autofocus="true"
          :placeholder="$t('M.user_please_input9')"
          @keyup.enter.native.stop="googleAutoLogin"
          clearable
        )
      //
      el-form-item.error-tips-form(
        label=""
        label-width="0px"
      )
        Iconfont.iconfont(
          icon-name="icon-tishi1-copy"
          v-show="loginErrorTips"
        )
        span.error-tips {{loginErrorTips}}
      el-form-item.submit-form(
        label=""
        label-width="0px"
        prop="google"
      )
        // 提交
        el-button(@click="loginForStep2") {{$t('M.comm_sub_time')}}
</template>
<script>
import mixins from '../../../../mixins/user'
import CountDownButton from '../../../Common/CountDownCommon'
import {mapState} from 'vuex'
import {sendPhoneOrEmailCodeAjax} from '../../../../utils/commonFunc'
export default {
  name: 'msg-email-google-dialog',
  mixins: [mixins],
  components: {
    CountDownButton
  },
  // props,
  data () {
    // 手机号校验
    let validatePhone = (rule, value, callback) => {
      if (!value && this.needPhoneValidate) {
        this.loginErrorTips = this.$t('M.login_please_input1')
        // 请输入手机号
        callback(new Error(' '))
      } else {
        this.loginErrorTips = ''
        callback()
      }
    }
    // 邮箱校验
    let validateEmail = (rule, value, callback) => {
      if (!value && this.needEmailValidate) {
        this.loginErrorTips = this.$t('M.login_please_input2')
        // 请输入手机号
        callback(new Error(' '))
      } else {
        this.loginErrorTips = ''
        callback()
      }
    }
    // google校验
    let validateGoogle = (rule, value, callback) => {
      if (!value && this.needGoogleValidate) {
        this.loginErrorTips = this.$t('M.user_please_input9')
        // 请输入手机号
        callback(new Error(' '))
      } else {
        this.loginErrorTips = ''
        callback()
      }
    }
    return {
      form: {
        phone: '',
        email: '',
        google: ''
      },
      rules: {
        phone: [
          { validator: validatePhone, trigger: 'change' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        email: [
          { validator: validateEmail, trigger: 'blur' },
          { validator: validateEmail, trigger: 'change' }
        ],
        google: [
          { validator: validateGoogle, trigger: 'blur' },
          { validator: validateGoogle, trigger: 'change' }
        ]
      },
      loginErrorTips: '',
      formRef: 'the-validate-form',
      titleText: {
        // 短信验证
        phone: 'M.login_dialog_title_label_01',
        // 邮箱验证
        email: 'M.login_dialog_title_label_02',
        // 谷歌验证
        google: 'M.login_dialog_title_label_03'
      }
    }
  },
  // created () {},
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    googleAutoLogin: _.debounce(function () {
      const {google} = this.form
      if (google.length >= 6) {
        this.loginForStep2()
      }
    }, 300),
    loginForStep2 () {
      this.$refs[this.formRef].validate((valid) => {
        if (!valid) return
        const {phone, email, google} = this.form
        this.$emit('loginForStep2', {
          phoneCode: phone,
          emailCode: email,
          googleCode: google
        })
      })
    },
    /**
     * 发送短信验证码或邮箱验证码
     */
    sendPhoneOrEmailCode (loginType) {
      if (this.$disabledOfPhoneBtn_X || this.$disabledOfEmailBtn_X) {
        return false
      }

      let params = {
        userId: this.$userInfo_X.userId
      }
      switch (loginType) {
        case 0:
          params.phone = this.$userInfo_X.phone
          break
        case 1:
          params.email = this.$userInfo_X.email
          break
      }
      sendPhoneOrEmailCodeAjax(loginType, params, this).catch((err) => {
        console.log(err)
      })
    }
  },
  // filters: {},
  computed: {
    ...mapState({
      isMobile: state => state.user.isMobile
    }),
    needPhoneValidate () {
      return this.$isBindPhone_X && !this.$isBindGoogle_X
    },
    needEmailValidate () {
      return this.$isBindEmail_X && !this.$isBindPhone_X && !this.$isBindGoogle_X
    },
    needGoogleValidate () {
      return this.$isBindGoogle_X
    },
    phone () {
      return _.get(this.$userInfo_S_X, 'phone')
    },
    email () {
      return _.get(this.$userInfo_S_X, 'email')
    },
    currentTitleText () {
      const {phone, email, google} = this.titleText
      let targetText = this.$isBindGoogle_X ? google : this.$isBindPhone_X ? phone : email
      return this.$t(targetText)
    }
  },
  watch: {
    $isShowLoginStep2Dialog_S_X (New) {
      if (New) {
        if (!this.$isBindGoogle_X) {
          this.sendPhoneOrEmailCode(this.$isBindPhone_X ? 0 : 1)
        }
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../../../assets/CSS/index.styl'
  .msg-email-google-dialog
    fontSize = .5rem
    -moz-user-select none
    -webkit-user-select none
    -o-user-select none
    -ms-user-select none
    user-select none
    display flex
    flex-direction column
    justify-content center
    /deep/
      .el-dialog
        margin-top 0 !important
        height 280px
        border-radius 10px
        overflow hidden
        .el-dialog__header
          height 44px
          line-height 44px
          padding 0 20px
          .el-dialog__title
            height 44px
            line-height 44px
            display inline-block
          .el-dialog__headerbtn
            top 10px
            .el-dialog__close
              font-size 26px
        .el-dialog__body
          padding 65px 25px 0
          .el-form
            .el-form-item
              margin-bottom 0
              /* WebKit browsers */
              ::-webkit-input-placeholder
                color: #8B9197
              /* Mozilla Firefox 19+ */
              ::-moz-placeholder
                color: #8B9197
              /* Internet Explorer 10+ */
              :-ms-input-placeholder
                color #8B9197
              &.error-tips-form
                margin-bottom 0 !important
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
              .el-input__inner
                height 44px
                border-right none
                font-size 12px
              .el-input-group__append
                .count-down
                  padding 0
                  span
                    font-size 12px !important
              &.submit-form
                text-align center
                .el-button
                  width 235px
                  height 44px
                  border none
                  border-radius 4px
    &.night
      background-color rgba(11,12,20,.8)
      /deep/
        .el-dialog
          background-color #2b304c
          .el-dialog__header
            background-color #25283D
            .el-dialog__title
              color S_day_bg
          .el-dialog__body
            .el-form
              .el-form-item
                &.error-tips-form
                  .iconfont
                    color S_error_color
                  .error-tips
                    color S_error_color
                &.google-validate
                  .el-input__inner
                    border 1px solid #25283D
                .el-input-group__append
                  background-color #1a2233
                  border-color #485776
                  .count-down
                    color S_main_color
                    border-left 1px solid S_main_color
                    &.is-disabled
                      color #fff
                .el-input__inner
                  background-color #1a2233
                  border-color #485776
                  color #fff
                  &:focus
                    border-color S_main_color !important
                    & ~.el-input-group__append
                      border-color S_main_color !important
                &.submit-form
                  .el-button
                    color #fff
                    border none
                    background linear-gradient(81deg,rgba(18,71,133,1), rgba(42,59,97,1))
                    box-shadow 0 3px 8px 0 rgba(0, 0, 0, 0.25)
                .send-code-btn
                  color S_error_color
    &.day
      background-color rgba(204,204,204,.5)
      /deep/
        .el-dialog
          background-color #fff
          .el-dialog__header
            background-color #DCE7F3
            .el-dialog__title
              color #333
          .el-dialog__body
            .el-form
              .el-form-item
                &.error-tips-form
                  .iconfont
                    color S_error_color
                  .error-tips
                    color S_error_color
                &.google-validate
                  .el-input__inner
                    border 1px solid #ddd
                .el-input__inner
                  background-color transparent
                  border-color #ddd
                  color #333
                .el-input-group__append
                  background-color transparent
                  border-color #ddd
                  .count-down
                    color S_main_color
                    border-left 1px solid #aaa
                    &.is-disabled
                      color #333
                &.submit-form
                  .el-button
                    color #fff
                    border none
                    background linear-gradient(81deg,rgba(106,182,244,1), rgba(49,135,218,1))
                    box-shadow 0 3px 6px 0 rgba(26,42,71,0.27)
                .send-code-btn
                  color S_error_color
    &.mobile
      /deep/
        .el-dialog
          margin-top 0 !important
          height 7rem
          border-radius .16rem
          .el-dialog__header
            height 1.2rem
            line-height 1.2rem
            padding 0 .48rem
            .el-dialog__title
              height 1.2rem
              line-height 1.2rem
              display inline-block
              font-size fontSize
            .el-dialog__headerbtn
              top .2rem
              right .48rem
              .el-dialog__close
                font-size fontSize
          .el-dialog__body
            padding 1.48rem .5rem 0
            .el-form
              .el-form-item
                margin-bottom .2rem
                &.validate-code
                  .el-input__inner
                    border-right none
                &.error-tips-form
                  margin-bottom .2rem !important
                  height .64rem
                  .iconfont
                    font-size .4rem
                    vertical-align middle
                    color S_error_color
                  .error-tips
                    vertical-align middle
                    margin-left .16rem
                    font-size .4rem
                    color S_error_color
                .el-input__inner
                  border .016rem solid #485776
                  height 1.2rem
                  line-height 1.2rem
                  border-right none
                  box-sizing border-box
                  padding 0 .48rem
                  font-size .4rem
                  &:focus
                    border-color S_main_color !important
                    & ~.el-input-group__append
                      border-color S_main_color !important
                .el-input__suffix
                  right .22rem
                  >.el-input__suffix-inner
                    >.el-input__clear
                      font-size fontSize
                      line-height 1.2rem
                      width .8rem
                .el-input-group__append
                  border-left none
                  min-width 3rem
                  .count-down
                    padding 0 .3rem
                    span
                      font-size fontSize !important
                &.submit-form
                  text-align center
                  .el-button
                    width 4.83rem
                    height 1.2rem
                    border none
                    border-radius .02rem
                    font-size fontSize
      &.night,&.day
        background-color rgba(11,12,20,.8)
        /deep/
          .el-dialog
            background-color #2b304c
            .el-dialog__header
              background-color #25283D
              .el-dialog__title
                color S_day_bg
            .el-dialog__body
              .el-form
                .el-form-item
                  &.error-tips-form
                    .iconfont
                      color S_error_color
                    .error-tips
                      color S_error_color
                  &.google-validate
                    .el-input__inner
                      border .016rem solid #25283D
                  .el-input__inner
                    background-color #1a2233
                    border-color #485776
                    color #fff
                  .el-input-group__append
                    border .016rem solid #25283D
                    background-color #1a2233
                    border-color #485776
                    border-left none
                    .count-down
                      color S_main_color
                      border-left .016rem solid S_main_color
                      &.is-disabled
                        color #fff
                  &.submit-form
                    .el-button
                      color #fff
                      border none
                      background linear-gradient(81deg,rgba(18,71,133,1), rgba(42,59,97,1))
                      box-shadow 0 3px 8px 0 rgba(0, 0, 0, 0.25)
                  .send-code-btn
                    color S_error_color
</style>
