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
                    <span>BTC</span>
                  </span>
                </div>
                <div class="right item">
                  <router-link to="/">充币</router-link>
                  <router-link to="/">提币</router-link>
                </div>
              </div>
              <div class="content">
                <!--买入价-->
                <div class="input">
                  <input
                    type="text"
                    placeholder="买入价"
                    :ref="limitBuyPriceInputRef"
                    @keyup="formatInput(limitBuyPriceInputRef,pointLength)"
                    @input="formatInput(limitBuyPriceInputRef,pointLength)"
                  >
                  <span class="currency">FBT</span>
                  <div class="rate-changer">
                    ≈ 0.25
                  </div>
                </div>
                <!--买入量-->
                <div class="input">
                  <input
                    type="text"
                    placeholder="买入量"
                    :ref="limitBuyAcountInputRef"
                    @keyup="formatInput(limitBuyAcountInputRef,pointLength)"
                    @input="formatInput(limitBuyAcountInputRef,pointLength)"
                  >
                  <span class="currency">BTC</span>
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
                    <span>FBT</span>
                  </div>
                  <div class="item right">
                    <span>手续费：</span>
                    <span class="buy">0</span>
                    <span>FBT</span>
                    <span>
                      (费率：<span class="buy">0.1%</span>)
                    </span>
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
                    可买：
                    <span>--</span>
                    <span>BTC</span>
                  </span>
                </div>
                <div class="right item">
                  <router-link to="/">充币</router-link>
                  <router-link to="/">提币</router-link>
                </div>
              </div>
              <div class="content">
                <!--卖出价-->
                <div class="input">
                  <input
                    type="text"
                    placeholder="卖出价"
                    :ref="limitSellPriceInputRef"
                    @keyup="formatInput(limitSellPriceInputRef,pointLength)"
                    @input="formatInput(limitSellPriceInputRef,pointLength)"
                  >
                  <span class="currency">FBT</span>
                  <div class="rate-changer">
                    ≈ 0.25
                  </div>
                </div>
                <!--卖出量-->
                <div class="input">
                  <input
                    type="text"
                    placeholder="卖出量"
                    :ref="limitSellAcountInputRef"
                    @keyup="formatInput(limitSellAcountInputRef,pointLength)"
                    @input="formatInput(limitSellAcountInputRef,pointLength)"
                  >
                  <span class="currency">BTC</span>
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
                    <span>FBT</span>
                  </div>
                  <div class="item right">
                    <span>手续费：</span>
                    <span class="sell">0</span>
                    <span>FBT</span>
                    <span>
                      (费率：<span class="sell">0.1%</span>)
                    </span>
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
                    <span>BTC</span>
                  </span>
                </div>
                <div class="right item">
                  <router-link to="/">充币</router-link>
                  <router-link to="/">提币</router-link>
                </div>
              </div>
              <div class="content">
                <!--市场成交价-->
                <div class="input">
                  <!--<input-->
                    <!--type="text"-->
                    <!--placeholder="买入价"-->
                    <!--:ref="buyPriceInputRef"-->
                    <!--@keyup="formatInput(buyPriceInputRef,pointLength)"-->
                    <!--@input="formatInput(buyPriceInputRef,pointLength)"-->
                  <!--&gt;-->
                  <div class="market-price buy-price">市场成交价</div>
                  <span class="currency">FBT</span>
                </div>
                <!--买入量-->
                <div class="input">
                  <input
                    type="text"
                    placeholder="买入量"
                    :ref="marketBuyAcountInputRef"
                    @keyup="formatInput(marketBuyAcountInputRef,pointLength)"
                    @input="formatInput(marketBuyAcountInputRef,pointLength)"
                  >
                  <span class="currency">BTC</span>
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
                    <span>FBT</span>
                  </div>
                  <div class="item right">
                    <span>手续费：</span>
                    <span class="buy">0</span>
                    <span>FBT</span>
                    <span>
                      (费率：<span class="buy">0.1%</span>)
                    </span>
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
                    可买：
                    <span>--</span>
                    <span>BTC</span>
                  </span>
                </div>
                <div class="right item">
                  <router-link to="/">充币</router-link>
                  <router-link to="/">提币</router-link>
                </div>
              </div>
              <div class="content">
                <!--市场成交价-->
                <div class="input">
                  <!--<input-->
                    <!--type="text"-->
                    <!--placeholder="卖出价"-->
                    <!--:ref="sellPriceInputRef"-->
                    <!--@keyup="formatInput(sellPriceInputRef,pointLength)"-->
                    <!--@input="formatInput(sellPriceInputRef,pointLength)"-->
                  <!--&gt;-->
                  <div class="market-price sell-price">市场成交价</div>
                  <span class="currency">FBT</span>
                </div>
                <!--卖出量-->
                <div class="input">
                  <input
                    type="text"
                    placeholder="卖出量"
                    :ref="marketSellAcountInputRef"
                    @keyup="formatInput(marketSellAcountInputRef,pointLength)"
                    @input="formatInput(marketSellAcountInputRef,pointLength)"
                  >
                  <span class="currency">BTC</span>
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
                    <span>FBT</span>
                  </div>
                  <div class="item right">
                    <span>手续费：</span>
                    <span class="sell">0</span>
                    <span>FBT</span>
                    <span>
                      (费率：<span class="sell">0.1%</span>)
                    </span>
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
import {formatNumberInput} from '../../utils'
import {saveEntrustTrade} from '../../utils/api/apiDoc'
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
      limitBuyAcountInputRef: 'limitBuyAcountInput', // 限价交易 买入量input ref name
      marketBuyAcountInputRef: 'marketBuyAcountInput', // 市价交易 买入量input ref name
      limitSellPriceInputRef: 'limitSellPriceInput', // 限价交易 卖出价input ref name
      limitSellAcountInputRef: 'limitSellAcountInput', // 限价交易 卖出量input ref name
      marketSellAcountInputRef: 'marketSellAcountInput', // 市价交易 卖出量input ref name
      sellPriceInputRef: 'sellPriceInput', // 卖出价input ref name
      sellAcountInputRef: 'sellAcountInput', // 卖出量input ref name
      payPwd: '', // 交易密码
      buyInputValue: '', // 买入input
      pointLength: 4, // 当前币种小数点限制位数
      matchType: 'LIMIT', // 撮合类型： LIMIT:限价单 MARKET:市价单
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
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'TOGGLE_REFRESH_ENTRUST_LIST_STATUS'
    ]),
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
    // 新增委单
    async addEntrust (type) {
      let params = {
        partnerId: '474629374641963008',
        userId: '476053529258098688',
        tradeId: '477495977800892416',
        payPwd: this.payPwd,
        type: type ? 'SELL' : 'BUY', // 委单类型
        matchType: this.matchType, // 撮合类型
        source: 'Web' // 来源
      }
      console.dir(this.$refs[this.marketBuyAcountInputRef])
      // 限价单添加价格
      switch (type) {
        // 买单
        case 0:
          switch (this.matchType) {
            case 'LIMIT':
              params.price = this.$refs[this.limitBuyPriceInputRef].value
              params.count = this.$refs[this.limitBuyAcountInputRef].value
              break
            case 'MARKET':
              params.count = this.$refs[this.marketBuyAcountInputRef].value
              console.log(params)
              break
          }
          break
        // 卖单
        case 1:
          switch (this.matchType) {
            case 'LIMIT':
              params.price = this.$refs[this.limitSellPriceInputRef].value
              params.count = this.$refs[this.limitSellAcountInputRef].value
              break
            case 'MARKET':
              params.count = this.$refs[this.marketSellAcountInputRef].value
              break
          }
          break
      }

      // console.log(params)
      const data = await saveEntrustTrade(params)
      if (!returnAjaxMessage(data, this, 1)) {
        return false
      } else {
        this.TOGGLE_REFRESH_ENTRUST_LIST_STATUS(true)
        console.log(this.refreshEntrustStatus)
      }
      console.log(data)
    },
    // 输入限制
    formatInput (ref, pointLength) {
      let target = this.$refs[ref]
      formatNumberInput(target, pointLength)
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      refreshEntrustStatus: state => state.trade.refreshEntrustStatus
    })
  },
  watch: {}
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
            >.right{
              text-align: right;
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
                  border-color:#909090;
                  background-color: #33373b;
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
