<template>
  <div
    class="security-center personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="security-header security-background personal-height40 line-height40 font-size16 padding-left20">
      <span class="padding-left15 font-weight400">
        <!--安全中心-->
        {{ $t('M.comm_user_security_center') }}
      </span>
    </header>
    <div class="security-information security-background padding20 box-sizing">
      <div class="security-title">
        <div class="display-flex">
          <div class="security-title-info flex1 display-flex font-size14">
          <!-- <span class="flex1 security-level"> -->
          <span class="security-level">
            <!--账号安全级别：-->
            {{ $t('M.user_security_level') }}：
            <span
              v-if="securityLevel === 40"
              class="level"
            >
              <!--低-->
              {{ $t('M.user_security_low') }}
            </span>
            <span
              v-if="securityLevel === 80 || securityLevel === 60"
              class="level"
            >
              <!--中-->
              {{ $t('M.user_security_centre') }}
            </span>
            <span
              class="level"
              v-if="securityLevel === 100"
            >
              <!--高-->
              {{ $t('M.user_security_tall') }}
            </span>
          </span>
            <!-- <span class="flex1"> -->
            <span>
              <el-progress
                :text-inside="false"
                :stroke-width="5"
                :percentage="securityLevel"
              >
              </el-progress>
            </span>
            <!-- <span class="flex1 security-verification"> -->
            <span class="security-verification">
              <!--建议开启双重验证-->
              {{ $t('M.user_security_dual') }}
            </span>
          </div>
          <!-- <div class="security-title-info flex1"></div> -->
          <div class="security-title-info"></div>
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
      <header class="security-setting-header line-height50 padding-lr20 font-size16">
        <!--安全设置-->
        {{ $t('M.user_security_safety') }}{{ $t('M.comm_set') }}
      </header>
      <div class="security-setting-box">
        <!--安全邮箱-->
        <div class="security-type setting-type-box margin20 padding-tb18 display-flex">
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
              <span class="font-size12">{{innerUserInfo.email}}</span>
              <IconFontCommon
                v-if="!securityCenter.isMailEnable || !securityCenter.isMailBind"
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
            <!-- 修复：将点击事件写在按钮上不要写在span上 -->
            <button
              class="security-verify border-radius2 font-size12 cursor-pointer"
              @click.prevent="showStatusVerificationClose('email', securityCenter.isMailEnable? 'disable':'enable')"
            >
              <span>
                <!--关闭验证-->
                {{ securityCenter.isMailEnable? $t('M.user_security_off'): $t('M.user_security_on') }}
                 <!--开启验证-->
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
        <div class="security-type setting-type-box margin20 padding-tb18 display-flex">
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
              <span class="font-size12">{{innerUserInfo.phone}}</span>
              <IconFontCommon
                v-if="!securityCenter.isPhoneBind || !securityCenter.isPhoneEnable"
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
              class="security-verify border-radius2 font-size12 cursor-pointer"
              @click.prevent="showStatusVerificationClose('phone', securityCenter.isPhoneEnable? 'disable':'enable')"
            >
              <span>
                <!--关闭验证-->
                {{ securityCenter.isPhoneEnable? $t('M.user_security_off'): $t('M.user_security_on') }}
                <!--开启验证-->
              </span>
            </button>
            <button
              class="security-binding border-radius2 font-size12 cursor-pointer"
              @click.prevent="setShowStatusSecurity('phone')"
            >
              <span>
                <!--绑定-->
                {{ securityCenter.isPhoneBind? $t('M.comm_modification'): $t('M.user_security_binding')}}
                <!--修改-->
              </span>
            </button>
          </div>
        </div>
        <!--谷歌验证-->
        <div class="security-type setting-type-box margin20 padding-tb18 display-flex">
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
                v-if="!securityCenter.isGoogleBind || ! securityCenter.isGoogleEnable"
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
              class="security-verify border-radius2 font-size12 cursor-pointer"
              @click.prevent="showStatusVerificationClose('google', securityCenter.isGoogleEnable? 'disable':'enable')"
            >
              <span>
                <!--关闭验证-->
                {{ securityCenter.isGoogleEnable? $t('M.user_security_off'): $t('M.user_security_on') }}
                <!--开启验证-->
              </span>
            </button>
            <button
              class="security-binding border-radius2 font-size12 cursor-pointer"
              @click.prevent="setShowStatusSecurity('google')"
            >
              <span>
                <!--解绑-->
                {{ securityCenter.isGoogleBind? $t('M.user_security_unbundle') :$t('M.user_security_binding')}}
                <!--绑定-->
              </span>
            </button>
          </div>
        </div>
        <!--交易密码-->
        <div class="security-type setting-type-box margin20 padding-tb18 display-flex">
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
              <span>
                <!--设置-->
                {{ !securityCenter.payPassword? $t('M.comm_set') : $t('M.user_transaction_reset') }}
                <!--重置-->
              </span>
            </button>
          </div>
        </div>
        <!--登录密码-->
        <div class="security-type margin20 padding-tb18 display-flex">
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
              <!--!securityCenter.isPhoneEnable || securityCenter.isGoogleEnable-->
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
                  maxlength="6"
                  @keydown.enter="killDefault"
                >
                <CountDownButton
                  class="send-code-btn cursor-pointer"
                  :status="disabledOfPhoneBtn"
                  @run="sendPhoneOrEmailCode(0)"
                  v-if="closeValidation"
                />
              </el-form-item>
              <!--没有绑定邮箱不显示-->
              <!--!securityCenter.isMailEnable || securityCenter.isGoogleEnable-->
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
                  maxlength="6"
                  @keydown.enter="killDefault"
                >
                  <CountDownButton
                    class="send-code-btn cursor-pointer"
                    :status="disabledOfEmailBtn"
                    @run="sendPhoneOrEmailCode(1)"
                    v-if="closeValidation"
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
                  maxlength="6"
                  @keydown.enter="killDefault"
                />
              </el-form-item>
            </el-form>
            <!--错误提示-->
            <div
              class = "error-msg font-size12"
            >
              <span v-show = "openErrorMsg">{{ openErrorMsg }}</span>
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
                  @keydown.enter="killDefault"
                >
                <CountDownButton
                  class="send-code-btn cursor-pointer"
                  :status="disabledOfPhoneBtn"
                  @run="sendPhoneOrEmailCode(0)"
                  v-if="openTheValidation"
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
                  @keydown.enter="killDefault"
                >
                  <CountDownButton
                    class="send-code-btn cursor-pointer"
                    :status="disabledOfEmailBtn"
                    @run="sendPhoneOrEmailCode(1)"
                    v-if="openTheValidation"
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
                  @keydown.enter="killDefault"
                />
              </el-form-item>
            </el-form>
            <div
              class = "error-msg font-size12"
            >
              <span v-show = "closeErrorMsg">{{ closeErrorMsg }}</span>
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
    <div class="security-record security-background">
      <el-tabs
        v-model="activeName"
        @tab-click = "coinMoneyOrders"
      >
        <!--最近登录记录-->
        <el-tab-pane
          :label="$t('M.user_security_Login_History')"
          name="logon-record"
        >
          <div class="tab-list">
            <el-table
              :data="logonRecord"
              style="width: 100%;"
            >
              <!--登陆时间-->
              <el-table-column
                :label="$t('M.user_security_login') + $t('M.comm_time')"
              >
                <template slot-scope = "s">
                  <div>{{ timeFormatting(s.row.operateTime) }}</div>
                </template>
              </el-table-column>
              <!--登录IP-->
              <el-table-column
                :label="$t('M.user_security_login') + 'IP'"
              >
                <template slot-scope = "s">
                  <div>{{ s.row.ip }}</div>
                </template>
              </el-table-column>
              <!--归属地-->
              <el-table-column
                :label="$t('M.user_security_home_location')"
              >
                <template slot-scope = "s">
                  <div>{{ s.row.operateAddress }}</div>
                </template>
              </el-table-column>
              <!--来源-->
              <el-table-column
                :label="$t('M.user_security_source')"
              >
                <template slot-scope = "s">
                  <div>{{ s.row.source }}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="paging">
            <!--分页-->
            <el-pagination
              background
              v-show="activeName === 'logon-record' && logonRecord.length"
              layout="prev, pager, next"
              :page-count="totalPageMyLogonRecordPage"
              @current-change="changeCurrentPage('logon-record',$event)"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
        <!--安全设置记录-->
        <el-tab-pane
          :label="$t('M.user_security_Setting_History')"
          name="security-record"
        >
          <div class="tab-list">
            <el-table
              :data="securityRecord"
              style="width: 100%;">
              <!--登陆时间-->
              <el-table-column
                :label="$t('M.user_security_login') + $t('M.comm_time')"
              >
                <template slot-scope = "s">
                  <div>{{ timeFormatting(s.row.operateTime) }}</div>
                </template>
              </el-table-column>
              <!--设置名称-->
              <el-table-column
                :label="$t('M.user_security_set_type')"
              >
                <template slot-scope = "s">
                  <div>{{ s.row.content }}</div>
                </template>
              </el-table-column>
              <!--登录IP-->
              <el-table-column
                :label="$t('M.user_security_login') + 'IP'"
              >
                <template slot-scope = "s">
                  <div>{{ s.row.ip }}</div>
                </template>
              </el-table-column>
              <!--归属地-->
              <el-table-column
                :label="$t('M.user_security_home_location')"
              >
                <template slot-scope = "s">
                  <div>{{ s.row.operateAddress }}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="paging">
            <!--分页-->
            <el-pagination
              background
              v-show="activeName === 'security-record' && securityRecord.length"
              layout="prev, pager, next"
              :page-count="totalPageMySecurityRecordPage"
              @current-change="changeCurrentPage('security-record',$event)"
            >
            </el-pagination>
          </div>
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
  enableTheClosing
} from '../../../utils/api/personal'
import {
  // returnAjaxMsg,
  sendPhoneOrEmailCodeAjax,
  getSecurityCenter,
  getNestedData
} from '../../../utils/commonFunc'
import {timeFilter} from '../../../utils/index'
import {
  mapMutations,
  mapState
} from 'vuex'
export default {
  components: {
    IconFontCommon, // 字体图标
    CountDownButton // 短信倒计时
  },
  // props,
  data () {
    return {
      labelPosition: 'top', // form表单label位置
      activeName: 'logon-record', // 默认显示第一个
      // 登录记录
      logonRecord: [],
      logonRecordPage: 1, // 当前委托页码
      totalPageMyLogonRecordPage: 1, // 当前委托总页数
      // 安全设置记录
      securityRecord: [],
      securityRecordPage: 1, // 当前委托页码
      totalPageMySecurityRecordPage: 1, // 当前委托总页数
      closeValidation: false, // 关闭验证弹窗
      openTheValidation: false, // 开启验证弹窗
      openSwitch: false, // 弹出层状态 开启 关闭
      openEmail: false, // 邮箱开启关闭验证
      openPhone: false, // 手机开启关闭验证
      openGoogle: false, // 谷歌开启关闭验证
      securityCenter: {}, // 安全信息状态
      emailCode: '', // 邮箱验证
      phoneCode: '', // 手机验证
      googleCode: '', // 谷歌验证
      activeType: '', // 当前值
      state: '', // 开启关闭状态
      closeErrorMsg: '', // 关闭错误提示close
      openErrorMsg: '', // 开启错误提示open
      securityLevel: 0 // 账号安全级别
    }
  },
  async created () {
    // 调用安全中心登陆记录 安全设置记录 邮箱 手机 谷歌 交易密码 状态
    if (this.refSecurityCenterStatus) {
      await this.getSecurityCenter()
      this.CHANGE_REF_SECURITY_CENTER_INFO(false)
    }
    await this.getSecurityCenter('logon-record')
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'SET_USER_BUTTON_STATUS',
      'CHANGE_REF_SECURITY_CENTER_INFO'
    ]),
    // 禁止回车事件
    killDefault (event) {
      console.log(event)
      var evt = window.event || event
      if (evt.keyCode == 13) {
        if (evt.preventDefault) {
          evt.preventDefault()
        } else {
          evt.returnValue = false
        }
      }
    },
    // 1.时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
    },
    coinMoneyOrders (tab) {
      // console.log(tab.name)
      this.getSecurityCenter(tab.name)
    },
    /**
     * 安全中心
     */
    async getSecurityCenter (entrustType) {
      const params = {
        pageNumber: this.logonRecordPage, // 页码
        pageSize: this.pageSize // 页数
      }
      switch (entrustType) {
        case 'logon-record':
          params.pageNumber = this.logonRecordPage // 页码
          break
        case 'security-record':
          params.pageNumber = this.securityRecordPage // 页码
          break
      }
      await getSecurityCenter(this, params, (data) => {
        if (data) {
          this.securityCenter = getNestedData(data, 'data.data')
          console.log(this.securityCenter)
          this.securityLevel = getNestedData(data, 'data.data.person')
          switch (entrustType) {
            case 'logon-record':
              // 登陆记录列表
              this.logonRecord = getNestedData(data, 'data.data.loginLog.list')
              // 登陆记录分页
              this.totalPageMyLogonRecordPage = getNestedData(data, 'data.data.loginLog.pages') - 0
              break
            case 'security-record':
              // 安全设置列表
              this.securityRecord = getNestedData(data, 'data.data.setLog.list')
              console.log('安全设置列表')
              console.log(this.securityRecord)
              // 安全设置分页
              this.totalPageMySecurityRecordPage = getNestedData(data, 'data.data.setLog.pages') - 0
              break
          }
        }
      })
    },
    // 分页
    async changeCurrentPage (entrustType, pageNum) {
      // console.log(pageNum)
      switch (entrustType) {
        // 登陆记录分页
        case 'logon-record':
          this.logonRecordPage = pageNum
          await this.getSecurityCenter(entrustType)
          break
        // 安全设置分页
        case 'security-record':
          this.securityRecordPage = pageNum
          await this.getSecurityCenter(entrustType)
          break
      }
    },
    // 路由跳转对应组件
    setShowStatusSecurity (val) {
      switch (val) {
        case 'email':
          this.$goToPage('/SecureEmail')
          break
        case 'phone':
          this.$goToPage('/SecurePhone')
          break
        case 'google':
          this.$goToPage('/GoogleBinding')
          break
        case 'transaction-password':
          this.$goToPage('/TransactionPassword')
          break
        case 'login-password':
          this.$goToPage('/LoginPassword')
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
      // console.log(this.userInfo)
      let params = {
        userId: this.userInfo.userId
      }
      switch (loginType) {
        case 0:
          params.phone = this.innerUserInfo.phone
          break
        case 1:
          params.email = this.innerUserInfo.email
          break
      }
      sendPhoneOrEmailCodeAjax(loginType, params, this)
    },
    // 检测输入格式
    checkoutInputFormat (type, targetNum) {
      switch (type) {
        // 手机验证码
        case 0:
          if (!targetNum) {
            // 请输入短信验证码
            this.setErrorMsg(0, this.$t('M.login_please_input1'))
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
            this.setErrorMsg(1, this.$t('M.login_please_input2'))
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
            this.setErrorMsg(2, this.$t('M.user_please_input9'))
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
      this.closeErrorMsg = msg
    },
    // 关闭开启验证状态事件
    showStatusVerificationClose (paymentType, safeState) {
      // console.log(paymentType)
      // console.log(safeState)
      this.emailCode = ''
      this.phoneCode = ''
      this.googleCode = ''
      // 把方法中定义的activeType、state在这里进行赋值 点击哪一个那当前的类型和状态传给后台
      this.activeType = paymentType
      this.state = safeState
      switch (paymentType) {
        case 'email':
          if (!this.securityCenter.isMailBind) {
            // 未绑定邮箱
            this.$message({
              message: this.$t('M.user_please_input10'),
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
              if (this.securityCenter.enableCount === 1) {
                // 至少保留一种验证方式
                this.$message({
                  message: this.$t('M.user_security_text4'),
                  type: 'error'
                })
              } else {
                this.closeValidation = true
              }
            }
          }
          break
        case 'phone':
          if (!this.securityCenter.isPhoneBind) {
            // 未绑定手机
            this.$message({
              message: this.$t('M.user_not_bind_phone'),
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
              if (this.securityCenter.enableCount === 1) {
                // 至少保留一种验证方式
                this.$message({
                  message: this.$t('M.user_security_text4'),
                  type: 'error'
                })
              } else {
                this.closeValidation = true
              }
            }
          }
          break
        case 'google':
          if (!this.securityCenter.isGoogleBind) {
            // 未绑定谷歌
            this.$message({
              message: this.$t('M.user_please_input11'),
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
              if (this.securityCenter.enableCount === 1) {
                // 至少保留一种验证方式
                this.$message({
                  message: this.$t('M.user_security_text4'),
                  type: 'error'
                })
              } else {
                this.closeValidation = true
              }
            }
          }
          break
      }
    },
    // 确认关闭开启
    determineTheOpen () {
      this.confirmTransactionPassword(this.activeType, this.state)
    },
    // 关闭开启手机邮箱谷歌验证
    async confirmTransactionPassword (type, state) {
      if (state === 'enable') {
        if (!this.phoneCode && !this.emailCode && !this.googleCode) {
          console.log(1)
          // 请输入验证码
          this.closeErrorMsg = this.$t('M.user_please_input12')
          return false
        } else {
          this.closeErrorMsg = ''
        }
      } else if (state === 'disable') {
        if (this.securityCenter.isMailEnable && !this.emailCode) {
          this.openErrorMsg = this.$t('M.user_please_input12')
          return false
        }
        if (this.securityCenter.isPhoneEnable && !this.phoneCode) {
          this.openErrorMsg = this.$t('M.user_please_input12')
          return false
        }
        if (this.securityCenter.isGoogleEnable && !this.googleCode) {
          this.openErrorMsg = this.$t('M.user_please_input12')
          return false
        }
      }
      let data
      let params = {
        email: this.innerUserInfo.email, // 邮箱
        phone: this.innerUserInfo.phone, // 手机
        emailCode: this.emailCode, // 邮箱验证
        phoneCode: this.phoneCode, // 手机验证
        googleCode: this.googleCode, // 谷歌验证
        userId: this.userInfo.userId, // 用户id
        type: '', // 邮箱 手机 谷歌 验证验证
        status: '' // 开启 关闭
      }
      switch (type) {
        case 'email':
          // console.log(type)
          params.type = 'email'
          // console.log(params)
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
      if (!data) return false
      await this.getSecurityCenter()
      // 安全中心状态刷新
      this.openTheValidation = false
      this.closeValidation = false
      this.emailCode = ''
      this.phoneCode = ''
      this.googleCode = ''
    },
    // 获取焦点清空数据
    handleinput () {
      this.closeErrorMsg = ''
    },
    handleinput1 () {
      this.openErrorMsg = ''
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      innerUserInfo: state => state.user.loginStep1Info.userInfo, // 内层用户详细信息
      activeCountryCode: state => state.user.loginStep1Info.countryCode, // 国籍码
      disabledOfPhoneBtn: state => state.user.disabledOfPhoneBtn,
      disabledOfEmailBtn: state => state.user.disabledOfEmailBtn,
      refSecurityCenterStatus: state => state.personal.refSecurityCenterStatus,
      userCenterActiveName: state => state.personal.userCenterActiveName,
      activeLanguage: state => state.common.activeLanguage
    })
  },
  watch: {
    userCenterActiveName (newVal) {
      if (newVal === 'security-center') {
        this.getSecurityCenter()
      }
    },
    activeLanguage (newVal) {
      this.getSecurityCenter('security-record')
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../../assets/CSS/index';

  .security-center {
    > .security-information {
      height: 100px;
      margin: 10px 0;

      .security-title-info {
        > .login-time {
          width: 290px;
        }

        > .login-ip {
          width: 200px;
        }
      }
    }

    > .security-setting {
      height: 510px;

      > .security-setting-header {
        height: 50px;
      }

      > .security-setting-box {
        .send-code-btn {
          position: absolute;
          top: 3px;
          width: 96px;
          height: 34px;
        }

        .button {
          width: 271px;
          height: 34px;
          border: 0;
          line-height: 0;
          color: #fff;
          background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
        }

        .input {
          width: 175px;
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

          > .security-verify,
          > .security-binding {
            min-width: 70px;
            height: 30px;
          }

          > .security-binding {
            margin-left: 18px;
          }
        }
      }
    }

    > .security-record {
      min-height: 510px;
      margin-top: 10px;

      .tab-list {
        height: 450px;
      }
    }

    /deep/ {
      /* 表格样式修改 */
      td {
        padding: 7px 0;
      }

      .el-table {
        &::before {
          height: 0;
        }

        th {
          &:nth-child(1) {
            .cell {
              padding-left: 20px;
            }

            div {
              padding-left: 10px;
            }
          }

          &:nth-child(2) {
            .cell {
              padding-right: 75px;
              text-align: right;
            }
          }

          &:nth-child(3) {
            .cell {
              padding-right: 45px;
              text-align: right;
            }
          }

          &:nth-child(4) {
            .cell {
              padding-right: 45px;
              text-align: right;
            }
          }
        }

        td {
          div {
            font-size: 12px;
          }

          &:nth-child(1) {
            div {
              padding-left: 10px;
            }
          }

          &:nth-child(2) {
            div {
              padding-right: 23px;
              text-align: right;
            }
          }

          &:nth-child(3) {
            div {
              text-align: right;
            }
          }

          &:nth-child(4) {
            .cell {
              padding-right: 25px;
              text-align: right;
            }

            div {
              padding-right: 20px;
              text-align: right;
            }
          }
        }
      }

      /* tabs切换表头padding-left */
      .el-tabs__header {
        margin: 0;
      }

      .el-tabs__nav {
        padding-left: 15px;
      }

      .el-tabs__item {
        height: 45px;
        padding: 0 10px !important;
        border-left: 0 solid transparent !important;
        text-align: center;
        background-color: transparent !important;

        &.is-top {
          &:nth-child(2) {
            margin-right: 20px;
          }
        }
      }

      .cell {
        font-size: 12px;
      }

      .el-progress {
        width: 170px;
      }

      .el-dialog {
        width: 310px;
        border-radius: 7px;
      }

      .el-dialog__header {
        height: 44px;
        padding: 10px 20px;
        border-radius: 7px 7px 0 0;
      }

      .el-dialog__title {
        font-size: 18px;
      }

      .el-dialog__headerbtn {
        top: 13px;
      }

      .el-form-item {
        margin-bottom: 10px;
      }

      .el-form-item__label {
        height: 25px;
        padding: 0;
        line-height: 25px;
      }

      .el-dialog__body {
        padding: 10px 20px 0;
      }

      .el-input-group__append {
        padding: 0 5px;
      }

      .el-input__inner {
        width: 180px;
        height: 36px;
        border-radius: 2px 0 0 2px;
      }

      .el-input-group {
        width: 220px;
        height: 36px;
        border-radius: 4px;
      }

      .el-dialog__footer {
        text-align: left;
      }
    }

    &.night {
      color: $nightFontColor;
      background-color: $mainNightBgColor;

      > .security-background {
        background-color: $mainContentNightBgColor;
      }

      > .security-header {
        color: #338ff5;
      }

      .security-title-info {
        color: #a9bed4;

        > .security-level {
          color: #fff;

          > .level {
            margin-right: 5px;
            color: #f64d4d;
          }
        }

        > .security-verification {
          color: #9da5b3;
        }
      }

      > .security-setting {
        .security-setting-header {
          border-bottom: 1px solid #39424d;
          color: #fff;
        }

        .security-setting-box {
          .send-code-btn {
            color: #fff;
            background-color: #338ff5;
          }

          .error-msg {
            line-height: 25px;
            color: rgb(212, 88, 88);
          }

          .input {
            border: 1px solid #485776;
            color: #fff;

            &:focus {
              border: 1px solid #338ff5;
            }
          }

          > .setting-type-box {
            border-bottom: 1px solid #39424d;
          }

          > .security-type {
            .security-type-text {
              .secure-email {
                color: #fff;
              }

              > .security-info {
                color: #a9bed4;
              }

              > .security-info-text {
                color: #f57474;
              }
            }

            .security-status {
              > .security-verify {
                color: #fff;
                background: linear-gradient(90deg, rgba(18, 71, 133, 1) 0%, rgba(42, 59, 97, 1) 100%);
              }

              > .security-binding {
                border: 1px solid #338ff5;
                color: #338ff5;
              }
            }
          }
        }
      }

      /deep/ {
        /* 个人中心（黑色主题） */

        /* 表格样式修改 */
        .el-table {
          color: #fff;
          background-color: $mainContentNightBgColor;

          th,
          tr {
            background-color: #1c1f32;
          }

          thead {
            color: #617499;
          }

          th.is-leaf {
            border-bottom: 1px solid rgba(97, 116, 153, 1);
          }

          td {
            border-bottom: 1px solid rgba(97, 116, 153, .05);
            color: #ccc;
            background-color: #1c1f32;

            &:hover {
              background-color: #1c1f32;
            }

            div {
              color: #9da5b3;
            }
          }
        }

        .cell.highlight {
          color: #617499;
        }

        .cell {
          color: #a9bed4;
        }

        /* tabs切换 */
        .el-tabs__item.is-active {
          border-bottom: 2px solid #338ff5;
          border-left: 0;
          color: #338ff5;
          background-color: transparent;
        }

        .el-tabs__item {
          &:hover {
            border-left: 4px solid #1c1f32;
            color: #338ff5;
            background-color: #1c1f32;
          }
        }

        .el-dialog {
          background-color: #28334a;

          .el-dialog__header {
            color: #fff;
            background-color: #20293c;
          }

          .el-dialog__title {
            color: #fff;
          }
        }

        .el-form-item__label {
          color: #fff;
        }

        .el-input__inner {
          border: 1px solid #485776;
          color: #a9bed4;
          background-color: #1e2636;

          &:focus {
            border: 1px solid #338ff5;
          }
        }

        .el-input-group__append {
          border-top: 1px solid #485776;
          border-bottom: 1px solid #485776;
          color: #fff;
          background-color: #338ff5;
          border-right: 1px solid #485776;
        }

        .el-table__empty-block {
          background: #1c1f32;
        }
      }
    }

    &.day {
      color: $dayMainTitleColor;

      > .security-background {
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 0 6px #cfd5df;
      }

      > .security-header {
        color: #338ff5;
      }

      .security-title-info {
        color: #7d90ac;

        > .security-level {
          color: #333;

          > .level {
            margin-right: 5px;
            color: #f64d4d;
          }
        }

        > .security-verification {
          color: #7d90ac;
        }
      }

      > .security-setting {
        .security-setting-header {
          border-bottom: 1px solid rgba(236, 241, 248, 1);
          color: #333;
        }

        .security-setting-box {
          .send-code-btn {
            color: #fff;
            background-color: #338ff5;
          }

          .input {
            border: 1px solid #ecf1f8;
            color: #333;

            &:focus {
              border: 1px solid #338ff5;
            }
          }

          > .setting-type-box {
            border-bottom: 1px solid rgba(236, 241, 248, 1);
          }

          > .security-type {
            .security-type-text {
              .secure-email {
                color: #333;
              }

              > .security-info {
                color: #7d90ac;
              }

              > .security-info-text {
                color: #f57474;
              }
            }

            .security-status {
              > .security-verify {
                color: #fff;
                background: linear-gradient(90deg, rgba(106, 182, 244, 1) 0%, rgba(49, 135, 218, 1) 100%);
              }

              > .security-binding {
                border: 1px solid #338ff5;
                color: #338ff5;
              }
            }
          }
        }
      }

      /deep/ {
        /* 个人中心（白色主题） */
        .el-table {
          color: #fff;
          background-color: $mainColorOfWhite;

          th,
          tr {
            background-color: #ccc;
          }

          thead {
            color: #ccc;
          }

          th.is-leaf {
            border-bottom: 1px solid #fff;
            color: #333;
            background-color: #fff;
          }

          td {
            padding: 7px 0;
            border-bottom: 1px solid #fff;
            color: #7d90ac;
            background-color: #fff;

            &:hover {
              background-color: #fff;
            }
          }
        }

        .cell.highlight {
          color: #b1b1b1;
        }

        /* tabs切换 */
        .el-tabs__item.is-active {
          border-bottom: 2px solid #338ff5;
          border-left: 0;
          color: #338ff5;
          background-color: transparent;
        }

        .el-tabs__item {
          &.el-tabs__item {
            background-color: #fff;
          }
        }

        .el-dialog__header {
          background: rgba(51, 143, 245, .1);
        }
      }
    }
  }
</style>
