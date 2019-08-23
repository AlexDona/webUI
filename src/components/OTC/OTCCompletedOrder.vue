<template>
  <div
    class="otc-completed-order-box otc"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="completed-order-content">
      <!-- 表格 -->
      <div class="tables">
        <el-table
          :data="completedOrdersList"
          :default-expand-all="true"
          :empty-text="$t('M.comm_no_data')"
        >
          <div>
            <el-table-column type="expand">
              <template slot-scope="s">
                <div class="completed-info">
                  <!-- 左侧 -->
                  <div class="completed-info-left">
                    <!-- 付款信息 -->
                    <p class="order-info-left">
                      <span class="pay-info">
                        {{$t('M.otc_index_js2')}}
                      </span>
                    </p>
                    <!-- 姓名 -->
                    <p class="order-info-left">
                      <!-- 姓名 ：展示的是卖家的名字-->
                      <span>{{$t('M.otc_name')}}：</span>
                      <span>{{s.row.sellName}}</span>
                    </p>
                    <!-- 付款方式 -->
                    <p class="order-info-left">
                      <span>{{$t('M.otc_alipay_type')}}：</span>
                      <!-- 判断付款方式 -->
                      <span v-show="s.row.payType === 'Alipay'">
                        {{$t('M.comm_alipay')}}
                      </span>
                      <span v-show="s.row.payType === 'Bankcard'">
                        {{$t('M.comm_bank')}}
                      </span>
                      <span v-show="s.row.payType === 'WestUnion'">
                        {{$t('M.comm_xilian')}}
                      </span>
                      <span v-show="s.row.payType === 'PAYPAL'">
                        PAYPAL
                      </span>
                      <span v-show="s.row.payType === 'Wechat'">
                        {{$t('M.comm_weixin')}}
                      </span>
                    </p>
                    <!-- 付款账号 -->
                    <p class="order-info-left">
                      <!-- 支付宝账号 -->
                      <span v-show="s.row.payType === 'Alipay'">
                        {{$t('M.user_account_alipay')}}{{$t('M.user_account_number')}}：
                      </span>
                      <!-- 银行卡账号 -->
                      <span v-show="s.row.payType === 'Bankcard'">
                        {{$t('M.otc_bank_num')}}：
                      </span>
                      <!-- 西联汇款账号 -->
                      <span v-show="s.row.payType === 'WestUnion'">
                        {{$t('M.user_account_western_union')}}{{$t('M.user_account_number')}}：
                      </span>
                      <!-- PAYPAL账号 -->
                      <span v-show="s.row.payType === 'PAYPAL'">
                        PAYPAL{{$t('M.user_account_number')}}：
                      </span>
                      <!-- 微信账号 -->
                      <span v-show="s.row.payType === 'Wechat'">
                        {{$t('M.user_account_weChat')}}{{$t('M.user_account_number')}}：
                      </span>
                      <span>{{s.row.payAcctount}}</span>
                    </p>
                  </div>
                  <!-- 中间 -->
                  <div class="completed-info-middle">
                    <p class="order-info-middle">
                      <!-- 买单显示：卖家信息 -->
                      <span
                        class="buyer-seller-info"
                        v-show="s.row.orderType === 'BUY'"
                      >
                        {{$t('M.otc_stocks_seller')}}
                      </span>
                      <!-- 卖单显示：买家信息 -->
                      <span
                        class="buyer-seller-info"
                        v-show="s.row.orderType === 'SELL'"
                      >
                        {{$t('M.otc_stocks_buyinfo')}}
                      </span>
                    </p>
                    <p class="order-info-middle">
                      <!-- 姓名 -->
                      <span>{{$t('M.otc_name')}}：</span>
                      <!-- 买单显示：卖家姓名 -->
                      <span v-show="s.row.orderType === 'BUY'">
                        {{s.row.sellName}}
                      </span>
                      <!-- 卖单显示：买家姓名 -->
                      <span v-show="s.row.orderType === 'SELL'">
                        {{s.row.buyName}}
                      </span>
                    </p>
                    <p class="order-info-middle">
                      <!-- 买单显示：卖家手机号 -->
                      <span v-show="s.row.orderType === 'BUY'">
                        {{$t('M.otc_trading_sellphone')}}：{{s.row.sellPhone}}
                      </span>
                      <!-- 卖单显示：买家手机号  -->
                      <span v-show="s.row.orderType === 'SELL'">
                        {{$t('M.otc_trading_buyphone')}}：{{s.row.buyPhone}}
                      </span>
                    </p>
                  </div>
                  <!-- 右侧 -->
                  <div class="completed-info-right">
                    <p
                      class="order-info-right"
                      v-show="s.row.appeal == 'NO' && s.row.confirmTime !== ''"
                    >
                      <!-- 交易已完成 -->
                      <span class="confirm-time">{{$t('M.otc_trade_complate')}}</span>
                    </p>
                    <p
                      class="order-info-right"
                      v-show="s.row.appeal == 'YES'"
                    >
                    <!-- 申诉判定，订单完成 -->
                      <span class="confirm-time">{{$t('M.otc_decide_complate')}}</span>
                    </p>
                    <p
                      class="order-info-right"
                      v-show="s.row.appeal == 'NO' && s.row.confirmTime == ''"
                    >
                    <!-- 申诉判定，订单完成 -->
                      <span class="confirm-time">
                        {{$t('M.otc_decide_complate')}}
                      </span>
                    </p>
                    <p class="order-info-right">
                      <!-- 付款确认时间： -->
                      <span>{{$t('M.otc_time_payment')}}：</span>
                      <span>{{s.row.payTime}}</span>
                    </p>
                    <p class="order-info-right">
                      <!-- 收款确认时间： -->
                      <span>{{$t('M.otc_time_collection')}}：</span>
                      <span>{{s.row.confirmTime ? s.row.confirmTime : s.row.completeTime}}</span>
                    </p>
                    <!--原因-->
                    <p
                      class="order-info-right"
                      v-show="s.row.appeal == 'YES'"
                    >
                      <span
                        class="reason-content cursor-pointer"
                        :title="s.row.handleSuggest"
                      >
                        {{$t('M.otc_order_reason')}}：{{s.row.handleSuggest}}
                      </span>
                    </p>
                  </div>
                </div>
              </template>
            </el-table-column>
          </div>
          <!-- 广告id -->
          <el-table-column
            :label="$t('M.otc_AD_ID')"
            width="100"
          >
            <template slot-scope="s">
              {{ s.row.entrustSequence }}
            </template>
          </el-table-column>
          <!-- 订单号 -->
          <el-table-column
            :label="$t('M.otc_MerchantsOrders_orderNum')"
          >
            <template slot-scope="s">
              {{s.row.orderSequence}}
            </template>
          </el-table-column>
          <!-- 类型 -->
          <el-table-column
            :label="$t('M.otc_cancelOrder_type')"
          >
            <template slot-scope="s">
              <span
                v-show="s.row.orderType === 'BUY'"
                :class="{ red: s.row.orderType === 'BUY' }"
              >
                <!-- 买入 -->
                {{$t('M.comm_buy')}}
              </span>
              <span
                v-show="s.row.orderType === 'SELL'"
                :class="{ green: s.row.orderType === 'SELL' }"
              >
                <!-- 卖出 -->
                {{$t('M.comm_sell')}}
              </span>
            </template>
          </el-table-column>
          <!-- 币种 -->
          <el-table-column
            :label="$t('M.comm_currency')"
          >
            <template slot-scope="s">
              {{ s.row.coinName }}
            </template>
          </el-table-column>
          <!-- 价格 -->
          <el-table-column
            :label="$t('M.otc_index_price')"
          >
            <template slot-scope="s">
              {{ $scientificToNumber(s.row.price) }}({{ s.row.currencyName }})
            </template>
          </el-table-column>
          <!-- 数量 -->
          <el-table-column
            :label="$t('M.comm_count')"
          >
            <template slot-scope="s">
              {{ $scientificToNumber(s.row.pickCount) }}({{ s.row.coinName }})
            </template>
          </el-table-column>
          <!-- 总金额 -->
          <el-table-column
            :label="$t('M.otc_canceled_total')"
          >
            <template slot-scope="s">
              {{ $scientificToNumber(s.row.payAmount) }}({{ s.row.currencyName }})
            </template>
          </el-table-column>
          <!-- 下单时间 -->
          <el-table-column
            :label="$t('M.otc_stocks_ordertime')"
          >
            <template slot-scope="s">
              {{timeFormatting(s.row.createTime)}}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--分页-->
      <div class="page text-align-c">
        <el-pagination
          background
          v-show="completedOrdersList.length"
          layout="prev, pager, next"
          :page-count="totalPages"
          @current-change="changeCurrentPage"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {timeFilter} from '../../utils'
import {getOTCOrdersThreeDay} from '../../utils/api/OTC'
import {
  getNestedData
} from '../../utils/commonFunc'
import {mapState} from 'vuex'
export default {
  components: {},
  data () {
    return {
      // 每页展示的条数
      pageSize: 5,
      // 当前页码
      currentPage: 1,
      // 总页数
      totalPages: 1,
      // 完成订单列表
      completedOrdersList: []
    }
  },
  created () {
    // 1.0 请求已完成订单列表:只有登录了才调用
    if (this.isLogin) {
      this.getOTCCompletedOrdersList()
    }
  },
  // mounted () {},
  // ,
  // update () {},
  // beforeRouteUpdate () {},
  methods: {
    // 0.2 分页改变事件
    changeCurrentPage (pageNum) {
      this.currentPage = pageNum
      this.getOTCCompletedOrdersList()
    },
    // 1.0 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
    },
    // 2.0 请求已完成订单列表
    async getOTCCompletedOrdersList () {
      const data = await getOTCOrdersThreeDay({
        status: 'COMPLETED', // 状态 (交易中 TRADING 已完成 COMPLETED  已取消  CANCELED 冻结中 FROZEN)
        pageNum: this.currentPage,
        pageSize: this.pageSize
      })
      // console.log('已完成订单')
      // console.log(data)
      // 返回数据正确的逻辑
      if (!data) return false
      if (data.data) {
        let completedOrdersListData = getNestedData(data, 'data')
        // 完成订单列表
        this.completedOrdersList = getNestedData(completedOrdersListData, 'list')
        // 分页
        this.totalPages = getNestedData(completedOrdersListData, 'pages') - 0
      }
    }
  },
  // filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      isLogin: state => state.user.isLogin // 是否登录
    })
  }
  // watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
@import "../../assets/CSS/index";

.otc-completed-order-box {
  > .completed-order-content {
    width: 1187px;
    margin: 3px;

    .completed-info {
      display: flex;
      flex: 7;
      font-size: 12px;

      > .completed-info-left {
        flex: 2;

        > .order-info-left {
          line-height: 20px;
        }
      }

      > .completed-info-middle {
        flex: 2;

        > .order-info-middle {
          margin-left: 50px;
          line-height: 20px;
        }
      }

      > .completed-info-right {
        flex: 3;

        > .order-info-right {
          margin-left: 50px;
          line-height: 20px;

          .reason-content {
            display: inline-block;
            width: 250px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }

    /deep/ {
      .el-table__header {
        margin-bottom: 5px;
      }

      .el-table__body {
        border-collapse: separate !important;
      }

      &.el-table {
        border-collapse: separate !important;
      }

      .tables {
        .el-icon-arrow-right::before {
          content: " ";
        }
      }

      .el-table_2_column_9 {
        .el-table__expand-column {
          .is-leaf {
            border-bottom-left-radius: 5px;
            border-top-left-radius: 5px;
          }
        }
      }

      .el-table {
        th {
          padding: 5px 0;

          &.is-leaf {
            &:first-of-type {
              border-bottom-left-radius: 5px;
              border-top-left-radius: 5px;
            }

            &:nth-last-of-type(2) {
              border-top-right-radius: 5px;
              border-bottom-right-radius: 5px;
            }
          }
        }
      }

      .el-table--enable-row-transition {
        .el-table__body {
          td {
            &:first-of-type {
              border-top-left-radius: 5px;

              &.el-table__expanded-cell {
                border-top-left-radius: 0;
              }
            }

            &:nth-last-of-type(1) {
              border-top-right-radius: 5px;

              &.el-table__expanded-cell {
                border-top-right-radius: 0;
              }
            }
          }
        }
      }

      .el-table__empty-block {
        width: 1189px !important;
        min-height: 432px;
        margin: 2px;
      }
    }
  }

  &.night {
    > .completed-order-content {
      .red {
        color: $upColor;
      }

      .green {
        color: $otcGreen;
      }

      .completed-info {
        color: #9da5b3;

        > .completed-info-left {
          border-right: 1px solid #262f38;

          > .order-info-left {
            > .pay-info {
              color: $mainColor;
            }
          }
        }

        > .completed-info-middle {
          border-right: 1px solid #262f38;

          > .order-info-middle {
            > .buyer-seller-info {
              color: $mainColor;
            }
          }
        }

        > .completed-info-right {
          > .order-info-right {
            > .confirm-time {
              color: $mainColor;
            }
          }
        }
      }

      /deep/ {
        .el-table__empty-text {
          color: rgba(255, 255, 255, .8);
        }

        .el-table--enable-row-hover {
          .el-table__body {
            tr {
              &:hover {
                > td {
                  background-color: $mainContentNightBgColor;
                }
              }
            }
          }
        }

        .el-table__header {
          margin-bottom: 15px;

          thead {
            > tr {
              > th {
                border: 1px solid #485776;
                border-right: 0;
                border-left: 0;

                &:first-child {
                  border-left: 1px solid #485776;
                }

                &:nth-last-child(2) {
                  border-right: 1px solid #485776;
                }
              }
            }
          }
        }

        .el-table__body {
          border-collapse: separate !important;
        }

        &.el-table {
          border-collapse: separate !important;
        }

        .el-table__expanded-cell {
          border-bottom: 25px solid #272b41;
          background-color: $mainContentNightBgColor;
        }

        > .tables {
          .el-icon-arrow-right {
            &::before {
              content: " ";
            }
          }
        }

        .el-table_2_column_9 {
          .el-table__expand-column {
            .is-leaf {
              border-bottom-left-radius: 5px;
              border-top-left-radius: 5px;
            }
          }
        }

        .el-table {
          color: #9da5b3;
          background-color: #272b41;

          th {
            padding: 5px 0;
            box-shadow: 4px 4px 6px #191e28;

            &.is-leaf {
              border-bottom: 1px solid #485776 !important;

              &:first-of-type {
                border-bottom-left-radius: 5px;
                border-top-left-radius: 5px;
              }

              &:nth-last-of-type(2) {
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
              }
            }
          }
        }

        .el-table--enable-row-transition {
          .el-table__body {
            td {
              border-top: 1px solid #262f38;

              &:first-of-type {
                border-top-left-radius: 5px;

                &.el-table__expanded-cell {
                  border-top: 0 solid #262f38;
                  border-top-left-radius: 0;

                  &::after {
                    position: absolute;
                    bottom: -10px;
                    left: 0;
                    width: 1189px;
                    height: 20px;
                    border-bottom: 1px solid #262f38;
                    border-bottom-right-radius: 5px;
                    border-bottom-left-radius: 5px;
                    background-color: $mainContentNightBgColor;
                    content: '';
                  }
                }
              }

              &:nth-last-of-type(1) {
                border-top-right-radius: 5px;

                &.el-table__expanded-cell {
                  border-top-right-radius: 0;
                }
              }
            }
          }
        }

        .el-table__empty-block {
          background-color: $mainContentNightBgColor;
        }
      }
    }
  }

  &.day {
    > .completed-order-content {
      .red {
        color: $upColor;
      }

      .green {
        color: $otcGreen;
      }

      .completed-info {
        color: $dayMainTitleColor;

        > .completed-info-left {
          border-right: 1px solid rgba(38, 47, 56, .1);

          > .order-info-left {
            > .pay-info {
              color: $mainColor;
            }
          }
        }

        > .completed-info-middle {
          border-right: 1px solid rgba(38, 47, 56, .1);

          > .order-info-middle {
            > .buyer-seller-info {
              color: $mainColor;
            }
          }
        }

        > .completed-info-right {
          > .order-info-right {
            > .confirm-time {
              color: $mainColor;
            }
          }
        }
      }

      /deep/ {
        .el-table {
          border-collapse: separate !important;
          color: $dayMainTitleColor;
          background-color: $mainBgColorOfDay;

          .el-table__header-wrapper {
            width: 1181px;
            margin: 3px;
            overflow: initial;
            box-shadow: 0 0 6px #cfd5df;

            .el-table__header {
              table-layout: inherit;
              width: 1180px !important;
            }
          }

          thead {
            color: $fontColorSecondaryOfDay;
          }

          th {
            padding: 5px 0;

            &.is-leaf {
              &:first-of-type {
                border-bottom-left-radius: 5px;
                border-top-left-radius: 5px;
              }

              &:nth-last-of-type(2) {
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
              }
            }
          }
        }

        .el-table__empty-text {
          color: $dayMainTitleColor;
        }

        .el-table--enable-row-hover {
          .el-table__body {
            tr {
              &:hover {
                > td {
                  background-color: $mainColorOfWhite;
                }
              }
            }
          }
        }

        .el-table__header {
          margin-bottom: 15px;
        }

        .el-table__body {
          border-collapse: separate !important;
        }

        .el-table__expanded-cell {
          border-bottom: 25px solid $mainColorOfWhite;
          background-color: $mainColorOfWhite;
        }

        .el-icon-arrow-right {
          &::before {
            // content: " ";
          }
        }

        .el-table_2_column_9 {
          .el-table__expand-column {
            .is-leaf {
              border-bottom-left-radius: 5px;
              border-top-left-radius: 5px;
            }
          }
        }

        .el-table--enable-row-transition {
          .el-table__body {
            td {
              border-top: 1px solid #ecf1f8;

              &:first-of-type {
                border-left: 1px solid #ecf1f8;
                border-top-left-radius: 5px;

                &.el-table__expanded-cell {
                  border-top-left-radius: 0;

                  &::after {
                    position: absolute;
                    bottom: -25px;
                    left: -2px;
                    width: 1190px;
                    height: 13px;
                    background-color: $mainBgColorOfDay;
                    -webkit-box-shadow: 0 0 6px $boxShadowColorOfDay;
                    box-shadow: 0 0 6px $boxShadowColorOfDay;
                    content: '';
                  }
                }
              }

              &:nth-last-of-type(1) {
                border-top-right-radius: 5px;
                border-right: 1px solid #ecf1f8;

                &.el-table__expanded-cell {
                  border-top-right-radius: 0;
                }
              }
            }
          }
        }

        .el-table__empty-block {
          background-color: $mainColorOfWhite;
          box-shadow: 0 0 6px $boxShadowColorOfDay;
        }
      }
    }
  }
}

/deep/ {
  .el-table {
    th.is-leaf {
      border-bottom: 0 !important;
    }

    td {
      border-bottom: 1px solid #262f38;
    }
  }
}
</style>
