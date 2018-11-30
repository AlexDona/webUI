<template>
  <div
    class="otc-online-trader-buy-sell-box otc"
    :class="{'day':theme == 'day','night':theme == 'night' }"
    :style="{
      height: windowHeight+'px'
    }"
  >
    <!-- otc在线交易 摘单 页面 -->
    <div
      class="online-trader-buy-sell-content"
      v-loading.fullscreen.lock="fullscreenLoading"
      element-loading-background="rgba(0, 0, 0, 0.6)"
    >
      <div class="online-trader">
        <!-- 交易左边 -->
        <div class="online-trader-left">
            <!-- 左上部分商家信息部分 -->
            <div class="shoper-info">
                <!-- 商家名字 -->
                <div class="shoper-name">
                  <!-- 如果是商家用户就显示商家图标 -->
                  <img
                    src="../../assets/develop/shangjia.png"
                    class="shang-icon"
                    v-show="this.userType === 'MERCHANT'"
                  >
                  <!-- 商户名称 -->
                  <span class="name">
                    {{userName}}
                  </span>
                </div>
                <!-- 商家交易统计 -->
                <div class="shoper-statistics">
                  <!-- 成交次数 -->
                  <div class="trader-total">
                    <p class="blue">{{successTimes}}</p>
                    <p class="text">{{$t('M.otc_index_tradeTimes')}}</p>
                  </div>
                  <!-- 失败次数 -->
                  <div class="failed">
                    <p class="blue">{{failTimes}}</p>
                    <p class="text">{{$t('M.otc_index_failureTimes')}}</p>
                  </div>
                  <!-- 账户冻结次数 -->
                  <div class="freeze">
                    <p class="blue">{{freezeTimes}}</p>
                    <p class="text">{{$t('M.otc_index_freezeTimes')}}</p>
                  </div>
                </div>
            </div>
            <!-- 左下部分商家备注部分 -->
            <div class="shoper-remark">
              <!-- 备注： -->
              <p class="remark-title">{{$t('M.comm_remark')}}：</p>
              <p class="remark-content">{{remark}}</p>
            </div>
        </div>
        <!-- 交易右边 -->
        <div class="online-trader-right">
            <!-- 右上交易部分 -->
            <div class="trader-details">
              <!--前四个展示部分-->
              <!-- 报价 -->
              <div class="details-row">
                <span class="details-tip">
                  <!-- 报价： -->
                  {{$t('M.otc_index_givePrice')}}：
                </span>
                <span class="details-data">
                  {{price}}{{currencyName}}
                </span>
              </div>
              <!-- 限额 -->
              <div class="details-row">
                <span class="details-tip">
                  <!-- 限额： -->
                  {{$t('M.otc_index_priceLimit')}}：
                </span>
                <span class="details-data">
                  {{minCount}}~{{maxCount}}{{currencyName}}
                </span>
              </div>
              <!-- 剩余数量 -->
              <div class="details-row">
                <span class="details-tip">
                  <!-- 剩余数量： -->
                  {{$t('M.otc_index_reduceQuantity')}}：
                </span>
                <span class="details-data">
                  {{remainingNum}}{{name}}
                </span>
              </div>
              <!-- 付款方式 -->
              <div class="details-row">
                <span class="details-tip">
                    <!-- 付款方式： -->
                    {{$t('M.otc_alipay_type')}}：
                </span>
                <!-- 1支付宝 -->
                <IconFontCommon
                  class="font-size16"
                  iconName="icon-zhifubao1"
                  v-show="payTypes[0] === '1'"
                />
                <!-- 2微信 -->
                <IconFontCommon
                  class="font-size16"
                  iconName="icon-weixin1"
                  v-show="payTypes[1] === '1'"
                />
                <!-- 3银行卡 -->
                <IconFontCommon
                  class="font-size16"
                  iconName="icon-yinhangqia"
                  v-show="payTypes[2] === '1'"
                />
                  <!-- 4西联汇款 -->
                <span v-show="payTypes[3] == '1'">
                  <img
                    src="../../assets/user/xilian.png"
                    class="xilian"
                  >
                </span>
                <!--  5PAYPAL -->
                <IconFontCommon
                  class="font-size16"
                  iconName="icon-paypal"
                  v-show="payTypes[4] === '1'"
                />
              </div>
              <!-- 付款期限 -->
              <div class="details-row">
                <span class="details-tip">
                  <!-- 付款期限： -->
                  {{$t('M.otc_index_payTimeLimit')}}：
                </span>
                <span class="details-data">
                  {{payTerm/60}}{{$t('M.otc_index_minute')}}
                </span>
              </div>
              <!--表单部分-->
              <div class="form">
                <el-form
                  :label-position="labelPosition"
                  label-width="80px"
                  :model="formLabelAlign"
                >
                  <el-form-item>
                    <!-- 标题 -->
                    <div class="want">
                      <span
                        class="want-text"
                        v-show="onlineTraderStatus === 'onlineSell'"
                      >
                        <!-- 您想出售多少 -->
                        {{$t('M.otc_index_sellMount')}}
                      </span>
                      <span
                        class="want-text"
                        v-show="onlineTraderStatus === 'onlineBuy'"
                      >
                        <!-- 您想购买多少 -->
                        {{$t('M.otc_index_buyMount')}}
                      </span>
                      <span
                        class="charge-money"
                        v-show="onlineTraderStatus === 'onlineSell'"
                      >
                        <el-button
                          type="primary"
                          size="mini"
                          @click="chargeMoney"
                        >
                          <!-- 充币 -->
                          {{$t('M.comm_charge_money')}}
                        </el-button>
                      </span>
                    </div>
                    <!-- input框部分 -->
                    <div class="sell-buy-input">
                      <!-- 1.0 数量部分 -->
                      <!--出售-->
                      <input
                        type="text"
                        :placeholder="$t('M.otc_index_sellOutMount')"
                        class="sell-sum"
                        :class = "{ red: errorWarningBorder }"
                        v-if="onlineTraderStatus === 'onlineSell'"
                        ref="sellCount"
                        @keyup="calculatePriceValue('sellCount', pointLength)"
                        @input="calculatePriceValue('sellCount', pointLength)"
                      >
                      <!--购买-->
                      <input
                        type="text"
                        :placeholder="$t('M.otc_index_buyOutMount')"
                        class="sell-sum"
                        :class = "{ red: errorWarningBorder }"
                        v-if="onlineTraderStatus === 'onlineBuy'"
                        ref="buyCount"
                        @keyup="calculatePriceValue('buyCount', pointLength)"
                        @input="calculatePriceValue('buyCount', pointLength)"
                      >
                      <span
                        class="unit"
                        :class = "{ coinNameBorder: errorWarningBorder }"
                      >
                        {{name}}
                      </span>
                      <!-- 2.0 金额部分 -->
                      <!--出售-->
                      <input
                        type="text"
                        :placeholder="$t('M.comm_money')"
                        class="sell-sum"
                        :class = "{ red: errorWarningBorder }"
                        v-if="onlineTraderStatus === 'onlineSell'"
                        ref="sellPrice"
                        @keyup="calculateCountValue('sellPrice', moneyPointLength)"
                        @input="calculateCountValue('sellPrice', moneyPointLength)"
                      >
                      <!--购买-->
                      <input
                        type="text"
                        :placeholder="$t('M.comm_money')"
                        class="sell-sum"
                        :class = "{ red: errorWarningBorder }"
                        v-if="onlineTraderStatus === 'onlineBuy'"
                        ref="buyPrice"
                        @keyup="calculateCountValue('buyPrice', moneyPointLength)"
                        @input="calculateCountValue('buyPrice', moneyPointLength)"
                      >
                      <span
                        class="unit"
                        :class = "{ coinNameBorder: errorWarningBorder }"
                      >
                        {{currencyName}}
                      </span>
                    </div>
                    <!-- input框错误提示信息 -->
                    <div class="errorInfo">
                      <!-- 买入量和卖出量 -->
                      <span class="number">{{numberTips}}</span>
                      <!-- 金额 -->
                      <span class="money">{{moneyTips}}</span>
                    </div>
                    <!-- 确定按钮 -->
                    <div class="trader-submit">
                      <button
                        class="trader-submit-button trader-submit-sell"
                        v-if="onlineTraderStatus === 'onlineSell'"
                        @click.prevent="showDialog(onlineTraderStatus)"
                      >
                        <!-- 确定出售 -->
                        {{$t('M.otc_index_ensureSell')}}
                      </button>
                      <button
                        class="trader-submit-button trader-submit-buy"
                        v-if="onlineTraderStatus === 'onlineBuy'"
                        @click.prevent="showDialog(onlineTraderStatus)"
                      >
                        <!-- 确定购买 -->
                        {{$t('M.otc_index_ensureBuy')}}
                      </button>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
              <!--最下右边手续费-->
              <!-- 买 -->
              <div
                class="service-charge"
                v-if="onlineTraderStatus === 'onlineBuy'"
              >
                <!-- 手续费 -->
                <span>
                  {{$t('M.comm_service_charge')}}：
                </span>
                <span class="service-data">
                  {{serviceCharge}} {{name}}
                </span>
                <!-- 费率 -->
                <span>
                  ( {{$t('M.otc_index_rate')}} <span class="rate-data">{{rate*100}}%</span> )
                </span>
              </div>
              <!-- 卖 -->
              <div
                class="service-charge-sell"
                v-if="onlineTraderStatus === 'onlineSell'"
              >
                <!-- 手续费 -->
                <span>
                  {{$t('M.comm_service_charge')}}：
                </span>
                <span class="service-data-sell">
                  {{serviceCharge}} {{name}}
                </span>
                <!-- 费率 -->
                <span>
                  ( {{$t('M.otc_index_rate')}} <span class="rate-data-sell">{{rate*100}}%</span> )
                </span>
              </div>
            </div>
            <!-- 右下交易须知 -->
            <div class="trading-notes">
              <div class="notes">
                <!-- 交易须知 -->
                <h4 class="title">*{{$t('M.otc_index_tradeKnow')}}：</h4>
                <p class="tip">
                  1. {{$t('M.otc_index_tradeKnowDetail1')}}<span class="warning">3{{$t('M.otc_ci')}}</span>，{{$t('M.otc_index_tradeKnowDetail2')}}
                </p>
                <p class="tip">
                  2. {{$t('M.otc_index_tradeKnowDetail3')}}
                </p>
                <p class="tip">
                  3. {{$t('M.otc_index_tradeKnowDetail4')}}{{configInfo.otcAd}}{{$t('M.otc_index_tradeKnowDetail6')}}
                </p>
                <p class="tip">
                  4. {{$t('M.otc_index_tradeKnowDetail5')}}
                </p>
              </div>
            </div>
        </div>
        <!-- 输入交易密码弹窗 -->
        <div class="password-dialog">
          <el-dialog
            :title="$t('M.otc_publishAD_sellpassword')"
            :visible.sync="dialogVisible"
            top="25vh"
            width="470"
          >
            <!-- 请输入交易密码 -->
            <div class="input">
              <input
                type="password"
                :placeholder="$t('M.otc_publishAD_sellpassword')"
                class="password-input"
                v-model="tradePassword"
                @focus="tradePasswordFocus"
              >
            </div>
            <div class="error-info">
              <!-- 错误提示 -->
              <div class="tips">{{tradePasswordTips}}</div>
            </div>
            <span
              slot="footer"
              class="dialog-footer">
                <!-- 在线购买提交 -->
                <el-button
                  type="primary"
                  v-if="this.onlineTraderStatus === 'onlineBuy'"
                  @click="submitPickOrdersToBuy"
                >
                  <!-- 提交 -->
                  {{$t('M.otc_submit')}}
                </el-button>
                <!-- 在线出售提交 -->
                <el-button
                  type="primary"
                  v-if="this.onlineTraderStatus === 'onlineSell'"
                  @click="submitPickOrdersToSell"
                >
                  <!-- 提交 -->
                  {{$t('M.otc_submit')}}
                </el-button>
            </span>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {
  timeFilter,
  formatNumberInput,
  amendPrecision,
  cutOutPointLength
} from '../../utils'
import {
  pickOrdersToBuy,
  pickOrdersToSell,
  querySelectedOrdersDetails,
  queryUserTradeFeeAndCoinInfo
} from '../../utils/api/OTC'
import IconFontCommon from '../Common/IconFontCommon'
import {returnAjaxMsg, getNestedData} from '../../utils/commonFunc'
import {createNamespacedHelpers, mapState} from 'vuex'
const {mapMutations} = createNamespacedHelpers('OTC')
export default {
  components: {
    IconFontCommon //  字体图标组件
  },
  data () {
    return {
      fullscreenLoading: true, // 全局loading
      // input框输入错误显示红色边框状态
      errorWarningBorder: false,
      // 弹窗显示状态
      dialogVisible: false,
      // 挂单人姓名
      userName: '',
      // 成交次数
      successTimes: '',
      // 失败次数
      failTimes: '',
      // 冻结次数
      freezeTimes: '',
      // 备注
      remark: '',
      // 报价
      price: '',
      // 当前摘单的法币币种
      currencyName: '',
      // 付款方式
      payTypes: [],
      // 付款期限
      payTerm: '',
      // 币种名字（单位）
      name: '',
      // 费率
      rate: '',
      // 手续费
      serviceCharge: 0,
      // 剩余数量
      remainingNum: 0,
      // 单笔最大限额
      maxCount: '',
      // 单笔最小限额
      minCount: '',
      labelPosition: 'top', //  表单label放置的位置
      onlineTraderStatus: '', //  在线买卖的类型状态 购买（onlineBuy）和 出售（onlineSell)
      sellCount: '', // 出售数量
      buyCount: '', // 购买数量
      sellPrice: '', // 出售金额
      buyPrice: '', // 购买金额
      tradePassword: '', // 交易密码
      id: '', // 往后台传送的参数 挂单id（otc首页挂单列表中每行的币种id）
      partnerCoinId: '', // 商户币种id
      userType: '', // 挂单人类型（COMMON普通用户 ，MERCHANT商家）
      // 数量错误提示
      numberTips: '',
      // 金额错误提示
      moneyTips: '',
      // 密码错误提示
      tradePasswordTips: '',
      pointLength: 4, // 当前币种返回的保留小数点位数限制
      moneyPointLength: 2 // 当前金额小数点限制位数
    }
  },
  created () {
    require('../../../static/css/list/OTC/OTCOnlineTraderBuySell.css')
    require('../../../static/css/theme/day/OTC/OTCOnlineTraderBuySellDay.css')
    require('../../../static/css/theme/night/OTC/OTCOnlineTraderBuySellNight.css')
    // 1.0 从OTCCenter传过来的URL中获取的
    // console.log(this.$route.params)
    this.onlineTraderStatus = this.$route.params.styleId
    this.id = this.$route.params.id
    this.partnerCoinId = this.$route.params.partnerCoinId
    // 2.0 查询选中的挂单，利用挂单id请求详情信息
    if (this.id) {
      this.querySelectedOrdersDetails()
    }
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      // 改变全局锚点状态方法
      'CHANGE_OTC_ANCHOR_STATUS'
    ]),
    // 0.0 充币按钮跳转
    chargeMoney () {
      this.$store.commit('personal/CHANGE_USER_CENTER_ACTIVE_NAME', 'assets')
      this.$router.push({path: '/PersonalCenter'})
    },
    // 0.1 输入限制
    formatInput (ref, pointLength) {
      let target = this.$refs[ref]
      formatNumberInput(target, pointLength)
    },
    // 1.0 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'date')
    },
    // 2.0 显示输入密码框
    showDialog (val) {
      // 在线买
      if (val === 'onlineBuy') {
        if (!this.$refs.buyCount.value) {
          this.numberTips = this.$t('M.otc_index_inputBuyMount')
          return false
        } else if (!this.$refs.buyPrice.value) {
          this.moneyTips = this.$t('M.otc_index_inputBuyMoney')
          return false
        } else if (this.numberTips || this.moneyTips) {
          return false
        } else {
          this.dialogVisible = true
        }
      }
      // 在线卖
      if (val === 'onlineSell') {
        if (!this.$refs.sellCount.value) {
          this.numberTips = this.$t('M.otc_index_inputSellMount')
          return false
        } else if (!this.$refs.sellPrice.value) {
          this.moneyTips = this.$t('M.otc_index_inputBuyMoney')
          return false
        } else if (this.numberTips || this.moneyTips) {
          return false
        } else {
          this.dialogVisible = true
        }
      }
    },
    // 3.0 卖出量/买入量input框键盘弹起事件:计算金额
    calculatePriceValue (ref, pointLength) {
      this[ref] = this.$refs[ref].value
      // console.log(this[ref])
      // 限制输入数字和位数
      let target = this.$refs[ref]
      formatNumberInput(target, pointLength)
      // 计算金额
      // 买
      if (this.onlineTraderStatus === 'onlineBuy') {
        if (this.$refs.buyCount.value) {
          this.$refs.buyPrice.value = this.$refs.buyCount.value * this.price
          // this.$refs.buyPrice.value = Number(this.$refs.buyPrice.value).toFixed(2)
          // 修复截取小数点后几位
          this.$refs.buyPrice.value = cutOutPointLength(this.$refs.buyPrice.value, 2)
          // 手续费
          this.serviceCharge = amendPrecision(this.$refs.buyCount.value, this.rate, '*')
          // this.serviceCharge = Number(this.serviceCharge).toFixed(this.pointLength)
          // this.serviceCharge = parseFloat(this.serviceCharge) // 去掉数字后面多余的0
          // 修复截取小数点后几位
          this.serviceCharge = cutOutPointLength(this.serviceCharge, this.pointLength)
          if (this.$refs.buyCount.value * this.price < this.minCount) {
            // 单笔最小限额为
            this.moneyTips = this.$t('M.otc_publishAD_minlimitMoney') + this.$t('M.otc_index_wei') + this.minCount
            this.errorWarningBorder = true
            return false
          } else if (this.$refs.buyCount.value * this.price > this.maxCount) {
            // 单笔最大限额为
            this.moneyTips = this.$t('M.otc_publishAD_maxlimitMoney') + this.$t('M.otc_index_wei') + this.maxCount
            // 最大剩余数量为
            this.numberTips = this.$t('M.otc_index_maxRemain') + this.$t('M.otc_index_wei') + this.remainingNum
            this.errorWarningBorder = true
            return false
          } else if (this.$refs.buyCount.value > this.remainingNum) {
            // 单笔最大限额为
            this.moneyTips = this.$t('M.otc_publishAD_maxlimitMoney') + this.$t('M.otc_index_wei') + this.maxCount
            this.numberTips = this.$t('M.otc_index_maxRemain') + this.$t('M.otc_index_wei') + this.remainingNum
            this.errorWarningBorder = true
            return false
          } else {
            this.moneyTips = ''
            this.numberTips = ''
            this.errorWarningBorder = false
          }
        } else {
          this.numberTips = ''
          this.errorWarningBorder = false
        }
      }
      // 卖
      if (this.onlineTraderStatus === 'onlineSell') {
        if (this.$refs.sellCount.value) {
          this.$refs.sellPrice.value = this.$refs.sellCount.value * this.price
          // this.$refs.sellPrice.value = Number(this.$refs.sellPrice.value).toFixed(2)
          // 修复截取小数点后几位
          this.$refs.sellPrice.value = cutOutPointLength(this.$refs.sellPrice.value, 2)
          // 手续费
          this.serviceCharge = amendPrecision(this.$refs.sellCount.value, this.rate, '*')
          // this.serviceCharge = Number(this.serviceCharge).toFixed(this.pointLength)
          // this.serviceCharge = parseFloat(this.serviceCharge) // 去掉数字后面多余的0
          // 修复截取小数点后几位
          this.serviceCharge = cutOutPointLength(this.serviceCharge, this.pointLength)
          if (this.$refs.sellCount.value * this.price < this.minCount) {
            this.moneyTips = this.$t('M.otc_publishAD_minlimitMoney') + this.$t('M.otc_index_wei') + this.minCount
            this.errorWarningBorder = true
            return false
          } else if (this.$refs.sellCount.value * this.price > this.maxCount) {
            this.moneyTips = this.$t('M.otc_publishAD_maxlimitMoney') + this.$t('M.otc_index_wei') + this.maxCount
            this.numberTips = this.$t('M.otc_index_maxRemain') + this.$t('M.otc_index_wei') + this.remainingNum
            this.errorWarningBorder = true
            return false
          } else if (this.$refs.sellCount.value > this.remainingNum) {
            this.moneyTips = this.$t('M.otc_publishAD_maxlimitMoney') + this.$t('M.otc_index_wei') + this.maxCount
            this.numberTips = this.$t('M.otc_index_maxRemain') + this.$t('M.otc_index_wei') + this.remainingNum
            this.errorWarningBorder = true
            return false
          } else {
            this.moneyTips = ''
            this.numberTips = ''
            this.errorWarningBorder = false
          }
        } else {
          this.numberTips = ''
          this.errorWarningBorder = false
        }
      }
    },
    // 4.0 金额input框键盘弹起事件:计算卖出量/买入量
    calculateCountValue (ref, pointLength) {
      this[ref] = this.$refs[ref].value
      // console.log(this[ref])
      // 限制输入数字和位数
      let target = this.$refs[ref]
      formatNumberInput(target, pointLength)
      // 计算卖出量/买入量
      if (this.onlineTraderStatus === 'onlineBuy') {
        if (this.$refs.buyPrice.value) {
          this.$refs.buyCount.value = this.$refs.buyPrice.value / this.price
          // this.$refs.buyCount.value = Number(this.$refs.buyCount.value).toFixed(this.pointLength)
          // 修复截取小数点后几位
          this.$refs.buyCount.value = cutOutPointLength(this.$refs.buyCount.value, this.pointLength)
          // 手续费
          this.serviceCharge = amendPrecision(this.$refs.buyCount.value, this.rate, '*')
          // this.serviceCharge = Number(this.serviceCharge).toFixed(this.pointLength)
          // this.serviceCharge = parseFloat(this.serviceCharge) // 去掉后面多余的0
          // 修复截取小数点后几位
          this.serviceCharge = cutOutPointLength(this.serviceCharge, this.pointLength)
          if (this.$refs.buyPrice.value < this.minCount) {
            this.moneyTips = this.$t('M.otc_publishAD_minlimitMoney') + this.$t('M.otc_index_wei') + this.minCount
            this.errorWarningBorder = true
            return false
          } else if (this.$refs.buyPrice.value > this.maxCount) {
            this.moneyTips = this.$t('M.otc_publishAD_maxlimitMoney') + this.$t('M.otc_index_wei') + this.maxCount
            this.numberTips = this.$t('M.otc_index_maxRemain') + this.$t('M.otc_index_wei') + this.remainingNum
            this.errorWarningBorder = true
            return false
          } else {
            this.moneyTips = ''
            this.numberTips = ''
            this.errorWarningBorder = false
          }
        } else {
          this.moneyTips = ''
          this.errorWarningBorder = false
        }
      }
      if (this.onlineTraderStatus === 'onlineSell') {
        if (this.$refs.sellPrice.value) {
          this.$refs.sellCount.value = this.$refs.sellPrice.value / this.price
          // this.$refs.sellCount.value = Number(this.$refs.sellCount.value).toFixed(this.pointLength)
          // 修复截取小数点后几位
          this.$refs.sellCount.value = cutOutPointLength(this.$refs.sellCount.value, this.pointLength)
          // 手续费
          this.serviceCharge = amendPrecision(this.$refs.sellCount.value, this.rate, '*')
          // this.serviceCharge = Number(this.serviceCharge).toFixed(this.pointLength)
          // this.serviceCharge = parseFloat(this.serviceCharge) // 去掉数字后面多余的0
          // 修复截取小数点后几位
          this.serviceCharge = cutOutPointLength(this.serviceCharge, this.pointLength)
          if (this.$refs.sellPrice.value < this.minCount) {
            this.moneyTips = this.$t('M.otc_publishAD_minlimitMoney') + this.$t('M.otc_index_wei') + this.minCount
            this.errorWarningBorder = true
            return false
          } else if (this.$refs.sellPrice.value > this.maxCount) {
            this.moneyTips = this.$t('M.otc_publishAD_maxlimitMoney') + this.$t('M.otc_index_wei') + this.maxCount
            this.numberTips = this.$t('M.otc_index_maxRemain') + this.$t('M.otc_index_wei') + this.remainingNum
            this.errorWarningBorder = true
            return false
          } else {
            this.moneyTips = ''
            this.numberTips = ''
            this.errorWarningBorder = false
          }
        } else {
          this.moneyTips = ''
          this.errorWarningBorder = false
        }
      }
    },
    // 5.0 查询otc挂单详情-商家和普通用户通用
    async querySelectedOrdersDetails () {
      const data = await querySelectedOrdersDetails({
        entrustId: this.id // 挂单id
      })
      // console.log('otc挂单详情')
      // console.log(data)
      // 提示信息
      if (!(returnAjaxMsg(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑:将返回的数据赋值到页面中
        // let detailsData = data.data.data
        let detailsData = getNestedData(data, 'data.data')
        this.userName = detailsData.userName // 挂单人姓名
        this.successTimes = detailsData.successTimes // 成交次数
        this.failTimes = detailsData.failTimes // 失败次数
        this.freezeTimes = detailsData.freezeTimes // 冻结次数
        this.remark = detailsData.remark // 备注
        this.price = detailsData.price // 报价
        this.payTypes = detailsData.payTypes // 付款方式
        this.payTerm = detailsData.payTerm // 付款期限
        // this.remainingNum = detailsData.remainCount // 剩余数量：后台增加了剩余数量字段
        this.remainingNum = amendPrecision(detailsData.entrustCount, detailsData.matchCount, '-') // 剩余数量：修复精度丢失
        this.maxCount = detailsData.maxCount // 单笔最大限额
        this.minCount = detailsData.minCount // 单笔最小限额
        this.userType = detailsData.userType // 挂单人类型（COMMON普通用户 ，MERCHANT商家）
        this.currencyName = detailsData.currencyName // 当前摘单的法币币种
        this.queryUserTradeFeeAndCoinInfo()
      }
    },
    // 6.0 查询用户交易币种手续费率以及币种详情
    async queryUserTradeFeeAndCoinInfo () {
      this.fullscreenLoading = true
      const data = await queryUserTradeFeeAndCoinInfo({
        coinId: this.partnerCoinId // 商户币种id
      })
      // console.log('用户交易币种手续费率以及币种详情')
      // console.log(data)
      // 提示信息
      if (!(returnAjaxMsg(data, this, 0))) {
        this.fullscreenLoading = false
        return false
      } else {
        this.fullscreenLoading = false
        // 返回数据正确的逻辑:将返回的数据赋值到页面中
        // let detailData = data.data.data
        let detailData = getNestedData(data, 'data.data')
        this.name = detailData.name // 最小交易量币种名字（单位）
        this.pointLength = detailData.unit // 每个币种返回的保留小数点位数限制
        // console.log(this.pointLength)
        if (this.onlineTraderStatus === 'onlineBuy') {
          this.rate = detailData.buyRate // 费率
        }
        if (this.onlineTraderStatus === 'onlineSell') {
          this.rate = detailData.sellRate // 费率
        }
      }
    },
    // 7.0 点击 确认购买 按钮提交数据
    async submitPickOrdersToBuy () {
      if (!this.tradePassword) {
        this.tradePasswordTips = this.$t('M.otc_publishAD_pleaseInput') + this.$t('M.otc_publishAD_sellpassword')
        return false
      }
      this.fullscreenLoading = true
      // console.log('购买')
      const data = await pickOrdersToBuy({
        entrustId: this.id, // 挂单id
        buyCount: this.$refs.buyCount.value, // 买入数量
        tradePassword: this.tradePassword // 交易密码
      })
      // 提示信息
      if (!(returnAjaxMsg(data, this, 1))) {
        this.fullscreenLoading = false
        return false
      } else {
        // 返回数据正确的逻辑
        this.dialogVisible = false
        this.clearInput(this.onlineTraderStatus)
        this.fullscreenLoading = false
        this.querySelectedOrdersDetails()
        this.queryUserTradeFeeAndCoinInfo()
        // 改变全局锚点状态
        this.CHANGE_OTC_ANCHOR_STATUS(true)
        // 跳转到首页的交易中订单区
        this.$router.push({path: '/OTCCenter'})
      }
    },
    // 8交易密码框获得焦点事件
    tradePasswordFocus () {
      this.tradePasswordTips = ''
    },
    // 9清空数量和金额和交易密码
    clearInput (val) {
      // 买
      if (val === 'onlineBuy') {
        this.$refs.buyCount.value = ''
        this.$refs.buyPrice.value = ''
      }
      // 卖
      if (val === 'onlineSell') {
        this.$refs.sellCount.value = ''
        this.$refs.sellPrice.value = ''
      }
      this.tradePassword = ''
    },
    // 10.0 点击 确认出售 按钮提交数据
    async submitPickOrdersToSell () {
      if (!this.tradePassword) {
        this.tradePasswordTips = this.$t('M.otc_publishAD_pleaseInput') + this.$t('M.otc_publishAD_sellpassword')
        return false
      }
      this.fullscreenLoading = true
      const data = await pickOrdersToSell({
        entrustId: this.id, // 挂单id
        sellCount: this.$refs.sellCount.value, // 卖出数量
        tradePassword: this.tradePassword // 交易密码
      })
      if (!(returnAjaxMsg(data, this, 1))) {
        this.fullscreenLoading = false
        return false
      } else {
        // 返回数据正确的逻辑
        this.fullscreenLoading = false
        this.dialogVisible = false // 关闭弹窗框
        this.clearInput(this.onlineTraderStatus) // 清空数据
        this.querySelectedOrdersDetails()
        this.queryUserTradeFeeAndCoinInfo()
        // 改变全局锚点状态
        this.CHANGE_OTC_ANCHOR_STATUS(true)
        // 跳转到首页的交易中订单区
        this.$router.push({path: '/OTCCenter'})
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      configInfo: state => state.common.footerInfo.configInfo,
      anchorStatus: state => state.OTC.anchorStatus // anchorStatus锚点状态：在全局先定义false，当用户购买或者出售时候改为true
    }),
    windowHeight () {
      return window.innerHeight
    }
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
@import "../../../static/css/scss/index.scss";

.otc-online-trader-buy-sell-box {
  > .online-trader-buy-sell-content {
    width: 1150px;
    padding: 100px 0 70px;
    margin: 0 auto;

    > .online-trader {
      display: flex;
      flex: 10;

      > .online-trader-left {
        flex: 3;

        > .shoper-info {
          box-sizing: border-box;
          width: 320px;
          height: 180px;
          padding: 40px 35px 0;
          border-radius: 5px;

          > .shoper-name {
            height: 20px;
            line-height: 20px;

            > .shang-icon {
              display: inline-block;
              width: 14px;
              height: 19px;
              vertical-align: top;
            }

            > .name {
              display: inline-block;
              margin-left: 10px;
              font-size: 16px;
            }
          }

          > .shoper-statistics {
            display: flex;
            flex: 3;
            margin-top: 40px;
            text-align: center;

            .blue {
              font-size: 14px;
            }

            .text {
              margin-top: 5px;
              font-size: 12px;
            }

            > .trader-total {
              flex: 3;
            }

            > .failed {
              flex: 3;
            }

            > .freeze {
              flex: 3;
            }
          }
        }

        > .shoper-remark {
          box-sizing: border-box;
          width: 320px;
          height: 130px;
          padding: 30px 49px 0 39px;
          margin-top: 20px;
          border-radius: 5px;

          > .remark-title {
            font-size: 14px;
          }

          > .remark-content {
            margin-top: 5px;
            font-size: 12px;
            line-height: 20px;
          }
        }
      }

      > .online-trader-right {
        flex: 7;
        box-sizing: border-box;

        > .trader-details {
          box-sizing: border-box;
          width: 760px;
          height: 500px;
          padding: 35px 0 0 48px;
          border-radius: 5px;

          > .details-row {
            height: 30px;
            line-height: 30px;

            > .details-tip {
              display: inline-block;
              font-size: 12px;
            }

            > .details-data {
              font-size: 12px;
            }

            .xilian {
              vertical-align: middle;
            }
          }

          > .form {
            .want {
              margin-top: 40px;

              > .want-text {
                margin-right: 20px;
                font-size: 20px;
              }
            }

            .sell-buy-input {
              padding: 10px 0 0;

              .red {
                border-right: 0;
              }

              .coinNameBorder {
                border-left: 0;
              }

              > .sell-sum {
                box-sizing: border-box;
                width: 190px;
                height: 36px;
                padding-left: 10px;
              }

              > .unit {
                display: inline-block;
                box-sizing: border-box;
                width: 70px;
                height: 36px;
                margin: 0 50px 0 -4px;
                font-size: 16px;
                line-height: 36px;
                text-align: center;
                vertical-align: middle;
              }
            }

            .errorInfo {
              > .number {
                display: inline-block;
                width: 320px;
                height: 30px;
                font-size: 12px;
                line-height: 30px;
              }

              > .money {
                display: inline-block;
                width: 320px;
                height: 30px;
                font-size: 12px;
                line-height: 30px;
              }
            }

            .trader-submit {
              > .trader-submit-button {
                width: 602px;
                height: 40px;
                margin-top: 20px;
                border-radius: 4px;
                font-size: 14px;
                cursor: pointer;
              }
            }
          }

          > .service-charge {
            width: 602px;
            font-size: 14px;
            text-align: right;
          }

          > .service-charge-sell {
            width: 602px;
            font-size: 14px;
            text-align: right;
          }
        }

        > .trading-notes {
          box-sizing: border-box;
          width: 760px;
          height: 122px;
          padding: 35px 0 0 48px;

          > .notes {
            > .title {
              margin-bottom: 15px;
              font-size: 14px;
            }

            > .tip {
              font-size: 14px;
              line-height: 20px;

              > .warning {
                font-size: 14px;
              }
            }
          }
        }
      }
    }
  }

  &.night {
    background-color: $mainNightBgColor;

    > .online-trader-buy-sell-content {
      > .online-trader {
        > .online-trader-left {
          > .shoper-info {
            background-color: #1c1f32;

            > .shoper-name {
              > .name {
                color: #fff;
              }
            }

            > .shoper-statistics {
              .blue {
                color: #3e79d6;
              }

              .text {
                color: #a9bed4;
              }
            }
          }

          > .shoper-remark {
            background-color: #1c1f32;

            > .remark-title {
              color: #fff;
            }

            > .remark-content {
              color: #a9bed4;
            }
          }
        }

        > .online-trader-right {
          > .trader-details {
            background-color: #1c1f32;

            > .details-row {
              > .details-tip {
                color: #a9bed4;
              }

              > .details-data {
                color: #fff;
              }
            }

            > .form {
              .want {
                > .want-text {
                  color: #3e79d6;
                }
              }

              .sell-buy-input {
                .red {
                  border: 1px solid #d45858;
                  border-right: 0;
                }

                .coinNameBorder {
                  border: 1px solid #d45858;
                  border-left: 0;
                }

                > .sell-sum {
                  color: #a9bed4;
                  background-color: #2d3651;
                }

                > .unit {
                  color: #338ff5;
                  background-color: #303f59;
                }
              }

              .errorInfo {
                > .number {
                  color: #d45858;
                }

                > .money {
                  color: #d45858;
                }
              }

              .trader-submit {
                > .trader-submit-button {
                  color: #fff;
                }

                > .trader-submit-sell {
                  background-color: #008069;
                }

                > .trader-submit-buy {
                  background-color: #d45858;
                }
              }
            }

            > .service-charge {
              color: #a9bed4;

              .service-data {
                color: #bb4c4c;
              }

              .rate-data {
                color: #bb4c4c;
              }
            }

            > .service-charge-sell {
              color: #a9bed4;

              .service-data-sell {
                color: #008069;
              }

              .rate-data-sell {
                color: #008069;
              }
            }
          }

          > .trading-notes {
            > .notes {
              > .title {
                color: #bb4c4c;
              }

              > .tip {
                color: #7d90ac;

                > .warning {
                  color: #bb4c4c;
                }
              }
            }
          }
        }

        > .password-dialog {
          .error-info {
            > .tips {
              color: #d45858;
            }
          }
        }
      }
    }
  }

  &.day {
    background-color: $mainDayBgColor;

    > .online-trader-buy-sell-content {
      > .online-trader {
        > .online-trader-left {
          > .shoper-info {
            > .shoper-name {
              > .name {
                color: #333;
              }
            }

            > .shoper-statistics {
              .blue {
                color: #3e79d6;
              }

              .text {
                color: #333;
              }
            }
          }

          > .shoper-remark {
            > .remark-title {
              color: #333;
            }

            > .remark-content {
              color: #7d90ac;
            }
          }
        }

        > .online-trader-right {
          > .trader-details {
            > .details-row {
              > .details-tip {
                color: #7d90ac;
              }

              > .details-data {
                color: #333;
              }
            }

            > .form {
              .want {
                > .want-text {
                  color: #3e79d6;
                }
              }

              .sell-buy-input {
                .red {
                  border: 1px solid #d45858;
                }

                .coinNameBorder {
                  border: 1px solid #d45858;
                }

                > .sell-sum {
                  border: 1px solid rgba(236, 241, 248, 1);
                  color: #333;
                  background-color: #fff;
                }

                > .unit {
                  border: 1px solid rgba(236, 241, 248, 1);
                  color: #7ea9e4;
                  background-color: #cbddf4;
                }
              }

              .errorInfo {
                > .number {
                  color: #d45858;
                }

                > .money {
                  color: #d45858;
                }
              }

              .trader-submit {
                > .trader-submit-button {
                  color: #fff;
                }

                > .trader-submit-sell {
                  background-color: #008069;
                }

                > .trader-submit-buy {
                  background-color: #d45858;
                }
              }
            }

            > .service-charge {
              color: #333;

              .service-data {
                color: #bb4c4c;
              }

              .rate-data {
                color: #bb4c4c;
              }
            }

            > .service-charge-sell {
              color: #333;

              .service-data-sell {
                color: #008069;
              }

              .rate-data-sell {
                color: #008069;
              }
            }
          }

          > .trading-notes {
            > .notes {
              > .title {
                color: #bb4c4c;
              }

              > .tip {
                color: #7d90ac;

                > .warning {
                  color: #b43b3b;
                }
              }
            }
          }
        }

        > .password-dialog {
          .error-info {
            > .tips {
              color: #d45858;
            }
          }
        }
      }
    }
  }
}
</style>
