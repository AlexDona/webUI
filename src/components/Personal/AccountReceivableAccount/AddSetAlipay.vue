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
          <!--设置账号-->
           {{ $t('M.user_bind_Alipay_set_account') }}
        </span>
        <span
          v-else
          class="header-content-left header-content font-size16 font-weight600"
        >
          <!--修改账号-->
          {{ $t('M.comm_modification')}}{{$t('M.user_account_alipay')}}{{$t('M.user_account_number')}}
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
            <!--名称-->
            <el-form-item
              :label="$t('M.user_account_name')"
            >
              <span class="account-content-type">
                {{ innerUserInfo.realname }}
              </span>
            </el-form-item>
            <!--收款类型-->
            <el-form-item
              :label="$t('M.user_pay_account_set6')"
            >
              <span class="account-content-type">
                <!-- 支付宝 -->
                {{$t('M.comm_alipay')}}
              </span>
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
                      v-show="alipayImgUrl"
                      class="cursor-pointer user-upload-img"
                      :src="alipayImgUrl"
                    >
                  </div>
                </div>
              </div>
            </el-form-item>
            <!--交易密码-->
            <el-form-item
              :label="$t('M.comm_password')"
            >
              <input
                type="password"
                autocomplete= "new-password"
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
              @click.prevent="submitSettings"
            >
              <!--确认设置-->
              {{ $t('M.user_bind_Alipay_set_confirm') }}
            </button>
            <button
              v-else
              class="account-button border-radius4"
              @click.prevent="submitSettings"
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
  getAccountPaymentTerm,
  getNestedData
} from '../../../utils/commonFunc'
import {
  statusCardSettings,
  uploadImageAjax,
  modificationAccountPaymentTerm
} from '../../../utils/api/personal'
import lrz from 'lrz'
import {
  mapMutations,
  mapState
} from 'vuex'
export default {
  components: {
    ErrorBox, // 错误提示接口
    IconFontCommon // 字体图标
  },
  data () {
    return {
      alipayAccount: '', // 支付宝账号
      password: '', // 交易密码
      dialogImageHandUrl1: '', // 图片url
      paymentTypeId: '', // 收款类型ID
      paymentTerm: {},
      successCountDown: 1, // 成功倒计时
      paymentMethodList: {},
      errorShowStatusList: [
        '', // 支付宝账号
        '' // 交易密码
      ],
      // loadingCircle: {} // 整页loading
      fullscreenLoading: false, // 整页loading
      // 添加支付宝成功后自动跳转定时器
      addAlipaySuccessJumpTimer: null,
      // 支付宝地址上传url
      alipayImgUrl: ''
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
      'CHANGE_AJAX_READY_STATUS'
    ]),
    // 选择图片文件
    choosePicture () {
      this.$refs[`fileInput`].click()
    },
    getPicture (e) {
      lrz(e.target.files[0]).then(async res => {
        this.CHANGE_AJAX_READY_STATUS(true)
        const {base64, file, fileLen} = res
        if (this.beforeAvatarUpload(fileLen)) return false
        await this.uploadImg(file)
        this.alipayImgUrl = base64
      })
    },
    async uploadImg (file) {
      let formData = new FormData()
      // console.log(res.file)
      formData.append('file', file)
      const data = await uploadImageAjax(formData)
      this.CHANGE_AJAX_READY_STATUS(false)
      if (!data) return false
      this.dialogImageHandUrl1 = getNestedData(data, 'data.fileUrl')
    },
    // 判断图片大小限制
    beforeAvatarUpload (size) {
      // 10M压缩后最大 尺寸
      const COMPRESS_SIZE = 245500
      let isLt10M = false
      if (size > COMPRESS_SIZE) {
        this.CHANGE_AJAX_READY_STATUS(false)
        // 上传头像图片大小不能超过 10M!
        this.$message.error(this.$t('M.user_senior_hint5'))
        isLt10M = true
      }
      return isLt10M
    },
    // 点击返回上个页面
    returnSuperior () {
      this.CHANGE_REF_ACCOUNT_CREDITED_STATE(true)
      this.CHANGE_USER_CENTER_ACTIVE_NAME('account-credited')
      this.$router.push({path: '/PersonalCenter'})
    },
    // 检测输入格式
    checkoutInputFormat (type, targetNum) {
      // console.log(type)
      switch (type) {
        // 请输入支付宝账号
        case 0:
          // console.log(type)
          if (!targetNum) {
            this.setErrorMsg(0, this.$t('M.user_bind_Alipay_please_input'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(0, '')
            this.$forceUpdate()
            return 1
          }
        // 请输入交易密码
        case 1:
          // console.log(type)
          if (!targetNum) {
            this.setErrorMsg(1, this.$t('M.user_push_input_pwd'))
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
    async submitSettings () {
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
        // 请上传支付宝收款码
        this.$message({
          message: this.$t('M.user_account_alipay_pla'),
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
        // console.log(this.dialogImageHandUrl1)
        data = await statusCardSettings(param)
        // console.log(data)
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
      if (!data) return false
      // 接口成功清除loading
      this.fullscreenLoading = false
      const detailData = getNestedData(data, 'data')
      const {cardNo, qrcode, id} = detailData
      // 返回状态展示
      this.paymentMethodList = detailData || []
      if (cardNo) {
        // 修改时带回支付宝号
        this.alipayAccount = cardNo
      }
      if (qrcode) {
        // 修改时带回支付宝收款码
        this.dialogImageHandUrl1 = qrcode
        this.alipayImgUrl = qrcode
      }
      if (id) {
        // 修改时带回类id
        this.paymentTypeId = id
      }
    },
    // 成功自动跳转
    successJump () {
      this.addAlipaySuccessJumpTimer = setInterval(() => {
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
    }
  },
  watch: {},
  destroyed () {
    // 离开本组件清除定时器
    if (this.addAlipaySuccessJumpTimer) {
      clearInterval(this.addAlipaySuccessJumpTimer)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal.scss";

  .add-account {
    margin-top: 66px;
    overflow: hidden;

    > .add-account-main {
      width: 1100px;
      height: 700px;
      margin: 60px auto 100px;

      > .add-account-header {
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

      > .add-account-content {
        min-height: 300px;
        margin: 16px 25px;

        > .account-content-title {
          height: 32px;
          margin-bottom: 30px;
          line-height: 32px;
        }

        > .account-content-from {
          width: 500px;
          margin-left: 55px;

          .account-input {
            width: 220px;
            height: 34px;
            padding-left: 15px;
          }

          .account-upload {
            width: 122px;
            height: 122px;
            overflow: hidden;
            line-height: 100px;

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

          .account-button {
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

      .add-account-main {
        background-color: $nightMainBgColor;

        > .add-account-header {
          border-bottom: 1px solid #39424d;

          > .header-content-left {
            color: #fff;
          }

          > .header-content-right {
            color: #a9bed4;
          }
        }

        > .add-account-content {
          > .account-content-title {
            color: #3e79d6;
            background: rgba(62, 121, 214, .08);
          }

          > .account-content-from {
            .account-content-type {
              color: #fff;
            }

            .account-input {
              border: 1px solid #485776;
              color: rgba(255, 255, 255, .7);

              &:focus {
                border: 1px solid #338ff5;
              }
            }

            .account-upload {
              .icon-plus {
                position: absolute;
                top: 35px;
                right: 40px;
                color: #828ea6;
              }
            }

            .account-button {
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

      .add-account-main {
        border: 1px solid rgba(246, 246, 246, 1);
        border-radius: 4px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 0 4px rgba(235, 240, 248, 1);

        > .add-account-header {
          border-bottom: 1px solid rgba(57, 66, 77, .1);

          .header-content-right {
            color: #7d90ac;
          }
        }

        > .add-account-content {
          > .account-content-title {
            color: #3e79d6;
            background: rgba(62, 121, 214, .1);
          }

          > .account-content-from {
            .account-content-type {
              color: #333;
            }

            .account-input {
              border: 1px solid rgba(236, 241, 248, 1);
              color: #333;
              background: rgba(255, 255, 255, 1);

              &:focus {
                border: 1px solid #338ff5;
              }
            }

            .account-upload {
              background-color: #fff;

              .icon-plus {
                position: absolute;
                top: 35px;
                right: 35px;
                color: #555;
              }
            }

            .account-button {
              color: #ccc;
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
