<!--
  author: zhaoxinlei
  create: 20190626
  description: 当前组件为 个人中心 邀请推广 组件 内 的 邀请推广 码 组件
-->
<template lang="pug">
  .the-invitation-code(
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
  )
    // 推广信息
    .header {{$t('M.comm_user_invite_info')}}
    .content
      // 推广码
      .detail-item
        .left {{ $t('M.comm_user_generalize') }}{{ $t('M.user_invite_yard') }}
        .right.text-align-r
          span.code {{$userInfo_X.showId}}
          button.copy-code(
            v-clipboard:copy="$userInfo_X.showId"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
          )
            Iconfont.iconfont(icon-name="icon-fuzhi1")
            span {{ $t('M.comm_copy') }}
      //  推广链接
      .detail-item
        .left {{ $t('M.comm_user_generalize') }}{{ $t('M.user_invite_link') }}
        .right.text-align-r
          span.code {{inviteUrl}}
          button.qr-code(
            @mouseenter="toggleQrCode(true)"
            @mouseleave="toggleQrCode(false)"
          )
            Iconfont.iconfont(icon-name="icon-erweima2")
            span {{ $t('M.comm_qr_code') }}
            transition(enter-active-class="animated fadeIn")
              .qr-code-box(
                v-show="isShowQrCode"
              )
                QRCode(
                  :value="inviteUrl"
                  :size="110"
                )
          button.copy-code(
            v-clipboard:copy="inviteUrl"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
          )
            Iconfont.iconfont(icon-name="icon-fuzhi1")
            span {{ $t('M.comm_copy') }}
      //  邀请人
      .detail-item.last.invitor
        .left(:title="notInviterTips")
          span {{$t('M.comm_user_inviter')}}
          Iconfont.iconfont(
            v-if="!hasInviter"
            icon-name="icon-warning"
            )
        .right.text-align-r
          // 有邀请人
          span.has-invitor(v-if="hasInviter") {{$userInfo_X.inviter}}

          // 无邀请人
          span.no-invitor(v-if="!hasInviter")
            // 未编辑状态
            span.not-editing(v-show="!isEditing")
              button.start-edit.cursor-pointer(@click="toggleEditing(true)")
                Iconfont.iconfont(icon-name="icon-tianxie")
            // 正在编辑状态
            span.editing(v-show="isEditing")
              input.input(
                :placeholder="$t('M.comm_user_invite_tip2')"
                v-model="inviter"
                @keyup.enter="toggleDialog(true)"
              )
              // 保存
              el-button.save-edit-button(
                @click="toggleDialog(true)"
                :disabled="isSaveButtonDisabled"
              ) {{$t('M.common_save')}}
            // 是否确认回填联系人弹窗
            el-dialog.tip-dialog(
              :title="$t('M.otc_prompt')"
              :visible.sync="isShowTipDialog"
              :close-on-click-modal="false"
              width="320px"
            )
              p
                Iconfont.iconfont(icon-name="icon-jinggao")
                span {{$t(inviter_tips)}}
              .dialog-footer(slot="footer")
                // 取消
                el-button.button(
                  @click="toggleDialog(false)"
                ) {{$t('M.comm_cancel')}}
                // 确定
                el-button.button.submit(
                  @click="editInviter"
                ) {{$t('M.comm_confirm')}}
      // 邀请成功人数
    .inviter-board
      .left
        .top
          span.people {{inviterCount}}
          // 人
          span.people-label {{ $t('M.user_invite_people') }}
        //   成功邀请
        .bottom {{ $t('M.user_invite_succeed') }}{{ $t('M.comm_user_invite') }}
      .right
        // 已获得的佣金预估
        .top
          span.rate {{estimateOfAward}}
          span.rate-label {{activeSymbol}}
        .bottom {{ $t('M.user_invite_have_obtained') }}
</template>
<script>
import mixins from '../../../mixins/user'
import {domain} from '../../../utils/env'
import {editInviterAJAX} from '../../../utils/api/user'
import {mapMutations, mapState, mapActions} from 'vuex'
import {currencyTransform} from '../../../utils/api/personal'
export default {
  name: 'the-invitation-code',
  mixins: [mixins],
  // components: {},
  props: {
    totalSumCNY: {
      type: String
    }
  },
  data () {
    return {
      isShowQrCode: false,
      inviter: '',
      // 人民币转换汇率
      transformRate: '',
      // 是否正在编辑
      isEditing: false,
      // 是否显示提示弹框
      // isShowTipDialog: true,
      isShowTipDialog: false,
      inviter_tips: 'M.user_inviter_tips'
    }
  },
  async created () {
    this.updateRate()
  },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    ...mapActions([
      'REFRESH_USER_INFO_ACTION'
    ]),
    ...mapMutations([]),
    toggleDialog (status) {
      this.isShowTipDialog = status
    },
    async editInviter () {
      if (!this.inviter) return
      const params = {
        inviter: this.inviter
      }
      const data = await editInviterAJAX(params)
      this.toggleDialog(false)
      if (!data) {
        this.inviter = ''
        return
      }
      console.log(data)
      this.REFRESH_USER_INFO_ACTION()
    },
    toggleQrCode (status) {
      this.isShowQrCode = status
    },
    //  点击复制
    onCopy () {
      // 已拷贝
      // let msg = '已拷贝'
      this.$success_tips_X(this.$t('M.comm_have_been_copied'))
    },
    onError () {
      // 拷贝失败，请稍后重试
      // let msg = '拷贝失败，请稍后重试'
      this.$error_tips_X(this.$t('M.comm_copies_failure'))
    },
    // 更新转换汇率
    updateRate () {
      const {BTC} = this.currencyRateList
      if (!BTC) return
      this.updateTransformInfo()
    },
    async updateTransformInfo () {
      const { shortName } = this.activeConvertCurrencyObj
      if (!shortName) return
      const params = {
        coinName: 'FBT',
        shortName: shortName
      }
      const data = await currencyTransform(params)
      if (!data) return false
      // 获取汇率
      this.transformRate = _.get(data, 'data.coinPrice')
    },
    // 切换编辑状态
    toggleEditing (status) {
      this.isEditing = status
    }
  },
  // filters: {},
  computed: {
    ...mapState({
      activeConvertCurrencyObj: state => state.common.activeConvertCurrencyObj, // 目标货币
      currencyRateList: state => state.common.currencyRateList, // 折算货币列表
      inviterCount: state => state.user.invitation_S.page.total
    }),
    inviteUrl () {
      console.log(domain)
      return `${domain}/${this.$routes_X.register}?showId=${this.$userInfo_X.showId}`
    },
    hasInviter () {
      return this.$userInfo_X.inviter
    },
    // 预估佣金
    estimateOfAward () {
      return this.isCNY ? (this.hasAward ? this.$scientificToNumber(this.keep4Num(this.totalSumCNY)) : '0.0000') : (this.hasAward ? this.$scientificToNumber(this.keep4Num(this.totalSumCNY * this.transformRate)) : '0.0000')
    },
    // 是否有邀请奖励
    hasAward () {
      return this.totalSumCNY - 0 > 0
    },
    isCNY () {
      const {shortName} = this.activeConvertCurrencyObj
      return shortName == 'CNY'
    },
    // 当前使用 币种
    activeSymbol () {
      const {shortName} = this.activeConvertCurrencyObj
      return shortName
    },
    notInviterTips () {
      return this.hasInviter ? '' : this.$t('M.comm_user_invite_tip1')
    },
    isSaveButtonDisabled () {
      return !this.inviter
    }
  },
  watch: {
    activeConvertCurrencyObj () {
      this.updateRate()
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../../assets/CSS/index.styl'
  .the-invitation-code
    /*min-height 400px*/
    margin-top 9px
    padding 0 29px
    >.header
      height 50px
      line-height 50px
      border-bottom 1px solid #2D3651
      margin-bottom 19px
    >.content
      min-height 180px
      background-color #232843
      border-radius 2px
      padding 0 14px
      >.detail-item
        height 60px
        line-height 60px
        border-bottom 1px solid #364654
        display flex
        justify-content space-around
        >div
          flex 1
          font-size 12px
        >.left
          text-align left
        >.right
          >.copy-code,>.qr-code
            margin-left 15px
            padding 5px 10px
            background-color S_main_color
            color #fff
            border-radius 2px
            cursor pointer
            font-size 12px
            >.iconfont
              font-size 12px
              margin-right 5px
              vertical-align middle
          >.qr-code
            background-color transparent
            border 1px solid S_main_color
            color S_main_color
            position relative
            >.iconfont
              color S_main_color
            .qr-code-box
              transition all .2s
              width 110px
              height 110px
              position absolute
              top -120px
              left 50%
              transform translateX(-50%)
              border-radius 4px
              overflow hidden
        &.last
          border-bottom none
        &.invitor
          >.left
            .iconfont
              font-size 16px
              color S_main_color
          >.right
            .has-invitor
            .no-invitor
              /deep/
                .tip-dialog
                  background-color rgba(0,0,0,.5)
                  .el-dialog
                    background-color #28334a
                    height 180px
                    border-radius 4px
                    margin-top 21vh
                    overflow hidden
                    .el-dialog__header
                      height 36px
                      line-height 36px
                      padding 0 0  0 20px
                      background-color #212b3f
                      text-align left
                      .el-dialog__title
                        font-size 14px
                        color #fff
                      .el-dialog__headerbtn
                        top 10px
                        right 10px
                    .el-dialog__body
                      padding 30px 20px 10px
                      p
                        color #cfd5df
                        text-align center
                        line-height 27px
                        .iconfont
                          color S_main_color
                          margin-right 5px
                          font-size 24px
                          vertical-align top
                    .button
                      min-width 80px
                      height 30px
                      line-height 5px
                      border-radius 2px
                      border none
                      font-size 12px
                      color #333
                      border 1px solid S_main_color
                      background-color transparent
                      color #fff
                      &.submit
                        background linear-gradient(81deg,rgba(43,57,110,1) 0%,rgba(42,80,130,1) 100%)
                        border none
              >.editing
                position relative
                >.input
                  border 1px solid S_main_color
                  height 26px
                  line-height 26px
                  box-sizing border-box
                  display inline-block
                  min-width 210px
                  padding 0 10px 0 10px
                  border-radius 2px
                  color #fff
                  font-size 12px
                  vertical-align middle
                >.save-edit-button
                  height 26px
                  line-height 26px
                  background-color S_main_color
                  vertical-align middle
                  margin-left 24px
                  color #fff
                  font-size 12px
                  padding 0 15px
                  border-radius 2px
                  cursor pointer
                  border none
              >.not-editing
                >button
                  >.iconfont
                    font-size 16px
                    color S_main_color
    >.inviter-board
      display flex
      height 90px
      text-align center
      padding-top 10px
      .left
        flex 1
        >.top
          color S_main_color
          >.people
            font-size 30px
        >.bottom
          font-size 12px
          margin-top 14px
      .right
        flex 1
        >.top
          color S_main_color
          >.rate
           font-size 30px
        >.bottom
          margin-top 14px
          font-size 12px
    &.night
      background-color #1c1f32
    &.day
      background-color #fff
      box-shadow 0 0 6px #cfd5df
      >.header
        background-color #fff
        color S_main_color
        border-color #CFD5DF
      >.content
        background-color #E1ECF9
        >.detail-item
          border-color #CFD5DF
          >.right
            >.qr-code
              .qr-code-box
                box-shadow 0 0 6px #cfd5df
            >.no-invitor
              >.editing
                >.input
                  color #333
              /deep/
                .tip-dialog
                  .el-dialog
                    background-color #fff
                    .el-dialog__header
                      background-color #DCE7F3
                      .el-dialog__title
                        color #333
                    .el-dialog__body
                      p
                        color #333
                    .button
                      color #333
                      &.submit
                        color #fff
</style>
