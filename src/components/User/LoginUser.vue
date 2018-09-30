<template>
  <div
    class="login-box user"
    :style="{
     'min-height':windowHeight < 800,
     'height': windowHeight + 'px'
    }"
  >
    <HeaderCommonForPC
      v-if="!isMobile"
    />
    <HeaderCommonForMobile
      v-if="isMobile"
    />
    <div
      class="inner-box"
      :class="{'pc-bg': !isMobile}"
    >
      <div class="bg-image"></div>
      <!--PC端-->
      <div
        class="pc-box"
        v-if="!isMobile&&!isErCodeLogin"
      >
        <!--切换登录-->
        <!--<button-->
          <!--class="toggle-login-type cursor-pointer"-->
          <!--@click="toggleLoginType"-->
        <!--&gt;-->
        <!--</button>-->
        <!-- 欢迎登录 -->
        <h1 class="title">{{$t('M.login_welcome')}}{{$t('M.comm_login')}}</h1>
        <!--正常登录-->
        <div class="login-box">
          <div
            class="login"
          >
            <div class="username input-content">
              <div class="inner-box">
                <!-- 请输入电话号/邮箱 -->
                <input
                  type="text"
                  v-model.trim="username"
                  :placeholder="$t('M.comm_please_enter') + $t('M.login_telNum')+ '/'+ $t('M.comm_emailbox')"
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
                  :placeholder="$t('M.comm_please_enter') + $t('M.comm_loginpassword')"
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
                <!-- 忘记密码? -->
                {{$t('M.login_forget')}}{{$t('M.comm_loginpassword')}}?
              </router-link>
              <!-- 忘记密码？ -->
              <router-link
                class="text-align-r"
                to="/Register"
              >
                <!-- 免费注册 -->
                {{$t('M.login_free')}}{{$t('M.comm_register_time')}}
              </router-link><!-- 免费注册 -->
            </div>
          </div>
        </div>
        <button
          class="login-btn cursor-pointer step1-btn"
          @click="loginForStep1"
        >
          <!-- 登录 -->
          {{$t('M.comm_login')}}
        </button>
        <!--异常登录（短信验证码）-->
        <!--滑块验证 : 验证-->
        <el-dialog
          :title="$t('M.login_slideBlock') + $t('M.login_verify')"
          :close-on-click-modal="false"
          :visible.sync="loginSliderStatus"
          class="slider"
        >
         <div class="drag-box border-radius4">
           <div class="drag cp border-radius4">
             <div class="drag_bg border-radius4">
             </div>
             <div class="drag_text border-radius4">
               <!-- 请按住滑块，拖动滑块验证 -->
               {{$t('M.login_verifyTips')}}
             </div>
             <div
               @mouseup="mouseupFn($event)"
               @mousedown="mousedownFn($event)"
               class="handler handler_bg"
             >
               <!--<IconFont class="icon-text" iconName="icon-icon-right"/>-->
             </div>
           </div>
         </div>
        </el-dialog>

        <!--图片验证码验证-->
        <el-dialog
          class="pic image-dialog"
          :close-on-click-modal="false"
          :title="$t('M.login_photo') + $t('M.comm_code') + $t('M.login_verify')"
          :visible.sync="loginImageValidateStatus"
        >
          <div class="pic-verify bdr5">
            <!-- 请在下方输入验证码 -->
            <div class="title">
              <!-- 请在下方输入验证码 -->
              {{$t('M.login_downInput')}}{{$t('M.comm_code')}}
            </div>
            <div class="content">
              <div class="inner-box">
                <!--图片验证码-->
                <input
                  type="text"
                  class="input image-validate"
                  :placeholder="$t('M.comm_code')"
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
                  <!-- 提交 -->
                  {{$t('M.comm_sub_time')}}
                </button>
              </div>
            </div>
          </div>
        </el-dialog>
        <!--短信验证码、邮箱验证码、谷歌验证码 步骤3-->
        <!-- 安全验证 -->
        <el-dialog
          class="msg-email-google-dialog"
          :close-on-click-modal="false"
          :title="$t('M.login_safe') + $t('M.login_verify')"
          :visible.sync="step3DialogShowStatus"
        >
          <div
            class="inner-box"
          >
            <!--已绑定手机号-->
            <div v-if="isBindPhone" class="outer-box">
              <!-- 请输入短信验证码 -->
              <p class="title phone-msg">
                <!-- 请输入 -->
                {{$t('M.comm_please_enter')}}
                {{userInfo.phone}}
                <!-- 收到的验证码 -->
                {{$t('M.login_recives')}}{{$t('M.comm_code')}}
              </p>
              <!--短信验证码-->
              <div class="inner-box">
                <input
                  type="text"
                  class="input phone-validate"
                  :placeholder="$t('M.comm_note') + $t('M.comm_code')"
                  v-model="step3PhoneMsgCode"
                  @keydown="setErrorMsg(3,'')"
                  @blur="checkoutInputFormat(3,checkCode)"
                >
                <CountDownButton
                  v-if="!isMobile"
                  class="send-code-btn cursor-pointer"
                  :status="disabledOfPhoneBtn"
                  @run="sendPhoneOrEmailCode('pc',0)"
                />
              </div>
            </div>
            <!--已绑定邮箱-->
            <div v-if="isBindEmail" class="outer-box">
              <!-- 请输入邮箱验证码 -->
              <p class="title email-msg">
                <!-- 请输入 -->
                {{$t('M.comm_please_enter')}}
                {{userInfo.email}}
                <!-- 收到的验证码 -->
                {{$t('M.login_recives')}}{{$t('M.comm_code')}}
              </p>
              <!--邮箱验证码-->
              <div class="inner-box">
                <input
                  type="text"
                  class="input email-validate"
                  :placeholder="$t('M.comm_emailbox') + $t('M.comm_code')"
                  v-model="step3EmailMsgCode"
                  @keydown="setErrorMsg(3,'')"
                  @blur="checkoutInputFormat(3,checkCode)"
                >
                <CountDownButton
                  v-if="!isMobile"
                  class="send-code-btn cursor-pointer"
                  :status="disabledOfEmailBtn"
                  @run="sendPhoneOrEmailCode('pc',1)"
                />
              </div>
            </div>
            <!--已绑定google-->
            <div v-if="isBindGoogle" class="outer-box">
              <!--谷歌验证码: 请输入 谷歌验证器 中的验证码-->
              <!-- 请输入邮箱验证码 -->
              <p class="title google-msg">
                <!-- 请输入 谷歌验证器 中的验证码 -->
                {{$t('M.comm_please_enter')}} {{$t('M.login_googleVerifier')}} {{$t('M.login_inVerify')}}
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
            <button
              size="midium"
              class="login-btn blue-bg fz16 cursor-pointer"
              @click="loginForStep2"
            >
              <!-- 提交 -->
              {{$t('M.comm_sub_time')}}
            </button>
          </div>
        </el-dialog>

      </div>
      <!--pc 扫码登录-->
      <div
        class="pc-er-code-box"
        v-if="!isMobile&&isErCodeLogin"
      >
      <!-- 欢迎登录 -->
        <h1 class="title">{{$t('M.login_welcome')}}{{$t('M.comm_login')}}</h1>
        <!-- 遮罩层 -->
        <div
          class="mask-box"
          v-if="isErcodeTimeOut"
        >
          <button @click="reflashErCode">
            <IconFont
              icon-name="icon-shuaxin"
              class-name="reflash-icon"
            />
            <!-- 二维码失效，点击刷新 -->
            {{$t('M.login_erweimaReflesh')}}
          </button>
        </div>
        <!--切换登录-->
        <button
          class="toggle-login-type cursor-pointer"
          @click="toggleLoginType"
        >
        </button>
        <!-- 扫描安全登录 -->
        <p class="inner-title">{{$t('M.login_scan')}}{{$t('M.login_safe')}}{{$t('M.comm_login')}}</p>
        <VueQrcode
          class="ercode"
          :value="erCodeString"
        >
        </VueQrcode>
        <!-- 请使用富比特APP扫码功能，扫码登录 -->
        <p class="tips">{{$t('M.login_scanLogin')}}</p>
      </div>
      <!--移动端-->
      <div
        class="mobile-box"
        v-show="isMobile"
      >
        <div class="mobile-inner-box">
          <!--登录输入框-->
          <div
            class="login-box-step1"
          >
            <div class="input-item">
              <!-- 请输入邮箱/电话号 -->
              <input
                type="text"
                v-model.trim="username"
                :placeholder="$t('M.comm_please_enter') + $t('M.comm_emailbox')+ '/'+ $t('M.login_telNum')"
                @focus="setMobileErrorMsg('')"
                @keyup.enter="loginForStep1"
                @blur="checkoutInputFormat(0,username)"
              />
            </div>
            <div class="input-item">
              <!-- 请输入密码 -->
              <input
                type="password"
                :placeholder="$t('M.comm_please_enter') + $t('M.comm_loginpassword')"
                v-model.trim="password"
                @focus="setErrorMsg('')"
                @keyup.enter="loginForStep1"
                @blur="checkoutInputFormat(1,password)"
              />
            </div>
            <div class="input-item login-btn">
              <button
                class="login-btn"
                @click="loginForStep1"
              >
                <!-- 登录 -->
                {{$t('M.comm_login')}}
              </button>
            </div>
            <div
              class="error-msg"
              v-show="setMobileErrorMsg"
            >
              {{ mobileErrorMsg }}
            </div>
            <div class="todos">
              <router-link
                class="jump-url"
                to="/Register"
              >
                <!-- 注册 -->
                {{$t('M.comm_register_time')}}
              </router-link>
              <!-- 忘记密码？ -->
              <router-link
                to="/ForgetPassword"
                class="jump-url text-align-r"
              >
                <!-- 忘记密码? -->
                {{$t('M.login_forget')}}{{$t('M.comm_loginpassword')}}?
              </router-link><!-- 免费注册 -->
            </div>
          </div>
          <!--短信验证码、邮箱验证码、谷歌验证码 步骤3-->
          <el-dialog
            class="msg-email-google-dialog mobile"
            :close-on-click-modal="false"
            :title="$t('M.login_safe') + $t('M.login_verify')"
            :visible.sync="step3DialogShowStatus"
          >
            <div
              class="inner-box"
            >
              <!--已绑定手机号-->
              <div v-if="isBindPhone" class="outer-box">
                <!-- 请输入短信验证码 -->
                <p class="title phone-msg">
                  <!-- 请输入 -->
                  {{$t('M.comm_please_enter')}}
                  {{userInfo.phone}}
                  <!-- 收到的验证码 -->
                  {{$t('M.login_recives')}}{{$t('M.comm_code')}}
                </p>
                <!--短信验证码-->
                <div class="inner-box">
                  <!-- 短信验证码 -->
                  <input
                    type="text"
                    class="input phone-validate"
                    :placeholder="$t('M.comm_note') + $t('M.comm_code')"
                    v-model="step3PhoneMsgCode"
                    @keydown="setErrorMsg(3,'')"
                    @blur="checkoutInputFormat(3,checkCode)"
                  >
                  <CountDownButton
                    v-if="isMobile"
                    class="send-code-btn cursor-pointer"
                    :status="disabledOfPhoneBtn"
                    @run="sendPhoneOrEmailCode('mobile',0)"
                  />
                </div>
              </div>
              <!--已绑定邮箱-->
              <div v-if="isBindEmail" class="outer-box">
                <!-- 请输入邮箱验证码 -->
                <p class="title email-msg">
                  <!-- 请输入 -->
                  {{$t('M.comm_please_enter')}}
                  {{userInfo.email}}
                  <!-- 收到的验证码 -->
                   {{$t('M.login_recives')}}{{$t('M.comm_code')}}
                </p>
                <!--邮箱验证码-->
                <div class="inner-box">
                  <input
                    type="text"
                    class="input email-validate"
                    :placeholder="$t('M.comm_emailbox') + $t('M.comm_code')"
                    v-model="step3EmailMsgCode"
                    @keydown="setErrorMsg(3,'')"
                    @blur="checkoutInputFormat(3,checkCode)"
                  >
                  <CountDownButton
                    v-if="isMobile"
                    class="send-code-btn cursor-pointer"
                    :status="disabledOfEmailBtn"
                    @run="sendPhoneOrEmailCode('mobile',1)"
                  />
                </div>
              </div>
              <!--已绑定google-->
              <div v-if="isBindGoogle" class="outer-box">
                <!--谷歌验证码: 请输入 谷歌验证器 中的验证码-->
                <!-- 请输入邮箱验证码 -->
                <p class="title google-msg">
                  <!-- 请输入 谷歌验证器 中的验证码 -->
                  {{$t('M.comm_please_enter')}} {{$t('M.login_googleVerifier')}} {{$t('M.login_inVerify')}}
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
              <button
                size="midium"
                class="login-btn blue-bg fz16 cursor-pointer"
                @click="loginForStep2"
              >
                <!-- 提交 -->
                {{$t('M.comm_sub_time')}}
              </button>
            </div>
          </el-dialog>
          <!--滑块验证-->
          <div class="slider">
            <!-- 验证 -->
            <el-dialog
              :title="$t('M.login_safe') + $t('M.login_verify')"
              :close-on-click-modal="false"
              :visible.sync="loginSliderStatus"
              class="slider"
            >
              <div class="drag cp bdr5">
                <div class="drag_bg bdr5"></div>
                <div class="drag_text bdr5">{{$t(confirmWords)}}</div>
                <div
                  @touchstart.prevent="handleTouchStart"
                  @touchmove="handleTouchMove"
                  @touchend="handleTouchEnd"
                  class="handler handler_bg"
                >
                  <!--<IconFont class="icon-text" iconName="icon-icon-right"/>-->
                </div>
              </div>
            </el-dialog>
          </div>
          <div class="img-verify">
            <!--图片验证码验证-->
            <el-dialog
              :close-on-click-modal="false"
              class="pic"
              :title="$t('M.login_photo') + $t('M.comm_code') + $t('M.login_verify')"
              :visible.sync="loginImageValidateStatus"
            >
              <div class="pic-verify bdr5">
                <!-- 请在下方输入验证码 -->
                <div class="title">
                  <!-- 请输入验证码 -->
                  {{$t('M.comm_please_enter')}}{{$t('M.comm_code')}}
                </div>
                <div class="content">
                  <div class="inner-box">
                    <!--图片验证码-->
                    <!-- 请输入内容 -->
                    <input
                      type="text"
                      class="input image-validate"
                      :placeholder="$t('M.comm_please_enter') + $t('M.login_content')"
                      v-model="userInputImageCode"
                    >
                    <!--获取图片验证码-->
                    <span
                      @click="refreshCode"
                      class="cursor-pointer refresh-code-btn"
                    >
                  <ImageValidate
                    id="register-mobile"
                    :content-width="240"
                    :content-height="160"
                    :font-size-min="70"
                    :font-size-max="100"
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
                      class="submit cursor-pointer"
                      @click="checkoutuserInputImageCode"
                    >
                      <!-- 提交 -->
                      {{$t('M.comm_sub_time')}}
                    </button>
                  </div>
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
import {EMAIL_REG} from '../../utils/regExp' // 正则验证
import {loginSocketUrl} from '../../utils/env'
import {
  userLoginForStep1,
  userLoginForStep2,
  getLoginErcode
} from '../../utils/api/user'
import {
  assetCurrenciesList
} from '../../utils/api/personal'
import {
  returnAjaxMessage,
  sendPhoneOrEmailCodeAjax
} from '../../utils/commonFunc'
import socket from '../../utils/datafeeds/socket'

// import {getPersonalAssetsList} from '../../kits/globalFunction'
import CountDownButton from '../Common/CountDownCommon'
import ErrorBox from './ErrorBox'
import ImageValidate from '../Common/ImageValidateCommon'
import HeaderCommonForPC from '../Common/HeaderCommonForPC'
import HeaderCommonForMobile from '../Common/HeaderForMobile'
import IconFont from '../Common/IconFontCommon'
import VueClipboard from 'vue-clipboard2'
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations } = createNamespacedHelpers('user')
Vue.use(VueClipboard)
export default {
  components: {
    CountDownButton, // 倒计时组件
    HeaderCommonForPC,
    HeaderCommonForMobile,
    ImageValidate,
    ErrorBox,
    IconFont,
    // 二维码组件
    VueQrcode: resolve => {
      require([('@xkeshi/vue-qrcode')], resolve)
    }
  },
  data () {
    return {
      socket: new socket(this.url = loginSocketUrl), // 二维码登录socket
      isErcodeTimeOut: false, // 二维码是否过期
      isErCodeLogin: false, // 是否扫码登录
      erCodeString: '', // 二维码登录字符串
      // username: '',
      // username: '18625512987',
      // username: '18600929234',
      // username: '17600854297',
      // username: '13137111901',
      // password: 'a11111111',
      username: '15638559236',
      // username: '13100000011',
      // username: '13100000012',
      // username: '18625512988',
      // password: '123456aa',
      password: 'a1111111',
      userNameErrorMsg: '', // 错误提示
      loadingCircle: {},
      userInputImageCode: '', // 图形验证码(用户输入)
      identifyCode: '', // 图片验证码（后台生成）
      step3PhoneMsgCode: '', // 步骤3 手机验证码
      step3EmailMsgCode: '', // 步骤3 邮箱验证码
      step3GoogleMsgCode: '', // 步骤3 谷歌验证码
      msgCode: '', // 短信验证码或邮箱验证码
      hiddenUsername: '', // 隐藏的用户名
      countDownOfPhone: 0, // 短信验证码倒计时
      countDownOfEmail: 0, // 邮箱验证码倒计时
      // msgTxt: 'm.resend', // 按钮文字
      TextOfSendMsgBtnWithPhone: this.$t('M.login_send') + this.$t('M.comm_code'), // 短信验证码按钮文字
      TextOfSendMsgBtnWithEmail: this.$t('M.login_send') + this.$t('M.comm_code'), // 邮箱验证码按钮文字
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
      confirmWords: this.$t('M.login_verifyTips'), /* 滑块文字 */
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
      cacheOfuserInfo: null, // 用户信息缓存
      mobileErrorMsg: '' // 移动端错误信息
    }
  },
  created () {
    console.log(this.socket)
    require('../../../static/css/list/User/Login.css')
    this.ENTER_STEP1()
    this.refreshCode()
    this.reflashErCode()
    // 清空input框值
    // this.clearInputValue()
  },
  mounted () {
    $('body').on('mousemove', (e) => { // 拖动，这里需要用箭头函数，不然this的指向不会是vue对象
      if (this.mouseMoveStata) {
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
      console.log('mouseup')
      this.mouseMoveStata = false
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
    // 刷新二维码
    async reflashErCode () {
      const data = await getLoginErcode()
      if (!returnAjaxMessage(data, this)) {
        return false
      } else {
        console.log(data)
        this.erCodeString = data.data.data
      }
    },
    // 切换登录方式
    toggleLoginType () {
      this.isErCodeLogin = !this.isErCodeLogin
      if (this.isErCodeLogin) {
        this.reflashErCode()
      }
    },
    // 设置错误信息（mobile）
    setMobileErrorMsg (msg) {
      this.mobileErrorMsg = msg
    },
    // 设置错误信息(PC)
    setErrorMsg (index, msg) {
      this.errorShowStatusList[index] = msg
      this.mobileErrorMsg = msg
    },
    // 检测输入格式
    checkoutInputFormat (type, targetNum) {
      switch (type) {
        // 用户名验证
        case 0:
          if (!targetNum) {
            this.setErrorMsg(0, this.$t('M.comm_please_enter') + this.$t('M.login_username')) // 请输入用户名
            this.$forceUpdate()
            return 0
          } else {
            console.log(1)
            this.setErrorMsg(0, '')
            this.$forceUpdate()
            return 1
          }
        // 密码验证
        case 1:
          if (!targetNum) {
            this.setErrorMsg(1, this.$t('M.comm_please_enter') + this.$t('M.comm_loginpassword')) // 请输入密码
            this.$forceUpdate()
            return 0
          } else {
            console.log(1)
            this.setErrorMsg(1, '')
            this.$forceUpdate()
            return 1
          }
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
      if (!this.checkoutInputFormat(0, this.username)) {
        return false
      }
      if (!this.checkoutInputFormat(1, this.password)) {
        return false
      }
      // 判断登录方式
      if (EMAIL_REG.test(this.username)) {
        console.log('email')
        let str = (this.username + '').split('@')[0]
        let str1 = this.username.split('@')[1]
        this.hiddenUsername = str.substring(0, 3) + ' **** ' + '@' + str1
        this.SET_LOGIN_TYPE(1)// email
      } else {
        this.SET_LOGIN_TYPE(0)// phone
        let str = this.username + ''
        this.hiddenUsername = str.substring(0, 3) + '****' + str.substring(7)
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
    },
    /**
      * 发送短信验证码或邮箱验证码
      */
    sendPhoneOrEmailCode (sendType, loginType) {
      if (sendType === 'pc') {
        if (this.disabledOfPhoneBtn || this.disabledOfEmailBtn) {
          return false
        }
      } else {
        if (this.disabledOfMobilePhoneBtn || this.disabledOfMobileEmailBtn) {
          return false
        }
      }

      let params = {
        country: this.activeCountryCode,
        type: 'LOGIN_CODE'
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
    async loadCurrencyList () {
      const data = await assetCurrenciesList()
      if (!returnAjaxMessage(data, this)) {
        return false
      } else {
        console.log(data)
      }
    },
    // 4位随机数
    getRandomNum () {
      return parseInt(Math.random() * 10000) + ''
    },
    refreshCode () {
      this.identifyCode = this.getRandomNum()
      console.log(this.identifyCode)
    },
    // 检查用户输入图片验证码
    checkoutuserInputImageCode () {
      if (!this.userInputImageCode) {
        this.sliderFlag = true
        this.$message({
          type: 'error',
          // message: '请输入图片验证码',
          message: this.$t('M.comm_please_enter') + this.$t('M.login_photo') + this.$t('M.comm_code'),
          duration: 1000
        })
      } else if (this.userInputImageCode !== this.identifyCode) {
        this.sliderFlag = true
        this.$message({
          type: 'error',
          // message: '您输入图片验证码不正确，请核对后重新输入',
          message: this.$t('M.login_reinput'),
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
        }
      }
    },
    /**
      * 需要输入验证码登录
      */
    async loginForStep2 () {
      // 谷歌验证
      if (this.isBindGoogle && !this.step3GoogleMsgCode) {
        this.$message({
          type: 'error',
          message: this.$t('M.comm_please_enter') + this.$t('M.login_google') + this.$t('M.comm_code') // 请输入谷歌验证码
        })
        return false
      }
      if (this.isBindEmail && !this.step3EmailMsgCode) {
        this.$message({
          type: 'error',
          message: this.$t('M.comm_please_enter') + this.$t('M.comm_emailbox') + this.$t('M.comm_code') // '请输入邮箱验证码'
        })
        return false
      }
      if (this.isBindPhone && !this.step3PhoneMsgCode) {
        this.$message({
          type: 'error',
          message: this.$t('M.comm_please_enter') + this.$t('M.login_telphone') + this.$t('M.comm_code') // '请输入手机验证码'
        })
        return false
      }

      let params = {
        token: this.token,
        phone: this.userInfo.phone,
        phoneCode: this.step3PhoneMsgCode,
        email: this.userInfo.email,
        emailCode: this.step3EmailMsgCode,
        googleCode: this.step3GoogleMsgCode
      }
      const data = await userLoginForStep2(params)
      if (!returnAjaxMessage(data, this, 1)) {
        return false
      } else {
        this.clearInputValue()
        this.step3DialogShowStatus = false
        this.USER_LOGIN(data.data.data)
        console.log(this.routerTo)
        if (this.routerTo &&
          !this.routerTo.startsWith('/Register') &&
          !this.routerTo.startsWith('/login') &&
          !this.routerTo.startsWith('/ForgetPassword') &&
          !this.routerTo.startsWith('/nofind404')
        ) {
          // this.loadCurrencyList()
          this.$router.push({path: this.routerTo})
        } else {
          this.$router.push({path: '/'})
        }
      }
      console.log(data)
    },
    /**
      * 谷歌验证码自动提交登录
      */
    googleAutoLogin () {
      if (this.googleCode.length > 6 || this.googleCode.length == 6) {
        // this.loginWithCode(this.loginType, this.googleCode)
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
        }
      } // 验证成功函数
    },

    /*
    * 移动端拖动事件
    * */
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
      // console.log(targetLeft)
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
    }),
    windowHeight () {
      return window.innerHeight
    }
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
    overflow: hidden;
    background:linear-gradient(150deg,rgba(30,38,54,1),rgba(37,75,117,1));
    &.min-height{
      min-height:1000px;
    }
    >.inner-box{
      &.pc-bg{
        background:url('../../assets/develop/login-bg.png') 25% center  no-repeat ;
      }
      >.pc-er-code-box,>.pc-box{
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
      }
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
        >.toggle-login-type{
          position: absolute;
          right:0;
          top:0;
          width:50px;
          height:50px;
          background:url(../../assets/develop/er-code-icon.png) no-repeat center center;
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
            /*width: 16rem;*/
            /*background: red;*/
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
                color:#fff;
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
              background: #485776 url(../../assets/develop/arrow-bg.png) no-repeat center center;
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
      >.pc-er-code-box{
        margin:12% 50%;
        padding:33px 40px;
        width:370px;
        height:330px;
        background:linear-gradient(201deg,rgba(42,88,137,1) 0%,rgba(43,58,111,1) 100%);
        border-radius:10px;
        box-shadow:0px 4px 21px 0px rgba(26,42,71,1);
        position: relative;
        text-align: center;
        &:before{
          content:'';
          width:70px;
          height:40px;
          position: absolute;
          right:4px;
          top:18px;
          z-index: 2;
          transform: rotateZ(45deg);
        }
        >.mask-box{
          width:100%;
          height:100%;
          position: absolute;
          left:0;
          top:0;
          z-index: 3;
          background:rgba(42,83,133,0.9);
          >button{
            >.reflash-icon{
              display:block;
              background-color: #fff;
              border-radius: 50%;
              width:50px;
              height:50px;
              box-sizing: border-box;
              padding:10px;
              color:$mainColor;
              margin:110px auto 22px;
            }
            color:#fff;
          }
        }
        /*切换图标*/
        >.toggle-login-type{
          position: absolute;
          right:0;
          top:0;
          width:50px;
          height:50px;
          background:url(../../assets/develop/pc-login-icon.png) no-repeat center center;
        }
        >.inner-title{
          height:50px;
          text-align: center;
          color:rgba(255,255,255,1);
        }
        >.tips{
          color: #fff;
          height:50px;
          line-height: 50px;
        }
        >.ercode{
          margin:0 auto;
          box-sizing: border-box;
          width:174px;
          height:174px;
          background-color: #fff;
        }
      }
      >.mobile-box {
        font-size: 30px;
        margin: 120px auto;
        padding: 0 1rem;
        box-sizing: border-box;
        width: 100%;
        >.mobile-inner-box{
          width: 100%;
          >.login-box-step1 {
            width: 100%;
            >.input-item{
              height:4rem;
              width:100%;
              margin-bottom:3rem;
              &.login-btn{
                margin-bottom:1rem;
              }
              >input,>button{
                box-sizing: border-box;
                width:100%;
                height:4rem;
                background:rgba(40,68,110,1);
                border-radius:0.4rem;
                font-size: 1.2rem;
                padding:0 40px;
                color:#fff;
              }
              >.login-btn{
                background:linear-gradient(81deg,rgba(61,152,249,1) 0%,rgba(71,135,255,1) 100%);
                border-radius:20px;
                box-shadow:1px 1px 8px 0px rgba(26,42,71,1);
              }
            }
            >.error-msg{
              color:#D45858;
              margin-bottom:1rem;
              font-size: 1rem;
            }
            >.todos{
              display: flex;
              >.jump-url{
                flex:1;
                color:rgba(47,120,202,1);
                font-size: 1rem;
              }
            }
          }
          /*图片盒子*/
          >.img-verify{
            .pic-verify{
              >.title{
                margin-bottom: 25px;
                color: #fff;
                font-size: 1rem;
              }
              >.content{
                /*width: 600px;*/
                /*width:16rem;*/
                width:1000px;
                >.inner-box{
                  width:1000px;
                  /*width: 410px;*/
                  height:160px;
                  line-height: 160px;
                  border-radius: 4px;
                  border: 1px solid #485776;
                  /* border-right-color: transparent; */
                  -webkit-box-sizing: border-box;
                  box-sizing: border-box;
                  display: inline-block;
                  padding: 0;
                  &.submit-box{
                    margin-top: 45px;
                    border: none;
                    >.submit{
                      display: inline-block;
                      width:1000px;
                      height:160px;
                      background: linear-gradient(81deg, #2b396e 0%, #2a5082 100%);
                      font-size: 0.7rem;
                      border-radius: 4px;
                      color: #fff;
                    }
                  }
                  >.input{
                    width: 754px;
                    height: 100%;
                    vertical-align: top;
                    padding: 0 40px;
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    color: #fff;
                    font-size: 0.7rem;
                  }
                  >.refresh-code-btn{
                    display: inline-block;
                    height:160px;
                    width: 240px;
                    /*background: pink;*/
                    overflow: hidden;
                  }
                }
              }
            }
          }
          /*短信验证码、邮箱验证码、谷歌验证码*/
          .msg-email-google-dialog{
            .outer-box{
              font-size: 0.7rem;
              padding:0 10px;
              >.inner-box{
                height: 160px;
                line-height: 160px;
                width: 1000px;
                /*padding: 0 10px;*/
                margin:30px 0;
                display: inline-block;
                vertical-align: middle;
                >.input{
                  width:1000px;
                  height:160px;
                  background:rgba(26,34,51,1);
                  border:1px solid rgba(72,87,118,1);
                  border-radius:4px;
                  box-sizing: border-box;
                  padding:0 40px;
                  color:#fff;
                  display:block;
                  font-size: 0.7rem;
                }
                /*发送信息按钮*/
                >.send-code-btn{
                  display:block;
                  margin:5px 0 0 0;
                  padding:0 20px;
                  color:$upColor;
                  font-size: 0.7rem;
                }
              }
            }
            .login-btn{
              width:1000px;
              height:160px;
              background:linear-gradient(81deg,rgba(43,57,110,1) 0%,rgba(42,80,130,1) 100%);
              border-radius:4px;
              margin:1rem 10px 20px 10px;
              color:#fff;
              font-size: 0.7rem;
            }
          }
        }
        /*登录*/
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
