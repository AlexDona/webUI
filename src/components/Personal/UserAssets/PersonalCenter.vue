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
          @tab-click = "statusSwitchPanel"
        >
          <!--账户资产-->
          <el-tab-pane
            label = "账户资产"
            disabled
            class="title"
          >
          </el-tab-pane>
          <!--我的资产-->
          <el-tab-pane
            label = "我的资产"
            name = "assets"
          >
            <AccountAssets ref = "accountAssetsValue"/>
          </el-tab-pane>
          <!--账单明细-->
          <el-tab-pane
            label = "账单明细"
            name = "billing-details"
          >
            <BillingDetails ref = "billingDetailsValue"/>
          </el-tab-pane>
          <!--提币地址-->
          <el-tab-pane
            label = "提币地址"
            name = "mention-address"
          >
            <WithdrawalAddress ref = "withdrawalAddressValue"/>
          </el-tab-pane>
          <!--个人中心-->
          <el-tab-pane
            label = "个人中心"
            disabled
            class="title"
          >
          </el-tab-pane>
          <el-tab-pane
            label = "身份认证"
            name = "identity-authentication"
          >
            <IdentityAuthentication ref = "identityValue"/>
          </el-tab-pane>

          <!--收款账户-->
          <el-tab-pane
            label = "收款账户"
            name = "account-credited"
          >
            <AccountCredited ref = "accountCreditedValue"/>
          </el-tab-pane>

          <!--邀请推广-->
          <el-tab-pane
            label = "邀请推广"
            name = "invitation-promote"
          >
            <InvitingPromotion ref = "invitingPromotionValue"/>
          </el-tab-pane>

          <!--安全中心-->
          <el-tab-pane
            label = "安全中心"
            name = "security-center"
          >
            <SecurityCenter ref = "securityCenterValue"/>
          </el-tab-pane>
          <!--API管理-->
          <el-tab-pane
            label = "API管理"
            name = "api-management"
          >
            <APIManagement ref = "apiManagementValue"/>
          </el-tab-pane>
          <!--PUSH资产-->
          <el-tab-pane
            label = "PUSH资产"
            name = "push-asset"
          >
            <PushAsset ref = "pushAssetValue"/>
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
            name = "coin-orders"
          >
            <CoinOrders ref = "coinOrdersValue"/>
          </el-tab-pane>
          <el-tab-pane
            label = "法币订单"
            name = "fiat-orders"
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
import HeaderCommon from '../../Common/HeaderCommon'
// 账户资产
import AccountAssets from '../AccountBalance/AccountAssets'
// 账单明细
import BillingDetails from '../AccountBalance/BillingDetails'
// 提币地址
import WithdrawalAddress from '../AccountBalance/WithdrawalAddress'
// 身份认证
import IdentityAuthentication from '../UserAssets/IdentityAuthentication'
// 收款账户
import AccountCredited from '../UserAssets/AccountCredited'
// 邀请推广
import InvitingPromotion from '../UserAssets/InvitingPromotion'
// 安全中心
import SecurityCenter from '../UserAssets/SecurityCenter'
// API管理
import APIManagement from '../UserAssets/APIManagement'
// push资产
import PushAsset from '../UserAssets/PushAsset'
// 币币订单
import CoinOrders from '../TransactionType/CoinOrders'
// 法币订单
import FiatOrders from '../TransactionType/FiatOrders'
// 底部
import FooterCommon from '../../Common/FooterCommon'
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations } = createNamespacedHelpers('personal')
export default {
  components: {
    // 我的资产
    HeaderCommon, // 头部
    AccountAssets, // 账户资产
    BillingDetails, // 账单明细
    WithdrawalAddress, // 提币地址
    // 个人中心
    IdentityAuthentication, // 身份认证
    AccountCredited, // 收款账户
    InvitingPromotion, // 邀请推广
    SecurityCenter, // 安全中心
    APIManagement, // API管理
    PushAsset, // push资产
    // 我的交易
    CoinOrders, // 币币订单
    FiatOrders, // 法币订单
    FooterCommon // 底部
  },
  // props,
  data () {
    return {
      tabPosition: 'left' // 导航位置方向
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/UserAssets/PersonalCenter.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/UserAssets/PersonalCenterDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/UserAssets/PersonalCenterNight.css')
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_USER_CENTER_ACTIVE_NAME'
    ]),
    // tab面板切换
    statusSwitchPanel (tab) {
      switch (tab.name) {
        case 'assets':
          // 个人资产列表展示
          this.$refs.accountAssetsValue.getAssetCurrenciesList()
          break
        case 'billing-details':
          // 冲提记录列表展示
          this.$refs.billingDetailsValue.getChargeMentionList()
          // 获取商户币种列表
          this.$refs.billingDetailsValue.inquireCurrencyList()
          break
        case 'mention-address':
          // 提币地址列表查询
          this.$refs.withdrawalAddressValue.WithdrawalAddressList()
          break
        case 'identity-authentication':
          // 获取用户实名信息
          this.$refs.identityValue.getRealNameInformation()
          this.$refs.identityValue.getUserRefreshUser()
          // 国家列表展示
          this.$refs.identityValue.getCountryListings()
          break
        case 'account-credited':
          // 收款方式状态查询
          this.$refs.accountCreditedValue.getAccountPaymentTerm()
          break
        case 'invitation-promote':
          // 直接推广间接推广列表
          this.$refs.invitingPromotionValue.getUserPromotionList()
          this.$refs.invitingPromotionValue.getRecommendUserPromotion()
          break
        case 'security-center':
          // 安全中心状态显示
          this.$refs.securityCenterValue.getSecurityCenter()
          break
        case 'api-management':
          // 获取多个用户api信息
          this.$refs.apiManagementValue.getMultipleUserAPIInfo()
          break
        case 'push-asset':
          // push列表展示
          this.$refs.pushAssetValue.getPushRecordList()
          // 清空数据
          this.$refs.pushAssetValue.emptyInputData()
          break
        case 'coin-orders':
          this.$refs.coinOrdersValue.commissionList()
          break
        case 'fiat-orders':
          // 页面加载时请求接口渲染列表
          this.$refs.fiatOrdersValue.getOTCEntrustingOrdersRevocation()
          break
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      userCenterActiveName: state => state.personal.userCenterActiveName
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/UserAssets/PersonalCenter";
  .personal-center{
    > .personal-center-main {
      width: 1100px;
      min-height: 1350px;
      margin: 60px auto;
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
