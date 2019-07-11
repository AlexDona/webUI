<template>
  <div
    class="otc-freezing-order-box otc"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div
      class="freezing-order-content"
    >
      <!--表头属性-->
      <div class="freezing-table-head">
        <span class="item AD-ID">
          <!--广告id-->
          {{$t('M.otc_AD_ID')}}
        </span>
        <!-- 订单号 -->
        <span class="item">
          {{$t('M.otc_MerchantsOrders_orderNum')}}
        </span>
        <!-- 类型 -->
        <span class="item">
          {{$t('M.otc_cancelOrder_type')}}
        </span>
        <!-- 币种 -->
        <span class="item">
          {{$t('M.comm_currency')}}
        </span>
        <!-- 价格 -->
        <span class="item">
          {{$t('M.otc_index_price')}}
        </span>
        <!-- 数量 -->
        <span class="item">
          {{$t('M.comm_count')}}
        </span>
        <!-- 总金额 -->
        <span class="item">
          {{$t('M.otc_canceled_total')}}
        </span>
        <!-- 下单时间 -->
        <span class="item">
          {{$t('M.otc_stocks_ordertime')}}
        </span>
      </div>
      <!--表格-->
      <div
        class="freezing-table-body"
        v-for="(item,index) in otcFreezingOrderList"
        :key="index"
      >
        <!--表格上部分-->
        <div class="freezing-info-top">
          <!-- 广告id -->
          <span class="item AD-ID">
            {{item.entrustSequence}}
          </span>
          <!-- 订单号 -->
          <span class="item">
            {{item.orderSequence}}
          </span>
          <!-- 类型 买入 -->
          <span
            class="item"
            v-show="item.orderType === 'BUY'"
            :class="{ red: item.orderType === 'BUY' }"
          >
            <!-- 买入 -->
            {{$t('M.comm_buy')}}
          </span>
          <!-- 类型卖出 -->
          <span
            class="item"
            v-show="item.orderType === 'SELL'"
            :class="{ green: item.orderType === 'SELL' }"
          >
            <!-- 卖出 -->
            {{$t('M.comm_sell')}}
          </span>
          <!-- 币种 -->
          <span class="item">
            {{item.coinName}}
          </span>
          <!-- 价格 -->
          <span class="item">
            {{$scientificToNumber(item.price)}}({{item.currencyName}})
          </span>
          <!-- 数量 -->
          <span class="item">
            {{$scientificToNumber(item.pickCount)}}({{item.coinName}})
          </span>
          <!-- 总金额 -->
          <span class="item">
            {{$scientificToNumber(item.payAmount)}}({{item.currencyName}})
          </span>
          <!-- 下单时间 -->
          <span class="item">
            {{timeFormatting(item.createTime)}}
          </span>
        </div>
        <!--表格下部分-->
        <div class="freezing-info-bottom">
          <div class="info-left">
            <!-- 付款信息 -->
            <p class="text-info text-blue">{{$t('M.otc_index_js2')}}</p>
            <!-- 买家已付款，卖家有异议申请冻结订单 -->
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
          <div class="info-middle">
            <!-- 卖家信息 -->
            <p class="text-info text-blue">
              {{$t('M.otc_stocks_seller')}}
            </p>
            <p class="text-info">
              <!-- 姓名 -->
              <span>{{$t('M.otc_name')}}：</span><span>{{item.sellName}}</span>
            </p>
            <p class="text-info">
              <!-- 卖家手机号 -->
              <span>{{$t('M.otc_trading_sellphone')}}：</span>
              <span>{{item.sellPhone}}</span>
            </p>
          </div>
          <div class="info-right">
            <!-- 申诉冻结，等待处理 -->
            <p class="text-info text-blue">
              {{$t('M.otc_complaint_frezzing')}}
            </p>
            <!--冻结时间-->
            <p class="text-info">
              {{timeFormatting(item.freezeTime)}}
            </p>
          </div>
          <div class="info-reason">
            <!-- 申诉原因 -->
            <p class="text-info text-blue">
              {{$t('M.otc_complaint_appeal_reason')}}
            </p>
            <p class="text-info">
              {{item.appealCause}}
            </p>
          </div>
        </div>
      </div>
      <!--暂无数据-->
      <div
        class="no-data text-align-c"
        v-if="!otcFreezingOrderList.length"
      >
        <!-- 暂无数据 -->
        {{$t('M.comm_no_data')}}
      </div>
    </div>
    <!--分页-->
    <div class="page text-align-c">
      <el-pagination
        background
        v-show="otcFreezingOrderList.length"
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
import {timeFilter} from '../../utils'
import {getOTCOrdersThreeDay} from '../../utils/api/OTC'
import {
  getNestedData
} from '../../utils/commonFunc'
import {mapState} from 'vuex'
export default {
  // components: {},
  // props,
  data () {
    return {
      // 每页展示的条数
      pageSize: 5,
      // 当前页码
      currentPage: 1,
      // 总页数
      totalPages: 1,
      // OTC冻结订单列表
      otcFreezingOrderList: []
    }
  },
  created () {
    // 1.0 请求冻结中订单列表:只有登录了才调用
    if (this.isLogin) {
      this.getOTCFreezingOrdersList()
    }
  },
  // mounted () {},
  // activated () {},
  // update () {},
  // beforeRouteUpdate () {},
  methods: {
    // 1.0 分页
    changeCurrentPage (pageNum) {
      this.currentPage = pageNum
      this.getOTCFreezingOrdersList()
    },
    // 2.0 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
    },
    // 3.0 请求冻结中订单列表
    async getOTCFreezingOrdersList () {
      const data = await getOTCOrdersThreeDay({
        status: 'FROZEN', // 状态 (交易中 TRADING 已完成 COMPLETED  已取消  CANCELED 冻结中 FROZEN)
        pageNum: this.currentPage,
        pageSize: this.pageSize
      })
      // console.log('冻结中订单')
      // console.log(data)
      // 返回数据正确的逻辑
      if (!data) return false
      if (data.data) {
        let otcFreezingOrderListData = getNestedData(data, 'data')
        this.otcFreezingOrderList = getNestedData(otcFreezingOrderListData, 'list')
        // 分页
        this.totalPages = getNestedData(otcFreezingOrderListData, 'pages') - 0
      }
    }
  },
  // filter: {},
  computed: {
    ...mapState({
      // 主题
      theme: state => state.common.theme,
      // 是否登录
      isLogin: state => state.user.isLogin
    })
  }
  // watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../assets/CSS/index";

  .otc-freezing-order-box {
    > .freezing-order-content {
      > .freezing-table-head {
        display: flex;
        box-sizing: border-box;
        width: 1191px;
        height: 35px;
        margin: 2px 2px 15px;
        border-radius: 5px;
        line-height: 35px;

        > .item {
          flex: 1;
          text-align: center;
        }
      }

      > .freezing-table-body {
        box-sizing: border-box;
        width: 1191px;
        height: 170px;
        margin: 2px 2px 15px;
        border-radius: 5px;

        > .freezing-info-top {
          display: flex;
          height: 40px;
          border-radius: 5px;
          line-height: 40px;

          .red {
            color: $upColor;
          }

          .green {
            color: $otcGreen;
          }

          > .item {
            flex: 1;
            text-align: center;
          }
        }

        > .freezing-info-bottom {
          display: flex;
          flex: 4;
          box-sizing: border-box;
          padding: 30px 30px 0;
          font-size: 12px;

          > .info-left {
            flex: 1;
            box-sizing: border-box;

            > .text-info {
              line-height: 22px;
            }
          }

          > .info-middle {
            flex: 1;
            box-sizing: border-box;
            margin-left: 30px;

            > .text-info {
              line-height: 22px;
            }
          }

          > .info-right {
            flex: 1;
            box-sizing: border-box;
            margin-left: 30px;

            > .text-info {
              line-height: 22px;
            }
          }

          > .info-reason {
            flex: 1;
            box-sizing: border-box;
            margin-left: 30px;

            > .text-info {
              line-height: 22px;
            }
          }
        }
      }

      > .no-data {
        width: 1189px;
        height: 432px;
        margin: 2px 2px 15px;
        border-radius: 4px;
        line-height: 432px;
      }
    }

    &.night {
      > .freezing-order-content {
        > .freezing-table-head {
          border: 1px solid #485776;
          color: #a9bed4;
          background-color: $mainContentNightBgColor;
          box-shadow: -2px 3px 5px 1px #191e28;
        }

        > .freezing-table-body {
          border: 1px solid #485776;
          background-color: $mainContentNightBgColor;

          > .freezing-info-top {
            color: #9da5b3;
          }

          > .freezing-info-bottom {
            border-top: 1px solid #262f38;
            color: #9da5b3;

            > .info-left {
              border-right: 1px solid #262f38;

              > .text-blue {
                color: $mainColor;
              }
            }

            > .info-middle {
              border-right: 1px solid #262f38;

              > .text-blue {
                color: $mainColor;
              }
            }

            > .info-right {
              border-right: 1px solid #262f38;

              > .text-blue {
                color: $mainColor;
              }
            }

            > .info-reason {
              > .text-blue {
                color: $mainColor;
              }
            }
          }
        }

        > .no-data {
          color: rgba(255, 255, 255, .8);
          background-color: $mainContentNightBgColor;
        }
      }
    }

    &.day {
      > .freezing-order-content {
        > .freezing-table-head {
          color: $fontColorSecondaryOfDay;
          background-color: $mainDayBgColor;
          box-shadow: 0 0 6px $boxShadowColorOfDay;
        }

        > .freezing-table-body {
          background-color: $mainDayBgColor;
          box-shadow: 0 0 6px $boxShadowColorOfDay;

          > .freezing-info-top {
            color: $dayMainTitleColor;
          }

          > .freezing-info-bottom {
            border-top: 1px solid rgba(38, 47, 56, .1);
            color: $dayMainTitleColor;

            > .info-left {
              border-right: 1px solid rgba(38, 47, 56, .1);

              > .text-blue {
                color: $mainColor;
              }
            }

            > .info-middle {
              border-right: 1px solid rgba(38, 47, 56, .1);

              > .text-blue {
                color: $mainColor;
              }
            }

            > .info-right {
              border-right: 1px solid rgba(38, 47, 56, .1);

              > .text-blue {
                color: $mainColor;
              }
            }

            > .info-reason {
              > .text-blue {
                color: $mainColor;
              }
            }
          }
        }

        > .no-data {
          color: $dayMainTitleColor;
          background-color: $mainColorOfWhite;
          box-shadow: 0 0 6px $boxShadowColorOfDay;
        }
      }
    }
  }
</style>
