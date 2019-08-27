<!--
  author: zhaoxinlei
  update: 20190801
  description: 当前页面为 币币交易 顶部信息页面 主页面
-->
<template lang="pug">
  .middle-header-box.trade(:class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }")
    .left
      // 交易对
      .symbol
        img.logo(:src="$middleTopData_S_X.image")
        span.sell-name {{$middleTopData_S_X.sellsymbol}}/
        span.buy-name {{$middleTopData_S_X.area}}
      .split
      // 最新价
      .price
        span.price(:class="{'up':$middleTopData_S_X.chg > 0,'down':$middleTopData_S_X.chg < 0}")  {{$scientificToNumber($middleTopData_S_X.last)}}
        span.estimation ≈ {{activeConvertCurrencyObj.symbol}}{{estimation}}
      //  涨跌
      .rose
        span {{ $t('M.trade_ups_and_downs') }}
        span.rose(
          :class="{'up':$middleTopData_S_X.chg > 0,'down':$middleTopData_S_X.chg < 0}"
          v-show="String($keep2Num($middleTopData_S_X.chg))!='NaN'"
        )
          span(v-show="$middleTopData_S_X.chg > 0") +
          span {{$keep2Num($middleTopData_S_X.chg)}}%
      // 最高
      .highest
        span {{$t('M.trade_highest')}}
        span.value(
        ) {{$scientificToNumber($middleTopData_S_X.high)}}
      // 最低
      .lower
        span {{$t('M.trade_minimum')}}
        span.value(
        ) {{$scientificToNumber($middleTopData_S_X.low)}}
      // 24H成交量
      .hour24down
        span {{$t('M.comm_trading_volume3')}}
        span.value(
          v-show="String($formatCount($middleTopData_S_X.vol24hour))!='NaN'"
        ) {{$scientificToNumber($middleTopData_S_X.vol24hour)}}
    .right
      button.kline(@click="toggleKlineDepth('kline')"
        :class="{active: isShowKline}"
      ) K线图
      button.depth(
        @click="toggleKlineDepth('depth')"
        :class="{active: !isShowKline}"
      ) 深度图
</template>
<script>
import {
  mapState,
  mapMutations
} from 'vuex'

export default {
  // components: {},
  // props,
  // data () {
  //   return {}
  // },
  // created () {},
  // mounted () {},
  // update () {},
  // beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'UPDATE_KLINE_AND_DEPTH_SHOW_STATUS_M'
    ]),
    // 切换K线、深度图
    toggleKlineDepth (content) {
      this.UPDATE_KLINE_AND_DEPTH_SHOW_STATUS_M(content)
    }
  },
  // filter: {},
  computed: {
    ...mapState({
      currencyRateList: state => state.common.currencyRateList, // 折算货币列表
      activeConvertCurrencyObj: state => state.common.activeConvertCurrencyObj, // 目标货币
      showKlineOrDepth_S: state => state.trade.showKlineOrDepth_S
    }),
    estimation () {
      return this.$keepCurrentNum((this.currencyRateList[this.$middleTopData_S_X.area] - 0) * (this.$middleTopData_S_X.last - 0), this.$middleTopData_S_X.legalCurrencyDecimal) || '--'
    },
    isShowKline () {
      return this.showKlineOrDepth_S == 'kline'
    }
  }
  // watch: {}
}
</script>
<style lang="stylus">
  @import '../../assets/CSS/index.styl'
  .middle-header-box
    display flex
    justify-content space-between
    height 42px
    line-height 42px
    padding 0 8px
    >.left
      display flex
      align-items center
      >.symbol
        white-space nowrap
        >.logo,
        >.sell-name,
        >.buy-name
          vertical-align middle
        >.logo
          height 20px
          margin-right 8px
        >.sell-name,
        >.buy-name
          font-weight 700
          font-size 14px
      >.split
        width 1px
        height 20px
        margin 0 10px
        vertical-align middle
      /* 最新价 */
      >.price
        white-space nowrap
        >.price
          font-size 14px
          &.up
            color #f03e3e
          &.down
            color #41b37d
        >.estimation
          margin-left 5px
          font-size 14px
      >.rose
        white-space nowrap
        font-size 14px
        margin-left 32px
        >span
          margin 0 5px
          &.rose
            &.up
              color #f03e3e
            &.down
              color #41b37d
      >.highest,
      >.lower,
      >.hour24down
        white-space nowrap
        font-size 14px
        margin-left 32px
        >span
          margin 0 5px
    >.right
      button
        font-size 14px
        padding 0 10px
        cursor pointer
        white-space nowrap
        &.active
          color S_main_color
    &.night
      background-color #23273c
      >.left
        >.symbol
          >.sell-name,
          >.buy-name
            color #fff
        >.split
          background linear-gradient(0deg,rgba(35,39,60,1) 0%,rgba(102,113,143,1) 50%,rgba(35,39,60,1) 100%)
        /* 最新价 */
        >.price
          >.price
            color #fff
            &.up
              color #f03e3e
            &.down
              color #41b37d
          >.estimation
            color #D9E1F1
        >.rose
          >span
            color #66718F
            &.rose
              color #fff
              &.up
                color #f03e3e
              &.down
                color #41b37d
        >.highest,
        >.lower,
        >.hour24down
          >span
            color #66718F
            &.value
              color #d9e1f1
      >.right
        button
          color #66718f
          &.active
            color S_main_color
    &.day
      background-color #f2f6fa
      border-bottom 1px solid #cfd5df
      >.left
        >.symbol
          >.sell-name,
          >.buy-name
            color #333
        >.split
          background linear-gradient(0deg,rgba(242,246,250,1) 0%,rgba(207,213,223,1) 50%,rgba(242,246,250,1) 100%)
        /* 最新价 */
        >.price
          >.price
            color #333
            &.up
              color #f03e3e
            &.down
              color #41b37d
          >.estimation
            color #333
        >.rose
          >span
            color #66718F
            &.rose
              color #333
              &.up
                color #f03e3e
              &.down
                color #41b37d
        >.highest,
        >.lower,
        >.hour24down
          >span
            color #66718F
            &.value
              color #333
      >.right
        button
          color #66718f
          &.active
            color S_main_color
</style>
<style lang="scss" scoped>
  @media screen and (max-width: 1921px) {
    .middle-header-box {
      > .left {
        > .split {
          margin: 0 5px;
        }

        > symbol,
        > .price {
          transform: scale(.8);
        }

        > .rose,
        > .highest,
        > .lower,
        > .hour24down {
          margin-left: 5px;
          transform: scale(.8);
        }
      }
    }
  }
</style>
