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
          @click="returnSuperior"
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
                @focus="emptyStatus"
                v-model="emailAccounts"
              />
            </el-form-item>
            <el-form-item label="验  证  码：">
              <el-input
                @focus="emptyStatus"
                v-model="emailCode"
              >
                <template slot="append">
                  <CountDownButton
                    class="send-code-btn cursor-pointer"
                    :status="disabledOfEmailBtn"
                    @run="sendPhoneOrEmailCode(1)"
                  />
                </template>
              </el-input>
            </el-form-item>
            <div class="prompt-message">
              <div v-show="errorMsg">{{ errorMsg }}</div>
            </div>
            <button
              class="email-button border-radius4 cursor-pointer"
              @click="confirmBindingBailSubmit"
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
import HeaderCommon from '../../Common/HeaderCommon'
import IconFontCommon from '../../Common/IconFontCommon'
import CountDownButton from '../../Common/CountDownCommon'
import {returnAjaxMessage, sendPhoneOrEmailCodeAjax} from '../../../utils/commonFunc'
import {bindEmailAddress} from '../../../utils/api/apiDoc'
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
      globalUserInformation: {}, // 个人信息
      errorMsg: '', // 错误信息提示
      emailAccounts: '', // 邮箱账号
      emailCode: '' // 邮箱验证码
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
      'CHANGE_USER_CENTER_ACTIVE_NAME'
    ]),
    // 点击返回上个页面
    returnSuperior () {
      this.CHANGE_USER_CENTER_ACTIVE_NAME('seven')
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
    // 确定绑定
    // getStatusSubmit () {
    //   if (!this.emailAccounts) {
    //     this.errorMsg = '邮箱账号不能为空'
    //   } else if (!this.emailCode) {
    //     this.errorMsg = '验证码不能为空'
    //   } else {
    //     this.errorMsg = ''
    //   }
    //   console.log(1)
    // },
    // 发送邮箱验证码
    sendPhoneOrEmailCode (loginType) {
      console.log(this.disabledOfPhoneBtn)
      console.log(this.disabledOfEmailBtn)
      if (this.disabledOfPhoneBtn || this.disabledOfEmailBtn) {
        return false
      }
      let params = {
        address: this.emailAccounts, // 邮箱账号
        country: this.activeCountryCode // 邮箱国籍
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
    confirmBindingBailSubmit () {
      this.confirmBindingBail()
    },
    // 确定绑定
    async confirmBindingBail () {
      let data
      let param = {
        email: this.emailAccounts, // 邮箱账号
        code: this.emailCode // 邮箱验证码
      }
      data = await bindEmailAddress(param)
      if (!(returnAjaxMessage(data, this, 1))) {
        return false
      } else {
        console.log(data)
      }
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
  @import "../../../../static/css/scss/Personal/UserSecuritySettings/UserSecureEmail";
  .set-email {
    >.set-email-main {
      width: 1100px;
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
              color: #fff;
              &:focus {
                border: 1px solid #338FF5;
              }
            }
            .email-content-name {
              color: #fff;
            }
            .email-upload {
              background-color: #323E48;
              .icon-plus {
                color: #828EA6;
              }
            }
            .email-button {
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
      .set-email-main {
        background-color: #ccc;
        >.set-email-header {
          border-bottom: 1px solid #ccc;
          >.header-content-left {
            color: #555;
          }
        }
        >.set-email-content {
          >.email-content-title {
            background:rgba(62,121,214,1);
            color: #ccc;
          }
          >.email-content-from {
            .email-input {
              border: 1px solid #000;
              color: #000;
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
