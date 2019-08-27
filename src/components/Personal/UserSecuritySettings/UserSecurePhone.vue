<template>
  <div
    class="set-phone personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
    :style="{
      height: windowHeight+'px'
    }"
  >
    <div class="set-phone-main margin25">
      <header class="set-phone-header personal-height60 line-height60 line-height70 margin25">
        <span class="header-content-left header-content font-size16 font-weight600">
          <!--绑定手机-->
          {{ !securityCenter.isPhoneBind? $t('M.user_security_binding') + $t('M.user_security_phone') : $t('M.user_modify_phone')}}
          <!--修改手机-->
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
        <div class="phone-content-from">
          <!--绑定手机-->
          <el-form
            v-if="!securityCenter.isPhoneBind"
            label-width="120px"
          >
            <!--手机号码-->
            <el-form-item
              :label="$t('M.user_security_phone') + $t('M.user_security_number') + '：'"
            >
              <el-select
                v-model="bindingDataPhone.bindingAreaCodeValue"
                :no-data-text="$t('M.comm_no_data')"
              >
                <el-option
                  v-for="item in countryAreaList"
                  :key="item.english"
                  :label="item.nationCode"
                  :value="item.nationCode"
                >
                  <span style="float: left;">
                    <span v-show="language==='zh_CN'">
                      {{ item.chinese }}
                    </span>
                    <span v-show="language!=='zh_CN'">
                      {{item.english}}
                    </span>
                  </span>
                  <span style=" float: right;
                    font-size: 13px;
                    color: #8492a6;
                    "
                  >{{ item.nationCode }}
                  </span>
                </el-option>
              </el-select>
              <input
                type="text"
                class="phone-input phone-input-left border-radius2 padding-l15 box-sizing"
                v-model="bindingDataPhone.bindingNewPhoneAccounts"
                @keydown="setErrorMsg(0,'')"
                @focus="resetNewPhoneIsExistStatus"
                @blur="checkUserExistAjax('phone', bindingDataPhone.bindingNewPhoneAccounts,1)"
              >
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[0]"
                :isShow="!!errorShowStatusList[0]"
              />
            </el-form-item>
            <!--图片验证码-->
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
            <!--短信验证码-->
            <el-form-item
              :label="$t('M.comm_note') + $t('M.comm_code') + '：'"
            >
              <el-input
                v-model="bindingDataPhone.bindingNewPhoneCode"
                @keydown="setErrorMsg(2,'')"
                @blur="checkoutInputFormat(2, bindingDataPhone.bindingNewPhoneCode)"
              >
                <template slot="append">
                  <CountDownButton
                    class="send-code-btn cursor-pointer"
                    :status="disabledOfPhoneBtn"
                    @run="sendPhoneOrEmailCode(0)"
                    v-if="this.$route.path === '/SecurePhone'"
                  />
                </template>
              </el-input>
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[2]"
                :isShow="!!errorShowStatusList[2]"
              />
            </el-form-item>
            <!--邮箱验证码-->
            <el-form-item
              :label="this.$t('M.comm_emailbox') + $t('M.comm_code') + '：'"
            >
              <el-input
                v-model="bindingDataPhone.bindingNewEmailCode"
                @keydown="setErrorMsg(3, '')"
                @blur="checkoutInputFormat(3, bindingDataPhone.bindingNewEmailCode)"
              >
                <template slot="append">
                  <CountDownButton
                    class="send-code-btn cursor-pointer"
                    :status="disabledOfEmailBtn"
                    @run="sendPhoneOrEmailCode(1)"
                    v-if="this.$route.path === '/SecurePhone'"
                  />
                </template>
              </el-input>
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[3]"
                :isShow="!!errorShowStatusList[3]"
              />
            </el-form-item>
            <div class="prompt-message">
              <div v-show="errorMsg">{{ errorMsg }}</div>
            </div>
            <div style="width: 405px;">
              <button
                class="phone-button border-radius4 cursor-pointer"
                @click.prevent="getStatusSubmit"
              >
                <!--确认绑定-->
                {{ $t('M.comm_affirm') }}{{ $t('M.user_security_binding') }}
              </button>
              <span
                class="font-size12 cursor-pointer text-align-r hint-color float-right"
                @click.prevent="payPasswordState"
              >
              {{ $t('M.user_payPassword') }}
            </span>
            </div>
          </el-form>
          <!--换绑手机-->
          <el-form
            v-else
            label-width="120px"
          >
            <!--姓名-->
            <el-form-item
              :label="$t('M.comm_name') + '：'"
            >
              <span class="bank-content-name">
                {{ userInfoDetail.realname }}
              </span>
            </el-form-item>
            <!--短信验证码-->
            <el-form-item
              :label="$t('M.comm_note') + $t('M.comm_code') + '：'"
            >
              <el-input
                v-model="amendDataPhone.oldPhoneCode"
                @keydown="tieErrorMsg(0,'')"
                @focus="tieErrorMsg(0,'')"
                @blur="tieCheckoutInputFormat(0, amendDataPhone.oldPhoneCode)"
              >
                <template slot="append">
                  <CountDownButton
                    class="send-code-btn cursor-pointer"
                    :status="disabledOfOldPhoneBtn"
                    @run="sendPhoneOrEmailCode(0, 1, 1)"
                    v-if="this.$route.path === '/SecurePhone'"
                  />
                </template>
              </el-input>
              <!--错误提示-->
              <ErrorBox
                :text="tieErrorShowStatusList[0]"
                :isShow="!!tieErrorShowStatusList[0]"
              />
            </el-form-item>
            <!--新手机号码-->
            <el-form-item
              :label="$t('M.user_security_login_new') + $t('M.user_security_phone') + $t('M.comm_mark') + '：'"
            >
              <el-select
                v-model="amendDataPhone.areaCodeValue"
                :no-data-text="$t('M.comm_no_data')"
              >
                <el-option
                  v-for="item in countryAreaList"
                  :key="item.english"
                  :label="item.nationCode"
                  :value="item.nationCode"
                >
                  <span style="float: left;">
                    <span v-show="language==='zh_CN'">
                      {{ item.chinese }}
                    </span>
                    <span v-show="language!=='zh_CN'">
                      {{item.english}}
                    </span>
                  </span>
                  <span style=" float: right;
                    font-size: 13px;
                    color: #8492a6;
                    "
                  >{{ item.nationCode }}
                  </span>
                </el-option>
              </el-select>
              <input
                type="text"
                class="phone-input phone-input-left border-radius2 padding-l15 box-sizing"
                @keydown="tieErrorMsg(1, '')"
                :ref="phoneNumRef"
                @keyup="phoneNumRegexpInput(phoneNumRef)"
                @input="phoneNumRegexpInput(phoneNumRef)"
                @focus="resetNewPhoneIsExistStatus"
              >
              <!--@blur="checkUserExistAjax('phone', amendDataPhone.newPhoneAccounts,'newPhone')"-->
              <!--错误提示-->
              <ErrorBox
                :text="tieErrorShowStatusList[1]"
                :isShow="!!tieErrorShowStatusList[1]"
              />
            </el-form-item>
            <!--短信验证码-->
            <el-form-item
              :label="$t('M.comm_note') + $t('M.comm_code') + '：'"
            >
              <el-input
                v-model="amendDataPhone.newPhoneCode"
                @keydown="tieErrorMsg(2, '')"
                @blur="tieCheckoutInputFormat(2, amendDataPhone.newPhoneCode)"
              >
                <template slot="append">
                  <CountDownButton
                    class="send-code-btn cursor-pointer"
                    :status="disabledOfPhoneBtn"
                    @run="sendPhoneOrEmailCode(0, 2, 0)"
                    v-if="this.$route.path === '/SecurePhone'"
                  />
                </template>
              </el-input>
              <!--错误提示-->
              <ErrorBox
                :text="tieErrorShowStatusList[2]"
                :isShow="!!tieErrorShowStatusList[2]"
              />
            </el-form-item>
            <!--交易密码-->
            <el-form-item
              :label="$t('M.comm_password') + '：'"
            >
              <input
                type="password"
                autocomplete= "new-password"
                class="phone-input border-radius2 padding-l15 box-sizing"
                v-model="amendDataPhone.transactionPassword"
                @keydown="tieErrorMsg(3, '')"
                @blur="tieCheckoutInputFormat(3, amendDataPhone.transactionPassword)"
              />
              <!--错误提示-->
              <ErrorBox
                :text="tieErrorShowStatusList[3]"
                :isShow="!!tieErrorShowStatusList[3]"
              />
            </el-form-item>
            <div style="width: 405px;">
              <button
                class="phone-button border-radius4 cursor-pointer"
                @click.prevent="stateTieStatusSubmit"
              >
                <!--确认换绑-->
                {{ $t('M.comm_affirm') }}{{ $t('M.user_security_in_tie') }}
              </button>
              <span
                class="font-size12 cursor-pointer text-align-r hint-color float-right"
                @click.prevent="payPasswordState"
              >
                {{ $t('M.user_payPassword') }}
              </span>
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
import ImageValidate from '../../Common/ImageValidateCommon' // 图片验证吗
import CountDownButton from '../../Common/CountDownCommon'
import {
  returnAjaxMsg, // 接口返回信息
  sendPhoneOrEmailCodeAjax,
  validateNumForUserInput,
  getSecurityCenter,
  getNestedData
} from '../../../utils/commonFunc'
import {
  bindPhoneAddress,
  changeMobilePhone
} from '../../../utils/api/personal'
import {phoneNumRegexpInput} from '../../../utils'
import {checkUserExist} from '../../../utils/api/user'
import {
  mapMutations,
  mapState,
  mapActions
} from 'vuex'
export default {
  components: {
    IconFontCommon, // 字体图标
    ImageValidate, // 图片验证吗
    ErrorBox, // 错误提示信息
    CountDownButton // 短信倒计时
  },
  data () {
    return {
      phoneNumRef: 'phone-num-ref',
      securityCenter: {}, // 个人信息
      errorMsg: '', // 错误信息提示
      bindingDataPhone: {
        bindingAreaCodeValue: '86',
        bindingNewPhoneAccounts: '', // 手机号
        identifyCode: '', // 图片验证码
        userInputImageCode: '', // 用户输入的图片验证码
        bindingNewPhoneCode: '', // 新手机验证码
        bindingNewEmailCode: '' // 邮箱验证码
      },
      errorShowStatusList: [
        '', // 手机号码
        '', // 图片验证码
        '', // 短信验证码
        '' // 邮箱验证码
      ],
      amendDataPhone: {
        newPhoneAccounts: '', // 手机号
        oldPhoneCode: '', // 旧手机验证码
        newPhoneCode: '', // 新手机验证码
        transactionPassword: '', // 交易密码
        areaCodeValue: '86' // 新手机国籍码
      },
      tieErrorShowStatusList: [
        '', // 旧短信验证码
        '', // 新手机号码
        '', // 短信验证码
        '' // 交易密码
      ],
      successCountDown: 1, // 成功倒计时
      newPhoneIsExistStatus: false, // 新手机号是否已注册过
      emailBindPhoneCount: 0, // 邮箱绑定手机次数
      userSecurePhoneSuccessJumpTimer: null // 安全手机绑定成功自动跳转定时器
    }
  },
  created () {
    this.getSecurityCenter()
    this.refreshCode()
  },
  // mounted () {},
  // update () {},
  // beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'SET_USER_BUTTON_STATUS',
      'CHANGE_REF_SECURITY_CENTER_INFO',
      'CHANGE_USER_CENTER_ACTIVE_NAME',
      'CHANGE_PASSWORD_USEABLE'
    ]),
    ...mapActions([
      'REFRESH_USER_INFO_ACTION'
    ]),
    // 点击跳转到重置交易密码
    payPasswordState () {
      this.$goToPage('/TransactionPassword')
    },
    phoneNumRegexpInput (ref) {
      let target = this.$refs[ref]
      this.amendDataPhone.newPhoneAccounts = phoneNumRegexpInput(target)
    },
    // 点击返回上个页面
    returnSuperior () {
      this.CHANGE_REF_SECURITY_CENTER_INFO(true)
      this.CHANGE_USER_CENTER_ACTIVE_NAME('security-center')
      this.$goToPage('/PersonalCenter')
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
      console.log(loginType, val, type)
      await this.checkUserExistAjax()
      if (!type && !val && !this.bindingDataPhone.bindingNewPhoneAccounts) {
        this.$message({
          type: 'error',
          message: this.$t('M.comm_please_enter') + this.$t('M.comm_code_phone1')
        })
        return false
      } else if (!type && !val && this.bindingDataPhone.bindingNewPhoneAccounts) {
        // console.log(1)
        // console.log(this.checkoutInputFormat(0, this.bindingDataPhone.bindingNewPhoneAccounts))
        if (!this.checkoutInputFormat(0, this.bindingDataPhone.bindingNewPhoneAccounts)) {
          return false
        }
      }
      // 绑定手机号
      if ((!loginType && !val && !type)) {
        // console.log(this.bindingDataPhone.bindingNewPhoneCode)
        if (!this.emailBindPhoneCount) {
          let data = await this.checkUserExistAjax('phone', this.bindingDataPhone.bindingNewPhoneAccounts)
          this.emailBindPhoneCount++
          // console.log(data)
          if (!data) {
            this.emailBindPhoneCount = 0
            return false
          }
        }
      }
      if ((!loginType && val && !type)) {
        if (!this.emailBindPhoneCount) {
          let data = await this.checkUserExistAjax('phone', this.amendDataPhone.newPhoneAccounts)
          this.emailBindPhoneCount++
          // console.log(data)
          if (!data) {
            this.emailBindPhoneCount = 0
            return false
          }
        }
      }

      // type: 0 新手机发验证码，1： 当前手机
      if (!type && this.newPhoneIsExistStatus) {
        this.$message({
          type: 'error',
          message: this.$t('M.user-fail-reg-phone-exist')
        })
        return false
      }
      // console.log(type)
      if (!type) {
        if (this.disabledOfPhoneBtn || this.disabledOfEmailBtn) {
          return false
        }
      } else {
        if (this.disabledOfOldPhoneBtn || this.disabledOfEmailBtn) {
          return false
        }
      }
      let params = {}
      if (!type) {
        params.nationCode = this.amendDataPhone.areaCodeValue
      } else {
        params.userId = this.userInfo.userId
      }
      if (!this.securityCenter.isPhoneBind) {
        // console.log(2)
        switch (loginType) {
          // 当是绑定手机时给收入新手机号发验证码
          case 0:
            params.phone = this.bindingDataPhone.bindingNewPhoneAccounts
            // params.nationCode =
            break
          case 1:
            params.email = this.userInfoDetail.email
            params.userId = this.userInfo.userId
            break
        }
      } else {
        // console.log(loginType)
        switch (loginType) {
          case 0:
            if (val == 1) {
              // 当是换绑手机时给原手机号发验证码
              params.phone = this.userInfoDetail.phone
            }
            if (val == 2) {
              if (!this.amendDataPhone.newPhoneAccounts) {
                this.$message({
                  // 请先输入手机号
                  message: this.$t('M.user_please_input13'),
                  type: 'error'
                })
                return false
              }
              // 当是换绑手机时给收入新手机号发验证码
              params.phone = this.amendDataPhone.newPhoneAccounts
            }
            break
          case 1:
            params.email = this.userInfoDetail.email
            break
        }
      }
      await sendPhoneOrEmailCodeAjax(loginType, params, this, type)
    },
    // 绑定手机检测输入格式
    checkoutInputFormat (type, targetNum) {
      switch (type) {
        // 手机号
        case 0:
          // console.log(validateNumForUserInput('phone', targetNum))
          switch (validateNumForUserInput('phone', targetNum)) {
            case 0:
              this.setErrorMsg(0, '')
              this.$forceUpdate()
              return 1
            case 1:
              // 请输入手机号
              this.setErrorMsg(0, this.$t('M.user_modify_input_phone'))
              this.$forceUpdate()
              return 0
            case 2:
              this.setErrorMsg(0, '您输入的手机号格式不正确')
              this.$forceUpdate()
              return 0
          }
          break
        // 图片验证码
        case 1:
          if (!targetNum) {
            // 请输入图片验证码
            this.setErrorMsg(1, this.$t('M.user_please_input14'))
            this.$forceUpdate()
            return 0
          } else if (this.bindingDataPhone.userInputImageCode === this.bindingDataPhone.identifyCode) {
            this.setErrorMsg(1, '')
            this.$forceUpdate()
            return 1
          } else {
            // 请输入正确的图片验证码
            this.setErrorMsg(1, this.$t('M.user_please_input15'))
            this.$forceUpdate()
            return 0
          }
        // 短信验证码
        case 2:
          // console.log(targetNum)
          if (!targetNum) {
            // 请输入短信验证码
            this.setErrorMsg(2, this.$t('M.login_please_input1'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(2, '')
            this.$forceUpdate()
            return 1
          }
        // 邮箱验证码
        case 3:
          if (!targetNum) {
            // console.log(type)
            // 请输入邮箱验证码
            this.setErrorMsg(3, this.$t('M.login_please_input2'))
            this.$forceUpdate()
            return 0
          } else {
            console.log(type)
            this.setErrorMsg(3, '')
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
      // console.log(this.newPhoneIsExistStatus)
      if (this.newPhoneIsExistStatus) {
        this.$message({
          type: 'error',
          message: this.$t('M.user-fail-reg-phone-exist')
        })
        return false
      }
      let goOnStatus = 0
      if (
        this.checkoutInputFormat(0, this.bindingDataPhone.bindingNewPhoneAccounts) &&
        this.checkoutInputFormat(1, this.bindingDataPhone.userInputImageCode) &&
        this.checkoutInputFormat(2, this.bindingDataPhone.bindingNewPhoneCode) &&
        this.checkoutInputFormat(3, this.bindingDataPhone.bindingNewEmailCode)
      ) {
        goOnStatus = 1
      } else {
        goOnStatus = 0
      }
      if (goOnStatus) {
        let data
        let param = {
          phone: this.bindingDataPhone.bindingNewPhoneAccounts, // 手机号
          phoneCode: this.bindingDataPhone.bindingNewPhoneCode, // 手机验证码
          emailCode: this.bindingDataPhone.bindingNewEmailCode // 邮箱验证码
        }
        data = await bindPhoneAddress(param)
        if (!data) return false
        this.successJump()
        // console.log(data)
      }
    },
    // 检测用户名是否存在
    async checkUserExistAjax (type, userName, isNewPhone) {
      // console.log(userName)
      if (!validateNumForUserInput(type, userName)) {
        let params = {
          userName: userName,
          regType: type
        }
        const data = await checkUserExist(params)
        // console.log(this.emailBindPhoneCount)
        if (!returnAjaxMsg(data, this)) {
          if (isNewPhone) {
            this.newPhoneIsExistStatus = true
          }
          this.emailBindPhoneCount = 0
          return 0
        } else {
          return 1
        }
      } else {
        // console.log(userName)
        // console.log(type)
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
    resetNewPhoneIsExistStatus () {
      this.newPhoneIsExistStatus = false
    },
    // 换绑手机检测输入格式
    tieCheckoutInputFormat (type, targetNum) {
      switch (type) {
        // 旧短信验证码
        case 0:
          if (!targetNum) {
            // 请输入旧手机短信验证码
            this.tieErrorMsg(0, this.$t('M.user_please_input16'))
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
              this.tieErrorMsg(1, this.$t('M.user_modify_input_phone'))
              this.$forceUpdate()
              return 0
            case 2:
              // 请输入正确的手机号
              this.tieErrorMsg(1, this.$t('M.user_please_input17'))
              this.$forceUpdate()
              return 0
          }
          break
        // 新短信验证码
        case 2:
          if (!targetNum) {
            // 请输入新手机短信验证码
            this.tieErrorMsg(2, this.$t('M.user_please_input18'))
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
      if (this.newPhoneIsExistStatus) {
        // 手机号已被注册
        this.$message({
          type: 'error',
          message: this.$t('M.user-fail-reg-phone-exist')
        })
        return false
      }
      console.log(this.userInfo)
      if (!this.userInfoDetail.payPassword) {
        this.$message({
          message: this.$t('M.otc_index_js3'), // 请先设置交易密码
          type: 'error'
        })
        return false
      }
      console.log(this.amendDataPhone.newPhoneAccounts)
      let goOnStatus = 0
      if (
        this.tieCheckoutInputFormat(1, this.amendDataPhone.newPhoneAccounts) &&
        this.tieCheckoutInputFormat(0, this.amendDataPhone.oldPhoneCode) &&
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
        // 判断是否交易密码锁定
        await this.REFRESH_USER_INFO_ACTION()
        let isPaypasswordLocked = getNestedData(this.loginStep1Info, 'payPasswordRemainCount') ? false : true
        this.CHANGE_PASSWORD_USEABLE(isPaypasswordLocked)
        if (this.isLockedPayPassword) return false
        data = await changeMobilePhone(param)
        if (!data) return false
        this.stateEmptyData()
        this.successJump()
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
      getSecurityCenter(this, {}, data => {
        if (data) {
          this.securityCenter = getNestedData(data, 'data.data')
        }
      })
    },
    // 成功自动跳转
    successJump () {
      this.userSecurePhoneSuccessJumpTimer = setInterval(() => {
        if (this.successCountDown === 0) {
          this.returnSuperior()
        }
        this.successCountDown--
      }, 1000)
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language,
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      userInfoDetail: state => state.user.loginStep1Info.userInfo,
      countryAreaList: state => state.common.countryAreaList,
      disabledOfOldPhoneBtn: state => state.user.disabledOfOldPhoneBtn,
      disabledOfPhoneBtn: state => state.user.disabledOfPhoneBtn,
      disabledOfEmailBtn: state => state.user.disabledOfEmailBtn,
      loginStep1Info: state => state.user.loginStep1Info,
      // 交易密码是否被锁定
      isLockedPayPassword: state => state.common.isLockedPayPassword
    }),
    windowHeight () {
      return window.innerHeight
    }
  },
  watch: {
  },
  destroyed () {
    // 离开本组件清除定时器
    if (this.userSecurePhoneSuccessJumpTimer) {
      clearInterval(this.userSecurePhoneSuccessJumpTimer)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../../assets/CSS/index';

  .set-phone {
    margin-top: 50px;
    overflow: hidden;

    > .set-phone-main {
      width: 1300px;
      min-height: 700px;
      margin: 60px auto 100px;

      > .set-phone-header {
        display: flex;

        > .header-content-right,
        .header-content-left {
          flex: 1;
        }

        > .header-content-right {
          text-align: right;
        }

        > .header-content-left {
          font-weight: 600;
          text-align: left;
        }
      }

      > .set-phone-content {
        min-height: 300px;
        margin: 16px 25px;

        > .phone-content-title {
          height: 32px;
          margin-bottom: 40px;
          line-height: 32px;
        }

        > .phone-content-from {
          width: 500px;
          margin: 58px auto;

          .send-code-btn {
            width: 90px;
            height: 36px;
          }

          .input {
            width: 180px;
          }

          .phone-input {
            width: 220px;
            height: 34px;
          }

          .phone-input-align {
            height: 44px;
            margin-left: -3px;
            vertical-align: middle;
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
            line-height: 100px;
            text-align: center;
          }

          .phone-button {
            width: 220px;
            padding: 10px 0;
            margin: 10px 0 10px 180px;
          }

          .prompt-message {
            height: 20px;
            padding-left: 35px;
          }
        }
      }
    }

    /deep/ {
      /* 覆盖Element样式 */
      .el-form-item__content {
        width: 650px;
      }

      .el-input__inner {
        width: 130px;
        height: 36px;
        border-radius: 2px 0 0 2px;
      }

      .el-input-group {
        width: 220px;
        margin-right: 0;
        border-radius: 4px;
      }

      .el-input-group__append {
        padding: 1px 0 0;
        border-left: 0;
        border-radius: 0 4px 4px 0;
        cursor: pointer;
      }

      .el-input-group__prepend {
        padding: 0 25px;
      }

      .el-form-item {
        margin-bottom: 15px;
      }

      .el-select {
        .el-input__inner {
          width: 63px;
          height: 34px;
          padding: 0 7px;
        }
      }

      .el-form-item__label {
        width: 180px !important;
      }
    }

    &.night {
      color: $nightFontColor;
      background-color: $mainNightBgColor;

      .set-phone-main {
        background-color: $mainContentNightBgColor;

        > .set-phone-header {
          border-bottom: 1px solid #39424d;

          > .header-content-left {
            color: rgba(255, 255, 255, 1);
          }

          > .header-content-right {
            color: #a9bed4;
          }
        }

        > .set-phone-content {
          > .phone-content-title {
            color: #3e79d6;
            background: rgba(62, 121, 214, .08);
          }

          > .phone-content-from {
            .send-code-btn {
              color: #fff;
              background-color: #338ff5;
            }

            .bank-content-name {
              color: rgba(255, 255, 255, .7);
            }

            .phone-input {
              border: 1px solid #485776;
              color: rgba(255, 255, 255, .7);

              &:focus {
                border: 1px solid #338ff5;
              }
            }

            .image-input {
              height: 35px;
              vertical-align: middle;
            }

            .phone-content-name {
              color: rgba(255, 255, 255, .7);
            }

            .phone-upload {
              background-color: #323e48;

              .icon-plus {
                color: #828ea6;
              }
            }

            .phone-button {
              color: rgba(255, 255, 255, 1);
              background: linear-gradient(90deg, rgba(106, 182, 244, 1) 0%, rgba(49, 135, 218, 1) 100%);
            }
          }
        }
      }

      /deep/ {
        .el-input__inner {
          border: 1px solid #485776;
          background-color: transparent;

          &:focus {
            border: 1px solid #338ff5;
          }
        }

        .el-input-group__append {
          width: 100%;
          border: none;
          background-color: #338ff5;
        }

        .el-form-item__label {
          color: #a9bed4;
        }
      }
    }

    &.day {
      color: $dayMainTitleColor;

      .set-phone-main {
        border: 1px solid rgba(246, 246, 246, 1);
        border-radius: 4px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 0 4px rgba(235, 240, 248, 1);

        > .set-phone-header {
          border-bottom: 1px solid rgba(57, 66, 77, .1);

          > .header-content-left {
            color: #333;
          }

          > .header-content-right {
            color: #7d90ac;
          }
        }

        > .set-phone-content {
          > .phone-content-title {
            color: #333;
            background: rgba(51, 143, 245, .1);
          }

          > .phone-content-from {
            .send-code-btn {
              color: #fff;
              background-color: #338ff5;
            }

            .phone-input {
              border: 1px solid rgba(236, 241, 248, 1);
              color: #333;

              &:focus {
                border: 1px solid #338ff5;
              }
            }

            .phone-upload {
              background-color: #fff;

              .icon-plus {
                color: #555;
              }
            }

            .phone-button {
              color: #fff;
              background: linear-gradient(90deg, rgba(106, 182, 244, 1) 0%, rgba(49, 135, 218, 1) 100%);
            }
          }
        }
      }

      /deep/ {
        .el-input__inner {
          border: 1px solid #ecf1f8;
          background-color: transparent;

          &:focus {
            border: 1px solid #338ff5;
          }
        }

        .el-input-group__append {
          border: none;
          background-color: #338ff5;
        }

        .el-form-item__label {
          color: #7d90ac;
        }
      }
    }
  }
</style>
