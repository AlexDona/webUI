<template>
  <div
    class="login-box user"
    :style="{
     'min-height':windowHeight < 800,
     'height': windowHeight + 'px',
     'margin-top':isMobile?'0':'50px'
    }"
  >
    <keep-alive>
      <HeaderCommonForPC
        v-if="!isMobile"
      />
      <HeaderCommonForMobile
        v-else
      />
    </keep-alive>

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
        <button
          class="toggle-login-type cursor-pointer"
          @click="toggleLoginType"
        >
        </button>
        <div class="tips">
          {{$t(loginWithPasswordTipsText)}}
        </div>
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
                  :placeholder="$t('M.login_tips1')"
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
                  maxlength="20"
                  autocomplete= "new-password"
                  v-model="password"
                  :placeholder="$t('M.login_tips2')"
                  @keydown="setErrorMsg(1,'')"
                  @keyup.enter="loginForStep1"
                  @blur="checkoutInputFormat(1,password)"
                />
              </div>
              <ErrorBox
                :text="errorShowStatusList[1]"
                :isShow="!!errorShowStatusList[1]"
              />
            </div>
            <!-- 记住账号 -->
            <div class="remember-username">
              <el-checkbox
                v-model="isRememberUserName"
                class="checkout"
              ><span>{{$t('M.login_tips7')}}</span></el-checkbox>
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
        <div class="todos">
          <router-link
            to="/ForgetPassword"
          >
            <!-- 忘记密码? -->
            {{$t('M.login_tips3')}}
          </router-link>
          <span class="middle-line"></span>
          <!-- 忘记密码？ -->
          <router-link
            class="text-align-r"
            to="/register"
          >
            <!-- 免费注册 -->
            <!-- {{$t('M.login_free')}}{{$t('M.comm_register_time')}} -->
            {{$t('M.login_tips4')}}
          </router-link>
        </div>
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
            <div v-if="isBindPhone&&!isBindGoogle" class="outer-box">
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
                  @keyup="step3AutoLogin(step3PhoneMsgCode)"
                  @blur="checkoutInputFormat(3,step3PhoneMsgCode)"
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
            <div v-if="isBindEmail&&!isBindPhone&&!isBindGoogle" class="outer-box">
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
                  @keyup="step3AutoLogin(step3EmailMsgCode)"
                  @blur="checkoutInputFormat(3,step3EmailMsgCode)"
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
                  maxlength="6"
                  v-model="step3GoogleMsgCode"
                  @keyup.enter="loginForStep2"
                  @keyup="step3AutoLogin(step3GoogleMsgCode)"
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
          <button
            @click="reflashErCode"
            class="cursor-pointer"
          >
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
        <div class="login-tips">
          {{$t(loginWithErcodeTipsText)}}
        </div>
        <div
          class="scan-box"
          v-if="!isScanSuccess"
        >
        <!-- 扫描安全登录 -->
        <p class="inner-title">
          {{$t('M.login_scan_safe_login')}}
        </p>
        <span
          @click="reflashErCode"
          class="cursor-pointer"
        >
          <Qrcode
            class="ercode"
            :value="erCodeString"
          />
        </span>

        <!-- 请使用富比特APP扫码功能，扫码登录 -->
        <p class="tips">
          {{$t('M.login_scanLogin')}}
        </p>
        </div>
        <!-- 扫码成功-->
        <div
          class="scan-success"
          v-else
        >
          <IconFont
            icon-name="icon-cellphoneiphone"
            class-name="icon-cellphoneiphone"
          />
          <IconFont
            icon-name="icon-chenggong"
            class-name="icon-chenggong"
          />
          <div class="tips">
            <p>
              <!-- 扫描成功！ -->
              {{$t('M.user_login_scan_success')}}
            </p>
            <p>
              <!-- 请在手机上确认登录 -->
              {{$t('M.user_login_phone_confirm_login')}}
            </p>
          </div>
          <button
            class="back-to-scan cursor-pointer"
            @click="backToScan"
          >
            <!-- 返回二维码登录 -->
            {{$t('M.user_login_return_QR')}}
          </button>
        </div>
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
            <div class="input-item password">
              <!-- 请输入密码 -->
              <input
                type="password"
                maxlength="20"
                autocomplete= "new-password"
                :placeholder="$t('M.comm_please_enter') + $t('M.comm_loginpassword')"
                v-model.trim="password"
                @focus="setErrorMsg('')"
                @keyup.enter="loginForStep1"
                @blur="checkoutInputFormat(1,password)"
              />
            </div>
            <!-- 记住账号 -->
            <div class="remember-username">
              <el-checkbox
                v-model="isRememberUserName"
                class="checkout"
              ><span>{{$t('M.login_tips7')}}</span></el-checkbox>
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
              <!-- 忘记密码 -->
              <router-link
                to="/ForgetPassword"
                class="jump-url text-align-r"
              >
                <!-- 忘记密码 -->
                {{$t('M.login_tips3')}}
              </router-link>
              <span class="middle-line"></span>
              <router-link
                class="jump-url"
                to="/register"
              >
                <!-- 立即注册 -->
                {{$t('M.login_tips4')}}
              </router-link>
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
              <div
                v-if="isBindPhone&&!isBindGoogle"
                class="outer-box"
              >
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
                    @keyup="step3AutoLogin(step3PhoneMsgCode)"
                    @blur="checkoutInputFormat(3,step3PhoneMsgCode)"
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
              <div
                v-if="isBindEmail&&!isBindPhone&&!isBindGoogle"
                class="outer-box"
              >
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
                    @keyup="step3AutoLogin(step3EmailMsgCode)"
                    @keydown="setErrorMsg(3,'')"
                    @blur="checkoutInputFormat(3,step3EmailMsgCode)"
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
                    maxlength="6"
                    v-model="step3GoogleMsgCode"
                    @keyup.enter="loginForStep2"
                    @keyup="step3AutoLogin(step3GoogleMsgCode)"
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
import {
  EMAIL_REG,
  GOOGLE_REG
} from '../utils/regExp' // 正则验证
import {
  loginSocketUrl
  // xDomain
} from '../utils/env'
import {
  userLoginForStep1,
  userLoginForStep2,
  getLoginErcode
} from '../utils/api/user'
import {
  returnAjaxMsg,
  sendPhoneOrEmailCodeAjax,
  getNestedData
} from '../utils/commonFunc'
import {
  getUserAgent,
  detectOS,
  setStore,
  getStore,
  removeStore
} from '../utils'
import socket from '../utils/datafeeds/socket'

// import {getPersonalAssetsList} from '../../kits/globalFunction'
import CountDownButton from '../components/Common/CountDownCommon'
import ErrorBox from '../components/User/ErrorBox'
import ImageValidate from '../components/Common/ImageValidateCommon'
import HeaderCommonForPC from '../components/Common/HeaderCommonForPC'
import HeaderCommonForMobile from '../components/Common/HeaderForMobile'
import IconFont from '../components/Common/IconFontCommon'
import VueClipboard from 'vue-clipboard2'
import Qrcode from '../components/Common/Qrcode'

import {
  mapMutations,
  mapState
} from 'vuex'
import Vue from 'vue'
Vue.use(VueClipboard)
export default {
  components: {
    CountDownButton, // 倒计时组件
    HeaderCommonForPC,
    HeaderCommonForMobile,
    ImageValidate,
    ErrorBox,
    IconFont,
    Qrcode
  },
  data () {
    return {
      loginWithPasswordTipsText: 'M.login_with_password_tips',
      loginWithErcodeTipsText: 'M.login_with_ercode_tips',
      socket: '', // 二维码登录socket
      isErcodeTimeOut: false, // 二维码是否过期
      isScanSuccess: false, // 扫码是否成功
      ercodeTimerCount: 60, // 二维码失效倒计时
      ercodeTimer: null, // 二维码定时器
      isErCodeLogin: false, // 是否扫码登录
      erCodeString: '', // 二维码登录字符串
      username: '',
      password: '',
      userInputImageCode: '', // 图形验证码(用户输入)
      identifyCode: '', // 图片验证码（后台生成）
      step3PhoneMsgCode: '', // 步骤3 手机验证码
      step3EmailMsgCode: '', // 步骤3 邮箱验证码
      step3GoogleMsgCode: '', // 步骤3 谷歌验证码
      hiddenUsername: '', // 隐藏的用户名
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
      confirmWords: this.$t('M.login_verifyTips'), /* 滑块文字 */
      confirmSuccess: false, /* 验证成功判断 */
      sliderFlag: true, // 滑块调用节流阀
      dragStatus: true, // 拖动标记

      /**
        * 移动端拖动
        */
      startX: 0, // 开始时的坐标
      endX: 0, // 结束时的坐标
      moveX: 0, // 移动的坐标
      mobileMaxwidth: 800, // 移动端拖动最大宽度
      loginSliderStatus: false, // 登录页面滑块显示隐藏状态
      loginImageValidateStatus: false, // 登录PersonalCenter页面图片验证码显示隐藏状态
      step3DialogShowStatus: false, // 步骤3 登录状态
      mobileErrorMsg: '', // 移动端错误信息
      // 是否记住密码
      isRememberUserName: false
    }
  },
  created () {
    document.getElementsByTagName('body')[0].style.zoom = 1
    if (this.isLogin) {
      this.$goToPage('/home')
    }
    require('../../static/css/list/User/Login.css')
    this.ENTER_STEP1()
    this.refreshCode()
    this.clearInputValue()
    this.getLocalUserName()
  },
  mounted () {
    $('body').on('mousemove', (e) => {
      if (this.mouseMoveStatus) {
        let width = e.clientX - this.beginClientX
        if (width > 0 && width <= this.maxwidth) {
          $('.handler').css({'left': width})
          $('.drag_bg').css({'width': width})
        } else if (width > this.maxwidth) {
          this.successCallback()
        }
      }
    })
    $('body').on('mouseup', (e) => { // 鼠标放开
      console.log('mouseup')
      this.mouseMoveStatus = false
      let width = e.clientX - this.beginClientX
      if (width < this.maxwidth) {
        $('.handler').animate({'left': 0}, 500)
        $('.drag_bg').animate({'width': 0}, 500)
      }
      $('body').off('mousemove')
      $('body').off('mouseup')
    })
    this.CHANGE_TOKEN_AVAILABILITY(false)
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
      'ENTER_STEP1',
      'ENTER_STEP3',
      'SET_LOGIN_TYPE',
      'SET_STEP1_INFO',
      'SET_USER_BUTTON_STATUS',
      'USER_LOGIN',
      'CHANGE_AJAX_READY_STATUS',
      'CHANGE_TOKEN_AVAILABILITY'
    ]),
    // 获取本地记录密码
    getLocalUserName () {
      let username = getStore('username')
      this.isRememberUserName = Boolean(username)
      console.log(username, this.isRememberUserName)
      if (this.isRememberUserName) {
        this.username = username
      }
    },
    // 登录成功操作
    userLoginSuccess (data) {
      this.USER_LOGIN(data)
      console.log(this.routerTo)
      if (this.routerTo &&
        !this.routerTo.startsWith('/register') &&
        !this.routerTo.startsWith('/login') &&
        !this.routerTo.startsWith('/ForgetPassword') &&
        !this.routerTo.startsWith('/nofind404') &&
        !this.routerTo.startsWith('/500')
      ) {
        this.$goToPage(this.routerTo)
      } else {
        this.$goToPage('/home')
      }
    },
    // 返回登录
    backToScan () {
      this.isScanSuccess = false
      this.refreshCode()
    },
    // 刷新二维码
    async reflashErCode () {
      this.CHANGE_AJAX_READY_STATUS(true)
      this.isScanSuccess = false
      if (this.socket) {
        this.socket.doClose()
      }
      const data = await getLoginErcode()
      if (!data) return false
      this.isErcodeTimeOut = false
      console.log(data)
      this.erCodeString = getNestedData(data, 'data.qrcode')
      this.socket = new socket(this.url = loginSocketUrl + this.erCodeString)
      this.socket.doOpen()
      this.socket.on('open', () => {
        clearInterval(this.ercodeTimer)
        this.socket.send(this.erCodeString)
        this.ercodeTimerCount = 60
        this.ercodeTimer = setInterval(() => {
          if (this.ercodeTimerCount > 0) {
            this.ercodeTimerCount--
          } else {
            clearInterval(this.ercodeTimer)
            this.isErcodeTimeOut = true
          }
        }, 1000)
        this.socket.on('message', (data) => {
          console.log(data)
          let socketData = data
          // 用户已扫码
          if (socketData.scan === 'scaned') {
            this.isScanSuccess = true
          } else if (socketData.scan === 'canceled') {
            this.backToScan()
          }
          // 登录成功
          if (socketData.data && socketData.data.userInfo) {
            this.userLoginSuccess(socketData.data)
          }
        })
      })
      this.CHANGE_AJAX_READY_STATUS(false)
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
            this.setErrorMsg(0, this.$t('M.login_tips5')) // 请输入用户名
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
      let params = new FormData()
      params.append('userName', this.username.toLowerCase())
      this.isRememberUserName ? setStore('username', this.username.toLowerCase()) : removeStore('username')

      if (this.isRememberUserName) {
      } else {
      }
      params.append('password', this.password)
      const data = await userLoginForStep1(params)
      if (!returnAjaxMsg(data, this, 0)) {
        return false
      } else {
        this.SET_STEP1_INFO(data.data.data)
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
              this.successCallback()
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
        userId: this.userInfo.userId
      }
      switch (loginType) {
        case 0:
          params.phone = this.userInfo.phone
          break
        case 1:
          params.email = this.userInfo.email
          break
      }
      sendPhoneOrEmailCodeAjax(loginType, params, this)
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
        // 判断是否需要短信验证或邮箱验证码验证(条件：(异地ip登录||多次登录失败)&&未绑定谷歌验证器)
        if (!this.firstLogin || !this.loginIpEquals || this.isBindGoogle) {
          this.loginImageValidateStatus = false
          this.ENTER_STEP3()
          this.step3DialogShowStatus = true
          if (!this.isBindGoogle) {
            this.autoSendValidateCode()
          }
        }
      }
    },
    // 自动获取验证码
    autoSendValidateCode () {
      let sendType = this.isMobile ? 'mobile' : 'pc'
      let loginType = this.isBindPhone ? 0 : 1
      this.sendPhoneOrEmailCode(sendType, loginType)
    },
    /**
      * 需要输入验证码登录
      */
    async loginForStep2 () {
      if (!this.loginIpEquals && this.firstLogin) {
        // 谷歌验证
        if (this.isBindGoogle) {
          if (!this.step3GoogleMsgCode) {
            this.$message({
              type: 'error',
              message: this.$t('M.comm_please_enter') + this.$t('M.login_google') + this.$t('M.comm_code') // 请输入谷歌验证码
            })
            return false
          }
        }

        if (!this.isBindGoogle && this.isBindPhone && !this.step3PhoneMsgCode) {
          console.log(1)
          this.$message({
            type: 'error',
            message: this.$t('M.comm_please_enter') + this.$t('M.login_telphone') + this.$t('M.comm_code') // '请输入手机验证码'
          })
          return false
        }

        if (!this.isBindGoogle && !this.isBindPhone && this.isBindEmail && !this.step3EmailMsgCode) {
          this.$message({
            type: 'error',
            message: this.$t('M.comm_please_enter') + this.$t('M.comm_emailbox') + this.$t('M.comm_code') // '请输入邮箱验证码'
          })
          return false
        }
      }
      if (this.isBindGoogle && !GOOGLE_REG.test(this.step3GoogleMsgCode)) return false
      let params = {
        phone: this.userInfo.phone,
        phoneCode: this.step3PhoneMsgCode,
        email: this.userInfo.email,
        emailCode: this.step3EmailMsgCode,
        googleCode: this.step3GoogleMsgCode,
        terminal: getUserAgent(),
        os: detectOS()
      }
      const data = await userLoginForStep2(params)
      if (!data) return false
      this.clearInputValue()
      this.step3DialogShowStatus = false
      this.userLoginSuccess(getNestedData(data, 'data'))
    },
    /**
      * 验证码自动提交登录
      */
    step3AutoLogin (targetNum) {
      if (targetNum.length > 6 || targetNum.length == 6) {
        this.loginForStep2()
      }
    },

    /**
      * 滑块验证
      */
    mouseupFn (e) {
    },
    mousedownFn: function (e) {
      this.dragStatus = false
      this.mouseMoveStatus = true
      this.beginClientX = e.clientX
    },
    // 按下滑块函数
    successCallback () {
      if (this.sliderFlag) {
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
         **/
        if (this.failureNum >= 3) {
          // 多次错误登录
          // 显示图片验证码
          this.userInputImageCode = ''
          this.loginImageValidateStatus = true
        } else if (
          this.firstLogin ||
          !this.loginIpEquals ||
          this.isBindGoogle
        ) {
          // 登录第三步(第一次登录、异常ip)
          this.step3DialogShowStatus = true
          if (!this.isBindGoogle) {
            this.autoSendValidateCode()
          }
        } else {
          this.loginForStep2()
        }
      } // 验证成功函数
    },
    /*
    * 移动端拖动事件
    * */
    handleTouchStart (e) {
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
        this.successCallback()
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
      isLogin: state => state.user.isLogin,
      isMobile: state => state.user.isMobile,
      failureNum: state => state.user.loginStep1Info.failNum, // 失败次数
      isBindGoogle: state => state.user.loginStep1Info.isEnableGoogle, // 已绑定谷歌
      isBindEmail: state => state.user.loginStep1Info.isEnableMail, // 已绑定邮箱
      isBindPhone: state => state.user.loginStep1Info.isEnablePhone, // 已绑定手机号
      firstLogin: state => state.user.loginStep1Info.firstLogin, // 是否第一次登录
      loginIpEquals: state => state.user.loginStep1Info.loginIpEquals, // 是否异常ip登录
      token: state => state.user.loginStep1Info.token, // 用户token
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      loginType: state => state.user.loginType, // 登录类型
      disabledOfPhoneBtn: state => state.user.disabledOfPhoneBtn,
      disabledOfEmailBtn: state => state.user.disabledOfEmailBtn,
      disabledOfMobilePhoneBtn: state => state.user.disabledOfMobilePhoneBtn,
      disabledOfMobileEmailBtn: state => state.user.disabledOfMobileEmailBtn,
      routerTo: state => state.common.routerTo // 路由跳转
    }),
    windowHeight () {
      return window.innerHeight
    }
  },
  watch: {
  }
}
</script>
<style scoped lang="scss" type="text/scss">
@import '../../static/css/scss/index.scss';

.login-box.user {
  height: 100%;
  overflow: hidden;
  background: linear-gradient(150deg, rgba(30, 38, 54, 1), rgba(37, 75, 117, 1));

  &.min-height {
    min-height: 1000px;
  }

  > .inner-box {
    &.pc-bg {
      min-width: 1366px;
      background: url('../assets/develop/login-bg.png') 25% center  no-repeat;
    }

    > .pc-er-code-box,
    > .pc-box {
      > .title {
        position: absolute;
        top: -25%;
        left: 22%;
        min-width: 220px;
        height: 35px;
        font-weight: 400;
        font-size: 26px;
        font-family: "MicrosoftYaHei";
        text-align: center;
        color: rgba(51, 143, 245, 1);
        background: linear-gradient(81deg, rgba(77, 122, 255, 1) 25.4638671875%, rgba(58, 184, 255, 1) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    > .pc-box {
      position: relative;
      width: 370px;
      height: 330px;
      padding: 70px 40px;
      margin: 12% 50%;
      border-radius: 10px;
      text-align: left;
      background: linear-gradient(201deg, rgba(42, 88, 137, 1) 0%, rgba(43, 58, 111, 1) 100%);
      box-shadow: 0 4px 21px 0 rgba(26, 42, 71, 1);

      > .toggle-login-type {
        position: absolute;
        top: 0;
        right: 0;
        width: 50px;
        height: 50px;
        background: url(../assets/develop/er-code-icon.png) no-repeat center center;
      }

      /* 扫码登录提示 */
      .tips {
        position: absolute;
        top: 10px;
        right: 50px;
        padding: 8px 15px;
        color: $mainColor;
        background: url(../assets/develop/login-tips-bg.png) no-repeat center center;
        background-size: 100% 100%;
      }

      .step1-btn {
        width: 128px;
        height: 40px;
        border-radius: 20px;
        background: linear-gradient(81deg, rgba(61, 152, 249, 1) 0%, rgba(71, 135, 255, 1) 100%);
        box-shadow: -1px 1px 8px 0 #1a2a47;
      }

      > .login-btn {
        display: block;
        width: 130px;
        height: 40px;
        margin: 0 auto;
        font-weight: 400;
        font-size: 14px;
        line-height: 40px;
        color: rgba(255, 255, 255, 1);

        /* background:rgba(40,68,110,1); */

        /* border-radius:20px; */
      }

      > .login-box {
        font-size: 16px;

        /* 登录第一步 */
        > .login {
          width: 720px;

          > .input-content {
            margin-bottom: 30px;

            &.pwd {
              margin-bottom: 0;
            }

            > .inner-box {
              display: inline-block;
              width: 290px;
              height: 40px;
              padding: 0 20px;
              margin-bottom: 15px;
              border-radius: 20px;
              line-height: 40px;
              vertical-align: middle;
              background: rgba(40, 68, 110, 1);

              > input {
                width: 100%;
                height: 100%;
                color: #fff;

                /* width:290px; */

                /* height:40px; */

                /* border:1px solid; */

                /* border-radius:20px; */

                /* padding:0 20px; */

                /* box-sizing: border-box; */
              }
            }
          }

          > .remember-username {
            margin: 0 0 10px;
            color: $mainColor;

            /deep/ {
              .el-checkbox__inner {
                width: 12px;
                height: 12px;
                background-color: transparent;

                &::after {
                  border-color: $mainColor;
                }
              }

              .el-checkbox__label {
                font-size: 12px;
              }
            }
          }
        }

        /* 登录第三步（短信验证码） */

        /* 错误提示 */
        > .pic-verify {
          width: 100px;
          height: 100px;
          // background-color: pink;
        }
      }

      > .todos {
        width: 290px;
        height: 20px;
        margin: 20px 0;
        overflow: hidden;
        font-weight: 400;
        font-size: 12px;
        font-family: "MicrosoftYaHei";
        text-align: center;
        color: rgba(47, 120, 202, 1);

        > a {
          padding: 0 10px;
          text-align: right;
          color: $mainColor;

          &:last-of-type {
            text-align: left;
          }
        }

        > .middle-line {
          display: inline-block;
          width: 1px;
          height: 10px;
          line-height: 10px;
          vertical-align: middle;
          background-color: $mainColor;
        }
      }

      /* 图片验证码提示框 */
      .image-dialog {
        .title {
          margin-bottom: 25px;
          color: #fff;
        }

        .content {
          width: 600px;

          /* width: 16rem; */

          /* background: red; */
          > .inner-box {
            display: inline-block;

            /* border-right-color: transparent; */
            box-sizing: border-box;
            width: 410px;
            height: 44px;
            padding: 0;
            border: 1px solid rgba(72, 87, 118, 1);
            border-radius: 4px;

            &.submit-box {
              margin-top: 45px;
              border: none;

              > .subimt {
                display: inline-block;
                width: 410px;
                height: 40px;
                border-radius: 4px;
                color: #fff;
                background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
              }
            }

            > .image-validate {
              box-sizing: border-box;
              width: 324px;
              height: 100%;
              padding: 0 20px;
              vertical-align: top;
              color: #fff;
            }

            > .refresh-code-btn {
              display: inline-block;
              width: 80px;
              height: 42px;
              overflow: hidden;
            }
          }
        }
      }

      /* 短信验证码、邮箱验证码、谷歌验证码 */
      .msg-email-google-dialog {
        .outer-box {
          padding: 0 10px;

          > .inner-box {
            display: inline-block;
            width: 410px;
            height: 44px;

            /* padding: 0 10px; */
            margin: 30px 0;
            line-height: 44px;
            vertical-align: middle;

            > .input {
              display: block;
              box-sizing: border-box;
              width: 410px;
              height: 44px;
              padding: 0 20px;
              border: 1px solid rgba(72, 87, 118, 1);
              border-radius: 4px;
              color: #fff;
              background: rgba(26, 34, 51, 1);
            }

            /* 发送信息按钮 */
            > .send-code-btn {
              display: block;
              padding: 0 20px;
              margin: 5px 0 0;
              color: $upColor;
            }
          }
        }

        .login-btn {
          width: 410px;
          height: 40px;
          margin: 10px 10px 20px;
          border-radius: 4px;
          font-size: 14px;
          color: #fff;
          background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
        }
      }

      /* 滑块 */
      .drag-box {
        width: 410px;
        overflow: hidden;

        > .drag {
          position: relative;
          width: 410px;
          height: 50px;
          border: 1px solid #4e5b85;
          line-height: 50px;
          text-align: center;
          background-color: #1e2235;
          cursor: pointer;

          > .drag_bg {
            height: 48px;
            background-color: #1f2943;
          }

          > .drag_text {
            position: absolute;
            top: 0;
            width: 410px;
            font-size: 16px;
            background: -webkit-gradient(linear, left top, right top, color-stop(0, #61688a), color-stop(.4, #61688a), color-stop(.5, #fff), color-stop(.6, #61688a), color-stop(1, #61688a));
            -webkit-background-clip: text;
            -webkit-animation: slidetounlock 3s infinite;
            -moz-user-select: none;
            -webkit-user-select: none;
            -o-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -webkit-text-fill-color: transparent;
            -webkit-text-size-adjust: none;
          }

          > .handler_bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 70px;
            height: 48px;
            border-radius: 0 3px 3px 0;
            background: #485776 url(../assets/develop/arrow-bg.png) no-repeat center center;

            /* border: 1px solid #ccc; */
            cursor: move;

            .icon-text {
              font-size: 14px;
              color: rgba(222, 225, 234, 1);
            }
          }

          @keyframes slidetounlock {
            0% {
              background-position: -200px 0;
            }

            100% {
              background-position: 200px 0;
            }
          }
        }
      }
    }

    > .pc-er-code-box {
      position: relative;
      width: 370px;
      height: 330px;
      padding: 50px 40px;
      margin: 12% 50%;
      border-radius: 10px;
      text-align: center;
      background: linear-gradient(201deg, rgba(42, 88, 137, 1) 0%, rgba(43, 58, 111, 1) 100%);
      box-shadow: 0 4px 21px 0 rgba(26, 42, 71, 1);

      &::before {
        position: absolute;
        z-index: 2;
        top: 18px;
        right: 4px;
        width: 70px;
        height: 40px;
        transform: rotateZ(45deg);
        content: '';
      }

      > .mask-box {
        position: absolute;
        z-index: 3;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(42, 83, 133, .9);

        > button {
          color: #fff;

          > .reflash-icon {
            display: block;
            box-sizing: border-box;
            width: 50px;
            height: 50px;
            padding: 10px;
            margin: 110px auto 22px;
            border-radius: 50%;
            color: $mainColor;
            background-color: #fff;
          }
        }
      }

      /* 切换图标 */
      > .toggle-login-type {
        position: absolute;
        top: 0;
        right: 0;
        width: 50px;
        height: 50px;
        background: url(../assets/develop/pc-login-icon.png) no-repeat center center;
      }

      /* 扫码登录提示 */
      .login-tips {
        position: absolute;
        top: 10px;
        right: 50px;
        padding: 8px 15px;
        color: $mainColor;
        background: url(../assets/develop/login-tips-bg.png) no-repeat center center;
        background-size: 100% 100%;
      }

      > .scan-box {
        > .inner-title {
          height: 50px;
          text-align: center;
          color: rgba(255, 255, 255, 1);
        }

        > .tips {
          height: 50px;
          margin-top: 10px;
          color: #fff;
        }

        .ercode {
          box-sizing: border-box;
          width: 174px;
          height: 174px;
          padding: 5px;
          margin: 0 auto;
          background-color: #fff;
        }
      }

      > .scan-success {
        position: relative;

        > .icon-cellphoneiphone {
          font-size: 156px;
          color: #26416e;
        }

        > .icon-chenggong {
          position: absolute;
          top: 28%;
          left: 49%;
          font-size: 26px;
          color: #008069;
          transform: translate(-50%, -50%);
        }

        > .tips {
          margin-top: 20px;
          color: #fff;

          > p {
            font-size: 12px;
            line-height: 20px;
          }
        }

        > .back-to-scan {
          margin-top: 20px;
          font-size: 12px;
          color: $mainColor;
        }
      }
    }

    > .mobile-box {
      box-sizing: border-box;
      width: 100%;
      padding: 0 1rem;
      margin: 120px auto;
      font-size: 30px;

      > .mobile-inner-box {
        width: 100%;

        > .login-box-step1 {
          width: 100%;

          > .input-item {
            width: 100%;
            height: 3rem;
            margin-bottom: 3rem;

            &.login-btn {
              margin-bottom: 1rem;
            }

            > input,
            > button {
              box-sizing: border-box;
              width: 100%;
              height: 3rem;
              padding: 0 40px;
              border-radius: .4rem;
              font-size: 1rem;
              color: #fff;
              background: #28446e;
            }

            > .login-btn {
              border-radius: 20px;
              background: linear-gradient(81deg, rgba(61, 152, 249, 1) 0%, rgba(71, 135, 255, 1) 100%);
              box-shadow: 1px 1px 8px 0 rgba(26, 42, 71, 1);
            }

            &.password {
              margin-bottom: 1rem;
            }
          }

          > .remember-username {
            margin-bottom: 2rem;
            color: $mainColor;

            /deep/ {
              .el-checkbox__inner {
                width: .6rem;
                height: .6rem;
                font-size: .8rem;
                background-color: transparent;

                &::after {
                  top: -5px;
                  width: .4rem;
                  height: .5rem;
                  border-color: $mainColor;
                }
              }

              .el-checkbox__label {
                font-size: .8rem;
                vertical-align: middle;
              }
            }
          }

          > .error-msg {
            margin-bottom: 1rem;
            font-size: 1rem;
            color: #d45858;
          }

          > .todos {
            text-align: center;

            > a {
              display: inline-block;
              padding: 0 .2rem;
              text-align: right;
              vertical-align: middle;
            }

            > .middle-line {
              display: inline-block;
              width: 4px;
              height: 1rem;
              line-height: 10px;
              vertical-align: middle;
              background-color: $mainColor;
            }

            > .jump-url {
              font-size: 1rem;
              text-align: left;
              color: rgba(47, 120, 202, 1);
            }
          }
        }

        /* 图片盒子 */
        > .img-verify {
          .pic-verify {
            > .title {
              margin-bottom: 25px;
              font-size: 1rem;
              color: #fff;
            }

            > .content {
              /* width: 600px; */

              /* width:16rem; */
              width: 1000px;

              > .inner-box {
                display: inline-block;

                /* border-right-color: transparent; */
                box-sizing: border-box;
                width: 1000px;

                /* width: 410px; */
                height: 160px;
                padding: 0;
                border: 1px solid #485776;
                border-radius: 4px;
                line-height: 160px;

                &.submit-box {
                  margin-top: 45px;
                  border: none;

                  > .submit {
                    display: inline-block;
                    width: 1000px;
                    height: 160px;
                    border-radius: 4px;
                    font-size: .7rem;
                    color: #fff;
                    background: linear-gradient(81deg, #2b396e 0%, #2a5082 100%);
                  }
                }

                > .input {
                  box-sizing: border-box;
                  width: 754px;
                  height: 100%;
                  padding: 0 40px;
                  font-size: .7rem;
                  vertical-align: top;
                  color: #fff;
                }

                > .refresh-code-btn {
                  display: inline-block;
                  width: 240px;
                  height: 160px;
                  overflow: hidden;
                }
              }
            }
          }
        }

        /* 短信验证码、邮箱验证码、谷歌验证码 */
        .msg-email-google-dialog {
          .outer-box {
            padding: 0 10px;
            font-size: .7rem;

            > .inner-box {
              display: inline-block;
              width: 1000px;
              height: 160px;

              /* padding: 0 10px; */
              margin: 30px 0;
              line-height: 160px;
              vertical-align: middle;

              > .input {
                display: block;
                box-sizing: border-box;
                width: 1000px;
                height: 160px;
                padding: 0 40px;
                border: 1px solid rgba(72, 87, 118, 1);
                border-radius: 4px;
                font-size: .7rem;
                color: #fff;
                background: rgba(26, 34, 51, 1);
              }

              /* 发送信息按钮 */
              > .send-code-btn {
                display: block;
                padding: 0 20px;
                margin: 5px 0 0;
                font-size: .7rem;
                color: $upColor;
              }
            }
          }

          .login-btn {
            width: 1000px;
            height: 160px;
            margin: 1rem 10px 20px;
            border-radius: 4px;
            font-size: .7rem;
            color: #fff;
            background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
          }
        }
      }

      /* 登录 */

      /* 滑块验证 */
      .slider {
        width: 100%;
      }
    }
  }
}
</style>
