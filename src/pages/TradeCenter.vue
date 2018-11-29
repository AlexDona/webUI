<!--币币交易-->
<template>
  <div
    class="trade-box trade"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="inner-box clearfloat">
      <!--左侧-->
      <div class="left float-left">
        <!--全球行情-->
        <GlobalMarket class="margin-bottom10"/>
        <!--买卖单-->
        <BuysAndSells class="margin-bottom10"/>
        <!--最近成交-->
        <OrderRecord class="margin-bottom10"/>
      </div>
      <!--中间-->
      <div
        class="middle float-left"
        :class="{'day':theme == 'day','night':theme == 'night' }"
      >
        <MiddleHeader/>
        <!--k线-->
          <KLine/>
        <!--市价交易、限价交易-->
        <ExchangeBox/>
        <!--交易-->
        <!-- 委单列表 -->
        <EntrustOrder/>
        <!--深度图-->
        <Depth/>
      </div>
      <!--右侧-->
      <div class="right float-left">
        <!--市场-->
        <TradeMarketList/>
      </div>
    </div>
  </div>
</template>
<script>
import EntrustOrder from '../components/Trade/EntrustOrderList'
import ExchangeBox from '../components/Trade/ExchangeTrade'
import TradeMarketList from '../components/Trade/TradeMarket'
import GlobalMarket from '../components/Trade/GlobalMarketTrade'
import BuysAndSells from '../components/Trade/BuysAndSellsTrade'
import OrderRecord from '../components/Trade/OrderRecordTrade'
import KLine from '../components/Trade/kLine'
import MiddleHeader from '../components/Trade/MiddleHeaderTrade'
import Depth from '../components/Trade/DepthTrade'
import {mapState} from 'vuex'

export default {
  components: {
    EntrustOrder, // 委单列表
    ExchangeBox, // 交易区
    TradeMarketList, // 市场列表
    Depth, // 深度图
    MiddleHeader, // 中间header
    KLine, // k线
    OrderRecord, // 成交记录
    BuysAndSells, // 买卖单
    GlobalMarket
  },
  // props,
  data () {
    return {

    }
  },
  created () {
    require('../../static/css/list/Trade/TradeCenter.css')
    require('../../static/css/theme/day/Trade/TraderCenterDay.css')
    require('../../static/css/theme/night/Trade/TradeCenterNight.css')
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {},
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
  @import "../../static/css/scss/index";
  @import "../../static/css/scss/Trade/TradeCenter";
  .trade-box{
    margin-top:66px;
    min-width:1366px;
    width:100%;
    box-sizing: border-box;
     >.inner-box{
       padding:14px 1.5625%;
       display:block;
       box-sizing: border-box;
       width:100%;
       margin:0 auto;
       >div{
         margin-right:0.4166666666%;
         &:last-of-type{
           margin-right:0;
         }
       }
       >.left{
         width:22.909561217%;
         font-size: 12px;
       }
       >.middle{
         width:53.260869565%;
       }
       >.right{
         width:22.909561217%;
       }
     }
    &.night{
      >.inner-box{
        background-color: $mainNightBgColor;
      }
    }
    &.day{
      >.inner-box{
        background-color: $dayInnerBoxBg;
      }
    }
  }
</style>
