<template>
  <div
    class="login-password personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <HeaderCommon />
    <div class="login-password-main margin25">
      <header class="login-password-header personal-height60 line-height60 line-height70 margin25">
        <span
          class="header-content-left header-content font-size16 font-weight600"
        >
          修改登录密码
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
      <div class="login-password-content">
        <header class="login-content-title">
          *请确认您的银行卡已开启短信通知功能
        </header>
        <div class="login-content-from">
          <el-form
            :label-position="labelPosition"
            label-width="120px"
          >
            <el-form-item label="原登录密码：">
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
            <el-form-item label="新登录密码：">
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
            <el-form-item label="确认登录密码：">
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
              @click="getStatusSubmit"
            >
              确认修改
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
import ErrorBox from '../../User/ErrorBox'
import {modifyLoginPassword} from '../../../utils/api/personal'
import {returnAjaxMessage} from '../../../utils/commonFunc'
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
    require('../../../../static/css/list/Personal/UserSecuritySettings/UserloginPassword.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/UserSecuritySettings/UserloginPasswordDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/UserSecuritySettings/UserloginPasswordNight.css')
    // 获取全局个人信息
    // this.globalUserInformation = this.userInfo.data.user
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
    // 检测输入格式
    checkoutInputFormat (type, targetNum) {
      switch (type) {
        // 原登录密码
        case 0:
          if (!targetNum) {
            this.setErrorMsg(0, '请输入原登录密码')
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(0, '')
            this.$forceUpdate()
            return 1
          }
        // 新登录密码
        case 1:
          if (!targetNum) {
            this.setErrorMsg(1, '请输入新登录密码')
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(1, '')
            this.$forceUpdate()
            return 1
          }
        // 确认密码
        case 2:
          if (!targetNum) {
            this.setErrorMsg(2, '请输入确认登录密码')
            this.$forceUpdate()
            return 0
          } else if (targetNum === this.newLoginPassword) {
            this.setErrorMsg(2, '')
            this.$forceUpdate()
            return 1
          } else {
            this.setErrorMsg(2, '密码不一致，请重新确认')
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
          this.successJump()
        }
      }
    },
    // 谷歌绑定成功自动跳转
    successJump () {
      setInterval(() => {
        if (this.successCountDown === 0) {
          this.$router.push({'path': '/login'})
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
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/UserSecuritySettings/UserloginPassword";
  .login-password {
    >.login-password-main {
      width: 1100px;
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
              color: #fff;
              &:focus {
                border: 1px solid #338FF5;
              }
            }
            .login-content-name {
              color: #fff;
            }
            .login-upload {
              background-color: #323E48;
              .icon-plus {
                color: #828EA6;
              }
            }
            .login-button {
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
      .login-password-main {
        background-color: #ccc;
        >.login-password-header {
          border-bottom: 1px solid #ccc;
          >.header-content-left {
            color: #555;
          }
        }
        >.login-password-content {
          >.login-content-title {
            background:rgba(62,121,214,1);
            color: #ccc;
          }
          >.login-content-from {
            .login-input {
              border: 1px solid #000;
              color: #000;
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
