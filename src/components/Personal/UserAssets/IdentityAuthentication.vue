<template>
  <div
    class="identity-authentication personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="identity-header-background personal-height40 line-height40">
      <span class="padding-left23 header-content font-size16">
        <!--身份认证-->
        {{ $t('M.user_identity') }}
      </span>
    </header>
    <div class="identity-authentication-main margin-top9">
      <!--实名认证-->
      <div class="real-name-authentication identity-background">
        <!--(1.姓名、2.身份证号、3.状态)-->
          <div
            class="advanced-main-header"
          >
            <div class="header-border display-flex margin20">
              <span class="font-size16 main-header-title">
                <!--实名认证-->
                {{ $t('M.user_real_name') }}
              </span>
              <p
                v-if="userInfo.userInfo.realname === ''"
                class="authentication-type font-size12"
              >
                （{{ $t('M.user_real_info') }}）
              </p>
              <p
                v-else
                class="authentication-type-info font-size12 box-sizing"
              >
                （
                <span class="authentication-info">
                  <!--您已通过实名认证-->
                  {{ $t('M.user_real_already') }} {{ $t('M.user_real_name') }}
                </span>
                <span
                  class="type-info"
                >
                  <!--姓名：-->
                  {{ $t('M.comm_name') }}：
                  {{ userInfo.userInfo.realname }}
                </span>、
                <span class="type-info">
                  <!--身份证号：-->
                  {{ $t('M.comm_id_number') }}：
                   {{ userInfo.userInfo.cardNo.substring(0,2)}}
                  ****
                   {{ userInfo.userInfo.cardNo.substring(16,18)}}
                </span>
                &nbsp;）
              </p>
              <!--<i class="el-icon-arrow-down icon-down float-right"></i>-->
            </div>
          </div>
      </div>
      <div
        v-if="userInfo.userInfo.realname === ''"
        class="name-authentication-content margin-top9"
      >
        <el-form
          ref="form"
          label-width="80px"
        >
          <!--地区国家 证件类型 真实姓名 证件号码-->
          <el-form-item
            :label="$t('M.user_real_region')"
          >
            <el-select
              v-model="regionValue"
              @change="changeId"
            >
              <el-option
                v-for="(item, index) in contryAreaList"
                :key="index"
                :label="item.chinese"
                :value="item.chinese"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('M.user_real_certificate_type')"
          >
            <!--请选择证件类型-->
            <el-select
              v-model="documentTypeValue"
              :placeholder="$t('M.comm_please_choose') + $t('M.user_real_certificate_type')"
            >
              <el-option
                v-for="(item, index) in documentTypeList"
                :key="index"
                :label="item.certificateName"
                :value="item.certificateName"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('M.user_real_real')"
          >
            <input
              class="common-input"
              v-model="realName"
              @keydown="setErrorMsg(0, '')"
              @blur="checkoutInputFormat(0, realName)"
            />
            <!--错误提示-->
            <ErrorBox
              :text="errorShowStatusList[0]"
              :isShow="!!errorShowStatusList[0]"
            />
          </el-form-item>
          <el-form-item
            :label="$t('M.comm_credentials_number')"
          >
            <input
              class="common-input"
              v-model="identificationNumber"
              @keydown="setErrorMsg(1, '')"
              minlength="15"
              @blur="checkoutInputFormat(1, identificationNumber)"
            />
            <!--错误提示-->
            <ErrorBox
              :text="errorShowStatusList[1]"
              :isShow="!!errorShowStatusList[1]"
            />
          </el-form-item>
          <div
            v-show="errorMsg"
          >
            {{ errorMsg }}
          </div>
          <el-form-item>
            <button
              class="submit"
              type="button"
              @click.prevent="submitRealName"
            >
              <!--提交认证-->
              {{ $t('M.comm_sub_time') }}{{ $t('M.comm_user_identity_attestation') }}
            </button>
          </el-form-item>
        </el-form>
      </div>
      <div
        v-else
        class="name-authentication-content success-height">
      </div>
    </div>
    <!--高级认证-->
    <div class="advanced-certification-main identity-background margin-top9"
    >
      <div
        class="advanced-main-header"
      >
        <p
          class="header-border paddinglr20"
          @click.prevent="authenticationMethod"
        >
          <span class="font-size16 main-header-title">
            <!--高级认证-->
            {{ $t('M.user_senior_certification') }}
          </span>
          <span
            v-if="userInfo.userInfo.advancedAuth === ''"
            class="authentication-type font-size12"
          >
            <!--未高级认证-->
            （{{ $t('M.comm_not') }}{{ $t('M.user_senior_certification') }}）
          </span>
          <span
            v-if="userInfo.userInfo.advancedAuth === 'pass'"
            class="authentication-type font-size12"
          >
            <!--已通过实名认证-->
            （{{ $t('M.user_real_already') }}{{ $t('M.user_real_name') }}）
          </span>
          <span
            v-if="userInfo.userInfo.advancedAuth === 'waitVeritfy'"
            class="authentication-type font-size12"
          >
            <!--待审核-->
            （{{ $t('M.user_senior_audit') }}）
          </span>
          <span
            class="float-right authentication-type font-size12"
            v-if="userInfo.userInfo.advancedAuth === 'notPass'"
          >
            <!--未通过-->
            {{ $t('M.user_senior_not_pass') }}
          </span>
          <span v-else></span>
        </p>
      </div>
      <div class="identity-box">
        <div v-show="authenticationStatusFront">
          <el-collapse-transition>
            <div class="transition-box">
              <div class="personal-information">
                <!--国籍 姓名 证件号 证件类型-->
                <p class="information">
                  <span class="info-type font-size12">
                    {{ $t('M.comm_nationality') }}：
                  </span>
                  <span class="user-info font-size14">
                    {{ userInfo.userInfo.country }}
                  </span>
                </p>
                <p class="information">
                  <span class="info-type font-size12">
                    {{ $t('M.comm_name') }}：
                  </span>
                  <!--<span v-if="statusRealNameInformation.realname == null"></span>-->
                  <span
                    class="user-info font-size14"
                  >
                    {{ userInfo.userInfo.realname }}
                  </span>
                </p>
                <p class="information">
                  <span class="info-type font-size12">
                    {{ $t('M.comm_credentials_number') }}：
                  </span>
                  <span class="user-info font-size14">
                  <!--  {{ userInfoRefresh.cardNo.substring(0,6)}}
                  ****
                   {{ userInfoRefresh.cardNo.substring(14,18)}}-->
                     {{ userInfo.userInfo.cardNo}}
                  </span>
                </p>
                <p class="information">
                  <span class="info-type font-size12">
                    {{ $t('M.user_real_certificate_type') }}：
                  </span>
                  <span class="user-info font-size14">
                    {{ statusRealNameInformation.cardType }}
                  </span>
                </p>
              </div>
              <div class="advanced-prompt font-size12">
                <!--注意：-->
                <!--1. 照片文件大小不能超过10M！文件格式须为jpg、bmp、png等！-->
                <!--2. 请确保照片无水印，无污渍，身份信息清晰，头像完整，非文字反向照片！照片请勿进行PS处理！-->
                <!--3. 手持身份证照片：需要您本人一只手持您的身份证，另一只手持一张有您手写的fubt.top账号ID的白纸。确保身份证和白纸在您的胸前，不遮挡您的脸部，并且身份证和白纸上的信息清晰可见！-->
                <!--以下图片仅作为示例，请提交您本人的身份材料照片。照片勿进行PS处理！-->
                <p class="icon-font-color">
                  <IconFontCommon
                    class="font-size26"
                    iconName="icon-zhuyi"
                  />
                  <span class="font-size14 vertical-align">
                    {{ $t('M.user_senior_text1') }}
                  </span>
                </p>
                <p class="text-hints">1. {{ $t('M.user_senior_text2') }}</p>
                <p class="text-hints">2. {{ $t('M.user_senior_text3') }}</p>
                <p class="text-hints">3. {{ $t('M.user_senior_text4') }}</p>
                <p class="text-hints margin-top30">{{ $t('M.user_senior_text5') }}</p>
              </div>
              <div class="advanced-upload">
                <div class="upload">
                  <!-- 上传身份证正面 -->
                  <div class="default-center">
                    <el-upload
                      ref='firstUpload'
                      :action="apiCommonUrl+'uploadfile'"
                      :headers="tokenObj"
                      list-type="picture-card"
                      :on-success="handleSuccessFront"
                      :on-remove="handleRemoveFront"
                      :before-upload="beforeAvatarUpload"
                    >
                      <div
                        class="picture"
                        v-show="firstPictureSrcShow"
                      >
                        <img
                          class="default-picture cursor-pointer"
                          :src="firstPictureSrc"
                        >
                      </div>
                      <button ref="first-submit"></button>
                    </el-upload>
                  </div>
                  <button
                    type="primary"
                    class="upload-submit cursor-pointer font-size12 margin-top30"
                    @click="uploadImg('first-submit')"
                  >
                    <!--@click.prevent="handleSuccessFront"-->
                    <!--上传身份证正面-->
                    {{ $t('M.user_senior_upload1') }}
                  </button>
                </div>
                <div class="upload">
                  <!-- 上传身份证反面 -->
                  <div class="default-center">
                    <el-upload
                      ref='secondUpload'
                      :action="apiCommonUrl+'uploadfile'"
                      :headers="tokenObj"
                      list-type="picture-card"
                      :on-success="handleSuccessReverseSide"
                      :on-remove="handleRemoveSide"
                      :before-upload="beforeAvatarUpload"
                    >
                      <div
                        class="picture"
                        v-show="secondPictureSrcShow"
                      >
                        <img
                          class="default-picture cursor-pointer"
                          :src="secondPictureSrc"
                        >
                      </div>
                      <button ref="second-submit"></button>
                    </el-upload>
                  </div>
                  <button
                    type="primary"
                    class="upload-submit cursor-pointer font-size12 margin-top30"
                    @click="uploadImg('second-submit')"
                  >
                    <!--上传身份证反面-->
                    {{ $t('M.user_senior_upload2') }}
                  </button>
                </div>
                <div class="upload">
                  <!-- 上传手持身份证 -->
                  <div class="default-center">
                    <el-upload
                      ref='thirdUpload'
                      :action="apiCommonUrl+'uploadfile'"
                      :headers="tokenObj"
                      list-type="picture-card"
                      :on-success="handleSuccessHand"
                      :on-remove="handleRemoveHand"
                      :before-upload="beforeAvatarUpload"
                    >
                      <div
                        class="picture"
                        v-show="thirdPictureSrcShow"
                      >
                        <img
                          class="default-picture cursor-pointer"
                          :src="thirdPictureSrc"
                        >
                      </div>
                      <button ref="third-submit"></button>
                    </el-upload>
                  </div>
                  <button
                    type="primary"
                    class="upload-submit cursor-pointer font-size12 margin-top30"
                    @click="uploadImg('third-submit')"
                  >
                    <!--上传手持身份证-->
                    {{ $t('M.user_senior_upload3') }}
                  </button>
                </div>
              </div>
              <div class="upload-button">
                <div
                  class = "false-tips fz14 tl mt-5"
                  v-show = "errorMsg"
                >
                  <i></i>
                  {{ errorMsg }}
                </div>
                <!--提交按钮-->
                <button
                  class="submit-information font-size16 cursor-pointer"
                  @click.prevent="stateSubmitSeniorCertification"
                >
                  <!--确认提交-->
                  {{ $t('M.comm_confirm') }}{{ $t('M.comm_sub_time') }}
                </button>
              </div>
            </div>
          </el-collapse-transition>
        </div>
        <div
          class="wait-veritfy-back"
          v-if="userInfoRefresh.advancedAuth === 'waitVeritfy'"
        >
          <div class="wait-veritfy text-align-c">
            <IconFontCommon
              class="font-size60 color-coin"
              iconName="icon-daishenhe"
            />
            <p class="list-height">
              <!--待审核...-->
              {{ $t('M.user_senior_audit') }}...
            </p>
          </div>
        </div>
        <div
          class="wait-veritfy-back wait-no-pass"
          v-show="authenticationNotPass"
        >
          <div
            class="wait-veritfy text-align-c"
          >
            <IconFontCommon
              class="color-coin-text"
              iconName="icon-yly_renzhengshibai"
            />
            <p class="list-height no-pass">
              <!--抱歉，您的高级认证未通过！...-->
              {{ $t('M.user_senior_notPass') }}
            </p>
            <p class="list-height font-size12">
              <!--驳回原因-->
              {{ $t('M.user_senior_notPass_text1') }}：
              <span
                class="no-error"
              >
                {{ statusRealNameInformation.reason }}
              </span>
            </p>
            <button
              class="no-pass-button cursor-pointer"
              @click.prevent="authenticationNoPass"
            >
              <!--提交-->
              {{ $t('M.comm_sub_time') }}
            </button>
          </div>
        </div>
        <div
          class="success-after name-authentication-content"
          v-if="authenticationInfo.userIdentity"
        ></div>
      </div>
      <!--高级认证-->
      <!--请准备好您本人身份证使用浏览器扫码进行高级认证如二维码过 期请刷新重试。-->
      <!--点击刷新-->
      <!--请在浏览器中打开，并升级浏览器至最新版本,无法通过认证的用户，-->
      <!--请点击这里-->
      <el-dialog
        title="高级认证"
        :visible.sync="seniorAuthentication"
        name="1"
        center>
        <div class="advanced-certification-content">
          <img src="../../../assets/user/er.png" alt="">
        </div>
        <div class="advanced-certification-text">
          <p class="text-tips font-size12">
            {{ $t('M.user_senior_hint1') }}
            <a class="tips-refresh">
              {{ $t('M.user_senior_hint2') }}
            </a>
          </p>
          <p class="text-tips font-size12 tips-top">
            {{ $t('M.user_senior_hint3') }}
            <span
              class="tips-refresh cursor-pointer"
              @click.prevent="authenticationAuthentication"
            >
              {{ $t('M.user_senior_hint4') }}
            </span>
          </p>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import ErrorBox from '../../User/ErrorBox'
import IconFontCommon from '../../Common/IconFontCommon'
import {
  queryCountryList,
  submitRealNameAuthentication,
  submitSeniorCertification,
  realNameInformation,
  userRefreshUser
} from '../../../utils/api/personal'
import {
  returnAjaxMessage,
  reflashUserInfo
} from '../../../utils/commonFunc'
import {apiCommonUrl} from '../../../utils/env'
import {createNamespacedHelpers, mapState} from 'vuex'
const {mapMutations} = createNamespacedHelpers('common')
export default {
  components: {
    ErrorBox, // 错误提示接口
    IconFontCommon // 字体图标
  },
  // props,
  data () {
    return {
      tokenObj: {
        'token': ''
      },
      regionValue: '', // 国家
      regionList: [], // 国家地区列表
      documentTypeValue: '身份证', // 证件
      documentTypeList: [
        {
          certificateId: 1,
          certificateName: '身份证'
        },
        {
          certificateId: 2,
          certificateName: '护照'
        }
      ], // 证件类型列表
      waitVeritfy: false, // 待审核
      realName: '', // 真实姓名
      identificationNumber: '', // 证件号码
      errorMsg: '', // 错误信息提示
      seniorAuthentication: false, // 高级认证弹窗默认
      authenticationInfo: {}, // 个人信息
      authenticationContentStatus: false, // 高级认证页面
      authenticationStatusFront: false, // 用户高级认证前
      authenticationNotPass: false, // 用户高级未通过
      // 身份认证默认图片
      firstPictureSrc: require('../../../assets/user/card_negative.png'), // 正面
      firstPictureSrcShow: true,
      secondPictureSrc: require('../../../assets/user/card_positive.png'), // 反面
      secondPictureSrcShow: true,
      thirdPictureSrc: require('../../../assets/user/card_handheld.png'), // 手持
      thirdPictureSrcShow: true,
      dialogImageFrontUrl: '', // 上传身份证正面url
      dialogImageReverseSideUrl: '', // 上传身份证反面url
      dialogVisibleReverseSide: false,
      dialogImageHandUrl: '', // 上传手持身份证url
      dialogVisibleHand: false,
      seniorCertificationList: {},
      realNameInformationObj: {}, //  获取用户实名信息
      userInfoRefresh: {}, //  刷新用户信息
      statusRealNameInformation: {
        cardNo: ''
      },
      errorShowStatusList: [
        '', // 真实姓名
        '' // 证件号码
      ]
    }
  },
  async created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/UserAssets/IdentityAuthentication.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/UserAssets/IdentityAuthenticationDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/UserAssets/IdentityAuthenticationNight.css')
    this.SET_USER_INFO_REFRESH_STATUS(true)
    await this.getUserRefreshUser()
    this.tokenObj.token = this.userInfo.token
    reflashUserInfo(this)
    this.authenticationIsStatus()
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'SET_USER_INFO_REFRESH_STATUS'
    ]),
    uploadImg (ref) {
      this.$refs[ref].click()
    },
    handleSuccessFront (response) {
      console.log(response)
      this.dialogImageFrontUrl = response.data.fileUrl
      this.firstPictureSrcShow = false
    },
    handleSuccessReverseSide (response) {
      console.log(response)
      this.dialogImageReverseSideUrl = response.data.fileUrl
      this.secondPictureSrcShow = false
    },
    handleSuccessHand (response) {
      console.log(response)
      this.dialogImageHandUrl = response.data.fileUrl
      this.thirdPictureSrcShow = false
    },
    handleRemoveFront () {
      this.dialogImageFrontUrl = ''
      this.firstPictureSrcShow = true
    },
    handleRemoveSide () {
      this.dialogImageReverseSideUrl = ''
      this.secondPictureSrcShow = true
    },
    handleRemoveHand () {
      this.dialogImageHandUrl = ''
      this.thirdPictureSrcShow = true
      console.log(this.thirdPictureSrcShow)
    },
    beforeAvatarUpload (file) {
      console.log(file)
      // const isJPG = file.type === 'image/jpeg'
      const isLt10M = file.size
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      if (isLt10M > 102400000) {
        console.log(isLt10M)
        this.$message.error('上传头像图片大小不能超过 10M!')
        return false
      }
    },
    /**
     * 刚进页面时候 国家列表展示
     */
    changeId (e) {
      this.regionList.forEach(item => {
        if (e === item.id) {
          this.regionValue = e
        }
      })
    },
    async getCountryListings () {
      let data = await queryCountryList()
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回列表数据
        this.regionList = data.data.data
        this.regionValue = data.data.data[0].id
        this.regionValue = data.data.data[0].chinese
      }
    },
    /**
    *  刚进页面时候 获取用户实名信息
    */
    async getRealNameInformation () {
      let data = await realNameInformation()
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回列表数据
        this.realNameInformationObj = data.data.data
        // if (data.data.data.authInfo) {
        this.statusRealNameInformation = data.data.data.authInfo
        // }
        this.authenticationIsStatus()
      }
    },
    /**
     *  刷新用户信息
     */
    async getUserRefreshUser () {
      let data = await userRefreshUser({
        token: this.userInfo.token
      })
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        this.$store.commit('user/SET_STEP1_INFO', data.data.data)
        // 返回列表数据
        this.userInfoRefresh = data.data.data.userInfo
        this.authenticationIsStatus()
      }
    },
    // 检测输入格式
    checkoutInputFormat (type, targetNum) {
      console.log(type)
      switch (type) {
        // 真实姓名
        case 0:
          console.log(type)
          if (!targetNum) {
            this.setErrorMsg(0, '请输入真实姓名')
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(0, '')
            this.$forceUpdate()
            return 1
          }
        // 证件号码
        case 1:
          if (!targetNum) {
            this.setErrorMsg(1, '请输入证件号码')
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
    // 提交实名认证
    submitRealName () {
      this.stateSubmitRealName()
    },
    async stateSubmitRealName () {
      let goOnStatus = 0
      if (
        this.checkoutInputFormat(0, this.realName) &&
        this.checkoutInputFormat(1, this.identificationNumber)
      ) {
        goOnStatus = 1
      } else {
        goOnStatus = 0
      }
      if (goOnStatus) {
        let data
        let param = {
          country: this.regionValue, // 国籍
          cardType: this.documentTypeValue, // 证件类型
          realname: this.realName, // 真实姓名
          cardNo: this.identificationNumber // 证件号码
        }
        data = await submitRealNameAuthentication(param)
        if (!(returnAjaxMessage(data, this, 1))) {
          return false
        } else {
          await this.getUserRefreshUser()
          await this.getRealNameInformation()
          console.log(data)
        }
      }
    },
    // 高级认证弹窗
    authenticationMethod () {
      // 判断是否高级认证&&实名认证
      if (this.userInfoRefresh.realname !== '' && this.userInfoRefresh.advancedAuth === 'notPass') {
        this.seniorAuthentication = true
      } else if (this.userInfoRefresh.realname == '') {
        this.seniorAuthentication = false
      }
    },
    // 高级认证未通过被驳回
    authenticationIsStatus () {
      if (this.userInfo.userInfo.advancedAuth === 'notPass') {
        this.authenticationNotPass = true
      }
    },
    authenticationNoPass () {
      this.authenticationStatusFront = true
      this.authenticationNotPass = false
    },
    // 高级认证内容
    authenticationAuthentication () {
      // 点击进入高级认证时隐藏弹窗
      if (!this.realNameInformationObj.advancedAuth) {
        this.authenticationStatusFront = true
      }
      this.seniorAuthentication = false
      this.authenticationContentStatus = true
    },
    // 选择图片文件
    // 确认提交高级认证
    stateSubmitSeniorCertification () {
      this.stateSeniorCertification()
    },
    async stateSeniorCertification () {
      // 请上传身份证正面 请上传身份证反面 请上传身份证反面
      if (this.dialogImageFrontUrl === '') {
        this.$message({
          message: this.$t('M.user_senior_upload1'),
          type: 'error'
        })
        return false
      } else if (this.dialogImageReverseSideUrl === '') {
        this.$message({
          message: this.$t('M.user_senior_upload2'),
          type: 'error'
        })
        return false
      } else if (this.dialogImageHandUrl === '') {
        this.$message({
          message: this.$t('M.user_senior_upload3'),
          type: 'error'
        })
        return false
      } else {
        this.errorMsg = ''
      }
      let data
      let param = {
        idcardFront: this.dialogImageFrontUrl, // 上传身份证正面
        idcardBack: this.dialogImageReverseSideUrl, // 上传身份证反面
        idcardHand: this.dialogImageHandUrl // 上传手持身份证
      }
      data = await submitSeniorCertification(param)
      console.log(data)
      if (!(returnAjaxMessage(data, this, 1))) {
        return false
      } else {
        console.log(1)
        this.SET_USER_INFO_REFRESH_STATUS(true)
        await this.getUserRefreshUser()
        await this.getRealNameInformation()
        this.authenticationStatusFront = false
        this.stateEmptyData()
        this.clearUploadRefValue()
      }
    },
    clearUploadRefValue () {
      this.$refs.firstUpload.clearFiles()
      this.$refs.secondUpload.clearFiles()
      this.$refs.thirdUpload.clearFiles()
      this.handleRemoveFront()
      this.handleRemoveHand()
      this.handleRemoveSide()
      // this.$forceUpdate()
    },
    // 接口请求完成之后清空数据
    stateEmptyData () {
      this.dialogImageFrontUrl = ''
      this.dialogImageReverseSideUrl = ''
      this.dialogImageHandUrl = ''
      // this.$forceUpdate()
    },
    // 检测上传图片大小
    bytesToSize (bytes) {
      if (bytes === 0) return '0 B'
      let k = 1000 // or1024
      let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      let i = Math.floor(Math.log(bytes) / Math.log(k))
      return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      contryAreaList: state => state.common.contryAreaList,
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      userCenterActiveName: state => state.personal.userCenterActiveName
    }),
    apiCommonUrl () {
      return apiCommonUrl
    }
  },
  watch: {
    userCenterActiveName (newVal) {
      if (newVal === 'identity-authentication') {
        this.getRealNameInformation()
        this.SET_USER_INFO_REFRESH_STATUS(true)
        this.getUserRefreshUser()
        // 国家列表展示
        this.getCountryListings()
      }
    }
  }
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal";
.identity-authentication{
  >.identity-authentication-main{
    .name-authentication-content {
      width: 350px;
      padding-top: 28px;
      margin: 0 auto;
      padding-bottom: 25px;
      .common-input,
      .submit {
        width: 270px;
        height: 38px;
        border-radius: 4px;
        padding-left: 20px;
        box-sizing: border-box;
      }
    }
    .authentication-type {
      flex: 4;
      line-height: 56px;
      cursor: pointer;
    }
    .authentication-type-info {
      width: 785px;
      flex: 4;
      line-height: 56px;
      padding-left: 10px;
    }
    .advanced-main-header {
      width: 100%;
      height: 56px;
      .main-header-title{
        line-height: 56px;
      }
      .icon-down{
        font-size: 16px;
        line-height: 56px;
        padding-right: 10px;
      }
    }
  }
  >.advanced-certification-main{
    .name-authentication-content {
      width: 350px;
      padding-top: 28px;
      margin: 0 auto;
      padding-bottom: 25px;
    }
    .header-border {
      height: 50px;
      line-height: 50px;
    }
    .authentication-type {
      line-height: 56px;
      cursor: pointer;
    }
    .advanced-main-header {
      width: 100%;
      height: 56px;
      .icon-down{
        font-size: 16px;
        line-height: 56px;
        padding-right: 10px;
      }
    }
    .advanced-certification-content{
      width: 126px;
      height: 128px;
      margin: 11px auto 47px;
    }
    .advanced-certification-text{
      width: 337px;
      height: 93px;
      margin: 0 auto;
      .tips-top {
        margin-top: 15px;
      }
      .text-tips {
        line-height: 20px;
      }
    }
    .identity-box {
      /*border:1px solid rgba(38,47,56,0.1);*/
      >.wait-no-pass {
        padding-top: 50px !important;
      }
      >.wait-veritfy-back {
        height: 393px;
        padding-top: 130px;
        >.wait-veritfy{
          >.color-coin {
            color: #338FF5;
          }
          .list-height {
            margin-top: 10px;
            line-height: 25px;
          }
          .no-pass-button {
            width:200px;
            height:34px;
            border-radius:4px;
            margin-top: 20px;
          }
        }
      }
    }
    .transition-box{
      >.advanced-upload {
        min-height: 180px;
        margin-top: 62px;
        padding:0 20px;
        .advanced-upload {
          margin: 0 155px;
        }
        .upload,
        .advanced-upload {
          width: 180px;
          float: left;
          margin: 0 55px;
          text-align: center;
        }
        .upload {
          .default-center {
            height: 116px;
            position: relative;
            overflow: hidden;
            >.upload-input {
              display: none;
            }
          }
          .default-picture {
            width: 100%;
            height: 113px;
          }
        }
        .upload-submit {
          border-radius: 3px;
          padding: 8px 14px 9px;
        }
      }
      .upload-button {
        width: 100%;
        text-align: center;
        .submit-information{
          width:200px;
          height:34px;
          line-height: 34px;
          margin: 90px auto 83px;
          border-radius:4px;
        }
        .false-tips {
          height: 20px;
        }
      }
      >.advanced-prompt{
        margin: 20px 138px 0 27px;
        >.text-hints {
          text-align: left;
          line-height: 25px;
        }
        >.icon-font-color {
          height: 30px;
          line-height: 30px;
          >.icon-font {
            width: 18px;
            height: 16px;
          }
          >.vertical-align {
            vertical-align: middle;
          }
        }
      }
      >.personal-information {
        line-height: 30px;
        display: flex;
        padding: 0 24px 0 24px;
        margin-top: 34px;
        >.information{
          flex: 1;
        }
      }
    }
  }
  &.night{
    background-color: $nightBgColor;
    color:$nightFontColor;
    .identity-header-background{
      background-color: #1E2636;
      .header-content{
        color: #338FF5;
      }
    }
    .identity-authentication-main {
      background-color: #1E2636;
      .false-tips {
        color: #D45858;
      }
      .header-border {
        border-bottom: 1px solid #39424D;
      }
      .authentication-type {
        color: #0099FF;
      }
      .authentication-type-info {
        color: #D45858;
        >.authentication-info {
          color: #D45858;
        }
      }
    }
    .icon-down,
    .main-header-title{
      color: #fff;
    }
    .identity-background{
      background-color: #1E2636;
    }
    >.advanced-certification-main{
      .identity-box {
        border:1px solid rgba(38,47,56,0.1);
        >.wait-veritfy-back {
          >.wait-veritfy{
            >.color-coin {
              color: #338FF5;
            }
            .list-height {
              .no-error {
                color: #6F798A;
              }
            }
            >.color-coin-text {
              color: #338FF5;
              font-size: 140px;
            }
            >.no-pass {
              color: #338FF5;
            }
            .no-pass-button {
              background:linear-gradient(90deg,rgba(43,57,110,1) 0%,rgba(42,80,130,1) 100%);
              color: #fff;
            }
          }
        }
      }
      .header-border {
        border-bottom: 1px solid #39424D;
      }
      .authentication-type {
        color: #0099FF;
      }
      .upload-submit{
        border: 1px solid #338FF5;
        color: #338FF5;
      }
      .submit-information {
        background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
        color: #fff;
      }
      .text-hints {
        color: #A9BED4;
      }
      .icon-font-color {
        color: #C65252;
      }
      .info-type {
        color: #617499
      }
      .user-info {;
        color: #fff;
      }
      .advanced-certification-text{
        >.text-tips{
          color:rgba(254,254,255, 0.7);
          >.tips-refresh{
            color: #338FF5;
          }
        }
      }
    }
  }
  &.day{
    background-color: $dayBgColor;
    color:$dayFontColor;
    .identity-header-background{
      background-color: $dayBgColor;
      border:1px solid rgba(38,47,56,0.1);
      border-radius: 2px;
      .header-content{
        color: #338FF5;
      }
    }
    .identity-authentication-main {
      border:1px solid rgba(38,47,56,0.1);
      .name-authentication-content {
        .false-tips {
          color: #D45858;
        }
        .common-input {
          border:1px solid rgba(38,47,56,0.1);
          color: #333;
        }
        .submit {
          color: #fff;
          background:linear-gradient(81deg,rgba(43,57,110,1) 0%,rgba(42,80,130,1) 100%);
        }
      }
      background-color: #fff;
      .header-border {
        padding: 0 20px;
        border-bottom: 1px solid rgba(38,47,56,0.1);
      }
      .authentication-type {
        color: #0099FF;
      }
      .authentication-type-info {
        color: #D45858;
        >.authentication-info {
          color: #D45858;
        }
      }
    }
    .icon-down,
    .main-header-title{
      color: #333;
    }
    .identity-background{
      background-color: #fff;
    }
    >.advanced-certification-main{
      .identity-box {
        border:1px solid rgba(38,47,56,0.1);
        >.wait-veritfy-back {
          >.wait-veritfy{
            >.color-coin {
              color: #338FF5;
            }
            .list-height {
              .no-error {
                color: #333;
              }
            }
            .no-pass-button {
              background:linear-gradient(90deg,rgba(43,57,110,1) 0%,rgba(42,80,130,1) 100%);
              color: #fff;
            }
          }
        }
      }
      .header-border {
        border:1px solid rgba(38,47,56,0.1);
        /*border-bottom: 1px solid #39424D;*/
      }
      .authentication-type {
        color: #0099FF;
      }
      .upload-submit{
        border: 1px solid #338FF5;
        color: #338FF5;
      }
      .submit-information {
        background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
        color: #fff;
      }
      .text-hints {
        color: #666666;
      }
      .icon-font-color {
        color: #C65252;
      }
      .info-type {
        color: #7D90AC;
      }
      .user-info {;
        color: #333;
      }
      .advanced-certification-text{
        >.text-tips{
          color: #333;
          >.tips-refresh{
            color: #338FF5;
          }
        }
      }
    }
  }
}
</style>
