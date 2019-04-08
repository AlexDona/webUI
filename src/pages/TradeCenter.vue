<!--币币交易-->
<template>
  <div
    class="trade-box trade"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="inner-box clearfloat">
      <!--左侧-->
      <div class="left">
        <!--全球行情-->
        <GlobalMarket class="margin-bottom10"/>
        <!--买卖单-->
        <BuysAndSells class="margin-bottom10"/>
        <!--最近成交-->
        <OrderRecord class="margin-bottom10"/>
      </div>
      <!--中间-->
      <div
        class="middle"
        :class="{'day':theme == 'day','night':theme == 'night' }"
      >
        <MiddleHeader/>
        <!--k线-->
        <KLine/>
        <!--市价交易、限价交易-->
        <ExchangeBox/>
        <!--交易-->
        <!-- 委单列表 -->
        <EntrustOrder/>
        <!--深度图-->
        <Depth/>
      </div>
      <!--右侧-->
      <div class="right">
        <!--<Activity/>-->
        <!--市场-->
        <TradeMarketList/>
      </div>
    </div>
  </div>
</template>
<script>
import EntrustOrder from '../components/Trade/EntrustOrderList'
import ExchangeBox from '../components/Trade/ExchangeTrade'
import TradeMarketList from '../components/Trade/TradeMarket'
import GlobalMarket from '../components/Trade/GlobalMarketTrade'
import BuysAndSells from '../components/Trade/BuysAndSellsTrade'
import OrderRecord from '../components/Trade/OrderRecordTrade'
import KLine from '../components/Trade/kLine'
import MiddleHeader from '../components/Trade/MiddleHeaderTrade'
import Depth from '../components/Trade/DepthTrade'
// import Activity from '../components/Trade/Activity'
import {mapState} from 'vuex'

export default {
  components: {
    EntrustOrder, // 委单列表
    ExchangeBox, // 交易区
    TradeMarketList, // 市场列表
    Depth, // 深度图
    MiddleHeader, // 中间header
    KLine, // k线
    OrderRecord, // 成交记录
    BuysAndSells, // 买卖单
    GlobalMarket
    // Activity
  },
  // props,
  data () {
    return {

    }
  },
  created () {
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {},
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme
    })
  },
  watch: {
    $route () {

    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../static/css/scss/index";
  @import "../../static/css/scss/Trade/TradeCenter";

  .trade-box {
    width: 100%;
    margin-top: 50px;

    > .inner-box {
      display: flex;
      box-sizing: border-box;
      width: 100%;
      padding: 14px;
      margin: 0 auto;

      > div {
        box-sizing: border-box;
        margin-right: 14px;

        &:last-of-type {
          margin-right: 0;
        }
      }

      > .left {
        width: 320px;
        max-width: 320px;
        font-size: 12px;
      }

      > .middle {
        flex: 1;
        box-sizing: border-box;
      }

      > .right {
        width: 320px;
      }

      @media screen and (max-width: 1366px) {
        > div {
          margin-right: 6px;
        }

        > .middle {
          width: 700px;
        }
      }
    }

    /deep/ {
      /* 币币交易通用修改样式（elementui修改） */
      .el-table {
        background-color: transparent;

        td,
        th,
        tr {
          background-color: transparent;
        }

        td {
          border-bottom: none;
        }

        th,
        .el-table__header-wrapper {
          padding: 0;
        }
      }

      .middle {
        .el-tabs__nav-wrap::after {
          top: 0;
          height: 34px;
        }

        .el-tabs__item {
          height: 34px;
          font-size: 14px;
          line-height: 34px;

          &.is-active {
            color: #338ff5 !important;
          }
        }

        .el-tabs__nav-scroll {
          padding-left: 14px;
        }

        .el-tabs__header {
          box-shadow: 0 2px 6px rgba(0, 0, 0, .1);
        }
      }

      .el-pagination {
        position: relative;
        bottom: 0;
        text-align: right;
      }

      .el-pagination button,
      .el-pager li {
        height: 16px;
        font-size: 12px;
        line-height: 16px;
      }

      .el-tabs__header {
        margin-bottom: 5px;
      }

      @media screen and (max-width: 1920px) {
        .el-table .cell {
          font-size: 12px;
        }
      }
    }

    &.night {
      > .inner-box {
        > .middle {
          background-color: $mainNightBgColor;

          /deep/ {
            .el-tabs__nav-wrap::after {
              background-color: #1c1f32;
            }

            .el-tabs__item {
              color: #fff;
            }
          }
        }
      }

      /deep/ {
        /* 币币交易通用night样式 */
        .el-table {
          color: #e4eaf4;

          th {
            > .cell {
              color: #a9bed4;
            }

            &.is-leaf {
              border-color: #39424d;
            }
          }
        }

        .el-table--enable-row-hover {
          .el-table__body {
            tr {
              &:hover {
                > td {
                  background-color: rgba(255, 255, 255, .2);
                }
              }
            }
          }
        }

        .title-box {
          border-bottom: 1px solid #39424d;
        }

        .el-table--scrollable-y {
          .el-table__body-wrapper::-webkit-scrollbar {
            width: 4px;
          }

          .el-table__body-wrapper::-webkit-scrollbar-track-piece {
            background-color: #2a343e;
          }

          .el-table__body-wrapper::-webkit-scrollbar-thumb {
            background-color: #4a5662;
          }

          .el-table__body-wrapper::-webkit-scrollbar-button {
            display: none;
            background-color: #fff;
          }
        }

        .el-tabs__header {
          box-shadow: 2px 0 3px rgba(27, 35, 49, 1);
        }
      }
    }

    &.day {
      > .inner-box {
        background-color: $dayInnerBoxBg;

        > .middle {
          /deep/ {
            .el-tabs__nav-wrap::after {
              background-color: #fff;
            }

            .el-tabs__item {
              color: #333;
            }
          }
        }
      }

      /deep/ {
        .el-table {
          th {
            > .cell {
              color: #333;
            }

            &.is-leaf {
              border-color: #d7d9db;
            }
          }
        }

        .el-tabs__header {
          box-shadow: 2px 0 3px rgba(239, 239, 239, 1);
        }

        .el-table--enable-row-hover {
          .el-table__body {
            tr {
              &:hover {
                > td {
                  background-color: #eaf2fa;
                }
              }
            }
          }
        }

        .title-box {
          border-bottom: 1px solid #d7d9db;
        }
      }
    }
  }

</style>
