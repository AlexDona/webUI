<template>
  <div
    class="personal-center personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="personal-center-main">
      <div class="personal-center-content clearfix">
        <el-tabs
          v-model="currentUserCenterActiveName"
          :tab-position="tabPosition"
          @tab-click="statusSwitchPanel"
        >
          <!--账户资产-->
          <div class="asset-title asset-info">
            <!--账户资产-->
            {{ $t('M.comm_user_account_balance') }}
          </div>
          <el-tab-pane
            disabled
            class="title"
          >
          </el-tab-pane>
          <!--我的资产-->
          <el-tab-pane
            :label = "$t('M.user_asset_title1')"
            name = "assets"
          >
            <AccountAssets v-if="userCenterActiveName ==='assets'"/>
          </el-tab-pane>
          <!--账单明细-->
          <el-tab-pane
            :label = "$t('M.user_asset_title2')"
            name = "billing-details"
          >
            <BillingDetails/>
          </el-tab-pane>
          <!--提币地址-->
          <el-tab-pane
            :label = "$t('M.comm_mention_money') + $t('M.comm_site')"
            name = "mention-address"
          >
            <WithdrawalAddress v-if="userCenterActiveName ==='mention-address'"/>
          </el-tab-pane>

          <!--个人中心-->
          <div class="user-title asset-info">
            <!--个人中心-->
            {{ $t('M.user_asset_title3') }}
          </div>
          <el-tab-pane
            :label = "$t('M.user_asset_title3')"
            disabled
            class="title"
          >
          </el-tab-pane>
          <!--身份认证-->
          <el-tab-pane
            :label = "$t('M.user_asset_title4')"
            name = "identity-authentication"
          >
            <IdentityAuthentication/>
          </el-tab-pane>
          <!--收款账户-->
          <el-tab-pane
            :label = "$t('M.user_asset_title5')"
            name = "account-credited"
          >
            <AccountCredited v-if="userCenterActiveName==='account-credited'"/>
          </el-tab-pane>
          <!--邀请推广-->
          <el-tab-pane
            :label = "$t('M.user_asset_title6')"
            name = "invitation-promote"
          >
            <InvitingPromotion v-if="userCenterActiveName==='invitation-promote'"/>
          </el-tab-pane>
          <!--安全中心-->
          <el-tab-pane
            :label = "$t('M.user_asset_title7')"
            name = "security-center"
          >
            <SecurityCenter v-if="userCenterActiveName==='security-center'"/>
          </el-tab-pane>
          <!--API管理-->
          <el-tab-pane
            :label = "$t('M.comm_user_api_management')"
            name = "api-management"
          >
            <APIManagement v-if="userCenterActiveName==='api-management'"/>
          </el-tab-pane>
          <!--PUSH资产-->
          <el-tab-pane
            :label = "$t('M.user_asset_title8')"
            name = "push-asset"
          >
            <!--<PushAsset v-if="userCenterActiveName==='push-asset'"/>-->
            <PushAsset v-show="userCenterActiveName==='push-asset'"/>
          </el-tab-pane>

          <!--我的交易-->
          <div class="user-order asset-info">
            <!--我的交易-->
            {{ $t('M.user_asset_title9') }}
          </div>
          <el-tab-pane
            :label = "$t('M.user_asset_title9')"
            disabled
          >
            <!--<APIManagement/>-->
          </el-tab-pane>
          <!--币币订单-->
          <el-tab-pane
            :label = "$t('M.user_asset_title10')"
            name = "coin-orders"
          >
            <CoinOrders v-if="userCenterActiveName==='coin-orders'"/>
          </el-tab-pane>
          <!--法币订单-->
          <el-tab-pane
            :label = "$t('M.user_asset_title11')"
            name = "fiat-orders"
          >
            <FiatOrders v-if="userCenterActiveName==='fiat-orders'"/>
          </el-tab-pane>

          <!--设置-->
          <div class="setting-title asset-info">
            <!--设置-->
            {{$t('M.comm_set')}}
          </div>
          <el-tab-pane
            :label = "$t('M.comm_set')"
            disabled
            class="title"
          >
          </el-tab-pane>
          <el-tab-pane
            :label = "$t('M.user_personal_setting')"
            name = "personal-setting"
          >
            <PersonalSettings/>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!--设置交易密码前弹框提示-->
      <div class="warning">
        <el-dialog
          :visible.sync="setPwdDialogVisible"
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
            <!--请先设置交易密码，再来设置OTC收款账户!-->
            <span v-if="userCenterActiveName !== 'personal-setting'">{{ $t('M.user_asset_title12') }}</span>
            <!--请先设置交易密码，再来设置交易验证-->
            <span v-else>{{$t('M.user_asset_title14')}}</span>
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
          <!--确 定-->
          {{ $t('M.comm_confirm') }}
        </button>
        <button
          class="btn border-radius4 cursor-pointer"
          @click.prevent="setPwdDialogVisible = false"
        >
          <!--取 消-->
          {{ $t('M.comm_cancel') }}
        </button>
        </span>
        </el-dialog>
      </div>
      <!--未实名认证前弹框提示-->
      <div class="warning">
        <el-dialog
          :visible.sync="notVerifyDialogVisible"
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
            <!--请先完成身份认证，再来设置OTC收款账户!-->
            {{ $t('M.user_asset_title13') }}
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
          <!--确 定-->
          {{ $t('M.comm_confirm') }}
        </button>
        <button
          class="btn border-radius4 cursor-pointer"
          @click.prevent="notVerifyDialogVisible = false"
        >
          <!--取 消-->
          {{ $t('M.comm_cancel') }}
        </button>
        </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
// 账户资产
import AccountAssets from '../components/Personal/AccountBalance/AccountAssets'
// 账单明细
import BillingDetails from '../components/Personal/AccountBalance/BillingDetails'
// 提币地址
import WithdrawalAddress from '../components/Personal/AccountBalance/WithdrawalAddress'
// 身份认证
import IdentityAuthentication from '../components/Personal/UserAssets/IdentityAuthentication'
// 收款账户
import AccountCredited from '../components/Personal/UserAssets/AccountCredited'
// 邀请推广
import InvitingPromotion from '../components/Personal/UserAssets/InvitingPromotion'
// 安全中心
import SecurityCenter from '../components/Personal/UserAssets/SecurityCenter'
// API管理
import APIManagement from '../components/Personal/UserAssets/APIManagement'
// push资产
import PushAsset from '../components/Personal/UserAssets/PushAsset'
// 币币订单
import CoinOrders from '../components/Personal/TransactionType/CoinOrders'
// 法币订单
import FiatOrders from '../components/Personal/TransactionType/FiatOrders'
// 个人设置
import PersonalSettings from '../components/Personal/Settings/PersonalSettings'

import IconFontCommon from '../components/Common/IconFontCommon'
import {
  mapMutations,
  mapState,
  mapActions
} from 'vuex'
export default {
  components: {
    // 我的资产
    IconFontCommon, // 字体图标
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
    // 个人设置
    PersonalSettings
  },
  // props,
  data () {
    return {
      tabPosition: 'left', // 导航位置方向
      setPwdDialogVisible: false,
      notVerifyDialogVisible: false,
      currentUserCenterActiveName: 'assets'
      // isDisabled: false
    }
  },
  async created () {
    this.currentUserCenterActiveName = this.userCenterActiveName
    await this.REFRESH_USER_INFO_ACTION()
    this.showNoPosswdAndNoVerifyNotice()
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapActions([
      'REFRESH_USER_INFO_ACTION'
    ]),
    ...mapMutations([
      'CHANGE_USER_CENTER_ACTIVE_NAME',
      'SET_STEP1_INFO'
    ]),
    // 显示未设置交易密码弹窗
    showNoPasswdNotice () {
      this.setPwdDialogVisible = true
    },
    showNoPosswdAndNoVerifyNotice () {
      if (this.userCenterActiveName === 'account-credited' && !this.payPassword) {
        this.setPwdDialogVisible = true
        return false
      }
      if (this.userCenterActiveName === 'account-credited' && !this.realname) {
        this.notVerifyDialogVisible = true
      }
    },
    // tab面板切换
    async statusSwitchPanel (tab) {
      this.CHANGE_USER_CENTER_ACTIVE_NAME(tab.name)
      this.showNoPosswdAndNoVerifyNotice()
    },
    confirm (val) {
      if (val == 1) {
        this.$goToPage('/TransactionPassword')
      } else {
        this.CHANGE_USER_CENTER_ACTIVE_NAME('identity-authentication')
        this.$goToPage('/PersonalCenter')
        this.notVerifyDialogVisible = false
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
    userCenterActiveName (e) {
      this.currentUserCenterActiveName = e
      this.REFRESH_USER_INFO_ACTION()
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../static/css/scss/Personal/IndexPersonal";

  .personal-center {
    margin-top: 50px;
    overflow: hidden;

    > .personal-center-main {
      width: 1150px;
      min-height: 715px;
      margin: 60px auto;

      .dialog-warning {
        width: 90px;
        height: 90px;
        padding-top: 6px;
        margin: 0 auto;
        border-radius: 50%;
        background: rgba(42, 122, 211, .2);

        .dialog-warning-box {
          width: 78px;
          height: 78px;
          margin: 0 auto;
          border-radius: 50%;
          line-height: 75px;
          text-align: center;
          background: linear-gradient(90deg, #2b396e, #2a5082);
        }
      }

      .warning-text {
        color: #fff;
      }

      .info {
        padding-left: 83px;
      }

      .button-color {
        width: 80px;
        height: 35px;
        margin-right: 15px;
        border: 0;
        line-height: 0;
      }

      .btn {
        width: 80px;
        height: 35px;
        line-height: 0;
      }

      > .personal-center-content {
        width: 1150px;
      }

      .asset-info {
        position: absolute;
        z-index: 2;
        left: -179px;
        width: 160px;
        height: 44px;
        padding-left: 21px;
        font-size: 18px;
        line-height: 40px;
        color: #338ff5;
        background: #fff;
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

      .setting-title {
        top: 623px;
      }
    }

    /deep/ {
      /* tabs组件出现蓝色边框问题 */
      .el-tabs__active-bar {
        height: 0 !important;
      }

      .el-dialog__wrapper {
        background: rgba(0, 0, 0, .7) !important;
      }

      .el-tabs__nav-wrap {
        &::after {
          background-color: transparent;
        }
      }

      .el-tabs--left .el-tabs__nav-wrap.is-left {
        margin-right: 0;
      }

      /* 做二级导航宽度 */
      .el-tabs--left {
        /* height: 625px; */
        overflow: unset;

        .el-tabs__nav-wrap {
          .is-left {
            margin-right: 0;
          }
        }

        .el-tabs__item {
          &.is-left {
            width: 162px;
            text-align: left;
          }
        }

        .el-tabs__header {
          &.is-left {
            margin-right: 16px;
          }
        }
      }

      .el-tabs__item {
        height: 34px;
        margin: 10px 0;
        line-height: 34px;

        &.is-disabled {
          &:hover {
            border-left: 4px solid #fff;
            color: #fff;
          }
        }
      }

      .el-dialog {
        &:nth-child(1) {
          top: 15%;
          border-radius: 10px;
        }
      }

      .is-disabled {
        font-size: 18px;
      }

      .el-tabs__content {
        position: relative;
        float: right;
        width: 970px;
        overflow: unset;
      }

      .warning {
        .el-dialog {
          width: 350px;
          border-radius: 5px;
        }
      }
    }

    &.night {
      color: $nightFontColor;
      background-color: $nightBgColor;

      .asset-info {
        background: #1c1f32;
      }

      .info {
        color: #fff;
      }

      .button-color {
        color: rgba(255, 255, 255, .7);
        background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
      }

      .btn {
        border: 1px solid #338ff5;
        color: #fff;
        background-color: transparent;
      }

      /deep/ {
        .el-tabs__nav {
          background-color: #1c1f32;
        }

        .is-disabled {
          color: rgba(0, 121, 254, 1);
        }

        .el-tabs__item {
          border-left: 4px solid transparent;
          color: #ccc;

          &:hover {
            border-left: 4px solid #338ff5;
            color: rgba(0, 121, 254, 1);
            background-color: rgba(0, 121, 254, .1);
          }

          &.is-active {
            border-left: 4px solid rgba(0, 121, 254, 1);
            color: rgba(0, 121, 254, 1);
            background: rgba(51, 143, 245, .1);
          }
        }

        .el-dialog {
          background-color: #28334a;
        }

        .el-dialog__title {
          color: #fff;
        }

        .el-tabs--left {
          .el-tabs__nav-scroll {
            background-color: #1c1f32;
          }
        }
      }
    }

    &.day {
      color: $dayFontColor;
      background-color: $dayBgColor;

      .asset-info {
        background: #fff;
      }

      .warning-text {
        color: #333;
      }

      .info {
        color: #333;
      }

      .button-color {
        color: rgba(255, 255, 255, .7);
        background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
      }

      .btn {
        border: 1px solid #338ff5;
        color: #333;
        background-color: transparent;
      }

      /deep/ {
        .el-tabs__nav {
          background-color: #fff;
        }

        .is-disabled {
          color: #338ff5;
          background-color: #fff;
        }

        .el-tabs__item {
          border-left: 4px solid #fff;
          color: #6f798a;

          &.is-active {
            border-left: 4px solid rgba(0, 121, 254, 1);
            color: #338ff5;
            background: rgba(51, 143, 245, .1);
          }

          &:hover {
            border-left: 4px solid rgba(0, 121, 254, 1);
            color: #338ff5;
            background: rgba(51, 143, 245, .1);
          }

          &:first-child {
            &:hover {
              border-left: 4px solid #fff;
            }
          }
        }

        .el-tabs__header {
          &.is-left {
            border: 1px solid rgba(38, 47, 56, .1);
          }
        }

        .el-tabs--left {
          .el-tabs__item {
            &.is-left {
              &:first-child {
                &:hover {
                  border-left: 4px solid #fff;
                }
              }
            }
          }
        }
      }
    }
  }

</style>
