<template>
  <div
    class="account-assets personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="account-assets-main">
      <UserInfo />
      <div class="account-assets-box margin-top16">
        <div>
          <header class="account-assets-header display-flex personal-height40 line-height40">
            <div class="header-flex header-left flex1 padding-left23 font-size16 font-weight600">
              我的资产
            </div>
            <div class="header-flex header-right flex1 padding-right23 display-flex">
              <p class="header-right-left float-left flex1">
                <span class="header-right-text text-align-r display-inline-block">
                  显示有资金币种
                </span>
                <span>
                  <el-switch
                    v-model="hideStatusButton"
                    active-color="#2A7AD3"
                    inactive-color="#38424C"
                    @click="showStatusCurrency"
                  >
                  </el-switch>
                </span>
              </p>
              <p class="header-right-right float-left flex1 text-align-r">
                <IconFontCommon
                  class="font-size16 icon-color"
                  iconName="icon-sousuo-copy"
                />
                <input
                  type="text"
                  class="header-right-search border-radius2 padding-left25 font-size12"
                >
              </p>
            </div>
          </header>
        </div>
        <div class="account-assets-content">
          <!--账户资产币种列表-->
          <div class="content-list min-height500">
            <div class="table-body text-align-l line-height50">
              <!-- 表头 -->
              <div class="table-title-th display-flex margin20 font-size12">
                <!--币种  总数量  冻结数量  可用数量  资产估值(BTC)  操作-->
                <div
                  class="flex1"
                >
                  币种
                </div>
                <div
                  class="flex1"
                >
                  总数量
                </div>
                <div

                  class="flex1"
                >
                  冻结数量
                </div>
                <div
                  class="flex1"
                >
                  可用数量
                </div>
                <div
                  class="flex1 text-align-c"
                >
                  资产估值(BTC)
                  <i class="el-icon-caret-bottom"></i>
                  <i class="el-icon-caret-top"></i>
                </div>
                <div
                  class="flex1 text-align-c"
                >
                  操作
                </div>
              </div>
              <div
                class="table-tr margin20 font-size12"
                v-for="(item, index) in withdrawDepositIsShowList"
                :key="index"
              >
                <div class="table-box display-flex">
                  <div class="table-td flex1">
                    {{ item.coinName }}
                  </div>
                  <div class="table-td flex1">
                    {{ item.frozen + item.total }}
                  </div>
                  <div class="table-td flex1">
                    {{ item.frozen }}
                  </div>
                  <div class="table-td flex1">
                    {{ item.total }}
                  </div>
                  <div class="table-td flex1 text-align-c">
                    {{ item.assetValuation }}
                  </div>
                  <div class="table-td flex1 display-flex text-align-r font-size12">
                    <div
                      class="table-charge-money flex1 cursor-pointer"
                      @click="showRechargeBox(item.coinId, item.coinName, index)"
                    >
                      充币
                    </div>
                    <div
                      class="table-mention-money flex1 cursor-pointer"
                      @click="mentionMoneyButton(item.coinId, item.coinName, index)"
                    >
                      提币
                    </div>
                    <div
                      class="table-deal flex1 cursor-pointer"
                    >
                      交易
                      <div
                        class="type-transaction border-radius4"
                      >
                        <span class="triangle-border display-inline-block"></span>
                        <p
                          class="transaction-list text-align-c"
                          v-for="(item, index) in currencyTrading"
                          :key="index"
                        >
                          {{ item.currency }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <transition enter-active-class="animated fadeIn">
                  <div
                    class="table-box"
                  >
                    <!--充币内容-->
                    <div
                      v-show="withdrawDepositIsShowList[index].rechargeIsShow"
                      class="recharge-list display-flex"
                    >
                      <p class="triangle"></p>
                      <div class='recharge-content'>
                        <p class="recharge-content-hint font-size12">
                          <span>{{ chargeMoneyName }}</span>充值地址
                        </p>
                        <div
                          class="input-box"
                        >
                          <input
                            class="hint-input border-radius2 padding-l15 float-left"
                            disabled
                            v-model="chargeMoney"
                          />
                          <span
                            class="code-copy cursor-pointer display-inline-block float-left text-align-c"
                            v-clipboard:copy="chargeMoney"
                            v-clipboard:success="onCopy"
                            v-clipboard:error="onError"
                          >
                            复制地址
                          </span>
                        </div>
                        <div class="recharge-content-title font-size12 margin-top9 float-left">
                          <p>* 禁止充值除{{ chargeMoneyName }}之外的其他资产，任何非{{ chargeMoneyName }}资产充值将不可找回</p>
                          <p>* 往该地址充值，汇款完成，等待网络自动确认（4个确认）后系统自动到账</p>
                          <p>* 为了快速到账，充值时可以适当提高网络手续费</p>
                        </div>
                      </div>
                      <div class='recharge-content-right flex1'>
                        <p class="recharge-content-code margin-top45 float-left">
                          <VueQrcode
                            class="ercode"
                            :value="chargeMoney"
                            :options="{ size: 100 }"
                          >
                          </VueQrcode>
                        </p>
                        <p
                          class="code-list text-align-r float-right cursor-pointer font-size12"
                          @click="stateRechargeRecord"
                        >
                          充值记录
                        </p>
                      </div>
                    </div>
                    <!--提币内容-->
                    <div
                      class="recharge-list recharge-list-mention display-flex padding20"
                      v-show="withdrawDepositIsShowList[index].withdrawDepositIsShow"
                    >
                      <p class="triangle triangle-one"></p>
                      <div class="recharge-list-left display-flex">
                        <div class="list-left-flex flex1 font-size12">
                          <div class="flex-box padding-top10">
                            <p class="left-flex-hint">
                              {{ chargeMoneyName }}
                              提币地址
                            </p>
                            <el-select
                              v-model="mentionAddressValue"
                              @change="changeId"
                            >
                              <el-option
                                v-for="(item, index) in mentionAddressList"
                                :key="index"
                                :label="item.address"
                                :value="item.coinId"
                              >
                              </el-option>
                            </el-select>
                            <span
                              class="new-address cursor-pointer"
                              @click="stateMentionAddress"
                            >
                          新增
                        </span>
                          </div>
                          <div class="flex-box padding-top40">
                            <p class="left-flex-hint">
                              手续费 (5~10)
                            </p>
                            <input
                              type="text"
                              class="flex-input border-radius2 padding-l15 box-sizing"
                              ref="serviceCharge"
                              @keyup="changeInputValue('serviceCharge', index)"
                            >
                          </div>
                        </div>
                        <div class="count-box flex1 font-size12">
                          <div class="count-flex-box padding-top10">
                            <p class="content-flex-hint">数量</p>
                            <input
                              type="text"
                              class="count-flex-input border-radius2 paddinglr15 box-sizing text-align-r"
                              ref="rechargeCount"
                              @keyup="changeInputValue('rechargeCount', index)"
                            >
                            <p class="count-flex-text text-align-r">
                              <span>限额：</span>
                              <span>600000.00CNY</span>
                            </p>
                          </div>
                          <div class="count-flex-box padding-top40">
                            <p class="content-flex-hint">到账数量</p>
                            <input
                              type="text"
                              disabled
                              class="count-text-input border-radius2 paddinglr15 box-sizing text-align-r"
                              v-model="serviceChargeCount"
                            >
                          </div>
                        </div>
                      </div>
                      <div class="text-info flex1 font-size12">
                        <p class="currency-rule">
                          BTC提现费率规则：
                        </p>
                        <p class="prompt-message">
                          * 为了用户资金安全，平台可能会电话确认您的提币操作，请注意接听；
                        </p>
                        <p class="prompt-message">
                          * BTC充值经过1个确认后，才允许提现；
                        </p>
                        <p class="prompt-message">
                          * 可提现金额≤账户可用资产-未确认的数字资产。
                        </p>
                        <p class="mention-button">
                          <button
                            class="font-size12 submit-but border-radius4 cursor-pointer"
                            @click="submitMentionMoney"
                          >
                            提币
                          </button>
                          <span
                            class="float-right cursor-pointer"
                            @click="stateRechargeRecord"
                          >
                        提币记录
                      </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
// 我的资产
import UserInfo from '../AccountBalance/UserInfo'
// 字体图标
import IconFontCommon from '../../Common/IconFontCommon'
import VueClipboard from 'vue-clipboard2'
import { createNamespacedHelpers, mapState } from 'vuex'
import {
  assetCurrenciesList,
  inquireWithdrawalAddressList,
  inquireRechargeAddressList
} from '../../../utils/api/personal'
import {returnAjaxMessage} from '../../../utils/commonFunc'
const { mapMutations } = createNamespacedHelpers('personal')
Vue.use(VueClipboard)
export default {
  components: {
    UserInfo, // 我的资产
    IconFontCommon, // 字体图标
    // 二维码组件
    VueQrcode: resolve => {
      require([('@xkeshi/vue-qrcode')], resolve)
    }
  },
  // props,
  data () {
    return {activeNames: ['1'],
      showStatusButton: true, // 显示币种
      hideStatusButton: true, // 隐藏币种// 显示所有/余额切换，
      searchName: '', // 搜索关键字
      withdrawDepositIsShowList: [],
      activeCoinId: '', // 提现币种id
      rechargeIsShowList: false, // 充币内容
      chargeMoney: '', // 根据充币地址生成二维码条件
      serviceCharge: '', // 自定义手续费
      rechargeCount: '', // 提币数量
      serviceChargeCount: '', // 自定义到账数量
      currencyTrading: [
        {
          id: 1,
          currency: 'OTC'
        },
        {
          id: 2,
          currency: 'BTC/USDT'
        },
        {
          id: 3,
          currency: 'BTC/FBT'
        }
      ],
      // 充值
      chargeDialogVisible: false, // 取消弹窗默认隐藏
      chargeMoneyAddressId: '', // 每行数据ID
      chargeMoneyName: '', // 每行数据币种名称
      // 提币
      mentionDialogVisible: false, // 取消弹窗默认隐藏
      mentionMoneyAddressId: '', // 每行数据ID
      mentionMoneyName: '', // 每行数据币种名称
      mentionAddressValue: '', // 每行数据提币地址
      // 提币地址列表
      mentionAddressList: [],
      activeCurrency: {}, // 当前选中币种
      end: '' // 站位
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/AccountBalance/AccountAssets.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/AccountBalance/AccountAssetsDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/AccountBalance/AccountAssetsNight.css')
    // 刚进页面时候 个人资产列表展示
    // this.getAssetCurrenciesList()
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_USER_CENTER_ACTIVE_NAME'
    ]),
    // 切换当前币种

    // 隐藏币种为零的
    showStatusCurrency () {
      if (!this.hideStatusButton) {
        this.hideStatusButton = false
        this.queryWithdrawalAddressList()
      }
      console.log(1)
    },
    // 修改input value
    changeInputValue (ref, index) {
      // console.dir(this.$refs[ref])
      this[ref] = this.$refs[ref].value
      // console.log(this[ref])
      if (!this.serviceCharge) {
        this.serviceChargeCount = this.$refs.rechargeCount[index].value
        console.log(this.serviceChargeCount)
      } else {
        this.serviceChargeCount = Math.abs(this.$refs.rechargeCount[index].value - this.$refs.serviceCharge[index].value)
        console.log(this.serviceChargeCount)
      }
    },
    // 显示充值框
    showRechargeBox (id, name, index) {
      console.log(id)
      this.chargeDialogVisible = true
      this.chargeMoneyAddressId = id
      this.chargeMoneyName = name
      this.withdrawDepositIsShowList.forEach((item) => {
        item.rechargeIsShow = false
        item.withdrawDepositIsShow = false
      })
      this.withdrawDepositIsShowList[index].rechargeIsShow = true
      // 调用充币地址方法
      this.fillingCurrencyAddress()
    },
    // 显示提现框
    mentionMoneyButton (id, name, index) {
      console.log(id)
      console.log(index)
      this.mentionDialogVisible = true
      this.mentionMoneyAddressId = id
      this.mentionMoneyName = name
      this.withdrawDepositIsShowList.forEach((item) => {
        item.rechargeIsShow = false
        item.withdrawDepositIsShow = false
      })
      this.withdrawDepositIsShowList[index].withdrawDepositIsShow = true
      // 调用充币地址方法
      this.queryWithdrawalAddressList()
    },
    /**
     * 刚进页面时候 个人资产列表展示
     */
    async getAssetCurrenciesList () {
      let data = await assetCurrenciesList()
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        this.withdrawDepositIsShowList.push({
          allIsShow: false,
          rechargeIsShow: false,
          withdrawDepositIsShow: false
        })
        console.log(data.data.data.userCoinWalletVOPageInfo.list)
        // 返回数据
        this.withdrawDepositIsShowList = data.data.data.userCoinWalletVOPageInfo.list
        // console.log(this.withdrawDepositIsShowList)
      }
    },
    /**
     *  刚进页面时候 提币地址列表查询
     */
    // 资产币种提币地址选择
    changeId (e) {
      this.mentionAddressList.forEach(item => {
        if (e === item.id) {
          this.mentionAddressValue = e
          console.log(item.currencyValue)
        }
      })
    },
    // 查询提币地址列表查询
    async queryWithdrawalAddressList () {
      let data = await inquireWithdrawalAddressList({
        shortName: this.merchantID, // 币种名称
        selectType: this.hideStatusButton // all：所有币种 noall：有资产币种
      })
      // console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回列表数据
        this.mentionAddressList = data.data.data.UserWithdrawAddressPage.list
        this.mentionAddressValue = data.data.data.UserWithdrawAddressPage.list[0].address
        this.mentionAddressValue = data.data.data.UserWithdrawAddressPage.list[0].coinId
        console.log(this.mentionAddressList)
        console.log(this.mentionAddressValue)
      }
    },
    /**
     *  点击充币按钮时 查询充币地址查询
     */
    async fillingCurrencyAddress () {
      let data = await inquireRechargeAddressList({
        coinId: this.chargeMoneyAddressId
      })
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回列表数据
        this.chargeMoney = data.data.data.userRechargeAddress.address
        console.log(this.chargeMoney)
      }
    },
    /**
    * 点击提币按钮
    * */
    submitMentionMoney () {
      this.stateSubmitPushAssets()
    },
    // 提交提币接口
    async stateSubmitPushAssets () {
      let data
      let param = {
        coinId: this.currencyValue, // 提币地址id
        userId: this.buyUID, // 用户id
        partnerId: this.count, // 商户id
        amount: this.price, // 提币数量
        withdrawAddress: this.transactionPassword // 交易密码
      }
      data = await statusSubmitWithdrawButton(param)
      if (!(returnAjaxMessage(data, this, 1))) {
        return false
      } else {
        // 提币地址列表查询
        this.queryWithdrawalAddressList()
      }
    },
    // 点击跳转账单明细
    stateRechargeRecord () {
      console.log('1')
      this.CHANGE_USER_CENTER_ACTIVE_NAME('billing-details')
    },
    // 点击跳转提币地址
    stateMentionAddress () {
      this.CHANGE_USER_CENTER_ACTIVE_NAME('mention-address')
    },
    //  点击复制
    onCopy (e) {
      // 已拷贝
      let msg = '已拷贝'
      this.$message({
        type: 'success',
        message: msg
      })
    },
    onError (e) {
      // 拷贝失败，请稍后重试
      let msg = '拷贝失败，请稍后重试'
      this.$message({
        type: 'success',
        message: msg
      })
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/AccountBalance/AccountAssets";
  .account-assets{
    >.account-assets-main {
      >.account-assets-box {
        min-height: 600px;
        .account-assets-header {
          >.header-flex {
            height: 100%;
            >.header-right-left {
              >.header-right-text {
                width: 180px;
              }
            }
            >.header-right-right {
              position: relative;
              .header-right-search {
                width: 140px;
                height: 26px;
                box-sizing: border-box;
              }
              >.icon-color {
                position: absolute;
                left: 85px;
                top: 12px;
              }
            }
          }
        }
        >.account-assets-content {
          >.content-list {
            >.table-body {
              width: 100%;
              height: 50px;
              >.table-tr {
                >.table-box {
                  >.recharge-list-mention {
                    height:225px !important;
                  }
                  >.recharge-list {
                    position: relative;
                    height:195px;
                    >.triangle {
                      position: absolute;
                      top: -7px;
                      right: 100px;
                      width: 12px;
                      height: 12px;
                      transform:rotate(135deg);
                      -ms-transform:rotate(135deg);
                      -moz-transform:rotate(135deg);
                      -webkit-transform:rotate(135deg);
                      -o-transform:rotate(135deg);
                    }
                    >.triangle-one {
                      right: 50px;
                    }
                    >.recharge-content {
                      padding: 20px 20px;
                      flex: 2;
                      >.recharge-content-hint {
                        line-height: 20px;
                        height: 20px;
                        margin-bottom: 5px;
                      }
                      >.input-box {
                        >.hint-input {
                          width: 430px;
                          height: 34px;
                        }
                        >.code-copy {
                          width: 89px;
                          height: 34px;
                          border-radius: 0 2px 2px 0;
                          line-height: 34px;
                        }
                      }

                      >.recharge-content-title {
                        width: 450px;
                        line-height: 25px;
                      }
                    }
                    >.recharge-content-right {
                      >.recharge-content-code {
                        width: 110px;
                        height: 110px;
                        padding: 5px;
                        box-sizing: border-box;
                      }
                      >.code-list {
                        margin-top: 110px;
                        padding-right: 10px;
                      }
                    }
                    >.recharge-list-left {
                      flex: 3;
                      >.list-left-flex {
                        >.flex-box {
                          position: relative;
                          height: 80px;
                          >.left-flex-hint {
                            line-height: 20px ;
                          }
                          >.flex-input,
                          >.text-input {
                            width: 350px;
                            height: 34px;
                          }
                          >.new-address {
                            position: absolute;
                            top: 30px;
                            right: 15px;
                          }
                        }
                      }
                      >.count-box {
                        padding-left: 15px;
                        >.count-flex-box {
                          height: 80px;
                          >.content-flex-hint,
                          >.count-flex-text {
                            line-height: 20px ;
                          }
                          >.count-flex-text {
                            padding-right: 25px;
                          }
                          >.count-flex-input,
                          >.count-text-input {
                            width: 250px;
                            height: 34px;
                          }
                        }
                      }
                    }
                    >.text-info {
                      >.currency-rule,
                      >.prompt-message {
                        line-height: 20px;
                      }
                      >.mention-button {
                        >.submit-but {
                          width: 80px;
                          height: 34px;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        .table-deal {
          position: relative;
          .type-transaction {
            display: none;
            width: 135px;
            position: absolute;
            top: 10px;
            left: 56px;
            z-index: 2;
            >.triangle-border {
              position: absolute;
              top: 6px;
              left: -8px;
            }
            >.transaction-list {
              height: 30px;
              line-height: 30px;
            }
          }
          &:hover >.type-transaction {
            display: block;
          }
        }
      }
    }
    &.night {
      background-color: $nightBgColor;
      color:$nightFontColor;
      .account-assets-box {
        background-color: #1E2636;
        .account-assets-header {
          box-shadow: 0px 2px 13px rgba(24,30,42,1);
          >.header-left {
            color: #338FF5;
          }
          >.header-right {
            >.header-right-right {
              >.header-right-search {
                background-color: #333F4A;
                color: #fff;
              }
            }
          }
        }
        .table-body {
          >.table-title-th {
            border-bottom: 1px solid #39424D;
            color: #A9BED4;
          }
          >.table-tr {
            >.table-box {
              >.table-td {
                >.table-charge-money,
                >.table-mention-money,
                >.table-deal {
                  color: #3E79D6;
                  >.type-transaction {
                    background-color: #2a3242;
                    >.triangle-border {
                      border-right: 8px solid #2a3242;
                      border-top: 8px solid transparent;
                      border-bottom: 8px solid transparent;
                    }
                    >.transaction-list {
                      color:  #7a8093;
                      &:hover {
                        color: #3E79D6;
                      }
                    }
                  }
                }
              }
              >.recharge-list {
                border: 1px solid #338FF5;
                >.triangle {
                  border-right: 1px solid transparent;
                  border-top: 1px solid transparent;
                  border-left: 1px solid #338FF5;
                  border-bottom: 1px solid #338FF5;
                  background-color: #1E2636;
                }
                >.recharge-content {
                  >.recharge-content-hint {
                    color: #338FF5;
                  }
                  >.input-box {
                    >.hint-input {
                      background-color: #181E24;
                      color: #fff;
                    }
                    >.code-copy {
                      background-color: #338FF5;
                      color: #fff;
                    }
                  }
                  >.recharge-content-title {
                    color: #D45858;
                  }
                }
                >.recharge-content-right {
                  >.recharge-content-code {
                    background-color: #fff;
                  }
                }
                >.recharge-list-left {
                  >.list-left-flex {
                    >.flex-box {
                      >.flex-input {
                        background-color: #181E24;
                        color: #fff;
                      }
                      >.text-input {
                        background-color: #37424C;
                        color: #fff;
                      }
                      >.left-flex-hint,
                      >.new-address {
                        color: #338FF5;
                      }
                    }
                  }
                  >.count-box {
                    >.count-flex-box {
                      >.content-flex-hint {
                        color: #338FF5;
                      }
                      >.count-flex-text {
                        color: #83909B;
                      }
                      >.count-flex-input{
                        background-color: #181E24;
                        color: #fff;
                      }
                      >.count-text-input {
                        background-color: #37424C;
                        color: #fff;
                      }
                    }
                  }
                }
                >.text-info {
                  >.currency-rule {
                    color: #D45858;
                  }
                  >.prompt-message {
                    color: #58616A;
                  }
                  >.mention-button {
                    >.submit-but {
                      background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
                      color: #fff;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      .account-assets-box {
        background-color: #1E2636;
        >.account-assets-header {
          box-shadow: 0px 2px 13px rgba(24,30,42,1);
          >.header-left {
            color: #338FF5;
          }
          >.header-right {
            >.header-right-right {
              >.header-right-search {
                background-color: #333F4A;
                color: #fff;
              }
            }
          }
        }
        .table-body {
          >.table-title-th {
            border-bottom: 1px solid #39424D;
            color: #A9BED4;
          }
        }
      }
    }
  }
</style>
