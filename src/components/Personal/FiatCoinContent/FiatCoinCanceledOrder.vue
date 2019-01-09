<template>
  <div
    class="fiat-canceled-order-box personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="canceled-order-content">
      <!--&lt;!&ndash;表头属性&ndash;&gt;-->
      <div class="canceled-table-head display-flex">
        <span class="item flex1">
          <!--订单号-->
          {{$t('M.otc_MerchantsOrders_orderNum')}}
        </span>
        <span class="item flex1">
          <!--类型-->
          {{$t('M.otc_cancelOrder_type')}}
        </span>
        <span class="item flex1">
          <!--币种-->
          {{$t('M.comm_currency')}}
        </span>
        <span class="item flex1">
          <!--价格-->
          {{$t('M.otc_index_price')}}
        </span>
        <span class="item flex1">
          <!--数量-->
          {{$t('M.comm_count')}}
        </span>
        <span class="item flex1">
          <!--总金额-->
          {{$t('M.otc_canceled_total')}}
        </span>
        <span class="item flex1">
          <!--下单时间-->
          {{$t('M.otc_stocks_ordertime')}}
        </span>
      </div>
      <!--表格-->
      <div
        class="canceled-table-body"
        v-for="(item,index) in OTCCanceledOrderList"
        :key="index"
      >
        <!--表格上部分-->
        <div class="canceled-info-top display-flex">
          <!-- 订单号 -->
          <span class="item order-time">{{item.orderSequence}}</span>
          <!-- 类型 买入 -->
          <span
            class="item flex1"
            v-if="item.orderType === 'BUY'"
            :class="{ red: item.orderType === 'BUY' }"
          >
            <!--买入-->
            {{$t('M.comm_buy')}}
          </span>
          <!-- 类型卖出 -->
          <span
            class="item flex1"
            v-if="item.orderType === 'SELL'"
            :class="{ green: item.orderType === 'SELL' }"
          >
            <!--卖出-->
            {{$t('M.comm_sell')}}
          </span>
          <!-- 币种 -->
          <span class="item flex1">
            {{item.coinName}}
          </span>
          <!-- 价格 -->
          <span class="item flex1">
            {{item.price}}({{ item.currencyName }})
          </span>
          <!-- 数量 -->
          <span class="item flex1">
            {{item.pickCount}}({{ item.coinName }})
          </span>
          <!-- 总金额 -->
          <span class="item flex1">
            {{(item.price*item.pickCount).toFixed(2)}}({{ item.currencyName }})
          </span>
          <!-- 下单时间 -->
          <span class="item order-time">
            {{timeFormatting(item.createTime)}}
          </span>
        </div>
        <!--表格下部分-->
        <div class="canceled-info-bottom">
          <div class="info-left">
            <p class="text-info text-blue">
              <!--付款信息-->
              {{$t('M.otc_index_js2')}}
            </p>
            <p class="text-info">
              <!--卖家超时未付款，系统自动取消-->
              {{$t('M.otc_overtime')}}
            </p>
          </div>
          <div class="info-middle">
            <p class="text-info text-blue">
              <!--卖家信息-->
              {{$t('M.otc_stocks_seller')}}
            </p>
            <p class="text-info">
              <span>
                <!--姓名-->
                {{$t('M.otc_name')}}：
              </span><span>
              {{item.sellName}}
            </span>
            </p>
            <p class="text-info">
              <span>
                <!--卖家手机号-->
                {{$t('M.otc_trading_sellphone')}}：
              </span><span>
              {{item.sellPhone}}
            </span>
            </p>
          </div>
          <div class="info-right">
            <!--取消时间-->
            <!-- <p class="text-info text-blue">
              {{$t('M.otc_canceled_cancel')}}
            </p>
            <p class="text-info">
              {{timeFormatting(item.cancelTime)}}
            </p> -->
            <p
              class="text-info"
              v-if="item.appeal == 'NO'"
            >
             <!-- 超时未支付，订单取消 -->
              {{$t('M.otc_overBuy_cancel')}}
            </p>
            <p
              class="text-info"
              v-if="item.appeal == 'YES'"
            >
              <!-- 申诉判定，订单取消 -->
              {{$t('M.otc_shesu_cancel')}}
            </p>
            <p
              class="text-info"
            >
              {{$t('M.otc_canceled_cancel')}}:{{timeFormatting(item.cancelTime)}}
            </p>
            <!--原因-->
            <p class="text-info" v-show="item.appeal == 'YES'">
              <el-tooltip
                effect="dark"
                :content="item.handleSuggest"
                placement="bottom-start"
              >
                <span class="reason-content">
                  {{$t('M.otc_order_reason')}}：{{item.handleSuggest}}
                </span>
              </el-tooltip>
            </p>
          </div>
        </div>
      </div>
      <div
        class="no-data"
        v-if="!OTCCanceledOrderList.length"
      >
        <!--暂无数据-->
        {{$t('M.comm_no_data')}}
      </div>
      <!--分页-->
      <el-pagination
        background
        v-show="OTCCanceledOrderList.length"
        layout="prev, pager, next"
        :page-count="legalTradePageTotals"
        :current-page="legalTradePageNum"
        @current-change="changeCurrentPage"
      >
      </el-pagination>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {timeFilter} from '../../../utils'
// import {mapState, mapMutations} from 'vuex'
import {changeCurrentPageForLegalTrader} from '../../../utils/commonFunc'
import {
  mapMutations,
  mapState
} from 'vuex'
export default {
  components: {},
  // props,
  data () {
    return {}
  },
  created () {
  },
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
      changeCurrentPageForLegalTrader(e, 'CANCELED', this)
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
      legalTraderCanceledList: state => state.personal.legalTraderCanceledList,
      legalTradePageTotals: state => state.personal.legalTradePageTotals,
      legalTradePageNum: state => state.personal.legalTradePageNum
    }),
    OTCCanceledOrderList () {
      return this.legalTraderCanceledList
    }
  },
  watch: {

  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal.scss";

  .fiat-canceled-order-box {
    > .canceled-order-content {
      > .canceled-table-head {
        box-sizing: border-box;
        height: 35px;
        margin-bottom: 5px;
        border-radius: 5px;
        line-height: 35px;

        > .item {
          display: inline-block;
          text-align: center;
        }
      }

      > .canceled-table-body {
        box-sizing: border-box;
        height: 170px;
        margin-bottom: 15px;
        border-radius: 5px;

        > .canceled-info-top {
          height: 40px;
          border-radius: 5px;
          line-height: 40px;

          > .item {
            display: inline-block;
            text-align: center;
          }

          > .order-time {
            width: 170px;
          }
        }

        > .canceled-info-bottom {
          display: flex;
          flex: 7;
          box-sizing: border-box;
          padding: 30px 30px 0;
          color: #9da5b3;

          > .info-left {
            flex: 2;
            box-sizing: border-box;

            > .text-info {
              line-height: 20px;
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

          > .info-middle {
            flex: 2;
            box-sizing: border-box;
            margin-left: 30px;

            > .text-info {
              line-height: 20px;
            }
          }

          > .info-right {
            flex: 3;
            box-sizing: border-box;
            margin-left: 30px;

            > .text-info {
              line-height: 20px;
            }
          }
        }
      }

      > .no-data {
        height: 345px;
        line-height: 345px;
        text-align: center;
      }
    }

    /deep/ {
      /* 1.0付款方式下拉框 */
      .el-input--suffix {
        .el-input__inner {
          width: 170px;
          height: 26px;
        }
      }

      .el-input__inner {
        padding: 0 30px !important;
        border: none;
      }

      .el-select-dropdown {
        border: none;
      }

      .el-select-dropdown__item {
        height: 30px !important;
        line-height: 30px !important;
      }

      /* 2.0按钮样式 */
      .el-button--mini {
        padding: 3px 10px;
      }

      /* 3.0 订单申诉 */
      .el-textarea {
        width: 540px;
      }

      .el-textarea__inner {
        height: 90px;
        resize: none;
        font-size: 14px;
      }

      /* 4.0 扫码付款按钮及弹窗支付宝和微信图片 */
      .bank-info-picture {
        .el-button {
          padding: 2px 6px;
        }
      }

      /* 输入密码弹出框 */
      .password-dialog {
        .el-dialog {
          width: 350px;
          height: 207px;
          border-radius: 4px;
        }

        .el-dialog__header {
          padding: 10px 20px;
          border-radius: 4px;
        }

        .el-dialog__title {
          font-size: 14px;
        }

        .el-dialog__body {
          padding: 15px 20px 10px 30px;
          font-size: 12px;

          .input {
            margin-top: 13px;
          }

          .password-input {
            display: inline-block;
            width: 280px;
            height: 36px;
            padding-left: 10px;
            border-radius: 4px;
            font-size: 14px;
          }

          .error-info {
            height: 20px;
            padding-top: 5px;
            font-size: 12px;
          }
        }

        .el-dialog__footer {
          padding: 0;
          text-align: center;
        }

        .el-button {
          width: 290px;
          padding: 7px 20px;
          border: 0;
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

      > .canceled-order-content {
        > .canceled-table-head {
          box-sizing: border-box;
          border: 1px solid #262f38;
          color: #617499;
          background-color: $nightMainBgColor;
          box-shadow: -2px 3px 5px 1px #191e28;
        }

        > .canceled-table-body {
          border: 1px solid #262f38;
          background-color: $nightMainBgColor;

          > .canceled-info-top {
            color: #617499;
            background-color: $nightMainBgColor;

            .red {
              color: #d45858;
            }

            .green {
              color: #008069;
            }
          }

          > .canceled-info-bottom {
            border-top: 1px solid #262f38;
            color: #9da5b3;

            > .info-left {
              flex: 2;
              border-right: 1px solid #262f38;

              > .text-blue {
                color: #5e95ec;
              }
            }

            > .info-middle {
              border-right: 1px solid #262f38;

              > .text-blue {
                color: #5e95ec;
              }
            }

            > .info-right {
              > .text-blue {
                color: #5e95ec;
              }
            }
          }
        }

        > .no-data {
          background-color: $nightMainBgColor;
        }
      }

      /deep/ {
        /* 交易中的订单样式重写 */
        .el-input__inner {
          color: #9da5b3;
          background-color: #303b45;
        }

        .el-select-dropdown {
          background-color: #29343f;
        }

        .el-select-dropdown__item.selected {
          color: #338ff5;
        }

        .el-select-dropdown__item {
          &:hover {
            background-color: #29343f;
          }
        }

        .el-table__expanded-cell {
          &:hover {
            background-color: #1c1f32;
          }
        }

        .el-select-dropdown__item.hover {
          color: #338ff5;
          background-color: #29343f;
        }

        .el-popper[x-placement^=bottom] {
          .popper__arrow {
            &::after {
              border-bottom-color: #29343f;
            }
          }
        }

        /* 2.0按钮样式 */
        .el-button--mini {
          padding: 3px 10px;
        }

        .el-textarea__inner {
          border: 1px solid #7587a5;
          resize: none;
          background-color: #1c1f32;
        }

        /* 4.0 扫码付款按钮及弹窗支付宝和微信图片 */
        .bank-info-picture {
          .el-button {
            border-color: #409eff;
            color: #fff;
            background-color: #409eff;

            &:hover {
              border-color: #66b1ff;
              color: #fff;
              background: #66b1ff;
            }
          }
        }

        /* 输入密码弹出框 */
        .password-dialog {
          .el-dialog {
            background: #28334a;

            .el-dialog__header {
              background-color: #20293c;
            }

            .el-dialog__title {
              color: #fff;
            }

            .el-dialog__body {
              color: #fff;

              .password-input {
                color: #fff;
                background-color: #1a2233;
              }

              .error-info {
                color: #fff;
              }
            }
          }

          .el-button--primary {
            background: linear-gradient(9deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
          }
        }

        tr {
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

      > .canceled-order-content {
        > .canceled-table-head {
          border: 1px solid rgba(38, 47, 56, .1) !important;
          color: #617499;
          background-color: $dayBgColor;
          box-shadow: -2px 3px 5px 1px #191e28;
        }

        > .canceled-table-body {
          border: 1px solid rgba(38, 47, 56, .1);
          background-color: $dayBgColor;

          > .canceled-info-top {
            color: #617499;
            background-color: $dayBgColor;

            .red {
              color: #d45858;
            }

            .green {
              color: #008069;
            }
          }

          > .canceled-info-bottom {
            border-top: 1px solid rgba(38, 47, 56, .1);
            color: #9da5b3;

            > .info-left {
              border-right: 1px solid rgba(38, 47, 56, .1);

              > .text-blue {
                color: #5e95ec;
              }
            }

            > .info-middle {
              border-right: 1px solid rgba(38, 47, 56, .1);

              > .text-blue {
                color: #5e95ec;
              }
            }

            > .info-right {
              > .text-blue {
                color: #5e95ec;
              }
            }
          }
        }

        > .no-data {
          background-color: $dayBgColor;
        }
      }

      /deep/ {
        .canceled-order-content {
          .canceled-table-head {
            border-radius: 0;
            background-color: #fff;
            -webkit-box-shadow: none;
            box-shadow: none;

            .item {
              border-bottom: 1px solid #ecf1f8;
              color: #909399;
            }
          }

          .no-data {
            width: 100%;
            background-color: #fff;
          }
        }

        .el-table {
          tr {
            background-color: #fff;
          }
        }
      }
    }
  }
</style>
