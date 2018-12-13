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
                <li
                  class="sub-nav-item"
                  @click="applyMerchant"
                >
                  <router-link to="/OTCPublishAD">
                    <!--发布广告-->
                    {{$t('M.otc_merchant_publishAD')}}
                  </router-link>
                </li>
                <li
                  class="sub-nav-item"
                  @click="applyMerchant"
                >
                  <router-link to="/OTCADManage">
                    <!--广告管理-->
                    {{$t('M.otc_adMange')}}
                  </router-link>
                </li>
                <li
                  class="sub-nav-item"
                  @click="applyMerchant"
                >
                  <router-link to="/OTCMerchantsOrders">
                    <!--商家订单-->
                    {{$t('M.otc_MerchantsOrders')}}
                  </router-link>
                </li>
                <li
                  class="sub-nav-item"
                  @click="applyMerchant"
                >
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
                    {{$t('M.actionCenter_coin_apply')}}
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
      <!-- 非商家禁止进入OTC导航页提示框 -->
      <div class="apply-merchant-dialog">
        <!--温馨提示-->
        <el-dialog
          :title="$t('M.otc_apply_tips1')"
          :visible.sync="showApplyMerchantStatus"
          top="30vh"
        >
          <div class="tips">
            <!--您需要先申请成为商家才能使用此功能！-->
            <p class="content">{{$t('M.otc_apply_tips2')}}</p>
          </div>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              type="primary"
              @click="cancelApply"
            >
              <!--取消-->
              {{$t('M.comm_cancel')}}
            </el-button>
            <el-button
              type="primary"
              @click="confirmApply"
            >
              {{$t('M.actionCenter_Token_step1')}}
              <!--申请-->
            </el-button>
            </span>
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
  setStore,
  getCookieWithJSON
} from '../../utils'
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations, mapActions } = createNamespacedHelpers('common')
export default{
  components: {
    IconFontCommon
  },
  data () {
    return {
      showApplyMerchantStatus: false, // 是否显示申请商家弹窗
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
    if (getStore('convertCurrency')) {
      this.activeConvertCurrency = getStore('convertCurrency')
    }
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
    // 折算货币
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
    // 非商家禁止进入OTC导航页提示框--开始
    applyMerchant () {
      if (this.userInfo.type === 'COMMON') {
        // this.$router.push({path: '/OTCBusinessApply'})
        // this.$router.push({path: '/OTCCenter'})
        this.showApplyMerchantStatus = true
        return false
      } else {
      }
    },
    cancelApply () {
      this.showApplyMerchantStatus = false
    },
    confirmApply () {
      this.showApplyMerchantStatus = false
      this.$router.push({path: '/OTCBusinessApply'})
      // location.reload() // 重新刷新页面
    },
    // 非商家禁止进入OTC导航页提示框--结束
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
      if (this.localPayPwdSet || this.userInfo.payPassword) {
        this.$router.push({path: '/VipMainContent'})
      } else {
        this.$router.push({path: '/TransactionPassword'})
      }
    },
    // 用户跳转到指定页面
    async stateReturnSuperior (val) {
      console.log(this.localPayPwdSet)
      await this.$store.commit('user/REFLASH_USER_INFO', this)
      if (this.localPayPwdSet || this.userInfo.payPassword) {
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
      if (!returnAjaxMsg(data, this)) {
        return false
      } else {
        // 返回数据正确的逻辑
        this.convertCurrencyList = getNestedData(data, 'data.data')
        await this.changeActiveTransitionCurrency()
      }
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
      paypasswordSet: state => state.user.loginStep1Info.userInfo.paypasswordSet, // 用户是否已进入交易密码
      activeLanguage: state => state.common.activeLanguage,
      userInfoRefreshStatus: state => state.common.userInfoRefreshStatus,
      logoSrc: state => state.common.logoSrc,
      title: state => state.common.title, // 网站title
      $mainNightBgColor: state => state.common.mainColor.$mainNightBgColor,
      noticeCloseVisible: state => state.home.noticeCloseVisible
    }),
    localPayPwdSet () {
      return getNestedData(getCookieWithJSON('loginStep1Info'), 'userInfo.paypasswordSet') || this.paypasswordSet
    }
  },
  watch: {
    localPayPwdSet (newVal) {
      console.log(newVal)
    },
    activeLanguage (newVal) {
      console.log(newVal)
    },
    defaultLanguage (newVal) {
      this.$i18n.locale = newVal
    },
    async language (newVal) {
      console.log(newVal)
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

.nav-box {
  position: fixed;
  z-index: 2008;
  box-sizing: border-box;
  width: 100%;
  min-width: 1100px;
  transition: all .5s;

  > .inner-box {
    position: relative;
    height: 100%;

    > .top {
      display: flex;
      height: 66px;
      line-height: 66px;
      transition: all .5s;

      > .left {
        position: relative;
        z-index: 2;
        flex: 2;

        > .nav-list {
          height: 100%;

          > .nav-item {
            display: inline-block;
            height: 100%;
            padding: 0 2%;
            text-align: center;
            vertical-align: top;
            transition: all .5s;

            &:first-of-type {
              padding-left: 0;
            }

            /* 子导航list */
            > .sub-nav-list {
              position: absolute;
              box-sizing: border-box;
              width: 100%;
              height: 36px;
              line-height: 36px;
              text-align: left;
              background-color: $nightSubNavBgColor;

              &::before {
                position: absolute;
                top: -16px;
                left: 46px;
                width: 0;
                height: 0;
                border: 8px solid transparent;
                border-bottom-color: $nightSubNavBgColor;
                content: '';
              }

              /* otc子导航 */
              &.otc {
                left: 236px;
              }

              /* 活动中心子导航 */
              &.activity-center {
                left: 458px;
              }

              > .sub-nav-item {
                display: inline-block;
                height: 100%;
                padding: 0 25px;

                &:hover {
                  background-color: #21243a;
                }

                > a {
                  color: #8494a6;
                }
              }
            }

            &:hover {
              background-color: #1b2136;

              > a {
                color: $mainColor;
              }
            }

            > a {
              display: inline-block;
              width: 100%;
              height: 100%;
              color: $headerNavFontColor;
            }

            > .logo {
              display: inline-block;
              width: 100px;
              height: 66px;

              > .img {
                width: 100%;
                vertical-align: middle;
              }
            }
          }
        }
      }

      > .right {
        flex: 1;
        color: #fff;

        > .ul-list {
          height: 100%;
          text-align: right;

          > .li-split {
            display: inline-block;
            width: 1px;
            height: 20px;
            vertical-align: middle;
            background-color: #4a5260;
          }

          > .li-item {
            display: inline-block;

            /* padding:0 1%; */

            /* 用户登陆后鼠标悬浮出现个人中心效果 */
            .login {
              position: relative;
              display: inline-block;

              > .username {
                color: $mainColor;
              }

              > .login-info {
                position: absolute;
                z-index: 2;
                top: 66px;
                right: -100px;
                box-sizing: border-box;
                width: 210px;
                height: 0;
                padding: 0 25px;
                overflow: hidden;
                text-align: center;
                background-color: rgba(10, 27, 47, 1);

                > .sub-nav-user {
                  > .nav-vip {
                    margin-top: 16px;
                    // height: 50px;
                    // line-height: 50px;
                    line-height: 20px;
                  }

                  > .nav-button {
                    width: 100%;
                    height: 30px;
                    border: 1px solid rgba(0, 121, 254, 1);
                    border-radius: 5px;
                    color: #ccc;
                    cursor: pointer;
                  }
                }

                > .personal-user {
                  height: 40px;
                  line-height: 40px;
                  text-align: left;

                  > li {
                    &:hover {
                      color: rgba(0, 121, 254, 1);
                      cursor: pointer;
                    }
                  }
                }
              }

              &:hover .login-info {
                height: 450px;
                transition: .5s;
              }
            }

            > a {
              padding: 5px 10px;
              color: #fff;
              transition: all 1s;

              &:hover {
                background-color: $mainColor;
              }
            }

            &.setting-li {
              padding: 0;
            }

            /* 设置 */
            .setting {
              padding: 0;
              font-size: 20px;
              color: #fff;
              cursor: pointer;
            }

            /* 语言选择 dl */
            > .lang-box {
              position: relative;
              text-align: left;
              transition: all 1s;
              cursor: pointer;

              /* 当前语言 dt */
              > .lang-selected {
                display: inline-block;
                box-sizing: border-box;
                width: 100%;
                height: 30px;
                padding: 10px 12px;
                line-height: 0;

                > .icon {
                  margin-right: 5px;
                }

                > .language-text {
                  display: inline-block;

                  /* width:60px; */
                }
              }

              > .lang-list {
                position: absolute;
                z-index: 2;
                top: 64px;
                left: 0;
                background-color: #2a3242;

                > .lang-item {
                  display: block;
                  width: 100%;
                  height: 30px;
                  padding: 0 20px 0 10px;
                  line-height: 30px;
                  text-align: left;
                  color: #fff;
                  transition: all 1s;
                  cursor: pointer;

                  &:hover {
                    background-color: $mainColor;
                  }

                  > .icon {
                    margin-right: 5px;
                  }
                }
              }
            }
          }
        }
      }
    }

    > .bottom {
      position: absolute;
      z-index: 1;
      top: 66px;
      width: 100%;
      height: 36px;
      background-color: $nightSubNavBgColor;
    }

    /deep/ {
      .apply-merchant-dialog {
        .el-dialog {
          width: 350px;
          height: 207px;
          border-radius: 4px;

          .el-dialog__header {
            padding: 3px 20px;
            border-radius: 4px;

            .el-dialog__title {
              font-size: 16px;
              color: #338ff5 !important;
            }

            .el-dialog__headerbtn {
              top: 15px;
              right: 10px;
            }
          }

          .el-dialog__body {
            padding: 15px 20px 10px 30px;
            font-size: 12px;

            .tips {
              height: 80px;
              padding-top: 20px;
              font-size: 14px;
              color: #b8bdd0;

              > .content {
                line-height: 20px;
              }
            }
          }

          .el-dialog__footer {
            padding: 0 20px 0 0;

            .el-button {
              width: 90px;
              padding: 7px 20px;
              border: 0;

              &:first-child {
                border: 1px solid rgba(51, 143, 245, 1);
                color: #338ff5;
                background: #1c2237;
              }

              &:last-child {
                padding: 8px 21px;
              }
            }
          }
        }
      }
    }
  }

  &.day {
    > .inner-box {
      > .top {
        > .right {
          > .ul-list {
            > .li-item {
              /* 语言选择 dl */
              > .lang-box {
                > .lang-list {
                  background-color: #fff;

                  > .lang-item {
                    color: #7d90ac;

                    &:hover {
                      color: #fff;
                    }
                  }
                }
              }
            }
          }
        }
      }

      /deep/ {
        .apply-merchant-dialog {
          .el-dialog {
            .el-dialog__header {
              border-bottom: 1px solid #ecf1f8;
            }

            .el-dialog__body {
              .tips {
                color: #333;
              }
            }

            .el-dialog__footer {
              .el-button {
                &:first-child {
                  border: 1px solid rgba(51, 143, 245, 1);
                  color: #338ff5;
                  background: #fff;
                }
              }
            }
          }
        }
      }
    }

    /deep/ {
      .el-radio-button__inner {
        color: #333;
        background-color: #fff;
      }

      .nav-box-dialog {
        .el-dialog__title {
          padding: 0;
          color: #333;
        }

        .el-dialog,
        .el-dialog__header {
          background-color: #fff !important;
          box-shadow: none;
        }
      }
    }
  }

  /deep/ {
    .el-dialog__wrapper {
      background-color: rgba(0, 0, 0, .7);
    }
  }
}
</style>
