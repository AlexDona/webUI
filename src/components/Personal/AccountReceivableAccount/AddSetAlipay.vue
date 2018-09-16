<template>
  <div
    class="add-account personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <HeaderCommon />
    <div class="add-account-main margin25">
      <header class="add-account-header personal-height60 line-height60 line-height70 margin25">
         <span
           v-if="paymentTerm.isAlipayBind"
           class="header-content-left header-content font-size16 font-weight600"
         >
          设置支付宝账号
        </span>
        <span
          v-else
          class="header-content-left header-content font-size16 font-weight600"
        >
          修改支付宝账号
        </span>
        <span
          class="header-content-right font-size12 cursor-pointer"
          @click="returnSuperior"
        >
          <IconFontCommon
            class="font-size22"
            iconName="icon-fanhui2"
          />
          返回我的账户
        </span>
      </header>
      <div class="add-account-content">
        <header class="account-content-title">
          *支付宝上传二维码方法：打开支付宝首页>收钱>保存图片，将存在手机相册的收款码上传即可。
        </header>
        <div class="account-content-from">
          <el-form
            :label-position="labelPosition"
            label-width="120px"
          >
            <el-form-item label="名 称：">
              <span class="account-content-type">
                {{ userInfo.userInfo.realname }}
              </span>
            </el-form-item>
            <el-form-item label="收  款  类  型：">
              <span class="account-content-type">支付宝</span>
            </el-form-item>
            <el-form-item label="支付宝账号：">
              <input
                class="account-input border-radius2"
                v-model="alipayAccount"
              />
            </el-form-item>
            <el-form-item label="上传收款码：">
              <div class="account-upload border-radius4">
                <el-upload
                  action="http://192.168.1.200:8888/uploadfile"
                  :headers="tokenObj"
                  list-type="picture-card"
                  :on-success="handleSuccessHand"
                  :on-remove="handleRemove"
                >
                  <IconFontCommon
                    class="font-size40 icon-plus"
                    iconName="icon-iconjia"
                  />
                </el-upload>
              </div>
            </el-form-item>
            <el-form-item label="交易密码：">
              <input
                type="password"
                class="account-input border-radius2"
                v-model="password"
              />
            </el-form-item>
            <button
              class="account-button border-radius4"
              @click="stateSubmitWeChat"
            >
              确认
            </button>
          </el-form>
        </div>
      </div>
    </div>
    <FooterCommon />
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
// 头部
import HeaderCommon from '../../Common/HeaderCommon'
import IconFontCommon from '../../Common/IconFontCommon'
import {returnAjaxMessage} from '../../../utils/commonFunc'
import {
  statusCardSettings,
  modificationAccountPaymentTerm,
  accountPaymentTerm
} from '../../../utils/api/personal'
// 底部
import FooterCommon from '../../Common/FooterCommon'
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations } = createNamespacedHelpers('personal')
export default {
  components: {
    HeaderCommon, // 头部
    IconFontCommon, // 字体图标
    FooterCommon // 底部
  },
  data () {
    return {
      tokenObj: {
        'token': ''
      },
      alipayAccount: '', // 支付宝账号
      password: '', // 交易密码
      dialogImageHandUrl: '', // 图片url
      id: '', // ID
      paymentTerm: {},
      successCountDown: 1, // 成功倒计时
      paymentMethodList: {}
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
    console.log(this.userInfo)
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
      this.dialogImageHandUrl = response.data.fileUrl
      console.log(response, file, fileList)
    },
    // 确认设置支付宝账号
    stateSubmitWeChat () {
      this.stateSeniorCertification()
    },
    async stateSeniorCertification () {
      let data
      let param = {
        token: this.userInfo.token,
        cardNo: this.alipayAccount, // 微信账号
        qrcode: this.dialogImageHandUrl, // 二维码
        payPassword: this.password, // 交易密码
        bankType: 'alipay', // type
        id: this.id
      }
      data = await statusCardSettings(param)
      console.log(data)
      if (!(returnAjaxMessage(data, this, 1))) {
        return false
      } else {
        this.successJump()
      }
    },
    // 获取支付方式信息
    async paymentMethodInformation () {
      let data
      let params = {
        userId: this.userInfo.userId,
        type: 'alipay'
      }
      data = await modificationAccountPaymentTerm(params)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回状态展示
        this.paymentMethodList = data.data.data
        this.alipayAccount = data.data.data.cardNo
        this.dialogImageHandUrl = data.data.data.qrcode
        this.id = data.data.data.id
        console.log(this.paymentMethodList)
      }
    },
    // 收款方式
    async getAccountPaymentTerm () {
      let data = await accountPaymentTerm()
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回状态展示
        this.paymentTerm = data.data.data
        console.log(this.paymentTerm)
      }
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
      refAccountCenterStatus: state => state.personal.refAccountCenterStatus
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/AccountReceivableAccount/AddSetAlipay.scss";
  .add-account {
    >.add-account-main {
      width: 1100px;
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
            height: 106px;
            text-align: center;
            line-height: 100px;
          }
          .account-button {
            padding: 9px 33px;
            margin: 30px 0 50px 25px;
          }
        }
      }
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      .add-account-main {
        background-color: #1E2636;
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
            }
            .account-upload {
              background-color: #323E48;
              .icon-plus {
                color: #828EA6;
              }
            }
            .account-button {
              padding: 10px 33px;
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
        background-color: #ccc;
        > .add-account-header {
          border-bottom: 1px solid #ccc;
        }
        >.add-account-content {
          >.account-content-title {
            background:rgba(62,121,214,1);
            color: #ccc;
          }
          >.account-content-from {
            .account-input {
              border: 1px solid #000;
              color: #000;
            }
            .account-upload {
              background-color: #fff;
              .icon-plus {
                color: #555;
              }
            }
            .account-button {
              padding: 10px 33px;
              background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
              color: #ccc;
            }
          }
        }
      }
    }
  }
</style>
