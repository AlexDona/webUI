<template>
  <div
    class="add-payment personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <HeaderCommon/>
    <div class="add-payment-main margin25">
      <header class="add-payment-header personal-height60 line-height60 line-height70 margin25">
         <span
           v-if="paymentTerm.isPaypalBind"
           class="header-content-left header-content font-size16 font-weight600"
         >
          <!--设置paypal-->
           {{ $t('M.comm_set') }}paypal
        </span>
        <span
          v-else
          class="header-content-left header-content font-size16 font-weight600"
        >
          <!--修改paypal-->
          {{ $t('M.comm_modification') }}paypal
        </span>
        <span
          class="header-content-right font-size12 cursor-pointer"
          @click.prevent="returnSuperior"
        >
          <IconFontCommon
            class="font-size22"
            iconName="icon-fanhui2"
          />
          <!--返回我的账户-->
          {{ $t('M.user_account_return') }}
        </span>
      </header>
      <div class="add-payment-content">
        <!--<header class="payment-content-title">-->
          <!--*paypal上传二维码方法：打开paypal首页>收钱>保存图片，将存在手机相册的收款码上传即可。-->
        <!--</header>-->
        <div class="payment-content-from">
          <el-form
            :label-position="labelPosition"
            label-width="120px"
          >
            <!--名 称 paypal账号 请输入内容 交易密码-->
            <el-form-item
              :label="$t('M.user_account_name')"
            >
              <span class="payment-content-name">
                {{ userInfo.userInfo.realname }}
              </span>
            </el-form-item>
            <el-form-item
              :label="$t('M.user_account_paypal') + $t('M.user_account_number')"
            >
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 2}"
                v-model="paypalAccount"
                @keydown="setErrorMsg(0, '')"
                @blur="checkoutInputFormat(0, paypalAccount)"
              >
                <!--错误提示-->
                <ErrorBox
                  :text="errorShowStatusList[0]"
                  :isShow="!!errorShowStatusList[0]"
                />
              </el-input>
            </el-form-item>
            <el-form-item
              :label="$t('M.comm_password')"
            >
              <input
                type="password"
                class="payment-input border-radius2"
                v-model="transactionPassword"
                @keydown="setErrorMsg(1, '')"
                @blur="checkoutInputFormat(1, transactionPassword)"
              />
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[1]"
                :isShow="!!errorShowStatusList[1]"
              />
            </el-form-item>
            <button
              v-if="paymentTerm.isPaypalBind"
              class="payment-button border-radius4 cursor-pointer"
              @click.prevent="stateSubmitPaypal"
            >
              <!--确认设置-->
              {{ $t('M.comm_affirm') }}{{ $t('M.comm_set') }}
            </button>
            <button
              v-else
              class="payment-button border-radius4 cursor-pointer"
              @click.prevent="stateSubmitPaypal"
            >
              <!--确认修改-->
              {{ $t('M.comm_affirm') }}{{ $t('M.comm_modification') }}
            </button>
          </el-form>
        </div>
      </div>
    </div>
    <keep-aline><FooterCommon/></keep-aline>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
// 头部
import HeaderCommon from '../../Common/HeaderCommonForPC'
import IconFontCommon from '../../Common/IconFontCommon'
import ErrorBox from '../../User/ErrorBox'
import {returnAjaxMessage} from '../../../utils/commonFunc'
import {
  statusCardSettings,
  modificationAccountPaymentTerm,
  accountPaymentTerm
} from '../../../utils/api/personal'
// 底部
import FooterCommon from '../../Common/FooterCommon'
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations } = createNamespacedHelpers('personal')
export default {
  components: {
    HeaderCommon, // 头部
    ErrorBox, // 错误提示接口
    IconFontCommon, // 字体图标
    FooterCommon // 底部
  },
  data () {
    return {
      paypalAccount: '', // paypal账号
      transactionPassword: '', // 交易密码
      bankType: 'paypal', // 类型
      id: '', // ID
      paymentTerm: {},
      successCountDown: 1, // 成功倒计时
      paymentMethodList: {},
      errorShowStatusList: [
        '', // paypal账号
        '' // 交易密码
      ]
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/AccountReceivableAccount/AddSetPaypal.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/AccountReceivableAccount/AddSetPaypalDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/AccountReceivableAccount/AddSetPaypalNight.css')
    this.getAccountPaymentTerm()
    this.paymentMethodInformation()
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
      this.CHANGE_USER_CENTER_ACTIVE_NAME('account-credited')
      this.$router.push({path: '/PersonalCenter'})
    },
    // 检测输入格式
    checkoutInputFormat (type, targetNum) {
      console.log(type)
      switch (type) {
        // 请输入paypal账号
        case 0:
          console.log(type)
          if (!targetNum) {
            this.setErrorMsg(0, this.$t('M.comm_please_enter') + this.$t('M.user_account_paypal') + this.$t('M.user_account_number'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(0, '')
            this.$forceUpdate()
            return 1
          }
        // 请输入交易密码
        case 1:
          console.log(type)
          if (!targetNum) {
            this.setErrorMsg(1, this.$t('M.comm_please_enter') + this.$t('M.comm_password'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(1, '')
            this.$forceUpdate()
            return 1
          }
      }
    },
    // 设置错误信息
    setErrorMsg (index, msg) {
      this.errorShowStatusList[index] = msg
    },
    // 确认设置paypal账号
    stateSubmitPaypal () {
      this.stateSeniorCertification()
    },
    async stateSeniorCertification () {
      if (!this.paypalAccount) {
        // 请输入paypal账号
        this.$message({
          message: this.$t('M.comm_please_enter') + this.$t('M.user_account_paypal') + this.$t('M.user_account_number'),
          type: 'error'
        })
        return false
      }
      let goOnStatus = 0
      if (
        this.checkoutInputFormat(0, this.paypalAccount) &&
        this.checkoutInputFormat(1, this.transactionPassword)
      ) {
        goOnStatus = 1
      } else {
        goOnStatus = 0
      }
      if (goOnStatus) {
        let data
        let param = {
          cardNo: this.paypalAccount, // paypal账号
          payPassword: this.transactionPassword, // 交易密码
          bankType: 'paypal', // type
          id: this.id
        }
        data = await statusCardSettings(param)
        console.log(data)
        if (!(returnAjaxMessage(data, this, 1))) {
          return false
        } else {
          this.successJump()
          this.stateEmptyData()
        }
      }
    },
    // 接口请求完成之后清空数据
    stateEmptyData () {
      this.paypalAccount = ''
      this.transactionPassword = ''
    },
    // 获取支付方式信息
    async paymentMethodInformation () {
      let data
      let params = {
        userId: this.userInfo.userId,
        type: 'paypal'
      }
      data = await modificationAccountPaymentTerm(params)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回状态展示
        this.paymentMethodList = data.data.data
        this.paypalAccount = data.data.data.cardNo
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
        console.log(this.paymentTerm)
      }
    },
    // 成功自动跳转
    successJump () {
      setInterval(() => {
        if (this.successCountDown === 0) {
          this.CHANGE_REF_ACCOUNT_CREDITED_STATE(true)
          this.CHANGE_USER_CENTER_ACTIVE_NAME('account-credited')
          this.$router.push({path: '/PersonalCenter'})
        }
        this.successCountDown--
      }, 1000)
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      refAccountCenterStatus: state => state.personal.refAccountCenterStatus
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal";
  .add-payment {
    >.add-payment-main {
      width: 1100px;
      height: 700px;
      margin: 60px auto 100px;
      >.add-payment-header {
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
      >.add-payment-content {
        min-height: 300px;
        margin: 16px 25px;
        >.payment-content-title {
          height: 32px;
          line-height: 32px;
          margin-bottom: 30px;
        }
        >.payment-content-from {
          width: 500px;
          margin-left: 55px;
          .payment-input {
            width: 220px;
            height: 34px;
            padding-left: 15px;
          }
          .payment-upload {
            width: 118px;
            height: 106px;
            text-align: center;
            line-height: 100px;
          }
          .payment-button {
            padding: 10px 93px;
            margin: 30px 0 50px 120px;
          }
        }
      }
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      .add-payment-main {
        background-color: $nightMainBgColor;
        >.add-payment-header {
          border-bottom: 1px solid #39424D;
          >.header-content-left {
            color: #fff;
          }
          >.header-content-right {
            color: #A9BED4;
          }
        }
        >.add-payment-content {
          >.payment-content-title {
            background:rgba(62,121,214,0.08);
            color: #3E79D6;
          }
          >.payment-content-from {
            .payment-input {
              border: 1px solid #485776;
              color: rgba(255,255,255,0.7);
              &:focus {
                border: 1px solid #338FF5;
              }
            }
            .payment-content-name {
              color: rgba(255,255,255,0.7);
            }
            .payment-upload {
              background-color: #323E48;
              .icon-plus {
                color: #828EA6;
              }
            }
            .payment-button {
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
      .add-payment-main {
        background:rgba(255,255,255,1);
        border:1px solid rgba(246,246,246,1);
        border-radius:4px;
        box-shadow:0px 0px 4px rgba(235,240,248,1);
        > .add-payment-header {
          border-bottom: 1px solid rgba(57,66,77,0.1);
          .header-content-right {
            color: #7D90AC;
          }
        }
        >.add-payment-content {
          >.payment-content-title {
            background:rgba(62,121,214,1);
            color: #ccc;
          }
          >.payment-content-from {
            .payment-content-name {
              color: #333;
            }
            .payment-input {
              background:rgba(255,255,255,1);
              border:1px solid rgba(236,241,248,1);
              color: #333;
              &:focus {
                border: 1px solid #338FF5;
              }
            }
            .payment-upload {
              background-color: #fff;
              .icon-plus {
                color: #555;
              }
            }
            .payment-button {
              background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
              color: #ccc;
            }
          }
        }
      }
    }
  }
</style>
