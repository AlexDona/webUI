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
          // 确定取消
          el-button.button.confirm(@click="submitForm") {{$t('M.comm_confirm')}}
          el-button.button(@click="cancelSubmit") {{$t('M.comm_cancel')}}
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
      'UPDATE_PAY_PASSWORD_M'
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
      display flex
      flex-direction column
      justify-content center
      .el-dialog
        margin-top 0 !important
        height 240px
        border-radius 10px
        overflow hidden
        background-color transparent
        .el-dialog__header
          padding-top 10px
          background-color #20293c
          .el-dialog__title
            color #fff
          .el-dialog__headerbtn
            top 14px
          /*margin-bottom 10px*/
        .el-dialog__body
          background-color #28334a
          padding-top 40px
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
            margin-top 40px
        .el-button--default
          height 36px
          line-height 36px
          padding 0 20px
          margin-left 30px
          border 1px solid rgba(51,143,245,1)
          border-radius 4px
          background-color transparent
          color #fff
          font-size 16px
          &.confirm
            background linear-gradient(81deg,rgba(43,57,110,1) 0%,rgba(42,80,130,1) 100%)
            border none
    &.day
      /deep/
        background-color S_day_bg
        .el-dialog__wrapper
          background-color rgba(0,0,0,0.5)
          .el-dialog
            background-color transparent
            .el-dialog__header
              background-color S_day_bg
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
                  border-color #485776
            .el-button--default
              border 1px solid rgba(51,143,245,1)
              background-color transparent
              color #333
              &.confirm
                background linear-gradient(81deg,rgba(43,57,110,1) 0%,rgba(42,80,130,1) 100%)
                color #fff
</style>
