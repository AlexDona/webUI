<!--
  author: zhaoxinlei
  update: 20190801
  description: 当前页面为 币币交易 主页面
-->
<template lang="pug">
  .trade-box.trade(:class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }")
    .inner-box
      .top.clearfloat
        // 左侧
        .left
          // 全球行情
          //GlobalMarket.margin-bottom10
          // 买卖单
          BuysAndSells.margin-bottom10
          // 最近成交
          OrderRecord.margin-bottom10
        // 中间
        .middle(:class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }")
          MiddleHeader
            // k线
          kLine(v-show="isShowKline")
          // 深度
          Depth(v-show="!isShowKline")
          //Depth
          // 市价交易、限价交易
          ExchangeBox(v-show="!isShowMask")
          .placeholder(v-show="isShowMask")
          // 活动遮罩
          .mask(v-show="isShowMask")
            PREMask(v-show="status=='coming' && partnerTradeId === tradeId")
        //  右侧
        .right
          Activity
          TradeMarketList
      .bottom
        EntrustOrder
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
import PREMask from '../components/Trade/PREMask'
import Activity from '../components/Trade/PRE'
import {mapState, mapMutations} from 'vuex'

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
    PREMask, // PRE活动遮罩
    Activity
  },
  // props,
  // data () {
  //   return {}
  // },
  // created () {
  // },
  mounted () {
    // this.UPDATE_KLINE_AND_DEPTH_SHOW_STATUS_M('kline')
  },
  // activated () {
  // },
  // update () {
  // },
  // beforeRouteUpdate () {
  // },
  methods: {
    ...mapMutations([
      'UPDATE_KLINE_AND_DEPTH_SHOW_STATUS_M'
    ])
  },
  // filter: {},
  computed: {
    ...mapState({
      showKlineOrDepth_S: state => state.trade.showKlineOrDepth_S
    }),
    isShowKline () {
      return this.showKlineOrDepth_S == 'kline'
    },
    status () {
      return this.$activityInfo_S_X.status
    },
    partnerTradeId () {
      return this.$middleTopData_S_X.partnerTradeId
    },
    tradeId () {
      return this.$activityInfo_S_X.tradeId
    },
    isShowMask () {
      return (this.$activityInfo_S_X.status == 'coming' && this.partnerTradeId === this.tradeId) && this.$activityInfo_S_X.showCountDown
    }
  }
  // watch: {}
}
</script>
<style lang="stylus">
  @import '../assets/CSS/index.styl'
  .trade-box
    margin-top 60px
    min-width 1366px
    >.inner-box
      padding 10px
      box-sizing border-box
      >.top
        display flex
        height 917px
        >.left
          width 330px
        >.middle
          flex 1
          margin 0 10px
          position relative
          min-width 880px
          >.mask
            position absolute
            z-index 3
            width 100%
            height calc(907px - 34px)
            top 34px
            left 0
        >.right
          width 330px
    /* 黑色主题 */
    &.night
      >.inner-box
        background-color #131523
        >.top
          >.left
          >.middle
            >.mask
              background-color pink
        >.bottom
          background-color pink
    /* 白色 */
    &.day
      >.inner-box
        background-color #e5ebf5
        >.top
          >.left
          >.middle
            >.mask
              background-color pink
        >.bottom
          background-color pink
</style>
