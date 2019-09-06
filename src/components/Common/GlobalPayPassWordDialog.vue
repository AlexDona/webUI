<!--
  author: zhaoxinlei
  create: 20190605
  description: 当前组件为 全局 交易密码弹窗
-->
<template lang="pug">
  .global-pay-password-dialog(
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
  )
    el-dialog(
      title="交易密码"
      :visible="isShowGlobalPayPass_S"
      :close-on-click-modal="false"
      width="400px"
      @close="UPDATE_PAY_PASSWORD_DIALOG_M(false)"
    )
      el-form(
      :model="form"
      :rules="rules"
      :ref="formRef"
      label-width="100px"
      )
        el-form-item(
        label=""
        label-width="0px"
        prop="payPassword"
        )
          el-input(
          type="password"
          v-model="form.payPassword"
          :placeholder="payPasswordPlaceholder"
          :autofocus="true"
          )
        el-form-item.button(
          label=""
          label-width="0px"
          prop="buyCount"
          align="right"
        )
          .close-pwd-text
            span.cursor-pointer(
              @click.prevent="goToClosePwd"
            ) {{$t('M.user_payPassword_switch')}}
          // 确定取消
          el-button.button.confirm(@click="submitForm") {{$t('M.otc_submit')}}
          // el-button.button(@click="cancelSubmit") {{$t('M.comm_cancel')}}
          .forget-pwd-text
            span.cursor-pointer(
              @click.prevent="goToForgetPwd"
            ) {{$t('M.user_payPassword')}}
</template>
<script>
import {
  mapMutations,
  mapState
} from 'vuex'
export default {
  // name: '',
  // mixins: [],
  // components: {},
  // props,
  data () {
    // 手机号校验
    let validatePaypassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(`${this.payPasswordPlaceholder}`))
      } else {
        callback()
      }
    }
    return {
      form: {
        payPassword: ''
      },
      payPasswordPlaceholder: '请输入交易密码',
      rules: {
        payPassword: [
          { validator: validatePaypassword, trigger: 'blur' },
          { validator: validatePaypassword, trigger: 'change' }
        ]
      },
      formRef: 'form-pay-password'
    }
  },
  created () {
    // this.UPDATE_PAY_PASSWORD_DIALOG_M(true)
  },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    ...mapMutations([
      'UPDATE_PAY_PASSWORD_DIALOG_M',
      'UPDATE_PAY_PASSWORD_M',
      'CHANGE_REF_ACCOUNT_CREDITED_STATE',
      'CHANGE_USER_CENTER_ACTIVE_NAME'
    ]),
    submitForm () {
      this.$refs[this.formRef].validate(async (valid) => {
        console.log(valid)
        if (!valid) return false
        this.UPDATE_PAY_PASSWORD_M(this.form.payPassword)
        await this.$emit('next')
      })
    },
    cancelSubmit () {
      this.UPDATE_PAY_PASSWORD_DIALOG_M(false)
    },
    // 重置表单
    resetForm () {
      this.form.payPassword = ''
      this.$refs[this.formRef].resetFields()
    },
    // 暂时关闭交易密码验证
    goToClosePwd () {
      this.CHANGE_REF_ACCOUNT_CREDITED_STATE(true)
      this.$goToPage('/PersonalCenter')
      this.CHANGE_USER_CENTER_ACTIVE_NAME('personal-setting')
    },
    // 忘记交易密码
    goToForgetPwd () {
      this.$goToPage('/TransactionPassword')
    }
  },
  // filters: {},
  computed: {
    ...mapState({
      isShowGlobalPayPass_S: state => state.common.isShowGlobalPayPass_S
    })
  },
  watch: {
    $isShowGlobalPayPass_S_X (New) {
      // console.log(New)
      if (!New) this.resetForm()
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../assets/CSS/index.styl'
  .global-pay-password-dialog
    /deep/
    .el-dialog__wrapper
      background-color rgba(0,0,0,0.5)
      .el-dialog
        height 240px
        border-radius 4px
        overflow hidden
        background-color transparent
        .el-dialog__header
          padding-top 10px
          background-color #212b3f
          .el-dialog__title
            font-size 14px
            color #CFD5DF
          .el-dialog__headerbtn
            top 14px
        .el-dialog__body
          background-color #28334a
          padding-top 25px
        .el-input__inner
          font-size 12px
          background-color #1a2233
          border-color #485776
          color #fff
        .el-form-item
          &.is-success
            .el-input__inner
              border-color #485776
          &.button
            margin-top 22px
        .close-pwd-text,
        .forget-pwd-text
          height 16px
          line-height 16px
          text-align left
          font-size 12px
          color S_main_color
        .forget-pwd-text
          text-align right
          margin-top 5px
        .close-pwd-text
          margin-bottom 4px
        .el-button--default
          height 36px
          line-height 36px
          padding 0 20px
          width 100%
          border 1px solid rgba(51,143,245,1)
          border-radius 4px
          background-color transparent
          color #fff
          font-size 12px
          &.confirm
            background linear-gradient(90deg, rgba(18, 71, 133, 1) 0%, rgba(42, 59, 97, 1) 100%)
            border none
    &.day
      /deep/
        background-color S_day_bg
        .el-dialog__wrapper
          background-color rgba(0,0,0,0.5)
          .el-dialog
            background-color transparent
            .el-dialog__header
              background-color #dce7f3
              .el-dialog__title
                color #333
            .el-dialog__body
              background-color S_day_bg
            .el-input__inner
              background-color S_day_bg
              border-color #dcdfe6
              color #333
            .el-form-item
              &.is-success
                .el-input__inner
                  border-color rgba(236,241,248,1)
            .el-button--default
              border 1px solid rgba(51,143,245,1)
              background-color transparent
              color #333
              &.confirm
                background linear-gradient(90deg, rgba(106, 182, 244, 1) 0%, rgba(49, 135, 218, 1) 100%)
                color #fff
                border none
</style>
