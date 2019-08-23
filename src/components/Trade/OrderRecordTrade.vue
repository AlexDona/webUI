<!--
  author: zhaoxinlei
  update: 20190803
  description: 当前页面为 币币交易  最近成交记录 组件
-->
<template lang="pug">
  .order-record-box.trade(:class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }")
    .inner-box
      .title
        // 20190730发版要改为实时成交：已提国际化
        span.text {{ $t('M.trade_order_recent_deal') }}
      .content
        el-table.order-record-table(
          :data="orderRecordList"
          :empty-text="$t('M.comm_no_data')"
          height="302"
        )
          // 时间
          el-table-column(:label="$t('M.comm_time')")
            template(slot-scope="s")
              span.font-size12 {{timeFilters(s.row.time - 0)}}
          // 成交价
          el-table-column(:label="$t('M.otc_MerchantsOrders_transaction_price') + ('('+ ($middleTopData_S_X.area ? $middleTopData_S_X.area : '--') +')')")
            template(slot-scope="s")
              span.font-size12.text-align-r( :class="{buy:s.row.direction === 'BUY', sell: s.row.direction === 'SELL'}") {{$scientificToNumber(s.row.price)}}
          // 成交量
          el-table-column(:label="$t('M.comm_trading_volume1') +('('+($middleTopData_S_X.sellsymbol? $middleTopData_S_X.sellsymbol: '--')+')')")
            template(slot-scope="s")
              span.font-size12.text-align-r {{$scientificToNumber(s.row.amount)}}
</template>
<script>
import {timeFilter} from '../../utils'
import {mapState} from 'vuex'
export default {
  components: {},
  // props,
  data () {
    return {
      reflashCount: 0,
      contentShowStatus: true
    }
  },
  // created () {
  // console.log(this.$clientWidth_S_X)
  // },
  // mounted () {},
  // ,
  // update () {},
  // beforeRouteUpdate () {},
  methods: {
    // 时间格式化
    timeFilters (date) {
      return timeFilter(date, 'time')
    },
    // 切换内容显示隐藏
    toggleShowContent () {
      this.contentShowStatus = !this.contentShowStatus
    }
  },
  filter: {},
  computed: {
    ...mapState({
      orderRecordListByAjax: state => state.common.klineAjaxData.tardeRecordList,
      orderRecordListBySocket: state => state.common.socketData.tardeRecordList
    }),
    orderRecordList () {
      return (this.reflashCount < 1) ? this.orderRecordListByAjax : this.orderRecordListBySocket
    }
  },
  watch: {
    $activeSymbol_S_X () {
      this.reflashCount = 0
    },
    orderRecordListBySocket (newVal) {
      if (newVal) {
        // console.log(this.reflashCount)
        // console.log(newVal)
        this.reflashCount++
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import '../../assets/CSS/index.styl'
  .order-record-box
    height 337px
    overflow hidden
    >.inner-box
      >.title
        padding 0 10px
        height 34px
        line-height 34px
      >.content
        /deep/
          .order-record-table.el-table
            tr
              th
                padding 0 !important
                height 28px
                line-height 28px
                font-size 12px
                border-bottom none
                &:nth-of-type(2),
                &:nth-of-type(3)
                  text-align right
              td
                padding 0 !important
                border-bottom none
                >.cell
                  >span
                    color #D9E1F1
                    &.buy
                      color #F03E3E
                    &.sell
                      color #41B37D
                &:nth-of-type(2),
                &:nth-of-type(3)
                  text-align right
    &.night
      >.inner-box
        >.title
          background-color #23273C
          color #D9E1F1
        >.content
          /deep/
            .order-record-table.el-table
              background-color #1c1f32
              tr
                background-color #1c1f32
                &:hover
                  td
                    background-color #21253a
                th
                  border-bottom none
                  background-color transparent
                  >.cell
                    color #66718F
                td
                  border-bottom none
                  >.cell
                    >span
                      color #D9E1F1
                      &.buy
                        color #F03E3E
                      &.sell
                        color #41B37D
    &.day
      >.inner-box
        >.title
          background-color #f2f6fa
          color #333
        >.content
          /deep/
            .order-record-table.el-table
              background-color #fff
              tr
                background-color #fff
                &:hover
                  td
                    background-color #f2f6fa
                th
                  border-bottom none
                  background-color transparent
                  >.cell
                    color #66718f
                td
                  border-bottom none
                  >.cell
                    >span
                      color #596a7a
                      &.buy
                        color #F03E3E
                      &.sell
                        color #41B37D
</style>
