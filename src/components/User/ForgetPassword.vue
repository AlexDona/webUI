<template>
  <div
    class="froget-password-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
    :style="{'height':windowHeight+'px'}"
  >
    <HeaderCommon/>
    <div class="inner-box">
      <div class="title">
        <!-- 找回密码 -->
        {{$t('M.forgetPassword_findBack')}}{{$t('M.comm_loginpassword')}}
      </div>
      <!--步骤条-->
      <div class="step-box">
        <div
          class="step-item"
          :class="{'have-down': activeStepNumber>=1}"
        >
          <div class="line"></div>
          <p class="step-number">1</p>
          <!-- 填写账户名 -->
          <p class="step-desc">{{$t('M.forgetPassword_inputname')}}</p>
        </div>
        <div
          class="step-item"
         :class="{'have-down': activeStepNumber>=2}"
        >
          <div class="line"></div>
          <p class="step-number">2</p>
          <!-- 验证身份 -->
          <p class="step-desc">
            {{$t('M.login_verify')}}{{$t('M.forgetPassword_rank')}}
          </p>
        </div>
        <div
          class="step-item"
          :class="{'have-down': activeStepNumber>=3}"
        >
          <div class="line"></div>
          <p class="step-number">3</p>
          <p class="step-desc">
            <!--设置新密码-->
            {{ $t('M.comm_set') }}{{ $t('M.forgetPassword_new_password') }}
          </p>
        </div>
        <div
          class="step-item"
          :class="{'have-down': activeStepNumber>=4}"
        >
          <div class="line"></div>
          <p class="step-number">4</p>
          <p class="step-desc">
            <!--完成-->
            {{ $t('M.forgetPassword_achieve') }}
          </p>
        </div>
      </div>
      <!--操作-->
      <div class="content-box">
        <!--步骤一-->
        <div
          class="content-item step1"
          v-if="activeStepNumber==1"
        >
          <div class="inner-box">
            <div class="item">
              <span class="label">
                <!--账号-->
                 {{ $t('M.user_account_number') }}
              </span>
              <span class="label-content">
                <input
                  class="username-input"
                  type="text"
                  v-model="username"
                />
              </span>
            </div>
            <div class="item">
              <span class="label">
                <!--验证-->
                {{ $t('M.user_security_verify') }}
              </span>
              <span class="label-content">
                <div
                  class="image-validate-box"
                  v-if="!confirmSuccess"
                >
                  <input
                    class="username-input image-validate"
                    type="text"
                    v-model="userInputImageCode"
                    @keyup="validateImageCode"
                  />
                  <!--获取图片验证码-->
                  <span
                    @click="refreshCode"
                    class="cursor-pointer refresh-code-btn"
                    v-if="!confirmSuccess"
                  >
                    <ImageValidate
                      id="register"
                      :content-width="60"
                      :content-height="36"
                      :identifyCode="identifyCode"
                      :fontSizeMax="40"
                      class="display-inline-block"
                    />
                  </span>
                  </div>
                  <div class="slider-success"
                       v-else
                  >
                  <i class="el-icon-circle-check font-size18"></i>
                  <!--验证成功-->
                    {{ $t('M.user_security_verify') }}{{ $t('M.comm_success') }}
                </div>
              </span>
            </div>
            <div class="item">
              <span class="label"></span>
              <span class="label-content">
                <!--下一步按钮-->
                <button
                  class="next-btn cursor-pointer"
                  @click="findPasswordStep1"
                >
                  <!--下一步-->
                  {{ $t('M.forgetPassword_next_step') }}
                </button>
              </span>
            </div>
          </div>
        </div>
        <!--步骤二-->
        <div
          class="content-item step2"
          v-else-if="activeStepNumber == 2"
        >
          <div class="inner-box">
            <div
              class="item"
              v-if="userInfo.isEnablePhone"
            >
              <span class="label">
                <!--验证手机-->
                {{ $t('M.user_security_verify') }}{{ $t('M.user_security_phone') }}
              </span>
              <span class="label-content">
                <span class="number">{{phoneNumberFormat(userInfo.phone)}}</span>
                <span class="tips">{{$t(phoneNumTips)}}</span>
              </span>
            </div>
            <div
              class="item"
              v-if="userInfo.isEnablePhone"
            >
              <span class="label">
                <!--手机验证码-->
                {{ $t('M.user_security_phone') }}{{ $t('M.comm_code') }}
              </span>
              <span class="label-content">
                <input
                  class="username-input validate-code-input"
                  type="text"
                  v-model="phoneCode"
                />
                <!--发送验证码按钮-->
                <CountDownButton
                  class="send-code-btn cursor-pointer"
                  :status="disabledOfPhoneBtn"
                  @run="sendPhoneOrEmailCode(0)"
                />
              </span>
            </div>
            <div
              class="item"
              v-if="userInfo.isEnableMail"
            >
              <span class="label">
                <!--验证邮箱-->
                {{ $t('M.user_security_verify') }}{{ $t('M.user_security_email') }}
              </span>
              <span class="label-content">
                <span class="number">{{phoneNumberFormat(userInfo.email)}}</span>
                <span class="tips">{{$t(emailNumTips)}}</span>
              </span>
            </div>
            <div
              class="item"
              v-if="userInfo.isEnableMail"
            >
              <span class="label">
                <!--邮箱验证码-->
                {{ $t('M.user_security_email') }}{{ $t('M.comm_code') }}
              </span>
              <span class="label-content">
                <input
                  class="username-input validate-code-input"
                  type="text"
                  v-model="emailCode"
                />
                <!--发送验证码按钮-->
                <CountDownButton
                  class="send-code-btn cursor-pointer"
                  :status="disabledOfEmailBtn"
                  @run="sendPhoneOrEmailCode(1)"
                />
              </span>
            </div>
            <div
              class="item"
              v-if="userInfo.isEnableGoogle"
            >
              <span class="label">
                <!--谷歌验证码-->
                 {{ $t('M.user_security_google') }}{{ $t('M.comm_code') }}
              </span>
              <span class="label-content">
                <input
                  class="username-input"
                  type="text"
                  v-model="googleCode"
                />
              </span>
            </div>
            <div class="item">
              <span class="label"></span>
              <span class="label-content">
                <!--下一步按钮-->
                <button
                  class="next-btn cursor-pointer"
                  @click="findPasswordStep2"
                >
                  <!--下一步-->
                  {{ $t('M.forgetPassword_next_step') }}
                </button>
              </span>
            </div>
          </div>
        </div>
        <!--步骤三-->
        <div
          class="content-item step3"
          v-else-if="activeStepNumber == 3"
        >
          <div class="inner-box">
            <div class="item">
              <span class="label">
                <!--新登录密码-->
                {{ $t('M.forgetPassword_new_login') }}
              </span>
              <span class="label-content">
                <input
                  class="username-input"
                  type="password"
                  v-model="newPassword"
                />
              </span>
            </div>
            <div class="item">
              <span class="label">
                <!--确认密码-->
                {{ $t('M.forgetPassword_affirm_password') }}
              </span>
              <span class="label-content">
                <input
                  class="username-input"
                  type="password"
                  v-model="confirmPassword"
                />
              </span>
            </div>
            <div class="item">
              <span class="label"></span>
              <span class="label-content">
                <!--下一步按钮-->
                <button
                  class="next-btn cursor-pointer"
                  @click="findPasswordStep3"
                >
                  <!--下一步-->
                   {{ $t('M.forgetPassword_next_step') }}
                </button>
              </span>
            </div>
          </div>
        </div>
        <!--步骤四-->
        <div
          class="content-item step4"
          v-else
        >
          <div class="inner-box">
            <div class="success-box">
              <div class="left">
                <IconFont class="icon-text" iconName="icon-dui1"/>
              </div>
              <div class="right">
                <p class="success-msg">
                  <!--新密码设置成功！?-->
                   {{ $t('M.forgetPassword_text1') }}
                </p>
                <p class="success-tips">
                  <!--请牢记您新设置的密码。-->
                   {{ $t('M.forgetPassword_text2') }}
                  <router-link to="/login">
                    <!--立即登录-->
                     {{ $t('M.forgetPassword_text3') }}
                  </router-link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import IconFont from '../Common/IconFontCommon'
import CountDownButton from '../Common/CountDownCommon'
import HeaderCommon from '../Common/HeaderCommonForPC'
import {
  findPasswordStep1,
  findPasswordStep2,
  findPasswordStep3
} from '../../utils/api/user'
import {phoneNumberFormat} from '../../utils'
import {
  returnAjaxMessage,
  sendPhoneOrEmailCodeAjax
} from '../../utils/commonFunc'
import {PWD_REG} from '../../utils/regExp'
import ImageValidate from '../Common/ImageValidateCommon'
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations } = createNamespacedHelpers('user')
export default {
  components: {
    IconFont,
    HeaderCommon,
    CountDownButton,
    ImageValidate
  },
  // props,
  data () {
    return {
      activeStepNumber: 1, // 当前步骤
      username: '',
      userInfo: {
        countryCode: '86',
        email: null,
        isEnableGoogle: false,
        isEnableMail: false,
        isEnablePhone: false,
        phone: '15800000000',
        token: '99b9e025-8c40-48a8-925f-eaf8f9112784'
      }, // 用户信息
      identifyCode: '',
      userInputImageCode: '', // 用户输入图片验证码
      phoneCode: '', // 手机验证码
      emailCode: '', // 邮箱验证码
      googleCode: '', // google验证码
      newPassword: '', // 新登录密码
      confirmPassword: '', // 确认密码
      confirmSuccess: false, // 验证成功判断
      phoneNumTips: 'M.forgetPassword_text4', // 手机号提示信息 若该手机号无法使用请联系客服
      emailNumTips: 'M.forgetPassword_text5', // 邮箱号提示信息 若该邮箱无法使用请联系客服
      end: ''
    }
  },
  created () {
    // console.log(phoneNumberFormat(this.username))
    this.refreshCode()
  },
  mounted () {
  },
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'SET_USER_BUTTON_STATUS'
    ]),
    // 4位随机数
    getRandomNum () {
      return parseInt(Math.random() * 10000) + ''
    },
    refreshCode () {
      this.identifyCode = this.getRandomNum()
    },
    // 封装 phoneNumberFormat
    phoneNumberFormat (phoneNum) {
      return phoneNumberFormat(phoneNum)
    },
    // 找回密码步骤3
    async findPasswordStep3 () {
      if (!this.newPassword) {
        // 请输入新的密码
        this.$message({
          type: 'error',
          message: this.$t('M.comm_please_enter') + this.$t('M.forgetPassword_new_password')
        })
        return false
      } else if (!PWD_REG.test(this.newPassword)) {
        // 请输入8-20位字母、数字组合
        this.$message({
          type: 'error',
          message: this.$t('M.comm_please_enter') + this.$t('M.forgetPassword_hint1')
        })
        return false
      }
      if (!this.confirmPassword) {
        // 请再次输入新的密码
        this.$message({
          type: 'error',
          message: this.$t('M.forgetPassword_hint2') + this.$t('M.forgetPassword_new_password')
        })
        return false
      }
      if (this.confirmPassword !== this.newPassword) {
        // 请输入相同的密码
        this.$message({
          type: 'error',
          message: this.$t('M.comm_please_enter') + this.$t('M.forgetPassword_hint3')
        })
        return false
      }

      const params = {
        token: this.userInfo.token,
        newPassword: this.newPassword
      }
      const data = await findPasswordStep3(params)
      if (!returnAjaxMessage(data, this)) {
        return false
      } else {
        this.activeStepNumber = 4
      }
    },
    // 找回密码步骤2
    async findPasswordStep2 () {
      if (this.userInfo.isEnablePhone && !this.phoneCode) {
        // 请输入短信验证码
        this.$message({
          type: 'error',
          message: this.$t('M.comm_please_enter') + this.$t('M.comm_note') + this.$t('M.comm_code')
        })
        return false
      }

      if (this.userInfo.isEnableMail && !this.emailCode) {
        // 请输入邮箱验证码
        this.$message({
          type: 'error',
          message: this.$t('M.comm_please_enter') + this.$t('M.user_security_email') + this.$t('M.comm_code')
        })
        return false
      }
      if (this.userInfo.isEnableGoogle && !this.googleCode) {
        // 请输入谷歌验证码
        this.$message({
          type: 'error',
          message: this.$t('M.comm_please_enter') + this.$t('M.user_security_google') + this.$t('M.comm_code')
        })
        return false
      }

      const params = {
        token: this.userInfo.token,
        phoneCode: this.phoneCode,
        mailCode: this.emailCode,
        googleCode: this.googleCode
      }
      const data = await findPasswordStep2(params)
      if (!returnAjaxMessage(data, this)) {
        return false
      } else {
        console.log(data)
        this.activeStepNumber = 3
      }
    },
    // 图片验证码验证
    validateImageCode () {
      if (this.userInputImageCode == this.identifyCode) {
        this.confirmSuccess = true
      }
    },
    // 找回密码步骤1
    async findPasswordStep1 () {
      if (!this.username) {
        // 请输入用户名
        this.$message({
          type: 'error',
          message: this.$t('M.comm_please_enter') + this.$t('M.login_username')
        })
        return false
      }
      if (!this.confirmSuccess) {
        // 请通过图片验证
        this.$message({
          type: 'error',
          message: this.$t('M.forgetPassword_hint4')
        })
        return false
      }
      let params = {
        userName: this.username
      }
      const data = await findPasswordStep1(params)
      if (!returnAjaxMessage(data, this)) {
        return false
      } else {
        this.userInfo = data.data.data
        console.log(this.userInfo)
        this.activeStepNumber = 2
      }
    },
    // 发送验证码
    sendPhoneOrEmailCode (msgType) {
      if (this.disabledOfPhoneBtn || this.disabledOfEmailBtn) {
        return false
      }
      let params = {
        country: this.userInfo.countryCode,
        type: 'RETRIEVE_PASS'
      }
      switch (msgType) {
        case 0:
          params.phone = this.userInfo.phone
          break
        case 1:
          params.address = this.userInfo.email
          break
      }
      sendPhoneOrEmailCodeAjax(msgType, params, (data) => {
        // 提示信息
        if (!returnAjaxMessage(data, this)) {
          console.log('error')
          return false
        } else {
          switch (msgType) {
            case 0:
              this.SET_USER_BUTTON_STATUS({
                loginType: 0,
                status: true
              })
              break
            case 1:
              this.SET_USER_BUTTON_STATUS({
                loginType: 1,
                status: true
              })
              break
          }
        }
      })
    }
  },
  filter: {},
  computed: {
    ...mapState({
      disabledOfPhoneBtn: state => state.user.disabledOfPhoneBtn,
      disabledOfEmailBtn: state => state.user.disabledOfEmailBtn
    }),
    windowHeight () {
      return window.innerHeight
    }
  },
  watch: {
    activeStepNumber (newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss">
  @import '../../../static/css/scss/index';
  .froget-password-box{
    background:linear-gradient(150deg,rgba(30,38,54,1),rgba(37,75,117,1));
    height:100%;
    >.inner-box{
      margin:180px auto;
      width:780px;
      background:linear-gradient(201deg,rgba(42,88,137,1) 0%,rgba(43,58,111,1) 100%);
      border-radius:10px;
      box-shadow:0px 4px 21px 0px rgba(26,42,71,1);
      color:#fff;
      padding-bottom:50px;
      >.title{
        height:60px;
        line-height:60px;
        font-size: 24px;
        box-sizing: border-box;
        padding:0 35px;
        border-bottom:1px solid rgba(68,102,145,1);
      }
      /*步骤条*/
      >.step-box{
        height:100px;
        text-align: center;
        display:flex;
        justify-content:center;
        >.step-item{
          max-width:140px;
          flex:1;
          vertical-align: top;
          height:100px;
          position: relative;
          &.have-down{
            >.line,>.step-number{
              background-color: $mainColor;
            }
            >.step-desc{
              color:$mainColor;
            }
          }
          >.line{
            width:140px;
            height:2px;
            background-color: #5D7A9F;
            position: relative;
            top:50%;
          }
          >.step-number{
            margin: 0 auto;
            width:24px;
            height:24px;
            line-height:24px;
            background-color: #5D7A9F;
            font-size: 12px;
            font-weight: 700;
            border-radius:50%;
            color:#fff;
            position: absolute;
            left:50%;
            top:50%;
            transform: translate(-50%,-50%);
          }
          >.step-desc{
            margin-top:70px;
            color: #5D7A9F;
          }
        }
      }
      >.content-box{
        width:100%;
        padding-top:30px;
        >.content-item{
          width:600px;
          margin:0 auto;
          text-align: center;
          >.inner-box{
            >.item{
              height:36px;
              line-height: 36px;
              margin-top:15px;
              >span{
                display: inline-block;
                vertical-align: top;
                margin-right:20px;
              }
              >.label{
                height:36px;
                width:100px;
                text-align: right;
              }
              >.label-content{
                width:380px;
                height:36px;
                text-align: left;
                >.number{
                  font-size: 16px;
                  font-weight: 700;
                  color:$mainColor;
                  margin-right:10px;
                }
                >.tips{
                  width:200px;
                  display:inline-block;
                  font-size: 12px;
                  color:$upColor;
                }
                >.next-btn{
                  width:80px;
                  height:36px;
                  background:linear-gradient(81deg,rgba(61,152,249,1) 0%,rgba(71,135,255,1) 100%);
                  border-radius:4px;
                  box-shadow:0 0 8px 0px rgba(26,42,71,1);
                  color:#fff;
                  margin-left:0px;
                }
                >.username-input{
                  width:200px;
                  height:36px;
                  background:rgba(32,55,90,1);
                  border-radius:4px;
                  padding:0 10px;
                  box-sizing: border-box;
                  color:#fff;
                  vertical-align: top;
                }
                >.image-validate-box{
                  transition: all 1s;
                  >.image-validate{
                    width:135px;
                  }
                  >.username-input{
                    height:36px;
                    background:rgba(32,55,90,1);
                    border-radius:4px;
                    padding:0 10px;
                    box-sizing: border-box;
                    color:#fff;
                    vertical-align: top;
                  }
                }
                >.validate-code-input{
                  width:126px;
                }
                >.send-code-btn{
                  padding:0 10px;
                  height:36px;
                  background:rgba(51,143,245,1);
                  border-radius:4px;
                  color:#fff;
                }
                >.slider-success{
                  transition: all 1s;
                  width:200px;
                  height:36px;
                  background:rgba(32,55,90,1);
                  border:1px solid rgba(51,143,245,1);
                  border-radius:4px;
                  text-align: center;
                  color:$mainColor;
                }
              }
            }
            /*步骤4， 已成功*/
            >.success-box{
              width:500px;
              height:100px;
              line-height:100px;
              margin:0 auto;
              display:flex;
              >.left{
                flex:1;
              }
              >.right{
                padding-top:30px;
                flex:3;
                text-align: left;
                >p{
                  line-height:30px;
                  height:30px;
                  >a{
                    color:#fff;
                  }
                }
                >.success-msg{
                  color:#338FF5;
                  font-size: 14px;
                }
                >.success-tips{
                  color:#5E8FCC;
                  font-size: 12px;
                }
              }
              .icon-text{
                font-size: 100px;
                color:#1296db;
                vertical-align: top;
              }
            }
          }
          /*步骤1*/
          &.step1{
          }
        }
      }
    }
    &.night{
      background:linear-gradient(150deg,rgba(30,38,54,1),rgba(37,75,117,1));
    }
  }
</style>
