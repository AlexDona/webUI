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
      <div class="entrust-table-head display-flex">
        <span class="item first-style flex1">
          <!--类型-->
          {{$t('M.comm_type')}}
        </span>
        <span class="item second-coin flex1">
          <!--币种-->
          {{$t('M.otc_AD_token')}}
        </span>
        <span class="item third-price flex1">
          <!--价格-->
          {{$t('M.otc_index_price')}}
        </span>
        <span class="item fourth-entrust-count flex1">
          <!--挂单数量-->
          {{$t('M.otc_entrust_number')}}
        </span>
        <span class="item fifth-match-count flex1">
          <!--已匹配数量-->
          {{$t('M.otc_entrust_matching')}}
        </span>
        <span class="item sixth-total-amount flex1">
          <!--总金额-->
          {{$t('M.otc_canceled_total')}}
        </span>
        <span class="item senventh-create-time">
          <!--挂单时间-->
          {{$t('M.otc_entrust_time')}}
        </span>
        <span class="item eighth-action flex1">
          <!--操作-->
          {{$t('M.otc_index_operate')}}
        </span>
      </div>
      <!-- 表身体 -->
      <div
        class="entrust-table-body"
      >
        <div class="no-data" v-if="!OTCEntrustOrderList.length">
          <!--暂无数据-->
          {{$t('M.comm_no_data')}}
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
            <!--买入-->
            {{$t('M.comm_buy')}}
          </span>
          <!-- 卖出 -->
          <span
            class="item first-style flex1"
            v-if="item.entrustType === 'SELL'"
            :class="{ green: item.entrustType === 'SELL' }"
          >
            <!--卖出-->
            {{$t('M.comm_sell')}}
          </span>
          <!-- 2 币种 -->
          <span class="item second-coin flex1">
            {{item.coinName}}
          </span>
          <!-- 3 价格 -->
          <span class="item third-price flex1">
            {{item.price}}({{item.currencyName}})
          </span>
          <!-- 4 挂单数量 -->
          <span class="item fourth-entrust-count flex1">
            {{item.entrustCount}}({{item.coinName}})
          </span>
          <!-- 5 已匹配数量 -->
          <span class="item fifth-match-count flex1">
            {{item.matchCount}}({{item.coinName}})
          </span>
          <!-- 6 总金额 -->
          <span class="item sixth-total-amount flex1">
            {{item.totalAmount}}({{item.currencyName}})
          </span>
          <!-- 7 挂单时间 -->
          <span class="item senventh-create-time1">
            {{item.createTime}}
          </span>
          <!-- 8 操作 -->
          <span class="item eighth-action flex1">
            <el-button
              type="text"
              @click="revocationOrder(item.id)"
            >
              <!--撤单-->
              {{$t('M.otc_entrust_cancellations')}}
            </el-button>
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
  returnAjaxMsg,
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
      // 确定撤销委单？  取消  确定
      this.$confirm(this.$t('M.otc_revoke'), {
        // 确定
        confirmButtonText: this.$t('M.comm_confirm'),
        // 取消
        cancelButtonText: this.$t('M.comm_cancel')
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
      if (!(returnAjaxMsg(data, this, 1))) {
        return false
      } else {
        // 返回数据正确的逻辑
        this.SET_LEGAL_TENDER_REFLASH_STATUS({
          type: 'ENTRUSTED',
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
  @import "../../../../static/css/scss/Personal/IndexPersonal.scss";

  .fiat-entrust-order-box {
    .fiat-entrust-order-table {
      > .entrust-table-head {
        z-index: 200;
        box-sizing: border-box;
        height: 35px;
        margin-bottom: 5px;
        border-radius: 5px;
        line-height: 35px;

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

      > .entrust-table-body,
      .item {
        border-top: none;
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;

        > .no-data {
          line-height: 345px;
          text-align: center;
        }

        > .entrust-list-content {
          display: flex;
          height: 34px;
          line-height: 34px;

          > .item {
            text-align: center;
          }
        }
      }
    }

    /deep/ {
      .el-button {
        min-width: 60px !important;
        height: 26px !important;
        margin: 0;
        font-size: 14px;
        line-height: 0;
      }

      .fiat-entrust-order-table {
        .entrust-table-head {
          border-radius: 0;
          -webkit-box-shadow: none;
          box-shadow: none;
        }
      }
    }

    &.night {
      color: $nightFontColor;
      background-color: $nightBgColor;

      > .background-color {
        background-color: $nightMainBgColor;

        > .fiat-color {
          color: #338ff5;
        }
      }

      > .fiat-entrust-order-table {
        > .entrust-table-head {
          border: 1px solid #262f38;
          text-align: left;
          color: #617499;
          background-color: $nightMainBgColor;
          box-shadow: -2px 3px 5px 1px #191e28;
        }

        > .entrust-table-body {
          color: #9da5b3;
          background-color: $nightMainBgColor;

          > .entrust-list-content {
            .red {
              color: #d45858;
            }

            .green {
              color: #008069;
            }
          }

          .no-data {
            background-color: $nightMainBgColor;
          }
        }
      }
    }

    &.day {
      color: $dayFontColor;
      background-color: $dayBgColor;

      > .background-color {
        background-color: $dayBgColor;
      }

      > .fiat-entrust-order-table {
        > .entrust-table-head {
          border-bottom: 1px solid rgba(72, 87, 118, .1);
          color: #617499;
          background-color: $dayBgColor;
        }

        > .entrust-table-body {
          min-height: 432px;
          border: 1px solid rgba(72, 87, 118, .1);
          color: #9da5b3;
          background-color: #fff;

          > .entrust-list-content {
            > .item {
              background-color: #fff;
            }

            .red {
              color: #d45858;
            }

            .green {
              color: #008069;
            }
          }
        }
      }
    }
  }
</style>
