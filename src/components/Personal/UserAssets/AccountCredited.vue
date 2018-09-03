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
            <p class="payment-right">
              <el-switch
                v-model="bankState"
              >
              </el-switch>
              <img
                class="switch-img"
                v-show="!bankState"
                :src="closePictureSrc"
              >
              <img
                class="switch-img"
                v-show="!!bankState"
                :src="openPictureSrc"
              >
              <router-link to="/AddBankCard">
                <span class="payment-state cursor-pointer">
                  设置
                </span>
              </router-link>
            </p>
          </div>
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
              <el-switch
                v-model="weChat"
              >
              </el-switch>
              <img
                class="switch-img"
                v-show="!weChat"
                :src="closePictureSrc"
              >
              <img
                class="switch-img"
                v-show="!!weChat"
                :src="openPictureSrc"
              >
              <router-link to="/AddWeChat">
                <span class="payment-state cursor-pointer">
                  设置
                </span>
              </router-link>
            </p>
          </div>
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
              <el-switch
                v-model="alipay"
              >
              </el-switch>
              <img
                class="switch-img"
                v-show="!alipay"
                :src="closePictureSrc"
              >
              <img
                class="switch-img"
                v-show="!!alipay"
                :src="openPictureSrc"
              >
              <router-link to="/AddSetAlipay">
                <span class="payment-state cursor-pointer">
                  设置
                </span>
              </router-link>
            </p>
          </div>
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
              <el-switch
                v-model="paypal"
                on-text="ON"
                off-text="OFF"
              >
              </el-switch>
              <img
                class="switch-img"
                v-show="!paypal"
                :src="closePictureSrc"
              >
              <img
                class="switch-img"
                v-show="!!paypal"
                :src="openPictureSrc"
              >
              <router-link to="/AddSetPaypal">
                <span class="payment-state cursor-pointer">
                  设置
                </span>
              </router-link>
            </p>
          </div>
          <div class="payment-box">
            <p class="payment-left">
              <span>
                <img src="../../../assets/user/xilian.png" alt="">
              </span>
              <span class="payment-card">西联汇款</span>
            </p>
            <p class="payment-right">
              <el-switch
                v-model="westernUnion"
              >
              </el-switch>
              <img
                class="switch-img"
                v-show="!westernUnion"
                :src="closePictureSrc"
              >
              <img
                class="switch-img"
                v-show="!!westernUnion"
                :src="openPictureSrc"
              >
              <router-link to="/AddWesternUnion">
                <span class="payment-state cursor-pointer">
                  设置
                </span>
              </router-link>
            </p>
          </div>
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

        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import IconFontCommon from '../../Common/IconFontCommon'
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations } = createNamespacedHelpers('personal')
export default {
  components: {
    IconFontCommon // 字体图标
  },
  // props,
  data () {
    return {
      bankState: false, // 银行卡状态的设置
      weChat: false, // 银行卡状态的设置
      alipay: false, // 支付宝状态的设置
      paypal: false, // PAYPAL状态的设置
      closePictureSrc: require('../../../assets/user/wrong.png'), // 关闭
      openPictureSrc: require('../../../assets/user/yes.png'), // 开启
      westernUnion: false, // 西联汇款状态的设置
      centerModelWarning: false, // 警告提示框
      authenticationInfo: {} // 个人信息
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
    this.authenticationInfo = this.userInfo.data.user
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
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      userInfo: state => state.personal.userInfo
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/UserAssets/AccountCredited";
  .credited-credited{
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
        background-color: #1E2636;
      }
      >.credited-credited-main {
        background-color: #1E2636;
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
      .payment-content {
        .payment-card {
          color: #fff;
        }
        .payment-state {
          color: #338FF5;
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
