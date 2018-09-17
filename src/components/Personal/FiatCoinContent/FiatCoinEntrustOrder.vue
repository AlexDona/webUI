<template>
  <div
    class="fiat-entrust-order-box personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <!-- 委托订单表格 -->
    <div
      class="fiat-entrust-order-table"
    >
      <!-- 表头 -->
      <!--<div class="entrust-table-head display-flex">-->
        <!--<span class="item first-style flex1">类型</span>-->
        <!--<span class="item second-coin flex1">币种</span>-->
        <!--<span class="item third-price flex1">价格</span>-->
        <!--<span class="item fourth-entrust-count flex1">挂单数量</span>-->
        <!--<span class="item fifth-match-count flex1">已匹配数量</span>-->
        <!--<span class="item sixth-total-amount flex1">总金额</span>-->
        <!--<span class="item senventh-create-time">挂单时间</span>-->
        <!--<span class="item eighth-action flex1">操作</span>-->
      <!--</div>-->
      <!-- 表身体 -->
      <div
        class="entrust-table-body"
      >
        <div class="no-data" v-if="!OTCEntrustOrderList.length">
          暂无数据
        </div>
        <div
          class="entrust-list-content display-flex"
          v-for="(item,index) in OTCEntrustOrderList"
          :key="index"
          v-if="OTCEntrustOrderList.length"
        >
          <!-- 1 类型 -->
          <!-- 买入 -->
          <span
            class="item first-style flex1"
            v-if="item.entrustType === 'BUY'"
            :class="{ red: item.entrustType === 'BUY' }"
          >
            买入
          </span>
          <!-- 卖出 -->
          <span
            class="item first-style flex1"
            v-if="item.entrustType === 'SELL'"
            :class="{ green: item.entrustType === 'SELL' }"
          >
            卖出
          </span>
          <!-- 2 币种 -->
          <span class="item second-coin flex1">{{item.coinName}}</span>
          <!-- 3 价格 -->
          <span class="item third-price flex1">{{item.price}}({{item.currencyName}})</span>
          <!-- 4 挂单数量 -->
          <span class="item fourth-entrust-count flex1">{{item.entrustCount}}({{item.coinName}})</span>
          <!-- 5 已匹配数量 -->
          <span class="item fifth-match-count flex1">{{item.matchCount}}({{item.coinName}})</span>
          <!-- 6 总金额 -->
          <span class="item sixth-total-amount flex1">{{item.totalAmount}}({{item.currencyName}})</span>
          <!-- 7 挂单时间 -->
          <span class="item senventh-create-time1">{{item.createTime}}</span>
          <!-- 8 操作 -->
          <span class="item eighth-action flex1">
            <el-button
              type="text"
              @click="revocationOrder(item.id)"
            >
              撤单
            </el-button>
            <!-- <el-button
              type="text"
              @click="dialogVisible = true"
            >
              撤单
            </el-button>
            <el-dialog
              title="提示"
              :visible.sync="dialogVisible"
              width="30%"
              :before-close="handleClose">
              <span>这是一段信息</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="revocationOrder(item.id)">确 定</el-button>
              </span>
            </el-dialog> -->
          </span>
        </div>
        <!--分页-->
        <el-pagination
          background
          v-show="OTCEntrustOrderList.length"
          layout="prev, pager, next"
          :current-page="legalTradePageNum"
          :page-count="legalTradePageTotals"
          @current-change="changeCurrentPage"
        >
        </el-pagination>
      </div>
      <!-- 弹出框 -->
      <!-- <div class="dialog">
        <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="handleClose">
          <span>这是一段信息</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
      </div> -->
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {timeFilter} from '../../../utils'
import {
  querySelectedOrdersRevocation
} from '../../../utils/api/personal'
import {
  returnAjaxMessage,
  changeCurrentPageForLegalTrader
} from '../../../utils/commonFunc'
import {createNamespacedHelpers, mapState} from 'vuex'
const {mapMutations} = createNamespacedHelpers('personal')
export default {
  components: {},
  // props,
  data () {
    return {
      dialogVisible: false
      // OTC委托订单列表
      // OTCEntrustOrderList: []
    }
  },
  created () {
    require('../../../../static/css/list/Personal/FiatCoinContent/FiatCoinEntrustOrder.css')
    require('../../../../static/css/theme/day/Personal/FiatCoinContent/FiatCoinEntrustOrderDay.css')
    require('../../../../static/css/theme/night/Personal/FiatCoinContent/FiatCoinEntrustOrderNight.css')
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
    ...mapMutations([
      'CHANGE_LEGAL_PAGE',
      'SET_LEGAL_TENDER_REFLASH_STATUS'
    ]),
    // 分页
    changeCurrentPage (e) {
      changeCurrentPageForLegalTrader(e, 'ENTRUSTED', this)
    },
    // 1.0 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'date')
    },
    // 3.0 点击撤单按钮
    revocationOrder (id) {
      // this.getOTCEntrustingOrdersRevocation(id)
      this.$confirm('您确定要撤销此单吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.getOTCEntrustingOrdersRevocation(id)
      }).catch(() => {
      })
    },
    // 4.0 提交撤单
    async getOTCEntrustingOrdersRevocation (id) {
      let data = await querySelectedOrdersRevocation({
        entrustId: id
      })
      // 提示信息
      if (!(returnAjaxMessage(data, this, 1))) {
        return false
      } else {
        // 返回数据正确的逻辑
        this.SET_LEGAL_TENDER_REFLASH_STATUS({
          type: 'entrust-orders',
          status: true
        })
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      legalTraderEntrustList: state => state.personal.legalTraderEntrustList,
      legalTraderEntrustReflashStatus: state => state.personal.legalTraderEntrustReflashStatus,
      legalTradePageTotals: state => state.personal.legalTradePageTotals,
      legalTradePageNum: state => state.personal.legalTradePageNum
    }),
    OTCEntrustOrderList () {
      return this.legalTraderEntrustList
    }
  },
  watch: {
    OTCEntrustOrderList (newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../../../static/css/scss/Personal/FiatCoinContent/FiatCoinEntrustOrder.scss";
  .fiat-entrust-order-box {
    .fiat-entrust-order-table {
      > .entrust-table-head {
        box-sizing: border-box;
        height: 35px;
        line-height: 35px;
        border-radius: 5px;
        margin-bottom: 5px;
        z-index: 200;
        > .item {
          display: inline-block;
          text-align: center;
        }
        > .senventh-create-time {
          width: 150px;
        }
        > .senventh-create-time1 {
          width: 120px;
        }
      }
      > .entrust-table-body {
        min-height: 432px;
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
          > .item {
            display: inline-block;
            text-align: center;
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
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      >.background-color{
        background-color: #1E2636;
        >.fiat-color{
          color: #338FF5;
        }
      }
      > .entrust-table-head {
        background-color: #1E2636;
        color: #617499;
        border: 1px solid #262F38;
        box-shadow: -2px 3px 5px 1px #191E28; text-align: left;
        }
        > .senventh-create-time {
          width: 150px;
        }
        > .senventh-create-time1 {
          width: 120px;
        }
      > .entrust-table-body {
        background-color: #1E2636;
        color: #9DA5B3;
        border: 1px solid #262F38;
        > .entrust-list-content {
          .red {
            color: #D45858;
          }
          .green {
            color: #008069;
          }
        }
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      >.background-color{
        background-color: #CCCCCC;
      }
      > .entrust-table-head {
        box-sizing: border-box;
        /*width: 1045px;*/
        height: 35px;
        line-height: 35px;
        background-color: #1E2636;
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
          /*width: 126px;*/
          text-align: center;
          // text-align: left;
        }
        /*> .first-style {*/
        /*width: 70px;*/
        /*}*/
        /*> .second-coin {*/
        /*width: 150px;*/
        /*}*/
        /*> .third-price {*/
        /*width: 150px;*/
        /*}*/
        /*> .fourth-entrust-count {*/
        /*width: 150px;*/
        /*}*/
        /*> .fifth-match-count {*/
        /*width: 150px;*/
        /*}*/
        /*> .sixth-total-amount {*/
        /*width: 150px;*/
        /*}*/
        > .senventh-create-time {
          width: 150px;
        }
        > .senventh-create-time1 {
          width: 120px;
        }
        /*> .eighth-action {*/
        /*width: 70px;*/
        /*}*/
      }
      > .entrust-table-body {
        min-height: 432px;
        background-color: #1E2636;
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
            /*width: 126px;*/
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
