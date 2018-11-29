<template>
  <div
    class="add-western personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-background="rgba(0, 0, 0, 0.6)"
    :style="{
      height: windowHeight+'px'
    }"
  >
    <div
      class="add-western-main margin25"
    >
      <header class="add-western-header personal-height60 line-height60 line-height70 margin25">
        <span
          v-if="paymentTerm.isXilianBind"
          class="header-content-left header-content font-size16 font-weight600"
        >
          <!--设置西联汇款-->
          {{ $t('M.user_bind_xilain') }}
        </span>
        <span
          v-else
          class="header-content-left header-content font-size16 font-weight600"
        >
          <!--修改西联汇款-->
          {{ $t('M.comm_modification') }}{{ $t('M.user_account_western_union') }}
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
      <div class="add-western-content">
        <!--<header class="western-content-title">-->
          <!--*西联汇款l上传二维码方法：打开西联汇款首页>收钱>保存图片，将存在手机相册的收款码上传即可。-->
        <!--</header>-->
        <div class="western-content-from">
          <!--名 称-->
          <el-form
            :label-position="labelPosition"
            label-width="160px"
          >
            <el-form-item
              :label="$t('M.user_account_name')"
            >
              <span class="western-content-name">
                {{ innerUserInfo.realname }}
              </span>
            </el-form-item>
            <!--电汇地址-->
            <el-form-item
              :label="$t('M.user_account_wire_transfer') + ' ' + $t('M.comm_site')"
            >
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 2}"
                v-model="telegraphicTransferAddress"
                @keydown="setErrorMsg(0, '')"
                @blur="checkoutInputFormat(0, telegraphicTransferAddress)"
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
                class="western-input border-radius2"
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
              v-if="paymentTerm.isXilianBind"
              class="western-button border-radius4 cursor-pointer"
              @click.prevent="stateSubmitWesternUnion"
            >
              <!--确认设置-->
              {{ $t('M.comm_affirm') }}{{ $t('M.comm_set') }}
            </button>
            <button
              v-else
              class="western-button border-radius4 cursor-pointer"
              @click.prevent="stateSubmitWesternUnion"
            >
              <!--确认修改-->
              {{ $t('M.comm_affirm') }}{{ $t('M.comm_modification') }}
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
import {
  returnAjaxMsg,
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
    ErrorBox, // 错误提示接口
    IconFontCommon // 字体图标
  },
  data () {
    return {
      telegraphicTransferAddress: '', // 电汇地址
      transactionPassword: '', // 交易密码
      // bankType: 'xilian', // type类型
      id: '', // ID
      paymentTerm: {},
      successCountDown: 1, // 成功倒计时
      paymentMethodList: {},
      fullscreenLoading: false, // 整页loading
      errorShowStatusList: [
        '', // 西联汇款账号
        '' // 交易密码
      ]
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/AccountReceivableAccount/AddWesternUnion.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/AccountReceivableAccount/AddWesternUnionDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/AccountReceivableAccount/AddWesternUnionNight.css')
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
      this.CHANGE_USER_CENTER_ACTIVE_NAME('account-credited')
      this.$router.push({path: '/PersonalCenter'})
    },
    // 检测输入格式
    checkoutInputFormat (type, targetNum) {
      console.log(type)
      switch (type) {
        // 请输入西联汇款账号
        case 0:
          console.log(type)
          if (!targetNum) {
            this.setErrorMsg(0, this.$t('M.comm_please_enter') + this.$t('M.user_account_western_union') + this.$t('M.user_account_number'))
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
    // 确认设置西联汇款账号
    stateSubmitWesternUnion () {
      this.stateSeniorCertification()
    },
    async stateSeniorCertification () {
      if (!this.telegraphicTransferAddress) {
        // 请输入西联汇款账号
        this.$message({
          message: this.$t('M.user_bind_xilain_account'),
          type: 'error'
        })
        return false
      }
      let goOnStatus = 0
      if (
        this.checkoutInputFormat(0, this.telegraphicTransferAddress) &&
        this.checkoutInputFormat(1, this.transactionPassword)
      ) {
        goOnStatus = 1
      } else {
        goOnStatus = 0
      }
      if (goOnStatus) {
        let data
        let param = {
          address: this.telegraphicTransferAddress, // 西联汇款账号
          payPassword: this.transactionPassword, // 交易密码
          bankType: 'WestUnion', // type
          id: this.id
        }
        // 整页loading
        this.fullscreenLoading = true
        data = await statusCardSettings(param)
        console.log(data)
        if (!(returnAjaxMsg(data, this, 1))) {
          // 接口失败清除loading
          this.fullscreenLoading = false
          return false
        } else {
          // 接口成功清除loading
          this.fullscreenLoading = false
          this.successJump()
          this.stateEmptyData()
        }
      }
    },
    // 接口请求完成之后清空数据
    stateEmptyData () {
      this.telegraphicTransferAddress = ''
      this.transactionPassword = ''
    },
    async paymentMethodInformation () {
      let data
      let params = {
        userId: this.userInfo.userId,
        type: 'WestUnion'
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
        // 修改时带回西联汇款账号
        this.telegraphicTransferAddress = detailData.address
        this.id = detailData.id
        console.log(this.paymentMethodList)
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
      innerUserInfo: state => state.user.loginStep1Info.userInfo, // 内层用户详细信息
      refAccountCenterStatus: state => state.personal.refAccountCenterStatus
    }),
    windowHeight () {
      return window.innerHeight
    }
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal";
  .add-western {
    margin-top:66px;
    overflow: hidden;
    >.add-western-main {
      width: 1100px;
      height: 700px;
      margin: 60px auto 100px;
      >.add-western-header {
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
          font-weight: 600;
        }
      }
      >.add-western-content {
        min-height: 300px;
        margin: 16px 25px;
        >.western-content-title {
          height: 32px;
          line-height: 32px;
          margin-bottom: 30px;
        }
        >.western-content-from {
          width: 500px;
          margin-left: 55px;
          .western-input {
            width: 220px;
            height: 34px;
            padding-left: 15px;
          }
          .western-upload {
            width: 118px;
            height: 106px;
            text-align: center;
            line-height: 100px;
          }
          .western-button {
            margin: 30px 0 50px 160px;
            width: 230px;
            padding: 10px 0;
          }
        }
      }
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      .add-western-main {
        background-color: $nightMainBgColor;
        >.add-western-header {
          border-bottom: 1px solid #39424D;
          >.header-content-left {
            color: #fff;
          }
          >.header-content-right {
            color: #A9BED4;
          }
        }
        >.add-western-content {
          >.western-content-title {
            background:rgba(62,121,214,0.08);
            color: #3E79D6;
          }
          >.western-content-from {
            .western-input {
              border: 1px solid #485776;
              color: rgba(255,255,255,0.7);
              &:focus {
                border: 1px solid #338FF5;
              }
            }
            .western-content-name {
              color: rgba(255,255,255,0.7);
            }
            .western-upload {
              background-color: #323E48;
              .icon-plus {
                color: #828EA6;
              }
            }
            .western-button {
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
      .add-western-main {
        background:rgba(255,255,255,1);
        border:1px solid rgba(246,246,246,1);
        border-radius:4px;
        box-shadow:0px 0px 4px rgba(235,240,248,1);
        > .add-western-header {
          border-bottom: 1px solid rgba(57,66,77,0.1);
          >.header-content-left {
            color: #7D90AC;
          }
        }
        >.add-western-content {
          >.western-content-title {
            background:rgba(62,121,214,1);
            color: #ccc;
          }
          >.western-content-from {
            .western-input {
              background:rgba(255,255,255,1);
              border:1px solid rgba(236,241,248,1);
              color: #333;
              &:focus {
                border: 1px solid #338FF5;
              }
            }
            .western-upload {
              background-color: #fff;
              .icon-plus {
                color: #555;
              }
            }
            .western-button {
              background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
              color: #ccc;
            }
          }
        }
      }
    }
  }
</style>
