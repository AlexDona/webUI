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
                class="login-input border-radius2 padding-l15 box-sizing"
                @focus="emptyStatus"
                ref="originalLoginPassword"
                @keyup="changeInputValue('originalLoginPassword')"
              />
            </el-form-item>
            <el-form-item label="新登录密码：">
              <input
                class="login-input border-radius2 padding-l15 box-sizing"
                @focus="emptyStatus"
                ref="newLoginPassword"
                @keyup="changeInputValue('newLoginPassword')"
              />
            </el-form-item>
            <el-form-item label="确认登录密码：">
              <input
                class="login-input border-radius2 padding-l15 box-sizing"
                @focus="emptyStatus"
                ref="confirmLoginPassword"
                @keyup="changeInputValue('confirmLoginPassword')"
              />
            </el-form-item>
            <div class="prompt-message">
              <div v-show="errorMsg">{{ errorMsg }}</div>
            </div>
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
// import {statusSecurityCenter} from '../../../utils/api/apiDoc'
// import {returnAjaxMessage} from '../../../utils/commonFunc'
// 底部
import FooterCommon from '../../Common/FooterCommon'
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations } = createNamespacedHelpers('personal')
export default {
  components: {
    HeaderCommon, // 头部
    IconFontCommon, // 字体图标
    FooterCommon // 底部
  },
  data () {
    return {
      globalUserInformation: {}, // 个人信息
      errorMsg: '', // 错误信息提示
      originalLoginPassword: '', // 原登录密码
      newLoginPassword: '', // 新登录密码
      confirmLoginPassword: '' // 确认登录密码
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
    this.globalUserInformation = this.userInfo.data.user
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
    getStatusSubmit () {
      if (!this.emailAccounts) {
        this.errorMsg = '邮箱账号不能为空'
      } else if (!this.emailCode) {
        this.errorMsg = '验证码不能为空'
      } else {
        this.errorMsg = ''
      }
      console.log(1)
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
