<template>
  <div
    class="otc-publish-buy-and-sell-box otc"
    :class="{'day':theme == 'day','night':theme == 'night' }"
    :style="{'min-height':(height-305)+'px'}"
  >
    <!-- 挂单：商家和普通用户都可以用 -->
    <div
      class="publish-buy-and-sell-content"
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
                :label="$t('M.otc_index_chooseType')"
              >
                <el-select
                  :placeholder="$t('M.otc_index_chooseType')"
                  :no-data-text="$t('M.comm_no_data')"
                  v-model="hopePaymentCoinId"
                  @change="changeHopePaymentCoinId"
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
                <div
                  class="want-buy-sell-sum"
                  v-show="publishStyle === 'sell'"
                >
                  {{$t('M.otc_index_youWant')}}{{$t('M.comm_offering')}}{{$t('M.otc_index_how')}}
                </div>
                <div
                  class="want-buy-sell-sum"
                  v-show="publishStyle === 'buy'"
                >
                  {{$t('M.otc_index_youWant')}}{{$t('M.comm_buying')}}{{$t('M.otc_index_how')}}
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
                    {{currentlyAvailable ? $scientificToNumber(currentlyAvailable) : '--'}}{{coinName}}
                  </span>
                  <!-- 市价 -->
                  <span class="want-text">
                    {{$t('M.otc_market_price')}}：
                  </span>
                  <span
                    class="market-price buyOrange"
                  >
                    {{marketPrice ? $scientificToNumber(marketPrice) : '--'}}{{CurrencyCoinsName}}
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
                    @blur="checkValue('entrustCountSell')"
                    @keyup="changeInputValue('entrustCountSell', pointLength)"
                    @input="changeInputValue('entrustCountSell', pointLength)"
                    @focus="countInputFocus"
                    onpaste="return false"
                  >
                  <!-- 买入量 -->
                  <input
                    type="text"
                    :placeholder="$t('M.otc_index_buyOutMount')"
                    class="sell-sum"
                    :class="{ redBorderRightNone: entrustCountErrorTipsBorder }"
                    v-show="publishStyle === 'buy'"
                    ref="entrustCountBuy"
                    @blur="checkValue('entrustCountBuy')"
                    @keyup="changeInputValue('entrustCountBuy', pointLength)"
                    @input="changeInputValue('entrustCountBuy', pointLength)"
                    @focus="countInputFocus"
                    onpaste="return false"
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
                    onpaste="return false"
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
                    onpaste="return false"
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
                    :placeholder="$t('M.otc_min') + this.backReturnCurrentMinCount"
                    class="sell-sum"
                    :class="{ redBorderRightNone: minCountErrorTipsBorder }"
                    ref="minCount"
                    @keyup="changeInputValueMin('minCount', moneyPointLength)"
                    @input="changeInputValueMin('minCount', moneyPointLength)"
                    onpaste="return false"
                    @blur="loseFocus(1)"
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
                    :placeholder="$t('M.otc_max') + this.backReturnCurrentMaxCount"
                    class="sell-sum max-sell-sum"
                    :class="{ redBorderRightNone: maxCountErrorTipsBorder }"
                    ref="maxCount"
                    @keyup="changeInputValueMax('maxCount', moneyPointLength)"
                    @input="changeInputValueMax('maxCount', moneyPointLength)"
                    onpaste="return false"
                    @blur="loseFocus(2)"
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
                <!-- 请输入备注：最多30个字符 -->
                <el-input
                  type="textarea"
                  auto-complete="off"
                  :placeholder="$t('M.otc_index_inputTips')"
                  maxlength="30"
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
                    v-show="this.publishStyle === 'sell'"
                  >
                    {{$scientificToNumber(traderSumSELL)}} {{CurrencyCoinsName}}
                  </span>
                  <!-- 买 -->
                  <span
                    class="predict-sum"
                    v-show="this.publishStyle === 'buy'"
                  >
                    {{$scientificToNumber(traderSumBUY)}} {{CurrencyCoinsName}}
                  </span>
                  <span class="predict-text">
                    <!-- 手续费： -->
                    {{$t('M.comm_service_charge')}}：
                  </span>
                  <!-- 卖 -->
                  <span
                    class="predict-sum"
                    v-show="this.publishStyle === 'sell'"
                  >
                    {{$scientificToNumber(serviceChargeSELL)}} {{coinName}}
                  </span>
                  <!-- 买 -->
                  <span
                    class="predict-sum"
                    v-show="this.publishStyle === 'buy'"
                  >
                    {{$scientificToNumber(serviceChargeBUY)}} {{coinName}}
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
                  :visible.sync="publishOrderTradePwdDialogStatus"
                  top="25vh"
                  width="470"
                >
                  <!-- 请输入交易密码 -->
                  <div class="input">
                    <input
                      type="password"
                      autocomplete="new-password"
                      class="password-input"
                      v-model="tradePassword"
                      @focus="tradePasswordFocus"
                      @keyup.enter="publishOTCEntryOrders"
                      onpaste="return false"
                    >
                  </div>
                  <div class="error-info">
                    <!-- 错误提示 -->
                    <div class="tips">{{errorPWd}}</div>
                  </div>
                  <!--暂时关闭交易密码验证-->
                  <div
                    class="close-pwd-tip font-size12 cursor-pointer"
                    @click.prevent="closePwdJump"
                  >
                    {{$t('M.user_payPassword_switch')}}
                  </div>
                  <span
                    slot="footer"
                    class="dialog-footer"
                  >
                      <el-button
                        type="primary"
                        @click="publishOTCEntryOrders"
                      >
                        <!-- 提 交 -->
                        {{$t('M.comm_sub_time')}}
                      </el-button>
                    <!--忘记交易密码？-->
                    <div
                      class="forget-pwd-tip font-size12 cursor-pointer"
                      @click.prevent="forgetPwdJump"
                    >
                      {{$t('M.user_payPassword')}}
                    </div>
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
import {
  addOTCPutUpOrders,
  getOTCCoinInfo
} from '../../utils/api/OTC'
import {
  // returnAjaxMsg,
  getNestedData,
  isNeedPayPasswordAjax
} from '../../utils/commonFunc'
import {
  timeFilter,
  formatNumberInput,
  amendPrecision,
  cutOutPointLength
} from '../../utils'
import {
  mapMutations,
  mapState,
  mapActions
} from 'vuex'
export default {
  components: {},
  data () {
    return {
      // 可视区内容的高度
      height: '',
      // 手续费：卖
      serviceChargeSELL: 0,
      // 交易额：卖
      traderSumSELL: 0,
      // 手续费：买
      serviceChargeBUY: 0,
      // 交易额 :买
      traderSumBUY: 0,
      // 交易密码弹窗状态
      publishOrderTradePwdDialogStatus: false,
      // 1购买和出售选中类型：挂单类型
      publishStyle: '',
      // 表单label放置的位置
      labelPosition: 'top',
      // 可用币种类型列表
      coinStyleList: [],
      // 选中的币种类型：挂单币种id
      coinId: '',
      // 选中的币种名称：挂单币种name
      coinName: '',
      // 选择你希望付款的货币类型列表：可用法币类型
      hopePaymentCoinStyleList: [],
      // 选中的希望付款的货币类型:法币id
      hopePaymentCoinId: '',
      // 选中的可用法币币种名称：法币名称
      CurrencyCoinsName: '',
      // 3挂单数量卖
      entrustCountSell: '',
      // 3挂单数量买
      entrustCountBuy: '',
      // 4单价卖
      priceSell: '',
      // 4单价买
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
      // 当前币种返回的保留小数点位数限制
      pointLength: 4,
      // 当前金额小数点限制位数
      moneyPointLength: 2,
      // 买入量卖出量错误提示框
      entrustCountErrorTipsBorder: false,
      // 买入量卖出量单位错误提示框
      entrustCountBuySellErrorTipsBorder: false,
      // 买入单价卖出单价错误提示框
      priceErrorTipsBorder: false,
      // 买入单价卖出单价单位错误提示框
      priceBuySellErrorTipsBorder: false,
      // 单笔最小限额错误提示框
      minCountErrorTipsBorder: false,
      // 单笔最大限额错误提示框
      maxCountErrorTipsBorder: false,
      // 参数法币id
      parameterCurrencyId: '',
      // 参数币种id
      parameterCoinId: '',
      // 是否需要交易密码
      isNeedPayPassword: true
    }
  },
  created () {
    // 获得可视区的高度
    this.height = document.documentElement.clientHeight
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
    this.parameterCoinId = this.$route.params.partnerCoinId
    // 可用法币
    this.parameterCurrencyId = this.$route.params.currencyID
    // 刚进页面就调此方法请求币种详情来渲染页面
    this.getOTCCoinInfo()
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      // 发布订单（商家和普通用户公用）后页面跳转到首页顶部状态
      'CHANGE_PUBLISH_ORDER_JUMP_TOP_STATUS',
      'CHANGE_USER_CENTER_ACTIVE_NAME',
      'CHANGE_PASSWORD_USEABLE',
      'CHANGE_AJAX_READY_STATUS', // 改变接口返回loading状态
      'CHANGE_REF_ACCOUNT_CREDITED_STATE'
    ]),
    ...mapActions([
      'REFRESH_USER_INFO_ACTION'
    ]),
    // 0.1 判断卖出量和买入量是否为零
    checkValue (name) {
      const value = this.$refs[name].value
      console.log(value)
      if (value == '0' && name == 'entrustCountSell') {
        // 提示信息 买入数量不能为0
        this.errorTipsSum = this.$t('M.otc_index_inputSellAccount')
      } else if (value == '0' && name == 'entrustCountBuy') {
        // 提示信息 卖出数量不能为0
        this.errorTipsSum = this.$t('M.otc_index_inputBuyAccount')
      }
    },
    // 1.0 币种详情 : 商家和普通用户挂单页面请求币种详情渲染页面
    async getOTCCoinInfo () {
      const data = await getOTCCoinInfo({
        currencyId: this.parameterCurrencyId, // 法币id
        coinId: this.parameterCoinId // 交易币种id
      })
      console.log('币种详情')
      console.log(data)
      if (!data) return false
      if (data.data) {
        // 可用币种id
        this.coinId = this.parameterCoinId
        // 可用法币
        this.hopePaymentCoinId = this.parameterCurrencyId
        // 返回数据正确的逻辑
        let detailsData = getNestedData(data, 'data')
        // 1.0 可用币种列表
        this.coinStyleList = getNestedData(detailsData, 'coinlist')
        this.coinStyleList.forEach(item => {
          if (this.coinId === item.coinId) {
            this.coinName = item.name
          }
        })
        // 2.0 法币种列表
        this.hopePaymentCoinStyleList = getNestedData(detailsData, 'currencyList')
        this.hopePaymentCoinStyleList.forEach(item => {
          if (this.hopePaymentCoinId === item.id) {
            this.CurrencyCoinsName = item.shortName
          }
        })
        // 当前可用total
        this.currentlyAvailable = getNestedData(detailsData, 'otcCoinQryResponse.total')
        // 市价marketPrice
        this.marketPrice = getNestedData(detailsData, 'otcCoinQryResponse.marketPrice')
        // 币种 最大 交易限额maxCount
        this.backReturnCurrentMaxCount = getNestedData(detailsData, 'otcCoinQryResponse.maxCount')
        // console.log(this.backReturnCurrentMaxCount)
        this.$refs.maxCount.value = this.backReturnCurrentMaxCount
        // console.log(this.$refs.maxCount.value)
        // 币种 最小 交易限额minCount
        this.backReturnCurrentMinCount = getNestedData(detailsData, 'otcCoinQryResponse.minCount')
        this.$refs.minCount.value = this.backReturnCurrentMinCount
        // 交易数量最小小数位
        this.pointLength = getNestedData(detailsData, 'otcCoinQryResponse.unit')
        // 币种最高价格
        this.maxPrice = getNestedData(detailsData, 'otcCoinQryResponse.maxPrice')
        // 币种最低价格
        this.minPrice = getNestedData(detailsData, 'otcCoinQryResponse.minPrice')
        // 费率
        if (this.publishStyle === 'sell') {
          this.rate = getNestedData(detailsData, 'otcCoinQryResponse.sellRate')
        }
        if (this.publishStyle === 'buy') {
          this.rate = getNestedData(detailsData, 'otcCoinQryResponse.buyRate')
        }
      }
    },
    // 2.0 改变可用币种类型
    changeCoinId (e) {
      this.parameterCoinId = e
      this.clearInputData()
      // 币种详情
      this.getOTCCoinInfo()
    },
    // 3.0 改变你希望付款的货币类型：可用法币类型
    changeHopePaymentCoinId (e) {
      this.parameterCurrencyId = e
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
    // 6.0 点击 购买 和 出售 按钮切换
    toggleBuySellButton (index) {
      switch (index) {
        case 1:
          this.publishStyle = 'sell'
          break
        case 2:
          this.publishStyle = 'buy'
          break
      }
      // 清空表单数据
      this.clearInputData()
      this.getOTCCoinInfo()
    },
    // 7.0 清空input框数据
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
    // 8.0 卖出量和买入量input 获得焦点
    countInputFocus () {
      this.errorTipsSum = ''
      this.entrustCountErrorTipsBorder = false
      this.entrustCountBuySellErrorTipsBorder = false
    },
    // 9.0 修改input value
    changeInputValue (ref, pointLength) {
      this[ref] = this.$refs[ref].value
      // console.dir(this.$refs[ref])
      // console.log(this[ref])
      // this.entrustCountSell = this.$refs.entrustCountSell.value
      // console.log(this.entrustCountSell)
      // 精度丢失问题修复
      // 类型：卖
      // 手续费
      // 修复截取小数点后几位
      this.serviceChargeSELL = amendPrecision(this.$refs.entrustCountSell.value, this.rate, '*')
      this.serviceChargeSELL = cutOutPointLength(this.serviceChargeSELL, this.pointLength)
      // 交易额
      // 修复截取小数点后几位
      this.traderSumSELL = amendPrecision(this.$refs.entrustCountSell.value, this.$refs.priceSell.value, '*')
      this.traderSumSELL = cutOutPointLength(this.traderSumSELL, 2)
      // 类型：买
      // 手续费
      // 修复截取小数点后几位
      this.serviceChargeBUY = amendPrecision(this.$refs.entrustCountBuy.value, this.rate, '*')
      this.serviceChargeBUY = cutOutPointLength(this.serviceChargeBUY, this.pointLength)
      // 交易额
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
        if (this.$refs.entrustCountSell.value - this.currentlyAvailable > 0) {
          // this.errorTipsSum = '当前可用 + 资产不足'
          this.errorTipsSum = this.$t('M.otc_index_nowUse') + this.$t('M.user-fail-assetnotenough-error')
          this.entrustCountErrorTipsBorder = true
          this.entrustCountBuySellErrorTipsBorder = true
          return false
        }
      }
      // 卖出单价、买入单价价格区间控制
      if (this.$refs.priceSell.value) {
        if (this.$refs.priceSell.value - this.minPrice < 0 || this.$refs.priceSell.value - this.maxPrice > 0) {
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
        if (this.$refs.priceBuy.value - this.minPrice < 0 || this.$refs.priceBuy.value - this.maxPrice > 0) {
          this.errorTipsPrice = this.$t('M.otc_publishAD_pleaseInput') + this.minPrice + '~' + this.maxPrice
          this.priceErrorTipsBorder = true
          this.priceBuySellErrorTipsBorder = true
        } else {
          this.errorTipsPrice = ''
          this.priceErrorTipsBorder = false
          this.priceBuySellErrorTipsBorder = false
        }
      }
    },
    // 10.0 单笔最小限额单独验证
    changeInputValueMin (ref, pointLength) {
      this[ref] = this.$refs[ref].value
      let target = this.$refs[ref]
      // 限制输入数字和位数
      formatNumberInput(target, pointLength)
      // 输入验证-开始简化代码
      if (this.$refs.minCount.value - this.backReturnCurrentMinCount < 0) {
        // 单笔最小限额不能低于
        // this.errorTipsLimitMin = '单笔最小限额不能低于' + this.backReturnCurrentMinCount
        this.errorTipsLimitMin = this.$t('M.otc_min_limit_not_low') + this.backReturnCurrentMinCount
        this.minCountErrorTipsBorder = true
      } else if (this.$refs.minCount.value - this.$refs.maxCount.value > 0) {
        // 不能大于单笔最大限额
        // this.errorTipsLimitMin = '不能大于单笔最大限额'
        this.errorTipsLimitMin = this.$t('M.otc_min_limit_not_more')
        this.minCountErrorTipsBorder = true
      } else if (this.$refs.minCount.value - this.backReturnCurrentMaxCount > 0) {
        // 不能大于单笔最大限额
        // this.errorTipsLimitMin = '不能大于单笔最大限额'
        this.errorTipsLimitMin = this.$t('M.otc_min_limit_not_more')
        this.minCountErrorTipsBorder = true
      } else {
        this.errorTipsLimitMin = ''
        this.minCountErrorTipsBorder = false
      }
      if (this.$refs.minCount.value - this.$refs.maxCount.value <= 0 && this.$refs.minCount.value - this.backReturnCurrentMinCount >= 0 && this.$refs.minCount.value - this.backReturnCurrentMaxCount <= 0 && this.$refs.maxCount.value - this.$refs.minCount.value >= 0 && this.$refs.maxCount.value - this.backReturnCurrentMinCount >= 0 && this.$refs.maxCount.value - this.backReturnCurrentMaxCount <= 0) {
        this.errorTipsLimitMax = ''
        this.maxCountErrorTipsBorder = false
      }
    },
    // 11.0 单笔最大限额单独验证
    changeInputValueMax (ref, pointLength) {
      this[ref] = this.$refs[ref].value
      let target = this.$refs[ref]
      // 限制输入数字和位数
      formatNumberInput(target, pointLength)
      // 输入验证
      if (this.$refs.maxCount.value - this.backReturnCurrentMaxCount > 0) {
        // 单笔最大限额不能高于
        // this.errorTipsLimitMax = '单笔最大限额不能高于' + this.backReturnCurrentMaxCount
        this.errorTipsLimitMax = this.$t('M.otc_max_limit_not_high') + this.backReturnCurrentMaxCount
        this.maxCountErrorTipsBorder = true
      } else if (this.$refs.maxCount.value - this.$refs.minCount.value < 0) {
        // 不能小于单笔最小限额
        // this.errorTipsLimitMax = '不能小于单笔最小限额'
        this.errorTipsLimitMax = this.$t('M.otc_max_limit_not_few')
        this.maxCountErrorTipsBorder = true
      } else if (this.$refs.maxCount.value - this.backReturnCurrentMinCount < 0) {
        // 不能小于单笔最小限额
        // this.errorTipsLimitMax = '不能小于单笔最小限额'
        this.errorTipsLimitMax = this.$t('M.otc_max_limit_not_few')
        this.maxCountErrorTipsBorder = true
      } else {
        this.errorTipsLimitMax = ''
        this.maxCountErrorTipsBorder = false
      }
      if (this.$refs.maxCount.value - this.$refs.minCount.value >= 0 && this.$refs.maxCount.value - this.backReturnCurrentMinCount >= 0 && this.$refs.maxCount.value - this.backReturnCurrentMaxCount <= 0 && this.$refs.minCount.value - this.$refs.maxCount.value <= 0 && this.$refs.minCount.value - this.backReturnCurrentMinCount >= 0 && this.$refs.minCount.value - this.backReturnCurrentMaxCount <= 0) {
        this.errorTipsLimitMin = ''
        this.minCountErrorTipsBorder = false
      }
    },
    // 12.0 单笔最小最大限额失去焦点事件
    loseFocus (sum) {
      switch (sum) {
        case 1:
          if (!this.$refs.minCount.value) {
            // this.errorTipsLimitMin = '单笔最小限额不能为空！'
            this.errorTipsLimitMin = this.$t('M.otc_min_limit_not_empty')
            this.minCountErrorTipsBorder = true
          }
          break
        case 2:
          if (!this.$refs.maxCount.value) {
            // this.errorTipsLimitMax = '单笔最大限额不能为空！'
            this.errorTipsLimitMax = this.$t('M.otc_max_limit_not_empty')
            this.maxCountErrorTipsBorder = true
          }
          break
      }
    },
    //  13.0 点击发布出售或者发布购买弹出输入交易密码框
    async showPasswordDialog () {
      // 用户交易密码是否锁定判断
      await this.REFRESH_USER_INFO_ACTION()
      let isPaypasswordLocked = getNestedData(this.loginStep1Info, 'payPasswordRemainCount') ? false : true
      this.CHANGE_PASSWORD_USEABLE(isPaypasswordLocked)
      if (this.isLockedPayPassword) return false
      //
      this.isNeedPayPassword = await isNeedPayPasswordAjax(this)
      switch (this.publishStyle) {
        case 'buy':
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
          break
        case 'sell':
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
          break
      }
      // 如果单价错误提示有的话不能进行提交操作
      if (this.errorTipsPrice || this.errorTipsLimitMin || this.errorTipsLimitMax) {
        return false
      }
      // 20190308增加单笔最小、最大成交限额必输验证
      if (!this.$refs.minCount.value) {
        // this.errorTipsLimitMin = '单笔最小限额不能为空！'
        this.errorTipsLimitMin = this.$t('M.otc_min_limit_not_empty')
        this.minCountErrorTipsBorder = true
        return false
      }
      if (!this.$refs.maxCount.value) {
        // this.errorTipsLimitMax = '单笔最大限额不能为空！'
        this.errorTipsLimitMax = this.$t('M.otc_max_limit_not_empty')
        this.maxCountErrorTipsBorder = true
        return false
      }
      if (this.isNeedPayPassword) {
        this.publishOrderTradePwdDialogStatus = true
      } else {
        this.publishOTCEntryOrders()
      }
    },
    // 14.0 交易密码框获得焦点清空错误提示信息
    tradePasswordFocus () {
      this.errorPWd = ''
    },
    // 15.0 点击输入密码框中的提交按钮
    async publishOTCEntryOrders () {
      if (this.isNeedPayPassword && !this.tradePassword) {
        // 请输入交易密码
        this.errorPWd = this.$t('M.comm_please_enter') + this.$t('M.comm_password')
        return false
      }
      let param = {
        coinId: this.coinId, // 可用币种id
        currencyId: this.hopePaymentCoinId, // 法币id
        minCount: this.$refs.minCount.value, // 单笔最小限额（CNY）
        maxCount: this.$refs.maxCount.value, // 单笔最大限额（CNY）
        remark: this.remarkText // 备注
      }
      param = this.isNeedPayPassword ? { ...param, tradePassword: this.tradePassword } : param// 交易密码
      switch (this.publishStyle) {
        case 'buy':
          param = {...param,
            ...{
              entrustType: 'BUY', // 挂单类型（BUY SELL）
              entrustCount: this.entrustCountBuy, // 挂单数量
              price: this.priceBuy // 单价
            }}
          break
        case 'sell':
          param = {...param,
            ...{
              entrustType: 'SELL', // 挂单类型（BUY SELL）
              entrustCount: this.entrustCountSell, // 挂单数量
              price: this.priceSell // 单价
            }}
          break
      }
      this.CHANGE_AJAX_READY_STATUS(true) // 接口返回loading
      const data = await addOTCPutUpOrders(param)
      // 返回数据正确的逻辑
      this.CHANGE_AJAX_READY_STATUS(false) // 关闭接口返回loading
      // 关闭交易密码框
      this.publishOrderTradePwdDialogStatus = false
      this.tradePassword = '' // 清空交易密码
      if (!data) return false
      if (data) {
        // 清空表单数据
        this.clearInputData()
        // 下单成功跳转到首页挂单列表去
        // 改变发布订单（商家和普通用户公用）后页面跳转到首页顶部状态
        this.CHANGE_PUBLISH_ORDER_JUMP_TOP_STATUS(true)
        this.$goToPage('/OTCCenter')
      }
    },
    // 16.0 充币按钮跳转
    chargeMoney () {
      this.CHANGE_USER_CENTER_ACTIVE_NAME('assets')
      this.$goToPage('/PersonalCenter')
    },
    // 忘记密码跳转
    forgetPwdJump () {
      this.$goToPage('/TransactionPassword')
    },
    // 暂时关闭交易密码验证跳转
    closePwdJump () {
      this.CHANGE_REF_ACCOUNT_CREDITED_STATE(true)
      this.$goToPage('/PersonalCenter')
      this.CHANGE_USER_CENTER_ACTIVE_NAME('personal-setting')
    }
  },
  filter: {},
  computed: {
    ...mapState({
      configInfo: state => state.common.footerInfo.configInfo,
      theme: state => state.common.theme,
      // 当前选中语言
      language: state => state.common.language,
      // 交易密码是否被锁定
      isLockedPayPassword: state => state.common.isLockedPayPassword,
      loginStep1Info: state => state.user.loginStep1Info
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
@import "../../../static/css/scss/index";

.otc-publish-buy-and-sell-box {
  margin-top: 50px;
  overflow: hidden;

  .redBorderRightNone {
    border: 1px solid #d45858 !important;
    border-right: 0 !important;
  }

  .redBorderLeftNone {
    border: 1px solid #d45858 !important;
    border-left: 0 !important;
  }

  > .publish-buy-and-sell-content {
    width: 1150px;
    padding: 90px 0 50px;
    margin: 0 auto;

    > .publish-content {
      display: flex;
      flex: 3;

      > .publish-content-left {
        flex: 2;

        > .publish-button {
          > .common-style {
            display: inline-block;
            width: 70px;
            height: 36px;
            cursor: pointer;
          }

          > .sell-button {
            margin-right: -4px;
            border-bottom-left-radius: 4px;
            border-top-left-radius: 4px;
            border-right: 0;
          }

          > .buy-button {
            border-left: 0;
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
          }
        }

        > .buy-sell-submit-form {
          margin-top: 20px;

          .want-buy-sell-sum {
            padding-top: 20px;
            font-size: 20px;
          }

          .want-buy-sell-sum-content {
            > .want-text {
              font-size: 12px;
            }

            > .max-sum {
              margin-right: 20px;
              font-size: 12px;
            }

            > .market-price {
              margin-right: 20px;
              font-size: 12px;
            }
          }

          .sell-buy-input {
            padding: 10px 0 0;

            > .sell-sum {
              width: 190px;
              height: 36px;
              padding-left: 10px;
            }

            > .unit {
              display: inline-block;
              width: 70px;
              height: 36px;
              margin: 0 50px 0 -4px;
              font-size: 16px;
              line-height: 36px;
              text-align: center;
              vertical-align: top;
            }
          }

          .buySellSumErrorTips {
            > .errorSell {
              display: inline-block;
              width: 320px;
              font-size: 12px;
            }
          }

          .volume-business {
            margin-bottom: 10px;

            > .sell-sum {
              width: 130px;
              height: 36px;
              padding-left: 10px;
            }

            > .max-sell-sum {
              width: 180px;
            }

            > .monad {
              display: inline-block;
              width: 50px;
              height: 36px;
              margin-left: -4px;
              font-size: 12px;
              line-height: 36px;
              text-align: center;
              vertical-align: top;
            }

            > .range-line {
              margin: 0 10px;
            }
          }

          .limitErrorTips {
            > .errorLimitMin,
            .errorLimitMax {
              display: inline-block;
              width: 230px;
              font-size: 12px;
            }
          }

          .remark {
            margin-top: -10px;
            font-size: 12px;
          }

          .predict {
            > .predict-text {
              font-size: 12px;
            }

            > .predict-sum {
              font-size: 12px;
            }

            > .rate-text {
              font-size: 12px;

              > .rate {
                font-size: 12px;
              }
            }
          }

          .publish-submit {
            > .publish-submit-button {
              width: 589px;
              height: 42px;
              margin-top: 40px;
              border-radius: 4px;
              font-size: 14px;
              cursor: pointer;
            }
          }
        }
      }

      > .publish-content-right {
        flex: 1;

        > .release-notes {
          width: 216px;
          font-size: 12px;

          > .release-tips {
            font-size: 14px;
            line-height: 20px;
          }
        }
      }
    }
  }

  /deep/ {
    .el-textarea__inner {
      width: 588px;
      height: 100px;
      margin-bottom: 10px;
      border: 0;
      resize: none;
    }

    .el-form--label-top {
      .el-form-item__label {
        padding: 0;
      }

      .el-form-item {
        margin-bottom: 0;
      }

      .el-form-item__content {
        line-height: 30px;
      }

      .el-button--mini {
        padding: 4px 8px;
      }
    }

    .buy-sell-submit-form {
      .el-input--suffix {
        .el-input__inner {
          height: 36px;
          line-height: 36px;
        }
      }

      .el-input__inner {
        border: 0;
      }
    }

    .password-dialog {
      .el-dialog {
        width: 350px;
        height: 240px;
        border-radius: 4px;
      }

      .el-dialog__header {
        padding: 10px 20px;
        border-radius: 4px;
      }

      .el-dialog__title {
        font-size: 14px;
      }

      .el-dialog__headerbtn {
        top: 15px;
        right: 10px;
      }

      .el-dialog__body {
        padding: 15px 20px 10px 30px;
        font-size: 12px;

        .input {
          margin-top: 13px;
        }

        .password-input {
          display: inline-block;
          width: 280px;
          height: 36px;
          padding-left: 10px;
          border-radius: 4px;
          font-size: 14px;
        }

        .error-info {
          height: 20px;
          padding-top: 5px;
          font-size: 12px;
        }

        .close-pwd-tip {
          margin-top: 5px;
          color: #338ff5;
        }
      }

      .el-dialog__footer {
        padding: 0;
        text-align: center;

        .forget-pwd-tip {
          padding: 8px 20px 0 0;
          text-align: right;
          color: #338ff5;
        }
      }

      .el-button {
        width: 290px;
        padding: 7px 20px;
        border: 0;
      }
    }
  }

  &.night {
    background-color: $mainNightBgColor;

    > .publish-buy-and-sell-content {
      > .publish-content {
        > .publish-content-left {
          > .publish-button {
            > .common-style {
              border: 1px solid #1c1f32;
              color: #8494a6;
            }

            > .green {
              border: 1px solid #008069;
              color: #fffefe;
              background-color: #008069;
            }

            > .red {
              border: 1px solid #d45858;
              color: #fffefe;
              background-color: #d45858;
            }
          }

          > .buy-sell-submit-form {
            .want-buy-sell-sum {
              color: #338ff5;
            }

            .want-buy-sell-sum-content {
              .sellGreen {
                color: #30c296;
              }

              .buyOrange {
                color: #e97345;
              }

              > .want-text {
                color: #9da5b3;
              }
            }

            .sell-buy-input {
              > .sell-sum {
                color: #9da5b3;
                background-color: #1c1f32;
              }

              > .unit {
                color: #338ff5;
                background-color: #21243b;
              }
            }

            .buySellSumErrorTips {
              > .errorSell {
                color: #d45858;
              }

              > .errorBuy {
                color: #d45858;
              }
            }

            .volume-business {
              > .sell-sum {
                color: #9da5b3;
                background-color: #1c1f32;
              }

              > .monad {
                color: #338ff5;
                background-color: #21243b;
              }

              > .range-line {
                color: #7d90ac;
              }
            }

            .limitErrorTips {
              > .errorLimitMin,
              .errorLimitMax {
                color: #d45858;
              }
            }

            .remark {
              color: #9da5b3;
            }

            .predict {
              > .predict-text {
                color: #9fa7b2;
              }

              > .predict-sum {
                color: #30c296;
              }

              > .rate-text {
                color: #9fa7b2;

                > .rate {
                  color: #ca5040;
                }
              }
            }

            .publish-submit {
              > .publish-submit-button {
                color: #fff;
              }

              > .publish-submit-buy {
                background-color: #d45858;
              }

              > .publish-submit-sell {
                background-color: #008069;
              }
            }

            .password-dialog {
              .tips {
                color: #d45858;
              }
            }
          }
        }

        > .publish-content-right {
          flex: 1;

          > .release-notes {
            color: #a9bed4;

            > .release-title {
              color: #fff;
            }
          }
        }
      }
    }

    /deep/ {
      .el-textarea__inner {
        color: #fff;
        background-color: #1c1f32;
      }

      .el-form--label-top {
        .el-form-item__label {
          color: #9da5b3;
        }
      }

      .buy-sell-submit-form {
        .el-input__inner {
          background-color: #1c1f32;
        }

        .el-select-dropdown__list {
          background-color: #29343f !important;
        }

        .el-select-dropdown__item {
          &.hover {
            color: #338ff5 !important;
            background-color: #29343f !important;
          }
        }
      }

      .password-dialog {
        .el-dialog {
          background: #28334a;
        }

        .el-dialog__header {
          background-color: #20293c;
        }

        .el-dialog__title {
          color: #fff;
        }

        .el-dialog__body {
          color: #fff;

          .password-input {
            color: #fff;
            background-color: #1a2233;
          }

          .error-info {
            color: #fff;
          }
        }

        .el-button--primary {
          background: linear-gradient(9deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
        }
      }
    }
  }

  &.day {
    background-color: $mainDayBgColor;

    > .publish-buy-and-sell-content {
      > .publish-content {
        > .publish-content-left {
          > .publish-button {
            > .common-style {
              border: 1px solid #333;
              color: #8494a6;
            }

            > .green {
              border: 1px solid #008069;
              color: #fffefe;
              background-color: #008069;
            }

            > .red {
              border: 1px solid #d45858;
              color: #fffefe;
              background-color: #d45858;
            }
          }

          > .buy-sell-submit-form {
            .want-buy-sell-sum {
              color: #338ff5;
            }

            .want-buy-sell-sum-content {
              .sellGreen {
                color: #30c296;
              }

              .buyOrange {
                color: #e97345;
              }

              > .want-text {
                color: #9da5b3;
              }
            }

            .sell-buy-input {
              > .sell-sum {
                color: #9da5b3;
                background-color: #fff;
              }

              > .unit {
                border: 1px solid #cbddf4;
                color: #338ff5;
                background-color: #cbddf4;
              }
            }

            .buySellSumErrorTips {
              > .errorSell {
                color: #d45858;
              }

              > .errorBuy {
                color: #d45858;
              }
            }

            .volume-business {
              > .sell-sum {
                color: #9da5b3;
                background-color: #fff;
              }

              > .monad {
                border: 1px solid #cbddf4;
                color: #338ff5;
                background-color: #cbddf4;
              }

              > .range-line {
                color: #7d90ac;
              }
            }

            .limitErrorTips {
              > .errorLimitMin,
              .errorLimitMax {
                color: #d45858;
              }
            }

            .remark {
              color: #9da5b3;
            }

            .predict {
              > .predict-text {
                color: #9fa7b2;
              }

              > .predict-sum {
                color: #30c296;
              }

              > .rate-text {
                color: #9fa7b2;

                > .rate {
                  color: #ca5040;
                }
              }
            }

            .publish-submit {
              > .publish-submit-button {
                color: #fff;
              }

              > .publish-submit-buy {
                background-color: #d45858;
              }

              > .publish-submit-sell {
                background-color: #008069;
              }
            }

            .password-dialog {
              .tips {
                color: #d45858;
              }
            }
          }
        }

        > .publish-content-right {
          flex: 1;

          > .release-notes {
            color: #7d90ac;

            > .release-title {
              color: #bb4c4c;
            }
          }
        }
      }
    }

    /deep/ {
      .el-form--label-top {
        .el-form-item__label {
          color: #7d90ac;
        }
      }

      .el-textarea__inner {
        border: 1px solid rgba(236, 241, 248, 1);
        border-radius: 2px;
        font-size: 12px;
        background: rgba(255, 255, 255, 1);

        &::-webkit-input-placeholder {
          color: #7d90ac;
        }
      }

      .buy-sell-submit-form {
        .el-input__inner {
          border: 1px solid rgba(236, 241, 248, 1);
          background-color: transparent;
        }

        .volume-business {
          > .sell-sum {
            border: 1px solid rgba(236, 241, 248, 1);
            background-color: transparent;
          }

          > .monad {
            color: #7ea9e4;
            background-color: #cbddf4;
          }

          > .range-line {
            color: #338ff5;
          }
        }

        .sell-buy-input {
          > .sell-sum {
            border: 1px solid rgba(236, 241, 248, 1);
            background-color: transparent;

            &::-webkit-input-placeholder {
              color: #bdbdbd;
            }
          }

          .sell-buy-input {
            > .sell-sum {
              &::-webkit-input-placeholder {
                color: #bdbdbd;
              }
            }
          }

          > .unit {
            color: #7ea9e4;
            background-color: #cbddf4;
          }
        }

        .predic {
          .predict-sum {
            color: #d45858;
          }
        }

        .want-buy-sell-sum-content {
          .buyOrange {
            color: #d45858;
          }
        }
      }

      .el-form-item__label {
        color: #333;
      }

      .predict {
        .predict-text {
          color: #333 !important;
        }

        .rate-text {
          color: #333 !important;
        }
      }

      .password-dialog {
        .el-dialog__body {
          .password-input {
            border: 1px solid #ecf1f8;
          }
        }
      }
    }
  }
}
</style>
