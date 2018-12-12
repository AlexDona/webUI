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
import {createNamespacedHelpers, mapState} from 'vuex'
const {mapMutations} = createNamespacedHelpers('personal')
export default {
  components: {},
  // props,
  data () {
    return {}
  },
  created () {
    require('../../../../static/css/list/Personal/FiatCoinContent/FiatCoinCanceledOrder.css')
    require('../../../../static/css/theme/day/Personal/FiatCoinContent/FiatCoinCanceledOrderDay.css')
    require('../../../../static/css/theme/night/Personal/FiatCoinContent/FiatCoinCanceledOrderNight.css')
  },
  mounted () {},
  activited () {},
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
              // 任付伟增加原因字段样式
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
    }

    &.day {
      color: $dayFontColor;
      background-color: $dayBgColor;

      > .background-color {
        background-color: #ccc;
      }

      > .canceled-order-content {
        > .canceled-table-head {
          border: 1px solid rgba(38, 47, 56, .1);
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
    }
  }
</style>
