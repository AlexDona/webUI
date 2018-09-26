<template>
  <div
    class="set-email personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <HeaderCommon />
    <div class="set-email-main margin25">
      <header class="set-email-header personal-height60 line-height60 line-height70 margin25">
        <span class="header-content-left header-content font-size16 font-weight600">
          绑定邮箱
        </span>
        <span
          class="header-content-right font-size12 cursor-pointer"
          @click.prevent="returnSuperior"
        >
          <IconFontCommon
            class="font-size22"
            iconName="icon-fanhui2"
          />
          返回安全中心
        </span>
      </header>
      <div class="set-email-content">
        <header class="email-content-title">
          *请确认您的银行卡已开启短信通知功能
        </header>
        <div class="email-content-from">
          <el-form
            :label-position="labelPosition"
            label-width="120px"
          >
            <el-form-item label="邮箱账号：">
              <input
                class="email-input border-radius2 padding-l15 box-sizing"
                v-model="emailAccounts"
                @keydown="setErrorMsg(0, '')"
                @blur="checkUserExistAjax('email', emailAccounts)"
              />
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[0]"
                :isShow="!!errorShowStatusList[0]"
              />
            </el-form-item>
            <el-form-item label="验  证  码：">
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
              确认绑定
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
import HeaderCommon from '../../Common/HeaderCommonForPC'
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
// 底部
import FooterCommon from '../../Common/FooterCommon'
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations } = createNamespacedHelpers('personal')
export default {
  components: {
    HeaderCommon, // 头部
    IconFontCommon, // 字体图标
    ErrorBox, // 错误信息提示
    CountDownButton, // 短信倒计时
    FooterCommon // 底部
  },
  data () {
    return {
      globalUserInformation: {}, // 个人信息
      emailAccounts: '', // 邮箱账号
      emailCode: '', // 邮箱验证码
      successCountDown: 1, // 成功倒计时
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
      'CHANGE_USER_CENTER_ACTIVE_NAME',
      'CHANGE_REF_SECURITY_CENTER_INFO'
    ]),
    // 点击返回上个页面
    returnSuperior () {
      this.CHANGE_REF_SECURITY_CENTER_INFO(true)
      this.CHANGE_USER_CENTER_ACTIVE_NAME('security-center')
      this.$router.push({path: '/PersonalCenter'})
    },
    // 发送邮箱验证码
    sendPhoneOrEmailCode (loginType) {
      console.log(this.disabledOfPhoneBtn)
      console.log(this.disabledOfEmailBtn)
      if (this.disabledOfPhoneBtn || this.disabledOfEmailBtn) {
        return false
      }
      let params = {
        address: this.emailAccounts, // 邮箱账号
        type: 'VERIFICATION_CODE' // 类型
        // country: this.activeCountryCode // 邮箱国籍
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
        if (!returnAjaxMessage(data, this, 1)) {
          return false
        }
      } else {
        switch (type) {
          case 'email':
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
              console.log(type)
              this.setErrorMsg(0, '')
              this.$forceUpdate()
              return 1
            case 1:
              console.log(type)
              this.setErrorMsg(0, '请输入邮箱地址')
              this.$forceUpdate()
              return 0
            case 2:
              console.log(type)
              this.setErrorMsg(0, '请输入正确的邮箱地址')
              this.$forceUpdate()
              return 0
          }
          break
        // 邮箱验证码
        case 1:
          if (!targetNum) {
            console.log(type)
            this.setErrorMsg(1, '请输入邮箱验证码')
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
    confirmBindingBailSubmit () {
      this.confirmBindingBail()
    },
    // 确定绑定
    async confirmBindingBail () {
      let goOnStatus = 0
      if (
        this.checkoutInputFormat(0, this.emailAccounts) &&
        this.checkoutInputFormat(1, this.emailCode)
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
        data = await bindEmailAddress(param)
        if (!(returnAjaxMessage(data, this, 1))) {
          return false
        } else {
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
          this.CHANGE_REF_SECURITY_CENTER_INFO(true)
          this.CHANGE_USER_CENTER_ACTIVE_NAME('security-center')
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
      userInfo: state => state.personal.userInfo,
      activeCountryCode: state => state.user.loginStep1Info.countryCode, // 国籍码
      disabledOfPhoneBtn: state => state.user.disabledOfPhoneBtn,
      disabledOfEmailBtn: state => state.user.disabledOfEmailBtn
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal";
  .set-email {
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
          width: 500px;
          margin-left: 55px;
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
      .set-email-main {
        background-color: #1E2636;
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
