<template>
  <div
    class="transaction-password personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-background="rgba(0, 0, 0, 0.6)"
  >
    <div class="transaction-password-main margin25">
      <header class="transaction-password-header personal-height60 line-height60 line-height70 margin25">
        <span
          v-if="!securityCenter.payPassword"
          class="header-content-left header-content font-size16 font-weight600"
        >
          <!--设置交易密码-->
          {{ $t('M.comm_set') }}{{ $t('M.comm_password') }}
        </span>
        <span
          v-else
          class="header-content-left header-content font-size16 font-weight600"
        >
          <!--修改交易密码-->
          {{ $t('M.comm_modification') }}{{ $t('M.comm_password') }}
        </span>
        <span
          class="header-content-right font-size12 cursor-pointer"
          @click.prevent="returnSuperior"
        >
          <IconFontCommon
            class="font-size22"
            iconName="icon-fanhui2"
          />
          <!--返回安全中心-->
          {{ $t('M.user_security_return_safety_center') }}
        </span>
      </header>
      <div class="transaction-password-content">
        <!--<header class="transaction-content-title">-->
          <!--&lt;!&ndash;*请确认您的银行卡已开启短信通知功能&ndash;&gt;-->
          <!--*{{ $t('M.user_security_text0') }}-->
        <!--</header>-->
        <div class="transaction-content-from">
          <!--设置交易密码-->
          <el-form
            v-if="!securityCenter.payPassword"
            :label-position="labelPosition"
            label-width="120px"
          >
            <!--昵称-->
            <el-form-item
              :label="$t('M.user_transaction_nickname') + '：'"
            >
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
            <!--交易密码-->
            <el-form-item
              :label="$t('M.comm_password') + '：'"
            >
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
            <!--重复交易密码-->
            <el-form-item
              :label="$t('M.user_transaction_repetition') + $t('M.comm_password') + '：'"
            >
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
              @click.prevent="setStatusSubmit"
            >
              <!--确认设置-->
              {{ $t('M.comm_affirm') }}{{ $t('M.comm_set') }}
            </button>
          </el-form>
          <!--重置交易密码-->
          <el-form
            v-else
            :label-position="labelPosition"
            label-width="120px"
          >
            <!--交易密码-->
            <el-form-item
              :label="$t('M.comm_password') + '：'"
            >
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
            <!--重复交易密码-->
            <el-form-item
              :label="$t('M.user_transaction_repetition') + $t('M.comm_password') + '：'"
            >
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
            <!--验  证  码-->
            <el-form-item
              :label="$t('M.comm_code') + '：'"
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
            <!--邮箱验证码-->
            <el-form-item
              v-if="securityCenter.isMailEnable"
              :label="$t('M.user_security_email') +$t('M.comm_code') + '：'"
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
            <!--谷歌验证码-->
            <el-form-item
              :label="$t('M.user_security_google') +$t('M.comm_code') + '：'"
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
              @click.prevent="getUpdatePayPassword"
            >
              <!--确认重置-->
              {{ $t('M.comm_affirm') }}{{ $t('M.user_transaction_reset') }}
            </button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
// 头部
import HeaderCommon from '../../Common/HeaderCommonForPC'
import IconFontCommon from '../../Common/IconFontCommon'
import CountDownButton from '../../Common/CountDownCommon'
import ErrorBox from '../../User/ErrorBox'
import {
  returnAjaxMessage, // 接口返回信息
  apiSendPhoneOrEmailCodeAjax,
  reflashUserInfo,
  validateNumForUserInput,
  getSecurityCenter
} from '../../../utils/commonFunc'
import {
  setTransactionPassword,
  resetUpdatePayPassword,
  securityVerificationOnOff
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
        '', // 昵称
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
      fullscreenLoading: false, // 整页loading
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
    reflashUserInfo(this)
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
      if (
        !this.tieCheckoutInputFormat(0, this.modifyPassword.transactionPassword) ||
        !this.tieCheckoutInputFormat(1, this.modifyPassword.resetTransactionPassword)
      ) {
        return false
      }
      if (this.disabledOfPhoneBtn || this.disabledOfEmailBtn) {
        return false
      }
      let params = {
        country: this.activeCountryCode,
        type: 'VERIFICATION_CODE' // 类型
      }
      switch (loginType) {
        case 0:
          params.phone = this.userInfo.userInfo.phone
          break
        case 1:
          params.address = this.userInfo.userInfo.email
          break
      }
      apiSendPhoneOrEmailCodeAjax(loginType, params, (data) => {
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
        // 昵称
        case 0:
          if (!targetNum) {
            // 请输入昵称
            this.setErrorMsg(0, this.$t('M.comm_please_enter') + this.$t('M.user_transaction_nickname'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(0, '')
            this.$forceUpdate()
            return 1
          }
        // 交易密码
        case 1:
          // 请输入6位纯数字
          switch (validateNumForUserInput('tran-password', targetNum)) {
            case 0:
              this.setErrorMsg(1, '')
              this.$forceUpdate()
              return 1
            case 1:
              this.setErrorMsg(1, this.$t('M.comm_please_enter') + this.$t('M.user_security_password'))
              this.$forceUpdate()
              return 0
            case 2:
              this.setErrorMsg(1, this.$t('M.user_transaction_text'))
              this.$forceUpdate()
              return 0
          }
          break
        // 重复交易密码
        case 2:
          if (!targetNum) {
            // 请输入确认交易密码
            this.setErrorMsg(2, this.$t('M.comm_please_enter') + this.$t('M.comm_affirm') + this.$t('M.comm_password'))
            this.$forceUpdate()
            return 0
          } else if (targetNum === this.setPassword.newPassword) {
            this.setErrorMsg(2, '')
            this.$forceUpdate()
            return 1
          } else {
            // 密码不一致，请重新确认
            this.setErrorMsg(2, this.$t('M.user_security_info2'))
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
    async setStatusSubmit () {
      // this.checkoutInputFormat()
      await this.confirmTransactionPassword()
    },
    // 确定设置接口处理
    async confirmTransactionPassword () {
      let goOnStatus = 0
      if (
        this.checkoutInputFormat(0, this.setPassword.nickname) &&
        this.checkoutInputFormat(1, this.setPassword.newPassword) &&
        this.checkoutInputFormat(2, this.setPassword.confirmPassword) &&
        this.setPassword.confirmPassword === this.setPassword.newPassword
      ) {
        goOnStatus = 1
      } else {
        goOnStatus = 0
      }
      if (goOnStatus) {
        let data
        let params = {
          nickName: this.setPassword.nickname, // 昵称
          payPassword: this.setPassword.newPassword // 交易密码
        }
        // 整页loading
        this.fullscreenLoading = true
        data = await setTransactionPassword(params)
        if (!(returnAjaxMessage(data, this, 1))) {
          // 接口失败清除loading
          this.fullscreenLoading = false
          return false
        } else {
          // 接口成功清除loading
          this.fullscreenLoading = false
          console.log(data)
          this.stateEmptyData()
          this.$store.commit('common/SET_USER_INFO_REFRESH_STATUS', true)
          this.successJump()
        }
      }
    },
    // 接口请求完成之后清空数据
    stateEmptyData () {
      this.setPassword.nickname = ''
      this.setPassword.newPassword = ''
      this.setPassword.confirmPassword = ''
    },
    // 确定重置检测输入格式
    tieCheckoutInputFormat (type, targetNum) {
      switch (type) {
        // 交易密码
        case 0:
          // 请输入6位纯数字
          switch (validateNumForUserInput('tran-password', targetNum)) {
            case 0:
              this.tieErrorMsg(0, '')
              this.$forceUpdate()
              return 1
            case 1:
              this.tieErrorMsg(0, this.$t('M.comm_please_enter') + this.$t('M.user_security_password'))
              this.$forceUpdate()
              return 0
            case 2:
              this.tieErrorMsg(0, this.$t('M.user_transaction_text'))
              this.$forceUpdate()
              return 0
          }
          break
        case 1:
          if (!targetNum) {
            // 请输入确认交易密码
            this.tieErrorMsg(1, this.$t('M.comm_please_enter') + this.$t('M.comm_affirm') + this.$t('M.comm_password'))
            this.$forceUpdate()
            return 0
          } else if (targetNum === this.modifyPassword.transactionPassword) {
            this.tieErrorMsg(1, '')
            this.$forceUpdate()
            return 1
          } else {
            // 密码不一致，请重新确认
            this.tieErrorMsg(1, this.$t('M.user_security_info2'))
            this.$forceUpdate()
            return 0
          }
        // 短信验证码
        case 2:
          if (!targetNum) {
            // 请输入短信验证码
            this.tieErrorMsg(2, this.$t('M.comm_please_enter') + this.$t('M.comm_note') + this.$t('M.comm_code'))
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
            // 请输入邮箱验证码
            this.tieErrorMsg(3, this.$t('M.comm_please_enter') + this.$t('M.user_security_email') + this.$t('M.comm_code'))
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
            // 请输入谷歌验证码
            this.tieErrorMsg(4, this.$t('M.comm_please_enter') + this.$t('M.user_security_google') + this.$t('M.comm_code'))
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
    async getUpdatePayPassword () {
      this.confirmVerifyInformation()
    },
    // 手机邮箱谷歌验证
    async confirmVerifyInformation () {
      let data
      let params = {
        email: this.userInfo.userInfo.email, // 邮箱
        phone: this.userInfo.userInfo.phone, // 手机
        emailCode: this.modifyPassword.emailCode, // 邮箱验证
        phoneCode: this.modifyPassword.phoneCode, // 手机验证
        googleCode: this.modifyPassword.googleCode // 谷歌验证
      }
      // 整页loading
      this.fullscreenLoading = true
      data = await securityVerificationOnOff(params)
      if (!(returnAjaxMessage(data, this, 0))) {
        // 接口失败清除loading
        this.fullscreenLoading = false
        return false
      } else {
        // 接口成功清除loading
        this.fullscreenLoading = false
        await this.confirmUpdate()
      }
    },
    // 确定重置接口处理
    async confirmUpdate () {
      let goOnStatus = 0
      if (
        this.tieCheckoutInputFormat(0, this.modifyPassword.transactionPassword) &&
        this.tieCheckoutInputFormat(1, this.modifyPassword.resetTransactionPassword) &&
        this.modifyPassword.transactionPassword === this.modifyPassword.resetTransactionPassword
      ) {
        goOnStatus = 1
      } else {
        goOnStatus = 0
      }
      console.log(goOnStatus)
      if (goOnStatus) {
        if (this.securityCenter.isMailEnable && !this.modifyPassword.emailCode) {
          this.$message({
            type: 'error',
            message: this.$t('M.comm_please_enter') + this.$t('M.comm_emailbox') + this.$t('M.comm_code') // '请输入邮箱验证码'
          })
          return false
        }
        if (this.securityCenter.isPhoneEnable && !this.modifyPassword.phoneCode) {
          this.$message({
            type: 'error',
            message: this.$t('M.comm_please_enter') + this.$t('M.login_telphone') + this.$t('M.comm_code') // '请输入手机验证码'
          })
          return false
        }
        if (this.securityCenter.isGoogleEnable && !this.modifyPassword.googleCode) {
          this.$message({
            type: 'error',
            message: this.$t('M.comm_please_enter') + this.$t('M.login_google') + this.$t('M.comm_code') // 请输入谷歌验证码
          })
          return false
        }
        let data
        let param = {
          payPassword: this.modifyPassword.resetTransactionPassword, // 重置交易密码
          phoneCode: this.modifyPassword.phoneCode, // 手机验证码
          emailCode: this.modifyPassword.emailCode, // 邮箱验证码
          googleCode: this.modifyPassword.googleCode // 谷歌验证码
        }
        // 整页loading
        this.fullscreenLoading = true
        data = await resetUpdatePayPassword(param)
        if (!(returnAjaxMessage(data, this, 1))) {
          // 接口失败清除loading
          this.fullscreenLoading = false
          return false
        } else {
          // 接口成功清除loading
          this.fullscreenLoading = false
          console.log(1)
          this.successJump()
          this.stateEmptyData()
          this.$store.commit('common/SET_USER_INFO_REFRESH_STATUS', true)
        }
      }
    },
    /**
     * 安全中心
     */
    getSecurityCenter () {
      getSecurityCenter(this, {}, data => {
        if (data) {
          // 接口成功清除loading
          // this.fullscreenLoading = false
          this.securityCenter = data.data.data
        }
      })
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
  @import "../../../../static/css/scss/Personal/IndexPersonal";
  .transaction-password {
    overflow: hidden;
    >.transaction-password-main {
      width: 1100px;
      min-height: 700px;
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
          .send-code-btn {
            width: 90px;
            /*height: 36px;
            position: absolute;
            top: -1px;*/
          }
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
            padding: 10px 85px;
            margin: 30px 0 50px 120px;
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
        background-color: $nightMainBgColor;
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
            .send-code-btn {
              background-color: #338FF5;
              color: #fff;
            }
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
            .send-code-btn {
              background-color: #338FF5;
              color: #fff;
            }
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
              background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
              color: #ccc;
            }
          }
        }
      }
    }
  }
</style>
