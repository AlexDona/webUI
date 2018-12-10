<template>
  <div
    class="add-chat personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-background="rgba(0, 0, 0, 0.6)"
    :style="{
      height: windowHeight+'px'
    }"
  >
    <div
      class="add-chat-main margin25"
    >
      <header class="add-chat-header personal-height60 line-height60 line-height70 margin25">
        <span
          v-if="paymentTerm.isWeixinBind"
          class="header-content-left header-content font-size16 font-weight600"
        >
          <!--设置微信账号-->
          {{ $t('M.comm_set') }}{{ $t('M.user_account_weChat') }}{{ $t('M.user_account_number') }}
        </span>
        <span
          v-else
          class="header-content-left header-content font-size16 font-weight600"
        >
          <!--修改微信账号-->
          {{ $t('M.user_bind_WeChat_verify') }}
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
      <div class="add-chat-content">
        <!--<header class="chat-content-title">-->
          <!--*微信上传二维码方法：打开微信首页>收钱>保存图片，将存在手机相册的收款码上传即可。-->
        <!--</header>-->
        <div class="chat-content-from">
          <el-form
            :label-position="labelPosition"
            label-width="120px"
          >
            <!--名 称-->
            <el-form-item
              :label="$t('M.user_account_name')"
            >
              <span class="chat-content-type">
                {{ innerUserInfo.realname }}
              </span>
            </el-form-item>
            <!--收款类型-->
            <el-form-item
              :label="$t('M.user_pay_account_set6')"
            >
              <span class="chat-content-type">
                {{ $t('M.user_account_weChat') }}
              </span>
            </el-form-item>
            <!--微信账号-->
            <el-form-item
              :label="$t('M.user_account_weChat') + $t('M.user_account_number')"
            >
              <input
                class="chat-input border-radius2"
                v-model="cardNo"
                @keydown="setErrorMsg(0, '')"
                @blur="checkoutInputFormat(0, cardNo)"
              />
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[0]"
                :isShow="!!errorShowStatusList[0]"
              />
            </el-form-item>
            <!-- 上传收款码 -->
            <el-form-item
              :label="$t('M.user_account_upload_collection')"
            >
              <div class="chat-upload border-radius4">
                <div
                  class="mask-layer cursor-pointer"
                  v-show="removeMaskLayer"
                >
                  <i
                    class="el-icon-delete mask-icon cursor-pointer"
                    @click="handleRemove"
                  >
                  </i>
                </div>
                <el-upload
                  :action="apiCommonUrl+'uploadfile'"
                  :headers="tokenObj"
                  list-type="picture-card"
                  :on-success="handleSuccessHand"
                  :on-remove="handleRemove"
                >
                  <img
                    class="mask-images"
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
            <el-form-item
              :label="$t('M.comm_password')"
            >
              <input
                type="password"
                class="chat-input border-radius2"
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
              v-if="paymentTerm.isWeixinBind"
              class="chat-button border-radius4 cursor-pointer"
              @click.prevent="stateSubmitWeChat"
            >
              <!--确认设置-->
              {{ $t('M.user_bind_Alipay_set_confirm') }}
            </button>
            <button
              v-else
              class="chat-button border-radius4 cursor-pointer"
              @click.prevent="stateSubmitWeChat"
            >
              <!--确认修改-->
              {{ $t('M.user_modification_confirm_amend') }}
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
import {
  apiCommonUrl,
  xDomain
} from '../../../utils/env'
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
      cardNo: '', // 微信账号
      password: '', // 交易密码
      dialogImageHandUrl1: '', // 图片url
      removeMaskLayer: true, // 删除遮罩层
      paymentTypeId: '', // 收款类型ID
      paymentTerm: {}, // 收款方式
      successCountDown: 1, // 成功倒计时
      paymentMethodList: {},
      fullscreenLoading: false, // 整页loading
      errorShowStatusList: [
        '', // 微信账号
        '' // 交易密码
      ]
    }
  },
  created () {
    this.tokenObj.token = this.userInfo.token
    this.tokenObj['x-domain'] = xDomain
    getAccountPaymentTerm(this)
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
    // 上传微信二维码
    handleSuccessHand (response, file, fileList) {
      this.dialogImageHandUrl1 = response.data.fileUrl
      console.log(response, file, fileList)
    },
    // 删除微信二维码
    handleRemove () {
      this.dialogImageHandUrl1 = ''
      this.removeMaskLayer = false
    },
    // 检测输入格式
    checkoutInputFormat (type, targetNum) {
      console.log(type)
      switch (type) {
        // 请输入微信账号
        case 0:
          console.log(type)
          if (!targetNum) {
            this.setErrorMsg(0, this.$t('M.user_bind_WeChat_please_input'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(0, '')
            this.$forceUpdate()
            return 1
          }
        // 请输入交易密码
        case 1:
          if (!targetNum) {
            this.setErrorMsg(1, this.$t('M.user_bind_xilain_trade_pwd'))
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
    // 确认设置按钮
    stateSubmitWeChat () {
      this.stateSeniorCertification()
    },
    // 确认设置接口
    async stateSeniorCertification () {
      let goOnStatus = 0
      if (
        this.checkoutInputFormat(0, this.cardNo) &&
        this.checkoutInputFormat(1, this.password)
      ) {
        goOnStatus = 1
      } else {
        goOnStatus = 0
      }
      console.log(this.dialogImageHandUrl1)
      if (this.dialogImageHandUrl1 == '') {
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
          cardNo: this.cardNo, // 微信账号
          qrcode: this.dialogImageHandUrl1, // 二维码
          payPassword: this.password, // 交易密码
          bankType: 'Wechat' // type
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
      this.cardNo = ''
      this.password = ''
    },
    // 获取支付方式信息
    async paymentMethodInformation () {
      let data
      let params = {
        userId: this.userInfo.userId,
        type: 'Wechat'
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
          // 修改时带回微信号
          this.cardNo = detailData.cardNo
        }
        if (detailData.qrcode) {
          // 修改时带回微信收款码
          this.dialogImageHandUrl1 = detailData.qrcode
        }
        if (detailData.id) {
          this.paymentTypeId = detailData.id
        }
        console.log(this.dialogImageHandUrl1)
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
      innerUserInfo: state => state.user.loginStep1Info.userInfo, // 内层用户详细信息
      refAccountCenterStatus: state => state.personal.refAccountCenterStatus
    }),
    apiCommonUrl () {
      return apiCommonUrl
    },
    windowHeight () {
      return window.innerHeight
    }
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal";

  .add-chat {
    margin-top: 66px;
    overflow: hidden;

    > .add-chat-main {
      width: 1100px;
      height: 700px;
      margin: 60px auto 100px;

      > .add-chat-header {
        display: flex;

        > .header-content-right,
        .header-content-left {
          flex: 1;
        }

        > .header-content-right {
          text-align: right;
        }

        > .header-content-left {
          text-align: left;
        }
      }

      > .add-chat-content {
        min-height: 300px;
        margin: 16px 25px;

        > .chat-content-title {
          height: 32px;
          margin-bottom: 30px;
          line-height: 32px;
        }

        > .chat-content-from {
          width: 500px;
          margin-left: 55px;

          .chat-input {
            width: 220px;
            height: 34px;
            padding-left: 15px;
          }

          .chat-upload {
            float: left;
            width: 122px;
            height: 122px;
            overflow: hidden;
            line-height: 100px;
            text-align: center;

            .mask-layer {
              position: absolute;
              z-index: 9;
              top: 0;
              width: 122px;
              height: 122px;
              border-radius: 6px;
              line-height: 118px;
              background: transparent;
              opacity: 0;
            }

            &:hover .mask-layer {
              width: 122px;
              height: 122px;
              background-color: rgba(0, 0, 0, .4);
              opacity: 1;

              .mask-icon {
                font-size: 19px;
                color: #fff;
              }
            }
          }

          .chat-button {
            width: 237px;
            padding: 10px 0;
            margin: 30px 0 50px 140px;
          }
        }
      }
    }

    /deep/ {
      /* 覆盖element样式 */
      .el-input-group {
        width: 62.5%;
      }

      .el-input__inner {
        height: 36px;
        border-radius: 2px;
      }

      .el-input-group__append {
        padding: 0 16px;
        border-radius: 0 4px 4px 0;
        font-size: 12px;
      }

      .el-upload-list__item {
        width: 118px;
        height: 118px;
      }

      .mask-images {
        margin-top: 1px;
        border-radius: 6px;
      }

      .el-upload--picture-card {
        position: relative;
        width: 122px;
        height: 122px;
        line-height: 106px;
      }

      .el-form-item__content {
        width: 600px;
      }

      .el-form-item__label {
        width: 140px !important;
      }
    }

    &.night {
      color: $nightFontColor;
      background-color: $nightBgColor;

      .add-chat-main {
        background-color: $nightMainBgColor;

        > .add-chat-header {
          border-bottom: 1px solid #39424d;

          .header-content {
            color: #fff;
          }

          .header-content-right {
            color: #a9bed4;
          }
        }

        > .add-chat-content {
          > .chat-content-title {
            color: #3e79d6;
            background: rgba(62, 121, 214, .08);
          }

          > .chat-content-from {
            .chat-content-type {
              color: rgba(255, 255, 255, .7);
            }

            .chat-input {
              border: 1px solid #485776;
              color: rgba(255, 255, 255, .7);

              &:focus {
                border: 1px solid #338ff5;
              }
            }

            .chat-upload {
              .icon-plus {
                position: absolute;
                top: 35px;
                right: 40px;
                color: #828ea6;
              }
            }

            .chat-button {
              color: rgba(255, 255, 255, .7);
              background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
            }
          }
        }
      }

      /deep/ {
        /* 个人中心黑色主题 */
        .el-form-item__label {
          color: rgba(255, 255, 255, .7);
        }

        .el-input__inner {
          border: 1px solid #485776;
          color: rgba(255, 255, 255, .7);
          background-color: #1e2636;
        }

        .el-input-group__append {
          border-color: #364654;
          color: rgba(255, 255, 255, .7);
          background-color: #338ff5;
        }

        .el-upload--picture-card {
          background-color: #485776;
        }
      }
    }

    &.day {
      color: $dayFontColor;
      background-color: $dayBgColor;

      .add-chat-main {
        border: 1px solid rgba(246, 246, 246, 1);
        border-radius: 4px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 0 4px rgba(235, 240, 248, 1);

        > .add-chat-header {
          border-bottom: 1px solid rgba(57, 66, 77, .1);

          .header-content {
            color: #7d90ac;
          }

          .header-content-right {
            color: #a9bed4;
          }
        }

        > .add-chat-content {
          > .chat-content-title {
            color: #3e79d6;
            background: rgba(62, 121, 214, .08);
          }

          > .chat-content-from {
            .chat-content-type {
              color: #333;
            }

            .chat-input {
              border: 1px solid rgba(236, 241, 248, 1);
              color: #333;
              background: rgba(255, 255, 255, 1);

              &:focus {
                border: 1px solid #338ff5;
              }
            }

            .chat-upload {
              .icon-plus {
                position: absolute;
                top: 35px;
                right: 35px;
                color: #828ea6;
              }
            }

            .chat-button {
              color: rgba(255, 255, 255, .7);
              background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
            }
          }
        }
      }

      /deep/ {
        /* 个人中心白色主题 */
        .el-form-item__label {
          color: #7d90ac;
        }

        .el-input__inner {
          border: 1px solid #555;
          color: #000;
          background-color: transparent;
        }

        .el-input-group__append {
          border-color: #364654;
          color: #555;
          background-color: #b1b1b1;
        }
      }
    }
  }
</style>
