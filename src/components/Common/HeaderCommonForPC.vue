<template>
  <div
    class="nav-box common"
    :class="{'day':theme == 'day','night':theme == 'night' }"
    :style="{
      top:$route.path==='/home'&&noticeCloseVisible ? `${styleTop}px` : 0
    }"
  >
    <div class="inner-box">
      <div
        class="top"
        :style="{
          padding: $route.path==='/home'? topPadding : '0 30px',
          backgroundColor: $route.path==='/home'? topBackgroundColor : $mainNightBgColor
        }"
      >
        <!--导航-->
        <div class="left nav">
          <ul class="nav-list">
            <li class="nav-item">
              <router-link
                to="/"
                class="logo"
              >
                <img
                  class="img"
                 :src="logoSrc"
                >
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/TradeCenter">
                <!--<span>币币交易</span>-->
                 <span>{{$t('M.comm_trade_center')}}</span>
              </router-link>
            </li>
            <li
              class="nav-item"
              @mouseenter="toggleShowSubNavBox('otc',1)"
              @mouseleave="toggleShowSubNavBox('otc',0)"
            >
              <router-link to="/OTCCenter">
                <!--<span>OTC交易</span>-->
                <span>{{$t('M.comm_otc_center')}}</span>
              </router-link>
              <!--otc子导航-->
              <!-- yuxia改的子导航显示 -->
              <ul
                class="sub-nav-list otc"
                v-show="$route.path.indexOf('OTC') != -1"
                >
                <li class="sub-nav-item">
                  <router-link to="/OTCBusinessApply">
                    <!--商家申请-->
                    {{$t('M.comm_business_application')}}
                  </router-link>
                </li>
                <li class="sub-nav-item">
                  <router-link to="/OTCPublishAD">
                    <!--发布广告-->
                    {{$t('M.otc_merchant_publishAD')}}
                  </router-link>
                </li>
                <li class="sub-nav-item">
                  <router-link to="/OTCADManage">
                    <!--广告管理-->
                    {{$t('M.otc_adMange')}}
                  </router-link>
                </li>
                <li class="sub-nav-item">
                  <router-link to="/OTCMerchantsOrders">
                    <!--商家订单-->
                    {{$t('M.otc_MerchantsOrders')}}
                  </router-link>
                </li>
                <li class="sub-nav-item">
                  <router-link to="/OTCReportFormStatistics">
                    <!--报表统计-->
                    {{$t('M.otc_formStatistics')}}
                  </router-link>
                </li>
              </ul>
            </li>
            <li class="nav-item">
              <router-link to="/FinanceCenter">
                <!--<span>投资理财</span>-->
                <span>{{$t('M.comm_finance_center')}}</span>
              </router-link>
            </li>
            <li
              class="nav-item"
              @mouseenter="toggleShowSubNavBox('activity',1)"
              @mouseleave="toggleShowSubNavBox('activity',0)"
            >
              <router-link to="/ActivityCenter">
                <!--<span>活动中心</span>-->
                <span>{{$t('M.comm_activity_center')}}</span>
              </router-link>
              <!--活动中心子导航-->
              <ul
                class="sub-nav-list activity-center"
                v-show="$route.path ==='/ActivityCenter'||$route.path ==='/CurrencyApplication'||$route.path==='/RankingListOfInvitation'"
              >
                <li class="sub-nav-item">
                  <router-link to="/CurrencyApplication">
                    <!--上币申请-->
                    {{$t('M.coin_apply')}}
                  </router-link>
                </li>
                <li class="sub-nav-item">
                  <router-link to="/RankingListOfInvitation">
                    <!--邀请排行-->
                    {{$t('M.comm_invitation_list')}}
                  </router-link>
                </li>
              </ul>
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
                <!--<span>登录</span>-->
                <span>{{$t('M.comm_login')}}</span>
              </router-link>
            </li>
            <li class="li-split"></li>
            <li
              class="li-item"
              v-if="!isLogin"
            >
              <router-link to="/register">
                <!--<span>注册</span>-->
                <span>{{$t('M.comm_register_time')}}</span>
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
                      <p class="nav-vip">
                        <!--VIP享手续费、提现优惠-->
                        {{$t('M.user_vip_text8')}}
                      </p>
                      <button
                        v-if="!userInfo.level"
                        class="nav-button"
                        @click="stateOpenVip"
                      >
                        <!--立即开通-->
                        {{$t('M.user_vip_immediately_opened')}}
                      </button>
                       <button
                         v-else
                         class="nav-button"
                         @click="stateOpenVip"
                       >
                        <!--查看我的VIP-->
                         {{$t('M.user_vip_look')}}
                      </button>
                    </div>
                    <ul class="personal-user">
                      <li @click="stateReturnSuperior('account-balance')">
                        <!--账户资产-->
                        {{$t('M.comm_user_account_balance')}}
                      </li>
                      <li @click="stateReturnSuperior('order-management')">
                        <!--订单管理-->
                        {{$t('M.comm_user_order_management')}}
                      </li>
                      <li @click="stateReturnSuperior('identity-authentication')">
                        <!--身份认证-->
                        {{$t('M.comm_user_identity_authentication')}}
                      </li>
                      <li @click="stateReturnSuperior('security-center')">
                        <!--安全中心-->
                        {{$t('M.comm_user_security_center')}}
                      </li>
                      <li @click="stateReturnSuperior('receiving-set')">
                        <!--收款设置-->
                        {{$t('M.comm_user_receiving_set')}}
                      </li>
                      <li @click="stateReturnSuperior('invite')">
                        <!--邀请推广-->
                        {{$t('M.comm_user_invite_generalize')}}
                      </li>
                      <li @click="stateReturnSuperior('api')">
                        <!--API管理-->
                        {{$t('M.comm_user_api_management')}}
                      </li>
                      <li @click="userLoginOut">
                        <!--退出-->
                        {{$t('M.comm_retreat')}}
                      </li>
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
                >
                  <span class="language-text">{{activeLanguage.name}}</span>
                  <i class="el-icon-caret-bottom"></i>
                </dt>
                <el-collapse-transition>
                  <dd
                    class="lang-list"
                    v-show="langSelecting"
                  >
                    <button
                      class="lang-item"
                      @click="changeLanguage(item)"
                      v-for="(item,index) in languageList"
                      :key="index"
                    >
                      {{item.name}}
                    </button>
                  </dd>
                </el-collapse-transition>
              </dl>
            </li>
          </ul>
        </div>
      </div>
      <!-- yuxia改的bottom的显示条件 -->
      <div
        class="bottom"
        v-show="
        $route.path.indexOf('OTC') != -1 ||
        $route.path === '/ActivityCenter' ||
         $route.path === '/CurrencyApplication'||
         $route.path === '/RankingListOfInvitation'"
      >
      </div>
      <div class="box">
        <!--设置弹窗-->
        <el-dialog
          :title="$t(settingBoxTitle)"
          :visible.sync="showSetting"
          width="470px"
          :class="{day:theme=='day',night:theme=='night' }"
          class="nav-box-dialog"
        >
          <p class="title line-height50 font-size14">
            <!--折算货币-->
            {{$t('M.comm_convert_currency')}}
          </p>
          <!-- 折算货币选择 -->
          <!--请选择-->
          <el-select
            :no-data-text="$t('M.comm_no_data')"
            v-model="activeConvertCurrency"
            :placeholder="$t('M.comm_please_choose')"
          >
            <el-option
              v-for="item in convertCurrencyList"
              :key="item.shortName"
              :label="language=='zh_CN' ? item.name : item.shortName"
              :value="item.shortName">
            </el-option>
          </el-select>
          <p class="title line-height50 font-size14">
            <!--主题-->
            {{$t('M.comm_theme')}}
          </p>
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
              {{$t(item.label)}}
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
            >
              <!--确 定-->
              {{$t('M.comm_confirm')}}
            </el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import {getMerchantAvailablelegalTender} from '../../utils/api/OTC'
import {userLoginOut} from '../../utils/api/user'
import IconFontCommon from '../Common/IconFontCommon'
import {
  returnAjaxMsg,
  getNestedData
} from '../../utils/commonFunc'
import {
  getStore,
  setStore
} from '../../utils'
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations, mapActions } = createNamespacedHelpers('common')
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
      settingBoxTitle: 'M.comm_set', // 设置
      // 折算货币列表
      convertCurrencyList: [],
      // 语言列表
      languageList: [],
      // 当前折算货币
      activeConvertCurrency: '',
      activeConvertCurrencyObj: {}, // 当前折算货币obj
      // 主题列表
      themeList: [
        {
          label: 'M.comm_black', // 黑色
          value: 'night'
        },
        {
          label: 'M.comm_white', // 白色
          value: 'day'
        }
      ],
      activeTheme: '',
      // otc 子导航显示状态
      // otcSubNavStatus: false,
      // 任付伟大改动的：otc 子导航显示状态默认先显示，为了方便点击
      otcSubNavStatus: true,
      // 活动中心子导航显示状态
      activityCenterSubNavStatus: false,
      styleTop: 30,
      topPadding: '0 30px',
      topBackgroundColor: 'rgba(0,0,0,0.7)'
    }
  },
  async created () {
    require('../../../static/css/theme/day/Common/HeaderCommonDay.css')
    // 获取 语言列表
    await this.GET_LANGUAGE_LIST_ACTION({
      self: this
    })
    console.log(this.language)
    await this.SET_PARTNER_INFO_ACTION({
      self: this,
      language: this.language
    })
    await this.GET_COUNTRY_LIST_ACTION({
      self: this
    })
    this.activeTheme = this.theme
    // 查询某商户可用法币币种列表
    // 折算货币s
    await this.getMerchantAvailablelegalTenderList()
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    ...mapActions([
      'GET_COUNTRY_LIST_ACTION',
      'GET_TRANSITION_RATE_ACTION',
      'GET_LANGUAGE_LIST_ACTION',
      'SET_PARTNER_INFO_ACTION'
    ]),
    ...mapMutations([
      // 修改语言
      'CHANGE_LANGUAGE',
      // 修改折算货币
      'CHANGE_CONVERT_CURRENCY',
      // 修改主题
      'CHANGE_THEME',
      // 更新当前汇率列表
      'CHANGE_CURRENCY_RATE_LIST',
      'SET_COUNTRY_AREA_LIST',
      'USER_INFORMATION_REFRESH',
      'SET_USER_INFO_REFRESH_STATUS',
      'CHANGE_REF_SECURITY_CENTER_INFO',
      'SET_FOOTER_INFO',
      'SET_LOGO_URL'
    ]),
    reflashUserInfo () {
      this.$store.dispatch('user/REFLASH_USER_INFO', this)
    },
    handleScroll () {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop > 0) {
        this.styleTop = 0
        this.topPadding = '0 10%'
        this.topBackgroundColor = this.$mainNightBgColor
      } else {
        this.styleTop = 30
        this.topPadding = '0 30px'
        this.topBackgroundColor = 'rgba(0,0,0,.5)'
      }
    },
    // 更改当前选中汇率转换货币
    async changeActiveTransitionCurrency () {
      const params = {
        shortName: this.activeConvertCurrency || getStore('convertCurrency')
      }
      this.convertCurrencyList.forEach((item) => {
        if (item.shortName === params.shortName) {
          console.log(item.shortName)
          setStore('convertCurrency', item.shortName)
          this.activeConvertCurrencyObj = item
          return false
        }
      })
      await this.GET_TRANSITION_RATE_ACTION({
        params,
        self: this,
        activeConvertCurrencyObj: this.activeConvertCurrencyObj
      })
    },
    // 设置个人中心跳转
    setPersonalJump (target) {
      this.$store.commit('personal/CHANGE_USER_CENTER_ACTIVE_NAME', target)
    },
    // 开启vip
    stateOpenVip () {
      if (this.userInfo.payPassword) {
        this.$router.push({path: '/VipMainContent'})
      } else {
        this.$router.push({path: '/TransactionPassword'})
      }
    },
    // 用户跳转到指定页面
    stateReturnSuperior (val) {
      if (this.userInfo.payPassword) {
        switch (val) {
          case 'account-balance':
            this.setPersonalJump('assets')
            break
          case 'order-management':
            this.setPersonalJump('coin-orders')
            break
          case 'identity-authentication':
            this.setPersonalJump('identity-authentication')
            break
          case 'security-center':
            this.setPersonalJump('security-center')
            this.$store.commit('personal/CHANGE_REF_SECURITY_CENTER_INFO', true)
            break
          case 'receiving-set':
            this.$store.commit('personal/CHANGE_REF_ACCOUNT_CREDITED_STATE', true)
            this.setPersonalJump('account-credited')
            break
          case 'invite':
            this.setPersonalJump('invitation-promote')
            break
          case 'api':
            this.setPersonalJump('api-management')
            break
        }
        this.$router.push({path: '/PersonalCenter'})
      } else {
        this.$router.push({path: '/TransactionPassword'})
      }
    },
    // 用户登出
    async userLoginOut () {
      const data = await userLoginOut()
      if (!returnAjaxMsg(data, this)) {
        return false
      } else {
        this.$store.commit('user/USER_LOGOUT')
        this.$router.push({path: '/home'})
      }
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
      this.$i18n.locale = e.shortName
    },
    // 切换主题
    changeTheme (e) {
      console.log(e)
    },
    // 更改设置
    async changeSetting () {
      // 主题设置
      this.CHANGE_THEME(this.activeTheme)
      document.body.classList.remove('day')
      document.body.classList.remove('night')
      document.body.classList.add(this.activeTheme)
      // 汇率转换设置
      await this.changeActiveTransitionCurrency()
      this.CHANGE_CONVERT_CURRENCY(this.activeConvertCurrency)
      this.toggleShowSettingBox(0)
    },
    // 查询某商户可用法币币种列表
    async getMerchantAvailablelegalTenderList () {
      let data = await getMerchantAvailablelegalTender({})
      if (!returnAjaxMsg(data)) {
        return false
      } else {
        // 返回数据正确的逻辑
        this.convertCurrencyList = getNestedData(data, 'data.data')
        await this.changeActiveTransitionCurrency()
      }
      // if (data.data.meta.code !== 200) {
      //   this.$message({
      //     message: data.data.meta.message,
      //     type: 'error',
      //     center: true
      //   })
      //   return false
      // }
    },
    setNewTitle () {
      if (this.title) {
        let newTitle = `${this.middleTopData.last} ${this.middleTopData.sellsymbol}/${this.middleTopData.area} ${this.title}`
        document.querySelector('title').innerText = newTitle
      } else {
        setTimeout(this.setNewTitle, 1000)
      }
    }
  },
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language,
      defaultLanguage: state => state.common.defaultLanguage,
      isLogin: state => state.user.isLogin,
      middleTopData: state => state.trade.middleTopData, // 当前交易对数据
      middleTopDataPrice: state => state.trade.middleTopData.last, // 当前交易对数据
      userInfo: state => state.user.loginStep1Info.userInfo,
      activeLanguage: state => state.common.activeLanguage,
      userInfoRefreshStatus: state => state.common.userInfoRefreshStatus,
      logoSrc: state => state.common.logoSrc,
      title: state => state.common.title, // 网站title
      $mainNightBgColor: state => state.common.mainColor.$mainNightBgColor,
      noticeCloseVisible: state => state.home.noticeCloseVisible
    })
  },
  watch: {
    defaultLanguage (newVal) {
      this.$i18n.locale = newVal
    },
    async language () {
      await this.SET_PARTNER_INFO_ACTION({
        self: this,
        language: this.language
      })
    },
    middleTopDataPrice () {
      this.setNewTitle()
    },
    userInfoRefreshStatus (newVal) {
      if (newVal) {
        if (this.isLogin) {
          this.reflashUserInfo()
        }
        this.SET_USER_INFO_REFRESH_STATUS(false)
      }
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../../static/css/scss/index";
.nav-box{
  position: fixed;
  z-index: 2008;
  width:100%;
  min-width:1100px;
  box-sizing: border-box;
  transition: all .5s;
  >.inner-box{
    height:100%;
    >.top{
      height:66px;
      line-height: 66px;
      display:flex;
      transition: all 0.5s;
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
            transition: all .5s;
            &:first-of-type{
              padding-left:0;
            }
            /*子导航list*/
            >.sub-nav-list{
              width:100%;
              height:36px;
              line-height:36px;
              background-color: $nightSubNavBgColor;
              box-sizing: border-box;
              position: absolute;
              text-align: left;
              &:before{
                position: absolute;
                content:'';
                width:0;
                height:0;
                border:8px solid transparent;
                border-bottom-color:$nightSubNavBgColor;
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
                  background-color: #21243a;
                }
                >a{
                  color:#8494A6;
                }
              }
            }
            &:hover{
              background-color: #1B2136;
              >a{
                color:$mainColor;
              }
            }
            >a{
              color:$headerNavFontColor;
              display: inline-block;
              width: 100%;
              height: 100%;
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
                    // height: 50px;
                    // line-height: 50px;
                    line-height: 20px;
                    margin-top: 16px;
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
              cursor: pointer;
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
                  /*width:60px;*/
                }
              }
              >.lang-list{
                background-color: #2A3242;
                position: absolute;
                z-index: 2;
                left:0;
                top:64px;
                >.lang-item{
                  transition: all 1s;
                  color:#fff;
                  display:block;
                  height:30px;
                  line-height:30px;
                  text-align: left;
                  padding:0 20px 0 10px;
                  cursor: pointer;
                  width:100%;
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
      background-color: $nightSubNavBgColor;
      /*background-color: #f40;*/
      height:36px;
      position: absolute;
      top:66px;
      width:100%;
      z-index: 1;
    }
  }
  &.day{
    >.inner-box{
      >.top{
        >.left{
          >.nav-list{
            >.nav-item{
              &:first-of-type{
              }
              /*子导航list*/
              >.sub-nav-list{
                &:before{
                }
                /*otc子导航*/
                &.otc{
                }
                /*活动中心子导航*/
                &.activity-center{
                }
                >.sub-nav-item{
                  &:hover{
                  }
                  >a{
                  }
                }
              }
              &:hover{
              }
              >a{
              }
              >.logo{
                >.img{
                }
              }
            }
          }
        }
        >.right{
          >.ul-list{
            >.li-split{
            }
            >.li-item{
              /*用户登陆后鼠标悬浮出现个人中心效果*/
              .login{
                >.username{
                }
                >.login-info{
                  >.sub-nav-user{
                    >.nav-vip{
                    }
                    >.nav-button{
                    }
                  }
                  >.personal-user {
                    >li{
                      &:hover {
                      }
                    }
                  }
                }
                &:hover .login-info{
                }
              }
              >a{
                &:hover{
                }
              }
              &.setting-li{
              }
              /*设置*/
              .setting{
              }
              /*语言选择 dl*/
              >.lang-box{
                /*当前语言 dt*/
                >.lang-selected{
                  >.icon{
                  }
                  >.language-text{
                  }
                }
                >.lang-list{
                  background-color: #fff;
                  >.lang-item{
                    color: #7d90ac;
                    &:hover{
                      color:#fff;
                    }
                    >.icon{
                    }
                  }
                }
              }
            }
          }
        }
      }
      >.bottom{
      }
    }
  }
}
</style>
