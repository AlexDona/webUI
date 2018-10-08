<template>
  <div
    class="set-phone personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <HeaderCommon/>
    <div class="set-phone-main margin25">
      <header class="set-phone-header personal-height60 line-height60 line-height70 margin25">
        <span
          v-if="!securityCenter.isPhoneBind"
          class="header-content-left header-content font-size16 font-weight600"
        >
          <!--绑定手机-->
          {{ $t('M.user_security_binding') }}{{ $t('M.user_security_phone') }}
        </span>
        <span
          v-else
          class="header-content-left header-content font-size16 font-weight600"
        >
          <!--修改手机-->
          {{ $t('M.comm_modification') }}{{ $t('M.user_security_phone') }}
        </span>
        <span
          class="header-content-right font-size12 cursor-pointer"
          @click.prevent="returnSuperior"
        >
          <IconFontCommon
            class="font-size22"
            iconName="icon-fanhui2"
          />
          <!--返回安全中心-->
          {{ $t('M.user_security_return_safety_center') }}
        </span>
      </header>
      <div class="set-phone-content">
        <!--<header class="phone-content-title">-->
          <!--&lt;!&ndash;*请确认您的银行卡已开启短信通知功能&ndash;&gt;-->
          <!--*{{ $t('M.user_security_text0') }}-->
        <!--</header>-->
        <div class="phone-content-from">
          <!--绑定手机-->
          <el-form
            v-if="!securityCenter.isPhoneBind"
            :label-position="labelPosition"
            label-width="120px"
          >
            <!--手机号码 图片验证码 短信验证码-->
            <el-form-item
              :label="$t('M.user_security_phone') + $t('M.user_security_number') + '：'"
            >
              <el-select v-model="bindingDataPhone.bindingAreaCodeValue">
                <el-option
                  v-for="(item, index) in contryAreaList"
                  :key="index"
                  :label="item.nationCode"
                  :value="item.nationCode"
                >
                </el-option>
              </el-select>
              <input
                type="text"
                class="phone-input phone-input-left border-radius2 padding-l15 box-sizing"
                v-model="bindingDataPhone.bindingNewPhoneAccounts"
                @keydown="setErrorMsg(0,'')"
                @blur="checkUserExistAjax('phone', bindingDataPhone.bindingNewPhoneAccounts)"
              >
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[0]"
                :isShow="!!errorShowStatusList[0]"
              />
            </el-form-item>
            <el-form-item
              :label="$t('M.user_security_picture') + $t('M.comm_code') + '：'"
            >
              <!--图片验证码-->
              <input
                type="text"
                class="phone-input phone-image border-radius2 padding-l15 box-sizing"
                v-model="bindingDataPhone.userInputImageCode"
                @keydown="setErrorMsg(1,'')"
                @blur="checkoutInputFormat(1, bindingDataPhone.userInputImageCode)"
              >
              <!--获取图片验证码-->
              <span
                @click.prevent="refreshCode"
                class="cursor-pointer display-inline-block phone-input-align"
              >
              <ImageValidate
                id="register"
                :content-width="75"
                :content-height="34"
                :identifyCode="bindingDataPhone.identifyCode"
                class="display-inline-block image-input"
              />
              </span>
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[1]"
                :isShow="!!errorShowStatusList[1]"
              />
            </el-form-item>
            <el-form-item
              :label="$t('M.comm_note') + $t('M.comm_code') + '：'"
            >
              <el-input
                v-model="bindingDataPhone.bindingNewPhoneCode"
                @keydown="setErrorMsg(2,'')"
                @blur="checkoutInputFormat(2, bindingDataPhone.userInputImageCode)"
              >
                <template slot="append">
                  <CountDownButton
                    class="send-code-btn cursor-pointer"
                    :status="disabledOfPhoneBtn"
                    @run="sendPhoneOrEmailCode(0)"
                  />
                </template>
                <!--错误提示-->
                <ErrorBox
                  :text="errorShowStatusList[2]"
                  :isShow="!!errorShowStatusList[2]"
                />
              </el-input>
            </el-form-item>
            <div class="prompt-message">
              <div v-show="errorMsg">{{ errorMsg }}</div>
            </div>
            <button
              class="phone-button border-radius4 cursor-pointer"
              @click.prevent="getStatusSubmit"
            >
              <!--确认绑定-->
              {{ $t('M.comm_affirm') }}{{ $t('M.user_security_binding') }}
            </button>
          </el-form>
          <!--换绑手机-->
          <el-form
            v-else
            :label-position="labelPosition"
            label-width="120px"
          >
            <!--姓名 短信验证码 新手机号码 短信验证码 交易密码-->
            <el-form-item
              :label="$t('M.comm_name') + '：'"
            >
              <span class="bank-content-name">
                {{ userInfo.userInfo.realname }}
              </span>
            </el-form-item>
            <el-form-item
              :label="$t('M.comm_note') + $t('M.comm_code') + '：'"
            >
              <el-input
                v-model="amendDataPhone.oldPhoneCode"
                @keydown="tieErrorMsg(0,'')"
                @blur="tieCheckoutInputFormat(0, amendDataPhone.oldPhoneCode)"
              >
                <template slot="append">
                  <CountDownButton
                    class="send-code-btn cursor-pointer"
                    :status="disabledOfOldPhoneBtn"
                    @run="sendPhoneOrEmailCode(0, 1, 1)"
                  />
                </template>
              </el-input>
              <!--错误提示-->
              <ErrorBox
                :text="tieErrorShowStatusList[0]"
                :isShow="!!tieErrorShowStatusList[0]"
              />
            </el-form-item>
            <el-form-item
              :label="$t('M.user_security_login_new') + $t('M.user_security_phone') + $t('M.comm_mark') + '：'"
            >
              <el-select
                v-model="amendDataPhone.areaCodeValue"
              >
                <el-option
                  v-for="(item, index) in contryAreaList"
                  :key="index"
                  :label="item.nationCode"
                  :value="item.nationCode"
                >
                </el-option>
              </el-select>
              <input
                type="text"
                class="phone-input phone-input-left border-radius2 padding-l15 box-sizing"
                v-model="amendDataPhone.newPhoneAccounts"
                @keydown="tieErrorMsg(1,'')"
                @blur="checkUserExistAjax('phone', amendDataPhone.newPhoneAccounts,'newPhone')"
              >
              <!--错误提示-->
              <ErrorBox
                :text="tieErrorShowStatusList[1]"
                :isShow="!!tieErrorShowStatusList[1]"
              />
            </el-form-item>
            <el-form-item
              :label="$t('M.comm_note') + $t('M.comm_code') + '：'"
            >
              <el-input
                v-model="amendDataPhone.newPhoneCode"
                @keydown="tieErrorMsg(2,'')"
                @blur="tieCheckoutInputFormat(2, amendDataPhone.newPhoneCode)"
              >
                <template slot="append">
                  <CountDownButton
                    class="send-code-btn cursor-pointer"
                    :status="disabledOfPhoneBtn"
                    @run="sendPhoneOrEmailCode(0, 2, 0)"
                  />
                </template>
              </el-input>
              <!--错误提示-->
              <ErrorBox
                :text="tieErrorShowStatusList[2]"
                :isShow="!!tieErrorShowStatusList[2]"
              />
            </el-form-item>
            <el-form-item
              :label="$t('M.comm_password') + '：'"
            >
              <input
                type="password"
                class="phone-input border-radius2 padding-l15 box-sizing"
                v-model="amendDataPhone.transactionPassword"
                @keydown="tieErrorMsg(3,'')"
                @blur="tieCheckoutInputFormat(3, amendDataPhone.transactionPassword)"
              />
              <!--错误提示-->
              <ErrorBox
                :text="tieErrorShowStatusList[3]"
                :isShow="!!tieErrorShowStatusList[3]"
              />
            </el-form-item>
            <button
              class="phone-button border-radius4 cursor-pointer"
              @click.prevent="stateTieStatusSubmit"
            >
              <!--确认换绑-->
              {{ $t('M.comm_affirm') }}{{ $t('M.user_security_in_tie') }}
            </button>
          </el-form>
        </div>
      </div>
    </div>
    <keep-aline><FooterCommon/></keep-aline>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
// 头部
import HeaderCommon from '../../Common/HeaderCommonForPC'
import IconFontCommon from '../../Common/IconFontCommon'
import ErrorBox from '../../User/ErrorBox'
// 底部
import FooterCommon from '../../Common/FooterCommon'
import { createNamespacedHelpers, mapState } from 'vuex'
import ImageValidate from '../../Common/ImageValidateCommon' // 图片验证吗
import CountDownButton from '../../Common/CountDownCommon'
import {
  returnAjaxMessage, // 接口返回信息
  sendPhoneOrEmailCodeAjax,
  validateNumForUserInput,
  getSecurityCenter
} from '../../../utils/commonFunc'
import {
  bindPhoneAddress,
  changeMobilePhone
} from '../../../utils/api/personal'
import {checkUserExist} from '../../../utils/api/user'
const { mapMutations } = createNamespacedHelpers('personal')
export default {
  components: {
    HeaderCommon, // 头部
    IconFontCommon, // 字体图标
    ImageValidate, // 图片验证吗
    ErrorBox, // 错误提示信息
    CountDownButton, // 短信倒计时
    FooterCommon // 底部
  },
  data () {
    return {
      securityCenter: {}, // 个人信息
      errorMsg: '', // 错误信息提示
      bindingDataPhone: {
        bindingAreaCodeValue: '86',
        bindingAreaCodeList: [],
        bindingNewPhoneAccounts: '', // 手机号
        identifyCode: '1235', // 图片验证码
        userInputImageCode: '', // 用户输入的图片验证码
        bindingNewPhoneCode: '' // 新手机验证码
      },
      errorShowStatusList: [
        '', // 手机号码
        '', // 图片验证码
        '' // 短信验证码
      ],
      amendDataPhone: {
        newPhoneAccounts: '', // 手机号
        oldPhoneCode: '', // 旧手机验证码
        defaultAreaCode: '',
        areaCode: '', // 区号
        newPhoneCode: '', // 新手机验证码
        transactionPassword: '', // 交易密码
        areaCodeValue: '86',
        areaCodeList: []
      },
      tieErrorShowStatusList: [
        '', // 旧短信验证码
        '', // 新手机号码
        '', // 短信验证码
        '' // 交易密码
      ],
      successCountDown: 1, // 成功倒计时
      newPhoneIsExistStatus: false // 新手机号是否已注册过
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/UserSecuritySettings/UserSecurePhone.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/UserSecuritySettings/UserSecurePhoneDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/UserSecuritySettings/UserSecurePhoneNight.css')
    this.getSecurityCenter()
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_USER_CENTER_ACTIVE_NAME',
      'CHANGE_REF_SECURITY_CENTER_INFO'
    ]),
    // 点击返回上个页面
    returnSuperior () {
      this.CHANGE_REF_SECURITY_CENTER_INFO(true)
      this.CHANGE_USER_CENTER_ACTIVE_NAME('security-center')
      this.$router.push({path: '/PersonalCenter'})
    },
    // 4位随机数
    getRandomNum () {
      return parseInt(Math.random() * 10000) + ''
    },
    // 刷新验证码
    refreshCode () {
      this.bindingDataPhone.identifyCode = this.getRandomNum()
    },
    // 发送验证码
    async sendPhoneOrEmailCode (loginType, val, type) {
      // type: 0 新手机发验证码，1： 当前手机
      if (!type && this.newPhoneIsExistStatus) {
        // this.checkUserExistAjax()
        this.$message({
          type: 'error',
          message: this.$t('M.user-fail-reg-phone-exist')
        })
        return false
      }
      if (this.disabledOfPhoneBtn || this.disabledOfEmailBtn) {
        return false
      }
      let params = {
        type: 'VERIFICATION_CODE', // 类型
        country: this.bindingDataPhone.bindingAreaCodeValue // 国家编码
      }
      if (!this.securityCenter.isPhoneBind) {
        console.log(2)
        switch (loginType) {
          // 当是绑定手机时给收入新手机号发验证码
          case 0:
            params.phone = this.bindingDataPhone.bindingNewPhoneAccounts
            break
          case 1:
            params.address = this.userInfo.userInfo.email
            break
        }
      } else {
        // console.log(1)
        console.log(loginType)
        switch (loginType) {
          case 0:
            if (val == 1) {
              // 当是换绑手机时给原手机号发验证码
              params.phone = this.userInfo.userInfo.phone
            }
            if (val == 2) {
              if (!this.amendDataPhone.newPhoneAccounts) {
                this.$message({
                  // 请先输入手机号
                  message: this.$t('M.comm_please_enter') + this.$t('M.comm_code_phone1'),
                  type: 'error'
                })
                return false
              }
              // 当是换绑手机时给收入新手机号发验证码
              params.phone = this.amendDataPhone.newPhoneAccounts
            }
            break
          case 1:
            params.address = this.userInfo.userInfo.email
            break
        }
      }
      await sendPhoneOrEmailCodeAjax(loginType, params, (data) => {
        console.log(this.disabledOfPhoneBtn)
        // 提示信息
        if (!returnAjaxMessage(data, this)) {
          console.log('error')
          return false
        } else {
          this.$store.commit('user/SET_USER_BUTTON_STATUS', {
            loginType: 0,
            type,
            status: true
          })
        }
      })
    },
    // 绑定手机检测输入格式
    checkoutInputFormat (type, targetNum) {
      switch (type) {
        // 手机号
        case 0:
          if (!targetNum) {
            // 请输入手机号
            this.setErrorMsg(0, this.$t('M.comm_please_enter') + this.$t('M.user_security_phone') + this.$t('M.comm_mark'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(0, '')
            this.$forceUpdate()
            return 1
          }
        // 图片验证码
        case 1:
          if (!targetNum) {
            // 请输入图片验证码
            this.setErrorMsg(1, this.$t('M.comm_please_enter') + this.$t('M.user_security_picture') + this.$t('M.comm_code'))
            this.$forceUpdate()
            return 0
          } else if (this.bindingDataPhone.userInputImageCode === this.bindingDataPhone.identifyCode) {
            this.setErrorMsg(1, '')
            this.$forceUpdate()
            return 1
          } else {
            // 请输入正确的图片验证码
            this.setErrorMsg(1, this.$t('M.comm_please_enter') + this.$t('M.user_security_correct') + this.$t('M.user_security_picture') + this.$t('M.comm_code'))
            this.$forceUpdate()
            return 0
          }
        // 短信验证码
        case 2:
          if (!targetNum) {
            // 请输入短信验证码
            this.setErrorMsg(2, this.$t('M.comm_please_enter') + this.$t('M.comm_note') + this.$t('M.comm_code'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(2, '')
            this.$forceUpdate()
            return 1
          }
      }
    },
    // 绑定手机设置错误信息
    setErrorMsg (index, msg) {
      this.errorShowStatusList[index] = msg
    },
    // 确定提交绑定手机
    getStatusSubmit () {
      this.confirmBindingBailPhone()
    },
    // 确定绑定
    async confirmBindingBailPhone () {
      let goOnStatus = 0
      if (
        this.checkoutInputFormat(0, this.bindingDataPhone.bindingNewPhoneAccounts) &&
        this.checkoutInputFormat(2, this.bindingDataPhone.bindingNewPhoneCode)
      ) {
        goOnStatus = 1
      } else {
        goOnStatus = 0
      }
      if (goOnStatus) {
        let data
        let param = {
          phone: this.bindingDataPhone.bindingNewPhoneAccounts, // 手机号
          code: this.bindingDataPhone.bindingNewPhoneCode // 手机验证码
        }
        data = await bindPhoneAddress(param)
        if (!(returnAjaxMessage(data, this, 1))) {
          return false
        } else {
          this.successJump()
          console.log(data)
        }
      }
    },
    // 检测用户名是否存在
    async checkUserExistAjax (type, userName, isNewPhone) {
      if (!validateNumForUserInput(type, userName)) {
        let params = {
          userName: userName,
          regType: type
        }
        const data = await checkUserExist(params)
        if (!returnAjaxMessage(data, this)) {
          if (isNewPhone) {
            this.newPhoneIsExistStatus = true
          }
          return false
        }
      } else {
        switch (type) {
          case 'phone':
            if (this.tieCheckoutInputFormat(1, userName)) {
              return false
            }
            if (isNewPhone) {
              this.newPhoneIsExistStatus = false
            }
            break
        }
      }
    },
    // 换绑手机检测输入格式
    tieCheckoutInputFormat (type, targetNum) {
      switch (type) {
        // 旧短信验证码
        case 0:
          if (!targetNum) {
            // 请输入旧手机短信验证码
            this.tieErrorMsg(0, this.$t('M.comm_please_enter') + this.$t('M.user_security_former') + this.$t('M.user_security_phone') + this.$t('M.comm_code'))
            this.$forceUpdate()
            return 0
          } else {
            this.tieErrorMsg(0, '')
            this.$forceUpdate()
            return 1
          }
        // 新手机号码
        case 1:
          switch (validateNumForUserInput('phone', targetNum)) {
            case 0:
              this.tieErrorMsg(1, '')
              this.$forceUpdate()
              return 1
            case 1:
              // console.log(type)
              // 请输入手机号
              this.tieErrorMsg(1, this.$t('M.comm_please_enter') + this.$t('M.user_security_phone') + this.$t('M.comm_mark'))
              this.$forceUpdate()
              return 0
            case 2:
              // 请输入正确的手机号
              this.tieErrorMsg(1, this.$t('M.comm_please_enter') + this.$t('M.user_security_correct') + this.$t('M.user_security_phone') + this.$t('M.comm_mark'))
              this.$forceUpdate()
              return 0
          }
          break
          // if (!targetNum) {
          //   // 请输入手机号
          //   this.tieErrorMsg('phone', this.$t('M.comm_please_enter') + this.$t('M.user_security_phone') + this.$t('M.comm_mark'))
          //   this.$forceUpdate()
          //   return 0
          // } else {
          //   this.tieErrorMsg(1, '')
          //   this.$forceUpdate()
          //   return 1
          // }
        // 新短信验证码
        case 2:
          if (!targetNum) {
            // 请输入新手机短信验证码
            this.tieErrorMsg(2, this.$t('M.comm_please_enter') + this.$t('M.user_security_login_new') + this.$t('M.user_security_phone') + this.$t('M.comm_note') + this.$t('M.comm_code'))
            this.$forceUpdate()
            return 0
          } else {
            this.tieErrorMsg(2, '')
            this.$forceUpdate()
            return 1
          }
        // 交易密码
        case 3:
          if (!targetNum) {
            // 交易密码
            this.tieErrorMsg(3, this.$t('M.comm_password'))
            this.$forceUpdate()
            return 0
          } else {
            this.tieErrorMsg(3, '')
            this.$forceUpdate()
            return 1
          }
      }
    },
    // 换绑手机设置错误信息
    tieErrorMsg (index, msg) {
      this.tieErrorShowStatusList[index] = msg
    },
    stateTieStatusSubmit () {
      this.confirmTiePhone()
    },
    // 确定换绑手机
    async confirmTiePhone () {
      console.log(1)
      let goOnStatus = 0
      if (
        this.tieCheckoutInputFormat(0, this.amendDataPhone.newPhoneAccounts) &&
        this.tieCheckoutInputFormat(1, this.amendDataPhone.oldPhoneCode) &&
        this.tieCheckoutInputFormat(2, this.amendDataPhone.newPhoneCode) &&
        this.tieCheckoutInputFormat(3, this.amendDataPhone.transactionPassword)
      ) {
        goOnStatus = 1
      } else {
        goOnStatus = 0
      }
      if (goOnStatus) {
        let data
        let param = {
          phone: this.amendDataPhone.newPhoneAccounts, // 手机号
          oldCode: this.amendDataPhone.oldPhoneCode, // 旧手机验证码
          newCode: this.amendDataPhone.newPhoneCode, // 新手机验证码
          payPassword: this.amendDataPhone.transactionPassword // 交易密码
        }
        data = await changeMobilePhone(param)
        if (!(returnAjaxMessage(data, this, 1))) {
          return false
        } else {
          this.stateEmptyData()
          this.successJump()
        }
      }
    },
    // 接口请求完成之后清空数据
    stateEmptyData () {
      this.amendDataPhone.newPhoneAccounts = ''
      this.amendDataPhone.oldPhoneCode = ''
      this.amendDataPhone.newPhoneCode = ''
      this.amendDataPhone.transactionPassword = ''
    },
    /**
     * 安全中心
     */
    getSecurityCenter () {
      getSecurityCenter(this, (data) => {
        if (data) {
          this.securityCenter = data.data.data
        }
      })
    },
    // 成功自动跳转
    successJump () {
      setInterval(() => {
        if (this.successCountDown === 0) {
          this.CHANGE_REF_SECURITY_CENTER_INFO(true)
          this.CHANGE_USER_CENTER_ACTIVE_NAME('security-center')
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
      contryAreaList: state => state.common.contryAreaList,
      disabledOfOldPhoneBtn: state => state.user.disabledOfOldPhoneBtn,
      disabledOfPhoneBtn: state => state.user.disabledOfPhoneBtn,
      disabledOfEmailBtn: state => state.user.disabledOfEmailBtn
    })
  },
  watch: {
    contryAreaList (newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal";
  .set-phone {
    >.set-phone-main {
      width: 1100px;
      min-height: 600px;
      margin: 60px auto 100px;
      >.set-phone-header {
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
      >.set-phone-content {
        min-height: 300px;
        margin: 16px 25px;
        >.phone-content-title {
          height: 32px;
          line-height: 32px;
          margin-bottom: 40px;
        }
        >.phone-content-from {
          width: 500px;
          margin-left: 55px;
          .send-code-btn {
            width: 90px;
            /*height: 36px;
            position: absolute;
            top: -1px;*/
          }
          .input {
            width: 180px;
          }
          .phone-input {
            width: 220px;
            height: 34px;
          }
          .phone-image {
            width: 145px;
            border-right: 0 !important;
          }
          .phone-input-left {
            width: 158px;
            margin-top: 4px;
            margin-left: -3px;
            border-left: 0 !important;
          }
          .phone-upload {
            width: 118px;
            height: 106px;
            text-align: center;
            line-height: 100px;
          }
          .phone-button {
            padding: 10px 85px;
            margin: 30px 0 50px 120px;
          }
          .prompt-message {
            height: 20px;
            padding-left: 35px;
          }
        }
      }
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      .set-phone-main {
        background-color: $nightMainBgColor;
        >.set-phone-header {
          border-bottom: 1px solid #39424D;
          >.header-content-left {
            color: (255,255,255,0.7);
          }
          >.header-content-right {
            color: #A9BED4;
          }
        }
        >.set-phone-content {
          >.phone-content-title {
            background:rgba(62,121,214,0.08);
            color: #3E79D6;
          }
          >.phone-content-from {
            .send-code-btn {
              background-color: #338FF5;
              color: #fff;
            }
            .bank-content-name {
              color: rgba(255,255,255,0.7);
            }
            .phone-input {
              border: 1px solid #485776;
              color: rgba(255,255,255,0.7);
              &:focus {
                border: 1px solid #338FF5;
              }
            }
            .phone-input-align {
              margin-left: -3px;
            }
            .image-input {
              height: 35px;
              vertical-align: middle;
            }
            .phone-content-name {
              color: rgba(255,255,255,0.7);
            }
            .phone-upload {
              background-color: #323E48;
              .icon-plus {
                color: #828EA6;
              }
            }
            .phone-button {
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
      .set-phone-main {
        background:rgba(255,255,255,1);
        border:1px solid rgba(246,246,246,1);
        border-radius:4px;
        box-shadow:0px 0px 4px rgba(235,240,248,1);
        >.set-phone-header {
          border-bottom: 1px solid rgba(57,66,77,0.1);
          >.header-content-left {
            color: #333;
          }
          >.header-content-right {
            color: #7D90AC;
          }
        }
        >.set-phone-content {
          >.phone-content-title {
            background:rgba(51,143,245,0.1);
            color: #333;
          }
          >.phone-content-from {
            .send-code-btn {
              background-color: #338FF5;
              color: #fff;
            }
            .phone-input {
              border:1px solid rgba(236,241,248,1);
              color: #333;
              &:focus {
                border: 1px solid #338FF5;
              }
            }
            .phone-upload {
              background-color: #fff;
              .icon-plus {
                color: #555;
              }
            }
            .phone-button {
              background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
              color: #ccc;
            }
          }
        }
      }
    }
  }
</style>
