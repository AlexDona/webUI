<template>
  <div
    class="global-market-box trade"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="inner-box">
      <div
        class="title font-size16 cursor-pointer"
        @click="toggleShowContent"
      >
        <span class="text">
          <!--全球行情-->
          {{ $t('M.trade_global_market') }}
        </span>
      </div>
      <el-collapse-transition>
        <div
          class="content"
         v-show="contentShowStatus"
        >
          <div>
            <div class="table-box">
              <div class="thead">
                <!-- 交易所 交易对 交易价 成交量 -->
                <div class="tr">
                  <div class="th width20">{{ $t('M.common_exchange') }}</div><div class="th symbol">{{ $t('M.common_counterparty') }}</div><div class="th price">{{ $t('M.common_transaction_price') }}</div><div class="th count">{{ $t('M.common_trading_volume') }}({{activeSymbol.sellsymbol}})</div>
                </div>
              </div>
              <div
                class="tbody"
              >
                <div
                  class="tr"
                  v-for="(item,index) in globalMarketList"
                  :key="index"
                >
                  <div class="td">
                    {{item.bourseName}}
                  </div><div class="td symbol">
                    {{item.bourseTrade.split('_').join('/')}}
                  </div><div class="td price">
                    <div class="top">
                      {{keep2Num(item.boursePrice)}}
                    </div><!--货币转换-->
                    <div
                      class="bottom"
                      v-if="currencyRateList[activeSymbol.area]"
                      :class="{
                        'up':middleTopData.chg>0,
                        'down':middleTopData.chg<0
                      }"
                    >
                      ≈{{activeConvertCurrencyObj.symbol}}{{formatPrice(item.boursePrice)}}
                    </div>
                  </div><div class="td count">
                      <div class="top"
                      >
                      {{formatCount(keep2Num(item.bourseCount))}}
                      </div>
                      <!--货币转换-->
                      <div
                        class="bottom"
                        :class="{
                        'up':middleTopData.chg>0,
                        'down':middleTopData.chg<0
                      }"
                        v-if="currencyRateList[activeSymbol.area]&&item.bourseCount"
                      >
                        ≈{{activeConvertCurrencyObj.symbol}}{{formatCount(item.bourseCount,item.boursePrice)}}
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
      </el-collapse-transition>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import {
  returnAjaxMsg,
  getNestedData,
  formatCount
} from '../../utils/commonFunc'
import {getGLobalMarket} from '../../utils/api/trade'
import {keep2Num} from '../../utils'

export default {
  components: {},
  // props,
  data () {
    return {
      contentShowStatus: true,
      // 全球行情列表
      globalMarketList: []
    }
  },
  created () {
    require('../../../static/css/list/Trade/GlobalMarket.css')
    require('../../../static/css/theme/day/Trade/GlobalMarketTradeDay.css')
    require('../../../static/css/theme/night/Trade/GlobalMarketTradeNight.css')
    this.getGlobalMarket()
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 交易价转换
    formatPrice (price) {
      return keep2Num((this.currencyRateList[this.activeSymbol.area] - 0) * price)
    },
    // 成交量格式化
    formatCount (targetNum, targetPrice) {
      if (targetPrice) {
        return formatCount(keep2Num((this.currencyRateList[this.activeSymbol.area] - 0) * targetPrice * targetNum))
      } else {
        return formatCount(targetNum)
      }
    },
    keep2Num (targetNum) {
      return keep2Num(targetNum)
    },
    // 获取全球行情
    async getGlobalMarket () {
      let params = `${this.activeSymbol.sellsymbol}_${this.activeSymbol.area}`.toUpperCase()

      const data = await getGLobalMarket(params)
      if (!returnAjaxMsg(data, this, 0, 1)) {
        return false
      } else {
        console.log(data)
        if (data && data.data) {
          this.globalMarketList = getNestedData(data, 'data.data')
        }
      }
    },
    // 切换内容显示隐藏
    toggleShowContent () {
      this.contentShowStatus = !this.contentShowStatus
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language,
      middleTopData: state => state.trade.middleTopData,
      activeSymbol: state => state.common.activeSymbol,
      activeSymbolId: state => state.common.activeSymbol.id,
      activeConvertCurrencyObj: state => state.common.activeConvertCurrencyObj, // 目标货币
      currencyRateList: state => state.common.currencyRateList // 折算货币列表
    })
  },
  watch: {
    middleTopData (newVal) {
    },
    currencyRateList (newVal) {
      console.log(newVal)
    },
    activeSymbolId: {
      handler (newVal) {
        if (newVal) {
          this.getGlobalMarket()
        }
      },
      immediate: true
    },
    globalMarketList (newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss">
  @import '../../../static/css/scss/index.scss';
  @import '../../../static/css/scss/Trade/TradeCenter.scss';
  .global-market-box{
    >.inner-box{
      >.title{
        height:34px;
        line-height: 34px;
        /*font-weight: 700;*/
        margin-bottom:1px;
        padding:0 4.5%;
        >.text{
          display:inline-block;
          text-indent: 4px;
          height:100%;
          border-bottom:2px solid $mainColor;
          color:$mainColor;
        }
      }
      >.content{
        width:100%;
        height:238px;
        .table-box{
          width:100%;
          >.thead{
            height:38px;
            width:100%;
            /*background-color: yellow;*/
            padding:0 4.5%;
            box-sizing: border-box;
            border-bottom:1px solid rgba(57,66,77,.2);
            >.tr{
              width:100%;
              >.th{
                width:16%;
                display:inline-block;
                line-height: 38px;
                &.symbol{
                  width:26%;
                  text-align: right;
                }
                &.price{
                  width:26%;
                  text-align: right;
                }
                &.count{
                  width: 31%;
                  text-align: right;
                }
              }
            }
          }
          >.tbody{
            height:200px;
            overflow-y: auto;
            padding:0 4.5%;
            box-sizing: border-box;
            >.tr{
              height:50px;
              >.td{
                display: inline-block;
                width:16%;
                height: 100%;
                white-space:nowrap;
                /*background: blue;*/
                vertical-align: middle;
                line-height: 50px;
                &.symbol{
                  width:26%;
                  text-align: right;
                }
                &.price{
                  width:26%;
                  text-align: right;
                }
                &.count{
                  width:31%;
                  text-align: right;
                }
                >.top{
                  margin-top:5px;
                }
                >.up{
                  color:$upColor;
                }
                >.down{
                  color:$downColor;
                }
                >.top,>.bottom{
                  line-height: 20px;
                }
              }
            }
          }
        }
      }
    }
    &.night{
      >.inner-box{
        >.title{
          color:$mainNightTitleColor;
          background-color: $mainContentNightBgColor;
          box-shadow:2px 0px 3px rgba(27,35,49,1);
        }
        >.content{
          background-color: $mainContentNightBgColor;
          color:$nightFontColor;
          .thead{
            color:$mainNightTitleColor;
          }
        }
      }
    }
    &.day{
      >.inner-box{
        >.title{
          color:$dayMainTitleColor;
          background-color: $dayMainBgColor;
          box-shadow:2px 0px 3px rgba(239,239,239,1);
        }
        >.content{
          background-color: #fff;
          color:$dayFontColor;
        }
      }
    }
  }
</style>
