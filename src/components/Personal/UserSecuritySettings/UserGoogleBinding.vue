<template>
  <div
    class="binding-google personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <HeaderCommon />
    <div class="binding-google-main margin25">
      <header class="binding-google-header personal-height60 line-height60 line-height70 margin25">
        <span
          class="header-content-left header-content font-size16 font-weight600"
        >
          绑定谷歌验证器
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
      <div class="binding-google-content">
        <div class="google-content-from min-height500">
          <div class="google-images-show display-flex">
            <div class="google-validator flex1">
              <div class="google-images">
                <img :src="googleImages">
              </div>
              <p class="google-info paddinglr15">
                若未安装谷歌验证器请
                <span class="google-info-download">扫码下载</span>
              </p>
            </div>
            <div class="google-validator validator-margin flex1">
              <div class="google-images">
                <VueQrcode
                  class="ercode"
                  :value="googleUserInformation.url"
                  :options="{ size: 100 }"
                >
                </VueQrcode>
              </div>
              <p class="google-info padding-l15">
                请扫码或手工输入密钥，将手机上生成的
                <span class="google-info-download">扫码下载</span>
                填到下边输入框。
              </p>
            </div>
          </div>
          <div class="google-info-show">
            <el-form
              :label-position="labelPosition"
              label-width="120px"
            >
              <el-form-item label="私      钥：">
                <span class="google-content-name">
                  {{ googleUserInformation.googleSecret }}
                </span>
              </el-form-item>
              <el-form-item label="谷歌账户：">
                 <span class="google-content-name">
                  {{ googleUserInformation.googleAccount }}
                </span>
              </el-form-item>
              <el-form-item label="谷歌验证码：">
                <input
                  type="text"
                  class="google-input border-radius2 padding-l15 box-sizing"
                  v-model="googleVerificationCode"
                  @keydown="setErrorMsg(0, '')"
                  @blur="checkoutInputFormat(0, googleVerificationCode)"
                />
                <ErrorBox
                  :text="errorShowStatusList"
                  :isShow="!!errorShowStatusList"
                />
              </el-form-item>
            </el-form>
            <button
              v-if="!securityCenter.isGoogleBind"
              class="google-button border-radius4 cursor-pointer"
              @click="getGoogleStatusSubmit"
            >
              确认绑定
            </button>
            <button
              v-else
              class="google-button border-radius4 cursor-pointer"
              @click="getGoogleStatusSubmitUnbind"
            >
              确认解绑
            </button>
          </div>
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
import {
  returnAjaxMessage,
  validateNumForUserInput // 用户输入验证
} from '../../../utils/commonFunc'
import {
  bindGoogleAddressPage,
  bindGoogleAddress,
  unbindCheckGoogle,
  statusSecurityCenter
} from '../../../utils/api/personal'
// 底部
import FooterCommon from '../../Common/FooterCommon'
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations } = createNamespacedHelpers('personal')
export default {
  components: {
    HeaderCommon, // 头部
    ErrorBox,
    // 二维码组件
    VueQrcode: resolve => {
      require([('@xkeshi/vue-qrcode')], resolve)
    },
    IconFontCommon, // 字体图标
    FooterCommon // 底部
  },
  data () {
    return {
      googleImages: require('../../../assets/user/goolevalidatepig.png'), // 谷歌验证码
      securityCenter: {}, // 个人信息
      errorMsg: '', // 错误信息提示
      googleAccount: '', // 谷歌账号
      googleTheSecretKey: '', // 谷歌秘钥
      googleTheSecretUrl: '', // 二维码
      googleVerificationCode: '', // 谷歌验证码
      googleUserInformation: {}, // 谷歌验证信息
      successCountDown: 1, // 成功倒计时
      errorShowStatusList: ''
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/UserSecuritySettings/UserGoogleBinding.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/UserSecuritySettings/UserGoogleBindingDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/UserSecuritySettings/UserGoogleBindingNight.css')
    // 获取全局个人信息
    this.getSecurityCenter()
    this.getGoogleVerificationCode()
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
    // 检测输入格式
    checkoutInputFormat (type, targetNum) {
      switch (validateNumForUserInput('google', targetNum)) {
        case 0:
          this.setErrorMsg(0, '')
          this.$forceUpdate()
          return 1
        case 1:
          this.setErrorMsg(0, '请输入谷歌验证码')
          this.$forceUpdate()
          return 0
      }
    },
    // 设置错误信息
    setErrorMsg (index, msg) {
      this.errorShowStatusList = msg
    },
    /**
    * 获取谷歌验证码
    * */
    async getGoogleVerificationCode () {
      let data
      let param = {}
      data = await bindGoogleAddressPage(param)
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        this.googleUserInformation = data.data.data
        this.googleAccount = data.data.data.googleAccount
        this.googleTheSecretKey = data.data.data.googleSecret
        this.googleTheSecretUrl = data.data.data.url
        console.log(this.googleTheSecretUrl)
      }
    },
    // 确定提交绑定谷歌验证
    getGoogleStatusSubmit () {
      if (!this.googleVerificationCode) {
        this.errorMsg = '请输入谷歌验证码'
      } else {
        this.errorMsg = ''
      }
      this.confirmBindingBailPhone()
    },
    // 确定绑定谷歌验证接口
    async confirmBindingBailPhone () {
      let data
      let param = {
        googleSecret: this.googleTheSecretKey,
        googleAccount: this.googleAccount, // 谷歌账户
        code: this.googleVerificationCode // 谷歌验证码
      }
      data = await bindGoogleAddress(param)
      if (!(returnAjaxMessage(data, this, 1))) {
        return false
      } else {
        this.successJump()
        console.log(data)
      }
    },
    // 确定解绑谷歌验证
    getGoogleStatusSubmitUnbind () {
      if (!this.googleVerificationCode) {
        this.errorMsg = '请输入谷歌验证码'
      } else {
        this.errorMsg = ''
      }
      this.confirmBindingUnbind()
    },
    async confirmBindingUnbind () {
      let data
      let param = {
        code: this.googleVerificationCode // 谷歌验证码
      }
      data = await unbindCheckGoogle(param)
      if (!(returnAjaxMessage(data, this, 1))) {
        return false
      } else {
        console.log(data)
        this.successJump()
      }
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
    },
    /**
     * 安全中心
     */
    async getSecurityCenter () {
      let data = await statusSecurityCenter({
        token: this.userInfo.token // token
      })
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回展示
        this.securityCenter = data.data.data
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      userInfo: state => state.user.loginStep1Info // 用户详细信息
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/UserSecuritySettings/UserGoogleBinding";
  .binding-google {
    >.binding-google-main {
      width: 1100px;
      margin: 60px auto 100px;
      >.binding-google-header {
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
      >.binding-google-content {
        min-height: 300px;
        margin: 16px 25px;
        >.google-content-from {
          width: 400px;
          margin-left: 30px;
          >.google-images-show {
            >.google-validator {
              height: 200px;
              >.google-images {
                width: 96px;
                height: 115px;
                margin: 0 auto;
              }
            }
            >.validator-margin {
              margin-left: 97px;
            }
          }
          >.google-info-show {
            .google-input {
              width: 220px;
              height: 34px;
            }
            .google-button {
              padding: 10px 33px;
              margin: 30px 0 50px 25px;
            }
            .prompt-message {
              height: 20px;
              padding-left: 25px;
            }
          }
        }
      }
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      .binding-google-main {
        background-color: #1E2636;
        >.binding-google-header {
          border-bottom: 1px solid #39424D;
          >.header-content-left {
            color: #fff;
          }
          >.header-content-right {
            color: #A9BED4;
          }
        }
        >.binding-google-content {
          >.google-content-from {
            >.google-images-show {
              .google-info {
                color: #9DA5B3;
                .google-info-download {
                  color: #338FF5;
                }
              }
            }
            >.google-info-show {
              color: #fff;
              .google-content-name {
                color: #fff;
              }
              .google-input {
                border: 1px solid #485776;
                color: #fff;
                &:focus {
                  border: 1px solid #338FF5;
                }
              }
              .google-button {
                background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
                color: #fff;
              }
              .prompt-message {
                color: red;
              }
            }
          }
        }
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      .binding-google-main {
        background-color: #ccc;
        >.binding-google-header {
          border-bottom: 1px solid #ccc;
          >.header-content-left {
            color: #555;
          }
        }
        >.binding-google-content {
          >.google-content-from {
            >.google-images-show {}
            >.google-info-show {}
          }
        }
      }
    }
  }
</style>
