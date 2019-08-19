<!--
  author: zhaoxinlei
  create: 20190625
  description: 当前组件为 登录验证图片验证码验证 组件
-->
<template lang="pug">
  el-dialog.image-code-dialog(
    :title="`${$t('M.forget_pass_image_tips')}`"
    :visible="$isShowLoginImageDialog_S_X"
    :width="!isMobile ? '486px' : '11rem'"
    :close-on-click-modal="false"
    @close="$UPDATE_LOGIN_IMAGE_DIALOG_STATUS_M_X(false)"
    :class="{'day':$isDayTheme_G_X,'night':!$isDayTheme_G_X,mobile: isMobile }"
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
          :placeholder="$t('M.login_step2_image_tips1')"
          clearable
        )
          template(slot="append")
            .image-button.cursor-pointer(
              @click.prevent.stop="updateImageCode"
            )
              ImageValidate(
                id="login-image"
                :content-width="!isMobile ? 80 : 2.4 * remWidth_S "
                :content-height="!isMobile ? 33 : 1.1 * remWidth_S "
                :identifyCode="imageCode"
                :fontSizeMin="!isMobile ? 14 : .44 * remWidth_S"
                :fontSizeMax="!isMobile ? 38 : 1.2 * remWidth_S"
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
      this.$UPDATE_LOGIN_IMAGE_DIALOG_STATUS_M_X(false)
      this.$UPDATE_LOGIN_STEP2_DIALOG_STATUS_X(true)
      this.$UPDATE_IMAGE_CODE_M_X(this.validateForm.imageCode)
    }, 500),
    loginForStep2 () {
      this.$emit('loginForStep2', {imgCode: this.validateForm.imageCode})
    },
    updateImageCode: _.debounce(async function () {
      const data = await updateImageCodeAJAX()
      if (!data) return
      this.imageCode = _.get(data, 'data.code')
    }, 500)
  },
  // filters: {},
  computed: {
    ...mapState({
      isMobile: state => state.user.isMobile,
      remWidth_S: state => state.common.remWidth_S
    })
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
  fontSize = .5rem
  .image-code-dialog
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
              margin-bottom 35px
              /* WebKit browsers */
              ::-webkit-input-placeholder
                color: #8B9197
              /* Mozilla Firefox 19+ */
              ::-moz-placeholder
                color: #8B9197
              /* Internet Explorer 10+ */
              :-ms-input-placeholder
                color #8B9197
              .el-input__inner
                height 46px
                box-sizing border-box
                border-right none
              .el-input-group__append
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
                .el-input__inner
                  background-color transparent
                  border-color #25283D
                  color #fff
                  border-right none
                  &:focus
                    border-color S_main_color !important
                    & ~.el-input-group__append
                      border-color S_main_color !important
                .el-input-group__append
                  background-color transparent
                  border-color #25283D
                  border-left none
                &.submit-form
                  .el-button
                    color #fff
                    border none
                    background linear-gradient(81deg,rgba(18,71,133,1), rgba(42,59,97,1))
                    box-shadow 0 3px 8px 0 rgba(0, 0, 0, 0.25)
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
                .el-input__inner
                  background-color transparent
                  border-color #ddd
                  color #333
                  border-right none
                .el-input-group__append
                  background-color transparent
                  border-color #ddd
                  border-left none
                &.submit-form
                  .el-button
                    color #fff
                    border none
                    background linear-gradient(81deg,rgba(106,182,244,1), rgba(49,135,218,1))
                    box-shadow 0 3px 6px 0 rgba(26,42,71,0.27)
    &.mobile
      /deep/
        .el-dialog
          height 7rem
          border-radius .16rem
          overflow hidden
          .el-dialog__header
            height 1rem
            line-height 1rem
            padding 0 .48rem
            .el-dialog__title
              height 1rem
              line-height 1rem
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
                margin-bottom .56rem
                .el-input__inner
                  padding 0 .5rem
                  height 1rem
                  line-height 1rem
                  box-sizing border-box
                  border-right none
                  font-size .4rem
                .el-input__suffix
                  right .22rem
                  >.el-input__suffix-inner
                    >.el-input__clear
                      font-size fontSize
                      line-height 1rem
                      width .8rem
                .el-input-group__append
                  hieght 1rem
                  line-hieght 1rem
                  border-left none
                  .s-canvas
                    display flex
                    flex-direction column
                    justify-content center
                &.submit-form
                  text-align center
                  .el-button
                    width 4.83rem
                    height 1rem
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
                  .el-input__inner
                    background-color #1a2233
                    border .016rem solid #485776
                    color #fff
                    border-right none
                  .el-input-group__append
                    background-color #1a2233
                    border .016rem solid #485776
                    width 2.46rem
                    /*border-color #25283D*/
                    border-left none
                  &.submit-form
                    .el-button
                      color #fff
                      border none
                      background linear-gradient(81deg,rgba(18,71,133,1), rgba(42,59,97,1))
                      box-shadow 0 3px 8px 0 rgba(0, 0, 0, 0.25)
</style>
