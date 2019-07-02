<template>
  <div
    class="transaction-password personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
    :style="{
      height: windowHeight+'px'
    }"
  >
    <div class="transaction-password-main margin25">
      <header class="transaction-password-header personal-height60 line-height60 line-height70 margin25">
        <span class="header-content-left header-content font-size16 font-weight600">
          <!--设置交易密码-->
          {{ !securityCenter.payPassword? $t('M.comm_set') + $t('M.comm_password') : $t('M.user_security_set_reset_pwd2') }}
          <!--重置交易密码-->
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
        <div class="transaction-content-from">
          <!--设置交易密码-->
          <el-form
            v-if="!securityCenter.payPassword"
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
                @input="setPassword.nickname=setPassword.nickname.replace(/\s+/g,'')"
                @keyup="setPassword.nickname=setPassword.nickname.replace(/\s+/g,'')"
                maxlength="10"
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
                autocomplete= "new-password"
                class="transaction-input border-radius2 padding-l15 box-sizing"
                v-model="setPassword.newPassword"
                @keydown="setErrorMsg(1,'')"
                @blur="checkoutInputFormat(1, setPassword.newPassword)"
                @input="setPassword.newPassword=setPassword.newPassword.replace(/[^\d]/g,'')"
                @keyup="setPassword.newPassword=setPassword.newPassword.replace(/[^\d]/g,'')"
                maxlength="6"
              />
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[1]"
                :isShow="!!errorShowStatusList[1]"
              />
            </el-form-item>
            <!--重复交易密码-->
            <el-form-item
              :label="$t('M.user_modification_repeat_trade_pwd') + '：'"
            >
              <input
                type="password"
                autocomplete= "new-password"
                class="transaction-input border-radius2 padding-l15 box-sizing"
                v-model="setPassword.confirmPassword"
                @keydown="setErrorMsg(2,'')"
                @blur="checkoutInputFormat(2, setPassword.confirmPassword)"
                @input="setPassword.confirmPassword=setPassword.confirmPassword.replace(/[^\d]/g,'')"
                @keyup="setPassword.confirmPassword=setPassword.confirmPassword.replace(/[^\d]/g,'')"
                maxlength="6"
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
            label-width="120px"
          >
            <header class="header-title">
              <!--* 为了您的资金安全，重置交易密码后24小时内将不可进行提币、PUSH资产等敏感操作 -->
              <span>*</span>&nbsp;
              <p class="float-right" style="width: 98%;">
              {{ $t('M.user_transaction_info') }}
            </p>
            </header>
            <!--交易密码-->
            <el-form-item
              :label="$t('M.comm_password') + '：'"
            >
              <input
                type="password"
                autocomplete= "new-password"
                class="transaction-input border-radius2 padding-l15 box-sizing"
                v-model="modifyPassword.transactionPassword"
                @keydown="tieErrorMsg(0,'')"
                @blur="tieCheckoutInputFormat(0, modifyPassword.transactionPassword)"
                @input="modifyPassword.transactionPassword=modifyPassword.transactionPassword.replace(/[^\d]/g,'')"
                @keyup="modifyPassword.transactionPassword=modifyPassword.transactionPassword.replace(/[^\d]/g,'')"
                maxlength="6"
              />
              <!--错误提示-->
              <ErrorBox
                :text="tieErrorShowStatusList[0]"
                :isShow="!!tieErrorShowStatusList[0]"
              />
            </el-form-item>
            <!--重复交易密码-->
            <el-form-item
              :label="$t('M.user_modification_repeat_trade_pwd') + '：'"
            >
              <input
                type="password"
                autocomplete= "new-password"
                class="transaction-input border-radius2 padding-l15 box-sizing"
                v-model="modifyPassword.resetTransactionPassword"
                @keydown="tieErrorMsg(1,'')"
                @blur="tieCheckoutInputFormat(1, modifyPassword.resetTransactionPassword)"
                @input="modifyPassword.resetTransactionPassword=modifyPassword.resetTransactionPassword.replace(/[^\d]/g,'')"
                @keyup="modifyPassword.resetTransactionPassword=modifyPassword.resetTransactionPassword.replace(/[^\d]/g,'')"
                maxlength="6"
              />
              <!--错误提示-->
              <ErrorBox
                :text="tieErrorShowStatusList[1]"
                :isShow="!!tieErrorShowStatusList[1]"
              />
            </el-form-item>
            <!--验证码-->
            <el-form-item
              :label="$t('M.comm_note') + $t('M.comm_code') + '：'"
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
                    v-if="this.$route.path === '/TransactionPassword'"
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
                    v-if="this.$route.path === '/TransactionPassword'"
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
import IconFontCommon from '../../Common/IconFontCommon'
import CountDownButton from '../../Common/CountDownCommon'
import ErrorBox from '../../User/ErrorBox'
import {
  // returnAjaxMsg, // 接口返回信息
  sendPhoneOrEmailCodeAjax,
  validateNumForUserInput,
  getSecurityCenter,
  getNestedData
} from '../../../utils/commonFunc'
import {
  setTransactionPassword,
  resetUpdatePayPassword,
  cancelPasswdDialog
} from '../../../utils/api/personal'
import {
  mapState,
  mapMutations,
  mapActions
} from 'vuex'
export default {
  components: {
    IconFontCommon, // 字体图标
    ErrorBox, // 错误提示信息
    CountDownButton // 短信倒计时
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
      securityCenter: {}, // 安全信息设置
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
      successCountDown: 1, // 成功倒计时
      googleBindSuccessJumpTimer: null // 谷歌绑定成功跳转定时器
    }
  },
  async created () {
    await this.getSecurityCenter()
    await this.cancelPasswdDialog()
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapActions([
      'REFRESH_USER_INFO_ACTION'
    ]),
    ...mapMutations([
      'SET_USER_BUTTON_STATUS',
      'SET_USER_INFO_REFRESH_STATUS',
      'CHANGE_REF_SECURITY_CENTER_INFO',
      'CHANGE_USER_CENTER_ACTIVE_NAME'
    ]),
    // 取消用户设置密码弹窗
    async cancelPasswdDialog () {
      const data = await cancelPasswdDialog()
      if (!data) return false
      this.REFRESH_USER_INFO_ACTION(this)
    },
    // 点击返回上个页面
    returnSuperior () {
      this.CHANGE_REF_SECURITY_CENTER_INFO(true)
      this.CHANGE_USER_CENTER_ACTIVE_NAME('security-center')
      this.$goToPage('/PersonalCenter')
    },
    /**
     * 发送短信验证码或邮箱验证码
     */
    sendPhoneOrEmailCodeWithPush (loginType) {
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
        // nationCode: this.activeCountryCode,
        userId: this.userInfo.userId
      }
      switch (loginType) {
        case 0:
          params.phone = this.userInfoDetail.phone
          break
        case 1:
          params.email = this.userInfoDetail.email
          break
      }
      sendPhoneOrEmailCodeAjax(loginType, params, this)
    },
    // 确定设置检测输入格式
    checkoutInputFormat (type, targetNum) {
      switch (type) {
        // 昵称
        case 0:
          if (!targetNum) {
            // 请输入昵称
            this.setErrorMsg(0, this.$t('M.user_set_tradePwd_tips1'))
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
              this.setErrorMsg(1, this.$t('M.user_modification_input_pwd'))
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
            this.setErrorMsg(2, this.$t('M.user_modification_confirm_trade_pwd'))
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
        data = await setTransactionPassword(params)
        if (!data) return false
        console.log(data)
        this.stateEmptyData()
        this.SET_USER_INFO_REFRESH_STATUS(true)
        this.successJump()
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
              this.tieErrorMsg(0, this.$t('M.user_modification_input_pwd'))
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
            this.tieErrorMsg(1, this.$t('M.user_modification_confirm_trade_pwd'))
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
            this.tieErrorMsg(2, this.$t('M.login_please_input1'))
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
            this.tieErrorMsg(3, this.$t('M.login_please_input2'))
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
            this.tieErrorMsg(4, this.$t('M.user_please_input9'))
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
      // 问题：点击确认重置按钮直接接口调用成功了，
      // 原因：未调用验证input方法
      // 修复重置交易密码逻辑，应该调用confirmUpdate()
      this.confirmUpdate()
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
      // console.log(goOnStatus)
      if (goOnStatus) {
        if (this.securityCenter.isMailEnable && !this.modifyPassword.emailCode) {
          this.$message({
            type: 'error',
            message: this.$t('M.login_please_input2') // '请输入邮箱验证码'
          })
          return false
        }
        if (this.securityCenter.isPhoneEnable && !this.modifyPassword.phoneCode) {
          this.$message({
            type: 'error',
            message: this.$t('M.login_please_input1') // '请输入短信验证码'
          })
          return false
        }
        if (this.securityCenter.isGoogleEnable && !this.modifyPassword.googleCode) {
          this.$message({
            type: 'error',
            message: this.$t('M.user_please_input9') // 请输入谷歌验证码
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
        data = await resetUpdatePayPassword(param)
        if (!data) return false
        this.successJump()
        this.stateEmptyData()
        this.SET_USER_INFO_REFRESH_STATUS(true)
      }
    },
    /**
     * 安全中心
     */
    getSecurityCenter () {
      getSecurityCenter(this, {}, data => {
        if (data) {
          this.securityCenter = getNestedData(data, 'data.data')
        }
      })
    },
    // 谷歌绑定成功自动跳转
    successJump () {
      this.googleBindSuccessJumpTimer = setInterval(() => {
        if (this.successCountDown === 0) {
          this.returnSuperior()
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
      userInfoDetail: state => state.user.loginStep1Info.userInfo,
      disabledOfPhoneBtn: state => state.user.disabledOfPhoneBtn,
      disabledOfEmailBtn: state => state.user.disabledOfEmailBtn,
      refSecurityCenterStatus: state => state.personal.refSecurityCenterStatus,
      paypasswordSet: state => state.user.loginStep1Info.userInfo.loginStep1Info // 用户是否已进入交易密码
    }),
    windowHeight () {
      return window.innerHeight
    }
  },
  watch: {},
  destroyed () {
    // 离开本组件清除定时器
    if (this.googleBindSuccessJumpTimer) {
      clearInterval(this.googleBindSuccessJumpTimer)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../../assets/CSS/index';

  .transaction-password {
    margin-top: 50px;
    overflow: hidden;

    > .transaction-password-main {
      width: 1100px;
      min-height: 700px;
      margin: 60px auto 100px;

      > .transaction-password-header {
        display: flex;

        > .header-content-right,
        .header-content-left {
          flex: 1;
        }

        > .header-content-right {
          text-align: right;
        }

        > .header-content-left {
          font-weight: 600;
          text-align: left;
        }
      }

      > .transaction-password-content {
        min-height: 300px;
        margin: 16px 0;

        > .transaction-content-title {
          height: 32px;
          margin-bottom: 30px;
          line-height: 32px;
        }

        > .transaction-content-from {
          width: 575px;
          margin-left: 55px;

          .header-title {
            height: 32px;
            margin-bottom: 30px;
            line-height: 20px;
          }

          .send-code-btn {
            width: 90px;
          }

          .transaction-input {
            width: 220px;
            height: 34px;
          }

          .transaction-upload {
            width: 118px;
            height: 106px;
            line-height: 100px;
            text-align: center;
          }

          .transaction-button {
            width: 215px;
            padding: 10px 0;
            margin: 30px 0 50px 185px;
          }

          .prompt-message {
            height: 20px;
            padding-left: 35px;
          }
        }
      }
    }

    /deep/ {
      /* 覆盖Element样式 */
      .el-form-item__content {
        width: 600px;
      }

      .el-input__inner {
        height: 36px;
        border-radius: 2px 0 0 2px;
        vertical-align: top;
      }

      .el-input-group {
        width: 220px;
        height: 36px;
        margin-right: 0;
        border-radius: 4px;
      }

      .el-input-group__append {
        padding: 0;
        background-color: #338ff5;
      }

      /* 表单label宽度重置 */
      .transaction-password-content {
        .transaction-content-from {
          .el-form {
            .el-form-item {
              .el-form-item__label {
                width: 186px !important;
              }
            }
          }
        }
      }
    }

    &.night {
      color: $nightFontColor;
      background-color: $mainNightBgColor;

      .transaction-password-main {
        background-color: $mainContentNightBgColor;

        > .transaction-password-header {
          border-bottom: 1px solid #39424d;

          > .header-content-left {
            color: #fff;
          }

          > .header-content-right {
            color: #a9bed4;
          }
        }

        > .transaction-password-content {
          > .transaction-content-title {
            color: #3e79d6;
            background: rgba(62, 121, 214, .08);
          }

          > .transaction-content-from {
            .header-title {
              color: #3e79d6;
            }

            .send-code-btn {
              color: #fff;
              background-color: #338ff5;
            }

            .transaction-input {
              border: 1px solid #485776;
              color: #fff;

              &:focus {
                border: 1px solid #338ff5;
              }
            }

            .transaction-content-name {
              color: rgba(255, 255, 255, .7);
            }

            .transaction-upload {
              background-color: #323e48;

              .icon-plus {
                color: #828ea6;
              }
            }

            .transaction-button {
              color: rgba(255, 255, 255, .7);
              background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
            }
          }
        }
      }

      /deep/ {
        /* 个人中心（黑色主题） */
        .el-form-item__label {
          color: rgba(255, 255, 255, .7);
        }

        .el-input__inner {
          border: 1px solid #485776;
          color: #a9bed4;
          background-color: #1c1f32;

          &:focus {
            border: 1px solid #338ff5;
          }
        }

        .el-input-group__append {
          border-top: 1px solid #485776;
          border-bottom: 1px solid #485776;
          color: #fff;
          background-color: #338ff5;
          border-right: 1px solid #485776;
        }
      }
    }

    &.day {
      color: $dayMainTitleColor;
      background-color: $mainDayBgColor;

      .transaction-password-main {
        border: 1px solid rgba(246, 246, 246, 1);
        border-radius: 4px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 0 4px rgba(235, 240, 248, 1);

        > .transaction-password-header {
          border-bottom: 1px solid rgba(57, 66, 77, .1);

          > .header-content-left {
            color: #333;
          }

          > .header-content-right {
            color: #7d90ac;
          }
        }

        > .transaction-password-content {
          > .transaction-content-title {
            color: #333;
            background: rgba(51, 143, 245, .1);
          }

          > .transaction-content-from {
            .header-title {
              color: #3e79d6;
            }

            .send-code-btn {
              color: #fff;
              background-color: #338ff5;
            }

            .transaction-input {
              border: 1px solid rgba(236, 241, 248, 1);
              color: #333;

              &:focus {
                border: 1px solid #338ff5;
              }
            }

            .transaction-upload {
              background-color: #fff;

              .icon-plus {
                color: #555;
              }
            }

            .transaction-button {
              color: #ccc;
              background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
            }
          }
        }
      }

      /deep/ {
        .el-form-item__label {
          color: #7d90ac;
        }
      }
    }
  }
</style>
