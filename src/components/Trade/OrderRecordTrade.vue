<template>
  <!--最近成交记录-->
    <div
      class="order-record-box trade"
      :class="{'day':theme == 'day','night':theme == 'night' }"
    >
      <div class="inner-box">
        <div
          class="title font-size16 cursor-pointer"
          @click="toggleShowContent"
        >
        <span class="text">
          <!--最近成交-->
          {{ $t('M.trade_order_recent_deal') }}
        </span>
        </div>
        <div class="content">
          <el-collapse-transition>
            <div v-show="contentShowStatus">
              <el-table
                :data="orderRecordList"
                :empty-text="$t('M.comm_no_data')"
                :height="screenWidth > 1920 ? '800': '574'"
              >
                <!--时间-->
                <el-table-column
                  :label="$t('M.comm_time')"
                >
                  <template slot-scope="s">
                  <span class="font-size12">
                    {{timeFilters(s.row.time-0)}}
                  </span>
                  </template>
                </el-table-column>
                <!--成交价-->
                <el-table-column
                  :label="$t('M.otc_MerchantsOrders_transaction_price') + ('('+ activeSymbol.area +')')"
                >
                  <template slot-scope="s">
                    <span
                      class="text-align-r font-size12"
                      :class="{
                        buy:s.row.direction==='BUY',
                        sell:s.row.direction==='SELL'}"
                    >
                      {{$scientificToNumber(s.row.price)}}
                    </span>
                  </template>
                </el-table-column>
                <!--成交量-->
                <el-table-column
                  :label="$t('M.comm_trading_volume1') +('('+activeSymbol.sellsymbol+')')"
                >
                  <template slot-scope="s">
                    <span class="text-align-r font-size12">
                      {{$scientificToNumber(s.row.amount)}}
                    </span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-collapse-transition>
        </div>
      </div>
    </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {timeFilter} from '../../utils'
import {mapState} from 'vuex'
export default {
  components: {},
  // props,
  data () {
    return {
      reflashCount: 0,
      contentShowStatus: true
    }
  },
  created () {
    // console.log(this.screenWidth)
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 时间格式化
    timeFilters (date) {
      return timeFilter(date, 'time')
    },
    // 切换内容显示隐藏
    toggleShowContent () {
      this.contentShowStatus = !this.contentShowStatus
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      orderRecordListByAjax: state => state.common.klineAjaxData.tardeRecordList,
      orderRecordListBySocket: state => state.common.socketData.tardeRecordList,
      clientWidth: state => state.common.clientWidth,
      activeSymbol: state => state.common.activeSymbol
    }),
    orderRecordList () {
      return (this.reflashCount < 1) ? this.orderRecordListByAjax : this.orderRecordListBySocket
    },
    screenWidth () {
      return this.clientWidth
    }
  },
  watch: {
    activeSymbol () {
      this.reflashCount = 0
    },
    orderRecordListBySocket (newVal) {
      if (newVal) {
        // console.log(this.reflashCount)
        // console.log(newVal)
        this.reflashCount++
      }
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../../static/css/scss/index.scss';

  .order-record-box {
    > .inner-box {
      > .title {
        height: 34px;
        padding: 0 4.5%;

        /* font-weight: 700; */
        margin-bottom: 1px;
        line-height: 34px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, .1);

        > .text {
          display: inline-block;
          height: 100%;
          border-bottom: 2px solid $mainColor;
          font-size: 14px;
          color: $mainColor;
        }
      }
    }

    /deep/ {
      .el-table {
        td {
          padding: 0;
        }

        th {
          height: 26px;
          border-bottom: 1px solid rgba(50, 55, 87, 1);
          font-size: 12px;
          line-height: 24px;

          &:nth-of-type(2) {
            > .cell {
              text-align: center;
            }

            @media screen and (max-width: 1366px) {
              > .cell {
                padding: 0;
              }
            }
          }

          &:nth-of-type(1) {
            .cell {
              padding: 0 0 0 10%;
            }
          }

          &:nth-of-type(3) {
            .cell {
              padding: 0 10% 0 0;
              text-align: right;
            }

            @media screen and (max-width: 1366px) {
              .cell {
                padding: 0 5% 0 0;
              }
            }
          }
        }

        .cell {
          height: 22px;
          white-space: nowrap;
        }
      }

      td {
        &:nth-of-type(2),
        &:nth-of-type(3) {
          > .cell {
            text-align: right;
          }
        }
      }

      .el-table__header-wrapper {
        height: 26px;
        line-height: 24px;
      }

      .el-table__row {
        td {
          &:nth-of-type(2) {
            > .cell {
              padding: 0 15% 0 0;
            }
          }

          &:nth-of-type(1) {
            > .cell {
              padding: 0 0 0 10%;
            }
          }
        }
      }

      .cell {
        > span {
          &.buy {
            color: rgb(212, 88, 88);
          }

          &.sell {
            color: rgb(0, 128, 105);
          }
        }
      }
    }

    &.night {
      > .inner-box {
        > .title {
          color: $mainNightTitleColor;
          background-color: $mainContentNightBgColor;
          box-shadow: 2px 0 3px rgba(27, 35, 49, 1);
        }

        > .content {
          background-color: $mainContentNightBgColor;
        }
      }
    }

    &.day {
      > .inner-box {
        > .title {
          color: $dayMainTitleColor;
          background-color: $mainDayBgColor;
          box-shadow: 2px 0 3px rgba(239, 239, 239, 1);
        }

        > .content {
          background-color: $mainDayBgColor;
        }
      }
    }
  }
</style>
