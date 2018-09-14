<template>
  <div class="login-box user">
    <HeaderCommon/>
    <div class="inner-box">
      <div class="bg-image"></div>
      <!--PC端-->
      <div
        class="pc-box"
        v-show="!isMobile"
      >
        <h1 class="title">欢迎登录</h1>
        <!--正常登录-->
        <div class="login-box">
          <div
            class="login"
          >
            <div class="username input-content">
              <div class="inner-box">
                <input
                  type="text"
                  v-model.trim="username"
                  placeholder="请输入手机号/邮箱"
                  @keydown="setErrorMsg(0,'')"
                  @keyup.enter="loginForStep1"
                  @blur="checkoutInputFormat(0,username)"
                >
              </div>
              <ErrorBox
                :text="errorShowStatusList[0]"
                :isShow="!!errorShowStatusList[0]"
              />
            </div>
            <div class="pwd input-content">
              <div class="inner-box">
                <!-- 请输入密码 -->
                <input
                  type="password"
                  autocomplete="off"
                  v-model.trim="password"
                  placeholder="请输入密码"
                  @keydown="setErrorMsg(1,'')"
                  @keyup.enter="loginForStep1"
                  @blur="checkoutInputFormat(1,password)"
                >
              </div>
              <ErrorBox
                :text="errorShowStatusList[1]"
                :isShow="!!errorShowStatusList[1]"
              />
            </div>
            <div class="todos">
              <router-link
                to="/ForgetPassword"
              >
                忘记密码?
              </router-link>
              <!-- 忘记密码？ -->
              <router-link
                class="text-align-r"
                to="/register"
              >
                免费注册
              </router-link><!-- 免费注册 -->
            </div>
          </div>
        </div>
        <button
          class="login-btn cursor-pointer step1-btn"
          @click="loginForStep1"
        >
          登录
        </button>
        <!--异常登录（短信验证码）-->
        <!--滑块验证 : 验证-->
        <el-dialog
          title="滑块验证"
          :close-on-click-modal="false"
          :visible.sync="loginSliderStatus"
          class="slider"
        >
         <div class="drag-box border-radius4">
           <div class="drag cp border-radius4">
             <div class="drag_bg border-radius4">
             </div>
             <div class="drag_text border-radius4">
               <!--{{$t(confirmWords)}}-->
               请按住滑块，拖动滑块验证
             </div>
             <div
               @mouseup="mouseupFn($event)"
               @mousedown="mousedownFn($event)"
               class="handler handler_bg"
             >
               <IconFont class="icon-text" iconName="icon-icon-right"/>
             </div>
           </div>
         </div>
        </el-dialog>

        <!--图片验证码验证-->
        <el-dialog
          class="pic image-dialog"
          title="图片验证码验证"
          :visible.sync="loginImageValidateStatus"
        >
          <div class="pic-verify bdr5">
            <!-- 请在下方输入验证码 -->
            <div class="title">
              请在下方输入验证码
            </div>
            <div class="content">
              <div class="inner-box">
                <!--图片验证码-->
                <input
                  type="text"
                  class="input image-validate"
                  placeholder="验证码"
                  v-model="userInputImageCode"
                >
                <!--获取图片验证码-->
                <span
                  @click="refreshCode"
                  class="cursor-pointer refresh-code-btn"
                >
                  <ImageValidate
                    id="register"
                    :content-width="80"
                    :content-height="44"
                    :identifyCode="identifyCode"
                    class="display-inline-block"
                  />
                </span>
              </div>
              <!--<ErrorBox-->
                <!--:text="errorShowStatusList[2]"-->
                <!--:isShow="!!errorShowStatusList[2]"-->
              <!--/>-->
              <div class="inner-box submit-box">
                <button
                  class="subimt cursor-pointer"
                  @click="checkoutuserInputImageCode"
                >
                  提交
                </button>
              </div>
            </div>
          </div>
        </el-dialog>
        <!--短信验证码、邮箱验证码、谷歌验证码 步骤3-->
        <el-dialog
          class="msg-email-google-dialog"
          title="安全验证"
          :visible.sync="step3DialogShowStatus"
        >
          <div
            class="inner-box"
          >
            <!--已绑定手机号-->
            <div v-if="isBindPhone" class="outer-box">
              <!-- 请输入短信验证码 -->
              <p class="title phone-msg">
                请输入
                {{userInfo.phone}}
                收到的验证码
              </p>
              <!--短信验证码-->
              <div class="inner-box">
                <input
                  type="text"
                  class="input phone-validate"
                  placeholder="短信验证码"
                  v-model="step3PhoneMsgCode"
                  @keydown="setErrorMsg(3,'')"
                  @blur="checkoutInputFormat(3,checkCode)"
                >
                <!--<button-->
                  <!--:disabled="disabledOfPhoneBtn"-->
                  <!--class="send-code-btn cursor-pointer"-->
                  <!--@click="sendCheckCodeGolbal(1)"-->
                <!--&gt;-->
                  <!--{{TextOfSendMsgBtnWithPhone}}-->
                <!--</button>-->
                <CountDownButton
                  class="send-code-btn cursor-pointer"
                  :status="disabledOfPhoneBtn"
                  @run="sendPhoneOrEmailCode(0)"
                />
              </div>
            </div>
            <!--已绑定邮箱-->
            <div v-if="isBindEmail" class="outer-box">
              <!-- 请输入邮箱验证码 -->
              <p class="title email-msg">
                请输入
                {{userInfo.email}}
                收到的验证码
              </p>
              <!--邮箱验证码-->
              <div class="inner-box">
                <input
                  type="text"
                  class="input email-validate"
                  placeholder="邮箱验证码"
                  v-model="step3EmailMsgCode"
                  @keydown="setErrorMsg(3,'')"
                  @blur="checkoutInputFormat(3,checkCode)"
                >
                <!--再次发送-->
                <!--<button-->
                  <!--:disabled="disabledOfPhoneBtn"-->
                  <!--class="send-code-btn cursor-pointer"-->
                  <!--@click="sendCheckCodeGolbal(2)"-->
                <!--&gt;-->
                  <!--{{TextOfSendMsgBtnWithEmail}}-->
                <!--</button>-->
                <!--<CountDownButton-->
                  <!--:disabled="disabledOfEmailBtn"-->
                  <!--class="send-code-btn"-->
                  <!--:text="TextOfSendMsgBtnWithEmail"-->
                  <!--@click="sendCheckCodeGolbal(2)"-->
                <!--/>-->
                <CountDownButton
                  class="send-code-btn cursor-pointer"
                  :status="disabledOfEmailBtn"
                  @run="sendPhoneOrEmailCode(1)"
                />
              </div>
            </div>
            <!--已绑定google-->
            <div v-if="isBindGoogle" class="outer-box">
              <!--谷歌验证码: 请输入 谷歌验证器 中的验证码-->
              <!-- 请输入邮箱验证码 -->
              <p class="title google-msg">
                请输入 谷歌验证器 中的验证码
              </p>
              <div class="inner-box">
                <!--谷歌验证码 input-->
                <input
                  type="text"
                  class="input"
                  v-model="step3GoogleMsgCode"
                  @keyup.enter="loginForStep2"
                  @keyup="googleAutoLogin"
                >
              </div>
            </div>
            <!--<el-button-->
              <!--v-if="!isBindGoogle"-->
              <!--class="mt20 cp send-again-btn"-->
              <!--:disabled="disabledOfPhoneBtn"-->
              <!--:class="{'blue':!disabledOfPhoneBtn}"-->
              <!--@click="sendPhoneOrEmailCode(loginType)"-->
            <!--&gt;{{ sendMsgBtnText }}-->
            <!--</el-button>-->

            <!-- 确定 -->
            <button
              size="midium"
              class="login-btn blue-bg fz16 cursor-pointer"
              @click="loginForStep2"
            >
              提交
            </button>
          </div>
        </el-dialog>

      </div>
      <!--移动端-->
      <div
        class="mobile-box"
        v-show="isMobile"
      >
        <div class="mobile-inner-box">
          <!--登录输入框-->
          <div
            v-if="step1"
            class="login-box"
          >
            <el-form
              label-position="top"
              label-width="80px"
            >
              <!-- 账号 -->
              <el-form-item label="账号">
                <el-input
                  type="text"
                  v-model.trim="username"
                  @focus="clearuserNameErrorMsg"
                ></el-input>
              </el-form-item>

              <!-- 密码 -->
              <el-form-item label="密码">
                <el-input
                  type="password"
                  v-model.trim="password"
                  @focus="clearuserNameErrorMsg"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  size="large"
                  class="blue-bg login-btn"
                  @click="loginForStep1"
                >
                  登录
                </el-button><!-- 登录 -->
              </el-form-item>
              <div class="todos clearfix">
                <router-link
                  to="/forgetPwd"
                  class="fl blue"
                >
                  忘记密码
                </router-link>
                <!-- 忘记密码？ -->
                <router-link
                  to="/register"
                  class="fr blue"
                >
                  免费注册
                </router-link><!-- 免费注册 -->
              </div>
            </el-form>
          </div>
          <!--短信验证码-->
          <div
            class="msg"
            v-else-if="step3"
          >
            <div v-if="!isBindGoogle">
              <!--短信、邮箱验证码-->
              <!-- 请输入 收到的验证码 -->
              <p class="mt50 mb50 tl">
                <!--{{hiddenUsername}}-->
                请输入 收到的验证码
              </p>
              <el-input
                class="blue fz16"
                @focus="clearuserNameErrorMsg"
                v-model="msgCode"
                @keyup.native.enter="loginForStep2"
              ></el-input>
            </div>
            <div v-else>
              <!--谷歌验证码-->
              <!-- 请输入 谷歌验证器 中的验证码 -->
              <p class="mt50 mb50 tl">
                请输入 谷歌验证器 中的验证码
              </p>
              <!--谷歌验证码 input-->
              <el-input
                class="blue fz16 "
                title=" "
                min="0"
                v-model="googleCode"
                type="number"
                @keyup.native.enter="loginForStep2"
                @keyup.native="googleAutoLogin"
              >
              </el-input>
            </div>

            <!--<el-button-->
              <!--v-if="!isBindGoogle"-->
              <!--class="mt20  cp send-again-btn"-->
              <!--:class="{'blue':!disabledOfPhoneBtn}"-->
              <!--:disabled="disabledOfPhoneBtn"-->
              <!--@click="sendPhoneOrEmailCode(loginType)"-->
            <!--&gt;-->
              <!--{{ sendMsgBtnText }}-->
            <!--</el-button>-->

            <!-- 确定 -->
            <el-button
              size="midium"
              class="login-btn blue-bg fz16"
              @click="loginForStep2"
            >
              确定
            </el-button>
          </div>
          <!--滑块验证-->
          <div class="slider">
            <!-- 验证 -->
            <el-dialog
              title="验证"
              :close-on-click-modal="false"
              :visible.sync="loginSliderStatus"
              class="slider"
            >
              <div class="drag cp bdr5">
                <div class="drag_bg bdr5"></div>
                <div class="drag_text bdr5">{{confirmWords}}</div>
                <div
                  @touchstart.prevent="handleTouchStart"
                  @touchmove="handleTouchMove"
                  @touchend="handleTouchEnd"
                  class="handler handler_bg"
                ></div>
              </div>
            </el-dialog>
          </div>
          <div class="img-verify">
            <!--图片验证码验证-->
            <el-dialog
              :close-on-click-modal="false"
              class="pic"
              title="图片验证码验证"
              :visible.sync="loginImageValidateStatus"
            >
              <div class="pic-verify bdr5">
                <!-- 请在下方输入验证码 -->
                <div class="title">
                  请在下方输入验证码
                </div>
                <div class="content">
                  <!-- 请输入内容 -->
                  <el-input
                    placeholder="请输入内容"
                    v-model="userInputImageCode"
                    @keyup.native.enter="checkoutuserInputImageCode"
                  >
                    <template slot="append">
                      <div
                        class="sidentify cp"
                        @click="refreshCode"
                      >
                        <ImageValidate
                          id="mobile-login"
                          v-if="isMobile"
                          :fontSizeMin="48"
                          :fontSizeMax="100"
                          :content-width="240"
                          :content-height="150"
                          :identifyCode="identifyCode"
                        />
                      </div>
                    </template>
                  </el-input>
                  <el-button
                    class="subimt blue-bg"
                    @click="checkoutuserInputImageCode"
                  >
                    提交
                  </el-button>
                  <!-- 提交 -->
                </div>
              </div>
            </el-dialog>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import {ajax} from '../../kits/http'
import {EMAIL_REG, PHONE_REG} from '../../utils/regExp' // 正则验证
import {
  userLoginForStep1,
  userLoginForStep2
} from '../../utils/api/user'
import {
  returnAjaxMessage,
  sendPhoneOrEmailCodeAjax
} from '../../utils/commonFunc'
// import {getPersonalAssetsList} from '../../kits/globalFunction'
import CountDownButton from '../Common/CountDownCommon'
import ErrorBox from './ErrorBox'
import ImageValidate from '../Common/ImageValidateCommon'
import HeaderCommon from '../Common/HeaderCommon'
import IconFont from '../Common/IconFontCommon'
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations } = createNamespacedHelpers('user')

export default {
  components: {
    CountDownButton, // 倒计时组件
    HeaderCommon,
    ImageValidate,
    ErrorBox,
    IconFont
  },
  data () {
    return {
      // username: '15738818082',
      // password: '000000', // 15738818082的密码
      // username: '18625512987',
      // username: '18600929234',
      // username: '17600854297',
      username: '18625512985',
      // password: 'a11111111',
      // username: '18625512986',
      // username: '18625512988',
      password: 'a1111111',
      userNameErrorMsg: '', // 错误提示
      loadingCircle: {},
      userInputImageCode: '', // 图形验证码(用户输入)
      identifyCode: '1234', // 图片验证码（后台生成）
      step3PhoneMsgCode: '', // 步骤3 手机验证码
      step3EmailMsgCode: '', // 步骤3 邮箱验证码
      step3GoogleMsgCode: '', // 步骤3 谷歌验证码
      msgCode: '', // 短信验证码或邮箱验证码
      hiddenUsername: '', // 隐藏的用户名
      countDownOfPhone: 0, // 短信验证码倒计时
      countDownOfEmail: 0, // 邮箱验证码倒计时
      // msgTxt: 'm.resend', // 按钮文字
      TextOfSendMsgBtnWithPhone: '发送验证码', // 短信验证码按钮文字
      TextOfSendMsgBtnWithEmail: '发送验证码', // 邮箱验证码按钮文字
      googleCode: '', // google验证码
      errorShowStatusList: [
        '', // 用户名错误提示
        '', // 密码错误提示
        '123', // 图片验证码错误提示
        '',
        ''
      ], // 错误提示框 第0项  第1项
      /**
        * 滑块验证
        *
        */
      beginClientX: 0, /* 距离屏幕左端距离 */
      mouseMoveStatus: false, /* 触发拖动状态  判断 */
      maxwidth: 340, /* 拖动最大宽度，依据滑块宽度算出来的 */
      // confirmWords: '请按住滑块，拖动滑块验证', /*滑块文字*/
      confirmWords: '请按住滑块，拖动滑块验证', /* 滑块文字 */
      confirmSuccess: false, /* 验证成功判断 */
      sliderFlag: true, // 滑块调用节流阀
      loginFlag: true, // 登录节流阀
      dragStatus: true, // 拖动标记

      /**
        * 移动端拖动
        */
      touchStatus: false,
      startX: 0, // 开始时的坐标
      timer: null,
      endX: 0, // 结束时的坐标
      moveX: 0, // 移动的坐标
      mobileMaxwidth: 800, // 移动端拖动最大宽度
      loginSliderStatus: false, // 登录页面滑块显示隐藏状态
      loginImageValidateStatus: false, // 登录页面图片验证码显示隐藏状态
      step3DialogShowStatus: false, // 步骤3 登录状态
      cacheOfuserInfo: null // 用户信息缓存
    }
  },
  created () {
    require('../../../static/css/list/User/Login.css')
    this.ENTER_STEP1()
    // 清空input框值
    // this.clearInputValue()
  },
  mounted () {
    $('body').on('mousemove', (e) => { // 拖动，这里需要用箭头函数，不然this的指向不会是vue对象
      if (this.mouseMoveStatus) {
        var width = e.clientX - this.beginClientX
        if (width > 0 && width <= this.maxwidth) {
          $('.handler').css({'left': width})
          $('.drag_bg').css({'width': width})
        } else if (width > this.maxwidth) {
          this.successFunction()
        }
      }
    })
    $('body').on('mouseup', (e) => { // 鼠标放开
      // console.log('mouseup')
      this.mouseMoveStatus = false
      var width = e.clientX - this.beginClientX
      if (width < this.maxwidth) {
        $('.handler').animate({'left': 0}, 500)
        $('.drag_bg').animate({'width': 0}, 500)
      }
      $('body').off('mousemove')
      $('body').off('mouseup')
      // this.onmousemove = null;
      // this.onmouseup = null;
    })
    $('body').on('dblclick', (e) => {

    })
  },
  activated () {
    // 清空input框值
    this.clearInputValue()
  },
  deactivated () {
    this.ENTER_STEP1()
  },
  methods: {
    ...mapMutations([
      // 'setEntrustCountData'
      'ENTER_STEP1',
      'ENTER_STEP3',
      'SET_LOGIN_TYPE',
      'SET_STEP1_INFO',
      'SET_USER_BUTTON_STATUS',
      'USER_LOGIN'
    ]),
    // 设置错误信息
    setErrorMsg (index, msg) {
      this.errorShowStatusList[index] = msg
    },
    // 检测输入格式
    checkoutInputFormat (type, targetNum) {
      switch (type) {
        // 用户名验证
        case 0:
          if (!targetNum) {
            this.setErrorMsg(0, '请输入用户名')
            // return 0
          } else if (PHONE_REG.test(targetNum)) {
            this.SET_LOGIN_TYPE(0) // phone
            // this.errorShowStatusList[0].status = 0
            this.setErrorMsg(0, '')
            // return 1
          } else if (EMAIL_REG.test(this.username)) {
            this.SET_LOGIN_TYPE(1) // phone
            this.setErrorMsg(0, '')
            // return 1
          } else {
            this.setErrorMsg(0, '请输入正确的邮箱地址或手机号！')
            // return 0
          }
          this.$forceUpdate()
          break
        // 密码验证
        case 1:
          if (!targetNum) {
            this.setErrorMsg(1, '请输入密码！')
          } else {
            this.setErrorMsg(1, '')
          }
          this.$forceUpdate()
          break
      }
    },
    // 隐藏滑块验证
    handleClose (done) {
      done()
    },
    // 清空错误信息
    clearuserNameErrorMsg (index) {
      // this.userNameErrorMsg = ''
      this.errorShowStatusList[index].status = 0
    },

    /**
      * 登录第一步
      */
    async loginForStep1 () {
      this.checkoutInputFormat(0, this.username)
      // console.log(this.errorShowStatusList)

      this.checkoutInputFormat(1, this.password)
      // 判断登录方式
      if (PHONE_REG.test(this.username)) {
        this.SET_LOGIN_TYPE(0)// phone
        let str = this.username + ''
        this.hiddenUsername = str.substring(0, 3) + '****' + str.substring(7)
      } else if (EMAIL_REG.test(this.username)) {
        console.log('email')
        let str = (this.username + '').split('@')[0]
        let str1 = this.username.split('@')[1]
        this.hiddenUsername = str.substring(0, 3) + ' **** ' + '@' + str1
        this.SET_LOGIN_TYPE(1)// email
      } else {
        console.log('error')
        return false
      }
      // 调用第一接口
      let params = {
        userName: this.username,
        password: this.password
      }
      const data = await userLoginForStep1(params)
      if (!returnAjaxMessage(data, this, 0)) {
        return false
      } else {
        this.SET_STEP1_INFO(data.data.data)
        // this.cacheOfuserInfo = data.data.data
        // 发送验证码
        // 显示滑块验证
        this.sliderFlag = true
        this.loginSliderStatus = true
        $('body').on('mousedown', (e) => {
        })
        $('body').on('mousemove', (e) => { // 拖动，这里需要用箭头函数，不然this的指向不会是vue对象
          if (this.mouseMoveStatus) {
            var width = e.clientX - this.beginClientX
            if (width > 0 && width <= this.maxwidth) {
              $('.handler').css({'left': width})
              $('.drag_bg').css({'width': width})
            } else if (width > this.maxwidth) {
              this.successFunction()
            }
          }
        })
        $('body').on('mouseup', (e) => { // 鼠标放开
          this.mouseMoveStatus = false
          var width = e.clientX - this.beginClientX
          if (width < this.maxwidth) {
            $('.handler').animate({'left': 0}, 500)
            $('.drag_bg').animate({'width': 0}, 500)
          }
        })
      }
      // console.log(data)
    },
    /**
      * 发送短信验证码或邮箱验证码
      */
    msgCountDown (countDown, text, disabled) {
      console.log(countDown)
      console.log(text)
      console.log(disabled)
      if (countDown > 0) {
        countDown--
        // this.msgTxt = this.msgTime + "秒后重试";
        text = countDown + ' s 秒后重试'
        setTimeout(this.msgCountDown, 1000)
      } else {
        countDown = 0
        text = '发送验证码'
        disabled = false
      }
      console.log(countDown)
      console.log(text)
      console.log(disabled)
    },
    sendPhoneOrEmailCode (loginType) {
      if (this.disabledOfPhoneBtn || this.disabledOfEmailBtn) {
        return false
      }
      let params = {
        country: this.activeCountryCode,
        type: 'LOGIN_RECORD'
      }
      switch (loginType) {
        case 0:
          params.phone = this.userInfo.phone
          break
        case 1:
          params.address = this.userInfo.email
          break
      }
      sendPhoneOrEmailCodeAjax(loginType, params, (data) => {
        // 提示信息
        if (!returnAjaxMessage(data, this)) {
          console.log('error')
          return false
        } else {
          switch (loginType) {
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
    },
    // 加载个人资产
    loadCurrencyList () {
      // 点击登录按钮时候清空验证码输入框中的数据
      this.msgCode = ''
      this.googleCode = ''

      this.loginForStep1Old().then((res) => {
        this.SET_STEP1_INFO(res.data.data)
        if (!this.step2) {
        }
      }).catch((err) => {
        this.loadingCircle.close()
        this.$message({
          type: 'error',
          // message: err.msg
          message: err.message
        })
      })
    },

    // 4位随机数
    getRandomNum () {
      return parseInt(Math.random() * 10000) + ''
    },
    refreshCode () {
      this.identifyCode = this.getRandomNum()
    },
    // 检查用户输入图片验证码
    checkoutuserInputImageCode () {
      if (!this.userInputImageCode) {
        this.sliderFlag = true
        this.$message({
          type: 'error',
          // message: '请输入图片验证码',
          message: '请输入图片验证码',
          duration: 1000
        })
      } else if (this.userInputImageCode !== this.identifyCode) {
        this.sliderFlag = true
        this.$message({
          type: 'error',
          // message: '您输入图片验证码不正确，请核对后重新输入',
          message: '您输入图片验证码不正确，请核对后重新输入',
          duration: 1000
        })
      } else {
        this.sliderFlag = true
        /*
          * 判断是否需要短信验证或邮箱验证码验证(条件：(异地ip登录||多次登录失败)&&未绑定谷歌验证器)
          * */
        if (this.failureNum > 3) {
          this.loginImageValidateStatus = false
          this.ENTER_STEP3()
          this.step3DialogShowStatus = true

          // this.sendPhoneAndEmailCodeWithStep3((msgRes) => {
          //   console.log(msgRes)
          // }, (emailRes) => {
          //   console.log(emailRes)
          // })

          // if (!this.isBindGoogle) {
          //   // 短信、邮箱验证码
          //
          //   // this.sendPhoneOrEmailCode(this.loginType).then((res) => {
          //   // }).catch(err => {
          //   //   this.$message({
          //   //     type: 'error',
          //   //     message: err.msg
          //   //   })
          //   // })
          // }
        }
      }
    },
    // 步骤3 发送验证码封装
    // sendCheckCodeGolbal (type) {
    //   this.sendPhoneAndEmailCodeWithStep3((phoneRes) => {
    //     console.log(phoneRes)
    //     this.disabledOfPhoneBtn = true
    //     // this.countDownOfPhone = 60
    //     // this.msgCountDown(this.countDownOfPhone, this.TextOfSendMsgBtnWithPhone, this.disabledOfPhoneBtn)
    //     // console.log(this.TextOfSendMsgBtnWithPhone)
    //   }, (res) => {
    //     this.msgCountDown(this.countDownOfEmail, this.TextOfSendMsgBtnWithEmail, this.disabledOfEmailBtn)
    //   }, type)
    // },
    // 步骤3  发送短信、邮箱验证码
    // sendPhoneAndEmailCodeWithStep3 (msgCallback, emailCallback, type) {
    //   if ((!type || type === 1) && this.isBindPhone) {
    //     let params = {
    //       country: this.activeCountryCode,
    //       type: 'LOGIN_RECORD',
    //       phone: this.userInfo.phone
    //     }
    //     // 发送短信验证码
    //     sendPhoneOrEmailCodeAjax(0, params, msgCallback)
    //   }
    //   if ((!type || type === 2) && this.isBindEmail) {
    //     let params = {
    //       country: this.activeCountryCode,
    //       type: 'LOGIN_RECORD',
    //       address: this.userInfo.email
    //     }
    //     // 发送邮箱验证码
    //     sendPhoneOrEmailCodeAjax(1, params, emailCallback)
    //   }
    // },
    /**
      * 需要输入验证码登录
      */
    async loginForStep2 () {
      // 谷歌验证
      // if (this.isBindGoogle) {
      //   if (!this.googleCode) {
      //     // this.userNameErrorMsg = '请输入谷歌验证码';
      //     this.userNameErrorMsg = '请输入谷歌验证码'
      //     return
      //   }
      //   this.loginWithCode(this.loginType, this.googleCode)
      // } else {
      //   // 短信、邮箱验证码验证
      //   if (!this.msgCode) {
      //     // this.userNameErrorMsg = '请输入验证码';
      //     this.userNameErrorMsg = '请输入验证码'
      //     return
      //   }
      //   this.loginWithCode(this.loginType, this.msgCode)
      // }
      let params = {
        token: this.token,
        phone: this.userInfo.phone,
        phoneCode: this.step3PhoneMsgCode,
        email: this.userInfo.email,
        emailCode: this.step3EmailMsgCode,
        googleCode: this.step3GoogleMsgCode
      }
      const data = await userLoginForStep2(params)
      if (!returnAjaxMessage(data, this, 0)) {
        return false
      } else {
        console.log(data)
        this.step3DialogShowStatus = false
        // this.SET_STEP1_INFO(data.data.data)
        this.USER_LOGIN(data.data.data)

        if (this.routerTo &&
          !this.routerTo.startsWith('/addNewPwdByPhone') &&
          !this.routerTo.startsWith('/addNewPwdByEmail') &&
          !this.routerTo.startsWith('/register') &&
          !this.routerTo.startsWith('/login') &&
          !this.routerTo.startsWith('/forgetPwd') &&
          !this.routerTo.startsWith('/changePwdByPhone') &&
          !this.routerTo.startsWith('/changePwdByEmail') &&
          !this.routerTo.startsWith('/nofind404')
        ) {
          // getPersonalAssetsList(this.$store, this.$message).then((res) => {
          //   if (res.data.code !== 200) {
          //
          //   } else {
          this.$router.push({path: this.routerTo})
          //   }
          // })
          // console.log(this.$store.state.personalAsset);
        } else {
          this.$router.push({path: '/home'})
        }

        // 登录成功
        this.$router.push({'path': '/'})
      }
      console.log(data)
    },
    loginWithCode (loginType, code) {
      if (this.loginFlag) {
        this.loginFlag = false
        this.loadingCircle = this.$loading({
          lock: true,
          background: 'rgba(0, 0, 0, 0.7)'
        })
        // let url = common.apidomain + 'login'
        let fd = new FormData()
        if (!loginType) { // phone
          fd.append('type', 0)
        } else {
          fd.append('type', 1)// email
        }

        if (code) {
          fd.append('code', code)
        }
        fd.append('loginName', this.username)
        fd.append('password', this.password)
        ajax(url, 'post', fd, res => {
          this.loginFlag = true
          if (res.data.code !== 200) {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
            this.googleCode = ''
            this.loadingCircle.close()
            return
          }
          this.googleCode = ''
          this.setEntrustCountData(0)
          this.loadingCircle.close()

          this.$store.commit('userLogin', res.data.data)

          localStorage.setItem('userInfo', JSON.stringify(res.data.data.user))
          if (this.$store.state.routerTo &&
                  !this.$store.state.routerTo.startsWith('/addNewPwdByPhone') &&
                  !this.$store.state.routerTo.startsWith('/addNewPwdByEmail') &&
                  !this.$store.state.routerTo.startsWith('/register') &&
                  !this.$store.state.routerTo.startsWith('/login') &&
                  !this.$store.state.routerTo.startsWith('/forgetPwd') &&
                  !this.$store.state.routerTo.startsWith('/changePwdByPhone') &&
                  !this.$store.state.routerTo.startsWith('/changePwdByEmail') &&
                  !this.$store.state.routerTo.startsWith('/nofind404')
          ) {
            // getPersonalAssetsList(this.$store, this.$message).then((res) => {
            //   if (res.data.code !== 200) {
            //
            //   } else {
            //     this.$router.push({path: this.$store.state.routerTo})
            //   }
            // })
            // console.log(this.$store.state.personalAsset);
          } else {
            this.$router.push({path: '/home'})
          }
        }, (err) => {
          this.loginFlag = true
          this.loadingCircle.close()
          this.$message({
            type: 'error',
            message: err.msg
          })
        })
      }
    },
    /**
      * 谷歌验证码自动提交登录
      */
    googleAutoLogin () {
      if (this.googleCode.length > 6 || this.googleCode.length == 6) {
        this.loginWithCode(this.loginType, this.googleCode)
      }
    },

    /**
      * 滑块验证
      */
    mouseupFn (e) {
      console.log('mouseup')
      // this.dragStatus = true;
    },
    mousedownFn: function (e) {
      // if (this.dragStatus) {
      this.dragStatus = false
      this.mouseMoveStatus = true
      this.beginClientX = e.clientX
      // console.log('mousedown')
      // }
    },
    // 按下滑块函数
    successFunction () {
      // console.log('success0')
      if (this.sliderFlag) {
        // console.log('success1')
        this.sliderFlag = false// 调用函数节流阀
        $('.handler').css({'left': this.maxwidth})
        $('.drag_bg').css({'width': this.maxwidth})
        $('body').unbind('mousemove')
        $('body').unbind('mouseup')
        this.confirmSuccess = true
        this.loginSliderStatus = false
        this.mouseMoveStatus = false
        $('.handler').css({'left': 0})
        $('.drag_bg').css({'width': 0})
        /*
           * 是否需要图片验证码验证（条件：3次登录失败）
           * */
        // console.log(this.cacheOfuserInfo)
        if (this.failureNum > 3) {
          // 多次错误登录
          // console.log('需要图片验证码');
          // 显示图片验证码
          this.userInputImageCode = ''
          this.loginImageValidateStatus = true
        } else {
          // 登录第三步
          this.step3DialogShowStatus = true
          // this.sendPhoneAndEmailCodeWithStep3((msgRes) => {
          //   console.log(msgRes)
          // }, (emailRes) => {
          //   console.log(emailRes)
          // })
          // if (this.isBindPhone) {
          //   let params = {
          //     country: this.activeCountryCode,
          //     type: 'LOGIN_RECORD',
          //     phone: this.userInfo.phone
          //   }
          //   // 发送短信验证码
          //   sendPhoneOrEmailCodeAjax(0, params, function (res) {
          //     console.log(res)
          //   })
          // }
          // if (this.isBindEmail) {
          //   let params = {
          //     country: this.activeCountryCode,
          //     type: 'LOGIN_RECORD',
          //     email: this.userInfo.email
          //   }
          //   // 发送邮箱验证码
          //   sendPhoneOrEmailCodeAjax(1, params, function (res) {
          //     console.log(res)
          //   })
          // }

          // 正常登录
          //   this.SET_STEP1_INFO
        }
        // else if (!this.isLastIp) {
        //   // console.log('异常IP');
        //   /**
        //     * 是否需要谷歌验证码或短信验证码
        //     * 条件：
        //     * 1、谷歌验证码：已绑定谷歌验证器&&异地IP登录
        //     * 2、短信、邮箱验证码：未绑定谷歌验证器&&异地IP登录
        //     */
        //   this.ENTER_STEP3()
        //   if (!this.isBindGoogle) {
        //     this.sliderFlag = true
        //     // console.log('未绑定谷歌验证器');
        //     this.sendPhoneOrEmailCode(this.loginType)
        //   }
        // } else {
        //   if (this.isBindGoogle) {
        //     this.sliderFlag = true
        //     this.ENTER_STEP3()
        //   } else {
        //     this.sliderFlag = true
        //     this.loginWithCode(this.loginType)
        //   }
        // }
      } // 验证成功函数
    },

    /**
      * 移动端拖动事件
      */
    handleTouchStart (e) {
      // console.log('start');
      this.startX = e.targetTouches[0].pageX
    },
    handleTouchMove (e) {
      this.moveX = e.targetTouches[0].pageX
      let left = this.moveX - this.startX
      let targetLeft = parseInt($(e.target).css('left'))
      if (targetLeft < 0 || left < 0) {
        return
      }
      if (targetLeft < this.mobileMaxwidth && targetLeft >= 0) {
        $(e.target).css({'left': left + 'px'})
      } else {
        this.successFunction()
      }
    },
    handleTouchEnd (e) {
      // console.log('end');
      this.endX = e.changedTouches[0].pageX
      $(e.target).animate({'left': 0}, 500)
    },
    // 清空input框值
    clearInputValue () {
      this.username = ''
      this.password = ''
    }
  },
  filter: {},
  computed: {
    ...mapState({
      step1: state => state.user.loginStep.step1,
      step2: state => state.user.loginStep.step2,
      step3: state => state.user.loginStep.step3,
      isMobile: state => state.user.isMobile,
      failureNum: state => state.user.loginStep1Info.failureNum, // 失败次数
      activeCountryCode: state => state.user.loginStep1Info.countryCode, // 国籍码
      isBindGoogle: state => state.user.loginStep1Info.isEnableGoogle, // 已绑定谷歌
      isBindEmail: state => state.user.loginStep1Info.isEnableMail, // 已绑定邮箱
      isBindPhone: state => state.user.loginStep1Info.isEnablePhone, // 已绑定手机号
      token: state => state.user.loginStep1Info.token, // 用户token
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      loginType: state => state.user.loginType, // 登录类型
      disabledOfPhoneBtn: state => state.user.disabledOfPhoneBtn,
      disabledOfEmailBtn: state => state.user.disabledOfEmailBtn,
      routerTo: state => state.common.routerTo // 路由跳转
    })
    // step1 () {
    // return this.$store.state.loginStep.step1
    // },
    // step2 () {
    //   return this.step2
    // },
    // step3 () {
    //   return this.$store.state.loginStep.step3
    // }
  },
  watch: {
    username (newVal) {
      // validateNumForUserInput(newVal)
    }
  }
}
</script>
<style scoped lang="scss">
  @import '../../../static/css/scss/index.scss';
  .login-box.user {
    height:100%;
    background:linear-gradient(150deg,rgba(30,38,54,1),rgba(37,75,117,1));
    >.inner-box{
      background:url('../../assets/develop/login-bg.png') 25% center  no-repeat ;
      >.pc-box {
        width: 370px;
        height: 330px;
        margin:12% 50%;
        padding:55px 40px;
        text-align: left;
        background:linear-gradient(201deg,rgba(42,88,137,1) 0%,rgba(43,58,111,1) 100%);
        border-radius:10px;
        box-shadow:0px 4px 21px 0px rgba(26,42,71,1);
        position: relative;
        >.title{
          position: absolute;
          top:-25%;
          left:36%;
          width:104px;
          height:35px;
          font-size:26px;
          font-family:MicrosoftYaHei;
          font-weight:400;
          color:rgba(51,143,245,1);
          background:linear-gradient(81deg,rgba(77,122,255,1) 25.4638671875%, rgba(58,184,255,1) 100%);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
        }
        .step1-btn{
          width:128px;
          height:40px;
          background:linear-gradient(81deg,rgba(61,152,249,1) 0%,rgba(71,135,255,1) 100%);
          border-radius:20px;
          box-shadow:-1px 1px 8px 0px #1a2a47;
        }
        >.login-btn{
          width: 130px;
          height: 40px;
          line-height: 40px;
          margin: 0 auto;
          display: block;
          font-size: 14px;
          font-weight:400;
          color:rgba(255,255,255,1);
          /*background:rgba(40,68,110,1);*/
          /*border-radius:20px;*/
        }
        >.login-box {
          font-size: 16px;
          /*登录第一步*/
          >.login {
            width: 720px;
            >.input-content{
              margin-bottom:30px;
              &.pwd{
                margin-bottom:15px;
              }
              >.inner-box{
                height: 40px;
                line-height:40px;
                width: 290px;
                border-radius: 20px;
                padding: 0 20px;
                margin-bottom: 15px;
                display: inline-block;
                vertical-align: middle;
                background:rgba(40,68,110,1);
                border-radius:20px;

                >input{
                  color:#fff;
                  /*width:290px;*/
                  /*height:40px;*/

                  /*border:1px solid;*/
                  /*border-radius:20px;*/
                  /*padding:0 20px;*/
                  /*box-sizing: border-box;*/
                }
              }
            }
            >.todos {
              position: relative;
              overflow: hidden;
              width:290px;
              height:20px;
              font-size:12px;
              font-family:MicrosoftYaHei;
              font-weight:400;
              color:rgba(47,120,202,1);
              display:flex;
              margin-bottom:20px;
              >a{
                flex:1;
                color:#2F78CA;
              }
            }
          }
          /*登录第三步（短信验证码）*/
          /*错误提示*/
          >.pic-verify {
            width: 100px;
            height: 100px;
            background-color: pink;
          }
        }
        /*图片验证码提示框*/
        .image-dialog{
          .title{
            margin-bottom:25px;
            color:#fff;
          }
          .content{
            width:600px;
            >.inner-box{
              width:410px;
              height:44px;
              border-radius: 4px;
              border:1px solid rgba(72,87,118,1);
              /*border-right-color: transparent;*/
              box-sizing: border-box;
              display: inline-block;
              padding:0;
              &.submit-box{
                margin-top:45px;
                border:none;
                >.subimt{
                  display:inline-block;
                  width:410px;
                  height:40px;
                  background:linear-gradient(81deg,rgba(43,57,110,1) 0%,rgba(42,80,130,1) 100%);
                  border-radius:4px;
                  color:#fff;
                }
              }
              >.image-validate{
                width:324px;
                height:100%;
                vertical-align: top;
                padding:0 20px;
                box-sizing: border-box;
              }
              >.refresh-code-btn{
                display: inline-block;
                height:42px;
                width:80px;
                overflow: hidden;
              }
            }
          }
        }
        /*短信验证码、邮箱验证码、谷歌验证码*/
        .msg-email-google-dialog{
          .outer-box{
            padding:0 10px;
            >.inner-box{
              height: 44px;
              line-height: 44px;
              width: 410px;
              /*padding: 0 10px;*/
              margin:30px 0;
              display: inline-block;
              vertical-align: middle;
              >.input{
                width:410px;
                height:44px;
                background:rgba(26,34,51,1);
                border:1px solid rgba(72,87,118,1);
                border-radius:4px;
                box-sizing: border-box;
                padding:0 20px;
                color:#fff;
                display:block;
              }
              /*发送信息按钮*/
              >.send-code-btn{
                display:block;
                margin:5px 0 0 0;
                padding:0 20px;
                color:$upColor;
              }
            }
          }
          .login-btn{
            width:410px;
            height:40px;
            background:linear-gradient(81deg,rgba(43,57,110,1) 0%,rgba(42,80,130,1) 100%);
            border-radius:4px;
            margin:10px 10px 20px 10px;
            color:#fff;
            font-size: 14px;
          }
        }
        /*滑块*/
        .drag-box{
          width:410px;
          overflow: hidden;
          >.drag{
            position: relative;
            background-color: #1e2235;
            width: 410px;
            height: 50px;
            line-height: 50px;
            text-align: center;
            border: 1px solid #4e5b85;
            cursor: pointer;
            >.drag_bg{
              background-color: #1f2943;
              height: 48px;
            }
            >.drag_text{
              font-size: 16px;
              position: absolute;
              top: 0px;
              width: 410px;
              -moz-user-select: none;
              -webkit-user-select: none;
              user-select: none;
              -o-user-select: none;
              -ms-user-select: none;
              background: -webkit-gradient(linear, left top, right top, color-stop(0, #61688a), color-stop(.4, #61688a), color-stop(.5, #fff), color-stop(.6, #61688a), color-stop(1, #61688a));
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              -webkit-animation: slidetounlock 3s infinite;
              -webkit-text-size-adjust: none;
            }

            @keyframes slidetounlock {
              0% {
                background-position: -200px 0;
              }
              100% {
                background-position: 200px 0;
              }
            }
            >.handler_bg{
              border-radius: 0px 3px 3px 0px;
              background: #4e5b85;
              position: absolute;
              top: 0px;
              left: 0px;
              width: 70px;
              height: 48px;
              /* border: 1px solid #ccc; */
              cursor: move;
              .icon-text{
                color:rgba(222,225,234,1);
                font-size: 14px;
              }
            }
          }
        }
      }
      >.mobile-box {
        font-size: 30px;
        margin: 200px auto;
        padding: 0 1rem;
        box-sizing: border-box;
        width: 100%;
        /*登录*/
        .login-box {
          width: 100%;
        }
        /*滑块验证*/
        .slider {
          width: 100%;
        }
      }
    }
    &.night{}
    &.day{}
  }
</style>
