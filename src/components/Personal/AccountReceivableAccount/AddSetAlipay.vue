<template>
  <div
    class="add-account personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-background="rgba(0, 0, 0, 0.6)"
    :style="{
      height: windowHeight+'px'
    }"
  >
    <div
      class="add-account-main margin25"
    >
      <header class="add-account-header personal-height60 line-height60 line-height70 margin25">
         <span
           v-if="paymentTerm.isAlipayBind"
           class="header-content-left header-content font-size16 font-weight600"
         >
          <!--设置支付宝账号-->
           {{ $t('M.comm_set') }}{{ $t('M.user_account_number') }}
        </span>
        <span
          v-else
          class="header-content-left header-content font-size16 font-weight600"
        >
          <!--修改支付宝账号-->
          {{ $t('M.comm_modification') }}{{ $t('M.user_account_number') }}
        </span>
        <span
          class="header-content-right font-size12 cursor-pointer"
          @click.prevent="returnSuperior"
        >
          <IconFontCommon
            class="font-size22"
            iconName="icon-fanhui2"
          />
          <!--返回我的账户-->
          {{ $t('M.user_account_return') }}
        </span>
      </header>
      <div class="add-account-content">
        <header class="account-content-title">
          <!--*支付宝上传二维码方法：打开支付宝首页>收钱>保存图片，将存在手机相册的收款码上传即可。-->
          {{ $t('M.user_account_text2') }}
        </header>
        <div class="account-content-from">
          <el-form
            :label-position="labelPosition"
            label-width="120px"
          >
            <!--名 称-->
            <el-form-item
              :label="$t('M.user_account_name')"
            >
              <span class="account-content-type">
                {{ innerUserInfo.realname }}
              </span>
            </el-form-item>
            <!--收  款  类  型-->
            <el-form-item
              :label="$t('M.user_account_gathering') + $t('M.comm_type')"
            >
              <span class="account-content-type">支付宝</span>
            </el-form-item>
            <!--支付宝账号-->
            <el-form-item
              :label="$t('M.user_account_alipay') + $t('M.user_account_number')"
            >
              <input
                class="account-input border-radius2"
                v-model="alipayAccount"
                @keydown="setErrorMsg(0, '')"
                @blur="checkoutInputFormat(0, alipayAccount)"
              />
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[0]"
                :isShow="!!errorShowStatusList[0]"
              />
            </el-form-item>
            <!--上传收款码-->
            <el-form-item
              :label="$t('M.user_account_upload_collection')"
            >
              <div class="account-upload border-radius4">
                <el-upload
                  :action="apiCommonUrl+'uploadfile'"
                  :headers="tokenObj"
                  list-type="picture-card"
                  :on-success="handleSuccessHand"
                  :on-remove="handleRemove"
                  >
                  <img
                    v-show="dialogImageHandUrl1"
                    width="118"
                    height="118"
                    :src="dialogImageHandUrl1"
                  >
                  <IconFontCommon
                    v-show="!dialogImageHandUrl1"
                    class="font-size40 icon-plus"
                    iconName="icon-iconjia"
                  />
                </el-upload>
              </div>
            </el-form-item>
            <!--交易密码-->
            <el-form-item
              :label="$t('M.comm_password')"
            >
              <input
                type="password"
                class="account-input border-radius2"
                v-model="password"
                @keydown="setErrorMsg(1, '')"
                @blur="checkoutInputFormat(1, password)"
              />
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[1]"
                :isShow="!!errorShowStatusList[1]"
              />
            </el-form-item>
            <button
              v-if="paymentTerm.isAlipayBind"
              class="account-button border-radius4"
              @click.prevent="stateSubmitWeChat"
            >
              <!--确认设置-->
              {{ $t('M.comm_affirm') }}{{ $t('M.comm_set') }}
            </button>
            <button
              v-else
              class="account-button border-radius4"
              @click.prevent="stateSubmitWeChat"
            >
              <!--确认修改-->
              {{ $t('M.comm_affirm') }}{{ $t('M.comm_modification') }}
            </button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import IconFontCommon from '../../Common/IconFontCommon'
import ErrorBox from '../../User/ErrorBox'
import {
  returnAjaxMsg,
  getAccountPaymentTerm
} from '../../../utils/commonFunc'
import {
  statusCardSettings,
  modificationAccountPaymentTerm
} from '../../../utils/api/personal'
import {apiCommonUrl} from '../../../utils/env'
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations } = createNamespacedHelpers('personal')
export default {
  components: {
    ErrorBox, // 错误提示接口
    IconFontCommon // 字体图标
  },
  data () {
    return {
      tokenObj: {
        'token': '',
        'x-domain': ''
      },
      alipayAccount: '', // 支付宝账号
      password: '', // 交易密码
      dialogImageHandUrl: '', // 图片url
      dialogImageHandUrl1: '', // 图片url
      id: '', // ID
      paymentTerm: {},
      successCountDown: 1, // 成功倒计时
      paymentMethodList: {},
      errorShowStatusList: [
        '', // 支付宝账号
        '' // 交易密码
      ],
      // loadingCircle: {} // 整页loading
      fullscreenLoading: false // 整页loading
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/AccountReceivableAccount/AddSetAlipay.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/AccountReceivableAccount/AddSetAlipayDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/AccountReceivableAccount/AddSetAlipayNight.css')
    this.tokenObj.token = this.userInfo.token
    let xDomain = window.location.host.split(':')[0]
    xDomain = xDomain.startsWith('www') ? xDomain.slice(4) : xDomain
    this.tokenObj['x-domain'] = xDomain
    console.log(xDomain)
    this.getAccountPaymentTerm()
    this.paymentMethodInformation()
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_USER_CENTER_ACTIVE_NAME',
      'CHANGE_REF_ACCOUNT_CREDITED_STATE'
    ]),
    // 点击返回上个页面
    returnSuperior () {
      this.CHANGE_REF_ACCOUNT_CREDITED_STATE(true)
      this.CHANGE_USER_CENTER_ACTIVE_NAME('account-credited')
      this.$router.push({path: '/PersonalCenter'})
    },
    handleSuccessHand (response, file, fileList) {
      this.dialogImageHandUrl1 = response.data.fileUrl
      console.log(response, file, fileList)
    },
    // 检测输入格式
    checkoutInputFormat (type, targetNum) {
      console.log(type)
      switch (type) {
        // 请输入支付宝张号
        case 0:
          console.log(type)
          if (!targetNum) {
            this.setErrorMsg(0, this.$t('M.comm_please_enter') + this.$t('M.user_account_alipay') + this.$t('M.user_account_number'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(0, '')
            this.$forceUpdate()
            return 1
          }
        // 请输入交易密码
        case 1:
          console.log(type)
          if (!targetNum) {
            this.setErrorMsg(1, this.$t('M.comm_please_enter') + this.$t('M.comm_password'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(1, '')
            this.$forceUpdate()
            return 1
          }
      }
    },
    // 设置错误信息
    setErrorMsg (index, msg) {
      this.errorShowStatusList[index] = msg
    },
    // 确认设置支付宝账号
    stateSubmitWeChat () {
      this.stateSeniorCertification()
    },
    async stateSeniorCertification () {
      let goOnStatus = 0
      if (
        this.checkoutInputFormat(0, this.alipayAccount) &&
        this.checkoutInputFormat(1, this.password)
      ) {
        goOnStatus = 1
      } else {
        goOnStatus = 0
      }
      console.log(this.dialogImageHandUrl1)
      if (this.dialogImageHandUrl1 == '') {
        // 请上传微信收款码
        this.$message({
          message: this.$t('M.user_account_weChat_pla'),
          type: 'error'
        })
        return false
      }
      if (goOnStatus) {
        let data
        let param = {
          token: this.userInfo.token,
          cardNo: this.alipayAccount, // 支付宝账号
          qrcode: this.dialogImageHandUrl1, // 二维码
          payPassword: this.password, // 交易密码
          bankType: 'Alipay', // type
          id: this.id
        }
        // 整页loading
        this.fullscreenLoading = true
        console.log(this.dialogImageHandUrl1)
        data = await statusCardSettings(param)
        console.log(data)
        if (!(returnAjaxMsg(data, this, 1))) {
          // 接口失败清除loading
          this.fullscreenLoading = false
          return false
        } else {
          // 接口成功清除loading
          this.fullscreenLoading = false
          this.successJump()
          this.stateEmptyData()
        }
      }
    },
    // 接口请求完成之后清空数据
    stateEmptyData () {
      this.alipayAccount = ''
      this.password = ''
    },
    // 获取支付方式信息
    async paymentMethodInformation () {
      let data
      let params = {
        userId: this.userInfo.userId,
        type: 'Alipay'
      }
      // 整页loading
      this.fullscreenLoading = true
      data = await modificationAccountPaymentTerm(params)
      if (!(returnAjaxMsg(data, this, 0))) {
        // 接口失败清除loading
        this.fullscreenLoading = false
        return false
      } else {
        // 接口成功清除loading
        this.fullscreenLoading = false
        let detailData = data.data.data
        // 返回状态展示
        if (detailData) {
          this.paymentMethodList = detailData
        }
        if (detailData.cardNo) {
          // 修改时带回支付宝号
          this.alipayAccount = detailData.cardNo
        }
        if (detailData.qrcode) {
          // 修改时带回支付宝收款码
          this.dialogImageHandUrl1 = detailData.qrcode
        }
        if (detailData.id) {
          // 修改时带回类id
          this.id = detailData.id
        }
        console.log(this.dialogImageHandUrl1)
      }
    },
    /**
     * 收款方式
     */
    getAccountPaymentTerm () {
      getAccountPaymentTerm(this, (data) => {
        if (data) {
          // 返回状态展示
          this.paymentTerm = data.data.data
        }
      })
    },
    // 成功自动跳转
    successJump () {
      setInterval(() => {
        if (this.successCountDown === 0) {
          this.CHANGE_REF_ACCOUNT_CREDITED_STATE(true)
          this.CHANGE_USER_CENTER_ACTIVE_NAME('account-credited')
          this.$router.push({path: '/PersonalCenter'})
        }
        this.successCountDown--
      }, 1000)
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      innerUserInfo: state => state.user.loginStep1Info.userInfo, // 内层用户详细信息
      refAccountCenterStatus: state => state.personal.refAccountCenterStatus
    }),
    windowHeight () {
      return window.innerHeight
    },
    apiCommonUrl () {
      return apiCommonUrl
    }
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal.scss";
  .add-account {
    margin-top:66px;
    overflow: hidden;
    >.add-account-main {
      width: 1100px;
      height: 700px;
      margin: 60px auto 100px;
      >.add-account-header {
        display: flex;
        >.header-content-right,
        .header-content-left {
          flex: 1;
        }
        >.header-content-right {
          text-align: right;
        }
        >.header-content-left {
          text-align: left;
        }
      }
      >.add-account-content {
        min-height: 300px;
        margin: 16px 25px;
        >.account-content-title {
          height: 32px;
          line-height: 32px;
          margin-bottom: 30px;
        }
        >.account-content-from {
          width: 500px;
          margin-left: 55px;
          .account-input {
            width: 220px;
            height: 34px;
            padding-left: 15px;
          }
          .account-upload {
            width: 118px;
            height: 118px;
            /*text-align: center;*/
            line-height: 100px;
            overflow: hidden;
          }
          .account-button {
            // padding: 10px 93px;
            // margin: 30px 0 50px 120px;
            padding: 10px 0;
            margin: 30px 0 50px 140px;
            width: 237px;
          }
        }
      }
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      .add-account-main {
        background-color: $nightMainBgColor;
        >.add-account-header {
          border-bottom: 1px solid #39424D;
          >.header-content-left {
            color: #fff;
          }
          >.header-content-right {
            color: #A9BED4;
          }
        }
        >.add-account-content {
          >.account-content-title {
            background:rgba(62,121,214,0.08);
            color: #3E79D6;
          }
          >.account-content-from {
            .account-content-type {
              color: #fff;
            }
            .account-input {
              border: 1px solid #485776;
              color: rgba(255,255,255,0.7);
              &:focus {
                border: 1px solid #338FF5;
              }
            }
            .account-upload {
              /*background-color: #323E48;*/
              .icon-plus {
                color: #828EA6;
                position: absolute;
                top: 35px;
                right: 35px;
              }
            }
            .account-button {
              background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
              color: rgba(255,255,255,0.7);
            }
          }
        }
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      .add-account-main {
        background:rgba(255,255,255,1);
        border:1px solid rgba(246,246,246,1);
        border-radius:4px;
        box-shadow:0px 0px 4px rgba(235,240,248,1);
        > .add-account-header {
          border-bottom: 1px solid rgba(57,66,77,0.1);
          .header-content-right {
            color: #7D90AC;
          }
        }
        >.add-account-content {
          >.account-content-title {
            background:rgba(62,121,214,0.1);
            color: #3E79D6;
          }
          >.account-content-from {
            .account-content-type {
              color: #333;
            }
            .account-input {
              color: #333;
              background:rgba(255,255,255,1);
              border:1px solid rgba(236,241,248,1);
              &:focus {
                border: 1px solid #338FF5;
              }
            }
            .account-upload {
              background-color: #fff;
              .icon-plus {
                color: #555;
                position: absolute;
                top: 35px;
                right: 35px;
              }
            }
            .account-button {
              background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
              color: #ccc;
            }
          }
        }
      }
    }
  }
</style>
