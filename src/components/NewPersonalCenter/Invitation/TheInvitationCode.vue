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
            input.input(
              :placeholder="$t('M.comm_user_invite_tip2')"
              @blur="editInviter"
              v-model="inviter"
            )
            Iconfont.iconfont(icon-name="icon-tianxie")
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
    },
    inviterCount: {
      type: Number
    }
  },
  data () {
    return {
      isShowQrCode: false,
      inviter: '',
      // 人民币转换汇率
      transformRate: ''
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
    async editInviter () {
      if (!this.inviter) return
      const params = {
        inviter: this.inviter
      }
      const data = await editInviterAJAX(params)
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
    }
  },
  // filters: {},
  computed: {
    ...mapState({
      activeConvertCurrencyObj: state => state.common.activeConvertCurrencyObj, // 目标货币
      currencyRateList: state => state.common.currencyRateList // 折算货币列表
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
              position relative
              >.input
                border 1px solid S_main_color
                height 30px
                line-height 30px
                box-sizing border-box
                display inline-block
                line-height 30px
                min-width 210px
                padding 0 10px 0 34px
                border-radius 2px
                color #fff
                font-size 12px
              >.iconfont
                position: absolute
                left 12px
                top 50%
                transform translateY(-50%)
                font-size 14px
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
              >.input
                color #333
</style>
