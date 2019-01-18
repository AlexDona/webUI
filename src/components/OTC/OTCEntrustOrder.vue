<template>
  <div
    class="otc-entrust-order-box otc"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <!-- 委托订单表格 -->
    <div
      class="otc-entrust-order-table"
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0.6)"
    >
      <!-- 表头 -->
      <div class="entrust-table-head">
        <!-- 类型 -->
        <span class="item first-style">
          {{$t('M.comm_type')}}
        </span>
        <!-- 币种 -->
        <span class="item second-coin">
          {{$t('M.comm_currency')}}
        </span>
        <!-- 价格 -->
        <span class="item third-price">
          {{$t('M.otc_index_price')}}
        </span>
        <!-- 挂单数量 -->
        <span class="item fourth-entrust-count">
          {{$t('M.otc_entrust_number')}}
        </span>
        <!-- 已成交数量 -->
        <span class="item fifth-match-count">
          {{$t('M.otc_entrust_matching')}}
        </span>
        <!-- 总金额 -->
        <span class="item sixth-total-amount">
          {{$t('M.otc_canceled_total')}}
        </span>
        <!-- 挂单时间 -->
        <span class="item senventh-create-time">
          {{$t('M.otc_entrust_time')}}
        </span>
        <!-- 操作 -->
        <span class="item eighth-action">
          {{$t('M.otc_index_operate')}}
        </span>
      </div>
      <!-- 表身体 -->
      <div
        class="entrust-table-body"
      >
        <div
          class="no-data"
          v-show="!OTCEntrustOrderList.length"
        >
          <!-- 暂无数据 -->
          {{$t('M.comm_no_data')}}
        </div>
        <div
          class="entrust-list-content"
          v-for="(item,index) in OTCEntrustOrderList"
          :key="index"
          v-show="OTCEntrustOrderList.length"
        >
          <!-- 1 类型 -->
          <!-- 买入 -->
          <span
            class="item first-style"
            v-if="item.entrustType === 'BUY'"
            :class="{ red: item.entrustType === 'BUY' }"
          >
            <!-- 买入 -->
            {{$t('M.comm_buy')}}
          </span>
          <!-- 卖出 -->
          <span
            class="item first-style"
            v-if="item.entrustType === 'SELL'"
            :class="{ green: item.entrustType === 'SELL' }"
          >
            <!-- 卖出 -->
            {{$t('M.comm_sell')}}
          </span>
          <!-- 2 币种 -->
          <span class="item second-coin">
            {{item.coinName}}
          </span>
          <!-- 3 价格 -->
          <span class="item third-price">
            {{filterNumber(item.price)}}({{item.currencyName}})
          </span>
          <!-- 4 挂单数量 -->
          <span class="item fourth-entrust-count">
            {{filterNumber(item.entrustCount)}}({{item.coinName}})
          </span>
          <!-- 5 已成交数量 -->
          <span class="item fifth-match-count">
            {{filterNumber(item.matchCount)}}({{item.coinName}})
          </span>
          <!-- 6 总金额 -->
          <span class="item sixth-total-amount">
            {{filterNumber(item.totalAmount)}}({{item.currencyName}})
          </span>
          <!-- 7 挂单时间 -->
          <span class="item senventh-create-time">
            {{item.createTime}}
          </span>
          <!-- 8 操作 -->
          <span class="item eighth-action">
            <el-button
              type="text"
              @click="revocationOrder(item.id)"
            >
              <!-- 撤单 -->
            {{$t('M.otc_entrust_cancellations')}}
            </el-button>
          </span>
        </div>
      </div>
    </div>
    <!--分页-->
    <div class="page">
      <el-pagination
        background
        v-show="OTCEntrustOrderList.length"
        layout="prev, pager, next"
        :page-count="totalPages"
        @current-change="changeCurrentPage"
      >
      </el-pagination>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {timeFilter, scientificToNumber} from '../../utils'
import {getOTCEntrustingOrders, querySelectedOrdersRevocation} from '../../utils/api/OTC'
import {
  // returnAjaxMsg,
  getNestedData
} from '../../utils/commonFunc'
import {
  mapMutations,
  mapState
} from 'vuex'
export default {
  components: {},
  // props,
  data () {
    return {
      // loading加载
      loading: true,
      // 分页
      // 每页展示的条数
      pageSize: 10,
      // 当前页码
      currentPage: 1,
      // 总页数
      totalPages: 1,
      // OTC委托订单列表
      OTCEntrustOrderList: []
    }
  },
  created () {
    // 1.0 刚进页面调取接口获取委托中的订单列表:只有登录了才调用
    if (this.isLogin) {
      this.getOTCEntrustingOrdersList()
    }
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'UPDATE_OTC_HOME_LIST_STATUS'
    ]),
    // 科学计数法转换
    filterNumber (num) {
      return scientificToNumber(num)
    },
    // 1.0 分页
    changeCurrentPage (pageNum) {
      this.currentPage = pageNum
      this.getOTCEntrustingOrdersList()
    },
    // 2.0 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'date')
    },
    // 3.0 请求委托中订单列表
    async getOTCEntrustingOrdersList () {
      this.loading = true
      const data = await getOTCEntrustingOrders({
        status: 'ENTRUSTED', // 状态（ENTRUSTED 挂单中 HISTORY 历史挂单）
        pageNum: this.currentPage,
        pageSize: this.pageSize
      })
      console.log('委托中订单列表')
      console.log(data)
      // 返回数据正确的逻辑
      this.loading = false
      if (!data) return false
      if (data) {
        let OTCEntrustOrderListData = getNestedData(data, 'data')
        this.OTCEntrustOrderList = getNestedData(OTCEntrustOrderListData, 'list')
        // 分页
        this.totalPages = getNestedData(OTCEntrustOrderListData, 'pages') - 0
      }
    },
    // 4.0 点击撤单按钮
    revocationOrder (id) {
      // 二次确认弹出框
      // 确定撤销委托单  // 取消   // 确定
      this.$confirm(this.$t('M.otc_revoke'), {
        cancelButtonText: this.$t('M.comm_cancel'),
        confirmButtonText: this.$t('M.comm_confirm')
      }).then(() => {
        this.getOTCEntrustingOrdersRevocation(id)
      }).catch(() => {})
    },
    // 5.0 提交撤单
    async getOTCEntrustingOrdersRevocation (id) {
      let data = await querySelectedOrdersRevocation({
        entrustId: id
      })
      // 返回数据正确的逻辑
      if (!data) return false
      if (data) {
        this.getOTCEntrustingOrdersList()
        // 改变全局 委托定单撤单后，更新首页挂单列表状态
        this.UPDATE_OTC_HOME_LIST_STATUS(true)
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      isLogin: state => state.user.isLogin // 是否登录
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../../static/css/scss/index.scss";

  .otc-entrust-order-box {
    .otc-entrust-order-table {
      > .entrust-table-head {
        z-index: 200;
        box-sizing: border-box;
        width: 1045px;
        height: 35px;
        margin-bottom: 15px;
        border-radius: 5px;
        line-height: 35px;

        > .item {
          display: inline-block;
          width: 126px;
          text-align: center;
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
          width: 130px;
        }

        > .sixth-total-amount {
          width: 150px;
        }

        > .senventh-create-time {
          width: 120px;
        }

        > .eighth-action {
          width: 90px;
        }
      }

      > .entrust-table-body {
        height: 432px;
        border-top: none;
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;

        > .no-data {
          height: 432px;
          line-height: 432px;
          text-align: center;
        }

        > .entrust-list-content {
          display: flex;
          height: 40px;
          line-height: 40px;

          > .item {
            display: inline-block;
            width: 126px;
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

    .page {
      text-align: center;
    }

    &.night {
      .otc-entrust-order-table {
        > .entrust-table-head {
          border: 1px solid #485776;
          color: #a9bed4;
          background-color: $mainContentNightBgColor;
          box-shadow: -2px 3px 5px 1px #191e28;
        }

        > .entrust-table-body {
          border: 1px solid #262f38;
          color: #9da5b3;
          background-color: $mainContentNightBgColor;

          > .no-data {
            color: rgba(255, 255, 255, .8);
          }

          > .entrust-list-content {
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

    &.day {
      .otc-entrust-order-table {
        > .entrust-table-head {
          border: 1px solid #ecf1f8;
          color: #8a909e;
          background-color: #fff;
        }

        > .entrust-table-body {
          border: 1px solid #ecf1f8;
          color: #666;
          background-color: #fff;

          > .no-data {
            color: #333;
          }

          > .entrust-list-content {
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
