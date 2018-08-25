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
                    :value="item.coinId"
                    :label="item.shortName"
                  >
                    {{ item.shortName }}
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
                    --111111BTC
                  </span>
                  <span
                    class="max-sum"
                    v-show="publishStyle === 'buy'"
                    :class="{ buyOrange: publishStyle === 'buy' }"
                  >
                    --2222222BTC
                  </span>
                  <span class="want-text">市价：</span>
                  <span
                    class="market-price"
                    v-show="publishStyle === 'sell'"
                    :class="{ sellGreen: publishStyle === 'sell' }"
                  >
                    --111CNY
                  </span>
                  <span
                    class="market-price"
                    v-show="publishStyle === 'buy'"
                    :class="{ buyOrange: publishStyle === 'buy' }"
                  >
                    --222CNY
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
                  <span class="unit">BTC</span>
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
                  <span class="unit">CNY</span>
                </div>
                <!-- 错误提示信息 -->
                <div class="buySellSumErrorTips">
                  <!-- 卖出量和买入量的提示 -->
                  <span class="errorSell">卖出量和买入量的提示</span>
                  <!-- 卖出单价和买入单价的提示 -->
                  <!-- <span class="errorBuy">卖出单价和买入单价的提示</span> -->
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
                  <span class="monad">CNY</span>
                  <span class="range-line">-</span>
                  <input
                    type="text"
                    placeholder="单笔最大成交额"
                    class="sell-sum max-sell-sum"
                    ref="maxCount"
                    @keyup="changeInputValue('maxCount')"
                  >
                  <span class="monad">CNY</span>
                </div>
                <!-- 错误提示信息 -->
                <div class="limitErrorTips">
                  <!-- 单笔最小的提示 -->
                  <!-- <span class="errorSell">卖出量和买入量的提示</span> -->
                  <!-- 单笔最大的提示 -->
                  <!-- <span class="errorBuy">卖出单价和买入单价的提示</span> -->
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
                    1.00 CNY
                  </span>
                  <span class="predict-text">
                    手续费：
                  </span>
                  <span class="predict-sum">
                    0 BTC
                  </span>
                  <span class="rate-text">
                    ( 费率
                    <span class="rate">
                      0.8%
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
import {getOTCAvailableCurrency, getMerchantAvailablelegalTender, addOTCPutUpOrders} from '../../utils/api/apiDoc'
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
      dialogVisible: false,
      publishStyle: 'sell', //  1购买和出售选中类型：挂单类型
      labelPosition: 'top', //  表单label放置的位置
      //   币种类型列表
      coinStyleList: [],
      //   2币种类型：挂单币种id
      coinId: '',
      //   选择你希望付款的货币类型列表
      hopePaymentCoinStyleList: [],
      //   3希望付款的货币类型:法币id
      hopePaymentCoinId: '',
      //  4挂单数量
      entrustCountSell: '',
      entrustCountBuy: '',
      //  5单价
      priceSell: '',
      priceBuy: '',
      //  6单笔最小限额（CNY）
      minCount: '',
      //  7单笔最大限额（CNY）
      maxCount: '',
      //  8备注
      remarkText: '',
      //  9交易密码
      tradePassword: ''
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
    // console.log(this.IWantToBuySellArr[index].minCount)
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
      'CHANGE_OTC_MERCHANT_AND_COMMON_MINCOUNT'
      // 'CHANGE_OTC_AVAILABLE_CURRENCY_ID'
    ]),
    // 修改input value
    changeInputValue (ref) {
      this[ref] = this.$refs[ref].value
      // console.dir(this.$refs[ref])
      console.log(this[ref])
      // this.entrustCount = this.$refs.entrustCount.value
      // console.log(this.entrustCount)
    },
    // 点击 购买 和 出售 按钮切换
    toggleSellButton () {
      this.publishStyle = 'sell'
      console.log(this.publishStyle)
    },
    toggleBuyButton () {
      this.publishStyle = 'buy'
      console.log(this.publishStyle)
    },
    // 选择币种类型
    changeCoinId (e) {
      console.log(this.coinId)
      console.log(e)
      // this.CHANGE_OTC_MERCHANT_AND_COMMON_MINCOUNT(this.coinStyleList[val].minCount)
    },
    // 选择你希望付款的货币类型
    changehopePaymentCoinId () {
      console.log(this.hopePaymentCoinId)
    },
    // 点击发布出售或者发布购买弹出输入交易密码框
    showPasswordDialog () {
      this.dialogVisible = true
    },
    // 清空input框数据
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
        console.log(this.coinStyleList[0].minCount)
        this.CHANGE_OTC_MERCHANT_AND_COMMON_MINCOUNT(this.coinStyleList[0].minCount)
        // console.log(this.merchantAndCommonPutOnOrderMinCount)
      }
    },
    // 2.0 查询可用法币币种列表
    async getMerchantAvailablelegalTenderList () {
      let data
      data = await getMerchantAvailablelegalTender({
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
    // 3.0 点击输入密码框中的提交按钮
    async addOTCPutUpOrdersSubmitButton () {
      let param = {
        coinId: this.coinId, // 挂单币种
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
      console.log(this.entrustCount)
      console.log(this.price)
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
      userInfo: state => state.personal.userInfo,
      // otc 商家和普通用户通用挂单页面可用币种起订量:选中不同的币种获得不同币种的起订量
      merchantAndCommonPutOnOrderMinCount: state => state.OTC.merchantAndCommonPutOnOrderMinCount
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
              line-height: 1.5rem;
              font-size: 14px;
            }
          }
        }
      }
    }
  }
</style>
