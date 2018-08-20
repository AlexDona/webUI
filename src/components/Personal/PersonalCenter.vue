<template>
  <div
    class="personal-center personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <!--头部-->
    <HeaderCommon/>
    <div class="personal-center-main">
      <div class="personal-center-content clearfix">
        <el-tabs
          v-model = "userCenterActiveName"
          :tab-position = "tabPosition"
          @tab-click = "gitPersonal"
        >
          <!--个人中心-->
          <el-tab-pane
            label = "个人中心"
            disabled
            class="title"
          >
          </el-tab-pane>
          <!--账户资产-->
          <el-tab-pane
            label = "账户资产"
            name = "first"
          >
            <AccountAssets ref = "accountAssetsValue"/>
          </el-tab-pane>

          <!--身份认证-->
          <el-tab-pane
            label = "身份认证"
            name = "second"
          >
            <IdentityAuthentication ref = "identityValue"/>
          </el-tab-pane>

          <!--收款账户-->
          <el-tab-pane
            label = "收款账户"
            name = "third"
          >
            <AccountCredited ref = "accountCreditedValue"/>
          </el-tab-pane>

          <!--邀请推广-->
          <el-tab-pane
            label = "邀请推广"
            name = "fourth"
          >
            <InvitingPromotion ref = "invitingPromotionValue"/>
          </el-tab-pane>

          <!--安全中心-->
          <el-tab-pane
            label = "安全中心"
            name = "fifth"
          >
            <SecurityCenter ref = "securityCenterValue"/>
          </el-tab-pane>
          <!--API管理-->
          <el-tab-pane
            label = "API管理"
            name = "six"
          >
            <APIManagement ref = "apiManagementValue"/>
          </el-tab-pane>
          <!--我的交易-->
          <el-tab-pane
            label = "我的交易"
            disabled
          >
            <APIManagement/>
          </el-tab-pane>
          <el-tab-pane
            label = "币币订单"
            name = "seven"
          >
            <CoinOrders ref = "coinOrdersValue"/>
          </el-tab-pane>
          <el-tab-pane
            label = "法币订单"
            name = "eight"
          >
            <FiatOrders ref = "fiatOrdersValue"/>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!--底部-->
    <FooterCommon/>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
// 头部
import HeaderCommon from '../Common/HeaderCommon'
// 账户资产
import AccountAssets from './AccountAssets'
// 身份认证
import IdentityAuthentication from './IdentityAuthentication'
// 收款账户
import AccountCredited from './AccountCredited'
// 邀请推广
import InvitingPromotion from './InvitingPromotion'
// 安全中心
import SecurityCenter from './SecurityCenter'
// API管理
import APIManagement from './APIManagement'
// 币币订单
import CoinOrders from './CoinOrders'
// 法币订单
import FiatOrders from './FiatOrders'
// 底部
import FooterCommon from '../Common/FooterCommon'
import {mapState} from 'vuex'
export default {
  components: {
    // 个人中心
    HeaderCommon, // 头部
    AccountAssets, // 账户资产
    IdentityAuthentication, // 身份认证
    AccountCredited, // 收款账户
    InvitingPromotion, // 邀请推广
    SecurityCenter, // 安全中心
    APIManagement, // API管理
    // 我的交易
    CoinOrders, // 币币订单
    FiatOrders, // 法币订单
    FooterCommon // 底部
  },
  // props,
  data () {
    return {
      tabPosition: 'left', // 导航位置方向
      activeName: 'first'
    }
  },
  created () {
    console.log(this.$route.params.id)
    // 覆盖Element样式
    require('../../../static/css/list/Personal/PersonalCenter.css')
    // 白色主题样式
    require('../../../static/css/theme/day/Personal/PersonalCenterDay.css')
    // 黑色主题样式
    require('../../../static/css/theme/night/Personal/PersonalCenterNight.css')
    // 个人中心跳转面板id
    if (this.$route.params.id) {
      this.activeName = this.$route.params.id
    }
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 面板跳转
    gitPersonal (tab, event) {
      let a = event.target.getAttribute('id')
      console.log(a)
      switch (a) {
        case 'tab-first':
          console.log(this.$refs)
          break
        case 'tab-second':
          console.log(this.$refs)
          break
        case 'tab-third':
          console.log(this.$refs)
          break
        case 'tab-fourth':
          console.log(this.$refs)
          break
        case 'tab-fifth':
          console.log(this.$refs)
          break
        case 'tab-six':
          console.log(this.$refs)
          break
        case 'tab-seven':
          console.log(this.$refs)
          break
        case 'tab-eight':
          console.log(this.$refs)
          break
        default:
          break
      }
    }
  },
  filter: {},
  computed: {
    ...mapState([
      'theme',
      'userCenterActiveName'
    ])
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../static/css/scss/Personal/PersonalCenter.scss";
  .personal-center{
    > .personal-center-main {
      width: 1100px;
      min-height: 800px;
      margin: 60px auto 100px;
      > .personal-center-content{
        width: 1100px;
      }
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
    }
  }

</style>
