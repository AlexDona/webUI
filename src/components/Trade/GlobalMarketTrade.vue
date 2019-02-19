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
                      {{$scientificToNumber(cutOutPointLength(item.boursePrice, 8))}}
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
                      {{formatCount($keep2Num(item.bourseCount))}}
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
  getNestedData
} from '../../utils/commonFunc'
import {getGlobalMarket} from '../../utils/api/trade'
import {
  cutOutPointLength
} from '../../utils'

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
    this.getGlobalMarket()
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 交易价转换
    formatPrice (price) {
      return this.$keep2Num((this.currencyRateList[this.activeSymbol.area] - 0) * price)
    },
    // 成交量格式化
    formatCount (targetNum, targetPrice) {
      return this.$formatCount(targetPrice ? this.$keep2Num((this.currencyRateList[this.activeSymbol.area] - 0) * targetPrice * targetNum) : targetNum)
    },
    cutOutPointLength (num, pointLength) {
      return cutOutPointLength(num, pointLength)
    },
    // 获取全球行情
    async getGlobalMarket () {
      let params = `${this.activeSymbol.sellsymbol}_${this.activeSymbol.area}`.toUpperCase()
      const symbol = params.split('_')[0]
      const area = params.split('_')[1]
      if (!symbol || !area) {
        return false
      }
      const data = await getGlobalMarket(params)
      if (!data) return false
      this.globalMarketList = getNestedData(data, 'data') || []
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
    activeSymbolId: {
      handler (newVal) {
        if (newVal) {
          this.getGlobalMarket()
        }
      },
      immediate: true
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
@import '../../../static/css/scss/index.scss';
@import '../../../static/css/scss/Trade/TradeCenter.scss';

.global-market-box {
  > .inner-box {
    > .title {
      height: 34px;
      padding: 0 4.5%;

      /* font-weight: 700; */
      margin-bottom: 1px;
      line-height: 34px;

      > .text {
        display: inline-block;
        height: 100%;
        border-bottom: 2px solid $mainColor;
        text-indent: 4px;
        color: $mainColor;
      }
    }

    > .content {
      width: 100%;
      height: 238px;

      .table-box {
        width: 100%;

        > .thead {
          box-sizing: border-box;
          width: 100%;
          height: 38px;

          /* background-color: yellow; */
          padding: 0 4.5%;
          border-bottom: 1px solid rgba(57, 66, 77, .2);

          > .tr {
            width: 100%;

            > .th {
              display: inline-block;
              width: 16%;
              line-height: 38px;

              &.symbol {
                width: 26%;
                text-align: right;
              }

              &.price {
                width: 26%;
                text-align: right;
              }

              &.count {
                width: 31%;
                text-align: right;
              }
            }
          }
        }

        > .tbody {
          box-sizing: border-box;
          height: 200px;
          padding: 0 4.5%;
          overflow-y: auto;

          > .tr {
            height: 50px;

            > .td {
              display: inline-block;
              width: 16%;
              height: 100%;
              line-height: 50px;

              /* background: blue; */
              vertical-align: middle;
              white-space: nowrap;

              &.symbol {
                width: 26%;
                text-align: right;
              }

              &.price {
                width: 26%;
                text-align: right;
              }

              &.count {
                width: 31%;
                text-align: right;
              }

              > .top {
                margin-top: 5px;
              }

              > .up {
                color: $upColor;
              }

              > .down {
                color: $downColor;
              }

              > .top,
              > .bottom {
                line-height: 20px;
              }
            }
          }
        }
      }
    }
  }

  /deep/ {
    .el-table {
      td {
        height: 50px;
        padding: 0;
        font-size: 12px;
      }

      th {
        height: 36px;

        > .cell {
          padding-right: 0;
        }
      }
    }

    .el-table__header-wrapper {
      height: 36px;
    }
  }

  &.night {
    > .inner-box {
      > .title {
        color: $mainNightTitleColor;
        background-color: $mainContentNightBgColor;
        box-shadow: 2px 0 3px rgba(27, 35, 49, 1);
      }

      > .content {
        color: $nightFontColor;
        background-color: $mainContentNightBgColor;

        .thead {
          color: $mainNightTitleColor;
        }
      }
    }
  }

  &.day {
    > .inner-box {
      > .title {
        color: $dayMainTitleColor;
        background-color: $dayMainBgColor;
        box-shadow: 2px 0 3px rgba(239, 239, 239, 1);
      }

      > .content {
        color: $dayFontColor;
        background-color: #fff;
      }
    }
  }
}
</style>
