<template>
  <div
    class="security-center personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="security-header security-background personal-height40 line-height40 font-size16 padding-left20">
      <span class="padding-left15 font-weight600">安全中心</span>
    </header>
    <div class="security-information security-background margin-top9 padding20 box-sizing">
      <div class="security-title">
        <div class="display-flex">
          <div class="security-title-info flex1 display-flex font-size14">
          <span class="flex1 security-level">
            账号安全级别：
            <span class="level">中</span>
          </span>
            <span class="flex1"><el-progress :percentage="70"></el-progress></span>
            <span class="flex1 security-verification">建议开启双重验证</span>
          </div>
          <div class="security-title-info flex1"></div>
        </div>
        <div class="security-title-info margin-top20 font-size12">
          <div class="login-time float-left">
            <span>上次登录时间：</span>
            <span>2015-10-01 12:12:12</span>
          </div>
          <div class="login-ip float-left">
            <span>IP：</span>
            <span>202.102.224.68</span>
          </div>
          <div class="login-address">
            <span>归属：</span>
            <span>河南省网通机房</span>
          </div>
        </div>
      </div>
    </div>
    <div class="security-setting security-background margin-top9">
      <header class="security-setting-header line-height50 margin20 font-size16">
        安全设置
      </header>
      <div class="security-setting-box">
        <!--安全邮箱-->
        <div class="security-type setting-type-box margin20 padding-tb20 display-flex">
          <div class="security-type-icon line-height40">
            <IconFontCommon
              class="font-size26"
              iconName="icon-youxiang1-copy"
            />
          </div>
          <div class="security-type-text padding-l15 box-sizing">
            <p>
              <span class="secure-email font-size14">安全邮箱</span>
              <IconFontCommon
                class="font-size16"
                iconName="icon-wuuiconsuotanhao-copy"
              />
            </p>
            <p class="security-info margin-top9 font-size12">
              用于提币、找回密码、修改安全设置、管理API时进行安全验证。
            </p>
          </div>
          <div class="security-status text-align-r">
            <button class="security-verify border-radius2 font-size12 cursor-pointer">
              <span>开启验证</span>
              <!--<span>关闭验证</span>-->
            </button>
            <button
              v-if="!getStatusUserInfo.emailBind"
              class="security-binding border-radius2 font-size12 cursor-pointer"
              @click="setShowStatusSecurity(1)"
            >
              绑定
            </button>
            <span v-else></span>
          </div>
        </div>
        <!--安全手机-->
        <div class="security-type setting-type-box margin20 padding-tb20 display-flex">
          <div class="security-type-icon line-height40">
            <IconFontCommon
              class="font-size30"
              iconName="icon-shouji-copy"
            />
          </div>
          <div class="security-type-text padding-l15 box-sizing">
            <p>
              <span class="secure-email font-size14">安全手机</span>
              <IconFontCommon
                class="font-size16"
                iconName="icon-wuuiconsuotanhao-copy"
              />
            </p>
            <p class="security-info margin-top9 font-size12">
              用于提币、找回密码、修改安全设置、管理API时进行安全验证。
            </p>
          </div>
          <div class="security-status text-align-r">
            <button class="security-verify border-radius2 font-size12 cursor-pointer">
              <span>开启验证</span>
              <!--<span>关闭验证</span>-->
            </button>
            <button
              class="security-binding border-radius2 font-size12 cursor-pointer"
              @click="setShowStatusSecurity(2)"
            >
              <span v-if="!getStatusUserInfo.telePhoneBind">绑定</span>
              <span v-else>修改</span>
            </button>
          </div>
        </div>
        <!--谷歌验证-->
        <div class="security-type setting-type-box margin20 padding-tb20 display-flex">
          <div class="security-type-icon line-height40">
            <IconFontCommon
              class="font-size26 icon-success"
              iconName="icon-yanzheng-copy"
            />
          </div>
          <div class="security-type-text padding-l15 box-sizing">
            <p>
              <span class="secure-email font-size14">谷歌验证</span>
              <IconFontCommon
                class="font-size16"
                iconName="icon-wuuiconsuotanhao-copy"
              />
            </p>
            <p class="security-info margin-top9 font-size12">
              用于提币、找回密码、修改安全设置、管理API时进行安全验证。
            </p>
          </div>
          <div class="security-status text-align-r">
            <button class="security-verify border-radius2 font-size12 cursor-pointer">
              <span>开启验证</span>
              <!--<span>关闭验证</span>-->
            </button>
            <button
              class="security-binding border-radius2 font-size12 cursor-pointer"
              @click="setShowStatusSecurity(3)"
            >
              <span v-if="!getStatusUserInfo.googleBind">绑定</span>
              <span v-else>修改</span>
            </button>
          </div>
        </div>
        <!--交易密码-->
        <div class="security-type setting-type-box margin20 padding-tb20 display-flex">
          <div class="security-type-icon line-height40">
            <IconFontCommon
              class="font-size26 icon-success"
              iconName="icon-qian-copy"
            />
          </div>
          <div class="security-type-text padding-l15 box-sizing">
            <p>
              <span class="secure-email font-size14">交易密码</span>
              <IconFontCommon
                class="font-size16"
                iconName="icon-wuuiconsuotanhao-copy"
              />
            </p>
            <p class="security-info-text margin-top9 font-size12">
              交易密码用于账户交易，建议立即设置
            </p>
          </div>
          <div class="security-status text-align-r">
            <button
              class="security-binding border-radius2 font-size12 cursor-pointer"
              @click="setShowStatusSecurity(4)"
            >
              <span v-if="!getStatusUserInfo.tradePasswordType">设置</span>
              <span v-else>修改</span>
            </button>
          </div>
        </div>
        <!--登录密码-->
        <div class="security-type margin20 padding-tb20 display-flex">
          <div class="security-type-icon line-height40">
            <IconFontCommon
              class="font-size26 icon-success"
              iconName="icon-mima-copy"
            />
          </div>
          <div class="security-type-text padding-l15 box-sizing">
            <p>
              <span class="secure-email font-size14">登陆密码</span>
            </p>
            <p class="security-info margin-top9 font-size12">
              用于提币、找回密码、修改安全设置、管理API时进行安全验证。
            </p>
          </div>
          <div class="security-status text-align-r">
            <button
              class="security-binding border-radius2 font-size12 cursor-pointer"
              @click="setShowStatusSecurity(5)"
            >
              <span>重置</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="security-record security-background margin-top9">
      <el-tabs v-model="securityActiveName">
        <el-tab-pane label="最近登录记录" name="first">
          <el-table
            :data="logonRecord"
            style="width: 100%">
            <el-table-column
              prop="time"
              label="登陆时间">
            </el-table-column>
            <el-table-column
              prop="IP"
              label="登录IP">
            </el-table-column>
            <el-table-column
              prop="placeBelonging"
              label="归属地">
            </el-table-column>
            <el-table-column
              prop="source"
              label="来源">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="安全设置记录" name="second">
          <el-table
            :data="securityRecord"
            style="width: 100%">
            <el-table-column
              prop="time"
              label="登陆时间">
            </el-table-column>
            <el-table-column
              prop="name"
              label="设备名称">
            </el-table-column>
            <el-table-column
              prop="IP"
              label="登录IP">
            </el-table-column>
            <el-table-column
              prop="placeBelonging"
              label="归属地">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
import IconFontCommon from '../../Common/IconFontCommon'
export default {
  components: {
    IconFontCommon // 字体图标
  },
  // props,
  data () {
    return {
      securityActiveName: 'first', // 默认显示第一个
      // 最近登录记录
      logonRecord: [
        {
          time: '2016-05-02',
          IP: '登录IP',
          placeBelonging: '中国、香港九龙',
          source: 'WEB'
        },
        {
          time: '2016-05-02',
          IP: '登录IP',
          placeBelonging: '中国、香港九龙',
          source: 'WEB'
        },
        {
          time: '2016-05-02',
          IP: '登录IP',
          placeBelonging: '中国、香港九龙',
          source: 'WEB'
        },
        {
          time: '2016-05-02',
          IP: '登录IP',
          placeBelonging: '中国、香港九龙',
          source: 'WEB'
        }
      ],
      securityRecord: [
        {
          time: '2016-05-02',
          name: '设置交易密码',
          IP: '202.102.224.68',
          placeBelonging: '香港铜锣湾'
        },
        {
          time: '2016-05-02',
          name: '设置交易密码',
          IP: '202.102.224.68',
          placeBelonging: '香港铜锣湾'
        },
        {
          time: '2016-05-02',
          name: '设置交易密码',
          IP: '202.102.224.68',
          placeBelonging: '香港铜锣湾'
        },
        {
          time: '2016-05-02',
          name: '设置交易密码',
          IP: '202.102.224.68',
          placeBelonging: '香港铜锣湾'
        }
      ],
      getStatusUserInfo: {} // 个人信息
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/UserAssets/SecurityCenter.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/UserAssets/SecurityCenterDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/UserAssets/SecurityCenterNight.css')
    // 获取全局个人信息
    this.getStatusUserInfo = this.userInfo.data.user
    console.log(this.getStatusUserInfo)
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 路由跳转对应组件
    setShowStatusSecurity (val) {
      switch (val) {
        case 1:
          this.$router.push({path: '/SecureEmail'})
          break
        case 2:
          this.$router.push({path: '/AddWeChat'})
          break
        case 3:
          this.$router.push({path: '/AddSetAlipay'})
          break
        case 4:
          this.$router.push({path: '/AddSetPaypal'})
          break
        case 5:
          this.$router.push({path: '/AddWesternUnion'})
          break
      }
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
  @import "../../../../static/css/scss/Personal/UserAssets/SecurityCenter";
  .security-center{
    >.security-information{
      height: 100px;
      .security-title-info {
        >.login-time {
          width: 290px;
        }
        >.login-ip {
          width: 200px;
        }
      }
    }
    >.security-setting{
      height: 510px;
      >.security-setting-header {
        height: 50px;
      }
      >.security-setting-box {
        .security-type-icon {
          width: 30px;
        }
        .security-type-text {
          flex: 5;
          .secure-email {
            margin-right: 5px;
          }
        }
        .security-status {
          flex: 2;
          padding-top: 6px;
          >.security-verify,
          >.security-binding {
            width: 70px;
            height: 30px;
          }
          >.security-binding {
            margin-left: 18px;
          }
        }
      }
    }
    >.security-record{
      min-height: 200px;
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      >.security-background {
        background-color: #1E2636;
      }
      >.security-header {
        color: #338FF5;
      }
      .security-title-info {
        >.security-level {
          color: #fff;
          >.level {
            color: #F64D4D;
          }
        }
        >.security-verification {
          color: #9DA5B3;
        }
      }
      >.security-setting{
        .security-setting-header {
          border-bottom: 1px solid #39424D;
          color: #fff;
        }
        .security-setting-box {
          >.setting-type-box {
            border-bottom: 1px solid #39424D;
          }
          >.security-type {
            .security-type-text {
              .secure-email {
                color: #fff;
              }
              >.security-info {
                color: #A9BED4;
              }
              >.security-info-text {
                color: #F57474;
              }
            }
            .security-status {
              >.security-verify {
                background:linear-gradient(90deg,rgba(43,57,110,1),rgba(42,80,130,1));
                color: #fff;
              }
              >.security-binding {
                border: 1px solid #338FF5;
                color: #338FF5;
              }
            }
          }
        }
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      >.security-background{
        background-color: #1E2636;
      }
      >.security-header {
        color: #338FF5;
      }
    }
  }
</style>
