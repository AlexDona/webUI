<template>
  <div class="otc-entrust-order-box otc">
    <!-- 委托订单表格 -->
    <div class="otc-entrust-order-table">
      <el-table
        :data="tableData"
      >
        <!-- 类型 -->
        <el-table-column
          label="类型"
        >
          <template slot-scope = "scope">
            <div>买入</div>
          </template>
        </el-table-column>
        <!-- 币种 -->
        <el-table-column
          label="币种"
        >
          <template slot-scope = "scope">
            <div>FUC</div>
          </template>
        </el-table-column>
        <!-- 价格 -->
        <el-table-column
          label="价格"
        >
          <template slot-scope = "scope">
            <div>88888888CNY</div>
          </template>
        </el-table-column>
        <!-- 挂单数量 -->
        <el-table-column
          label="挂单数量"
        >
          <template slot-scope = "scope">
            <div>0.235844BTC</div>
          </template>
        </el-table-column>
        <!-- 已匹配数量 -->
        <el-table-column
          label="已匹配数量"
        >
          <template slot-scope = "scope">
            <div>0.12525BTC</div>
          </template>
        </el-table-column>
        <!-- 总金额 -->
        <el-table-column
          label="总金额"
        >
          <template slot-scope = "scope">
            <div>88888888CNY</div>
          </template>
        </el-table-column>
        <!-- 挂单时间 -->
        <el-table-column
          label="挂单时间"
        >
          <template slot-scope = "scope">
            <div>2018-08-10 12:20:58</div>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
          label = "操作"
        >
          <template slot-scope = "scope">
            <div>
              <span
                class="otc-table-action-cancellations"
              >
                撤单
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
export default {
  components: {},
  // props,
  data () {
    return {
      tableData: [{}]
    }
  },
  created () {
    require('../../../static/css/list/OTC/OTCEntrustOrder.css')
    require('../../../static/css/theme/day/OTC/OTCEntrustOrderDay.css')
    require('../../../static/css/theme/night/OTC/OTCEntrustOrderNight.css')
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {},
  filter: {},
  computed: {},
  watch: {}
}
</script>
<style scoped lang="scss">
@import url(../../../static/css/scss/OTC/OTCEntrustOrder.scss);
.otc-entrust-order-box{
  .otc-entrust-order-table{
    .otc-table-action-cancellations{
      color: #5E95EC;
      cursor: pointer;
    }
  }
}
</style>
