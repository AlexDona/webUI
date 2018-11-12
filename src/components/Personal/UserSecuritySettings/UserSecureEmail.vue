<template>
  <div
    class="set-email personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-background="rgba(0, 0, 0, 0.6)"
    :style="{
      height: windowHeight+'px'
    }"
  >
    <div class="set-email-main margin25">
      <header class="set-email-header personal-height60 line-height60 line-height70 margin25">
        <span class="header-content-left header-content font-size16 font-weight600">
          <!--绑定邮箱-->
          {{ $t('M.user_security_binding') }}{{ $t('M.user_security_email') }}
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
      <div class="set-email-content">
        <header class="email-content-title">
          <!--*请确认您的银行卡已开启短信通知功能-->
          {{ $t('M.user_security_text0') }}
        </header>
        <div class="email-content-from">
          <el-form
            :label-position="labelPosition"
            label-width="120px"
          >
            <!--邮箱账号-->
            <el-form-item
              :label="$t('M.user_security_email') + $t('M.user_account_number') + '：'"
            >
              <input
                class="email-input border-radius2 padding-l15 box-sizing"
                v-model="emailAccounts"
                @keydown="setErrorMsg(0, '')"
                @focus="resetIsEmailExist"
                @blur="checkUserExistAjax('email', emailAccounts)"
              />
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[0]"
                :isShow="!!errorShowStatusList[0]"
              />
            </el-form-item>
            <!--验证码-->
            <el-form-item
              :label="$t('M.comm_code') + '：'"
            >
              <el-input
                v-model="emailCode"
                @keydown="setErrorMsg(1, '')"
                @blur="checkoutInputFormat(1, emailCode)"
              >
                <template slot="append">
                  <CountDownButton
                    class="send-code-btn cursor-pointer"
                    :status="disabledOfEmailBtn"
                    @run="sendPhoneOrEmailCode(1)"
                  />
                </template>
              </el-input>
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[1]"
                :isShow="!!errorShowStatusList[1]"
              />
            </el-form-item>
            <button
              class="email-button border-radius4 cursor-pointer"
              @click.prevent="confirmBindingBailSubmit"
            >
              <!--确认绑定-->
              {{ $t('M.comm_affirm') }}{{ $t('M.user_security_binding') }}
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
  returnAjaxMessage, // 接口返回信息
  validateNumForUserInput, // 用户输入验证
  sendPhoneOrEmailCodeAjax
} from '../../../utils/commonFunc'
import {bindEmailAddress} from '../../../utils/api/personal'
import {checkUserExist} from '../../../utils/api/user'
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations } = createNamespacedHelpers('user')
export default {
  components: {
    IconFontCommon, // 字体图标
    ErrorBox, // 错误信息提示
    CountDownButton // 短信倒计时
  },
  data () {
    return {
      globalUserInformation: {}, // 个人信息
      emailAccounts: '', // 邮箱账号
      emailCode: '', // 邮箱验证码
      successCountDown: 1, // 成功倒计时
      fullscreenLoading: false, // 整页loading
      isEmailExist: false, // 邮箱是否存在
      errorShowStatusList: [
        '', // 邮箱账号
        '' // 验证码
      ]
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/UserSecuritySettings/UserSecureEmail.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/UserSecuritySettings/UserSecureEmailDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/UserSecuritySettings/UserSecureEmailNight.css')
    // 获取全局个人信息
    this.globalUserInformation = this.userInfo
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'SET_USER_BUTTON_STATUS'
    ]),
    // 点击返回上个页面
    returnSuperior () {
      this.$store.commit('personal/CHANGE_REF_SECURITY_CENTER_INFO', true)
      this.$store.commit('personal/CHANGE_USER_CENTER_ACTIVE_NAME', 'security-center')
      this.$router.push({path: '/PersonalCenter'})
    },
    // 重置邮箱已存在状态
    resetIsEmailExist () {
      this.isEmailExist = false
    },
    // 发送邮箱验证码
    async sendPhoneOrEmailCode (loginType) {
      // await this.checkUserExistAjax(loginType, this.emailAccounts)
      if (this.isEmailExist && this.emailAccounts) {
        this.$message({
          type: 'error',
          message: this.$t('M.user-fail-reg-mail-exist')
        })
        return false
      }
      // if (!this.emailAccounts) {
      //   this.$message({
      //     // 请先输入邮箱账号
      //     message: this.$t('M.comm_please_enter') + this.$t('M.user_security_email') + this.$t('M.user_account_number'),
      //     type: 'error'
      //   })
      //   return false
      // }
      // let a = validateNumForUserInput('email', this.emailAccounts)
      // console.log(a)
      if (!this.checkoutInputFormat(0, this.emailAccounts)) {
        return false
      }
      if (this.disabledOfPhoneBtn || this.disabledOfEmailBtn) {
        return false
      }
      let params = {
        userId: this.userInfo.userId
      }
      switch (loginType) {
        case 0:
          params.phone = this.userInfoDetail.phone
          break
        case 1:
          params.email = this.emailAccounts
          break
      }
      await sendPhoneOrEmailCodeAjax(loginType, params, this)
    },
    /**
     * 确认绑定邮箱
     */
    // 检测用户名是否存在
    async checkUserExistAjax (type, userName) {
      if (!validateNumForUserInput(type, userName)) {
        let params = {
          userName: userName,
          regType: type
        }
        const data = await checkUserExist(params)
        if (!returnAjaxMessage(data, this, 0)) {
          this.isEmailExist = true
          return false
        }
      } else {
        switch (type) {
          case 'email':
            this.isEmailExist = false
            if (this.checkoutInputFormat(0, userName)) {
              return false
            }
            break
        }
      }
    },
    // 检测输入格式
    checkoutInputFormat (type, targetNum) {
      switch (type) {
        // 邮箱账号
        case 0:
          console.log(type)
          switch (validateNumForUserInput('email', targetNum)) {
            case 0:
              // console.log(type)
              this.setErrorMsg(0, '')
              this.$forceUpdate()
              return 1
            case 1:
              // console.log(type)
              // 请输入邮箱地址
              this.setErrorMsg(0, this.$t('M.comm_please_enter') + this.$t('M.comm_please_enter') + this.$t('M.comm_site'))
              this.$forceUpdate()
              return 0
            case 2:
              // console.log(type)
              // 请输入正确的邮箱地址
              this.setErrorMsg(0, this.$t('M.comm_please_enter') + this.$t('M.user_security_correct') + this.$t('M.user_security_email') + this.$t('M.comm_site'))
              this.$forceUpdate()
              return 0
          }
          break
        // 邮箱验证码
        case 1:
          if (!targetNum) {
            // console.log(type)
            // 请输入邮箱验证码
            this.setErrorMsg(1, this.$t('M.comm_please_enter') + this.$t('M.user_security_email') + this.$t('M.comm_code'))
            this.$forceUpdate()
            return 0
          } else {
            console.log(type)
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
    // 确定绑定按钮
    confirmBindingBailSubmit () {
      this.confirmBindingBail()
    },
    // 确定绑定接口
    async confirmBindingBail () {
      this.checkUserExistAjax('email', this.emailAccounts)
      // if (!this.emailCode) {
      //   this.$message({
      //     // 请先输入邮箱账号
      //     message: this.$t('M.comm_please_enter') + this.$t('M.user_security_email') + this.$t('M.comm_code'),
      //     type: 'error'
      //   })
      //   return false
      // }
      if (this.isEmailExist) {
        this.$message({
          type: 'error',
          message: this.$t('M.user-fail-reg-mail-exist')
        })
        return false
      }
      let goOnStatus = 0
      if (
        this.checkoutInputFormat(0, this.emailAccounts) &&
        this.checkoutInputFormat(1, this.emailCode) &&
        !this.isEmailExist
      ) {
        goOnStatus = 1
      } else {
        goOnStatus = 0
      }
      if (goOnStatus) {
        let data
        let param = {
          email: this.emailAccounts, // 邮箱账号
          code: this.emailCode // 邮箱验证码
        }
        // 整页loading
        this.fullscreenLoading = true
        data = await bindEmailAddress(param)
        if (!(returnAjaxMessage(data, this, 1))) {
          // 接口失败清除loading
          this.fullscreenLoading = false
          return false
        } else {
          // 接口成功清除loading
          this.fullscreenLoading = false
          this.stateEmptyData()
          this.successJump()
        }
      }
    },
    // 接口请求完成之后清空数据
    stateEmptyData () {
      this.emailAccounts = ''
      this.emailCode = ''
    },
    // 谷歌绑定成功自动跳转
    successJump () {
      setInterval(() => {
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
      activeCountryCode: state => state.user.loginStep1Info.countryCode, // 国籍码
      disabledOfPhoneBtn: state => state.user.disabledOfPhoneBtn,
      disabledOfEmailBtn: state => state.user.disabledOfEmailBtn
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
  .set-email {
    margin-top:66px;
    overflow: hidden;
    >.set-email-main {
      width: 1100px;
      min-height: 700px;
      margin: 60px auto 100px;
      >.set-email-header {
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
      >.set-email-content {
        min-height: 300px;
        margin: 16px 25px;
        >.email-content-title {
          height: 32px;
          line-height: 32px;
          margin-bottom: 30px;
        }
        >.email-content-from {
          width: 700px;
          margin-left: 55px;
          .send-code-btn {
            width: 90px;
            /*height: 36px;
            position: absolute;
            top: -1px;*/
          }
          .input {
            width: 180px;
          }
          .email-input {
            width: 220px;
            height: 34px;
          }
          .email-upload {
            width: 118px;
            height: 106px;
            text-align: center;
            line-height: 100px;
          }
          .email-button {
            margin: 30px 0 50px 158px;
            padding: 10px 0;
            width: 220px;
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
      .set-email-main {
        background-color: $nightMainBgColor;
        >.set-email-header {
          border-bottom: 1px solid #39424D;
          >.header-content-left {
            color: #fff;
          }
          >.header-content-right {
            color: #A9BED4;
          }
        }
        >.set-email-content {
          >.email-content-title {
            background:rgba(62,121,214,0.08);
            color: #3E79D6;
          }
          >.email-content-from {
            .send-code-btn {
              background-color: #338FF5;
              color: #fff;
            }
            .email-input {
              border: 1px solid #485776;
              color: rgba(255,255,255,0.7);
              &:focus {
                border: 1px solid #338FF5;
              }
            }
            .email-content-name {
              color: rgba(255,255,255,0.7);
            }
            .email-upload {
              background-color: #323E48;
              .icon-plus {
                color: #828EA6;
              }
            }
            .email-button {
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
      .set-email-main {
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
        >.set-email-content {
          >.email-content-title {
            background:rgba(51,143,245,0.1);
            color: #333;
          }
          >.email-content-from {
            .send-code-btn {
              background-color: #338FF5;
              color: #fff;
            }
            .email-input {
              border:1px solid rgba(236,241,248,1);
              color: #333;
              &:focus {
                border: 1px solid #338FF5;
              }
            }
            .email-upload {
              background-color: #fff;
              .icon-plus {
                color: #555;
              }
            }
            .email-button {
              background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
              color: #ccc;
            }
          }
        }
      }
    }
  }
</style>
