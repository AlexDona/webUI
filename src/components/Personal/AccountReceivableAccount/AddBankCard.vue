<template>
  <div
    class="add-bank personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <HeaderCommon />
    <div class="add-bank-main margin25">
      <header class="add-bank-header personal-height60 line-height60 line-height70 margin25">
        <span
          v-if="paymentTerm.isBankBind"
          class="header-content-left header-content font-size16 font-weight600"
        >
          设置银行卡
        </span>
        <span
          v-else
          class="header-content-left header-content font-size16 font-weight600"
        >
          修改银行卡
        </span>
        <span
          class="header-content-right font-size12 cursor-pointer"
          @click="returnSuperior"
        >
          <IconFontCommon
            class="font-size22"
            iconName="icon-fanhui2"
          />
            返回我的账户
        </span>
      </header>
      <div class="add-bank-content">
        <header class="bank-content-title">
          *请确认您的银行卡已开启短信通知功能
        </header>
        <div class="bank-content-from">
          <el-form
            :label-position="labelPosition"
            label-width="120px"
          >
            <el-form-item label="名 称：">
              <span class="bank-content-name">
                {{ userInfo.userInfo.realname }}
              </span>
            </el-form-item>
            <el-form-item label="银  行  名  称：">
              <input
                class="bank-input border-radius2"
                v-model="bankName"
              />
            </el-form-item>
            <el-form-item label="银  行  卡  号：">
              <input
                class="bank-input border-radius2"
                v-model="bankCard"
              />
            </el-form-item>
            <el-form-item label="支  行  地  址：">
              <input
                class="bank-input border-radius2"
                v-model="branchAddress"
              />
            </el-form-item>
            <el-form-item label="交  易  密  码：">
              <input
                type="password"
                class="bank-input border-radius2"
                v-model="password"
              />
            </el-form-item>
            <button
              v-if="paymentTerm.isBankBind"
              class="bank-button border-radius4"
              @click="statusTetBankCard"
            >
              确认设置
            </button>
            <button
              v-else
              class="bank-button border-radius4"
              @click="statusTetBankCard"
            >
              确认修改
            </button>
          </el-form>
        </div>
      </div>
    </div>
    <FooterCommon />
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
// 头部
import HeaderCommon from '../../Common/HeaderCommon'
import IconFontCommon from '../../Common/IconFontCommon'
import CountDownButton from '../../Common/CountDownCommon'
import {
  returnAjaxMessage // 接口返回信息
} from '../../../utils/commonFunc'
import {
  statusCardSettings,
  accountPaymentTerm,
  modificationAccountPaymentTerm
} from '../../../utils/api/personal'
// 底部
import FooterCommon from '../../Common/FooterCommon'
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations } = createNamespacedHelpers('personal')
export default {
  components: {
    HeaderCommon, // 头部
    IconFontCommon, // 字体图标
    CountDownButton, // 短信倒计时
    FooterCommon // 底部
  },
  data () {
    return {
      realName: '', // 真实姓名
      bankName: '', // 银行名称
      bankCard: '', // 银行卡号
      branchAddress: '', // 支行地址
      password: '', // 交易密码
      id: '', // ID
      paymentTerm: {},
      successCountDown: 1, // 成功倒计时
      paymentMethodList: {}
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/AccountReceivableAccount/AddBankCard.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/AccountReceivableAccount/AddBankCardDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/AccountReceivableAccount/AddBankCardNight.css')
    this.getAccountPaymentTerm()
    this.paymentMethodInformation()
    // console.log(this.getAccountPaymentTerm)
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_USER_CENTER_ACTIVE_NAME',
      'CHANGE_REF_ACCOUNT_CREDITED_STATE'
    ]),
    // 点击返回上个页面
    returnSuperior () {
      this.CHANGE_REF_ACCOUNT_CREDITED_STATE(true)
      this.$router.push({path: '/PersonalCenter'})
      this.CHANGE_USER_CENTER_ACTIVE_NAME('account-credited')
    },
    statusTetBankCard () {
      this.confirmTiePhone()
    },
    // 确定设置
    async confirmTiePhone () {
      let data
      let params = {
        token: this.userInfo.token,
        realname: this.userInfo.userInfo.realname, // 真实姓名
        bankName: this.bankName, // 银行卡名称
        cardNo: this.bankCard, // 银行卡号
        address: this.branchAddress, // 开户地址
        payPassword: this.password, // 交易密码
        bankType: 'bank', // type
        id: this.id
      }
      data = await statusCardSettings(params)
      if (!(returnAjaxMessage(data, this, 1))) {
        return false
      } else {
        console.log(data)
      }
    },
    // 获取支付方式信息
    async paymentMethodInformation () {
      let data
      let params = {
        userId: this.userInfo.userId,
        type: 'bank'
      }
      data = await modificationAccountPaymentTerm(params)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回状态展示
        this.paymentMethodList = data.data.data
        this.bankName = data.data.data.bankName
        this.bankCard = data.data.data.cardNo
        this.branchAddress = data.data.data.address
        this.id = data.data.data.id
        console.log(this.paymentMethodList)
      }
    },
    // 收款方式
    async getAccountPaymentTerm () {
      let data = await accountPaymentTerm()
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回状态展示
        this.paymentTerm = data.data.data
      }
    },
    // 成功自动跳转
    successJump () {
      setInterval(() => {
        if (this.successCountDown === 0) {
          this.CHANGE_REF_ACCOUNT_CREDITED_STATE(true)
          this.$router.push({path: '/PersonalCenter'})
          this.CHANGE_USER_CENTER_ACTIVE_NAME('account-credited')
        }
        this.successCountDown--
      }, 500)
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      // 手机验证码
      disabledOfPhoneBtn: state => state.user.disabledOfPhoneBtn,
      disabledOfEmailBtn: state => state.user.disabledOfEmailBtn,
      refsAccountCenterStatus: state => state.personal.refsAccountCenterStatus
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/AccountReceivableAccount/AddBankCard.scss";
  .add-bank {
    >.add-bank-main {
      width: 1100px;
      margin: 60px auto 100px;
      >.add-bank-header {
        display: flex;
        >.header-content-right,
        .header-content-left {
          flex: 1;
        }
        >.header-content-right {
          text-align: right;
        }
        >.header-content-left {
          text-align: left;
        }
      }
      >.add-bank-content {
        min-height: 300px;
        margin: 16px 25px;
        >.bank-content-title {
          height: 32px;
          line-height: 32px;
          margin-bottom: 30px;
        }
        >.bank-content-from {
          width: 500px;
          margin-left: 55px;
          .bank-input {
            width: 220px;
            height: 34px;
            padding-left: 15px;
          }
          .bank-button {
            padding: 9px 33px;
            margin: 30px 0 50px 25px;
          }
        }
      }
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      .add-bank-main {
        background-color: #1E2636;
        >.add-bank-header {
          border-bottom: 1px solid #39424D;
          >.header-content-left {
            color: #fff;
          }
          >.header-content-right {
            color: #A9BED4;
          }
        }
        >.add-bank-content {
          .bank-content-name {
            color: rgba(255,255,255,0.7);
          }
          >.bank-content-title {
            background:rgba(62,121,214,0.08);
            color: #3E79D6;
          }
          >.bank-content-from {
            .bank-input {
              border: 1px solid #485776;
              color: rgba(255,255,255,0.7);
            }
            .bank-button {
              padding: 10px 33px;
              background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
              color: rgba(255,255,255,0.7);
            }
          }
        }
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      .add-bank-main {
        background:rgba(255,255,255,1);
        border:1px solid rgba(246,246,246,1);
        border-radius:4px;
        box-shadow:0px 0px 4px rgba(235,240,248,1);
        > .add-bank-header {
          border-bottom: 1px solid #ccc;
          .header-content-right {
            color: #7D90AC;
          }
        }
        >.add-bank-content {
          >.bank-content-title {
            background:rgba(62,121,214,1);
            color: #ccc;
          }
          >.bank-content-from {
            .bank-input {
              color: #333;
              background:rgba(255,255,255,1);
              border:1px solid rgba(236,241,248,1);
            }
            .bank-button {
              padding: 10px 33px;
              background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
              color: #ccc;
            }
          }
        }
      }
    }
  }
</style>
