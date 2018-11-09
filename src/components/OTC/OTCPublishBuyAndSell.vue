<template>
  <div
    class="otc-publish-buy-and-sell-box otc"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <!-- 挂单：商家和普通用户都可以用 -->
    <!-- 2.0发布购买和出售 -->
    <div
      class="publish-buy-and-sell-content"
      v-loading.fullscreen.lock="fullscreenLoading"
      element-loading-background="rgba(0, 0, 0, 0.6)"
    >
      <!-- 发布订单内容部分分为左右两个部分 -->
      <div class="publish-content">
        <!-- 左边部分:发布订单买卖部分 -->
        <div class="publish-content-left">
          <!-- 购买和出售切换 -->
          <div class="publish-button">
            <button
              class="sell-button common-style"
              @click="toggleBuySellButton(1)"
              :class="{ green: publishStyle === 'sell' }"
            >
              <!-- 出售 -->
              {{$t('M.comm_offering')}}
            </button>
            <button
              class="buy-button common-style"
              @click="toggleBuySellButton(2)"
              :class="{ red: publishStyle === 'buy' }"
            >
              <!-- 购买 -->
              {{$t('M.comm_buying')}}
            </button>
          </div>
          <!-- 发布购买和出售大表单 -->
          <div class="buy-sell-submit-form">
            <el-form
              :label-position="labelPosition"
              label-width="80px"
            >
              <!-- 选择币种类型 -->
              <el-form-item
                :label="$t('M.otc_choice_currency') + $t('M.otc_cancelOrder_type')"
              >
                <el-select
                  :placeholder="$t('M.comm_please') + $t('M.otc_choice_currency') + $t('M.otc_cancelOrder_type')"
                  :no-data-text="$t('M.comm_no_data')"
                  v-model="coinId"
                  @change="changeCoinId"
                >
                  <el-option
                    v-for="(item,index) in coinStyleList"
                    :key="index"
                    :value="item.coinId"
                    :label="item.name"
                  >
                    {{ item.name }}
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- 2.0法币类型 -->
              <el-form-item
                :label="$t('M.otc_index_chouseType')"
              >
                <el-select
                  :placeholder="$t('M.otc_index_chouseType')"
                  :no-data-text="$t('M.comm_no_data')"
                  v-model="hopePaymentCoinId"
                  @change="changehopePaymentCoinId"
                >
                  <el-option
                    v-for="(item,index) in hopePaymentCoinStyleList"
                    :key="index"
                    :value="item.id"
                    :label="language === 'zh_CN'? item.name : item.shortName"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- 3.0你想出售或者购买 -->
              <el-form-item>
                <div class="want-buy-sell-sum">
                  {{$t('M.otc_index_youWant')}}
                  <span v-show="publishStyle === 'sell'">
                    {{$t('M.comm_offering')}}
                  </span>
                  <span v-show="publishStyle === 'buy'">
                    {{$t('M.comm_buying')}}
                  </span>
                  {{$t('M.otc_index_how')}}
                </div>
                <!-- 当前可用和市价 -->
                <div class="want-buy-sell-sum-content">
                  <!-- 当前可用 -->
                  <span
                    class="want-text"
                    v-show="publishStyle === 'sell'"
                  >
                    {{$t('M.otc_index_nowUse')}}：
                  </span>
                  <span
                    class="max-sum"
                    v-show="publishStyle === 'sell'"
                    :class="{ sellGreen: publishStyle === 'sell' }"
                  >
                    {{currentlyAvailable ? currentlyAvailable : '--'}}{{coinName}}
                  </span>
                  <!-- 市价 -->
                  <span class="want-text">
                    {{$t('M.otc_market_price')}}：
                  </span>
                  <span
                    class="market-price buyOrange"
                  >
                    {{marketPrice ? marketPrice : '--'}}{{CurrencyCoinsName}}
                  </span>
                  <el-button
                    type="primary"
                    size="mini"
                    v-show="publishStyle === 'sell'"
                    @click="chargeMoney"
                  >
                    <!-- 充币 -->
                    {{$t('M.comm_charge_money')}}
                  </el-button>
                </div>
                <!-- 卖出量和单价  买入量和单价 -->
                <div class="sell-buy-input">
                  <!-- 卖出量 -->
                  <input
                    type="text"
                    :placeholder="$t('M.otc_index_sellOutMount')"
                    class="sell-sum"
                    :class="{ redBorderRightNone: entrustCountErrorTipsBorder }"
                    v-show="publishStyle === 'sell'"
                    ref="entrustCountSell"
                    @keyup="changeInputValue('entrustCountSell', pointLength)"
                    @input="changeInputValue('entrustCountSell', pointLength)"
                    @focus="countInputFocus"
                  >
                  <!-- 买入量 -->
                  <input
                    type="text"
                    :placeholder="$t('M.otc_index_buyOutMount')"
                    class="sell-sum"
                    :class="{ redBorderRightNone: entrustCountErrorTipsBorder }"
                    v-show="publishStyle === 'buy'"
                    ref="entrustCountBuy"
                    @keyup="changeInputValue('entrustCountBuy', pointLength)"
                    @input="changeInputValue('entrustCountBuy', pointLength)"
                    @focus="countInputFocus"
                  >
                  <span
                    class="unit"
                    :class="{ redBorderLeftNone: entrustCountBuySellErrorTipsBorder }"
                  >
                    {{coinName}}
                  </span>
                  <!-- 卖出单价 -->
                  <input
                    type="text"
                    :placeholder="$t('M.comm_sell')+$t('M.otc_index_UnitPrice')"
                    class="sell-sum"
                    :class="{ redBorderRightNone: priceErrorTipsBorder }"
                    v-show="publishStyle === 'sell'"
                    ref="priceSell"
                    @keyup="changeInputValue('priceSell', moneyPointLength)"
                    @input="changeInputValue('priceSell', moneyPointLength)"
                  >
                  <!-- 买入单价 -->
                  <input
                    type="text"
                    :placeholder="$t('M.comm_buy')+$t('M.otc_index_UnitPrice')"
                    class="sell-sum"
                    :class="{ redBorderRightNone: priceErrorTipsBorder }"
                    v-show="publishStyle === 'buy'"
                    ref="priceBuy"
                    @keyup="changeInputValue('priceBuy', moneyPointLength)"
                    @input="changeInputValue('priceBuy', moneyPointLength)"
                  >
                  <span
                    class="unit"
                    :class="{ redBorderLeftNone: priceBuySellErrorTipsBorder }"
                  >
                    {{CurrencyCoinsName}}
                  </span>
                </div>
                <!-- 错误提示信息 -->
                <div class="buySellSumErrorTips">
                  <!-- 卖出量和买入量的提示 -->
                  <span class="errorSell">{{errorTipsSum}}</span>
                  <!-- 卖出单价和买入单价的提示 -->
                  <!-- <span class="errorBuy">{{errorTipsPrice}}{{minPrice}}-{{maxPrice}}</span> -->
                  <span class="errorBuy">{{errorTipsPrice}}</span>
                </div>
              </el-form-item>
              <!-- 4.0单笔成交限额 -->
              <el-form-item
                :label="$t('M.otc_index_singleTradeLimit')"
              >
                <div class="volume-business">
                  <!-- 单笔最小限额 -->
                  <input
                    type="text"
                    :placeholder="$t('M.otc_publishAD_minlimitMoney') + this.backReturnCurrentMinCount"
                    class="sell-sum"
                    :class="{ redBorderRightNone: minCountErrorTipsBorder }"
                    ref="minCount"
                    @keyup="changeInputValue('minCount', moneyPointLength)"
                    @input="changeInputValue('minCount', moneyPointLength)"
                  >
                  <span
                    class="monad"
                    :class="{ redBorderLeftNone: minCountErrorTipsBorder }"
                  >
                    {{CurrencyCoinsName}}
                  </span>
                  <span class="range-line">—</span>
                  <!-- 单笔最大限额 -->
                  <input
                    type="text"
                    :placeholder="$t('M.otc_publishAD_maxlimitMoney') + this.backReturnCurrentMaxCount"
                    class="sell-sum max-sell-sum"
                    :class="{ redBorderRightNone: maxCountErrorTipsBorder }"
                    ref="maxCount"
                    @keyup="changeInputValue('maxCount', moneyPointLength)"
                    @input="changeInputValue('maxCount', moneyPointLength)"
                  >
                  <span
                    class="monad"
                    :class="{ redBorderLeftNone: maxCountErrorTipsBorder }"
                  >
                    {{CurrencyCoinsName}}
                  </span>
                </div>
                <!-- 错误提示信息 -->
                <div class="limitErrorTips">
                  <!-- 单笔最小的提示 -->
                  <span
                    class="errorLimitMin"
                  >
                    {{errorTipsLimitMin}}
                  </span>
                  <!-- 单笔最大的提示 -->
                  <span
                    class="errorLimitMax"
                  >
                    {{errorTipsLimitMax}}
                  </span>
                </div>
              </el-form-item>
              <!-- 5.0备注 -->
              <el-form-item
                :label="$t('M.comm_remark')"
              >
                <div class="remark">
                  <!-- '请说明有关于您交易的相关条款或者其它您想让对方获悉得信息，以便对方和您快速交易', -->
                  {{$t('M.otc_publishAD_liveMessage')}}
                </div>
                <!-- 请输入备注：最多20个字符 -->
                <el-input
                  type="textarea"
                  auto-complete="off"
                  :placeholder="$t('M.otc_index_inputTips')"
                  maxlength="20"
                  v-model="remarkText"
                >
                </el-input>
                <!-- 预计交易和手续费 -->
                <div class="predict">
                  <span class="predict-text">
                    <!-- 预计交易额： -->
                    {{$t('M.otc_expected_value')}}：
                  </span>
                  <!-- 卖 -->
                  <span
                    class="predict-sum"
                    v-if="this.publishStyle === 'sell'"
                  >
                    <!-- {{entrustCountSell * priceSell}} {{CurrencyCoinsName}} -->
                    {{traderSumSELL}} {{CurrencyCoinsName}}
                  </span>
                  <!-- 买 -->
                  <span
                    class="predict-sum"
                    v-if="this.publishStyle === 'buy'"
                  >
                    <!-- {{entrustCountBuy * priceBuy}} {{CurrencyCoinsName}} -->
                    {{traderSumBUY}} {{CurrencyCoinsName}}
                  </span>
                  <span class="predict-text">
                    <!-- 手续费： -->
                    {{$t('M.comm_service_charge')}}：
                  </span>
                  <!-- 卖 -->
                  <span
                    class="predict-sum"
                    v-if="this.publishStyle === 'sell'"
                  >
                    <!-- {{entrustCountSell * rate}} {{coinName}} -->
                    {{serviceChargeSELL}} {{coinName}}
                  </span>
                  <!-- 买 -->
                  <span
                    class="predict-sum"
                    v-if="this.publishStyle === 'buy'"
                  >
                    <!-- {{entrustCountBuy * rate}} {{coinName}} -->
                    {{serviceChargeBUY}} {{coinName}}
                  </span>
                  <span class="rate-text">
                    <!-- 费率 -->
                    ( {{$t('M.otc_index_rate')}}
                    <span class="rate">
                      {{rate * 100}}%
                    </span>
                    )
                  </span>
                </div>
              </el-form-item>
              <!-- 6.0发布出售和发布购买按钮 -->
              <div class="publish-submit">
                <button
                  class="publish-submit-button publish-submit-sell"
                  v-if="publishStyle === 'sell'"
                  @click.prevent="showPasswordDialog"
                >
                  <!-- 发布出售 -->
                  {{$t('M.otc_index_publish')}}{{$t('M.comm_offering')}}
                </button>
                <button
                  class="publish-submit-button publish-submit-buy"
                  v-if="publishStyle === 'buy'"
                  @click.prevent="showPasswordDialog"
                >
                  <!-- 发布购买 -->
                  {{$t('M.otc_index_publish')}}{{$t('M.comm_buying')}}
                </button>
              </div>
              <!-- 7.0输入交易密码弹窗 -->
              <div class="password-dialog">
                <!-- 交易密码 -->
                <el-dialog
                  :title="$t('M.comm_password')"
                  :visible.sync="dialogVisible"
                  top="25vh"
                  width="470"
                >
                  <!-- <div>请输入交易密码</div> -->
                  <div class="input">
                    <input
                      type="password"
                      class="password-input"
                      v-model="tradePassword"
                      @focus="tradePasswordFocus"
                    >
                  </div>
                  <div class="error-info">
                    <!-- 错误提示 -->
                    <div class="tips">{{errorPWd}}</div>
                  </div>
                  <span
                    slot="footer"
                    class="dialog-footer">
                      <el-button
                        type="primary"
                        @click="addOTCPutUpOrdersSubmitButton"
                      >
                        <!-- 提 交 -->
                        {{$t('M.comm_sub_time')}}
                      </el-button>
                  </span>
                </el-dialog>
              </div>
            </el-form>
          </div>
        </div>
        <!-- 右边部分:发布说明部分 -->
        <div class="publish-content-right">
          <div class="release-notes">
            <p class="release-title release-tips">
              <!-- 发布说明 -->
             {{$t('M.otc_publishAD_publishDis')}}：
            </p>
            <p class="release-tips">
              <!-- 1、发布买卖是免费的； -->
              1、{{$t('M.otc_index_publish')}}{{$t('M.otc_index_buyAndSellFree')}}；
            </p>
            <p class="release-tips">
              <!-- 2、您可以在设置中设置您的收款方式； -->
              {{$t('M.otc_index_pubTipsOne')}}
            </p>
            <p class="release-tips">
              <!-- 3、交易中请注意判断和防范有欺诈风险的付款方式； -->
              {{$t('M.otc_index_pubTipsTwo')}}
            </p>
            <p class="release-tips">
              <!-- 4、请避免线下私自交易，FUBT.top无法为您预防风险 -->
              {{$t('M.otc_index_pubTipsThree')}}{{configInfo.otcAd}}{{$t('M.otc_index_pubTipsFour')}}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {addOTCPutUpOrders, getOTCCoinInfo} from '../../utils/api/OTC'
import FooterCommon from '../Common/FooterCommon'
import {returnAjaxMessage} from '../../utils/commonFunc'
import {createNamespacedHelpers, mapState} from 'vuex'
import {timeFilter, formatNumberInput, amendPrecision, cutOutPointLength} from '../../utils'
const {mapMutations} = createNamespacedHelpers('OTC')
export default {
  components: {
    FooterCommon //  底部
  },
  data () {
    return {
      fullscreenLoading: true, // 整页loading
      serviceChargeSELL: 0, // 手续费：卖
      traderSumSELL: 0, // 交易额：卖
      serviceChargeBUY: 0, // 手续费：买
      traderSumBUY: 0, // 交易额 :买
      dialogVisible: false, // 交易密码弹窗状态
      publishStyle: '', // 1购买和出售选中类型：挂单类型
      labelPosition: 'top', // 表单label放置的位置
      coinStyleList: [], // 可用币种类型列表
      coinId: '', // 选中的币种类型：挂单币种id
      coinName: '', // 选中的币种名称：挂单币种name
      hopePaymentCoinStyleList: [], // 选择你希望付款的货币类型列表：可用法币类型
      hopePaymentCoinId: '', // 选中的希望付款的货币类型:法币id
      CurrencyCoinsName: '', // 选中的可用法币币种名称：法币名称
      // 3挂单数量
      entrustCountSell: '',
      entrustCountBuy: '',
      // 4单价
      priceSell: '',
      priceBuy: '',
      // 后台返回的最低价
      minPrice: '',
      // 后台返回的最高价
      maxPrice: '',
      // 5用户input框输入的单笔最小限额（CNY）
      minCount: '',
      // 6用户input框输入的单笔最大限额（CNY）
      maxCount: '',
      // 后台根据币种返回的当前币种的单笔最小限额
      backReturnCurrentMinCount: '',
      // 后台根据币种返回的当前币种的单笔最大限额
      backReturnCurrentMaxCount: '',
      // 7备注
      remarkText: '',
      // 8交易密码
      tradePassword: '',
      // 当前可用
      currentlyAvailable: '',
      // 市价
      marketPrice: '',
      // 市价币种名称
      currencyName: '',
      // 预计交易额
      tradingVolumes: '',
      // 手续费
      serviceCharge: '',
      // 费率
      rate: '',
      // 卖出量和买入量的提示
      errorTipsSum: '',
      // 卖出单价和买入单价的提示
      errorTipsPrice: '',
      // 单笔成交限额最小错误提示
      errorTipsLimitMin: '',
      // 单笔成交限额最大错误提示
      errorTipsLimitMax: '',
      // 交易密码错误提示
      errorPWd: '',
      pointLength: 4, // 当前币种返回的保留小数点位数限制
      moneyPointLength: 2, // 当前金额小数点限制位数
      entrustCountErrorTipsBorder: false, // 买入量卖出量错误提示框
      entrustCountBuySellErrorTipsBorder: false, // 买入量卖出量单位错误提示框
      priceErrorTipsBorder: false, // 买入单价卖出单价错误提示框
      priceBuySellErrorTipsBorder: false, // 买入单价卖出单价单位错误提示框
      minCountErrorTipsBorder: false, // 单笔最小限额错误提示框
      maxCountErrorTipsBorder: false // 单笔最大限额错误提示框
    }
  },
  created () {
    require('../../../static/css/list/OTC/OTCPublishBuyAndSell.css')
    require('../../../static/css/theme/day/OTC/OTCPublishBuyAndSellDay.css')
    require('../../../static/css/theme/night/OTC/OTCPublishBuyAndSellNight.css')
    // 获取URL中买卖类型和可用币种id和可用法币id
    // console.log(this.$route.params)
    // console.log(this.$route.params.styleID) // 买卖类型
    // console.log(this.$route.params.partnerCoinId) // 可用币种id
    // console.log(this.$route.params.currencyID) // 法币id
    // 买卖类型
    if (this.$route.params.styleID === 'onlineBuy') {
      this.publishStyle = 'buy'
    }
    if (this.$route.params.styleID === 'onlineSell') {
      this.publishStyle = 'sell'
    }
    // 可用币种id
    this.coinId = this.$route.params.partnerCoinId
    // 可用法币
    this.hopePaymentCoinId = this.$route.params.currencyID
    // 刚进页面就调此方法请求币种详情来渲染页面
    this.getOTCCoinInfo()
  },
  mounted () {
  },
  activited () {
  },
  update () {
  },
  beforeRouteUpdate () {
  },
  methods: {
    ...mapMutations([
    ]),
    // 1.0 币种详情 : 商家和普通用户挂单页面请求币种详情渲染页面
    async getOTCCoinInfo () {
      this.fullscreenLoading = true
      const data = await getOTCCoinInfo({
        currencyId: this.hopePaymentCoinId, // 法币id
        coinId: this.coinId // 交易币种id
      })
      console.log('币种详情')
      console.log(data)
      // 提示信息
      if (!(returnAjaxMessage(data, this, 0))) {
        this.fullscreenLoading = false
        return false
      } else {
        // 返回数据正确的逻辑
        this.fullscreenLoading = false
        let detailsData = data.data.data
        // 1.0 可用币种列表
        this.coinStyleList = detailsData.coinlist
        this.coinStyleList.forEach(item => {
          if (this.coinId === item.coinId) {
            this.coinName = item.name
          }
        })
        // 2.0 法币种列表
        this.hopePaymentCoinStyleList = detailsData.currencyList
        this.hopePaymentCoinStyleList.forEach(item => {
          if (this.hopePaymentCoinId === item.id) {
            this.CurrencyCoinsName = item.shortName
          }
        })
        // 当前可用total
        this.currentlyAvailable = detailsData.otcCoinQryResponse.total
        // 市价marketPrice
        this.marketPrice = detailsData.otcCoinQryResponse.marketPrice
        // 币种 最大 交易限额maxCount
        // this.$refs.maxCount.value = detailsData.otcCoinQryResponse.maxCount
        this.backReturnCurrentMaxCount = detailsData.otcCoinQryResponse.maxCount
        this.$refs.maxCount.value = this.backReturnCurrentMaxCount
        // 币种 最小 交易限额minCount
        // this.$refs.minCount.value = detailsData.otcCoinQryResponse.minCount
        this.backReturnCurrentMinCount = detailsData.otcCoinQryResponse.minCount
        this.$refs.minCount.value = this.backReturnCurrentMinCount
        // 交易数量最小小数位
        this.pointLength = detailsData.otcCoinQryResponse.unit
        // 币种最高价格
        this.maxPrice = detailsData.otcCoinQryResponse.maxPrice
        // 币种最低价格
        this.minPrice = detailsData.otcCoinQryResponse.minPrice
        // 费率
        if (this.publishStyle === 'sell') {
          this.rate = detailsData.otcCoinQryResponse.sellRate
        }
        if (this.publishStyle === 'buy') {
          this.rate = detailsData.otcCoinQryResponse.buyRate
        }
      }
    },
    // 2.0 改变可用币种类型
    changeCoinId (e) {
      // console.log(e)
      this.coinId = e
      console.log(this.coinId)
      // this.clearErrInfo() // 清空错误信息
      this.clearInputData()
      // 币种详情
      this.getOTCCoinInfo()
    },
    // 3.0 改变你希望付款的货币类型：可用法币类型
    changehopePaymentCoinId (e) {
      // console.log(e)
      this.hopePaymentCoinId = e
      console.log(this.hopePaymentCoinId)
      // this.clearErrInfo() // 清空错误信息
      this.clearInputData()
      // 币种详情
      this.getOTCCoinInfo()
    },
    // 4.0 输入限制
    formatInput (ref, pointLength) {
      let target = this.$refs[ref]
      formatNumberInput(target, pointLength)
    },
    // 5.0 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'date')
    },
    //  6.0 点击 购买 和 出售 按钮切换
    toggleBuySellButton (index) {
      if (index === 1) {
        this.publishStyle = 'sell'
        console.log(this.publishStyle)
      }
      if (index === 2) {
        this.publishStyle = 'buy'
        console.log(this.publishStyle)
      }
      // 清空表单数据
      this.clearInputData()
      this.getOTCCoinInfo()
    },
    //  7.0 清空input框数据
    clearInputData () {
      this.$refs.entrustCountSell.value = ''
      this.$refs.entrustCountBuy.value = ''
      this.$refs.priceSell.value = ''
      this.priceSell = ''
      this.$refs.priceBuy.value = ''
      this.priceBuy = ''
      this.$refs.minCount.value = ''
      this.$refs.maxCount.value = ''
      this.remarkText = ''
      this.tradePassword = ''
      this.errorPWd = ''
      this.entrustCountSell = 0
      this.entrustCountBuy = 0
      this.serviceChargeSELL = 0
      this.traderSumSELL = 0
      this.serviceChargeBUY = 0
      this.traderSumBUY = 0
      this.errorTipsSum = ''
      this.entrustCountErrorTipsBorder = false
      this.entrustCountBuySellErrorTipsBorder = false
      this.errorTipsPrice = ''
      this.priceErrorTipsBorder = false
      this.priceBuySellErrorTipsBorder = false
      this.errorTipsLimitMin = ''
      this.minCountErrorTipsBorder = false
      this.errorTipsLimitMax = ''
      this.maxCountErrorTipsBorder = false
    },
    // 清空错误信息
    clearErrInfo () {
      this.errorTipsSum = ''
      this.entrustCountErrorTipsBorder = false
      this.entrustCountBuySellErrorTipsBorder = false
      this.errorTipsPrice = ''
      this.priceErrorTipsBorder = false
      this.priceBuySellErrorTipsBorder = false
      this.errorTipsLimitMin = ''
      this.minCountErrorTipsBorder = false
      this.errorTipsLimitMax = ''
      this.maxCountErrorTipsBorder = false
    },
    // 卖出量和买入量input 获得焦点
    countInputFocus () {
      this.errorTipsSum = ''
      this.entrustCountErrorTipsBorder = false
      this.entrustCountBuySellErrorTipsBorder = false
    },
    //  8.0 修改input value
    changeInputValue (ref, pointLength) {
      this[ref] = this.$refs[ref].value
      // console.dir(this.$refs[ref])
      // console.log(this[ref])
      // this.entrustCountSell = this.$refs.entrustCountSell.value
      // console.log(this.entrustCountSell)
      // 精度丢失问题修复
      // 类型：卖
      // 手续费
      // this.serviceChargeSELL = parseFloat(amendPrecision(this.$refs.entrustCountSell.value, this.rate, '*').toFixed(this.pointLength))
      // 修复截取小数点后几位
      this.serviceChargeSELL = amendPrecision(this.$refs.entrustCountSell.value, this.rate, '*')
      this.serviceChargeSELL = cutOutPointLength(this.serviceChargeSELL, this.pointLength)
      // 交易额
      // this.traderSumSELL = amendPrecision(this.$refs.entrustCountSell.value, this.$refs.priceSell.value, '*').toFixed(2)
      // 修复截取小数点后几位
      this.traderSumSELL = amendPrecision(this.$refs.entrustCountSell.value, this.$refs.priceSell.value, '*')
      this.traderSumSELL = cutOutPointLength(this.traderSumSELL, 2)
      // 类型：买
      // 手续费
      // this.serviceChargeBUY = parseFloat(amendPrecision(this.$refs.entrustCountBuy.value, this.rate, '*').toFixed(this.pointLength))
      // 修复截取小数点后几位
      this.serviceChargeBUY = amendPrecision(this.$refs.entrustCountBuy.value, this.rate, '*')
      this.serviceChargeBUY = cutOutPointLength(this.serviceChargeBUY, this.pointLength)
      // 交易额
      // this.traderSumBUY = amendPrecision(this.$refs.entrustCountBuy.value, this.$refs.priceBuy.value, '*').toFixed(2)
      // 修复截取小数点后几位
      this.traderSumBUY = amendPrecision(this.$refs.entrustCountBuy.value, this.$refs.priceBuy.value, '*')
      this.traderSumBUY = cutOutPointLength(this.traderSumBUY, 2)
      let target = this.$refs[ref]
      // 限制输入数字和位数
      formatNumberInput(target, pointLength)
      // 开始input框验证
      // 买入量和卖出量的验证
      if (this.$refs.entrustCountSell.value) {
        this.errorTipsSum = ''
        this.entrustCountErrorTipsBorder = false
        this.entrustCountBuySellErrorTipsBorder = false
      }
      if (this.$refs.entrustCountBuy.value) {
        this.errorTipsSum = ''
        this.entrustCountErrorTipsBorder = false
        this.entrustCountBuySellErrorTipsBorder = false
      }
      // 输入的数量能大于最大可卖出量校验
      if (this.publishStyle == 'sell') {
        if (this.$refs.entrustCountSell.value > this.currentlyAvailable) {
          // this.errorTipsSum = '当前可用 + 资产不足'
          this.errorTipsSum = this.$t('M.otc_index_nowUse') + this.$t('M.user-fail-assetnotenough-error')
          this.entrustCountErrorTipsBorder = true
          this.entrustCountBuySellErrorTipsBorder = true
          return false
        }
      }
      // 卖出单价、买入单价价格区间控制
      if (this.$refs.priceSell.value) {
        if (this.$refs.priceSell.value < this.minPrice || this.$refs.priceSell.value > this.maxPrice) {
        //  请输入.....之间的价格
          this.errorTipsPrice = this.$t('M.otc_publishAD_pleaseInput') + this.minPrice + '~' + this.maxPrice
          this.priceErrorTipsBorder = true
          this.priceBuySellErrorTipsBorder = true
        } else {
          this.errorTipsPrice = ''
          this.priceErrorTipsBorder = false
          this.priceBuySellErrorTipsBorder = false
        }
      }
      if (this.$refs.priceBuy.value) {
        if (this.$refs.priceBuy.value < this.minPrice || this.$refs.priceBuy.value > this.maxPrice) {
          this.errorTipsPrice = this.$t('M.otc_publishAD_pleaseInput') + this.minPrice + '~' + this.maxPrice
          this.priceErrorTipsBorder = true
          this.priceBuySellErrorTipsBorder = true
        } else {
          this.errorTipsPrice = ''
          this.priceErrorTipsBorder = false
          this.priceBuySellErrorTipsBorder = false
        }
      }
      // 单笔成交限额验证
      // 最小
      if (this.$refs.minCount.value < this.backReturnCurrentMinCount) {
        // 输入值不能小于最小限额
        this.errorTipsLimitMin = this.$t('M.otc_publishAD_inputminLimit')
        this.minCountErrorTipsBorder = true
        return false
      } else {
        this.errorTipsLimitMin = ''
        this.minCountErrorTipsBorder = false
      }
      if (this.$refs.minCount.value > this.$refs.maxCount.value - 0) {
        // 输入值不能大于最大限额
        this.errorTipsLimitMin = this.$t('M.otc_publishAD_inputmaxLimit')
        this.minCountErrorTipsBorder = true
        return false
      } else {
        this.errorTipsLimitMin = ''
        this.minCountErrorTipsBorder = false
      }
      if (this.$refs.minCount.value < this.$refs.maxCount.value - 0) {
        this.errorTipsLimitMax = ''
        this.maxCountErrorTipsBorder = false
      }
      // 最大
      if (this.$refs.maxCount.value > this.backReturnCurrentMaxCount) {
        // 输入值不能大于最大限额
        this.errorTipsLimitMax = this.$t('M.otc_publishAD_inputmaxLimit')
        this.maxCountErrorTipsBorder = true
        return false
      } else {
        this.errorTipsLimitMax = ''
        this.maxCountErrorTipsBorder = false
      }
      if (this.$refs.maxCount.value < this.$refs.minCount.value - 0) {
        // 输入值不能小于最小限额
        this.errorTipsLimitMax = this.$t('M.otc_publishAD_inputminLimit')
        this.maxCountErrorTipsBorder = true
        return false
      } else {
        this.errorTipsLimitMax = ''
        this.maxCountErrorTipsBorder = false
      }
      if (this.$refs.maxCount.value > this.$refs.minCount.value - 0) {
        this.errorTipsLimitMin = ''
        this.minCountErrorTipsBorder = false
      }
    },
    //  8.0 点击发布出售或者发布购买弹出输入交易密码框
    showPasswordDialog () {
      if (this.publishStyle === 'buy') {
        if (!this.entrustCountBuy) {
          // 请输入买入数量
          this.errorTipsSum = this.$t('M.otc_index_inputBuyMount')
          this.entrustCountBuySellErrorTipsBorder = true
          this.entrustCountErrorTipsBorder = true
          return false
        }
        if (!this.priceBuy) {
          // 请输入买入单价
          this.errorTipsPrice = this.$t('M.otc_index_inputBuyPrice')
          this.priceErrorTipsBorder = true
          this.priceBuySellErrorTipsBorder = true
          return false
        }
      }
      if (this.publishStyle === 'sell') {
        if (!this.entrustCountSell) {
          // 请输入卖出数量
          this.errorTipsSum = this.$t('M.otc_index_inputSellMount')
          this.entrustCountErrorTipsBorder = true
          this.entrustCountBuySellErrorTipsBorder = true
          return false
        }
        if (this.errorTipsSum) {
          return false
        }
        if (!this.priceSell) {
          // 请输入卖出单价
          this.errorTipsPrice = this.$t('M.otc_index_inputSellPrice')
          this.priceErrorTipsBorder = true
          this.priceBuySellErrorTipsBorder = true
          return false
        }
      }
      // 如果单价错误提示有的话不能进行提交操作
      if (this.errorTipsPrice) {
        return false
      }
      // 单笔最小最大限制
      if (this.errorTipsLimitMin) {
        return false
      }
      if (this.errorTipsLimitMax) {
        return false
      }
      this.dialogVisible = true
    },
    // 交易密码框获得焦点清空错误提示信息
    tradePasswordFocus () {
      this.errorPWd = ''
    },
    // 9.0 点击输入密码框中的提交按钮
    async addOTCPutUpOrdersSubmitButton () {
      if (!this.tradePassword) {
        // 请输入交易密码
        this.errorPWd = this.$t('M.comm_please_enter') + this.$t('M.comm_password')
        return false
      }
      let param = {
        // partnerCoinId: this.coinId, // 商户币种id
        coinId: this.coinId, // 可用币种id
        currencyId: this.hopePaymentCoinId, // 法币id
        minCount: this.$refs.minCount.value, // 单笔最小限额（CNY）
        maxCount: this.$refs.maxCount.value, // 单笔最大限额（CNY）
        remark: this.remarkText, // 备注
        tradePassword: this.tradePassword // 交易密码
      }
      if (this.publishStyle === 'buy') {
        param.entrustType = 'BUY' // 挂单类型（BUY SELL）
        param.entrustCount = this.entrustCountBuy // 挂单数量
        param.price = this.priceBuy // 单价
      }
      if (this.publishStyle === 'sell') {
        param.entrustType = 'SELL' // 挂单类型（BUY SELL）
        param.entrustCount = this.entrustCountSell // 挂单数量
        param.price = this.priceSell // 单价
      }
      this.fullscreenLoading = true
      const data = await addOTCPutUpOrders(param)
      console.log(data)
      // 提示信息
      if (!(returnAjaxMessage(data, this, 1))) {
        this.fullscreenLoading = false
        return false
      } else {
        // 返回数据正确的逻辑
        this.fullscreenLoading = false
        // 关闭交易密码框
        this.dialogVisible = false
        // 清空表单数据
        this.clearInputData()
        // 重新渲染页面
        this.getOTCCoinInfo()
      }
    },
    // 10.0 充币按钮跳转
    chargeMoney () {
      this.$store.commit('personal/CHANGE_USER_CENTER_ACTIVE_NAME', 'assets')
      this.$router.push({path: '/PersonalCenter'})
    }
  },
  filter: {},
  computed: {
    ...mapState({
      configInfo: state => state.common.footerInfo.configInfo,
      theme: state => state.common.theme,
      // 当前选中语言
      language: state => state.common.language
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../../static/css/scss/index";
  .otc-publish-buy-and-sell-box {
    overflow: hidden;
    .redBorderRightNone{
      border: 1px solid #D45858 !important;
      border-right: 0 !important;
    }
    .redBorderLeftNone{
      border: 1px solid #D45858 !important;
      border-left: 0 !important;
    }
    > .publish-buy-and-sell-content {
      width: 1150px;
      margin: 0 auto;
      padding: 90px 0 50px;
      > .publish-content {
        display: flex;
        flex: 3;
        > .publish-content-left {
          flex: 2;
          > .publish-button {
            > .common-style {
              // color: #8494A6;
              width: 70px;
              height: 36px;
              display: inline-block;
              // border: 1px solid #47525C;
              cursor: pointer;
            }
            > .sell-button {
              margin-right: -4px;
              border-right: 0;
              border-top-left-radius: 4px;
              border-bottom-left-radius: 4px;
            }
            > .buy-button {
              border-left: 0;
              border-top-right-radius: 4px;
              border-bottom-right-radius: 4px;
            }
            > .green {
              // background-color: #008069;
              // color: #FFFEFE;
              // border: 1px solid #008069;
            }
            > .red {
              // background-color: #D45858;
              // color: #FFFEFE;
              // border: 1px solid #D45858;
            }
          }
          > .buy-sell-submit-form {
            margin-top: 20px;
            .want-buy-sell-sum {
              // color: #338FF5;
              font-size: 20px;
              padding-top: 20px;
            }
            .want-buy-sell-sum-content {
              .sellGreen {
                // color: #30C296;
              }
              .buyOrange {
                // color: #E97345;
              }
              > .want-text {
                // color: #9DA5B3;
                font-size: 12px;
              }
              > .max-sum {
                font-size: 12px;
                margin-right: 20px;
              }
              > .want-text {
                // color: #9DA5B3;
                font-size: 12px;
              }
              > .market-price {
                font-size: 12px;
                margin-right: 20px;
              }
            }
            .sell-buy-input {
              padding: 10px 0 0 0;
              > .sell-sum {
                width: 190px;
                height: 36px;
                // background-color: #333A41;
                padding-left: 10px;
                // color: #9DA5B3;
              }
              > .unit {
                width: 70px;
                height: 36px;
                // color: #338FF5;
                font-size: 16px;
                // background-color: #414951;
                display: inline-block;
                vertical-align: top;
                line-height: 36px;
                text-align: center;
                margin: 0 50px 0 -4px;
              }
            }
            .buySellSumErrorTips{
              >.errorSell{
                display: inline-block;
                width: 320px;
                font-size: 12px;
                // color: #D45858;
              }
              >.errorBuy{
                // color: #D45858;
              }
            }
            .volume-business {
              margin-bottom: 10px;
              > .sell-sum {
                width: 130px;
                height: 36px;
                // background-color: #333A41;
                padding-left: 10px;
                // color: #9DA5B3;
              }
              > .max-sell-sum {
                width: 180px;
              }
              > .monad {
                width: 50px;
                height: 36px;
                // background-color: #414951;
                display: inline-block;
                vertical-align: top;
                margin-left: -4px;
                line-height: 36px;
                text-align: center;
                // color: #338FF5;
                font-size: 12px;
              }
              > .range-line {
                // color: #7d90ac;
                margin: 0px 10px;
              }
            }
            .limitErrorTips{
              >.errorLimitMin,.errorLimitMax{
                display: inline-block;
                width: 212px;
                font-size: 12px;
                // color: #D45858;
              }
              >.errorLimitMax{
              }
            }
            .remark {
              // color: #9DA5B3;
              font-size: 12px;
              margin-top: -10px;
            }
            .predict {
              > .predict-text {
                // color: #9FA7B2;
                font-size: 12px;
              }
              > .predict-sum {
                // color: #30C296;
                font-size: 12px;
              }
              > .rate-text {
                // color: #9FA7B2;
                font-size: 12px;
                > .rate {
                  // color: #CA5040;
                  font-size: 12px;
                }
              }
            }
            .publish-submit {
              > .publish-submit-button {
                width: 589px;
                height: 42px;
                // color: #FFFFFF;
                font-size: 14px;
                border-radius: 4px;
                margin-top: 40px;
                cursor: pointer;
              }
              > .publish-submit-buy {
                // background-color: #D45858;
              }
              > .publish-submit-sell {
                // background-color: #008069;
              }
            }
            .password-dialog{
              .tips{
                // color: red;
              }
            }
          }
        }
        > .publish-content-right {
          flex: 1;
          > .release-notes {
            width: 216px;
            // color: #8C8E91;
            font-size: 12px;
            > .release-title {
              // color: #9FA7B2;
            }
            > .release-tips {
              line-height: 20px;
              font-size: 14px;
            }
          }
        }
      }
    }
    &.night{
      background-color: $mainNightBgColor;
      > .publish-buy-and-sell-content {
        > .publish-content {
          > .publish-content-left {
            > .publish-button {
              > .common-style {
                color: #8494A6;
                border: 1px solid #1C1F32;
              }
              > .sell-button {
              }
              > .buy-button {
              }
              > .green {
                background-color: #008069;
                color: #FFFEFE;
                border: 1px solid #008069;
              }
              > .red {
                background-color: #D45858;
                color: #FFFEFE;
                border: 1px solid #D45858;
              }
            }
            > .buy-sell-submit-form {
              .want-buy-sell-sum {
                color: #338FF5;
              }
              .want-buy-sell-sum-content {
                .sellGreen {
                  color: #30C296;
                }
                .buyOrange {
                  color: #E97345;
                }
                > .want-text {
                  color: #9DA5B3;
                }
                > .max-sum {
                }
                > .want-text {
                  color: #9DA5B3;
                }
                > .market-price {
                }
              }
              .sell-buy-input {
                > .sell-sum {
                  background-color: #1C1F32;
                  color: #9DA5B3;
                }
                > .unit {
                  color: #338FF5;
                  background-color: #21243B;
                }
              }
              .buySellSumErrorTips{
                >.errorSell{
                  color: #D45858;
                }
                >.errorBuy{
                  color: #D45858;
                }
              }
              .volume-business {
                > .sell-sum {
                  background-color: #1C1F32;
                  color: #9DA5B3;
                }
                > .max-sell-sum {
                }
                > .monad {
                  background-color: #21243B;
                  color: #338FF5;
                }
                > .range-line {
                  color: #7d90ac;
                }
              }
              .limitErrorTips{
                >.errorLimitMin,.errorLimitMax{
                  color: #D45858;
                }
                >.errorLimitMax{
                }
              }
              .remark {
                color: #9DA5B3;
              }
              .predict {
                > .predict-text {
                  color: #9FA7B2;
                }
                > .predict-sum {
                  color: #30C296;
                }
                > .rate-text {
                  color: #9FA7B2;
                  > .rate {
                    color: #CA5040;
                  }
                }
              }
              .publish-submit {
                > .publish-submit-button {
                  color: #FFFFFF;
                }
                > .publish-submit-buy {
                  background-color: #D45858;
                }
                > .publish-submit-sell {
                  background-color: #008069;
                }
              }
              .password-dialog{
                .tips{
                  color: red;
                }
              }
            }
          }
          > .publish-content-right {
            flex: 1;
            > .release-notes {
              color: #A9BED4;
              > .release-title {
                color: #fff;
              }
              > .release-tips {
              }
            }
          }
        }
      }
    }
    &.day{
      background-color: $mainDayBgColor;
      > .publish-buy-and-sell-content {
        > .publish-content {
          > .publish-content-left {
            > .publish-button {
              > .common-style {
                color: #8494A6;
                border: 1px solid #333333;
              }
              > .sell-button {
              }
              > .buy-button {
              }
              > .green {
                background-color: #008069;
                color: #FFFEFE;
                border: 1px solid #008069;
              }
              > .red {
                background-color: #D45858;
                color: #FFFEFE;
                border: 1px solid #D45858;
              }
            }
            > .buy-sell-submit-form {
              .want-buy-sell-sum {
                color: #338FF5;
              }
              .want-buy-sell-sum-content {
                .sellGreen {
                  color: #30C296;
                }
                .buyOrange {
                  color: #E97345;
                }
                > .want-text {
                  color: #9DA5B3;
                }
                > .max-sum {
                }
                > .want-text {
                  color: #9DA5B3;
                }
                > .market-price {
                }
              }
              .sell-buy-input {
                > .sell-sum {
                  background-color: #ffffff;
                  color: #9DA5B3;
                }
                > .unit {
                  color: #338FF5;
                  background-color: #CBDDF4;
                  border: 1px solid #CBDDF4;
                }
              }
              .buySellSumErrorTips{
                >.errorSell{
                  color: #D45858;
                }
                >.errorBuy{
                  color: #D45858;
                }
              }
              .volume-business {
                > .sell-sum {
                  background-color: #ffffff;
                  color: #9DA5B3;
                }
                > .max-sell-sum {
                }
                > .monad {
                  background-color: #CBDDF4;
                  color: #338FF5;
                  border: 1px solid #CBDDF4;
                }
                > .range-line {
                  color: #7d90ac;
                }
              }
              .limitErrorTips{
                >.errorLimitMin,.errorLimitMax{
                  color: #D45858;
                }
                >.errorLimitMax{
                }
              }
              .remark {
                color: #9DA5B3;
              }
              .predict {
                > .predict-text {
                  color: #9FA7B2;
                }
                > .predict-sum {
                  color: #30C296;
                }
                > .rate-text {
                  color: #9FA7B2;
                  > .rate {
                    color: #CA5040;
                  }
                }
              }
              .publish-submit {
                > .publish-submit-button {
                  color: #FFFFFF;
                }
                > .publish-submit-buy {
                  background-color: #D45858;
                }
                > .publish-submit-sell {
                  background-color: #008069;
                }
              }
              .password-dialog{
                .tips{
                  color: red;
                }
              }
            }
          }
          > .publish-content-right {
            flex: 1;
            > .release-notes {
              color: #7D90AC;
              > .release-title {
                color: #BB4C4C;
              }
              > .release-tips {
              }
            }
          }
        }
      }
    }
  }
</style>
