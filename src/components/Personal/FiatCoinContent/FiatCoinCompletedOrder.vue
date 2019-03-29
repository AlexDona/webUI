<template>
  <div
    class="fiat-completed-order-box personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="completed-order-content">
      <div class="tables">
        <el-table
          :data="completedOrdersList"
          :default-expand-all="true"
          :empty-text="$t('M.comm_no_data')"
          width="800"
        >
          <div>
            <el-table-column type="expand">
              <template slot-scope="s">
                <div class="completed-info">
                  <!-- 左侧信息 -->
                  <div class="completed-info-left">
                    <!-- 付款信息 -->
                    <p class="order-info-left">
                      <span class="pay-info">
                        <!--付款信息-->
                        {{$t('M.otc_index_js2')}}
                      </span>
                    </p>
                    <p class="order-info-left">
                      <!-- 姓名 ：展示的是卖家的名字-->
                      <span>
                        <!--姓名-->
                        {{$t('M.otc_name')}}：
                      </span>
                      <!-- <span>{{s.row.buyName}}</span> -->
                      <span>{{s.row.sellName}}</span>
                    </p>
                    <p class="order-info-left">
                      <span>
                        <!--付款方式-->
                        {{$t('M.otc_alipay_type')}}：
                      </span>
                      <!-- 判断付款方式 -->
                      <span v-if="s.row.payType === 'Alipay'">
                        <!--支付宝-->
                        {{$t('M.comm_alipay')}}
                      </span>
                      <span v-if="s.row.payType === 'Bankcard'">
                        <!--银行卡-->
                        {{$t('M.comm_bank')}}
                      </span>
                      <span v-if="s.row.payType === 'WestUnion'">
                        <!--西联汇款-->
                        {{$t('M.comm_xilian')}}
                      </span>
                      <span v-if="s.row.payType === 'PAYPAL'">
                        PAYPAL
                      </span>
                      <span v-if="s.row.payType === 'Wechat'">
                        <!--微信-->
                        {{$t('M.comm_weixin')}}
                      </span>
                      <!-- <span>{{s.row.payType}}</span> -->
                    </p>
                    <!-- 付款账号 -->
                    <p class="order-info-left">
                      <!--银行卡账号-->
                      <!-- <span>
                        {{$t('M.otc_bank_num')}}：
                      </span>
                      <span>{{s.row.payAcctount}}</span> -->
                      <!-- 支付宝账号 -->
                      <span v-if="s.row.payType === 'Alipay'">
                        {{$t('M.user_account_alipay')}}{{$t('M.user_account_number')}}：
                      </span>
                      <!-- 银行卡账号 -->
                      <span v-if="s.row.payType === 'Bankcard'">
                        {{$t('M.otc_bank_num')}}：
                      </span>
                      <!-- 西联汇款账号 -->
                      <span v-if="s.row.payType === 'WestUnion'">
                        {{$t('M.user_account_western_union')}}{{$t('M.user_account_number')}}：
                      </span>
                      <!-- PAYPAL账号 -->
                      <span v-if="s.row.payType === 'PAYPAL'">
                        PAYPAL{{$t('M.user_account_number')}}：
                      </span>
                      <!-- 微信账号 -->
                      <span v-if="s.row.payType === 'Wechat'">
                        {{$t('M.user_account_weChat')}}{{$t('M.user_account_number')}}：
                      </span>
                      <!-- <span>{{$t('M.otc_bank_num')}}：</span> -->
                      <span>{{s.row.payAcctount}}</span>
                    </p>
                  </div>
                  <!-- 中间 -->
                  <div class="completed-info-middle">
                    <p class="order-info-middle">
                      <!-- <span class="buyer-seller-info"> -->
                        <!--卖家信息-->
                        <!-- {{$t('M.otc_stocks_seller')}} -->
                      <!-- </span> -->
                      <!-- 买单显示：卖家信息 -->
                      <span
                        class="buyer-seller-info"
                        v-if="s.row.orderType === 'BUY'"
                      >
                        {{$t('M.otc_stocks_seller')}}
                      </span>
                      <!-- 卖单显示：买家信息 -->
                      <span
                        class="buyer-seller-info"
                        v-if="s.row.orderType === 'SELL'"
                      >
                        {{$t('M.otc_stocks_buyinfo')}}
                      </span>
                    </p>
                    <p class="order-info-middle">
                      <!-- <span> -->
                        <!--姓名-->
                        <!-- {{$t('M.otc_name')}}： -->
                      <!-- </span> -->
                      <!-- <span>{{s.row.sellName}}</span> -->
                      <!-- 姓名 -->
                      <span>{{$t('M.otc_name')}}：</span>
                      <!-- 买单显示：卖家姓名 -->
                      <span v-if="s.row.orderType === 'BUY'">
                        {{s.row.sellName}}
                      </span>
                      <!-- 卖单显示：买家姓名 -->
                      <span v-if="s.row.orderType === 'SELL'">
                        {{s.row.buyName}}
                      </span>
                    </p>
                    <p class="order-info-middle">
                      <!-- 买单显示：卖家手机号 -->
                      <span v-if="s.row.orderType === 'BUY'">
                        {{$t('M.otc_trading_sellphone')}}：
                      </span>
                      <span v-if="s.row.orderType === 'BUY'">
                        {{s.row.sellPhone}}
                      </span>
                      <!-- 卖单显示：买家手机号 -->
                      <span v-if="s.row.orderType === 'SELL'">
                        {{$t('M.otc_trading_buyphone')}}：
                      </span>
                      <span v-if="s.row.orderType === 'SELL'">
                        {{s.row.buyPhone}}
                      </span>
                    </p>
                  </div>
                  <!-- 右侧 -->
                  <div class="completed-info-right">
                    <p
                      class="order-info-right"
                      v-if="s.row.appeal == 'NO' && s.row.confirmTime !== ''"
                    >
                      <!-- <span class="confirm-time">确认时间</span> -->
                      <!-- 交易已完成 -->
                      <span class="confirm-time">{{$t('M.otc_trade_complate')}}</span>
                    </p>
                    <p
                      class="order-info-right"
                      v-if="s.row.appeal == 'YES'"
                    >
                    <!-- 申诉判定，订单完成 -->
                      <span class="confirm-time">{{$t('M.otc_decide_complate')}}</span>
                    </p>
                    <p
                      class="order-info-right"
                      v-if="s.row.appeal == 'NO' && s.row.confirmTime == ''"
                    >
                    <!-- 申诉判定，订单完成 -->
                      <span class="confirm-time">{{$t('M.otc_decide_complate')}}</span>
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
          <!--订单号-->
          <el-table-column
            :label="$t('M.otc_MerchantsOrders_orderNum')"
            width="150px"
          >
            <template slot-scope="s">
              {{s.row.orderSequence}}
            </template>
          </el-table-column>
          <!--类型-->
          <el-table-column
            :label="$t('M.comm_type')"
          >
            <template slot-scope="s">
            <span
              v-if="s.row.orderType === 'BUY'"
              :class="{ red: s.row.orderType === 'BUY' }"
            >
              <!--买入-->
              {{$t('M.comm_buy')}}
            </span>
              <span
                v-if="s.row.orderType === 'SELL'"
                :class="{ green: s.row.orderType === 'SELL' }"
              >
              <!--卖出-->
                {{$t('M.comm_sell')}}
            </span>
            </template>
          </el-table-column>
          <!--币种-->
          <el-table-column
            :label="$t('M.otc_AD_token')"
          >
            <template slot-scope="s">
              {{ s.row.coinName }}
            </template>
          </el-table-column>
          <!--价格-->
          <el-table-column
            :label="$t('M.comm_price_metre')"
          >
            <template slot-scope="s">
              {{ s.row.price }}({{ s.row.currencyName }})
            </template>
          </el-table-column>
          <!--数量-->
          <el-table-column
            :label="$t('M.comm_count')"
          >
            <template slot-scope="s">
              {{ s.row.pickCount }}({{ s.row.coinName }})
            </template>
          </el-table-column>
          <!--总金额-->
          <el-table-column
            :label="$t('M.comm_total_sum') + $t('M.comm_money')"
          >
            <template slot-scope="s">
              {{ (s.row.price*s.row.pickCount).toFixed(2)}}({{ s.row.currencyName }})
            </template>
          </el-table-column>
          <!--下单时间-->
          <el-table-column
            :label="$t('M.otc_stocks_ordertime')"
            width="160px"
          >
            <template slot-scope="s">
              {{timeFormatting(s.row.createTime)}}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--分页-->
      <el-pagination
        background
        v-show="completedOrdersList.length"
        layout="prev, pager, next"
        :current-page="legalTradePageNum"
        :page-count="legalTradePageTotals"
        @current-change="changeCurrentPage"
      >
      </el-pagination>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {timeFilter} from '../../../utils'
import {changeCurrentPageForLegalTrader} from '../../../utils/commonFunc'
import {
  mapMutations,
  mapState
} from 'vuex'
export default {
  components: {},
  // props,
  data () {
    return {
      // completedOrdersList: []
    }
  },
  created () {},
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_LEGAL_PAGE',
      'SET_LEGAL_TENDER_REFLASH_STATUS'
    ]),
    // 分页
    changeCurrentPage (e) {
      changeCurrentPageForLegalTrader(e, 'COMPLETED', this)
    },
    // 1.0 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      legalTraderCompletedList: state => state.personal.legalTraderCompletedList,
      legalTraderCompletedReflashStatus: state => state.personal.legalTraderCompletedReflashStatus,
      legalTradePageTotals: state => state.personal.legalTradePageTotals,
      legalTradePageNum: state => state.personal.legalTradePageNum

    }),
    completedOrdersList () {
      return this.legalTraderCompletedList
    }
  },
  watch: {
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal.scss";

  .fiat-completed-order-box {
    > .completed-order-content {
      .red {
        color: #d45858;
      }

      .green {
        color: #008069;
      }

      .completed-info {
        display: flex;
        flex: 7;
        color: #9da5b3;

        > .completed-info-left {
          flex: 2;
          border-right: 1px solid #262f38;

          > .order-info-left {
            line-height: 20px;

            > .pay-info {
              color: #5e95ec;
            }
          }
        }

        .completed-info-middle {
          flex: 2;
          border-right: 1px solid #262f38;

          .order-info-middle {
            margin-left: 50px;
            line-height: 20px;

            > .buyer-seller-info {
              color: #5e95ec;
            }
          }
        }

        > .completed-info-right {
          flex: 3;

          > .order-info-right {
            margin-left: 50px;
            line-height: 20px;

            > .confirm-time {
              color: #5e95ec;
            }

            // 增加原因字段样式
            .reason-content {
              display: inline-block;
              width: 250px;
              overflow: hidden;
              text-overflow: ellipsis; // 显示省略符号来代表被修剪的文本。
              white-space: nowrap; // 文本不会换行，文本会在在同一行上继续，直到遇到 <br> 标签为止。
            }
          }
        }
      }
    }

    /deep/ {
      td,
      th {
        height: 0;
        line-height: 0;
      }

      tr {
        &:hover {
          & > td {
            background-color: #1e2636;
          }
        }
      }

      .el-table__header {
        margin-bottom: 5px;
      }

      .el-table {
        border-collapse: separate !important;
        color: #9da5b3;
        background-color: #1e2636;
      }

      .el-table__expand-icon {
        .el-icon-arrow-right {
          &::before {
            content: " ";
          }
        }
      }

      .el-table__body {
        border-collapse: separate !important;
      }

      .el-table__expanded-cell {
        border-bottom: 25px solid #1d2331;
        background-color: #1e2636;
      }

      th {
        padding: 5px 0;
        background-color: #1e2636;
        box-shadow: 4px 4px 6px #191e28;

        .is-leaf {
          &:first-of-type {
            border-bottom: 1px solid #262f38;
            border-left: 1px solid #262f38;
            border-bottom-left-radius: 5px;
            border-top-left-radius: 5px;
          }

          &:nth-last-of-type(2) {
            border-top-right-radius: 5px;
            border-right: 1px solid #262f38;
          }
        }
      }

      td {
        height: 40px;
        border-bottom: 1px solid #262f38;

        &:first-of-type {
          border-top-left-radius: 5px;

          &.el-table__expanded-cell {
            border-top: 0 solid #262f38;
            border-top-left-radius: 0;

            &::after {
              position: absolute;
              bottom: -10px;
              left: 0;
              height: 20px;
              border-bottom: 1px solid #262f38;
              border-bottom-right-radius: 5px;
              border-bottom-left-radius: 5px;
              background-color: #1e2636;
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

      .el-table__empty-block {
        min-height: 432px;
        background-color: #1e2636;
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

      /deep/ {
        th {
          padding: 5px 0;
          box-shadow: 4px 4px 6px #191e28;

          &.is-leaf {
            border-top: 1px solid #262f38;
            border-bottom: 1px solid #262f38;
          }
        }

        .el-table--enable-row-hover {
          .el-table__body {
            tr {
              &:hover {
                & > td {
                  background-color: #1c1f32;
                }
              }
            }
          }
        }

        td {
          height: 40px;
          background-color: #1c1f32;
        }

        .el-table__header {
          margin-bottom: 5px;
        }

        .el-table {
          border-collapse: separate !important;
          color: #9da5b3;
          background-color: #272b41;

          th {
            background-color: #1c1f32;

            &.is-leaf {
              &:first-of-type {
                border-left: 1px solid #262f38;
                border-bottom-left-radius: 5px;
                border-top-left-radius: 5px;
              }

              &:nth-last-of-type(2) {
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
                border-right: 1px solid #262f38;
              }
            }
          }

          td {
            /* border-bottom: 1px solid #262f38; */
          }
        }

        .el-table__body {
          border-collapse: separate !important;
        }

        .el-table__expanded-cell {
          border-bottom: 15px solid #272b41;
          background-color: #1c1f32;

          &:hover {
            background-color: #1c1f32 !important;
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
              border-top: 1px solid #262f38;

              &:first-of-type {
                border-left: 1px solid #262f38;
                border-top-left-radius: 5px;

                &.el-table__expanded-cell {
                  border-top: 0 solid #262f38;
                  border-left: 1px solid #262f38;
                  border-top-left-radius: 0;
                  border-right: 1px solid #262f38;

                  &::after {
                    position: absolute;
                    bottom: -10px;
                    left: 0;
                    height: 20px;
                    border-bottom: 1px solid #262f38;
                    border-bottom-right-radius: 5px;
                    border-bottom-left-radius: 5px;
                    background-color: #1c1f32;
                    content: '';
                  }
                }
              }

              &:nth-last-of-type(1) {
                border-top-right-radius: 5px;
                border-right: 1px solid #262f38;

                &.el-table__expanded-cell {
                  border-top-right-radius: 0;
                }
              }
            }
          }
        }

        .el-table__empty-block {
          height: 431px;
          min-height: 431px;
          background-color: #1c1f32;
        }
      }
    }

    &.day {
      color: $dayFontColor;
      background-color: $dayBgColor;

      > .background-color {
        background-color: #ccc;
      }

      .completed-info {
        display: flex;
        flex: 7;
        color: #9da5b3;

        > .completed-info-left {
          flex: 2;
          border-right: 1px solid rgba(38, 47, 56, .1);

          > .order-info-left {
            line-height: 20px;

            > .pay-info {
              color: #5e95ec;
            }
          }
        }

        > .completed-info-middle {
          flex: 2;
          border-right: 1px solid rgba(38, 47, 56, .1);

          > .order-info-middle {
            margin-left: 50px;
            line-height: 20px;

            > .buyer-seller-info {
              color: #5e95ec;
            }
          }
        }

        > .completed-info-right {
          flex: 3;

          > .order-info-right {
            margin-left: 50px;
            line-height: 20px;

            > .confirm-time {
              color: #5e95ec;
            }
          }
        }
      }

      /deep/ {
        .completed-order-content {
          .el-table--enable-row-transition {
            .el-table__body {
              td {
                border-top: 1px solid #ecf1f8;
              }
            }
          }
        }

        tr:hover {
          > td {
            background-color: #fff;
          }
        }

        .el-table__header {
          margin-bottom: 0;
        }

        .el-table {
          margin: 0 auto;
          border: 1px solid #ecf1f8;
          background: #fff;

          th.is-leaf {
            border-right: 1px solid #fff;

            &:first-of-type {
              border-left: none;
              border-radius: 0;
            }
          }

          th {
            background: #fff;
          }

          td {
            border-bottom: 1px solid rgba(38, 47, 56, .1);

            &:hover {
              background-color: #fff;
            }
          }
        }

        .el-table__empty-block {
          background: #fff;
        }

        .el-table__expanded-cell {
          /* border-bottom: 15px solid #fff !important; */
          border-bottom: 15px solid #f4f4f4 !important;
          background-color: #fff;

          &:hover {
            background-color: #fff !important;
          }
        }
      }
    }
  }
</style>
