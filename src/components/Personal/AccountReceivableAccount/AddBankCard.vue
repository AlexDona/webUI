<template>
  <div
    class="add-bank personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
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
              class="bank-button border-radius4 cursor-pointer"
              @click.prevent="statusTetBankCard"
            >
              <!--确认设置-->
              {{ $t('M.user_bind_paypal_confirm_set') }}
            </button>
            <button
              v-else
              class="bank-button border-radius4 cursor-pointer"
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
  getAccountPaymentTerm,
  getNestedData
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
    getAccountPaymentTerm(this)
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
          realname: this.innerUserInfo.realname, // 真实姓名
          bankName: this.bankName, // 银行卡名称
          cardNo: this.bankCard, // 银行卡号
          address: this.branchAddress, // 开户地址
          payPassword: this.password, // 交易密码
          bankType: 'Bankcard', // type
          id: this.id
        }
        data = await statusCardSettings(params)
        if (!(returnAjaxMsg(data, this, 1))) {
          return false
        } else {
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
        case 1:
          switch (validateNumForUserInput('bank-card', targetNum)) {
            case 0:
              this.setErrorMsg(1, '')
              this.$forceUpdate()
              return 1
            case 1:
              // 请输入银行卡号
              this.setErrorMsg(1, this.$t('M.user_bind_Bank_input_card_num'))
              this.$forceUpdate()
              return 0
            case 2:
              // 请输入最后鞥缺的银行卡号
              this.setErrorMsg(1, this.$t('M.comm_please_enter') + this.$t('M.user_security_correct') + this.$t('M.user_account_credit_numbers'))
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
      data = await modificationAccountPaymentTerm(params)
      if (!(returnAjaxMsg(data, this, 0))) {
        return false
      } else {
        // let detailData = data.data.data
        let detailData = getNestedData(data, 'data.data')
        // 返回状态展示
        this.paymentMethodList = detailData
        // 修改时带回银行卡名称
        this.bankName = getNestedData(detailData, 'bankName')
        // 修改时带回银行卡号
        this.bankCard = getNestedData(detailData, 'cardNo')
        // 修改时带回银行卡地址
        this.branchAddress = getNestedData(detailData, 'address')
        this.id = getNestedData(detailData, 'id')
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
<style scoped lang="scss" type="text/scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal.scss";

  .add-bank {
    margin-top: 66px;
    overflow: hidden;

    > .add-bank-main {
      width: 1100px;
      height: 700px;
      margin: 60px auto 100px;

      > .add-bank-header {
        display: flex;

        > .header-content-right,
        .header-content-left {
          flex: 1;
        }

        > .header-content-right {
          text-align: right;
        }

        > .header-content-left {
          text-align: left;
        }
      }

      > .add-bank-content {
        min-height: 300px;
        margin: 16px 25px;

        > .bank-content-title {
          height: 32px;
          margin-bottom: 30px;
          line-height: 32px;
        }

        > .bank-content-from {
          width: 500px;
          margin-left: 55px;

          .bank-input {
            width: 220px;
            height: 34px;
            padding-left: 15px;
          }

          .bank-button {
            width: 237px;
            padding: 10px 0;
            margin: 30px 0 50px 140px;
          }
        }
      }
    }

    /deep/ {
      /* 覆盖element样式 */
      .el-input-group {
        width: 62.5%;
      }

      .el-input__inner {
        height: 36px;
        border-radius: 2px;
      }

      .el-input-group__append {
        padding: 0 16px;
        border-radius: 0 4px 4px 0;
        font-size: 12px;
      }

      .el-form-item__content {
        width: 600px;
      }
    }

    &.night {
      color: $nightFontColor;
      background-color: $nightBgColor;

      .add-bank-main {
        background-color: $nightMainBgColor;

        > .add-bank-header {
          border-bottom: 1px solid #39424d;

          > .header-content-left {
            color: #fff;
          }

          > .header-content-right {
            color: #a9bed4;
          }
        }

        > .add-bank-content {
          .bank-content-name {
            color: rgba(255, 255, 255, .7);
          }

          > .bank-content-title {
            color: #3e79d6;
            background: rgba(62, 121, 214, .08);
          }

          > .bank-content-from {
            .bank-input {
              border: 1px solid #485776;
              color: rgba(255, 255, 255, .7);

              &:focus {
                border: 1px solid #338ff5;
              }
            }

            .bank-button {
              color: rgba(255, 255, 255, .7);
              background: linear-gradient(0deg, rgb(43, 57, 110), rgb(42, 80, 130));
            }
          }
        }
      }

      /deep/ {
        /* 个人中心黑色主题 */
        .el-form-item__label {
          min-width: 140px;
          color: rgba(255, 255, 255, .7);
        }

        .el-input__inner {
          border: 1px solid #485776;
          color: rgba(255, 255, 255, .7);
        }

        .el-input-group__append {
          border-color: #364654;
          color: rgba(255, 255, 255, .7);
          background-color: #338ff5;
        }
      }
    }

    &.day {
      color: $dayFontColor;
      background-color: $dayBgColor;

      .add-bank-main {
        border: 1px solid rgb(246, 246, 246);
        border-radius: 4px;
        background: #fff;
        box-shadow: 0 0 4px rgb(235, 240, 248);

        > .add-bank-header {
          border-bottom: 1px solid rgba(57, 66, 77, .1);

          .header-content-right {
            color: #7d90ac;
          }
        }

        > .add-bank-content {
          > .bank-content-title {
            color: #ccc;
            background: rgb(62, 121, 214);
          }

          > .bank-content-from {
            .bank-input {
              border: 1px solid rgb(236, 241, 248);
              color: #333;
              background: #fff;

              &:focus {
                border: 1px solid #338ff5;
              }
            }

            .bank-button {
              color: #ccc;
              background: linear-gradient(0deg, rgb(43, 57, 110), rgb(42, 80, 130));
            }
          }
        }
      }

      /deep/ {
        /* 个人中心白色主题 */
        .el-form-item__label {
          min-width: 140px;
          color: #7d90ac;
        }

        .el-input__inner {
          border: 1px solid #555;
          color: #000;
          background-color: transparent;
        }

        .el-input-group__append {
          border-color: #364654;
          color: #555;
          background-color: #b1b1b1;
        }
      }
    }
  }
</style>
