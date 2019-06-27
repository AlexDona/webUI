<!--
  author: zhaoxinlei
  update: 20190615
  description: 当前组件为 身份认证（ 实名认证、高级认证） 组件
-->
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
    <div class="identity-authentication-main ">
      <!--实名认证-->
      <div class="real-name-authentication identity-background">
        <!--(1.姓名、2.身份证号、3.状态)-->
        <div
          class="advanced-main-header"
        >
          <div
            class="header-border display-flex margin20"
            v-if="innerUserInfo"
          >
              <span class="font-size16 main-header-title">
                <!--实名认证-->
                {{ $t('M.user_real_name') }}
              </span>
            <p
              v-if="realNameAuth === 'n'"
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
                  {{ realname }}
                </span>、
              <span class="type-info">
                  <!--证件号码：-->
                  {{ $t('M.comm_credentials_number') }}：
                   {{ innerUserInfo.cardNo.substring(0,2)}}
                  ****
                   {{ innerUserInfo.cardNo.substring(16,18)}}
                </span>
              &nbsp;）
            </p>
            <!--<i class="el-icon-arrow-down icon-down float-right"></i>-->
          </div>
        </div>
      </div>
      <div
        v-if="realNameAuth === 'n'"
        class="name-authentication-content "
      >
        <el-form
          ref="form"
          label-width="140px"
        >
          <!--地区国家 -->
          <el-form-item
            :label="$t('M.user_real_region')"
          >
            <input
              v-if="language === 'zh_CN' || language === 'zh_TW'"
              class="common-input"
              v-model="userInfo.country.chinese"
              disabled
            />
            <input
              v-else
              class="common-input"
              v-model="userInfo.country.english"
              disabled
            />
          </el-form-item>
          <!-- 证件类型 -->
          <el-form-item
            :label="$t('M.user_real_certificate_type')"
          >
            <!--请选择证件类型-->
            <el-select
              v-model="documentTypeValue"
              :no-data-text="$t('M.comm_no_data')"
              :placeholder="$t('M.comm_please_choose') + $t('M.user_real_certificate_type')"
              @change="cardType"
            >
              <el-option
                v-for="(item, index) in documentTypeList"
                :key="index"
                :label="language === 'zh_CN' || language === 'zh_TW'? item.certificateName : item.english"
                :value="item.certificateId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 真实姓名 -->
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
          <!-- 身份证证件号码 -->
          <el-form-item
            v-if="documentTypeValue == 1"
            :label="$t('M.comm_credentials_number')"
          >
            <input
              class="common-input"
              minlength="15"
              :ref="idCardRef"
              @keydown="setErrorMsg(1, '')"
              @blur="checkoutInputFormat(1, identificationNumber)"
              @keyup="idCardRegexpInputNum(idCardRef)"
              @input="idCardRegexpInputNum(idCardRef)"
            />
            <!--错误提示-->
            <ErrorBox
              :text="errorShowStatusList[1]"
              :isShow="!!errorShowStatusList[1]"
            />
          </el-form-item>
          <!--护照证件号码-->
          <el-form-item
            v-else
            :label="$t('M.comm_credentials_number')"
          >
            <input
              class="common-input"
              :ref="passportRef"
              @keydown="setErrorMsg(2, '')"
              @blur="checkoutInputFormat(2, identificationNumber)"
              @keyup="passportEntryRestrictions(passportRef)"
              @input="passportEntryRestrictions(passportRef)"
            />
            <!--错误提示-->
            <ErrorBox
              :text="errorShowStatusList[2]"
              :isShow="!!errorShowStatusList[2]"
            />
          </el-form-item>
          <div
            v-show="errorMessage"
          >
            {{ errorMessage }}
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
    <div class="advanced-certification-main identity-background  margin-bottom10"
    >
      <div
        class="advanced-main-header"
      >
        <!--authenticationMethod // 点击弹出扫码确认框-->
        <p
          class="header-border padding-lr20"
          @click.prevent="authenticationMethod"
        >
          <span class="font-size16 main-header-title">
            <!--高级认证-->
            {{ $t('M.user_senior_certification') }}
          </span>
          <span
            v-if="advancedAuth === ''"
            class="authentication-type font-size12"
          >
            <!--未高级认证-->
            ({{ $t('M.user_advanced_authentication_tips1') }})
          </span>
          <span
            v-if="advancedAuth === 'pass'"
            class="authentication-type font-size12"
          >
            <!--已通过实名认证-->
            （{{ $t('M.user_real_already') }}{{ $t('M.user_senior_certification') }}）
          </span>
          <span
            v-if="advancedAuth === 'waitVeritfy'"
            class="authentication-type font-size12"
          >
            <!--待审核-->
            （{{ $t('M.user_senior_audit') }}）
          </span>
          <span
            class="float-right authentication-type font-size12"
            v-if="advancedAuth === ''"
          >
            <!--去认证-->
            {{ $t('M.user_senior_go_certification') }}
          </span>
          <span v-else></span>
        </p>
      </div>
      <div class="identity-box">
        <div v-if="authenticationStatusFront">
          <el-collapse-transition>
            <div class="transition-box">
              <div class="personal-information">
                <!--国籍   -->
                <p class="information">
                  <span class="info-type font-size12">
                    {{ $t('M.comm_nationality') }}：
                  </span>
                  <span
                    class="user-info font-size14"
                    v-if="language === 'zh_CN' || language === 'zh_TW'"
                  >
                    {{ userInfo.country.chinese }}
                  </span>
                  <span
                    class="user-info font-size14"
                    v-else
                  >
                    {{ userInfo.country.english }}
                  </span>
                </p>
                <!-- 姓名 -->
                <p class="information">
                  <span class="info-type font-size12">
                    {{ $t('M.comm_name') }}：
                  </span>
                  <span
                    class="user-info font-size14"
                  >
                    {{ realname }}
                  </span>
                </p>
                <!-- 证件号 -->
                <p class="information">
                  <span class="info-type font-size12">
                    {{ $t('M.comm_credentials_number') }}：
                  </span>
                  <span class="user-info font-size14">
                     {{ innerUserInfo.cardNo}}
                  </span>
                </p>
                <!-- 证件类型 -->
                <p class="information">
                  <span class="info-type font-size12">
                    {{ $t('M.user_real_certificate_type') }}：
                  </span>
                  <span
                    v-if="statusRealNameInformation.cardType == 1"
                    class="user-info font-size14"
                  >
                    {{ $t('M.user_ID_card') }}
                  </span>
                  <span
                    v-else
                    class="user-info font-size14"
                  >
                    {{ $t('M.user_passport') }}
                  </span>
                </p>
              </div>
              <div class="advanced-prompt font-size12">
                <p class="icon-font-color">
                  <IconFontCommon
                    class="font-size26"
                    iconName="icon-zhuyi"
                  />
                  <!--注意：-->
                  <span class="font-size14 vertical-align">
                    {{ $t('M.user_senior_text1') }}
                  </span>
                </p>
                <!--1. 照片文件大小不能超过10M！文件格式须为jpg、bmp、png等！-->
                <p class="text-hints">1. {{ $t('M.user_senior_text2') }}</p>
                <!--2. 请确保照片无水印，无污渍，身份信息清晰，头像完整，非文字反向照片！照片请勿进行PS处理！-->
                <p class="text-hints">2. {{ $t('M.user_senior_text3') }}</p>
                <!--3. 手持身份证照片：需要您本人一只手持您的身份证，另一只手持一张有您手写的fubt.top账号ID的白纸。确保身份证和白纸在您的胸前，不遮挡您的脸部，并且身份证和白纸上的信息清晰可见！-->
                <p class="text-hints">3. {{ $t('M.user_senior_text4') }} {{configInfo.otcAd}} {{
                  $t('M.user_senior_text6') }}</p>
                <!--以下图片仅作为示例，请提交您本人的身份材料照片。照片勿进行PS处理！-->
                <p class="text-hints margin-top30">{{ $t('M.user_senior_text5') }}</p>
              </div>
              <div class="advanced-upload">
                <div class="upload">
                  <!-- 上传身份证正面 -->
                  <div class="default-center">
                    <div class="img">
                      <!-- 上传手持身份证 -->
                      <input
                        @change="getPicture"
                        type="file"
                        id="fileInput1"
                        ref="fileInput1"
                        class="upload-input"
                        accept="image/jpeg,image/jpg,image/png,image/bmp"
                      />
                      <div
                        class="picture"
                        @click="choosePicture(1)"
                      >
                        <img
                          class="cursor-pointer"
                          :src="firstPictureSrc"
                          v-if="statusRealNameInformation.cardType == 1"
                        >
                        <img
                          v-else
                          class="default-picture cursor-pointer"
                          :src="passportPositiveImg"
                        >
                      </div>
                    </div>
                  </div>
                  <button
                    type="primary"
                    class="upload-submit cursor-pointer font-size12 margin-top30"
                    @click="choosePicture(1)"
                  >
                    <!--@click.prevent="handleSuccessFront"-->
                    <!--上传身份证正面-->
                    {{ $t('M.user_senior_upload1') }}
                  </button>
                </div>
                <div class="upload">
                  <!-- 上传身份证反面 -->
                  <div class="default-center">
                    <div class="img">
                      <input
                        @change="getPicture"
                        type="file"
                        id="fileInput2"
                        ref="fileInput2"
                        class="upload-input"
                        accept="image/jpeg,image/jpg,image/png,image/bmp"
                      />
                      <div
                        class="picture"
                        @click="choosePicture(2)"
                      >
                        <img
                          class="cursor-pointer"
                          :src="secondPictureSrc"
                          v-if="statusRealNameInformation.cardType == 1"
                        >
                        <img
                          class="default-picture cursor-pointer"
                          :src="passportOppositeImg"
                          v-else
                        >
                      </div>
                    </div>
                  </div>
                  <button
                    type="primary"
                    class="upload-submit cursor-pointer font-size12 margin-top30"
                    @click="choosePicture(2)"
                  >
                    <!--上传身份证反面-->
                    {{ $t('M.user_senior_upload2') }}
                  </button>
                </div>
                <div class="upload">
                  <!-- 上传手持身份证 -->
                  <div class="default-center">
                    <div class="img">
                      <input
                        @change="getPicture"
                        type="file"
                        id="fileInput3"
                        ref="fileInput3"
                        class="upload-input"
                        accept="image/jpeg,image/jpg,image/png,image/bmp"
                      />
                      <div
                        class="picture"
                        @click="choosePicture(3)"
                      >
                        <img
                          class="cursor-pointer"
                          :src="thirdPictureSrc"
                          v-if="statusRealNameInformation.cardType == 1"
                        >
                        <img
                          class="default-picture cursor-pointer"
                          :src="passportHandImg"
                          v-else
                        >
                      </div>
                    </div>
                  </div>
                  <button
                    type="primary"
                    class="upload-submit cursor-pointer font-size12 margin-top30"
                    @click="choosePicture(3)"
                  >
                    <!--上传手持身份证-->
                    {{ $t('M.user_senior_upload3') }}
                  </button>
                </div>
              </div>
              <div class="upload-button">
                <div
                  class="false-tips fz14 tl mt-5"
                  v-show="errorMessage"
                >
                  <i></i>
                  {{ errorMessage }}
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
          v-if="advancedAuth === 'waitVeritfy'"
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
        <!--被驳回-->
        <div
          class="wait-veritfy-back wait-no-pass"
          v-if="authenticationNotPass"
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
              {{ $t('M.comm_sub_anew') }}{{ $t('M.comm_sub_time') }}
            </button>
          </div>
        </div>
        <div
          class="success-after name-authentication-content"
          v-if="authenticationInfo.userIdentity"
        ></div>
      </div>
      <!--高级认证 :visible.sync="seniorAuthentication"-->
      <el-dialog
        :title="$t('M.user_senior_certification')"
        name="1"
        center>
        <div class="advanced-certification-content">
          <Qrcode
            class="ercode"
            :value="String('http://192.168.1.87/isAppOverPage.html')"
            :size="140"
          >
          </Qrcode>
        </div>
        <div class="advanced-certification-text">
          <p class="text-tips font-size12">
            <!--请准备好您本人身份证使用浏览器或APP扫码进行高级认证。-->
            {{ $t('M.user_senior_hint1') }}
            <!--<a class="tips-refresh">-->
            <!--&lt;!&ndash;点击刷新&ndash;&gt;-->
            <!--&lt;!&ndash;{{ $t('M.user_senior_hint2') }}&ndash;&gt;-->
            <!--</a>-->
          </p>
          <p class="text-tips font-size12 tips-top">
            <!--若无法通过手机认证的用户，-->
            {{ $t('M.user_senior_hint3') }}
            <span
              class="tips-refresh cursor-pointer font-size14"
            >
              <!--@click.prevent="authenticationAuthentication"-->
              <!--请点击这里-->
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
import Qrcode from '../../Common/Qrcode'
import lrz from 'lrz'
import {
  submitRealNameAuthentication,
  submitSeniorCertification,
  realNameInformation,
  uploadImageAjax
} from '../../../utils/api/personal'
import {
  // returnAjaxMsg,
  getNestedData,
  validateNumForUserInput // 用户输入验证
} from '../../../utils/commonFunc'
import {
  idCardRegexpInputNum,
  passportEntryRestrictions,
  identityCodeValid
} from '../../../utils/index'
// mapGetters
import {
  mapState,
  mapActions,
  mapMutations
} from 'vuex'

export default {
  components: {
    ErrorBox, // 错误提示接口
    IconFontCommon, // 字体图标
    Qrcode
  },
  data () {
    return {
      regionList: [], // 国家地区列表
      documentTypeValue: 1, // 证件
      documentTypeList: [
        {
          certificateId: 1,
          certificateName: '身份证',
          english: 'ID'
        },
        {
          certificateId: 2,
          certificateName: '护照',
          english: 'Passport'
        }
      ], // 证件类型列表
      waitVeritfy: false, // 待审核
      realName: '', // 真实姓名
      idCardRef: 'id-card',
      identificationNumber: '', // 证件号码
      passportRef: 'passport',
      errorMessage: '', // 错误信息提示
      seniorAuthentication: false, // 高级认证弹窗默认
      authenticationInfo: {}, // 个人信息
      authenticationContentStatus: false, // 高级认证页面
      authenticationStatusFront: false, // 用户高级认证前
      authenticationNotPass: false, // 用户高级未通过
      // 身份认证默认图片
      firstPictureSrc: require('../../../assets/user/card_positive.png'), // 正面
      firstPictureSrcShow: true, // 显示身份证正面
      secondPictureSrc: require('../../../assets/user/card_negative.png'), // 反面
      secondPictureSrcShow: true, // 显示身份证反面
      thirdPictureSrc: require('../../../assets/user/card_handheld.png'), // 手持
      thirdPictureSrcShow: true, // 显示手持身份证
      // 护照默认图片
      passportPositiveImg: require('../../../assets/user/passport-positive.jpg'), // 正面
      passportOppositeImg: require('../../../assets/user/passport-opposite.png'), // 反面
      passportHandImg: require('../../../assets/user/hand.png'), // 手持
      // 是否上传身份证正面
      isUploadImg1: false,
      // 是否上传身份证反面
      isUploadImg2: false,
      // 是否上传手持身份证
      isUploadImg3: false,
      dialogImageFrontUrl: '', // 上传身份证正面url
      dialogImageReverseSideUrl: '', // 上传身份证反面url
      dialogImageHandUrl: '', // 上传手持身份证url
      realNameInformationObj: {}, //  获取用户实名信息
      userInfoRefresh: {}, //  刷新用户信息
      statusRealNameInformation: {
        cardNo: '',
        cardType: ''
      },
      // 设置错误信息
      errorShowStatusList: [
        '', // 真实姓名
        '', // 证件号码
        '', // 护照号码
        '' // 国籍
      ]
    }
  },
  async created () {
    this.authenticationIsStatus()
    await this.getRealNameInformation()
  },
  mounted () {
  },
  activated () {
  },
  update () {
  },
  beforeRouteUpdate () {
  },
  methods: {
    ...mapActions([
      'GET_COUNTRY_LIST_ACTION',
      'REFRESH_USER_INFO_ACTION'
    ]),
    ...mapMutations([
      'SET_USER_INFO_REFRESH_STATUS',
      'SET_STEP1_INFO',
      'CHANGE_USER_REFRESH_SUCCESS'
    ]),
    // 选择图片文件
    choosePicture (index) {
      this.$refs[`fileInput${index}`].click()
    },
    getPicture (e) {
      if (!e.target.files.length) return false
      console.dir(e.target.id)
      const INPUT_ID = e.target.id
      lrz(e.target.files[0]).then(async res => {
        const {base64, file, fileLen} = res
        if (this.beforeAvatarUpload(fileLen)) return false
        if (!await this.uploadImg(file, INPUT_ID.substr(INPUT_ID.length - 1, 1) - 0)) return false
        switch (INPUT_ID) {
          case 'fileInput1':
            console.log(this.firstPictureSrc)
            this.firstPictureSrc = base64
            this.passportPositiveImg = base64
            this.isUploadImg1 = true
            break
          case 'fileInput2':
            this.secondPictureSrc = base64
            this.passportOppositeImg = base64
            this.isUploadImg2 = true
            break
          case 'fileInput3':
            this.thirdPictureSrc = base64
            this.passportHandImg = base64
            this.isUploadImg3 = true
            break
        }
      })
    },
    async uploadImg (file, index) {
      console.log(index)
      let formData = new FormData()
      // console.log(res.file)
      formData.append('file', file)
      console.log(formData)
      const data = await uploadImageAjax(formData)
      if (!data) return false
      switch (index) {
        case 1:
          this.dialogImageFrontUrl = getNestedData(data, 'data.fileUrl')
          break
        case 2:
          this.dialogImageReverseSideUrl = getNestedData(data, 'data.fileUrl')
          break
        case 3:
          this.dialogImageHandUrl = getNestedData(data, 'data.fileUrl')
          break
      }
      console.log(this.dialogImageFrontUrl)
      return true
    },
    // 判断图片大小限制
    beforeAvatarUpload (size) {
      // 10M 尺寸
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
     *  刚进页面时候 获取用户实名信息
     */
    async getRealNameInformation () {
      let data = await realNameInformation()
      if (!data) return false
      // 返回列表数据
      this.realNameInformationObj = getNestedData(data, 'data')
      this.statusRealNameInformation = getNestedData(data, 'data.authInfo')
      // this.statusRealNameInformation = getNestedData(data, 'data')
    },
    // 检测身份证号
    idCardRegexpInputNum (ref) {
      let target = this.$refs[ref]
      this.identificationNumber = idCardRegexpInputNum(target)
    },
    // 检测护照证号
    passportEntryRestrictions (ref) {
      let target = this.$refs[ref]
      this.identificationNumber = passportEntryRestrictions(target)
    },
    // 检测输入格式
    checkoutInputFormat (type, targetNum) {
      console.log(type)

      switch (type) {
        // 请输入真实姓名
        case 0:
          console.log(type)
          if (!targetNum) {
            this.setErrorMsg(0, this.$t('M.user_please_input19'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(0, '')
            this.$forceUpdate()
            return 1
          }
        // 请输入证件号码
        case 1:
          switch (validateNumForUserInput('ID-card', targetNum)) {
            case 0:
              // '请输入正确的证件号码'
              if (!identityCodeValid(targetNum)) {
                this.setErrorMsg(1, this.$t('M.comm_please_enter') + this.$t('M.user_security_correct') + this.$t('M.user_real_certificate_cone'))
                this.$forceUpdate()
                return 0
              } else {
                this.setErrorMsg(1, '')
                this.$forceUpdate()
                return 1
              }
            case 1:
              // 请输入证件号码
              this.setErrorMsg(1, this.$t('M.user_please_input20'))
              this.$forceUpdate()
              return 0
            // '请输入正确的证件号码'
            case 2:
              this.setErrorMsg(1, this.$t('M.comm_please_enter') + this.$t('M.user_security_correct') + this.$t('M.user_real_certificate_cone'))
              this.$forceUpdate()
              return 0
          }
          break
        // 请输入证件号码
        case 2:
          if (!targetNum) {
            this.setErrorMsg(2, this.$t('M.user_please_input20'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(2, '')
            this.$forceUpdate()
            return 1
          }
        case 3:
          if (!targetNum) {
            this.setErrorMsg(3, '请选择国籍')
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(3, '')
            this.$forceUpdate()
            return 1
          }
      }
    },
    // 设置错误信息
    setErrorMsg (index, msg) {
      this.errorShowStatusList[index] = msg
    },
    // 切换证件类型清空证件号码，以及错误信息
    cardType (index) {
      this.errorShowStatusList[index] = ''
      this.identificationNumber = ''
    },
    // 提交实名认证
    submitRealName: _.debounce(async function () {
      let goOnStatus = 0
      if (
        this.checkoutInputFormat(0, this.realName) &&
        this.checkoutInputFormat(this.documentTypeValue, this.identificationNumber)
      ) {
        goOnStatus = 1
      } else {
        goOnStatus = 0
      }
      if (goOnStatus) {
        let data
        let param = {
          cardType: this.documentTypeValue, // 证件类型
          realname: this.realName, // 真实姓名
          // 证件号码
          cardNo: this.identificationNumber,
          country: this.userInfo.country.chinese
        }
        data = await submitRealNameAuthentication(param)
        if (!data) return false
        await this.REFRESH_USER_INFO_ACTION()
        this.authenticationIsStatus()
        await this.getRealNameInformation()
        console.log(data)
        this.realName = ''
        this.identificationNumber = ''
      }
    }, 500),
    // 高级认证弹窗
    authenticationMethod () {
      // 判断是否高级认证&&实名认证
      if (this.realNameAuth === 'y' && this.advancedAuth === '') {
        // 显示高级认证页面
        this.authenticationStatusFront = true
      }
      // else if (this.realNameAuth !== 'n') {
      //   // 隐藏弹出框
      //   // this.seniorAuthentication = false
      //   // 隐藏高级认证页面
      //   this.authenticationStatusFront = false
      // }
    },
    // 高级认证未通过被驳回
    authenticationIsStatus () {
      if (this.advancedAuth === '' && this.realNameAuth === 'n') {
        // 隐藏高级认证页面
        this.authenticationStatusFront = false
      }
      if (this.advancedAuth === 'notPass') {
        this.authenticationNotPass = true
        this.authenticationStatusFront = false
      } else {
        this.authenticationNotPass = false
      }
    },
    // 重新提交审核
    authenticationNoPass () {
      this.stateEmptyData()
      this.authenticationNotPass = false
      this.authenticationStatusFront = true
    },
    // 高级认证内容
    // authenticationAuthentication () {
    //   // 点击进入高级认证时隐藏弹窗
    //   if (!this.realNameInformationObj.advancedAuth) {
    //     this.authenticationStatusFront = true
    //   }
    //   // this.seniorAuthentication = false // 关闭高级认证扫码认证弹窗
    //   this.authenticationContentStatus = true
    // },
    // 选择图片文件
    // 确认提交高级认证
    stateSubmitSeniorCertification () {
      this.stateSeniorCertification()
    },
    stateSeniorCertification: _.debounce(async function () {
      if (!this.isUploadImg1) {
        // 请上传证件正面
        this.$message({
          message: this.$t('M.user_senior_upload1'),
          type: 'error'
        })
        return false
      } else if (!this.isUploadImg2) {
        // 请上传证件反面
        this.$message({
          message: this.$t('M.user_senior_upload2'),
          type: 'error'
        })
        return false
      } else if (!this.isUploadImg3) {
        // 请上传证件反面
        this.$message({
          message: this.$t('M.user_senior_upload3'),
          type: 'error'
        })
        return false
      } else {
        this.errorMessage = ''
      }
      let data
      let param = {
        idcardFront: this.dialogImageFrontUrl, // 上传证件正面
        idcardBack: this.dialogImageReverseSideUrl, // 上传证件反面
        idcardHand: this.dialogImageHandUrl // 上传手持证件
      }
      data = await submitSeniorCertification(param)
      if (!data) return false
      this.stateEmptyData()
      this.authenticationStatusFront = false
      this.SET_USER_INFO_REFRESH_STATUS(true)
      await this.REFRESH_USER_INFO_ACTION()
      await this.getRealNameInformation()
    }, 500),
    // 接口请求完成之后清空数据
    stateEmptyData () {
      // 证件类型为1 是身份证 2是护照
      if (this.statusRealNameInformation.cardType == 1) {
        this.firstPictureSrc = require('../../../assets/user/card_positive.png')
        this.secondPictureSrc = require('../../../assets/user/card_negative.png')
        this.thirdPictureSrc = require('../../../assets/user/card_handheld.png')
      } else {
        this.passportPositiveImg = require('../../../assets/user/passport-positive.jpg')
        this.passportOppositeImg = require('../../../assets/user/passport-opposite.png')
        this.passportHandImg = require('../../../assets/user/hand.png')
      }
      this.isUploadImg1 = ''
      this.isUploadImg2 = ''
      this.isUploadImg3 = ''
    }
  },
  filter: {},
  computed: {
    // ...mapGetters({
    //   'isChinese': 'isChineseLanguage'
    // }),
    ...mapState({
      language: state => state.common.language,
      theme: state => state.common.theme,
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      innerUserInfo: state => state.user.loginStep1Info.userInfo, // 内层用户详细信息
      configInfo: state => state.common.footerInfo.configInfo,
      countryAreaList: state => state.common.countryAreaList,
      // 是否通过高级认证
      // advancedAuth: state => state.user.loginStep1Info.userInfo.advancedAuth,
      advancedAuth: state => getNestedData(state, 'user.loginStep1Info.userInfo.advancedAuth'),
      // 实名认证
      realname: state => state.user.loginStep1Info.userInfo.realname,
      isUserRefreshSuccess: state => state.user.isUserRefreshSuccess,
      realNameAuth: state => getNestedData(state, 'user.loginStep1Info.userInfo.realNameAuth')
    })
  },
  watch: {
    isUserRefreshSuccess (newVal) {
      if (newVal) {
        this.authenticationIsStatus()
        this.CHANGE_USER_REFRESH_SUCCESS(false)
        this.getRealNameInformation()
      }
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../../assets/CSS/index';

  .identity-authentication {
    > .identity-authentication-main {
      .name-authentication-content {
        width: 500px;
        padding-top: 28px;
        padding-bottom: 25px;
        margin: 0 auto;

        .common-input,
        .submit {
          box-sizing: border-box;
          width: 270px;
          height: 38px;
          padding-left: 20px;
          border-radius: 4px;
        }
      }

      .authentication-type {
        flex: 4;
        line-height: 56px;
        cursor: pointer;
      }

      .authentication-type-info {
        flex: 4;
        width: 785px;
        padding-left: 10px;
        line-height: 56px;
      }

      .advanced-main-header {
        width: 100%;

        .main-header-title {
          line-height: 56px;
        }

        .icon-down {
          padding-right: 10px;
          font-size: 16px;
          line-height: 56px;
        }
      }
    }

    > .advanced-certification-main {
      .name-authentication-content {
        width: 350px;
        padding-top: 28px;
        padding-bottom: 25px;
        margin: 0 auto;
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

        .icon-down {
          padding-right: 10px;
          font-size: 16px;
          line-height: 56px;
        }
      }

      .advanced-certification-content {
        width: 126px;
        height: 128px;
        margin: 11px auto 47px;
      }

      .advanced-certification-text {
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
        > .wait-no-pass {
          padding-top: 50px !important;
        }

        > .wait-veritfy-back {
          height: 490px;
          padding-top: 130px;

          > .wait-veritfy {
            > .color-coin {
              color: #338ff5;
            }

            .list-height {
              margin-top: 10px;
              line-height: 25px;
            }

            .no-pass-button {
              width: 200px;
              height: 34px;
              margin-top: 20px;
              border-radius: 4px;
            }
          }
        }
      }

      .transition-box {
        > .advanced-upload {
          min-height: 180px;
          padding: 0 20px;
          margin-top: 62px;

          .advanced-upload {
            margin: 0 155px;
          }

          .upload,
          .advanced-upload {
            float: left;
            width: 180px;
            margin: 0 64px;
            text-align: center;
          }

          .upload {
            .default-center {
              position: relative;
              height: 116px;
              overflow: hidden;

              .upload-input {
                display: none;
              }

              > .img {
                > .picture {
                  height: 116px;
                  border-radius: 5px;
                  overflow: hidden;

                  > img {
                    height: 100%;
                    border-radius: 5px;
                  }
                }
              }
            }

            .default-picture {
              height: 113px;
            }
          }

          .upload-submit {
            padding: 8px 8px 9px;
            border-radius: 3px;
          }
        }

        .upload-button {
          width: 100%;
          text-align: center;

          .submit-information {
            width: 200px;
            height: 34px;
            margin: 60px auto 70px;
            border-radius: 4px;
            line-height: 34px;
          }

          .false-tips {
            height: 20px;
          }
        }

        > .advanced-prompt {
          margin: 20px 138px 0 27px;

          > .text-hints {
            line-height: 25px;
            text-align: left;
          }

          > .icon-font-color {
            height: 30px;
            line-height: 30px;

            > .icon-font {
              width: 18px;
              height: 16px;
            }

            > .vertical-align {
              vertical-align: middle;
            }
          }
        }

        > .personal-information {
          display: flex;
          padding: 0 24px;
          margin-top: 34px;
          line-height: 30px;

          > .information {
            flex: 1;
          }
        }
      }
    }

    /deep/ {
      /* 覆盖Element样式 */
      .el-form-item__content {
        width: 600px;
      }

      /* 折叠面板默认的边框修改 */
      .el-collapse,
      .el-collapse-item__header,
      .el-collapse-item__wrap {
        border: 0;
        background-color: transparent;
      }

      /* 身份认证 折叠框label */

      /* 高 */
      .el-collapse-item__header {
        height: 56px;
        margin: 0 23px;
        font-size: 16px;
      }

      /* 行高 */
      .el-collapse-item__header,
      .el-collapse-item__arrow {
        line-height: 56px;
      }

      /* select */
      .el-input__inner {
        width: 270px;
        height: 38px;
        line-height: 38px;
      }

      /* 高级认证弹框 */
      .el-dialog {
        top: 10%;
        width: 470px;
        height: 400px;
        border-radius: 7px;
      }

      .el-dialog__header {
        height: 44px;
        padding: 0 0 0 29px;
        border-radius: 7px 7px 0 0;
        line-height: 44px;
        text-align: left;
      }

      .el-dialog__title {
        font-size: 20px;
      }

      .el-upload--picture-card {
        width: 100%;
        height: 0;
        border: 0;
        line-height: 0;
      }

      .el-upload-list__item {
        width: 100%;
        height: 115px;
      }

      /* 实名认证表单样式 */
      .identity-authentication-main {
        margin-bottom: 10px;

        .name-authentication-content {
          .el-form-item__content {
            margin-left: 140px !important;
          }
        }
      }
    }

    &.night {
      color: $nightFontColor;
      background-color: $mainNightBgColor;

      .identity-header-background {
        margin-bottom: 10px;
        background-color: $mainContentNightBgColor;

        .header-content {
          color: #338ff5;
        }
      }

      .identity-authentication-main {
        background-color: $mainContentNightBgColor;

        .false-tips {
          color: #d45858;
        }

        .header-border {
          border-bottom: 1px solid #39424d;
        }

        .authentication-type {
          color: #09f;
        }

        .authentication-type-info {
          color: #d45858;

          > .authentication-info {
            color: #d45858;
          }
        }
      }

      .icon-down,
      .main-header-title {
        color: #fff;
      }

      .identity-background {
        background-color: $mainContentNightBgColor;
      }

      > .advanced-certification-main {
        .identity-box {
          border: 1px solid rgba(38, 47, 56, .1);

          > .wait-veritfy-back {
            > .wait-veritfy {
              > .color-coin {
                color: #338ff5;
              }

              .list-height {
                .no-error {
                  color: #6f798a;
                }
              }

              > .color-coin-text {
                font-size: 140px;
                color: #338ff5;
              }

              > .no-pass {
                color: #338ff5;
              }

              .no-pass-button {
                color: #fff;
                background: linear-gradient(90deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
              }
            }
          }
        }

        .header-border {
          border-bottom: 1px solid #39424d;
        }

        .authentication-type {
          color: #09f;
        }

        .upload-submit {
          border: 1px solid #338ff5;
          color: #338ff5;
        }

        .submit-information {
          color: #fff;
          background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
        }

        .text-hints {
          color: #a9bed4;
        }

        .icon-font-color {
          color: #c65252;
        }

        .info-type {
          color: #617499;
        }

        .user-info {
          color: #fff;
        }

        .advanced-certification-text {
          > .text-tips {
            color: rgba(254, 254, 255, .7);

            > .tips-refresh {
              color: #338ff5;
            }
          }
        }
      }

      /deep/ {
        /* 个人中心（黑色主题） */
        .el-collapse-item__header {
          border-bottom: 1px solid #39424d;
          color: rgba(255, 255, 255, .7);
          background-color: #1e2636;
        }

        .el-collapse-item__content {
          color: rgba(255, 255, 255, .7);
          background-color: #1e2636;
        }

        .common-input {
          border: 1px solid #364654;
          color: rgba(255, 255, 255, .7);

          &:focus {
            border: 1px solid #338ff5;
          }
        }

        .submit {
          color: rgba(255, 255, 255, .7);
          background: linear-gradient(9deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
        }

        .common-option {
          background-color: #1e2636;
        }

        /* select */
        .el-input__inner {
          border: 1px solid #364654;
          background-color: #333a41;

          &:focus {
            border: 1px solid #338ff5;
          }
        }

        .el-form-item__label {
          color: rgba(255, 255, 255, .7);
        }

        .el-select-dropdown__list {
          background-color: #25303b;
        }

        /* 高级认证弹框 */
        .el-dialog {
          background-color: #28334a;
        }

        .el-dialog__header {
          background-color: #20293c;
          box-shadow: 0 2px 5px #1d2131;
        }

        .el-dialog__title {
          color: #b8bdd0;
        }

        .el-upload--picture-card {
          background-color: transparent;
        }
      }
    }

    &.day {
      color: $dayMainTitleColor;

      .identity-header-background {
        margin-bottom: 10px;
        border-radius: 2px;
        background-color: $mainDayBgColor;
        box-shadow: 0 0 6px #cfd5df;

        .header-content {
          color: #338ff5;
        }
      }

      .identity-authentication-main {
        background-color: #fff;
        box-shadow: 0 0 6px #cfd5df;

        .name-authentication-content {
          .false-tips {
            color: #d45858;
          }

          .common-input {
            border: 1px solid rgba(38, 47, 56, .1);
            color: #333;
          }

          .submit {
            color: #fff;
            background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
          }
        }

        .header-border {
          padding: 0 20px;
          border-bottom: 1px solid rgba(38, 47, 56, .1);
        }

        .authentication-type {
          color: #09f;
        }

        .authentication-type-info {
          color: #d45858;

          > .authentication-info {
            color: #d45858;
          }
        }
      }

      .icon-down,
      .main-header-title {
        color: #333;
      }

      > .advanced-certification-main {
        .identity-box {
          margin-top: 10px;
          background-color: #fff;
          box-shadow: 0 0 6px #cfd5df;

          > .wait-veritfy-back {
            > .wait-veritfy {
              > .color-coin {
                color: #338ff5;
              }

              .list-height {
                .no-error {
                  color: #333;
                }
              }

              > .color-coin-text {
                font-size: 140px;
                color: #338ff5;
              }

              > .no-pass {
                color: #338ff5;
              }

              .no-pass-button {
                color: #fff;
                background: linear-gradient(90deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
              }
            }
          }
        }

        .header-border {
          background-color: #fff;
          box-shadow: 0 0 6px #cfd5df;
        }

        .authentication-type {
          color: #09f;
        }

        .upload-submit {
          border: 1px solid #338ff5;
          color: #338ff5;
        }

        .submit-information {
          color: #fff;
          background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
        }

        .text-hints {
          color: #666;
        }

        .icon-font-color {
          color: #c65252;
        }

        .info-type {
          color: #7d90ac;
        }

        .user-info {
          color: #333;
        }

        .advanced-certification-text {
          > .text-tips {
            color: #333;

            > .tips-refresh {
              color: #338ff5;
            }
          }
        }
      }

      /deep/ {
        /* 个人中心（白色主题） */
        .el-collapse-item__header {
          color: #333;
          background-color: #ccc;
        }

        .el-collapse-item__content {
          color: #333;
          background-color: #ccc;
        }

        .common-input {
          border: 1px solid #333;
          color: #eee;
        }

        .common-input:focus {
          border: 1px solid #555;
        }

        .submit {
          color: #333;
          background-color: #ccc;
        }

        /* select */
        .el-input__inner {
          border: 1px solid rgba(236, 241, 248, 1);
          background: rgba(255, 255, 255, 1);

          &:focus {
            border: 1px solid #333;
          }
        }

        .el-form-item__label {
          color: #333;
        }

        /* 高级认证弹框 */
        .el-dialog {
          background-color: #fff;
        }

        .el-dialog__header {
          background: rgba(51, 143, 245, .1);
          box-shadow: 0 1px 2px 0 rgba(29, 33, 49, .1);
        }

        .el-dialog__title {
          color: #555;
        }

        .icon-down,
        .main-header-title {
          color: #ccc;
        }
      }
    }
  }
</style>
