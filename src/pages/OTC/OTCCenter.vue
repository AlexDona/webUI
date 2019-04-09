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
            <!-- 国家列表、支付方式、货比类型、发布订单按钮 -->
            <div class="otc-publish-box">
              <!-- 增加国家-国家列表-->
              <!--进来网站默认显示中国国家和人民币法币-->
              <span class="country-style">
                <IconFontCommon
                  class="country-style-icon"
                  iconName="icon-guojia2"
                />
                <el-select
                  v-model="checkedCountryId"
                  @change="changeCountryId"
                  :placeholder="$t('M.comm_please_choose')"
                  :no-data-text="$t('M.comm_no_data')"
                  :disabled="countrySelectStatus"
                >
                  <el-option
                    v-for="(item, index) in countryInfoList"
                    :key="index"
                    :label="language === 'zh_CN' || language === 'zh_TW'? item.countryName : item.englishName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </span>
              <!-- 货币类型 -->
              <span class="currency-style">
                <IconFontCommon
                  class="currency-style-icon"
                  iconName="icon-jinbi"
                />
                <!-- 货币类型 -->
                <el-select
                  :disabled="currencyCoinSelectStatus"
                  v-model="checkedCurrencyId"
                  @change="changeCurrencyId"
                  :placeholder="$t('M.otc_index_currency_type')"
                  :no-data-text="$t('M.comm_no_data')"
                >
                  <el-option
                    v-for="(item, index) in availableCurrencyId"
                    :key="index"
                    :label="language === 'zh_CN'? item.name : item.shortName"
                    :value="item.id"
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
                v-if="userPutUpOrderStatus"
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
                    <img
                      src="../../assets/develop/shangjia.png"
                      class="merchant-icon"
                      v-show="s.row.userType === 'MERCHANT'"
                      :title="$t('M.otc_merchant')"
                    >
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
                    {{$scientificToNumber(s.row.remainCount)}}{{selectedOTCAvailableCurrencyName}}
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
                    {{$scientificToNumber(s.row.price)}}{{checkedCurrencyName}}
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
                    <span v-show="s.row.payTypes[3] === '1'">
                      <img
                        src="../../assets/user/xilian.png"
                        class="xilian"
                      >
                    </span>
                    <!-- 5PAYPAL -->
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
                  <div>
                    {{ $scientificToNumber(s.row.minCount) }}~{{ $scientificToNumber(s.row.maxCount) }}{{checkedCurrencyName}}
                  </div>
                </template>
              </el-table-column>
              <!-- 备注 -->
                <el-table-column
                  :label="$t('M.comm_remark')"
                  width="100"
                >
                <template slot-scope = "s">
                  <span
                    class="remark-tips"
                    :title="s.row.remark"
                  >
                    {{s.row.remark}}
                  </span>
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
                    @click="toOnlineBuyOrSell(s.row.id,s.row.coinId,s.row.userId,s.row.country)"
                  >
                    <!-- 购买 -->
                    {{$t('M.comm_buying')}}
                  </el-button>
                  <el-button
                    type="success"
                    size="mini"
                    v-if="OTCBuySellStyle === 'onlineSell'"
                    @click="toOnlineBuyOrSell(s.row.id,s.row.coinId,s.row.userId,s.row.country)"
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
        <!--交易中订单右箭头-->
        <div class="trading-order-right-arrow">
          <i
            class="el-icon-caret-right font-size20"
            v-if="activeName === 'first'"
          >
          </i>
        </div>
        <!--交易中订单图标沙漏-->
        <div
          class="trading-order-sand-clock cursor-pointer"
          @click="toggleTradingOrder"
        >
          <IconFontCommon
            v-if="activeName === 'first'"
            iconName="icon-shalou"
            style="color: #fff;"
          />
          <IconFontCommon
            v-else
            iconName="icon-shalou"
            style="color: #4f85da;"
          />
        </div>
        <!--订单管理tab栏-->
        <el-tabs
          :tab-position = "tabPosition"
          @tab-click = "toggleTabPane"
          v-model = "activeName"
        >
          <!-- 2.2.1 交易中的订单 -->
          <el-tab-pane
            name = "first"
            :disabled="isDisabled"
            :label="$t('M.otc_trading')"
          >
            <!--<span slot="label">
              <i
                class="el-icon-caret-right otc-tab-pane-arrow-right"
                v-if="activeName === 'first'"
              >
              </i>
              <IconFontCommon
                iconName="icon-shalou"
              />
                交易中订单
              {{$t('M.otc_trading')}}
            </span>-->
            <OTCTradingOrder v-if="activeName === 'first'"/>
          </el-tab-pane>
          <!-- 2.2.2 已完成订单 -->
          <el-tab-pane
            name = "second"
            :disabled="isDisabled"
          >
            <span slot="label">
              <i
                class="el-icon-caret-right otc-tab-pane-arrow-right"
                v-if="activeName === 'second'"
              >
              </i>
              <IconFontCommon
                iconName="icon-msnui-task-complete"
              />
              <!-- 已完成订单 -->
              {{$t('M.otc_stocks')}}
            </span>
            <OTCCompletedOrder v-if="activeName === 'second'"/>
          </el-tab-pane>
          <!-- 2.2.3 已取消订单 -->
          <el-tab-pane
            name = "third"
            :disabled="isDisabled"
          >
            <span slot="label">
              <i
                class="el-icon-caret-right otc-tab-pane-arrow-right"
                v-if="activeName === 'third'"
              >
              </i>
              <IconFontCommon
                iconName="icon-cancel_order"
              />
              <!-- 已取消订单 -->
              {{$t('M.otc_canceled')}}
            </span>
            <OTCCanceledOrder v-if="activeName === 'third'"/>
          </el-tab-pane>
          <!-- 2.2.4 冻结中订单 -->
          <el-tab-pane
            name = "fourth"
            :disabled="isDisabled"
          >
            <span slot="label">
              <i
                class="el-icon-caret-right otc-tab-pane-arrow-right"
                v-if="activeName === 'fourth'"
              >
              </i>
              <IconFontCommon
                iconName="icon-dongjie"
              />
              <!-- 冻结中订单 -->
              {{$t('M.otc_freezingOrder')}}
            </span>
            <OTCFreezingOrder v-if="activeName === 'fourth'"/>
          </el-tab-pane>
          <!-- 2.2.5 委托订单 -->
          <el-tab-pane
            name = "fifth"
            :disabled="isDisabled"
          >
            <span slot="label">
              <i
                class="el-icon-caret-right otc-tab-pane-arrow-right"
                v-if="activeName === 'fifth'"
              >
              </i>
              <IconFontCommon
                iconName="icon-daohang2"
              />
              <!-- 委托订单 -->
              {{$t('M.otc_entrust')}}
            </span>
            <OTCEntrustOrder v-if="activeName === 'fifth'"/>
          </el-tab-pane>
        </el-tabs>
        <!-- 查询更多 -->
        <span
          class="more"
          @click="queryMoreOrder"
        >
            {{$t('M.otc_transaction_inquiries_more')}}
          </span>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {
  amendPrecision
} from '../../utils'
import {
  getOTCAvailableCurrency,
  getOTCPutUpOrders,
  getMerchantAvailableLegalTender,
  getCommonPutUpOrderStatus,
  // 增加国家-
  getCurrencyCountrys
} from '../../utils/api/OTC'
import IconFontCommon from '../../components/Common/IconFontCommon'
import OTCTradingOrder from '../../components/OTC/OTCTradingOrder'
import OTCCompletedOrder from '../../components/OTC/OTCCompletedOrder'
import OTCCanceledOrder from '../../components/OTC/OTCCanceledOrder'
import OTCFreezingOrder from '../../components/OTC/OTCFreezingOrder'
import OTCEntrustOrder from '../../components/OTC/OTCEntrustOrder'
import {
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
      currencyCoinSelectStatus: true, // 货币类型法币可用状态
      // 用户是否可以发单状态
      userPutUpOrderStatus: false,
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
          shortName: 'M.comm_PAYPAL' // PAYPAL
        }
      ],
      // 下拉框支付方式中选中的支付方式查询列表
      checkedPayType: '',
      // 我要购买出售币种数组
      IWantToBuySellArr: [],
      isDisabledTimer: null, // 面板切换防止频繁点击倒计时
      // 增加国家-国家列表
      checkedCountryId: null, // 增加国家-选中国家id
      countryInfoList: [], // 增加国家-国家列表
      countrySelectStatus: true // 国家下拉选择框禁用状态
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
      await this.REFRESH_USER_INFO_ACTION()
      this.reflashUserInfo() // 刷新用户信息
      console.log('国家码：' + this.userInfo.country)
    }
    // 5.0 增加国家-查询法币联动国家列表
    await this.getCurrencyCountrysList()
    // 6.0 查询用户是否可以发单状态:不分登录前和登录后
    await this.getUserPutUpOrderStatus()
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
      'UPDATE_OTC_HOME_LIST_STATUS',
      // 改变全局锚点状态方法
      'CHANGE_OTC_ANCHOR_STATUS',
      // 发布订单（商家和普通用户公用）后页面跳转到首页顶部状态
      'CHANGE_PUBLISH_ORDER_JUMP_TOP_STATUS',
      'CHANGE_USER_CENTER_ACTIVE_NAME'
    ]),
    // 增加国家-查询法币联动国家列表
    async getCurrencyCountrysList () {
      this.countrySelectStatus = true
      const data = await getCurrencyCountrys()
      // 返回数据正确的逻辑
      console.log(data)
      if (!data) return false
      this.countryInfoList = getNestedData(data, 'data')
      this.countrySelectStatus = false
      // 给返回国家列表增加一项全部国家
      let ALL = {
        'countryId': '',
        'countryName': '全部国家',
        'createTime': null,
        'englishName': 'All Country',
        'id': '',
        'language': '',
        'languageName': '',
        'name': '',
        'partnerId': '',
        'shortName': '',
        'status': '',
        'symbol': '',
        'updateTime': '',
        'version': 3
      }
      this.countryInfoList.push(ALL)
      this.checkedCountryId = (this.countryInfoList.filter(item => item.shortName == 'CNY'))[0].id
      console.log(this.countryInfoList)
    },
    // 增加国家-切换国家
    changeCountryId (e) {
      console.log(e)
      this.currentPage = 1 // 改变页码为第1页
      this.checkedCountryId = e
      this.availableCurrencyId.forEach(item => {
        if (e == item.id) {
          this.checkedCurrencyId = item.id
        }
      })
      // 根据条件刷新列表
      this.getOTCPutUpOrdersList()
    },
    // 点击交易中订单图标沙漏跳转到交易中订单
    toggleTradingOrder () {
      if (!this.isLogin) {
        this.$goToPage('/login')
        return false
      }
      this.activeName = 'first'
    },
    // 刷新个人信息
    reflashUserInfo () {
      this.REFRESH_USER_INFO_ACTION()
    },
    // 查询用户是否可以发单状态
    async getUserPutUpOrderStatus () {
      const data = await getCommonPutUpOrderStatus()
      // 返回数据正确的逻辑
      // console.log(data)
      // console.log(data.data.flag)
      if (!data) return false
      let flagStatus
      flagStatus = getNestedData(data, 'data.flag')
      // console.log(flagStatus)
      if (flagStatus === 'true') {
        this.userPutUpOrderStatus = true
      }
    },
    // 0.1 切换各订单状态tab面板
    toggleTabPane (tab, event) {
      console.log(this.activeName)
      // 防止频繁切换点击按钮 通过禁用按钮，0.5秒后可以点击
      this.isDisabled = true
      this.isDisabledTimer = setTimeout(() => {
        this.isDisabled = false
      }, 500)
      // 未登录跳转到登录页面去
      if (!this.isLogin) {
        this.$goToPage('/login')
        return false
      }
    },
    // 0.2 点击发布订单按钮跳转到发布订单页面
    async toPublishOrder () {
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
        this.$goToPage('/login')
      } else {
        await this.REFRESH_USER_INFO_ACTION()
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
          this.$goToPage(`/OTCPublishBuyAndSell/${this.OTCBuySellStyle}/${this.selectedOTCAvailableCurrencyCoinID}/${this.checkedCurrencyId}`)
        }
      }
    },
    // 0.3 点击 购买 或者 出售 按钮跳转到在线购买或者出售页面
    async toOnlineBuyOrSell (id, coinId, userId, countryCode) {
      if (!this.isLogin) {
        this.$goToPage('/login')
      } else {
        // 刷新用户信息
        await this.REFRESH_USER_INFO_ACTION()
        console.log(countryCode, userId, this.userInfo)

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
            // 增加个人用户信息中的国籍和选中的国家对比，
            // 如果相同，可以摘单
            // 不相同，不能摘单，给出提示
          } else if (!(countryCode == this.userInfo.country)) {
            this.$message({
              // 根据您注册所在地的相关规定，无法进行此操作
              message: this.$t('M.otc_failure_0094'),
              type: 'error'
            })
            return false
          } else {
            // console.log(id) // 挂单id
            // console.log(coinId) // 币种id
            this.$goToPage(`/OTCOnlineTraderBuySell/${this.OTCBuySellStyle}/${id}/${coinId}`)
          }
        }
      }
    },
    // 0.5 查询更多订单按钮点击事件
    queryMoreOrder () {
      if (!this.isLogin) { // 未登录跳转登录页
        this.$goToPage('/login')
      } else {
        // 登录后：商家用户跳转到商家订单；普通用户跳转到个人中心中的法币订单
        if (this.userInfo.type === 'COMMON') {
          this.CHANGE_USER_CENTER_ACTIVE_NAME('fiat-orders')
          this.$goToPage('/PersonalCenter')
        }
        if (this.userInfo.type === 'MERCHANT') {
          this.$goToPage('/OTCMerchantsOrders')
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
          console.log(this.IWantToBuySellArr)
          _.forEach(this.IWantToBuySellArr, (coin, coinIndex) => {
            if (coin.name == 'FBT') {
              this.IWantToBuySellArr.splice(coinIndex, 1)
              this.IWantToBuySellArr.unshift(coin)
              return false
            }
          })
          // 个人中心跳转otc-开始
          if (this.$route.params.coinId) {
            let jumpCoinId = this.$route.params.coinId
            if (jumpCoinId && this.IWantToBuySellArr.length) {
              this.CHANGE_OTC_AVAILABLE_CURRENCY_ID(jumpCoinId)
              this.IWantToBuySellArr.forEach((item, index) => {
                if (jumpCoinId == item.coinId) {
                  this.CHANGE_OTC_AVAILABLE_CURRENCY_NAME(item.name)
                  this.selectCurrencyNameStatus = index
                  console.log(this.selectCurrencyNameStatus)
                }
              })
            }
          } else {
            // 个人中心跳转otc-结束
            this.CHANGE_OTC_AVAILABLE_CURRENCY_NAME(this.IWantToBuySellArr[0].name)
            this.CHANGE_OTC_AVAILABLE_CURRENCY_ID(this.IWantToBuySellArr[0].coinId)
          }
        }
      }
    },
    //  2.0 otc可用法币查询
    async getMerchantAvailableLegalTenderList () {
      this.currencyCoinSelectStatus = true // 禁用货币类型select框
      const data = await getMerchantAvailableLegalTender({})
      console.log('otc法币查询列表')
      console.log(data)
      // 返回数据正确的逻辑
      if (!data) return false
      if (data.data) {
        this.availableCurrencyId = getNestedData(data, 'data')
        // console.log(this.availableCurrencyId)
        this.checkedCurrencyId = getNestedData(this.availableCurrencyId[0], 'id')
        this.checkedCurrencyName = getNestedData(this.availableCurrencyId[0], 'shortName')
        this.currencyCoinSelectStatus = false // 开启货币类型select框
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
        if (data.data) {
          let orderListData = getNestedData(data, 'data')
          this.onlineBuySellTableList = getNestedData(orderListData, 'list')
          // console.log(this.onlineBuySellTableList);
          // 分页
          this.totalPages = getNestedData(orderListData, 'pages') - 0
          // 改变全局 委托定单撤单后，更新首页挂单列表状态
          this.UPDATE_OTC_HOME_LIST_STATUS(false)
        }
      }
    },
    //  4.0 选中我想购买和出售币种名称
    selectCurrencyName (index) {
      this.currentPage = 1
      console.log(this.currentPage)
      // console.log(index)
      this.selectCurrencyNameStatus = index
      this.CHANGE_OTC_AVAILABLE_CURRENCY_NAME(this.IWantToBuySellArr[index].name) // 币种名称
      this.CHANGE_OTC_AVAILABLE_CURRENCY_ID(this.IWantToBuySellArr[index].coinId) // 币种id
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
      if (this.countryInfoList.length) {
        this.checkedCountryId = this.countryInfoList[0].id // 增加国家-国家为所有国家
      }
      this.currentPage = 1
      this.checkedCurrencyId = e
      this.availableCurrencyId.forEach(item => {
        if (e === item.id) {
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
      // selectedOTCAvailablePartnerCoinId: state => state.OTC.selectedOTCAvailablePartnerCoinId,
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
  margin-top: 50px;

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

            > .country-style {
              position: relative;
              margin-right: 5px;

              > .country-style-icon {
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

      .trading-order-right-arrow {
        position: absolute;
        top: 33px;
        left: 82px;
        color: #338ff5;
      }

      .trading-order-sand-clock {
        position: absolute;
        z-index: 11;
        top: 0;
        left: 0;
      }

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
    .el-input__icon {
      line-height: 34px;
    }

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
        max-width: 160px;
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
      font-size: 12px;
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

              > .country-style {
                > .country-style-icon {
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

              > .country-style {
                > .country-style-icon {
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
