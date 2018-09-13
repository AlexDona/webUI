<template>
  <div
    class="fiat-orders personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="personal-height background-color line-height40 personal-height40 font-size16">
      <span class="padding-left15 fiat-color font-weight600">法币订单</span>
    </header>
    <div class="fiat-main background-color min-height500 margin-top9">
      <el-tabs v-model="activeName">
        <el-tab-pane
          label="交易中的订单"
          name="first"
        >
          <OTCTradingOrder />
        </el-tab-pane>
        <el-tab-pane
          label="已完成订单"
          name="second"
        >
          <OTCCompletedOrder />
        </el-tab-pane>
        <el-tab-pane
          label="已取消订单"
          name="third"
        >
          <OTCCanceledOrder />
        </el-tab-pane>
        <el-tab-pane
          label="冻结中订单"
          name="fourth"
        >
          <OTCFreezingOrder />
        </el-tab-pane>
        <el-tab-pane
          label="委托订单"
          name="five"
        >
          <OTCEntrustOrder />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import OTCTradingOrder from '../../OTC/OTCTradingOrder'
import OTCCompletedOrder from '../../OTC/OTCCompletedOrder'
import OTCCanceledOrder from '../../OTC/OTCCanceledOrder'
import OTCFreezingOrder from '../../OTC/OTCFreezingOrder'
import OTCEntrustOrder from '../../OTC/OTCEntrustOrder'
import {createNamespacedHelpers, mapState} from 'vuex'
const {mapMutations} = createNamespacedHelpers('OTC')
export default {
  components: {
    OTCTradingOrder, //  交易中订单
    OTCCompletedOrder, //  已完成订单
    OTCCanceledOrder, //  已取消订单
    OTCFreezingOrder, //  冻结中订单
    OTCEntrustOrder //  委托订单
  },
  // props,
  data () {
    return {
      activeName: 'first'
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/TransactionType/FiatOrders.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/TransactionType/FiatOrdersDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/TransactionType/FiatOrdersNight.css')
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_OTC_AVAILABLE_CURRENCY_NAME',
      'CHANGE_OTC_AVAILABLE_CURRENCY_ID',
      'CHANGE_OTC_AVAILABLE_PARTNER_COIN_ID'
    ])
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
  @import "../../../../static/css/scss/Personal/TransactionType/CoinOrders";
.fiat-orders{
  &.night{
    background-color: $nightBgColor;
    color:$nightFontColor;
    >.background-color{
      background-color: #1E2636;
      >.fiat-color{
        color: #338FF5;
      }
    }
  }
  &.day{
    background-color: $dayBgColor;
    color:$dayFontColor;
    >.background-color{
      background-color: #CCCCCC;
    }
  }
}
</style>
