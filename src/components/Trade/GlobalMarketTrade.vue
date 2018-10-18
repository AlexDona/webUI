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
      <div class="content">
        <el-collapse-transition>
          <div v-show="contentShowStatus">
            <el-table
              :data="globalMarketList"
            >
              <!--交易所-->
              <el-table-column
                :label="$t('M.comm_deal') + $t('M.comm_that')"
              >
                <template slot-scope="s">
                  <span>
                    {{s.row.bourseName}}
                  </span>
                </template>
              </el-table-column>
              <!--交易对-->
              <el-table-column
                :label="$t('M.comm_deal') + $t('M.comm_pair')"
              >
                <template slot-scope="s">
                  <span>
                    {{s.row.bourseTrade.split('_').join('/')}}
                  </span>
                </template>
              </el-table-column>
              <!--交易价-->
              <el-table-column
                :label="$t('M.comm_deal') + $t('M.comm_price')"
              >
                <template slot-scope="s">
                  <div class="top"
                       style="height:15px;line-height: 15px"
                  >
                    {{keep2Num(s.row.boursePrice)}}
                  </div>
                  <!--货币转换-->
                  <div class="bottom"
                       style="height:15px;line-height: 15px"
                       v-show="currencyRateList[activeSymbol.area]"
                  >
                    ≈ {{(currencyRateList[activeSymbol.area]-0)*s.row.boursePrice}}
                  </div>
                </template>
              </el-table-column>
              <!--成交量-->
              <el-table-column
                :label="$t('M.comm_make_bargain') + $t('M.comm_quantity') + ('('+ activeSymbol.area +')')"
              >
                <template slot-scope="s">
                  <div
                    style="
                        padding-left:10px;
                        width:160px;
                        height:30px;
                      ">
                    <div class="top"
                         style="height:15px;line-height: 15px"
                    >
                      {{keep2Num(s.row.bourseCount)}}
                    </div>
                    <!--货币转换-->
                    <div class="bottom"
                         style="height:15px;line-height: 15px">
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-transition>
      </div>
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
      currencyRateList: state => state.common.currencyRateList // 折算货币列表
    })
  },
  watch: {
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
        margin-bottom:4px;
        >.text{
          display:inline-block;
          text-indent: 4px;
          height:100%;
          border-bottom:2px solid $mainColor;
          color:$mainColor;
        }
      }
      >.content{
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
