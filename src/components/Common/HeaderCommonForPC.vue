<!--
  author: zhaoxinlei
  update: 20190621
  description: 当前组件为 公共头部组件
-->
<template>
  <div
    class="nav-box common"
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
    :style="{
      top:$route.path ===`/${$routes_X.home}` && noticeCloseVisible ? `${styleTop}px` : 0
    }"
  >
    <div class="inner-box">
      <div
        class="top"
        :style="{
          padding: $route.path === `/${$routes_X.home}` ? topPadding : '0 30px',
          backgroundColor: $route.path === `/${$routes_X.home}` ? topBackgroundColor : $mainNightBgColor
        }"
      >
        <!--导航-->
        <div class="left nav">
          <TheCustomNavs
            @navToJump="navToJump"
          />
        </div>
        <!-- 消息、 注册、 登录-->
        <div class="right login">
          <ul class="ul-list">
            <TheNotice :isNoticeReady="isNoticeReady"/>
            <TheSetting/>
            <TheBillings v-if="$isLogin_S_X"/>
            <li
              class="li-item"
              v-if="!$isLogin_S_X"
            >
              <router-link :to="`/${$routes_X.login}`">
                <!--<span>登录</span>-->
                <span>{{$t('M.comm_login')}}</span>
              </router-link>
            </li>
            <li class="li-split"></li>
            <li
              class="li-item"
              v-if="!$isLogin_S_X"
            >
              <router-link :to="`/${$routes_X.login}/${$routes_X.register}/default`">
                <!--<span>注册</span>-->
                <span>{{$t('M.comm_register_time')}}</span>
              </router-link>
            </li>
            <TheLogined v-if="$isLogin_S_X"/>
            <TheLanguages/>
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
      <!-- 非商家禁止进入OTC导航页提示框 -->
      <div class="apply-merchant-dialog">
        <el-dialog
          :title="$t('M.otc_apply_tips1')"
          :visible.sync="showApplyMerchantStatus"
          top="30vh"
          modal
        >
          <div class="content">
            <!--您需要先申请成为商家才能使用此功能-->
            {{$t('M.otc_apply_tips2')}}
          </div>
          <span slot="footer">
            <div class="button-group">
              <button class="cancel item" @click="cancelApply">
                {{$t('M.comm_cancel')}}
              </button>
              <button class="confirm item" @click="confirmApply">
                {{$t('M.actionCenter_Token_step1')}}
              </button>
            </div>
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
        <p class="font-size12 warning-text text-align-c">
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
import TheMoreNavsButton from '../Home/TheMoreNavsButton'
import TheSetting from '../Header/TheSetting'
import TheBillings from '../Header/TheBillings'
import TheLogined from '../Header/TheLogined'
import TheLanguages from '../Header/TheLanguages'
import TheNotice from '../Header/TheNotice'
import TheCustomNavs from '../Header/TheCustomNavs'
import mixins from '../../mixins/header'
import {
  mapMutations,
  mapState,
  mapActions
} from 'vuex'

export default{
  mixins: [mixins],
  components: {
    TheBillings,
    TheMoreNavsButton,
    TheSetting,
    TheLogined,
    TheLanguages,
    TheNotice,
    TheCustomNavs
  },
  data () {
    return {
      showApplyMerchantStatus: false, // 是否显示申请商家弹窗
      // 是否显示小写列表
      showNoticeList: false,
      // 语言选择中
      langSelecting: false,
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
      navigation: [],
      // 当前导航选中项 索引
      activeNavIndex: -1,
      // 当前 更多导航选中项索引
      activeMoreNavIndex: -1,
      // 是否显示更多导航
      // isShowSubNav: true
      isShowSubNav: false,
      // 上一个 激活链接名称
      oldActiveLinkIndex: ''
    }
  },
  async created () {
    // f5刷新页面刷新用户信息列表
    if (this.$isLogin_S_X && this.$route.path !== '/PersonalCenter') {
      this.refreshUserInfo()
    }

    // await this.getNavigations()
    // 获取 语言列表
    if (!await this.GET_LANGUAGE_LIST_ACTION(this)) return false
    await this.SET_PARTNER_INFO_ACTION(this.$language_S_X)

    // await this.GET_ALL_NOTICE_ACTION(this.$language_S_X)
    this.isNoticeReady = true
    // 查询某商户可用法币币种列表
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    ...mapActions([
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
    cancelReset () {
      this.isPayPasswordLocked = false
      this.CHANGE_PASSWORD_USEABLE(false)
      this.$userLogOut_X()
    },
    cancelApply () {
      if (this.$route.path !== '/OTCBusinessApply') {
        this.$SET_ACTIVE_LINK_NAME_M_X(this.oldActiveLinkIndex)
      }
      this.showApplyMerchantStatus = false
    },
    confirmApply () {
      this.showApplyMerchantStatus = false
      let outerIndex
      let innerIndex
      // const OTCs = ['/OTCADManage', '/OTCMerchantsOrders', '/OTCReportFormStatistics', '/OTCPublishAD']
      _.forEach(this.$navigators_S_X, (route, index) => {
        if (route.link === '/OTCCenter') {
          outerIndex = index
          _.forEach(route.children, (childRoute, childIndex) => {
            if (childRoute.link == '/OTCBusinessApply') {
              innerIndex = childIndex
              return false
            }
          })
        }
      })
      let targetRoute = this.$navigators_S_X[outerIndex].children[innerIndex]
      // this.$goToPage('/OTCBusinessApply')
      this.navToJump(targetRoute)
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
    // 重置交易密码
    resetPayPassword () {
      this.$goToPage('/TransactionPassword')
      this.isPayPasswordLocked = false
      this.CHANGE_PASSWORD_USEABLE(false)
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
        document.querySelector('title').innerText = newTitle
      } else {
        setTimeout(this.setNewTitle, 1000)
      }
    },
    // 检测链接类型是否为内部类型（内部链接、外部链接）
    checkIsInnerLink (link) {
      // 外部 https://www.fubt.co www.fubt.co
      // 内部 /TradeCenter
      const isInnerLink = !link.includes('.')
      return isInnerLink
    },
    // 导航跳转
    navToJump (navigation) {
      const { link, newTab } = navigation
      if (!link) return
      // this.CHANGE_ROUTER_PATH(link)
      const needMerchantType = ['/OTCADManage', '/OTCMerchantsOrders', '/OTCReportFormStatistics']
      const isNeedLogin = ['/OTCADManage', '/OTCMerchantsOrders', '/OTCReportFormStatistics', '/OTCPublishAD']
      const OTCPublishAD = '/OTCPublishAD'
      const OTCBusinessApply = '/OTCBusinessApply'
      const otcEnable = _.get(this.userInfo, 'otcEnable')
      const type = _.get(this.userInfo, 'type')
      if (this.checkIsInnerLink(link)) {
        if (!this.$isLogin_S_X && link == OTCBusinessApply) this.$SET_ACTIVE_LINK_NAME_M_X(-1)
        if (!this.$isLogin_S_X && isNeedLogin.some(linkItem => link.startsWith(linkItem))) {
          this.$goToPage('/login')
          this.$SET_ACTIVE_LINK_NAME_M_X(-1)
          this.CHANGE_ROUTER_PATH(link)
          return
        }
        if (link !== OTCBusinessApply) {
          // 非商家身份禁止访问
          if (needMerchantType.some(route => route === link) && type !== 'MERCHANT') {
            this.showApplyMerchantStatus = true
            // this.$SET_ACTIVE_LINK_NAME_M_X(this.oldActiveLinkIndex)
            return false
          }

          if (otcEnable === 'disable') {
            if (link === OTCPublishAD) {
              // 该账号已被禁止交易OTC，请咨询客服
              this.$error_tips_X(this.$t(`M.${'otc_disable_account_tips'}`))
              this.$SET_ACTIVE_LINK_NAME_M_X(this.oldActiveLinkIndex)
              return false
            }
          } else {
            if (link === OTCPublishAD && type !== 'MERCHANT') {
              this.showApplyMerchantStatus = true
              return false
            }
          }
        }
        this.$goToPage(`${link}`)
      } else {
        let formatLink = link
        formatLink = !link.startsWith('http') ? `https://${formatLink}` : link
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
      defaultLanguage: state => state.common.defaultLanguage,
      middleTopDataPrice: state => state.trade.middleTopData.last, // 当前交易对数据
      userInfo: state => state.user.loginStep1Info.userInfo,
      activeLanguage: state => state.common.activeLanguage,
      userInfoRefreshStatus: state => state.common.userInfoRefreshStatus,
      logoSrc: state => state.common.logoSrc,
      title: state => state.common.title, // 网站title
      $mainNightBgColor: state => state.common.mainColor.$mainNightBgColor,
      noticeCloseVisible: state => state.home.noticeCloseVisible,
      // 首页消息列表
      homeNoticeList: state => state.home.noticeList,
      // 交易密码是否被锁定
      isLockedPayPassword: state => state.common.isLockedPayPassword
    })
  },
  watch: {
    $activeLinkIndex_S_X (New, Old) {
      this.oldActiveLinkIndex = Old
    },
    isLockedPayPassword (newVal) {
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
    async $language_S_X () {
      // this.getNavigations()
      this.SET_PARTNER_INFO_ACTION(this.$language_S_X)
      await this.GET_ALL_NOTICE_ACTION(this.$language_S_X)
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
        if (this.$isLogin_S_X) {
          this.refreshUserInfo()
        }
        this.SET_USER_INFO_REFRESH_STATUS(false)
      }
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
@import "../../assets/CSS/index";

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
      height: 60px;
      line-height: 60px;
      transition: all .5s;

      > .left {
        position: relative;
        z-index: 2;
        flex: 2;
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
            height: 15px;
            vertical-align: middle;
            background-color: #4a5260;
          }

          > .li-item {
            display: inline-block;

            > a {
              padding: 5px 10px;
              border-radius: 2px;
              vertical-align: middle;
              color: $nightFontColor;
              transition: all 1s;

              &:hover {
                color: #fff;
                background-color: $mainColor;
              }
            }
          }
        }
      }
    }

    /deep/ {
      .apply-merchant-dialog {
        .el-dialog__wrapper {
          .el-dialog {
            width: 350px;
            height: 180px;
            border-radius: 4px;

            .el-dialog__header {
              padding: 6px 18px;
              border-radius: 4px 4px 0 0;

              .el-dialog__title {
                font-size: 14px;
              }

              .el-dialog__headerbtn {
                top: 10px;
                right: 10px;
              }
            }

            .el-dialog__body {
              height: 84px;
              padding: 35px 18px;
              font-size: 14px;
              text-align: center;
            }

            .el-dialog__footer {
              padding: 0 18px;

              .button-group {
                .item {
                  height: 30px;
                  padding: 0 28px;
                  border-radius: 2px;
                  font-size: 12px;
                  line-height: 30px;
                  cursor: pointer;
                }

                .confirm {
                  margin-left: 20px;
                }
              }
            }
          }
        }
      }
    }
  }

  &.night {
    /deep/ {
     .apply-merchant-dialog {
       .el-dialog__wrapper {
         .el-dialog {
           background-color: $dialogColor1;

           .el-dialog__header {
             background-color: $dialogColor2;

             .el-dialog__title {
               color: $dialogColor4;
             }
           }

           .el-dialog__body {
             color: $dialogColor5;
           }

           .el-dialog__footer {
             .button-group {
               .cancel {
                 border: 1px solid $mainColor;
                 color: #fff;
                 background-color: $dialogColor1;
               }

               .confirm {
                 color: #fff;
                 background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
               }
             }
           }
         }
       }
     }

     .pay-password-loaded-dialog {
       > .el-dialog {
         background-color: #28334a;

         .el-dialog__header {
           padding: 10px;
           background-color: #20293c;

           .el-dialog__title {
             font-size: 16px;
             color: #fff;
           }

           .el-dialog__headerbtn {
             top: 12px;
           }
         }

         > .el-dialog__body {
           > p {
             color: $upColor;
           }
         }
       }
     }
    }
  }

  &.day {
    > .inner-box {
      /deep/ {
        .apply-merchant-dialog {
          .el-dialog__wrapper {
            .el-dialog {
              background-color: $mainColorOfWhite;

              .el-dialog__header {
                background-color: $dialogColor7;

                .el-dialog__title {
                  color: $dayMainTitleColor;
                }
              }

              .el-dialog__body {
                color: $dayMainTitleColor;
              }

              .el-dialog__footer {
                .button-group {
                  .cancel {
                    border: 1px solid $mainColor;
                    color: $mainColor;
                    background-color: $mainColorOfWhite;
                  }

                  .confirm {
                    color: #fff;
                    background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
                  }
                }
              }
            }
          }
        }

        .pay-password-loaded-dialog {
          > .el-dialog {
            background-color: #fff;

            .el-dialog__header {
              padding: 10px;
              background-color: #fff;

              .el-dialog__title {
                font-size: 16px;
                color: #333;
              }

              .el-dialog__headerbtn {
                top: 12px;
              }
            }

            > .el-dialog__body {
              > p {
                color: $upColor;
              }
            }
          }
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
