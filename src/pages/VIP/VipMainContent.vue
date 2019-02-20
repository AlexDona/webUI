<template>
  <div
    class="vip-main personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="header-content">
      <img
        class="images"
        :src="vipPictureBanner"
      >
      <div class="title">
        <!-- 一键开通VIP享受优惠特权 -->
        {{$t('M.user_vip_one_key_open')}}
      </div>
    </div>
    <div class="content-main-content">
      <!--开通vip页面-->
      <div
        class="content-main display-flex"
        v-show="showOpenTheVIPPage"
        v-if="VipPriceInfoList"
      >
        <div
          class="content-main-box"
          v-for="item in VipPriceInfoList"
          :key="item.id"
        >
          <div
            class="content-module cursor-pointer"
            :class="{
              active1:activeStatus < item.id + 1,
              disable:activeStatus > item.id
            }"
          >
            <p class="content-vip-one text-align-c">
              VIP{{item.id}}
            </p>
            <p class="content-discount line-height50 text-align-c font-size16">
              <!--手续费折扣-->
              {{ $t('M.user_vip_fee_discount') }}
            </p>
            <p class="content-text line-height50 text-align-c font-size18">
              <!--九折、八折、七折、六折、五折-->
              {{ $t(`M.user_vip_${10-item.id}`) }}{{ $t('M.user_vip_break') }}
            </p>
            <p class="content-discount line-height50 text-align-c font-size16">
            <span class="content-discount-color">
              {{item ? item.value:'--'}}{{item ? item.vipCoinName:'--'}}
            </span>
              <span>
              <!--/月-->
              /{{ $t('M.user_vip_month') }}
            </span>
            </p>
            <p class="content-button">
              <button
                class="click-btn cursor-pointer"
                @click.prevent="openOrRenewVIP(`${item.id}`,'open')"
                v-if="activeStatus > item.id || !activeStatus"
                :disabled="activeStatus > item.id"
              >
                <!--立即开通-->
                <span>
                  {{ $t('M.user_vip_immediately_opened') }}
                </span>
              </button>
              <el-tooltip
                class="item"
                effect="dark"
                :content="`${vipMaxAge} 到期`"
                placement="bottom-end"
                v-else-if="activeStatus==item.id"
              >
              <button
                class="click-btn cursor-pointer"
                @click.prevent="openOrRenewVIP(`${item.id}`, 'renew')"
              >
                <!--立即续费-->
                <span>
                  {{ $t('M.user_vip_text7') }}
                </span>
              </button>
              </el-tooltip>
              <button
                class="click-btn cursor-pointer"
                @click.prevent="openOrRenewVIP(`${item.id}`, 'update')"
                v-else
              >
                <!--立即升级-->
                <span>
                  {{ $t('M.user_vip_text9') }}
                </span>
              </button>
            </p>
          </div>
        </div>

        <p class="content-info-hint padding-right23 box-sizing font-size12">
          <span>
            <!--还没有FUC?-->
            {{ $t('M.user_vip_not_yet') }}{{vipPriceInfo1[0]?vipPriceInfo1[0].vipCoinName:'--'}}?
          </span>
          <span
            class="hint-color cursor-pointer"
            @click.prevent="goToAccountAssets"
          >
            <!--立即购买-->
            {{ $t('M.user_vip_immediately_buy') }}
          </span>
        </p>
      </div>
      <div class="text-below box-sizing font-size12">
        <p class="font-size14 warm-prompt">
          <!--温馨提示:-->
          {{ $t('M.user_account_warm_prompt') }}:
        </p>
        <p>
          <span class="warm-text-color">
            <!--VIP开通后立即生效，交易结算时自动计算折扣-->
            {{ $t('M.user_vip_text1') }}
          </span>
          <span
            class="prompt-color cursor-pointer"
            @click="changeServiceAgreement(0)"
          >
            <!--《折扣说明》-->
            {{ $t('M.user_vip_text2') }}
          </span>
        </p>
        <p class="warm-text-color">
          <!--费率折扣仅对交易手续费生效-->
          {{ $t('M.user_vip_text3') }}
        </p>
        <p class="warm-text-color">
          <!--一个月有效期时长为30个自然日-->
          {{ $t('M.user_vip_text4') }}
        </p>
        <p class="warm-text-color">
          <!--开通即代表您已同意-->
          {{ $t('M.user_vip_text5') }}
          <span
            class="prompt-color cursor-pointer"
            @click="changeServiceAgreement(1)"
          >
            <!--《VIP服务协议》-->
            《{{ $t('M.user_vip_text6') }}》
          </span>
        </p>
      </div>
      <!--折扣说明-->
      <el-dialog
        class="discounts-instruction-dialog"
        :title="$t('M.user_vip_text2')"
        :visible.sync="discountsInstructionStatus"
        width="50%"
      >
        <div
          v-html="discountsInstructionContent"
          class="html-content"
        >
        </div>
      </el-dialog>
      <!--vip服务协议-->
      <el-dialog
        class="discounts-instruction-dialog"
        :title="$t('M.user_vip_text6')"
        :visible.sync="serviceAgreementStatus"
        width="50%"
      >
        <div
          v-html="serviceAgreementContent"
          class="html-content"
        >
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {
  vipPriceInfo,
  getPushTotalByCoinId,
  currencyApplicationDownloadUrl
} from '../../utils/api/personal'
import {
  returnAjaxMsg,
  getNestedData
} from '../../utils/commonFunc'
import {getServiceProtocoDataAjax} from '../../utils/api/common'
// 底部
import {
  mapMutations,
  mapState,
  mapActions
} from 'vuex'
export default {
  components: {},
  data () {
    return {
      vipPictureBanner: require('../../assets/user/VIPbanner.png'), // vip banner
      errorEditorMsg: '',
      showOpenTheVIPPage: true, // 开启vip页面默认
      vipShowDetailsPage: false, // 开启vip详情页面默认
      password: '', // 开启vip详情页面默认
      vipPriceInfo1: [], // vip信息接收
      VipPriceInfoList: [],
      dialogFormVisible: false,
      type: 1, // vip类型
      active: 0,
      changeRed: 0,
      month: '', // 月份
      vipName: '', // vip名称
      coinId: '', // 币种id
      currencyAsset: 0, // 币种数量
      activeStatus: 0, // VIP状态
      loadingCircle: {}, // 整页loading
      discountsInstructionStatus: false, // 折扣说明弹窗显示状态
      serviceAgreementStatus: false,
      discountsInstructionContent: '', // 折扣说明内容
      serviceAgreementContent: '' // vip服务条款
    }
  },
  async created () {
    if (this.vipLevel) {
      this.activeStatus = this.vipLevel.split('')[3]
    }
    console.log(this.activeStatus)
    this.getServiceProtocolData()
    // await this.REFRESH_USER_INFO_ACTION(this)
    await this.getVipPriceInfo()
    await this.getCurrencyApplicationDownloadUrl()
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {
  },
  methods: {
    ...mapActions([
      'REFRESH_USER_INFO_ACTION'
    ]),
    ...mapMutations([
      'CHANGE_CURRENT_VIP_LEVEL',
      'CHANGE_VIP_PRICE_INFO_LIST',
      'CHANGE_RENEW_STATUS',
      'CHANGE_USER_CENTER_ACTIVE_NAME'
    ]),
    changeServiceAgreement (type) {
      switch (type) {
        case 0:
          this.discountsInstructionStatus = true
          break
        case 1:
          this.serviceAgreementStatus = true
          break
      }
    },
    // vip 服务协议
    async getServiceProtocolData () {
      const params = {
        termsTypeIds: '11,12', // 用户协议代号
        language: this.language
      }
      const data = await getServiceProtocoDataAjax(params)
      this.serviceAgreementContent = getNestedData(data, 'data[0].content')
      this.discountsInstructionContent = getNestedData(data, 'data[1].content')
    },
    // 跳转我的资产
    goToAccountAssets () {
      this.CHANGE_USER_CENTER_ACTIVE_NAME('assets')
      this.$goToPage('/PersonalCenter')
    },
    // vip开通页面点击页面
    openOrRenewVIP (paymentType, action) {
      this.CHANGE_RENEW_STATUS(action)
      console.log(this.vipAction)
      this.CHANGE_CURRENT_VIP_LEVEL({
        activeSelectLevel: paymentType
      })
      this.$goToPage('/OpenVIP')
    },
    /**
    /**
     * vip价格
     */
    async getVipPriceInfo () {
      let data = await vipPriceInfo()
      console.log(data)
      // 整页loading
      if (!(returnAjaxMsg(data, this, 0))) {
        // 接口失败清除loading
        return false
      } else {
        this.VipPriceInfoList = []
        // // 接口成功清除loading
        // if (data.data.data) {
        //   // 返回展示
        //   this.vipPriceInfo1 = data.data.data
        //   console.log(this.vipPriceInfo1[0].vipCoinName)
        // }
        // 任修复报错问题
        // 接口成功清除loading
        // this.vipPriceInfo1 = data.data.data
        this.vipPriceInfo1 = getNestedData(data, 'data.data')
        for (let i = 0; i < this.vipPriceInfo1.length - 1; i += 4) {
          let item = this.vipPriceInfo1[i]
          console.log(i)
          this.VipPriceInfoList.push(item)
        }
        this.CHANGE_VIP_PRICE_INFO_LIST(this.VipPriceInfoList)
        console.log(this.VipPriceInfoList)
      }
    },
    async getCurrencyApplicationDownloadUrl () {
      let data = await currencyApplicationDownloadUrl({
        key: 'VIP_COIN_NAME'
      })
      // 整页loading
      if (!(returnAjaxMsg(data, this))) {
        // 接口失败清除loading
        return false
      } else {
        // 接口成功清除loading
        // 返回展示
        // this.coinId = data.data.data.coinId
        // 任修复报错问题
        this.coinId = getNestedData(data, 'data.data.coinId')
        this.toggleAssetsCurrencyId()
      }
    },
    // 根据币种id获取可用余额
    async toggleAssetsCurrencyId () {
      let data
      let param = {
        coinId: this.coinId // 币种coinId
      }
      // 整页loading
      data = await getPushTotalByCoinId(param)
      console.log(data)
      if (!(returnAjaxMsg(data, this, 0))) {
        // 接口失败清除loading
        return false
      } else {
        // 接口成功清除loading
        // this.currencyAsset = data.data.data.total
        // 任修复报错问题
        this.currencyAsset = getNestedData(data, 'data.data.total')
        console.log(this.currencyAsset)
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language,
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      vipLevel: state => state.user.loginStep1Info.userInfo.level,
      vipMaxAge: state => state.user.loginStep1Info.vipInvalidTime,
      activeSelectLevel: state => state.user.vip.activeSelectLevel,
      vipAction: state => state.user.vip.vipAction
    }),
    filteredData () {
      console.log(this.vipPriceInfo1)
      return this.vipPriceInfo1.filter((item) => {
        // console.log(item)
        return item.id == this.type
      })
    }
  },
  watch: {
    vipLevel (newVal) {
      console.log(newVal)
    },
    filteredData (newVal) {
      // console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../../static/css/scss/Personal/IndexPersonal";

  .vip-main {
    margin-top: 65px;

    > .header-content {
      position: relative;
      width: 100%;
      margin: 0 auto;

      > .images {
        width: 100%;
      }

      > .title {
        position: absolute;
        top: 30%;
        left: 47%;
        font-size: 48px;
        color: #fff;
        transform: translate(-50%, -50%);
      }
    }

    > .loading-box {
      width: 100%;
      height: 800px;
    }

    > .content-main-content {
      height: 100%;

      .error-msg {
        height: 25px;
        line-height: 25px;
        color: rgb(212, 88, 88);
      }

      > .content-main {
        flex-wrap: wrap;
        width: 1300px;
        min-height: 300px;
        margin: 0 auto;

        > .content-info-hint {
          width: 100%;
          height: 40px;
          line-height: 40px;
        }

        .error-msg {
          height: 30px;
          padding-left: 35px;
          line-height: 30px;
          color: rgb(212, 88, 88);
        }

        > .content-main-box {
          position: relative;

          > .content-box {
            position: absolute;
            z-index: 10;
            top: 0;
            left: 0;
            flex-wrap: wrap;
            width: 250px;
            background-color: #1c1f32;
            opacity: .7;
          }

          > .content-module {
            flex-wrap: wrap;
            width: 250px;
            height: 380px;
            margin-right: 4px;

            > .content-vip-one {
              height: 112px;
              font-size: 36px;
              line-height: 112px;
            }

            > .content-discount {
              margin: 0 3px;
            }

            > .content-discount,
            > .content-text {
              height: 50px;
            }

            > .content-button {
              height: 115px;
              text-align: center;

              > .click-btn {
                width: 180px;
                height: 40px;
                margin-top: 35px;
                transform: skew(-15deg);
              }
            }
          }
        }
      }

      > .content-detail-page {
        width: 900px;
        min-height: 500px;
        margin: 10px auto;

        .blue1 {
          border: 1px solid #338ff5 !important;
          background-color: transparent !important;

          .duration-month {
            font-weight: 600;
            color: #338ff5 !important;
          }
        }

        > .detail-page-grade {
          > .page-grade-title {
            line-height: 70px;
          }

          .grade {
            width: 100px;
            height: 70px;
            padding: 13px;
            margin-left: 40px;

            > .grade-height {
              margin-top: 5px;
            }
          }
        }

        > .detail-page-duration {
          margin-top: 100px;

          > .duration-title {
            width: 114px;
            height: 150px;
            line-height: 150px;
          }

          .red {
            border: 1px solid #338ff5 !important;
            background-color: transparent !important;

            .duration-month {
              font-weight: 600;
              color: #338ff5 !important;
            }
          }

          > .duration {
            position: relative;
            width: 140px;
            height: 150px;
            padding: 28px;

            .triangle-style {
              position: absolute;
              top: 0;
              right: 0;
              min-width: 40px;
              height: 24px;
              padding: 0 2px;
              border-bottom-left-radius: 15px;
              border-top-left-radius: 15px;
              line-height: 24px;
              color: #fff;
              background-color: #338ff5;
            }

            &:hover {
              border: 1px solid #338ff5 !important;
              background-color: transparent !important;

              .duration-month {
                font-weight: 600;
                color: #338ff5 !important;
              }
            }

            > .duration-currency {
              padding: 8px 0;
            }

            > .duration-through {
              text-decoration: line-through;
            }
          }

          > .duration-left {
            margin-left: 60px;
          }
        }

        > .detail-usable {
          margin: 100px 0 80px;

          > .usable-title {
            width: 100px;
          }

          > .usable {
            width: 500px;

            > .usable-asset {
              > .currency {
                margin-left: 5px;
              }
            }

            > .usable-gain {
              margin-left: 25px;
            }
          }
        }

        > .detail-page-btn {
          width: 100%;
          height: 40px;
          margin-bottom: 50px;

          > .page-btn {
            width: 290px;
            height: 40px;
          }
        }
      }

      > .text-below {
        width: 1300px;
        height: 350px;
        padding-top: 80px;
        margin: 0 auto;
        line-height: 25px;

        > .warm-prompt {
          font-weight: 600;
        }
      }
    }

    /deep/ {
      /* 覆盖Element样式 */
      .el-dialog {
        top: 5%;
        width: 310px;
        border-radius: 10px;

        .el-dialog__header {
          padding: 10px 20px;
          border-radius: 5px 5px 0 0;
          background-color: #20293c;
        }

        .el-dialog__body {
          padding: 0 20px 10px;

          .ql-editor {
            padding-top: 0;
          }
        }

        .el-dialog__title {
          color: #fff;
        }
      }

      .el-form-item {
        margin-bottom: 0;
      }

      .el-form-item__label {
        color: #fff;
      }

      .el-input__inner {
        width: 270px;
        height: 34px;
        border: 1px solid rgba(72, 87, 118, 1);
        background-color: #1a2233;

        &:focus {
          border: 1px solid #338ff5;
        }
      }

      .el-button {
        width: 270px;
        height: 36px;
        border: 0;
        line-height: 0;
        background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
      }

      .content-main-content {
        .discounts-instruction-dialog {
          .el-dialog {
            height: 800px;
            overflow: auto;
          }

          .el-dialog__header {
            text-align: center;
            background-color: transparent;
          }

          .el-dialog__title {
            color: #338ff5;
          }
        }
      }
    }

    &.night {
      color: $nightFontColor;
      background-color: $nightBgColor;

      > .header-content {
        background-color: #272b41;
      }

      > .content-main-content {
        margin-top: -3px;
        background: #272b41;

        .html-content {
          color: $nightFontColor;
        }

        > .content-main {
          .content-info-hint {
            .hint-color {
              color: #338ff5;
            }
          }

          > .content-main-box {
            > .content-module {
              border: 2px solid #33404b;
              background-color: #1c1f32;

              &.disable {
                opacity: .5;
              }

              &.active1 {
                &:hover {
                  border: 4px solid #338ff5;
                  box-shadow: 0 0 15px rgba(0, 0, 0, 1);
                  transform: scale(1.03);

                  > .content-text {
                    font-weight: 600;
                    color: rgba(51, 143, 245, 1);
                  }

                  > .content-discount {
                    color: rgba(255, 255, 255, 1);
                    background-color: #2d3651;

                    > .content-discount-color {
                      font-weight: 600;
                      color: rgba(51, 143, 245, 1);
                    }
                  }

                  > .content-button {
                    > .click-btn {
                      color: #fff;
                      background: #338ff5;
                    }
                  }
                }
              }

              > .content-vip-one {
                color: #fff;
              }

              > .content-text {
                color: rgba(51, 143, 245, .6);
              }

              > .content-discount {
                color: rgba(255, 255, 255, .6);
                background-color: #2d3651;

                > .content-discount-color {
                  color: rgba(51, 143, 245, .6);
                }
              }

              > .content-button {
                > .click-btn {
                  color: #fff;
                  background: linear-gradient(0deg, rgba(26, 29, 47, 1) 0%, rgba(45, 54, 81, 1) 100%);
                }
              }
            }
          }
        }

        > .content-detail-page {
          > .detail-page-grade {
            .p1 {
              font-size: 30px;
              color: red;
            }

            .p {
              color: blue;
            }

            .blue1 {
              border: 1px solid #338ff5 !important;
              background-color: transparent !important;

              > .grade-color,
              > .grade-height {
                color: #338ff5 !important;
              }
            }

            .grade {
              border: 1px solid #354057;
              background-color: #1a2233;

              &:hover {
                border: 1px solid #338ff5;
                background-color: transparent;

                > .grade-color,
                > .grade-height {
                  color: #338ff5;
                }
              }

              > .grade-color {
                color: #fff;
              }

              > .grade-height {
                color: #9da5b3;
              }
            }
          }

          > .detail-page-duration {
            > .duration {
              border: 1px solid #354057;
              background-color: #1a2233;

              > .duration-month {
                color: #fff;
              }

              > .duration-currency {
                color: #d45858;
              }

              > .duration-through {
                color: #9da5b3;
              }
            }
          }

          > .detail-usable {
            > .usable {
              > .usable-asset {
                font-weight: 600;
                color: #d45858;

                > .currency {
                  color: #fff;
                }
              }

              > .usable-gain {
                color: #338ff5;
              }
            }
          }

          > .detail-page-btn {
            > .page-btn {
              border-radius: 4px;
              color: #fff;
              background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
            }
          }
        }

        > .text-below {
          > .warm-prompt {
            color: #fff;
          }

          .prompt-color {
            color: #d45858;
          }

          .warm-text-color {
            color: #9da5b3;
          }
        }
      }

      /deep/ {
        /* 个人中心（黑色主题） */
        .el-dialog {
          background-color: #28334a;
        }
      }
    }

    &.day {
      color: $dayFontColor;
      background-color: $dayBgColor;

      /deep/ {
        .el-dialog__header {
          background: rgba(51, 143, 245, .1);
        }

        .el-dialog__title {
          color: #333;
        }

        .el-input__inner {
          border: 1px solid rgba(236, 241, 248, 1);
          background: rgba(255, 255, 255, 1);

          &:focus {
            border: 1px solid #338ff5;
          }
        }
      }

      > .content-main-content {
        margin-top: -3px;
        color: $dayFontColor;
        background-color: $dayBgColor;

        > .content-main {
          .content-info-hint {
            .hint-color {
              color: #338ff5;
            }
          }

          > .content-main-box {
            > .content-module {
              border: 2px solid rgba(222, 228, 233, 1);
              background: rgba(234, 239, 244, 1);

              &.disable {
                opacity: .5;
              }

              &.active1 {
                &:hover {
                  border: 2px solid #338ff5;
                  transform: scale(1.03);

                  > .content-text {
                    font-weight: 600;
                    color: rgba(51, 143, 245, 1);
                  }

                  > .content-button {
                    > .click-btn {
                      color: #fff;
                      background: #338ff5;
                    }
                  }
                }
              }

              > .content-vip-one {
                color: #333;
              }

              > .content-text {
                color: rgba(51, 143, 245, .6);
              }

              > .content-discount {
                color: rgba(34, 34, 34, .6);
                background: rgba(222, 231, 239, 1);

                > .content-discount-color {
                  color: rgba(51, 143, 245, .6);
                }
              }

              > .content-button {
                > .click-btn {
                  color: #fff;
                  background: #99b4d1;
                }
              }
            }
          }
        }

        > .content-detail-page {
          .blue1 {
            border: 1px solid #338ff5 !important;
            background-color: transparent !important;

            .duration-month {
              font-weight: 600;
              color: red !important;
            }
          }

          > .detail-page-grade {
            .p1 {
              font-size: 30px;
              color: red;
            }

            .p {
              color: blue;
            }

            .blue1 {
              border: 1px solid #338ff5 !important;
              color: #338ff5 !important;
              background-color: transparent !important;

              > .grade-color,
              > .grade-height {
                color: #338ff5 !important;
              }
            }

            .grade {
              background-color: #eaeff4;

              &:hover {
                border: 1px solid #338ff5;
                background-color: transparent;

                > .grade-color,
                > .grade-height {
                  color: #338ff5;
                }
              }

              > .grade-color {
                color: #333;
              }

              > .grade-height {
                color: #222;
              }
            }
          }

          > .detail-page-duration {
            background-color: $dayBgColor;

            > .duration {
              background: rgba(234, 239, 244, 1);

              > .duration-month {
                font-weight: 600;
                color: #333;
              }

              > .duration-currency {
                font-weight: 600;
                color: #d45858;
              }

              > .duration-through {
                color: #333;
              }
            }
          }

          > .detail-usable {
            > .usable {
              > .usable-asset {
                font-weight: 600;
                color: #d45858;

                > .currency {
                  color: #fff;
                }
              }

              > .usable-gain {
                color: #338ff5;
              }
            }
          }

          > .detail-page-btn {
            > .page-btn {
              border-radius: 4px;
              color: #fff;
              background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
            }
          }
        }

        > .text-below {
          > .warm-prompt {
            color: #fff;
          }

          .prompt-color {
            color: #d45858;
          }

          .warm-text-color {
            color: #9da5b3;
          }
        }
      }
    }
  }
</style>
