<template>
  <div class="otc-completed-order-box otc">
    <div class="completed-order-content">
      <el-table
        :data="tableData5"
        :default-expand-all="true"
      >
      <div>
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="completed-info">
              <!-- 左侧 -->
              <div class="completed-info-left">
                <p class="order-info-left">
                  <span class="pay-info">付款信息</span>
                </p>
                <p class="order-info-left">
                  <span>姓名：</span>
                  <span>张三封</span>
                </p>
                <p class="order-info-left">
                  <span>付款方式：</span>
                  <span>银行卡</span>
                </p>
                <p class="order-info-left">
                  <span>银行卡账号：</span>
                  <span>95847856845842522</span>
                </p>
              </div>
              <!-- 中间 -->
              <div class="completed-info-middle">
                <p class="order-info-middle">
                  <span class="buyer-seller-info">卖家信息</span>
                </p>
                <p class="order-info-middle">
                  <span>姓名：</span>
                  <span>张三封</span>
                </p>
                <p class="order-info-middle">
                  <span>卖家手机号：</span>
                  <span>15738818082</span>
                </p>
              </div>
              <!-- 右侧 -->
              <div class="completed-info-right">
                <p class="order-info-right">
                  <span class="confirm-time">确认时间</span>
                </p>
                <p class="order-info-right">
                  <span>付款确认时间：</span>
                  <span>2018-12-12 12:20:20</span>
                </p>
                <p class="order-info-right">
                  <span>收款确认时间：</span>
                  <span>2018-12-12 12:30:20</span>
                </p>
              </div>
            </div>
          </template>
        </el-table-column>
      </div>
        <el-table-column
          label="订单号"
        >
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column
          label="类型"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.orderStatus === 1"
              :class="{ red: scope.row.orderStatus === 1 }"
            >
              买入
            </span>
            <span
              v-if="scope.row.orderStatus === 2"
              :class="{ green: scope.row.orderStatus === 2 }"
            >
              卖出
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="币种"
        >
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column
          label="价格"
        >
          <template slot-scope="scope">
            {{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column
          label="数量"
        >
          <template slot-scope="scope">
            {{ scope.row.num }}
          </template>
        </el-table-column>
        <el-table-column
          label="总金额"
        >
          <template slot-scope="scope">
            {{ scope.row.total }}
          </template>
        </el-table-column>
         <el-table-column
          label="下单时间"
        >
          <template slot-scope="scope">
            {{ scope.row.time }}
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
      tableData5: [{
        orderStatus: 1, //  买单
        id: '12987122',
        style: '买入',
        name: 'FBT',
        price: '88888(CNY)',
        num: '0.1258(BTC)',
        total: '10333(CNY)',
        time: '2018-12-20 12:20:25'
      }, {
        orderStatus: 2, //  卖单
        id: '12987123',
        style: '卖出',
        name: 'ETH',
        price: '88888(CNY)',
        num: '0.1258(BTC)',
        total: '10333(CNY)',
        time: '2018-12-20 12:20:25'
      }]
    }
  },
  created () {
    require('../../../static/css/list/OTC/OTCCompletedOrder.css')
    require('../../../static/css/theme/day/OTC/OTCCompletedOrderDay.css')
    require('../../../static/css/theme/night/OTC/OTCCompletedOrderNight.css')
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
<style scoped lang="scss" type="text/scss">
@import url(../../../static/css/scss/OTC/OTCCompletedOrder.scss);
.otc-completed-order-box{
  >.completed-order-content{
    .red{
      color: #D45858;
    }
    .green{
      color: #008069;
    }
    .completed-info{
      display: flex;
      flex: 7;
      color: #9DA5B3;
      &::after{
        /*content: '';*/
        /*width: 5px;*/
        /*height: 5px;*/
        /*position: absolute;*/
        /*right: 0;*/
        /*top: 0px;*/
        /*bottom: 0px;*/
        /*background-color: red;*/
      }
      >.completed-info-left{
        flex: 2;
        border-right: 1px solid #262F38;
        >.order-info-left{
          line-height: 1.5rem;
          >.pay-info{
            color: #5E95EC;
          }
        }
      }
      >.completed-info-middle{
        flex: 2;
        border-right: 1px solid #262F38;
        >.order-info-middle{
          margin-left: 50px;
          line-height: 1.5rem;
          >.buyer-seller-info{
            color: #5E95EC;
          }
        }
      }
      >.completed-info-right{
        flex: 3;
        >.order-info-right{
          margin-left: 50px;
          line-height: 1.5rem;
          >.confirm-time{
            color: #5E95EC;
          }
        }
      }
    }
  }
}
</style>
