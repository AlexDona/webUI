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
          <div class="asset-title asset-info">
            账户资产
          </div>
          <el-tab-pane
            disabled
            class="title"
          >
          </el-tab-pane>
          <!--我的资产-->
          <el-tab-pane
            label = "我的资产"
            name = "assets"
          >
            <AccountAssets/>
          </el-tab-pane>
          <!--账单明细-->
          <el-tab-pane
            label = "账单明细"
            name = "billing-details"
          >
            <BillingDetails/>
          </el-tab-pane>
          <!--提币地址-->
          <el-tab-pane
            label = "提币地址"
            name = "mention-address"
          >
            <WithdrawalAddress/>
          </el-tab-pane>
          <!--个人中心-->
          <div class="user-title asset-info">
            个人中心
          </div>
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
            <IdentityAuthentication/>
          </el-tab-pane>

          <!--收款账户-->
          <el-tab-pane
            label = "收款账户"
            name = "account-credited"
          >
            <AccountCredited/>
          </el-tab-pane>

          <!--邀请推广-->
          <el-tab-pane
            label = "邀请推广"
            name = "invitation-promote"
          >
            <InvitingPromotion/>
          </el-tab-pane>

          <!--安全中心-->
          <el-tab-pane
            label = "安全中心"
            name = "security-center"
          >
            <SecurityCenter/>
          </el-tab-pane>
          <!--API管理-->
          <el-tab-pane
            label = "API管理"
            name = "api-management"
          >
            <APIManagement/>
          </el-tab-pane>
          <!--PUSH资产-->
          <el-tab-pane
            label = "PUSH资产"
            name = "push-asset"
          >
            <PushAsset/>
          </el-tab-pane>
          <!--我的交易-->
          <div class="user-order asset-info">
            我的交易
          </div>
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
            <CoinOrders/>
          </el-tab-pane>
          <el-tab-pane
            label = "法币订单"
            name = "fiat-orders"
          >
            <FiatOrders/>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!--设置交易密码前弹框提示-->
      <div class="warning">
        <el-dialog
          :visible.sync="dialogVisible"
          center
        >
          <div class="dialog-warning">
            <div class="dialog-warning-box">
              <IconFontCommon
                class="font-size60"
                iconName="icon-gantanhao"
              />
            </div>
          </div>
          <p class="font-size12 warning-text margin-top35 text-align-c">
            请先设置交易密码，再来设置OTC收款账户!
          </p>
          <span
            slot="footer"
            class="dialog-footer"
          >
          <!--确 定 取 消-->
        <button
          class="button-color border-radius4 cursor-pointer"
          type="primary"
          @click.prevent="confirm(1)"
        >
          确 定
        </button>
        <button
          class="btn border-radius4 cursor-pointer"
          @click.prevent="dialogVisible = false"
        >
          取 消
        </button>
        </span>
        </el-dialog>
      </div>
      <!--未实名认证前弹框提示-->
      <div class="warning">
        <el-dialog
          :visible.sync="dialogVisible1"
          center
        >
          <div class="dialog-warning">
            <div class="dialog-warning-box">
              <IconFontCommon
                class="font-size60"
                iconName="icon-gantanhao"
              />
            </div>
          </div>
          <p class="font-size12 warning-text margin-top35 text-align-c">
            请先完成身份认证，再来设置OTC收款账户!
          </p>
          <span
            slot="footer"
            class="dialog-footer"
          >
          <!--确 定 取 消-->
        <button
          class="button-color border-radius4 cursor-pointer"
          type="primary"
          @click.prevent="confirm(2)"
        >
          确 定
        </button>
        <button
          class="btn border-radius4 cursor-pointer"
          @click.prevent="dialogVisible1 = false"
        >
          取 消
        </button>
        </span>
        </el-dialog>
      </div>
    </div>
    <!--底部-->
    <keep-aline><FooterCommon/></keep-aline>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
// 头部
import HeaderCommon from '../../Common/HeaderCommonForPC'
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
import {
  userRefreshUser
} from '../../../utils/api/personal'
import IconFontCommon from '../../Common/IconFontCommon'
import {returnAjaxMessage} from '../../../utils/commonFunc'
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations } = createNamespacedHelpers('personal')
export default {
  components: {
    // 我的资产
    IconFontCommon, // 字体图标
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
      tabPosition: 'left', // 导航位置方向
      dialogVisible: false,
      dialogVisible1: false
    }
  },
  async created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/UserAssets/PersonalCenter.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/UserAssets/PersonalCenterDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/UserAssets/PersonalCenterNight.css')
    await this.getUserRefreshUser()
    if (!this.realname && this.userCenterActiveName === 'account-credited') {
      this.dialogVisible1 = true
    }
    if (!this.payPassword && this.userCenterActiveName === 'account-credited') {
      this.dialogVisible = true
    }
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
    async statusSwitchPanel (tab) {
      this.CHANGE_USER_CENTER_ACTIVE_NAME(tab.name)
      if (tab.name === 'account-credited') {
        await this.getUserRefreshUser()
        if (!this.payPassword) {
          this.dialogVisible = true
          return false
        }
        if (!this.realname) {
          this.dialogVisible1 = true
          return false
        } else {
          this.dialogVisible1 = false
        }
      }
    },
    confirm (val) {
      if (val == 1) {
        this.$router.push({path: '/TransactionPassword'})
      } else {
        // this.$store.commit('personal/CHANGE_USER_CENTER_ACTIVE_NAME', 'identity-authentication')
        this.CHANGE_USER_CENTER_ACTIVE_NAME('identity-authentication')

        this.$router.push({path: '/PersonalCenter'})
        this.dialogVisible1 = false
      }
    },
    /**
     *  刷新用户信息
     */
    async getUserRefreshUser () {
      let data = await userRefreshUser({
        token: this.token
      })
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        this.$store.commit('user/SET_STEP1_INFO', data.data.data)
        // 返回列表数据
        if (!this.payPassword) {
          this.dialogVisible = true
        }
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      userCenterActiveName: state => state.personal.userCenterActiveName,
      userInfo: state => state.user.loginStep1Info,
      payPassword: state => state.user.loginStep1Info.userInfo.payPassword,
      realname: state => state.user.loginStep1Info.userInfo.realname,
      token: state => state.user.loginStep1Info.token
    })
  },
  watch: {
    payPassword (newVal) {
      if (!newVal) {
        this.dialogVisible = true
      }
    },
    realname (newVal) {
      if (!newVal) {
        this.dialogVisible1 = true
      }
    }
  }
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal";
  .personal-center{
    > .personal-center-main {
      width: 1150px;
      min-height: 1350px;
      margin: 60px auto;
      .dialog-warning {
        width: 90px;
        height: 90px;
        border-radius: 50%;
        padding-top: 6px;
        margin: 0 auto;
        background: rgba(42, 122, 211, 0.2);
        .dialog-warning-box {
          background: linear-gradient(90deg, #2b396e, #2a5082);
          width: 78px;
          height: 78px;
          border-radius: 50%;
          margin: 0 auto;
          text-align: center;
          line-height: 75px;
        }
      }
      .warning-text {
        color: #fff;
      }
      .info {
        color: #fff;
        padding-left: 83px;
      }
      .button-color {
        width: 80px;
        height: 35px;
        border: 0;
        line-height: 0;
        margin-right: 15px;
        color: rgba(255,255,255,0.7);
        background: linear-gradient(81deg,rgba(43,57,110,1) 0%,rgba(42,80,130,1) 100%);
      }
      .btn{
        width: 80px;
        height: 35px;
        line-height: 0;
        color: rgba(255, 255, 255, 0.7);
        background-color: transparent;
        border: 1px solid #338FF5;
      }
      > .personal-center-content{
        width: 1150px;
      }
      .asset-info {
        position: absolute;
        font-size: 18px;
        left: -179px;
        color: #338FF5;
        z-index: 2;
        background: #fff;
        width: 160px;
        height: 44px;
        padding-left: 25px;
        line-height: 40px;
      }
      .asset-title {
        top: 10px;
      }
      .user-title {
        top: 180px;
      }
      .user-order {
        top: 490px;
      }
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      .asset-info {
        background: #1E2636;
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      .asset-info {
        background: #fff;
      }
    }
  }

</style>
