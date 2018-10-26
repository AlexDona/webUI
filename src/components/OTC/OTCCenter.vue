<template>
  <div
    class="otc-box otc"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <!--2.0 在线交易和订单管理-->
    <div class="otc-center-content">
      <!-- 2.1 在线交易-->
      <div class="otc-online-trading">
        <!-- 2.1.1 在线购买和在线出售按钮-->
        <div class="otc-online-buy-and-sell-button">
          <el-radio-group
            v-model="OTCBuySellStyle"
            @change="toggleBuyOrSellStyle"
          >
            <el-radio-button label="onlineBuy" :disabled="isDisabledRadio">
              <!-- 在线购买 -->
              {{ $t('M.otc_index_online_buy') }}
            </el-radio-button>
            <el-radio-button label="onlineSell" :disabled="isDisabledRadio">
              <!-- 在线出售 -->
              {{ $t('M.otc_index_online_sell') }}
            </el-radio-button>
          </el-radio-group>
        </div>
        <!-- 2.1.2 我要购买和商户列表内容-->
        <div class="otc-merchant-content">
          <!--我要购买和发布订单按钮-->
          <div class="otc-filtrate-publish">
            <!-- 可用币种列表 -->
            <div class="otc-filtrate-box">
              <!-- 我要购买 -->
              <span
                class="otc-i-wan"
                v-show="OTCBuySellStyle === 'onlineBuy'"
              >
                <!-- 我要购买 ： -->
                {{ $t('M.otc_index_wantTo_buy') }} :
              </span>
              <!-- 我要出售 -->
              <span
                class="otc-i-wan"
                v-show="OTCBuySellStyle === 'onlineSell'"
              >
                <!-- 我要出售 ： -->
                {{ $t('M.otc_index_wantTo_sell') }} :
              </span>
              <div
                class="otc-filtrate-style"
              >
                <span
                  v-for="(item, index) in IWantToBuySellArr"
                  :key="index"
                  class="otc-filtrate-currency-name"
                  :class="{ currencyNameActived: selectCurrencyNameStatus === index }"
                  @click="selectCurrencyName(index)"
                >
                  {{item.name}}
                </span>
              </div>
            </div>
            <!-- 支付方式、货比类型、发布订单按钮 -->
            <div class="otc-publish-box">
              <!-- 货币类型 -->
              <span class="currency-style">
                <IconFontCommon
                  class="currency-style-icon"
                  iconName="icon-jinbi"
                />
                <!-- 货币类型 -->
                <el-select
                  v-model="activitedCurrencyId"
                  @change="changeCurrencyId"
                  :placeholder="$t('M.otc_index_currency_type')"
                  :no-data-text="$t('M.comm_no_data')"
                >
                  <el-option
                    v-for="(item,index) in availableCurrencyId"
                    :key="index"
                    :value="item.id"
                    :label="language === 'zh_CN'? item.name : item.shortName"
                  >
                  </el-option>
                </el-select>
              </span>
              <!-- 支付方式 -->
              <span class="pay-style">
                <IconFontCommon
                  iconName="icon-qiandai"
                  class="pay-style-icon"
                />
                <el-select
                  :no-data-text="$t('M.comm_no_data')"
                  v-model="checkedPayType"
                  :placeholder="$t('M.otc_index_Payment_method')"
                  @change="payWayChangeValue"
                >
                  <el-option
                    v-for="(item,index) in payWayBankinfoList"
                    :key="index"
                    :value="item.id"
                    :label="$t(item.shortName)"
                  >
                  </el-option>
                </el-select>
              </span>
              <!-- 发布订单按钮 -->
              <el-button
                type="primary"
                @click="toPublishOrder"
              >
                <!-- 发布订单 -->
              {{ $t('M.otc_release_order') }}
              </el-button>
            </div>
          </div>
          <!--商户列表表格部分-->
          <div
            class="otc-merchant-list"
            v-loading="loading"
            element-loading-background="rgba(0, 0, 0, 0.6)"
          >
            <!-- 表格信息 暂时无数据-->
            <el-table
              :data="onlineBuySellTableList"
              style="width: 100%"
              :empty-text="$t('M.comm_no_data')"
            >
              <!-- 名称 -->
              <el-table-column
                :label="$t('M.otc_index_Merchant')"
                align="center"
              >
                <template slot-scope = "s">
                  <div>
                    <!-- 如果是商家用户就显示商家图标MERCHANT -->
                    <el-tooltip
                      effect="dark"
                      content="已认证商家"
                      placement="bottom-start"
                    >
                      <img
                        src="../../assets/develop/shangjia.png"
                        class="shang-icon"
                        v-show="s.row.userType === 'MERCHANT'"
                      >
                    </el-tooltip>
                    {{s.row.userName}}
                  </div>
                </template>
              </el-table-column>
              <!-- 信用 -->
              <el-table-column
                :label="$t('M.otc_index_turnover')"
              >
                <template slot-scope = "s">
                  <div v-if="s.row.successOrderTimes === 0 || s.row.tradeTimes === 0">0%</div>
                  <div v-else>{{((s.row.successOrderTimes/(s.row.tradeTimes)) * 100).toFixed(2)}}%</div>
                </template>
              </el-table-column>
              <!-- 数量 -->
              <el-table-column
                :label="$t('M.comm_count')"
              >
                <template slot-scope = "s">
                  <div>
                    <!-- {{s.row.entrustCount- s.row.matchCount}}{{selectedOTCAvailableCurrencyName}} -->
                    <!-- 防止丢失精度 -->
                    <!-- {{getOTCRemainingSum(s.row.entrustCount, s.row.matchCount, '-')}}{{selectedOTCAvailableCurrencyName}} -->
                    <!-- 后台添加了剩余数量字段remainCount -->
                    {{s.row.remainCount}}{{selectedOTCAvailableCurrencyName}}
                  </div>
                </template>
              </el-table-column>
              <!-- 价格 -->
              <el-table-column
                :label="$t('M.otc_index_price')"
              >
                <template slot-scope = "s">
                  <!-- 此处的单位根据设置中的法币类型来变化：为人民币时候显示CNY，为美元时候显示$ 此处需要从全局拿到设置中的法币类型来渲染页面-->
                  <div class="red">{{s.row.price}}{{activitedCurrencyName}}</div>
                </template>
              </el-table-column>
              <!-- 支付方式 -->
              <el-table-column
                :label="$t('M.otc_index_Payment_method')"
              >
                <template slot-scope="s">
                  <div>
                    <!-- 1支付宝 -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-zhifubao1"
                      v-if="s.row.payTypes[0] === '1'"
                    />
                    <!-- 2微信 -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-weixin1"
                      v-if="s.row.payTypes[1] === '1'"
                    />
                    <!-- 3银行卡 -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-yinhangqia"
                      v-if="s.row.payTypes[2] === '1'"
                    />
                    <!-- 4西联汇款 -->
                    <span v-if="s.row.payTypes[3] == '1'">
                      <img
                        src="../../assets/user/xilian.png"
                        class="xilian"
                      >
                    </span>
                    <!--  5PAYPAL -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-paypal"
                      v-if="s.row.payTypes[4] === '1'"
                    />
                  </div>
                </template>
              </el-table-column>
              <!-- 限额 -->
              <el-table-column
                :label="$t('M.otc_index_priceLimit')"
              >
                <template slot-scope = "s">
                  <div>{{s.row.minCount}}~{{s.row.maxCount}}{{activitedCurrencyName}}</div>
                </template>
              </el-table-column>
              <!-- 备注 -->
              <el-table-column
                :label="$t('M.comm_remark')"
                width="100"
              >
                <template slot-scope = "s">
                  <el-tooltip
                    effect="dark"
                    :content="s.row.remark"
                    placement="bottom-start"
                  >
                    <span class="remark-tips">
                      {{s.row.remark}}
                    </span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <!-- 操作 -->
              <el-table-column
                :label="$t('M.otc_index_operate')"
                align="center"
              >
                <template slot-scope="s">
                  <el-button
                    type="danger"
                    size="mini"
                    v-if="OTCBuySellStyle === 'onlineBuy'"
                    @click="toOnlineBuyOrSell(s.row.id,s.row.coinId,s.row.userId)"
                  >
                    <!-- @click="toOnlineBuy(s.row.id,s.row.coinId,s.row.userId)" -->
                    <!-- 购买 -->
                    {{$t('M.comm_buying')}}
                  </el-button>
                  <el-button
                    type="success"
                    size="mini"
                    v-if="OTCBuySellStyle === 'onlineSell'"
                    @click="toOnlineBuyOrSell(s.row.id,s.row.coinId,s.row.userId)"
                  >
                    <!-- @click="toOnlineSell(s.row.id,s.row.coinId,s.row.userId)" -->
                    <!-- 出售 -->
                   {{$t('M.comm_offering')}}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!--分页-->
          <div class="page">
            <el-pagination
              background
              v-show="onlineBuySellTableList.length"
              layout="prev, pager, next"
              :page-count="totalPages"
              @current-change="changeCurrentPage"
            >
            </el-pagination>
          </div>
        </div>
      </div>
      <!-- 2.2 订单管理-->
      <div
        class="otc-order-manage"
        id="orderView"
      >
        <!-- 查询更多 -->
          <span
            class="more"
            @click="queryMoreOrder"
          >
            {{$t('M.otc_transaction_inquiries_more')}}
          </span>
        <el-tabs
          :tab-position = "tabPosition"
          @tab-click = "toggleTabPane"
          v-model = "activeName"
        >
          <!-- 2.2.1 交易中的订单 -->
          <el-tab-pane
            name = "first"
            :disabled="isdisabled"
          >
            <span slot="label">
              <i
                class="el-icon-caret-right otc-tab-pane-arrow-right"
                v-show="activeName === 'first'">
              </i>
              <IconFontCommon
                iconName="icon-shalou"
              />
              <!-- 交易中订单 -->
              {{$t('M.otc_trading')}}
            </span>
            <OTCTradingOrder ref = "trading"/>
          </el-tab-pane>
          <!-- 2.2.2 已完成订单 -->
          <el-tab-pane
            name = "second"
            :disabled="isdisabled"
          >
            <span slot="label">
              <i
                class="el-icon-caret-right otc-tab-pane-arrow-right"
                v-show="activeName === 'second'"
              >
              </i>
              <IconFontCommon
                iconName="icon-msnui-task-complete"
              />
              <!-- 已完成订单 -->
              {{$t('M.otc_stocks')}}
            </span>
            <OTCCompletedOrder ref = "complete"/>
          </el-tab-pane>
          <!-- 2.2.3 已取消订单 -->
          <el-tab-pane
            name = "third"
            :disabled="isdisabled"
          >
            <span slot="label">
              <i
                class="el-icon-caret-right otc-tab-pane-arrow-right"
                v-show="activeName === 'third'"
              >
              </i>
              <IconFontCommon
                iconName="icon-cancel_order"
              />
              <!-- 已取消订单 -->
              {{$t('M.otc_canceled')}}
            </span>
            <OTCCanceledOrder ref = "canceled"/>
          </el-tab-pane>
          <!-- 2.2.4 冻结中订单 -->
          <el-tab-pane
            name = "fourth"
            :disabled="isdisabled"
          >
            <span slot="label">
              <i
                class="el-icon-caret-right otc-tab-pane-arrow-right"
                v-show="activeName === 'fourth'"
              >
              </i>
              <IconFontCommon
                iconName="icon-dongjie"
              />
              <!-- 冻结中订单 -->
              {{$t('M.otc_freezingOrder')}}
            </span>
            <OTCFreezingOrder ref = "freezing"/>
          </el-tab-pane>
          <!-- 2.2.5 委托订单 -->
          <el-tab-pane
            name = "fifth"
            :disabled="isdisabled"
          >
            <span slot="label">
              <i
                class="el-icon-caret-right otc-tab-pane-arrow-right"
                v-show="activeName === 'fifth'">
              </i>
              <IconFontCommon
                iconName="icon-daohang2"
              />
              <!-- 委托订单 -->
              {{$t('M.otc_entrust')}}
            </span>
            <OTCEntrustOrder ref = "entrust"/>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {amendPrecision} from '../../utils'
import {getOTCAvailableCurrency, getOTCPutUpOrders, getMerchantAvailablelegalTender} from '../../utils/api/OTC'
import IconFontCommon from '../Common/IconFontCommon'
import OTCTradingOrder from './OTCTradingOrder'
import OTCCompletedOrder from './OTCCompletedOrder'
import OTCCanceledOrder from './OTCCanceledOrder'
import OTCFreezingOrder from './OTCFreezingOrder'
import OTCEntrustOrder from './OTCEntrustOrder'
import {returnAjaxMessage, reflashUserInfo} from '../../utils/commonFunc'
import {createNamespacedHelpers, mapState} from 'vuex'
const {mapMutations} = createNamespacedHelpers('OTC')
export default {
  components: {
    OTCTradingOrder, //  交易中订单
    OTCCompletedOrder, //  已完成订单
    OTCCanceledOrder, //  已取消订单
    OTCFreezingOrder, //  冻结中订单
    OTCEntrustOrder, //  委托订单
    IconFontCommon //  字体图标
  },
  data () {
    return {
      isdisabled: false, // 订单tabs面板切换禁用状态
      isDisabledRadio: false, // 在线购买和在线出售按钮禁用状态
      loading: false, // loading加载
      // 分页
      currentPage: 1, // 当前页码
      totalPages: 1, // 总页数
      // 可用法币币种数组
      activitedCurrencyId: '', // 选中的可用法币id
      activitedCurrencyName: '', // 选中的可用法币name
      availableCurrencyId: [],
      activeName: 'first', // 选中的tab面板的序号
      tabPosition: 'left', //  订单管理面板标签方向状态
      OTCBuySellStyle: 'onlineBuy', //  在线购买和在线出售选中类型
      selectCurrencyNameStatus: 0, //  选中我要购买或者出售的币种名称
      onlineBuySellTableList: [], // 在线购买和在线出售表格列表
      // 支付方式下拉框数据
      payWayBankinfoList: [
        {
          id: '',
          shortName: 'M.comm_all' // 全部
        },
        {
          id: 'alipay',
          shortName: 'M.comm_alipay' // 支付宝
        },
        {
          id: 'weixin',
          shortName: 'M.comm_weixin' // 微信
        },
        {
          id: 'bank',
          shortName: 'M.comm_bank' // 银行卡
        },
        {
          id: 'xilian',
          shortName: 'M.comm_xilian' // 西联汇款
        },
        {
          id: 'paypal',
          shortName: 'PAYPAL'
        }
      ],
      activedPayWayBankinfoItem: this.$t('M.otc_index_Payment_method'), // 下拉框中选中的支付方式
      checkedPayType: '', // 下拉框支付方式中选中的支付方式查询列表
      IWantToBuySellArr: [] // 我要购买出售币种数组
    }
  },
  created () {
    require('../../../static/css/list/OTC/OTCCenter.css')
    require('../../../static/css/theme/day/OTC/OTCCenterDay.css')
    require('../../../static/css/theme/night/OTC/OTCCenterNight.css')
    // 1.0 otc可用币种查询：我要购买/我要出售的币种列表
    this.getOTCAvailableCurrencyList()
    // console.log(this.selectedOTCAvailableCurrencyName)
    // console.log(this.selectedOTCAvailableCurrencyCoinID)
    // console.log(this.userInfo)
    // 2.0 otc可用法币查询：
    // this.getMerchantAvailablelegalTenderList()
    // 3.0 用户登录了刷新用户个人信息
    console.log('是否登录' + this.isLogin)
    console.log('用户信息')
    console.log(this.userInfo)
    if (this.isLogin) {
      reflashUserInfo(this) // 刷新用户信息
    }
  },
  mounted () {
    // 如果是从购买和出售下单跳转过来的时候，页面加载打开到锚点位置：anchorStatus在全局先定义false，当用户购买或者出售时候改为true
    if (this.anchorStatus) {
      document.getElementById('orderView').scrollIntoView(true) // scrollIntoView(true)参数为true时候才调用此方法
    }
  },
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_OTC_AVAILABLE_CURRENCY_NAME',
      'CHANGE_OTC_AVAILABLE_CURRENCY_ID',
      'CHANGE_OTC_AVAILABLE_PARTNER_COIN_ID'
    ]),
    // 0.1 切换各订单状态tab面板
    toggleTabPane (tab, event) {
      // 防止频繁切换点击按钮 通过禁用按钮，0.5秒后可以点击
      this.isdisabled = true
      setTimeout(() => {
        this.isdisabled = false
      }, 500)
      console.log(this.activeName)
      console.log(this.isLogin)
      // 未登录跳转到登录页面去
      if (!this.isLogin) {
        this.$router.push({path: '/login'})
        return false
      } else {
        if (this.activeName === 'first') {
          console.log('调交易中订单')
          this.$refs.trading.getOTCTradingOrdersList() // 调用子组件交易中订单的方法
        }
        if (this.activeName === 'second') {
          console.log('调已完成订单')
          this.$refs.complete.getOTCCompletedOrdersList() // 调用子组件已完成订单的方法
        }
        if (this.activeName === 'third') {
          console.log('调已取消订单')
          this.$refs.canceled.getOTCCanceledOrdersList() // 调用子组件已取消订单的方法
        }
        if (this.activeName === 'fourth') {
          console.log('调冻结中订单')
          this.$refs.freezing.getOTCFrezzingOrdersList() // 调用子组件冻结中订单的方法
        }
        if (this.activeName === 'fifth') {
          console.log('调委托订单')
          this.$refs.entrust.getOTCEntrustingOrdersList() // 调用子组件委托订单的方法
        }
      }
    },
    // 0.2 点击发布订单按钮跳转到发布订单页面
    toPublishOrder () {
      // console.log(this.selectedOTCAvailableCurrencyCoinID)
      // console.log(this.activitedCurrencyId)
      // 增加没有币种和法币点击按钮不跳转的验证
      if (this.selectedOTCAvailableCurrencyCoinID == '' && this.activitedCurrencyId == '') {
        return false
      }
      // 未登录跳转到登录页面
      if (!this.isLogin) {
        this.$router.push({path: '/login'})
      } else {
        reflashUserInfo(this) // 刷新用户信息
        // 未设置交易密码、未实名认证，未高级认证，不能进行交易
        if (!this.userInfo.payPassword) {
          this.$message({
            message: this.$t('M.otc_index_js'), // 去个人中心设置交易密码
            type: 'error'
          })
          return false
        } else if (!this.userInfo.realname) {
          this.$message({
            message: this.$t('M.otc_index_digo_tips'), // 去个人中心完成实名认证
            type: 'error'
          })
          return false
        } else if (!(this.userInfo.advancedAuth === 'pass')) {
          this.$message({
            message: this.$t('M.otc_index_digo_tips_pass'), // 去个人中心完成高级认证
            type: 'error'
          })
          return false
        } else {
          // this.OTCBuySellStyle 当前买卖类型
          // this.selectedOTCAvailableCurrencyCoinID 选中的可用币种id
          // this.activitedCurrencyId 当前选中的可用法币id
          this.$router.push({path: '/OTCPublishBuyAndSell/' + this.OTCBuySellStyle + '/' + this.selectedOTCAvailableCurrencyCoinID + '/' + this.activitedCurrencyId})
        }
      }
    },
    // 0.3 点击 购买 或者 出售 按钮跳转到在线购买或者出售页面
    toOnlineBuyOrSell (id, coinId, userId) {
      if (!this.isLogin) {
        this.$router.push({path: '/login'})
      } else {
        // 刷新用户信息
        reflashUserInfo(this)
        // 未设置交易密码、未实名认证，未高级认证，不能进行交易
        if (!this.userInfo.payPassword) {
          this.$message({
            message: this.$t('M.otc_index_js'), // 去个人中心设置交易密码
            type: 'error'
          })
          return false
        } else if (!this.userInfo.realname) {
          this.$message({
            message: this.$t('M.otc_index_digo_tips'), // 去个人中心完成实名认证
            type: 'error'
          })
          return false
        } else if (!(this.userInfo.advancedAuth === 'pass')) {
          this.$message({
            message: this.$t('M.otc_index_digo_tips_pass'), // 去个人中心完成高级认证
            type: 'error'
          })
          return false
        } else {
          if (userId === this.userInfo.id) {
            this.$message({
              message: this.$t('M.otc_index_forbided_buyand_sell'), // 禁止自买自卖
              type: 'error'
            })
            return false
          } else {
            // console.log("买")
            // console.log(id) // 挂单id
            // console.log(coinId) // 币种id
            this.$router.push({path: '/OTCOnlineTraderBuySell/' + this.OTCBuySellStyle + '/' + id + '/' + coinId})
          }
        }
      }
    },
    // 0.4 点击出售按钮跳转到在线出售页面
    /* toOnlineSell (id, coinId, userId) {
      if (!this.isLogin) {
        this.$router.push({path: '/login'})
      } else {
        // 刷新用户信息
        reflashUserInfo(this)
        // 未设置交易密码、未实名认证，未高级认证，不能进行交易
        if (!this.userInfo.payPassword) {
          this.$message({
            message: this.$t('M.otc_index_js'), // 去个人中心设置交易密码
            type: 'error'
          })
          return false
        } else if (!this.userInfo.realname) {
          this.$message({
            message: this.$t('M.otc_index_digo_tips'), // 去个人中心完成实名认证
            type: 'error'
          })
          return false
        } else if (!(this.userInfo.advancedAuth === 'pass')) {
          this.$message({
            message: this.$t('M.otc_index_digo_tips_pass'), // 去个人中心完成高级认证
            type: 'error'
          })
          return false
        } else {
          if (userId === this.userInfo.id) {
            this.$message({
              message: this.$t('M.otc_index_forbided_buyand_sell'), // 禁止自买自卖
              type: 'error'
            })
            return false
          } else {
            // console.log("卖")
            // console.log(id) // 挂单id
            // console.log(coinId) // 币种id
            this.$router.push({path: '/OTCOnlineTraderBuySell/' + this.OTCBuySellStyle + '/' + id + '/' + coinId})
          }
        }
      }
    }, */
    // 0.5 查询更多订单按钮点击事件
    queryMoreOrder () {
      if (!this.isLogin) { // 未登录跳转登录页
        this.$router.push({path: '/login'})
      } else {
        // 登录后：商家用户跳转到商家订单；普通用户跳转到个人中心中的法币订单
        if (this.userInfo.type === 'COMMON') {
          this.$store.commit('personal/CHANGE_USER_CENTER_ACTIVE_NAME', 'fiat-orders')
          this.$router.push({path: '/PersonalCenter'})
        }
        if (this.userInfo.type === 'MERCHANT') {
          this.$router.push({path: '/OTCMerchantsOrders'})
        }
      }
    },
    // 0.6 解决OTC首页挂单列表剩余数量精度丢失问题
    getOTCRemainingSum (entrustCount, matchCount, symbol) {
      return amendPrecision(entrustCount, matchCount, symbol)
    },
    // 0.7 分页:改变页面刷新挂单列表
    changeCurrentPage (pageNum) {
      console.log(pageNum)
      this.currentPage = pageNum
      this.getOTCPutUpOrdersList() // otc主页面查询挂单列表
    },
    //  1.0 otc可用币种查询：我要购买/我要出售的币种列表
    async getOTCAvailableCurrencyList () {
      const data = await getOTCAvailableCurrency({
      })
      console.log('otc可用币种查询')
      console.log(data)
      // 提示信息
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑
        this.IWantToBuySellArr = data.data.data
        console.log(this.IWantToBuySellArr.length)
        if (this.IWantToBuySellArr.length) {
          this.CHANGE_OTC_AVAILABLE_CURRENCY_NAME(this.IWantToBuySellArr[0].name)
          this.CHANGE_OTC_AVAILABLE_CURRENCY_ID(this.IWantToBuySellArr[0].coinId)
          this.CHANGE_OTC_AVAILABLE_PARTNER_COIN_ID(this.IWantToBuySellArr[0].partnerCoinId)
          // console.log(this.selectedOTCAvailableCurrencyName)
          // console.log(this.selectedOTCAvailableCurrencyCoinID)
          // 在得到可用币种之后再调用方法根据币种的第一项的币种id来渲染表格数据
          // 2.0 otc可用法币查询：
          this.getMerchantAvailablelegalTenderList()
          // 3.0 otc主页面查询挂单列表:
          // this.getOTCPutUpOrdersList()
        }
      }
    },
    //  2.0 otc可用法币查询
    async getMerchantAvailablelegalTenderList () {
      const data = await getMerchantAvailablelegalTender({
      })
      console.log('otc法币查询列表')
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑
        this.availableCurrencyId = data.data.data
        this.activitedCurrencyId = this.availableCurrencyId[0].id
        this.activitedCurrencyName = this.availableCurrencyId[0].shortName
        // 3.0 otc主页面查询挂单列表:
        this.getOTCPutUpOrdersList()
      }
    },
    //  3.0 刚进页面时候 otc主页面查询挂单列表
    async getOTCPutUpOrdersList () {
      this.loading = true
      // console.log('当前页：' + this.currentPage)
      let param = {
        pageNum: this.currentPage,
        payType: this.checkedPayType, // 按照选中的支付方式查询列表
        coinId: this.selectedOTCAvailableCurrencyCoinID, // 币种id
        currencyId: this.activitedCurrencyId // 法币id
      }
      if (this.OTCBuySellStyle === 'onlineBuy') {
        param.entrustType = 'SELL' // 挂单类型（BUY SELL）
      }
      if (this.OTCBuySellStyle === 'onlineSell') {
        param.entrustType = 'BUY' // 挂单类型（BUY SELL）
      }
      const data = await getOTCPutUpOrders(param)
      console.log('otc主页面查询挂单列表')
      console.log(data)
      // 提示信息
      if (!(returnAjaxMessage(data, this, 0))) {
        this.loading = false
        return false
      } else {
        // 返回数据正确的逻辑
        this.loading = false
        this.onlineBuySellTableList = data.data.data.list
        // 分页
        this.totalPages = data.data.data.pages - 0
      }
    },
    //  4.0 选中我想购买和出售币种名称
    selectCurrencyName (index) {
      console.log(index)
      this.selectCurrencyNameStatus = index
      this.CHANGE_OTC_AVAILABLE_CURRENCY_NAME(this.IWantToBuySellArr[index].name) // 币种名称
      this.CHANGE_OTC_AVAILABLE_PARTNER_COIN_ID(this.IWantToBuySellArr[index].partnerCoinId) // 商户币种id
      this.CHANGE_OTC_AVAILABLE_CURRENCY_ID(this.IWantToBuySellArr[index].coinId) // 币种id
      console.log(this.selectedOTCAvailableCurrencyName)
      console.log('币种id：' + this.selectedOTCAvailableCurrencyCoinID)
      // console.log(this.selectedOTCAvailablePartnerCoinId)
      // 请求接口数据渲染表格
      // this.getSelectCurrencyNametOTCPutUpOrdersList()
      this.getOTCPutUpOrdersList() // otc主页面查询挂单列表
    },
    //  5.0 切换我要购买和出售时候调取接口获得数据渲染列表
    /* async getSelectCurrencyNametOTCPutUpOrdersList () {
      this.loading = true
      let param = {
        pageNum: this.currentPage,
        payType: this.checkedPayType, // 按照选中的支付方式查询列表
        coinId: this.selectedOTCAvailableCurrencyCoinID, // 币种id
        currencyId: this.activitedCurrencyId // 法币id
      }
      if (this.OTCBuySellStyle === 'onlineBuy') {
        param.entrustType = 'SELL' // 挂单类型（BUY SELL）
      }
      if (this.OTCBuySellStyle === 'onlineSell') {
        param.entrustType = 'BUY' // 挂单类型（BUY SELL）
      }
      const data = await getOTCPutUpOrders(param)
      console.log('otc主页面查询挂单列表')
      console.log(data)
      // 提示信息
      if (!returnAjaxMessage(data, this, 0)) {
        this.loading = false
        return false
      } else {
        // 返回数据正确的逻辑
        this.loading = false
        this.onlineBuySellTableList = data.data.data.list
        // 分页
        this.totalPages = data.data.data.pages - 0
      }
    }, */
    //  6.0 切换在线购买和在线售出状态并调接口渲染列表
    async toggleBuyOrSellStyle (e) {
      // 防止频繁切换点击按钮 通过禁用按钮，0.5秒后可以点击
      // this.isDisabledRadio = true
      // setTimeout(() => {
      //   this.isDisabledRadio = false
      // }, 500)
      this.OTCBuySellStyle = e
      console.log(this.OTCBuySellStyle)
      this.getOTCPutUpOrdersList() // otc主页面查询挂单列表
      /* let param = {
        pageNum: this.currentPage,
        payType: this.checkedPayType, // 按照选中的支付方式查询列表
        coinId: this.selectedOTCAvailableCurrencyCoinID, // 币种id
        currencyId: this.activitedCurrencyId // 法币id
      }
      if (this.OTCBuySellStyle === 'onlineBuy') {
        param.entrustType = 'SELL' // 挂单类型（BUY SELL）
      }
      if (this.OTCBuySellStyle === 'onlineSell') {
        param.entrustType = 'BUY' // 挂单类型（BUY SELL）
      }
      const data = await getOTCPutUpOrders(param)
      console.log('otc主页面查询挂单列表')
      console.log(data)
      // 提示信息
      if (!returnAjaxMessage(data, this, 0)) {
        this.loading = false
        return false
      } else {
        // 返回数据正确的逻辑
        this.loading = false
        this.onlineBuySellTableList = data.data.data.list
        // 分页
        this.totalPages = data.data.data.pages - 0
      } */
    },
    //  7.0 改变可用法币的币种id
    changeCurrencyId (e) {
      this.activitedCurrencyId = e
      console.log(this.activitedCurrencyId)
      this.availableCurrencyId.forEach(item => {
        if (e === item.id) {
          console.log(item.shortName)
          this.activitedCurrencyName = item.shortName
        }
      })
      // 调主页面查询otc挂单列表接口按照法币方式查询
      // this.getChangeCurrencyIdOTCPutUpOrdersList()
      this.getOTCPutUpOrdersList() // otc主页面查询挂单列表
    },
    //  8.0 改变可用法币的下拉框的选中值，调主页面查询otc挂单列表接口
    /* async getChangeCurrencyIdOTCPutUpOrdersList () {
      this.loading = true
      let param = {
        pageNum: this.currentPage,
        payType: this.checkedPayType, // 按照选中的支付方式查询列表
        coinId: this.selectedOTCAvailableCurrencyCoinID, // 币种id
        currencyId: this.activitedCurrencyId // 法币id
      }
      if (this.OTCBuySellStyle === 'onlineBuy') {
        param.entrustType = 'SELL' // 挂单类型（BUY SELL）
      }
      if (this.OTCBuySellStyle === 'onlineSell') {
        param.entrustType = 'BUY' // 挂单类型（BUY SELL）
      }
      const data = await getOTCPutUpOrders(param)
      console.log('otc主页面查询挂单列表')
      console.log(data)
      // 提示信息
      if (!returnAjaxMessage(data, this, 0)) {
        this.loading = false
        return false
      } else {
        // 返回数据正确的逻辑
        this.loading = false
        this.onlineBuySellTableList = data.data.data.list
        // 分页
        this.totalPages = data.data.data.pages - 0
      }
    }, */
    // 9.0 改变支付方式下拉框的选中值
    payWayChangeValue (e) {
      this.checkedPayType = e
      console.log(this.checkedPayType) //  选中的支付方式的id
      // 调主页面查询otc挂单列表接口按照支付方式查询列表
      // this.getChangePayWayOTCPutUpOrdersList()
      this.getOTCPutUpOrdersList() // otc主页面查询挂单列表
    }
    // 10.0 改变支付方式下拉框的选中值，调主页面查询otc挂单列表接口
    /* async getChangePayWayOTCPutUpOrdersList () {
      this.loading = true
      let param = {
        pageNum: this.currentPage,
        payType: this.checkedPayType, // 按照选中的支付方式查询列表
        coinId: this.selectedOTCAvailableCurrencyCoinID, // 币种id
        currencyId: this.activitedCurrencyId // 法币id
      }
      if (this.OTCBuySellStyle === 'onlineBuy') {
        param.entrustType = 'SELL' // 挂单类型（BUY SELL）
      }
      if (this.OTCBuySellStyle === 'onlineSell') {
        param.entrustType = 'BUY' // 挂单类型（BUY SELL）
      }
      const data = await getOTCPutUpOrders(param)
      console.log('otc主页面查询挂单列表')
      console.log(data)
      // 提示信息
      if (!returnAjaxMessage(data, this, 0)) {
        this.loading = false
        return false
      } else {
        // 返回数据正确的逻辑
        this.loading = false
        this.onlineBuySellTableList = data.data.data.list
        // 分页
        this.totalPages = data.data.data.pages - 0
      }
    } */
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      anchorStatus: state => state.OTC.anchorStatus, // OTC全局定义的锚点状态 默认为false
      selectedOTCAvailableCurrencyName: state => state.OTC.selectedOTCAvailableCurrencyName,
      selectedOTCAvailablePartnerCoinId: state => state.OTC.selectedOTCAvailablePartnerCoinId,
      selectedOTCAvailableCurrencyCoinID: state => state.OTC.selectedOTCAvailableCurrencyCoinID,
      language: state => state.common.language, // 当前选中语言
      activeLanguage: state => state.common.activeLanguage,
      userInfo: state => state.user.loginStep1Info.userInfo, // 用户详细信息
      isLogin: state => state.user.isLogin // 用户登录状态 false 未登录； true 登录
    })
  },
  watch: {
    activeLanguage (newVal) {
      // console.log('当前选中语言')
      // console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
// @import "../../../static/css/scss/OTC/OTCCenter.scss";
@import "../../../static/css/scss/index.scss";
.otc-box{
  >.otc-center-content{
    width: 1150px;
    margin: 36px auto 0px;
    >.otc-online-trading{
      >.otc-online-buy-and-sell-button{
        height: 45px;
        line-height: 45px;
        text-align: center;
        padding-bottom: 20px;
      }
      >.otc-merchant-content{
        // min-height: 564px;
        // min-height: 724px;
        // background-color: #202A33;
        margin-top: 30px;
        // padding: 0 10px;
        >.otc-filtrate-publish{
          display: flex;
          justify-content: space-between;
          padding: 25px 20px 0 20px;
          >.otc-filtrate-box{
            display: flex;
            align-items: center;
            >.otc-i-wan{
              // color: #fff;
            }
            >.otc-filtrate-style{
              // color: #838EA6;
              .currencyNameActived{
                // color: #338FF5;
                // font-weight: 700;
              }
              >.otc-filtrate-currency-name{
                margin: 0 10px;
                cursor: pointer;
              }
            }
          }
          >.otc-publish-box{
            >.pay-style{
              position: relative;
              margin-right: 5px;
              >.pay-style-icon{
                width: 14px;
                height: 14px;
                // color: #fff;
                position: absolute;
                left: 10px;
                top: 1px;
                z-index: 2;
              }
            }
            >.currency-style{
              position: relative;
              margin-right: 5px;
              >.currency-style-icon{
                // color: #fff;
                width: 14px;
                height: 14px;
                position: absolute;
                left: 10px;
                top: 1px;
                z-index: 2;
              }
            }
          }
        }
        >.otc-merchant-list{
          margin-top: 30px;
          height: 639px;
          // background-color:$mainContentNightBgColor;
          .remark-tips{
            display: inline-block;
            width: 100px;
            text-overflow: ellipsis; // 显示省略符号来代表被修剪的文本。
            white-space: nowrap; // 文本不会换行，文本会在在同一行上继续，直到遇到 <br> 标签为止。
            overflow: hidden;
            cursor: pointer;
          }
          .page{
            text-align: center;
            margin-top: 10px;
            padding-bottom: 20px;
          }
          .shang-icon{
            display: inline-block;
            width: 14px;
            height: 19px;
            vertical-align: top;
            cursor: pointer;
          }
          .xilian{
            vertical-align: middle;
          }
          .red{
            // color: #D45858;
          }
          position: relative;
          >.pay-way{
            display: inline-block;
            top: 10px;
            left: 616px;
            position: absolute;
            z-index: 1;
          }
          >.shade-pay-way{
            // color: #617499;
            display: inline-block;
            top: 15px;
            left: 631px;
            position: absolute;
            z-index: 2;
          }
        }
      }
    }
    >.otc-order-manage{
      // height: 800px;
      margin-top: 50px;
      // ceshi
      position: relative;
      // ceshi
      >.more{
        position: absolute;
        top: 440px;
        // left: 15px;
        font-size: 14px;
        // color: #338FF5;
        // text-decoration: underline !important;
        cursor: pointer;
        width: 90px;
        display: inline-block;
        text-align: center;
      }
      .otc-tab-pane-arrow-right{
        position: absolute;
        right: -12px;
        top: 27px;
        font-size: 20px;
        // color: #338FF5;
      }
      .icon{
        position: absolute;
        left: 35px;
        top: 22px;
      }
    }
  }
  &.night{
    background-color: $mainNightBgColor;
    >.otc-center-content{
      >.otc-online-trading{
        >.otc-online-buy-and-sell-button{
        }
        >.otc-merchant-content{
          // background-color: $mainNightBgColor;
          background-color: $mainContentNightBgColor;
          >.otc-filtrate-publish{
            >.otc-filtrate-box{
              >.otc-i-wan{
                color: #fff;
              }
              >.otc-filtrate-style{
                color: #A8AFBF;
                .currencyNameActived{
                  color: #338FF5;
                }
                >.otc-filtrate-currency-name{
                }
              }
            }
            >.otc-publish-box{
              >.pay-style{
                >.pay-style-icon{
                  color: #fff;
                }
              }
              >.currency-style{
                >.currency-style-icon{
                  color: #fff;
                }
              }
            }
          }
          >.otc-merchant-list{
            // height: 480px;
            background-color:$mainContentNightBgColor;
            .xilian{
            }
            .red{
              color: #D45858;
            }
            >.pay-way{
            }
            >.shade-pay-way{
              color: #617499;
            }
          }
          .page{
            text-align: center;
            margin-top: -10px;
            // padding-bottom: 20px;
            // padding-top: 20px;
            padding: 20px 0 20px 0;
            background-color: $mainContentNightBgColor;
          }
        }
      }
      >.otc-order-manage{
        >.more{
          color: #338FF5;
        }
        .otc-tab-pane-arrow-right{
          color: #338FF5;
        }
        .icon{
        }
      }
    }
  }
  &.day{
    background-color: $mainDayBgColor;
    >.otc-center-content{
      >.otc-online-trading{
        >.otc-online-buy-and-sell-button{
          background-color: $mainDayBgColor;
        }
        >.otc-merchant-content{
          // background-color: #202A33;
          // border:1px solid rgba(39,49,58,0.1);
          // border-top: 0;
          box-shadow:0px 0px 6px rgba(204,222,242,1);
          background-color: $mainDayBgColor;
          >.otc-filtrate-publish{
            >.otc-filtrate-box{
              >.otc-i-wan{
                color: #333333;
              }
              >.otc-filtrate-style{
                color: #7D90AC;
                .currencyNameActived{
                  color: #338FF5;
                }
                >.otc-filtrate-currency-name{
                  cursor: pointer;
                }
              }
            }
            >.otc-publish-box{
              >.pay-style{
                >.pay-style-icon{
                  color: #338FF5;
                }
              }
              >.currency-style{
                >.currency-style-icon{
                  color: #338FF5;
                }
              }
            }
          }
          >.otc-merchant-list{
            // height: 480px;
            .xilian{
            }
            .red{
              color: #D45858;
            }
            >.pay-way{
            }
            >.shade-pay-way{
              color: #617499;
            }
          }
          .page{
            text-align: center;
            margin-top: 10px;
            padding-bottom: 20px;
          }
        }
      }
      >.otc-order-manage{
        >.more{
          color: #338FF5;
        }
        .otc-tab-pane-arrow-right{
          color: #338FF5;
        }
        .icon{
        }
      }
    }
  }
}
</style>
