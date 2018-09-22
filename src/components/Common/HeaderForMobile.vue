<template>
  <div
    class="mobile-header-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="inner-box">
      <div class="left">
        <img
          class="img"
          :src="logoSrc"
        >
      </div>
      <!--注册登录-->
      <div class="right login">
        <ul class="ul-list">
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
                      <button
                        v-if="!userInfo.level"
                        class="nav-button"
                        @click="stateOpenVip"
                      >
                        立即开通
                      </button>
                       <button
                         v-else
                         class="nav-button"
                         @click="stateOpenVip"
                       >
                        查看我的VIP
                      </button>
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
              >
                <span class="language-text">{{activeLanguage.name}}</span>
                <i class="el-icon-caret-bottom"></i>
              </dt>
              <el-collapse-transition>
                <dd
                  class="lang-list"
                  v-show="langSelecting"
                >
                  <a
                    class="lang-item"
                    href="#"
                    @click="changeLanguage(item)"
                    v-for="(item,index) in languageList"
                    :key="index"
                  >
                    {{item.name}}
                  </a>
                </dd>
              </el-collapse-transition>
            </dl>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {
  returnAjaxMessage,
  getCountryListAjax,
  reflashUserInfo
} from '../../utils/commonFunc'
import {
  getLanguageList,
  getTransitionCurrencyRate // 获取汇率转换费率
} from '../../utils/api/header'
import {getMerchantAvailablelegalTender} from '../../utils/api/OTC'
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations } = createNamespacedHelpers('common')
export default {
  components: {
  },
  // props,
  data () {
    return {
      // 语言选择中
      langSelecting: false,
      activeTheme: ''
    }
  },
  async created () {
    require('../../../static/css/theme/day/Common/HeaderCommonDay.css')
    // 获取 语言列表:任付伟先注释此方法防止每次刷新报错-有需要请放开
    this.getLanguageList()
    // console.log(this.theme)
    this.activeTheme = this.theme
    // 查询某商户可用法币币种列表
    // 折算货币s
    await this.getMerchantAvailablelegalTenderList()
    await this.getTransitionCurrencyRate()
    await this.getCountryList()
    if (this.isLogin) {
      await reflashUserInfo(this)
    }
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
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
      // 更新当前汇率列表
      'CHANGE_CURRENCY_RATE_LIST',
      'SET_COUNTRY_AREA_LIST',
      'USER_INFORMATION_REFRESH',
      'SET_USER_INFO_REFRESH_STATUS'
    ]),
    getCountryList () {
      getCountryListAjax(this, (data) => {
        console.log(data)
        // this.contryAreaList = data.data.data
        this.SET_COUNTRY_AREA_LIST(data.data.data)
        // console.log(this.contryAreaList)
      })
    },
    // 获取目标汇率
    async getTransitionCurrencyRate (params) {
      const data = await getTransitionCurrencyRate(params)
      console.log(data)
      if (!returnAjaxMessage(data, this, 0)) {
        return false
      } else {
        this.CHANGE_CURRENCY_RATE_LIST({
          currencyRateList: data.data.data,
          activeConvertCurrencyObj: this.activeConvertCurrencyObj
        })
      }
    },
    // 查询某商户可用法币币种列表
    async getMerchantAvailablelegalTenderList () {
      let data = await getMerchantAvailablelegalTender({
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
      this.changeActiveTransitionCurrency()
      // setStore('convertCurrencyList', this.convertCurrencyList)
    },
    // 获取国家列表
    async getLanguageList () {
      const data = await getLanguageList()
      if (!returnAjaxMessage(data, this)) {
        return false
      } else {
        this.languageList = data.data.data
        this.CHANGE_LANGUAGE(this.languageList[0])
        // console.log(this.languageList[0])
        // console.log(this.activeLanguage)
      }
    },
    // 显示状态切换 （语言）
    toggleShowLanguageBox (status) {
      this.langSelecting = Boolean(status)
    },
    // 切换语言
    changeLanguage (e) {
      // console.log(e)
      this.CHANGE_LANGUAGE(e)
      this.$i18n.locale = e.shortName
      console.log(this.activeLanguage)
    }
  },
  filter: {},
  computed: {
    ...mapState({
      logoSrc: state => state.common.logoSrc,
      activeLanguage: state => state.common.activeLanguage
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../../static/css/scss/index";
  @import "../../../static/css/scss/Common/HeaderCommon.scss";
  .mobile-header-box{
    >.inner-box{
      height:120px;
      width:100%;
      line-height: 120px;
      display: flex;
      padding:0 20px;
      >.left{
        height:60px;
        margin-top:30px;
        >.img{
          height:60px;
          vertical-align: top;
        }
      }
      >.right{
        color:#fff;
        font-size: 30px;
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
            >a{
              transition: all 1s;
              color:#fff;
              padding:5px 10px;
              &:hover{
                background-color: $mainColor;
              }
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
                  /*width:60px;*/
                }
              }
              >.lang-list{
                background-color: #2A3242;
                position: absolute;
                z-index: 2;
                left:0;
                top:90px;
                >.lang-item{
                  transition: all 1s;
                  color:#fff;
                  display:block;
                  height:50px;
                  line-height:50px;
                  text-align: left;
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
  }
</style>
