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
          全球行情
        </span>
      </div>
      <div class="content">
        <el-collapse-transition>
          <div v-show="contentShowStatus">
            <el-table
              :data="globalMarketList"
            >
              <el-table-column
                label="交易所"
              >
                <template slot-scope="s">
                  <span>
                    {{s.row.bourse}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="交易对"
              >
                <template slot-scope="s">
                  <span>
                    {{s.row.symbol}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="交易价"
              >
                <template slot-scope="s">
                  <div class="top"
                       style="height:15px;line-height: 15px"
                  >
                    <!--<span-->
                    <!--v-show="s.row.rose>0"-->
                    <!--style="color:#D45858;"-->
                    <!--&gt;-->
                    <!--{{s.row.price}}-->
                    <!--</span>-->
                    <!--<span-->
                    <!--v-show="s.row.rose<0"-->
                    <!--style="color:#008069;"-->
                    <!--&gt;-->
                    <!--{{s.row.price}}-->
                    <!--</span>-->
                    {{s.row.price}}
                  </div>
                  <!--货币转换-->
                  <div class="bottom"
                       style="height:15px;line-height: 15px">
                    ≈ 0.25
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="成交量(BTCCC)"
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
                        <!--<span-->
                          <!--v-show="s.row.rose>0"-->
                          <!--style="color:#D45858;"-->
                        <!--&gt;-->
                          <!--{{s.row.price}}-->
                        <!--</span>-->
                      <!--<span-->
                        <!--v-show="s.row.rose<0"-->
                        <!--style="color:#008069;"-->
                      <!--&gt;-->
                          <!--{{s.row.price}}-->
                        <!--</span>-->
                      {{s.row.price}}
                    </div>
                    <!--货币转换-->
                    <div class="bottom"
                         style="height:15px;line-height: 15px">
                      ≈ 0.25
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
    this.globalMarketList = [
      {
        id: 0,
        bourse: 'Fubt.top', // 交易所
        symbol: 'BTC/USDT', // 交易对
        price: 7718.94, // 交易价
        volume: 561.82 // 成交量
      },
      {
        id: 1,
        bourse: 'bitfinex', // 交易所
        symbol: 'BTC/USD', // 交易对
        price: 7718.94, // 交易价
        volume: 561.82 // 成交量
      },
      {
        id: 2,
        bourse: 'okex', // 交易所
        symbol: 'BTC/USDT', // 交易对
        price: 7718.94, // 交易价
        volume: 561.82 // 成交量
      },
      {
        id: 3,
        bourse: 'huobipro', // 交易所
        symbol: 'BTC/USD', // 交易对
        price: 7718.94, // 交易价
        volume: 561.82 // 成交量
      }
    ]
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 切换内容显示隐藏
    toggleShowContent () {
      this.contentShowStatus = !this.contentShowStatus
      console.log(this.contentShowStatus)
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import '../../../static/css/scss/Trade/TradeCenter.scss';
  .global-market-box{
    >.inner-box{
      >.title{
        height:34px;
        line-height: 34px;
        font-weight: 700;
        margin-bottom:4px;
        box-shadow:0 2px 6px rgba(0,0,0,.1);
        >.text{
          display:inline-block;
          text-indent: 4px;
          height:100%;
          border-bottom:2px solid $mainColor;
        }
      }
      >.content{
      }
    }
    &.night{
      >.inner-box{
        >.title{
          color:$nightMainTitleColor;
          background-color: $nightMainTitleBgColor;
        }
        >.content{
          background-color: $nightMainContentBgColor;
          color:$nightFontColor;
        }
      }
    }
    &.day{
      >.inner-box{
        >.title{
          color:$dayMainTitleColor;
          background-color: $dayMainBgColor;
        }
        >.content{
          background-color: #fff;
          color:$dayFontColor;
        }
      }
    }
  }
</style>
