<template>
  <div
    class="add-bank personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-background="rgba(0, 0, 0, 0.6)"
    :style="{
      height:windowHeight+'px'
    }"
  >
    <div
      class="add-bank-main margin25"
    >
      <header class="add-bank-header personal-height60 line-height60 line-height70 margin25">
        <span
          v-if="paymentTerm.isBankBind"
          class="header-content-left header-content font-size16 font-weight600"
        >
          <!--设置银行卡-->
          {{ $t('M.user_bind_Bank_set') }}
        </span>
        <span
          v-else
          class="header-content-left header-content font-size16 font-weight600"
        >
          <!--修改银行卡-->
          {{ $t('M.comm_modification') }}{{ $t('M.user_account_bank') }}
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
      <div class="add-bank-content">
        <!--<header class="bank-content-title">-->
          <!--*请确认您的银行卡已开启短信通知功能-->
        <!--</header>-->
        <div class="bank-content-from">
          <el-form
            :label-position="labelPosition"
            label-width="120px"
          >
            <!--名 称-->
            <el-form-item
              :label="$t('M.user_account_name')"
            >
              <span class="bank-content-name">
                <!-- {{ userInfo.userInfo.realname }} -->
                {{ innerUserInfo.realname }}
              </span>
            </el-form-item>
            <!--银行名称-->
            <el-form-item
              :label="$t('M.user_account_bank_name')"
            >
              <input
                class="bank-input border-radius2"
                v-model="bankName"
                @keydown="setErrorMsg(0, '')"
                @blur="checkoutInputFormat(0, bankName)"
              />
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[0]"
                :isShow="!!errorShowStatusList[0]"
              />
            </el-form-item>
            <!--银行卡号-->
            <el-form-item
              :label="$t('M.user_account_credit_numbers')"
            >
              <input
                class="bank-input border-radius2"
                type="number"
                v-model="bankCard"
                @keydown="setErrorMsg(1, '')"
                @blur="checkoutInputFormat(1, bankCard)"
              />
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[1]"
                :isShow="!!errorShowStatusList[1]"
              />
            </el-form-item>
            <!--支行地址-->
            <el-form-item
              :label="$t('M.user_account_branch_address')"
            >
              <input
                class="bank-input border-radius2"
                v-model="branchAddress"
                @keydown="setErrorMsg(2, '')"
                @blur="checkoutInputFormat(2, branchAddress)"
              />
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[2]"
                :isShow="!!errorShowStatusList[2]"
              />
            </el-form-item>
            <el-form-item
              :label="$t('M.comm_password')"
            >
              <input
                type="password"
                class="bank-input border-radius2"
                v-model="password"
                @keydown="setErrorMsg(3, '')"
                @blur="checkoutInputFormat(3, branchAddress)"
              />
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[3]"
                :isShow="!!errorShowStatusList[3]"
              />
            </el-form-item>
            <button
              v-if="paymentTerm.isBankBind"
              class="bank-button border-radius4"
              @click.prevent="statusTetBankCard"
            >
              <!--确认设置-->
              {{ $t('M.user_bind_paypal_confirm_set') }}
            </button>
            <button
              v-else
              class="bank-button border-radius4"
              @click.prevent="statusTetBankCard"
            >
              <!--确认修改-->
              {{ $t('M.user_modification_confirm_amend') }}
            </button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import IconFontCommon from '../../Common/IconFontCommon'
import ErrorBox from '../../User/ErrorBox'
import CountDownButton from '../../Common/CountDownCommon'
import {
  returnAjaxMsg, // 接口返回信息
  validateNumForUserInput,
  getAccountPaymentTerm
} from '../../../utils/commonFunc'
import {
  statusCardSettings,
  modificationAccountPaymentTerm
} from '../../../utils/api/personal'
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations } = createNamespacedHelpers('personal')
export default {
  components: {
    IconFontCommon, // 字体图标
    ErrorBox,
    CountDownButton // 短信倒计时
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
      paymentMethodList: {},
      errorShowStatusList: [
        '', // 银行名称
        '', // 银行名称
        '', // 支行地址
        '' // 交易密码
      ],
      loadingCircle: {} // 整页loading
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/AccountReceivableAccount/AddBankCard.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/AccountReceivableAccount/AddBankCardDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/AccountReceivableAccount/AddBankCardNight.css')
    getAccountPaymentTerm(this)
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
    // 确定设置按钮
    async confirmTiePhone () {
      let goOnStatus = 0
      if (
        this.checkoutInputFormat(0, this.bankName) &&
        this.checkoutInputFormat(1, this.bankCard) &&
        this.checkoutInputFormat(2, this.branchAddress) &&
        this.checkoutInputFormat(3, this.password)
      ) {
        goOnStatus = 1
      } else {
        goOnStatus = 0
      }
      if (goOnStatus) {
        let data
        let params = {
          token: this.userInfo.token,
          // realname: this.userInfo.userInfo.realname, // 真实姓名
          realname: this.innerUserInfo.realname, // 真实姓名
          bankName: this.bankName, // 银行卡名称
          cardNo: this.bankCard, // 银行卡号
          address: this.branchAddress, // 开户地址
          payPassword: this.password, // 交易密码
          bankType: 'Bankcard', // type
          id: this.id
        }
        // 整页loading
        this.fullscreenLoading = true
        data = await statusCardSettings(params)
        if (!(returnAjaxMsg(data, this, 1))) {
          // 接口失败清除loading
          this.fullscreenLoading = false
          return false
        } else {
          // 接口成功清除loading
          this.fullscreenLoading = false
          this.successJump()
          this.stateEmptyData()
          console.log(data)
        }
      }
    },
    // 接口请求完成之后清空数据
    stateEmptyData () {
      this.bankName = '' // 银行卡名称
      this.cardNo = '' // 银行卡号
      this.address = '' // 开户地址
    },
    // 检测输入格式
    checkoutInputFormat (type, targetNum) {
      switch (type) {
        // 请输入银行名称
        case 0:
          console.log(type)
          if (!targetNum) {
            this.setErrorMsg(0, this.$t('M.user_bind_Bank_input_name'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(0, '')
            this.$forceUpdate()
            return 1
          }
        //  请输入银行卡号
        case 1:
          switch (validateNumForUserInput('bank-card', targetNum)) {
            case 0:
              this.setErrorMsg(1, '')
              this.$forceUpdate()
              return 1
            case 1:
              this.setErrorMsg(1, this.$t('M.user_bind_Bank_input_card_num'))
              this.$forceUpdate()
              return 0
            case 2:
              this.setErrorMsg(1, this.$t('M.user_account_credit_text'))
              this.$forceUpdate()
              return 0
          }
          break
        // 请输入支行地址
        case 2:
          if (!targetNum) {
            this.setErrorMsg(2, this.$t('M.user_bind_Bank_input_address'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(2, '')
            this.$forceUpdate()
            return 1
          }
        // 请输入交易密码
        case 3:
          if (!targetNum) {
            this.setErrorMsg(3, this.$t('M.user_bind_xilain_trade_pwd'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(3, '')
            this.$forceUpdate()
            return 1
          }
      }
    },
    // 设置错误信息
    setErrorMsg (index, msg) {
      this.errorShowStatusList[index] = msg
    },
    // 获取支付方式信息
    async paymentMethodInformation () {
      let data
      let params = {
        userId: this.userInfo.userId,
        type: 'Bankcard'
      }
      // 整页loading
      this.fullscreenLoading = true
      data = await modificationAccountPaymentTerm(params)
      if (!(returnAjaxMsg(data, this, 0))) {
        // 接口失败清除loading
        this.fullscreenLoading = false
        return false
      } else {
        // 接口成功清除loading
        this.fullscreenLoading = false
        let detailData = data.data.data
        // 返回状态展示
        this.paymentMethodList = detailData
        // 修改时带回银行卡名称
        this.bankName = detailData.bankName
        // 修改时带回银行卡号
        this.bankCard = detailData.cardNo
        // 修改时带回银行卡地址
        this.branchAddress = detailData.address
        this.id = detailData.id
        console.log(this.paymentMethodList)
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
      innerUserInfo: state => state.user.loginStep1Info.userInfo, // 内层用户详细信息
      // 手机验证码
      disabledOfPhoneBtn: state => state.user.disabledOfPhoneBtn,
      disabledOfEmailBtn: state => state.user.disabledOfEmailBtn,
      refsAccountCenterStatus: state => state.personal.refsAccountCenterStatus
    }),
    windowHeight () {
      return window.innerHeight
    }
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal.scss";
  .add-bank {
    margin-top:66px;
    overflow: hidden;
    >.add-bank-main {
      width: 1100px;
      height: 700px;
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
            padding: 10px 0;
            margin: 30px 0 50px 140px;
            width: 237px;
          }
        }
      }
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      .add-bank-main {
        background-color: $nightMainBgColor;
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
              &:focus {
                border: 1px solid #338FF5;
              }
            }
            .bank-button {
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
          border-bottom: 1px solid rgba(57,66,77,0.1);
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
              &:focus {
                border: 1px solid #338FF5;
              }
            }
            .bank-button {
              background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
              color: #ccc;
            }
          }
        }
      }
    }
  }
</style>
