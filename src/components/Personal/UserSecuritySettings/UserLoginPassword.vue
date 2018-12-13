<template>
  <div
    class="login-password-box personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
    :style="{'height':windowHeight+'px'}"
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-background="rgba(0, 0, 0, 0.6)"
  >
    <div class="login-password-main margin25">
      <header class="login-password-header personal-height60 line-height60 line-height70 margin25">
        <span
          class="header-content-left header-content font-size16 font-weight600"
        >
          <!--修改登录密码-->
          {{ $t('M.user_modification_login_pwd') }}
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
            <!--原登录密码-->
            <el-form-item
              :label="$t('M.user_security_login_raw') + $t('M.user_security_password') + '：'"
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
            <!--新登录密码-->
            <el-form-item
              :label="$t('M.user_security_login_new') + $t('M.user_security_password') + '：'"
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
            <!--确认登录密码-->
            <el-form-item
              :label="$t('M.comm_affirm') + $t('M.user_security_password') + '：'"
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
              {{ $t('M.user_modification_confirm_amend') }}
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
import ErrorBox from '../../User/ErrorBox'
import {modifyLoginPassword} from '../../../utils/api/personal'
import {
  returnAjaxMsg,
  validateNumForUserInput
} from '../../../utils/commonFunc'
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations } = createNamespacedHelpers('personal')
export default {
  components: {
    IconFontCommon, // 字体图标
    ErrorBox
  },
  data () {
    return {
      originalLoginPassword: '', // 原登录密码
      newLoginPassword: '', // 新登录密码
      confirmLoginPassword: '', // 确认登录密码
      successCountDown: 1, // 成功倒计时
      errorShowStatusList: [
        '', // 原登录密码
        '', // 新登录密码
        '' // 确认登录密码
      ],
      fullscreenLoading: false // 整页loading
    }
  },
  created () {
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
        // 请输入原登录密码
        case 0:
          if (!targetNum) {
            this.setErrorMsg(0, this.$t('M.user_modification_original_pwd'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(0, '')
            this.$forceUpdate()
            return 1
          }
        // 请输入密码
        case 1:
          switch (validateNumForUserInput('password', targetNum)) {
            case 0:
              this.setErrorMsg(1, '')
              this.$forceUpdate()
              return 1
            case 1:
              this.setErrorMsg(1, this.$t('M.user_modification_input_pwd'))
              this.$forceUpdate()
              return 0
            case 2:
              this.setErrorMsg(1, this.$t('M.user_security_info1'))
              this.$forceUpdate()
              return 0
          }
          break
        // 请输入确认登陆密码
        case 2:
          if (!targetNum) {
            this.setErrorMsg(2, this.$t('M.user_modification_input_confirm_pwd'))
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
        // 整页loading
        this.fullscreenLoading = true
        data = await modifyLoginPassword(param)
        if (!(returnAjaxMsg(data, this, 1))) {
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
      this.originalLoginPassword = ''
      this.newLoginPassword = ''
    },
    // 谷歌绑定成功自动跳转
    successJump () {
      setInterval(() => {
        if (this.successCountDown === 0) {
          this.$store.commit('user/USER_LOGOUT')
          this.$router.push({path: '/home'})
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
    width: 100%;
    margin-top: 66px;
    overflow: hidden;

    > .login-password-main {
      width: 1100px;
      min-height: 700px;
      margin: 60px auto 100px;

      > .login-password-header {
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

      > .login-password-content {
        min-height: 300px;
        margin: 16px 25px;

        > .login-content-title {
          height: 32px;
          margin-bottom: 30px;
          line-height: 32px;
        }

        > .login-content-from {
          width: 600px;

          .login-input {
            width: 220px;
            height: 34px;
          }

          .login-upload {
            width: 118px;
            height: 106px;
            line-height: 100px;
            text-align: center;
          }

          .login-button {
            width: 220px;
            padding: 10px 0;
            margin: 30px 0 50px 170px;
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
      .el-input__inner {
        height: 36px;
        border-radius: 2px 0 0 2px;
      }

      .el-input-group {
        width: 220px;
        height: 36px;
        border-radius: 4px;
      }

      .el-form-item__content {
        width: 600px;
      }

      /* 修改登录密码表单样式重置 */
      .login-password-content {
        .login-content-from {
          .el-form {
            .el-form-item {
              .el-form-item__label {
                width: 170px !important;
              }
            }
          }
        }
      }
    }

    &.night {
      color: $nightFontColor;
      background-color: $nightBgColor;

      .login-password-main {
        background-color: $nightMainBgColor;

        > .login-password-header {
          border-bottom: 1px solid #39424d;

          > .header-content-left {
            color: #fff;
          }

          > .header-content-right {
            color: #a9bed4;
          }
        }

        > .login-password-content {
          > .login-content-title {
            color: #3e79d6;
            background: rgba(62, 121, 214, .08);
          }

          > .login-content-from {
            .login-input {
              border: 1px solid #485776;
              color: rgba(255, 255, 255, .7);

              &:focus {
                border: 1px solid #338ff5;
              }
            }

            .login-content-name {
              color: rgba(255, 255, 255, .7);
            }

            .login-upload {
              background-color: #323e48;

              .icon-plus {
                color: #828ea6;
              }
            }

            .login-button {
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
          background-color: #1e2636;
        }

        .el-input-group--append {
          .el-input__inner:focus {
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
      color: $dayFontColor;
      background-color: $dayBgColor;

      .login-password-main {
        border: 1px solid rgba(246, 246, 246, 1);
        border-radius: 4px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 0 4px rgba(235, 240, 248, 1);

        > .login-password-header {
          border-bottom: 1px solid rgba(57, 66, 77, .1);

          > .header-content-left {
            color: #333;
          }

          > .header-content-right {
            color: #7d90ac;
          }
        }

        > .login-password-content {
          > .login-content-title {
            color: #333;
            background: rgba(51, 143, 245, .1);
          }

          > .login-content-from {
            .login-input {
              border: 1px solid rgba(236, 241, 248, 1);
              color: #333;

              &:focus {
                border: 1px solid #338ff5;
              }
            }

            .login-upload {
              background-color: #fff;

              .icon-plus {
                color: #555;
              }
            }

            .login-button {
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
