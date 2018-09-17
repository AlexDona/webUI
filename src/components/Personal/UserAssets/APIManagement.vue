<template>
  <div
    class="api-management personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="api-management-header personal-height40 line-height40 padding-left20 font-size16 background-color">
      <span class="padding-left23 header-content font-weight600">API管理</span>
    </header>
    <div class="invitation-promotion-main min-height500 margin-top9">
      <!--创建API KEY-->
      <div class="extension-info padding-top0">
        <header class="extension-info-header line-height56">
          <span class="font-size16 header-color">创建API KEY</span>
        </header>
        <div class="extension-info-content display-flex">
          <div class="info-content info-content-left flex1">
            <el-form
              label-width="120px"
            >
              <el-form-item label="备注：">
                <input
                  type="text"
                  class="api-input border-radius2 padding-l15 box-sizing"
                  v-model="remark"
                >
              </el-form-item>
              <el-form-item label="绑定IP地址：">
                <input
                  type="text"
                  class="api-input border-radius2 padding-l15 box-sizing"
                  v-model="ipSite"
                >
              </el-form-item>
              <button
                class="api-button border-radius4 cursor-pointer font-size14"
                @click="stateEstablishApiButton"
              >
                创建
              </button>
            </el-form>
          </div>
          <div class="info-content info-content-right flex1 font-size12">
            <p class="font-size14 content-title">提示</p>
            <div class="content-info">
              <span class="style">● </span>
              <p class="content-text">
                FUBT 为您提供了强大的API，您可以通过 API 使用行情查询、自动
                交易等服务。通过 API 文档 查看如何使用;
              </p>
            </div>
            <div class="content-info">
              <span class="style">● </span>
              <p class="content-text">
                每个用户最多创建5组API Key;
              </p>
            </div>
            <div class="content-info">
              <span class="style">● </span>
              <p class="content-text">
                请不要泄露您的API Key，以免造成资产损失。出于安全考虑，建议为
                API Key绑定IP，每个API Key最多绑定4个IP。 单个地址直接填写，多
                个IP地址用半角逗号分隔，如：192.168.1.1,192.168.1.2,192.168.1.3。
              </p>
            </div>
          </div>
        </div>
      </div>
      <!--我的 API KEY-->
      <div class="extension-statistics margin-top9 padding-top0">
        <header class="extension-statistics-header line-height56">
          <span class="font-size16 header-color header-right">我的 API KEY</span>
        </header>
        <div class="extension-statistics-content">
          <el-table
            :data="extensionList"
            style="width: 100%"
            empty-text="暂无数据"
          >
            <el-table-column
              label="创建时间"
              width="150"
            >
              <template slot-scope = "s">
                <div>{{timeFormatting(s.row.createTime) }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="备注"
              width="80"
            >
              <template slot-scope = "s">
                <div>{{ s.row.remark }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="API访问秘钥"
              width="370"
            >
              <template slot-scope = "s">
                <div>{{ s.row.accessKey }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="IP地址"
              width="130"
            >
              <template slot-scope = "s">
                <div>{{ s.row.ip }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="状态"
              width="50"
            >
              <template slot-scope = "s">
                <div v-if="s.row.status == 'enable'">{{ enable }}</div>
                <div v-if="s.row.status == 'disable'">{{ disable }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="100"
            >
              <template slot-scope = "s">
                <div
                  class="compile float-left cursor-pointer"
                  @click="compileApi(s.row.id)"
                  :id="s.row.id"
                >
                  编辑
                </div>
                <div
                  class="compile float-left cursor-pointer"
                  @click="deleteUser(s.row.id)"
                  :id="s.row.id"
                >
                  删除
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--验证方式验证-->
      <el-dialog
        title="安全验证"
        :visible.sync="APIMoneyConfirm"
      >
        <el-form
          :label-position="labelPosition"
        >
          <!--手机已认证-->
          <el-form-item
            v-if="securityCenter.isPhoneEnable"
            label="手机验证"
          >
            <input
              class="content-input padding-l15 box-sizing"
              v-model="phoneCode"
            >
            <CountDownButton
              class="send-code-btn cursor-pointer"
              :status="disabledOfPhoneBtn"
              @run="sendPhoneOrEmailCode(0)"
            />
          </el-form-item>
          <!--手机未认证-->
          <span v-else></span>
          <!--邮箱已认证-->
          <el-form-item
            v-if="securityCenter.isMailEnable"
            label="邮箱验证"
          >
            <input
              class="content-input padding-l15 box-sizing"
              v-model="emailCode"
            >
            <CountDownButton
              class="send-code-btn cursor-pointer"
              :status="disabledOfEmailBtn"
              @run="sendPhoneOrEmailCode(1)"
            />
          </el-form-item>
          <!--邮箱未认证-->
          <span v-elsee></span>
          <!--谷歌已认证-->
          <el-form-item
            v-if="securityCenter.isGoogleEnable"
            label="谷歌验证"
          >
            <input
              class="content-input input-google padding-l15 box-sizing"
              v-model="googleCode"
            >
          </el-form-item>
          <!--谷歌未认证-->
          <span v-else></span>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <button
            type="primary"
            class="primary-button"
            @click="stateSubmitDetermineValidation"
          >
            确 定
          </button>
        </div>
      </el-dialog>
      <!--二次信息确认弹框-->
      <el-dialog
        title="创建成功"
        :visible.sync="apiSecondaryConfirmation"
      >
        <el-form
          :label-position="labelPosition"
        >
          <el-form-item
            style="margin-bottom: 0"
            label="API访问秘钥 （Access Key）"
          >
            <input
              class="content-input input-google padding-l15 box-sizing"
              v-model="accessKey"
              disabled
            >
          </el-form-item>
          <el-form-item
            style="margin-bottom: 0"
            label="API访问秘钥 （Access Key）"
          >
            <input
              class="content-input input-google padding-l15 box-sizing"
              v-model="secretKey"
              disabled
            >
            <p class="font-size12 text-info text-margin ">（仅显示1次，遗失后不可找回，请务必妥善保存）</p>
          </el-form-item>
          <el-form-item
            label="绑定IP地址"
          >
            <input
              class="content-input input-google padding-l15 box-sizing"
              v-model="ip"
              disabled
            >
            <p class="font-size12 text-info text-margin">提示</p>
            <p class="font-size12 text-info">• 请不要泄露您的Secret Key，避免造成资产损失。</p>
            <p class="font-size12 text-info text-bottom">• 如您忘记了Secret Key，请删除该密钥对并申请新的密钥对。</p>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <button
            type="primary"
            class="primary-button"
            @click="stateSubmitAffirm"
          >
            确 定
          </button>
        </div>
      </el-dialog>
      <!--编辑api-->
      <!--二次信息确认弹框-->
      <el-dialog
        title="编辑api"
        :visible.sync="compileUserApi"
      >
        <el-form
          :label-position="labelPosition"
        >
          <el-form-item
            style="margin-bottom: 0"
            label="备注"
          >
            <input
              class="content-input input-google padding-l15 box-sizing"
              v-model="apiRemark"
            >
          </el-form-item>
          <el-form-item
            label="绑定IP地址"
          >
            <input
              class="content-input input-google padding-l15 box-sizing"
              v-model="ipAddress"
            >
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <button
            type="primary"
            class="primary-button"
            @click="stateCompileUserApi"
          >
            确 定
          </button>
        </div>
      </el-dialog>
      <!-- 删除api-->
      <el-dialog
        :title="删除api地址"
        :visible.sync="dialogVisible"
        center
      >
        <span class="info">确定删除api地址吗？</span>
        <span slot="footer" class="dialog-footer">
         <!--确 定 取 消-->
          <el-button
            type="primary"
            @click="deleteUserConfirm"
            :disabled="statel"
          >
            确 定
          </el-button>
          <el-button
            class="btn"
            @click="dialogVisible = false"
          >
            取 消
          </el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import CountDownButton from '../../Common/CountDownCommon'// 字体图标
import IconFontCommon from '../../Common/IconFontCommon'
import { createNamespacedHelpers, mapState } from 'vuex'
import {
  statusSecurityCenter,
  multipleUserAPIInfo,
  stateCreationApi,
  securityVerificationOnOff,
  accessAecretKeyInfo,
  modifyUserInformation,
  deleteUserInformation
} from '../../../utils/api/personal'
import {
  returnAjaxMessage,
  sendPhoneOrEmailCodeAjax
} from '../../../utils/commonFunc'
import {timeFilter} from '../../../utils/index'
const { mapMutations } = createNamespacedHelpers('personal')
export default {
  components: {
    IconFontCommon, // 字体图标
    CountDownButton // 短信倒计时
  },
  data () {
    return {
      labelPosition: 'top',
      // creationTime 创建时间
      // remark: '备注',
      // secretKey API访问秘钥
      // 'IpSite' IP地址
      securityCenter: {},
      enable: '启用',
      disable: '禁用',
      APIMoneyConfirm: false, // 默认API确认弹窗
      phoneCode: '', // 邮箱验证
      emailCode: '', // 手机验证
      googleCode: '', // 谷歌验证
      // 默认创建之后弹出二次挨批创建信息框
      apiSecondaryConfirmation: false,
      accessKey: '', // API访问秘钥 （Access Key）
      secretKey: '', // API访问秘钥 （Access Key）
      ipSite: '', // 绑定IP地址
      ip: '', // 绑定IP地址
      extensionList: [],
      compileUserApi: false, // 编辑用户api
      userId: '', // 编辑用户api
      apiRemark: '', // 编辑用户备注
      ipAddress: '', // 编辑用户ip
      dialogVisible: false
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/UserAssets/APIManagement.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/UserAssets/APIManagementDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/UserAssets/APIManagementNight.css')
    // this.stateCompileApi()
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([]),
    // 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
    },
    // 发送验证码
    sendPhoneOrEmailCode (loginType) {
      if (this.disabledOfPhoneBtn || this.disabledOfEmailBtn) {
        return false
      }
      let params = {}
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
    // 点击创建
    stateEstablishApiButton () {
      this.APIMoneyConfirm = true
      this.getSecurityCenter()
      this.ip = this.ipSite
    },
    // 创建之后弹出二次挨批创建信息框
    stateSubmitDetermineValidation () {
      // 返回展示
      this.apiSecondaryConfirmation = true
      this.APIMoneyConfirm = false
      //  获取秘钥
      this.getAccessAecretKey()
      // 手机谷歌邮箱方式验证
      // this.multipleValidationMethods()
    },
    // 二次确认框创建挨批完成
    stateSubmitAffirm () {
      // 创建api
      this.statusCreationApi()
    },
    // 创建api
    async statusCreationApi () {
      let data = await stateCreationApi({
        remark: this.remark, // 备注
        ip: this.ip, // ip地址
        accessKey: this.accessKey, // token
        secretKey: this.secretKey // sk私钥
      })
      console.log(data)
      if (!(returnAjaxMessage(data, this, 1))) {
        return false
      } else {
        // 返回展示
        console.log(data)
        this.apiSecondaryConfirmation = false
        this.getMultipleUserAPIInfo()
      }
    },
    // 编辑用户api
    compileApi (id) {
      this.compileUserApi = true
      this.userId = id
      // this.extensionList.forEach((item, index) => {
      //   if (item.id == id) {
      //   }
      // })
    },
    // 编辑确认
    stateCompileUserApi () {
      this.stateCompileApi()
    },
    //  编辑用户api接口
    async stateCompileApi () {
      let data = await modifyUserInformation({
        id: this.userId,
        remark: this.apiRemark, // 编辑用户备注
        ip: this.ipAddress // 编辑用户ip
      })
      console.log(data)
      if (!(returnAjaxMessage(data, this, 1))) {
        return false
      } else {
        // 返回展示
        this.getMultipleUserAPIInfo()
        this.compileUserApi = false
      }
    },
    // 删除
    deleteUser (id) {
      this.dialogVisible = true
      this.userId = id
    },
    deleteUserConfirm () {
      this.deleteUserApi()
    },
    //  获取秘钥
    async deleteUserApi () {
      let data = await deleteUserInformation({
        id: this.userId
      })
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回展示
        this.getMultipleUserAPIInfo()
        this.dialogVisible = false
      }
    },
    // 邮箱、短信、谷歌验证码验证
    async multipleValidationMethods () {
      let data = await securityVerificationOnOff({
        email: this.userInfo.userInfo.email, // 邮箱
        phone: this.userInfo.userInfo.phone, // 手机
        emailCode: this.emailCode, // 邮箱验证
        phoneCode: this.phoneCode, // 手机验证
        googleCode: this.googleCode // 谷歌验证
      })
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // // 返回展示
        // this.apiSecondaryConfirmation = true
        // this.APIMoneyConfirm = false
        // //  获取秘钥
        // this.getAccessAecretKey()
        // this.extensionList = data.data.data
        // console.log(this.extensionList)
      }
    },
    // 获取多个用户api信息
    async getMultipleUserAPIInfo () {
      let data = await multipleUserAPIInfo({
        // token: this.userInfo.token // token
      })
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回展示
        this.extensionList = data.data.data
        console.log(this.extensionList)
      }
    },
    //  获取秘钥
    async getAccessAecretKey () {
      let data = await accessAecretKeyInfo({})
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回展示
        this.accessKey = data.data.data.accessKey
        this.secretKey = data.data.data.secretKey
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
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      disabledOfPhoneBtn: state => state.user.disabledOfPhoneBtn,
      disabledOfEmailBtn: state => state.user.disabledOfEmailBtn
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/UserAssets/APIManagement";
  .api-management{
    >.invitation-promotion-main{
      .content-input {
        width: 200px;
        height: 35px;
      }
      .text-margin {
        margin-top: 10px;
      }
      .input-google {
        width: 300px;
      }
      .text-bottom {
        margin-bottom: 10px;
      }
      .text-info {
        height: 20px;
        line-height: 20px;
      }
      .primary-button {
        width: 300px;
        height: 35px;
        border-radius:4px;
      }
      .send-code-btn {
        width: 100px;
        height: 35px;
        margin-left: -4px;
        padding: 0;
      }
      >.extension-info{
        min-height: 350px;
        >.extension-info-header {
          height: 56px;
        }
        >.extension-info-content {
          >.info-content {
            height: 250px;
            padding-top: 40px;
            .api-input {
              width: 220px;
              height: 34px;
            }
            .content-title {
              margin-bottom: 10px;
              padding-left: 12px;
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
              }
            }
            .api-button {
              padding: 10px 96px;
              margin: 30px 0 0 120px;
            }
            .prompt-message {
              height: 20px;
              padding-left: 35px;
            }
          }
        }
      }
      >.extension-statistics{
        min-height: 200px;
        >.extension-statistics-header{
          height: 56px;
        }
        >.extension-statistics-content{
          min-height: 130px;
          .compile{
            width: 40px;
          }
        }
      }
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      >.background-color {
        background-color: #1E2636;
      }
      .invitation-promotion-main{
        .content-input {
          border: 1px solid #485776;
          color: #fff;
          &:focus {
            border: 1px solid #338FF5;
          }
        }
        .text-info {
          color: #D45858;
        }
        .primary-button {
          background: linear-gradient(81deg,rgba(43,57,110,1) 0%,rgba(42,80,130,1) 100%);
          color: #fff;
        }
        .send-code-btn {
          background-color: #338FF5;
          color: #fff;
        }
        >.extension-info{
          background-color: #1E2636;
          >.extension-info-header{
            border-bottom: 1px solid #39424D;
            >.header-color {
              color: #fff;
            }
          }
          >.extension-info-content{
            >.info-content {
              .api-input {
                border: 1px solid #485776;
                color: #fff;
                &:focus {
                  border: 1px solid #338FF5;
                }
              }
              .content-title {
                color: #338FF5;
              }
              .content-info {
                color: #9DA5B3;
              }
              .api-button {
                background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
                color: #fff;
              }
            }
          }
        }
        >.extension-statistics {
          background-color: #1E2636;
          >.extension-statistics-header {
            border-bottom: 1px solid #39424D;
            >.header-color {
              color: #fff;
            }
          }
          .compile {
            color: #338FF5;
          }
        }
      }
      .api-management-header {
        .header-content {
          color: #338FF5;
        }
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      >.background-color {
        background:rgba(255,255,255,1);
        border:1px solid rgba(236,241,248,1);
      }
      .invitation-promotion-main {
        .primary-button {
          background: linear-gradient(81deg,rgba(43,57,110,1) 0%,rgba(42,80,130,1) 100%);
          color: #fff;
        }
        .content-input {
          border:1px solid rgba(236,241,248,1);
          color: #333;
          &:focus {
            border: 1px solid #338FF5;
          }
        }
        >.extension-info{
          background:rgba(255,255,255,1);
          border:1px solid rgba(246,246,246,1);
          border-radius:4px;
          box-shadow:0px 0px 4px rgba(235,240,248,1);
          >.extension-info-header{
            border-bottom: 1px solid rgba(57,66,77,0.1);
            >.header-color {
              color: #333;
            }
          }
          >.extension-info-content{
            .send-code-btn {
              background-color: #338FF5;
              color: #fff;
            }
            .api-input {
              border:1px solid rgba(236,241,248,1);
              color: #333;
              &:focus {
                border: 1px solid #338FF5;
              }
            }
            .content-title {
              color: #D45858;
            }
            .content-info {
              color: #7D90AC;
            }
            .api-button {
              background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
              color: #fff;
            }
            >.promotion-box {
              .promotion-info {
                .info-left-text {
                  color: #ccc;
                }
              }
              .info-left,
              info-right {
                color: #ccc;
              }
            }
          }
        }
        >.extension-statistics {
          background:rgba(255,255,255,1);
          border:1px solid rgba(246,246,246,1);
          border-radius:4px;
          box-shadow:0px 0px 4px rgba(235,240,248,1);
          >.extension-statistics-header {
            border-bottom: 1px solid rgba(57,66,77,0.1);
            >.header-color {
              color: #333;
            }
          }
        }
      }
      .api-management-header {
        .header-content {
          color: #338FF5;
        }
      }
    }
  }
</style>
