<template>
  <div
    class="add-payment personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
    :style="{
      height: windowHeight+'px'
    }"
  >
    <div
      class="add-payment-main margin25"
    >
      <header class="add-payment-header personal-height60 line-height60 line-height70 margin25">
         <span
           class="header-content-left header-content font-size16 font-weight600"
         >
           <!--设置paypal-->
           {{ paymentTerm.isPaypalBind? $t('M.user_bind_paypal_set'): $t('M.comm_modification') + 'PAYPAL' }}
           <!--修改paypal-->
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
        <div class="payment-content-from">
          <el-form
            label-width="190px"
          >
            <!--名 称-->
            <el-form-item
              :label="$t('M.user_account_name')"
            >
              <span class="payment-content-name">
                {{ innerUserInfo.realname }}
              </span>
            </el-form-item>
            <!--paypal账号-->
            <el-form-item
              :label="$t('M.user_account_paypal') + $t('M.user_account_number')"
            >
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 2}"
                v-model="payPalAccount"
                @keydown="setErrorMsg(0, '')"
                @blur="checkoutInputFormat(0, payPalAccount)"
              >
                <!--错误提示-->
                <ErrorBox
                  :text="errorShowStatusList[0]"
                  :isShow="!!errorShowStatusList[0]"
                />
              </el-input>
            </el-form-item>
            <!--交易密码-->
            <el-form-item
              :label="$t('M.comm_password')"
            >
              <input
                type="password"
                autocomplete= "new-password"
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
            <div style="width: 430px;">
              <button
                class="payment-button border-radius4 cursor-pointer"
                @click.prevent="stateSubmitPaypal"
              >
                <!--确认设置-->
                {{ paymentTerm.isPaypalBind? $t('M.user_bind_paypal_set'): $t('M.comm_affirm') + $t('M.comm_modification') }}
                <!--确认修改-->
              </button>
              <p
                class="font-size12 cursor-pointer text-align-r hint-color float-right"
                @click.prevent="payPasswordState"
              >
                {{ $t('M.user_payPassword') }}
              </p>
            </div>
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
import {
  // returnAjaxMsg,
  getNestedData,
  getAccountPaymentTerm
} from '../../../utils/commonFunc'
import {
  statusCardSettings,
  modificationAccountPaymentTerm
} from '../../../utils/api/personal'
import {
  mapMutations,
  mapState,
  mapActions
} from 'vuex'
export default {
  components: {
    ErrorBox, // 错误提示接口
    IconFontCommon // 字体图标
  },
  data () {
    return {
      payPalAccount: '', // paypal账号
      transactionPassword: '', // 交易密码
      typePaymentId: '', // 支付类型ID
      paymentTerm: {},
      successCountDown: 1, // 成功倒计时
      // paymentMethodList: {},
      errorShowStatusList: [
        '', // paypal账号
        '' // 交易密码
      ],
      addPAYPALSuccessJumpTimer: null // 添加PayPal成功后跳转定时器
    }
  },
  created () {
    getAccountPaymentTerm(this)
    this.paymentMethodInformation()
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_USER_CENTER_ACTIVE_NAME',
      'CHANGE_REF_ACCOUNT_CREDITED_STATE',
      'CHANGE_PASSWORD_USEABLE'
    ]),
    ...mapActions([
      'REFRESH_USER_INFO_ACTION'
    ]),

    /**
     * 1.界面跳转
     ***/
    // 1.01 点击跳转到重置交易密码
    payPasswordState () {
      this.$goToPage('/TransactionPassword')
    },
    // 1.02 点击返回上个页面
    returnSuperior () {
      this.CHANGE_REF_ACCOUNT_CREDITED_STATE(true)
      this.CHANGE_USER_CENTER_ACTIVE_NAME('account-credited')
      this.$goToPage('/PersonalCenter')
    },
    // 1.03 成功自动跳转
    successJump () {
      this.addPAYPALSuccessJumpTimer = setInterval(() => {
        if (this.successCountDown === 0) {
          this.CHANGE_REF_ACCOUNT_CREDITED_STATE(true)
          this.CHANGE_USER_CENTER_ACTIVE_NAME('account-credited')
          this.$goToPage('/PersonalCenter')
        }
        this.successCountDown--
      }, 1000)
    },
    /**
     * 2.输入格式校验
     ***/
    // 2.01 检测输入格式
    checkoutInputFormat (type, targetNum) {
      console.log(type)
      switch (type) {
        // 请输入paypal账号
        case 0:
          console.log(type)
          if (!targetNum) {
            this.setErrorMsg(0, this.$t('M.user_bind_paypal_please_input'))
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
            this.setErrorMsg(1, this.$t('M.user_bind_xilain_trade_pwd'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(1, '')
            this.$forceUpdate()
            return 1
          }
      }
    },
    // 2.02设置错误信息
    setErrorMsg (index, msg) {
      this.errorShowStatusList[index] = msg
    },
    /**
     * 3.设置支付方式
     ***/
    // 3.01 确认设置paypal账号
    async stateSubmitPaypal () {
      await this.stateSeniorCertification()
    },
    // 3.02 判断是否交易密码锁定
    stateSeniorCertification: _.debounce(async function () {
      await this.REFRESH_USER_INFO_ACTION()
      let isPaypasswordLocked = getNestedData(this.loginStep1Info, 'payPasswordRemainCount') ? false : true
      this.CHANGE_PASSWORD_USEABLE(isPaypasswordLocked)
      if (this.isLockedPayPassword) return false
      if (!this.payPalAccount) {
        // 请输入paypal账号
        this.$message({
          message: this.$t('M.user_bind_paypal_please_input'),
          type: 'error'
        })
        return false
      }
      let goOnStatus = 0
      if (
        this.checkoutInputFormat(0, this.payPalAccount) &&
        this.checkoutInputFormat(1, this.transactionPassword)
      ) {
        goOnStatus = 1
      } else {
        goOnStatus = 0
      }
      if (goOnStatus) {
        let data
        let param = {
          cardNo: this.payPalAccount, // paypal账号
          payPassword: this.transactionPassword, // 交易密码
          bankType: 'PAYPAL', // type
          id: this.typePaymentId
        }
        data = await statusCardSettings(param)
        console.log(data)
        if (!data) return false
        this.successJump()
        this.stateEmptyData()
      }
    }, 500),
    // 3.03 接口请求完成之后清空数据
    stateEmptyData () {
      this.payPalAccount = ''
      this.transactionPassword = ''
    },
    // 3.04 获取支付方式信息
    async paymentMethodInformation () {
      let data
      let params = {
        userId: this.userInfo.userId,
        type: 'PAYPAL'
      }
      data = await modificationAccountPaymentTerm(params)
      if (!data) return false
      // 返回状态展示
      let detailData = getNestedData(data, 'data')
      // this.paymentMethodList = detailData
      const {id, cardNo} = detailData
      // 修改时带回paypal账号
      this.payPalAccount = cardNo
      this.typePaymentId = id
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      innerUserInfo: state => state.user.loginStep1Info.userInfo, // 内层用户详细信息
      refAccountCenterStatus: state => state.personal.refAccountCenterStatus,
      loginStep1Info: state => state.user.loginStep1Info,
      // 交易密码是否被锁定
      isLockedPayPassword: state => state.common.isLockedPayPassword
    }),
    windowHeight () {
      return window.innerHeight
    }
  },
  watch: {},
  destroyed () {
    // 离开本组件清除定时器
    if (this.addPAYPALSuccessJumpTimer) {
      clearInterval(this.addPAYPALSuccessJumpTimer)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../../assets/CSS/index';

  .add-payment {
    margin-top: 50px;
    overflow: hidden;

    > .add-payment-main {
      width: 1100px;
      height: 700px;
      margin: 60px auto 100px;

      > .add-payment-header {
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

      > .add-payment-content {
        min-height: 300px;
        margin: 16px 25px;

        > .payment-content-title {
          height: 32px;
          margin-bottom: 30px;
          line-height: 32px;
        }

        > .payment-content-from {
          width: 500px;
          margin: 58px auto;

          .payment-input {
            width: 220px;
            height: 34px;
            padding-left: 15px;
          }

          .payment-upload {
            width: 118px;
            height: 106px;
            line-height: 100px;
            text-align: center;
          }

          .payment-button {
            width: 237px;
            padding: 10px 0;
            margin: 5px 0 10px 188px;
            text-align: center;
          }
        }
      }
    }

    /deep/ {
      /* 覆盖element样式 */
      .el-textarea__inner {
        width: 237px;
        height: 90px;
        resize: none;
      }

      .el-form-item__content {
        width: 600px;
      }
    }

    &.night {
      color: $nightFontColor;
      background-color: $mainNightBgColor;

      .add-payment-main {
        background-color: $mainContentNightBgColor;

        > .add-payment-header {
          border-bottom: 1px solid #39424d;

          > .header-content-left {
            color: #fff;
          }

          > .header-content-right {
            color: #a9bed4;
          }
        }

        > .add-payment-content {
          > .payment-content-title {
            color: #3e79d6;
            background: rgba(62, 121, 214, .08);
          }

          > .payment-content-from {
            .payment-input {
              border: 1px solid #485776;
              color: rgba(255, 255, 255, .7);

              &:focus {
                border: 1px solid #338ff5;
              }
            }

            .payment-content-name {
              color: rgba(255, 255, 255, .7);
            }

            .payment-upload {
              background-color: #323e48;

              .icon-plus {
                color: #828ea6;
              }
            }

            .payment-button {
              color: rgba(255, 255, 255, .7);
              background: linear-gradient(90deg, rgba(18, 71, 133, 1) 0%, rgba(42, 59, 97, 1) 100%);
            }
          }
        }
      }

      /deep/ {
        /* 个人中心黑色主题 */
        .el-textarea__inner {
          border: 1px solid #485776;
          color: rgba(255, 255, 255, .7);
          background-color: #1c1f32;
        }

        .el-form-item__label {
          color: #a9bed4;
        }
      }
    }

    &.day {
      color: $dayMainTitleColor;

      .add-payment-main {
        border: 1px solid rgba(246, 246, 246, 1);
        border-radius: 4px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 0 4px rgba(235, 240, 248, 1);

        > .add-payment-header {
          border-bottom: 1px solid rgba(57, 66, 77, .1);

          .header-content-right {
            color: #7d90ac;
          }
        }

        > .add-payment-content {
          > .payment-content-title {
            color: #ccc;
            background: rgba(62, 121, 214, 1);
          }

          > .payment-content-from {
            .payment-content-name {
              color: #333;
            }

            .payment-input {
              border: 1px solid rgba(236, 241, 248, 1);
              color: #333;
              background: rgba(255, 255, 255, 1);

              &:focus {
                border: 1px solid #338ff5;
              }
            }

            .payment-upload {
              background-color: #fff;

              .icon-plus {
                color: #555;
              }
            }

            .payment-button {
              color: #fff;
              background: linear-gradient(90deg, rgba(106, 182, 244, 1) 0%, rgba(49, 135, 218, 1) 100%);
            }
          }
        }
      }

      /deep/ {
        /* 个人中心白色主题 */
        .el-textarea__inner {
          border: 1px solid rgba(236, 241, 248, 1);
          color: #333;
          background: rgba(255, 255, 255, 1);

          &:focus {
            border: 1px solid #338ff5;
          }
        }

        .el-form-item__label {
          color: #7d90ac;
        }
      }
    }
  }
</style>
