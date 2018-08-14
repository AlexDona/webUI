<template>
  <div
    class="coin-orders personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="personal-height background-color line-height70 font-size16">
      <span class="padding-left15">币币订单</span>
    </header>
    <div class="min-height500 background-color margin-top5">
      <el-tabs v-model="activeName">
        <el-tab-pane
          label="当前委托"
          name="first"
        >
          当前委托
        </el-tab-pane>
        <el-tab-pane
          label="历史委托"
          name="second"
        >
          历史委托
        </el-tab-pane>
        <el-tab-pane
          label="成交明细"
          name="third"
        >
          成交明细
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
    require('../../../static/css/list/Personal/CoinOrders.css')
    // 白色主题样式
    require('../../../static/css/theme/day/Personal/CoinOrdersDay.css')
    // 黑色主题样式
    require('../../../static/css/theme/night/Personal/CoinOrdersNight.css')
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
  .coin-orders{
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      .background-color {
        background-color: rgba(37, 46, 63, 1);
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      .background-color {
        background-color: #CCCCCC;
      }
    }
  }
</style>
