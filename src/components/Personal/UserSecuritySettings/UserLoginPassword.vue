<template>
  <div
    class="login-password-box personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
    :style="{'height':windowHeight+'px'}"
  >
    <HeaderCommon/>
    <div class="login-password-main margin25">
      <header class="login-password-header personal-height60 line-height60 line-height70 margin25">
        <span
          class="header-content-left header-content font-size16 font-weight600"
        >
          修改登录密码
          {{ $t('M.comm_modification') }}{{ $t('M.user_security_login') }}{{ $t('M.user_security_password') }}
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
      <div class="login-password-content">
        <header class="login-content-title">
          <!--*请确认您的银行卡已开启短信通知功能-->
          * {{ $t('M.user_security_text0') }}
        </header>
        <div class="login-content-from">
          <el-form
            :label-position="labelPosition"
            label-width="120px"
          >
            <!--原登录密码 新登录密码 确认登录密码-->
            <el-form-item
              :label="$t('M.user_security_login_raw') + $t('M.user_security_login') + $t('M.user_security_password') + '：'"
            >
              <input
                type="password"
                class="login-input border-radius2 padding-l15 box-sizing"
                v-model="originalLoginPassword"
                @keydown="setErrorMsg(0,'')"
                @blur="checkoutInputFormat(0, originalLoginPassword)"
              />
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[0]"
                :isShow="!!errorShowStatusList[0]"
              />
            </el-form-item>
            <el-form-item
              :label="$t('M.user_security_login_new') + $t('M.user_security_login') + $t('M.user_security_password') + '：'"
            >
              <input
                type="password"
                class="login-input border-radius2 padding-l15 box-sizing"
                v-model="newLoginPassword"
                @keydown="setErrorMsg(1,'')"
                @blur="checkoutInputFormat(1, newLoginPassword)"
              />
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[1]"
                :isShow="!!errorShowStatusList[1]"
              />
            </el-form-item>
            <el-form-item
              :label="$t('M.comm_affirm') + $t('M.user_security_login') + $t('M.user_security_password') + '：'"
            >
              <input
                type="password"
                class="login-input border-radius2 padding-l15 box-sizing"
                v-model="confirmLoginPassword"
                @keydown="setErrorMsg(2,'')"
                @blur="checkoutInputFormat(2, confirmLoginPassword)"
              />
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[2]"
                :isShow="!!errorShowStatusList[2]"
              />
            </el-form-item>
            <button
              class="login-button border-radius4 cursor-pointer"
              @click.prevent="getStatusSubmit"
            >
              <!--确认修改-->
              {{ $t('M.comm_affirm') }}{{ $t('M.comm_modification') }}
            </button>
          </el-form>
        </div>
      </div>
    </div>
    <keep-aline><FooterCommon/></keep-aline>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
// 头部
import HeaderCommon from '../../Common/HeaderCommonForPC'
import IconFontCommon from '../../Common/IconFontCommon'
import ErrorBox from '../../User/ErrorBox'
import {modifyLoginPassword} from '../../../utils/api/personal'
import {
  returnAjaxMessage,
  validateNumForUserInput
} from '../../../utils/commonFunc'
// 底部
import FooterCommon from '../../Common/FooterCommon'
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations } = createNamespacedHelpers('personal')
export default {
  components: {
    HeaderCommon, // 头部
    IconFontCommon, // 字体图标
    ErrorBox,
    FooterCommon // 底部
  },
  data () {
    return {
      globalUserInformation: {}, // 个人信息
      originalLoginPassword: '', // 原登录密码
      newLoginPassword: '', // 新登录密码
      confirmLoginPassword: '', // 确认登录密码
      successCountDown: 1, // 成功倒计时
      errorShowStatusList: [
        '', // 原登录密码
        '', // 新登录密码
        '' // 确认登录密码
      ],
      securityCenter: {}
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/UserSecuritySettings/UserLoginPassword.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/UserSecuritySettings/UserLoginPasswordDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/UserSecuritySettings/UserLoginPasswordNight.css')
    // 获取全局个人信息
    // this.globalUserInformation = this.userInfo.data.user
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
      this.$router.push({path: '/PersonalCenter'})
      this.CHANGE_USER_CENTER_ACTIVE_NAME('security-center')
      // this.CHANGE_USER_CENTER_ACTIVE_NAME('security-center')
      // this.$router.go(-1)
    },
    // 检测输入格式
    checkoutInputFormat (type, targetNum) {
      switch (type) {
        // 原登录密码
        case 0:
          if (!targetNum) {
            this.setErrorMsg(0, this.$t('M.comm_please_enter') + this.$t('M.user_security_login_raw') + this.$t('M.user_security_login') + this.$t('M.user_security_password'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(0, '')
            this.$forceUpdate()
            return 1
          }
        // 新登录密码
        case 1:
          switch (validateNumForUserInput('password', targetNum)) {
            case 0:
              this.setErrorMsg(1, '')
              this.$forceUpdate()
              return 1
            case 1:
              this.setErrorMsg(1, this.$t('M.comm_please_enter') + this.$t('M.user_security_password'))
              this.$forceUpdate()
              return 0
            case 2:
              this.setErrorMsg(1, this.$t('M.user_security_info1'))
              this.$forceUpdate()
              return 0
          }
          break
        // 确认登录密码
        case 2:
          if (!targetNum) {
            this.setErrorMsg(2, this.$t('M.comm_please_enter') + this.$t('M.comm_affirm') + this.$t('M.user_security_login') + this.$t('M.user_security_password'))
            this.$forceUpdate()
            return 0
          } else if (targetNum === this.newLoginPassword) {
            this.setErrorMsg(2, '')
            this.$forceUpdate()
            return 1
          } else {
            this.setErrorMsg(2, this.$t('M.user_security_info2'))
            this.$forceUpdate()
            return 0
          }
      }
    },
    // 设置错误信息
    setErrorMsg (index, msg) {
      this.errorShowStatusList[index] = msg
    },
    // 确定修改登录密码
    getStatusSubmit () {
      this.confirmModifyLoginPassword()
    },
    // 确定修改方法
    async confirmModifyLoginPassword () {
      let goOnStatus = 0
      if (
        this.checkoutInputFormat(0, this.originalLoginPassword) &&
        this.checkoutInputFormat(1, this.newLoginPassword) &&
        this.checkoutInputFormat(2, this.confirmLoginPassword)
      ) {
        goOnStatus = 1
      } else {
        goOnStatus = 0
      }
      console.log(goOnStatus)
      if (goOnStatus) {
        let data
        let param = {
          oldPassword: this.originalLoginPassword, // 旧登录密码
          newPassword: this.newLoginPassword // 新登录密码
        }
        data = await modifyLoginPassword(param)
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
      this.originalLoginPassword = ''
      this.newLoginPassword = ''
    },
    // 谷歌绑定成功自动跳转
    successJump () {
      setInterval(() => {
        if (this.successCountDown === 0) {
          this.$store.commit('user/USER_LOGOUT')
          this.$router.push({path: '/'})
        }
        this.successCountDown--
      }, 1000)
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      userInfo: state => state.personal.userInfo
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
  .login-password-box {
    width:100%;
    /*height:100%;*/
    >.login-password-main {
      width: 1100px;
      height:100%;
      /*min-height: 700px;*/
      margin: 60px auto 100px;
      >.login-password-header {
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
      >.login-password-content {
        min-height: 300px;
        margin: 16px 25px;
        >.login-content-title {
          height: 32px;
          line-height: 32px;
          margin-bottom: 30px;
        }
        >.login-content-from {
          width: 500px;
          margin-left: 55px;
          .login-input {
            width: 220px;
            height: 34px;
          }
          .login-upload {
            width: 118px;
            height: 106px;
            text-align: center;
            line-height: 100px;
          }
          .login-button {
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
      .login-password-main {
        background-color: #1E2636;
        >.login-password-header {
          border-bottom: 1px solid #39424D;
          >.header-content-left {
            color: #fff;
          }
          >.header-content-right {
            color: #A9BED4;
          }
        }
        >.login-password-content {
          >.login-content-title {
            background:rgba(62,121,214,0.08);
            color: #3E79D6;
          }
          >.login-content-from {
            .login-input {
              border: 1px solid #485776;
              color: rgba(255,255,255,0.7);
              &:focus {
                border: 1px solid #338FF5;
              }
            }
            .login-content-name {
              color: rgba(255,255,255,0.7);
            }
            .login-upload {
              background-color: #323E48;
              .icon-plus {
                color: #828EA6;
              }
            }
            .login-button {
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
      .login-password-main {
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
        >.login-password-content {
          >.login-content-title {
            background:rgba(51,143,245,0.1);
            color: #333;
          }
          >.login-content-from {
            .login-input {
              border:1px solid rgba(236,241,248,1);
              color: #333;
              &:focus {
                border: 1px solid #338FF5;
              }
            }
            .login-upload {
              background-color: #fff;
              .icon-plus {
                color: #555;
              }
            }
            .login-button {
              background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
              color: #ccc;
            }
          }
        }
      }
    }
  }
</style>
