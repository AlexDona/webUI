<template>
  <div
    class="otc-box otc"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <!--2.0 在线交易和订单管理-->
    <div class="otc-center-content">
      <!-- 2.1 在线交易-->
      <div
        class="otc-online-trading"
        id="jumpScrollTop"
      >
        <!-- 2.1.1 在线购买和在线出售按钮-->
        <div class="otc-online-buy-and-sell-button">
          <el-radio-group
            v-model="OTCBuySellStyle"
            @change="toggleBuyOrSellStyle"
          >
            <el-radio-button
              label="onlineBuy"
              :disabled="isDisabledRadio"
            >
              <!-- 在线购买 -->
              {{ $t('M.otc_index_online_buy') }}
            </el-radio-button>
            <el-radio-button
              label="onlineSell"
              :disabled="isDisabledRadio"
            >
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
              <!-- 我要购买/我要出售 -->
              <span class="otc-i-wan">
                {{ OTCBuySellStyle === 'onlineBuy' ? $t('M.otc_index_wantTo_buy'): $t('M.otc_index_wantTo_sell') }}：
              </span>
              <div class="otc-filtrate-style">
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
                  v-model="checkedCurrencyId"
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
                    v-for="(item,index) in payWayBankInfoList"
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
              style="width: 100%;"
              :empty-text="$t('M.comm_no_data')"
            >
              <!-- 名称 -->
              <el-table-column
                :label="$t('M.otc_index_Merchant')"
                align="center"
              >
                <template slot-scope = "s">
                  <div>
                    <!-- 如果是商家显示商家图标：认证商家:MERCHANT-->
                    <el-tooltip
                      effect="dark"
                      :content="$t('M.otc_merchant')"
                      placement="bottom-start"
                    >
                      <img
                        src="../../assets/develop/shangjia.png"
                        class="merchant-icon"
                        v-show="s.row.userType === 'MERCHANT'"
                      >
                    </el-tooltip>
                    {{s.row.userName}}
                  </div>
                </template>
              </el-table-column>
              <!-- 成交率 -->
              <el-table-column
                :label="$t('M.otc_index_turnover')"
              >
                <template slot-scope = "s">
                  <div v-if="s.row.successOrderTimes === 0 || s.row.tradeTimes === 0">
                    0%
                  </div>
                  <div v-else>
                    {{((s.row.successOrderTimes/(s.row.tradeTimes)) * 100).toFixed(2)}}%
                  </div>
                </template>
              </el-table-column>
              <!-- 数量 -->
              <el-table-column
                :label="$t('M.comm_count')"
              >
                <template slot-scope = "s">
                  <div>
                    <!-- 后台添加了剩余数量字段remainCount-->
                    {{filterNumber(s.row.remainCount)}}{{selectedOTCAvailableCurrencyName}}
                  </div>
                </template>
              </el-table-column>
              <!-- 价格 -->
              <el-table-column
                :label="$t('M.otc_index_price')"
              >
                <template slot-scope = "s">
                  <!-- 此处的单位根据设置中的法币类型来变化：为人民币时候显示CNY，为美元时候显示$ 此处需要从全局拿到设置中的法币类型来渲染页面-->
                  <div class="red">
                    {{filterNumber(s.row.price)}}{{checkedCurrencyName}}
                  </div>
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
                      v-show="s.row.payTypes[0] === '1'"
                    />
                    <!-- 2微信 -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-weixin1"
                      v-show="s.row.payTypes[1] === '1'"
                    />
                    <!-- 3银行卡 -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-yinhangqia"
                      v-show="s.row.payTypes[2] === '1'"
                    />
                    <!-- 4西联汇款 -->
                    <span v-show="s.row.payTypes[3] == '1'">
                      <img
                        src="../../assets/user/xilian.png"
                        class="xilian"
                      >
                    </span>
                    <!--  5PAYPAL -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-paypal"
                      v-show="s.row.payTypes[4] === '1'"
                    />
                  </div>
                </template>
              </el-table-column>
              <!-- 限额 -->
              <el-table-column
                :label="$t('M.otc_index_priceLimit')"
              >
                <template slot-scope = "s">
                  <div>
                    {{ filterNumber(s.row.minCount) }}~{{ filterNumber(s.row.maxCount) }}{{checkedCurrencyName}}
                  </div>
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
                    <!-- 购买 -->
                    {{$t('M.comm_buying')}}
                  </el-button>
                  <el-button
                    type="success"
                    size="mini"
                    v-if="OTCBuySellStyle === 'onlineSell'"
                    @click="toOnlineBuyOrSell(s.row.id,s.row.coinId,s.row.userId)"
                  >
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
            :disabled="isDisabled"
          >
            <span slot="label">
              <i
                class="el-icon-caret-right otc-tab-pane-arrow-right"
                v-show="activeName === 'first'"
              >
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
            :disabled="isDisabled"
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
            :disabled="isDisabled"
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
            :disabled="isDisabled"
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
            :disabled="isDisabled"
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
import {
  amendPrecision,
  scientificToNumber
} from '../../utils'
import {
  getOTCAvailableCurrency,
  getOTCPutUpOrders,
  getMerchantAvailableLegalTender
} from '../../utils/api/OTC'
import IconFontCommon from '../../components/Common/IconFontCommon'
import OTCTradingOrder from '../../components/OTC/OTCTradingOrder'
import OTCCompletedOrder from '../../components/OTC/OTCCompletedOrder'
import OTCCanceledOrder from '../../components/OTC/OTCCanceledOrder'
import OTCFreezingOrder from '../../components/OTC/OTCFreezingOrder'
import OTCEntrustOrder from '../../components/OTC/OTCEntrustOrder'
import {
  // returnAjaxMsg,
  getNestedData
} from '../../utils/commonFunc'
import {
  mapState,
  mapMutations,
  mapActions
} from 'vuex'
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
      // 订单tabs面板切换禁用状态
      isDisabled: false,
      // 在线购买和在线出售按钮禁用状态
      isDisabledRadio: false,
      // loading加载
      loading: false,
      // 分页
      // 当前页码
      currentPage: 1,
      // 总页数
      totalPages: 1,
      // 可用法币币种数组
      // 选中的可用法币id
      checkedCurrencyId: '',
      // 选中的可用法币name
      checkedCurrencyName: '',
      availableCurrencyId: [],
      // 选中的tab面板的序号
      activeName: 'first',
      //  订单管理面板标签方向状态
      tabPosition: 'left',
      //  在线购买和在线出售选中类型
      OTCBuySellStyle: 'onlineBuy',
      //  选中我要购买或者出售的币种名称
      selectCurrencyNameStatus: 0,
      // 在线购买和在线出售表格列表
      onlineBuySellTableList: [],
      // 支付方式下拉框数据
      payWayBankInfoList: [
        {
          id: '',
          shortName: 'M.comm_all' // 全部
        },
        {
          id: 'Alipay',
          shortName: 'M.comm_alipay' // 支付宝
        },
        {
          id: 'Wechat',
          shortName: 'M.comm_weixin' // 微信
        },
        {
          id: 'Bankcard',
          shortName: 'M.comm_bank' // 银行卡
        },
        {
          id: 'WestUnion',
          shortName: 'M.comm_xilian' // 西联汇款
        },
        {
          id: 'PAYPAL',
          shortName: 'PAYPAL'
        }
      ],
      // 下拉框中选中的支付方式
      // activedPayWayBankinfoItem: this.$t('M.otc_index_Payment_method'),
      // 下拉框支付方式中选中的支付方式查询列表
      checkedPayType: '',
      // 我要购买出售币种数组
      IWantToBuySellArr: [],
      isDisabledTimer: null // 面板切换防止频繁点击倒计时
    }
  },
  async created () {
    // 1.0 otc可用币种查询：我要购买/我要出售的币种列表
    await this.getOTCAvailableCurrencyList()
    // 2.0 otc可用法币查询：
    await this.getMerchantAvailableLegalTenderList()
    // 3.0 otc主页面查询挂单列表:
    await this.getOTCPutUpOrdersList()
    // 4.0 用户登录了刷新用户个人信息
    if (this.isLogin) {
      this.reflashUserInfo() // 刷新用户信息
    }
  },
  mounted () {
    // 如果是从购买和出售下单跳转过来的时候，页面加载打开到锚点位置：anchorStatus在全局先定义false，当用户购买或者出售时候改为true
    if (this.anchorStatus) {
      document.getElementById('orderView').scrollIntoView(true) // scrollIntoView(true)参数为true时候才调用此方法
      // 改变全局锚点状态
      this.CHANGE_OTC_ANCHOR_STATUS(false)
    }
    // 发布订单（商家和普通用户公用）后页面跳转到首页顶部状态
    if (this.publishOrderJumpTopStatus) {
      document.getElementById('jumpScrollTop').scrollIntoView(true) // scrollIntoView(true)参数为true时候才调用此方法
      // 改变发布订单（商家和普通用户公用）后页面跳转到首页顶部状态
      this.CHANGE_PUBLISH_ORDER_JUMP_TOP_STATUS(false)
    }
  },
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapActions([
      'REFRESH_USER_INFO_ACTION'
    ]),
    ...mapMutations([
      'CHANGE_OTC_AVAILABLE_CURRENCY_NAME',
      'CHANGE_OTC_AVAILABLE_CURRENCY_ID',
      'CHANGE_OTC_AVAILABLE_PARTNER_COIN_ID',
      'UPDATE_OTC_HOME_LIST_STATUS',
      // 改变全局锚点状态方法
      'CHANGE_OTC_ANCHOR_STATUS',
      // 发布订单（商家和普通用户公用）后页面跳转到首页顶部状态
      'CHANGE_PUBLISH_ORDER_JUMP_TOP_STATUS',
      'CHANGE_USER_CENTER_ACTIVE_NAME'
    ]),
    // 刷新个人信息
    reflashUserInfo () {
      this.REFRESH_USER_INFO_ACTION()
    },
    // 科学计数法转换
    filterNumber (num) {
      return scientificToNumber(num)
    },
    // 0.1 切换各订单状态tab面板
    toggleTabPane (tab, event) {
      // 防止频繁切换点击按钮 通过禁用按钮，0.5秒后可以点击
      this.isDisabled = true
      this.isDisabledTimer = setTimeout(() => {
        this.isDisabled = false
      }, 500)
      // 未登录跳转到登录页面去
      if (!this.isLogin) {
        this.$router.push({path: '/login'})
        return false
      } else {
        if (this.activeName === 'first') {
          // console.log('调交易中订单')
          this.$refs.trading.getOTCTradingOrdersList() // 调用子组件交易中订单的方法
        }
        if (this.activeName === 'second') {
          // console.log('调已完成订单')
          this.$refs.complete.getOTCCompletedOrdersList() // 调用子组件已完成订单的方法
        }
        if (this.activeName === 'third') {
          // console.log('调已取消订单')
          this.$refs.canceled.getOTCCanceledOrdersList() // 调用子组件已取消订单的方法
        }
        if (this.activeName === 'fourth') {
          // console.log('调冻结中订单')
          this.$refs.freezing.getOTCFreezingOrdersList() // 调用子组件冻结中订单的方法
        }
        if (this.activeName === 'fifth') {
          // console.log('调委托订单')
          this.$refs.entrust.getOTCEntrustingOrdersList() // 调用子组件委托订单的方法
        }
      }
    },
    // 0.2 点击发布订单按钮跳转到发布订单页面
    toPublishOrder () {
      // 增加没有币种和法币点击按钮不跳转的验证
      if (!this.selectedOTCAvailableCurrencyCoinID) {
        // message: '请选择要发布的币种',
        this.$message({
          message: this.$t('M.otc_publish_order_err_tips1'),
          type: 'error'
        })
        return false
      }
      if (!this.checkedCurrencyId) {
        // message: '请选择法币类型',
        this.$message({
          message: this.$t('M.otc_publish_order_err_tips2'),
          type: 'error'
        })
        return false
      }
      // 未登录跳转到登录页面
      if (!this.isLogin) {
        this.$router.push({path: '/login'})
      } else {
        this.reflashUserInfo() // 刷新用户信息
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
          // this.checkedCurrencyId 当前选中的可用法币id
          this.$router.push({path: '/OTCPublishBuyAndSell/' + this.OTCBuySellStyle + '/' + this.selectedOTCAvailableCurrencyCoinID + '/' + this.checkedCurrencyId})
        }
      }
    },
    // 0.3 点击 购买 或者 出售 按钮跳转到在线购买或者出售页面
    toOnlineBuyOrSell (id, coinId, userId) {
      if (!this.isLogin) {
        this.$router.push({path: '/login'})
      } else {
        // 刷新用户信息
        this.reflashUserInfo()
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
            // console.log(id) // 挂单id
            // console.log(coinId) // 币种id
            this.$router.push({path: '/OTCOnlineTraderBuySell/' + this.OTCBuySellStyle + '/' + id + '/' + coinId})
          }
        }
      }
    },
    // 0.5 查询更多订单按钮点击事件
    queryMoreOrder () {
      if (!this.isLogin) { // 未登录跳转登录页
        this.$router.push({path: '/login'})
      } else {
        // 登录后：商家用户跳转到商家订单；普通用户跳转到个人中心中的法币订单
        if (this.userInfo.type === 'COMMON') {
          this.CHANGE_USER_CENTER_ACTIVE_NAME('fiat-orders')
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
      this.currentPage = pageNum
      this.getOTCPutUpOrdersList() // otc主页面查询挂单列表
    },
    //  1.0 otc可用币种查询：我要购买/我要出售的币种列表
    async getOTCAvailableCurrencyList () {
      const data = await getOTCAvailableCurrency({})
      // console.log('otc可用币种查询')
      // console.log(data)
      // 返回数据正确的逻辑
      if (!data) return false
      if (data.data) {
        this.IWantToBuySellArr = getNestedData(data, 'data')
        if (this.IWantToBuySellArr.length) {
          this.CHANGE_OTC_AVAILABLE_CURRENCY_NAME(this.IWantToBuySellArr[0].name)
          this.CHANGE_OTC_AVAILABLE_CURRENCY_ID(this.IWantToBuySellArr[0].coinId)
          this.CHANGE_OTC_AVAILABLE_PARTNER_COIN_ID(this.IWantToBuySellArr[0].partnerCoinId)
          // 在得到可用币种之后再调用方法根据币种的第一项的币种id来渲染表格数据
          // 2.0 otc可用法币查询：
          // this.getMerchantAvailableLegalTenderList()
          // 3.0 otc主页面查询挂单列表:
          // this.getOTCPutUpOrdersList()
        }
      }
    },
    //  2.0 otc可用法币查询
    async getMerchantAvailableLegalTenderList () {
      const data = await getMerchantAvailableLegalTender({})
      // console.log('otc法币查询列表')
      // console.log(data)
      // 返回数据正确的逻辑
      if (!data) return false
      if (data.data) {
        this.availableCurrencyId = getNestedData(data, 'data')
        // console.log(this.availableCurrencyId)
        this.checkedCurrencyId = getNestedData(this.availableCurrencyId[0], 'id')
        this.checkedCurrencyName = getNestedData(this.availableCurrencyId[0], 'shortName')
        // 3.0 otc主页面查询挂单列表:
        // this.getOTCPutUpOrdersList()
      }
    },
    //  3.0 刚进页面时候 otc主页面查询挂单列表
    async getOTCPutUpOrdersList () {
      if (this.selectedOTCAvailableCurrencyCoinID && this.checkedCurrencyId) {
        // console.log('有法币和可以币种id')
        this.loading = true
        let param = {
          pageNum: this.currentPage,
          payType: this.checkedPayType, // 按照选中的支付方式查询列表
          coinId: this.selectedOTCAvailableCurrencyCoinID, // 币种id
          currencyId: this.checkedCurrencyId // 法币id
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
        // 返回数据正确的逻辑
        this.loading = false
        if (!data) return false
        if (data) {
          let orderListData = getNestedData(data, 'data')
          this.onlineBuySellTableList = getNestedData(orderListData, 'list')
          // 分页
          this.totalPages = getNestedData(orderListData, 'pages') - 0
          // 改变全局 委托定单撤单后，更新首页挂单列表状态
          this.UPDATE_OTC_HOME_LIST_STATUS(false)
        }
      } else {
        // console.log('没有法币或者可以币种id')
        // console.log(this.selectedOTCAvailableCurrencyCoinID)
        // console.log(this.checkedCurrencyId)
        return false
      }
    },
    //  4.0 选中我想购买和出售币种名称
    selectCurrencyName (index) {
      this.currentPage = 1
      console.log(this.currentPage)
      // console.log(index)
      this.selectCurrencyNameStatus = index
      this.CHANGE_OTC_AVAILABLE_CURRENCY_NAME(this.IWantToBuySellArr[index].name) // 币种名称
      this.CHANGE_OTC_AVAILABLE_PARTNER_COIN_ID(this.IWantToBuySellArr[index].partnerCoinId) // 商户币种id
      this.CHANGE_OTC_AVAILABLE_CURRENCY_ID(this.IWantToBuySellArr[index].coinId) // 币种id
      // console.log(this.selectedOTCAvailableCurrencyName)
      // console.log('币种id：' + this.selectedOTCAvailableCurrencyCoinID)
      this.getOTCPutUpOrdersList() // otc主页面查询挂单列表
    },
    //  6.0 切换在线购买和在线售出状态并调接口渲染列表
    async toggleBuyOrSellStyle (e) {
      this.currentPage = 1
      // console.log(this.currentPage)
      this.OTCBuySellStyle = e
      this.getOTCPutUpOrdersList() // otc主页面查询挂单列表
    },
    //  7.0 改变可用法币的币种id
    changeCurrencyId (e) {
      this.currentPage = 1
      console.log(this.currentPage)
      this.checkedCurrencyId = e
      // console.log(this.checkedCurrencyId)
      this.availableCurrencyId.forEach(item => {
        if (e === item.id) {
          // console.log(item.shortName)
          this.checkedCurrencyName = item.shortName
        }
      })
      // otc主页面查询挂单列表
      this.getOTCPutUpOrdersList()
    },
    // 9.0 改变支付方式下拉框的选中值
    payWayChangeValue (e) {
      this.currentPage = 1
      console.log(this.currentPage)
      this.checkedPayType = e
      // console.log(this.checkedPayType) //  选中的支付方式的id
      this.getOTCPutUpOrdersList() // otc主页面查询挂单列表
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      anchorStatus: state => state.OTC.anchorStatus, // OTC全局定义的锚点状态 默认为false
      publishOrderJumpTopStatus: state => state.OTC.publishOrderJumpTopStatus, // 发布订单（商家和普通用户公用）后页面跳转到首页顶部状态 默认为false
      selectedOTCAvailableCurrencyName: state => state.OTC.selectedOTCAvailableCurrencyName,
      selectedOTCAvailablePartnerCoinId: state => state.OTC.selectedOTCAvailablePartnerCoinId,
      selectedOTCAvailableCurrencyCoinID: state => state.OTC.selectedOTCAvailableCurrencyCoinID,
      language: state => state.common.language, // 当前选中语言
      userInfo: state => state.user.loginStep1Info.userInfo, // 用户详细信息
      isLogin: state => state.user.isLogin, // 用户登录状态 false 未登录； true 登录
      updateOTCHomeListStatus: state => state.OTC.updateOTCHomeListStatus // 委托定单撤单后，更新首页挂单列表状态
    })
  },
  watch: {
    updateOTCHomeListStatus (newVal) {
      // console.log(newVal)
      if (newVal) {
        this.getOTCPutUpOrdersList() // otc主页面查询挂单列表
      }
    }
  },
  destroyed () {
    // 离开本组件清除定时器
    if (this.isDisabledTimer) {
      clearTimeout(this.isDisabledTimer)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
@import "../../../static/css/scss/index.scss";

.otc-box {
  margin-top: 66px;

  > .otc-center-content {
    width: 1150px;
    padding-top: 30px;
    margin: 36px auto 100px;

    > .otc-online-trading {
      > .otc-online-buy-and-sell-button {
        height: 45px;
        padding: 50px 0 30px;
        line-height: 45px;
        text-align: center;
      }

      > .otc-merchant-content {
        margin-top: 30px;

        > .otc-filtrate-publish {
          display: flex;
          justify-content: space-between;
          padding: 25px 20px 0;

          > .otc-filtrate-box {
            display: flex;
            align-items: center;

            > .otc-filtrate-style {
              > .otc-filtrate-currency-name {
                margin: 0 10px;
                cursor: pointer;
              }
            }
          }

          > .otc-publish-box {
            > .pay-style {
              position: relative;
              margin-right: 5px;

              > .pay-style-icon {
                position: absolute;
                z-index: 2;
                top: 1px;
                left: 10px;
                width: 14px;
                height: 14px;
              }
            }

            > .currency-style {
              position: relative;
              margin-right: 5px;

              > .currency-style-icon {
                position: absolute;
                z-index: 2;
                top: 1px;
                left: 10px;
                width: 14px;
                height: 14px;
              }
            }
          }
        }

        > .otc-merchant-list {
          position: relative;
          height: 639px;
          margin-top: 30px;

          .remark-tips {
            display: inline-block;
            width: 100px;
            overflow: hidden;
            text-overflow: ellipsis; // 显示省略符号来代表被修剪的文本。
            white-space: nowrap; // 文本不会换行，文本会在在同一行上继续，直到遇到 <br> 标签为止。
            cursor: pointer;
          }

          .page {
            padding-bottom: 20px;
            margin-top: 10px;
            text-align: center;
          }

          .merchant-icon {
            display: inline-block;
            width: 14px;
            height: 19px;
            vertical-align: top;
            cursor: pointer;
          }

          .xilian {
            vertical-align: middle;
          }

          > .pay-way {
            position: absolute;
            z-index: 1;
            top: 10px;
            left: 616px;
            display: inline-block;
          }

          > .shade-pay-way {
            position: absolute;
            z-index: 2;
            top: 15px;
            left: 631px;
            display: inline-block;
          }
        }
      }
    }

    > .otc-order-manage {
      position: relative;
      margin-top: 50px;

      > .more {
        position: absolute;
        top: 440px;
        display: inline-block;
        width: 90px;
        font-size: 14px;
        text-align: center;
        cursor: pointer;
      }

      .otc-tab-pane-arrow-right {
        position: absolute;
        top: 27px;
        right: -12px;
        font-size: 20px;
      }

      .icon {
        position: absolute;
        top: 22px;
        left: 35px;
      }
    }
  }

  /deep/ {
    .otc-online-buy-and-sell-button {
      .el-radio-button__inner {
        border: 0;
      }
    }

    .el-radio-button {
      &:first-child,
      &:last-child {
        .el-radio-button__inner {
          width: 150px;
        }
      }
    }

    .otc-publish-box {
      .el-input {
        width: 120px;
      }

      .el-input__inner {
        height: 32px;
        border: 0;
        line-height: 33px;
      }

      .el-input--suffix {
        .el-input__inner {
          padding: 2px 30px;
        }
      }

      .el-button {
        padding: 9px 16px;
        border: 0;
      }
    }

    .otc-merchant-list {
      .el-table {
        td {
          padding: 15px 0;
        }
      }

      .el-table__column-filter-trigger {
        i {
          font-weight: 700;
          font-size: 14px;
        }
      }

      .el-table__empty-block {
        height: 620px;
      }
    }

    .el-tabs__active-bar {
      height: 0 !important;
    }

    .el-tabs__nav-wrap {
      overflow: visible;

      &::after {
        background-color: transparent;
      }
    }

    .el-tabs__item {
      height: 45px;
      padding: 0;
      line-height: 45px;
    }

    .el-tabs--left {
      .el-tabs__item {
        &.is-left {
          width: 90px;
          height: 84px;
          line-height: 110px;
          text-align: center;
        }
      }

      .el-tabs__header {
        &.is-left {
          margin-right: 16px;
        }
      }
    }

    .el-tabs__nav-scroll {
      overflow: visible;
    }
  }

  &.night {
    background-color: $mainNightBgColor;

    > .otc-center-content {
      > .otc-online-trading {
        > .otc-merchant-content {
          background-color: $mainContentNightBgColor;

          > .otc-filtrate-publish {
            > .otc-filtrate-box {
              > .otc-i-wan {
                color: #fff;
              }

              > .otc-filtrate-style {
                color: #a8afbf;

                .currencyNameActived {
                  color: #338ff5;
                }
              }
            }

            > .otc-publish-box {
              > .pay-style {
                > .pay-style-icon {
                  color: #fff;
                }
              }

              > .currency-style {
                > .currency-style-icon {
                  color: #fff;
                }
              }
            }
          }

          > .otc-merchant-list {
            background-color: $mainContentNightBgColor;

            .red {
              color: #d45858;
            }

            > .shade-pay-way {
              color: #617499;
            }
          }

          .page {
            padding: 20px 0;
            margin-top: -10px;
            text-align: center;
            background-color: $mainContentNightBgColor;
          }
        }
      }

      > .otc-order-manage {
        > .more {
          color: #338ff5;
        }

        .otc-tab-pane-arrow-right {
          color: #338ff5;
        }
      }
    }

    /deep/ {
      .otc-online-buy-and-sell-button {
        .el-radio-button__inner {
          color: #d8d8d8;
          background: #1c1f32;
        }

        .el-radio-button {
          &.is-active {
            .el-radio-button__inner {
              color: #fff;
            }
          }

          &:first-child {
            &.is-active {
              .el-radio-button__inner {
                background-color: #d45858;
              }
            }
          }

          &:last-child {
            &.is-active {
              .el-radio-button__inner {
                background-color: #008069;
              }
            }
          }
        }

        .el-radio-button__orig-radio:checked + .el-radio-button__inner {
          box-shadow: -1px 0 0 0 #008069;
        }
      }

      .otc-publish-box {
        .el-input__inner {
          border: 1px solid #7d90ac;
          background-color: #19202e;
        }

        .el-button {
          background: linear-gradient(90deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
        }
      }

      .el-table {
        color: #fff;
        background-color: #202a33;

        tr {
          background-color: #1c1f32;
        }

        thead {
          color: #a9bed4;
        }

        th {
          background-color: #1c1f32;

          &.is-leaf {
            border-bottom: 1px solid rgba(97, 116, 153, .05);
          }

          > .cell {
            &.highlight {
              color: #617499;
            }
          }
        }
      }

      .otc-center-content {
        .otc-merchant-content {
          .el-table {
            td {
              border-bottom: 1px solid rgba(97, 116, 153, .05);
            }
          }
        }
      }

      .el-table--enable-row-hover {
        .el-table__body {
          tr {
            &:hover {
              > td {
                background-color: #1d2331;
              }
            }
          }
        }
      }

      .el-table__column-filter-trigger {
        i {
          color: #338ff5;
        }
      }

      .el-button--danger {
        border-color: #d45858;
        background-color: #d45858;
      }

      .invest-list-body {
        .el-table {
          td {
            border-top: 1px solid rgba(97, 116, 153, .2);
            box-shadow: none;
          }

          th {
            &.is-leaf {
              border-top: 1px solid rgba(97, 116, 153, .2);
              box-shadow: none;
            }
          }
        }
      }

      .el-button--success {
        border-color: #008069;
        background-color: #008069;
      }

      .el-table__empty-block {
        background-color: #1c1f32;
      }

      .el-table__empty-text {
        color: rgba(255, 255, 255, .8);
      }

      .el-tabs__item {
        color: #4f85da;

        &.is-active {
          color: #fff;
          background-color: #338ff5;
        }
      }
    }
  }

  &.day {
    background-color: $mainDayBgColor;

    > .otc-center-content {
      > .otc-online-trading {
        > .otc-online-buy-and-sell-button {
          background-color: $mainDayBgColor;
        }

        > .otc-merchant-content {
          background-color: $mainDayBgColor;
          box-shadow: 0 0 6px rgba(204, 222, 242, 1);

          > .otc-filtrate-publish {
            > .otc-filtrate-box {
              > .otc-i-wan {
                color: #333;
              }

              > .otc-filtrate-style {
                color: #7d90ac;

                .currencyNameActived {
                  color: #338ff5;
                }

                > .otc-filtrate-currency-name {
                  cursor: pointer;
                }
              }
            }

            > .otc-publish-box {
              > .pay-style {
                > .pay-style-icon {
                  color: #338ff5;
                }
              }

              > .currency-style {
                > .currency-style-icon {
                  color: #338ff5;
                }
              }
            }
          }

          > .otc-merchant-list {
            .red {
              color: #d45858;
            }

            > .shade-pay-way {
              color: #617499;
            }
          }

          .page {
            padding-bottom: 20px;
            margin-top: 10px;
            text-align: center;
          }
        }
      }

      > .otc-order-manage {
        > .more {
          color: #338ff5;
        }

        .otc-tab-pane-arrow-right {
          color: #338ff5;
        }
      }
    }

    /deep/ {
      .otc-online-buy-and-sell-button {
        .el-radio-button__inner {
          border: 1px solid rgba(39, 49, 58, .1);
          color: #333;
          background: #fff;
        }

        .el-radio-button {
          &.is-active {
            .el-radio-button__inner {
              border: 1px solid rgba(39, 49, 58, .1);
              color: #fff;
            }
          }

          &:first-child {
            &.is-active {
              .el-radio-button__inner {
                background-color: #d45858;
              }
            }
          }

          &:last-child {
            &.is-active {
              .el-radio-button__inner {
                background-color: #008069;
              }
            }
          }
        }

        .el-radio-button__orig-radio:checked + .el-radio-button__inner {
          box-shadow: -1px 0 0 0 #008069;
        }
      }

      .otc-publish-box {
        .el-input__inner {
          border: 1px solid #7d90ac;
          background-color: #fff;
        }

        .el-button {
          background: linear-gradient(90deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
        }
      }

      .el-table {
        color: #333;
        background-color: #202a33;

        th {
          background-color: #fff;

          &.is-leaf {
            border-bottom: 1px solid rgba(97, 116, 153, .2);
          }

          > .cell {
            &.highlight {
              color: #617499;
            }
          }
        }

        tr {
          background-color: #fff;
        }

        thead {
          color: #7d90ac;
        }

        td {
          border-bottom: 1px solid rgba(97, 116, 153, .1);
        }
      }

      .el-table--enable-row-hover {
        .el-table__body {
          tr {
            &:hover {
              > td {
                background-color: #fff;
              }
            }
          }
        }
      }

      .el-table__column-filter-trigger {
        i {
          color: #338ff5;
        }
      }

      .el-button--danger {
        border-color: #d45858;
        background-color: #d45858;
      }

      .el-button--success {
        border-color: #008069;
        background-color: #008069;
      }

      .el-table__empty-block {
        background-color: #fff;
      }

      .el-table__empty-text {
        color: #333;
      }

      .el-tabs__item {
        color: #4f85da;

        &.is-active {
          color: #fff;
          background-color: #338ff5;
        }
      }
    }
  }
}
</style>
