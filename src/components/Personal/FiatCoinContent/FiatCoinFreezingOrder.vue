<template>
  <div
    class="fiat-freezing-order-box personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="freezing-order-content">
      <!--表头-->
      <div class="freezing-table-head font-size12 box-sizing">
        <span class="item order-type">
          <!--类型-->
          {{$t('M.otc_cancelOrder_type')}}
        </span>
        <span class="item AD-ID">
          <!--广告id-->
          {{$t('M.otc_AD_ID')}}
        </span>
        <span class="item order-time">
          <!--订单号-->
          {{$t('M.otc_MerchantsOrders_orderNum')}}
        </span>
        <span class="item order-coin">
          <!--币种-->
          {{$t('M.comm_currency')}}
        </span>
        <span class="item">
          <!--价格-->
          {{$t('M.otc_index_price')}}
        </span>
        <span class="item">
          <!--数量-->
          {{$t('M.comm_count')}}
        </span>
        <span class="item">
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
        class="freezing-table-body font-size12 box-sizing"
        v-for="(item,index) in OTCFreezingOrderList"
        :key="index"
      >
        <!--表格上部分-->
        <div class="freezing-info-top">
          <!-- 类型 买入 -->
          <span
            class="item order-type"
            v-if="item.orderType === 'BUY'"
            :class="{ red: item.orderType === 'BUY' }"
          >
             {{$t('M.comm_buy')}}
          </span>
          <!-- 类型 卖出 -->
          <span
            class="item order-type"
            v-if="item.orderType === 'SELL'"
            :class="{ green: item.orderType === 'SELL' }"
          >
            {{$t('M.comm_sell')}}
          </span>
          <!-- 广告id -->
          <span class="item AD-ID">
            {{item.entrustSequence}}
          </span>
          <!-- 订单号 -->
          <span class="item order-time">
            {{item.orderSequence}}
          </span>
          <!-- 币种 -->
          <span class="item order-coin">
            {{item.coinName}}
          </span>
          <!-- 价格 -->
          <span class="item">
            {{item.price}}{{ item.currencyName }}
          </span>
          <!-- 数量 -->
          <span class="item">
            {{item.pickCount}}{{ item.coinName }}
          </span>
          <!-- 总金额 -->
          <span class="item">
            {{(item.price*item.pickCount).toFixed(2)}}{{ item.currencyName }}
          </span>
          <!-- 下单时间 -->
          <span class="item order-time">
            {{timeFormatting(item.createTime)}}
          </span>
        </div>
        <!--表格下部分-->
        <div class="freezing-info-bottom box-sizing">
          <!--左侧1-->
          <div class="info-left box-sizing">
            <!--付款信息-->
            <p class="text-info text-blue">
              {{$t('M.otc_index_js2')}}
            </p>
            <!--买家已付款，卖家有异议申请冻结订单-->
            <p
              class="text-info"
              v-show="item.appealer==='SELL'"
            >
              {{$t('M.otc_freeze')}}
            </p>
            <!--买家已付款，买家有异议申请冻结订单-->
            <p
              class="text-info"
              v-show="item.appealer==='BUY'"
            >
              {{$t('M.otc_freeze_info2')}}
            </p>
          </div>
          <!--中间2-->
          <div class="info-middle box-sizing">
            <!--2.1 卖家信息-->
            <div v-if="item.orderType === 'BUY'">
              <p class="text-info text-blue">
                {{$t('M.otc_stocks_seller')}}
              </p>
              <!--昵称-->
              <p class="text-info">
                <span>
                  {{$t('M.user_transaction_nickname')}}：
                  <span
                    class="cursor-pointer"
                    @click="jumpMerchantInfoPage(item.sellId)"
                  >
                    {{item.sellNickName}}
                  </span>
                </span>
              </p>
              <!--姓名-->
              <p class="text-info">
                <span>
                  {{$t('M.otc_name')}}：{{item.sellName}}
                </span>
              </p>
              <!--卖家手机号-->
              <p class="text-info">
                <span>
                  {{$t('M.otc_trading_sellphone')}}：{{item.sellPhone}}
                </span>
              </p>
            </div>
            <!--2.2 买家信息-->
            <div v-if="item.orderType === 'SELL'">
              <p class="text-info text-blue" >
                {{$t('M.otc_stocks_buyinfo')}}
              </p>
              <!--昵称-->
              <p class="text-info">
                <span>
                  {{$t('M.user_transaction_nickname')}}：
                  <span
                    class="cursor-pointer"
                    @click="jumpMerchantInfoPage(item.buyId)"
                  >
                    {{item.buyNickName}}
                  </span>
                </span>
              </p>
              <!--姓名-->
              <p class="text-info">
                <span>
                  {{$t('M.otc_name')}}：{{item.buyName}}
                </span>
              </p>
              <!--买家手机号-->
              <p class="text-info">
                <span>
                  {{$t('M.otc_trading_buyphone')}}：{{item.buyPhone}}
                </span>
              </p>
            </div>
          </div>
          <!--右侧3-->
          <div class="info-right box-sizing">
            <!-- 申诉冻结，等待处理 -->
            <p class="text-info text-blue">
              {{$t('M.otc_complaint_frezzing')}}
            </p>
            <!--冻结时间-->
            <p class="text-info">
              {{timeFormatting(item.freezeTime)}}
            </p>
          </div>
          <!--最右侧4-->
          <div class="info-reason box-sizing">
            <!-- 申诉原因 -->
            <p class="text-info text-blue">
              {{$t('M.otc_complaint_appeal_reason')}}
            </p>
            <p class="text-info">
              {{item.appealCause}}
            </p>
          </div>
        </div>
        <!-- otc 及时通讯-->
        <OTCIM
          class="otc-im"
          :orderInfo="item"
          :top="OTC_IM_TOP"
          activeName="FROZEN"
        />
      </div>
      <!--分页-->
      <el-pagination
        class="pages"
        background
        v-show="OTCFreezingOrderList.length && legalTradePageTotals - 1 > 0"
        layout="prev, pager, next"
        :current-page="legalTradePageNum"
        :page-count="legalTradePageTotals"
        @current-change="changeCurrentPage"
      >
      </el-pagination>
      <!--暂无数据-->
      <div
        class="no-data font-size12 text-align-c"
        v-if="!OTCFreezingOrderList.length"
      >
        {{$t('M.comm_no_data')}}
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {timeFilter} from '../../../utils'
import {changeCurrentPageForLegalTrader} from '../../../utils/commonFunc'
import OTCIM from '../../OTC/OTCIM'
import {
  mapMutations,
  mapState
} from 'vuex'
export default {
  components: {
    OTCIM
  },
  props: {
    OTC_IM_TOP: {
      type: String
    }
  },
  data () {
    return {
    }
  },
  created () {},
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'SET_LEGAL_TENDER_REFLASH_STATUS',
      'CHANGE_LEGAL_PAGE'
    ]),
    // 分页
    changeCurrentPage (e) {
      changeCurrentPageForLegalTrader(e, 'FROZEN', this)
    },
    // 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
    },
    jumpMerchantInfoPage (userId) {
      if (userId) {
        this.$goToPage(`/${this.$routes_X.OTCViewMerchantInfo}`, {userId: userId})
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      legalTraderForzenList: state => state.personal.legalTraderForzenList,
      legalTradePageTotals: state => state.personal.legalTradePageTotals,
      legalTradePageNum: state => state.personal.legalTradePageNum
    }),
    OTCFreezingOrderList () {
      return this.legalTraderForzenList
    }
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../../assets/CSS/index';

  .fiat-freezing-order-box {
    margin-top: -10px;

    > .freezing-order-content {
      position: relative;
      min-height: 584px;
      padding: 0 10px 35px;

      > .freezing-table-head {
        display: flex;
        height: 35px;
        margin-bottom: 12px !important;
        line-height: 35px;

        > .item {
          display: inline-block;
          width: 150px;
          text-align: center;
        }

        > .order-type,
        .order-coin,
        .AD-ID {
          width: 90px;
        }
      }

      > .freezing-table-body {
        position: relative;
        height: 170px;
        margin-bottom: 10px;
        border-radius: 6px;

        > .freezing-info-top {
          display: flex;
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
            width: 150px;
            text-align: center;
          }

          > .order-type,
          .order-coin,
          .AD-ID {
            width: 90px;
          }
        }

        > .freezing-info-bottom {
          display: flex;
          flex: 4;
          padding: 25px 30px 0;

          > .info-left {
            flex: 1;

            > .text-info {
              line-height: 20px;
            }
          }

          > .info-middle {
            flex: 1;
            margin-left: 30px;

            .text-info {
              line-height: 20px;
            }
          }

          > .info-right {
            flex: 1;
            margin-left: 30px;

            > .text-info {
              line-height: 20px;
            }
          }

          > .info-reason {
            flex: 1;
            margin-left: 30px;

            > .text-info {
              line-height: 20px;
            }
          }
        }

        .otc-im {
          position: absolute;
          top: 3px;
          right: 20px;
        }
      }

      > .no-data {
        height: 475px;
        line-height: 475px;
      }

      .pages {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
    }

    &.night {
      > .freezing-order-content {
        background-color: $mainContentNightBgColor;

        > .freezing-table-head {
          border-bottom: 1px solid $dialogColor6;
          color: #617499;
        }

        > .freezing-table-body {
          border: 1px solid $dialogColor6;

          > .freezing-info-top {
            color: #617499;
          }

          > .freezing-info-bottom {
            border-top: 1px solid #262f38;
            color: #9da5b3;

            > .info-left,
            .info-middle,
            .info-right,
            .info-reason {
              border-right: 1px solid #262f38;

              .text-blue {
                color: $mainColor;
              }
            }

            > .info-reason {
              border-right: 0;
            }
          }
        }

        > .no-data {
          background-color: $mainContentNightBgColor;
        }
      }
    }

    &.day {
      > .freezing-order-content {
        background-color: $mainColorOfWhite;

        > .freezing-table-head {
          border-bottom: 1px solid $borderColorOfDay;
          color: $fontColorSecondaryOfDay;
        }

        > .freezing-table-body {
          border: 1px solid $borderColorOfDay;

          > .freezing-info-bottom {
            border-top: 1px solid rgba(72, 87, 118, .1);

            > .info-left,
            .info-middle,
            .info-right,
            .info-reason {
              border-right: 1px solid rgba(72, 87, 118, .1);

              .text-blue {
                color: $mainColor;
              }
            }

            > .info-reason {
              border-right: 0;
            }
          }
        }

        > .no-data {
          color: $fontColorSecondaryOfDay;
          background-color: $mainColorOfWhite;
        }
      }
    }
  }
</style>
