<template>
  <div class="otc-entrust-order-box otc">
    <!-- 委托订单表格 -->
    <div
      class="otc-entrust-order-table"
    >
      <!-- 表头 -->
      <div class="entrust-table-head">
        <span class="item first-style">类型</span>
        <span class="item second-coin">币种</span>
        <span class="item third-price">价格</span>
        <span class="item fourth-entrust-count">挂单数量</span>
        <span class="item fifth-match-count">已匹配数量</span>
        <span class="item sixth-total-amount">总金额</span>
        <span class="item senventh-create-time">挂单时间</span>
        <span class="item eighth-action">操作</span>
      </div>
      <!-- 表身体 -->
      <div
        class="entrust-table-body"
      >
        <div class="no-data" v-if="!OTCEntrustOrderList.length">
          暂无数据
        </div>
        <div
          class="entrust-list-content"
          v-for="(item,index) in OTCEntrustOrderList"
          :key="index"
          v-if="OTCEntrustOrderList.length"
        >
          <!-- 1 类型 -->
          <!-- 买入 -->
          <span
            class="item first-style"
            v-if="item.entrustType === 'BUY'"
            :class="{ red: item.entrustType === 'BUY' }"
          >
            买入
          </span>
          <!-- 卖出 -->
          <span
            class="item first-style"
            v-if="item.entrustType === 'SELL'"
            :class="{ green: item.entrustType === 'SELL' }"
          >
            卖出
          </span>
          <!-- 2 币种 -->
          <span class="item second-coin">{{item.coinName}}</span>
          <!-- 3 价格 -->
          <span class="item third-price">{{item.price}}({{item.currencyName}})</span>
          <!-- 4 挂单数量 -->
          <span class="item fourth-entrust-count">{{item.entrustCount}}({{item.coinName}})</span>
          <!-- 5 已匹配数量 -->
          <span class="item fifth-match-count">{{item.matchCount}}({{item.coinName}})</span>
          <!-- 6 总金额 -->
          <span class="item sixth-total-amount">{{item.totalAmount}}({{item.currencyName}})</span>
          <!-- 7 挂单时间 -->
          <span class="item senventh-create-time">{{item.createTime}}</span>
          <!-- 8 操作 -->
          <span class="item eighth-action">
            <el-button
              type="text"
              @click="revocationOrder(item.id)"
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
import {getOTCEntrustingOrders,
  querySelectedOrdersRevocation
} from '../../utils/api/OTC'
import {returnAjaxMessage} from '../../utils/commonFunc'
export default {
  components: {},
  // props,
  data () {
    return {
      // OTC委托订单列表
      OTCEntrustOrderList: []
    }
  },
  created () {
    require('../../../static/css/list/OTC/OTCEntrustOrder.css')
    require('../../../static/css/theme/day/OTC/OTCEntrustOrderDay.css')
    require('../../../static/css/theme/night/OTC/OTCEntrustOrderNight.css')
    // 1.0 刚进页面调取接口获取委托中的订单列表
    this.getOTCEntrustingOrdersList()
  },
  mounted () {
  },
  activited () {
  },
  update () {
  },
  beforeRouteUpdate () {
  },
  methods: {
    // 1.0 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'date')
    },
    // 2.0 请求委托中订单列表
    async getOTCEntrustingOrdersList () {
      let data
      data = await getOTCEntrustingOrders({
        status: 'ENTRUSTED' // 状态（ENTRUSTED 挂单中 HISTORY 历史挂单）
      })
      // console.log(data)
      // 提示信息
      returnAjaxMessage(data, this, 0)
      // if (data.data.meta.code !== 200) {
      //   this.$message({
      //     message: data.data.meta.message,
      //     type: 'error',
      //     center: true
      //   })
      //   return false
      // }
      // 返回数据正确的逻辑
      this.OTCEntrustOrderList = data.data.data.list
    },
    async getOTCEntrustingOrdersRevocation (id) {
      let data = await querySelectedOrdersRevocation({
        entrustId: id
      })
      // 提示信息
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑
        this.getOTCEntrustingOrdersList()
      }
    },
    // 3.0 撤单按钮
    revocationOrder (id) {
      this.$confirm('您确定要撤销此单吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.getOTCEntrustingOrdersRevocation(id)
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

  .otc-entrust-order-box {
    .otc-entrust-order-table {
      > .entrust-table-head {
        box-sizing: border-box;
        width: 1045px;
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
        > .item {
          display: inline-block;
          width: 126px;
          text-align: center;
          // text-align: left;
        }
        > .first-style {
          width: 70px;
        }
        > .second-coin {
          width: 150px;
        }
        > .third-price {
          width: 150px;
        }
        > .fourth-entrust-count {
          width: 150px;
        }
        > .fifth-match-count {
          width: 150px;
        }
        > .sixth-total-amount {
          width: 150px;
        }
        > .senventh-create-time {
          width: 120px;
        }
        > .eighth-action {
          width: 70px;
        }
      }
      > .entrust-table-body {
        height: 432px;
        background-color: #202A33;
        color: #9DA5B3;
        border: 1px solid #262F38;
        border-top: none;
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;
        > .no-data {
          line-height: 432px;
          text-align: center;
        }
        > .entrust-list-content {
          display: flex;
          height: 34px;
          line-height: 34px;
          .red {
            color: #D45858;
          }
          .green {
            color: #008069;
          }
          > .item {
            display: inline-block;
            width: 126px;
            text-align: center;
            // text-align: left;
          }
          > .first-style {
            width: 80px;
          }
          > .second-coin {
            width: 150px;
          }
          > .third-price {
            width: 150px;
          }
          > .fourth-entrust-count {
            width: 150px;
          }
          > .fifth-match-count {
            width: 150px;
          }
          > .sixth-total-amount {
            width: 150px;
          }
          > .senventh-create-time {
            width: 150px;
          }
          > .eighth-action {
            width: 80px;
          }
        }
      }
    }
  }
</style>
