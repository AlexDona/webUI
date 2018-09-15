<!--限价交易、市价交易-->
<template>
  <div
    class="exchange-box trade"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="inner-box">
      <!--币种资料跳转-->
      <div class="currency-info">
        <router-link to="/">
          <i class="el-icon-document"></i>
          <span>币种资料</span>
        </router-link>
      </div>
      <el-tabs
        v-model="activeName"
        @tab-click="toggleMatchType"
      >
        <el-tab-pane
          label="限价交易"
          name="limit-price"
        >
          <div class="content-box limit">
            <div class="inner-box left">
              <div class="header">
                <div class="left item">
                  <IconFont iconName="icon-qianbao-"/>
                  <span class="margin-left10 buy">
                    可买：
                    <span>--</span>
                    <span>{{activeSymbol.sellsymbol}}</span>
                  </span>
                </div>
                <div class="right item">
                  <router-link to="/PersonalCenter">充币</router-link>
                  <router-link to="/PersonalCenter">提币</router-link>
                </div>
              </div>
              <div class="content">
                <!--买入价-->
                <div class="input">
                  <input
                    type="text"
                    placeholder="买入价"
                    :ref="limitBuyPriceInputRef"
                    @keyup="autoChangeData('limit-buy',limitBuyPriceInputRef,activeSymbol.priceExchange)"
                    @input="formatInput(limitBuyPriceInputRef,activeSymbol.priceExchange)"
                  >
                  <span class="currency">{{activeSymbol.area}}</span>
                  <div class="rate-changer"
                       v-show="activeConvertCurrencyObj&&(limitExchange.transformBuyPrice-0)"
                  >
                    ≈ {{activeConvertCurrencyObj.symbol}}{{limitExchange.transformBuyPrice}}
                  </div>
                </div>
                <!--买入量-->
                <div class="input">
                  <input
                    type="text"
                    placeholder="买入量"
                    :ref="limitBuyCountInputRef"
                    @keyup="autoChangeData('limit-buy',limitBuyCountInputRef,activeSymbol.priceExchange)"
                    @input="formatInput(limitBuyCountInputRef,activeSymbol.priceExchange)"
                  >
                  <span class="currency">{{activeSymbol.sellsymbol}}</span>
                </div>
                <!--交易密码-->
                <div class="input">
                  <input
                    type="password"
                    placeholder="交易密码"
                    v-model="payPwd"
                  >
                </div>
                <!--滑块-->
                <div class="slider">
                </div>
                <!--预计交易额 手续费-->
                <div class="volume-rate">
                  <div class="item">
                    <span>预计交易额：</span>
                    <!--<span class="buy">{{limitExchange.buyAmount}}</span>-->
                    <span class="buy">{{limitBuyAmount}}</span>
                    <span>{{activeSymbol.area}}</span>
                  </div>
                </div>
                <div class="submit">
                  <el-button
                    class="submit-btn buy-btn"
                    @click="addEntrust(0)"
                  >买入</el-button>
                </div>
              </div>
            </div>
            <div class="middle-line"></div>
            <div class="inner-box right">
              <div class="header">
                <div class="left item">
                  <IconFont iconName="icon-qianbao-"/>
                  <span class="margin-left10 sell">
                    可卖：
                    <span>--</span>
                    <span>{{activeSymbol.sellsymbol}}</span>
                  </span>
                </div>
                <div class="right item">
                  <router-link to="/PersonalCenter">充币</router-link>
                  <router-link to="/PersonalCenter">提币</router-link>
                </div>
              </div>
              <div class="content">
                <!--卖出价-->
                <div class="input">
                  <input
                    type="text"
                    placeholder="卖出价"
                    :ref="limitSellPriceInputRef"
                    @keyup="autoChangeData('limit-sell',limitSellPriceInputRef,activeSymbol.priceExchange)"
                    @input="formatInput(limitSellPriceInputRef,activeSymbol.priceExchange)"
                  >
                  <span class="currency">{{activeSymbol.area}}</span>
                  <div
                    class="rate-changer"
                    v-show="activeConvertCurrencyObj&&(limitExchange.transformSellPrice-0)"
                  >
                    ≈ {{activeConvertCurrencyObj.symbol}}{{limitExchange.transformSellPrice}}
                  </div>
                </div>
                <!--卖出量-->
                <div class="input">
                  <input
                    type="text"
                    placeholder="卖出量"
                    :ref="limitSellCountInputRef"
                    @keyup="autoChangeData('limit-sell',limitSellCountInputRef,activeSymbol.priceExchange)"
                    @input="formatInput(limitSellCountInputRef,activeSymbol.priceExchange)"
                  >
                  <span class="currency">{{activeSymbol.sellsymbol}}</span>
                </div>
                <!--交易密码-->
                <div class="input">
                  <input
                    type="password"
                    placeholder="交易密码"
                    v-model="payPwd"
                  >
                </div>
                <!--滑块-->
                <div class="slider">
                </div>
                <!--预计交易额 手续费-->
                <div class="volume-rate">
                  <div class="item">
                    <span>预计交易额：</span>
                    <!--<span class="sell">{{limitExchange.sellAmount}}</span>-->
                    <span class="sell">{{limitSellAmount}}</span>
                    <span>{{activeSymbol.area}}</span>
                  </div>
                </div>
                <div class="submit">
                  <el-button
                    class="submit-btn sell-btn"
                    @click="addEntrust(1)"
                  >卖出</el-button>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="市价交易"
          name="market-price"
        >
          <div class=" content-box market">
            <div class="inner-box left">
              <div class="header">
                <div class="left item">
                  <IconFont iconName="icon-qianbao-"/>
                  <span class="margin-left10 buy">
                    可买：
                    <span>--</span>
                    <span>{{activeSymbol.sellsymbol}}</span>
                  </span>
                </div>
                <div class="right item">
                  <router-link to="/PersonalCenter">充币</router-link>
                  <router-link to="/PersonalCenter">提币</router-link>
                </div>
              </div>
              <div class="content">
                <!--市场成交价-->
                <div class="input">
                  <div class="market-price buy-price">市场成交价</div>
                  <span class="currency">{{activeSymbol.area}}</span>
                </div>
                <!--买入量-->
                <div class="input">
                  <input
                    type="text"
                    placeholder="买入量"
                    :ref="marketBuyCountInputRef"
                    @keyup="formatInput(marketBuyCountInputRef,activeSymbol.priceExchange)"
                    @input="formatInput(marketBuyCountInputRef,activeSymbol.priceExchange)"
                  >
                  <span class="currency">{{activeSymbol.sellsymbol}}</span>
                </div>
                <!--交易密码-->
                <div class="input">
                  <input
                    type="password"
                    placeholder="交易密码"
                    v-model="payPwd"
                  >
                </div>
                <!--滑块-->
                <div class="slider">
                </div>
                <!--预计交易额 手续费-->
                <div class="volume-rate">
                  <div class="item">
                    <span>预计交易额：</span>
                    <span class="buy">0</span>
                    <span>{{activeSymbol.area}}</span>
                  </div>
                </div>
                <div class="submit">
                  <el-button
                    class="submit-btn buy-btn"
                    @click="addEntrust(0)"
                  >买入</el-button>
                </div>
              </div>
            </div>
            <div class="middle-line"></div>
            <div class="inner-box right">
              <div class="header">
                <div class="left item">
                  <IconFont iconName="icon-qianbao-"/>
                  <span class="margin-left10 sell">
                    可卖：
                    <span>--</span>
                    <span>{{activeSymbol.sellsymbol}}</span>
                  </span>
                </div>
                <div class="right item">
                  <router-link to="/PersonalCenter">充币</router-link>
                  <router-link to="/PersonalCenter">提币</router-link>
                </div>
              </div>
              <div class="content">
                <!--市场成交价-->
                <div class="input">
                  <div class="market-price sell-price">市场成交价</div>
                  <span class="currency">{{activeSymbol.area}}</span>
                </div>
                <!--卖出量-->
                <div class="input">
                  <input
                    type="text"
                    placeholder="卖出量"
                    :ref="marketSellCountInputRef"
                    @keyup="formatInput(marketSellCountInputRef,activeSymbol.priceExchange)"
                    @input="formatInput(marketSellCountInputRef,activeSymbol.priceExchange)"
                  >
                  <span class="currency">{{activeSymbol.sellsymbol}}</span>
                </div>
                <!--交易密码-->
                <div class="input">
                  <input
                    type="password"
                    placeholder="交易密码"
                    v-model="payPwd"
                  >
                </div>
                <!--滑块-->
                <div class="slider">
                </div>
                <!--预计交易额 手续费-->
                <div class="volume-rate">
                  <div class="item">
                    <span>预计交易额：</span>
                    <span class="sell">0</span>
                    <span>{{activeSymbol.area}}</span>
                  </div>
                </div>
                <div class="submit">
                  <el-button
                    class="submit-btn sell-btn"
                    @click="addEntrust(1)"
                  >卖出</el-button>
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
import {saveEntrustTrade} from '../../utils/api/trade'
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
      payPwd: '', // 交易密码
      buyInputValue: '', // 买入input
      pointLength: 4, // 当前币种小数点限制位数
      matchType: 'LIMIT', // 撮合类型： LIMIT:限价单 MARKET:市价单
      limitExchange: {
        buyPrice: 0,
        transformBuyPrice: 0, // 转换后的价格
        buyCount: 0,
        buyAmount: 0, // 买入成交额
        sellPrice: 0,
        transformSellPrice: 0, // 转换后的价格
        sellCount: 0,
        sellAmount: 0 // 卖出成交额
      },
      marketExchange: {
        buyPrice: 0,
        buyCount: 0,
        buyAmount: 0, // 买入成交额
        sellPrice: 0,
        sellCount: 0,
        sellAmount: 0 // 卖出成交额
      },
      reflashCount: 0, // 当前交易对刷新次数
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
  },
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'TOGGLE_REFRESH_ENTRUST_LIST_STATUS'
    ]),
    // 截取2位小数
    keep2Num (number) {
      return keep2Num(number)
    },
    // 设置转换后的价格
    setTransformPrice (type, targetNum) {
      switch (type) {
        case 'limit-buy':
          this.limitExchange.transformBuyPrice = this.keep2Num(this.currencyRateList[this.activeSymbol.area] * targetNum)
          console.log(targetNum)
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
      this.formatInput(ref, pointLength)
      // let buyPriceVal = 0
      // let buyCountVal = 0
      switch (type) {
        // 限价买
        case 'limit-buy':
          this.limitExchange.buyPrice = this.getRefValue(this.limitBuyPriceInputRef)
          this.limitExchange.buyCount = this.getRefValue(this.limitBuyCountInputRef)
          this.setTransformPrice('limit-buy', this.limitExchange.buyPrice)
          break
        // 限价卖
        case 'limit-sell':
          this.limitExchange.sellPrice = this.getRefValue(this.limitSellPriceInputRef)
          this.limitExchange.sellCount = this.getRefValue(this.limitSellCountInputRef)
          this.setTransformPrice('limit-sell', this.limitExchange.sellPrice)
          break
        // 市价买
        case 'market-buy':
          break
        // 市价卖
        case 'market-sell':
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
      return formatNumberInput(target, pointLength)
    },
    // 新增委单
    async addEntrust (type) {
      if (!this.isLogin) {
        this.$router.push('/login')
        return false
      }
      console.log(this.activeSymbol)
      let params = {
        partnerId: this.partnerId,
        userId: this.loginStep1Info.userId,
        tradeId: this.activeSymbol.tradeId + '',
        payPwd: this.payPwd,
        type: type ? 'SELL' : 'BUY', // 委单类型
        matchType: this.matchType, // 撮合类型
        source: 'Web' // 来源
      }
      // 限价单添加价格
      switch (type) {
        // 买单
        case 0:
          switch (this.matchType) {
            case 'LIMIT':
              params.price = this.$refs[this.limitBuyPriceInputRef].value
              params.count = this.$refs[this.limitBuyCountInputRef].value
              break
            case 'MARKET':
              params.count = this.$refs[this.marketBuyCountInputRef].value
              console.log(params)
              break
          }
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
          break
      }

      console.log(params)
      console.log(this.activeSymbol)
      const data = await saveEntrustTrade(params)
      if (!returnAjaxMessage(data, this, 1)) {
        return false
      } else {
        this.TOGGLE_REFRESH_ENTRUST_LIST_STATUS(true)
        console.log(this.refreshEntrustStatus)
      }
      console.log(data)
    },
    // 设置买卖价格
    setBuyAndSellPrice (targetPrice) {
      this.$refs[this.limitBuyPriceInputRef].value = targetPrice
      this.$refs[this.limitSellPriceInputRef].value = targetPrice
      const newBuyPrice = this.formatInput(this.limitBuyPriceInputRef, this.activeSymbol.priceExchange)
      const newSellPrice = this.formatInput(this.limitSellPriceInputRef, this.activeSymbol.priceExchange)
      console.log(newBuyPrice)
      this.setTransformPrice('limit-buy', newBuyPrice)
      this.setTransformPrice('limit-sell', newSellPrice)
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
      activeConvertCurrencyObj: state => state.common.activeConvertCurrencyObj // 目标货币

    }),
    // 限价买预计成交额
    limitBuyAmount () {
      return this.limitExchange.buyPrice * this.limitExchange.buyCount
    },
    // 限价买预计成交额
    limitSellAmount () {
      return this.limitExchange.sellPrice * this.limitExchange.sellCount
    }
    // limitExchange[buyAmount] () {
    //   console.log(this.limitExchange.buyPrice * this.limitExchange.buyCount)
    //   return this.limitExchange.buyPrice * this.limitExchange.buyCount
    // }
  },
  watch: {
    activeSymbol (newVal) {
      if (!this.reflashCount) {
        this.reflashCount++
        this.setBuyAndSellPrice(newVal.price)
      }
    },
    // 用户手动设置价格
    activePriceItem (newVal) {
      console.log(newVal)
      this.setBuyAndSellPrice(newVal)
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
        >a{
          color: $mainColor;
        }
      }
      .content-box{
        padding:22px 28px;
        display:flex;
        position: relative;
        width:100%;
        height:100%;
        >.inner-box{
          flex:1;
          >.header{
            display:flex;
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
      background-color: $nightMainContentBgColor;
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
                  background-color: $mainNightBgColor;
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
