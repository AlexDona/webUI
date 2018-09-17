<template>
  <div
    class="security-center personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="security-header security-background personal-height40 line-height40 font-size16 padding-left20">
      <span class="padding-left15 font-weight600">安全中心</span>
    </header>
    <div class="security-information security-background margin-top9 padding20 box-sizing">
      <div class="security-title">
        <div class="display-flex">
          <div class="security-title-info flex1 display-flex font-size14">
          <span class="flex1 security-level">
            账号安全级别：
            <span class="level">中</span>
          </span>
            <span class="flex1">
              <el-progress :percentage="70"></el-progress>
            </span>
            <span class="flex1 security-verification">建议开启双重验证</span>
          </div>
          <div class="security-title-info flex1"></div>
        </div>
        <div class="security-title-info margin-top20 font-size12">
          <div class="login-time float-left">
            <span>上次登录时间：</span>
            <span>{{ securityCenter.loginTime }}</span>
          </div>
          <div class="login-ip float-left">
            <span>IP：</span>
            <span>{{ securityCenter.ip }}</span>
          </div>
          <div class="login-address">
            <span>归属：</span>
            <span>{{ securityCenter.ipLocation }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="security-setting security-background margin-top9">
      <header class="security-setting-header line-height50 paddinglr20 font-size16">
        安全设置
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
              <span class="secure-email font-size14 font-weight600">安全邮箱</span>
              <IconFontCommon
                v-if="!securityCenter.isMailEnable"
                class="font-size16"
                iconName="icon-wuuiconsuotanhao-copy"
              />
            </p>
            <p class="security-info margin-top9 font-size12">
              用于提币、找回密码、修改安全设置、管理API时进行安全验证。
            </p>
          </div>
          <div class="security-status text-align-r">
            <button
              v-if="!securityCenter.isMailEnable"
              class="security-verify border-radius2 font-size12 cursor-pointer"
            >
              <span @click="showStatusVerificationClose('email', 'enable')">
                开启验证
              </span>
            </button>
            <button
              v-else
              class="security-verify border-radius2 font-size12 cursor-pointer"
            >
              <span
                @click="showStatusVerificationClose('email', 'disable')"
              >
                关闭验证
              </span>
            </button>
            <button
              v-if="!securityCenter.isMailBind"
              class="security-binding border-radius2 font-size12 cursor-pointer"
              @click="setShowStatusSecurity('email')"
            >
              绑定
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
              <span class="secure-email font-size14 font-weight600">安全手机</span>
              <IconFontCommon
                v-if="!securityCenter.isPhoneBind"
                class="font-size16"
                iconName="icon-wuuiconsuotanhao-copy"
              />
            </p>
            <p class="security-info margin-top9 font-size12">
              用于提币、找回密码、修改安全设置、管理API时进行安全验证。
            </p>
          </div>
          <div class="security-status text-align-r">
            <button
              v-if="!securityCenter.isPhoneEnable"
              class="security-verify border-radius2 font-size12 cursor-pointer"
            >
              <span @click="showStatusVerificationClose('phone', 'enable')">
                开启验证
              </span>
            </button>
            <button
              v-else
              class="security-verify border-radius2 font-size12 cursor-pointer"
            >
              <span
                @click="showStatusVerificationClose('phone', 'disable')"
              >
                关闭验证
              </span>
            </button>
            <button
              class="security-binding border-radius2 font-size12 cursor-pointer"
              @click="setShowStatusSecurity('phone')"
            >
              <span v-if="!securityCenter.isPhoneBind">绑定</span>
              <span v-else>修改</span>
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
              <span class="secure-email font-size14 font-weight600">谷歌验证</span>
              <IconFontCommon
                v-if="!securityCenter.isGoogleBind"
                class="font-size16"
                iconName="icon-wuuiconsuotanhao-copy"
              />
            </p>
            <p class="security-info margin-top9 font-size12">
              用于提币、找回密码、修改安全设置、管理API时进行安全验证。
            </p>
          </div>
          <div class="security-status text-align-r">
            <button
              v-if="!securityCenter.isGoogleEnable"
              class="security-verify border-radius2 font-size12 cursor-pointer"
            >
              <span @click="showStatusVerificationClose('google', 'enable')">
                开启验证
              </span>
            </button>
            <button
              v-else
              class="security-verify border-radius2 font-size12 cursor-pointer"
            >
              <span
                @click="showStatusVerificationClose('google', 'disable')"
              >
                关闭验证
              </span>
            </button>
            <button
              class="security-binding border-radius2 font-size12 cursor-pointer"
              @click="setShowStatusSecurity('google')"
            >
              <span v-if="!securityCenter.isGoogleBind">绑定</span>
              <span v-else>解绑</span>
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
              <span class="secure-email font-size14 font-weight600">交易密码</span>
              <IconFontCommon
                v-if="!securityCenter.payPassword"
                class="font-size16"
                iconName="icon-wuuiconsuotanhao-copy"
              />
            </p>
            <p class="security-info-text margin-top9 font-size12">
              交易密码用于账户交易，建议立即设置
            </p>
          </div>
          <div class="security-status text-align-r">
            <button
              class="security-binding border-radius2 font-size12 cursor-pointer"
              @click="setShowStatusSecurity('transaction-password')"
            >
              <span v-if="!securityCenter.payPassword">设置</span>
              <span v-else>重置</span>
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
              <span class="secure-email font-size14 font-weight600">登陆密码</span>
            </p>
            <p class="security-info margin-top9 font-size12">
              用于提币、找回密码、修改安全设置、管理API时进行安全验证。
            </p>
          </div>
          <div class="security-status text-align-r">
            <button
              class="security-binding border-radius2 font-size12 cursor-pointer"
              @click="setShowStatusSecurity('login-password')"
            >
              <span>修改</span>
            </button>
          </div>
        </div>
        <!--关闭验证-->
        <el-dialog
          title="关闭验证"
          :visible.sync="closeValidation"
        >
          <el-form label-width="120px">
            <!--没有绑定手机不显示-->
            <div v-if="!securityCenter.isPhoneBind"></div>
            <!--绑定手机之后显示-->
            <el-form-item
              label="手机验证"
              v-else
            >
              <el-input
                v-model="phoneCode"
              >
                <template slot="append">
                  <CountDownButton
                    class="send-code-btn cursor-pointer"
                    :status="disabledOfPhoneBtn"
                    @run="sendPhoneOrEmailCode(0)"
                  />
                </template>
              </el-input>
            </el-form-item>
            <!--没有绑定邮箱不显示-->
            <div v-if="!securityCenter.isMailBind"></div>
            <!--绑定邮箱之后显示-->
            <el-form-item
              label="邮箱验证"
              v-else
            >
              <el-input
                v-model="emailCode"
              >
                <template slot="append">
                  <CountDownButton
                    class="send-code-btn cursor-pointer"
                    :status="disabledOfEmailBtn"
                    @run="sendPhoneOrEmailCode(1)"
                  />
                </template>
              </el-input>
            </el-form-item>
            <!--没有绑定谷歌不显示-->
            <div v-if="!securityCenter.isGoogleBind"></div>
            <!--绑定谷歌之后显示-->
            <el-form-item
              label="谷歌验证"
              v-else
            >
              <input
                class="input border-radius2 padding-l15 box-sizing"
                v-model="googleCode"
              />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeValidation = false">取 消</el-button>
            <el-button type="primary" @click="determineTheOpen">确 定</el-button>
          </div>
        </el-dialog>
        <!--开启验证-->
        <el-dialog
          title="开启验证"
          :visible.sync="openTheValidation"
        >
          <el-form label-width="120px">
            <!--开启手机-->
            <el-form-item
              label="手机验证"
              v-show="openPhone"
            >
              <el-input
                v-model="phoneCode"
              >
                <template slot="append">
                  <CountDownButton
                    class="send-code-btn cursor-pointer"
                    :status="disabledOfPhoneBtn"
                    @run="sendPhoneOrEmailCode(0)"
                  />
                </template>
              </el-input>
            </el-form-item>
            <!--开启邮箱-->
            <el-form-item
              label="邮箱验证"
              v-show="openEmail"
            >
              <el-input
                v-model="emailCode"
              >
                <template slot="append">
                  <CountDownButton
                    class="send-code-btn cursor-pointer"
                    :status="disabledOfEmailBtn"
                    @run="sendPhoneOrEmailCode(1)"
                  />
                </template>
              </el-input>
            </el-form-item>
            <!--开启谷歌-->
            <el-form-item
              label="谷歌验证"
              v-show="openGoogle"
            >
              <input
                class="input border-radius2 padding-l15 box-sizing"
                v-model="googleCode"
              />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="openTheValidation = false">取 消</el-button>
            <el-button type="primary" @click="determineTheOpen">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
    <div class="security-record security-background margin-top9">
      <el-tabs v-model="securityActiveName">
        <el-tab-pane label="最近登录记录" name="first">
          <el-table
            :data="logonRecord"
            style="width: 100%">
            <el-table-column
              label="登陆时间"
            >
              <template slot-scope = "s">
                <div>{{ timeFormatting(s.row.operateTime) }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="登录IP"
            >
              <template slot-scope = "s">
                <div>{{ s.row.ip }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="归属地"
            >
              <template slot-scope = "s">
                <div>{{ s.row.operateAddress }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="来源"
            >
              <template slot-scope = "s">
                <div>{{ s.row.source }}</div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="安全设置记录" name="second">
          <el-table
            :data="securityRecord"
            style="width: 100%">
            <el-table-column
              label="登陆时间"
            >
              <template slot-scope = "s">
                <div>{{ timeFormatting(s.row.operateTime) }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="设备名称"
            >
              <template slot-scope = "s">
                <div>{{ s.row.source }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="登录IP"
            >
              <template slot-scope = "s">
                <div>{{ s.row.ip }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="归属地"
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
      state: '' // 开启关闭
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
      // console.log(this.disabledOfPhoneBtn)
      // console.log(this.disabledOfEmailBtn)
      if (this.disabledOfPhoneBtn || this.disabledOfEmailBtn) {
        return false
      }
      let params = {
        // address: this.emailAccounts, // 邮箱账号
        // country: this.activeCountryCode // 邮箱国籍
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
    // 关闭开启验证状态事件
    showStatusVerificationClose (paymentType, safeState) {
      // 把方法中定义的activeType、state在这里进行赋值 点击哪一个那当前的类型和状态传给后台
      this.activeType = paymentType
      this.state = safeState
      switch (paymentType) {
        case 'email':
          if (!this.securityCenter.isMailBind) {
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
    // 确认关闭
    determineTheOpen () {
      this.confirmTransactionPassword(this.activeType, this.state)
    },
    // 关闭开启手机邮箱谷歌验证
    async confirmTransactionPassword (type, state) {
      console.log(type)
      console.log(state)
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
        this.logonRecord = data.data.data.setLog
        this.securityRecord = data.data.data.loginLog
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
      refSecurityCenterStatus: state => state.personal.refSecurityCenterStatus
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/UserAssets/SecurityCenter";
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
        .input {
          width: 220px;
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
