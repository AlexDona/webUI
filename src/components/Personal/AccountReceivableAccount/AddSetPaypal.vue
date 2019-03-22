<template>
  <div
    class="add-payment personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-background="rgba(0, 0, 0, 0.6)"
    :style="{
      height: windowHeight+'px'
    }"
  >
    <div
      class="add-payment-main margin25"
    >
      <header class="add-payment-header personal-height60 line-height60 line-height70 margin25">
         <span
           v-if="paymentTerm.isPaypalBind"
           class="header-content-left header-content font-size16 font-weight600"
         >
          <!--设置paypal-->
            {{ $t('M.user_bind_paypal_set') }}
        </span>
        <span
          v-else
          class="header-content-left header-content font-size16 font-weight600"
        >
          <!--修改paypal-->
          {{ $t('M.comm_modification') }}PAYPAL
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
                v-model="PayPalAccount"
                @keydown="setErrorMsg(0, '')"
                @blur="checkoutInputFormat(0, PayPalAccount)"
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
                v-if="paymentTerm.isPaypalBind"
                class="payment-button border-radius4 cursor-pointer"
                @click.prevent="stateSubmitPaypal"
              >
                <!--确认设置-->
                {{ $t('M.user_bind_paypal_confirm_set') }}
              </button>
              <button
                v-else
                class="payment-button border-radius4 cursor-pointer"
                @click.prevent="stateSubmitPaypal"
              >
                <!--确认修改-->
                {{ $t('M.user_modification_confirm_amend') }}
              </button>
              <p
                class="font-size12 cursor-pointer text-align-r hint-color"
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
      PayPalAccount: '', // paypal账号
      transactionPassword: '', // 交易密码
      // bankType: 'paypal', // 类型
      id: '', // ID
      paymentTerm: {},
      successCountDown: 1, // 成功倒计时
      paymentMethodList: {},
      // loadingCircle: {}, // 整页loading
      fullscreenLoading: false, // 整页loading
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
    // 点击跳转到重置交易密码
    payPasswordState () {
      this.$goToPage('/TransactionPassword')
    },
    // 点击返回上个页面
    returnSuperior () {
      this.CHANGE_REF_ACCOUNT_CREDITED_STATE(true)
      this.CHANGE_USER_CENTER_ACTIVE_NAME('account-credited')
      this.$goToPage('/PersonalCenter')
    },
    // 检测输入格式
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
    // 设置错误信息
    setErrorMsg (index, msg) {
      this.errorShowStatusList[index] = msg
    },
    // 确认设置paypal账号
    async stateSubmitPaypal () {
      await this.stateSeniorCertification()
    },
    async stateSeniorCertification () {
      // 判断是否交易密码锁定
      await this.REFRESH_USER_INFO_ACTION()
      let isPaypasswordLocked = getNestedData(this.loginStep1Info, 'payPasswordRemainCount') ? false : true
      this.CHANGE_PASSWORD_USEABLE(isPaypasswordLocked)
      if (this.isLockedPayPassword) return false
      if (!this.PayPalAccount) {
        // 请输入paypal账号
        this.$message({
          message: this.$t('M.user_bind_paypal_please_input'),
          type: 'error'
        })
        return false
      }
      let goOnStatus = 0
      if (
        this.checkoutInputFormat(0, this.PayPalAccount) &&
        this.checkoutInputFormat(1, this.transactionPassword)
      ) {
        goOnStatus = 1
      } else {
        goOnStatus = 0
      }
      if (goOnStatus) {
        let data
        let param = {
          cardNo: this.PayPalAccount, // paypal账号
          payPassword: this.transactionPassword, // 交易密码
          bankType: 'PAYPAL', // type
          id: this.id
        }
        // 整页loading
        this.fullscreenLoading = true
        data = await statusCardSettings(param)
        console.log(data)
        // 接口失败清除loading
        this.fullscreenLoading = false
        if (!data) return false
        this.successJump()
        this.stateEmptyData()
      }
    },
    // 接口请求完成之后清空数据
    stateEmptyData () {
      this.PayPalAccount = ''
      this.transactionPassword = ''
    },
    // 获取支付方式信息
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
      this.paymentMethodList = detailData
      const {id, cardNo} = detailData
      // 修改时带回paypal账号
      this.PayPalAccount = cardNo
      this.id = id
    },
    // 成功自动跳转
    successJump () {
      this.addPAYPALSuccessJumpTimer = setInterval(() => {
        if (this.successCountDown === 0) {
          this.CHANGE_REF_ACCOUNT_CREDITED_STATE(true)
          this.CHANGE_USER_CENTER_ACTIVE_NAME('account-credited')
          this.$goToPage('/PersonalCenter')
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
  @import "../../../../static/css/scss/Personal/IndexPersonal";

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
          width: 800px;

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
      background-color: $nightBgColor;

      .add-payment-main {
        background-color: $nightMainBgColor;

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
              background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
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
          color: rgba(255, 255, 255, .7);
        }
      }
    }

    &.day {
      color: $dayFontColor;
      background-color: $dayBgColor;

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
              color: #ccc;
              background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
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
