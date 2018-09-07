<template>
  <div
    class="credited-credited personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="credited-credited-header personal-height40 line-height40 background-color">
      <span class="padding-left23 header-content font-size16">收款账户</span>
    </header>
    <div class="credited-credited-main min-height500 margin-top9">
      <div class="credited-box">
        <p class="content-title font-size12">
          <span class="title-tips">温馨提示：</span>
          <span class="tips-content">
            请务必使用您本人的实名账户，被激活的支付方式将在OTC交易时向买方展示，可设置5种但最多激活3种
          </span>
        </p>
        <div class="title-status font-size12">
          <span class="left">收款方式</span>
          <span class="right">操作</span>
        </div>
        <div class="payment-content">
          <!--银行卡-->
          <div class="payment-box">
            <p class="payment-left">
              <span>
                <IconFontCommon
                  class="font-size22"
                  iconName="icon-yinlian"
                />
              </span>
              <span class="payment-card">银行转账</span>
            </p>
            <div class="payment-right">
              <img
                v-if="paymentTerm.isBnakEnable === 'disable'"
                @click="statusOpenToClose('bank', 'enable')"
                class="switch-img cursor-pointer"
                :src="closePictureSrc"
              >
              <img
                v-else
                @click="statusOpenToClose('bank', 'disable')"
                class="switch-img cursor-pointer"
                :src="openPictureSrc"
              >
              <router-link  to="/AddBankCard">
                <span class="payment-state cursor-pointer">
                    设置
                </span>
              </router-link>
            </div>
          </div>
          <!--微信-->
          <div class="payment-box">
            <p class="payment-left">
              <span>
                <IconFontCommon
                  class="font-size22"
                  iconName="icon-weixin1"
                />
              </span>
              <span class="payment-card">微信</span>
            </p>
            <p class="payment-right">
              <img
                v-if="paymentTerm.isWeixinEnable === 'disable'"
                @click="statusOpenToClose('chat', 'enable')"
                class="switch-img cursor-pointer"
                :src="closePictureSrc"
              >
              <img
                v-else
                @click="statusOpenToClose('chat', 'disable')"
                class="switch-img cursor-pointer"
                :src="openPictureSrc"
              >
              <router-link to="/AddWeChat">
                <span class="payment-state cursor-pointer">
                  设置
                </span>
              </router-link>
            </p>
          </div>
          <!--支付宝-->
          <div class="payment-box">
            <p class="payment-left">
              <span>
                <IconFontCommon
                  class="font-size22"
                  iconName="icon-zhifufangshi-zhifubao"
                />
              </span>
              <span class="payment-card">支付宝</span>
            </p>
            <p class="payment-right">
              <img
                v-if="paymentTerm.isAlipayEnable === 'disable'"
                @click="statusOpenToClose('alipay', 'enable')"
                class="switch-img cursor-pointer"
                :src="closePictureSrc"
              >
              <img
                v-else
                @click="statusOpenToClose('alipay', 'disable')"
                class="switch-img cursor-pointer"
                :src="openPictureSrc"
              >
              <router-link to="/AddSetAlipay">
                <span class="payment-state cursor-pointer">
                  设置
                </span>
              </router-link>
            </p>
          </div>
          <!--PAYPAL-->
          <div class="payment-box">
            <p class="payment-left">
              <span>
                <IconFontCommon
                  class="font-size22"
                  iconName="icon-paypal"
                />
              </span>
              <span class="payment-card">PAYPAL</span>
            </p>
            <p class="payment-right">
              <img
                v-if="paymentTerm.isPaypalEnable === 'disable'"
                @click="statusOpenToClose('paypal', 'enable')"
                class="switch-img cursor-pointer"
                :src="closePictureSrc"
              >
              <img
                v-else
                @click="statusOpenToClose('paypal', 'disable')"
                class="switch-img cursor-pointer"
                :src="openPictureSrc"
              >
              <router-link class="setting-btn" to="/AddSetPaypal">
                <span class="payment-state cursor-pointer">
                  设置
                </span>
              </router-link>
            </p>
          </div>
          <!--西联汇款-->
          <div class="payment-box">
            <p class="payment-left">
              <span>
                <img src="../../../assets/user/xilian.png" alt="">
              </span>
              <span class="payment-card">西联汇款</span>
            </p>
            <p class="payment-right">
              <img
                v-if="paymentTerm.isXilianEnable === 'disable'"
                @click="statusOpenToClose('western', 'enable')"
                class="switch-img cursor-pointer"
                :src="closePictureSrc"
              >
              <img
                v-else
                @click="statusOpenToClose('western', 'disable')"
                class="switch-img cursor-pointer"
                :src="openPictureSrc"
              >
              <router-link class="setting-btn" to="/AddWesternUnion">
                <!--<span class="payment-state cursor-pointer">-->
                  设置
                <!--</span>-->
              </router-link>
            </p>
          </div>
          <!--未实名认证前弹框提示-->
          <el-dialog
            :visible.sync="centerModelWarning"
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
            <p class="font-size14 warning-text margin-top35 text-align-c">
              请先完成身份认证，再来设置OTC收款账户!
            </p>
            <span
              slot="footer"
              class="dialog-footer"
            >
              <el-button
                type="primary"
                @click="authenticationJump"
              >
                去认证
              </el-button>
          </span>
          </el-dialog>
          <!--开启二次确认弹框-->
          <el-dialog
            title="开启收款方式"
            :visible.sync="openCollectionMode"
            center
          >
            <!--<span>是否确定关闭当前收款方式</span>-->
            <span v-show="closeBankCard">开启银行卡收款方式</span>
            <span v-show="closeMicroLetter">开启微信收款方式</span>
            <span v-show="closeAlipay">开启支付宝收款方式</span>
            <span v-show="closePayapl">开启payapl收款方式</span>
            <span v-show="closeWesternUnion">开启西联汇款收款方式</span>
            <span
              slot="footer"
              class="dialog-footer"
            >
              <el-button
                @click="closeCollectionMode = false"
              >
                取 消
              </el-button>
              <el-button
                type="primary"
                @click="determineTheOpen"
              >
                  确 定
              </el-button>
            </span>
          </el-dialog>
          <!--关闭二次确认弹框-->
          <el-dialog
            title="关闭收款方式"
            :visible.sync="closeCollectionMode"
            center
          >
            <!--<span>是否确定关闭当前收款方式</span>-->
            <span v-show="closeBankCard">是否确定关闭银行卡收款方式</span>
            <span v-show="closeMicroLetter">是否确定关闭微信收款方式</span>
            <span v-show="closeAlipay">是否确定关闭支付宝收款方式</span>
            <span v-show="closePayapl">是否确定关闭payapl收款方式</span>
            <span v-show="closeWesternUnion">是否确定关闭西联汇款收款方式</span>
            <span
              slot="footer"
              class="dialog-footer"
            >
              <el-button
                @click="closeCollectionMode = false"
              >
                取 消
              </el-button>
              <el-button
                type="primary"
                @click="determineTheOpen"
              >
                  确 定
              </el-button>
            </span>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import IconFontCommon from '../../Common/IconFontCommon'
import {returnAjaxMessage} from '../../../utils/commonFunc'
import {accountPaymentTerm, openAndCloseModeSetting} from '../../../utils/api/personal'
import {mapState, createNamespacedHelpers} from 'vuex'
const { mapMutations } = createNamespacedHelpers('personal')
export default {
  components: {
    IconFontCommon // 字体图标
  },
  // props,
  data () {
    return {
      bankState: false, // 银行卡状态的设置
      weChat: false, // 微信状态的设置
      alipay: false, // 支付宝状态的设置
      paypal: false, // PAYPAL状态的设置
      westernUnion: false, // 西联汇款状态的设置
      closePictureSrc: require('../../../assets/user/wrong.png'), // 关闭
      openPictureSrc: require('../../../assets/user/yes.png'), // 开启
      centerModelWarning: false, // 未实名认证前弹框提示
      openCollectionMode: false, // 开启收款方式
      closeCollectionMode: false, // 关闭收款方式
      paymentTerm: {}, // 收款方式
      closeBankCard: false, // 默认关闭银行卡
      closeMicroLetter: false, // 默认关闭微信
      closeAlipay: false, // 默认关闭支付宝
      closePayapl: false, // 默认关闭paypal
      closeWesternUnion: false, // 默认关闭西联汇款
      activeType: '', // 当前值
      state: '' // 开启关闭
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/UserAssets/AccountCredited.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/UserAssets/AccountCreditedDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/UserAssets/AccountCreditedNight.css')
    // 获取全局个人信息
    // this.authenticationInfo = this.userInfo.data.user
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_USER_CENTER_ACTIVE_NAME'
    ]),
    // 点击去认证跳转到身份认证
    authenticationJump () {
      this.centerModelWarning = false
      this.CHANGE_USER_CENTER_ACTIVE_NAME('identity-authentication')
    },
    // 收款方式
    async getAccountPaymentTerm () {
      let data = await accountPaymentTerm({})
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回状态展示
        this.paymentTerm = data.data.data
        console.log(this.paymentTerm)
      }
    },
    // 确认开启关闭
    statusOpenToClose (paymentType, safeState) {
      // 把方法中定义的activeType、state在这里进行赋值 点击哪一个那当前的类型和状态传给后台
      this.activeType = paymentType
      this.state = safeState
      switch (paymentType) {
        case 'bank':
          console.log(paymentType)
          if (!this.paymentTerm.isBankBind) {
            if (safeState === 'enable') {
              this.openCollectionMode = true
              this.closeBankCard = true
              this.closeMicroLetter = false
              this.closeAlipay = false
              this.closePayapl = false
              this.closeWesternUnion = false
            } else {
              this.closeCollectionMode = true
              this.closeBankCard = true
              this.closeMicroLetter = false
              this.closeAlipay = false
              this.closePayapl = false
              this.closeWesternUnion = false
            }
          } else {
            this.openCollectionMode = false
          }
          break
        case 'chat':
          if (!this.paymentTerm.isWeixinBind) {
            if (safeState === 'enable') {
              this.openCollectionMode = true
              this.closeBankCard = false
              this.closeMicroLetter = true
              this.closeAlipay = false
              this.closePayapl = false
              this.closeWesternUnion = false
            } else {
              this.closeCollectionMode = true
              this.closeBankCard = false
              this.closeMicroLetter = true
              this.closeAlipay = false
              this.closePayapl = false
              this.closeWesternUnion = false
            }
          } else {
            this.openCollectionMode = false
          }
          break
        case 'alipay':
          if (!this.paymentTerm.isAlipayBind) {
            if (safeState === 'enable') {
              this.openCollectionMode = true
              this.closeBankCard = false
              this.closeMicroLetter = false
              this.closeAlipay = true
              this.closePayapl = false
              this.closeWesternUnion = false
            } else {
              this.closeCollectionMode = true
              this.closeBankCard = false
              this.closeMicroLetter = false
              this.closeAlipay = true
              this.closePayapl = false
              this.closeWesternUnion = false
            }
          } else {
            this.openCollectionMode = false
          }
          break
        case 'paypal':
          if (!this.paymentTerm.isPaypalBind) {
            if (safeState === 'enable') {
              this.openCollectionMode = true
              this.closeBankCard = false
              this.closeMicroLetter = false
              this.closeAlipay = false
              this.closePayapl = true
              this.closeWesternUnion = false
            } else {
              this.closeCollectionMode = true
              this.closeBankCard = false
              this.closeMicroLetter = false
              this.closeAlipay = false
              this.closePayapl = true
              this.closeWesternUnion = false
            }
          } else {
            this.openCollectionMode = false
          }
          break
        case 'western':
          if (!this.paymentTerm.isXilianBind) {
            if (safeState === 'enable') {
              this.openCollectionMode = true
              this.closeBankCard = false
              this.closeMicroLetter = false
              this.closeAlipay = false
              this.closePayapl = false
              this.closeWesternUnion = true
            } else {
              this.closeCollectionMode = true
              this.closeBankCard = false
              this.closeMicroLetter = false
              this.closeAlipay = false
              this.closePayapl = false
              this.closeWesternUnion = true
            }
          } else {
            this.openCollectionMode = false
          }
          break
      }
    },
    // 确认关闭
    determineTheOpen () {
      this.confirmTransactionPassword(this.activeType, this.state)
    },
    // 关闭开启收款方式
    async confirmTransactionPassword (type, state) {
      let data
      let params = {
        type: '', // 银行卡 微信 支付宝 paypal 西联汇款
        status: '' // 开启 关闭
      }
      switch (type) {
        case 'bank':
          params.type = 'bank'
          if (state === 'enable') {
            params.status = 'enable'
          } else {
            params.status = 'disable'
          }
          break
        case 'chat':
          params.type = 'weixin'
          if (state === 'enable') {
            params.status = 'enable'
          } else {
            params.status = 'disable'
          }
          break
        case 'alipay':
          params.type = 'alipay'
          if (state === 'enable') {
            params.status = 'enable'
          } else {
            params.status = 'disable'
          }
          break
        case 'paypal':
          params.type = 'paypal'
          if (state === 'enable') {
            params.status = 'enable'
          } else {
            params.status = 'disable'
          }
          break
        case 'western':
          params.type = 'xilian'
          if (state === 'enable') {
            params.status = 'enable'
          } else {
            params.status = 'disable'
          }
          break
      }
      data = await openAndCloseModeSetting(params)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 安全中心状态刷新
        this.getAccountPaymentTerm()
        this.openCollectionMode = false // 开启收款方式
        this.closeCollectionMode = false // 关闭收款方式
      }
    },
    filter: {},
    computed: {
      ...mapState({
        theme: state => state.common.theme,
        userInfo: state => state.user.loginStep1Info // 用户详细信息
      })
    },
    watch: {}
  }
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/UserAssets/AccountCredited";
  .credited-credited {
    >.credited-credited-main {
      >.credited-box{
        padding: 30px 23px;
        >.title-status {
          height: 35px;
          border-radius: 2px;
          margin-top: 24px;
          padding: 9px 73px 8px 17px;
        }
        >.payment-content {
          min-height: 200px;
          >.payment-box {
            height: 22px;
            margin-top: 26px;
            display: flex;
            padding: 0 73px 0 17px;
            >.payment-left,
            .payment-right {
              flex: 1;
              width: 100px;
            }
            >.payment-left {
              text-align: left;
            }
            >.payment-right {
              text-align: right;
              position: relative;
              >.switch-img {
                position: absolute;
                right: 40px;
                top: 0px;
              }
            }
          }
        }
        .payment-card,
        .payment-state {
          margin-left: 5px;
        }
        .dialog-warning {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          padding-top: 6px;
          margin: 0 auto;
          .dialog-warning-box {
            width: 78px;
            height: 78px;
            border-radius: 50%;
            margin: 0 auto;
            text-align: center;
            line-height: 75px;
          }
        }
      }
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      >.background-color {
        /*background-color: #1E2636;*/
        background-color: red;
      }
      >.credited-credited-main {
        background-color: #1E2636;
        .credited-box{
          >.payment-content {
            >.payment-box {
              .payment-right {
                .setting-btn {
                  color: #fff
                }
              }
            }
            .payment-card {
              color: #fff;
            }
            .payment-state {
              color: #fff;
            }
            .dialog-warning {
              background:rgba(42,122,211,0.2);
              .dialog-warning-box {
                background:linear-gradient(90deg,rgba(43,57,110,1),rgba(42,80,130,1));
              }
            }
            .warning-text {
              color: #fff;
            }
          }
        }
      }
      >.credited-credited-header{
        >.header-content{
          color: #338FF5;
        }
      }
      .content-title {
        >.title-tips {
          color: #D45858;
        }
        >.tips-content {
          color: #9DA5B3;
        }
      }
      .title-status {
        background:rgba(248,249,252,0.05);
        color: #fff;
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      >.background-color {
        background-color: #ccc;
      }
      >.credited-credited-main {
        background-color: #CCCCCC;
      }
      >.credited-credited-header{
        >.header-content{
          color: #333;
        }
      }
      .content-title{
        >.title-tips {
          color: #333;
        }
        >.tips-content {
          color: #333;
        }
      }
      .title-status {
        background-color: #000;
        color: #000;
      }
      .payment-content {
        .payment-card {
          color: #000;
        }
        .payment-state {
          color: #333;
        }
        .dialog-warning {
          background:rgba(42,122,211,0.9);
          .dialog-warning-box {
            background:linear-gradient(90deg,rgba(43,57,110,1),rgba(42,80,130,1));
          }
        }
        .warning-text {
          color: #333;
        }
      }
    }
  }
</style>
