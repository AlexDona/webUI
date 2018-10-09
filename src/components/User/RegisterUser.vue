<template>
  <div
    class="register-box user"
    :class="{
      'day':theme == 'day',
      'night':theme == 'night',
      'min-height':windowHeight < 800
      }"
    :style="{height: windowHeight + 'px'}"
  >
    <HeaderCommon/>
    <!--注册页面-->
    <div
      class="inner-box"
      v-if="!isRegisterSuccess"
    >
      <!--注册-->
      <div class="main-box">
        <!--切换注册方式-->
        <ul class="methods-list">
          <li
            class="method-item cursor-pointer"
            :class="{active:!activeMethod}"
            @click="toggleMethod(0)"
          >
            <!--手机注册-->
            {{ $t('M.user_security_phone') }}{{ $t('M.comm_register_time') }}
          </li>
          <li
            class="method-item cursor-pointer"
            :class="{active:activeMethod}"
            @click="toggleMethod(1)"
          >
            <!--邮箱注册-->
            {{ $t('M.user_security_email') }}{{ $t('M.comm_register_time') }}
          </li>
        </ul>
        <!--手机号注册-->
        <transition
          enter-active-class = "animated fadeIn"
        >
          <div
          class="inner-content mobile"
          v-show="!activeMethod"
        >
          <div class="input username">
           <div class="inner-box">
             <!--国籍选择-->
             <el-select
               v-model="activeCountryCodeWithPhone"
               :no-data-text="$t('M.comm_no_data')"
               class="phone-select"
             >
               <el-option
                 v-for="item in contryAreaList"
                 :key="item.nationCode"
                 :label="item.nationCode"
                 :value="item.nationCode"
               >
                <span style="float: left">
                  <span v-show="language==='zh_CN'">
                    {{ item.chinese }}
                  </span>
                  <span v-show="language!=='zh_CN'">
                    {{item.english}}
                  </span>
                </span>
                 <span style="
                  float: right;
                  color: #8492a6;
                  font-size: 13px"
                 >{{ item.nationCode }}</span>
               </el-option>
             </el-select>
             <span class="middle-line"></span>
             <!--手机号码-->
             <input
               type="text"
               class="input mobile-phone"
               :placeholder="$t('M.user_security_phone') + $t('M.user_security_number')"
               v-model="phoneNum"
               @keydown="setErrorMsg(0,'')"
               @blur="checkUserExistAjax('phone',phoneNum)"
             >
           </div>
          </div>
        </div>
        </transition>
        <!--邮箱注册-->
        <transition
          enter-active-class = "animated fadeIn"
        >
          <div
          class="inner-content email"
          v-show="activeMethod"
        >
            <div class="input">
              <div class="inner-box">
                <!--中文国籍选择-->
                <el-select
                  class="email-select"
                  :no-data-text="$t('M.comm_no_data')"
                  v-model="activeCountryCodeWithEmail"
                  v-show="language=='zh_CN'"
                >
                  <el-option
                    v-for="item in contryAreaList"
                    :key="item.nationCode"
                    :label="item.chinese"
                    :value="item.nationCode"
                  >
                    <span style="float: left">
                      <span>
                        {{ item.chinese }}
                      </span>
                    </span>
                    <span style="
                      float: right;
                      color: #8492a6;
                      font-size: 13px"
                    >{{ item.nationCode }}</span>
                  </el-option>
                </el-select>
                <!--非中文国籍选择-->
                <el-select
                  class="email-select"
                  :no-data-text="$t('M.comm_no_data')"
                  v-model="activeCountryCodeWithEmail"
                  v-show="language!=='zh_CN'"
                >
                  <el-option
                    v-for="item in contryAreaList"
                    :key="item.nationCode"
                    :label="item.english"
                    :value="item.nationCode"
                  >
                    <span style="float: left">
                      <span>
                        {{item.english}}
                      </span>
                    </span>
                    <span style="
                      float: right;
                      color: #8492a6;
                      font-size: 13px"
                    >{{ item.nationCode }}</span>
                  </el-option>
                </el-select>
              </div>
            </div>
          <!--邮箱账号-->
          <div class="input">
           <div class="inner-box">
             <!--邮箱地址-->
             <input
               type="text"
               class="input"
               :placeholder="$t('M.user_security_email') + $t('M.comm_site')"
               v-model="emailNum"
               @keydown="setErrorMsg(1,'')"
               @blur="checkUserExistAjax('email',emailNum)"
             >
           </div>
          </div>
        </div>
        </transition>
        <!--公共部分-->
        <div class="inner-content common">
          <div class="input">
            <div class="inner-box">
              <!--图片验证码-->
              <input
                type="text"
                class="input image-validate"
                v-model="userInputImageCode"
                :placeholder="$t('M.comm_code')"
                @keydown="setErrorMsg(2,'')"
                @blur="checkoutInputFormat(2,userInputImageCode)"
              >
              <!--获取图片验证码-->
              <span
                @click="refreshCode"
                class="cursor-pointer"
              >
              <ImageValidate
                id="register"
                :content-width="80"
                :content-height="40"
                :identifyCode="identifyCode"
                class="display-inline-block"
              />
            </span>
            </div>
          </div>
          <div class="input">
            <div class="inner-box">
              <!--邮箱、手机验证码-->
              <input
                type="text"
                class="input image-validate"
                :placeholder="$t(activeCodePlaceholder)"
                v-model="checkCode"
                @keydown="setErrorMsg(3,'')"
                @blur="checkoutInputFormat(3,checkCode)"
              >
              <span class="middle-line"></span>
              <CountDownButton
                :status="!activeMethod?disabledOfPhoneBtn:disabledOfEmailBtn"
                class="send-code-btn cursor-pointer"
                @run="sendPhoneOrEmailCode(activeMethod)"
              />
            </div>
          </div>
          <div class="input">
           <div class="inner-box">
             <!--登录密码-->
             <input
               type="password"
               class="input"
               :placeholder="$t('M.comm_please_enter') + $t('M.user_security_password')"
               v-model="password"
               @keydown="setErrorMsg(4,'')"
               @blur="checkoutInputFormat(4,password)"
             >
           </div>
          </div>
          <div class="input">
           <div class="inner-box">
             <!--确认密码-->
             <!--请再次输入密码-->
             <input
               type="password"
               class="input"
               :placeholder="$t('M.forgetPassword_hint2') + $t('M.user_security_password')"
               @keydown="setErrorMsg(5,'')"
               v-model="repeatPassword"
               @blur="checkoutInputFormat(5,repeatPassword)"
             >
           </div>
          </div>
          <div class="input">
           <div class="inner-box">
             <!--邀请码-->
             <!--邀请码（没有可不填）-->
             <input
               v-model="inviter"
               type="text"
               class="input "
               :placeholder="$t('M.forgetPassword_hint5')"
             >
           </div>
          </div>
          <div class="input">
           <div class="inner-box user-agreement">
             <!--用户协议-->
             <el-checkbox v-model="userAgreementStatus">
               <span class="">
                 <!--我已阅读并同意-->
                 {{ $t('M.forgetPassword_hint6') }}
               </span>
               <router-link to="/" class="main-color">
                 <!--《用户协议》-->
                 {{ $t('M.forgetPassword_hint7') }}
               </router-link>
             </el-checkbox>
           </div>
          </div>
          <!--错误提示-->
          <div
            class = "error-msg font-size12"
            v-show = "errorMsg"
          >
            {{ errorMsg }}
          </div>
          <button
            class="register-btn btn cursor-pointer"
            @click="sendRegister"
          >
            <!--注册-->
            {{ $t('M.comm_register_time') }}
          </button>
        </div>
      </div>
    </div>
    <!--注册成功-->
    <div
      class="inner-box"
      v-else
    >
      <div class="success-box">
        <p class="title">
          <span>{{successCountDown}}</span>
          <!--秒后跳转登录页面...-->
          {{ $t('M.forgetPassword_hint8') }}
        </p>
        <button
          class="cursor-pointer jump-login"
          @click="loginImmediately"
        >
          <!--立即登录-->
          {{ $t('M.forgetPassword_text3') }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import ImageValidate from '../Common/ImageValidateCommon'
import HeaderCommon from '../Common/HeaderCommonForPC'
import ErrorBox from './ErrorBox'
import CountDownButton from '../Common/CountDownCommon'
// import {EMAIL_REG, PHONE_REG, PWD_REG} from '../../utils/regExp' // 正则验证
import {
  // sendMsgByPhoneOrEmial,
  sendRegisterUser,
  checkUserExist
} from '../../utils/api/user'
import {
  returnAjaxMessage, // 接口返回信息
  validateNumForUserInput, // 用户输入验证
  sendPhoneOrEmailCodeAjax
  // getCountryListAjax
} from '../../utils/commonFunc'
import {createNamespacedHelpers, mapState} from 'vuex'
const {mapMutations} = createNamespacedHelpers('user')
export default {
  components: {
    ErrorBox,
    HeaderCommon,
    ImageValidate,
    CountDownButton
  },
  // props,
  data () {
    return {
      activeMethod: 0, // 当前注册方式： 0： 手机注册 : 1 邮箱注册
      // contryAreaList: [], // 国家区域列表
      activeCountryCodeWithPhone: '86',
      activeCountryCodeWithEmail: '86',
      // 短信验证码 邮箱验证码
      activeCodePlaceholder: !this.activeMethod ? 'M.forgetPassword_hint10' : 'M.forgetPassword_hint11',
      identifyCode: '', // 图片验证码
      userInputImageCode: '', // 用户输入的图片验证码
      phoneNum: '', // 手机号
      emailNum: '', // email 地址
      password: '', // 密码
      repeatPassword: '', // 确认密码
      checkCode: '', // 短信、邮箱验证码
      inviter: '', // 邀请码
      userAgreementStatus: false, // 是否同意协议
      msgCountDown: 60,
      sendMsgBtnText: 'M.forgetPassword_hint12', // 发送验证码
      sendMsgBtnDisabled: false,
      errorMsg: '', // 错误信息
      isRegisterSuccess: false, // 注册成功
      successCountDown: 3, // 成功倒计时
      end: '' // 占位
    }
  },
  created () {
    require('../../../static/css/list/User/Register.css')
    // changeLang({'lan': 'zh_CN'})
    let params = this.$route.query.showId
    console.log(params)
    if (params) {
      this.inviter = params
    }
    this.refreshCode()
    // this.getCountryList()
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
    getCountryList () {
      getCountryListAjax(this, (data) => {
        console.log(data)
        this.contryAreaList = data.data.data
        console.log(this.contryAreaList)
      })
    },
    // 检测输入格式
    checkoutInputFormat (type, targetNum) {
      // console.log(type)
      switch (type) {
        // 手机号
        case 0:
          console.log(validateNumForUserInput('phone', targetNum))
          switch (validateNumForUserInput('phone', targetNum)) {
            case 0:
              this.setErrorMsg(0, '')
              this.$forceUpdate()
              return 1
            case 1:
              // 请输入手机号
              this.setErrorMsg(0, this.$t('M.comm_please_enter') + this.$t('M.user_security_phone'))
              this.$forceUpdate()
              return 0
          }
          break
        // 邮箱验证
        case 1:
          switch (validateNumForUserInput('email', targetNum)) {
            case 0:
              this.setErrorMsg(1, '')
              this.$forceUpdate()
              return 1
            case 1:
              // 请输入邮箱地址
              this.setErrorMsg(1, this.$t('M.comm_please_enter') + this.$t('M.user_security_email') + this.$t('M.comm_site'))
              this.$forceUpdate()
              return 0
            case 2:
              // 请输入正确的邮箱地址
              this.setErrorMsg(1, this.$t('M.comm_please_enter') + this.$t('M.user_security_correct') + this.$t('M.user_security_email'))
              this.$forceUpdate()
              return 0
          }
          break
        // 图片验证码
        case 2:
          if (!targetNum) {
            // 请输入图片验证码
            this.setErrorMsg(2, this.$t('M.comm_please_enter') + this.$t('M.login_photo') + this.$t('M.comm_code'))
            this.$forceUpdate()
            return 0
          } else if (this.userInputImageCode === this.identifyCode) {
            this.setErrorMsg(2, '')
            this.$forceUpdate()
            return 1
          } else {
            // 请输入正确的图片验证码
            this.setErrorMsg(2, his.$t('M.comm_please_enter') + this.$t('M.user_security_correct') + this.$t('M.login_photo') + this.$t('M.comm_code'))
            this.$forceUpdate()
            return 0
          }
        // 短信、邮箱验证码
        case 3:
          if (!targetNum) {
            // 请输入 短信验证码 邮箱验证码
            const str = this.$t('M.comm_please_enter') + (!this.activeMethod ? this.$t('M.forgetPassword_hint10') : this.$t('M.forgetPassword_hint11'))
            this.setErrorMsg(3, str)
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(3, '')
            this.$forceUpdate()
            return 1
          }
        // 密码
        case 4:
          switch (validateNumForUserInput('password', targetNum)) {
            case 0:
              this.setErrorMsg(4, '')
              this.$forceUpdate()
              return 1
            case 1:
              // 请输入密码
              this.setErrorMsg(4, this.$t('M.comm_please_enter') + this.$t('M.user_security_password'))
              this.$forceUpdate()
              return 0
            case 2:
              // 请输入 8-20 位字母和数字组合
              this.setErrorMsg(4, this.$t('M.comm_please_enter') + this.$t('M.user_security_info1'))
              this.$forceUpdate()
              return 0
          }
          break
        // 确认密码
        case 5:
          if (!targetNum) {
            // 请输入确认密码
            this.setErrorMsg(5, this.$t('M.comm_please_enter') + this.$t('M.forgetPassword_affirm_password'))
            this.$forceUpdate()
            return 0
          } else if (targetNum === this.password) {
            this.setErrorMsg(5, '')
            this.$forceUpdate()
            return 1
          } else {
            // 密码不一致，请重新确认
            this.setErrorMsg(5, this.$t('M.user_security_info2'))
            this.$forceUpdate()
            return 0
          }
        // 用户协议
        case 6:
          if (!targetNum) {
            // 请勾选用户协议
            this.setErrorMsg(6, this.$t('M.forgetPassword_hint13'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(6, '')
            this.$forceUpdate()
            return 1
          }
      }
    },
    // 设置错误信息
    setErrorMsg (index, msg) {
      this.errorMsg = msg
    },
    // 检测用户名是否存在
    async checkUserExistAjax (type, userName) {
      console.log('blur')
      // let a = validateNumForUserInput(type, userName)
      // console.log(a)
      if (!validateNumForUserInput(type, userName)) {
        let params = {
          userName: userName,
          regType: type
        }
        const data = await checkUserExist(params)
        if (!returnAjaxMessage(data, this)) {
          return false
        }
      } else {
        switch (type) {
          case 'phone':
            if (this.checkoutInputFormat(0, userName)) {
              return false
            }
            break
          case 'email':
            if (this.checkoutInputFormat(1, userName)) {
              return false
            }
            break
        }
      }
    },
    // 手机
    msgTimer () {
      if (this.msgCountDown > 0) {
        this.msgCountDown--
        this.sendMsgBtnText = this.msgCountDown + ' s'
        setTimeout(this.msgTimer, 1000)
      } else {
        this.msgCountDown = 0
        // 发送验证码
        this.sendMsgBtnText = this.$t('M.forgetPassword_hint12')
        this.sendMsgBtnDisabled = false
      }
    },
    // 发送验证码（短信、邮箱）
    sendPhoneOrEmailCode (type) {
      // console.log(type)
      if (this.disabledOfPhoneBtn || this.disabledOfEmailBtn) {
        return false
      }
      let params = {
        type: 'REGISTER'
      }
      switch (type) {
        case 0:
          console.log(this.phoneNum)
          console.log(this.checkoutInputFormat(type, this.phoneNum))
          if (!this.checkoutInputFormat(type, this.phoneNum)) {
            console.log(100)
            return false
          }
          params.phone = this.phoneNum
          params.country = this.activeCountryCodeWithPhone
          break
        case 1:
          if (!this.checkoutInputFormat(type, this.emailNum)) {
            return false
          }
          params.address = this.emailNum
          params.country = this.activeCountryCodeWithEmail
          break
      }
      console.log(params)
      sendPhoneOrEmailCodeAjax(type, params, (data) => {
        // 提示信息
        if (!returnAjaxMessage(data, this)) {
          return false
        } else {
          switch (type) {
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
          // this.msgCountDown = 60
          // this.sendMsgBtnDisabled = true
          // this.msgTimer()
        }
      })
    },
    // 4位随机数
    getRandomNum () {
      return parseInt(Math.random() * 10000) + ''
    },
    // 刷新验证码
    refreshCode () {
      this.identifyCode = this.getRandomNum()
    },
    // 发送注册申请
    async sendRegister () {
      const regType = this.activeMethod ? 'email' : 'phone'
      let goOnStatus = 0
      if (regType === 'phone') {
        if (this.checkoutInputFormat(0, this.phoneNum)) {
          goOnStatus = 1
        }
      } else {
        if (this.checkoutInputFormat(1, this.emailNum)) {
          goOnStatus = 1
        }
      }
      if (
        this.checkoutInputFormat(2, this.userInputImageCode) &&
        this.checkoutInputFormat(3, this.checkCode) &&
        this.checkoutInputFormat(4, this.password) &&
        this.checkoutInputFormat(5, this.repeatPassword) &&
        this.checkoutInputFormat(6, this.userAgreementStatus)
      ) {
        goOnStatus = 1
      } else {
        goOnStatus = 0
      }
      console.log(goOnStatus)
      if (goOnStatus) {
        let userName = this.activeMethod ? this.emailNum : this.phoneNum
        let countryCode = this.activeMethod ? this.activeCountryCodeWithEmail : this.activeCountryCodeWithPhone
        let params = {
          userName: userName,
          password: this.password,
          checkCode: this.checkCode,
          inviter: this.inviter,
          regType: regType,
          country: countryCode
        }
        try {
          const data = await sendRegisterUser(params)
          console.log(data)
          if (!returnAjaxMessage(data, this, 0)) {
            return false
          } else {
            this.isRegisterSuccess = true
            this.successJump()
          }
        } catch (err) {
          console.log(err)
        }
      }
    },
    // 登录成功自动跳转
    successJump () {
      setInterval(() => {
        if (this.successCountDown === 0) {
          this.$router.push({'path': '/login'})
        }
        this.successCountDown--
      }, 1000)
    },
    // 立即登录
    loginImmediately () {
      this.$router.push({'path': '/login'})
    },
    // 切换注册方式
    toggleMethod (method) {
      this.activeMethod = method
      // 短信验证码 邮箱验证码
      this.activeCodePlaceholder = !this.activeMethod ? this.$t('M.forgetPassword_hint10') : this.$t('M.forgetPassword_hint11')
      this.clearFormData()
    },
    // 清空表单信息
    clearFormData () {
      this.userInputImageCode = ''
      this.phoneNum = ''
      this.emailNum = ''
      this.password = ''
      this.repeatPassword = ''
      this.checkCode = ''
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language,
      contryAreaList: state => state.common.contryAreaList,
      disabledOfPhoneBtn: state => state.user.disabledOfPhoneBtn,
      disabledOfEmailBtn: state => state.user.disabledOfEmailBtn
      // activeCountryCodeWithPhone: state => state.user.countryCode // 国籍码
    }),
    windowHeight () {
      console.log(window.innerHeight)
      return window.innerHeight
    }
  },
  watch: {
    disabledOfPhoneBtn (newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss">
  @import '../../../static/css/scss/index.scss';
  .register-box{
    width:100%;
    height:100%;
    overflow: hidden;
    background:linear-gradient(150deg,rgba(30,38,54,1),rgba(37,75,117,1));
    &.min-height{
      min-height:1000px;
    }
    >.inner-box{
      width:100%;
      height:100%;
      background:url('../../assets/develop/login-bg.png') 25% 4%  no-repeat ;
      .main-color{
        color:$mainColor;
      }
      >.main-box{
        width:370px;
        background:linear-gradient(201deg,rgba(42,88,137,1) 0%,rgba(43,58,111,1) 100%);
        box-shadow:0px 4px 21px 0px rgba(26,42,71,1);
        margin: 12% 0 0 50%;
        padding:12px 40px 50px;
        border-radius: 10px;
        /*注册方式选择*/
        >.methods-list{
          display:flex;
          >.method-item{
            flex:1;
            height:40px;
            line-height:40px;
            text-align: center;
            color:#c3c3c3;
            &.active{
              color:#fff;
              font-size: 16px;
            }
          }
        }
        >.inner-content{
          /*密码账号框*/
          >.input{
            width:600px;
            >.inner-box{
              height:40px;
              width:290px;
              padding:0 5px 0 20px;
              margin-bottom:15px;
              display: inline-block;
              vertical-align: middle;
              background:rgba(32,55,90,1);
              border-radius:20px;
              &.user-agreement{
                background: none;
                padding:0;
                height:20px;
                margin-bottom:0;
              }
              >.input{
                &::-webkit-input-placeholder{
                  color:#8B9197;
                }
                width:100%;
                height:100%;
                color:#fff;
                &.image-validate{
                  width:154px;
                  vertical-align: top;
                }
                &.mobile-phone{
                  width:156px;
                }
              }
              >.middle-line{
                width:1px;
                height:20px;
                display: inline-block;
                background:rgb(55,86,131);
                vertical-align: top;
                margin:10px 5px 0 0;
              }
              >.send-code-btn{
                color:$mainColor;
                height:40px;
                line-height: 40px;
                text-align: center;
                /*width:66px;*/
              }
            }
            /*>.err-box{
              height:40px;
              overflow: hidden;
              border:1px solid transparent;
              >.triangle{
                vertical-align: middle;
                display: inline-block;
                border:10px solid transparent;
                border-top-color:red;
                transform:rotate(90deg);
                margin-right:-5px;
              }
              >span{
                display:inline-block;
                height:40px;
                line-height:40px;
                background-color: green;
                color:red;
                padding:0 20px 0 30px;
                border-radius: 10px;
              }
            }*/
          }
          >.error-msg{
            height:30px;
            line-height: 30px;
            margin-left: 30px;
            color: rgb(212, 88, 88);
          }
          /*注册，忘记密码*/
          >.link{
            width:100%;
            height:40px;
            line-height: 40px;
            font-size: 12px;
            margin-bottom:30px;
            >a{
              display:inline-block;
              width:49%;
            }
          }
          /*注册按钮*/
          >.btn{
            line-height:40px;
            margin:20px auto 0;
            display:block;
            font-size: 14px;
            width:128px;
            height:40px;
            background:linear-gradient(81deg,rgba(61,152,249,1) 0%,rgba(71,135,255,1) 100%);
            border-radius:20px;
            box-shadow:2px 2px 8px 0px rgba(26,42,71,1);
            color:#fff;
          }
        }
      }
      >.success-box{
        width:240px;
        height:300px;
        text-align: center;
        margin:300px auto;
        >.title{
          width:240px;
          height:16px;
          font-size:18px;
          font-family:MicrosoftYaHei-Bold;
          font-weight:bold;
          color:rgba(51,143,245,1);
        }
        >.jump-login{
          width:150px;
          height:40px;
          background:rgba(51,143,245,1);
          opacity:0.5;
          border-radius:4px;
          margin:100px auto;
          color:#fff;
        }
      }
    }
  }
</style>
