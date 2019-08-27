<!--
  author: zhaoxinlei
  create: 20190621
  description: 当前组件为 公共头部 已登录 显示 组件
-->
<template lang="pug">
  li.the-logined.li-item(
    @mouseenter="toggleBox(true)"
    @mouseleave="toggleBox(false)"
    @click="toggleBox(!isShowDropDown)"
  )
    span.username {{userName}}
    el-collapse-transition
      .login-info(
        :class="{'has-vip':$isVIPEnable_S_X}"
        v-show="isShowDropDown"
      )
        // VIP 信息
        .vip-user(v-if="$isVIPEnable_S_X")
          .sub-nav-user.vip-info
            // VIP享手续费、提现优惠
            p.nav-vip {{$t('M.user_vip_text8')}}
            // 立即开通
            button.nav-button(
              @click="jumpToVIP"
            ) {{$t(VIPButtonText)}}
          ul.user-infos
            li(
              v-for="route in personalRoutes"
              @click="jumpToPersonalCenter(route.name)"
              ) {{$t(route.label)}}
            // 退出
            li(@click="$userLogOut_X") {{$t('M.comm_retreat')}}
        .vip-closed.vip-user(v-else)
          .sub-nav-user.vip-info
          ul.user-infos
            li(
              v-for="route in personalRoutes"
              @click="jumpToPersonalCenter(route.name)"
              ) {{$t(route.label)}}
            // 退出
            li(@click="$userLogOut_X") {{$t('M.comm_retreat')}}
</template>
<script>
import {
  mapState,
  mapMutations,
  mapActions
} from 'vuex'
import mixins from '../../mixins/header'
export default {
  name: 'the-logined',
  mixins: [mixins],
  // components: {},
  // props,
  data () {
    return {
      isShowDropDown: false,
      personalRoutes: [
        // 账户资产
        {
          label: 'M.comm_user_account_balance',
          name: 'assets'
        },
        // 订单管理
        // {
        //   label: 'M.comm_user_order_management',
        //   name: 'coin-orders'
        // },
        // 身份认证
        {
          label: 'M.comm_user_identity_authentication',
          name: 'identity-authentication'
        },
        // 安全中心
        {
          label: 'M.comm_user_security_center',
          name: 'security-center'
        },
        // 收款设置
        {
          label: 'M.comm_user_receiving_set',
          name: 'account-credited'
        },
        // 邀请推广
        {
          label: 'M.comm_user_invite_generalize',
          name: 'invitation-promote'
        }
        // api管理
        // {
        //   label: 'M.comm_user_api_management',
        //   name: 'api-management'
        // }
      ]
    }
  },
  // created () {
  // },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    ...mapActions([
      'REFRESH_USER_INFO_ACTION'
    ]),
    ...mapMutations([
      'USER_LOGOUT',
      'CHANGE_REF_SECURITY_CENTER_INFO',
      'CHANGE_REF_ACCOUNT_CREDITED_STATE',
      'CHANGE_USER_CENTER_ACTIVE_NAME',
      'SET_ACTIVE_LINK_NAME_M'
    ]),
    toggleBox (status) {
      this.isShowDropDown = status
    },
    // 开启vip
    jumpToVIP () {
      if (this.localPayPwdSet || this.payPassword) {
        this.$goToPage('/VipMainContent')
      } else {
        this.$goToPage('/TransactionPassword')
      }
    },
    // 用户跳转到指定页面
    async jumpToPersonalCenter (val) {
      this.SET_ACTIVE_LINK_NAME_M(-1)
      // console.log(this.localPayPwdSet)
      await this.REFRESH_USER_INFO_ACTION()
      if (this.localPayPwdSet || this.payPassword) {
        this.CHANGE_USER_CENTER_ACTIVE_NAME(val)
        const needUpdateInfos = ['security-center', 'account-credited']
        if (_.some(needUpdateInfos, item => val == item)) this.CHANGE_REF_SECURITY_CENTER_INFO(true)
        this.$goToPage('/PersonalCenter')
      } else {
        this.$goToPage('/TransactionPassword')
      }
    }
  },
  // filters: {},
  computed: {
    ...mapState({
      userInfo: state => _.get(state, 'user.loginStep1Info.userInfo')
    }),
    // VIP 按钮文字（立即开通、查看我的VIP）
    VIPButtonText () {
      return !this.level ? 'M.user_vip_immediately_opened' : 'M.user_vip_look'
    },
    localPayPwdSet () {
      return _.get(this.userInfo, 'paypasswordSet')
    },
    userName () {
      return _.get(this.userInfo, 'userName')
    },
    payPassword () {
      return _.get(this.userInfo, 'payPassword')
    },
    level () {
      return _.get(this.userInfo, 'level')
    }
  }
  // watch: {}
}
</script>

<style scoped lang="stylus">
  @import '../../assets/CSS/index.styl'
  .the-logined
    position relative
    >.username
      line-height 60px
      color S_main_color
      padding 0 5px
      vertical-align middle
    .login-info
      position absolute
      top 50px
      left 50%
      transform translateX(-50%)
      background-color #2c314d
      box-shadow 0 3px 6px 0 rgba(32, 35, 54, 1)
      border-radius 2px
      padding 10px 0
      text-align center
      >.vip-user
        >.vip-info
          >.nav-vip
            padding 10px 25px 5px
            line-height 20px
            white-space nowrap
          >.nav-button
            min-width 75%
            height 30px
            padding 0 10px
            border 1px solid S_main_color
            border-radius 5px
            white-space nowrap
            color: S_font_color
            cursor pointer
            &:hover
              border-color S_font_color
              color S_main_color
              background-color S_hover_bg
        >.user-infos
          text-align left
          >li
            padding 0 25px
            white-space nowrap
            color S_font_color
            height 40px
            line-height 40px
            &:hover
              color S_main_color
              background-color #21243a
              cursor pointer
</style>
