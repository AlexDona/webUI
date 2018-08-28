<template>
  <div
    class="set-phone personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <HeaderCommon />
    <div class="set-phone-main margin25">
      <header class="set-phone-header personal-height60 line-height60 line-height70 margin25">
        <span
          v-if="!globalUserInformation.telePhoneBind"
          class="header-content-left header-content font-size16 font-weight600"
        >
          绑定手机
        </span>
        <span
          v-else
          class="header-content-left header-content font-size16 font-weight600"
        >
          修改手机
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
      <div class="set-phone-content">
        <header class="phone-content-title">
          *请确认您的银行卡已开启短信通知功能
        </header>
        <div class="phone-content-from">
          <!--绑定手机-->
          <el-form
            v-if="!globalUserInformation.telePhoneBind"
            :label-position="labelPosition"
            label-width="120px"
          >
            <el-form-item
              v-if="!globalUserInformation.telePhoneBind"
              label="手机号码："
            >
              <el-select v-model="amendDataPhone.areaCodeValue" placeholder="请选择">
                <el-option
                  v-for="item in amendDataPhone.areaCodeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <input
                type="text"
                class="phone-input phone-input-left border-radius2 padding-l15 box-sizing"
                @focus="emptyStatus"
                ref="amendDataPhone.newPhoneAccounts"
                @keyup="changeInputValue('defaultAreaCode')"
              >
            </el-form-item>
            <el-form-item
              label="图片验证码：">
              <!--图片验证码-->
              <input
                type="text"
                class="phone-input phone-image border-radius2 padding-l15 box-sizing"
                v-model="bindingDataPhone.userInputImageCode"
                placeholder="验证码"
              >
              <!--获取图片验证码-->
              <span
                @click="refreshCode"
                class="cursor-pointer display-inline-block phone-input-align"
              >
              <ImageValidate
                id="register"
                :content-width="75"
                :content-height="34"
                :identifyCode="bindingDataPhone.identifyCode"
                class="display-inline-block image-input"
              />
              </span>
            </el-form-item>
            <el-form-item
              label="短信验证码：">
              <el-input
                @focus="emptyStatus"
                ref="amendDataPhone.oldPhoneCode"
                @keyup="changeInputValue('oldPhoneCode')"
              >
                <template slot="append">验证码</template>
              </el-input>
            </el-form-item>
            <div class="prompt-message">
              <div v-show="errorMsg">{{ errorMsg }}</div>
            </div>
            <button
              class="phone-button border-radius4 cursor-pointer"
              @click="getStatusSubmit"
            >
              确认绑定
            </button>
          </el-form>
          <!--换绑手机-->
          <el-form
            v-else
            :label-position="labelPosition"
            label-width="120px"
          >
            <el-form-item label="姓      名：">
              <span class="bank-content-name">
                {{ globalUserInformation.realName }}
              </span>
            </el-form-item>
            <el-form-item label="短信验证码：">
              <el-input
                @focus="emptyStatus"
                ref="amendDataPhone.oldPhoneCode"
                @keyup="changeInputValue('oldPhoneCode')"
              >
                <template slot="append">验证码</template>
              </el-input>
            </el-form-item>
            <el-form-item label="新手机号码：">
              <el-select
                v-model="amendDataPhone.areaCodeValue"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in amendDataPhone.areaCodeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <input
                type="text"
                class="phone-input phone-input-left border-radius2 padding-l15 box-sizing"
                @focus="emptyStatus"
                ref="amendDataPhone.newPhoneAccounts"
                @keyup="changeInputValue('newPhoneAccounts')"
              >
            </el-form-item>
            <el-form-item label="短信验证码：">
              <el-input
                @focus="emptyStatus"
                ref="amendDataPhone.newPhoneCode"
                @keyup="changeInputValue('newPhoneCode')"
              >
                <template slot="append">验证码</template>
              </el-input>
            </el-form-item>
            <el-form-item label="交  易  密  码：">
              <input
                type="password"
                class="phone-input border-radius2 padding-l15 box-sizing"
                @focus="emptyStatus"
                ref="amendDataPhone.transactionPassword"
                @keyup="changeInputValue('transactionPassword')"
              />
            </el-form-item>
            <div class="prompt-message">
              <div v-show="errorMsg">{{ errorMsg }}</div>
            </div>
            <button
              class="phone-button border-radius4 cursor-pointer"
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
import ImageValidate from '../../Common/ImageValidateCommon' // 图片验证吗
const { mapMutations } = createNamespacedHelpers('personal')
export default {
  components: {
    HeaderCommon, // 头部
    IconFontCommon, // 字体图标
    ImageValidate, // 图片验证吗
    FooterCommon // 底部
  },
  data () {
    return {
      globalUserInformation: {}, // 个人信息
      errorMsg: '', // 错误信息提示
      bindingDataPhone: {
        userInputImageCode: '', // 用户输入的图片验证码
        identifyCode: '1235' // 图片验证码
      },
      amendDataPhone: {
        newPhoneAccounts: '', // 手机号
        oldPhoneCode: '', // 旧手机验证码
        defaultAreaCode: '',
        areaCode: '', // 区号
        newPhoneCode: '', // 新手机验证码
        transactionPassword: '', // 交易密码
        areaCodeValue: '+86',
        areaCodeList: [{
          value: '1',
          label: '+86'
        }, {
          value: '2',
          label: '+96'
        }, {
          value: '3',
          label: '+36'
        }, {
          value: '4',
          label: '+25'
        }, {
          value: '5',
          label: '+89'
        }]
      }
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/UserSecuritySettings/UserSecurePhone.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/UserSecuritySettings/UserSecurePhoneDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/UserSecuritySettings/UserSecurePhoneNight.css')
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
    // 4位随机数
    getRandomNum () {
      return parseInt(Math.random() * 10000) + ''
    },
    // 刷新验证码
    refreshCode () {
      this.identifyCode = this.getRandomNum()
    },
    // 确定绑定
    getStatusSubmit () {
      if (!this.newPhoneAccounts) {
        this.errorMsg = '邮箱账号不能为空'
      } else if (!this.phoneCode) {
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
  @import "../../../../static/css/scss/Personal/UserSecuritySettings/UserSecurePhone";
  .set-phone {
    >.set-phone-main {
      width: 1100px;
      margin: 60px auto 100px;
      >.set-phone-header {
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
      >.set-phone-content {
        min-height: 300px;
        margin: 16px 25px;
        >.phone-content-title {
          height: 32px;
          line-height: 32px;
          margin-bottom: 30px;
        }
        >.phone-content-from {
          width: 500px;
          margin-left: 55px;
          .phone-input {
            width: 220px;
            height: 34px;
          }
          .phone-image {
            width: 145px;
            border-right: 0 !important;
          }
          .phone-input-left {
            width: 158px;
            margin-top: 4px;
            margin-left: -3px;
            border-left: 0 !important;
          }
          .phone-upload {
            width: 118px;
            height: 106px;
            text-align: center;
            line-height: 100px;
          }
          .phone-button {
            padding: 10px 33px;
            margin: 30px 0 50px 25px;
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
      .set-phone-main {
        background-color: #1E2636;
        >.set-phone-header {
          border-bottom: 1px solid #39424D;
          >.header-content-left {
            color: #fff;
          }
          >.header-content-right {
            color: #A9BED4;
          }
        }
        >.set-phone-content {
          >.phone-content-title {
            background:rgba(62,121,214,0.08);
            color: #3E79D6;
          }
          >.phone-content-from {
            .bank-content-name {
              color: #fff;
            }
            .phone-input {
              border: 1px solid #485776;
              color: #fff;
              &:focus {
                border: 1px solid #338FF5;
              }
            }
            .phone-input-align {
              margin-left: -3px;
            }
            .image-input {
              height: 35px;
              vertical-align: middle;
            }
            .phone-content-name {
              color: #fff;
            }
            .phone-upload {
              background-color: #323E48;
              .icon-plus {
                color: #828EA6;
              }
            }
            .phone-button {
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
      .set-phone-main {
        background-color: #ccc;
        >.set-phone-header {
          border-bottom: 1px solid #ccc;
          >.header-content-left {
            color: #555;
          }
        }
        >.set-phone-content {
          >.phone-content-title {
            background:rgba(62,121,214,1);
            color: #ccc;
          }
          >.phone-content-from {
            .phone-input {
              border: 1px solid #000;
              color: #000;
              &:focus {
                border: 1px solid #338FF5;
              }
            }
            .phone-upload {
              background-color: #fff;
              .icon-plus {
                color: #555;
              }
            }
            .phone-button {
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
