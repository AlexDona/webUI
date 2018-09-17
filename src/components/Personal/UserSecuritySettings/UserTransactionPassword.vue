<template>
  <div
    class="transaction-password personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <HeaderCommon />
    <div class="transaction-password-main margin25">
      <header class="transaction-password-header personal-height60 line-height60 line-height70 margin25">
        <span
          v-if="!securityCenter.payPassword"
          class="header-content-left header-content font-size16 font-weight600"
        >
          设置交易密码
        </span>
        <span
          v-else
          class="header-content-left header-content font-size16 font-weight600"
        >
          修改交易密码
        </span>
        <span
          class="header-content-right font-size12 cursor-pointer"
          @click="returnSuperior"
        >
          <IconFontCommon
            class="font-size22"
            iconName="icon-fanhui2"
          />
          返回安全中心
        </span>
      </header>
      <div class="transaction-password-content">
        <header class="transaction-content-title">
          *请确认您的银行卡已开启短信通知功能
        </header>
        <div class="transaction-content-from">
          <!--设置交易密码-->
          <el-form
            v-if="!securityCenter.payPassword"
            :label-position="labelPosition"
            label-width="120px"
          >
            <el-form-item label="昵称：">
              <input
                type="text"
                class="transaction-input border-radius2 padding-l15 box-sizing"
                v-model="setPassword.nickname"
                @keydown="setErrorMsg(0,'')"
                @blur="checkoutInputFormat(0, setPassword.nickname)"
              />
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[0]"
                :isShow="!!errorShowStatusList[0]"
              />
            </el-form-item>
            <el-form-item label="交易密码：">
              <input
                type="password"
                class="transaction-input border-radius2 padding-l15 box-sizing"
                v-model="setPassword.newPassword"
                @keydown="setErrorMsg(1,'')"
                @blur="checkoutInputFormat(1, setPassword.newPassword)"
              />
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[1]"
                :isShow="!!errorShowStatusList[1]"
              />
            </el-form-item>
            <el-form-item label="重复交易密码：">
              <input
                type="password"
                class="transaction-input border-radius2 padding-l15 box-sizing"
                v-model="setPassword.confirmPassword"
                @keydown="setErrorMsg(2,'')"
                @blur="checkoutInputFormat(2, setPassword.confirmPassword)"
              />
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[2]"
                :isShow="!!errorShowStatusList[2]"
              />
            </el-form-item>
            <button
              class="transaction-button border-radius4 cursor-pointer"
              @click="setStatusSubmit"
            >
              确认设置
            </button>
          </el-form>
          <!--重置交易密码-->
          <el-form
            v-else
            :label-position="labelPosition"
            label-width="120px"
          >
            <el-form-item label="交易密码：">
              <input
                type="password"
                class="transaction-input border-radius2 padding-l15 box-sizing"
                v-model="modifyPassword.transactionPassword"
                @keydown="tieErrorMsg(0,'')"
                @blur="tieCheckoutInputFormat(0, modifyPassword.transactionPassword)"
              />
              <!--错误提示-->
              <ErrorBox
                :text="tieErrorShowStatusList[0]"
                :isShow="!!tieErrorShowStatusList[0]"
              />
            </el-form-item>
            <el-form-item label="重复交易密码：">
              <input
                type="password"
                class="transaction-input border-radius2 padding-l15 box-sizing"
                v-model="modifyPassword.resetTransactionPassword"
                @keydown="tieErrorMsg(1,'')"
                @blur="tieCheckoutInputFormat(1, modifyPassword.resetTransactionPassword)"
              />
              <!--错误提示-->
              <ErrorBox
                :text="tieErrorShowStatusList[1]"
                :isShow="!!tieErrorShowStatusList[1]"
              />
            </el-form-item>
            <el-form-item
              label="验  证  码："
              v-if="securityCenter.isPhoneEnable"
            >
              <el-input
                type="text"
                v-model="modifyPassword.phoneCode"
                @keydown="tieErrorMsg(2,'')"
                @blur="tieCheckoutInputFormat(2, modifyPassword.phoneCode)"
              >
                <template slot="append">
                  <CountDownButton
                    class="send-code-btn cursor-pointer"
                    :status="disabledOfPhoneBtn"
                    @run="sendPhoneOrEmailCodeWithPush(0)"
                  />
                </template>
              </el-input>
              <!--错误提示-->
              <ErrorBox
                :text="tieErrorShowStatusList[2]"
                :isShow="!!tieErrorShowStatusList[2]"
              />
            </el-form-item>
            <span v-else></span>
            <el-form-item
              v-if="securityCenter.isMailEnable"
              label="邮箱验证码"
            >
              <el-input
                v-model="modifyPassword.emailCode"
                @keydown="tieErrorMsg(3,'')"
                @blur="tieCheckoutInputFormat(3, modifyPassword.emailCode)"
              >
                <template slot="append">
                  <CountDownButton
                    class="send-code-btn cursor-pointer"
                    :status="disabledOfEmailBtn"
                    @run="sendPhoneOrEmailCodeWithPush(1)"
                  />
                </template>
              </el-input>
              <!--错误提示-->
              <ErrorBox
                :text="tieErrorShowStatusList[3]"
                :isShow="!!tieErrorShowStatusList[3]"
              />
            </el-form-item>
            <span v-else></span>
            <el-form-item
              label="谷歌验证码"
              v-if="securityCenter.isGoogleEnable"
            >
              <input
                type="text"
                class="transaction-input border-radius2 padding-l15 box-sizing"
                v-model="modifyPassword.googleCode"
                @keydown="tieErrorMsg(4,'')"
                @blur="tieCheckoutInputFormat(4, modifyPassword.googleCode)"
              />
              <!--错误提示-->
              <ErrorBox
                :text="tieErrorShowStatusList[4]"
                :isShow="!!tieErrorShowStatusList[4]"
              />
            </el-form-item>
            <span v-else></span>
            <button
              class="transaction-button border-radius4 cursor-pointer"
              @click="getUpdatePayPassword"
            >
              确认重置
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
import ErrorBox from '../../User/ErrorBox'
import {
  returnAjaxMessage, // 接口返回信息
  sendPhoneOrEmailCodeAjax
} from '../../../utils/commonFunc'
import {
  setTransactionPassword,
  resetUpdatePayPassword,
  securityVerificationOnOff,
  statusSecurityCenter,
  userRefreshUser
} from '../../../utils/api/personal'
// 底部
import FooterCommon from '../../Common/FooterCommon'
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations } = createNamespacedHelpers('personal')
export default {
  components: {
    HeaderCommon, // 头部
    IconFontCommon, // 字体图标
    ErrorBox, // 错误提示信息
    CountDownButton, // 短信倒计时
    FooterCommon // 底部
  },
  data () {
    return {
      errorMsg: '', // 错误信息提示
      // 设置交易密码
      setPassword: {
        nickname: '', // 昵称
        newPassword: '', // 设置新交易密码
        confirmPassword: '' // 确认交易密码.
      },
      errorShowStatusList: [
        '', // 交易密码
        '' // 重复交易密码
      ],
      securityCenter: {},
      // 修改交易密码
      modifyPassword: {
        transactionPassword: '', // 修改交易密码
        resetTransactionPassword: '', // 修改 重置交易密码.
        phoneCode: '', // 修改 手机验证码
        emailCode: '', // 修改 邮箱验证码
        googleCode: '' // 修改 谷歌验证码
      },
      tieErrorShowStatusList: [
        '', // 交易密码
        '', // 重置交易密码
        '', // 短信验证码
        '', // 邮箱验证码
        '' // 谷歌验证码
      ],
      successCountDown: 1 // 成功倒计时
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/UserSecuritySettings/UserTransactionPassword.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/UserSecuritySettings/UserTransactionPasswordDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/UserSecuritySettings/UserTransactionPasswordNight.css')
    this.getSecurityCenter()
  },
  mounted () {},
  activited () {
    // console.log(this.refSecurityCenterStatus)
  },
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_USER_CENTER_ACTIVE_NAME',
      'CHANGE_REF_SECURITY_CENTER_INFO'
    ]),
    // 点击返回上个页面
    returnSuperior () {
      this.CHANGE_REF_SECURITY_CENTER_INFO(true)
      this.CHANGE_USER_CENTER_ACTIVE_NAME('security-center')
      this.$router.push({path: '/PersonalCenter'})
    },
    /**
     * 发送短信验证码或邮箱验证码
     */
    sendPhoneOrEmailCodeWithPush (loginType) {
      console.log(this.disabledOfPhoneBtn)
      console.log(this.disabledOfEmailBtn)
      if (this.disabledOfPhoneBtn || this.disabledOfEmailBtn) {
        return false
      }
      let params = {
        country: this.activeCountryCode
      }
      switch (loginType) {
        case 0:
          params.phone = this.userInfo.userInfo.phone
          break
        case 1:
          params.address = this.userInfo.userInfo.email
          break
      }
      sendPhoneOrEmailCodeAjax(loginType, params, (data) => {
        console.log(this.disabledOfPhoneBtn)
        // 提示信息
        if (!returnAjaxMessage(data, this)) {
          console.log('error')
          return false
        } else {
          switch (loginType) {
            case 0:
              this.$store.commit('user/SET_USER_BUTTON_STATUS', {
                loginType: 0,
                status: true
              })
              break
            case 1:
              this.$store.commit('user/SET_USER_BUTTON_STATUS', {
                loginType: 1,
                status: true
              })
              break
          }
        }
      })
    },
    // 确定设置检测输入格式
    checkoutInputFormat (type, targetNum) {
      switch (type) {
        // 交易密码
        case 0:
          if (!targetNum) {
            this.setErrorMsg(0, '请输入交易密码')
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(0, '')
            this.$forceUpdate()
            return 1
          }
        // 重复交易密码
        case 1:
          if (!targetNum) {
            this.setErrorMsg(1, '请输入确认交易密码')
            this.$forceUpdate()
            return 0
          } else if (targetNum === this.setPassword.newPassword) {
            this.setErrorMsg(1, '')
            this.$forceUpdate()
            return 1
          } else {
            this.setErrorMsg(1, '密码不一致，请重新确认')
            this.$forceUpdate()
            return 0
          }
      }
    },
    // 确定设置设置错误信息
    setErrorMsg (index, msg) {
      this.errorShowStatusList[index] = msg
    },
    // 确定设置交易密码
    setStatusSubmit () {
      this.checkoutInputFormat()
      this.confirmTransactionPassword()
    },
    // 确定设置接口处理
    async confirmTransactionPassword () {
      let goOnStatus = 0
      if (
        this.checkoutInputFormat(0, this.setPassword.nickname) &&
        this.checkoutInputFormat(1, this.setPassword.newPassword)
      ) {
        goOnStatus = 1
      } else {
        goOnStatus = 0
      }
      if (goOnStatus) {
        let data
        let param = {
          nickName: this.setPassword.nickname, // 昵称
          payPassword: this.setPassword.newPassword // 交易密码
        }
        data = await setTransactionPassword(param)
        if (!(returnAjaxMessage(data, this, 1))) {
          return false
        } else {
          this.successJump()
          console.log(data)
        }
      }
    },
    // 确定重置检测输入格式
    tieCheckoutInputFormat (type, targetNum) {
      switch (type) {
        // 交易密码
        case 0:
          if (!targetNum) {
            this.tieErrorMsg(0, '请输入交易密码')
            this.$forceUpdate()
            return 0
          } else {
            this.tieErrorMsg(0, '')
            this.$forceUpdate()
            return 1
          }
        // 重置交易密码
        case 1:
          if (!targetNum) {
            this.tieErrorMsg(1, '请输入确认交易密码')
            this.$forceUpdate()
            return 0
          } else if (targetNum === this.modifyPassword.transactionPassword) {
            this.tieErrorMsg(1, '')
            this.$forceUpdate()
            return 1
          } else {
            this.tieErrorMsg(1, '密码不一致，请重新确认')
            this.$forceUpdate()
            return 0
          }
        // 短信验证码
        case 2:
          if (!targetNum) {
            this.tieErrorMsg(2, '请输入短信验证码')
            this.$forceUpdate()
            return 0
          } else {
            this.tieErrorMsg(2, '')
            this.$forceUpdate()
            return 1
          }
        // 邮箱验证码
        case 3:
          if (!targetNum) {
            this.tieErrorMsg(3, '请输入邮箱验证码')
            this.$forceUpdate()
            return 0
          } else {
            this.tieErrorMsg(3, '')
            this.$forceUpdate()
            return 1
          }
        // 谷歌验证码
        case 4:
          if (!targetNum) {
            this.tieErrorMsg(4, '请输入谷歌验证码')
            this.$forceUpdate()
            return 0
          } else {
            this.tieErrorMsg(4, '')
            this.$forceUpdate()
            return 1
          }
      }
    },
    // 确定重置设置错误信息
    tieErrorMsg (index, msg) {
      this.tieErrorShowStatusList[index] = msg
    },
    // 确定重置交易密码
    getUpdatePayPassword () {
      this.tieCheckoutInputFormat()
      this.confirmUpdate()
    },
    // 确定重置接口处理
    async confirmUpdate () {
      let goOnStatus = 0
      if (
        this.tieCheckoutInputFormat(0, this.modifyPassword.transactionPassword) &&
        this.tieCheckoutInputFormat(1, this.modifyPassword.resetTransactionPassword)
      ) {
        goOnStatus = 1
      } else {
        goOnStatus = 0
      }
      if (goOnStatus) {
        let data
        let param = {
          payPassword: this.modifyPassword.resetTransactionPassword, // 重置交易密码
          phoneCode: this.modifyPassword.phoneCode,
          emailCode: this.modifyPassword.emailCode,
          googleCode: this.modifyPassword.googleCode
        }
        data = await resetUpdatePayPassword(param)
        if (!(returnAjaxMessage(data, this, 1))) {
          return false
        } else {
          this.successJump()
          this.confirmVerifyInformation()
        }
      }
    },
    // 手机邮箱谷歌验证
    async confirmVerifyInformation () {
      let data
      let params = {
        email: this.userInfo.userInfo.email, // 邮箱
        phone: this.userInfo.userInfo.phone, // 手机
        emailCode: this.emailCode, // 邮箱验证
        phoneCode: this.phoneCode, // 手机验证
        googleCode: this.googleCode // 谷歌验证
      }
      data = await securityVerificationOnOff(params)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // this.getSecurityCenter()
      }
    },
    async getSecurityCenter () {
      let data = await statusSecurityCenter({
        token: this.userInfo.userInfo.token // token
      })
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回展示
        this.securityCenter = data.data.data
      }
    },
    // 谷歌绑定成功自动跳转
    successJump () {
      setInterval(() => {
        if (this.successCountDown === 0) {
          this.CHANGE_REF_SECURITY_CENTER_INFO(true)
          this.$router.push({path: '/PersonalCenter'})
          this.CHANGE_USER_CENTER_ACTIVE_NAME('security-center')
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
      disabledOfPhoneBtn: state => state.user.disabledOfPhoneBtn,
      disabledOfEmailBtn: state => state.user.disabledOfEmailBtn,
      refSecurityCenterStatus: state => state.personal.refSecurityCenterStatus
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/UserSecuritySettings/UserTransactionPassword";
  .transaction-password {
    >.transaction-password-main {
      width: 1100px;
      margin: 60px auto 100px;
      >.transaction-password-header {
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
      >.transaction-password-content {
        min-height: 300px;
        margin: 16px 25px;
        >.transaction-content-title {
          height: 32px;
          line-height: 32px;
          margin-bottom: 30px;
        }
        >.transaction-content-from {
          width: 500px;
          margin-left: 55px;
          .transaction-input {
            width: 220px;
            height: 34px;
          }
          .transaction-upload {
            width: 118px;
            height: 106px;
            text-align: center;
            line-height: 100px;
          }
          .transaction-button {
            padding: 10px 33px;
            margin: 30px 0 50px 40px;
          }
          .prompt-message {
            height: 20px;
            padding-left: 35px;
          }
        }
      }
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      .transaction-password-main {
        background-color: #1E2636;
        >.transaction-password-header {
          border-bottom: 1px solid #39424D;
          >.header-content-left {
            color: #fff;
          }
          >.header-content-right {
            color: #A9BED4;
          }
        }
        >.transaction-password-content {
          >.transaction-content-title {
            background:rgba(62,121,214,0.08);
            color: #3E79D6;
          }
          >.transaction-content-from {
            .transaction-input {
              border: 1px solid #485776;
              color: #fff;
              &:focus {
                border: 1px solid #338FF5;
              }
            }
            .transaction-content-name {
              color: rgba(255,255,255,0.7);
            }
            .transaction-upload {
              background-color: #323E48;
              .icon-plus {
                color: #828EA6;
              }
            }
            .transaction-button {
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
      .transaction-password-main {
        background:rgba(255,255,255,1);
        border:1px solid rgba(246,246,246,1);
        border-radius:4px;
        box-shadow:0px 0px 4px rgba(235,240,248,1);
        >.login-password-header {
          border-bottom: 1px solid rgba(57,66,77,0.1);
          >.header-content-left {
            color: #333;
          }
          >.header-content-right {
            color: #7D90AC;
          }
        }
        >.transaction-password-content {
          >.transaction-content-title {
            background:rgba(51,143,245,0.1);
            color: #333;
          }
          >.transaction-content-from {
            .transaction-input {
              border:1px solid rgba(236,241,248,1);
              color: #333;
              &:focus {
                border: 1px solid #338FF5;
              }
            }
            .transaction-upload {
              background-color: #fff;
              .icon-plus {
                color: #555;
              }
            }
            .transaction-button {
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
