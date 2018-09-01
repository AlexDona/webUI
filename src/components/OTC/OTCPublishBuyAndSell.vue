<template>
  <div class="otc-publish-buy-and-sell-box otc">
    <!-- 挂单：商家和普通用户都可以用 -->
    <!-- 1.0 导航 -->
    <NavCommon/>
    <!-- 2.0发布购买和出售 -->
    <div class="publish-buy-and-sell-content">
      <!-- 发布订单内容部分分为左右两个部分 -->
      <div class="publish-content">
        <!-- 左边部分:发布订单买卖部分 -->
        <div class="publish-content-left">
          <!-- 购买和出售切换 -->
          <div class="publish-button">
            <button
              class="sell-button common-style"
              @click="toggleSellButton"
              :class="{ green: publishStyle === 'sell' }"
            >
              出售
            </button>
            <button
              class="buy-button common-style"
              @click="toggleBuyButton"
              :class="{ red: publishStyle === 'buy' }"
            >
              购买
            </button>
          </div>
          <!-- 发布购买和出售大表单 -->
          <div class="buy-sell-submit-form">
            <el-form
              :label-position="labelPosition"
              label-width="80px"
            >
              <!-- 1.0币种类型 -->
              <el-form-item label="选择币种类型">
                <el-select
                  placeholder="请选择币种类型"
                  v-model="coinId"
                  @change="changeCoinId"
                >
                  <el-option
                    v-for="(item,index) in coinStyleList"
                    :key="index"
                    :value="item.partnerCoinId"
                    :label="item.name"
                  >
                    {{ item.name }}
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- 2.0法币类型 -->
              <el-form-item label="选择你希望付款的货币类型">
                <el-select
                  placeholder="选择你希望付款的货币类型"
                  v-model="hopePaymentCoinId"
                  @change="changehopePaymentCoinId"
                >
                  <el-option
                    v-for="(item,index) in hopePaymentCoinStyleList"
                    :key="index"
                    :value="item.id"
                    :label="item.name"
                  >
                    {{ item.name }}
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- 3.0你想出售或者购买 -->
              <el-form-item>
                <div class="want-buy-sell-sum">
                  你想<span
                  v-show="publishStyle === 'sell'"
                  >出售</span><span
                  v-show="publishStyle === 'buy'"
                  >购买</span>多少
                </div>
                <!-- 当前可用和市价 -->
                <div class="want-buy-sell-sum-content">
                  <span class="want-text">当前可用：</span>
                  <span
                    class="max-sum"
                    v-show="publishStyle === 'sell'"
                    :class="{ sellGreen: publishStyle === 'sell' }"
                  >
                    {{currentlyAvailable}}{{coinName}}
                  </span>
                  <span
                    class="max-sum"
                    v-show="publishStyle === 'buy'"
                    :class="{ buyOrange: publishStyle === 'buy' }"
                  >
                    {{currentlyAvailable}}{{coinName}}
                  </span>
                  <span class="want-text">市价：</span>
                  <span
                    class="market-price"
                    v-show="publishStyle === 'sell'"
                    :class="{ sellGreen: publishStyle === 'sell' }"
                  >
                    {{marketPrice}}CNY
                  </span>
                  <span
                    class="market-price"
                    v-show="publishStyle === 'buy'"
                    :class="{ buyOrange: publishStyle === 'buy' }"
                  >
                    {{marketPrice}}CNY
                  </span>
                  <el-button
                    type="primary"
                    size="mini"
                    v-show="publishStyle === 'sell'"
                  >
                    充币
                  </el-button>
                </div>
                <!-- 卖出量和单价  买入量和单价 -->
                <div class="sell-buy-input">
                  <input
                    type="text"
                    placeholder="卖出量"
                    class="sell-sum"
                    v-show="publishStyle === 'sell'"
                    ref="entrustCountSell"
                    @keyup="changeInputValue('entrustCountSell')"
                  >
                  <input
                    type="text"
                    placeholder="买入量"
                    class="sell-sum"
                    v-show="publishStyle === 'buy'"
                    ref="entrustCountBuy"
                    @keyup="changeInputValue('entrustCountBuy')"
                  >
                  <span class="unit">{{coinName}}</span>
                  <input
                    type="text"
                    placeholder="卖出单价"
                    class="sell-sum"
                    v-show="publishStyle === 'sell'"
                    ref="priceSell"
                    @keyup="changeInputValue('priceSell')"
                  >
                  <input
                    type="text"
                    placeholder="买入单价"
                    class="sell-sum"
                    v-show="publishStyle === 'buy'"
                    ref="priceBuy"
                    @keyup="changeInputValue('priceBuy')"
                  >
                  <span class="unit">{{CurrencyCoinsName}}</span>
                </div>
                <!-- 错误提示信息 -->
                <div class="buySellSumErrorTips">
                  <!-- 卖出量和买入量的提示 -->
                  <span class="errorSell">{{errorTipsSum}}</span>
                  <!-- 卖出单价和买入单价的提示 -->
                  <span class="errorBuy">{{errorTipsPrice}}</span>
                </div>
              </el-form-item>
              <!-- 4.0成交限额 -->
              <el-form-item label="单笔成交限额">
                <div class="volume-business">
                  <input
                    type="text"
                    placeholder="单笔最小限额"
                    class="sell-sum"
                    ref="minCount"
                    @keyup="changeInputValue('minCount')"
                  >
                  <span class="monad">{{CurrencyCoinsName}}</span>
                  <span class="range-line">-</span>
                  <input
                    type="text"
                    placeholder="单笔最大成交额"
                    class="sell-sum max-sell-sum"
                    ref="maxCount"
                    @keyup="changeInputValue('maxCount')"
                  >
                  <span class="monad">{{CurrencyCoinsName}}</span>
                </div>
                <!-- 错误提示信息 -->
                <div class="limitErrorTips">
                  <!-- 单笔最小的提示 -->
                  <span class="errorSell">{{errorTipsLimitMin}}</span>
                  <!-- 单笔最大的提示 -->
                  <span class="errorBuy">{{errorTipsLimitMax}}</span>
                </div>
              </el-form-item>
              <!-- 5.0备注 -->
              <el-form-item label="备注">
                <div class="remark">
                  请说明有关于您交易的相关条款或者其它您想让对方获悉得信息，以便对方和您快速交易
                </div>
                <el-input
                  type="textarea"
                  auto-complete="off"
                  placeholder="请输入留言:"
                  v-model="remarkText"
                >
                </el-input>
                <!-- 预计交易和手续费 -->
                <div class="predict">
                  <span class="predict-text">
                      预计交易额：
                  </span>
                  <span class="predict-sum">
                    1.00 {{CurrencyCoinsName}}
                  </span>
                  <span class="predict-text">
                    手续费：
                  </span>
                  <span class="predict-sum">
                    0 {{coinName}}
                  </span>
                  <span class="rate-text">
                    ( 费率
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
                  发布出售
                </button>
                <button
                  class="publish-submit-button publish-submit-buy"
                  v-if="publishStyle === 'buy'"
                  @click.prevent="showPasswordDialog"
                >
                  发布购买
                </button>
              </div>
              <!-- 7.0输入交易密码弹窗 -->
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
                        @click="addOTCPutUpOrdersSubmitButton"
                      >
                        提 交
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
              发布说明：
            </p>
            <p class="release-tips">
              1、发布买卖是免费的；
            </p>
            <p class="release-tips">
              2、您可以在设置种设置您的收款方式，发布买卖时直接选择，它会显示在您的委托列表中；
            </p>
            <p class="release-tips">
              3、交易中请注意判断和防范有欺诈风险的付款方式；
            </p>
            <p class="release-tips">
              4、请避免线下私自交易，FUBT.top无法为您预防风险
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- 3.0 底部 -->
    <FooterCommon/>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {getOTCAvailableCurrency, getMerchantAvailablelegalTender, addOTCPutUpOrders, queryUserTradeFeeAndCoinInfo} from '../../utils/api/OTC'
import NavCommon from '../Common/HeaderCommon'
import FooterCommon from '../Common/FooterCommon'
import {returnAjaxMessage} from '../../utils/commonFunc'
import {createNamespacedHelpers, mapState} from 'vuex'
const {mapMutations} = createNamespacedHelpers('OTC')
export default {
  components: {
    NavCommon, //  头部导航
    FooterCommon //  底部
  },
  data () {
    return {
      // 交易密码弹窗状态
      dialogVisible: false,
      //  1购买和出售选中类型：挂单类型
      publishStyle: 'sell',
      //  表单label放置的位置
      labelPosition: 'top',
      //   1 可用币种类型列表
      coinStyleList: [],
      //   选中的币种类型：挂单币种id
      coinId: '',
      //   选中的币种名称：挂单币种name
      coinName: '',
      //   2 选择你希望付款的货币类型列表：可用法币类型
      hopePaymentCoinStyleList: [],
      //   选中的希望付款的货币类型:法币id
      hopePaymentCoinId: '',
      //   选中的可用法币币种名称：
      CurrencyCoinsName: '',
      //  3挂单数量
      entrustCountSell: '',
      entrustCountBuy: '',
      //  4单价
      priceSell: '',
      priceBuy: '',
      //  5单笔最小限额（CNY）
      minCount: '',
      //  6单笔最大限额（CNY）
      maxCount: '',
      //  7备注
      remarkText: '',
      //  8交易密码
      tradePassword: '',
      // 起订量
      // minOrderCount: 0
      // 当前可用
      currentlyAvailable: '456',
      // 市价
      marketPrice: '132',
      // 预计交易额
      tradingVolumes: '',
      // 手续费
      serviceCharge: '',
      // 费率
      rate: '0.008',
      // 卖出量和买入量的提示
      errorTipsSum: '错误提示1',
      // 卖出单价和买入单价的提示
      errorTipsPrice: '错误提示2',
      // 单笔成交限额最小错误提示
      errorTipsLimitMin: '错误提示1',
      // 单笔成交限额最大错误提示
      errorTipsLimitMax: '错误提示2'
    }
  },
  created () {
    require('../../../static/css/list/OTC/OTCPublishBuyAndSell.css')
    require('../../../static/css/theme/day/OTC/OTCPublishBuyAndSellDay.css')
    require('../../../static/css/theme/night/OTC/OTCPublishBuyAndSellNight.css')
    // 1.0 otc可用币种查询
    this.getOTCAvailableCurrencyList()
    // 2.0 查询可用法币币种列表
    this.getMerchantAvailablelegalTenderList()
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
      // otc 商家和普通用户通用挂单页面可用币种起订量:选中不同的币种获得不同币种的起订量
      // 'CHANGE_OTC_MERCHANT_AND_COMMON_MINCOUNT'
    ]),
    //  修改input value
    changeInputValue (ref) {
      this[ref] = this.$refs[ref].value
      // console.dir(this.$refs[ref])
      console.log(this[ref])
      // this.entrustCount = this.$refs.entrustCount.value
      // console.log(this.entrustCount)
    },
    //  点击 购买 和 出售 按钮切换
    toggleSellButton () {
      this.publishStyle = 'sell'
      console.log(this.publishStyle)
    },
    toggleBuyButton () {
      this.publishStyle = 'buy'
      console.log(this.publishStyle)
    },
    //  点击发布出售或者发布购买弹出输入交易密码框
    showPasswordDialog () {
      this.dialogVisible = true
    },
    //  清空input框数据
    clearInputData () {
      this.coinId = ''
      this.hopePaymentCoinId = ''
      this.entrustCountSell = ''
      this.entrustCountBuy = ''
      this.priceSell = ''
      this.priceBuy = ''
      this.minCount = ''
      this.maxCount = ''
      this.remarkText = ''
      this.tradePassword = ''
    },
    //  1.0 otc可用币种查询
    async getOTCAvailableCurrencyList () {
      const data = await getOTCAvailableCurrency({
        partnerId: this.merchantID
      })
      console.log(data)
      // 提示信息
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑
        this.coinStyleList = data.data.data
        // this.minOrderCount = this.coinStyleList[0].minCount
        // console.log(this.coinStyleList[0].minCount)
        // this.CHANGE_OTC_MERCHANT_AND_COMMON_MINCOUNT(this.coinStyleList[0].minCount)
        // console.log(this.merchantAndCommonPutOnOrderMinCount)
      }
    },
    //  2.0 查询可用法币币种列表
    async getMerchantAvailablelegalTenderList () {
      const data = await getMerchantAvailablelegalTender({
        partnerId: this.merchantID
      })
      console.log(data)
      // 提示信息
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑
        this.hopePaymentCoinStyleList = data.data.data
      }
    },
    //  1.1 选择可用币种类型
    changeCoinId (e) {
      console.log(e)
      this.coinId = e
      console.log(this.coinId)
      // 根据可用币种id 查询用户交易币种手续费率以及币种详情
      this.queryUserTradeFeeAndCoinInfo()
      // this.coinStyleList.forEach(item => {
      //   // console.log(item)
      //   // console.log(item.coinId)
      //   if (e === item.coinId) {
      //     console.log(item.minCount)
      //     this.minOrderCount = item.minCount
      //   }
      // })
    },
    //  2.1 选择你希望付款的货币类型：可用法币类型
    changehopePaymentCoinId (e) {
      console.log(e)
      this.hopePaymentCoinId = e
      console.log(this.hopePaymentCoinId)
      this.hopePaymentCoinStyleList.forEach(item => {
        // console.log(item)
        // console.log(item.id)
        if (e === item.id) {
          console.log(item.shortName)
          this.CurrencyCoinsName = item.shortName
        }
      })
      // 可用法币币种名称还未赋值
      // this.CurrencyCoinsName =
    },
    //  1.2 根据可用币种id 查询用户交易币种手续费率以及币种详情
    async queryUserTradeFeeAndCoinInfo () {
      const data = await queryUserTradeFeeAndCoinInfo({
        partnerCoinId: this.coinId // 挂单id
      })
      console.log('用户交易币种手续费率以及币种详情')
      console.log(data)
      // 提示信息
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑:将返回的数据赋值到页面中
        // 选中币种名称
        this.coinName = data.data.data.name
        // 当前可用
        this.currentlyAvailable = data.data.data.total
        // 市价
        this.marketPrice = data.data.data.marketPrice
        // 费率
        if (this.publishStyle === 'sell') {
          this.rate = data.data.data.sellRate
        }
        if (this.publishStyle === 'buy') {
          this.rate = data.data.data.buyRate
        }
      }
    },
    // 3.0 点击输入密码框中的提交按钮
    async addOTCPutUpOrdersSubmitButton () {
      let param = {
        partnerCoinId: this.coinId, // 挂单币种
        currencyId: this.hopePaymentCoinId, // 法币id
        minCount: this.minCount, // 单笔最小限额（CNY）
        maxCount: this.maxCount, // 单笔最大限额（CNY）
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
      console.log('传输的参数共8个')
      console.log(this.coinId)
      console.log(this.hopePaymentCoinId)
      if (this.publishStyle === 'buy') {
        console.log(this.entrustCountBuy)
        console.log(this.priceBuy)
      }
      if (this.publishStyle === 'sell') {
        console.log(this.entrustCountSell)
        console.log(this.priceSell)
      }
      console.log(this.minCount)
      console.log(this.maxCount)
      console.log(this.remarkText)
      console.log(this.tradePassword)
      const data = await addOTCPutUpOrders(param)
      console.log(data)
      // 提示信息
      if (!(returnAjaxMessage(data, this, 1))) {
        return false
      } else {
        // 返回数据正确的逻辑
        this.dialogVisible = false
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      // 商户id
      merchantID: state => state.common.merchantID,
      // 测试拿到userinfo
      userInfo: state => state.personal.userInfo
      // otc 商家和普通用户通用挂单页面可用币种起订量:选中不同的币种获得不同币种的起订量
      // merchantAndCommonPutOnOrderMinCount: state => state.OTC.merchantAndCommonPutOnOrderMinCount
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  @import url(../../../static/css/scss/OTC/OTCPublishBuyAndSell.scss);
  .otc-publish-buy-and-sell-box {
    background-color: #1D2331;
    > .publish-buy-and-sell-content {
      width: 1150px;
      margin: 70px auto;
      > .publish-content {
        display: flex;
        flex: 3;
        > .publish-content-left {
          flex: 2;
          > .publish-button {
            > .common-style {
              color: #8494A6;
              width: 70px;
              height: 36px;
              display: inline-block;
              border: 1px solid #47525C;
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
            margin-top: 20px;
            .want-buy-sell-sum {
              color: #338FF5;
              font-size: 20px;
              padding-top: 20px;
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
                font-size: 12px;
              }
              > .max-sum {
                /*color: #30C296;*/
                font-size: 12px;
                margin-right: 20px;
              }
              > .want-text {
                color: #9DA5B3;
                font-size: 12px;
              }
              > .market-price {
                /*color: #30C296;*/
                font-size: 12px;
                margin-right: 20px;
              }
            }
            .sell-buy-input {
              padding: 10px 0 0 0;
              > .sell-sum {
                width: 190px;
                height: 36px;
                background-color: #333A41;
                padding-left: 10px;
                color: #9DA5B3;
              }
              > .unit {
                width: 70px;
                height: 36px;
                color: #338FF5;
                font-size: 16px;
                background-color: #414951;
                display: inline-block;
                vertical-align: top;
                margin-left: -4px;
                line-height: 36px;
                text-align: center;
                margin-right: 50px;
              }
            }
            .buySellSumErrorTips{
              >.errorSell{
                display: inline-block;
                width: 320px;
                font-size: 12px;
                color: #D45858;
                // background-color: green;
              }
              >.errorBuy{
              }
            }
            .volume-business {
              margin-bottom: 10px;
              > .sell-sum {
                width: 130px;
                height: 36px;
                background-color: #333A41;
                padding-left: 10px;
                color: #9DA5B3;
              }
              > .max-sell-sum {
                width: 180px;
              }
              > .monad {
                width: 50px;
                height: 36px;
                background-color: #414951;
                display: inline-block;
                vertical-align: top;
                margin-left: -4px;
                line-height: 36px;
                text-align: center;
                color: #338FF5;
                font-size: 12px;
              }
              > .range-line {
                color: #fff;
                width: 20px;
                height: 36px;
                display: inline-block;
                text-align: center;
                vertical-align: top;
              }
            }
            .limitErrorTips{
              // >.errorSell,.errorBuy{
              //   display: inline-block;
              //   width: 212px;
              //   font-size: 12px;
              //   color: #D45858;
              // }
              // >.errorBuy{
              // }
            }
            .remark {
              color: #9DA5B3;
              font-size: 12px;
              margin-top: -10px;
            }
            .predict {
              > .predict-text {
                color: #9FA7B2;
                font-size: 12px;
              }
              > .predict-sum {
                color: #30C296;
                font-size: 12px;
              }
              > .rate-text {
                color: #9FA7B2;
                font-size: 12px;
                > .rate {
                  color: #CA5040;
                  font-size: 12px;
                }
              }
            }
            .publish-submit {
              > .publish-submit-button {
                width: 589px;
                height: 42px;
                color: #FFFFFF;
                font-size: 14px;
                border-radius: 4px;
                margin-top: 40px;
                cursor: pointer;
              }
              > .publish-submit-buy {
                background-color: #D45858;
              }
              > .publish-submit-sell {
                background-color: #008069;
              }
            }
            //   >.password-dialog{
            //       .password-input{
            //           display: inline-block;
            //           width: 280px;
            //           height: 40px;
            //           background-color: red;
            //       }
            //   }
          }
        }
        > .publish-content-right {
          flex: 1;
          > .release-notes {
            width: 216px;
            color: #8C8E91;
            font-size: 12px;
            > .release-title {
              color: #9FA7B2;
            }
            > .release-tips {
              // line-height: 1.5rem;
              line-height: 20px;
              font-size: 14px;
            }
          }
        }
      }
    }
  }
</style>
