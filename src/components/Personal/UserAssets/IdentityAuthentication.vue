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
                v-if="!authenticationInfo.hasrealvaliDate"
                class="authentication-type font-size12"
              >
                （请先通过实名认证）
              </p>
              <p
                v-else
                class="authentication-type-info font-size12 box-sizing"
              >
                <span class="authentication-info">您已通过实名认证</span>
                （&nbsp;
                <span class="type-info">
                  姓名：
                  {{ authenticationInfo.realName.substring(0,1)}}
                  *
                  {{ authenticationInfo.realName.substring(2,3)}}
                  <!--{{ authenticationInfo.realName }}-->
                </span>、
                <span class="type-info">
                  身份证号：
                   {{ authenticationInfo.identification.substring(0,6)}}
                  ****
                  {{ authenticationInfo.identification.substring(14,18)}}
                 <!-- {{  authenticationInfo.identification }}-->
                </span>
                &nbsp;）
              </p>
              <i class="el-icon-arrow-down icon-down float-right"></i>
            </div>
          </div>
      </div>
      <div
        v-if="!authenticationInfo.hasrealvaliDate"
        class="name-authentication-content margin-top9"
      >
        <el-form
          ref="form"
          label-width="80px"
        >
          <el-form-item label="地区国家">
            <el-select
              v-model="region"
              placeholder="请选择地区国家">
              <el-option
                label="中国"
                value="shanghai">
              </el-option>
              <el-option
                label="韩国"
                value="beijing">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="证件类型">
            <el-select
              v-model="documentType"
              placeholder="请选择证件类型">
              <el-option
                label="身份证"
                value="shanghai">
              </el-option>
              <el-option
                label="护照"
                value="beijing">
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
              @focus="emptyStatus"
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
            v-if="!authenticationInfo.hasrealvaliDate"
            class="authentication-type font-size12"
          >
            （请先通过实名认证）
          </span>
          <span
            v-else
            class="authentication-type font-size12"
          >
            （已实名认证）
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
                  <div class="default-center">
                    <!-- 上传身份证正面 -->
                    <input
                      style="display: none"
                      type="file"
                      id="firstFileInput"
                      accept="image/jpeg,image/jpg,image/png,image/bmp"
                      ref="firstFileInput"
                      @change="getPicture"
                    />
                    <div class="picture">
                      <img
                        class="default-picture cursor-pointer"
                        :src="firstPictureSrc"
                        @click="choosePicture(1)"
                      >
                    </div>
                  </div>
                  <!---->
                  <button
                    type="primary"
                    class="upload-submit cursor-pointer font-size12 margin-top30"
                    @click="choosePicture(1)"
                  >
                    上传身份证正面
                  </button>
                </div>
                <div class="upload">
                  <div class="default-center">
                    <!-- 上传身份证反面 -->
                    <input
                      class="upload-input"
                      type="file"
                      id="secondFileInput"
                      accept="image/jpeg,image/jpg,image/png,image/bmp"
                      ref="secondFileInput"
                      @change="getPicture"
                    />
                    <div class="picture">
                      <img
                        class="default-picture cursor-pointer"
                        :src="secondPictureSrc"
                        @click="choosePicture(2)"
                      >
                    </div>
                  </div>
                  <!---->
                  <button
                    type="primary"
                    class="upload-submit cursor-pointer font-size12 margin-top30"
                    @click="choosePicture(2)"
                  >
                    上传身份证反面
                  </button>
                </div>
                <div class="upload">
                  <div class="default-center">
                    <!-- 上传手持身份证 -->
                    <input
                      class="upload-input"
                      type="file"
                      id="thirdFileInput"
                      accept="image/jpeg,image/jpg,image/png,image/bmp"
                      ref="thirdFileInput"
                      @change="getPicture"
                    />
                    <div class="picture">
                      <img
                        class="default-picture cursor-pointer"
                        :src="thirdPictureSrc"
                        @click="choosePicture(3)"
                      >
                    </div>
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
                <!--@click="uploadAllPicture"-->
                <button
                  class="submit-information font-size16 cursor-pointer"
                >
                  提交
                </button>
              </div>
            </div>
          </el-collapse-transition>
        </div>
        <div
          class="success-after name-authentication-content"
          v-if="authenticationInfo.userIdentity == true"
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
import lrz from 'lrz'
export default {
  components: {
    IconFontCommon // 字体图标
  },
  // props,
  data () {
    return {
      region: '', // 国家地区
      documentType: '', // 证件类型
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
      isFirstPictureUploaded: false, // 上传身份证正面框
      isSecondPictureUploaded: false, // 上传身份证反面框
      isThirdPictureUploaded: false, // 上传手持身份证框
      formDataForFirstPicture: '', // 上传身份证正面
      formDataForSecondPicture: '', // 上传身份证反面
      formDataForThirdPicture: '' // 上传手持身份证
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
    this.authenticationInfo = this.userInfo.data.user
    // 清空图片和关闭弹窗this.clearUserPicture()
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 提交认证
    submitRealName () {
      if (!this.region) {
        this.errorMsg = '请选择地区国家'
        return
      } else if (!this.documentType) {
        this.errorMsg = '请选择证件类型'
        return
      } else if (!this.realName) {
        this.errorMsg = '真实姓名不能为空'
        return
      } else if (!this.identificationNumber) {
        this.errorMsg = '证件号码不能为空'
        return
      } else {
        this.errorMsg = ''
      }
      console.log('submitRealName')
    },
    // 清空内容信息
    emptyStatus () {
      this.errorMsg = ''
    },
    // 高级认证弹窗
    authenticationMethod () {
      // 判断是否高级认证&&实名认证
      if (this.authenticationInfo.hasrealvaliDate == true && this.authenticationInfo.userIdentity == false) {
        this.seniorAuthentication = true
      }
    },
    // 高级认证内容
    authenticationAuthentication () {
      // 点击进入高级认证时隐藏弹窗
      if (this.authenticationInfo.userIdentity == false) {
        this.authenticationStatusFront = true
      }
      this.seniorAuthentication = false
      this.authenticationContentStatus = true
    },
    // 选择图片文件
    choosePicture (index) {
      console.dir(this.$refs.firstFileInput)
      const FIRST_INPUT = this.$refs.firstFileInput
      const SECOND_INPUT = this.$refs.secondFileInput
      const THIRD_INPUT = this.$refs.thirdFileInput
      if (index === 1) {
        FIRST_INPUT.click()
      } else if (index == 2) {
        SECOND_INPUT.click()
      } else if (index == 3) {
        THIRD_INPUT.click()
      }
    },
    // 上传照片chang事件
    getPicture (e) {
      console.dir(e.target.id)
      const INPUT_ID = e.target.id
      console.dir(e.target.files[0])
      lrz(e.target.files[0]).then(res => {
        console.log(res)
        const size = this.bytesToSize(res.fileLen)
        console.log(size)
        // console.log(res.base64)
        // console.log(INPUT_ID)
        if (INPUT_ID === 'firstFileInput') {
          this.firstPictureSrc = res.base64
          this.formDataForFirstPicture = res.file
          console.log(this.firstPictureSrc)
          // this. = res.file
          this.isFirstPictureUploaded = true
        } else if (INPUT_ID === 'secondFileInput') {
          this.secondPictureSrc = res.base64
          this.formDataForSecondPicture = res.file
          this.isSecondPictureUploaded = true
        } else if (INPUT_ID === 'thirdFileInput') {
          this.thirdPictureSrc = res.base64
          this.formDataForThirdPicture = res.file
          this.isThirdPictureUploaded = true
        }
      })
    },
    // 清空用户数据
    // clearUserPicture () {
    //   this.firstPictureSrc = require('../../assets/user/card_negative.png')
    //   this.secondPictureSrc = require('../../assets/user/card_positive.png')
    //   this.thirdPictureSrc = require('../../assets/user/card_handheld.png')
    //   this.isFirstPictureUploaded = false
    //   this.isSecondPictureUploaded = false
    //   this.isThirdPictureUploaded = false
    // },
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
      userInfo: state => state.personal.userInfo
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
          margin: 95px auto 83px;
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
