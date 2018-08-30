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
          <el-table
            :data="commissionedByCurrent"
            style="width: 100%">
            <el-table-column
              label="时间"
            >
            </el-table-column>
            <el-table-column
              label="交易对"
            >
            </el-table-column>
            <el-table-column
              label="交易类型"
            >
            </el-table-column>
            <el-table-column
              label="方向"
            >
            </el-table-column>
            <el-table-column
              label="价格"
            >
            </el-table-column>
            <el-table-column
              label="数量"
            >
            </el-table-column>
            <el-table-column
              label="委托总额"
            >
            </el-table-column>
            <el-table-column
              label="已成交"
            >
            </el-table-column>
            <el-table-column
              label="未成交"
            >
            </el-table-column>
            <el-table-column
              label="操作"
            >
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane
          label="历史委托"
          name="second"
        >
          <el-table
            :data="commissionedByHistory"
            style="width: 100%">
            <el-table-column
              label="时间"
            >
            </el-table-column>
            <el-table-column
              label="交易对"
            >
            </el-table-column>
            <el-table-column
              label="交易类型"
            >
            </el-table-column>
            <el-table-column
              label="方向"
            >
            </el-table-column>
            <el-table-column
              label="价格"
            >
            </el-table-column>
            <el-table-column
              label="数量"
            >
            </el-table-column>
            <el-table-column
              label="委托总额"
            >
            </el-table-column>
            <el-table-column
              label="已成交"
            >
            </el-table-column>
            <el-table-column
              label="未成交"
            >
            </el-table-column>
            <el-table-column
              label="操作"
            >
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane
          label="成交明细"
          name="third"
        >
          <el-table
            :data="clinchDealDetail"
            style="width: 100%">
            <el-table-column
              label="时间"
            >
            </el-table-column>
            <el-table-column
              label="交易对"
            >
            </el-table-column>
            <el-table-column
              label="交易类型"
            >
            </el-table-column>
            <el-table-column
              label="方向"
            >
            </el-table-column>
            <el-table-column
              label="价格"
            >
            </el-table-column>
            <el-table-column
              label="数量"
            >
            </el-table-column>
            <el-table-column
              label="委托总额"
            >
            </el-table-column>
            <el-table-column
              label="已成交"
            >
            </el-table-column>
            <el-table-column
              label="未成交"
            >
            </el-table-column>
            <el-table-column
              label="操作"
            >
            </el-table-column>
          </el-table>
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
      activeName: 'first',
      commissionedByCurrent: [],
      commissionedByHistory: [],
      clinchDealDetail: []
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/TransactionType/CoinOrders.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/TransactionType/CoinOrdersDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/TransactionType/CoinOrdersNight.css')
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
  @import "../../../../static/css/scss/Personal/TransactionType/CoinOrders";
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
