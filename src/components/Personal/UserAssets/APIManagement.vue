<template>
  <div
    class="api-management personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="api-management-header personal-height40 line-height40 padding-left20 font-size16 background-color">
      <span class="padding-left23 header-content font-weight600">
        <!--API管理-->
        API{{ $t('M.user_api_administration') }}
      </span>
    </header>
    <div class="invitation-promotion-main min-height500 margin-top9">
      <!--创建API KEY-->
      <div class="extension-info padding-top0">
        <header class="extension-info-header line-height56">
          <span
            class="font-size16 header-color"
            v-if="language === 'ko_KR'"
          >
            <!--创建API KEY-->
            API KEY{{ $t('M.comm_creation') }}
          </span>
          <span
            class="font-size16 header-color"
            v-else
          >
            <!--创建API KEY-->
            {{ $t('M.comm_creation') }}API KEY
          </span>
        </header>
        <div class="extension-info-content display-flex">
          <div class="info-content info-content-left flex1">
            <el-form
              label-width="120px"
            >
              <!--备注-->
              <el-form-item
                :label="$t('M.comm_remark') + '：'"
              >
                <input
                  type="text"
                  class="api-input border-radius2 padding-l15 box-sizing"
                  v-model="remark"
                  @focus="emptyStatus"
                >
              </el-form-item>
              <!--绑定IP地址-->
              <el-form-item
                :label="$t('M.user_security_binding_IP') + '：'"
              >
                <input
                  type="text"
                  class="api-input border-radius2 padding-l15 box-sizing"
                  v-model="ipSite"
                  @focus="emptyStatus"
                >
              </el-form-item>
              <!--错误提示-->
              <div
                class = "error-msg-text error-msg font-size12"
              >
                <span v-show = "createErrorMsg">{{ createErrorMsg }}</span>
              </div>
              <button
                class="api-button border-radius4 cursor-pointer font-size14"
                @click.prevent="stateEstablishApiButton"
              >
                <!--创建-->
                {{ $t('M.comm_creation') }}
              </button>
            </el-form>
          </div>
          <div class="info-content info-content-right flex1 font-size12">
            <p class="font-size14 content-title">
              <!--温馨提示-->
              {{ $t('M.user_account_warm_prompt') }}
            </p>
            <!--本平台为您提供了强大的API，您可以通过 API 使用行情查询、自动-->
            <!--交易等服务。通过 API 文档 查看如何使用;-->
            <!--每个用户最多创建5组API Key;-->
            <!--请不要泄露您的API Key，以免造成资产损失。出于安全考虑，建议为-->
            <!--API Key绑定IP，每个API Key最多绑定4个IP。 单个地址直接填写，多-->
            <!--个IP地址用半角逗号分隔，如：192.168.1.1,192.168.1.2,192.168.1.3。-->
            <div class="content-info">
              <span class="style">● </span>
              <p class="content-text">
                {{ $t('M.user_api_text1') }}
                {{$t('M.user_api_text0')}}
                <a
                  class="link-info"
                  href="https://github.com/bizuyun/API/wiki"
                  target="_blank"
                >
                  {{$t('M.comm_api_doc')}}
                </a>
                {{$t('M.user_api_text01')}}
              </p>
            </div>
            <div class="content-info">
              <span class="style">● </span>
              <p class="content-text">
                {{ $t('M.user_api_text2') }}
              </p>
            </div>
            <div class="content-info">
              <span class="style">● </span>
              <p class="content-text">
                {{ $t('M.user_api_text3') }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <!--我的 API KEY-->
      <div class="extension-statistics margin-top9 padding-top0">
        <header class="extension-statistics-header line-height56">
          <span class="font-size16 header-color header-right">
            <!--我的 API KEY-->
            {{ $t('M.user_api_my') }} API KEY
          </span>
        </header>
        <div class="extension-statistics-content">
          <el-table
            :data="extensionList"
            style="width: 100%;"
            :empty-text="$t('M.comm_no_data')"
          >
            <!--创建时间-->
            <el-table-column
              :label="$t('M.comm_creation') + $t('M.comm_time')"
            >
              <template slot-scope = "s">
                <div>{{s.row.createTime}}</div>
              </template>
            </el-table-column>
            <!--备注-->
            <el-table-column
              :label="$t('M.comm_remark')"
              width="100"
            >
              <template slot-scope = "s">
                <div>{{ s.row.remark }}</div>
              </template>
            </el-table-column>
            <!--API访问秘钥-->
            <el-table-column
              :label="'API' + $t('M.user_api_text4')"
              width="225"
            >
              <template slot-scope = "s">
                <div
                  class="ip-width"
                  :title="s.row.accessKey"
                >
                  {{ s.row.accessKey }}
                </div>
              </template>
            </el-table-column>
            <!--IP地址-->
            <el-table-column
              :label="'IP' + $t('M.comm_site')"
            >
              <template slot-scope = "s">
                <div
                  class="ip-width"
                  :title="s.row.ip"
                >
                  {{ s.row.ip }}
                </div>
              </template>
            </el-table-column>
            <!--状态-->
            <el-table-column
              :label="'IP ' + $t('M.comm_state')"
              width="100"
            >
              <template slot-scope = "s">
                <div v-if="s.row.status == 'enable'">{{ $t(enable) }}</div>
                <div v-if="s.row.status == 'disable'">{{ $t(disable) }}</div>
              </template>
            </el-table-column>
            <!--操作-->
            <el-table-column
              :label="$t('M.comm_operation')"
              width="100"
            >
              <template slot-scope = "s">
                <div
                  class="compile float-left cursor-pointer"
                  @click.prevent="compileApi(s.row.id)"
                  :id="s.row.id"
                >
                  <!--编辑-->
                  {{ $t('M.comm_newly_compile') }}
                </div>
                <div
                  class="compile float-left cursor-pointer"
                  @click.prevent="deleteUser(s.row.id)"
                  :id="s.row.id"
                >
                  <!--删除-->
                  {{ $t('M.comm_delete') }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--验证方式验证-->
      <div class="verification-method">
        <!--安全验证-->
        <el-dialog
          :title="$t('M.user_security_safety') + $t('M.user_security_verify')"
          :visible.sync="APIMoneyConfirm"
        >
          <el-form
            :label-position="labelPosition"
          >
            <!--手机已认证-->
            <!--手机验证-->
            <el-form-item
              v-if="securityCenter.isPhoneEnable"
              :label="$t('M.user_security_phone') + $t('M.user_security_verify')"
            >
              <input
                class="content-input padding-l15 box-sizing"
                type="number"
                v-model="phoneCode"
                @focus="emptyAddStatus"
              >
              <CountDownButton
                class="send-code-btn cursor-pointer float-right"
                :status="disabledOfPhoneBtn"
                @run="sendPhoneOrEmailCode(0)"
                v-if="APIMoneyConfirm"
              />
            </el-form-item>
            <!--手机未认证-->
            <span v-else></span>
            <!--邮箱已认证-->
            <!--邮箱验证-->
            <el-form-item
              v-if="securityCenter.isMailEnable"
              :label="$t('M.user_security_email') + $t('M.user_security_verify')"
            >
              <input
                class="content-input padding-l15 box-sizing"
                type="number"
                v-model="emailCode"
                @focus="emptyAddStatus"
              >
              <CountDownButton
                class="send-code-btn cursor-pointer float-right"
                :status="disabledOfEmailBtn"
                @run="sendPhoneOrEmailCode(1)"
                v-if="APIMoneyConfirm"
              />
            </el-form-item>
            <!--邮箱未认证-->
            <span v-else></span>
            <!--谷歌已认证-->
            <!--谷歌验证-->
            <el-form-item
              v-if="securityCenter.isGoogleEnable"
              :label="$t('M.user_security_google') + $t('M.user_security_verify')"
            >
              <input
                class="content-input input-google padding-l15 box-sizing"
                type="number"
                v-model="googleCode"
                @focus="emptyAddStatus"
              >
            </el-form-item>
            <!--谷歌未认证-->
            <span v-else></span>
          </el-form>
          <!--错误提示-->
          <div
            class = "error-msg error-msg1 font-size12"
          >
            <span v-show = "errorVerifyMsg">
              {{ errorVerifyMsg }}
            </span>
          </div>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <button
              type="primary"
              class="primary-button cursor-pointer"
              @click.prevent="stateSubmitDetermineValidation"
            >
              <!--确 定-->
              {{ $t('M.comm_confirm') }}
            </button>
          </div>
        </el-dialog>
      </div>
      <!--二次信息确认弹框-->
      <div class="secondary-confirmation">
        <!--创建成功-->
        <el-dialog
          :title="$t('M.comm_creation') + $t('M.user_invite_succeed')"
          :visible.sync="apiSecondaryConfirmation"
        >
          <el-form
            :label-position="labelPosition"
          >
            <!--API访问秘钥 （Access Key）-->
            <el-form-item
              style="margin-bottom: 0;"
              :label="'API' + $t('M.user_api_text4') + '（Access Key）'"
            >
              <input
                class="content-input input-google padding-l15 box-sizing"
                v-model="accessKey"
                disabled
              >
              <span
                class="code-copy cursor-pointer text-align-c display-inline-block"
                v-clipboard:copy="accessKey"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
              >
                <!--|&nbsp;&nbsp;复制-->
                |&nbsp;&nbsp;{{ $t('M.comm_copy') }}
              </span>
            </el-form-item>
            <!--API访问秘钥 （Access Key）-->
            <el-form-item
              style="margin-bottom: 0;"
              :label="'API' + $t('M.user_api_text8') + '（Secret Key）'"
            >
              <input
                class="content-input input-google padding-l15 box-sizing"
                v-model="secretKey"
                disabled
              >
              <span
                class="code-copy cursor-pointer text-align-c display-inline-block"
                v-clipboard:copy="secretKey"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
              >
                <!--|&nbsp;&nbsp;复制-->
                |&nbsp;&nbsp;{{ $t('M.comm_copy') }}
              </span>
              <p class="font-size12 text-info text-margin ">
                <!--（仅显示1次，遗失后不可找回，请务必妥善保存）-->
                （{{ $t('M.user_api_text5') }}）
              </p>
            </el-form-item>
            <el-form-item
              :label="$t('M.user_security_binding') + 'IP' + $t('M.comm_site')"
            >
              <input
                class="content-input input-google padding-l15 box-sizing"
                v-model="bindingIpAddress"
                disabled
              >
              <!--温馨提示-->
              <!--请不要泄露您的Secret Key，避免造成资产损失。-->
              <!--如您忘记了Secret Key，请删除该密钥对并申请新的密钥对。-->
              <p class="font-size12 text-info text-margin">
                <!-- 温馨提示 -->
                {{ $t('M.user_account_warm_prompt') }}
              </p>
              <p class="font-size12 text-info">
                <!--• 请不要泄露您的Secret Key，避免造成资产损失。-->
                • {{ $t('M.user_api_text6') }}
              </p>
              <p class="font-size12 text-info text-bottom">
                <!--• 如您忘记了Secret Key，请删除该密钥对并申请新的密钥对。-->
                • {{ $t('M.user_api_text7') }}
              </p>
            </el-form-item>
          </el-form>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <button
              type="primary"
              class="primary-button cursor-pointer"
              @click.prevent="stateSubmitAffirm"
            >
              <!--确 定-->
              {{ $t('M.comm_confirm') }}
            </button>
          </div>
        </el-dialog>
      </div>
      <!--编辑api-->
      <div class="editor">
        <!--编辑API-->
        <el-dialog
          :title="$t('M.comm_newly_compile') + ' API'"
          :visible.sync="compileUserApi"
        >
          <el-form
            :label-position="labelPosition"
          >
            <!--备注-->
            <el-form-item
              style="margin-bottom: 0;"
              :label="$t('M.comm_remark')"
            >
              <input
                class="content-input input-google padding-l15 box-sizing"
                v-model="apiRemark"
                @keydown="setEditorErrorMsg(0,'')"
                @blur="editorInputFormat(0, apiRemark)"
              >
            </el-form-item>
            <!--绑定IP地址-->
            <el-form-item
              :label="$t('M.user_security_binding')+ 'IP' + $t('M.comm_site')"
            >
              <input
                class="content-input input-google padding-l15 box-sizing"
                v-model="ipAddress"
                @keydown="setEditorErrorMsg(1,'')"
                @blur="editorInputFormat(1, ipAddress)"
              >
            </el-form-item>
          </el-form>
          <!--错误提示-->
          <div
            class="error-msg font-size12"
          >
            <span v-show="errorEditorMsg">{{ errorEditorMsg }}</span>
          </div>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <button
              type="primary"
              class="primary-button cursor-pointer"
              @click.prevent="stateCompileUserApi"
            >
              <!--确 定-->
              {{ $t('M.comm_confirm') }}
            </button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import CountDownButton from '../../Common/CountDownCommon'// 字体图标
import IconFontCommon from '../../Common/IconFontCommon'
import ErrorBox from '../../User/ErrorBox'
import { IP_REG } from '../../../utils/regExp' // 正则验证
import {
  multipleUserAPIInfo,
  stateCreationApi,
  accessAecretKeyInfo,
  modifyUserInformation,
  deleteUserInformation
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
    ErrorBox,
    CountDownButton // 短信倒计时
  },
  data () {
    return {
      labelPosition: 'top', // form表单label位置
      createErrorMsg: '', // 创建时错误信息
      errorVerifyMsg: '', // 错误信息
      errorEditorMsg: '', // 错误信息
      securityCenter: {}, // 安全信息状态
      enable: 'M.comm_start_using', // 启用
      disable: 'M.comm_forbidden', // 禁用
      APIMoneyConfirm: false, // 默认API确认弹窗
      phoneCode: '', // 手机验证
      emailCode: '', // 邮箱验证
      googleCode: '', // 谷歌验证
      // 默认创建之后弹出二次挨批创建信息框
      apiSecondaryConfirmation: false,
      accessKey: '', // API访问秘钥 （Access Key）
      secretKey: '', // API访问秘钥 （Access Key）
      ipSite: '', // 备注
      remark: '',
      bindingIpAddress: '', // 绑定IP地址
      extensionList: [], // 展示渲染IP列表
      compileUserApi: false, // 编辑用户api弹窗
      userId: '', // 编辑用户api
      apiRemark: '', // 编辑用户备注
      ipAddress: '', // 编辑用户ip
      dialogVisible: false
    }
  },
  created () {
    this.getMultipleUserAPIInfo()
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'SET_USER_BUTTON_STATUS'
    ]),
    // 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
    },
    // 获取多个用户api信息
    async getMultipleUserAPIInfo () {
      let data = await multipleUserAPIInfo({})
      // console.log('获取多个用户api信息')
      // console.log(data)
      if (!data) return false
      // 返回展示渲染挨批列表
      this.extensionList = getNestedData(data, 'data')
      // console.log(this.extensionList)
    },
    // 点击创建
    stateEstablishApiButton () {
      let isAllIpRight = true

      if (!this.remark) {
        // 请输入备注
        this.createErrorMsg = this.$t('M.comm_please_enter') + this.$t('M.comm_remark')
        return false
      } else if (!this.ipSite) {
        // 请输入IP地址
        this.createErrorMsg = this.$t('M.comm_please_enter') + this.$t('M.user_security_binding') + 'IP' + this.$t('M.comm_site')
        return false
      } else {
        let ipSiteList = this.ipSite.split(',')
        ipSiteList.forEach(ip => {
          if (!IP_REG.test(ip)) {
            isAllIpRight = false
            return false
          }
        })

        if (!isAllIpRight) {
          this.createErrorMsg = this.$t('M.user_re_input_ip')
          return false
        } else {
          // 调用安全方式接口
          this.getSecurityCenter()
          // 赋值创建IP修改时的带回
          this.bindingIpAddress = this.ipSite
        }
      }
    },
    // 创建api检测输入格式
    editorInputFormat (type, targetNum) {
      switch (type) {
        // 编辑用户备注
        case 0:
          if (!targetNum) {
            this.setEditorErrorMsg(0, this.$t('M.comm_please_enter') + this.$t('M.user_api_user') + this.$t('M.comm_remark'))
            this.$forceUpdate()
            return 0
          } else {
            this.setEditorErrorMsg(0, '')
            this.$forceUpdate()
            return 1
          }
        // 编辑用户ip
        case 1:
          if (!targetNum) {
            this.setEditorErrorMsg(1, this.$t('M.comm_please_enter') + this.$t('M.comm_newly_compile') + 'IP' + this.$t('M.comm_site'))
            this.$forceUpdate()
            return 0
          } else {
            this.setEditorErrorMsg(1, '')
            this.$forceUpdate()
            return 1
          }
      }
    },
    // 发送验证码
    sendPhoneOrEmailCode (loginType) {
      if (this.disabledOfPhoneBtn || this.disabledOfEmailBtn) {
        return false
      }
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
    // 验证确认按钮
    stateSubmitDetermineValidation () {
      if (this.securityCenter.isMailEnable && !this.emailCode) {
        this.errorVerifyMsg = this.$t('M.comm_please_enter') + this.$t('M.user_security_verify')
        return false
      }
      if (this.securityCenter.isPhoneEnable && !this.phoneCode) {
        this.errorVerifyMsg = this.$t('M.comm_please_enter') + this.$t('M.user_security_verify')
        return false
      }
      if (this.securityCenter.isGoogleEnable && !this.googleCode) {
        this.errorVerifyMsg = this.$t('M.comm_please_enter') + this.$t('M.user_security_verify')
        return false
      }
      //  获取秘钥
      this.getAccessAecretKey()
    },
    //  获取秘钥
    async getAccessAecretKey () {
      let data = await accessAecretKeyInfo({
        phoneCode: this.phoneCode, // 手机验证码
        emailCode: this.emailCode, // 邮箱验证码
        googleCode: this.googleCode // 谷歌验证码
      })
      // console.log(data)
      if (!data) return false
      // 默认API确认弹窗
      this.APIMoneyConfirm = false
      // 默认创建之后弹出二次挨批创建信息框
      this.apiSecondaryConfirmation = true
      // 对api秘钥进行赋值
      let detailData = getNestedData(data, 'data')
      this.accessKey = getNestedData(detailData, 'accessKey')
      this.secretKey = getNestedData(detailData, 'secretKey')
      // 创建api
      this.statusCreationApi()
    },
    // 二次确认框创建api完成
    stateSubmitAffirm () {
      // 默认创建之后弹出二次挨批创建信息框 关闭
      this.apiSecondaryConfirmation = false
    },
    // 调用创建api接口并向后台传参
    async statusCreationApi () {
      let data = await stateCreationApi({
        remark: this.remark, // 备注
        ip: this.bindingIpAddress, // ip地址
        accessKey: this.accessKey, // token
        secretKey: this.secretKey // sk私钥
      })
      // console.log(data)
      if (!data) return false
      // 默认创建之后弹出二次挨批创建信息框 关闭
      // this.apiSecondaryConfirmation = false
      // 调用查询接口重新渲染
      this.getMultipleUserAPIInfo()
      this.clearUserInputMsg()
    },
    clearUserInputMsg () {
      // 清空备注和IP
      this.remark = ''
      this.ipSite = ''
      this.phoneCode = ''
      this.emailCode = ''
      this.googleCode = ''
    },
    // 清空添加api内容信息
    emptyAddStatus () {
      this.errorVerifyMsg = ''
    },
    // 清空内容信息
    emptyStatus () {
      this.createErrorMsg = ''
    },
    // 编辑用户api 每一行ID
    compileApi (id) {
      this.compileUserApi = true
      this.userId = id
      this.extensionList.forEach((item) => {
        if (item.id == id) {
          // 用户付款时二次确认信息
          this.apiRemark = item.remark
          this.ipAddress = item.ip
        }
      })
    },
    // 设置错误信息
    setEditorErrorMsg (index, msg) {
      this.errorEditorMsg = msg
    },
    // 编辑确认
    stateCompileUserApi () {
      this.stateCompileApi()
    },
    //  编辑用户api接口
    async stateCompileApi () {
      // 判断是否满足验证条件
      let goOnStatus = 0
      if (
        this.editorInputFormat(0, this.apiRemark) &&
        this.editorInputFormat(1, this.ipAddress)
      ) {
        goOnStatus = 1
      } else {
        goOnStatus = 0
      }
      if (goOnStatus) {
        let data = await modifyUserInformation({
          id: this.userId, // 用户userId
          remark: this.apiRemark, // 编辑用户备注
          ip: this.ipAddress // 编辑用户ip
        })
        // console.log(data)
        if (!data) return false
        // 调用查询接口编辑完成之后重新赋值渲染
        this.getMultipleUserAPIInfo()
        // 清空数据
        this.stateEmptyData()
        // 编辑用户api弹窗 关闭
        this.compileUserApi = false
      }
    },
    // 接口请求完成之后清空数据
    stateEmptyData () {
      this.apiRemark = ''
      this.ipAddress = ''
    },
    // 删除
    deleteUser (id) {
      this.userId = id
      // 确定删除API地址吗, 是否继续?
      this.$confirm(this.$t('M.comm_sure_delete'), {
        cancelButtonText: this.$t('M.comm_cancel'), // 取消
        confirmButtonText: this.$t('M.comm_confirm') // 确定
      }).then(() => {
        this.deleteUserApi(id)
      }).catch(() => {
      })
    },
    //  删除记录
    async deleteUserApi () {
      let data = await deleteUserInformation({
        id: this.userId
      })
      // console.log(data)
      if (!data) return false
      // 返回展示
      this.getMultipleUserAPIInfo()
      this.dialogVisible = false
    },
    /**
     * 安全中心
     */
    getSecurityCenter () {
      getSecurityCenter(this, {}, data => {
        if (data) {
          this.securityCenter = getNestedData(data, 'data.data')
          // 默认API确认弹窗
          this.APIMoneyConfirm = true
        }
      })
    },
    //  点击复制
    onCopy (e) {
      // 已拷贝
      let msg = this.$t('M.comm_have_been_copied')
      this.$message({
        type: 'success',
        message: msg
      })
    },
    onError (e) {
      // 拷贝失败，请稍后重试
      let msg = this.$t('M.comm_copies_failure')
      this.$message({
        type: 'success',
        message: msg
      })
    }
  },
  filter: {},
  computed: {
    ...mapState({
      language: state => state.common.language, // 当前选中语言
      theme: state => state.common.theme,
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      innerUserInfo: state => state.user.loginStep1Info.userInfo, // 内层用户详细信息
      disabledOfPhoneBtn: state => state.user.disabledOfPhoneBtn,
      disabledOfEmailBtn: state => state.user.disabledOfEmailBtn,
      userCenterActiveName: state => state.personal.userCenterActiveName
    })
  },
  watch: {
    userCenterActiveName (newVal) {
      // console.log(newVal)
      if (newVal === 'api-management') {
        this.getMultipleUserAPIInfo()
      }
    },
    compileUserApi (newVal) {
      if (!newVal) {
        this.clearUserInputMsg()
      }
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal";

  .api-management {
    > .invitation-promotion-main {
      .code-copy {
        position: absolute;
        top: 4px;
        right: 1px;
        min-width: 55px;
        height: 33px;
        padding: 0 5px;
        line-height: 33px;
      }

      .error-msg-text {
        padding-left: 140px;
      }

      .error-msg {
        line-height: 20px;
        color: #d45858;
      }

      .error-msg1 {
        padding-left: 0;
      }

      .error-msg2 {
        padding-left: 0;
      }

      .content-input {
        width: 200px;
        height: 35px;
      }

      .text-margin {
        margin-top: 10px;
      }

      .input-google {
        width: 305px;
      }

      .text-bottom {
        margin-bottom: 10px;
      }

      .text-info {
        line-height: 20px;
      }

      .primary-button {
        width: 300px;
        height: 35px;
        border-radius: 4px;
      }

      .send-code-btn {
        position: absolute;
        top: 3px;
        right: 1px;
        width: 100px;
        height: 35px;
        padding: 0;
      }

      > .extension-info {
        min-height: 350px;

        > .extension-info-header {
          height: 56px;
        }

        > .extension-info-content {
          > .info-content {
            height: 250px;
            padding-top: 20px;

            .api-input {
              width: 220px;
              height: 34px;
            }

            .content-title {
              padding-left: 12px;
              margin-bottom: 10px;
            }

            .content-info {
              display: flex;
              line-height: 25px;

              .style {
                margin-right: 5px;
              }

              .content-text {
                flex: 4;
                padding-right: 40px;

                .link-info {
                  color: #338ff5;
                }
              }
            }

            .api-button {
              width: 220px;
              padding: 10px 0;
              margin-left: 140px;
            }

            .prompt-message {
              height: 20px;
              padding-left: 35px;
            }
          }
        }
      }

      > .extension-statistics {
        min-height: 200px;
        margin-bottom: 20px;

        > .extension-statistics-header {
          height: 56px;
        }

        > .extension-statistics-content {
          min-height: 230px;

          .ip-width {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .compile {
            color: #338ff5;

            &:first-child {
              margin-right: 5px;
            }
          }
        }
      }
    }

    /deep/ {
      th.is-leaf {
        border-bottom: 0;
      }

      td {
        border-bottom: 0;
      }

      .verification-method {
        .el-dialog {
          width: 340px;
        }

        .el-dialog__body {
          padding: 0 20px;
        }
      }

      .el-dialog {
        &:nth-child(2) {
          width: 360px;
          height: 480px !important;
        }

        &:nth-child(4) {
          width: 300px;
          height: 200px !important;
        }

        &:last-child {
          .el-button {
            &:first-child {
              border: 0;
            }
          }
        }
      }

      .secondary-confirmation {
        .el-dialog__header {
          padding: 0 40px;
        }

        .el-dialog {
          top: 5%;
          width: 385px;
        }

        .el-dialog__body {
          padding: 5px 40px;
        }

        .el-dialog__footer {
          text-align: center;
        }
      }

      .editor {
        .el-dialog__header {
          padding: 0 40px;
          border-radius: 5px 5px 0 0;
        }

        .el-dialog {
          width: 380px;
        }

        .el-dialog__body {
          padding: 0 40px;
        }

        .el-dialog__footer {
          text-align: center;
        }
      }

      .delete {
        .el-dialog {
          .el-dialog__body {
            text-align: center;
            color: #fff;
          }

          .el-button {
            &:first-child {
              width: 80px;
              height: 36px;
              line-height: 0;
              color: #fff;
            }

            &:last-child {
              width: 80px;
              height: 36px;
              border: 1px solid rgba(51, 143, 245, 1);
              line-height: 0;
              color: #fff;
              background-color: #28334a;
            }
          }
        }
      }

      .el-dialog__header {
        height: 44px;
        padding: 0 20px;
        border-radius: 5px 5px 0 0;
        font-size: 18px;
        line-height: 44px;
      }

      .el-dialog__headerbtn {
        top: 13px;
      }

      .el-form-item__label {
        padding: 0;
      }

      .el-dialog__footer {
        padding: 10px 20px 30px;
      }

      .el-form-item {
        margin-bottom: 15px;
      }

      .el-table__empty-block {
        width: 100% !important;
        min-height: 165px;
      }

      /* 备注绑定IP部分样式修复 */
      .invitation-promotion-main {
        .extension-info {
          .extension-info-content {
            .info-content {
              .el-form {
                .el-form-item {
                  .el-form-item__label {
                    width: 140px !important;
                  }
                }
              }
            }
          }
        }
      }

      .el-table__body-wrapper {
        overflow-x: hidden;
      }
    }

    &.night {
      color: $nightFontColor;
      background-color: $nightBgColor;

      > .background-color {
        background-color: $nightMainBgColor;
      }

      .invitation-promotion-main {
        .code-copy {
          color: #338ff5;
          background-color: #1a2233;
        }

        .content-input {
          border: 1px solid rgba(72, 87, 118, 1);
          border-radius: 3px 0 0 3px;
          color: #fff;
          background: rgba(26, 34, 51, 1);

          &:focus {
            border: 1px solid #338ff5;
          }
        }

        .text-info {
          color: #d45858;
        }

        .primary-button {
          color: #fff;
          background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
        }

        .send-code-btn {
          color: #fff;
          background-color: #338ff5;
        }

        > .extension-info {
          background-color: $nightMainBgColor;

          > .extension-info-header {
            border-bottom: 1px solid #39424d;

            > .header-color {
              color: #fff;
            }
          }

          > .extension-info-content {
            > .info-content {
              .api-input {
                border: 1px solid #485776;
                color: #fff;

                &:focus {
                  border: 1px solid #338ff5;
                }
              }

              .content-title {
                color: #338ff5;
              }

              .content-info {
                color: #9da5b3;
              }

              .api-button {
                color: #fff;
                background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
              }
            }
          }
        }

        > .extension-statistics {
          background-color: $nightMainBgColor;

          > .extension-statistics-header {
            border-bottom: 1px solid #39424d;

            > .header-color {
              color: #fff;
            }
          }

          .compile {
            color: #338ff5;
          }
        }
      }

      .api-management-header {
        .header-content {
          color: #338ff5;
        }
      }

      /deep/ {
        .el-form-item__label {
          color: #b8bdd0;
        }

        th,
        tr {
          background-color: #1c1f32;
        }

        thead {
          color: #617499;
        }

        td {
          background-color: #1c1f32;
        }

        tr:hover > td {
          background-color: #1c1f32;
        }

        .el-dialog {
          border-radius: 5px;
          background-color: #28334a;
        }

        .el-button {
          &:first-child {
            color: rgba(255, 255, 255, .7);
            background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
          }
        }

        .el-dialog__title {
          color: #fff;
        }

        .el-table__empty-block {
          background-color: #1c1f32;
        }

        .cell {
          color: #9da5b3;
        }

        .el-table td div {
          color: #9da5b3;
        }

        .el-dialog__header {
          background: rgba(32, 41, 60, 1);
        }

        th.is-leaf {
          border-top: 0;
        }
      }
    }

    &.day {
      color: $dayFontColor;
      background-color: $dayBgColor;

      > .background-color {
        border: 1px solid rgba(236, 241, 248, 1);
        background: rgba(255, 255, 255, 1);
      }

      .invitation-promotion-main {
        .code-copy {
          color: #338ff5;
          background-color: #fff;
        }

        .send-code-btn {
          color: #fff;
          background-color: #338ff5;
        }

        .primary-button {
          color: #fff;
          background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
        }

        .content-input {
          border: 1px solid rgba(236, 241, 248, 1);
          color: #333;

          &:focus {
            border: 1px solid #338ff5;
          }
        }

        > .extension-info {
          border: 1px solid rgba(246, 246, 246, 1);
          border-radius: 4px;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0 0 4px rgba(235, 240, 248, 1);

          > .extension-info-header {
            border-bottom: 1px solid rgba(57, 66, 77, .1);

            > .header-color {
              color: #333;
            }
          }

          > .extension-info-content {
            .api-input {
              border: 1px solid rgba(236, 241, 248, 1);
              color: #333;

              &:focus {
                border: 1px solid #338ff5;
              }
            }

            .content-title {
              color: #d45858;
            }

            .content-info {
              color: #7d90ac;
            }

            .api-button {
              color: #fff;
              background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
            }

            > .promotion-box {
              .promotion-info {
                .info-left-text {
                  color: #ccc;
                }
              }

              .info-left,
              .info-right {
                color: #ccc;
              }
            }
          }
        }

        > .extension-statistics {
          border: 1px solid rgba(246, 246, 246, 1);
          border-radius: 4px;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0 0 4px rgba(235, 240, 248, 1);

          > .extension-statistics-header {
            border-bottom: 1px solid rgba(57, 66, 77, .1);

            > .header-color {
              color: #333;
            }
          }
        }
      }

      .api-management-header {
        .header-content {
          color: #338ff5;
        }
      }

      /deep/ {
        .el-form-item__label {
          color: #7d90ac;
        }

        .el-dialog__header {
          color: #333;
          background: rgba(51, 143, 245, .1);
        }

        .el-dialog__title {
          color: #333;
        }

        .el-dialog {
          background-color: #fff;
        }

        .el-table__empty-block {
          background-color: #fff;
        }

        .cell {
          color: #333;
        }

        td {
          padding: 7px 0;
          border-bottom: 1px solid #fff;
          color: #7d90ac;
          background-color: #fff;
        }
      }
    }
  }
</style>
