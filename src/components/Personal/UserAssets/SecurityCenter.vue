<template>
  <div
    class="security-center personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="security-header security-background personal-height40 line-height40 font-size16 padding-left20">
      <span class="padding-left15 font-weight600">
        <!--安全中心-->
        {{ $t('M.comm_user_security_center') }}
      </span>
    </header>
    <div class="security-information security-background margin-top9 padding20 box-sizing">
      <div class="security-title">
        <div class="display-flex">
          <div class="security-title-info flex1 display-flex font-size14">
          <span class="flex1 security-level">
            <!--账号安全级别：-->
            {{ $t('M.user_security_level') }}：
            <span
              v-if="person === 40"
              class="level"
            >
              <!--低-->
              {{ $t('M.user_security_low') }}
            </span>
            <span
              v-if="person === 80 || person === 60"
              class="level"
            >
              <!--中-->
              {{ $t('M.user_security_centre') }}
            </span>
            <span
              class="level"
              v-if="person === 100"
            >
              <!--高-->
              {{ $t('M.user_security_tall') }}
            </span>
          </span>
            <span class="flex1">
               <el-progress
                 :text-inside="false"
                 :stroke-width="5"
                 :percentage="person"
               >
               </el-progress>
            </span>
            <span class="flex1 security-verification">
              <!--建议开启双重验证-->
              {{ $t('M.user_security_dual') }}
            </span>
          </div>
          <div class="security-title-info flex1"></div>
        </div>
        <div class="security-title-info margin-top20 font-size12">
          <div class="login-time float-left">
            <span>
              <!--上次登录时间-->
              {{ $t('M.user_security_last_login_time') }}：
            </span>
            <span>{{ securityCenter.loginTime }}</span>
          </div>
          <div class="login-ip float-left">
            <span>IP：</span>
            <span>{{ securityCenter.ip }}</span>
          </div>
          <div class="login-address">
            <span>
              <!--归属-->
              {{ $t('M.user_security_affiliation') }}：
            </span>
            <span>{{ securityCenter.ipLocation }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="security-setting security-background margin-top9">
      <header class="security-setting-header line-height50 paddinglr20 font-size16">
        <!--安全设置-->
        {{ $t('M.user_security_safety') }}{{ $t('M.comm_set') }}
      </header>
      <div class="security-setting-box">
        <!--安全邮箱-->
        <div class="security-type setting-type-box margin20 padding-tb20 display-flex">
          <div class="security-type-icon line-height40">
            <IconFontCommon
              class="font-size26"
              iconName="icon-youxiang1-copy"
            />
          </div>
          <div class="security-type-text padding-l15 box-sizing">
            <p>
              <span class="secure-email font-size14 font-weight600">
                <!--安全邮箱-->
                {{ $t('M.user_security_safety') }}{{ $t('M.user_security_email') }}
              </span>
              <IconFontCommon
                v-if="!securityCenter.isMailEnable"
                class="font-size16"
                iconName="icon-wuuiconsuotanhao-copy"
              />
            </p>
            <p class="security-info margin-top9 font-size12">
              <!--用于提币、找回密码、修改安全设置、管理API时进行安全验证。-->
              {{ $t('M.user_security_text1') }}
            </p>
          </div>
          <div class="security-status text-align-r">
            <button
              v-if="!securityCenter.isMailEnable"
              class="security-verify border-radius2 font-size12 cursor-pointer"
            >
              <span @click.prevent="showStatusVerificationClose('email', 'enable')">
                <!--开启验证-->
                {{ $t('M.comm_open') }}{{ $t('M.user_security_verify') }}
              </span>
            </button>
            <button
              v-else
              class="security-verify border-radius2 font-size12 cursor-pointer"
            >
              <span
                @click.prevent="showStatusVerificationClose('email', 'disable')"
              >
                <!--关闭验证-->
                 {{ $t('M.comm_close') }}{{ $t('M.user_security_verify') }}
              </span>
            </button>
            <button
              v-if="!securityCenter.isMailBind"
              class="security-binding border-radius2 font-size12 cursor-pointer"
              @click.prevent="setShowStatusSecurity('email')"
            >
              <!--绑定-->
              {{ $t('M.user_security_binding') }}
            </button>
            <span v-else></span>
          </div>
        </div>
        <!--安全手机-->
        <div class="security-type setting-type-box margin20 padding-tb20 display-flex">
          <div class="security-type-icon line-height40">
            <IconFontCommon
              class="font-size30"
              iconName="icon-shouji-copy"
            />
          </div>
          <div class="security-type-text padding-l15 box-sizing">
            <p>
              <span class="secure-email font-size14 font-weight600">
                <!--安全手机-->
                {{ $t('M.user_security_safety') }}{{ $t('M.user_security_phone') }}
              </span>
              <IconFontCommon
                v-if="!securityCenter.isPhoneBind"
                class="font-size16"
                iconName="icon-wuuiconsuotanhao-copy"
              />
            </p>
            <p class="security-info margin-top9 font-size12">
              <!--用于提币、找回密码、修改安全设置、管理API时进行安全验证。-->
              {{ $t('M.user_security_text1') }}
            </p>
          </div>
          <div class="security-status text-align-r">
            <button
              v-if="!securityCenter.isPhoneEnable"
              class="security-verify border-radius2 font-size12 cursor-pointer"
            >
              <span @click.prevent="showStatusVerificationClose('phone', 'enable')">
                <!--开启验证-->
                {{ $t('M.comm_open') }}{{ $t('M.user_security_verify') }}
              </span>
            </button>
            <button
              v-else
              class="security-verify border-radius2 font-size12 cursor-pointer"
            >
              <span
                @click.prevent="showStatusVerificationClose('phone', 'disable')"
              >
                <!--关闭验证-->
                {{ $t('M.comm_close') }}{{ $t('M.user_security_verify') }}
              </span>
            </button>
            <button
              class="security-binding border-radius2 font-size12 cursor-pointer"
              @click.prevent="setShowStatusSecurity('phone')"
            >
              <span v-if="!securityCenter.isPhoneBind">
                <!--绑定-->
                {{ $t('M.user_security_binding') }}
              </span>
              <span v-else>
                <!--修改-->
                {{ $t('M.comm_modification') }}
              </span>
            </button>
          </div>
        </div>
        <!--谷歌验证-->
        <div class="security-type setting-type-box margin20 padding-tb20 display-flex">
          <div class="security-type-icon line-height40">
            <IconFontCommon
              class="font-size26 icon-success"
              iconName="icon-yanzheng-copy"
            />
          </div>
          <div class="security-type-text padding-l15 box-sizing">
            <p>
              <span class="secure-email font-size14 font-weight600">
                <!--谷歌验证-->
                {{ $t('M.user_security_google') }}{{ $t('M.user_security_verify') }}
              </span>
              <IconFontCommon
                v-if="!securityCenter.isGoogleBind"
                class="font-size16"
                iconName="icon-wuuiconsuotanhao-copy"
              />
            </p>
            <p class="security-info margin-top9 font-size12">
              <!--用于提币、找回密码、修改安全设置、管理API时进行安全验证。-->
              {{ $t('M.user_security_text1') }}
            </p>
          </div>
          <div class="security-status text-align-r">
            <button
              v-if="!securityCenter.isGoogleEnable"
              class="security-verify border-radius2 font-size12 cursor-pointer"
            >
              <span @click.prevent="showStatusVerificationClose('google', 'enable')">
                <!--开启验证-->
                {{ $t('M.comm_open') }}{{ $t('M.user_security_verify') }}
              </span>
            </button>
            <button
              v-else
              class="security-verify border-radius2 font-size12 cursor-pointer"
            >
              <span
                @click.prevent="showStatusVerificationClose('google', 'disable')"
              >
                <!--关闭验证-->
                 {{ $t('M.comm_close') }}{{ $t('M.user_security_verify') }}
              </span>
            </button>
            <button
              class="security-binding border-radius2 font-size12 cursor-pointer"
              @click.prevent="setShowStatusSecurity('google')"
            >
              <span v-if="!securityCenter.isGoogleBind">
                <!--绑定-->
                {{ $t('M.user_security_binding') }}
              </span>
              <span v-else>
                <!--解绑-->
                {{ $t('M.user_security_unbundle') }}
              </span>
            </button>
          </div>
        </div>
        <!--交易密码-->
        <div class="security-type setting-type-box margin20 padding-tb20 display-flex">
          <div class="security-type-icon line-height40">
            <IconFontCommon
              class="font-size26 icon-success"
              iconName="icon-qian-copy"
            />
          </div>
          <div class="security-type-text padding-l15 box-sizing">
            <p>
              <span class="secure-email font-size14 font-weight600">
                <!--交易密码-->
                {{ $t('M.comm_password') }}
              </span>
              <IconFontCommon
                v-if="!securityCenter.payPassword"
                class="font-size16"
                iconName="icon-wuuiconsuotanhao-copy"
              />
            </p>
            <p class="security-info-text margin-top9 font-size12">
              <!--交易密码用于账户交易-->
              {{ $t('M.user_security_text2') }}
              <span v-if="!securityCenter.payPassword">
                <!--，建议立即设置-->
                ，{{ $t('M.user_security_text3') }}
              </span>
              <span v-else></span>
            </p>
          </div>
          <div class="security-status text-align-r">
            <button
              class="security-binding border-radius2 font-size12 cursor-pointer"
              @click.prevent="setShowStatusSecurity('transaction-password')"
            >
              <span v-if="!securityCenter.payPassword">
                <!--设置-->
                {{ $t('M.comm_set') }}
              </span>
              <span v-else>
                <!--重置-->
                {{ $t('M.user_transaction_reset') }}
              </span>
            </button>
          </div>
        </div>
        <!--登录密码-->
        <div class="security-type margin20 padding-tb20 display-flex">
          <div class="security-type-icon line-height40">
            <IconFontCommon
              class="font-size26 icon-success"
              iconName="icon-mima-copy"
            />
          </div>
          <div class="security-type-text padding-l15 box-sizing">
            <p>
              <span class="secure-email font-size14 font-weight600">
                <!--登陆密码-->
                {{ $t('M.user_security_login') }}{{ $t('M.user_security_password') }}
              </span>
            </p>
            <p class="security-info margin-top9 font-size12">
              <!--用于提币、找回密码、修改安全设置、管理API时进行安全验证。-->
              {{ $t('M.user_security_text1') }}
            </p>
          </div>
          <div class="security-status text-align-r">
            <button
              class="security-binding border-radius2 font-size12 cursor-pointer"
              @click.prevent="setShowStatusSecurity('login-password')"
            >
              <span>
                <!--修改-->
                {{ $t('M.comm_modification') }}
              </span>
            </button>
          </div>
        </div>
        <!--关闭验证-->
        <div class="close-validation">
          <el-dialog
            :title="$t('M.comm_close') + $t('M.user_security_verify')"
            :visible.sync="closeValidation"
          >
            <el-form
              :label-position="labelPosition"
              label-width="120px"
            >
              <!--没有绑定手机不显示-->
              <div v-if="!securityCenter.isPhoneEnable"></div>
              <!--绑定手机之后显示-->
              <el-form-item
                :label="$t('M.user_security_phone') + $t('M.user_security_verify')"
                v-else
              >
                <input
                  class="input padding-l15 box-sizing"
                  v-model="phoneCode"
                  @focus="handleinput1"
                >
                <CountDownButton
                  class="send-code-btn cursor-pointer"
                  :status="disabledOfPhoneBtn"
                  @run="sendPhoneOrEmailCode(0)"
                />
              </el-form-item>
              <!--没有绑定邮箱不显示-->
              <div v-if="!securityCenter.isMailEnable"></div>
              <!--绑定邮箱之后显示-->
              <el-form-item
                :label="$t('M.user_security_email') + $t('M.user_security_verify')"
                v-else
              >
                <input
                  class="input padding-l15 box-sizing"
                  v-model="emailCode"
                  @focus="handleinput1"
                >
                  <CountDownButton
                    class="send-code-btn cursor-pointer"
                    :status="disabledOfEmailBtn"
                    @run="sendPhoneOrEmailCode(1)"
                  />
              </el-form-item>
              <!--没有绑定谷歌不显示-->
              <div v-if="!securityCenter.isGoogleEnable"></div>
              <!--绑定谷歌之后显示-->
              <el-form-item
                :label="$t('M.user_security_google') + $t('M.user_security_verify')"
                v-else
              >
                <input
                  class="input input-google border-radius2 padding-l15 box-sizing"
                  v-model="googleCode"
                  @focus="handleinput1"
                />
              </el-form-item>
            </el-form>
            <!--错误提示-->
            <div
              class = "error-msg font-size12"
            >
              <span v-show = "errorMsg1">{{ errorMsg1 }}</span>
            </div>
            <div
              slot="footer"
              class="dialog-footer"
            >
              <!--<el-button @click.prevent="closeValidation = false">取 消</el-button>-->
              <el-button
                class="button"
                type="primary"
                @click.prevent="determineTheOpen"
              >
                <!--确 定-->
                {{ $t('M.comm_confirm') }}
              </el-button>
            </div>
          </el-dialog>
        </div>
        <!--开启验证-->
        <div class="open-validation">
          <el-dialog
            :title="$t('M.comm_open') + $t('M.user_security_verify')"
            :visible.sync="openTheValidation"
          >
            <el-form
              label-width="120px"
              :label-position="labelPosition"
            >
              <!--开启手机-->
              <!--手机验证-->
              <el-form-item
                :label="$t('M.user_security_phone') + $t('M.user_security_verify')"
                v-show="openPhone"
              >
                <input
                  class="input padding-l15 box-sizing"
                  v-model="phoneCode"
                  @focus="handleinput"
                >
                <CountDownButton
                  class="send-code-btn cursor-pointer"
                  :status="disabledOfPhoneBtn"
                  @run="sendPhoneOrEmailCode(0)"
                />
              </el-form-item>
              <!--开启邮箱-->
              <!--邮箱验证-->
              <el-form-item
                :label="$t('M.user_security_email') + $t('M.user_security_verify')"
                v-show="openEmail"
              >
                <input
                  class="input padding-l15 box-sizing"
                  v-model="emailCode"
                  @focus="handleinput"
                >
                  <CountDownButton
                    class="send-code-btn cursor-pointer"
                    :status="disabledOfEmailBtn"
                    @run="sendPhoneOrEmailCode(1)"
                  />
              </el-form-item>
              <!--开启谷歌-->
              <!--谷歌验证-->
              <el-form-item
                :label="$t('M.user_security_google') + $t('M.user_security_verify')"
                v-show="openGoogle"
              >
                <input
                  class="input input-google border-radius2 padding-l15 box-sizing"
                  v-model="googleCode"
                  @focus="handleinput"
                />
              </el-form-item>
            </el-form>
            <div
              class = "error-msg font-size12"
            >
              <span v-show = "errorMsg">{{ errorMsg }}</span>
            </div>
            <div
              slot="footer"
              class="dialog-footer"
            >
              <!--<el-button @click.prevent="openTheValidation = false">取 消</el-button>-->
              <el-button
                class="button"
                ype="primary"
                @click.prevent="determineTheOpen"
              >
                <!--确 定-->
                {{ $t('M.comm_confirm') }}
              </el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
    <div class="security-record security-background margin-top9">
      <el-tabs
        v-model="securityActiveName"
      >
        <!--最近登录记录 登陆时间 登录IP 归属地 来源-->
        <el-tab-pane
          :label="$t('M.user_security_recently') + $t('M.user_security_login') + $t('M.comm_record')"
          name="first"
        >
          <el-table
            :data="securityRecord"
            style="width: 100%">
            <el-table-column
              :label="$t('M.user_security_login') + $t('M.comm_time')"
            >
              <template slot-scope = "s">
                <div>{{ timeFormatting(s.row.operateTime) }}</div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('M.user_security_login') + $t('M.comm_time') + 'IP'"
            >
              <template slot-scope = "s">
                <div>{{ s.row.ip }}</div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('M.user_security_home_location')"
            >
              <template slot-scope = "s">
                <div>{{ s.row.operateAddress }}</div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('M.user_security_source')"
            >
              <template slot-scope = "s">
                <div>{{ s.row.source }}</div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--安全设置记录 登陆时间 设置名称 登录IP 归属地-->
        <el-tab-pane
          :label="$t('M.user_security_safety') + $t('M.comm_set') + $t('M.comm_record')"
          name="second"
        >
          <el-table
            :data="logonRecord"
            style="width: 100%">
            <el-table-column
              :label="$t('M.user_security_login') + $t('M.comm_time')"
            >
              <template slot-scope = "s">
                <div>{{ timeFormatting(s.row.operateTime) }}</div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('M.comm_set') + $t('M.user_account_name')"
            >
              <template slot-scope = "s">
                <div>{{ s.row.content }}</div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('M.user_security_login') + 'IP'"
            >
              <template slot-scope = "s">
                <div>{{ s.row.ip }}</div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('M.user_security_home_location')"
            >
              <template slot-scope = "s">
                <div>{{ s.row.operateAddress }}</div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import CountDownButton from '../../Common/CountDownCommon'
import IconFontCommon from '../../Common/IconFontCommon'
import {
  statusSecurityCenter,
  enableTheClosing
} from '../../../utils/api/personal'
import {
  returnAjaxMessage,
  sendPhoneOrEmailCodeAjax
} from '../../../utils/commonFunc'
import {timeFilter} from '../../../utils/index'
import {mapState, createNamespacedHelpers} from 'vuex'
const { mapMutations } = createNamespacedHelpers('personal')
export default {
  components: {
    IconFontCommon, // 字体图标
    CountDownButton // 短信倒计时
  },
  // props,
  data () {
    return {
      labelPosition: 'top',
      securityActiveName: 'first', // 默认显示第一个
      // 最近登录记录
      logonRecord: [],
      // 安全设置记录
      securityRecord: [],
      getStatusUserInfo: {}, // 个人信息
      closeValidation: false, // 关闭验证弹窗
      openTheValidation: false, // 开启验证弹窗
      openSwitch: false, // 弹出层状态 开启 关闭
      openEmail: false, // 邮箱开启关闭验证
      openPhone: false, // 手机开启关闭验证
      openGoogle: false, // 谷歌开启关闭验证
      securityCenter: {},
      emailCode: '', // 邮箱验证
      phoneCode: '', // 手机验证
      googleCode: '', // 谷歌验证
      activeType: '', // 当前值
      state: '', // 开启关闭
      errorMsg: '', // 关闭错误提示
      errorMsg1: '', // 开启错误提示
      person: ''
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/UserAssets/SecurityCenter.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/UserAssets/SecurityCenterDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/UserAssets/SecurityCenterNight.css')
    // 调用安全中心登陆记录 安全设置记录 邮箱 手机 谷歌 交易密码 状态
    if (this.refSecurityCenterStatus) {
      this.getSecurityCenter()
      this.CHANGE_REF_SECURITY_CENTER_INFO(false)
    }
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'SET_USER_BUTTON_STATUS',
      'CHANGE_REF_SECURITY_CENTER_INFO'
    ]),
    // 1.时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
    },
    // 路由跳转对应组件
    setShowStatusSecurity (val) {
      switch (val) {
        case 'email':
          this.$router.push({path: '/SecureEmail'})
          break
        case 'phone':
          this.$router.push({path: '/SecurePhone'})
          break
        case 'google':
          this.$router.push({path: '/GoogleBinding'})
          break
        case 'transaction-password':
          this.$router.push({path: '/TransactionPassword'})
          break
        case 'login-password':
          this.$router.push({path: '/LoginPassword'})
          break
      }
    },
    // 发送验证码
    sendPhoneOrEmailCode (loginType) {
      if (this.disabledOfPhoneBtn || this.disabledOfEmailBtn) {
        return false
      }
      let params = {
        type: 'VERIFICATION_CODE' // 类型
      }
      switch (loginType) {
        case 0:
          params.phone = this.userInfo.userInfo.phone
          break
        case 1:
          params.address = this.userInfo.userInfo.email
          break
      }
      sendPhoneOrEmailCodeAjax(loginType, params, (data) => {
        console.log(this.disabledOfPhoneBtn)
        // 提示信息
        if (!returnAjaxMessage(data, this)) {
          console.log('error')
          return false
        } else {
          switch (loginType) {
            case 0:
              this.$store.commit('user/SET_USER_BUTTON_STATUS', {
                loginType: 0,
                status: true
              })
              break
            case 1:
              this.$store.commit('user/SET_USER_BUTTON_STATUS', {
                loginType: 1,
                status: true
              })
              break
          }
        }
      })
    },
    // 创建api检测输入格式
    checkoutInputFormat (type, targetNum) {
      switch (type) {
        // 手机验证码
        case 0:
          if (!targetNum) {
            // 请输入手机验证码
            this.setErrorMsg(0, this.$t('M.comm_please_enter') + this.$t('M.user_security_phone') + this.$t('M.comm_code'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(0, '')
            this.$forceUpdate()
            return 1
          }
        // 邮箱验证码
        case 1:
          if (!targetNum) {
            // 请输入邮箱验证码
            this.setErrorMsg(1, this.$t('M.comm_please_enter') + this.$t('M.user_security_email') + this.$t('M.comm_code'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(1, '')
            this.$forceUpdate()
            return 1
          }
        // 谷歌验证码
        case 2:
          if (!targetNum) {
            // 请输入谷歌验证码
            this.setErrorMsg(2, this.$t('M.comm_please_enter') + this.$t('M.user_security_google') + this.$t('M.comm_code'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(2, '')
            this.$forceUpdate()
            return 1
          }
      }
    },
    // 设置错误信息
    setErrorMsg (index, msg) {
      this.errorMsg = msg
    },
    // 关闭开启验证状态事件
    showStatusVerificationClose (paymentType, safeState) {
      console.log(paymentType)
      console.log(safeState)
      this.openEmail = ''
      this.openPhone = ''
      this.openGoogle = ''
      // 把方法中定义的activeType、state在这里进行赋值 点击哪一个那当前的类型和状态传给后台
      this.activeType = paymentType
      this.state = safeState
      switch (paymentType) {
        case 'email':
          if (!this.securityCenter.isMailBind) {
            // 未绑定邮箱
            this.$message({
              message: this.$t('M.comm_not') + this.$t('M.user_security_binding') + this.$t('M.user_security_email'),
              type: 'error'
            })
            this.openTheValidation = false
          } else {
            if (safeState === 'enable') {
              this.openEmail = true
              this.openPhone = false
              this.openGoogle = false
              this.openTheValidation = true
            } else {
              this.closeValidation = true
            }
          }
          break
        case 'phone':
          if (!this.securityCenter.isPhoneBind) {
            // 未绑定手机
            this.$message({
              message: this.$t('M.comm_not') + this.$t('M.user_security_binding') + this.$t('M.user_security_phone'),
              type: 'error'
            })
            this.openTheValidation = false
          } else {
            if (safeState === 'enable') {
              this.openEmail = false
              this.openPhone = true
              this.openGoogle = false
              this.openTheValidation = true
            } else {
              this.closeValidation = true
            }
          }
          break
        case 'google':
          if (!this.securityCenter.isGoogleBind) {
            // 未绑定谷歌
            this.$message({
              message: this.$t('M.comm_not') + this.$t('M.user_security_binding') + this.$t('M.user_security_google'),
              type: 'error'
            })
            this.openTheValidation = false
          } else {
            if (safeState === 'enable') {
              this.openEmail = false
              this.openPhone = false
              this.openGoogle = true
              this.openTheValidation = true
            } else {
              this.closeValidation = true
            }
          }
          break
      }
    },
    // 确认关闭开启
    determineTheOpen () {
      this.confirmTransactionPassword(this.activeType, this.state)
    },
    handleinput () {
      this.errorMsg = ''
    },
    handleinput1 () {
      this.errorMsg1 = ''
    },
    // 关闭开启手机邮箱谷歌验证
    async confirmTransactionPassword (type, state) {
      if (state === 'enable') {
        if (!this.phoneCode && !this.emailCode && !this.googleCode) {
          // 请输入验证码
          this.errorMsg = this.$t('M.comm_please_enter') + this.$t('M.user_security_verify')
          return false
        } else {
          this.errorMsg = ''
        }
      } else {
        if (!this.phoneCode && !this.emailCode && !this.googleCode) {
          // 请输入验证码
          this.errorMsg1 = this.$t('M.comm_please_enter') + this.$t('M.user_security_verify')
          return false
        } else {
          this.errorMsg1 = ''
        }
      }

      let data
      let params = {
        email: this.userInfo.userInfo.email, // 邮箱
        phone: this.userInfo.userInfo.phone, // 手机
        emailCode: this.emailCode, // 邮箱验证
        phoneCode: this.phoneCode, // 手机验证
        googleCode: this.googleCode, // 谷歌验证
        userId: this.userInfo.userId, // 用户id
        type: '', // 邮箱 手机 谷歌 验证验证
        status: '' // 开启 关闭
      }
      switch (type) {
        case 'email':
          console.log(type)
          params.type = 'email'
          console.log(params)
          if (state === 'enable') {
            params.status = 'enable'
          } else {
            params.status = 'disable'
          }
          break
        case 'phone':
          params.type = 'phone'
          if (state === 'enable') {
            params.status = 'enable'
          } else {
            params.status = 'disable'
          }
          break
        case 'google':
          params.type = 'google'
          if (state === 'enable') {
            params.status = 'enable'
          } else {
            params.status = 'disable'
          }
          break
      }
      data = await enableTheClosing(params)
      if (!(returnAjaxMessage(data, this, 1))) {
        return false
      } else {
        this.getSecurityCenter()
        // 安全中心状态刷新
        this.openTheValidation = false
        this.closeValidation = false
        this.emailCode = ''
        this.phoneCode = ''
        this.googleCode = ''
      }
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
        this.person = data.data.data.person
        this.logonRecord = data.data.data.setLog
        this.securityRecord = data.data.data.loginLog
        console.log(this.person)
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      activeCountryCode: state => state.user.loginStep1Info.countryCode, // 国籍码
      disabledOfPhoneBtn: state => state.user.disabledOfPhoneBtn,
      disabledOfEmailBtn: state => state.user.disabledOfEmailBtn,
      refSecurityCenterStatus: state => state.personal.refSecurityCenterStatus,
      userCenterActiveName: state => state.personal.userCenterActiveName
    })
  },
  watch: {
    userCenterActiveName (newVal) {
      if (newVal === 'security-center') {
        this.getSecurityCenter()
      }
    }
  }
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal";
  .security-center{
    >.security-information{
      height: 100px;
      .security-title-info {
        >.login-time {
          width: 290px;
        }
        >.login-ip {
          width: 200px;
        }
      }
    }
    >.security-setting{
      height: 510px;
      >.security-setting-header {
        height: 50px;
      }
      >.security-setting-box {
        .send-code-btn {
          width: 91px;
          height: 34px;
          position: absolute;
          top: 4px;
        }
        .button {
          width: 271px;
          height: 34px;
          background: linear-gradient(90deg, #2b396e, #2a5082);
          color: #fff;
          border: 0;
          line-height: 0;
        }
        .input {
          width: 180px;
          height: 34px;
        }
        .input-google {
          width: 271px;
          height: 34px;
        }
        .security-type-icon {
          width: 30px;
        }
        .security-type-text {
          flex: 5;
          .secure-email {
            margin-right: 5px;
          }
        }
        .security-status {
          flex: 2;
          padding-top: 6px;
          >.security-verify,
          >.security-binding {
            width: 70px;
            height: 30px;
          }
          >.security-binding {
            margin-left: 18px;
          }
        }
      }
    }
    >.security-record{
      min-height: 200px;
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      >.security-background {
        background-color: #1E2636;
      }
      >.security-header {
        color: #338FF5;
      }
      .security-title-info {
        color: #A9BED4;
        >.security-level {
          color: #A9BED4;
          >.level {
            color: #F64D4D;
          }
        }
        >.security-verification {
          color: #9DA5B3;
        }
      }
      >.security-setting{
        .security-setting-header {
          border-bottom: 1px solid #39424D;
          color: #fff;
        }
        .security-setting-box {
          .send-code-btn {
            background-color: #338FF5;
            color: #fff;
          }
          .error-msg{
            height:25px;
            line-height: 25px;
            color: rgb(212, 88, 88);
          }
          .input {
            border: 1px solid #485776;
            color: #fff;
            &:focus {
              border: 1px solid #338FF5;
            }
          }
          >.setting-type-box {
            border-bottom: 1px solid #39424D;
          }
          >.security-type {
            .security-type-text {
              .secure-email {
                color: #fff;
              }
              >.security-info {
                color: #A9BED4;
              }
              >.security-info-text {
                color: #F57474;
              }
            }
            .security-status {
              >.security-verify {
                background:linear-gradient(90deg,rgba(43,57,110,1),rgba(42,80,130,1));
                color: #fff;
              }
              >.security-binding {
                border: 1px solid #338FF5;
                color: #338FF5;
              }
            }
          }
        }
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      >.security-background {
        background:rgba(255,255,255,1);
        border:1px solid rgba(236,241,248,1);
      }
      >.security-header {
        color: #338FF5;
      }
      .security-title-info {
        color: #7D90AC;
        >.security-level {
          color: #333;
          >.level {
            color: #F64D4D;
          }
        }
        >.security-verification {
          color: #7D90AC;
        }
      }
      >.security-setting{
        .security-setting-header {
          border-bottom:1px solid rgba(236,241,248,1);
          color: #333;
        }
        .security-setting-box {
          .send-code-btn {
            background-color: #338FF5;
            color: #fff;
          }
          .input {
            border: 1px solid #485776;
            color: #fff;
            &:focus {
              border: 1px solid #338FF5;
            }
          }
          >.setting-type-box {
            border-bottom:1px solid rgba(236,241,248,1);
          }
          >.security-type {
            .security-type-text {
              .secure-email {
                color: #333;
              }
              >.security-info {
                color: #7D90AC;
              }
              >.security-info-text {
                color: #F57474;
              }
            }
            .security-status {
              >.security-verify {
                background:linear-gradient(90deg,rgba(43,57,110,1),rgba(42,80,130,1));
                color: #fff;
              }
              >.security-binding {
                border: 1px solid #338FF5;
                color: #338FF5;
              }
            }
          }
        }
      }
    }
  }
</style>
