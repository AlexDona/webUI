<template>
  <div
    class="register-box user"
    :class="{
      'day':theme == 'day',
      'night':theme == 'night',
      'min-height':windowHeight < 800
      }"
    :style="{height: windowHeight + 'px'}"
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-background="rgba(0, 0, 0, 0.6)"
  >
    <keep-alive>
      <HeaderCommonForPC
        v-if="!isMobile"
      />
      <HeaderCommonForMobile
        v-else
      />
    </keep-alive>
    <!--注册页面-->
    <div
      class="inner-box"
      :class="{'pc-bg': !isMobile}"
      v-if="!isRegisterSuccess"
    >
      <!--<img v-webp="'../assets/develop/about-us.png',webp:'../assets/webp/banner1.webp'" />-->

      <!--注册(pc端)-->
      <div
        class="main-box pc-box"
        v-if="!isMobile&&!isRegisterSuccess"
      >
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
          enter-active-class="animated fadeIn"
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
               @keydown="setErrorMsg('')"
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
                  v-model="activeCountryAbbreviationWithEmail"
                  v-show="language=='zh_CN'"
                >
                  <el-option
                    v-for="item in contryAreaList"
                    :key="item.nationCode"
                    :label="item.chinese"
                    :value="item.abbreviation"
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
                  v-model="activeCountryAbbreviationWithEmail"
                  v-show="language!=='zh_CN'"
                >
                  <el-option
                    v-for="item in contryAreaList"
                    :key="item.nationCode"
                    :label="item.english"
                    :value="item.abbreviation"
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
               @keydown="setErrorMsg('')"
             >
           </div>
          </div>
        </div>
        </transition>
        <!--公共部分-->
        <div class="inner-content common">
          <div class="input">
            <div class="inner-box">
              <!--邮箱、手机验证码-->
              <input
                type="text"
                class="input image-validate"
                :placeholder="$t(activeCodePlaceholder)"
                v-model="checkCode"
                @keydown="setErrorMsg('')"
                @blur="checkoutInputFormat(3,checkCode)"
              >
              <span class="middle-line"></span>
              <CountDownButton
                v-if="!activeMethod"
                :status="disabledOfPhoneBtn"
                class="send-code-btn cursor-pointer"
                @run="sendPhoneOrEmailCode(activeMethod)"
              />
              <CountDownButton
                v-else
                :status="disabledOfEmailBtn"
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
               @keydown="setErrorMsg('')"
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
               @keydown="setErrorMsg('')"
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
               :disabled="inviterDisabled"
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
               <a
                 class="main-color"
                 @click.prevent="jumpToOtherPage('/ServiceAndProtocol','UserProtocol')"
               >
                 <!--《用户协议》-->
                 {{ $t('M.forgetPassword_hint7') }}
               </a>
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
          <!--<button-->
            <!--class="register-btn btn cursor-pointer"-->
            <!--@click="sendRegister"-->
          <!--&gt;-->
            <button
            class="register-btn btn cursor-pointer"
            @click="showSliderBox"
          >
            <!--注册-->
            {{ $t('M.comm_register_time') }}
          </button>
        </div>
      </div>
      <!--注册（移动端）-->
      <div
        class="mobile-box"
        v-if="isMobile"
      >
        <!--邀请头部(用户邀请链接的时候有)-->
        <div
          class="invitation-box"
          v-if="inviter"
        >
          <div class="left"></div>
          <div class="right">
            <p class="main-text">现在注册即送好礼</p>
            <p class="sub-text">FUBT 安全便捷的比特币交易平台</p>
          </div>
        </div>
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
          enter-active-class="animated fadeIn"
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
                  type="number"
                  class="input mobile-phone"
                  :placeholder="$t('M.user_security_phone') + $t('M.user_security_number')"
                  v-model="phoneNum"
                  @keydown="setErrorMsg('')"
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
                  v-model="activeCountryAbbreviationWithEmail"
                  v-show="language=='zh_CN'"
                >
                  <el-option
                    v-for="item in contryAreaList"
                    :key="item.nationCode"
                    :label="item.chinese"
                    :value="item.abbreviation"
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
                  v-model="activeCountryAbbreviationWithEmail"
                  v-show="language!=='zh_CN'"
                >
                  <el-option
                    v-for="item in contryAreaList"
                    :key="item.nationCode"
                    :label="item.english"
                    :value="item.abbreviation"
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
                  @keydown="setErrorMsg('')"
                >
              </div>
            </div>
          </div>
        </transition>
        <!--公共部分-->
        <div class="inner-content common">
          <div class="input">
            <div class="inner-box">
              <!--邮箱、手机验证码-->
              <input
                type="text"
                class="input image-validate"
                :placeholder="$t(activeCodePlaceholder)"
                v-model="checkCode"
                @keydown="setErrorMsg('')"
                @blur="checkoutInputFormat(3,checkCode)"
              >
              <span class="middle-line"></span>
              <CountDownButton
                v-if="!activeMethod"
                :status="disabledOfPhoneBtn"
                class="send-code-btn cursor-pointer"
                @run="sendPhoneOrEmailCode(activeMethod)"
              />
              <CountDownButton
                v-else
                :status="disabledOfEmailBtn"
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
                @keydown="setErrorMsg('')"
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
                @keydown="setErrorMsg('')"
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
                :disabled="inviterDisabled"
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
                <a
                  class="main-color"
                  @click.prevent="jumpToOtherPage('/ServiceAndProtocol','UserProtocol')"
                >
                  <!--《用户协议》-->
                  {{ $t('M.forgetPassword_hint7') }}
                </a>
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
          <!--<button-->
          <!--class="register-btn btn cursor-pointer"-->
          <!--@click="sendRegister"-->
          <!--&gt;-->
          <button
            class="register-btn btn cursor-pointer"
            @click="showSliderBox"
          >
            <!--注册-->
            {{ $t('M.comm_register_time') }}
          </button>
        </div>
      </div>
      <!--滑块验证 : 验证(pc端)-->
      <el-dialog
        :title="$t('M.login_slideBlock') + $t('M.login_verify')"
        :close-on-click-modal="false"
        :visible.sync="registerSliderStatus"
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
      <!--滑块验证（移动端）-->
      <div
        class="slider"
        v-if="isMobile"
      >
        <!-- 验证 -->
        <el-dialog
          :title="$t('M.login_slideBlock') + $t('M.login_verify')"
          :close-on-click-modal="false"
          :visible.sync="registerSliderStatus"
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
    </div>
    <!--普通注册成功-->
    <div
      class="inner-box"
      v-if="isRegisterSuccess&&!isMobile"
    >
      <div
        class="success-box"
      >
        <div class="img">
          <!--<IconFontCommon-->
            <!--class="icon-color"-->
            <!--iconName="icon-dui1"-->
          <!--/>-->
          <img src="../assets/develop/register-success.png">
          <p>注册成功</p>
        </div>
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
    <!-- 邀请注册成功 -->
    <div
      class="invitation-success"
      v-if="isRegisterSuccess && isMobile"
    >
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="invitationRegisterSuccess"
        :show-close="false"
        class="invitation-success-dialog"
      >
        <p class="main-tips">注册成功！</p>
        <p
          class="sub-tips"
          v-if="inviter"
        >
          奖励已发送到我的账户
        </p>
        <button
          class="confirm-btn"
          @click="jumpToDownAppPage"
        >
          我知道了 <span>({{successCountDown}})</span>
        </button>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import ImageValidate from '../components/Common/ImageValidateCommon'
import CountDownButton from '../components/Common/CountDownCommon'
import HeaderCommonForMobile from '../components/Common/HeaderForMobile'
import HeaderCommonForPC from '../components/Common/HeaderCommonForPC'
import IconFontCommon from '../components/Common/IconFontCommon'
import {
  sendRegisterUser,
  checkUserExist
} from '../utils/api/user'
import {
  returnAjaxMessage, // 接口返回信息
  validateNumForUserInput, // 用户输入验证
  sendPhoneOrEmailCodeAjax,
  jumpToOtherPageForFooter
} from '../utils/commonFunc'
import {createNamespacedHelpers, mapState} from 'vuex'
const {mapMutations} = createNamespacedHelpers('user')
export default {
  components: {
    ImageValidate,
    CountDownButton,
    HeaderCommonForMobile,
    HeaderCommonForPC,
    IconFontCommon
  },
  // props,
  data () {
    return {
      fullscreenLoading: false, // 整页loading
      activeMethod: 0, // 当前注册方式： 0： 手机注册 : 1 邮箱注册
      // contryAreaList: [], // 国家区域列表
      activeCountryCodeWithPhone: '86',
      activeCountryCodeWithEmail: '86',
      activeCountryAbbreviationWithEmail: 'CHN', // 当前国家简称
      // 短信验证码 邮箱验证码
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
      registerSliderStatus: false, // 滑块验证显示状态
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
      inviterDisabled: '', // 注册邀请码提示框禁用状态
      /**
       * 移动端拖动
       */
      touchStatus: false,
      startX: 0, // 开始时的坐标
      timer: null,
      endX: 0, // 结束时的坐标
      moveX: 0, // 移动的坐标
      mobileMaxwidth: 800, // 移动端拖动最大宽度
      invitationRegisterSuccess: true, // 邀请注册成功
      registerParams: {}, // 注册参数
      end: '' // 占位
    }
  },
  created () {
    if (this.isLogin) {
      this.USER_LOGOUT()
    }
    require('../../static/css/list/User/Register.css')
    // changeLang({'lan': 'zh_CN'})
    let params = this.$route.query.showId
    console.log(params)
    if (params) {
      this.inviter = params
      this.inviterDisabled = true
    }
    this.refreshCode()
  },
  mounted () {
    $('body').on('mousemove', (e) => {
      if (this.mouseMoveStata) {
        var width = e.clientX - this.beginClientX
        if (width > 0 && width <= this.maxwidth) {
          $('.handler').css({'left': width})
          $('.drag_bg').css({'width': width})
        } else if (width > this.maxwidth) {
          this.successFunction(this.registerParams)
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
    })
  },
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'SET_USER_BUTTON_STATUS',
      'USER_LOGOUT'
    ]),
    jumpToDownAppPage () {
      if (this.inviter) {
        this.$router.push({'path': '/downloadApp'})
      } else {
        this.$router.push({'path': '/login'})
      }
    },
    jumpToOtherPage (router, activeName) {
      jumpToOtherPageForFooter(router, activeName, this)
    },
    // 检测输入格式
    checkoutInputFormat (type, targetNum) {
      // console.log(type)
      switch (type) {
        // 手机号
        case 0:
          // console.log(validateNumForUserInput('phone', targetNum))
          switch (validateNumForUserInput('phone', targetNum)) {
            case 0:
              this.setErrorMsg('')
              this.$forceUpdate()
              return 1
            case 1:
              // 请输入手机号
              this.setErrorMsg(this.$t('M.comm_please_enter') + this.$t('M.user_security_phone'))
              this.$forceUpdate()
              return 0
          }
          break
        // 邮箱验证
        case 1:
          switch (validateNumForUserInput('email', targetNum)) {
            case 0:
              this.setErrorMsg('')
              this.$forceUpdate()
              return 1
            case 1:
              // 请输入邮箱地址
              this.setErrorMsg(this.$t('M.comm_please_enter') + this.$t('M.user_security_email') + this.$t('M.comm_site'))
              this.$forceUpdate()
              return 0
            case 2:
              // 请输入正确的邮箱地址
              this.setErrorMsg(this.$t('M.comm_please_enter') + this.$t('M.user_security_correct') + this.$t('M.user_security_email'))
              this.$forceUpdate()
              return 0
          }
          break
        // 短信、邮箱验证码
        case 3:
          if (!targetNum) {
            // 请输入 短信验证码 邮箱验证码
            const str = this.$t('M.comm_please_enter') + (!this.activeMethod ? this.$t('M.forgetPassword_hint10') : this.$t('M.forgetPassword_hint11'))
            this.setErrorMsg(str)
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg('')
            this.$forceUpdate()
            return 1
          }
        // 密码
        case 4:
          switch (validateNumForUserInput('password', targetNum)) {
            case 0:
              this.setErrorMsg('')
              this.$forceUpdate()
              return 1
            case 1:
              // 请输入密码
              this.setErrorMsg(this.$t('M.comm_please_enter') + this.$t('M.user_security_password'))
              this.$forceUpdate()
              return 0
            case 2:
              // 请输入 8-20 位字母和数字组合
              this.setErrorMsg(this.$t('M.user_security_info1'))
              this.$forceUpdate()
              return 0
          }
          break
        // 确认密码
        case 5:
          if (!targetNum) {
            // 请输入确认密码
            this.setErrorMsg(this.$t('M.comm_please_enter') + this.$t('M.forgetPassword_affirm_password'))
            this.$forceUpdate()
            return 0
          } else if (targetNum === this.password) {
            this.setErrorMsg('')
            this.$forceUpdate()
            return 1
          } else {
            // 密码不一致，请重新确认
            this.setErrorMsg(this.$t('M.user_security_info2'))
            this.$forceUpdate()
            return 0
          }
        // 用户协议
        case 6:
          if (!targetNum) {
            // 请勾选用户协议
            this.setErrorMsg(this.$t('M.forgetPassword_hint13'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg('')
            this.$forceUpdate()
            return 1
          }
      }
    },
    // 设置错误信息
    setErrorMsg (msg) {
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
    // 发送验证码（短信、邮箱）
    sendPhoneOrEmailCode (type) {
      let activeAbbreviation = _.filter(this.contryAreaList, {abbreviation: this.activeCountryAbbreviationWithEmail})[0].abbreviation
      this.activeCountryCodeWithEmail = _.filter(this.contryAreaList, {abbreviation: this.activeCountryAbbreviationWithEmail})[0].nationCode
      console.log(_.filter(this.contryAreaList, {abbreviation: this.activeCountryAbbreviationWithEmail})[0])
      // console.log(this.activeCountryCodeWithEmail)
      if (this.disabledOfPhoneBtn || this.disabledOfEmailBtn) {
        return false
      }
      let params = {
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
          params.nationCode = this.activeCountryCodeWithPhone
          break
        case 1:
          if (!this.checkoutInputFormat(type, this.emailNum)) {
            return false
          }
          params.email = this.emailNum
          params.abbreviation = activeAbbreviation
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
    // 滑块验证
    showSliderBox () {
      const regType = this.activeMethod ? 'email' : 'phone'
      let goOnStatus = 0
      if (regType === 'phone') {
        if (this.checkoutInputFormat(0, this.phoneNum)) {
          goOnStatus = 1
        } else {
          return false
        }
      } else {
        if (this.checkoutInputFormat(1, this.emailNum)) {
          goOnStatus = 1
        } else {
          return false
        }
      }
      if (
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
        this.registerParams = {
          userName: userName,
          password: this.password,
          checkCode: this.checkCode,
          inviter: this.inviter,
          regType: regType,
          country: countryCode
        }
        // 显示滑块验证
        this.sliderFlag = true
        this.registerSliderStatus = true
        $('body').on('mousedown', (e) => {
        })
        $('body').on('mousemove', (e) => { // 拖动，这里需要用箭头函数，不然this的指向不会是vue对象
          if (this.mouseMoveStatus) {
            var width = e.clientX - this.beginClientX
            if (width > 0 && width <= this.maxwidth) {
              $('.handler').css({'left': width})
              $('.drag_bg').css({'width': width})
            } else if (width > this.maxwidth) {
              this.successFunction(this.registerParams)
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
    // 发送注册申请
    async sendRegister (params) {
      this.fullscreenLoading = true // loading
      try {
        const data = await sendRegisterUser(params)
        console.log(data)
        if (!returnAjaxMessage(data, this, 0)) {
          this.fullscreenLoading = false // loading
          return false
        } else {
          this.fullscreenLoading = false // loading
          this.isRegisterSuccess = true
          this.successJump()
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 登录成功自动跳转
    successJump () {
      setInterval(() => {
        if (this.successCountDown === 0) {
          this.jumpToDownAppPage()
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
      this.setErrorMsg('')
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
        this.successFunction(this.registerParams)
      }
    },
    handleTouchEnd (e) {
      // console.log('end');
      this.endX = e.changedTouches[0].pageX
      $(e.target).animate({'left': 0}, 500)
    },
    // 按下滑块函数
    async successFunction (params) {
      // console.log('success0')
      if (this.sliderFlag) {
        // console.log('success1')
        this.sliderFlag = false// 调用函数节流阀
        $('.handler').css({'left': this.maxwidth})
        $('.drag_bg').css({'width': this.maxwidth})
        $('body').unbind('mousemove')
        $('body').unbind('mouseup')
        this.confirmSuccess = true
        this.registerSliderStatus = false
        this.mouseMoveStatus = false
        $('.handler').css({'left': 0})
        $('.drag_bg').css({'width': 0})
        let type = !this.activeMethod ? 'phone' : 'email'
        let userName = !this.activeMethod ? this.phoneNum : this.emailNum
        await this.checkUserExistAjax(type, userName)
        await this.sendRegister(params)
      } // 验证成功函数
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      isLogin: state => state.user.isLogin,
      isMobile: state => state.user.isMobile,
      language: state => state.common.language,
      contryAreaList: state => state.common.contryAreaList,
      disabledOfPhoneBtn: state => state.user.disabledOfPhoneBtn,
      disabledOfEmailBtn: state => state.user.disabledOfEmailBtn
      // activeCountryCodeWithPhone: state => state.user.countryCode // 国籍码
    }),
    activeCodePlaceholder () {
      return !this.activeMethod ? 'M.forgetPassword_hint10' : 'M.forgetPassword_hint11'
    },
    windowHeight () {
      console.log(window.innerHeight)
      return window.innerHeight
    }
  },
  watch: {
    isMobile (newVal) {
      console.log(newVal)
    },
    activeMethod (newVal) {
      this.$store.commit('common/SET_COUNT_DOWN_RESET_STATUS', true)
    },
    disabledOfPhoneBtn (newVal) {
      // console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss">
  @import '../../static/css/scss/index';
  .register-box{
    width:100%;
    height:100%;
    overflow-y: auto;
    background:linear-gradient(150deg,rgba(30,38,54,1),rgba(37,75,117,1));
    &.min-height{
      min-height:1000px;
    }
    >.inner-box{
      width:100%;
      height:100%;
      &.pc-bg{
        background:url('../assets/develop/login-bg.png') 25% 4%  no-repeat ;
      }
      /*background:url('../assets/develop/login-bg.png')  ;*/
      .main-color{
        color:$mainColor;
      }
      /*pc端*/
      >.pc-box{
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
          }
          >.error-msg{
            height:30px;
            line-height: 50px;
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
          >.register-btn{
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
      /*移动端*/
      >.mobile-box{
        font-size: 0.8rem;
        padding: 0 1rem;
        box-sizing: border-box;
        width:100%;
        height:100%;
        /*邀请头部*/
        >.invitation-box{
          width:100%;
          height:6.6rem;
          display: flex;
          >.left{
            flex:1;
            height:100%;
            background:url(../assets/develop/register-small-url.png) no-repeat center center;
            background-size: 102%;
          }
          >.right{
            flex:2;
            height:100%;
            color:#fff;
            padding-left:1rem;
            >.main-text{
              margin-top:1.8rem;
              font-size: .68rem;
              font-weight: 500;
            }
            >.sub-text{
              font-size: 0.5rem;
              line-height: 1.5rem;
            }
          }
        }
        /*登录方式切换*/
        >.methods-list{
          width:100%;
          >.method-item{
            display:inline-block;
            width:49%;
            height:1.8rem;
            line-height:1.5rem;
            text-align: center;
            color:#c3c3c3;
            font-size: .5rem;
            &.active{
              color:$mainColor;
              font-size: .8rem;
            }
          }
        }
        >.inner-content{
          >.input{
            width:100%;
            >.inner-box{
              background-color: #28446e;
              height:3rem;
              width:100%;
              padding:0 5px 0 1rem;
              margin-bottom:.4rem;
              display: inline-block;
              vertical-align: middle;
              /*background:rgba(32,55,90,1);*/
              /*background:red;*/
              border-radius:20px;
              &.user-agreement{
                background: none;
                padding:0;
                height:20px;
                margin-bottom:0;
                font-size: 0.8rem;
              }
              >.input{
                font-size: 0.8rem;
                &::-webkit-input-placeholder{
                  color:#8B9197;
                }
                width:100%;
                height:100%;
                color:#fff;
                &.image-validate{
                  width:56%;
                  vertical-align: top;
                }
                &.mobile-phone{
                  width:70%;
                }
              }
              >.middle-line{
                width:1px;
                height:50%;
                display: inline-block;
                background:rgb(55,86,131);
                vertical-align: middle;
                /*margin:10px 5px 0 0;*/
              }
              >.send-code-btn{
                color:$mainColor;
                height:3rem;
                line-height: 3rem;
                text-align: center;
                font-size: 0.8rem;
                /*width:66px;*/
              }
            }
          }
          >.error-msg{
            height:2.8rem;
            line-height: 5rem;
            margin-left: 30px;
            font-size: 0.8rem;
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
          >.register-btn{
            width:100%;
            height:3rem;
            margin:2rem auto 2rem;
            padding:0 5px 0 20px;
            display:block;
            font-size: 1rem;
            background:linear-gradient(81deg,rgba(61,152,249,1) 0%,rgba(71,135,255,1) 100%);
            border-radius:20px;
            box-shadow:2px 2px 8px 0px rgba(26,42,71,1);
            color:#fff;
          }
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
            background: #485776 url(../assets/develop/arrow-bg.png) no-repeat center center;
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
      >.success-box{
        width:240px;
        height:300px;
        text-align: center;
        margin:300px auto;
        >.img{
          width:140px;
          height:140px;
          background-color: $mainColor;
          border-radius: 50%;
          margin:0 auto 30px;
          color:#fff;
          >img{
            margin-top:20px;
            width:50%;
          }
          >.icon-color{
            font-size: 100px;
          }
        }
        >.title{
          >span{
            font-weight: 700;
            font-size: 18px;
          }
          width:240px;
          height:16px;
          font-size:14px;
          font-family:MicrosoftYaHei-Bold;
          color:rgba(51,143,245,1);
        }
        >.jump-login{
          width:150px;
          height:40px;
          font-size: 18px;
          background:rgba(51,143,245,.5);
          border-radius:4px;
          margin:50px auto;
          color:#fff;
        }
      }
    }
    >.invitation-success{
      .main-tips{
        font-size: .5rem;
        margin-bottom:.4rem;
        color:#fff;
      }
      .sub-tips{
        font-size: .4rem;
        color:#fff;
        margin-bottom:.4rem;
      }
      .confirm-btn{
        width:550px;
        height:75px;
        color:#fff;
        background:$mainColor;
        border-radius:5px;
        font-size: .4rem;
        >span{
          font-size: .3rem;
        }
      }
    }
  }
</style>
