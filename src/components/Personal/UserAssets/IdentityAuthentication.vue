<template>
  <div
    class="identity-authentication personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="identity-header-background personal-height40 line-height40">
      <span class="padding-left23 header-content font-size16">身份认证</span>
    </header>
    <div class="identity-authentication-main margin-top9">
      <!--实名认证-->
      <div class="real-name-authentication identity-background">
        <!--(1.姓名、2.身份证号、3.状态)-->
          <div
            class="advanced-main-header"
          >
            <div class="header-border display-flex margin20">
              <span class="font-size16 main-header-title">实名认证</span>
              <p
                v-if="userInfo.userInfo.realname === ''"
                class="authentication-type font-size12"
              >
                （请如实填写您的身份信息，一经认证不可修改）
              </p>
              <p
                v-else
                class="authentication-type-info font-size12 box-sizing"
              >
                （
                <span class="authentication-info">您已通过实名认证</span>
                <span
                  class="type-info"
                >
                  姓名：
                  {{ userInfo.userInfo.realname }}
                </span>、
                <span class="type-info">
                  身份证号：
                   {{ userInfo.userInfo.cardNo.substring(0,2)}}
                  ****
                   {{ userInfo.userInfo.cardNo.substring(16,18)}}
                </span>
                &nbsp;）
              </p>
              <i class="el-icon-arrow-down icon-down float-right"></i>
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
          <el-form-item label="地区国家">
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
          <el-form-item label="证件类型">
            <el-select
              v-model="documentTypeValue"
              placeholder="请选择证件类型"
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
          <el-form-item label="真实姓名">
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
          <el-form-item label="证件号码">
            <input
              class="common-input"
              v-model="identificationNumber"
              @keydown="setErrorMsg(1, '')"
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
              提交认证
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
          @click.prevent="authenticationMethod">
          <span class="font-size16 main-header-title">高级认证</span>
          <span
            v-if="userInfo.userInfo.advancedAuth === 'notPass' || userInfo.userInfo.advancedAuth === ''"
            class="authentication-type font-size12"
          >
            （未高级认证）
          </span>
          <span
            v-if="userInfo.userInfo.advancedAuth === 'pass'"
            class="authentication-type font-size12"
          >
            （已通过实名认证）
          </span>
          <span
            v-if="userInfo.userInfo.advancedAuth === 'waitVeritfy'"
            class="authentication-type font-size12"
          >
            （待审核）
          </span>
          <span
            class="float-right authentication-type font-size12"
            v-if="userInfo.userInfo.advancedAuth === 'notPass' || userInfo.userInfo.advancedAuth === ''"
          >
            去认证
          </span>
          <span v-else></span>
        </p>
      </div>
      <div class="identity-box">
        <div v-show="authenticationStatusFront">
          <el-collapse-transition>
            <div class="transition-box">
              <div class="personal-information">
                <p class="information">
                  <span class="info-type font-size12">国际：</span>
                  <span class="user-info font-size14">
                    {{ userInfo.userInfo.country }}
                  </span>
                </p>
                <p class="information">
                  <span class="info-type font-size12">姓名：</span>
                  <!--<span v-if="statusRealNameInformation.realname == null"></span>-->
                  <span
                    class="user-info font-size14"
                  >
                    {{ userInfo.userInfo.realname }}
                  </span>
                </p>
                <p class="information">
                  <span class="info-type font-size12">证件号：</span>
                  <span class="user-info font-size14">
                  <!--  {{ userInfoRefresh.cardNo.substring(0,6)}}
                  ****
                   {{ userInfoRefresh.cardNo.substring(14,18)}}-->
                     {{ userInfo.userInfo.cardNo}}
                  </span>
                </p>
                <p class="information">
                  <span class="info-type font-size12">证件类型：</span>
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
                  <span class="font-size14 vertical-align">注意：</span>
                </p>
                <p class="text-hints">1.照片文件大小不能超过4M！文件格式须为jpg、bmp、png等！</p>
                <p class="text-hints">2. 请确保照片无水印，无污渍，身份信息清晰，头像完整，非文字反向照片！照片请勿进行PS处理！</p>
                <p class="text-hints">3. 手持身份证照片：需要您本人一只手持您的身份证，另一只手持一张有您手写的fubt.top账号ID的白纸。确保身份证和白纸
                  在您的胸前，不遮挡您的脸部，并且身份证和白纸上的信息清晰可见！</p>
                <p class="text-hints margin-top30">以下图片仅作为示例，请提交您本人的身份材料照片。照片勿进行PS处理！</p>
              </div>
              <div class="advanced-upload">
                <div class="upload">
                  <!-- 上传身份证正面 -->
                  <div class="default-center">
                    <el-upload
                      action="http://192.168.1.200:8888/uploadfile"
                      :headers="tokenObj"
                      list-type="picture-card"
                      :on-success="handleSuccessFront"
                      :on-remove="handleRemoveFront"
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
                    </el-upload>
                  </div>
                  <button
                    type="primary"
                    class="upload-submit cursor-pointer font-size12 margin-top30"
                    on-success="handleSuccessFront"
                  >
                    <!--@click.prevent="handleSuccessFront"-->
                    上传身份证正面
                  </button>
                </div>
                <div class="upload">
                  <!-- 上传身份证反面 -->
                  <div class="default-center">
                    <el-upload
                      action="http://192.168.1.200:8888/uploadfile"
                      :headers="tokenObj"
                      list-type="picture-card"
                      :on-success="handleSuccessReverseSide"
                      :on-remove="handleRemoveSide"
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
                    </el-upload>
                  </div>
                  <button
                    type="primary"
                    class="upload-submit cursor-pointer font-size12 margin-top30"
                    @click.prevent="handleSuccessReverseSide"
                  >
                    上传身份证反面
                  </button>
                </div>
                <div class="upload">
                  <!-- 上传手持身份证 -->
                  <div class="default-center">
                    <el-upload
                      action="http://192.168.1.200:8888/uploadfile"
                      :headers="tokenObj"
                      list-type="picture-card"
                      :on-success="handleSuccessHand"
                      :on-remove="handleRemoveHand"
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
                    </el-upload>
                  </div>
                  <button
                    type="primary"
                    class="upload-submit cursor-pointer font-size12 margin-top30"
                    @click.prevent="handleSuccessHand"
                  >
                    上传手持身份证
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
                  确认提交
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
            <p class="list-height">待审核...</p>
          </div>
        </div>
        <div
          class="success-after name-authentication-content"
          v-if="authenticationInfo.userIdentity"
        ></div>
      </div>
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
            请准备好您本人身份证使用浏览器扫码进行高级认证如二维码过 期请刷新重试。
            <a class="tips-refresh">点击刷新</a>
          </p>
          <p class="text-tips font-size12 tips-top">
            请在浏览器中打开，并升级浏览器至最新版本,无法通过认证的用户，
            <span
              class="tips-refresh cursor-pointer"
              @click.prevent="authenticationAuthentication"
            >
              请点击这里
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
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'SET_USER_INFO_REFRESH_STATUS'
    ]),
    // beforeAvatarUpload (file) {
    //   const isJPG = file.type === 'image/jpeg/bmp/png'
    //   const isLt2M = file.size / 1024 / 1024 < 2
    //
    //   if (!isJPG) {
    //     this.$message.error('上传头像图片只能是 JPG 格式!')
    //   }
    //   if (!isLt500kb) {
    //     this.$message.error('上传头像图片大小不能超过 500kb!')
    //   }
    //   return isJPG && isLt2M
    // },
    handleSuccessFront (response) {
      this.dialogImageFrontUrl = response.data.fileUrl
      this.firstPictureSrcShow = false
    },
    handleSuccessReverseSide (response) {
      this.dialogImageReverseSideUrl = response.data.fileUrl
      this.secondPictureSrcShow = false
    },
    handleSuccessHand (response) {
      this.dialogImageHandUrl = response.data.fileUrl
      this.thirdPictureSrcShow = false
    },
    handleRemoveFront () {
      this.firstPictureSrcShow = true
    },
    handleRemoveSide () {
      this.secondPictureSrcShow = true
    },
    handleRemoveHand () {
      this.thirdPictureSrcShow = true
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
      if (!this.dialogImageFrontUrl) {
        this.$message({
          message: '请上传身份证正面',
          type: 'error'
        })
        return
      } else if (!this.dialogImageReverseSideUrl) {
        this.$message({
          message: '请上传身份证反面',
          type: 'error'
        })
        return
      } else if (!this.dialogImageHandUrl) {
        this.$message({
          message: '请上传手持身份证',
          type: 'error'
        })
        return
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
        this.SET_USER_INFO_REFRESH_STATUS(true)
        await this.getUserRefreshUser()
        await this.getRealNameInformation()
        this.authenticationStatusFront = false
        this.stateEmptyData()
      }
    },
    // 接口请求完成之后清空数据
    stateEmptyData () {
      this.dialogImageFrontUrl = ''
      this.dialogImageReverseSideUrl = ''
      this.dialogImageHandUrl = ''
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
    })
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
  @import "../../../../static/css/scss/Personal/UserAssets/IdentityAuthentication";
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
