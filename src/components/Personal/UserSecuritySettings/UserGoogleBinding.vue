<template>
  <div
    class="binding-google personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-background="rgba(0, 0, 0, 0.6)"
    :style="{
      height: windowHeight+'px'
    }"
  >
    <div class="binding-google-main margin25">
      <header class="binding-google-header personal-height60 line-height60 line-height70 margin25">
        <span
          v-if="!securityCenter.isGoogleBind"
          class="header-content-left header-content font-size16 font-weight600"
        >
          <!--绑定谷歌验证-->
          {{ $t('M.user_security_binding') }}{{ $t('M.user_security_google') }}{{ $t('M.user_security_verify') }}
        </span>
        <span
          v-else
          class="header-content-left header-content font-size16 font-weight600"
        >
          <!--解绑谷歌验证-->
          {{ $t('M.user_security_unbundle') }}{{ $t('M.user_security_google') }}{{ $t('M.user_security_verify') }}
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
      <div class="binding-google-content">
        <div class="google-content-from min-height500">
          <div class="google-images-show display-flex">
            <!-- 谷歌验证码 原来的 -->
            <!-- <div class="google-validator flex1">
              <div class="google-images img-background">
                <div class="img-box">
                  <img :src="googleImages">
                </div>
              </div>
              <p class="google-info paddinglr15 margin-top16 font-size12">
                {{ $t('M.user_google_text1') }}
                <span class="google-info-download">
                  {{ $t('M.user_google_text2') }}
                </span>
              </p>
            </div> -->
            <!-- 左边 -->
            <div class="google-validator flex1">
              <div class="google-images img-background">
                <div class="img-box">
                  <img :src="googleImagesIOS">
                </div>
                <div class="text-align-c color-black margin-top2">IOS</div>
              </div>
              <p class="google-info paddinglr13 margin-top16 font-size12">
                <!--若未安装谷歌验证器请-->
                {{ $t('M.user_google_text1') }}
                <span class="google-info-download">
                  <!--扫码下载-->
                  {{ $t('M.user_google_text2') }}
                </span>
              </p>
            </div>
            <!-- 中间 -->
            <div class="google-validator flex1" style="margin-left:20px;">
              <div class="google-images img-background">
                <div class="img-box">
                  <img :src="googleImagesAndroid">
                </div>
                <div class="text-align-c color-black margin-top2">Android</div>
              </div>
              <p class="google-info paddinglr13 margin-top16 font-size12">
                <!--若未安装谷歌验证器请-->
                {{ $t('M.user_google_text1') }}
                <span class="google-info-download">
                  <!--扫码下载-->
                  {{ $t('M.user_google_text2') }}
                </span>
              </p>
            </div>
            <!-- 右边 -->
            <div class="google-validator validator-margin flex1">
              <div class="google-images google-images1 img-background1">
                <VueQrcode
                  class="ercode"
                  :value="googleTheSecretUrl"
                  :options="{ size: 97 }"
                >
                </VueQrcode>
              </div>
              <p class="google-info padding-l15 margin-top16 font-size12">
                <!--请扫码或手工输入密钥，将手机上生成的-->
                {{ $t('M.user_google_text3') }}
                <span class="google-info-download">
                  <!--扫码下载-->
                  {{ $t('M.user_google_text2') }}
                </span>
                <!--填到下边输入框。-->
                {{ $t('M.user_google_text4') }}
              </p>
            </div>
          </div>
          <div class="google-info-show">
            <el-form
              :label-position="labelPosition"
              label-width="120px"
            >
              <!--私钥-->
              <el-form-item
                :label="$t('M.user_google_private_key') + '：'"
              >
                <span
                  id="text"
                  class="google-content-name"
                >
                  {{ googleUserInformation.googleSecret }}
                </span>
                <span
                  class="code-copy border-radius5 cursor-pointer font-size12"
                  v-clipboard:copy="googleUserInformation.googleSecret"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                >
                  <IconFontCommon
                    class="font-size12"
                    iconName="icon-fuzhi"
                  />
                  <!--复制-->
                  {{ $t('M.comm_copy') }}
                </span>
              </el-form-item>
              <!--谷歌账户-->
              <el-form-item
                :label="$t('M.user_security_google') + $t('M.user_google_account') + '：'"
                style="display: none"
              >
                 <span class="google-content-name">
                  {{ googleUserInformation.googleAccount }}
                 </span>
              </el-form-item>
              <!--谷歌验证码-->
              <el-form-item
                :label="$t('M.user_security_google') + $t('M.user_security_verify') + '：'"
              >
                <input
                  type="number"
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
              @click.prevent="getGoogleStatusSubmit"
            >
              <!--确认绑定-->
              {{ $t('M.comm_affirm') }}{{ $t('M.user_security_binding') }}
            </button>
            <button
              v-else
              class="google-button border-radius4 cursor-pointer"
              @click.prevent="getGoogleStatusSubmitUnbind"
            >
              <!--确认解绑-->
              {{ $t('M.comm_affirm') }}{{ $t('M.user_security_unbundle') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import IconFontCommon from '../../Common/IconFontCommon'
import ErrorBox from '../../User/ErrorBox'
import {
  returnAjaxMessage,
  validateNumForUserInput, // 用户输入验证
  getSecurityCenter
} from '../../../utils/commonFunc'
import {
  bindGoogleAddressPage,
  bindGoogleAddress,
  unbindCheckGoogle
} from '../../../utils/api/personal'
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations } = createNamespacedHelpers('personal')
export default {
  components: {
    ErrorBox,
    // 二维码组件
    VueQrcode: resolve => {
      require([('@xkeshi/vue-qrcode')], resolve)
    },
    IconFontCommon // 字体图标
  },
  data () {
    return {
      // googleImages: require('../../../assets/user/goolevalidatepig.png'), // 谷歌验证码
      googleImagesAndroid: require('../../../assets/user/goole_Android.png'), // 谷歌验证码-安卓
      googleImagesIOS: require('../../../assets/user/goole_IOS.png'), // 谷歌验证码-IOS
      securityCenter: {}, // 个人信息
      errorMsg: '', // 错误信息提示
      googleAccount: '', // 谷歌账号
      googleTheSecretKey: '', // 谷歌秘钥
      googleTheSecretUrl: '', // 二维码
      googleVerificationCode: '', // 谷歌验证码
      googleUserInformation: {}, // 谷歌验证信息
      successCountDown: 1, // 成功倒计时
      fullscreenLoading: false, // 整页loading
      errorShowStatusList: '' // 设置错误信息
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
          // 请输入谷歌验证
          this.setErrorMsg(0, this.$t('M.comm_please_enter') + this.$t('M.user_security_google') + this.$t('M.user_security_verify'))
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
      // 整页loading
      this.fullscreenLoading = true
      data = await bindGoogleAddressPage(param)
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        // 接口失败清除loading
        this.fullscreenLoading = false
        return false
      } else {
        // 接口成功清除loading
        this.fullscreenLoading = false
        this.googleUserInformation = data.data.data
        this.googleAccount = data.data.data.googleAccount
        this.googleTheSecretKey = data.data.data.googleSecret
        // URI 进行编码
        this.googleTheSecretUrl = encodeURI(data.data.data.url)
        console.log(this.googleTheSecretUrl)
      }
    },
    // 确定提交绑定谷歌验证
    getGoogleStatusSubmit () {
      let goOnStatus = 0
      if (
        this.checkoutInputFormat(0, this.googleVerificationCode)
      ) {
        goOnStatus = 1
      } else {
        goOnStatus = 0
      }
      if (goOnStatus) {
        this.confirmBindingBailPhone()
      }
    },
    // 确定绑定谷歌验证接口
    async confirmBindingBailPhone () {
      if (this.googleVerificationCode.length > 6) {
        this.$message({
          message: this.$t('M.user_security_google') + this.$t('M.comm_code') + this.$t('M.user_security_google1'),
          type: 'error'
        })
      }
      let data
      let param = {
        googleSecret: this.googleTheSecretKey, // 谷歌秘钥
        googleAccount: this.googleAccount, // 谷歌账户
        code: this.googleVerificationCode // 谷歌验证码
      }
      // 整页loading
      this.fullscreenLoading = true
      data = await bindGoogleAddress(param)
      if (!(returnAjaxMessage(data, this, 1))) {
        // 接口失败清除loading
        this.fullscreenLoading = false
        return false
      } else {
        // 接口成功清除loading
        this.fullscreenLoading = false
        this.successJump()
        console.log(data)
      }
    },
    // 确定解绑谷歌验证
    getGoogleStatusSubmitUnbind () {
      if (this.googleVerificationCode.length > 6) {
        this.$message({
          message: this.$t('M.user_security_google') + this.$t('M.comm_code') + this.$t('M.user_security_google1'),
          type: 'error'
        })
      }
      let goOnStatus = 0
      if (
        this.checkoutInputFormat(0, this.googleVerificationCode)
      ) {
        goOnStatus = 1
      } else {
        goOnStatus = 0
      }
      if (goOnStatus) {
        this.confirmBindingUnbind()
      }
    },
    async confirmBindingUnbind () {
      let data
      let param = {
        code: this.googleVerificationCode // 谷歌验证码
      }
      // 整页loading
      this.fullscreenLoading = true
      data = await unbindCheckGoogle(param)
      if (!(returnAjaxMessage(data, this, 1))) {
        // 接口失败清除loading
        this.fullscreenLoading = false
        return false
      } else {
        // 接口成功清除loading
        this.fullscreenLoading = false
        console.log(data)
        this.successJump()
        this.googleVerificationCode = ''
      }
    },
    // 谷歌绑定成功自动跳转
    successJump () {
      setInterval(() => {
        if (this.successCountDown === 0) {
          this.returnSuperior()
        }
        this.successCountDown--
      }, 1000)
    },
    /**
     * 安全中心
     */
    getSecurityCenter () {
      // 整页loading
      // this.fullscreenLoading = true
      getSecurityCenter(this, {}, data => {
        if (data) {
          // 接口成功清除loading
          this.fullscreenLoading = false
          this.securityCenter = data.data.data
        }
      })
    },
    //  点击复制
    onCopy (e) {
      // 已拷贝
      let msg = this.$t('M.comm_have_been_copied')
      this.$message({
        type: 'success',
        message: msg
      })
    },
    onError (e) {
      // 拷贝失败，请稍后重试
      let msg = this.$t('M.comm_copies_failure')
      this.$message({
        type: 'success',
        message: msg
      })
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      userInfo: state => state.user.loginStep1Info // 用户详细信息
    }),
    windowHeight () {
      return window.innerHeight
    }
  },
  watch: {
    googleTheSecretUrl (newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal";
  .binding-google {
    margin-top:66px;
    overflow: hidden;
    >.binding-google-main {
      width: 1100px;
      min-height: 700px;
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
        margin: 40px 25px;
        >.google-content-from {
          width: 500px;
          margin-left: 30px;
          >.google-images-show {
            >.google-validator {
              height: 250px;
              >.google-images1 {
                padding: 20px 9px !important;
              }
              >.google-images {
                width: 115px;
                height: 140px;
                margin: 0 auto;
                padding: 20px 7px;
                .img-box {
                  padding: 10px;
                  width: 100px;
                  height: 100px;
                }
              }
            }
            >.validator-margin {
              // margin-left: 97px;
              margin-left: 50px;
            }
          }
          >.google-info-show {
            margin-top: 20px;
            .code-copy {
              text-align: center;
              display: inline-block;
              width: 54px;
              height: 26px;
              line-height: 26px;
              margin-left: 15px;
              position: relative;
              .ercode {
                position: absolute;
                bottom: 35px;
                right: 180px;
                border-radius: 5px;
              }
            }
            .google-input {
              width: 220px;
              height: 34px;
            }
            .google-button {
              margin: 30px 0 50px 160px;
              padding: 10px 0;
              width: 220px;
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
        background-color: $nightMainBgColor;
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
              .img-background {
                background-color: #338FF5;
              }
              .img-background1 {
                background-color: #2B3C71;
              }
              .img-box {
                background-color: #fff;
              }
              .google-info {
                color: #9DA5B3;
                .google-info-download {
                  color: #338FF5;
                }
              }
            }
            >.google-info-show {
              .code-copy {
                color: rgba(255,255,255,0.7);
                background-color: #338FF5;
              }
              color: rgba(255,255,255,0.7);
              .google-content-name {
                color: rgba(255,255,255,0.7);
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
                color: rgba(255,255,255,0.7);
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
        background:rgba(255,255,255,1);
        border:1px solid rgba(246,246,246,1);
        border-radius:4px;
        box-shadow:0px 0px 4px rgba(235,240,248,1);
        >.binding-google-header {
          border-bottom: 1px solid rgba(57,66,77,0.1);
          >.header-content-left {
            color: #333;
          }
          >.header-content-right {
            color: #7D90AC;
          }
        }
        >.binding-google-content {
          >.google-content-from {
            >.google-images-show {
              .img-background {
                background-color: #338FF5;
              }
              .img-background1 {
                background-color: #2B3C71;
              }
              .img-box {
                background-color: #fff;
              }
              .google-info {
                color: #7D90AC;
                .google-info-download {
                  color: #338FF5;
                }
              }
            }
            >.google-info-show {
              .code-copy {
                color: rgba(255,255,255,0.7);
                background-color: #338FF5;
              }
              color: rgba(255,255,255,0.7);
              .google-content-name {
                color: #333;
              }
              .google-input {
                border:1px solid rgba(236,241,248,1);
                color: #333;
                &:focus {
                  border: 1px solid #338FF5;
                }
              }
              .google-button {
                background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
                color: rgba(255,255,255,0.7);
              }
              .prompt-message {
                color: red;
              }
            }
          }
        }
      }
    }
  }
</style>
