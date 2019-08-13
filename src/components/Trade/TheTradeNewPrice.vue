<!--
  author: zhaoxinlei
  update: 20190801
  description: 当前页面为 币币交易 买卖单列表组件 最新价 组件
-->
<template lang="pug">
  dl.new-price(:class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }")
    dt.text-align-c.font-size16
      span(:class="{up:middleTopData.chg > 0,down:middleTopData.chg < 0}") {{$scientificToNumber(middleTopData.last)}}
      Iconfont(
        v-show="middleTopData.chg<0"
        iconName="icon-down"
      )
      Iconfont(
        v-show="middleTopData.chg > 0"
        iconName="icon-up"
      )
      span.font-size12(v-show="activeConvertCurrencyObj.symbol&&currencyRateList[middleTopData.area]") ≈ {{activeConvertCurrencyObj.symbol}}{{$keepCurrentNum((currencyRateList[middleTopData.area]-0)*(middleTopData.last-0), middleTopData.legalCurrencyDecimal)}}

</template>
<script>
import {mapState} from 'vuex'
export default {
  // components: {},
  // props,
  // data () {
  //   return {}
  // },
  // created () {},
  // mounted () {},
  // activated () {},
  // update () {},
  // beforeRouteUpdate () {},
  // methods: {},
  // filter: {},
  computed: {
    ...mapState({
      middleTopData: state => state.trade.middleTopData,
      currencyRateList: state => state.common.currencyRateList, // 折算货币列表
      activeConvertCurrencyObj: state => state.common.activeConvertCurrencyObj // 目标货币
    })
  }
  // watch: {}
}
</script>
<style lang="stylus">
  @import '../../assets/CSS/index.styl'
  .new-price
    height 28px
    line-height 28px
    >dt
      >span
        margin 0 3px
        &.up
          color S_error_color
        &.down
          color S_success_color
    &.night
      border-top 1px solid #131523
      border-bottom 1px solid #131523
    &.day
      border-top 1px solid #cfd5df
      border-bottom 1px solid #cfd5df
</style>
