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
                    {{ $t('M.trade_exchange_can_buy') }}：
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
                    @keyup="autoChangeData('limit-buy',limitBuyPriceInputRef,middleTopData.priceExchange)"
                    @input="formatInput(limitBuyPriceInputRef,middleTopData.priceExchange)"
                  >
                  <span class="currency">{{middleTopData.area}}</span>
                  <div class="rate-changer"
                       v-show="activeConvertCurrencyObj&&(limitExchange.transformBuyPrice-0)"
                  >
                    ≈ {{limitExchange.transformBuyPrice}} {{activeConvertCurrencyObj.shortName}}
                  </div>
                </div>
                <!--买入量-->
                <div class="input">
                  <input
                    type="text"
                    :placeholder="$t('M.comm_buy') + $t('M.comm_quantity')"
                    :ref="limitBuyCountInputRef"
                    @keyup="autoChangeData('limit-buy',limitBuyCountInputRef,middleTopData.priceExchange)"
                    @input="formatInput(limitBuyCountInputRef,middleTopData.priceExchange)"
                  >
                  <span class="currency">{{middleTopData.sellsymbol}}</span>
                </div>
                <!--交易密码-->
                <div class="input">
                  <input
                    type="password"
                    :placeholder="$t('M.comm_password')"
                    v-model="limitExchange.buyPwd"
                  >
                </div>
                <!--滑块-->
                <div class="slider">
                </div>
                <!--预计交易额 手续费-->
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
                    @click="addEntrust(0,'limit-buy')"
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
                    {{ $t('M.trade_exchange_vendibility') }}：
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
                    :placeholder="$t('M.comm_sell') + $t('M.comm_price')"
                    :ref="limitSellPriceInputRef"
                    @keyup="autoChangeData('limit-sell',limitSellPriceInputRef,middleTopData.priceExchange)"
                    @input="formatInput(limitSellPriceInputRef,middleTopData.priceExchange)"
                  >
                  <span class="currency">{{middleTopData.area}}</span>
                  <div
                    class="rate-changer"
                    v-show="activeConvertCurrencyObj&&(limitExchange.transformSellPrice-0)"
                  >
                    ≈ {{limitExchange.transformSellPrice}} {{activeConvertCurrencyObj.shortName}}
                  </div>
                </div>
                <!--卖出量-->
                <div class="input">
                  <input
                    type="text"
                    :placeholder="$t('M.comm_sell') + $t('M.comm_quantity')"
                    :ref="limitSellCountInputRef"
                    @keyup="autoChangeData('limit-sell',limitSellCountInputRef,middleTopData.priceExchange)"
                    @input="formatInput(limitSellCountInputRef,middleTopData.priceExchange)"
                  >
                  <span class="currency">{{middleTopData.sellsymbol}}</span>
                </div>
                <!--交易密码-->
                <div class="input">
                  <input
                    type="password"
                    :placeholder="$t('M.comm_password')"
                    v-model="limitExchange.sellPwd"
                  >
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
                    <!--<span class="sell">{{limitExchange.sellAmount}}</span>-->
                    <span class="sell">{{limitSellAmount}}</span>
                    <span>{{middleTopData.area}}</span>
                  </div>
                </div>
                <div class="submit">
                  <el-button
                    class="submit-btn sell-btn"
                    @click="addEntrust(1,'limit-sell')"
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
          <div class=" content-box market">
            <div class="inner-box left">
              <div class="header">
                <div class="left item">
                  <IconFont iconName="icon-qianbao-"/>
                  <span class="margin-left10 buy">
                    <!--可买-->
                    {{ $t('M.trade_exchange_can_buy') }}：
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
                    :placeholder="$t('M.comm_buy') + $t('M.comm_quantity')"
                    :ref="marketBuyCountInputRef"
                    @keyup="autoChangeData('market-buy',marketBuyCountInputRef,middleTopData.priceExchange)"
                    @input="formatInput(marketBuyCountInputRef,middleTopData.priceExchange)"
                  >
                  <span class="currency">{{middleTopData.sellsymbol}}</span>
                </div>
                <!--交易密码-->
                <div class="input">
                  <input
                    type="password"
                    :placeholder="$t('M.comm_password')"
                    v-model="marketExchange.buyPwd"
                  >
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
                    @click="addEntrust(0,'market-buy')"
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
                    {{ $t('M.trade_exchange_vendibility') }}：
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
                    :placeholder="$t('M.comm_sell') + $t('M.comm_quantity')"
                    :ref="marketSellCountInputRef"
                    @keyup="autoChangeData('market-sell',marketSellCountInputRef,middleTopData.priceExchange)"
                    @input="formatInput(marketSellCountInputRef,middleTopData.priceExchange)"
                  >
                  <span class="currency">{{middleTopData.sellsymbol}}</span>
                </div>
                <!--交易密码-->
                <div class="input">
                  <input
                    type="password"
                    :placeholder="$t('M.comm_password')"
                    v-model="marketExchange.sellPwd"
                  >
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
                    @click="addEntrust(1,'market-sell')"
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
    </div>
  </div>
</template>
<script>
import IconFont from '../Common/IconFontCommon'
// import Slider from './SliderTrader'
import {
  formatNumberInput,
  getRefValue,
  keep2Num
} from '../../utils'
import {
  saveEntrustTrade,
  getUserAssetOfActiveSymbol
} from '../../utils/api/trade'
import {returnAjaxMessage} from '../../utils/commonFunc'
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations } = createNamespacedHelpers('trade')
export default {
  components: {
    IconFont
    // Slider
  },
  // props,
  data () {
    return {
      activeName: 'limit-price',
      sliderValue: '',
      limitBuySliderDisabled: false,
      limitBuyPriceInputRef: 'limitBuyPriceInput', // 限价交易 买入价input ref name
      limitBuyCountInputRef: 'limitBuyCountInput', // 限价交易 买入量input ref name
      marketBuyCountInputRef: 'marketBuyCountInput', // 市价交易 买入量input ref name
      limitSellPriceInputRef: 'limitSellPriceInput', // 限价交易 卖出价input ref name
      limitSellCountInputRef: 'limitSellCountInput', // 限价交易 卖出量input ref name
      marketSellCountInputRef: 'marketSellCountInput', // 市价交易 卖出量input ref name
      sellPriceInputRef: 'sellPriceInput', // 卖出价input ref name
      sellCountInputRef: 'sellCountInput', // 卖出量input ref name
      buyInputValue: '', // 买入input
      pointLength: 4, // 当前币种小数点限制位数
      matchType: 'LIMIT', // 撮合类型： LIMIT:限价单 MARKET:市价单
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
        sellPwd: ''
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
        sellPwd: ''
      },
      reflashCount: 0, // 当前交易对刷新次数
      buyUserCoinWallet: {}, // 当前交易对 买方币种用户资产
      sellUserCoinWallet: {}, // 当前交易对 卖方币种用户资产
      end: '' // 占位，项目完成后删除
    }
  },
  created () {
    require('../../../static/css/list/Trade/TradeCenter.css')
    require('../../../static/css/theme/day/Trade/TraderCenterDay.css')
    require('../../../static/css/theme/night/Trade/TradeCenterNight.css')
    require('../../../static/css/list/Trade/Exchange.css')
    require('../../../static/css/theme/day/Trade/ExchangeDay.css')
    require('../../../static/css/theme/night/Trade/ExchangeNight.css')
  },
  mounted () {
    this.getRefValue(this.limitBuyPriceInputRef)
    console.log(this.limitExchange.buyPrice)
  },
  activited () {},
  update () {},
  beforeRouteUpdate () {},
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
      if (!returnAjaxMessage(data, this)) {
        return false
      } else {
        console.log(data)
        this.buyUserCoinWallet = data.data.data.buyUserCoinWallet
        this.sellUserCoinWallet = data.data.data.sellUserCoinWallet
        // console.log(price)
        this.setBuyAndSellPrice(targetPriceOfBuy, targetPriceOfSell)
      }
    },
    // 清空交易密码
    removePwd () {
      this.limitExchange.buyPwd = ''
      this.limitExchange.sellPwd = ''
      this.marketExchange.buyPwd = ''
      this.marketExchange.sellPwd = ''
    },
    // 截取2位小数
    keep2Num (number) {
      return keep2Num(number)
    },
    // 跳转
    jumpToOtherPage (router, activeName) {
      console.log(this.activeSymbol)
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
          console.log(this.currencyRateList[this.activeSymbol.area])
          this.limitExchange.transformBuyPrice = this.keep2Num(this.currencyRateList[this.activeSymbol.area] * targetNum)
          console.log(targetNum)
          console.log(this.currencyRateList)
          console.log(this.currencyRateList[this.activeSymbol.area])
          console.log(this.limitExchange.transformBuyPrice)
          break
        case 'limit-sell':
          this.limitExchange.transformSellPrice = this.keep2Num(this.currencyRateList[this.activeSymbol.area] * targetNum)
          break
      }
    },
    // 设置 refinput value
    getRefValue (refName) {
      return getRefValue(this, refName)
    },
    // 数据联动
    autoChangeData (type, ref, pointLength) {
      switch (type) {
        // 限价买
        case 'limit-buy':
          this.limitExchange.buyPrice = this.getRefValue(this.limitBuyPriceInputRef)
          this.limitExchange.buyCount = this.getRefValue(this.limitBuyCountInputRef)
          this.setTransformPrice('limit-buy', this.limitExchange.buyPrice)
          if (this.limitExchange.buyPrice - 0) {
            this.limitExchange.userCanBuyCount = (this.buyUserCoinWallet.total / (this.limitExchange.buyPrice - 0)).toFixed(this.middleTopData.priceExchange)
          }
          break
        // 限价卖
        case 'limit-sell':
          this.limitExchange.sellPrice = this.getRefValue(this.limitSellPriceInputRef)
          this.limitExchange.sellCount = this.getRefValue(this.limitSellCountInputRef)
          this.setTransformPrice('limit-sell', this.limitExchange.sellPrice)
          break
        // 市价买
        case 'market-buy':
          // this.marketExchange.buyCount = this.getRefValue(this.limitSellPriceInputRef)
          this.marketExchange.buyCount = this.getRefValue(this.marketBuyCountInputRef)
          console.log(this.marketExchange.buyCount)
          break
        // 市价卖
        case 'market-sell':
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
    // 输入限制
    formatInput (ref, pointLength) {
      let target = this.$refs[ref]
      console.log(formatNumberInput(target, pointLength))
      return formatNumberInput(target, pointLength) - 0
    },
    // 新增委单
    async addEntrust (type, exhcangeType) {
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
      console.log(this.middleTopData)
      let params = {
        // partnerId: this.partnerId,
        userId: this.loginStep1Info.userId,
        tradeId: this.middleTopData.partnerTradeId + '',
        type: type ? 'SELL' : 'BUY', // 委单类型
        matchType: this.matchType, // 撮合类型
        source: 'Web' // 来源
      }
      switch (exhcangeType) {
        case 'limit-buy':
          params.payPwd = this.limitExchange.buyPwd
          break
        case 'limit-sell':
          params.payPwd = this.limitExchange.sellPwd
          break
        case 'market-buy':
          params.payPwd = this.marketExchange.buyPwd
          break
        case 'market-sell':
          params.payPwd = this.marketExchange.sellPwd
          break
      }
      // 限价单添加价格
      switch (type) {
        // 买单
        case 0:
          switch (this.matchType) {
            case 'LIMIT':
              params.price = this.$refs[this.limitBuyPriceInputRef].value
              params.count = this.$refs[this.limitBuyCountInputRef].value
              if ((this.buyUserCoinWallet.total / params.price) < params.count - 0) {
                // 可用币种数量不足
                this.$message({
                  type: 'error',
                  message: this.$t('M.trade_exchange_currency_available')
                })
                return false
              }
              break
            case 'MARKET':
              params.count = this.$refs[this.marketBuyCountInputRef].value
              if ((this.buyUserCoinWallet.total / this.middleTopData.last) < params.count - 0) {
                // 可用币种数量不足
                this.$message({
                  type: 'error',
                  message: this.$t('M.trade_exchange_currency_available')
                })
                return false
              }
              break
          }
          // console.log(this.buyUserCoinWallet.total)
          console.log(this.buyUserCoinWallet.total / params.price)
          console.log(params.count)
          break
        // 卖单
        case 1:
          switch (this.matchType) {
            case 'LIMIT':
              params.price = this.$refs[this.limitSellPriceInputRef].value
              params.count = this.$refs[this.limitSellCountInputRef].value
              break
            case 'MARKET':
              params.count = this.$refs[this.marketSellCountInputRef].value
              break
          }
          if (this.sellUserCoinWallet.total < params.count - 0) {
            // 可用币种数量不足
            this.$message({
              type: 'error',
              message: this.$t('M.trade_exchange_currency_available')
            })
            return false
          }
          break
      }
      console.log(this.buyUserCoinWallet.total)
      console.log(params.count)

      const data = await saveEntrustTrade(params)
      if (!returnAjaxMessage(data, this, 1)) {
        return false
      } else {
        this.TOGGLE_REFRESH_ENTRUST_LIST_STATUS(true)
        // 刷新用户资产
        await this.getUserAssetOfActiveSymbol()
        this.removePwd()
      }
    },
    // 设置买卖价格
    setBuyAndSellPrice (targetPriceOfBuy, targetPriceOfSell = targetPriceOfBuy) {
      console.log(1)
      this.$refs[this.limitBuyPriceInputRef].value = targetPriceOfBuy
      this.$refs[this.limitSellPriceInputRef].value = targetPriceOfSell
      const newBuyPrice = this.formatInput(this.limitBuyPriceInputRef, this.activeSymbol.priceExchange) - 0
      const newSellPrice = this.formatInput(this.limitSellPriceInputRef, this.activeSymbol.priceExchange) - 0
      console.log(newBuyPrice)
      this.setTransformPrice('limit-buy', newBuyPrice)
      this.setTransformPrice('limit-sell', newSellPrice)
      // this.setSimulationData(this.sellUserCoinWallet.total, newBuyPrice - 0 , this.limitExchange.userCanBuyCount)
      console.log(this.sellUserCoinWallet.total)
      if (newBuyPrice - 0) {
        this.limitExchange.userCanBuyCount = (this.buyUserCoinWallet.total / (newBuyPrice - 0)).toFixed(this.middleTopData.priceExchange)
        console.log(this.limitExchange.userCanBuyCount)
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      refreshEntrustStatus: state => state.trade.refreshEntrustStatus,
      partnerId: state => state.common.partnerId,
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
    currencyRateList (newVal) {
      console.log(newVal)
    },
    activeConvertCurrencyObj (newVal) {
      console.log(newVal)
      this.setBuyAndSellPrice(this.middleTopData.buy, this.middleTopData.sell)
    },
    activeSymbol (newVal) {
      console.log(newVal)
      this.reflashCount = 0
    },
    // 用户手动设置价格
    activePriceItem (newVal) {
      console.log(newVal)
      if (newVal) {
        this.setBuyAndSellPrice(newVal)
      }
    },
    middleTopData (newVal) {
      console.log(newVal)
      let targetPriceOfBuy = newVal.buy || newVal.kai
      let targetPriceOfSell = newVal.sell || newVal.kai
      // 首次打开设置价格
      if (!this.reflashCount) {
        if (newVal.last) {
          this.reflashCount++
        }
        if (this.isLogin) {
          this.getUserAssetOfActiveSymbol(targetPriceOfBuy, targetPriceOfSell)
        } else {
          console.log('zzz')
          this.setBuyAndSellPrice(targetPriceOfBuy, targetPriceOfSell)
        }
      }
    }
  }
}
</script>
<style scoped lang="scss">
  @import '../../../static/css/scss/index.scss';
  @import '../../../static/css/scss/Trade/TradeCenter';
  .exchange-box{
    width:100%;
    height:414px;
    margin:10px 0;
    >.inner-box{
      position: relative;
      >.currency-info{
        position: absolute;
        right:0;
        top:0;
        height:34px;
        line-height: 34px;
        z-index: 2000;
        text-align: right;
        padding-right:27px;
        >.router-link{
          color: $mainColor;
        }
      }
      .content-box{
        padding:22px 2.8%;
        display:flex;
        position: relative;
        width:100%;
        height:100%;
        >.inner-box{
          flex:1;
          >.header{
            display:flex;
            white-space:nowrap;
            >.item{
              flex:1;
              >.buy{
                color:$upColor;
              }
              >.sell{
                color:$downColor;
              }
              >a{
                padding-left:30px;
              }
            }
            >.left{
              flex:2;
            }
          }
          >.content{
            padding:20px 0;
            >.input{
              position: relative;
              margin-bottom:20px;
              border-radius: 3px;
              /*市价提示*/
              >.market-price{
                width:100%;
                height:38px;
                line-height: 38px;
                padding:0 15px 0 20px;
                border-radius: 3px;
                &.buy-price{
                  color:$upColor;
                }
                &.sell-price{
                  color:$downColor;
                }
              }
              /*限价input框*/
              >input{
                width:100%;
                height:38px;
                border:1px solid;
                font-size: 14px;
                padding:0 15px 0 20px;
                border-radius: 3px;
                box-sizing: border-box;
              }
              >.currency{
                position: absolute;
                right:15px;
                top:0;
                height:34px;
                line-height: 34px;
              }
              >.rate-changer{
                height:18px;
                padding:0 20px;
                font-size: 12px;
              }
            }
            >.volume-rate{
              display:flex;
              >.item{
                flex:1;
                span{
                  &.buy{
                    color: $upColor;
                  }
                  &.sell{
                    color:$downColor;
                  }
                }
                &.right{
                  text-align: right;
                }
              }
            }
          }
        }
        >.middle-line{
          position: relative;
          width:130px;
          height:320px;
          &:before{
            position: absolute;
            content:'';
            width:1px;
            height:320px;
            left:50%;
            top:0;
            border-left:1px dashed;
          }
        }
      }
    }
    &.night{
      background-color: $mainContentNightBgColor;
      color:$nightFontColor;
      >.inner-box{
        >.currency-info{
          >a{
          }
        }
        .content-box{
          >.inner-box{
            >.header{
              >.item{
                >span{
                  display:inline-block;
                }
                >a{
                  color:$nightFontColor;
                }
              }
              >.left{
              }
              >.right{
              }
            }
            >.content{
              >.input{
                background-color:rgb(78,83,90) ;
                /*市价提示*/
                >.market-price{
                  background-color: $nightMarketPriceBg;
                  &.buy-price{
                  }
                  &.sell-price{
                  }
                }
                /*限价input框*/
                >input{
                  border-color:#A9BED4;
                  background-color: $mainContentNightBgColor;
                  color:$nightFontColor;
                }
                >.currency{
                }
                >.rate-changer{
                }
              }
            }
          }
          >.middle-line{
            &:before{
              border-color:$nightBorderColor;
            }
          }
        }
      }
    }
    &.day{
      background-color: $dayMainBgColor;
      color:$dayFontColor;
      >.inner-box{
        >.currency-info{
          >a{
          }
        }
        .content-box{
          >.inner-box{
            >.header{
              >.item{
                >a{
                  color:$dayFontColor;
                }
              }
              >.left{
              }
              >.right{
              }
            }
            >.content{
              >.input{
                background-color: #e9ecee;
                /*市价提示*/
                >.market-price{
                  background-color: $dayMarketPriceBg;
                  &.buy-price{
                  }
                  &.sell-price{
                  }
                }
                /*限价input框*/
                >input{
                  border-color:#c4c4c4;
                  background-color: #fff;
                  color:$dayFontColor;
                }
                >.currency{
                }
                >.rate-changer{
                }
              }
            }
          }
          >.middle-line{
            &:before{
              border-color:$nightMainTitleColor;
            }
          }
        }
      }
    }
  }
</style>
