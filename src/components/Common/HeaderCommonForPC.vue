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
            <li class="more-btn"
                @mouseenter="toggleMoreNavs(true)"
                @mouseleave="toggleMoreNavs(false)"
            >
              <!-- 更多 自定义导航-->
              <a
                class="more-nav-btn text-align-l"
                v-show="navigation.length > 5"
              >
                <TheMoreNavsButton
                  :isActive="isShowSubNav"
                />
              </a>
              <!-- 更多 自定义导航列表 -->
              <ul
                class="more-nav-list"
                v-show="isShowSubNav"
              >
                <li
                  v-for="(navItem, navIndex) in navigation.slice(5)"
                  :key="navIndex"
                  class="nav-item"
                  @mouseenter="changeMoreActiveNavIndex(navIndex)"
                  @mouseleave="changeMoreActiveNavIndex(-1)"
                >
                  <a
                    href="javascript:void(0);"
                    @click="navToJump(navItem)"
                  ><span>{{navItem.name}}</span></a>
                  <!-- 子导航 -->
                  <ul
                    class="sub-nav-list"
                    v-if="navItem.children"
                    v-show="activeMoreNavIndex === navIndex"
                    :style="{
                      top: `${40*navIndex}px`
                    }"
                  >
                    <li
                      class="sub-nav-item"
                      v-for="(subNav, subIndex) in navItem.children"
                      :key="subIndex"
                    >
                      <a
                        href="javascript:void(0);"
                        @click="navToJump(subNav)"
                      ><span>{{subNav.name}}</span></a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li
              class="nav-item"
              v-for="(navigationItem, index) in navigation.slice(0, 5)"
              :key="index"
              @mouseenter="changeActiveNavIndex(index)"
              @mouseleave="changeActiveNavIndex(-1)"
            >
              <a
                href="javascript:void(0);"
                @click="navToJump(navigationItem)"
              ><span>{{navigationItem.name}}</span></a>
              <ul
                class="sub-nav-list"
                v-if="navigationItem.children"
                v-show="index === activeNavIndex"
              >
                <li
                  class="sub-nav-item"
                  v-for="(subNav, subIndex) in navigationItem.children"
                  :key="subIndex"
                >
                  <a
                    href="javascript:void(0);"
                    @click="navToJump(subNav)"
                  ><span>{{subNav.name}}</span></a>
                </li>
              </ul>
            </li>
            <!--<li v-if="isFubt" class="nav-item">-->
              <!--<router-link to="/FucCenter">-->
                <!--<span>{{$t('M.common_fuc_eco')}}</span>-->
              <!--</router-link>-->
            <!--</li>-->
          </ul>
        </div>
        <!--注册登录-->
        <div class="right login">
          <ul class="ul-list">
            <!--消息-->
            <li
              class="li-item notice-li"
              @mouseenter="toggleBox('notice',true)"
              @mouseleave="toggleBox('notice',false)"
            >
              <button class="notice-btn">
                <IconFontCommon
                  class="font-size26"
                  icon-name="icon-xiaoxi"
                />
              </button>
              <el-collapse-transition>
                <ul
                  class="notice-list"
                  v-show="showNoticeList"
                  :style="{
                    height: `${homeNoticeList.length*40}px`
                  }"
                >
                  <li
                    class="notice-item"
                    v-for="noticeItem in homeNoticeList.length < 5 ? homeNoticeList : homeNoticeList.slice(0,5)"
                    :key="noticeItem.id"
                    :track-by="noticeItem.id"
                  >
                      <a
                        class="cursor-pointer"
                        @click.stop="jumpToNewsItem(noticeItem.id)"
                      >
                        {{noticeItem.title}}
                      </a>
                  </li>
                  <li
                    class="notice-item view-more"
                    v-show="homeNoticeList.length >= 5"
                  >
                    <!-- 查看全部 -->
                    <router-link
                      to="/NewsAndNoticeCenter"
                      class="view-more-link"
                    >{{$t('M.investment_look_all')}}</router-link>
                  </li>
                </ul>
              </el-collapse-transition>
            </li>
            <li class="li-item setting-li">
              <!--设置（语言，换肤）-->
              <button
                class="setting"
                @click="toggleBox('setting',true)"
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
              <router-link :to="`/${$routes_X.login}`">
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
                  <div
                    class="login-info"
                    :class="{'has-vip':$isVIPEnable_S_X}"
                  >
                    <!-- VIP 信息 -->
                    <div
                      class="sub-nav-user"
                      v-if="$isVIPEnable_S_X"
                    >
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
                @mouseenter="toggleBox('lang',true)"
                @mouseleave="toggleBox('lang',false)"
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
      <!-- 交易密码锁定弹窗 -->
      <el-dialog
        :title="$t('M.otc_publishAD_sellpassword')"
        :visible.sync="isPayPasswordLocked"
        width="420px"
        top="25vh"
        class="pay-password-loaded-dialog"
      >
        <p class="font-size12 warning-text margin-top35 text-align-c">
          <!--交易密码错误次数超限，交易冻结2小时。-->
          {{ $t('M.common_paypassword_locked') }}
        </p>
        <span
          slot="footer"
          class="dialog-footer"
        >
        <button
          class="border-radius4 cursor-pointer no-processing"
          @click.prevent="cancelReset"
        >
          <!-- 暂不处理 -->
          {{ $t('M.common_no_processing') }}
        </button>
        <button
          class="border-radius4 cursor-pointer"
          @click.prevent="resetPayPassword"
        >
          <!--重置密码-->
          {{ $t('M.user_transaction_reset')}}{{$t('M.comm_loginpassword')}}
        </button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {getMerchantAvailableLegalTender} from '../../utils/api/OTC'
import {userLoginOut} from '../../utils/api/user'
import IconFontCommon from '../Common/IconFontCommon'
import TheMoreNavsButton from '../Home/TheMoreNavsButton'
import TheGlobalPayPasswordDialog from '../Common/GlobalPayPassWordDialog'
import {
  getNestedData
} from '../../utils/commonFunc'
import {
  getStore,
  setStore
} from '../../utils'
import {
  mapMutations,
  mapState,
  mapActions
} from 'vuex'
import {xDomain} from '../../utils/env'
import {getNavigationsAJAX} from '../../utils/api/common'

export default{
  components: {
    IconFontCommon,
    TheMoreNavsButton,
    TheGlobalPayPasswordDialog
  },
  data () {
    return {
      showApplyMerchantStatus: false, // 是否显示申请商家弹窗
      // 是否显示小写列表
      showNoticeList: false,
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
      // otcSubNavStatus: true,
      // 活动中心子导航显示状态
      // activityCenterSubNavStatus: false,
      styleTop: 30,
      topPadding: '0 30px',
      topBackgroundColor: 'rgba(0,0,0,0.7)',
      isPayPasswordLocked: false,
      isNoticeReady: false,
      navigation: [
        // {
        //   name: '币币交易',
        //   link: '/TradeCenter/default',
        //   newTab: false,
        //   children: [
        //     {
        //       name: '测试',
        //       link: '/test',
        //       newTab: false
        //     }
        //   ]
        // },
        // {
        //   name: 'OTC交易',
        //   link: '/OTCCenter',
        //   newTab: false,
        //   children: [
        //     {
        //       name: '商家申请13123123123123',
        //       link: `/OTCBusinessApply`,
        //       newTab: false
        //     },
        //     {
        //       name: '发布广告',
        //       link: `/OTCPublishAD`,
        //       newTab: false
        //     },
        //     {
        //       name: '广告管理',
        //       link: `/OTCADManage`,
        //       newTab: false
        //     },
        //     {
        //       name: '商家订单',
        //       link: `/OTCMerchantsOrders`,
        //       newTab: false
        //     },
        //     {
        //       name: '报表统计',
        //       link: `/OTCReportFormStatistics`,
        //       newTab: false
        //     }
        //   ]
        // },
        // {
        //   name: '投资理财12313123123123',
        //   link: '/FinanceCenter',
        //   newTab: false
        // },
        // {
        //   name: '活动中心',
        //   link: '/ActivityCenter',
        //   newTab: false,
        //   children: [
        //     {
        //       name: '邀请排行',
        //       link: `/RankingListOfInvitation`,
        //       newTab: false
        //     }
        //   ]
        // },
        // {
        //   name: 'OTC交易',
        //   link: '/OTCCenter',
        //   newTab: false,
        //   children: [
        //     {
        //       name: '商家申请13123123123123',
        //       link: `/OTCBusinessApply`,
        //       newTab: false
        //     },
        //     {
        //       name: '发布广告',
        //       link: `/OTCPublishAD`,
        //       newTab: false
        //     },
        //     {
        //       name: '广告管理',
        //       link: `/OTCADManage`,
        //       newTab: false
        //     },
        //     {
        //       name: '商家订单',
        //       link: `/OTCMerchantsOrders`,
        //       newTab: false
        //     },
        //     {
        //       name: '报表统计',
        //       link: `/OTCReportFormStatistics`,
        //       newTab: false
        //     }
        //   ]
        // },
        // {
        //   name: 'OTC交易123123123123',
        //   link: '/OTCCenter',
        //   newTab: false,
        //   children: [
        //     {
        //       name: '商家申请13123123123123',
        //       link: `/OTCBusinessApply`,
        //       newTab: false
        //     },
        //     {
        //       name: '发布广告',
        //       link: `/OTCPublishAD`,
        //       newTab: false
        //     },
        //     {
        //       name: '广告管理',
        //       link: `/OTCADManage`,
        //       newTab: false
        //     },
        //     {
        //       name: '商家订单',
        //       link: `/OTCMerchantsOrders`,
        //       newTab: false
        //     },
        //     {
        //       name: '报表统计',
        //       link: `/OTCReportFormStatistics`,
        //       newTab: false
        //     }
        //   ]
        // },
        // {
        //   name: '币币交易',
        //   link: '/TradeCenter/default',
        //   newTab: false,
        //   children: [
        //     {
        //       name: '测试',
        //       link: '/test',
        //       newTab: false
        //     }
        //   ]
        // }
      ],
      // 当前导航选中项 索引
      activeNavIndex: -1,
      // 当前 更多导航选中项索引
      activeMoreNavIndex: -1,
      // 是否显示更多导航
      // isShowSubNav: true
      isShowSubNav: false
    }
  },
  async created () {
    // f5刷新页面刷新用户信息列表
    // console.log(this.$route)
    if (this.isLogin && this.$route.path !== '/PersonalCenter') {
      this.refreshUserInfo()
    }

    await this.getNavigations()

    // console.log(this.navigation)
    // 获取 语言列表
    if (!await this.GET_LANGUAGE_LIST_ACTION(this)) return false
    await this.SET_PARTNER_INFO_ACTION(this.language)
    await this.GET_COUNTRY_LIST_ACTION()
    await this.GET_ALL_NOTICE_ACTION(this.language)
    this.isNoticeReady = true
    // 查询某商户可用法币币种列表
    // 折算货币
    await this.getMerchantAvailableLegalTenderList()
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
      'SET_PARTNER_INFO_ACTION',
      'GET_ALL_NOTICE_ACTION',
      'REFRESH_USER_INFO_ACTION'
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
      'SET_LOGO_URL',
      'CHANGE_OTC_APPLY_JUMP_BOTTOM_STATUS',
      'CHANGE_USER_CENTER_ACTIVE_NAME',
      'USER_LOGOUT',
      'CHANGE_REF_ACCOUNT_CREDITED_STATE',
      'SET_NOTICE_ID',
      'CHANGE_PASSWORD_USEABLE',
      'CHANGE_ROUTER_PATH'
    ]),
    // 自定义导航
    async getNavigations () {
      const params = {
        language: this.$language_S_X
      }
      const data = await getNavigationsAJAX(params)
      // console.log(data)
      this.navigation = _.get(data, 'data')
      if (this.isFubt) {
        this.navigation.push({
          // FUC生态页
          name: this.$t('M.common_fuc_eco'),
          link: '/FucCenter',
          newTab: false
        })
      }
      _.forEach(this.navigation, (nav, index) => {
        nav['isInnerLink'] = this.checkIsInnerLink(nav.link) ? true : false
      })
    },
    initSettings () {
      if (getStore('convertCurrency')) {
        this.activeConvertCurrency = getStore('convertCurrency')
      }
      this.activeTheme = this.theme
    },
    cancelReset () {
      this.isPayPasswordLocked = false
      this.CHANGE_PASSWORD_USEABLE(false)
      this.userLoginOut()
    },
    jumpToNewsItem (noticeId) {
      if (!this.isNoticeReady) return false
      let currentRoute = this.$route.path
      if (!currentRoute.startsWith('/NewsAndNoticeItem')) {
        this.$goToPage(`/NewsAndNoticeItem/${noticeId}`)
      } else {
        this.SET_NOTICE_ID(noticeId)
      }
    },
    cancelApply () {
      this.showApplyMerchantStatus = false
    },
    confirmApply () {
      this.showApplyMerchantStatus = false
      this.$goToPage('/OTCBusinessApply')
      // location.reload() // 重新刷新页面
      // 任增加
      this.CHANGE_OTC_APPLY_JUMP_BOTTOM_STATUS(true)
    },
    // 非商家禁止进入OTC导航页提示框--结束
    refreshUserInfo () {
      this.REFRESH_USER_INFO_ACTION()
    },
    handleScroll () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
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
          // console.log(item.shortName)
          setStore('convertCurrency', item.shortName)
          this.activeConvertCurrencyObj = item
          return false
        }
      })
      // console.log(params)
      if (!params.shortName) return false
      await this.GET_TRANSITION_RATE_ACTION({
        params,
        activeConvertCurrencyObj: this.activeConvertCurrencyObj
      })
    },
    // 设置个人中心跳转
    setPersonalJump (target) {
      this.CHANGE_USER_CENTER_ACTIVE_NAME(target)
    },
    // 开启vip
    stateOpenVip () {
      if (this.localPayPwdSet || this.userInfo.payPassword) {
        this.$goToPage('/VipMainContent')
      } else {
        this.$goToPage('/TransactionPassword')
      }
    },
    // 用户跳转到指定页面
    async stateReturnSuperior (val) {
      // console.log(this.localPayPwdSet)
      await this.REFRESH_USER_INFO_ACTION()
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
            this.CHANGE_REF_SECURITY_CENTER_INFO(true)
            break
          case 'receiving-set':
            this.CHANGE_REF_ACCOUNT_CREDITED_STATE(true)
            this.setPersonalJump('account-credited')
            break
          case 'invite':
            this.setPersonalJump('invitation-promote')
            break
          case 'api':
            this.setPersonalJump('api-management')
            break
        }
        this.$goToPage('/PersonalCenter')
      } else {
        this.$goToPage('/TransactionPassword')
      }
    },
    // 用户登出
    async userLoginOut () {
      const data = await userLoginOut()
      if (!data) return false
      this.USER_LOGOUT()
      this.$goToPage('/home')
    },
    toggleBox (type, status) {
      // console.log(1)
      switch (type) {
        case 'notice':
          this.showNoticeList = status
          break
        case 'setting':
          this.showSetting = status
          this.initSettings()
          break
        case 'lang':
          this.langSelecting = status
          break
        // case 'otc':
        //   this.otcSubNavStatus = status
        //   break
        // case 'activity':
        //   this.activityCenterSubNavStatus = status
        //   break
      }
    },
    // 重置交易密码
    resetPayPassword () {
      this.$goToPage('/TransactionPassword')
      this.isPayPasswordLocked = false
      this.CHANGE_PASSWORD_USEABLE(false)
    },
    // 切换语言
    changeLanguage (e) {
      this.CHANGE_LANGUAGE(e)
      this.$i18n.locale = e.shortName
    },
    // 更改设置
    async changeSetting () {
      // 主题设置
      this.CHANGE_THEME(this.activeTheme)
      document.body.classList.remove('day', 'night')
      document.body.classList.add(this.activeTheme)
      // 汇率转换设置
      await this.changeActiveTransitionCurrency()
      this.CHANGE_CONVERT_CURRENCY(this.activeConvertCurrency)
      this.toggleBox('setting', false)
      this.CHANGE_PASSWORD_USEABLE(false)
    },
    // 查询某商户可用法币币种列表
    async getMerchantAvailableLegalTenderList () {
      let data = await getMerchantAvailableLegalTender()
      // 返回数据正确的逻辑
      if (!data) return false
      if (data.data) {
        this.convertCurrencyList = getNestedData(data, 'data')
        await this.changeActiveTransitionCurrency()
      }
    },
    setNewTitle (path = '/TradeCenter') {
      const {last, sellsymbol, area} = this.$middleTopData_S_X
      let newTitle = ''
      let priceData = this.$scientificToNumber(last)
      if (this.title) {
        if (path && path.startsWith('/TradeCenter') && priceData && sellsymbol && area) {
          newTitle = `${priceData} ${sellsymbol}/${area} ${this.title}`
        } else {
          newTitle = `${this.title}`
        }
        // console.log(newTitle)
        document.querySelector('title').innerText = newTitle
      } else {
        setTimeout(this.setNewTitle, 1000)
      }
    },
    // 切换当前激活导航
    changeActiveNavIndex (index) {
      this.activeNavIndex = index
    },
    // 切换当前更多激活导航
    changeMoreActiveNavIndex (index) {
      this.activeMoreNavIndex = index
    },
    // 切换子导航显示
    toggleMoreNavs (status) {
      this.isShowSubNav = status
    },
    // 检测链接类型是否为内部类型（内部链接、外部链接）
    checkIsInnerLink (link) {
      // 外部 https://www.fubt.co www.fubt.co
      // 内部 /TradeCenter
      const isInnerLink = !link.includes('.')
      // console.log(isInnerLink)
      return isInnerLink
    },
    // 导航跳转
    navToJump (navigation) {
      // console.log(this.$isLogin_S_X)

      const { link, newTab } = navigation
      // this.CHANGE_ROUTER_PATH(link)
      // console.log(link)
      const needMerchantType = ['/OTCADManage', '/OTCMerchantsOrders', '/OTCReportFormStatistics']
      const isNeedLogin = ['/OTCADManage', '/OTCMerchantsOrders', '/OTCReportFormStatistics', '/OTCPublishAD']
      const OTCPublishAD = '/OTCPublishAD'
      const OTCBusinessApply = '/OTCBusinessApply'
      const otcEnable = _.get(this.userInfo, 'otcEnable')
      const type = _.get(this.userInfo, 'type')
      if (this.checkIsInnerLink(link)) {
        // console.log(link, isNeedLogin.some(linkItem => link.startsWith(linkItem)))
        if (!this.$isLogin_S_X && isNeedLogin.some(linkItem => link.startsWith(linkItem))) {
          this.$goToPage('/login')
          this.CHANGE_ROUTER_PATH(link)
          return
        }
        if (link !== OTCBusinessApply) {
          // 非商家身份禁止访问
          if (needMerchantType.some(route => route === link) && type !== 'MERCHANT') {
            this.showApplyMerchantStatus = true
            return false
          }

          if (otcEnable === 'disable') {
            if (link === OTCPublishAD) {
              this.$message({
                message: this.$t(`M.${'otc_disable_account_tips'}`), // 该账号已被禁止交易OTC，请咨询客服
                type: 'error'
              })
              return false
            }
          } else {
            if (link === OTCPublishAD && type !== 'MERCHANT') {
              this.showApplyMerchantStatus = true
              return false
            }
          }
        }
        // console.log(this.$route.path)
        // console.log(this.$route.to.path, this.$route.from.path)
        // if (from.path !== '/login' || from.path !== '/register') {
        //   this.CHANGE_ROUTER_PATH(link)
        // }
        this.$goToPage(`${link}`)
      } else {
        // console.log('outerLink', newTab, link)
        let formatLink = link
        formatLink = !link.startsWith('http') ? `https://${formatLink}` : link
        // console.log(formatLink)
        if (newTab) {
          window.open(`${formatLink}`, '_blank')
        } else {
          window.location.href = formatLink
        }
      }
    }
  },
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language,
      defaultLanguage: state => state.common.defaultLanguage,
      isLogin: state => state.user.isLogin,
      middleTopDataPrice: state => state.trade.middleTopData.last, // 当前交易对数据
      userInfo: state => state.user.loginStep1Info.userInfo,
      activeLanguage: state => state.common.activeLanguage,
      userInfoRefreshStatus: state => state.common.userInfoRefreshStatus,
      logoSrc: state => state.common.logoSrc,
      title: state => state.common.title, // 网站title
      $mainNightBgColor: state => state.common.mainColor.$mainNightBgColor,
      noticeCloseVisible: state => state.home.noticeCloseVisible,
      // 普通用户点击otc导航弹窗提示点击申请按钮跳转到申请商家组件底部状态
      otcApplyJumpBottomStatus: state => state.OTC.otcApplyJumpBottomStatus,
      // 首页消息列表
      homeNoticeList: state => state.home.noticeList,
      // 交易密码是否被锁定
      isLockedPayPassword: state => state.common.isLockedPayPassword
    }),
    localPayPwdSet () {
      return getNestedData(this.userInfo, 'paypasswordSet')
    },
    isFubt () {
      let enableXDomains = ['fubt', 'new.test.com', 'new.bzu.com']
      return enableXDomains.some(item => xDomain.startsWith(item))
    }
  },
  watch: {
    isLockedPayPassword (newVal) {
      // console.log(newVal)
      if (newVal) {
        this.isPayPasswordLocked = true
      }
    },
    isPayPasswordLocked (newVal) {
      if (!newVal) {
        this.CHANGE_PASSWORD_USEABLE(false)
      }
    },
    defaultLanguage (newVal) {
      this.$i18n.locale = newVal
    },
    async language () {
      this.getNavigations()
      this.SET_PARTNER_INFO_ACTION(this.language)
      await this.GET_ALL_NOTICE_ACTION(this.language)
      this.isNoticeReady = true
    },
    middleTopDataPrice () {
      this.setNewTitle()
    },
    $route: {
      // val是改变之后的路由，oldVal是改变之前的val
      handler: function (val, oldVal) {
        this.setNewTitle(val.path)
      },
      // 深度观察监听
      deep: true
    },
    userInfoRefreshStatus (newVal) {
      if (newVal) {
        if (this.isLogin) {
          this.refreshUserInfo()
        }
        this.SET_USER_INFO_REFRESH_STATUS(false)
      }
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
@import "../../../static/css/scss/index";
@import "../../../static/css/scss/Home/MarketListHome";

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
      height: 50px;
      line-height: 50px;
      transition: all .5s;

      > .left {
        position: relative;
        z-index: 2;
        flex: 2;

        > .nav-list {
          height: 100%;

          > .nav-item {
            position: relative;
            left: -20px;
            display: inline-block;
            height: 100%;
            padding: 0 2%;
            text-align: center;
            vertical-align: top;
            white-space: nowrap;
            transition: all .5s;

            > .sub-nav-list {
              position: absolute;
              left: 0;
              background-color: $mainContentNightBgColor;

              > .sub-nav-item {
                height: 40px;
                padding: 0 20px;
                line-height: 40px;
                text-align: left;
                background-color: $mainContentNightBgColor;

                &:hover {
                  background-color: #21243a;

                  > a {
                    color: $mainColor;
                  }
                }

                > a {
                  color: $headerNavFontColor;
                }
              }
            }

            /* 自定义导航 */
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
              white-space: nowrap;
              color: $headerNavFontColor;

              &.active {
                color: $mainColor;
              }
            }

            > .logo {
              display: inline-block;
              width: 100px;
              height: 50px;

              > .img {
                width: 100%;
                vertical-align: middle;
              }
            }
          }

          > .more-btn {
            position: relative;
            left: -20px;
            display: inline-block;
            height: 100%;
            text-align: center;
            vertical-align: top;
            white-space: nowrap;
            transition: all .5s;

            > .more-nav-btn {
              display: inline-block;
              width: 30px;
              height: 30px;
              margin: 10px 0;
            }

            > .more-nav-list {
              position: absolute;
              top: 50px;
              min-width: 200%;
              text-align: left;
              background-color: $mainContentNightBgColor;

              > .nav-item {
                height: 40px;
                padding: 0 20px;
                line-height: 40px;

                &:hover {
                  background-color: #21243a;

                  > a {
                    color: $mainColor;
                  }
                }

                > a {
                  color: $headerNavFontColor;
                }

                > .sub-nav-list {
                  position: absolute;
                  top: 0;
                  left: 100%;
                  background-color: $mainContentNightBgColor;

                  > .sub-nav-item {
                    height: 40px;
                    padding: 0 20px;
                    line-height: 40px;
                    text-align: left;

                    &:hover {
                      background-color: #21243a;

                      > a {
                        color: $mainColor;
                      }
                    }

                    > a {
                      color: $headerNavFontColor;
                    }
                  }
                }
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
                top: 50px;
                right: -100px;
                box-sizing: border-box;
                width: 210px;
                height: 0;
                padding: 0 25px;
                overflow: hidden;
                text-align: center;
                background-color: $mainContentNightBgColor;

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
                height: 330px;
                transition: .5s;

                &.has-vip {
                  height: 450px;
                }
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

            /* 消息 */
            &.notice-li {
              position: relative;

              > .notice-btn {
                color: $mainColor;
                cursor: pointer;
              }

              .notice-list {
                position: absolute;
                z-index: 2;
                top: 50px;
                left: -10px;
                width: 300px;
                max-height: 240px;
                border-radius: 0 0 2px 2px;
                overflow: hidden;
                box-shadow: 0 1px 1px 0 rgb(32, 35, 55);

                > .notice-item {
                  box-sizing: border-box;
                  height: 40px;
                  padding: 0 14px;
                  border-bottom: 1px solid #292c42;
                  font-size: 12px;
                  line-height: 40px;
                  text-align: left;
                  background-color: $mainContentNightBgColor;

                  > a {
                    display: block;
                    height: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: $mainNightTitleColor;

                    &:hover {
                      color: $mainColor;
                    }
                  }

                  &.view-more {
                    background-color: #2c3047;
                  }

                  .view-more-link {
                    display: inline-block;
                    width: 100%;
                    text-align: center;
                    color: $mainColor;
                    cursor: pointer;
                  }
                }
              }
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
                top: 50px;
                left: 0;
                background-color: $mainContentNightBgColor;

                > .lang-item {
                  display: block;
                  width: 100%;
                  height: 30px;
                  padding: 0 10px;
                  line-height: 30px;
                  text-align: left;
                  color: #fff;
                  cursor: pointer;

                  &:hover {
                    color: $mainColor;
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
              width: 123px;
              padding: 7px 20px;
              border: 0;

              &:first-child {
                border: 1px solid rgba(51, 143, 245, 1);
                color: #338ff5;
                background: #1c2237;
              }

              &:last-child {
                padding: 8px 14px;
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
              /* 消息 */
              &.notice-li {
                .notice-list {
                  box-shadow: 0 2px 10px 0 rgb(225, 232, 240);

                  > .notice-item {
                    border-bottom: 1px solid #e5eef8;
                    background-color: $mainDayBgColor;

                    > a {
                      color: #7d90ac;

                      &:hover {
                        color: $mainColor;
                      }
                    }

                    &.view-more {
                      background-color: #f2f6fa;
                    }

                    .view-more-link {
                      color: $mainColor;
                    }
                  }
                }
              }

              /* 语言选择 dl */
              > .lang-box {
                > .lang-list {
                  background-color: #fff;
                  box-shadow: 0 2px 10px 0 rgb(225, 232, 240);

                  > .lang-item {
                    color: #7d90ac;

                    &:hover {
                      color: $mainColor;
                    }
                  }
                }
              }

              .login {
                > .login-info {
                  border-radius: 0 0 2px 2px;
                  background-color: #fff;
                  box-shadow: 0 2px 10px 0 rgb(225, 232, 240);

                  > .sub-nav-user {
                    > .nav-vip {
                      color: #7d90ac;
                    }

                    > .nav-button {
                      border-radius: 4px;
                      color: $mainColor;
                      background: rgba(51, 143, 245, .1);
                    }
                  }

                  > .personal-user {
                    > li {
                      color: #7d90ac;

                      &:hover {
                        color: rgba(0, 121, 254, 1);
                      }
                    }
                  }
                }

                &:hover .login-info {
                  height: 450px;
                  transition: .5s;
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

    .pay-password-loaded-dialog {
      > .el-dialog {
        height: 220px;

        > .el-dialog__body {
          > p {
            font-size: 14px;
            line-height: 35px;
            color: $upColor;
          }
        }

        .el-dialog__footer {
          padding: 0;
        }

        .dialog-footer {
          padding: 0;

          > button {
            height: 34px;
            margin-right: 20px;
            border-radius: 4px;
            color: #fff;
            background: transparent linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);

            &.no-processing {
              border: 1px solid $mainColor;
              color: $mainColor;
              background: transparent;
            }
          }
        }
      }
    }
  }
}
</style>
