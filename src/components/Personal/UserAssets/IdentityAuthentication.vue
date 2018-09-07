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
            <div class="header-border margin20 display-flex">
              <span class="font-size16 main-header-title">实名认证</span>
              <p
                v-if="realNameInformationObj.realnameAuth"
                class="authentication-type-info font-size12 box-sizing"
              >
                <span class="authentication-info">您已通过实名认证</span>
                <!--{{ realNameInformationList.realname.substring(0,1)}}-->
                <!--*-->
                <!--{{ realNameInformationList.realName.substring(2,3)}}-->
                （&nbsp;
                <span class="type-info">
                  姓名：
                  {{ statusRealNameInformation.realname }}
                </span>、
                <span class="type-info">
                  身份证号：
                   {{ statusRealNameInformation.cardNo.substring(0,6)}}
                  ****
                   {{ statusRealNameInformation.cardNo.substring(14,18)}}
                  <!-- {{  authenticationInfo.identification }}-->
                </span>
                &nbsp;）
              </p>
              <p
                v-else
                class="authentication-type font-size12"
              >
                （请先通过实名认证）
              </p>
              <i class="el-icon-arrow-down icon-down float-right"></i>
            </div>
          </div>
      </div>
      <div
        v-if="!realNameInformationObj.realnameAuth"
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
                v-for="(item, index) in regionList"
                :key="index"
                :label="item.regionName"
                :value="item.regionName"
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
              @focus="emptyStatus"
            />
          </el-form-item>
          <el-form-item label="证件号码">
            <input
              class="common-input"
              v-model="identificationNumber"
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
              @click="submitRealName"
            >
              提交认证
            </button>
          </el-form-item>
        </el-form>
      </div>
      <div v-else class="name-authentication-content success-height"></div>
    </div>
    <!--高级认证-->
    <div class="advanced-certification-main identity-background margin-top9"
    >
      <div
        class="advanced-main-header"
      >
        <p
          class="margin20 header-border"
          @click="authenticationMethod">
          <span class="font-size16 main-header-title">高级认证</span>
          <span
            v-if="realNameInformationObj.advancedAuth"
            class="authentication-type font-size12"
          >
            （已实名认证）
          </span>
          <span
            v-else
            class="authentication-type font-size12"
          >
            （请先通过实名认证）
          </span>
          <i class="el-icon-arrow-down icon-down float-right"></i>
        </p>
      </div>
      <div>
        <div v-show="authenticationStatusFront">
          <el-collapse-transition>
            <div class="transition-box">
              <div class="personal-information">
                <p class="information">
                  <span class="info-type font-size12">国际：</span>
                  <span class="user-info font-size14">中国</span>
                </p>
                <p class="information">
                  <span class="info-type font-size12">姓名：</span>
                  <span class="user-info font-size14">王二麻</span>
                </p>
                <p class="information">
                  <span class="info-type font-size12">证件号：</span>
                  <span class="user-info font-size14">4127556497832164</span>
                </p>
                <p class="information">
                  <span class="info-type font-size12">证件类型：</span>
                  <span class="user-info font-size14">身份证</span>
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
                      action="http://192.168.1.217:8888/uploadfile"
                      :headers="tokenObj"
                      list-type="picture-card"
                      :on-success="handleSuccessFront"
                      :on-remove="handleRemove"
                    >
                      <div class="picture">
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
                    @click="choosePicture(1)"
                  >
                    上传身份证正面
                  </button>
                </div>
                <div class="upload">
                  <!-- 上传身份证反面 -->
                  <div class="default-center">
                    <el-upload
                      action="http://192.168.1.217:8888/uploadfile"
                      :headers="tokenObj"
                      list-type="picture-card"
                      :on-success="handleSuccessReverseSide"
                      :on-remove="handleRemove"
                    >
                      <div class="picture">
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
                    @click="choosePicture(2)"
                  >
                    上传身份证反面
                  </button>
                </div>
                <div class="upload">
                  <!-- 上传手持身份证 -->
                  <div class="default-center">
                    <el-upload
                      action="http://192.168.1.217:8888/uploadfile"
                      :headers="tokenObj"
                      list-type="picture-card"
                      :on-success="handleSuccessHand"
                      :on-remove="handleRemove">
                      <div class="picture"
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
                    @click="choosePicture(3)"
                  >
                    上传手持身份证
                  </button>
                </div>
              </div>
              <div class="upload-button">
                <!--提交按钮-->
                <button
                  class="submit-information font-size16 cursor-pointer"
                  @click="stateSubmitSeniorCertification"
                >
                  确认提交
                </button>
              </div>
            </div>
          </el-collapse-transition>
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
          <p class="text-tips">
            请准备好您本人身份证使用浏览器扫码进行高级认证如二维码过 期请刷新重试。
            <a class="tips-refresh" href="">点击刷新</a>
          </p>
          <p class="text-tips">
            请在浏览器中打开，并升级浏览器至最新版本,无法通过认证的用户，
            <span
              class="tips-refresh cursor-pointer"
              @click="authenticationAuthentication"
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
import {mapState} from 'vuex'
import IconFontCommon from '../../Common/IconFontCommon'
import {queryCountryList, submitRealNameAuthentication, submitSeniorCertification, realNameInformation} from '../../../utils/api/personal'
import {returnAjaxMessage} from '../../../utils/commonFunc'
export default {
  components: {
    IconFontCommon // 字体图标
  },
  // props,
  data () {
    return {
      tokenObj: {
        'token': 'ee4cbf93-a8a0-4e1d-b67e-5ff8bf06d38b'
      },
      regionValue: '', // 国家
      regionList: [
        // {
        //   regionId: 1,
        //   regionName: '中国'
        // }
      ], // 国家地区列表
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
      realName: '', // 真实姓名
      identificationNumber: '', // 证件号码
      errorMsg: '', // 错误信息提示
      seniorAuthentication: false, // 高级认证弹窗默认
      authenticationInfo: {}, // 个人信息
      authenticationContentStatus: false, // 高级认证页面
      authenticationStatusFront: false, // 用户高级认证前
      // 身份认证默认图片
      firstPictureSrc: require('../../../assets/user/card_negative.png'), // 正面
      secondPictureSrc: require('../../../assets/user/card_positive.png'), // 反面
      thirdPictureSrc: require('../../../assets/user/card_handheld.png'), // 手持
      dialogImageFrontUrl: '', // 上传身份证正面url
      // dialogVisibleFront: false,
      dialogImageReverseSideUrl: '', // 上传身份证反面url
      dialogVisibleReverseSide: false,
      dialogImageHandUrl: '', // 上传手持身份证url
      dialogVisibleHand: false,
      seniorCertificationList: {},
      realNameInformationObj: {}, //  获取用户实名信息
      statusRealNameInformation: {}
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/UserAssets/IdentityAuthentication.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/UserAssets/IdentityAuthenticationDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/UserAssets/IdentityAuthenticationNight.css')
    // 获取全局个人信息
    // this.authenticationInfo = this.userInfo.data.user
    // 清空图片和关闭弹窗this.clearUserPicture()
    // this.getCountryListings()
    // this.getRealNameInformation()
    // console.log(this.tokenObj)
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
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
    handleSuccessFront (response, file, fileList) {
      this.dialogImageFrontUrl = response.data.fileUrl
      console.log(response.data.fileUrl)
      console.log(response, file, fileList)
    },
    handleSuccessReverseSide (response, file, fileList) {
      this.dialogImageReverseSideUrl = response.data.fileUrl
      console.log(response, file, fileList)
    },
    handleSuccessHand (response, file, fileList) {
      this.dialogImageHandUrl = response.data.fileUrl
      console.log(response, file, fileList)
    },
    handleRemove (file) {
      console.log(file)
    },
    /**
     * 刚进页面时候 国家列表展示
     */
    changeId (e) {
      this.currencyList.forEach(item => {
        if (e === item.id) {
          this.getCountryListings(e)
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
        console.log(this.regionList)
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
        this.statusRealNameInformation = data.data.data.authInfo
        console.log(this.realNameInformationObj.realnameAuth)
        console.log(this.statusRealNameInformation.realname)
      }
    },
    // 提交实名认证认证
    submitRealName () {
      // if (!this.region) {
      //   this.errorMsg = '请选择地区国家'
      //   return
      // } else if (!this.documentType) {
      //   this.errorMsg = '请选择证件类型'
      //   return
      // } else if (!this.realName) {
      //   this.errorMsg = '真实姓名不能为空'
      //   return
      // } else if (!this.identificationNumber) {
      //   this.errorMsg = '证件号码不能为空'
      //   return
      // } else {
      //   this.errorMsg = ''
      // }
      this.stateSubmitRealName()
    },
    async stateSubmitRealName () {
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
        this.getRealNameInformation()
        console.log(data)
      }
    },
    // 清空内容信息
    emptyStatus () {
      this.errorMsg = ''
    },
    // 高级认证弹窗
    authenticationMethod () {
      // 判断是否高级认证&&实名认证
      if (this.realNameInformationObj.realnameAuth == true && this.realNameInformationObj.advancedAuth == false) {
        this.seniorAuthentication = true
      }
    },
    // 高级认证内容
    authenticationAuthentication () {
      // 点击进入高级认证时隐藏弹窗
      if (this.realNameInformationObj.advancedAuth == false) {
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
        this.getRealNameInformation()
        this.dialogImageFrontUrl = ''
        this.dialogImageReverseSideUrl = ''
        this.dialogImageHandUrl = ''
      }
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
      userInfo: state => state.user.loginStep1Info // 用户详细信息
    })
  },
  watch: {}
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
      margin-right: 23px;
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
            height: 113px;
            position: relative;
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
          margin: 200px auto 83px;
          border-radius:4px;
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
      .header-border {
        border-bottom: 1px solid #39424D;
      }
      .authentication-type {
        color: #0099FF;
      }
      .authentication-type-info {
        >.authentication-info {
          color: #0099FF;
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
        color: #9DA5B3;
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
          color: #8BA0CA;
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
      background-color: #ccc;
      .header-content{
        color: #333;
      }
    }
    .identity-background{
      background-color: #ccc;
    }
    >.advanced-certification-main{
      .header-border {
        border-bottom: 1px solid #aaa;
      }
      .authentication-type {
        color: #333;
        >.icon-down{
          color: #ccc;
        }
      }
      .upload-submit{
        border: 1px solid #ccc;
        color: #333;
      }
      .submit-information {
        background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
        color: #333;
      }
      .text-hints {
        color: #333;
      }
      .icon-font-color {
        color: #333;
      }
      .info-type {
        color: #555;
      }
      .user-info {;
        color: #000;
      }
      .advanced-certification-text{
        >.text-tips{
          color: #ccc;
          >.tips-refresh{
            color: #ccc;
          }
        }
      }
    }
  }
}
</style>
