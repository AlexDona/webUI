<!--
  author: zhaoxinlei
  create: 20190625
  description: 当前组件为 登录验证图片验证码验证 组件
-->
<template lang="pug">
  el-dialog.image-code-dialog(
    :title="`${$t('M.forget_pass_image_tips')}`"
    :visible="$isShowLoginImageDialog_S_X"
    width="486px"
    :close-on-click-modal="false"
    @close="$UPDATE_LOGIN_IMAGE_DIALOG_STATUS_M_X(false)"
  )
    el-form(
      :model="validateForm"
      :rules="validateRules"
      :ref="validateFormRef"
      label-width="100px"
      @submit.native.prevent="'@submit.native.prevent'"
    )
      //  图形 验证码
      el-form-item(
        label=""
        label-width="0px"
        prop="imageCode"
        @submit.native.prevent="checkImageCode"
      )
        el-input(
          type="text"
          v-model="validateForm.imageCode"
          :autofocus="true"
          @keyup.enter.native.stop="checkImageCode"
          clearable
        )
          template(slot="append")
            .image-button.cursor-pointer(
              @click.prevent.stop="updateImageCode"
            )
              ImageValidate(
                id="login-image"
                :content-width="80"
                :content-height="33"
                :identifyCode="imageCode"
              )
      el-form-item.submit-form(
        label=""
        label-width="0px"
        prop="google"
      )
        // 提交
        el-button(@click="checkImageCode") {{$t('M.comm_sub_time')}}
</template>
<script>
import mixins from '../../../../mixins/user'
import {mapState} from 'vuex'
import ImageValidate from '../../../Common/ImageValidateCommon'
import {checkImageCodeAJAX, updateImageCodeAJAX} from '../../../../utils/api/user'
export default {
  name: 'image-code-dialog',
  mixins: [mixins],
  components: {ImageValidate},
  // props,
  data () {
    return {
      validateForm: {
        // 图片验证码
        imageCode: ''
      },
      validateRules: {},
      validateFormRef: 'the-validate-form',
      // 图片验证码
      imageCode: ''
    }
  },
  created () {
  },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    // ...mapMutations(),
    checkImageCode: _.debounce(async function () {
      let params = {
        code: this.validateForm.imageCode
      }
      const data = await checkImageCodeAJAX(params)
      if (!data) return
      console.log(data)
      this.$UPDATE_LOGIN_IMAGE_DIALOG_STATUS_M_X(false)
      this.$UPDATE_LOGIN_STEP2_DIALOG_STATUS_X(true)
      this.$UPDATE_IMAGE_CODE_M_X(this.validateForm.imageCode)
    }, 500),
    loginForStep2 () {
      this.$emit('loginForStep2', {imgCode: this.validateForm.imageCode})
    },
    updateImageCode: _.debounce(async function () {
      console.log('click')
      const data = await updateImageCodeAJAX()
      if (!data) return
      console.log(data)
      this.imageCode = _.get(data, 'data.code')
    }, 500)
  },
  // filters: {},
  computed: {
    ...mapState({})
  },
  watch: {
    $isShowLoginImageDialog_S_X (New) {
      if (New) this.updateImageCode()
      if (!New) this.validateForm.imageCode = ''
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../../../assets/CSS/index.styl'
  .image-code-dialog
    /*top 21vh*/
    -moz-user-select none
    -webkit-user-select none
    -o-user-select none
    -ms-user-select none
    user-select none
    background-color rgba(11,12,20,.8)
    display flex
    flex-direction column
    justify-content center
    /deep/
      .el-dialog
        margin-top 0 !important
        height 280px
        border-radius 10px
        overflow hidden
        background-color #2b304c
        .el-dialog__header
          height 44px
          line-height 44px
          background-color #25283D
          padding 0 20px
          .el-dialog__title
            color S_day_bg
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
              margin-bottom 35px
              .el-input__inner
                background-color transparent
                border-color #25283D
                color #60678B
                /*padding 2px 0*/
                height 46px
                box-sizing border-box
                border-right none
              .el-input-group__append
                background-color transparent
                border-color #25283D
                border-left none
                padding 0 10px
                .s-canvas
                  display flex
                  flex-direction column
                  justify-content center
              &.submit-form
                text-align center
                .el-button
                  width 235px
                  height 44px
                  color #fff
                  border none
                  background linear-gradient(81deg,rgba(42,59,97,1),rgba(18,71,133,1))
                  box-shadow 0 3px 8px 0 rgba(0, 0, 0, 0.25)
                  border-radius 4px
</style>
