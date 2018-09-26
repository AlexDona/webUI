<!--币币交易-->
<template>
  <div
    class="trade-box trade"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <HeaderCommon/>
    <div class="inner-box">
      <!--左侧-->
      <div class="left">
        <!--全球行情-->
        <GlobalMarket class="margin-bottom10"/>
        <!--买卖单-->
        <BuysAndSells class="margin-bottom10"/>
        <!--最近成交-->
        <OrderRecord class="margin-bottom10"/>
      </div>
      <!--中间-->
      <div
        class="middle"
        :class="{'day':theme == 'day','night':theme == 'night' }"
      >
        <MiddleHeader />
        <!--k线-->
        <KLine class=""/>
        <!--市价交易、限价交易-->
        <ExchangeBox/>
        <!--深度图-->
        <Depth/>
        <!--交易-->
        <!-- 委单列表 -->
        <EntrustOrder/>
      </div>
      <!--右侧-->
      <div class="right">
        <!--市场-->
        <TradeMarketList/>
      </div>
    </div>
  </div>
</template>
<script>
import EntrustOrder from './EntrustOrderList'
import ExchangeBox from './ExchangeTrade'
import TradeMarketList from './TradeMarket'
import HeaderCommon from '../Common/HeaderCommonForPC'
import GlobalMarket from './GlobalMarketTrade'
import BuysAndSells from './BuysAndSellsTrade'
import OrderRecord from './OrderRecordTrade'
import KLine from './kLine'
import MiddleHeader from './MiddleHeaderTrade'
import Depth from './DepthTrade'
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
    GlobalMarket,
    HeaderCommon
  },
  // props,
  data () {
    return {}
  },
  created () {
    require('../../../static/css/list/Trade/TradeCenter.css')
    require('../../../static/css/theme/day/Trade/TraderCenterDay.css')
    require('../../../static/css/theme/night/Trade/TradeCenterNight.css')
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
  @import "../../../static/css/scss/index.scss";
  @import "../../../static/css/scss/Trade/TradeCenter";
  .trade-box{
    min-width:1300px;
    width:100%;
    height:100%;
     >.inner-box{
       padding:14px 30px;
       display:flex;
       width:100%;
       >div{
         margin-right:8px;
         &:last-of-type{
           margin-right:0;
         }
       }
       >.left{
         min-width:450px;
         width:25%;
         /*flex:1;*/
         /*width:450px;*/
       }
       >.middle{
         width:50%;
         min-width:950px;
         /*flex:2;*/
         /*width:1010px;*/
       }
       >.right{
         min-width:450px;
         width:25%;
         /*flex:1;*/
         /*width:438px;*/
       }
     }
    &.night{
      >.inner-box{
        background-color: $mainNightBgColor;
        //background-color: red;
        >div{
        //  background-color: $nightMainTitleBgColor;
        }
      }
    }
    &.day{
      >.inner-box{
        background-color: $dayInnerBoxBg;
        >div{
          /*background-color: $dayMainBgColor;*/
        }
      }
    }
  }
</style>
