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
                <div class="tr">
                  <div class="th width20">交易所</div><div class="th">交易对</div><div class="th">交易价</div><div class="th count">成交量({{activeSymbol.sellsymbol}})</div>
                </div>
              </div>
              <div class="tbody">
                <div
                  class="tr"
                  v-for="(item,index) in globalMarketList"
                  :key="index"
                >
                  <div class="td width20">
                    {{item.bourseName}}
                  </div><div class="td">
                    {{item.bourseTrade.split('_').join('/')}}
                  </div><div class="td">
                    <div class="top">
                      {{keep2Num(item.boursePrice)}}
                      </div>
                      <!--货币转换-->
                      <div class="bottom"
                      v-show="currencyRateList[activeSymbol.area]"
                      >
                      ≈ {{keep2Num((currencyRateList[activeSymbol.area]-0)*item.boursePrice)}}
                      </div>
                  </div><div class="td count">
                      <div class="top"
                      >
                      {{keep2Num(item.bourseCount)}}
                      </div>
                      <!--货币转换-->
                      <div
                        class="bottom"
                      >
                        ≈ {{keep2Num((currencyRateList[item.bourseTrade.split('_')[1]]-0)*item.bourseCount)}}
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
import {returnAjaxMessage} from '../../utils/commonFunc'
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
    keep2Num (targetNum) {
      return keep2Num(targetNum)
    },
    // 获取全球行情
    async getGlobalMarket () {
      let params = `${this.activeSymbol.sellsymbol}_${this.activeSymbol.area}`.toUpperCase()

      const data = await getGLobalMarket(params)
      if (!returnAjaxMessage(data, this, 0)) {
        return false
      } else {
        this.globalMarketList = data.data.data
      }
    },
    // 切换内容显示隐藏
    toggleShowContent () {
      this.contentShowStatus = !this.contentShowStatus
      console.log(this.contentShowStatus)
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      activeSymbol: state => state.common.activeSymbol,
      activeSymbolId: state => state.common.activeSymbol.id,
      activeConvertCurrencyObj: state => state.common.activeConvertCurrencyObj, // 目标货币

      currencyRateList: state => state.common.currencyRateList // 折算货币列表
    })
  },
  watch: {
    currencyRateList (newVal) {
      console.log(newVal)
    },
    activeSymbolId (newVal) {
      console.log(newVal)
      if (newVal) {
        this.getGlobalMarket()
      }
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
                width:23%;
                display:inline-block;
                line-height: 38px;
                &.width20{
                  width:20%;
                }
                &.count{
                  width:33%
                }
              }
            }
          }
          >.tbody{
            height:200px;
            /*background-color: pink;*/
            overflow-y: auto;
            padding:0 4.5%;
            box-sizing: border-box;
            >.tr{
              height:50px;
              >.td{
                display: inline-block;
                width:22%;
                height: 100%;
                /*background: blue;*/
                vertical-align: middle;
                line-height: 50px;
                &.width20{
                  width:20%;
                }
                &.count{
                  width:33%
                }
                >.top{
                  margin-top:5px;
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
          color:$nightMainTitleColor;
          background-color: $mainContentNightBgColor;
          box-shadow:2px 0px 3px rgba(27,35,49,1);
        }
        >.content{
          background-color: $mainContentNightBgColor;
          color:$nightFontColor;
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
