<!--限价交易、市价交易-->
<template>
  <div
    class="exchange-box trade"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="inner-box">
      <!--币种资料跳转-->
      <div class="currency-info">
        <span
          class="cursor-pointer router-link"
          @click="jumpToOtherPage('/ServiceAndProtocol','CurrencyInformation')"
        >
          <i class="el-icon-document"></i>
          <span>
            <!--币种资料-->
            {{ $t('M.trade_exchange_currency_data') }}
          </span>
        </span>
      </div>
      <el-tabs
        v-model="activeName"
        @tab-click="toggleMatchType"
      >
        <!--限价交易-->
        <el-tab-pane
          :label="$t('M.trade_exchange_price_deal')"
          name="limit-price"
        >
          <div class="content-box limit">
            <div class="inner-box left">
              <div class="header">
                <div class="left item">
                  <IconFont iconName="icon-qianbao-"/>
                  <span class="margin-left10 buy">
                    <!--可买-->
                    {{$t('M.trade_exchange_can_buy')}}:
                    <span v-show="!buyUserCoinWallet.total">--</span>
                    <span v-show="buyUserCoinWallet.total">{{limitExchange.userCanBuyCount}}</span>
                    <span>{{middleTopData.sellsymbol}}</span>
                  </span>
                </div>
                <div class="right item">
                  <router-link to="/PersonalCenter">
                    <!--充币-->
                    {{ $t('M.comm_charge_money') }}
                  </router-link>
                  <router-link to="/PersonalCenter">
                    <!--提币-->
                    {{ $t('M.comm_mention_money') }}
                  </router-link>
                </div>
              </div>
              <div class="content">
                <!--买入价-->
                <div class="input">
                  <input
                    type="text"
                    :placeholder="$t('M.comm_buy') + $t('M.comm_price')"
                    :ref="limitBuyPriceInputRef"
                    onpaste="return false"
                    @keyup="autoChangeData('limit-buy')"
                    @input="formatInput(limitBuyPriceInputRef,middleTopData.priceExchange)"
                  >
                  <span class="currency">{{middleTopData.area}}</span>
                  <div
                    class="rate-changer"
                    v-show="activeConvertCurrencyObj&&(limitExchange.transformBuyPrice-0)"
                  >
                    ≈{{activeConvertCurrencyObj.symbol}}{{limitExchange.transformBuyPrice}}
                  </div>
                  <span
                    class="error-box"
                    v-show="errorMsg.limit.buy.price"
                  >{{errorMsg.limit.buy.price}}</span>
                </div>
                <!--买入量-->
                <div class="input">
                  <input
                    type="text"
                    onpaste="return false"
                    :placeholder="$t('M.comm_buy') + $t('M.comm_quantity')"
                    :ref="limitBuyCountInputRef"
                    @keyup="autoChangeData('limit-buy')"
                    @input="formatInput(limitBuyCountInputRef,middleTopData.countExchange)"
                  >
                  <span class="currency">{{middleTopData.sellsymbol}}</span>
                  <span
                    class="error-box"
                    v-show="errorMsg.limit.buy.amount"
                  >{{errorMsg.limit.buy.amount}}</span>
                </div>
                <!--@click="addEntrust(0,'limit-buy')"-->

                <div class="volume-rate">
                  <div class="item">
                    <span>

                      <!--预计交易额-->
                      {{ $t('M.trade_exchange_estimated_turnover') }}：
                    </span>
                    <!--<span class="buy">{{limitExchange.buyAmount}}</span>-->
                    <span class="buy">{{limitBuyAmount}}</span>
                    <span>{{middleTopData.area}}</span>
                  </div>
                </div>
                <div class="submit">
                  <el-button
                    class="submit-btn buy-btn"
                    @click="showPayPassword(0,'limit')"
                  >
                    <!--买入-->
                    {{ $t('M.comm_buy') }}
                  </el-button>
                </div>
              </div>
            </div>
            <div class="middle-line"></div>
            <div class="inner-box right">
              <div class="header">
                <div class="left item">
                  <IconFont iconName="icon-qianbao-"/>
                  <span class="margin-left10 sell">
                    <!--可卖-->
                    {{$t('M.trade_exchange_vendibility')}}:
                    <span v-show="!sellUserCoinWallet.total">--</span>
                    <span v-show="sellUserCoinWallet.total">{{sellUserCoinWallet.total}}</span>
                    <span>{{middleTopData.sellsymbol}}</span>
                  </span>
                </div>
                <div class="right item">
                  <router-link to="/PersonalCenter">
                    <!--充币-->
                    {{ $t('M.comm_charge_money') }}
                  </router-link>
                  <router-link to="/PersonalCenter">
                    <!--提币-->
                    {{ $t('M.comm_mention_money') }}
                  </router-link>
                </div>
              </div>
              <div class="content">
                <!--卖出价-->
                <div class="input">
                  <input
                    type="text"
                    onpaste="return false"
                    :placeholder="$t('M.comm_sell') + $t('M.comm_price')"
                    :ref="limitSellPriceInputRef"
                    @keyup="autoChangeData('limit-sell')"
                    @input="formatInput(limitSellPriceInputRef,middleTopData.priceExchange)"
                  >
                  <span class="currency">{{middleTopData.area}}</span>
                  <div
                    class="rate-changer"
                    v-show="activeConvertCurrencyObj&&(limitExchange.transformSellPrice-0)"
                  >
                    ≈{{activeConvertCurrencyObj.symbol}}{{limitExchange.transformSellPrice}}
                  </div>
                  <span
                    class="error-box"
                    v-show="errorMsg.limit.sell.price"
                  >{{errorMsg.limit.sell.price}}</span>
                </div>
                <!--卖出量-->
                <div class="input">
                  <input
                    type="text"
                    onpaste="return false"
                    :placeholder="$t('M.comm_sell') + $t('M.comm_quantity')"
                    :ref="limitSellCountInputRef"
                    @keyup="autoChangeData('limit-sell')"
                    @input="formatInput(limitSellCountInputRef,middleTopData.countExchange)"
                  >
                  <span class="currency">{{middleTopData.sellsymbol}}</span>
                  <span
                    class="error-box"
                    v-show="errorMsg.limit.sell.amount"
                  >{{errorMsg.limit.sell.amount}}</span>
                </div>

                <!--预计交易额 手续费-->
                <div class="volume-rate">
                  <div class="item">
                    <span>
                      <!--预计交易额：-->
                      {{ $t('M.trade_exchange_estimated_turnover') }}：
                    </span>
                    <!--<span class="sell">{{limitExchange.sellAmount}}</span>-->
                    <span class="sell">{{limitSellAmount}}</span>
                    <span>{{middleTopData.area}}</span>
                  </div>
                </div>
                <div class="submit">
                  <el-button
                    class="submit-btn sell-btn"
                    @click="showPayPassword(1,'limit')"
                  >
                    <!--卖出-->
                    {{ $t('M.comm_sell') }}
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <!--市价交易-->
        <el-tab-pane
          :label="$t('M.trade_exchange_market')"
          name="market-price"
        >
          <div class="content-box market">
            <div class="inner-box left">
              <div class="header">
                <div class="left item">
                  <IconFont iconName="icon-qianbao-"/>
                  <span class="margin-left10 buy">
                    <!--可买-->
                    {{$t('M.trade_exchange_can_buy')}}:
                    <span v-show="!buyUserCoinWallet.total||!middleTopData.last">--</span>
                    <span v-show="buyUserCoinWallet.total&&middleTopData.last">
                      {{(buyUserCoinWallet.total/middleTopData.last).toFixed(middleTopData.priceExchange)}}
                    </span>
                    <span>{{middleTopData.sellsymbol}}</span>
                  </span>
                </div>
                <div class="right item">
                  <router-link to="/PersonalCenter">
                    <!--充币-->
                    {{ $t('M.comm_charge_money') }}
                  </router-link>
                  <router-link to="/PersonalCenter">
                    <!--提币-->
                    {{ $t('M.comm_mention_money') }}
                  </router-link>
                </div>
              </div>
              <div class="content">
                <!--市场成交价-->
                <div class="input">
                  <div class="market-price buy-price">
                    <!--市场成交价-->
                    {{ $t('M.trade_exchange_market_price') }}
                  </div>
                  <span class="currency">{{middleTopData.area}}</span>
                </div>
                <!--买入量-->
                <div class="input">
                  <input
                    type="text"
                    onpaste="return false"
                    :placeholder="$t('M.comm_buy') + $t('M.comm_quantity')"
                    :ref="marketBuyCountInputRef"
                    @keyup="autoChangeData('market-buy')"
                    @input="formatInput(marketBuyCountInputRef,middleTopData.countExchange)"
                  >
                  <span class="currency">{{middleTopData.sellsymbol}}</span>
                  <span
                    class="error-box"
                    v-show="errorMsg.market.buy.amount"
                  >{{errorMsg.market.buy.amount}}</span>
                </div>
                <!--滑块-->
                <div class="slider">
                </div>
                <!--预计交易额 手续费-->
                <div class="volume-rate">
                  <div class="item">
                    <span>
                      <!--预计交易额：-->
                      {{ $t('M.trade_exchange_estimated_turnover') }}：
                    </span>
                    <span class="buy">0.00</span>
                    <span>{{middleTopData.area}}</span>
                  </div>
                </div>
                <div class="submit">
                  <el-button
                    class="submit-btn buy-btn"
                    @click="showPayPassword(0,'market')"
                  >
                    <!--买入-->
                    {{ $t('M.comm_buy') }}
                  </el-button>
                </div>
              </div>
            </div>
            <div class="middle-line"></div>
            <div class="inner-box right">
              <div class="header">
                <div class="left item">
                  <IconFont iconName="icon-qianbao-"/>
                  <span class="margin-left10 sell">
                    <!--可卖-->
                    {{$t('M.trade_exchange_vendibility')}}:
                    <span v-show="!sellUserCoinWallet.total">--</span>
                    <span v-show="sellUserCoinWallet.total">{{sellUserCoinWallet.total}}</span>
                    <span>{{middleTopData.sellsymbol}}</span>
                  </span>
                </div>
                <div class="right item">
                  <router-link to="/PersonalCenter">
                    <!--充币-->
                    {{ $t('M.comm_charge_money') }}
                  </router-link>
                  <router-link to="/PersonalCenter">
                    <!--提币-->
                    {{ $t('M.comm_mention_money') }}
                  </router-link>
                </div>
              </div>
              <div class="content">
                <!--市场成交价-->
                <div class="input">
                  <div class="market-price sell-price">
                    <!--市场成交价-->
                    {{ $t('M.trade_exchange_market_price') }}
                  </div>
                  <span class="currency">{{middleTopData.area}}</span>
                </div>
                <!--卖出量-->
                <div class="input">
                  <input
                    type="text"
                    onpaste="return false"
                    :placeholder="$t('M.comm_sell') + $t('M.comm_quantity')"
                    :ref="marketSellCountInputRef"
                    @keyup="autoChangeData('market-sell')"
                    @input="formatInput(marketSellCountInputRef,middleTopData.countExchange)"
                  >
                  <span class="currency">{{middleTopData.sellsymbol}}</span>
                  <span
                    class="error-box"
                    v-show="errorMsg.market.sell.amount"
                  >{{errorMsg.market.sell.amount}}</span>
                </div>
                <!--滑块-->
                <div class="slider">
                </div>
                <!--预计交易额 手续费-->
                <div class="volume-rate">
                  <div class="item">
                    <span>
                      <!--预计交易额：-->
                      {{ $t('M.trade_exchange_estimated_turnover') }}：
                    </span>
                    <span class="sell">0.00</span>
                    <span>{{middleTopData.area}}</span>
                  </div>
                </div>
                <div class="submit">
                  <el-button
                    class="submit-btn sell-btn"
                    @click="showPayPassword(1,'market')"
                  >
                    <!--卖出-->
                    {{ $t('M.comm_sell') }}
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <!-- 交易密码 -->
      <el-dialog
        :title="$t('M.comm_set') + $t('M.comm_password')"
        :visible.sync="isShowPayPassword"
        center
      >
        <el-input
          type="password"
          v-model="payPassword"
          @input="clearErrorMsg"
        >
        </el-input>
        <div
          class="error-box"
          v-show="isPayPasswordEmpty"
        >
          {{$t('M.otc_publishAD_pleaseInput')}}{{$t('M.otc_publishAD_sellpassword')}}
        </div>
        <span
          slot="footer"
          class="dialog-footer footer"
        ><!--确 定 取 消-->
          <button
            class="button-color border-radius4 cursor-pointer"
            @click.prevent="addEntrust"
          >
            <!--确 定-->
            {{ $t('M.comm_confirm') }}
          </button>
          <button
            class="cancel-btn border-radius4 cursor-pointer"
            @click.prevent="cancelAddEntrust"
          >
            <!--取 消-->
            {{ $t('M.comm_cancel') }}
          </button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import IconFont from '../Common/IconFontCommon'
import {
  formatNumberInput,
  getRefValue,
  keep2Num
} from '../../utils'
import {
  saveEntrustTrade,
  getUserAssetOfActiveSymbol
} from '../../utils/api/trade'
import {
  returnAjaxMsg,
  getNestedData,
  isNeedPayPasswordAjax
} from '../../utils/commonFunc'
import {createNamespacedHelpers, mapState} from 'vuex'

const {mapMutations} = createNamespacedHelpers('trade')
export default {
  components: {
    IconFont
    // Slider
  },
  // props,
  data () {
    return {
      activeName: 'limit-price',
      // 限价交易 买入价input ref name
      limitBuyPriceInputRef: 'limitBuyPriceInput',
      // 限价交易 买入量input ref name
      limitBuyCountInputRef: 'limitBuyCountInput',
      // 市价交易 买入量input ref name
      marketBuyCountInputRef: 'marketBuyCountInput',
      // 限价交易 卖出价input ref name
      limitSellPriceInputRef: 'limitSellPriceInput',
      // 限价交易 卖出量input ref name
      limitSellCountInputRef: 'limitSellCountInput',
      // 市价交易 卖出量input ref name
      marketSellCountInputRef: 'marketSellCountInput',
      // 当前币种小数点限制位数
      pointLength: 4,
      // 撮合类型： LIMIT:限价单 MARKET:市价单
      matchType: 'LIMIT',
      limitExchange: {
        buyPrice: 0,
        transformBuyPrice: 0, // 转换后的价格
        userCanBuyCount: 0, // 用户可买
        buyCount: 0,
        buyAmount: 0, // 买入成交额
        sellPrice: 0,
        transformSellPrice: 0, // 转换后的价格
        sellCount: 0,
        sellAmount: 0, // 卖出成交额
        buyPwd: '', // 交易密码
        sellPwd: '',
        errorMsg: ''
      },
      marketExchange: {
        userCanBuyCount: 0, // 用户可买
        buyPrice: 0,
        buyCount: 0,
        buyAmount: 0, // 买入成交额
        sellPrice: 0,
        sellCount: 0,
        sellAmount: 0, // 卖出成交额
        buyPwd: '', // 交易密码
        sellPwd: '',
        errorMsg: ''
      },
      errorMsg: {
        limit: {
          buy: {
            amount: '',
            price: ''
          },
          sell: {
            amount: '',
            price: ''
          }
        },
        market: {
          buy: {
            amount: ''
          },
          sell: {
            amount: ''
          }
        }
      },
      isInputPayPossword: false,
      // 当前交易对刷新次数
      reflashCount: 0,
      // 当前交易对 买方币种用户资产
      buyUserCoinWallet: {},
      // 当前交易对 卖方币种用户资产
      sellUserCoinWallet: {},
      // 是否显示交易密码
      isShowPayPassword: false,
      // 委单类型 1： 市价单、0：限价单
      entrustType: 0,
      payPassword: '', // 交易密码
      isNeedPayPassowrd: true, // 是否需要交易密码
      // 交易密码是否为空
      isPayPasswordEmpty: false
    }
  },
  created () {
  },
  mounted () {
    this.getRefValue(this.limitBuyPriceInputRef)
  },
  activited () {
  },
  update () {
  },
  beforeRouteUpdate () {
  },
  methods: {
    ...mapMutations([
      'TOGGLE_REFRESH_ENTRUST_LIST_STATUS'
    ]),
    // 获取用户对应交易对资产
    async getUserAssetOfActiveSymbol (targetPriceOfBuy, targetPriceOfSell) {
      const params = {
        tradeId: this.middleTopData.partnerTradeId // 交易对id
      }
      const data = await getUserAssetOfActiveSymbol(params)
      if (!returnAjaxMsg(data, this)) {
        return false
      } else {
        this.buyUserCoinWallet = getNestedData(data, 'data.data.buyUserCoinWallet')
        this.sellUserCoinWallet = getNestedData(data, 'data.data.sellUserCoinWallet')
        this.setBuyAndSellPrice(targetPriceOfBuy, targetPriceOfSell)
      }
    },
    // 清空交易密码
    clearFormData () {
      this.payPassword = ''
      this.$refs[this.limitBuyPriceInputRef].value = ''
      this.$refs[this.limitBuyCountInputRef].value = ''
      this.$refs[this.marketBuyCountInputRef].value = ''
      this.$refs[this.limitSellPriceInputRef].value = ''
      this.$refs[this.limitSellCountInputRef].value = ''
      this.$refs[this.marketSellCountInputRef].value = ''
    },
    clearErrorMsg () {
      this.isPayPasswordEmpty = false
    },
    // 取消添加委单
    cancelAddEntrust () {
      this.isShowPayPassword = false
      this.limitExchange.errorMsg = false
    },
    // 截取2位小数
    keep2Num (number) {
      return keep2Num(number)
    },
    // 跳转
    jumpToOtherPage (router, activeName) {
      this.$store.commit('footerInfo/CHANGE_FOOTER_ACTIVENAME', {
        activeName,
        type: router
      })
      this.$router.push({path: router})
    },
    // 设置转换后的价格
    setTransformPrice (type, targetNum) {
      switch (type) {
        case 'limit-buy':
          this.limitExchange.transformBuyPrice = keep2Num(this.currencyRateList[this.activeSymbol.area] * targetNum)
          break
        case 'limit-sell':
          this.limitExchange.transformSellPrice = keep2Num(this.currencyRateList[this.activeSymbol.area] * targetNum)
          break
      }
    },
    // 设置 refinput value
    getRefValue (refName) {
      return getRefValue(this, refName)
    },
    // 数据联动
    autoChangeData (type) {
      switch (type) {
        // 限价买
        case 'limit-buy':
          this.errorMsg.limit.buy.price = ''
          this.errorMsg.limit.buy.amount = ''
          this.limitExchange.buyPrice = this.getRefValue(this.limitBuyPriceInputRef)
          this.limitExchange.buyCount = this.getRefValue(this.limitBuyCountInputRef)
          this.setTransformPrice('limit-buy', this.limitExchange.buyPrice)
          if (this.limitExchange.buyPrice - 0) {
            this.limitExchange.userCanBuyCount = (this.buyUserCoinWallet.total / (this.limitExchange.buyPrice - 0)).toFixed(this.middleTopData.priceExchange)
          }
          break
        // 限价卖
        case 'limit-sell':
          this.errorMsg.limit.sell.price = ''
          this.errorMsg.limit.sell.amount = ''
          this.limitExchange.sellPrice = this.getRefValue(this.limitSellPriceInputRef)
          this.limitExchange.sellCount = this.getRefValue(this.limitSellCountInputRef)
          this.setTransformPrice('limit-sell', this.limitExchange.sellPrice)
          break
        // 市价买
        case 'market-buy':
          this.errorMsg.market.buy.amount = ''
          // this.marketExchange.buyCount = this.getRefValue(this.limitSellPriceInputRef)
          this.marketExchange.buyCount = this.getRefValue(this.marketBuyCountInputRef)
          console.log(this.marketExchange.buyCount)
          break
        // 市价卖
        case 'market-sell':
          this.errorMsg.market.sell.amount = ''
          this.marketExchange.sellCount = this.getRefValue(this.marketSellCountInputRef)
          break
      }
    },
    // 获取 ref value
    // 切换撮合类型
    toggleMatchType (e) {
      switch (e.name) {
        case 'market-price':
          this.matchType = 'MARKET'
          break
        case 'limit-price':
          this.matchType = 'LIMIT'
          break
      }
    },
    // 交易密码
    async showPayPassword (entrustType, matchType) {
      this.entrustType = entrustType
      this.isNeedPayPassowrd = await isNeedPayPasswordAjax(this)
      console.log(entrustType, matchType)
      let next = false
      let params = {}
      switch (entrustType) {
        // 买入
        case 0:
          switch (this.matchType) {
            case 'LIMIT':
              params.price = this.$refs[this.limitBuyPriceInputRef].value - 0
              params.count = this.$refs[this.limitBuyCountInputRef].value - 0
              this.limitExchange.buyCount = params.count
              this.limitExchange.buyPrice = params.price
              if (!this.limitExchange.buyPrice) {
                // 请输入买入价
                this.errorMsg.limit.buy.price = this.$t('M.trade_empty_buy_price')
                return false
              } else {
                this.errorMsg.limit.buy.price = ''
              }

              if (!this.limitExchange.buyCount) {
                // 请输入买入量
                this.errorMsg.limit.buy.amount = this.$t('M.trade_empty_buy_count')
                return false
              } else {
                this.errorMsg.limit.buy.amount = ''
              }

              if ((this.buyUserCoinWallet.total / params.price) < params.count - 0) {
                this.errorMsg.limit.buy.price = this.$t('M.trade_exchange_currency_available')
                return false
              }
              next = true
              break
            case 'MARKET':
              if (!this.marketExchange.buyCount) {
                this.errorMsg.market.buy.amount = this.$t('M.trade_empty_buy_count')
                return false
              } else {
                this.errorMsg.market.buy.amount = ''
              }
              params.count = this.$refs[this.marketBuyCountInputRef].value
              if ((this.buyUserCoinWallet.total / this.middleTopData.last) < params.count - 0) {
                this.errorMsg.market.buy.amount = this.$t('M.trade_exchange_currency_available')
                return false
              }
              next = true
          }
          break
        // 卖出
        case 1:
          switch (this.matchType) {
            case 'LIMIT':
              params.price = this.$refs[this.limitSellPriceInputRef].value - 0
              params.count = this.$refs[this.limitSellCountInputRef].value - 0
              this.limitExchange.sellCount = params.count
              this.limitExchange.sellPrice = params.price
              if (!this.limitExchange.sellPrice) {
                this.errorMsg.limit.sell.price = this.$t('M.trade_empty_sell_price')
                return false
              } else {
                this.errorMsg.limit.sell.price = ''
              }
              if (!this.limitExchange.sellCount) {
                this.errorMsg.limit.sell.amount = this.$t('M.trade_empty_sell_count')
                return false
              } else {
                this.errorMsg.limit.sell.amount = ''
              }

              if ((this.buyUserCoinWallet.total / this.middleTopData.last) < params.count - 0) {
                // 可用币种数量不足
                this.errorMsg.limit.sell.price = this.$t('M.trade_exchange_currency_available')
                return false
              }
              next = true
              break
            case 'MARKET':
              params.count = this.$refs[this.marketSellCountInputRef].value
              this.marketExchange.sellCount = params.count
              if (!this.marketExchange.sellCount) {
                this.errorMsg.market.sell.amount = '请输入卖出量'
                return false
              } else {
                this.errorMsg.market.sell.amount = ''
              }
              if ((this.buyUserCoinWallet.total / this.middleTopData.last) < params.count - 0) {
                // 可用币种数量不足
                this.errorMsg.market.sell.count = this.$t('M.trade_exchange_currency_available')
                return false
              }
              next = true
              break
          }
          break
      }
      if (!next) {
        return false
      }
      if (this.isNeedPayPassowrd) {
        this.isShowPayPassword = true
        this.clearErrorMsg()
      } else {
        this.addEntrust()
      }
    },
    // 输入限制
    formatInput (ref, pointLength) {
      let target = this.$refs[ref]
      return formatNumberInput(target, pointLength) - 0
    },
    // 新增委单
    async addEntrust () {
      if (!this.isLogin) {
        this.$router.push('/login')
        return false
      }
      if (!this.loginStep1Info.userInfo.payPassword) {
        // 请设置交易密码后操作
        this.$message({
          type: 'error',
          message: this.$t('M.comm_please_set_up') + this.$t('M.comm_password') + this.$t('M.trade_exchange_after_operation')
        })
        this.$router.push({path: '/TransactionPassword'})
        return false
      }
      let params = {
        userId: this.loginStep1Info.userId,
        tradeId: this.middleTopData.partnerTradeId + '',
        type: this.entrustType ? 'SELL' : 'BUY', // 委单类型
        matchType: this.matchType, // 撮合类型
        source: 'Web' // 来源
      }

      if (this.isNeedPayPassowrd) {
        params.payPwd = this.payPassword
        this.payPassword = ''
        if (!params.payPwd) {
          this.isPayPasswordEmpty = true
          return false
        }
      }

      switch (this.entrustType) {
        // 买单
        case 0:
          switch (this.matchType) {
            case 'LIMIT':
              params.price = this.$refs[this.limitBuyPriceInputRef].value
              params.count = this.$refs[this.limitBuyCountInputRef].value
              console.log(params)
              break
            case 'MARKET':
              params.count = this.$refs[this.marketBuyCountInputRef].value
              break
          }
          break
        // 卖单
        case 1:
          switch (this.matchType) {
            case 'LIMIT':
              params.price = this.$refs[this.limitSellPriceInputRef].value
              params.count = this.$refs[this.limitSellCountInputRef].value
              console.log(params)
              break
            case 'MARKET':
              params.count = this.$refs[this.marketSellCountInputRef].value
              break
          }
          break
      }
      const data = await saveEntrustTrade(params)
      if (!returnAjaxMsg(data, this, 1)) {
        return false
      } else {
        this.TOGGLE_REFRESH_ENTRUST_LIST_STATUS(true)
        this.isShowPayPassword = false
        this.clearFormData()
      }
    },
    // 设置买卖价格
    setBuyAndSellPrice (targetPriceOfBuy, targetPriceOfSell = targetPriceOfBuy) {
      this.$refs[this.limitBuyPriceInputRef].value = targetPriceOfBuy
      this.$refs[this.limitSellPriceInputRef].value = targetPriceOfSell
      const newBuyPrice = this.formatInput(this.limitBuyPriceInputRef, this.activeSymbol.priceExchange) - 0
      const newSellPrice = this.formatInput(this.limitSellPriceInputRef, this.activeSymbol.priceExchange) - 0
      this.setTransformPrice('limit-buy', newBuyPrice)
      this.setTransformPrice('limit-sell', newSellPrice)
      if (newBuyPrice) {
        this.limitExchange.userCanBuyCount = (this.buyUserCoinWallet.total / (newBuyPrice - 0)).toFixed(this.middleTopData.priceExchange)
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      refreshEntrustStatus: state => state.trade.refreshEntrustStatus,
      loginStep1Info: state => state.user.loginStep1Info,
      activeSymbol: state => state.common.activeSymbol,
      isLogin: state => state.user.isLogin,
      activePriceItem: state => state.trade.activePriceItem,
      currencyRateList: state => state.common.currencyRateList, // 折算货币列表
      activeConvertCurrencyObj: state => state.common.activeConvertCurrencyObj, // 目标货币
      middleTopData: state => state.trade.middleTopData
    }),
    // 限价买预计成交额
    limitBuyAmount () {
      return this.keep2Num(this.limitExchange.buyPrice * this.limitExchange.buyCount)
    },
    // 限价买预计成交额
    limitSellAmount () {
      return this.keep2Num(this.limitExchange.sellPrice * this.limitExchange.sellCount)
    }
  },
  watch: {
    language () {
      this.errorMsg.limit.buy.price = ''
      this.errorMsg.limit.buy.amount = ''
      this.errorMsg.limit.sell.price = ''
      this.errorMsg.limit.sell.amount = ''
      this.errorMsg.market.buy.amount = ''
      this.errorMsg.market.sell.amount = ''
    },
    isShowPayPassword (newVal) {
      if (newVal) {
        this.payPassword = ''
        this.clearErrorMsg()
      }
    },
    async refreshEntrustStatus (newVal) {
      if (newVal) {
        await this.getUserAssetOfActiveSymbol()
      }
    },
    activeConvertCurrencyObj () {
      this.setBuyAndSellPrice(this.getRefValue(this.limitBuyPriceInputRef), this.getRefValue(this.limitSellPriceInputRef))
    },
    activeSymbol () {
      this.reflashCount = 0
    },
    // 用户手动设置价格
    activePriceItem (newVal) {
      if (newVal) {
        this.setBuyAndSellPrice(newVal)
      }
    },
    async middleTopData (newVal) {
      console.log(newVal)
      let targetPriceOfBuy = newVal.buy || newVal.kai
      let targetPriceOfSell = newVal.sell || newVal.kai
      // 首次打开设置价格
      if (!this.reflashCount) {
        if (newVal.last) {
          this.reflashCount++
        }
        if (this.isLogin) {
          await this.getUserAssetOfActiveSymbol(targetPriceOfSell, targetPriceOfBuy)
        } else {
          this.setBuyAndSellPrice(targetPriceOfSell, targetPriceOfBuy)
        }
      }
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../../static/css/scss/index.scss';
  @import '../../../static/css/scss/Trade/TradeCenter';

  .exchange-box {
    width: 100%;
    height: 340px;
    margin: 10px 0;

    > .inner-box {
      position: relative;

      > .currency-info {
        position: absolute;
        z-index: 2000;
        top: 0;
        right: 0;
        height: 34px;
        padding-right: 27px;
        line-height: 34px;
        text-align: right;

        > .router-link {
          color: $mainColor;
        }
      }

      .content-box {
        position: relative;
        display: flex;
        width: 100%;
        height: 100%;
        padding: 22px 2.8%;

        > .inner-box {
          flex: 1;

          > .header {
            display: flex;
            white-space: nowrap;

            > .item {
              flex: 1;

              > .buy {
                color: $upColor;
              }

              > .sell {
                color: $downColor;
              }

              > a {
                padding-left: 20px;
              }
            }

            > .left {
              flex: 2;
            }
          }

          > .content {
            padding: 20px 0;

            > .input {
              position: relative;
              margin-bottom: 20px;
              border-radius: 3px;

              .error-box {
                position: absolute;
                bottom: -18px;
                left: 0;
                font-size: 12px;
                color: #d45858;
              }

              /* 市价提示 */
              > .market-price {
                width: 100%;
                height: 38px;
                padding: 0 15px 0 20px;
                border-radius: 3px;
                line-height: 38px;

                &.buy-price {
                  color: $upColor;
                }

                &.sell-price {
                  color: $downColor;
                }
              }

              /* 限价input框 */
              > input {
                box-sizing: border-box;
                width: 100%;
                height: 38px;
                padding: 0 15px 0 20px;
                border: 1px solid;
                border-radius: 3px;
                font-size: 14px;
              }

              > .currency {
                position: absolute;
                top: 0;
                right: 15px;
                height: 34px;
                line-height: 34px;
              }

              > .rate-changer {
                height: 18px;
                padding: 0 20px;
                font-size: 12px;
              }
            }

            > .volume-rate {
              display: flex;

              > .item {
                flex: 1;

                span {
                  &.buy {
                    color: $upColor;
                  }

                  &.sell {
                    color: $downColor;
                  }
                }

                &.right {
                  text-align: right;
                }
              }
            }
          }
        }

        > .middle-line {
          position: relative;
          width: 130px;
          height: 250px;

          &::before {
            position: absolute;
            top: 0;
            left: 50%;
            width: 1px;
            height: 250px;
            border-left: 1px dashed;
            content: '';
          }
        }
      }
    }

    /deep/ {
      .el-button {
        width: 100%;
        margin-top: 20px;
        border: none;
        color: #fff;

        &:hover {
          opacity: .7;
        }

        &.buy-btn {
          background-color: #d45858;
        }

        &.sell-btn {
          background-color: #008069;
        }
      }

      .el-dialog {
        width: 325px;
        margin-top: 45vh !important;

        .error-box {
          padding: 10px 0 0;
          font-size: 12px;
          color: #d45858;
        }
      }

      .el-dialog__wrapper {
        background-color: rgba(0, 0, 0, .7);
      }

      .el-dialog__header {
        height: 50px;
        padding: 10px 20px;
        border-radius: 5px;
        line-height: 30px;
      }

      .el-dialog__body {
        padding: 25px 27px;
        line-height: 25px;
      }

      .el-form-item {
        height: 85px;
        margin-bottom: 0;
      }

      .el-dialog__title {
        font-size: 16px;
      }

      .el-dialog__footer {
        padding: 0 27px 25px;
        text-align: left;
      }

      .button-color {
        width: 80px;
        height: 35px;
        margin: 0 15px 0 50px;
        border: 0;
        line-height: 0;
      }

      .cancel-btn {
        width: 80px;
        height: 35px;
        line-height: 0;
      }
    }

    &.night {
      color: $nightFontColor;
      background-color: $mainContentNightBgColor;

      > .inner-box {
        .content-box {
          > .inner-box {
            > .header {
              > .item {
                > span {
                  display: inline-block;
                }

                > a {
                  color: $nightFontColor;
                }
              }
            }

            > .content {
              > .input {
                background-color: rgb(78, 83, 90);

                /* 市价提示 */
                > .market-price {
                  background-color: $nightMarketPriceBg;
                }

                /* 限价input框 */
                > input {
                  border-color: #a9bed4;
                  color: $nightFontColor;
                  background-color: $mainContentNightBgColor;
                }
              }
            }
          }

          > .middle-line {
            &::before {
              border-color: $nightBorderColor;
            }
          }
        }
      }

      /deep/ {
        /* 警告提示框背景色 */
        .el-dialog {
          background-color: #28334a;
        }

        /* 警告提示框按钮 */
        .el-button--primary {
          color: #fff;
          background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
        }

        .el-dialog__title {
          color: #fff;
        }

        .el-dialog__header {
          background-color: #20293c;
        }

        .el-input__inner {
          border: 1px solid #485776;
          color: #fff;
          background-color: #2d3651;

          &:focus {
            border-color: $mainColor;
          }
        }

        .button-color {
          color: rgba(255, 255, 255, .7);
          background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
        }

        .cancel-btn {
          border: 1px solid #338ff5;
          color: #fff;
          background-color: transparent;
        }
      }
    }

    &.day {
      color: $dayFontColor;
      background-color: $dayMainBgColor;

      > .inner-box {
        .content-box {
          > .inner-box {
            > .header {
              > .item {
                > a {
                  color: $dayFontColor;
                }
              }
            }

            > .content {
              > .input {
                background-color: #e9ecee;

                /* 市价提示 */
                > .market-price {
                  background-color: $dayMarketPriceBg;
                }

                /* 限价input框 */
                > input {
                  border-color: #c4c4c4;
                  color: $dayFontColor;
                  background-color: #fff;
                }
              }
            }
          }

          > .middle-line {
            &::before {
              border-color: $nightMainTitleColor;
            }
          }
        }

        > .middle {
          .el-tabs__nav-wrap::after {
            background-color: #fff;
          }
        }
      }

      /deep/ {
        .button-color {
          color: rgb(255, 255, 255);
          background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
        }

        .cancel-btn {
          border: 1px solid #338ff5;
          color: #333;
          background-color: transparent;
        }
      }
    }
  }
</style>
