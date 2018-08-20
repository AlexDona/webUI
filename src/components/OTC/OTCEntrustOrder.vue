<template>
  <div class="otc-entrust-order-box otc">
    <!-- 委托订单表格 -->
    <div
      class="otc-entrust-order-table"
    >
      <!-- 表头 -->
     <div class="entrust-table-head">
        <span class="item">类型</span>
        <span class="item">币种</span>
        <span class="item">价格</span>
        <span class="item">挂单数量</span>
        <span class="item">已匹配数量</span>
        <span class="item">总金额</span>
        <span class="item">挂单时间</span>
        <span class="item">操作</span>
     </div>
      <!-- 表身体 -->
      <div
        class="entrust-table-body"
      >
        <div
          class="entrust-list-content"
          v-for="(item,index) in getOTCEntrustOrderList"
          :key="index"
        >
          <!-- 买入 -->
          <span
            class="item"
            v-if="item.style === '买入'"
            :class="{ red: item.style === '买入' }"
          >
            {{item.style}}
          </span>
          <!-- 卖出 -->
          <span
            class="item"
            v-if="item.style === '卖出'"
            :class="{ green: item.style === '卖出' }"
          >
            {{item.style}}
          </span>
          <span class="item">{{item.coinName}}</span>
          <span class="item">{{item.price}}</span>
          <span class="item">{{item.hangOrderSum}}</span>
          <span class="item">{{item.matchedSum}}</span>
          <span class="item">{{item.totalMoney}}</span>
          <span class="item">{{timeFormatting(item.createTime)}}</span>
          <span class="item">
            <el-button
              type="text"
              @click="revocationOrder"
            >
              撤单
            </el-button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {timeFilter} from '../../utils'
export default {
  components: {},
  // props,
  data () {
    return {
      // OTC委托订单列表
      getOTCEntrustOrderList: [
        {
          style: '买入',
          coinName: 'BTC',
          price: '567812.12',
          hangOrderSum: '0.0012345',
          matchedSum: '0.0012345',
          totalMoney: '20180812123456',
          createTime: 1523410832000
        },
        {
          style: '卖出',
          coinName: 'FBT',
          price: '567812.12',
          hangOrderSum: '0.0012345',
          matchedSum: '0.0012345',
          totalMoney: '20180812123456',
          createTime: 1523410832000
        },
        {
          style: '买入',
          coinName: 'ETH',
          price: '567812.12',
          hangOrderSum: '0.0012345',
          matchedSum: '0.0012345',
          totalMoney: '20180812123456',
          createTime: 16723410832222
        }
      ]
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
  methods: {
    // 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'date')
    },
    // 撤单按钮
    revocationOrder () {
      this.$confirm('您确定要撤销此单吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '撤单成功!'
        })
      })
    }
  },
  filter: {},
  computed: {},
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
@import url(../../../static/css/scss/OTC/OTCEntrustOrder.scss);
.otc-entrust-order-box{
  .otc-entrust-order-table{
    >.entrust-table-head{
      box-sizing: border-box;
      width: 1043px;
      height: 35px;
      line-height: 35px;
      background-color: #202A33;
      color: #617499;
      border: 1px solid #262F38;
      border-radius: 5px;
      margin-bottom: 5px;
      /*box-shadow:底边阴影;*/
      // box-shadow: 2px 4px 6px #191E28;
      box-shadow: -2px 3px 5px 1px #191E28;
      z-index: 200;
      >.item{
        display: inline-block;
        width: 126px;
        text-align: center;
      }
    }
    >.entrust-table-body{
      height: 432px;
      background-color: #202A33;
      color: #9DA5B3;
      border: 1px solid #262F38;
      border-top: none;
      border-bottom-right-radius: 5px;
      border-bottom-left-radius: 5px;
      >.entrust-list-content{
        height: 34px;
        line-height: 34px;
        .red{
          color: #D45858;
        }
        .green{
          color: #008069;
        }
        >.item{
          display: inline-block;
          width: 126px;
          text-align: center;
        }
      }
    }
  }
}
</style>
