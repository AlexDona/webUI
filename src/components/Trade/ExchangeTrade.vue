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
          <div
            class="content-box limit"
          >
            <div class="inner-box left">
              <div class="header">
                <div class="left item">
                  <IconFont iconName="icon-qianbao-"/>
                  <span class="margin-left10 buy">
                    <!--可用-->
                    {{$t('M.comm_usable')}}:
                    <span v-show="!buyUserCoinWallet.total">--</span>
                    <span v-show="buyUserCoinWallet.total">{{$scientificToNumber(buyUserCoinWallet.total)}}</span>
                    <span>{{middleTopData.area}}</span>
                  </span>
                </div>
                <div class="right item">
                  <a
                    @click.stop="jumpToPersonalCenter('assets')"
                    :style="{'cursor': 'pointer'}"
                  >
                    <!--充币-->
                    {{ $t('M.comm_charge_money') }}
                  </a>
                  <a
                    @click.stop="jumpToPersonalCenter('assets')"
                    :style="{'cursor': 'pointer'}"
                  >
                    <!--提币-->
                    {{ $t('M.comm_mention_money') }}
                  </a>
                </div>
              </div>
              <div class="content">
                <!--买入价-->
                <div class="input">
                  <input
                    type="text"
                    :placeholder="$t('M.comm_buy') + $t('M.comm_price')"
                    :ref="limitBuyPriceInputRef"
                    @keyup="autoChangeData('limit-buy')"
                    maxlength="14"
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
                <div
                  class="input"
                  v-if="activeName === 'limit-price'"
                >
                  <input
                    :class="{
                      'error':buyUserCoinWallet.total < limitBuyAmount
                    }"
                    type="text"
                    maxlength="14"
                    :placeholder="$t('M.comm_buy') + $t('M.comm_quantity')"
                    :ref="limitBuyCountInputRef"
                    @keyup="autoChangeData('limit-buy')"
                    @input="formatInput(limitBuyCountInputRef,middleTopData.countExchange)"
                    onpaste="return false"
                  >
                  <span class="currency">{{middleTopData.sellsymbol}}</span>
                  <span
                    class="error-box"
                    v-show="errorMsg.limit.buy.amount"
                  >{{errorMsg.limit.buy.amount}}</span>
                </div>
                <!-- 限价买 滑块 -->
                <SliderBar
                  :className="'limit-buy'"
                  :disabled="slider.isbuySliderBarDisabled"
                  :buyTotal="buyUserCoinWallet.total"
                  :sellTotal="sellUserCoinWallet.total"
                  @sliderBarValueChange="sliderBarValueChange"
                  @dragStart="dragStart"
                  @dragEnd="dragEnd"
                  @dragCallback="dragCallback"
                  v-if="!$isSymbolChanged_X && activeName === 'limit-price'"
                />
                <div class="volume-rate">
                  <div class="item">
                    <span>
                      <!--预计交易额-->
                      {{ $t('M.trade_exchange_estimated_turnover') }}：
                    </span>
                    <span
                      class="buy"
                      v-show="limitBuyAmount">{{limitBuyAmount}}</span>
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
                    <!--可用-->
                    {{$t('M.comm_usable')}}:
                    <span v-show="!sellUserCoinWallet.total">--</span>
                    <span v-show="sellUserCoinWallet.total">{{$scientificToNumber(sellUserCoinWallet.total)}}</span>
                    <span>{{middleTopData.sellsymbol}}</span>
                  </span>
                </div>
                <div class="right item">
                  <a
                    @click="jumpToPersonalCenter('assets')"
                    :style="{'cursor': 'pointer'}"
                  >
                    <!--充币-->
                    {{ $t('M.comm_charge_money') }}
                  </a>
                  <a
                    @click="jumpToPersonalCenter('assets')"
                    :style="{'cursor': 'pointer'}"
                  >
                    <!--提币-->
                    {{ $t('M.comm_mention_money') }}
                  </a>
                </div>
              </div>
              <div class="content">
                <!--卖出价-->
                <div class="input">
                  <input
                    type="text"
                    maxlength="14"
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
                    :class="{
                      'error': sellUserCoinWallet.total < limitExchange.sellCount
                    }"
                    maxlength="14"
                    type="text"
                    :placeholder="$t('M.comm_sell') + $t('M.comm_quantity')"
                    :ref="limitSellCountInputRef"
                    @keyup="autoChangeData('limit-sell')"
                    @input="formatInput(limitSellCountInputRef,middleTopData.countExchange)"
                    onpaste="return false"
                  >
                  <span class="currency">{{middleTopData.sellsymbol}}</span>
                  <span
                    class="error-box"
                    v-show="errorMsg.limit.sell.amount"
                  >{{errorMsg.limit.sell.amount}}</span>
                </div>
                <!-- 限价卖 滑块 -->
                <SliderBar
                  :className="'limit-sell'"
                  :disabled="slider.isSellSliderBarDisabled"
                  :buyTotal="buyUserCoinWallet.total"
                  :sellTotal="sellUserCoinWallet.total"
                  @sliderBarValueChange="sliderBarValueChange"
                  @dragStart="dragStart"
                  @dragEnd="dragEnd"
                  @dragCallback="dragCallback"
                  v-if="!$isSymbolChanged_X && activeName === 'limit-price'"
                />
                <!--预计交易额 手续费-->
                <div class="volume-rate">
                  <div class="item">
                    <span>
                      <!--预计交易额：-->
                      {{ $t('M.trade_exchange_estimated_turnover') }}：
                    </span>
                    <span
                      class="sell"
                      v-show="limitSellAmount"
                    >{{limitSellAmount}}</span>
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
          <div
            class="content-box market"
            v-if="activeName ==='market-price'"
          >
            <div class="inner-box left">
              <div class="header">
                <div class="left item">
                  <IconFont iconName="icon-qianbao-"/>
                  <span class="margin-left10 buy">
                    <!--可用-->
                    {{$t('M.comm_usable')}}:
                    <span v-show="!buyUserCoinWallet.total||!middleTopData.last">--</span>
                    <span v-show="buyUserCoinWallet.total&&middleTopData.last">
                      {{$scientificToNumber(buyUserCoinWallet.total)}}
                    </span>
                    <span>{{middleTopData.area}}</span>
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
                <!-- 成交额 -->
                <div class="input">
                  <input
                    :class="{
                      error: isNeedErrorMsgForBuyAmount
                    }"
                    maxlength="14"
                    type="text"
                    :placeholder="$t('M.user_coin_volume')"
                    :ref="marketBuyAmountInputRef"
                    @keyup="autoChangeData('market-buy')"
                    @input="formatInput(marketBuyAmountInputRef,middleTopData.countExchange)"
                    onpaste="return false"
                  >
                  <span class="currency">{{middleTopData.area}}</span>
                  <span
                    class="error-box"
                    v-show="errorMsg.market.buy.amount"
                  >{{errorMsg.market.buy.amount}}</span>
                </div>
                <!-- 市价买 滑块 -->
                <SliderBar
                  :className="'market-buy'"
                  :disabled="slider.isbuySliderBarDisabled"
                  :buyTotal="buyUserCoinWallet.total"
                  :sellTotal="sellUserCoinWallet.total"
                  @sliderBarValueChange="sliderBarValueChange"
                  @dragStart="dragStart"
                  @dragEnd="dragEnd"
                  @dragCallback="dragCallback"
                  v-if="!$isSymbolChanged_X"
                />
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
                    <!--可用-->
                    {{$t('M.comm_usable')}}:
                    <span v-show="!sellUserCoinWallet.total">--</span>
                    <span v-show="sellUserCoinWallet.total">{{$scientificToNumber(sellUserCoinWallet.total)}}</span>
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
                  <span
                    class="error-box"
                    v-show="errorMsg.market.sell.count"
                  >{{errorMsg.market.sell.count}}</span>
                </div>
                <!--卖出量-->
                <div class="input">
                  <input
                    :class="{
                      error: isNeedErrorMsgForSellCount
                    }"
                    maxlength="14"
                    type="text"
                    :placeholder="$t('M.comm_sell') + $t('M.comm_quantity')"
                    :ref="marketSellCountInputRef"
                    @keyup="autoChangeData('market-sell')"
                    @input="formatInput(marketSellCountInputRef,middleTopData.countExchange)"
                    onpaste="return false"
                  >
                  <span class="currency">{{middleTopData.sellsymbol}}</span>
                  <span
                    class="error-box"
                    v-show="errorMsg.market.sell.amount"
                  >{{errorMsg.market.sell.amount}}</span>
                </div>
                <!-- 市价卖 滑块 -->
                <SliderBar
                  :className="'market-sell'"
                  :disabled="slider.isSellSliderBarDisabled"
                  :buyTotal="buyUserCoinWallet.total"
                  :sellTotal="sellUserCoinWallet.total"
                  @sliderBarValueChange="sliderBarValueChange"
                  @dragStart="dragStart"
                  @dragEnd="dragEnd"
                  @dragCallback="dragCallback"
                  v-if="!$isSymbolChanged_X"
                />
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
        :title="$t('M.user_security_verify') + $t('M.comm_password')"
        :visible.sync="isShowPayPassword"
      >
        <el-input
          type="password"
          autocomplete= "new-password"
          v-model="payPassword"
          :placeholder="`${$t('M.comm_please_enter')}${$t('M.comm_password')}`"
          @input="clearPasswordErrorMsg"
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
        >
          <!--暂时关闭交易密码校验-->
          <span
            class="forget-password text-align-l margin-bottom10 margin-top9"
            @click="jumpToPersonalCenter('personal-setting')"
          >{{$t('M.user_payPassword_switch')}}</span>
          <br/>
          <!--确 定 取 消-->
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
          <!-- 忘记交易密码 -->
          <span
            class="forget-password text-align-r margin-top9 float-right"
            @click="$goToPage('/TransactionPassword')"
          >{{$t('M.user_payPassword')}}</span>
          <br/>
        </span>
      </el-dialog>
    </div>
    <!--未实名认证前弹框提示-->
    <div class="warning">
      <el-dialog
        :visible.sync="notVerifyDialogVisible"
        center
      >
        <div class="dialog-warning">
          <div class="dialog-warning-box">
            <IconFont
              class="font-size60"
              iconName="icon-gantanhao"
            />
          </div>
        </div>
        <p class="font-size12 warning-text margin-top35 text-align-c">
          <!--请先进行实名认证！-->
          <span v-show="!(this.realNameAuth === 'y')">
            {{ $t('M.user_asset_title17') }}
          </span>
        </p>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <!--确 定 取 消-->
        <button
          class="button-color border-radius4 cursor-pointer"
          type="primary"
          @click="realNameAuthConfirm"
        >
          <!--确 定-->
          {{ $t('M.comm_confirm') }}
        </button>
        <button
          class="btn border-radius4 cursor-pointer"
          @click.prevent="notVerifyDialogVisible = false"
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
import SliderBar from '../Common/SliderBar'
import {
  formatNumberInput,
  getRefValue,
  cutOutPointLength
} from '../../utils'
import {
  saveEntrustTrade,
  getUserAssetOfActiveSymbol
} from '../../utils/api/trade'
import {
  getNestedData,
  isNeedPayPasswordAjax,
  formatPointLength
} from '../../utils/commonFunc'
import {
  mapState,
  mapMutations,
  mapActions
} from 'vuex'

export default {
  components: {
    IconFont,
    SliderBar
  },
  // props,
  data () {
    return {
      notVerifyDialogVisible: false, // 实名认证弹窗显示与隐藏
      activeName: this.$isNeedLimitExchange_G_X ? 'limit-price' : 'market-price',
      // 限价交易 买入价input ref name
      limitBuyPriceInputRef: 'limitBuyPriceInput',
      // 限价交易 买入量input ref name
      limitBuyCountInputRef: 'limitBuyCountInput',
      // 市价交易 成交额 ref name
      marketBuyAmountInputRef: 'marketBuyAmountInput',
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
        sellPwd: ''
      },
      marketExchange: {
        userCanBuyCount: 0, // 用户可买
        buyCount: 0,
        buyAmount: 0, // 买入成交额
        sellCount: 0,
        sellAmount: 0, // 卖出成交额
        buyPwd: '', // 交易密码
        sellPwd: ''
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
            count: '',
            amount: ''
          },
          sell: {
            count: '',
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
      isPayPasswordEmpty: false,
      slider: {
        // 买滑动是否禁用
        isbuySliderBarDisabled: false,
        // 卖滑动是否禁用
        isSellSliderBarDisabled: false
      },
      isUserChangePrice: true
    }
  },
  async created () {
    if (!this.$isNeedLimitExchange_G_X || !this.$isNeedYST_G_X) {
      this.activeName = 'limit-price'
      this.toggleMatchType()
    }
    if (this.isLogin) {
      await this.REFRESH_USER_INFO_ACTION()
      // console.log(this.REFRESH_USER_INFO_ACTION)
    }
  },
  mounted () {
    // this.getRefValue(this.limitBuyPriceInputRef)
  },
  activated () {},
  update () {
  },
  beforeRouteUpdate () {
  },
  methods: {
    ...mapMutations([
      'TOGGLE_REFRESH_ENTRUST_LIST_STATUS',
      'CHANGE_FOOTER_ACTIVE_NAME',
      'SET_TARGET_EXCHANGE_DATA',
      'CHANGE_SYMBOL_CHANGED_STATUS',
      'CHANGE_USER_CENTER_ACTIVE_NAME',
      'CHANGE_PASSWORD_USEABLE'
    ]),
    ...mapActions([
      'REFRESH_USER_INFO_ACTION'
    ]),
    // 实名认证验证
    realNameAuthConfirm () {
      this.CHANGE_USER_CENTER_ACTIVE_NAME('identity-authentication')
      this.$goToPage('/PersonalCenter')
      this.notVerifyDialogVisible = false
    },
    jumpToPersonalCenter (target) {
      this.CHANGE_USER_CENTER_ACTIVE_NAME(target)
      this.$goToPage('/PersonalCenter')
    },
    changeSliderDisabled () {
      // console.log(this.buyUserCoinWallet.total)
      this.slider.isbuySliderBarDisabled = !this.buyUserCoinWallet.total ? 1 : 0
      this.slider.isSellSliderBarDisabled = !this.sellUserCoinWallet.total ? 1 : 0
      // console.log(this.slider)
    },
    // 获取用户对应交易对资产
    async getUserAssetOfActiveSymbol (targetPriceOfBuy, targetPriceOfSell) {
      const params = {
        tradeId: this.middleTopData.partnerTradeId // 交易对id
      }
      const data = await getUserAssetOfActiveSymbol(params)
      if (!data) return false
      this.buyUserCoinWallet = getNestedData(data, 'data.buyUserCoinWallet')
      this.sellUserCoinWallet = getNestedData(data, 'data.sellUserCoinWallet')
      this.setBuyAndSellPrice(targetPriceOfBuy, targetPriceOfSell)
      this.changeSliderDisabled()
    },
    // 清空交易密码
    clearFormData () {
      this.payPassword = ''
      this.clearRefValue(this.limitBuyPriceInputRef)
      this.clearRefValue(this.limitBuyCountInputRef)
      this.clearRefValue(this.limitBuyCountInputRef)
      this.clearRefValue(this.marketBuyAmountInputRef)
      this.clearRefValue(this.limitSellPriceInputRef)
      this.clearRefValue(this.limitSellCountInputRef)
      this.clearRefValue(this.marketSellCountInputRef)
      this.limitExchange.buyCount = 0
      this.limitExchange.sellCount = 0
      this.marketExchange.sellCount = 0
      this.marketExchange.buyAmount = 0
      this.setSiderBarValue('limit', {
        buyPrice: 0,
        buyCount: 0,
        sellPrice: 0,
        sellCount: 0
      })
      this.setSiderBarValue('market', {
        buyAmount: 0,
        sellCount: 0
      })
    },
    clearRefValue (refName) {
      if (this.$refs[refName]) {
        this.$refs[refName].value = ''
      }
    },
    clearPasswordErrorMsg () {
      this.isPayPasswordEmpty = false
    },
    clearErrorMsg (type) {
      switch (type) {
        case 'limit-buy':
          this.errorMsg.limit.buy.price = ''
          this.errorMsg.limit.buy.amount = ''
          break
        case 'limit-sell':
          this.errorMsg.limit.sell.price = ''
          this.errorMsg.limit.sell.amount = ''
          break
        case 'market-buy':
          this.errorMsg.market.buy.amount = ''
          break
        case 'market-sell':
          this.errorMsg.market.sell.amount = ''
          this.errorMsg.market.sell.count = ''
          break
        default:
          this.errorMsg.limit.buy.price = ''
          this.errorMsg.limit.buy.amount = ''
          this.errorMsg.limit.sell.price = ''
          this.errorMsg.limit.sell.amount = ''
          this.errorMsg.market.buy.amount = ''
          this.errorMsg.market.sell.amount = ''
          this.errorMsg.market.sell.count = ''
          break
      }
    },
    // 取消添加委单
    cancelAddEntrust () {
      this.isShowPayPassword = false
    },
    // 跳转
    jumpToOtherPage (router, activeName) {
      this.CHANGE_FOOTER_ACTIVE_NAME({
        activeName,
        type: router
      })
      this.$goToPage(router)
    },
    // 设置转换后的价格
    setTransformPrice (type, targetNum) {
      switch (type) {
        case 'limit-buy':
          // this.limitExchange.transformBuyPrice = this.$scientificToNumber(this.$keep2Num(this.currencyRateList[this.activeSymbol.area] * targetNum))
          this.limitExchange.transformBuyPrice = this.$keep2Num(this.currencyRateList[this.activeSymbol.area] * targetNum)
          // console.log(this.limitExchange.transformBuyPrice)
          break
        case 'limit-sell':
          this.limitExchange.transformSellPrice = this.$keep2Num(this.currencyRateList[this.activeSymbol.area] * targetNum)
          break
      }
    },
    // 设置 refinput value
    getRefValue (refName) {
      return getRefValue(this, refName) - 0
    },
    // 数据联动
    autoChangeData (type) {
      this.clearErrorMsg(type)
      switch (type) {
        // 限价买
        case 'limit-buy':
          this.limitExchange.buyPrice = this.getRefValue(this.limitBuyPriceInputRef)
          this.limitExchange.buyCount = this.getRefValue(this.limitBuyCountInputRef)
          this.setTransformPrice('limit-buy', this.limitExchange.buyPrice)
          if (this.limitExchange.buyPrice) {
            this.limitExchange.userCanBuyCount = (this.buyUserCoinWallet.total / this.limitExchange.buyPrice).toFixed(this.middleTopData.priceExchange)
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
          this.marketExchange.buyAmount = this.getRefValue(this.marketBuyAmountInputRef)
          break
        // 市价卖
        case 'market-sell':
          this.marketExchange.sellCount = this.getRefValue(this.marketSellCountInputRef)
          break
      }
      this.setSiderBarValue('limit', {
        buyPrice: this.limitExchange.buyPrice,
        buyCount: this.limitExchange.buyCount,
        sellPrice: this.limitExchange.sellPrice,
        sellCount: this.limitExchange.sellCount
      })
      this.setSiderBarValue('market', {
        buyAmount: this.marketExchange.buyAmount,
        sellCount: this.marketExchange.sellCount
      })
    },
    // 设置滑块value
    setSiderBarValue (type, {
      buyPrice,
      buyCount,
      sellPrice,
      sellCount,
      buyAmount
    }) {
      switch (type) {
        case 'limit':
          this.SET_TARGET_EXCHANGE_DATA({
            type,
            buyPrice,
            buyCount,
            sellPrice,
            sellCount
          })
          break
        case 'market':
          this.SET_TARGET_EXCHANGE_DATA({
            type,
            buyAmount,
            sellCount
          })
          break
      }
      this.SET_TARGET_EXCHANGE_DATA({
        type: 'limit',
        buyPrice: this.limitExchange.buyPrice,
        buyCount: this.limitExchange.buyCount,
        sellPrice: this.limitExchange.sellPrice,
        sellCount: this.limitExchange.sellCount
      })
      // console.log(this.limitExchangeOfState)
      this.SET_TARGET_EXCHANGE_DATA({
        type: 'market',
        buyAmount: this.marketExchange.buyAmount,
        sellCount: this.marketExchange.sellCount
      })
    },
    // 获取 ref value
    // 切换撮合类型
    toggleMatchType () {
      switch (this.activeName) {
        case 'market-price':
          this.matchType = 'MARKET'
          this.setRefValue(this.limitBuyCountInputRef)
          this.limitExchange.buyCount = 0
          this.setRefValue(this.limitSellCountInputRef)
          this.limitExchange.sellCount = 0
          break
        case 'limit-price':
          this.matchType = 'LIMIT'
          this.setRefValue(this.marketBuyAmountInputRef)
          this.marketExchange.sellCount = 0
          this.setRefValue(this.marketSellCountInputRef)
          this.marketExchange.buyAmount = 0
          break
      }
    },
    // 交易密码
    async showPayPassword (entrustType, matchType) {
      if (this.isLogin) {
        if (!(this.realNameAuth === 'y')) {
          this.notVerifyDialogVisible = true
          return false
        }
        // 用户交易密码是否锁定判断
        await this.REFRESH_USER_INFO_ACTION()
        let isPaypasswordLocked = getNestedData(this.loginStep1Info, 'payPasswordRemainCount') ? false : true
        this.CHANGE_PASSWORD_USEABLE(isPaypasswordLocked)
        if (this.isLockedPayPassword) return false
        //
        this.entrustType = entrustType
        this.isNeedPayPassowrd = await isNeedPayPasswordAjax(this)
        console.log(this.isNeedPayPassowrd)
        // console.log(entrustType, matchType)
        let next = false
        let params = {}
        console.log(entrustType, this.matchType)
        switch (entrustType) {
          // 买入
          case 0:
            switch (this.matchType) {
              case 'LIMIT':
                params.price = this.getRefValue(this.limitBuyPriceInputRef)
                params.count = this.getRefValue(this.limitBuyCountInputRef)
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

                if ((this.buyUserCoinWallet.total / params.price) < params.count) {
                  this.errorMsg.limit.buy.price = this.$t('M.trade_exchange_currency_available')
                  return false
                }
                next = true
                break
              case 'MARKET':
                if (!this.marketExchange.buyAmount) {
                  this.errorMsg.market.buy.amount = this.$t('M.trade_empty_buy_count')
                  return false
                } else {
                  this.errorMsg.market.buy.amount = ''
                }
                params.count = this.getRefValue(this.marketBuyAmountInputRef)
                if (this.buyUserCoinWallet.total - params.count < 0) {
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
                params.price = this.getRefValue(this.limitSellPriceInputRef)
                params.count = this.getRefValue(this.limitSellCountInputRef)
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
                console.log((this.sellUserCoinWallet.total), params.count)
                if (this.sellUserCoinWallet.total - params.count < 0) {
                  // 可用币种数量不足
                  this.errorMsg.limit.sell.price = this.$t('M.trade_exchange_currency_available')
                  return false
                }
                next = true
                break
              case 'MARKET':
                // console.log(1)
                params.count = this.getRefValue(this.marketSellCountInputRef)
                this.marketExchange.sellCount = params.count
                if (!this.marketExchange.sellCount) {
                  this.errorMsg.market.sell.amount = this.$t('M.trade_empty_sell_count')
                  return false
                } else {
                  this.errorMsg.market.sell.amount = ''
                }
                if (this.sellUserCoinWallet.total - params.count < 0) {
                  // 可用币种数量不足
                  this.errorMsg.market.sell.count = this.$t('M.trade_exchange_currency_available')
                  return false
                } else {
                  this.errorMsg.market.sell.count = ''
                }
                next = true
                break
            }
            break
        }
        console.log(next)
        if (!next) {
          return false
        }
        if (this.isNeedPayPassowrd) {
          this.isShowPayPassword = true
          this.clearPasswordErrorMsg()
        } else {
          this.addEntrust()
        }
      } else {
        this.$goToPage('/login')
      }
    },
    setRefValue (ref, value = '') {
      if (this.$refs[ref]) this.$refs[ref].value = value
    },
    // 输入限制
    formatInput (ref, pointLength) {
      let target = this.$refs[ref]
      return this.$scientificToNumber(formatNumberInput(target, pointLength) - 0)
    },
    // 新增委单
    async addEntrust () {
      if (!this.isLogin) {
        this.$goToPage('/login')
        return false
      }
      if (!this.loginStep1Info.userInfo.payPassword) {
        // 请设置交易密码后操作
        this.$message({
          type: 'error',
          message: this.$t('M.comm_please_set_up') + this.$t('M.comm_password') + this.$t('M.trade_exchange_after_operation')
        })
        this.$goToPage('/TransactionPassword')
        return false
      }

      let params = {
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
              params.price = this.getRefValue(this.limitBuyPriceInputRef)
              params.count = this.getRefValue(this.limitBuyCountInputRef)
              // console.log(params)
              break
            case 'MARKET':
              params.count = this.getRefValue(this.marketBuyAmountInputRef)
              break
          }
          break
        // 卖单
        case 1:
          switch (this.matchType) {
            case 'LIMIT':
              params.price = this.getRefValue(this.limitSellPriceInputRef)
              params.count = this.getRefValue(this.limitSellCountInputRef)
              // console.log(params)
              break
            case 'MARKET':
              params.count = this.getRefValue(this.marketSellCountInputRef)
              break
          }
          break
      }
      const data = await saveEntrustTrade(params)
      this.isShowPayPassword = false
      if (!data) return false
      this.TOGGLE_REFRESH_ENTRUST_LIST_STATUS(true)
      this.clearFormData()
    },
    // 设置买卖价格
    setBuyAndSellPrice (targetPriceOfBuy, targetPriceOfSell = targetPriceOfBuy) {
      targetPriceOfBuy = this.$scientificToNumber(targetPriceOfBuy)
      targetPriceOfSell = this.$scientificToNumber(targetPriceOfSell)
      if (this.$refs[this.limitBuyPriceInputRef]) {
        this.setRefValue(this.limitBuyPriceInputRef, targetPriceOfBuy)
        this.limitExchange.buyPrice = targetPriceOfBuy
        const newBuyPrice = this.formatInput(this.limitBuyPriceInputRef, this.activeSymbol.priceExchange)
        this.setTransformPrice('limit-buy', newBuyPrice)
        if (newBuyPrice) {
          this.limitExchange.userCanBuyCount = (this.buyUserCoinWallet.total / newBuyPrice).toFixed(this.middleTopData.priceExchange)
        }
      }
      if (this.$refs[this.limitSellPriceInputRef]) {
        this.setRefValue(this.limitSellPriceInputRef, targetPriceOfSell)
        this.limitExchange.sellPrice = targetPriceOfSell
        const newSellPrice = this.formatInput(this.limitSellPriceInputRef, this.activeSymbol.priceExchange)
        this.setTransformPrice('limit-sell', newSellPrice)
      }
    },
    // sliderBar events:
    sliderBarValueChange ({newVal, target}) {
      if (this.isUserChangePrice) {
        return false
      }
      this.clearErrorMsg(target)
      switch (target) {
        // 限价买
        case 'limit-buy':
          this.errorMsg.limit.buy.price = ''
          this.errorMsg.limit.buy.amount = ''
          if (this.buyUserCoinWallet.total) {
            // 设置买入量
            let count = (this.buyUserCoinWallet.total / this.limitExchange.buyPrice) * newVal / 100
            count = formatPointLength(count, this.middleTopData.countExchange)

            this.$refs[this.limitBuyCountInputRef].value = count
            this.limitExchange.buyCount = count
          }
          break
        // 市价买
        case 'market-buy':
          if (this.buyUserCoinWallet.total) {
            let amount = this.buyUserCoinWallet.total * newVal / 100
            amount = formatPointLength(amount, this.middleTopData.priceExchange)
            this.$refs[this.marketBuyAmountInputRef].value = amount
            this.marketExchange.buyAmount = amount
          }
          break
        // 限价卖
        case 'limit-sell':
          this.setSellRefVal(this.sellUserCoinWallet.total, newVal, this.limitSellCountInputRef, 'limit')
          break
        // 市价卖
        case 'market-sell':
          this.setSellRefVal(this.sellUserCoinWallet.total, newVal, this.marketSellCountInputRef, 'market')
          break
      }
      this.isUserChangePrice = true
    },
    // 设置限价卖、市价卖 ref value
    setSellRefVal (total, newRate, targetRef, type) {
      if (total) {
        // 设置卖出量
        let count = total * newRate / 100
        count = formatPointLength(count, this.middleTopData.countExchange)

        this.$refs[targetRef].value = count
        switch (type) {
          case 'limit':
            this.limitExchange.sellCount = count
            break
          case 'market':
            this.marketExchange.sellCount = count
            break
        }
      }
    },
    dragStart () {
      this.isUserChangePrice = false
    },
    dragEnd () {
      this.isUserChangePrice = true
    },
    dragCallback ({target, newVal}) {
      // console.log(target)
      this.isUserChangePrice = false
      this.sliderBarValueChange({target, newVal})
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
      middleTopData: state => state.trade.middleTopData,
      limitExchangeOfState: state => state.trade.limitExchange,
      // 是否通过高级认证
      advancedAuth: state => getNestedData(state, 'user.loginStep1Info.userInfo.advancedAuth'),
      // 实名认证
      realNameAuth: state => getNestedData(state, 'user.loginStep1Info.userInfo.realNameAuth'),
      // 交易密码是否被锁定
      isLockedPayPassword: state => state.common.isLockedPayPassword
    }),
    isNeedErrorMsgForSellCount () {
      return this.marketExchange.sellCount > this.sellUserCoinWallet.total
    },
    isNeedErrorMsgForBuyAmount () {
      return this.marketExchange.buyAmount > this.buyUserCoinWallet.total
    },
    // 限价买预计成交额
    limitBuyAmount () {
      return this.$scientificToNumber(cutOutPointLength(this.$scientificToNumber(this.limitExchange.buyPrice * this.limitExchange.buyCount), 2))
    },
    // 限价卖预计成交额
    limitSellAmount () {
      return this.$scientificToNumber(cutOutPointLength(this.$scientificToNumber(this.limitExchange.sellPrice * this.limitExchange.sellCount), 2))
    }
  },
  watch: {
    $isNeedLimitExchange_G_X (newVal) {
      // console.log(newVal)
      console.log(newVal, this.$isLimitShow_S_X)
      this.activeName = newVal ? 'limit-price' : 'market-price'
      this.toggleMatchType()
    },
    matchType (newVal) {
      this.setSiderBarValue('limit', {
        buyPrice: 0,
        buyCount: 0,
        sellPrice: 0,
        sellCount: 0
      })
      this.setSiderBarValue('market', {
        buyAmount: 0,
        sellCount: 0
      })
    },
    'limitExchange.buyPrice' (newVal) {
    },
    $isSymbolChanged_X (newVal) {
      switch (this.matchType) {
        case 'LIMIT':
          this.setRefValue(this.limitBuyCountInputRef)
          this.limitExchange.buyCount = 0
          this.setRefValue(this.limitSellCountInputRef)
          this.limitExchange.sellCount = 0
          break
        case 'MARKET':
          this.setRefValue(this.marketBuyAmountInputRef)
          this.marketExchange.sellCount = 0
          this.setRefValue(this.marketSellCountInputRef)
          this.marketExchange.buyAmount = 0
          break
      }
      // console.log(newVal)
      if (newVal) this.CHANGE_SYMBOL_CHANGED_STATUS(false)
    },
    language () {
      this.errorMsg.limit.buy.price = ''
      this.errorMsg.limit.buy.amount = ''
      this.errorMsg.limit.sell.price = ''
      this.errorMsg.limit.sell.amount = ''
      this.errorMsg.market.buy.amount = ''
      this.errorMsg.market.sell.amount = ''
      this.clearFormData()
    },
    isShowPayPassword (newVal) {
      if (newVal) {
        this.payPassword = ''
        this.clearPasswordErrorMsg()
      }
    },
    async refreshEntrustStatus (newVal) {
      if (newVal) await this.getUserAssetOfActiveSymbol()
    },
    activeConvertCurrencyObj () {
      this.setBuyAndSellPrice(this.getRefValue(this.limitBuyPriceInputRef), this.getRefValue(this.limitSellPriceInputRef))
    },
    activeSymbol () {
      this.reflashCount = 0
    },
    // 用户手动设置价格
    activePriceItem (newVal) {
      if (newVal) this.setBuyAndSellPrice(newVal)
    },
    async middleTopData (newVal) {
      // console.log(newVal)
      let targetPriceOfBuy = newVal.buy || newVal.kai
      let targetPriceOfSell = newVal.sell || newVal.kai
      // 首次打开设置价格
      if (!this.reflashCount) {
        // console.log(newVal.last)
        if (newVal.last) this.reflashCount++
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
    height: 390px;
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
        padding: 22px 14px;

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

            > .right {
              text-align: right;
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

                &.error {
                  border-color: $upColor !important;
                }
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

    > .warning {
      .dialog-warning {
        width: 90px;
        height: 90px;
        padding-top: 6px;
        margin: 0 auto;
        border-radius: 50%;
        background: rgba(42, 122, 211, .2);

        .dialog-warning-box {
          width: 78px;
          height: 78px;
          margin: 0 auto;
          border-radius: 50%;
          line-height: 75px;
          text-align: center;
          background: linear-gradient(90deg, #2b396e, #2a5082);
        }
      }

      .warning-text {
        color: #fff;
      }

      .button-color {
        width: 80px;
        height: 35px;
        margin-right: 15px;
        border: 0;
        line-height: 0;
      }

      .btn {
        width: 80px;
        height: 35px;
        line-height: 0;
      }
    }

    /deep/ {
      .warning {
        .el-dialog {
          width: 350px;
          border-radius: 5px;
        }

        .el-dialog__footer {
          margin-top: 5px;
        }
      }

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
        padding: 25px 27px 0;
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
        padding: 0 27px 40px;
        text-align: left;

        .forget-password {
          display: inline-block;
          font-size: 12px;
          color: $mainColor;
          cursor: pointer;
        }
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

      .warning {
        .button-color {
          color: rgba(255, 255, 255, .7);
          background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
        }

        .btn {
          border: 1px solid #338ff5;
          color: #fff;
          background-color: transparent;
        }
      }

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

        .el-tabs__item {
          font-size: 14px;
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

      .warning {
        .warning-text {
          color: #333;
        }

        .button-color {
          color: rgba(255, 255, 255, .7);
          background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
        }

        .btn {
          border: 1px solid #338ff5;
          color: #333;
          background-color: transparent;
        }
      }

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
