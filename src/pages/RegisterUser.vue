<template>
  <div
    class="register-box user"
    :class="{
      'day':$theme_S_X == 'day',
      'night':$theme_S_X == 'night',
      'min-height':windowHeight < 800,
      'margin-top':isMobile?'0':'50px',
      'pc-bg': !isMobile
      }"
    :style="{height: windowHeight + 'px'}"
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
      <!--注册(pc端)-->
      <div
        class="main-box pc-box"
        v-if="!isMobile&&!isRegisterSuccess"
      >
        <!-- 欢迎注册 -->
        <h1 class="title">{{$t('M.login_welcome_register')}}</h1>
        <!--切换注册方式-->
        <ul class="methods-list">
          <li
            class="method-item cursor-pointer"
            :class="{active:!activeMethod}"
            @click="toggleMethod(0)"
          >
            <!--手机注册-->
            {{ $t('M.user_security_phone1') }}
          </li>
          <li
            class="method-item cursor-pointer"
            :class="{active:activeMethod}"
            @click="toggleMethod(1)"
          >
            <!--邮箱注册-->
            {{ $t('M.user_security_email1') }}
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
                 v-for="item in countryAreaList"
                 :key="item.english"
                 :label="item.nationCode"
                 :value="item.nationCode"
               >
                <span style="float: left;">
                  <span v-show="language==='zh_CN'">
                    {{ item.chinese }}
                  </span>
                  <span v-show="language!=='zh_CN'">
                    {{item.english}}
                  </span>
                </span>
                 <span style=" float: right;
                    font-size: 13px;
                    color: #8492a6;
                    "
                 >{{ item.nationCode }}</span>
               </el-option>
             </el-select>
             <span class="middle-line"></span>
             <!--手机号码-->
             <input
               type="text"
               class="input mobile-phone"
               :placeholder="$t('M.user_security_phone') + $t('M.user_security_number')"
               :ref="phoneRef"
               @keyup="phoneNumRegexpInput(phoneRef)"
               @input="phoneNumRegexpInput(phoneRef)"
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
                    v-for="item in countryAreaList"
                    :key="item.english"
                    :label="item.chinese"
                    :value="item.abbreviation"
                  >
                    <span style="float: left;">
                      <span>
                        {{ item.chinese }}
                      </span>
                    </span>
                    <span style=" float: right;
                      font-size: 13px;
                      color: #8492a6;
                      "
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
                    v-for="item in countryAreaList"
                    :key="item.english"
                    :label="item.english"
                    :value="item.abbreviation"
                  >
                    <span style="float: left;">
                      <span>
                        {{item.english}}
                      </span>
                    </span>
                    <span style=" float: right;
                      font-size: 13px;
                      color: #8492a6;
                      "
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
               @keydown="setErrorMsg()"
               @blur="checkoutInputFormat(1,emailNum)"
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
                ref="checkCode"
                @keydown="setErrorMsg()"
                @keyup="positiveIntegerNumRegexpInputLimit('checkCode')"
                @input="positiveIntegerNumRegexpInputLimit('checkCode')"
                maxlength="6"
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
               autocomplete= "new-password"
               class="input"
               :placeholder="$t('M.login_welcome_register_pwd1')"
               v-model="password"
               @keydown="setErrorMsg()"
               @blur="checkoutInputFormat(4,password)"
               onpaste="return false"
             >
           </div>
          </div>
          <div class="input">
           <div class="inner-box">
             <!--确认密码-->
             <!--请再次输入密码-->
             <input
               type="password"
               autocomplete= "new-password"
               class="input"
               :placeholder="$t('M.login_welcome_register_pwd2')"
               @keydown="setErrorMsg()"
               v-model="repeatPassword"
               onpaste="return false"
               @blur="checkoutInputFormat(5,repeatPassword)"
             >
           </div>
          </div>
          <div class="input">
           <div class="inner-box">
             <!--邀请码-->
             <!--邀请码（没有可不填）-->
             <input
               type="text"
               class="input "
               ref="inviter"
               :placeholder="$t('M.login_welcome_register_advertisement')"
               @keyup="positiveIntegerNumRegexpInputLimit('inviter')"
               @input="positiveIntegerNumRegexpInputLimit('inviter')"
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
                 @click.prevent="jumpToUserAgreement"
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
            <!-- 现在注册即送好礼 -->
            <p class="main-text">{{ $t('M.invitation_register_now_register') }}</p>
            <!-- FUBT 安全便捷的比特币交易平台 -->
            <p
              class="sub-text"
              v-if="configInfo"
            >{{configInfo.otcAd}} {{ $t('M.invitation_register_safety') }}</p>
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
                    v-for="item in countryAreaList"
                    :key="item.english"
                    :label="item.nationCode"
                    :value="item.nationCode"
                  >
                <span style="float: left;">
                  <span v-show="language==='zh_CN'">
                    {{ item.chinese }}
                  </span>
                  <span v-show="language!=='zh_CN'">
                    {{item.english}}
                  </span>
                </span>
                    <span style=" float: right;
                      font-size: 13px;
                      color: #8492a6;
                      "
                    >{{ item.nationCode }}</span>
                  </el-option>
                </el-select>
                <span class="middle-line"></span>
                <!--手机号码-->
                <input
                  type="text"
                  class="input mobile-phone"
                  :placeholder="$t('M.user_security_phone') + $t('M.user_security_number')"
                  :ref="mobilePhoneRef"
                  @keyup="phoneNumRegexpInput(mobilePhoneRef)"
                  @input="phoneNumRegexpInput(mobilePhoneRef)"
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
                    v-for="item in countryAreaList"
                    :key="item.english"
                    :label="item.chinese"
                    :value="item.abbreviation"
                  >
                    <span style="float: left;">
                      <span>
                        {{ item.chinese }}
                      </span>
                    </span>
                    <span style=" float: right;
                      font-size: 13px;
                      color: #8492a6;
                      "
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
                    v-for="item in countryAreaList"
                    :key="item.english"
                    :label="item.english"
                    :value="item.abbreviation"
                  >
                    <span style="float: left;">
                      <span>
                        {{item.english}}
                      </span>
                    </span>
                    <span style=" float: right;
                      font-size: 13px;
                      color: #8492a6;
                      "
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
                  @keydown="setErrorMsg()"
                  @blur="checkoutInputFormat(1,emailNum)"
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
                ref="checkCode"
                @keydown="setErrorMsg()"
                @keyup="positiveIntegerNumRegexpInputLimit('checkCode')"
                @input="positiveIntegerNumRegexpInputLimit('checkCode')"
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
              <!--请输入密码-->
              <input
                type="password"
                autocomplete= "new-password"
                class="input"
                :placeholder="$t('M.user_register_input_pwd')"
                v-model="password"
                @keydown="setErrorMsg()"
                @blur="checkoutInputFormat(4,password)"
              >
            </div>
          </div>
          <div class="input">
            <div class="inner-box">
              <!--请再次输入密码-->
              <input
                type="password"
                autocomplete= "new-password"
                class="input"
                :placeholder="$t('M.user_register_input_confirm_pwd')"
                @keydown="setErrorMsg()"
                v-model="repeatPassword"
                @blur="checkoutInputFormat(5,repeatPassword)"
              >
            </div>
          </div>
          <div class="input">
            <div class="inner-box">
              <!--邀请码（没有可不填）-->
              <input
                type="text"
                class="input "
                ref="inviter"
                :placeholder="$t('M.login_welcome_register_advertisement')"
                @keyup="positiveIntegerNumRegexpInputLimit('inviter')"
                @input="positiveIntegerNumRegexpInputLimit('inviter')"
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
                  @click.prevent="jumpToUserAgreement"
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
            <div class="drag_text bdr5">{{$t('M.login_verifyTips')}}</div>
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
          <img src="../assets/develop/register-success.png">
          <!-- 注册成功 -->
          <p>{{$t('M.invitation_register_Registration_Successful')}}</p>
        </div>
        <p class="title">
          <span>{{successCountDown}}</span>
          <!--秒后跳转登录页面...-->
          {{ $t('M.forgetPassword_hint8') }}
        </p>
        <button
          class="cursor-pointer jump-login"
          @click="$goToPage('/login')"
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
        <!-- 注册成功！ -->
        <p class="main-tips">{{$t('M.invitation_register_Registration_Successful')}}</p>
        <p
          class="sub-tips"
          v-if="inviter"
        >
          <!-- 奖励已发送到我的账户 -->
          {{$t('M.invitation_register_awarding')}}
        </p>
        <button
          class="confirm-btn"
          @click="jumpToDownAppPage"
        >
          <!-- 我知道了 -->
          {{$t('M.invitation_register_i_know')}} <span>({{successCountDown}})</span>
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
  returnAjaxMsg, // 接口返回信息
  validateNumForUserInput, // 用户输入验证
  sendPhoneOrEmailCodeAjax
} from '../utils/commonFunc'
import {
  phoneNumRegexpInput,
  positiveIntegerNumRegexpInput
} from '../utils'
import {
  mapState,
  mapGetters,
  mapMutations
} from 'vuex'
// import {formatNumberInpu} from '../utils'
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
      emailNumRef: 'email-num-ref',
      phoneRef: 'phone-ref',
      mobilePhoneRef: 'mobile-phone-ref',
      activeMethod: 0, // 当前注册方式： 0： 手机注册 : 1 邮箱注册
      // countryAreaList: [], // 国家区域列表
      activeCountryCodeWithPhone: '86',
      activeCountryCodeWithEmail: '86',
      activeCountryAbbreviationWithEmail: 'CHN', // 当前国家简称
      phoneNum: '', // 手机号
      emailNum: '', // email 地址
      password: '', // 密码
      repeatPassword: '', // 确认密码
      checkCode: '', // 短信、邮箱验证码
      inviter: '', // 邀请码
      userAgreementStatus: false, // 是否同意协议
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
      confirmSuccess: false, /* 验证成功判断 */
      sliderFlag: true, // 滑块调用节流阀
      dragStatus: true, // 拖动标记
      inviterDisabled: false, // 注册邀请码提示框禁用状态
      /**
       * 移动端拖动
       */
      startX: 0, // 开始时的坐标
      endX: 0, // 结束时的坐标
      moveX: 0, // 移动的坐标
      mobileMaxWidth: 800, // 移动端拖动最大宽度
      invitationRegisterSuccess: true, // 邀请注册成功
      registerParams: {}, // 注册参数
      successJumpTimer: null // 成功跳转倒计时
    }
  },
  async created () {
    this.$SET_ACTIVE_LINK_NAME_M_X(-1)
    require('../../static/css/list/User/Register.css')
    if (this.$isLogin_S_X) this.USER_LOGOUT()
  },
  mounted () {
    this.pcDragEvent()
    let params = this.$route.query.showId
    if (params) {
      this.inviter = params
      this.$refs['inviter'].value = params
      this.inviterDisabled = true
    }
  },
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  destroyed () {
    clearInterval(this.successJumpTimer)
  },
  methods: {
    ...mapMutations([
      'SET_USER_BUTTON_STATUS',
      'USER_LOGOUT',
      'SET_COUNT_DOWN_RESET_STATUS',
      'CHANGE_FOOTER_ACTIVE_NAME'
    ]),
    jumpToUserAgreement () {
      let routeData = this.$router.resolve({
        path: '/ServiceAndProtocol'
      })
      this.CHANGE_FOOTER_ACTIVE_NAME({
        type: '/ServiceAndProtocol',
        activeName: 'UserProtocol'
      })
      window.open(routeData.href, '_blank')
    },
    // 限制输入数字
    positiveIntegerNumRegexpInputLimit (ref) {
      let target = this.$refs[ref]
      let targetStr = positiveIntegerNumRegexpInput(target)
      switch (ref) {
        case 'checkCode':
          this.checkCode = targetStr
          break
        case 'inviter':
          this.inviter = targetStr
          break
      }
    },
    phoneNumRegexpInput (ref) {
      let target = this.$refs[ref]
      this.phoneNum = phoneNumRegexpInput(target)
    },
    // pc 拖动事件
    pcDragEvent () {
      $('body').on('mousemove', (e) => {
        if (this.mouseMoveStatus) {
          var width = e.clientX - this.beginClientX
          if (width > 0 && width <= this.maxwidth) {
            $('.handler').css({'left': width})
            $('.drag_bg').css({'width': width})
          } else if (width > this.maxwidth) {
            this.successCallback(this.registerParams)
          }
        }
      })
      $('body').on('mouseup', (e) => { // 鼠标放开
        console.log('mouseup')
        this.mouseMoveStatus = false
        var width = e.clientX - this.beginClientX
        if (width < this.maxwidth) {
          $('.handler').animate({'left': 0}, 500)
          $('.drag_bg').animate({'width': 0}, 500)
        }
      })
    },
    jumpToDownAppPage () {
      if (this.inviter && this.isNeedApp && this.isMobile) {
        this.$goToPage(`/downloadApp?language${this.language}`)
      } else {
        this.$goToPage(`/${this.$routes_X.login}`)
      }
    },
    // 检测输入格式
    checkoutInputFormat (type, targetNum) {
      switch (type) {
        // 手机号
        case 0:
          switch (validateNumForUserInput('phone', targetNum)) {
            case 0:
              this.setErrorMsg()
              this.$forceUpdate()
              return 1
            case 1:
              // 请输入手机号
              this.setErrorMsg(this.$t('M.login_tips_enter_phone'))
              this.$forceUpdate()
              return 0
          }
          break
        // 邮箱验证
        case 1:
          console.log(validateNumForUserInput('email', targetNum))
          switch (validateNumForUserInput('email', targetNum)) {
            case 0:
              this.setErrorMsg()
              this.$forceUpdate()
              return 1
            case 1:
              // 请输入邮箱地址
              this.setErrorMsg(this.$t('M.login_please_input3'))
              this.$forceUpdate()
              return 0
            case 2:
              // 邮箱格式不正确
              this.setErrorMsg(this.$t('M.user-fail-reg-mail'))
              this.$forceUpdate()
              return 0
          }
          break
        // 短信、邮箱验证码
        case 3:
          if (!targetNum) {
            // 请输入 短信验证码 邮箱验证码
            const str = (!this.activeMethod ? this.$t('M.login_please_input1') : this.$t('M.login_please_input2'))
            this.setErrorMsg(str)
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg()
            this.$forceUpdate()
            return 1
          }
        // 密码
        case 4:
          switch (validateNumForUserInput('password', targetNum)) {
            case 0:
              this.setErrorMsg()
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
            this.setErrorMsg()
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
            this.setErrorMsg()
            this.$forceUpdate()
            return 1
          }
      }
    },
    // 设置错误信息
    setErrorMsg (msg) {
      this.errorMsg = msg || ''
    },
    // 检测用户名是否存在
    async checkUserExistAjax (type, userName) {
      if (!validateNumForUserInput(type, userName)) {
        let params = {
          userName: userName,
          regType: type
        }
        const data = await checkUserExist(params)
        return returnAjaxMsg(data, this) ? true : false
      } else {
        switch (type) {
          case 'phone':
            if (this.checkoutInputFormat(0, userName)) return false
            break
          case 'email':
            if (this.checkoutInputFormat(1, userName)) return false
            break
        }
      }
    },
    // 发送验证码（短信、邮箱）
    async sendPhoneOrEmailCode (type) {
      this.activeCountryCodeWithEmail = _.filter(this.countryAreaList, {abbreviation: this.activeCountryAbbreviationWithEmail})[0].nationCode
      if (this.disabledOfPhoneBtn || this.disabledOfEmailBtn) {
        return false
      }
      let params = {}
      switch (type) {
        case 0:
          if (!this.checkoutInputFormat(type, this.phoneNum)) {
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
          params.nationCode = this.activeCountryCodeWithEmail
          break
      }
      await sendPhoneOrEmailCodeAjax(type, params, this)
    },
    // 4位随机数
    getRandomNum () {
      return `${parseInt(Math.random() * 10000)} `
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
        this.pcDragEvent()
      }
    },
    // 发送注册申请
    sendRegister: _.debounce(async function (params) {
      try {
        const data = await sendRegisterUser(params)
        if (!returnAjaxMsg(data, this, 0)) {
          return false
        } else {
          this.isRegisterSuccess = true
          this.successJump()
        }
      } catch (err) {
        console.log(err)
      }
    }, 500),
    // 登录成功自动跳转
    successJump () {
      this.successJumpTimer = setInterval(() => {
        this.successCountDown--
        if (this.successCountDown < 1) {
          clearInterval(this.successJumpTimer)
          this.jumpToDownAppPage()
        }
      }, 1000)
    },
    // 切换注册方式
    toggleMethod (method) {
      this.activeMethod = method
      // 短信验证码 邮箱验证码
      // this.activeCodePlaceholder = !this.activeMethod ? 'M.forgetPassword_hint10' : 'M.forgetPassword_hint11'
      this.clearFormData()
    },
    // 清空表单信息
    clearFormData () {
      this.phoneNum = ''
      this.emailNum = ''
      this.password = ''
      this.repeatPassword = ''
      this.checkCode = ''
      this.$refs['checkCode'].value = ''
      this.setErrorMsg()
      if (!this.isMobile) {
        this.$refs[this.phoneRef].value = ''
        // this.$refs[this.emailNumRef].value = ''
      } else {
        this.$refs[this.mobilePhoneRef].value = ''
        // this.$refs[this.emailNumRef].value = ''
      }
    },
    /**
     * 滑块验证
     */
    mouseupFn (e) {
    },
    mousedownFn (e) {
      this.dragStatus = false
      this.mouseMoveStatus = true
      this.beginClientX = e.clientX
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
      if (targetLeft < this.mobileMaxWidth && targetLeft >= 0) {
        $(e.target).css({'left': left + 'px'})
      } else {
        this.successCallback(this.registerParams)
      }
    },
    handleTouchEnd (e) {
      this.endX = e.changedTouches[0].pageX
      $(e.target).animate({'left': 0}, 500)
    },
    // 按下滑块函数
    async successCallback (params) {
      if (this.sliderFlag) {
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
        if (!await this.checkUserExistAjax(type, userName)) return false
        await this.sendRegister(params)
      } // 验证成功函数
    }
  },
  filter: {},
  computed: {
    ...mapGetters({
      'isNeedApp': 'isNeedApp'
    }),
    ...mapState({
      isMobile: state => state.user.isMobile,
      language: state => state.common.language,
      countryAreaList: state => state.common.countryAreaList,
      disabledOfPhoneBtn: state => state.user.disabledOfPhoneBtn,
      disabledOfEmailBtn: state => state.user.disabledOfEmailBtn,
      configInfo: state => state.common.footerInfo.configInfo
    }),
    activeCodePlaceholder () {
      return !this.activeMethod ? 'M.forgetPassword_hint10' : 'M.forgetPassword_hint11'
    },
    windowHeight () {
      console.log(window.innerHeight)
      return window.innerHeight + 300
    }
  },
  watch: {
    activeMethod () {
      this.SET_COUNT_DOWN_RESET_STATUS(true)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../assets/CSS/index';

  .register-box {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background: linear-gradient(150deg, rgba(30, 38, 54, 1), rgba(37, 75, 117, 1));

    &.min-height {
      min-height: 1000px;
    }

    > .inner-box {
      width: 100%;

      &.pc-bg {
        min-width: 1366px;
        background: url('../assets/develop/login-bg.png') 25% 0 no-repeat;
      }

      /* background:url('../assets/develop/login-bg.png')  ; */
      .main-color {
        color: $mainColor;
      }

      /* pc端 */
      > .pc-box {
        position: relative;
        width: 370px;
        padding: 12px 40px 50px;
        margin: 12% 0 0 50%;
        border-radius: 10px;
        background: linear-gradient(201deg, rgba(42, 88, 137, 1) 0%, rgba(43, 58, 111, 1) 100%);
        box-shadow: 0 4px 21px 0 rgba(26, 42, 71, 1);

        > .title {
          position: absolute;
          top: -80px;
          left: 15%;
          min-width: 250px;
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

        /* 注册方式选择 */
        > .methods-list {
          display: flex;

          > .method-item {
            flex: 1;
            height: 40px;
            line-height: 40px;
            text-align: center;
            color: #c3c3c3;

            &.active {
              font-size: 16px;
              color: #fff;
            }
          }
        }

        > .inner-content {
          /* 密码账号框 */
          > .input {
            width: 600px;

            > .inner-box {
              position: relative;
              display: inline-block;
              width: 290px;
              height: 40px;
              padding: 0 5px 0 20px;
              margin-bottom: 15px;
              border-radius: 20px;
              vertical-align: middle;
              background: rgba(32, 55, 90, 1);

              &.user-agreement {
                height: 20px;
                padding: 0;
                margin-bottom: 0;
                background: none;
              }

              > .input {
                width: 100%;
                height: 100%;
                color: #fff;

                &::-webkit-input-placeholder {
                  color: #8b9197;
                }

                &.image-validate {
                  width: 154px;
                  vertical-align: top;
                }

                &.mobile-phone {
                  width: 156px;
                }
              }

              > .middle-line {
                display: inline-block;
                width: 1px;
                height: 20px;
                margin: 10px 5px 0 0;
                vertical-align: top;
                background: rgb(55, 86, 131);
              }

              > .send-code-btn {
                height: 40px;
                line-height: 40px;
                text-align: center;
                color: $mainColor;

                /* width:50px; */
              }
            }
          }

          > .error-msg {
            height: 30px;
            margin-top: 8px;
            margin-left: 22px;
            line-height: 15px;
            color: rgb(212, 88, 88);
          }

          /* 注册，忘记密码 */
          > .link {
            width: 100%;
            height: 40px;
            margin-bottom: 30px;
            font-size: 12px;
            line-height: 40px;

            > a {
              display: inline-block;
              width: 49%;
            }
          }

          /* 注册按钮 */
          > .register-btn {
            display: block;
            width: 128px;
            height: 40px;
            margin: 10px auto 0;
            border-radius: 20px;
            font-size: 14px;
            line-height: 40px;
            color: #fff;
            background: linear-gradient(81deg, rgba(61, 152, 249, 1) 0%, rgba(71, 135, 255, 1) 100%);
            box-shadow: 2px 2px 8px 0 rgba(26, 42, 71, 1);
          }
        }
      }

      /* 移动端 */
      > .mobile-box {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        padding: 0 1rem;
        font-size: .86453968rem;

        /* 邀请头部 */
        > .invitation-box {
          display: flex;
          width: 100%;
          height: 6.6rem;

          > .left {
            flex: 1;
            height: 100%;
            background: url(../assets/develop/register-small-url.png) no-repeat center center;
            background-size: 102%;
          }

          > .right {
            flex: 2;
            height: 100%;
            padding-left: 1rem;
            color: #fff;

            > .main-text {
              margin-top: 1.8rem;

              /* font-size: 0.86453968rem; */
              font-weight: 500;
              font-size: 1.2rem;
            }

            > .sub-text {
              /* font-size: 0.86453968rem; */
              font-size: .64840476rem;
              line-height: 1rem;
            }
          }
        }

        /* 登录方式切换 */
        > .methods-list {
          width: 100%;

          > .method-item {
            display: inline-block;
            width: 49%;
            height: 1.8rem;
            font-size: .86453968rem;
            line-height: 1.5rem;
            text-align: center;
            color: #c3c3c3;

            &.active {
              color: $mainColor;
            }
          }
        }

        > .inner-content {
          > .input {
            width: 100%;

            > .inner-box {
              display: inline-block;
              width: 100%;
              height: 2.882rem;
              padding: 0 5px 0 1rem;
              margin-bottom: .4rem;

              /* background:rgba(32,55,90,1); */

              /* background:red; */
              border-radius: 20px;
              vertical-align: middle;
              background-color: #28446e;

              &.user-agreement {
                height: 20px;
                padding: 0;
                margin-bottom: 0;
                font-size: .86453968rem;
                background: none;
              }

              > .input {
                width: 100%;
                height: 100%;
                font-size: .86453968rem;
                color: #fff;

                &::-webkit-input-placeholder {
                  color: #8b9197;
                }

                &.image-validate {
                  width: 54%;
                  vertical-align: top;
                }

                &.mobile-phone {
                  width: 70%;
                }
              }

              > .middle-line {
                display: inline-block;
                width: 1px;
                height: 50%;
                vertical-align: middle;
                background: rgb(55, 86, 131);

                /* margin:10px 5px 0 0; */
              }

              > .send-code-btn {
                height: 2.882rem;
                font-size: .86453968rem;
                line-height: 2.882rem;
                text-align: center;
                color: $mainColor;

                /* width:50px; */
              }
            }
          }

          > .error-msg {
            height: 2.8rem;
            margin-left: 30px;
            font-size: .86453968rem;
            line-height: 5rem;
            color: rgb(212, 88, 88);
          }

          /* 注册，忘记密码 */
          > .link {
            width: 100%;
            height: 40px;
            margin-bottom: 30px;
            font-size: 12px;
            line-height: 40px;

            > a {
              display: inline-block;
              width: 49%;
            }
          }

          /* 注册按钮 */
          > .register-btn {
            display: block;
            width: 100%;
            height: 2.882rem;
            padding: 0 5px 0 20px;
            margin: 2rem auto;
            border-radius: 20px;
            font-size: .86453968rem;
            color: #fff;
            background: linear-gradient(81deg, rgba(61, 152, 249, 1) 0%, rgba(71, 135, 255, 1) 100%);
            box-shadow: 2px 2px 8px 0 rgba(26, 42, 71, 1);
          }
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

      > .success-box {
        width: 240px;
        height: 300px;
        margin: 300px auto;
        text-align: center;

        > .img {
          width: 140px;
          height: 140px;
          margin: 0 auto 30px;
          border-radius: 50%;
          color: #fff;
          background-color: $mainColor;

          > img {
            width: 50%;
            margin-top: 20px;
          }

          > .icon-color {
            font-size: 100px;
          }
        }

        > .title {
          width: 240px;
          height: 16px;
          font-size: 14px;
          font-family: "MicrosoftYaHei-Bold";
          color: rgba(51, 143, 245, 1);

          > span {
            font-weight: 700;
            font-size: 18px;
          }
        }

        > .jump-login {
          min-width: 150px;
          height: 40px;
          margin: 50px auto;
          border-radius: 4px;
          font-size: 18px;
          color: #fff;
          background: rgba(51, 143, 245, .5);
        }
      }
    }

    > .invitation-success {
      .main-tips {
        margin-bottom: .4rem;
        font-size: .86453968rem;
        color: #fff;
      }

      .sub-tips {
        margin-bottom: .4rem;
        font-size: .86453968rem;
        color: #fff;
      }

      .confirm-btn {
        width: 550px;
        height: 75px;
        border-radius: 5px;
        font-size: .86453968rem;
        color: #fff;
        background: $mainColor;

        > span {
          font-size: .8rem;
        }
      }
    }

    &.day {
      &.pc-bg {
        background: #fff;
      }
    }
  }
</style>
