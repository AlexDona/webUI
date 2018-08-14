<template>
  <div
    class="identity-authentication personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="identity-header-background personal-height40 line-height40 font-size16">
      <span class="padding-left23">身份认证</span>
    </header>
    <div class="identity-authentication-main margin-top9">
      <!--实名认证-->
      <div class="real-name-authentication identity-background">
        <el-collapse v-model="activeNamesRealName">
          <el-collapse-item
            title="实名认证"
            name="1">
            <div class="name-authentication-content">
              <el-form
                ref="form"
                label-width="80px"
              >
                <el-form-item label="地区国家">
                  <el-select
                    v-model="regionalCountries"
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
                    v-model="regionalCountries"
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
                    v-model="realName" />
                </el-form-item>
                <el-form-item label="证件号码">
                  <input
                    class="common-input"
                    v-model="identification" />
                </el-form-item>
                <el-form-item>
                  <button
                    class="submit"
                    type="button"
                  >
                    提交认证
                  </button>
                </el-form-item>
              </el-form>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <!--高级认证-->
    <div class="advanced-certification-main identity-background margin-top9">
      <div
        class="advanced-main-header"
      >
        <p class="padding-left23" @click="authenticationMethod">
          <span class="font-size16 main-header-title">高级认证</span>
          <span
            v-if="!authenticationInfo.data.user.hasrealvaliDate"
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
          <i class="el-icon-arrow-down icon-down"></i>
        </p>
      </div>
      <div>
        <div v-show="authenticationStatusFront">
          <el-collapse-transition>
            <div class="transition-box">
              asdfasdfel-collapse-transition
            </div>
          </el-collapse-transition>
        </div>
        <div v-if="authenticationInfo.data.user.userIdentity == true">
          asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf是打发斯蒂芬撒大声地发生的发
        </div>
      </div>
      <el-dialog
        title="高级认证"
        :visible.sync="seniorAuthentication"
        name="1"
        center>
        <div class="advanced-certification-content">
          <img src="../../assets/user/er.png" alt="">
        </div>
        <div class="advanced-certification-text">
          <p class="text-tips">
            请准备好您本人身份证使用浏览器扫码进行高级认证如二维码过 期请刷新重试。
            <a class="tips-refresh" href="">点击刷新</a>
          </p>
          <p class="text-tips">
            请在浏览器中打开，并升级浏览器至最新版本,无法通过认证的用户，
            <span class="tips-refresh" @click="authenticationAuthentication">请点击这里</span>
          </p>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
export default {
  components: {},
  // props,
  data () {
    return {
      activeNamesRealName: '1', // 实名认证默认显示展开
      activeName: '1',
      regionalCountries: '', // 国家地区
      realName: '', // 真实姓名
      identification: '', // 证件号码
      seniorAuthentication: false, // 高级认证弹窗默认
      authenticationInfo: {}, // 个人信息
      authenticationCentent: false, // 高级认证页面
      authenticationStatusFront: false // 用户高级认证前
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../static/css/list/Personal/IdentityAuthentication.css')
    // 白色主题样式
    require('../../../static/css/theme/day/Personal/IdentityAuthenticationDay.css')
    // 黑色主题样式
    require('../../../static/css/theme/night/Personal/IdentityAuthenticationNight.css')
    // 获取全局个人信息
    this.authenticationInfo = this.userInfo
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 提交认证
    submit () {
      console.log('submit!')
    },
    // 高级认证弹窗
    authenticationMethod () {
      // 判断是否高级认证&&实名认证
      if (this.authenticationInfo.data.user.hasrealvaliDate == true && this.authenticationInfo.data.user.userIdentity == false) {
        this.seniorAuthentication = true
      }
    },
    // 高级认证内容
    authenticationAuthentication () {
      // 点击进入高级认证时隐藏弹窗
      if (this.authenticationInfo.data.user.userIdentity == false) {
        this.authenticationStatusFront = true
      }
      this.seniorAuthentication = false
      this.authenticationCentent = true
    }
  },
  filter: {},
  computed: {
    ...mapState([
      'theme',
      'userInfo'
    ])
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../static/css/scss/Personal/IdentityAuthentication.scss";
.identity-authentication{
  >.identity-authentication-main{
    background-color: #202A33;
    >.real-name-authentication{
      min-height: 120px;
      .name-authentication-content{
        width: 350px;
        padding-top: 28px;
        margin: 0 auto;
        .common-input,
        .submit {
          width: 270px;
          height: 38px;
          border-radius: 4px;
          padding-left: 20px;
          box-sizing: border-box;
        }
      }
    }
  }
  >.advanced-certification-main{
    .authentication-type {
      line-height: 56px;
      cursor: pointer;
    }
    .advanced-main-header{
      width: 100%;
      height: 56px;
      .padding-left23{
        .icon-down{
          font-size: 16px;
          float: right;
          line-height: 56px;
          padding-right: 30px;
        }
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
  }
  &.night{
    background-color: $nightBgColor;
    color:$nightFontColor;
    .identity-header-background{
      background-color: #212C36;
    }
    .identity-background{
      background-color: #202A33;
    }
    >.advanced-certification-main{
      .authentication-type {
        color: #0099FF;
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
    }
    .identity-background{
      background-color: #ccc;
    }
    >.advanced-certification-main{
      .authentication-type {
        color: #333;
        >.icon-down{
          color: #ccc;
        }
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
