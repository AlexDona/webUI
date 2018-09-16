<template>
  <div
    class="add-western personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <HeaderCommon />
    <div class="add-western-main margin25">
      <header class="add-western-header personal-height60 line-height60 line-height70 margin25">
        <span
          v-if="paymentTerm.isXilianBind"
          class="header-content-left header-content font-size16 font-weight600"
        >
          设置西联汇款
        </span>
        <span
          v-else
          class="header-content-left header-content font-size16 font-weight600"
        >
          修改西联汇款
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
      <div class="add-western-content">
        <!--<header class="western-content-title">-->
          <!--*西联汇款l上传二维码方法：打开西联汇款首页>收钱>保存图片，将存在手机相册的收款码上传即可。-->
        <!--</header>-->
        <div class="western-content-from">
          <el-form
            :label-position="labelPosition"
            label-width="120px"
          >
            <el-form-item label="名 称：">
              <span class="western-content-name">杨</span>
            </el-form-item>
            <el-form-item label="电汇地址：">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 2}"
                placeholder="请输入内容"
                v-model="telegraphicTransferAddress"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="交易密码：">
              <input
                type="password"
                class="western-input border-radius2"
                v-model="transactionPassword"
              />
            </el-form-item>
            <button
              v-if="paymentTerm.isXilianBind"
              class="western-button border-radius4"
              @click="stateSubmitWesternUnion"
            >
              确认设置
            </button>
            <button
              v-else
              class="western-button border-radius4"
              @click="stateSubmitWesternUnion"
            >
              确认修改
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
      telegraphicTransferAddress: '', // 电汇地址
      transactionPassword: '', // 交易密码
      bankType: 'xilian', // type类型
      id: '', // ID
      paymentTerm: {},
      successCountDown: 1, // 成功倒计时
      paymentMethodList: {}
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/AccountReceivableAccount/AddWesternUnion.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/AccountReceivableAccount/AddWesternUnionDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/AccountReceivableAccount/AddWesternUnionNight.css')
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
    // 确认设置西联汇款账号
    stateSubmitWesternUnion () {
      this.stateSeniorCertification()
    },
    async stateSeniorCertification () {
      let data
      let param = {
        address: this.telegraphicTransferAddress, // 西联汇款账号
        payPassword: this.transactionPassword, // 交易密码
        bankType: 'xilian', // type
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
        type: 'xilian'
      }
      data = await modificationAccountPaymentTerm(params)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回状态展示
        this.paymentMethodList = data.data.data
        this.telegraphicTransferAddress = data.data.data.address
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
  @import "../../../../static/css/scss/Personal/AccountReceivableAccount/AddWesternUnion";
  .add-western {
    >.add-western-main {
      width: 1100px;
      margin: 60px auto 100px;
      >.add-western-header {
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
          font-weight: 600;
        }
      }
      >.add-western-content {
        min-height: 300px;
        margin: 16px 25px;
        >.western-content-title {
          height: 32px;
          line-height: 32px;
          margin-bottom: 30px;
        }
        >.western-content-from {
          width: 500px;
          margin-left: 55px;
          .western-input {
            width: 220px;
            height: 34px;
            padding-left: 15px;
          }
          .western-upload {
            width: 118px;
            height: 106px;
            text-align: center;
            line-height: 100px;
          }
          .western-button {
            padding: 9px 33px;
            margin: 30px 0 50px 25px;
          }
        }
      }
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      .add-western-main {
        background-color: #1E2636;
        >.add-western-header {
          border-bottom: 1px solid #39424D;
          >.header-content-left {
            color: #fff;
          }
          >.header-content-right {
            color: #A9BED4;
          }
        }
        >.add-western-content {
          >.western-content-title {
            background:rgba(62,121,214,0.08);
            color: #3E79D6;
          }
          >.western-content-from {
            .western-input {
              border: 1px solid #485776;
              color: rgba(255,255,255,0.7);
            }
            .western-content-name {
              color: rgba(255,255,255,0.7);
            }
            .western-upload {
              background-color: #323E48;
              .icon-plus {
                color: #828EA6;
              }
            }
            .western-button {
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
      .add-western-main {
        background-color: #ccc;
        > .add-western-header {
          border-bottom: 1px solid #ccc;
          >.header-content-left {
            color: #555;
          }
        }
        >.add-western-content {
          >.western-content-title {
            background:rgba(62,121,214,1);
            color: #ccc;
          }
          >.western-content-from {
            .western-input {
              border: 1px solid #000;
              color: #000;
            }
            .western-upload {
              background-color: #fff;
              .icon-plus {
                color: #555;
              }
            }
            .western-button {
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
