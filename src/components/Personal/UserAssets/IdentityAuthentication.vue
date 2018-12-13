<template>
  <div
    class="identity-authentication personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-background="rgba(0, 0, 0, 0.6)"
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
                v-if="innerUserInfo.realname === ''"
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
                  {{ innerUserInfo.realname }}
                </span>、
                <span class="type-info">
                  <!--身份证号：-->
                  {{ $t('M.comm_id_number') }}：
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
        v-if="innerUserInfo.realname === ''"
        class="name-authentication-content margin-top9"
      >
        <el-form
          ref="form"
          label-width="140px"
        >
          <!--地区国家 -->
          <el-form-item
            :label="$t('M.user_real_region')"
          >
            <el-select
              :placeholder="$t('M.comm_please_choose')"
              v-model="regionValue"
              :no-data-text="$t('M.comm_no_data')"
              @change="changeId"
            >
              <!-- <el-option
                v-for="(item, index) in contryAreaList"
                :key="index"
                :label="item.chinese"
                :value="item.chinese"
              >
              </el-option> -->
              <el-option
                v-for="(item, index) in contryAreaList"
                :key="index"
                :label="language === 'zh_CN' || language === 'zh_TW'? item.chinese : item.english"
                :value="item.chinese"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 证件类型 -->
          <el-form-item
            :label="$t('M.user_real_certificate_type')"
          >
            <!--请选择证件类型-->
            <el-select
              @change="changedocumentTypeValue"
              v-model="documentTypeValue"
              :no-data-text="$t('M.comm_no_data')"
              :placeholder="$t('M.comm_please_choose') + $t('M.user_real_certificate_type')"
            >
              <el-option
                v-for="(item, index) in documentTypeList"
                :key="index"
                :label="language === 'zh_CN' || language === 'zh_TW'? item.certificateName : item.english"
                :value="item.certificateName"
              >
              </el-option>
              <!-- <el-option
                v-for="(item, index) in documentTypeList"
                :key="index"
                :label="item.certificateName"
                :value="item.certificateName"
              >
              </el-option> -->
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
            v-if="documentTypeValue == '身份证'"
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
            v-if="innerUserInfo.advancedAuth === ''"
            class="authentication-type font-size12"
          >
            <!--未高级认证-->
            ({{ $t('M.user_advanced_authentication_tips1') }})
          </span>
          <span
            v-if="innerUserInfo.advancedAuth === 'pass'"
            class="authentication-type font-size12"
          >
            <!--已通过实名认证-->
            （{{ $t('M.user_real_already') }}{{ $t('M.user_real_name') }}）
          </span>
          <span
            v-if="innerUserInfo.advancedAuth === 'waitVeritfy'"
            class="authentication-type font-size12"
          >
            <!--待审核-->
            （{{ $t('M.user_senior_audit') }}）
          </span>
          <span
            class="float-right authentication-type font-size12"
            v-if="innerUserInfo.advancedAuth === ''"
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
                    <!-- {{ innerUserInfo.country }} -->
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
                  <!--<span v-if="statusRealNameInformation.realname == null"></span>-->
                  <span
                    class="user-info font-size14"
                  >
                    {{ innerUserInfo.realname }}
                  </span>
                </p>
                <!-- 证件号 -->
                <p class="information">
                  <span class="info-type font-size12">
                    {{ $t('M.comm_credentials_number') }}：
                  </span>
                  <span class="user-info font-size14">
                  <!--  {{ userInfoRefresh.cardNo.substring(0,6)}}
                  ****
                   {{ userInfoRefresh.cardNo.substring(14,18)}}-->
                     {{ innerUserInfo.cardNo}}
                  </span>
                </p>
                <!-- 证件类型 -->
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
                <p class="text-hints">3. {{ $t('M.user_senior_text4') }} {{configInfo.otcAd}} {{ $t('M.user_senior_text6') }}</p>
                <!--以下图片仅作为示例，请提交您本人的身份材料照片。照片勿进行PS处理！-->
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
                          v-show="isChinese"
                          class="default-picture cursor-pointer"
                          :src="firstPictureSrc"
                        >
                        <img
                          v-show="!isChinese"
                          class="default-picture cursor-pointer"
                          :src="passportPositiveImg"
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
                          v-show="isChinese"
                          class="default-picture cursor-pointer"
                          :src="secondPictureSrc"
                        >
                        <img
                          v-show="!isChinese"
                          class="default-picture cursor-pointer"
                          :src="passportOppositeImg"
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
                          v-show="isChinese"
                          class="default-picture cursor-pointer"
                          :src="thirdPictureSrc"
                        >
                        <img
                          v-show="!isChinese"
                          class="default-picture cursor-pointer"
                          :src="passportHandImg"
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
                  v-show = "errorMessage"
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
      <!--高级认证-->
      <el-dialog
        :title="$t('M.user_senior_certification')"
        :visible.sync="seniorAuthentication"
        name="1"
        center>
        <div class="advanced-certification-content">
          <VueQrcode
            class="ercode"
            :value="String('http://192.168.1.87/isAppOverPage.html')"
            :options="{ size: 140 }"
          >
          </VueQrcode>
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
              @click.prevent="authenticationAuthentication"
            >
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
import {
  submitRealNameAuthentication,
  submitSeniorCertification,
  realNameInformation,
  userRefreshUser
} from '../../../utils/api/personal'
import {
  returnAjaxMsg,
  getNestedData,
  validateNumForUserInput // 用户输入验证
} from '../../../utils/commonFunc'
import {
  apiCommonUrl,
  xDomain
} from '../../../utils/env'
import {
  idCardRegexpInputNum,
  passportEntryRestrictions
} from '../../../utils/index'
import {
  createNamespacedHelpers,
  mapState,
  mapGetters
} from 'vuex'
const {mapMutations, mapActions} = createNamespacedHelpers('common')
export default {
  components: {
    ErrorBox, // 错误提示接口
    IconFontCommon, // 字体图标
    // 二维码组件
    VueQrcode: resolve => {
      require([('@xkeshi/vue-qrcode')], resolve)
    }
  },
  // props,
  data () {
    return {
      // 上传图片 token
      tokenObj: {
        'token': '',
        'x-domain': ''
      },
      regionValue: '', // 国家
      regionList: [], // 国家地区列表
      documentTypeValue: '身份证', // 证件
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
      passportPositiveImg: require('../../../assets/user/passport-positive.png'), // 正面
      passportOppositeImg: require('../../../assets/user/passport-opposite.png'), // 反面
      passportHandImg: require('../../../assets/user/hand.png'), // 手持
      dialogImageFrontUrl: '', // 上传身份证正面url
      dialogImageReverseSideUrl: '', // 上传身份证反面url
      dialogImageHandUrl: '', // 上传手持身份证url
      realNameInformationObj: {}, //  获取用户实名信息
      userInfoRefresh: {}, //  刷新用户信息
      statusRealNameInformation: {
        cardNo: ''
      },
      // 设置错误信息
      errorShowStatusList: [
        '', // 真实姓名
        '', // 证件号码
        '' // 护照号码
      ],
      fullscreenLoading: false // 整页loading
    }
  },
  async created () {
    this.SET_USER_INFO_REFRESH_STATUS(true)
    await this.getUserRefreshUser()
    this.tokenObj.token = this.userInfo.token
    this.tokenObj['x-domain'] = xDomain
    await this.reflashUserInfo()
    this.authenticationIsStatus()
    console.log(this.authenticationNotPass)
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapActions([
      'GET_COUNTRY_LIST_ACTION'
    ]),
    ...mapMutations([
      'SET_USER_INFO_REFRESH_STATUS'
    ]),
    reflashUserInfo () {
      this.$store.dispatch('user/REFLASH_USER_INFO', this)
    },
    // 改变证件类型
    changedocumentTypeValue (e) {
      console.log(e)
    },
    // 隐藏上传按钮
    uploadImg (ref) {
      this.$refs[ref].click()
    },
    // 上传身份证正面
    handleSuccessFront (response) {
      console.log(response)
      this.dialogImageFrontUrl = response.data.fileUrl
      this.firstPictureSrcShow = false
    },
    // 上传身份证反面
    handleSuccessReverseSide (response) {
      console.log(response)
      this.dialogImageReverseSideUrl = response.data.fileUrl
      this.secondPictureSrcShow = false
    },
    // 上传手持身份证
    handleSuccessHand (response) {
      console.log(response)
      this.dialogImageHandUrl = response.data.fileUrl
      this.thirdPictureSrcShow = false
    },
    // 删除身份证正面
    handleRemoveFront () {
      this.dialogImageFrontUrl = ''
      this.firstPictureSrcShow = true
    },
    // 删除身份证反面
    handleRemoveSide () {
      this.dialogImageReverseSideUrl = ''
      this.secondPictureSrcShow = true
    },
    // 删除手持身份证
    handleRemoveHand () {
      this.dialogImageHandUrl = ''
      this.thirdPictureSrcShow = true
      console.log(this.thirdPictureSrcShow)
    },
    // 判断图片大小限制
    beforeAvatarUpload (file) {
      console.log(file)
      // const isJPG = file.type === 'image/jpeg'
      const isLt10M = file.size
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      if (isLt10M > 102400000) {
        console.log(isLt10M)
        // 上传头像图片大小不能超过 10M!
        this.$message.error(this.$t('M.user_senior_hint5'))
        return false
      }
    },
    /**
     * 刚进页面时候 国家列表展示
     */
    changeId (e) {
      console.log(e)
      this.regionList.forEach(item => {
        if (e === item.id) {
          this.regionValue = e
          console.log(this.regionValue)
        }
      })
    },
    /**
    *  刚进页面时候 获取用户实名信息
    */
    async getRealNameInformation () {
      let data = await realNameInformation()
      // 整页loading
      this.fullscreenLoading = true
      console.log(data)
      if (!(returnAjaxMsg(data, this, 0))) {
        // 接口失败清除loading
        this.fullscreenLoading = false
        return false
      } else {
        // 接口成功清除loading
        this.fullscreenLoading = false
        // 返回列表数据
        this.realNameInformationObj = getNestedData(data, 'data.data')
        this.statusRealNameInformation = getNestedData(data, 'data.data.authInfo')
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
      // 整页loading
      this.fullscreenLoading = true
      if (!(returnAjaxMsg(data, this, 0))) {
        // 接口失败清除loading
        this.fullscreenLoading = false
        return false
      } else {
        // 接口成功清除loading
        this.fullscreenLoading = false
        this.$store.commit('user/SET_STEP1_INFO', data.data.data)
        // 返回列表数据
        this.userInfoRefresh = getNestedData(data, 'data.data.userInfo')
        this.authenticationIsStatus()
      }
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
              this.setErrorMsg(1, '')
              this.$forceUpdate()
              return 1
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
            this.setErrorMsg(2, this.$t('M.comm_please_enter') + this.$t('M.user_security_correct') + this.$t('M.user_real_certificate_cone'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(2, '')
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
          nationCode: this.regionValue, // 国籍
          cardType: this.documentTypeValue, // 证件类型
          realname: this.realName, // 真实姓名
          cardNo: this.identificationNumber // 证件号码
        }
        // 整页loading
        this.fullscreenLoading = true
        data = await submitRealNameAuthentication(param)
        if (!(returnAjaxMsg(data, this, 1))) {
          // 接口失败清除loading
          this.fullscreenLoading = false
          return false
        } else {
          // 接口成功清除loading
          this.fullscreenLoading = false
          await this.getUserRefreshUser()
          await this.getRealNameInformation()
          console.log(data)
        }
      }
    },
    // 高级认证弹窗
    authenticationMethod () {
      // 判断是否高级认证&&实名认证
      if (this.userInfoRefresh.realname !== '' && this.innerUserInfo.advancedAuth === '') {
        this.seniorAuthentication = true
      } else if (this.userInfoRefresh.realname !== '') {
        this.seniorAuthentication = false
      }
    },
    // 高级认证未通过被驳回
    authenticationIsStatus () {
      if (this.innerUserInfo.advancedAuth === 'notPass') {
        console.log(this.innerUserInfo)
        this.authenticationNotPass = true
        this.authenticationStatusFront = false
      } else {
        this.authenticationNotPass = false
      }
    },
    // 重新提交审核
    authenticationNoPass () {
      this.authenticationNotPass = false
      this.authenticationStatusFront = true
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
      if (this.dialogImageFrontUrl === '') {
        // 请上传证件正面
        this.$message({
          message: this.$t('M.user_senior_upload1'),
          type: 'error'
        })
        return false
      } else if (this.dialogImageReverseSideUrl === '') {
        // 请上传证件反面
        this.$message({
          message: this.$t('M.user_senior_upload2'),
          type: 'error'
        })
        return false
      } else if (this.dialogImageHandUrl === '') {
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
      // 整页loading
      this.fullscreenLoading = true
      data = await submitSeniorCertification(param)
      console.log(data)
      if (!(returnAjaxMsg(data, this, 1))) {
        // 接口失败清除loading
        this.fullscreenLoading = false
        return false
      } else {
        // 接口成功清除loading
        this.fullscreenLoading = false
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
    ...mapGetters('common', {
      'isChinese': 'isChineseLanguage'
    }),
    ...mapState({
      language: state => state.common.language,
      theme: state => state.common.theme,
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      innerUserInfo: state => state.user.loginStep1Info.userInfo, // 内层用户详细信息
      configInfo: state => state.common.footerInfo.configInfo,
      contryAreaList: state => state.common.contryAreaList,
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
        this.GET_COUNTRY_LIST_ACTION({
          self: this,
          callback: (data) => {
            this.regionList = data.data.data
            this.regionValue = data.data.data[0].id
            this.regionValue = data.data.data[0].chinese
          }})
      }
    },
    contryAreaList (newVal) {
      console.log(newVal)
      if (newVal) {
        console.log(newVal)
      }
    },
    userInfo (newVal) {
      console.log(newVal)
    },
    language (newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal";

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
        height: 56px;

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
        height: 56px;

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
          height: 400px;
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

              > .upload-input {
                display: none;
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
            margin: 90px auto 83px;
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
        .name-authentication-content {
          .el-form-item__content {
            margin-left: 140px !important;
          }
        }
      }
    }

    &.night {
      color: $nightFontColor;
      background-color: $nightBgColor;

      .identity-header-background {
        background-color: $nightMainBgColor;

        .header-content {
          color: #338ff5;
        }
      }

      .identity-authentication-main {
        background-color: $nightMainBgColor;

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
        background-color: $nightMainBgColor;
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
      color: $dayFontColor;
      background-color: $dayBgColor;

      .identity-header-background {
        border: 1px solid rgba(38, 47, 56, .1);
        border-radius: 2px;
        background-color: $dayBgColor;

        .header-content {
          color: #338ff5;
        }
      }

      .identity-authentication-main {
        border: 1px solid rgba(38, 47, 56, .1);
        background-color: #fff;

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

      .identity-background {
        background-color: #fff;
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
          border: 1px solid rgba(38, 47, 56, .1);
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
