<template>
  <div
    class="transaction-password personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <HeaderCommon />
    <div class="transaction-password-main margin25">
      <header class="transaction-password-header personal-height60 line-height60 line-height70 margin25">
        <span
          v-if="!globalUserInformation.tradePasswordType"
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
          <el-form
            v-if="!globalUserInformation.tradePasswordType"
            :label-position="labelPosition"
            label-width="120px"
          >
            <el-form-item label="交易密码：">
              <input
                class="transaction-input border-radius2 padding-l15 box-sizing"
                @focus="emptyStatus"
                ref="transactionPassword"
                @keyup="changeInputValue('transactionPassword')"
              />
            </el-form-item>
            <el-form-item label="重置交易密码：">
              <input
                class="transaction-input border-radius2 padding-l15 box-sizing"
                @focus="emptyStatus"
                ref="resetTransactionPassword"
                @keyup="changeInputValue('resetTransactionPassword')"
              />
            </el-form-item>
            <el-form-item label="验  证  码：">
              <el-input
                @focus="emptyStatus"
                ref="transactionPasswordCode"
                @keyup="changeInputValue('transactionPasswordCode')"
              >
                <template slot="append">验证码</template>
              </el-input>
            </el-form-item>
            <div class="prompt-message">
              <div v-show="errorMsg">{{ errorMsg }}</div>
            </div>
            <button
              class="transaction-button border-radius4 cursor-pointer"
              @click="getStatusSubmit"
            >
              确认绑定
            </button>
          </el-form>
          <el-form
            v-else
            :label-position="labelPosition"
            label-width="120px"
          >
            <el-form-item label="新交易密码：">
              <input
                class="transaction-input border-radius2 padding-l15 box-sizing"
                @focus="emptyStatus"
                ref="transactionPassword"
                @keyup="changeInputValue('transactionPassword')"
              />
            </el-form-item>
            <el-form-item label="确认交易密码：">
              <input
                class="transaction-input border-radius2 padding-l15 box-sizing"
                @focus="emptyStatus"
                ref="resetTransactionPassword"
                @keyup="changeInputValue('resetTransactionPassword')"
              />
            </el-form-item>
            <el-form-item label="验  证  码：">
              <el-input
                @focus="emptyStatus"
                ref="transactionPasswordCode"
                @keyup="changeInputValue('transactionPasswordCode')"
              >
                <template slot="append">验证码</template>
              </el-input>
            </el-form-item>
            <div class="prompt-message">
              <div v-show="errorMsg">{{ errorMsg }}</div>
            </div>
            <button
              class="transaction-button border-radius4 cursor-pointer"
              @click="getStatusSubmit"
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
      transactionPassword: '', // 交易密码
      resetTransactionPassword: '', // 重置交易密码.
      transactionPasswordCode: '' // 验证码
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/UserSecuritySettings/UserTransactionPassword.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/UserSecuritySettings/UserTransactionPasswordDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/UserSecuritySettings/UserTransactionPasswordNight.css')
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
