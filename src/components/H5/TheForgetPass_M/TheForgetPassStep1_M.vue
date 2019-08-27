<!--
  author: zhaoxinlei
  create: 20190722
  description: 当前组件为 移动端 找回密码 步骤1 组件
-->
<template lang="pug">
  .the-forget-pass-step1-m.night
    el-form(
      :model="form"
      :rules="forgetRule"
      :ref="formRef"
      label-width="0"
      label-position="right"
      @submit.native.prevent="'@submit.native.prevent'"
    )
      el-form-item(
        label=""
        prop="username"
      )
        el-input(
          type="text"
          v-model="form.username"
          @keyup.enter.native="next"
          :placeholder="$t('M.forget_pass_username_tips')"
          clearable
          maxlength="50"
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
import TheCommonSlider from '../../Common/CommonSlider'
import {findPasswordStep1} from '../../../utils/api/user'
import {mapMutations, mapState} from 'vuex'
export default {
  name: 'the-forget-pass-step1-m',
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
      this.$router.replace(`/${this.$routes_X.forgetPass}/m/${this.$routes_X.forgetPassStep2}/${this.form.username}`)
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
    ...mapState({
      remWidth_S: state => state.common.remWidth_S
    }),
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
  .the-forget-pass-step1-m
    fontSize = .5rem
    /deep/
      /* 滑块弹窗 */
      .slider
        display flex
        flex-direction column
        justify-content center
        .el-dialog
          margin-top 0 !important
          height 5rem
          border-radius .15rem
          overflow hidden
          .el-dialog__header
            height 1.2rem
            line-height 1.2rem
            padding-top 0
            .el-dialog__headerbtn
              top .3rem
              right .48rem
              >.el-icon-close
                font-size fontSize
            .el-dialog__title
              padding 0 .5rem
              height 1.2rem
              line-height 1.2rem
              font-size fontSize
              color #fff
          .el-dialog__body
            margin-top 1rem
            display flex
            justify-content center
      .el-form
        >.el-form-item
          margin-bottom 0
          >.el-form-item__content
            >.el-input
              height 1.2rem
              >.el-input__inner
                height 1.2rem
                font-size fontSize
                border-radius .52rem
                padding 0 .6rem
                box-sizing border-box
              >.el-input__suffix
                >.el-input__suffix-inner
                  >.el-input__clear
                    font-size fontSize
                    line-height 1.2rem
                    width 1.2rem
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
            height 1rem
            line-height 1rem
            >.el-form-item__content
              height 1rem
              line-height 1rem
              .iconfont
                font-size .4rem
                vertical-align middle
                color S_error_color
              .error-tips
                margin-left 10px
                font-size .4rem
                vertical-align middle
                color S_error_color
          &.slider-box
            position relative
            margin-bottom 0
            .slider
              position absolute
              z-index 1
              .handler
                height 46px !important
                top -1px
            .checkbox
              position absolute
              display none
          &.submit
            .el-form-item__content
              margin 0 !important
              text-align center
            .el-button
              width 100%
              height 1.2rem
              font-size fontSize
              border none
              border-radius .6rem
              &.is-disabled
                background #303757
                color #636777
                box-shadow none
        .forget-tips
          color S_fontColor
    &.night
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
        .el-form
          .el-form-item__label
            color #fff
          .el-form-item
            .el-input__inner
              border 1px solid #3F4769
              background-color #3F4769
              color #fff
            &.error-tips-form
              .iconfont
                color S_error_color
              .error-tips
                color S_error_color
            &.slider-box
              .slider
                .drag
                  border-color #3F4769
            &.submit
              .el-button
                background linear-gradient(81deg,rgba(18,71,133,1), rgba(42,59,97,1))
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
        /* 滑块弹窗 */
        .slider
          background rgba(204,204,204,.5)
          .el-dialog
            background-color #fff
            .el-dialog__header
              background-color #DCE7F3
              .el-dialog__title
                color #333
        .el-form
          .el-form-item__label
            color #333
          .el-form-item
            .el-input__inner
              border 1px solid #ddd
              background-color transparent
              color #333
            &.error-tips-form
              .iconfont
                color S_error_color
              .error-tips
                color S_error_color
            &.slider-box
              .slider
                .drag
                  border-color #3F4769
            &.submit
              .el-button
                background linear-gradient(81deg,rgba(106,182,244,1), rgba(49,135,218,1))
                box-shadow 0 3px 6px 0 rgba(26,42,71,0.27)
                border none
                &.is-disabled
                  background rgba(204,204,204,1)
                  box-shadow 0 3px 8px 0 rgba(26,42,71,0.4)
                  color #fff
          .forget-tips
            color S_fontColor
</style>
