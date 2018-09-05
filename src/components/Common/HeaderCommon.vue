<template>
  <div
    class="nav-box common"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="inner-box">
      <div class="top">
        <!--导航-->
        <div class="left nav">
          <ul class="nav-list">
            <li class="nav-item">
              <router-link
                to="/"
                class="logo"
              >
                <img class="img" :src="logoSrc" alt="">
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/TradeCenter">
                <span>币币交易</span>
                <!-- <span>{{$t('M.commonSuccess')}}</span> -->
              </router-link>
            </li>
            <li
              class="nav-item"
              @mouseenter="toggleShowSubNavBox('otc',1)"
              @mouseleave="toggleShowSubNavBox('otc',0)"
            >
            <!-- 任付伟改动：这是原来的 -->
            <!-- @mouseleave="toggleShowSubNavBox('otc',0)" -->
              <router-link to="/OTCCenter">
                <span>OTC交易</span>
              </router-link>
              <!--otc子导航-->
              <ul
                class="sub-nav-list otc"
                v-show="$route.path ==='/OTCCenter'"
              >
                <li class="sub-nav-item">
                  <router-link to="/OTCBusinessApply">商家申请</router-link>
                </li>
                <li class="sub-nav-item">
                  <router-link to="/OTCPublishAD">发布广告</router-link>
                </li>
                <li class="sub-nav-item">
                  <router-link to="/OTCADManage">广告管理</router-link>
                </li>
                <li class="sub-nav-item">
                  <router-link to="/OTCMerchantsOrders">商家订单</router-link>
                </li>
                <li class="sub-nav-item">
                  <router-link to="/OTCReportFormStatistics">报表统计</router-link>
                </li>
              </ul>
            </li>
            <li class="nav-item">
              <router-link to="/">
                <span>投资理财</span>
              </router-link>
            </li>
            <li
              class="nav-item"
              @mouseenter="toggleShowSubNavBox('activity',1)"
              @mouseleave="toggleShowSubNavBox('activity',0)"
            >
              <router-link to="/ActivityCenter">
                <span>活动中心</span>
              </router-link>
              <!--活动中心子导航-->
              <ul
                class="sub-nav-list activity-center"
                v-show="$route.path ==='/ActivityCenter'"
              >
                <li class="sub-nav-item">
                  <router-link to="/">新币投票</router-link>
                </li>
                <li class="sub-nav-item">
                  <router-link to="/">上币申请</router-link>
                </li>
                <li class="sub-nav-item">
                  <router-link to="/">邀请排行</router-link>
                </li>
              </ul>
            </li>
          <li class="nav-item">
            <router-link to="/PersonalCenter/first">
              <span>个人中心</span>
            </router-link>
          </li>
          </ul>
        </div>
        <!--注册登录-->
        <div class="right login">
          <ul class="ul-list">
            <li class="li-item setting-li">
              <!--设置（语言，换肤）-->
              <button
                class="setting"
                @click="toggleShowSettingBox(1)"
              >
                <IconFontCommon
                  class="font-size26"
                  iconName="icon-setting"
                />
              </button>
            </li>
            <li
              class="li-item"
              v-if="!isLogin"
            >
              <router-link to="/login">
                登录
              </router-link>
            </li>
            <li class="li-split"></li>
            <li
              class="li-item"
              v-if="!isLogin"
            >
              <router-link to="/Register">
                <span>注册</span>
              </router-link>
            </li>
            <li
              class="li-item"
              v-if="isLogin"
            >
              <span>
                <span
                  class="login cursor-pointer"
                  v-if="isLogin"
                >
                  <!--用户名-->
                  <span class="username">
                    {{userInfo.userName}}
                  </span>
                  <div class="login-info">
                    <div class="sub-nav-user">
                      <p class="nav-vip">VIP享手续费、提现优惠</p>
                      <button class="nav-button">立即开通</button>
                    </div>
                    <ul class="personal-user">
                      <li @click="stateReturnSuperior('account-balance')">账户资产</li>
                      <li @click="stateReturnSuperior('order-management')">订单管理</li>
                      <li @click="stateReturnSuperior('identity-authentication')">身份认证</li>
                      <li @click="stateReturnSuperior('security-center')">安全中心</li>
                      <li @click="stateReturnSuperior('receiving-set')">收款设置</li>
                      <li @click="stateReturnSuperior('invite')">邀请推广</li>
                      <li @click="stateReturnSuperior('api')">API管理</li>
                      <li @click="userLoginOut">退出</li>
                    </ul>
                  </div>
                </span>
              </span>
            </li>
            <!--切换语言-->
            <li class="li-item">
              <dl
                class="lang-box"
                @mouseenter="toggleShowLanguageBox(1)"
                @mouseleave="toggleShowLanguageBox(0)"
              >
                <dt
                  class="lang-selected"
                  v-show="language=='zh_CN'"
                >
                  <IconFontCommon
                    iconName="icon-zhongguo"
                  />
                  <span class="language-text">简体中文</span>
                  <i class="el-icon-caret-bottom
"></i>
                </dt>
                <dt
                  class="lang-selected"
                  v-show="language=='en_US'"
                >
                  <IconFontCommon
                    iconName="icon-yingguo"
                  />
                  <span class="language-text">English</span>
                  <i class="el-icon-caret-bottom
"></i>
                </dt>
                <dt
                  class="lang-selected"
                  v-show="language=='zh_TW'"
                >
                  <IconFontCommon
                    iconName="icon-fantizhongwen"
                  />
                  <span class="language-text">繁体中文</span>
                  <i class="el-icon-caret-bottom
"></i>
                </dt>
                <dt
                  class="lang-selected"
                  v-show="language=='ko_KR'"
                >
                  <IconFontCommon
                    iconName="icon-hanguo"
                  />
                  <span class="language-text">韩语</span>
                  <i class="el-icon-caret-bottom
"></i>
                </dt>
                <dd
                  class="lang-list"
                  v-show="langSelecting"
                >
                  <a
                    class="lang-item"
                    href="#"
                    @click="changeLanguage('zh_CN')"
                  >
                    <IconFontCommon
                      iconName="icon-zhongguo"
                    />
                    简体中文
                  </a>
                  <a
                    class="lang-item"
                    href="#"
                    @click="changeLanguage('en_US')"
                  >
                    <IconFontCommon
                      iconName="icon-yingguo"
                    />
                    English
                  </a>
                  <a
                    class="lang-item"
                    href="#"
                    @click="changeLanguage('zh_TW')"
                  >
                    <IconFontCommon
                      iconName="icon-fantizhongwen"
                    />
                    繁体中文
                  </a>
                  <a
                    class="lang-item"
                    href="#"
                    @click="changeLanguage('ko_KR')"
                  >
                    <IconFontCommon
                      iconName="icon-hanguo"
                    />
                    韩语
                  </a>
                </dd>
              </dl>
            </li>
          </ul>
        </div>
      </div>
      <div
        class="bottom"
        v-show="$route.path === '/OTCCenter' || $route.path === '/ActivityCenter'"
      >
      </div>
      <div class="box">
        <!--设置弹窗-->
        <el-dialog
          :title="settingBoxTitle"
          :visible.sync="showSetting"
          width="470px"
          :class="{day:theme=='day',night:theme=='night' }"
          class="nav-box-dialog"
        >
          <p class="title line-height50 font-size14">折算货币</p>
          <!-- 折算货币选择 -->
          <el-select
            v-model="activeConvertCurrency"
            placeholder="请选择"
          >
            <el-option
              v-for="item in convertCurrencyList"
              :key="item.id"
              :label="item.shortName"
              :value="item.id">
            </el-option>
          </el-select>
          <p class="title line-height50 font-size14">主题</p>
          <!-- 主题选择框 -->
          <el-radio-group
            @on-change="changeTheme"
            v-model="activeTheme">
            <el-radio-button
              v-for="(item,index) in themeList"
              :key="index"
              :label="item.value"
              border
            >
              {{item.label}}
              <i
                class="el-icon-check"
                v-show="activeTheme==item.value"
              ></i>
            </el-radio-button>
          </el-radio-group>
          <!--底部-->
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              size="large"
              type="primary"
              @click="changeSetting"
            >确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import {getMerchantAvailablelegalTender} from '../../utils/api/OTC'
import {getLanguageList} from '../../utils/api/header'
import IconFontCommon from '../Common/IconFontCommon'
import {setStore} from '../../utils'
// import {getPartnerList} from '../../utils/api/home'
import {
  returnAjaxMessage
} from '../../utils/commonFunc'
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations } = createNamespacedHelpers('personal')
// const { mapMutationsForUser } = createNamespacedHelpers('user')
// import {Io} from '../../utils/tradingview/socket'
export default{
  components: {
    IconFontCommon
  },
  data () {
    return {
      // 语言选择中
      langSelecting: false,
      // 设置弹窗状态
      showSetting: false,
      settingBoxTitle: '设置',
      // 折算货币列表
      convertCurrencyList: [
        // {
        //   createTime: '2018-08-06 11:01:13',
        //   id: '123',
        //   name: 'CNY',
        //   partnerId: '474629374641963008',
        //   shortName: '人民币',
        //   status: 'ENABLE',
        //   symbol: '￥',
        //   updateTime: '2018-08-06 11:01:16',
        //   version: 1
        // }
      ],
      // 当前折算货币
      activeConvertCurrency: '',
      // 主题列表
      themeList: [
        {
          label: '黑色',
          value: 'night'
        },
        {
          label: '白色',
          value: 'day'
        }
      ],
      activeTheme: '',
      // logo图片地址
      logoSrc: require('../../assets/develop/logo.png'),
      // otc 子导航显示状态
      // otcSubNavStatus: false,
      // 任付伟大改动的：otc 子导航显示状态默认先显示，为了方便点击
      otcSubNavStatus: true,
      // 活动中心子导航显示状态
      activityCenterSubNavStatus: false
    }
  },
  created () {
    // 获取 语言列表
    // this.getLanguageList()
    // console.log(this.theme)
    this.activeTheme = this.theme
    // 查询某商户可用法币币种列表
    // 默认登录
    if (this.loginStep1Info.userInfo) {
      this.$store.commit('user/USER_LOGIN', this.loginStep1Info)
    }
  },
  methods: {
    ...mapMutations([
      // 修改语言
      'CHANGE_LANGUAGE',
      // 修改折算货币
      'CHANGE_CONVERT_CURRENCY',
      // 修改主题
      'CHANGE_THEME',
      // 设置板块
      'CHANGE_PALTE_LIST',
      // 用户点击跳转指定页面
      'CHANGE_USER_CENTER_ACTIVE_NAME'
    ]),
    // 获取国家列表
    async getLanguageList () {
      const data = await getLanguageList()
      if (!returnAjaxMessage(data, this)) {
        return false
      } else {
        console.log(data)
      }
    },
    // ...mapMutationsForUser([
    //   ''
    // ]),
    // 获取板块列表
    // 用户跳转到指定页面
    stateReturnSuperior (val) {
      switch (val) {
        case 'account-balance':
          this.CHANGE_USER_CENTER_ACTIVE_NAME('assets')
          break
        case 'order-management':
          this.CHANGE_USER_CENTER_ACTIVE_NAME('coin-orders')
          break
        case 'identity-authentication':
          this.CHANGE_USER_CENTER_ACTIVE_NAME('identity-authentication')
          break
        case 'security-center':
          this.CHANGE_USER_CENTER_ACTIVE_NAME('security-center')
          break
        case 'receiving-set':
          this.CHANGE_USER_CENTER_ACTIVE_NAME('account-credited')
          break
        case 'invite':
          this.CHANGE_USER_CENTER_ACTIVE_NAME('invitation-promote')
          break
        case 'api':
          this.CHANGE_USER_CENTER_ACTIVE_NAME('api-management')
          break
      }
      // this.CHANGE_USER_CENTER_ACTIVE_NAME('account-credited')
    },
    // 用户登出
    userLoginOut () {
      console.log('logout')
      this.$store.commit('user/USER_LOGOUT')
    },
    // 显示状态切换（子导航）
    toggleShowSubNavBox (item, status) {
      switch (item) {
        case 'otc':
          this.otcSubNavStatus = status
          break
        case 'activity':
          this.activityCenterSubNavStatus = status
          break
      }
    },
    // 显示状态切换 （设置）
    toggleShowSettingBox (status) {
      console.log(Boolean(status))
      this.showSetting = Boolean(status)
    },
    // 显示状态切换 （语言）
    toggleShowLanguageBox (status) {
      this.langSelecting = Boolean(status)
    },
    // 切换语言
    changeLanguage (e) {
      this.CHANGE_LANGUAGE(e)
      this.$i18n.locale = e
    },
    // 切换主题
    changeTheme (e) {
      console.log(e)
    },
    // 更改设置
    changeSetting () {
      // console.log(this)
      this.CHANGE_THEME(this.activeTheme)
      setStore('theme', this.activeTheme)
      document.body.classList.remove('day')
      document.body.classList.remove('night')
      document.body.classList.add(this.activeTheme)
      this.CHANGE_CONVERT_CURRENCY(this.activeConvertCurrency)
      setStore('convertCurrency', this.activeConvertCurrency || 'CNY')
      this.toggleShowSettingBox(0)
    },
    // 查询某商户可用法币币种列表
    async getMerchantAvailablelegalTenderList () {
      let data
      data = await getMerchantAvailablelegalTender({
        partnerId: this.partnerId
      })
      console.log(data)
      if (data.data.meta.code !== 200) {
        this.$message({
          message: data.data.meta.message,
          type: 'error',
          center: true
        })
        return false
      }
      // 返回数据正确的逻辑
      this.convertCurrencyList = data.data.data
    }

  },
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language,
      isLogin: state => state.user.isLogin,
      loginStep1Info: state => state.user.loginStep1Info,
      userInfo: state => state.user.loginStep1Info.userInfo,
      partnerId: state => state.common.partnerId // 商户id
    })
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../../static/css/scss/Common/HeaderCommon.scss";
.nav-box{
  position: relative;
  top:0;
  z-index: 2008;
  width:100%;
  min-width:1100px;
  /*height:102px;*/
  box-sizing: border-box;
  /*top:30px;*/
  >.inner-box{
    height:100%;
    >.top{
      height:66px;
      line-height: 66px;
      display:flex;
      padding:0 30px;
      background-color: $dayNavBgColor;
      >.left{
        flex:2;
        position: relative;
        z-index: 2;
        >.nav-list{
          height:100%;
          >.nav-item{
            text-align: center;
            display: inline-block;
            padding:0 25px;
            height:100%;
            vertical-align: top;
            &:first-of-type{
              padding-left:0;
            }
            /*子导航list*/
            >.sub-nav-list{
              height:36px;
              line-height:36px;
              background-color: #292E42;
              box-sizing: border-box;
              position: absolute;
              text-align: left;
              &:before{
                position: absolute;
                content:'';
                width:0;
                height:0;
                border:8px solid transparent;
                border-bottom-color:#292E42;
                top:-16px;
                left:46px;
              }
              /*otc子导航*/
              &.otc{
                left:236px;
              }
              /*活动中心子导航*/
              &.activity-center{
                left:458px;
              }
              >.sub-nav-item{
                display: inline-block;
                height:100%;
                padding:0 25px;
                &:hover{
                  background-color: #1B2136;
                }
                >a{
                  color:#8494A6;
                }
              }
            }
            &:hover{
              background-color: #1B2136;
            }
            >a{
              color:$fontColor;
            }
            >.logo{
              display:inline-block;
              height:66px;
              width:100px;
              >.img{
                width:100%;
                vertical-align: middle;
              }
            }
          }
        }
      }
      >.right{
        color:#fff;
        flex:1;
        >.ul-list{
          height:100%;
          text-align: right;
          >.li-split{
            width:1px;
            height:20px;
            background-color: #4a5260;
            display:inline-block;
            vertical-align: middle;
          }
          >.li-item{
            display:inline-block;
            padding:0 10px;
            /*用户登陆后鼠标悬浮出现个人中心效果*/
            .login{
              display: inline-block;
              position: relative;
              >.username{
                color:$mainColor;
              }
              >.login-info{
                width: 210px;
                height: 0;
                background-color: rgba(10, 27, 47, 1);
                position: absolute;
                top: 66px;
                right: -100px;
                overflow: hidden;
                z-index: 2;
                text-align: center;
                padding: 0px 25px;
                box-sizing: border-box;
                >.sub-nav-user{
                  >.nav-vip{
                    height: 50px;
                    line-height: 50px;
                  }
                  >.nav-button{
                    width: 100%;
                    height: 30px;
                    border-radius: 5px;
                    color: #ccc;
                    border: 1px solid rgba(0, 121, 254, 1);
                    cursor: pointer;
                  }
                }
                >.personal-user {
                  height: 40px;
                  line-height: 40px;
                  text-align: left;
                    >li{
                    &:hover {
                      color: rgba(0, 121, 254, 1);
                      cursor: pointer;
                    }
                  }
                }
              }
              &:hover .login-info{
                height: 450px;
                transition: 0.5s;
              }
            }
            >a{
              transition: all 1s;
              color:#fff;
              padding:5px 10px;
              &:hover{
                background-color: $mainColor;
              }
            }
            &.setting-li{
              padding:0;
            }
            /*设置*/
            .setting{
              color:#fff;
              cursor:pointer;
              font-size: 20px;
              padding:0;
            }
            /*语言选择 dl*/
            >.lang-box{
              transition: all 1s;
              position: relative;
              text-align: left;
              /*当前语言 dt*/
              >.lang-selected{
                box-sizing: border-box;
                height: 30px;
                line-height: 0px;
                padding: 10px 12px;
                display: inline-block;
                width:100%;
                >.icon{
                  margin-right:5px;
                }
                >.language-text{
                  display:inline-block;
                  width:60px;
                }
              }
              >.lang-list{
                position: absolute;
                left:0;
                top:64px;
                >.lang-item{
                  transition: all 1s;
                  color:#fff;
                  display:block;
                  height:30px;
                  line-height:30px;
                  text-align: left;
                  width:100%;
                  padding:0 20px 0 10px;
                  &:hover{
                    background-color: $mainColor;
                  }
                  >.icon{
                    margin-right:5px;
                  }
                }
              }
            }
          }
        }
      }
    }
    >.bottom{
      background-color: #292e42;
      /*background-color: #f40;*/
      height:36px;
      position: absolute;
      top:66px;
      width:100%;
      z-index: 1;
    }
  }
  &.day{
  }
}
</style>
