<template>
  <div
    class="transaction-password personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <HeaderCommon />
    <div class="transaction-password-main margin25">
      <header class="transaction-password-header personal-height60 line-height60 line-height70 margin25">
        <span
          v-if="!SecurityCenter.payPassword"
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
            v-if="SecurityCenter.payPassword"
            :label-position="labelPosition"
            label-width="120px"
          >
            <el-form-item label="昵称：">
              <input
                type="text"
                class="transaction-input border-radius2 padding-l15 box-sizing"
                @focus="emptyStatus"
                v-model="setPassword.nickname"
              />
            </el-form-item>
            <el-form-item label="交易密码：">
              <input
                type="password"
                class="transaction-input border-radius2 padding-l15 box-sizing"
                @focus="emptyStatus"
                v-model="setPassword.newPassword"
              />
            </el-form-item>
            <el-form-item label="重复交易密码：">
              <input
                type="password"
                class="transaction-input border-radius2 padding-l15 box-sizing"
                @focus="emptyStatus"
                v-model="setPassword.confirmPassword"
              />
            </el-form-item>
            <div class="prompt-message">
              <div v-show="errorMsg">{{ errorMsg }}</div>
            </div>
            <button
              class="transaction-button border-radius4 cursor-pointer"
              @click="setStatusSubmit"
            >
              确认绑定
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
                @focus="emptyStatus"
                v-model="modifyPassword.transactionPassword"
              />
            </el-form-item>
            <el-form-item label="重置交易密码：">
              <input
                type="password"
                class="transaction-input border-radius2 padding-l15 box-sizing"
                @focus="emptyStatus"
                v-model="modifyPassword.resetTransactionPassword"
              />
            </el-form-item>
            <el-form-item
              label="验  证  码："
              v-if="!SecurityCenter.isMailBind"
            >
              <el-input
                type="text"
                @focus="emptyStatus"
                v-model="modifyPassword.phoneCode"
              >
                <template slot="append">
                  <CountDownButton
                    class="send-code-btn cursor-pointer"
                    :status="disabledOfPhoneBtn"
                    @run="sendPhoneOrEmailCodeWithPush(0)"
                  />
                </template>
              </el-input>
            </el-form-item>
            <span v-else></span>
            <el-form-item
              v-if="!SecurityCenter.isPhoneBind"
              label="邮箱验证码"
            >
              <el-input
                @focus="emptyStatus"
                v-model="modifyPassword.emailCode"
              >
                <template slot="append">
                  <CountDownButton
                    class="send-code-btn cursor-pointer"
                    :status="disabledOfEmailBtn"
                    @run="sendPhoneOrEmailCodeWithPush(1)"
                  />
                </template>
              </el-input>
            </el-form-item>
            <span v-else></span>
            <el-form-item
              label="谷歌验证码"
              v-if="!SecurityCenter.isPhoneBind"
            >
              <input
                type="text"
                class="transaction-input border-radius2 padding-l15 box-sizing"
                @focus="emptyStatus"
                v-model="modifyPassword.googleCode"
              />
            </el-form-item>
            <span v-else></span>
            <div class="prompt-message">
              <div v-show="errorMsg">{{ errorMsg }}</div>
            </div>
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
import {returnAjaxMessage, sendPhoneOrEmailCodeAjax} from '../../../utils/commonFunc'
import {
  setTransactionPassword,
  resetUpdatePayPassword,
  securityVerificationOnOff,
  statusSecurityCenter
} from '../../../utils/api/personal'
// 底部
import FooterCommon from '../../Common/FooterCommon'
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations } = createNamespacedHelpers('personal')
export default {
  components: {
    HeaderCommon, // 头部
    IconFontCommon, // 字体图标
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
      SecurityCenter: {},
      // 修改交易密码
      modifyPassword: {
        transactionPassword: '', // 修改交易密码
        resetTransactionPassword: '', // 修改 重置交易密码.
        phoneCode: '', // 修改 手机验证码
        emailCode: '', // 修改 邮箱验证码
        googleCode: '' // 修改 谷歌验证码
      },
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
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_USER_CENTER_ACTIVE_NAME'
    ]),
    // 点击返回上个页面
    returnSuperior () {
      this.CHANGE_USER_CENTER_ACTIVE_NAME('security-center')
      this.$router.go(-1)
    },
    // 清空内容信息
    emptyStatus () {
      this.errorMsg = ''
    },
    // 修改input value
    changeInputValue (ref) {
      // console.dir(this.$refs[ref])
      this[ref] = this.$refs[ref].value
      // console.log(this[ref])
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
    // 确定设置交易密码
    setStatusSubmit () {
      // if (!this.emailAccounts) {
      //   this.errorMsg = '邮箱账号不能为空'
      // } else if (!this.emailCode) {
      //   this.errorMsg = '验证码不能为空'
      // } else {
      //   this.errorMsg = ''
      // }
      this.confirmTransactionPassword()
    },
    // 确定设置接口处理
    async confirmTransactionPassword () {
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
        // this.statusSecurityCenter()
      }
    },
    // 确定重置交易密码
    getUpdatePayPassword () {
      this.confirmUpdate()
      this.confirmVerifyInformation()
    },
    // 确定重置接口处理
    async confirmUpdate () {
      let data
      let param = {
        payPassword: this.modifyPassword.resetTransactionPassword // 重置交易密码
      }
      data = await resetUpdatePayPassword(param)
      if (!(returnAjaxMessage(data, this, 1))) {
        return false
      } else {
        this.successJump()
        console.log(data)
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
      if (!(returnAjaxMessage(data, this, 1))) {
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
        this.SecurityCenter = data.data.data
      }
    },
    // 谷歌绑定成功自动跳转
    successJump () {
      setInterval(() => {
        if (this.successCountDown === 0) {
          this.CHANGE_USER_CENTER_ACTIVE_NAME('security-center')
          this.$router.go(-1)
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
      disabledOfEmailBtn: state => state.user.disabledOfEmailBtn
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
              color: #fff;
            }
            .transaction-upload {
              background-color: #323E48;
              .icon-plus {
                color: #828EA6;
              }
            }
            .transaction-button {
              background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
              color: #fff;
            }
          }
        }
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      .transaction-password-main {
        background-color: #ccc;
        >.transaction-password-header {
          border-bottom: 1px solid #ccc;
          >.header-content-left {
            color: #555;
          }
        }
        >.transaction-password-content {
          >.transaction-content-title {
            background:rgba(62,121,214,1);
            color: #ccc;
          }
          >.transaction-content-from {
            .transaction-input {
              border: 1px solid #000;
              color: #000;
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
