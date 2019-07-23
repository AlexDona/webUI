<template>
  <div
    class="add-chat personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
    :style="{
      height: windowHeight+'px'
    }"
  >
    <div
      class="add-chat-main margin25"
    >
      <header class="add-chat-header personal-height60 line-height60 line-height70 margin25">
        <span
          class="header-content-left header-content font-size16 font-weight600"
        >
          <!--设置微信账号-->
          {{ paymentTerm.isWeixinBind? $t('M.comm_set') + $t('M.user_account_weChat') + $t('M.user_account_number'): $t('M.user_bind_WeChat_verify') }}
          <!--修改微信账号-->
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
            label-width="120px"
          >
            <!--名 称-->
            <el-form-item
              :label="$t('M.user_account_name')"
            >
              <input
                type="text"
                :placeholder="innerUserInfo.realname"
                v-model.trim="nameOfMerchantSet"
                v-if="$isMerchant_X"
                class="chat-input border-radius2"
              >
              <span
                class="chat-content-type"
                v-else
              >
                {{ nameOfMerchantSet || innerUserInfo.realname }}
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
              <div
                class="chat-upload border-radius4"
              >
                <div class="img">
                  <!-- 上传微信收款码 -->
                  <input
                    @change="getPicture"
                    type="file"
                    id="fileInput"
                    ref="fileInput"
                    class="upload-input"
                    accept="image/jpeg,image/jpg,image/png,image/bmp"
                  />
                  <div
                    class="picture"
                    @click="choosePicture"
                  >
                    <IconFontCommon
                      class="font-size60"
                      iconName="icon-jia1"
                    />
                    <img
                      v-show="wechatImgUrl"
                      class="cursor-pointer user-upload-img"
                      :src="wechatImgUrl"
                    >
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item
              :label="$t('M.comm_password')"
            >
              <input
                type="password"
                autocomplete= "new-password"
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
            <div style="width: 380px;">
              <button
                class="chat-button border-radius4 cursor-pointer"
                @click.prevent="stateSubmitWeChat"
              >
                <!--确认设置-->
                {{ paymentTerm.isWeixinBind? $t('M.user_bind_Alipay_set_confirm') : $t('M.user_modification_confirm_amend') }}
                <!--确认修改-->
              </button>
              <p
                class="font-size12 cursor-pointer text-align-r hint-color float-right"
                @click.prevent="payPasswordState"
              >
                {{ $t('M.user_payPassword') }}
              </p>
            </div>
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
  // returnAjaxMsg,
  getAccountPaymentTerm,
  getNestedData,
  http2https
} from '../../../utils/commonFunc'
import {
  statusCardSettings,
  uploadImageAjax,
  modificationAccountPaymentTerm
} from '../../../utils/api/personal'
import lrz from 'lrz'
import {
  mapMutations,
  mapState,
  mapActions
} from 'vuex'
import mixins from '../../../mixins/user'
export default {
  mixins: [mixins],
  components: {
    ErrorBox, // 错误提示接口
    IconFontCommon // 字体图标
  },
  data () {
    return {
      // 用户设置的微信名称
      nameOfMerchantSet: '',
      cardNo: '', // 微信账号
      password: '', // 交易密码
      dialogImageHandUrl1: '', // 图片url
      paymentTypeId: '', // 收款类型ID
      paymentTerm: {}, // 收款方式
      successCountDown: 1, // 成功倒计时
      paymentMethodList: {},
      errorShowStatusList: [
        '', // 微信账号
        '' // 交易密码
      ],
      // 添加微信成功后自动跳转定时器
      addWeChatSuccessJumpTimer: null,
      // 微信二维码地址
      wechatImgUrl: ''
    }
  },
  async created () {
    await getAccountPaymentTerm(this)
    this.paymentMethodInformation()
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_USER_CENTER_ACTIVE_NAME',
      'CHANGE_REF_ACCOUNT_CREDITED_STATE',
      'CHANGE_PASSWORD_USEABLE'
    ]),
    ...mapActions([
      'REFRESH_USER_INFO_ACTION'
    ]),
    /**
     * 1.界面跳转
     **/
    // 1.01 点击跳转到重置交易密码
    payPasswordState () {
      this.$goToPage('/TransactionPassword')
    },
    // 1.02 点击返回上个页面
    returnSuperior () {
      this.CHANGE_REF_ACCOUNT_CREDITED_STATE(true)
      this.CHANGE_USER_CENTER_ACTIVE_NAME('account-credited')
      this.$goToPage('/PersonalCenter')
    },
    // 1.03 成功自动跳转
    successJump () {
      this.addWeChatSuccessJumpTimer = setInterval(() => {
        if (this.successCountDown === 0) {
          this.CHANGE_REF_ACCOUNT_CREDITED_STATE(true)
          this.CHANGE_USER_CENTER_ACTIVE_NAME('account-credited')
          this.$goToPage('/PersonalCenter')
        }
        this.successCountDown--
      }, 1000)
    },
    /**
     * 2.上传图片事件
     **/
    // 2.01 选择图片文件
    choosePicture () {
      this.$refs[`fileInput`].click()
    },
    // 2.02 图片上传压缩
    getPicture (e) {
      if (!e.target.files.length) return false
      lrz(e.target.files[0]).then(async res => {
        console.log(res)

        const {base64, file, fileLen} = res
        if (this.beforeAvatarUpload(fileLen)) return false
        await this.uploadImg(file)
        this.wechatImgUrl = base64
      })
    },
    // 2.03 上传图片
    async uploadImg (file) {
      let formData = new FormData()
      // console.log(res.file)
      formData.append('file', file)
      const data = await uploadImageAjax(formData)
      if (!data) return false
      console.log(data.data)
      this.dialogImageHandUrl1 = getNestedData(data, 'data.fileUrl')
      console.log(this.wechatImgUrl)
    },
    // 2.04 判断图片大小限制
    beforeAvatarUpload (size) {
      // 10M压缩后最大 尺寸
      const COMPRESS_SIZE = 10485760
      let isLt10M = false
      if (size > COMPRESS_SIZE) {
        // 上传头像图片大小不能超过 10M!
        this.$message.error(this.$t('M.user_senior_hint5'))
        isLt10M = true
      }
      return isLt10M
    },
    /**
     * 3.格式验证
     **/
    // 3.01 检测输入格式
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
    // 3.02 设置错误信息
    setErrorMsg (index, msg) {
      this.errorShowStatusList[index] = msg
    },
    /**
     * 4.确认提交
     **/
    // 4.01 确认设置按钮
    stateSubmitWeChat () {
      this.stateSeniorCertification()
    },
    // 4.02 确认设置接口
    stateSeniorCertification: _.debounce(async function () {
      let goOnStatus = 0
      if (
        this.checkoutInputFormat(0, this.cardNo) &&
        this.checkoutInputFormat(1, this.password)
      ) {
        goOnStatus = 1
      } else {
        goOnStatus = 0
      }
      if (!this.wechatImgUrl) {
        this.$message({
          message: this.$t('M.user_account_weChat_pla'),
          type: 'error'
        })
        return false
      }
      if (goOnStatus) {
        let data
        let param = {
          realname: this.$useMerchantSetName_X ? this.nameOfMerchantSet : this.innerUserInfo.realname, // 真实姓名
          token: this.userInfo.token,
          cardNo: this.cardNo, // 微信账号
          qrcode: this.dialogImageHandUrl1, // 二维码
          payPassword: this.password, // 交易密码
          bankType: 'Wechat' // type
        }
        // 判断是否交易密码锁定
        await this.REFRESH_USER_INFO_ACTION()
        let isPaypasswordLocked = getNestedData(this.loginStep1Info, 'payPasswordRemainCount') ? false : true
        this.CHANGE_PASSWORD_USEABLE(isPaypasswordLocked)
        if (this.isLockedPayPassword) return false
        // console.log(this.dialogImageHandUrl1)
        data = await statusCardSettings(param)
        // console.log(data)
        if (!data) return false
        this.successJump()
        this.stateEmptyData()
      }
    }),
    // 4.03 接口请求完成之后清空数据
    stateEmptyData () {
      this.cardNo = ''
      this.password = ''
    },
    // 4.04 获取支付方式信息
    async paymentMethodInformation () {
      let data
      let params = {
        userId: this.userInfo.userId,
        type: 'Wechat'
      }
      data = await modificationAccountPaymentTerm(params)
      if (!data) return false
      let detailData = getNestedData(data, 'data')
      const {cardNo, qrcode, id, realname} = detailData
      // 返回状态展示
      if (detailData) {
        this.paymentMethodList = detailData
      }
      if (cardNo) {
        // 修改时带回微信号
        this.cardNo = cardNo
      }
      if (qrcode) {
        // 修改时带回微信收款码
        this.dialogImageHandUrl1 = http2https(qrcode)
        this.wechatImgUrl = http2https(qrcode)
      }
      if (id) {
        this.paymentTypeId = id
      }
      this.nameOfMerchantSet = realname
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      innerUserInfo: state => state.user.loginStep1Info.userInfo, // 内层用户详细信息
      loginStep1Info: state => state.user.loginStep1Info,
      refAccountCenterStatus: state => state.personal.refAccountCenterStatus,
      // 交易密码是否被锁定
      isLockedPayPassword: state => state.common.isLockedPayPassword
    }),
    windowHeight () {
      return window.innerHeight
    }
  },
  watch: {},
  destroyed () {
    // 离开本组件清除定时器
    if (this.addWeChatSuccessJumpTimer) {
      clearInterval(this.addWeChatSuccessJumpTimer)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../../assets/CSS/index';

  .add-chat {
    margin-top: 50px;
    overflow: hidden;

    > .add-chat-main {
      width: 1300px;
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
          margin: 58px auto;

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

            > .img {
              > .upload-input {
                display: none;
              }

              > .picture {
                position: relative;
                width: 122px;
                height: 122px;
                border: 1px dashed rgba(255, 255, 255, .3);
                text-align: center;
                cursor: pointer;

                > .user-upload-img {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                }
              }
            }
          }

          .chat-button {
            width: 237px;
            padding: 10px 0;
            margin: 5px 0 10px 140px;
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
      background-color: $mainNightBgColor;

      .add-chat-main {
        background-color: $mainContentNightBgColor;

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
              color: rgba(255, 255, 255, 1);
              background: linear-gradient(90deg, rgba(18, 71, 133, 1) 0%, rgba(42, 59, 97, 1) 100%);
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
      color: $dayMainTitleColor;

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
              color: rgba(255, 255, 255, 1);
              background: linear-gradient(90deg, rgba(106, 182, 244, 1) 0%, rgba(49, 135, 218, 1) 100%);
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
