<!--
  author: zhaoxinlei
  create: 20190722
  description: 当前组件为 忘记密码 步骤1 组件
-->
<template lang="pug">
  .the-forget-pass-step1
    el-form(
      :model="form"
      :rules="forgetRule"
      :ref="formRef"
      label-width="232px"
      label-position="right"
      @submit.native.prevent="'@submit.native.prevent'"
    )
      el-form-item(
        :label="$t('M.forget_pass_username_label')"
        prop="username"
      )
        el-input(
          type="text"
          v-model="form.username"
          @keyup.enter.native="next"
          :placeholder="$t('M.forget_pass_username_tips')"
          clearable
        )
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
        // 下一步
        el-button(
        type="primary"
        :disabled="!isSuccessValidate"
        @click="next"
        ) {{$t(nextBtnText)}}
    //    滑块验证
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
</template>
<script>
import TheCommonSlider from '../../Common/CommonSlider'
import {findPasswordStep1} from '../../../utils/api/user'
import {mapMutations} from 'vuex'
export default {
  name: 'the-forget-pass',
  // mixins: [],
  components: {
    TheCommonSlider
  },
  // props,
  data () {
    let validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error(' '))
        this.errorTips = this.$t('M.login_tips5')
      } else {
        this.errorTips = ''
        callback()
      }
    }
    return {
      form: {
        username: ''
      },
      forgetRule: {
        username: [
          { validator: validateUsername, trigger: 'blur' },
          { validator: validateUsername, trigger: 'change' }
        ]
      },
      formRef: 'forgetPass',
      nextBtnText: 'M.forgetPassword_next_step',
      // 错误提示
      errorTips: '',
      isShowSlider: false
    }
  },
  created () {
    if (this.$getStore('username')) this.form.username = this.$getStore('username')
  },
  // mounted () {},
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    ...mapMutations([
      'SET_STEP1_INFO'
    ]),
    successCallback: _.debounce(async function () {
      this.isShowSlider = false
      const {username} = this.form
      const params = {
        userName: username
      }
      const data = await findPasswordStep1(params)
      if (!data) return
      const {isEnablePhone, isEnableMail, phone, countryCode, isEnableGoogle, email} = _.get(data, 'data')

      let step1UserInfo = {
        userInfo: {
          phoneEnable: isEnablePhone,
          mailEnable: isEnableMail,
          googleEnable: isEnableGoogle,
          country: countryCode,
          phone,
          email,
          notNeedLogin: true
        }
      }
      this.SET_STEP1_INFO(step1UserInfo)
      this.$router.replace(`/${this.$routes_X.forgetPass}/${this.$routes_X.forgetPassStep2}/${this.form.username}`)
    }, 500),
    next () {
      this.$refs[this.formRef].validate((valid) => {
        if (!valid) return
        this.isShowSlider = true
      })
    }
  },
  // filters: {},
  computed: {
    isSuccessValidate () {
      const {username} = this.form
      return username
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
  .the-forget-pass-step1
    /*background-color pink*/
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
      .el-form
        .el-form-item__label
          height 46px
          line-height 46px
          color #fff
        .el-form-item
          margin-bottom 10px
          .el-form-item__content
            width 410px
          .el-input__inner
            border 1px solid #3F4769
            background-color transparent
            height 46px
            color #fff
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
          &.error-tips-form
            margin-bottom 30px
            height 40px
            .iconfont
              font-size 16px
              vertical-align middle
              color S_error_color
            .error-tips
              margin-left 10px
              font-size 12px
              color S_error_color
          &.slider-box
            position relative
            margin-bottom 0
            /*background-color pink*/
            .slider
              position absolute
              z-index 1
              .drag
                border-color #3F4769
              .handler
                height 46px !important
                top -1px
            .checkbox
              position absolute
              display none
          &.submit
            .el-form-item__content
              margin 0 !important
              width 780px
              text-align center
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
