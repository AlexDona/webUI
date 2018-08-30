<template>
  <div class="otc-online-trader-buy-sell-box otc">
    <!-- otc在线交易 摘单 页面 -->
    <!-- 1.0 导航 -->
    <NavCommon/>
    <!-- 2.0 otc在线交易买卖 -->
    <div class="online-trader-buy-sell-content">
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
                        alt=""
                        class="shang-icon"
                        v-if="this.userType === 'MERCHANT'"
                      >
                      <!-- 诚信商贸 -->
                      <span class="name">{{userName}}</span>
                    </div>
                    <!-- 商家交易统计 -->
                    <div class="shoper-statistics">
                      <div class="trader-total">
                        <p class="blue">{{tradeTimes}}</p>
                        <p class="text">交易次数</p>
                      </div>
                      <div class="failed">
                        <p class="blue">{{freezeTimes}}</p>
                        <p class="text">失败次数</p>
                      </div>
                      <div class="freeze">
                        <p class="blue">{{freezeTimes}}</p>
                        <p class="text">冻结次数</p>
                      </div>
                    </div>
                </div>
                <!-- 左下部分商家备注部分 -->
                <div class="shoper-remark">
                  <p class="remark-title">备注：</p>
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
                      报价：
                    </span>
                    <span class="details-data">
                      {{price}}CNY
                    </span>
                  </div>
                  <!-- 最小交易量 -->
                  <div class="details-row">
                    <span class="details-tip">
                      限额：
                    </span>
                    <span class="details-data">
                      {{minCount}}~{{maxCount}}CNY
                    </span>
                  </div>
                  <!-- 剩余数量 -->
                  <div class="details-row">
                    <span class="details-tip">
                      剩余数量：
                    </span>
                    <span class="details-data">
                      {{remainingNum}}{{name}}
                    </span>
                  </div>
                  <!-- 付款方式 -->
                  <div class="details-row">
                    <span class="details-tip">
                      付款方式：
                    </span>
                    <!-- 1支付宝 -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-zhifubao1"
                      v-if="payTypes[0] === '1'"
                    />
                    <!-- 2微信 -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-weixin1"
                      v-if="payTypes[1] === '1'"
                    />
                    <!-- 3银行卡 -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-yinhangqia"
                      v-if="payTypes[2] === '1'"
                    />
                     <!-- 4西联汇款 -->
                    <span v-if="payTypes[3] == '1'">
                      <img src="../../assets/user/xilian.png" alt="" class="xilian">
                    </span>
                    <!--  5PAYPAL -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-paypal"
                      v-if="payTypes[4] === '1'"
                    />
                  </div>
                  <!-- 付款期限 -->
                  <div class="details-row">
                    <span class="details-tip">
                      付款期限：
                    </span>
                    <span class="details-data">
                      {{payTerm/60}}分钟
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
                              您想出售多少
                          </span>
                          <span
                            class="want-text"
                            v-show="onlineTraderStatus === 'onlineBuy'"
                          >
                              您想购买多少
                          </span>
                          <span
                            class="charge-money"
                            v-show="onlineTraderStatus === 'onlineSell'"
                          >
                            <el-button
                              type="primary"
                              size="mini"
                            >
                              充币
                            </el-button>
                          </span>
                        </div>
                        <!-- input框部分 -->
                        <div class="sell-buy-input">
                          <!-- 1.0 数量部分 -->
                          <!--出售-->
                          <input
                            type="text"
                            placeholder="卖出量"
                            class="sell-sum"
                            v-if="onlineTraderStatus === 'onlineSell'"
                            ref="sellCount"
                            @keyup="calculatePriceValue('sellCount')"
                          >
                          <!--购买-->
                          <input
                            type="text"
                            placeholder="买入量"
                            class="sell-sum"
                            v-if="onlineTraderStatus === 'onlineBuy'"
                            ref="buyCount"
                            @keyup="calculatePriceValue('buyCount')"
                          >
                          <span class="unit">{{name}}</span>
                          <!-- 2.0 金额部分 -->
                          <!--出售-->
                          <input
                            type="text"
                            placeholder="金额"
                            class="sell-sum"
                            v-if="onlineTraderStatus === 'onlineSell'"
                            ref="sellPrice"
                            @keyup="calculateCountValue('sellPrice')"
                          >
                          <!--购买-->
                          <input
                            type="text"
                            placeholder="金额"
                            class="sell-sum"
                            v-if="onlineTraderStatus === 'onlineBuy'"
                            ref="buyPrice"
                            @keyup="calculateCountValue('buyPrice')"
                          >
                          <span class="unit">CNY</span>
                        </div>
                        <!-- input框错误提示信息 -->
                        <div class="errorInfo">
                          <span class="number">{{numberTips}}</span>
                          <span class="money">{{moneyTips}}</span>
                        </div>
                        <!-- 确定按钮 -->
                        <div class="trader-submit">
                          <button
                            class="trader-submit-button trader-submit-sell"
                            v-if="onlineTraderStatus === 'onlineSell'"
                            @click.prevent="showDialog"
                          >
                            确定出售
                          </button>
                          <button
                            class="trader-submit-button trader-submit-buy"
                            v-if="onlineTraderStatus === 'onlineBuy'"
                            @click.prevent="showDialog"
                          >
                            确定购买
                          </button>
                        </div>
                      </el-form-item>
                    </el-form>
                  </div>
                  <!--最下右边手续费-->
                  <div class="service-charge ">
                    <span>手续费：</span>
                    <span>{{serviceCharge}} {{name}}</span>
                    <span>( 费率 <span>{{rate*100}}%</span> )</span>
                  </div>
                </div>
                <!-- 右下交易须知 -->
                <div class="trading-notes">
                  <div class="notes">
                    <h4 class="title">*交易须知：</h4>
                    <p class="tip">
                        1. 订单匹配后若未按时付款，累积<span class="warning">3次</span>，您的账户将被冻结。
                    </p>
                    <p class="tip">
                        2. 付款前请仔细覈实对方信息。
                    </p>
                    <p class="tip">
                        3. 交易请勿脱离平台，一旦脱离，您将失去FUBT.top的保护；
                    </p>
                    <p class="tip">
                        4. 遇到纠纷，请保留好包括聊天记录在内的证据，立即联系我们。
                    </p>
                  </div>
                </div>
            </div>
            <!-- 输入交易密码弹窗 -->
            <div class="password-dialog">
              <el-dialog
                title="交易密码"
                :visible.sync="dialogVisible"
                top="25vh"
                width="470"
              >
                <div>请输入交易密码</div>
                <div class="input">
                  <input
                    type="password"
                    class="password-input"
                    v-model="tradePassword"
                  >
                </div>
                <div class="error-info">
                  <!-- 错误提示 -->
                  <div class="tips">错误提示</div>
                </div>
                <span
                  slot="footer"
                  class="dialog-footer">
                    <el-button
                      type="primary"
                      v-if="this.onlineTraderStatus === 'onlineBuy'"
                      @click="submitPickOrdersToBuy"
                    >
                      确定购买提交
                    </el-button>
                    <el-button
                      type="primary"
                      v-if="this.onlineTraderStatus === 'onlineSell'"
                      @click="submitPickOrdersToSell"
                    >
                      确定出售提交
                    </el-button>
                </span>
              </el-dialog>
            </div>
        </div>
    </div>
    <!-- 3.0 底部 -->
    <FooterCommon/>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {pickOrdersToBuy, pickOrdersToSell, querySelectedOrdersDetails, queryUserTradeFeeAndCoinInfo} from '../../utils/api/apiDoc'
import NavCommon from '../Common/HeaderCommon'
import FooterCommon from '../Common/FooterCommon'
import IconFontCommon from '../Common/IconFontCommon'
import {returnAjaxMessage} from '../../utils/commonFunc'
export default {
  components: {
    NavCommon, //  头部导航
    FooterCommon, //  底部
    IconFontCommon //  字体图标组件
  },
  data () {
    return {
      // 弹窗显示状态
      dialogVisible: false,
      // 挂单人姓名
      userName: '',
      // 交易次数
      tradeTimes: '',
      // 失败次数
      failTimes: '',
      // 冻结次数
      freezeTimes: '',
      // 备注
      remark: '',
      // 报价
      price: '',
      // 最小交易量
      // minCount: '',
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
      coinId: '', // 币种id
      userType: '', // 挂单人类型（COMMON普通用户 ，MERCHANT商家）
      // 数量错误提示
      numberTips: '',
      // 金额错误提示
      moneyTips: ''
    }
  },
  created () {
    require('../../../static/css/list/OTC/OTCOnlineTraderBuySell.css')
    require('../../../static/css/theme/day/OTC/OTCOnlineTraderBuySellDay.css')
    require('../../../static/css/theme/night/OTC/OTCOnlineTraderBuySellNight.css')
    // 1.0 从OTCCenter传过来的URL中获取的
    // 在线买卖的类型 购买（onlineBuy）和 出售（onlineSell)
    // id：挂单id
    // coinId：币种id
    // console.log(this.$route.params)
    // console.log(this.$route.params.styleId)
    // console.log(this.$route.params.id)
    // console.log(this.$route.params.coinId)
    this.onlineTraderStatus = this.$route.params.styleId
    this.id = this.$route.params.id
    this.coinId = this.$route.params.coinId
    console.log(this.onlineTraderStatus)
    console.log(this.id)
    console.log(this.coinId)
    // 2.0 查询选中的挂单，利用挂单id请求详情信息
    if (this.id) {
      this.querySelectedOrdersDetails()
    }
    // 3.0 查询用户交易币种手续费率以及币种详情
    if (this.coinId) {
      this.queryUserTradeFeeAndCoinInfo()
    }
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 1.0 显示输入密码框
    showDialog () {
      this.dialogVisible = true
    },
    // 2.0 卖出量/买入量input框键盘弹起事件:计算金额
    calculatePriceValue (ref) {
      this[ref] = this.$refs[ref].value
      console.log(this[ref])
      // 计算金额
      if (this.onlineTraderStatus === 'onlineBuy') {
        if (this.$refs.buyCount.value) {
          this.$refs.buyPrice.value = this.$refs.buyCount.value * this.price
          // 下面的拿上来
          if (this.$refs.buyCount.value * this.price < this.minCount) {
            this.moneyTips = '单笔最小限额为' + this.minCount
            return false
          } else if (this.$refs.buyCount.value * this.price > this.maxCount) {
            this.moneyTips = '单笔最大限额为' + this.maxCount
            this.numberTips = '最大剩余数量为' + this.remainingNum
            return false
          } else if (this.$refs.buyCount.value > this.remainingNum) {
            this.moneyTips = '单笔最大限额为' + this.maxCount
            this.numberTips = '最大剩余数量为' + this.remainingNum
            return false
          } else {
            this.moneyTips = ''
            this.numberTips = ''
          }
        } else {
          this.numberTips = ''
        }
      }
      if (this.onlineTraderStatus === 'onlineSell') {
        if (this.$refs.sellCount.value) {
          this.$refs.sellPrice.value = this.$refs.sellCount.value * this.price
          // 下面的拿上来
          if (this.$refs.sellCount.value * this.price < this.minCount) {
            this.moneyTips = '单笔最小限额为' + this.minCount
            return false
          } else if (this.$refs.sellCount.value * this.price > this.maxCount) {
            this.moneyTips = '单笔最大限额为' + this.maxCount
            this.numberTips = '最大剩余数量为' + this.remainingNum
            return false
          } else if (this.$refs.sellCount.value > this.remainingNum) {
            this.moneyTips = '单笔最大限额为' + this.maxCount
            this.numberTips = '最大剩余数量为' + this.remainingNum
            return false
          } else {
            this.moneyTips = ''
            this.numberTips = ''
          }
        } else {
          this.numberTips = ''
        }
      }
      // 验证输入的数字的准确性 假如 10--100
      // 3.输入数量 ：数量 * 价格 < 单笔最小限额 金额提示“单笔最小限额为10”
      // 4.输入数量 ：数量 * 价格 > 单笔最大限额 金额提示“单笔最大限额为100”，数量提示“最大剩余数量为：剩余数量”
      // 5.输入数量 > 剩余数量 金额提示“单笔最大限额为100”，数量提示“最大剩余数量为：剩余数量”
      if (this.onlineTraderStatus === 'onlineBuy') {
        // if (this.$refs.buyCount.value * this.price < this.minCount) {
        //   this.moneyTips = '单笔最小限额为' + this.minCount
        // } else if (this.$refs.buyCount.value * this.price > this.maxCount) {
        //   this.moneyTips = '单笔最大限额为' + this.maxCount
        //   this.numberTips = '最大剩余数量为' + this.remainingNum
        // } else if (this.$refs.buyCount.value > this.remainingNum) {
        //   this.moneyTips = '单笔最大限额为' + this.maxCount
        //   this.numberTips = '最大剩余数量为' + this.remainingNum
        // } else {
        //   this.moneyTips = ''
        //   this.numberTips = ''
        // }
      }
      if (this.onlineTraderStatus === 'onlineSell') {
        // if (this.$refs.sellCount.value * this.price < this.minCount) {
        //   this.moneyTips = '单笔最小限额为' + this.minCount
        // } else if (this.$refs.sellCount.value * this.price > this.maxCount) {
        //   this.moneyTips = '单笔最大限额为' + this.maxCount
        //   this.numberTips = '最大剩余数量为' + this.remainingNum
        // } else if (this.$refs.sellCount.value > this.remainingNum) {
        //   this.moneyTips = '单笔最大限额为' + this.maxCount
        //   this.numberTips = '最大剩余数量为' + this.remainingNum
        // } else {
        //   this.moneyTips = ''
        //   this.numberTips = ''
        // }
      }
    },
    // 3.0 金额input框键盘弹起事件:计算卖出量/买入量
    calculateCountValue (ref) {
      this[ref] = this.$refs[ref].value
      console.log(this[ref])
      // 计算卖出量/买入量
      if (this.onlineTraderStatus === 'onlineBuy') {
        if (this.$refs.buyPrice.value) {
          this.$refs.buyCount.value = this.$refs.buyPrice.value / this.price
          // 下面的拿上来
          if (this.$refs.buyPrice.value < this.minCount) {
            this.moneyTips = '单笔最小限额为' + this.minCount
            return false
          } else if (this.$refs.buyPrice.value > this.maxCount) {
            this.moneyTips = '单笔最大限额为' + this.maxCount
            this.numberTips = '最大剩余数量为' + this.remainingNum
            return false
          } else {
            this.moneyTips = ''
            this.numberTips = ''
          }
        } else {
          this.moneyTips = ''
        }
      }
      if (this.onlineTraderStatus === 'onlineSell') {
        if (this.$refs.sellPrice.value) {
          this.$refs.sellCount.value = this.$refs.sellPrice.value / this.price
          // 下面的拿上来
          if (this.$refs.sellPrice.value < this.minCount) {
            this.moneyTips = '单笔最小限额为' + this.minCount
            return false
          } else if (this.$refs.sellPrice.value > this.maxCount) {
            this.moneyTips = '单笔最大限额为' + this.maxCount
            this.numberTips = '最大剩余数量为' + this.remainingNum
            return false
          } else {
            this.moneyTips = ''
            this.numberTips = ''
          }
        } else {
          this.moneyTips = ''
        }
      }
      // 验证输入的数字的准确性 假如 10--100
      // 逻辑：
      // 1.金额<单笔最小限额 金额提示“单笔最小限额为10”
      // 2.金额>单笔最大限额 金额提示“单笔最大限额为100”,数量提示“最大剩余数量为：剩余数量”
      // 3.输入数量 ：数量 * 价格 < 单笔最小限额 金额提示“单笔最小限额为10”
      // 4.输入数量 ：数量 * 价格 > 单笔最大限额 金额提示“单笔最大限额为100”，数量提示“最大剩余数量为：剩余数量”
      if (this.onlineTraderStatus === 'onlineBuy') {
        // if (this.$refs.buyPrice.value < this.minCount) {
        //   this.moneyTips = '单笔最小限额为' + this.minCount
        // } else if (this.$refs.buyPrice.value > this.maxCount) {
        //   this.moneyTips = '单笔最大限额为' + this.maxCount
        //   this.numberTips = '最大剩余数量为' + this.remainingNum
        // } else {
        //   this.moneyTips = ''
        //   this.numberTips = ''
        // }
      }
      if (this.onlineTraderStatus === 'onlineSell') {
        // if (this.$refs.sellPrice.value < this.minCount) {
        //   this.moneyTips = '单笔最小限额为' + this.minCount
        // } else if (this.$refs.sellPrice.value > this.maxCount) {
        //   this.moneyTips = '单笔最大限额为' + this.maxCount
        //   this.numberTips = '最大剩余数量为' + this.remainingNum
        // } else {
        //   this.moneyTips = ''
        //   this.numberTips = ''
        // }
      }
    },
    // 2.0 修改input value
    changeInputValue (ref) {
      this[ref] = this.$refs[ref].value
      console.log(this[ref])
      if (this.onlineTraderStatus === 'onlineBuy') {
        // 手续费
        this.serviceCharge = this.$refs.buyCount.value * this.rate
      }
      if (this.onlineTraderStatus === 'onlineSell') {
        // 手续费
        this.serviceCharge = this.$refs.sellCount.value * this.rate
      }
    },
    // 3.0 查询otc挂单详情-商家和普通用户通用
    async querySelectedOrdersDetails () {
      const data = await querySelectedOrdersDetails({
        entrustId: this.id // 挂单id
      })
      console.log('otc挂单详情')
      console.log(data)
      // 提示信息
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑:将返回的数据赋值到页面中
        this.userName = data.data.data.userName // 挂单人姓名
        this.tradeTimes = data.data.data.tradeTimes // 交易次数
        this.failTimes = data.data.data.failTimes // 失败次数
        this.freezeTimes = data.data.data.freezeTimes // 冻结次数
        this.remark = data.data.data.remark // 备注
        this.price = data.data.data.price // 报价
        this.payTypes = data.data.data.payTypes // 付款方式
        this.payTerm = data.data.data.payTerm // 付款期限
        this.remainingNum = data.data.data.entrustCount - data.data.data.matchCount // 剩余数量
        this.maxCount = data.data.data.maxCount // 单笔最大限额
        this.minCount = data.data.data.minCount // 单笔最小限额
        this.userType = data.data.data.userType // 挂单人类型（COMMON普通用户 ，MERCHANT商家）
      }
    },
    // 4.0 查询用户交易币种手续费率以及币种详情
    async queryUserTradeFeeAndCoinInfo () {
      const data = await queryUserTradeFeeAndCoinInfo({
        coinId: this.coinId // 挂单id
      })
      console.log('用户交易币种手续费率以及币种详情')
      console.log(data)
      // 提示信息
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑:将返回的数据赋值到页面中
        // this.minCount = data.data.data.minCount // 最小交易量
        this.name = data.data.data.name // 最小交易量币种名字（单位）
        if (this.onlineTraderStatus === 'onlineBuy') {
          this.rate = data.data.data.buyRate // 费率
        }
        if (this.onlineTraderStatus === 'onlineSell') {
          this.rate = data.data.data.sellRate // 费率
        }
      }
    },
    // 5.0 点击 确认购买 按钮提交数据
    async submitPickOrdersToBuy () {
      console.log('购买')
      const data = await pickOrdersToBuy({
        entrustId: this.id, // 挂单id
        buyCount: this.buyCount, // 买入数量
        tradePassword: this.tradePassword // 交易密码
      })
      // console.log('往后台传送的参数共3个')
      // console.log(this.id)
      // console.log(this.buyCount)
      // console.log(this.tradePassword)
      // console.log(data)
      // 提示信息
      if (!(returnAjaxMessage(data, this, 1))) {
        return false
      } else {
        // 返回数据正确的逻辑
        this.dialogVisible = false
      }
    },
    // 6.0 点击 确认出售 按钮提交数据
    async submitPickOrdersToSell () {
      console.log('出售')
      const data = await pickOrdersToSell({
        entrustId: this.id, // 挂单id
        sellCount: this.sellCount, // 卖出数量
        tradePassword: this.tradePassword // 交易密码
      })
      // console.log('往后台传送的参数共3个')
      // console.log(this.id)
      // console.log(this.sellCount)
      // console.log(this.tradePassword)
      // console.log(data)
      if (!(returnAjaxMessage(data, this, 1))) {
        return false
      } else {
        // 返回数据正确的逻辑
        this.dialogVisible = false
      }
    }
  },
  filter: {},
  computed: {},
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
@import url(../../../static/css/scss/OTC/OTCPublishBuyAndSell.scss);
.otc-online-trader-buy-sell-box{
    background-color: #1D2331;
    >.online-trader-buy-sell-content{
        width: 1150px;
        margin: 0 auto;
        margin-top: 50px;
        margin-bottom: 150px;
        >.online-trader{
            display: flex;
            flex: 10;
            >.online-trader-left{
                flex: 3;
                >.shoper-info{
                    width: 320px;
                    height: 180px;
                    box-sizing: border-box;
                    background-color: #202A33;
                    border-radius: 5px;
                    padding: 40px 40px 0 40px;
                  >.shoper-name{
                    height: 20px;
                    line-height: 20px;
                    >.shang-icon{
                      display: inline-block;
                      width: 14px;
                      height: 19px;
                      vertical-align: top;
                    }
                    >.name{
                      display: inline-block;
                      color: #FFFFFF;
                      font-size: 16px;
                      margin-left: 10px;
                    }
                  }
                  >.shoper-statistics{
                    display: flex;
                    flex: 3;
                    text-align: center;
                    margin-top: 40px;
                    .blue{
                      color: #3E79D6;
                      font-size:14px;
                    }
                    .text{
                      font-size: 12px;
                      color: #9DA5B3;
                      margin-top: 5px;
                    }
                    >.trader-total{
                      flex: 3;
                    }
                    >.failed{
                      flex: 3;
                    }
                    >.freeze{
                      flex: 3;
                    }
                  }
                }
                >.shoper-remark{
                    width: 320px;
                    height: 130px;
                    box-sizing: border-box;
                    background-color: #202A33;
                    margin-top: 20px;
                    border-radius: 5px;
                    padding: 30px 49px 0 39px;
                  >.remark-title{
                    color: #7D90AC;
                    font-size: 14px;
                  }
                  >.remark-content{
                    color: #9DA5B3;
                    font-size: 12px;
                    margin-top: 5px;
                    // line-height: 1.2rem;
                    line-height: 20px;
                  }
                }
            }
            >.online-trader-right{
                flex: 7;
                box-sizing: border-box;
                >.trader-details{
                    width: 760px;
                    height: 500px;
                    box-sizing: border-box;
                    background-color: #202A33;
                    border-radius: 5px;
                    padding: 35px 0 0 48px;
                    >.details-row{
                      height: 30px;
                      line-height: 30px;
                      >.details-tip{
                        color: #9DA5B3;
                        font-size: 12px;
                        width: 75px;
                        display: inline-block;
                      }
                      >.details-data{
                        color: #fff;
                        font-size: 12px;
                      }
                    }
                    >.form{
                      .want{
                        margin-top: 40px;
                        >.want-text{
                          color: #3E79D6;
                          font-size: 20px;
                          margin-right: 20px;
                        }
                        >.charge-money{

                        }
                      }
                      .sell-buy-input{
                        // padding: 10px 0 10px 0;
                        padding: 10px 0 0 0;
                        >.sell-sum{
                          width: 190px;
                          height: 36px;
                          background-color: #333A41;
                          padding-left: 10px;
                          color: #9DA5B3;
                        }
                        >.unit{
                          width: 70px;
                          height: 36px;
                          color: #338FF5;
                          font-size: 16px;
                          background-color: #414951;
                          display: inline-block;
                          vertical-align: middle;
                          margin-left: -4px;
                          line-height: 36px;
                          text-align: center;
                          margin-right: 50px;
                        }
                      }
                      .errorInfo{
                        >.number{
                          display: inline-block;
                          width: 320px;
                          height: 30px;
                          line-height: 30px;
                          font-size: 12px;
                          // background-color: red;
                        }
                        >.money{
                          display: inline-block;
                           width: 320px;
                          height: 30px;
                          line-height: 30px;
                          font-size: 12px;
                          // background-color: green;
                        }
                      }
                      .trader-submit{
                        >.trader-submit-button{
                          width: 602px;
                          height: 40px;
                          color: #FFFFFF;
                          font-size: 14px;
                          border-radius:4px;
                          margin-top: 20px;
                          cursor: pointer;
                        }
                        >.trader-submit-sell{
                          background-color: #008069;
                        }
                        >.trader-submit-buy{
                          background-color: #D45858;
                        }
                      }
                    }
                    >.service-charge{
                      width: 602px;
                      color: #9DA5B3;
                      font-size: 14px;
                      text-align: right;
                    }
                }
                >.trading-notes{
                    width: 760px;
                    height: 122px;
                    box-sizing: border-box;
                    padding: 35px 0 0 48px;
                  >.notes{
                    >.title{
                      color: #B43B3B;
                      font-size: 14px;
                      margin-bottom: 15px;
                    }
                    >.tip{
                      color: #7D90AC;
                      font-size: 14px;
                      // line-height: 1.3rem;
                      line-height: 20px;
                      >.warning{
                        color: #B43B3B;
                        font-size: 14px;
                      }
                    }
                  }
                }
            }
        }
    }
}
</style>
