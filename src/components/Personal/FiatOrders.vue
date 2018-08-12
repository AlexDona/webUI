<template>
  <div
    class="fiat-orders personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="personal-height background-color padding-left15 line-height70 font-size16">
      <span class="padding-left15">法币订单</span>
    </header>
    <div class="fiat-main background-color min-height500 margin-top5">
      <el-tabs v-model="activeName">
        <el-tab-pane
          label="交易中的订单"
          name="first"
        >
          交易中的订单
        </el-tab-pane>
        <el-tab-pane
          label="已完成订单"
          name="second"
        >
          已完成订单
        </el-tab-pane>
        <el-tab-pane
          label="已取消订单"
          name="third"
        >
          已取消订单
        </el-tab-pane>
        <el-tab-pane
          label="冻结中订单"
          name="fourth"
        >
          冻结中订单
        </el-tab-pane>
        <el-tab-pane
          label="委托订单"
          name="five"
        >
          委托订单
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
export default {
  components: {},
  // props,
  data () {
    return {
      activeName: 'first'
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../static/css/list/Personal/FiatOrders.css')
    // 白色主题样式
    require('../../../static/css/theme/day/Personal/FiatOrdersDay.css')
    // 黑色主题样式
    require('../../../static/css/theme/night/Personal/FiatOrdersNight.css')
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {},
  filter: {},
  computed: {
    ...mapState([
      'theme'
    ])
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../static/css/scss/Personal/CoinOrders.scss";
.fiat-orders{
  &.night{
    background-color: $nightBgColor;
    color:$nightFontColor;
    >.background-color{
      background-color: rgba(37, 46, 63, 1);
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
