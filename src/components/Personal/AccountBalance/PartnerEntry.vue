<template>
  <div
    class="partner-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="partner-purchase-upgrade-box">
      <!--合伙人入口展示身份状态-->
      <div class="title-text text-align-l font-size14 main-color">
        <span
          class="cursor-pointer"
          @click="showPartnerDialog"
          v-if="!role"
        >
          {{ language === 'zh_CN' || language === 'zh_TW' ? upRole.roleName : upRole.enRoleName }}
        </span>
        <span
          v-else
          class="cursor-pointer"
          @click="showPartnerDialog"
        >
          {{ language === 'zh_CN' || language === 'zh_TW' ? role.roleName : role.enRoleName }}
        </span>
      </div>
      <!--合伙人弹窗信息-->
      <div class="partner-dialog-box">
        <el-dialog
          custom-class="partner-dialog"
          :title="role ? (language === 'zh_CN' || language === 'zh_TW' ? role.roleName : role.enRoleName) : (language === 'zh_CN' || language === 'zh_TW' ? upRole.roleName : upRole.enRoleName)"
          :visible.sync="partnerDialogVisible"
        >
          <!--普通用户 初级合伙人，中级合伙人-->
          <div
            class="main-content"
            v-if="this.upRole"
          >
            <div class="top">
              <div
                class="rank"
                v-if="role"
              >
                <span class="current">
                  {{$t('M.partner_buy_text1')}}-
                </span>
                <span class="id-status">
                  {{ language === 'zh_CN' || language === 'zh_TW' ? role.roleName : role.enRoleName }}
                </span>
                <span class="time red">
                  ({{ copartnerVo.endTime }}{{$t('M.partner_buy_text2')}})
                </span>
              </div>
              <div
                class="get-money"
                v-if="!role"
              >
                <span class="identity main-color">
                  {{ language === 'zh_CN' || language === 'zh_TW' ? upRole.roleName : upRole.enRoleName }}
                </span>
                {{$t('M.partner_buy_text3')}}
                <span class="service-charge-one main-color">
                  {{ upRole.commissionRate * 100 }}%
                </span>
                {{$t('M.partner_buy_text4')}}
              </div>
              <div
                class="get-money"
                v-if="role"
              >
                <span class="identity main-color">
                  {{ language === 'zh_CN' || language === 'zh_TW' ? role.roleName : role.enRoleName }}
                </span>
                {{$t('M.partner_buy_text3')}}
                <span class="service-charge-one main-color">
                  {{ role.commissionRate * 100 }}%
                </span>
                {{$t('M.partner_buy_text4')}}
              </div>
            </div>
            <div class="middle">
              <img
                v-if="!role && theme == 'night'"
                class="banner"
                src="../../../assets/partner/night_not_buy_partner.png"
              >
              <img
                v-if="role && theme == 'night'"
                class="banner"
                src="../../../assets/partner/night_buy_partner.png"
              >
              <img
                v-if="!role && theme == 'day'"
                class="banner"
                src="../../../assets/partner/day_not_buy_partner.png"
              >
              <img
                v-if="role && theme == 'day'"
                class="banner"
                src="../../../assets/partner/day_buy_partner.png"
              >
            </div>
            <div class="bottom">
              <div
                class="discounts"
                v-if="role"
              >
                {{$t('M.partner_buy_text5')}}
                <span class="main-color">
                  {{ language === 'zh_CN' || language === 'zh_TW' ? upRole.roleName : upRole.enRoleName }}
                </span>
                {{$t('M.partner_buy_text3')}}
                <span class="main-color">
                  {{ upRole.commissionRate * 100 }}%
                </span>
                {{$t('M.partner_buy_text4')}}
              </div>
              <div class="condition-box">
                <div class="upgrade-title">{{$t('M.partner_buy_text6')}}：</div>
                <p class="item first">
                  1.{{$t('M.partner_buy_text7')}}{{ language === 'zh_CN' || language === 'zh_TW' ? upRole.roleName : upRole.enRoleName }}{{$t('M.partner_buy_text8')}}{{ upRole.upgradeCost }}{{ upRole.upgradeCoinName }}
                  <IconFontCommon
                    class="font-size16 green"
                    iconName="icon-duihao4"
                    v-if="payForIsEnoughStatus"
                  />
                  <IconFontCommon
                    class="font-size16 red"
                    iconName="icon-cha"
                    v-else
                  />
                  <span class="condition-text">
                    （{{$t('M.partner_buy_text9')}}
                    <span
                      v-if="payForIsEnoughStatus"
                      class="green"
                    >
                      {{currentUpgradeCoinTotal}}
                    </span>
                    <span
                      class="red"
                      v-else
                    >
                      {{currentUpgradeCoinTotal}}
                    </span>
                    {{ upRole.upgradeCoinName }}）
                  </span>
                </p>
                <p
                  class="item second"
                  v-if="upRole.upgradeInvite - 0 > 0"
                >
                  2.{{$t('M.partner_buy_text10')}}{{ upRole.upgradeInvite }}{{$t('M.partner_buy_text11')}}{{ language === 'zh_CN' || language === 'zh_TW' ? upRole.upgradeInviteRoleName : upRole.upgradeInviteRoleNameEn }}
                  <IconFontCommon
                    class="font-size16 green"
                    iconName="icon-duihao4"
                    v-if="directReferralsIsEnoughStatus"
                  />
                  <IconFontCommon
                    class="font-size16 red"
                    iconName="icon-cha"
                    v-else
                  />
                  <span class="condition-text">
                    （{{$t('M.partner_buy_text12')}}
                    <span
                      v-if="directReferralsIsEnoughStatus"
                      class="green"
                    >
                      {{ copartnerVo.actualUpgradeInvite }}
                    </span>
                    <span
                      class="red"
                      v-else
                    >
                      {{ copartnerVo.actualUpgradeInvite }}
                    </span>
                    {{$t('M.partner_buy_text13')}}{{ language === 'zh_CN' || language === 'zh_TW' ? upRole.upgradeInviteRoleName : upRole.upgradeInviteRoleNameEn }}）
                  </span>
                </p>
                <p
                  class="item third"
                  v-if="upRole.teamMembers - 0 > 0"
                >
                  <span v-if="upRole.upgradeInvite == 0">
                    2.
                  </span>
                  <span v-else>
                    3.
                  </span>
                  {{$t('M.partner_buy_text14')}}{{ upRole.teamMembers }}{{$t('M.partner_buy_text15')}}
                  <IconFontCommon
                    class="font-size16 green"
                    iconName="icon-duihao4"
                    v-if="teamSizeIsEnoughStatus"
                  />
                  <IconFontCommon
                    class="font-size16 red"
                    iconName="icon-cha"
                    v-else
                  />
                  <span class="condition-text">
                    （{{$t('M.partner_buy_text16')}}
                    <span
                      v-if="teamSizeIsEnoughStatus"
                      class="green"
                    >
                      {{ copartnerVo.actualTeamMembers }}
                    </span>
                    <span
                      class="red"
                      v-else
                    >
                      {{ copartnerVo.actualTeamMembers }}
                    </span>
                    {{$t('M.partner_buy_text15')}}）
                  </span>
                </p>
              </div>
            </div>
            <div class="confirm-box">
              <button
                class="upgrade-button border-radius2 cursor-pointer font-size14"
                :disabled="!teamSizeIsEnoughStatus || !directReferralsIsEnoughStatus || !payForIsEnoughStatus"
                @click="submitShowPWD"
              >
                {{$t('M.partner_buy_text17')}}
              </button>
            </div>
          </div>
          <!--高级合伙人-->
          <div
            v-else
            class="main-content highest-level"
          >

            <div class="highest-text1 text-align-c">
              {{$t('M.partner_buy_text18')}}
            </div>
            <div class="highest-text2 red text-align-c">
              （{{this.copartnerVo.endTime}}{{$t('M.partner_buy_text2')}}）
            </div>
            <div class="highest-text3 text-align-c">
              <span class="main-color">
                {{ language === 'zh_CN' || language === 'zh_TW' ? role.roleName : role.enRoleName }}
              </span>
              {{$t('M.partner_buy_text3')}}
              <span class="main-color">
                {{ role.commissionRate * 100 }}%
              </span>
              {{$t('M.partner_buy_text4')}}
            </div>
            <div class="highest-middle text-align-c">
              <img
                class="highest-banner"
                src="../../../assets/partner/night_buy_partner.png"
                v-if="theme == 'night'"
              >
              <img
                class="highest-banner"
                src="../../../assets/partner/day_buy_partner.png"
                v-if="theme == 'day'"
              >
            </div>
          </div>
        </el-dialog>
      </div>
      <!--交易密码弹窗-->
      <PayPassDialog
        @next="submitUpgradePartnerHasPWD"
        :closeValidationMessage="parentMsg"
      />
    </div>
  </div>
</template>
<script>
import {mapState, mapActions, mapMutations} from 'vuex'
import {
  // 获得合伙人信息
  getUpdateInfoAJAX,
  // 根据币种id获取可用余额
  getPushTotalByCoinId,
  // 判断是否满足升级条件
  getIsEnoughUpdateConditionAJAX,
  // 升级合伙人接口(免密)
  upgradePartnerWithoutCodeAJAX,
  // 升级合伙人接口(不免密)
  upgradePartnerAJAX
} from '../../../utils/api/personal'
import {
  getNestedData
} from '../../../utils/commonFunc'
// 字体图标
import IconFontCommon from '../../Common/IconFontCommon'
export default {
  components: {
    IconFontCommon
  },
  // props,
  data () {
    return {
      // 合伙人部分
      // 合伙人弹窗状态
      partnerDialogVisible: false,
      // 购买/升级信息返回三个对象数据
      copartnerVo: {},
      role: {},
      upRole: {},
      // 当前升级币种余额
      currentUpgradeCoinTotal: '',
      // 支付金额是否合格状态
      payForIsEnoughStatus: false,
      // 直接推荐是否合格状态
      directReferralsIsEnoughStatus: false,
      // 团队人数是否合格状态
      teamSizeIsEnoughStatus: false,
      // 隐藏全局交易密码框中的 "暂时关闭交易密码验证状态"
      parentMsg: false
    }
  },
  async created () {
    // 合伙人部分
    // 1.获得合伙人信息
    await this.getUpdateInfo()
    // 2.根据币种id获取可用余额
    await this.getUpgradeCoinId()
  },
  mounted () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapActions([]),
    ...mapMutations([
      // 是否显示全局交易密码弹窗
      'UPDATE_PAY_PASSWORD_DIALOG_M',
      // 改变是否重新刷新个人中心个人资产列表状态
      'CHANGE_REFRESH_PERSONAL_ASSETS_LIST_STATUS_M'
    ]),
    // 合伙人部分
    // 1.弹出购买/升级合伙人弹窗
    showPartnerDialog () {
      this.partnerDialogVisible = true
    },
    // 2.获得合伙人信息
    async getUpdateInfo () {
      const data = await getUpdateInfoAJAX()
      if (!data) return false
      console.log(data)
      this.copartnerVo = getNestedData(data, 'data.copartnerVo')
      this.role = getNestedData(data, 'data.role')
      this.upRole = getNestedData(data, 'data.upRole')
      if (this.upRole) {
        // 团队人数是否合格状态
        if (this.copartnerVo.actualTeamMembers - this.upRole.teamMembers >= 0) {
          this.teamSizeIsEnoughStatus = true
        } else {
          this.teamSizeIsEnoughStatus = false
        }
        // 直接推荐是否合格状态
        if (this.copartnerVo.actualUpgradeInvite - this.upRole.upgradeInvite >= 0) {
          this.directReferralsIsEnoughStatus = true
        } else {
          this.directReferralsIsEnoughStatus = false
        }
      }
    },
    // 3.根据币种id获取可用余额
    async getUpgradeCoinId () {
      if (this.upRole && this.upRole.upgradeCoinId) {
        // 升级币种coinId
        let param = {
          coinId: this.upRole.upgradeCoinId
        }
        const data = await getPushTotalByCoinId(param)
        console.log(data)
        if (!data) return false
        this.currentUpgradeCoinTotal = getNestedData(data, 'data.total')
        // 支付金额是否合格状态
        if (this.upRole) {
          if (this.currentUpgradeCoinTotal - this.upRole.upgradeCost >= 0) {
            this.payForIsEnoughStatus = true
          } else {
            this.payForIsEnoughStatus = false
          }
        }
      }
    },
    // 4.点击立即升级逻辑
    submitShowPWD: _.debounce(async function () {
      // 都满足条件才掉接口
      if (this.payForIsEnoughStatus && this.directReferralsIsEnoughStatus && this.teamSizeIsEnoughStatus) {
        // 调接口看是否满足升级条件
        const data = await getIsEnoughUpdateConditionAJAX()
        console.log(data)
        // 不满足条件关闭升级弹窗
        this.partnerDialogVisible = false
        if (!data) return false
        if (!getNestedData(data, 'data.flag')) return false
        // 满足条件后再判断支付金额是否是0，是0就调免密接口，不是0 就调不免密接口
        if (this.upRole.upgradeCost == 0) {
          // 免密
          let param = {
            coinId: this.upRole.upgradeCoinId // 升级币种Id
          }
          const data = await upgradePartnerWithoutCodeAJAX(param)
          console.log(data)
          if (!data) return false
          // 重新获得升级信息
          // 1.获得合伙人信息
          await this.getUpdateInfo()
          // 2.根据币种id获取可用余额
          await this.getUpgradeCoinId()
          this.CHANGE_REFRESH_PERSONAL_ASSETS_LIST_STATUS_M(true)
        } else {
          // 不免密
          // 关闭升级弹窗
          this.partnerDialogVisible = false
          // 弹出交易密码框
          this.$UPDATE_PAY_PASSWORD_DIALOG_M_X(true)
        }
      }
    }, 500),
    // 不免密升级点击交易密码框中的提交
    submitUpgradePartnerHasPWD: _.debounce(async function () {
      let param = {
        upgradeFee: this.upRole.upgradeCost, // 升级费用的币种数量
        coinId: this.upRole.upgradeCoinId, // 升级费用对应的币种id
        payPassword: this.$globalPayPassword_S_X // 交易密码
      }
      const data = await upgradePartnerAJAX(param)
      console.log(data)
      if (!data) return false
      // 关闭交易密码弹窗
      this.$UPDATE_PAY_PASSWORD_DIALOG_M_X(false)
      // 重新获得升级信息
      // 1.获得合伙人信息
      await this.getUpdateInfo()
      // 2.根据币种id获取可用余额
      await this.getUpgradeCoinId()
      this.CHANGE_REFRESH_PERSONAL_ASSETS_LIST_STATUS_M(true)
    }, 500)
  },
  // filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language
    })
  }
}
</script>
<!--请严格按照如下书写书序-->
<style scoped lang="scss" type="text/scss">
  @import '../../../assets/CSS/index';

  .partner-box {
    .main-color {
      color: $mainColor;
    }

    .red {
      color: #f03e3e;
    }

    .green {
      color: $otcGreen;
    }

    /* 合伙人模块 */
    .partner-purchase-upgrade-box {
      > .title-text {
        padding-left: 80px;
      }

      > .partner-dialog-box {
        .main-content {
          > .top {
            margin-top: 20px;
          }

          > .middle {
            text-align: center;

            .banner {
              width: 312px;
              height: 257px;
            }
          }

          > .bottom {
            > .condition-box {
              > .upgrade-title {
                margin-bottom: 20px;
              }

              > .item {
                line-height: 18px;
                margin-bottom: 4px;
              }
            }
          }

          > .confirm-box {
            padding: 20px 0 30px;

            > .upgrade-button {
              width: 441px;
              height: 40px;
              line-height: 40px;
            }
          }
        }

        .highest-level {
          > .highest-text1 {
            margin-top: 80px;
          }

          > .highest-text2,
          .highest-text3 {
            margin-top: 15px;
          }

          > .highest-middle {
            padding-bottom: 40px;
          }
        }
      }
    }

    /deep/ {
      /* 合伙人模块弹窗 */
      .partner-purchase-upgrade-box {
        .partner-dialog-box {
          .partner-dialog {
            width: 500px;
            text-align: left;
            box-sizing: border-box;
            border-radius: 4px;

            .el-dialog__header {
              height: 36px;
              padding-left: 30px;
              border-radius: 4px 4px 0 0;

              .el-dialog__title {
                font-size: 14px;
              }
            }

            .el-dialog__body {
              padding: 0 30px;
            }
          }
        }
      }
    }

    &.night {
      /* 合伙人模块 */
      .partner-purchase-upgrade-box {
        > .partner-dialog-box {
          .main-content {
            > .top {
              > .rank {
                > .current {
                  color: $dialogColor5;
                }
              }

              > .get-money {
                color: $dialogColor5;
              }
            }

            > .bottom {
              > .discounts {
                color: $dialogColor5;
              }

              > .condition-box {
                > .item {
                  .condition-text {
                    color: $dialogColor5;
                  }
                }
              }
            }

            > .confirm-box {
              > .upgrade-button {
                color: $mainColorOfWhite;
                background: $nightButtonBgColor1;

                &:disabled {
                  color: #636777;
                  background: #303757 !important;
                }
              }
            }
          }
        }
      }

      /deep/ {
        /* 合伙人模块弹窗 */
        .partner-purchase-upgrade-box {
          .partner-dialog-box {
            .partner-dialog {
              background-color: $dialogColor1;

              .el-dialog__header {
                background-color: $dialogColor2;

                .el-dialog__title {
                  color: $dialogColor4;
                }
              }

              .el-dialog__body {
                color: $mainColorOfWhite;
                background-color: $dialogColor1;
              }
            }
          }
        }
      }
    }

    &.day {
      /* 合伙人模块 */
      .partner-purchase-upgrade-box {
        > .partner-dialog-box {
          .main-content {
            > .top {
              > .rank {
                > .current {
                  color: $dayMainTitleColor;
                }
              }

              > .get-money {
                color: $dayMainTitleColor;
              }
            }

            > .bottom {
              > .discounts {
                color: $dayMainTitleColor;
              }

              > .condition-box {
                > .item {
                  .condition-text {
                    color: #aaa;
                  }
                }
              }
            }

            > .confirm-box {
              > .upgrade-button {
                color: $mainColorOfWhite;
                background: $dayButtonBgColor2;

                &:disabled {
                  color: $mainColorOfWhite;
                  background: #ccc !important;
                }
              }
            }
          }
        }
      }

      /deep/ {
        /* 合伙人模块弹窗 */
        .partner-purchase-upgrade-box {
          .partner-dialog-box {
            .partner-dialog {
              background-color: $mainColorOfWhite;

              .el-dialog__header {
                background-color: $dialogColor7;

                .el-dialog__title {
                  color: $dayMainTitleColor;
                }
              }

              .el-dialog__body {
                color: $dayMainTitleColor;
                background-color: $mainColorOfWhite;
              }
            }
          }
        }
      }
    }
  }
</style>
