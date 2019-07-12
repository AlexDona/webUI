<template>
  <div
    class="fiat-canceled-order-box personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="canceled-order-content">
      <!--表头属性-->
      <div class="canceled-table-head display-flex font-size12 box-sizing">
        <span class="item AD-ID">
          <!--广告id-->
          {{$t('M.otc_AD_ID')}}
        </span>
        <span class="item order-time">
          <!--订单号-->
          {{$t('M.otc_MerchantsOrders_orderNum')}}
        </span>
        <span class="item order-type">
          <!--类型-->
          {{$t('M.otc_cancelOrder_type')}}
        </span>
        <span class="item order-coin">
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
        <span class="item order-time">
          <!--下单时间-->
          {{$t('M.otc_stocks_ordertime')}}
        </span>
      </div>
      <!--表格-->
      <div
        class="canceled-table-body font-size12 box-sizing"
        v-for="(item,index) in OTCCanceledOrderList"
        :key="index"
      >
        <!--表格上部分-->
        <div class="canceled-info-top display-flex">
          <!-- 广告id -->
          <span class="item AD-ID">
            {{item.entrustSequence}}
          </span>
          <!-- 订单号 -->
          <span class="item order-time">
            {{item.orderSequence}}
          </span>
          <!-- 类型 买入 -->
          <span
            class="item order-type"
            v-if="item.orderType === 'BUY'"
            :class="{ red: item.orderType === 'BUY' }"
          >
            {{$t('M.comm_buy')}}
          </span>
          <!-- 类型卖出 -->
          <span
            class="item order-type"
            v-if="item.orderType === 'SELL'"
            :class="{ green: item.orderType === 'SELL' }"
          >
            {{$t('M.comm_sell')}}
          </span>
          <!-- 币种 -->
          <span class="item order-coin">
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
        <div class="canceled-info-bottom box-sizing">
          <div class="info-left box-sizing">
            <!--付款信息-->
            <p class="text-info text-blue">
              {{$t('M.otc_index_js2')}}
            </p>
            <!--卖家超时未付款，系统自动取消-->
            <p class="text-info">
              {{$t('M.otc_overtime')}}
            </p>
          </div>
          <div class="info-middle box-sizing">
            <!--卖家信息-->
            <p class="text-info text-blue">
              {{$t('M.otc_stocks_seller')}}
            </p>
            <!--姓名-->
            <p class="text-info">
              <span>
                {{$t('M.otc_name')}}：
              </span><span>
              {{item.sellName}}
            </span>
            </p>
            <!--卖家手机号-->
            <p class="text-info">
              <span>
                {{$t('M.otc_trading_sellphone')}}：
              </span><span>
              {{item.sellPhone}}
            </span>
            </p>
          </div>
          <div class="info-right box-sizing">
            <!-- 超时未支付，订单取消 -->
            <p
              class="text-info"
              v-if="item.appeal == 'NO'"
            >
              {{$t('M.otc_overBuy_cancel')}}
            </p>
            <!-- 申诉判定，订单取消 -->
            <p
              class="text-info"
              v-if="item.appeal == 'YES'"
            >
              {{$t('M.otc_shesu_cancel')}}
            </p>
            <!--取消时间-->
            <p class="text-info">
              {{$t('M.otc_canceled_cancel')}}:{{timeFormatting(item.cancelTime)}}
            </p>
            <!--原因-->
            <p
              class="text-info"
              v-show="item.appeal == 'YES'"
            >
              <span
                class="reason-content cursor-pointer display-inline-block"
                :title="item.handleSuggest"
              >
                {{$t('M.otc_order_reason')}}：{{item.handleSuggest}}
              </span>
            </p>
          </div>
        </div>
      </div>
      <!--暂无数据-->
      <div
        class="no-data font-size12 text-align-c"
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
  @import '../../../assets/CSS/index';

  .fiat-canceled-order-box {
    > .canceled-order-content {
      min-height: 530px;
      padding: 0 10px 10px;

      > .canceled-table-head {
        height: 35px;
        margin-bottom: 12px !important;
        line-height: 35px;

        > .item {
          display: inline-block;
          text-align: center;
        }

        > .order-time {
          width: 140px;
        }

        > .order-type,
        .order-coin,
        .AD-ID {
          width: 100px;
        }
      }

      > .canceled-table-body {
        height: 170px;
        margin-bottom: 10px;
        border-radius: 6px;

        > .canceled-info-top {
          height: 40px;
          line-height: 40px;

          .red {
            color: $upColor;
          }

          .green {
            color: $otcGreen;
          }

          > .item {
            display: inline-block;
            text-align: center;
          }

          > .order-time {
            width: 140px;
          }

          > .order-type,
          .order-coin,
          .AD-ID {
            width: 100px;
          }
        }

        > .canceled-info-bottom {
          display: flex;
          flex: 7;
          padding: 30px 30px 0;

          > .info-left {
            flex: 2;

            > .text-info {
              line-height: 20px;

              .reason-content {
                width: 250px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }

          > .info-middle {
            flex: 2;
            margin-left: 30px;

            > .text-info {
              line-height: 20px;
            }
          }

          > .info-right {
            flex: 3;
            margin-left: 30px;

            > .text-info {
              line-height: 20px;
            }
          }
        }
      }

      > .no-data {
        height: 475px;
        line-height: 475px;
      }
    }

    &.night {
      > .canceled-order-content {
        background-color: $mainContentNightBgColor;

        > .canceled-table-head {
          border-bottom: 1px solid $dialogColor6;
          color: #617499;
        }

        > .canceled-table-body {
          border: 1px solid $dialogColor6;

          > .canceled-info-top {
            color: #617499;
          }

          > .canceled-info-bottom {
            border-top: 1px solid #262f38;
            color: #9da5b3;

            > .info-left,
            .info-middle {
              border-right: 1px solid #262f38;

              > .text-blue {
                color: $mainColor;
              }
            }

            > .info-right {
              > .text-blue {
                color: $mainColor;
              }
            }
          }
        }

        > .no-data {
          background-color: $mainContentNightBgColor;
        }
      }
    }

    &.day {
      > .canceled-order-content {
        background-color: $mainColorOfWhite;

        > .canceled-table-head {
          border-bottom: 1px solid $borderColorOfDay;
          color: $fontColorSecondaryOfDay;
        }

        > .canceled-table-body {
          border: 1px solid $borderColorOfDay;

          > .canceled-info-top {
            color: $dayMainTitleColor;
          }

          > .canceled-info-bottom {
            border-top: 1px solid rgba(38, 47, 56, .1);
            color: $dayMainTitleColor;

            > .info-left,
            .info-middle {
              border-right: 1px solid rgba(38, 47, 56, .1);

              > .text-blue {
                color: $mainColor;
              }
            }

            > .info-right {
              > .text-blue {
                color: $mainColor;
              }
            }
          }
        }

        > .no-data {
          color: $fontColorSecondaryOfDay;
          background-color: $mainDayBgColor;
          box-shadow: 0 0 6px $boxShadowColorOfDay;
        }
      }
    }
  }
</style>
