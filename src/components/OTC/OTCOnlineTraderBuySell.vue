<template>
  <div
    class="otc-online-trader-buy-sell-box otc"
    :class="{'day':theme == 'day','night':theme == 'night' }"
    :style="{'min-height': windowHeight - 293 - 120 + 'px'}"
  >
    <!-- otc在线交易 摘单 页面 -->
    <div class="online-trader-buy-sell-content">
      <div class="online-trader">
        <!-- 交易左边 -->
        <div class="online-trader-left">
            <!-- 左上部分商家信息部分 -->
            <div class="shopper-info">
                <!-- 商家名字 -->
                <div class="shopper-name">
                  <!-- 如果是商家用户就显示商家图标 -->
                  <img
                    src="../../assets/develop/shangjia.png"
                    class="merchants-icon"
                    v-if="this.userType === 'MERCHANT'"
                  >
                  <!-- 商户名称 -->
                  <span class="name font-weight700">
                    {{userName}}
                  </span>
                </div>
                <!-- 商家交易统计 -->
                <div class="shopper-statistics">
                  <!-- 成交次数 -->
                  <div class="trader-total">
                    <p class="blue">{{$scientificToNumber(successTimes)}}</p>
                    <p class="text">{{$t('M.otc_index_tradeTimes')}}</p>
                  </div>
                  <!-- 失败次数 -->
                  <div class="failed">
                    <p class="blue">{{$scientificToNumber(failTimes)}}</p>
                    <p class="text">{{$t('M.otc_index_failureTimes')}}</p>
                  </div>
                  <!-- 账户冻结次数 -->
                  <div class="freeze">
                    <p class="blue">{{$scientificToNumber(freezeTimes)}}</p>
                    <p class="text">{{$t('M.otc_index_freezeTimes')}}</p>
                  </div>
                </div>
            </div>
            <!-- 左下部分商家备注部分 -->
            <div class="shopper-remark">
              <!-- 备注： -->
              <p class="remark-title font-size14">{{$t('M.comm_remark')}}：</p>
              <p class="remark-content font-size12">{{remark}}</p>
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
                  {{$scientificToNumber(price)}}{{currencyName}}
                </span>
              </div>
              <!-- 限额 -->
              <div class="details-row">
                <span class="details-tip">
                  <!-- 限额： -->
                  {{$t('M.otc_index_priceLimit')}}：
                </span>
                <span class="details-data">
                  {{$scientificToNumber(minCount)}}~{{$scientificToNumber(maxCount)}}{{currencyName}}
                </span>
              </div>
              <!-- 剩余数量 -->
              <div class="details-row">
                <span class="details-tip">
                  <!-- 剩余可买/可卖： -->
                  {{onlineTraderStatus === 'onlineSell' ? $t('M.otc_index_reduceQuantitySell') : $t('M.otc_index_reduceQuantityBuy')}}：
                </span>
                <span class="details-data">
                  {{$scientificToNumber(remainingNum)}}{{coinName}}
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
                  <!--30分钟-->
                  {{payTerm/60}}{{$t('M.otc_index_minute')}}
                </span>
              </div>
              <!--表单部分-->
              <div class="form">
                <el-form
                  :label-position="labelPosition"
                  label-width="80px"
                >
                  <el-form-item>
                    <!-- 标题 -->
                    <div class="want">
                      <!--您想出售多少/您想购买多少-->
                      <span class="want-text font-size20">
                        {{onlineTraderStatus === 'onlineSell' ? $t('M.otc_index_sellMount') : $t('M.otc_index_buyMount')}}
                      </span>
                      <!--可用余额-->
                      <span
                        class="charge-money font-size12"
                        v-show="onlineTraderStatus === 'onlineSell'"
                      >
                        {{$t('M.otc_available_balance')}}:{{$scientificToNumber(sellTotal)}}
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
                        onpaste="return false"
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
                        onpaste="return false"
                      >
                      <span
                        class="unit"
                        :class = "{ coinNameBorder: errorWarningBorder }"
                      >
                        {{coinName}}
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
                        onpaste="return false"
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
                        onpaste="return false"
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
                        @click.prevent="showPayPasswordDialog(onlineTraderStatus)"
                      >
                        <!-- 确定出售 -->
                        {{$t('M.otc_index_ensureSell')}}
                      </button>
                      <button
                        class="trader-submit-button trader-submit-buy"
                        v-if="onlineTraderStatus === 'onlineBuy'"
                        @click.prevent="showPayPasswordDialog(onlineTraderStatus)"
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
                  {{$scientificToNumber(serviceCharge)}} {{coinName}}
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
                  {{$scientificToNumber(serviceCharge)}} {{coinName}}
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
                <h4 class="title font-size14">*{{$t('M.otc_index_tradeKnow')}}：</h4>
                <p class="tip">
                  1. {{$t('M.otc_index_tradeKnowDetail1')}}<span class="warning font-size14">{{configInfo.otcUnpaidTimes}}{{$t('M.otc_ci')}}</span>，{{$t('M.otc_index_tradeKnowDetail2')}}
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
            :visible.sync="pickOrderTradePwdDialogStatus"
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
                @keyup.enter="pickOrdersToBuyOrSell"
                onpaste="return false"
              >
            </div>
            <!-- 错误提示 -->
            <div class="error-info">
              <div class="tips">
                {{tradePasswordTips}}
              </div>
            </div>
            <!--暂时关闭交易密码验证-->
            <span
              class="close-pwd-tip cursor-pointer display-inline-block"
              @click.prevent="closePwdJump"
            >
              {{$t('M.user_payPassword_switch')}}
            </span>
            <span
              slot="footer"
              class="dialog-footer"
            >
              <!-- 提交 -->
              <el-button
                type="primary"
                @click="pickOrdersToBuyOrSell"
              >
                {{$t('M.otc_submit')}}
              </el-button>
              <!--忘记交易密码？-->
              <div class="text-align-r">
                <span
                  class="forget-pwd-tip cursor-pointer display-inline-block"
                  @click.prevent="forgetPwdJump"
                >
                  {{$t('M.user_payPassword')}}
                </span>
              </div>
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
import {
  // returnAjaxMsg,
  getNestedData,
  isNeedPayPasswordAjax
} from '../../utils/commonFunc'
import {
  mapMutations,
  mapState,
  mapActions
} from 'vuex'
export default {
  components: {
    IconFontCommon //  字体图标组件
  },
  data () {
    return {
      // input框输入错误显示红色边框状态
      errorWarningBorder: false,
      // 弹窗显示状态
      pickOrderTradePwdDialogStatus: false,
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
      // name: '',
      coinName: '',
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
      //  表单label放置的位置
      labelPosition: 'top',
      //  在线买卖的类型状态 购买（onlineBuy）和 出售（onlineSell)
      onlineTraderStatus: '',
      // 出售数量
      sellCount: '',
      // 购买数量
      buyCount: '',
      // 出售金额
      sellPrice: '',
      // 购买金额
      buyPrice: '',
      // 交易密码
      tradePassword: '',
      // 往后台传送的参数 挂单id（otc首页挂单列表中每行的币种id）
      entryOrdersID: '',
      // 商户币种id
      partnerCoinId: '',
      // 挂单人类型（COMMON普通用户 ，MERCHANT商家）
      userType: '',
      // 数量错误提示
      numberTips: '',
      // 金额错误提示
      moneyTips: '',
      // 密码错误提示
      tradePasswordTips: '',
      // 当前币种返回的保留小数点位数限制
      pointLength: 4,
      // 当前金额小数点限制位数
      moneyPointLength: 2, // 当前金额小数点限制位数-总金额和最低最高限额保留2位
      // 是否需要交易密码
      isNeedPayPassword: true,
      sellTotal: '' // 用户资产可用余额20190320增加新字段展示
    }
  },
  async created () {
    this.isNeedPayPassword = await isNeedPayPasswordAjax(this)
    console.log(this.isNeedPayPassword)
    // 1.0 从OTCCenter传过来的URL中获取的
    // console.log(this.$route.params)
    // 买卖类型
    this.onlineTraderStatus = this.$route.params.styleId
    // 从otc首页传过来的挂单id
    this.entryOrdersID = this.$route.params.id
    // OTC首页传过来的币种id
    this.partnerCoinId = this.$route.params.partnerCoinId
    // 2.0 查询选中的挂单，利用挂单id请求详情信息
    if (this.entryOrdersID) {
      this.querySelectedOrdersDetails()
    }
  },
  // mounted () {},
  // activated () {},
  // update () {},
  // beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      // 0.1 改变全局锚点状态方法
      'CHANGE_OTC_ANCHOR_STATUS',
      'CHANGE_USER_CENTER_ACTIVE_NAME',
      'CHANGE_PASSWORD_USEABLE',
      'CHANGE_REF_ACCOUNT_CREDITED_STATE'
    ]),
    ...mapActions([
      'REFRESH_USER_INFO_ACTION'
    ]),
    // 0.4 输入限制
    formatInput (ref, pointLength) {
      let target = this.$refs[ref]
      formatNumberInput(target, pointLength)
    },
    // 1.0 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'date')
    },
    // 2.0 显示输入密码框
    async showPayPasswordDialog (tradeType) {
      // 用户交易密码是否锁定判断
      await this.REFRESH_USER_INFO_ACTION()
      let isPaypasswordLocked = getNestedData(this.loginStep1Info, 'payPasswordRemainCount') ? false : true
      console.log(isPaypasswordLocked)
      this.CHANGE_PASSWORD_USEABLE(isPaypasswordLocked)
      if (this.isLockedPayPassword) return false
      //
      this.isNeedPayPassword = await isNeedPayPasswordAjax(this)
      switch (tradeType) {
        // 在线买
        case 'onlineBuy':
          if (!this.$refs.buyCount.value) {
            this.numberTips = this.$t('M.otc_index_inputBuyMount')
            return false
          } else if (!this.$refs.buyPrice.value) {
            this.moneyTips = this.$t('M.otc_index_inputBuyMoney')
            return false
          } else if (this.numberTips || this.moneyTips) {
            return false
          }
          if (this.isNeedPayPassword) {
            this.pickOrderTradePwdDialogStatus = true
          } else {
            // 2018129封装提交摘单买入和卖出方法
            this.pickOrdersToBuyOrSell()
          }
          break
        // 在线卖
        case 'onlineSell':
          if (!this.$refs.sellCount.value) {
            this.numberTips = this.$t('M.otc_index_inputSellMount')
            return false
          } else if (!this.$refs.sellPrice.value) {
            this.moneyTips = this.$t('M.otc_index_inputBuyMoney')
            return false
          } else if (this.numberTips || this.moneyTips) {
            return false
          }
          if (this.isNeedPayPassword) {
            this.pickOrderTradePwdDialogStatus = true
          } else {
            // 2018129封装提交摘单买入和卖出方法
            this.pickOrdersToBuyOrSell()
          }
          break
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
        this.$refs.buyPrice.value = this.$refs.buyCount.value * this.price
        // 修复截取小数点后几位
        this.$refs.buyPrice.value = cutOutPointLength(this.$refs.buyPrice.value, this.moneyPointLength)
        if (this.$refs.buyCount.value) {
          // 手续费
          this.serviceCharge = amendPrecision(this.$refs.buyCount.value, this.rate, '*')
          // 修复截取小数点后几位
          this.serviceCharge = cutOutPointLength(this.serviceCharge, this.pointLength)
          if (this.$refs.buyCount.value * this.price - this.minCount < 0) {
            // 单笔最小限额为
            this.moneyTips = this.$t('M.otc_publishAD_minlimitMoney') + this.$t('M.otc_index_wei') + this.minCount
            this.errorWarningBorder = true
            return false
          } else if (this.$refs.buyCount.value * this.price - this.maxCount > 0) {
            // 单笔最大限额为
            this.moneyTips = this.$t('M.otc_publishAD_maxlimitMoney') + this.$t('M.otc_index_wei') + this.maxCount
            // 最大剩余数量为
            this.numberTips = this.$t('M.otc_index_maxRemain') + this.$t('M.otc_index_wei') + this.remainingNum
            this.errorWarningBorder = true
            return false
          } else if (this.$refs.buyCount.value - this.remainingNum > 0) {
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
          this.$refs.buyPrice.value = ''
        }
      }
      // 卖
      if (this.onlineTraderStatus === 'onlineSell') {
        this.$refs.sellPrice.value = this.$refs.sellCount.value * this.price
        // 修复截取小数点后几位
        this.$refs.sellPrice.value = cutOutPointLength(this.$refs.sellPrice.value, this.moneyPointLength)
        if (this.$refs.sellCount.value) {
          // 手续费
          this.serviceCharge = amendPrecision(this.$refs.sellCount.value, this.rate, '*')
          // 修复截取小数点后几位
          this.serviceCharge = cutOutPointLength(this.serviceCharge, this.pointLength)
          if (this.$refs.sellCount.value * this.price - this.minCount < 0) {
            this.moneyTips = this.$t('M.otc_publishAD_minlimitMoney') + this.$t('M.otc_index_wei') + this.minCount
            this.errorWarningBorder = true
            return false
          } else if (this.$refs.sellCount.value * this.price - this.maxCount > 0) {
            this.moneyTips = this.$t('M.otc_publishAD_maxlimitMoney') + this.$t('M.otc_index_wei') + this.maxCount
            this.numberTips = this.$t('M.otc_index_maxRemain') + this.$t('M.otc_index_wei') + this.remainingNum
            this.errorWarningBorder = true
            return false
          } else if (this.$refs.sellCount.value - this.remainingNum > 0) {
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
          this.$refs.sellPrice.value = ''
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
        this.$refs.buyCount.value = this.$refs.buyPrice.value / this.price
        // 修复截取小数点后几位
        this.$refs.buyCount.value = cutOutPointLength(this.$refs.buyCount.value, this.pointLength)
        if (this.$refs.buyPrice.value) {
          // 手续费
          this.serviceCharge = amendPrecision(this.$refs.buyCount.value, this.rate, '*')
          // 修复截取小数点后几位
          this.serviceCharge = cutOutPointLength(this.serviceCharge, this.pointLength)
          if (this.$refs.buyPrice.value - this.minCount < 0) {
            this.moneyTips = this.$t('M.otc_publishAD_minlimitMoney') + this.$t('M.otc_index_wei') + this.minCount
            this.errorWarningBorder = true
            return false
          } else if (this.$refs.buyPrice.value - this.maxCount > 0) {
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
          this.$refs.buyCount.value = ''
        }
      }
      if (this.onlineTraderStatus === 'onlineSell') {
        this.$refs.sellCount.value = this.$refs.sellPrice.value / this.price
        // 修复截取小数点后几位
        this.$refs.sellCount.value = cutOutPointLength(this.$refs.sellCount.value, this.pointLength)
        if (this.$refs.sellPrice.value) {
          // 手续费
          this.serviceCharge = amendPrecision(this.$refs.sellCount.value, this.rate, '*')
          // 修复截取小数点后几位
          this.serviceCharge = cutOutPointLength(this.serviceCharge, this.pointLength)
          if (this.$refs.sellPrice.value - this.minCount < 0) {
            this.moneyTips = this.$t('M.otc_publishAD_minlimitMoney') + this.$t('M.otc_index_wei') + this.minCount
            this.errorWarningBorder = true
            return false
          } else if (this.$refs.sellPrice.value - this.maxCount > 0) {
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
          this.$refs.sellCount.value = ''
        }
      }
    },
    // 5.0 查询otc挂单详情-商家和普通用户通用
    async querySelectedOrdersDetails () {
      const data = await querySelectedOrdersDetails({
        entrustId: this.entryOrdersID
      })
      // 正确逻辑
      // console.log('otc挂单详情')
      // console.log(data)
      if (!data) return false
      if (data.data) {
        let detailsData = getNestedData(data, 'data')
        this.userName = getNestedData(detailsData, 'userName') // 挂单人姓名
        this.successTimes = getNestedData(detailsData, 'successTimes') // 成交次数
        this.failTimes = getNestedData(detailsData, 'failTimes') // 失败次数
        this.freezeTimes = getNestedData(detailsData, 'freezeTimes') // 冻结次数
        this.remark = getNestedData(detailsData, 'remark') // 备注
        this.price = getNestedData(detailsData, 'price') // 报价
        this.payTypes = getNestedData(detailsData, 'payTypes') // 付款方式
        this.payTerm = getNestedData(detailsData, 'payTerm') // 付款期限
        this.remainingNum = amendPrecision(detailsData.entrustCount, detailsData.matchCount, '-') // 剩余数量：修复精度丢失
        this.maxCount = getNestedData(detailsData, 'maxCount') // 单笔最大限额
        this.minCount = getNestedData(detailsData, 'minCount') // 单笔最小限额
        this.userType = getNestedData(detailsData, 'userType') // 挂单人类型（COMMON普通用户 ，MERCHANT商家）
        this.currencyName = getNestedData(detailsData, 'currencyName') // 当前摘单的法币币种
        this.sellTotal = getNestedData(detailsData, 'sellTotal') // 用户资产可用余额
        this.queryUserTradeFeeAndCoinInfo()
      }
    },
    // 6.0 查询用户交易币种手续费率以及币种详情
    async queryUserTradeFeeAndCoinInfo () {
      const data = await queryUserTradeFeeAndCoinInfo({
        coinId: this.partnerCoinId // 商户币种id
      })
      // console.log('用户交易币种手续费率以及币种详情11')
      // console.log(data)
      // 返回数据正确的逻辑:将返回的数据赋值到页面中
      if (!data) return false
      let detailData = getNestedData(data, 'data')
      this.coinName = getNestedData(detailData, 'name') // 最小交易量币种名字（单位）
      this.pointLength = getNestedData(detailData, 'unit') // 每个币种返回的保留小数点位数限制
      if (this.onlineTraderStatus === 'onlineBuy') {
        this.rate = getNestedData(detailData, 'buyRate') // 费率
      }
      if (this.onlineTraderStatus === 'onlineSell') {
        this.rate = getNestedData(detailData, 'sellRate') // 费率
      }
    },
    // 2018129封装提交摘单买入和卖出方法
    pickOrdersToBuyOrSell: _.debounce(async function () {
      if (this.isNeedPayPassword && !this.tradePassword) {
        this.tradePasswordTips = this.$t('M.otc_publishAD_pleaseInput') + this.$t('M.otc_publishAD_sellpassword')
        return false
      }
      // 判断是卖出还是买入分别调用不同的接口和传入不同的参数
      let data
      // 卖
      switch (this.onlineTraderStatus) {
        case 'onlineSell':
          data = await pickOrdersToSell({
            // entrustId: this.id, // 挂单id
            entrustId: this.entryOrdersID, // 挂单id
            sellCount: this.$refs.sellCount.value, // 卖出数量
            tradePassword: this.tradePassword // 交易密码
          })
          console.log(this.onlineTraderStatus)
          break
        case 'onlineBuy':
          data = await pickOrdersToBuy({
            entrustId: this.entryOrdersID, // 挂单id
            buyCount: this.$refs.buyCount.value, // 买入数量
            tradePassword: this.tradePassword // 交易密码
          })
          console.log(this.onlineTraderStatus)
          break
      }
      // 返回数据正确的逻辑
      this.pickOrderTradePwdDialogStatus = false // 关闭弹窗框
      this.tradePassword = '' // 清空交易密码
      console.log(data)
      if (!data) return false
      if (data) {
        this.clearInput(this.onlineTraderStatus) // 清空数据
        this.querySelectedOrdersDetails()
        this.queryUserTradeFeeAndCoinInfo()
        // 改变全局锚点状态
        this.CHANGE_OTC_ANCHOR_STATUS(true)
        // 跳转到首页的交易中订单区
        this.$goToPage('/OTCCenter')
      }
    }, 500),
    // 2018129封装提交摘单买入和卖出方法
    // 8交易密码框获得焦点事件
    tradePasswordFocus () {
      this.tradePasswordTips = ''
    },
    // 9清空数量和金额和交易密码
    clearInput (val) {
      // switch 改写
      this.tradePassword = ''
      switch (val) {
        // 买
        case 'onlineBuy':
          this.$refs.buyCount.value = ''
          this.$refs.buyPrice.value = ''
          break
        // 卖
        case 'onlineSell':
          this.$refs.sellCount.value = ''
          this.$refs.sellPrice.value = ''
          break
      }
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
  // filter: {},
  computed: {
    ...mapState({
      language: state => state.common.language, // 当前选中语言
      theme: state => state.common.theme,
      configInfo: state => state.common.footerInfo.configInfo,
      anchorStatus: state => state.OTC.anchorStatus, // anchorStatus锚点状态：在全局先定义false，当用户购买或者出售时候改为true
      // 交易密码是否被锁定
      isLockedPayPassword: state => state.common.isLockedPayPassword,
      loginStep1Info: state => state.user.loginStep1Info
    }),
    windowHeight () {
      console.log(window.innerHeight)
      return window.innerHeight
    }
  },
  watch: {
    language (newVal) {
      console.log(newVal)
      this.tradePasswordTips = ''
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
@import "../../assets/CSS/index";

.otc-online-trader-buy-sell-box {
  > .online-trader-buy-sell-content {
    width: 1300px;
    margin: 120px auto 70px;

    > .online-trader {
      display: flex;
      flex: 10;

      > .online-trader-left {
        flex: 3;

        > .shopper-info {
          box-sizing: border-box;
          width: 340px;
          height: 180px;
          padding: 40px 35px 0;
          border-radius: 5px;

          > .shopper-name {
            height: 20px;
            line-height: 20px;

            > .merchants-icon {
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

          > .shopper-statistics {
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

            > .trader-total,
            .failed,
            .freeze {
              flex: 3;
            }
          }
        }

        > .shopper-remark {
          box-sizing: border-box;
          width: 340px;
          min-height: 130px;
          padding: 30px 49px 5px 39px;
          margin-top: 20px;
          border-radius: 5px;

          > .remark-content {
            margin-top: 5px;
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
                vertical-align: super;
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
                vertical-align: top;
              }
            }

            .errorInfo {
              > .number {
                display: inline-block;
                width: 310px;
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
          padding: 35px 0 0 48px;

          > .notes {
            > .title {
              margin-bottom: 15px;
            }

            > .tip {
              font-size: 14px;
              line-height: 24px;
            }
          }
        }
      }
    }
  }

  /deep/ {
    .icon {
      margin-right: 2px;
    }

    .el-form--label-top {
      .el-button--mini {
        padding: 4px 8px;
      }
    }

    .password-dialog {
      .el-dialog {
        width: 350px;
        height: 240px;
        border-radius: 4px;

        .el-dialog__header {
          padding: 10px 20px;
          border-radius: 4px 4px 0 0;

          .el-dialog__title {
            font-size: 14px;
          }

          .el-dialog__headerbtn {
            top: 15px;
            right: 10px;
          }
        }

        .el-dialog__body {
          padding: 15px 20px 10px 30px;
          font-size: 12px;

          .input {
            margin-top: 13px;

            .password-input {
              display: inline-block;
              width: 280px;
              height: 36px;
              padding-left: 10px;
              border-radius: 4px;
            }
          }

          .error-info {
            height: 20px;
            padding-top: 5px;
          }

          .close-pwd-tip {
            margin-top: 5px;
          }
        }

        .el-dialog__footer {
          padding: 0;
          font-size: 12px;
          text-align: center;

          .el-button {
            width: 290px;
            padding: 9px 20px;
            border: 0;
            border-radius: 2px;
            font-size: 12px;
          }

          .forget-pwd-tip {
            padding: 8px 20px 0 0;
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
          > .shopper-info {
            background-color: #1c1f32;

            > .shopper-name {
              > .name {
                color: $mainDayBgColor;
              }
            }

            > .shopper-statistics {
              .blue {
                color: $mainColor;
              }

              .text {
                color: $mainNightTitleColor;
              }
            }
          }

          > .shopper-remark {
            background-color: $mainContentNightBgColor;

            > .remark-title {
              color: $mainDayBgColor;
            }

            > .remark-content {
              color: $mainNightTitleColor;
            }
          }
        }

        > .online-trader-right {
          > .trader-details {
            background-color: $mainContentNightBgColor;

            > .details-row {
              > .details-tip {
                color: $mainNightTitleColor;
              }

              > .details-data {
                color: $mainDayBgColor;
              }
            }

            > .form {
              .want {
                > .want-text {
                  color: $mainColor;
                }

                > .charge-money {
                  color: $mainNightTitleColor;
                }
              }

              .sell-buy-input {
                .red {
                  border: 1px solid $upColor;
                  border-right: 0;
                }

                .coinNameBorder {
                  border: 1px solid $upColor;
                  border-left: 0;
                }

                > .sell-sum {
                  color: $mainNightTitleColor;
                  background-color: #2d3651;
                }

                > .unit {
                  color: $mainColor;
                  background-color: #303f59;
                }
              }

              .errorInfo {
                > .number {
                  color: $upColor;
                }

                > .money {
                  color: $upColor;
                }
              }

              .trader-submit {
                > .trader-submit-button {
                  color: $mainDayBgColor;
                }

                > .trader-submit-sell {
                  background-color: $otcGreen;
                }

                > .trader-submit-buy {
                  background-color: $upColor;
                }
              }
            }

            > .service-charge {
              color: $mainNightTitleColor;

              .service-data {
                color: $upColor;
              }

              .rate-data {
                color: $upColor;
              }
            }

            > .service-charge-sell {
              color: $mainNightTitleColor;

              .service-data-sell {
                color: $otcGreen;
              }

              .rate-data-sell {
                color: $otcGreen;
              }
            }
          }

          > .trading-notes {
            > .notes {
              > .title {
                color: $upColor;
              }

              > .tip {
                color: #7d90ac;

                > .warning {
                  color: $upColor;
                }
              }
            }
          }
        }
      }
    }

    /deep/ {
      .password-dialog {
        .el-dialog {
          background-color: $dialogColor1;

          .el-dialog__header {
            background-color: $dialogColor2;

            .el-dialog__title {
              color: $dialogColor4;
            }
          }

          .el-dialog__body {
            .password-input {
              border: 1px solid $dialogColor6;
              color: $mainColorOfWhite;
              background-color: $dialogColor3;
            }

            .tips {
              color: $upColor;
            }

            .close-pwd-tip {
              color: $mainColor;
            }
          }

          .el-dialog__footer {
            .el-button--primary {
              color: $mainColorOfWhite;
              background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
            }

            .forget-pwd-tip {
              color: $mainColor;
            }
          }
        }
      }
    }
  }

  &.day {
    background-color: $mainBgColorOfDay;

    > .online-trader-buy-sell-content {
      > .online-trader {
        > .online-trader-left {
          > .shopper-info {
            background-color: $mainDayBgColor;
            box-shadow: 0 0 6px $boxShadowColorOfDay;

            > .shopper-name {
              > .name {
                color: $dayMainTitleColor;
              }
            }

            > .shopper-statistics {
              .blue {
                color: $mainColor;
              }

              .text {
                color: $dayMainTitleColor;
              }
            }
          }

          > .shopper-remark {
            background-color: $mainDayBgColor;
            box-shadow: 0 0 6px $boxShadowColorOfDay;

            > .remark-title {
              color: $dayMainTitleColor;
            }

            > .remark-content {
              color: $dayMainTitleColor;
            }
          }
        }

        > .online-trader-right {
          > .trader-details {
            background-color: $mainDayBgColor;
            box-shadow: 0 0 6px $boxShadowColorOfDay;

            > .details-row {
              > .details-tip {
                color: $fontColorSecondaryOfDay;
              }

              > .details-data {
                color: $dayMainTitleColor;
              }
            }

            > .form {
              .want {
                > .want-text {
                  color: $mainColor;
                }

                > .charge-money {
                  color: $fontColorSecondaryOfDay;
                }
              }

              .sell-buy-input {
                .red {
                  border: 1px solid $upColor;
                }

                .coinNameBorder {
                  border: 1px solid $upColor;
                }

                > .sell-sum {
                  border: 1px solid $borderColorOfDay;
                  color: $dayMainTitleColor;
                  background-color: $mainColorOfWhite;
                }

                > .unit {
                  border: 1px solid $coinBgColorOfDay;
                  color: $mainColor;
                  background-color: $coinBgColorOfDay;
                }
              }

              .errorInfo {
                > .number {
                  color: $upColor;
                }

                > .money {
                  color: $upColor;
                }
              }

              .trader-submit {
                > .trader-submit-button {
                  color: $mainColorOfWhite;
                }

                > .trader-submit-sell {
                  background-color: $otcGreen;
                }

                > .trader-submit-buy {
                  background-color: $upColor;
                }
              }
            }

            > .service-charge {
              color: $dayMainTitleColor;

              .service-data {
                color: $upColor;
              }

              .rate-data {
                color: $upColor;
              }
            }

            > .service-charge-sell {
              color: $dayMainTitleColor;

              .service-data-sell {
                color: $otcGreen;
              }

              .rate-data-sell {
                color: $otcGreen;
              }
            }
          }

          > .trading-notes {
            > .notes {
              > .title {
                color: $upColor;
              }

              > .tip {
                color: $fontColorSecondaryOfDay;

                > .warning {
                  color: $upColor;
                }
              }
            }
          }
        }
      }
    }

    /deep/ {
      .password-dialog {
        .el-dialog {
          background-color: $mainColorOfWhite;

          .el-dialog__header {
            background-color: $dialogColor7;

            .el-dialog__title {
              color: $dayMainTitleColor;
            }
          }

          .el-dialog__body {
            .password-input {
              border: 1px solid $dialogColor8;
              color: $dayMainTitleColor;
              background-color: $mainColorOfWhite;
              box-shadow: inset 0 2px 4px 0 rgba(243, 243, 243, 1);
            }

            .tips {
              color: $upColor;
            }

            .close-pwd-tip {
              color: $mainColor;
            }
          }

          .el-dialog__footer {
            .el-button--primary {
              color: $mainColorOfWhite;
              background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
            }

            .forget-pwd-tip {
              color: $mainColor;
            }
          }
        }
      }
    }
  }
}
</style>
