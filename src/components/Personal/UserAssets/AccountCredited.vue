<template>
  <div
    class="credited-credited personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-background="rgba(0, 0, 0, 0.6)"
  >
    <header class="credited-credited-header personal-height40 line-height40 background-color">
      <span class="padding-left23 header-content font-size16">
        <!--收款账户-->
        {{ $t('M.user_account_credited') }}
      </span>
    </header>
    <div class="credited-credited-main min-height500 margin-top9">
      <div class="credited-box">
        <p class="content-title font-size12">
          <!--温馨提示：-->
          <!--请务必使用您本人的实名账户，被激活的支付方式将在OTC交易时向买方展示，可设置5种但最多激活3种-->
          <span class="title-tips">
            {{ $t('M.user_account_warm_prompt') }}
          </span>
          <span class="tips-content">
            {{ $t('M.user_account_text') }}
          </span>
        </p>
        <div class="title-status font-size12">
          <!--收款方式-->
          <span class="float-left">
            {{ $t('M.user_account_payment_term') }}
          </span>
          <!--操作-->
          <span class="float-right">
            {{ $t('M.comm_operation') }}
          </span>
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
              <!--银行转账-->
              <span class="payment-card">
                {{ $t('M.user_account_bank_transfer') }}
              </span>
            </p>
            <div
              class="payment-right"
            >
              <!--关闭-->
              <img
                v-if="paymentTerm.isBnakEnable === 'disable'"
                @click.prevent="statusOpenToClose('bank', 'enable')"
                class="switch-img cursor-pointer"
                :src="closePictureSrc"
              >
              <!--开启-->
              <img
                v-else
                @click.prevent="statusOpenToClose('bank', 'disable')"
                class="switch-img cursor-pointer"
                :src="openPictureSrc"
              >
              <!--设置-->
                <span
                  v-if="paymentTerm.isBankBind"
                  class="payment-state cursor-pointer"
                  @click.prevent="setShowStatusSecurity('bank')"
                >
                  {{ $t('M.comm_set') }}
                </span>
              <!--修改-->
                <span
                  v-else
                  class="payment-state cursor-pointer"
                  @click.prevent="setShowStatusSecurity('bank')"
                >
                  {{ $t('M.comm_modification') }}
                </span>
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
              <span class="payment-card">
                {{ $t('M.user_account_weChat') }}
              </span>
            </p>
            <p
              class="payment-right"
            >
              <!--关闭-->
              <img
                v-if="paymentTerm.isWeixinEnable === 'disable'"
                @click.prevent="statusOpenToClose('chat', 'enable')"
                class="switch-img cursor-pointer"
                :src="closePictureSrc"
              >
              <!--开启-->
              <img
                v-else
                @click.prevent="statusOpenToClose('chat', 'disable')"
                class="switch-img cursor-pointer"
                :src="openPictureSrc"
              >
              <!--设置-->
                <span
                  v-if="paymentTerm.isWeixinBind"
                  class="payment-state cursor-pointer"
                  @click.prevent="setShowStatusSecurity('weChat')"
                >
                  {{ $t('M.comm_set') }}
                </span>
              <!--修改-->
                <span
                  v-else
                  class="payment-state cursor-pointer"
                  @click.prevent="setShowStatusSecurity('weChat')"
                >
                   {{ $t('M.comm_modification') }}
                </span>
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
              <span class="payment-card">
                {{ $t('M.user_account_alipay') }}
              </span>
            </p>
            <p
              class="payment-right"
            >
              <!--关闭-->
              <img
                v-if="paymentTerm.isAlipayEnable === 'disable'"
                @click.prevent="statusOpenToClose('alipay', 'enable')"
                class="switch-img cursor-pointer"
                :src="closePictureSrc"
              >
              <!--开启-->
              <img
                v-else
                @click.prevent="statusOpenToClose('alipay', 'disable')"
                class="switch-img cursor-pointer"
                :src="openPictureSrc"
              >
              <!--设置-->
                <span
                  v-if="paymentTerm.isAlipayBind"
                  class="payment-state cursor-pointer"
                  @click.prevent="setShowStatusSecurity('alipay')"
                >
                  {{ $t('M.comm_set') }}
                </span>
              <!--修改-->
                <span
                  v-else
                  class="payment-state cursor-pointer"
                  @click.prevent="setShowStatusSecurity('alipay')"
                >
                  {{ $t('M.comm_modification') }}
                </span>
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
              <span class="payment-card">
                {{ $t('M.user_account_paypal') }}
              </span>
            </p>
            <p
              class="payment-right"
            >
              <!--关闭-->
              <img
                v-if="paymentTerm.isPaypalEnable === 'disable'"
                @click.prevent="statusOpenToClose('paypal', 'enable')"
                class="switch-img cursor-pointer"
                :src="closePictureSrc"
              >
              <!--开启-->
              <img
                v-else
                @click.prevent="statusOpenToClose('paypal', 'disable')"
                class="switch-img cursor-pointer"
                :src="openPictureSrc"
              >
              <!--设置-->
                <span
                  v-if="paymentTerm.isPaypalBind"
                  class="payment-state cursor-pointer"
                  @click.prevent="setShowStatusSecurity('paypal')"
                >
                  {{ $t('M.comm_set') }}
                </span>
              <!--修改-->
                <span
                  v-else
                  class="payment-state cursor-pointer"
                  @click.prevent="setShowStatusSecurity('paypal')"
                >
                  {{ $t('M.comm_modification') }}
                </span>
            </p>
          </div>
          <!--西联汇款-->
          <div class="payment-box">
            <p class="payment-left">
              <span>
                <img src="../../../assets/user/xilian.png" alt="">
              </span>
              <span class="payment-card">
                {{ $t('M.user_account_western_union') }}
              </span>
            </p>
            <p
              class="payment-right"
            >
              <!--关闭-->
              <img
                v-if="paymentTerm.isXilianEnable === 'disable'"
                @click.prevent="statusOpenToClose('western', 'enable')"
                class="switch-img cursor-pointer"
                :src="closePictureSrc"
              >
              <!--开启-->
              <img
                v-else
                @click.prevent="statusOpenToClose('western', 'disable')"
                class="switch-img cursor-pointer"
                :src="openPictureSrc"
              >
              <!--设置-->
                <span
                  v-if="paymentTerm.isXilianBind"
                  class="payment-state cursor-pointer"
                  @click.prevent="setShowStatusSecurity('westernUnion')"
                >
                  {{ $t('M.comm_set') }}
                </span>
              <!--修改-->
                <span
                  v-else
                  class="payment-state cursor-pointer"
                  @click.prevent="setShowStatusSecurity('westernUnion')"
                >
                  {{ $t('M.comm_modification') }}
                </span>
            </p>
          </div>
          <!--开启二次确认弹框-->
          <el-dialog
            title=""
            :visible.sync="openCollectionMode"
            center
          >
            <!--<span>是否确定关闭当前收款方式</span>-->
            <span
              class="text-info font-size16"
              v-show="closeBankCard"
            >
              <!--开启银行卡收款方式-->
              {{ $t('M.comm_open') }}{{ $t('M.user_account_bank') }}{{ $t('M.user_account_payment_term') }}
            </span>
            <span
              class="text-info font-size16"
              v-show="closeMicroLetter"
            >
              <!--开启微信收款方式-->
              {{ $t('M.comm_open') }}{{ $t('M.user_account_weChat') }}{{ $t('M.user_account_payment_term') }}
            </span>
            <span
              class="text-info font-size16"
              v-show="closeALIPAY"
            >
              <!--开启支付宝收款方式-->
              {{ $t('M.comm_open') }}{{ $t('M.user_account_alipay') }}{{ $t('M.user_account_payment_term') }}
            </span>
            <span
              class="text-info font-size16"
              v-show="closePayPal"
            >
              <!--开启PayPal收款方式-->
              {{ $t('M.comm_open') }}{{ $t('M.user_account_paypal') }}{{ $t('M.user_account_payment_term') }}
            </span>
            <span
              class="text-info font-size16"
              v-show="closeWesternUnion"
            >
              <!--开启西联汇款收款方式-->
              {{ $t('M.comm_open') }}{{ $t('M.user_account_western_union') }}{{ $t('M.user_account_payment_term') }}
            </span>
            <span
              slot="footer"
              class="dialog-footer"
            >
              <!--确 定 取 消-->
              <el-button
                type="primary"
                @click.prevent="determineTheOpen"
              >
                {{ $t('M.comm_confirm') }}
              </el-button>
              <el-button
                class="btn"
                @click.prevent="openCollectionMode = false"
              >
                {{ $t('M.comm_cancel') }}
              </el-button>
            </span>
          </el-dialog>
          <!--关闭二次确认弹框-->
          <el-dialog
            title=""
            :visible.sync="closeCollectionMode"
            center
          >
            <!--<span>是否确定关闭当前收款方式</span>-->
            <span
              v-show="closeBankCard"
              class="text-info font-size16"
            >
              <!--是否确定关闭银行卡收款方式-->
              {{ $t('M.user_account_whether_close1') }}
            </span>
            <span
              v-show="closeMicroLetter"
              class="text-info font-size16"
            >
              <!--是否确定关闭微信收款方式-->
              {{ $t('M.user_account_whether_close2') }}
            </span>
            <span
              v-show="closeALIPAY"
              class="text-info font-size16"
            >
              <!--是否确定关闭支付宝收款方式-->
              {{ $t('M.user_account_whether_close3') }}
            </span>
            <span
              v-show="closePayPal"
              class="text-info font-size16"
            >
              <!--是否确定关闭PayPal收款方式-->
              {{ $t('M.user_account_whether_close4') }}
            </span>
            <span
              v-show="closeWesternUnion"
              class="text-info font-size16"
            >
              <!--是否确定关闭西联汇款收款方式-->
              {{ $t('M.user_account_whether_close5') }}
            </span>
            <span
              slot="footer"
              class="dialog-footer"
            >
               <!--确 定 取 消-->
              <el-button
                type="primary"
                @click.prevent="determineTheOpen"
              >
                {{ $t('M.comm_confirm') }}
              </el-button>
               <el-button
                 class="btn"
                 @click.prevent="closeCollectionMode = false"
               >
                {{ $t('M.comm_cancel') }}
              </el-button>
            </span>
          </el-dialog>
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
            <p class="font-size12 warning-text margin-top35 text-align-c">
              <!--请先完成身份认证并且设置交易密码，再来设置OTC收款账户!-->
              {{ $t('M.user_account_text1') }}
            </p>
            <span
              slot="footer"
              class="dialog-footer"
            >
              <el-button
                type="primary"
                @click.prevent="authenticationJump"
              >
                <!--去认证-->
                {{ $t('M.user_senior_go_certification') }}
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
import {
  returnAjaxMsg,
  getNestedData
} from '../../../utils/commonFunc'
import {
  accountPaymentTerm,
  openAndCloseModeSetting
} from '../../../utils/api/personal'
import {
  mapMutations,
  mapState,
  mapActions
} from 'vuex'
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
      paymentTerm: {
        // isAlipayBind: '',
        // isAlipayEnable: 'disable',
        // isBankBind: '',
        // isBnakEnable: 'disable',
        // isPaypalBind: '',
        // isPaypalEnable: 'disable',
        // isWeixinBind: '',
        // isWeixinEnable: 'disable',
        // isXilianBind: '',
        // isXilianEnable: 'disable'
      }, // 收款方式
      closeBankCard: false, // 默认关闭银行卡
      closeMicroLetter: false, // 默认关闭微信
      closeALIPAY: false, // 默认关闭支付宝
      closePayPal: false, // 默认关闭PayPal
      closeWesternUnion: false, // 默认关闭西联汇款
      activeType: '', // 当前值类型
      state: '', // 开启关闭状态
      fullscreenLoading: true // 整页loading
    }
  },
  async created () {
    // 调用收款方式 银行卡 微信 支付宝 paypal 西联汇款 状态
    await this.getAccountPaymentTerm()
    if (this.refsAccountCenterStatus) {
      this.getAccountPaymentTerm()
      this.CHANGE_REF_ACCOUNT_CREDITED_STATE(false)
    }
  },
  mounted () {},
  activated () {
  },
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapActions([
      'REFRESH_USER_INFO_ACTION'
    ]),
    ...mapMutations([
      'CHANGE_USER_CENTER_ACTIVE_NAME',
      'CHANGE_REF_ACCOUNT_CREDITED_STATE',
      'SET_STEP1_INFO'
    ]),
    // 点击去认证跳转到身份认证
    authenticationJump () {
      this.centerModelWarning = false
      if (!this.realUserInfo.payPassword) {
        this.$router.push({path: '/TransactionPassword'})
      }
      if (!this.realUserInfo.realname) {
        this.CHANGE_USER_CENTER_ACTIVE_NAME('identity-authentication')
        this.$router.push({path: '/PersonalCenter'})
      }
    },
    // 路由跳转对应组件
    setShowStatusSecurity (val) {
      console.log(this.userInfo)
      // 判断是否实名认证
      if (!this.realUserInfo.realname || !this.realUserInfo.payPassword) {
        this.centerModelWarning = true
        return false
      }
      switch (val) {
        case 'bank':
          this.$router.push({path: '/AddBankCard'})
          break
        case 'weChat':
          this.$router.push({path: '/AddWeChat'})
          break
        case 'alipay':
          this.$router.push({path: '/AddSetAlipay'})
          break
        case 'paypal':
          this.$router.push({path: '/AddSetPaypal'})
          break
        case 'westernUnion':
          this.$router.push({path: '/AddWesternUnion'})
          break
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
              this.closeALIPAY = false
              this.closePayPal = false
              this.closeWesternUnion = false
            } else {
              this.closeCollectionMode = true
              this.closeBankCard = true
              this.closeMicroLetter = false
              this.closeALIPAY = false
              this.closePayPal = false
              this.closeWesternUnion = false
            }
          } else {
            // 请先设置银行卡
            this.$message({
              message: this.$t('M.user_pay_account_set1'),
              type: 'error'
            })
            // this.openCollectionMode = false
          }
          break
        case 'chat':
          if (!this.paymentTerm.isWeixinBind) {
            if (safeState === 'enable') {
              this.openCollectionMode = true
              this.closeBankCard = false
              this.closeMicroLetter = true
              this.closeALIPAY = false
              this.closePayPal = false
              this.closeWesternUnion = false
            } else {
              this.closeCollectionMode = true
              this.closeBankCard = false
              this.closeMicroLetter = true
              this.closeALIPAY = false
              this.closePayPal = false
              this.closeWesternUnion = false
            }
          } else {
            // 请先设置微信
            this.$message({
              message: this.$t('M.user_pay_account_set2'),
              type: 'error'
            })
            // this.openCollectionMode = false
          }
          break
        case 'alipay':
          if (!this.paymentTerm.isAlipayBind) {
            if (safeState === 'enable') {
              this.openCollectionMode = true
              this.closeBankCard = false
              this.closeMicroLetter = false
              this.closeALIPAY = true
              this.closePayPal = false
              this.closeWesternUnion = false
            } else {
              this.closeCollectionMode = true
              this.closeBankCard = false
              this.closeMicroLetter = false
              this.closeALIPAY = true
              this.closePayPal = false
              this.closeWesternUnion = false
            }
          } else {
            // 请先设置支付宝
            this.$message({
              message: this.$t('M.user_pay_account_set3'),
              type: 'error'
            })
            // this.openCollectionMode = false
          }
          break
        case 'paypal':
          if (!this.paymentTerm.isPaypalBind) {
            if (safeState === 'enable') {
              this.openCollectionMode = true
              this.closeBankCard = false
              this.closeMicroLetter = false
              this.closeALIPAY = false
              this.closePayPal = true
              this.closeWesternUnion = false
            } else {
              this.closeCollectionMode = true
              this.closeBankCard = false
              this.closeMicroLetter = false
              this.closeALIPAY = false
              this.closePayPal = true
              this.closeWesternUnion = false
            }
          } else {
            // 请先设置PAYPAL
            this.$message({
              message: this.$t('M.user_pay_account_set4'),
              type: 'error'
            })
            // this.openCollectionMode = false
          }
          break
        case 'western':
          if (!this.paymentTerm.isXilianBind) {
            if (safeState === 'enable') {
              this.openCollectionMode = true
              this.closeBankCard = false
              this.closeMicroLetter = false
              this.closeALIPAY = false
              this.closePayPal = false
              this.closeWesternUnion = true
            } else {
              this.closeCollectionMode = true
              this.closeBankCard = false
              this.closeMicroLetter = false
              this.closeALIPAY = false
              this.closePayPal = false
              this.closeWesternUnion = true
            }
          } else {
            // 请先设置西联汇款
            this.$message({
              message: this.$t('M.user_pay_account_set5'),
              type: 'error'
            })
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
          params.type = 'Bankcard'
          if (state === 'enable') {
            params.status = 'enable'
          } else {
            params.status = 'disable'
          }
          break
        case 'chat':
          params.type = 'Wechat'
          if (state === 'enable') {
            params.status = 'enable'
          } else {
            params.status = 'disable'
          }
          break
        case 'alipay':
          params.type = 'Alipay'
          if (state === 'enable') {
            params.status = 'enable'
          } else {
            params.status = 'disable'
          }
          break
        case 'paypal':
          params.type = 'PAYPAL'
          if (state === 'enable') {
            params.status = 'enable'
          } else {
            params.status = 'disable'
          }
          break
        case 'western':
          params.type = 'WestUnion'
          if (state === 'enable') {
            params.status = 'enable'
          } else {
            params.status = 'disable'
          }
          break
      }
      // 整页loading
      this.loadingCircle = this.$loading({
        lock: true,
        background: 'rgba(0, 0, 0, 0.7)'
      })
      data = await openAndCloseModeSetting(params)
      if (!(returnAjaxMsg(data, this, 0))) {
        // 接口失败清除loading
        this.loadingCircle.close()
        return false
      } else {
        // 接口成功清除loading
        this.loadingCircle.close()
        // 安全中心状态刷新
        this.getAccountPaymentTerm()
        this.openCollectionMode = false // 开启收款方式
        this.closeCollectionMode = false // 关闭收款方式
      }
    },
    // 收款方式
    async getAccountPaymentTerm () {
      // 整页loading
      this.fullscreenLoading = true
      let data = await accountPaymentTerm()
      this.fullscreenLoading = false
      if (!(returnAjaxMsg(data, this, 0))) {
        return false
      } else {
        // 返回状态展示
        this.paymentTerm = getNestedData(data, 'data.data')
        console.log(data)
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      realUserInfo: state => state.user.loginStep1Info.userInfo,
      refsAccountCenterStatus: state => state.personal.refsAccountCenterStatus,
      userCenterActiveName: state => state.personal.userCenterActiveName
    })
  },
  watch: {
    async userCenterActiveName (newVal) {
      if (newVal === 'account-credited') {
        await this.REFRESH_USER_INFO_ACTION()
        await this.getAccountPaymentTerm()
      }
    },
    paymentTerm (newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal";

  .credited-credited {
    > .credited-credited-main {
      > .credited-box {
        padding: 30px 23px;

        > .title-status {
          width: 100%;
          height: 35px;
          padding: 9px 73px 8px 17px;
          margin-top: 24px;
          border-radius: 2px;
        }

        > .payment-content {
          min-height: 200px;

          .text-info {
            display: inline-block;
            margin: 30px 0 0;
          }

          .btn {
            width: 90px;
            height: 35px;
            line-height: 0;
          }

          > .payment-box {
            display: flex;
            height: 22px;
            padding: 0 73px 0 17px;
            margin-top: 26px;

            > .payment-left,
            .payment-right {
              flex: 1;
              width: 100px;
            }

            > .payment-left {
              text-align: left;
            }

            > .payment-right {
              position: relative;
              text-align: right;

              > .switch-img {
                position: absolute;
                top: 0;
                right: 48px;
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
          padding-top: 6px;
          margin: 0 auto;
          border-radius: 50%;

          .dialog-warning-box {
            width: 78px;
            height: 78px;
            margin: 0 auto;
            border-radius: 50%;
            line-height: 75px;
            text-align: center;
          }
        }
      }
    }

    /deep/ {
      /* switch开关背景色 */
      .el-switch__core {
        border: 0;
        background-color: transparent;

        &::after {
          z-index: 9;
        }
      }

      .el-dialog__header {
        height: 0;
        padding: 0;
      }

      .el-dialog {
        &:nth-child(1) {
          top: 15%;
          width: 300px;
          border-radius: 10px;

          .el-dialog__header {
            padding-left: 20px;
            text-align: left;

            .el-dialog__title {
              display: inline-block;
              margin: 20px 0;
            }
          }
        }

        &:nth-child(2) {
          top: 15%;
          width: 300px;
          height: 200px;
          border-radius: 10px;
        }

        &:nth-child(3) {
          top: 15%;
          width: 350px;
          height: 300px;
          border-radius: 10px;
        }
      }

      .el-dialog__close {
        color: transparent;
      }

      .el-button--primary {
        padding: 7px 28px 8px 29px;
        border: 0;
      }

      .el-button {
        &:first-child {
          height: 35px;
          line-height: 0;
        }
      }

      .el-dialog__body {
        text-align: center;
        color: #fff;
      }
    }

    &.night {
      color: $nightFontColor;
      background-color: $nightBgColor;

      > .background-color {
        background-color: $nightMainBgColor;
      }

      > .credited-credited-main {
        background-color: $nightMainBgColor;

        .credited-box {
          > .payment-content {
            .text-info {
              color: #fff;
            }

            .btn {
              border: 1px solid #338ff5;
              color: #fff;
              background-color: transparent;
            }

            > .payment-box {
              .payment-right {
                .setting-btn {
                  color: #fff;
                }
              }
            }

            .payment-card {
              color: #fff;
            }

            .payment-state {
              color: #338ff5;
            }

            .dialog-warning {
              background: rgba(42, 122, 211, .2);

              .dialog-warning-box {
                background: linear-gradient(90deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
              }
            }

            .warning-text {
              color: #fff;
            }
          }
        }
      }

      > .credited-credited-header {
        > .header-content {
          color: #338ff5;
        }
      }

      .content-title {
        > .title-tips {
          color: #d45858;
        }

        > .tips-content {
          color: #9da5b3;
        }
      }

      .title-status {
        color: rgba(255, 255, 255, .7);
        background: rgba(248, 249, 252, .05);
      }

      /deep/ {
        /* 个人中心（黑色主题） */

        /* 警告提示框背景色 */
        .el-dialog {
          background-color: #28334a;
        }

        /* 警告提示框按钮 */
        .el-button--primary {
          color: #fff;
          background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
        }

        .el-dialog__title {
          color: #fff;
        }

        .el-button {
          &:first-child {
            color: #fff;
            background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
          }
        }
      }
    }

    &.day {
      color: $dayFontColor;
      background-color: $dayBgColor;

      > .background-color {
        background-color: #ccc;
      }

      > .credited-credited-main {
        border: 1px solid rgba(38, 47, 56, .1);
        background-color: $dayBgColor;
      }

      > .credited-credited-header {
        border: 1px solid rgba(236, 241, 248, 1);
        background: rgba(255, 255, 255, 1);

        > .header-content {
          color: #333;
        }
      }

      .content-title {
        > .title-tips {
          color: #d45858;
        }

        > .tips-content {
          color: #7d90ac;
        }
      }

      .title-status {
        color: #333;
        background: rgba(51, 143, 245, .1);
      }

      .payment-content {
        .text-info {
          color: #333;
        }

        .btn {
          border: 1px solid #338ff5;
          color: #333;
          background-color: transparent;
        }

        .payment-card {
          color: #333;
        }

        .payment-state {
          color: #338ff5;
        }

        .dialog-warning {
          background: rgba(42, 122, 211, .9);

          .dialog-warning-box {
            background: linear-gradient(90deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
          }
        }

        .warning-text {
          color: #333;
        }
      }

      /deep/ {
        .el-dialog {
          background-color: #fff;
        }

        .el-button--primary {
          color: #fff;
          background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
        }
      }
    }
  }
</style>
