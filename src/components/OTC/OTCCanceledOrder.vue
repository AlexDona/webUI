<template>
  <div
    class="otc-canceled-order-box otc"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div
      class="canceled-order-content"
    >
      <!--表头属性-->
      <div class="canceled-table-head">
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
        class="canceled-table-body"
        v-for="(item,index) in otcCanceledOrderList"
        :key="index"
      >
        <!--表格上部分-->
        <div class="canceled-info-top">
          <!-- 订单号 -->
          <span class="item">
            {{item.orderSequence}}
          </span>
          <!-- 类型 买入卖出 -->
          <span
            class="item"
            v-if="item.orderType === 'BUY'"
            :class="{ red: item.orderType === 'BUY' }"
          >
            <!-- 买入 -->
            {{$t('M.comm_buy')}}
          </span>
          <span
            class="item"
            v-if="item.orderType === 'SELL'"
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
        <div class="canceled-info-bottom">
          <!-- 左侧 -->
          <div class="info-left">
            <!-- 付款信息 -->
            <p class="text-info text-blue">{{$t('M.otc_index_js2')}}</p>
            <!-- 买家未付款的 买家超时未付款，系统自动取消-->
            <p
              class="text-info"
              v-show="item.appeal == 'NO'"
            >
              {{$t('M.otc_overtime')}}
            </p>
            <!-- 申诉判定，订单取消的 展示姓名，付款方式，银行卡号-->
            <!-- 姓名 -->
            <p
              class="text-info"
              v-show="item.appeal == 'YES'"
            >
              <!-- 姓名 ：展示的是卖家的名字-->
              <span>{{$t('M.otc_name')}}：</span>
              <span>{{item.sellName}}</span>
            </p>
            <!-- 付款方式 -->
            <p
              class="text-info"
              v-show="item.appeal == 'YES'"
            >
              <span>{{$t('M.otc_alipay_type')}}：</span>
              <!-- 判断付款方式 -->
              <span v-show="item.payType === 'Alipay'">
                {{$t('M.comm_alipay')}}
              </span>
              <span v-show="item.payType === 'Bankcard'">
                {{$t('M.comm_bank')}}
              </span>
              <span v-show="item.payType === 'WestUnion'">
                {{$t('M.comm_xilian')}}
              </span>
              <span v-show="item.payType === 'PAYPAL'">
                PAYPAL
              </span>
              <span v-show="item.payType === 'Wechat'">
                {{$t('M.comm_weixin')}}
              </span>
            </p>
            <!-- 付款账号 -->
            <p
              class="text-info"
              v-show="item.appeal == 'YES'"
            >
              <!-- 支付宝账号 -->
              <span v-show="item.payType === 'Alipay'">
                {{$t('M.user_account_alipay')}}{{$t('M.user_account_number')}}：
              </span>
              <!-- 银行卡账号 -->
              <span v-show="item.payType === 'Bankcard'">
                {{$t('M.otc_bank_num')}}：
              </span>
              <!-- 西联汇款账号 -->
              <span v-show="item.payType === 'WestUnion'">
                {{$t('M.user_account_western_union')}}{{$t('M.user_account_number')}}：
              </span>
              <!-- PAYPAL账号 -->
              <span v-show="item.payType === 'PAYPAL'">
                PAYPAL{{$t('M.user_account_number')}}：
              </span>
              <!-- 微信账号 -->
              <span v-show="item.payType === 'Wechat'">
                {{$t('M.user_account_weChat')}}{{$t('M.user_account_number')}}：
              </span>
              <span>{{item.payAcctount}}</span>
            </p>
          </div>
          <!-- 中间 -->
          <div class="info-middle">
            <p class="text-info text-blue">{{$t('M.otc_stocks_seller')}}</p>
            <p class="text-info">
              <span>{{$t('M.otc_name')}}：</span><span>{{item.sellName}}</span>
            </p>
            <p class="text-info">
              <span>{{$t('M.otc_trading_sellphone')}}：</span><span>{{item.sellPhone}}</span>
            </p>
          </div>
          <!-- 右边 -->
          <div class="info-right">
            <!-- 超时未支付，订单取消 -->
            <p
              class="text-info text-blue"
              v-if="item.appeal == 'NO'"
            >
              {{$t('M.otc_overBuy_cancel')}}
            </p>
            <!-- 申诉判定，订单取消 -->
            <p
              class="text-info text-blue"
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
                class="reason-content cursor-pointer"
                :title="item.handleSuggest"
              >
                {{$t('M.otc_order_reason')}}：{{item.handleSuggest}}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div
        class="no-data text-align-c"
        v-show="!otcCanceledOrderList.length"
      >
        <!-- 暂无数据 -->
        {{$t('M.comm_no_data')}}
      </div>
    </div>
    <!--分页-->
    <div class="page text-align-c">
      <el-pagination
        background
        v-show="otcCanceledOrderList.length"
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
import {mapState} from 'vuex'
import {getOTCOrdersThreeDay} from '../../utils/api/OTC'
import {
  // returnAjaxMsg,
  getNestedData
} from '../../utils/commonFunc'
export default {
  components: {},
  // props,
  data () {
    return {
      // 当前页显示几条数据
      pageSize: 5,
      // 当前页码
      currentPage: 1,
      // 总页数
      totalPages: 1,
      // OTC取消订单列表
      otcCanceledOrderList: []
    }
  },
  created () {
    // 1.0 请求已取消订单列表:只有登录了才调用
    if (this.isLogin) {
      this.getOTCCanceledOrdersList()
    }
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 1.0 分页
    changeCurrentPage (pageNum) {
      this.currentPage = pageNum
      this.getOTCCanceledOrdersList()
    },
    // 2.0 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
    },
    // 3.0 请求已取消订单列表
    async getOTCCanceledOrdersList () {
      const data = await getOTCOrdersThreeDay({
        status: 'CANCELED', // 状态 (已取消: CANCELED)
        pageNum: this.currentPage,
        pageSize: this.pageSize
      })
      // console.log('请求已取消订单列表')
      // console.log(data)
      // 返回数据正确的逻辑
      if (!data) return false
      if (data.data) {
        let canceledOrderData = getNestedData(data, 'data')
        this.otcCanceledOrderList = getNestedData(canceledOrderData, 'list')
        // 分页
        this.totalPages = getNestedData(canceledOrderData, 'pages') - 0
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
  @import "../../assets/CSS/index";

  .otc-canceled-order-box {
    > .canceled-order-content {
      > .canceled-table-head {
        box-sizing: border-box;
        width: 1189px;
        height: 35px;
        margin: 2px 2px 15px;
        border-radius: 5px;
        line-height: 35px;

        > .item {
          display: inline-block;
          width: 160px;
          text-align: center;
        }
      }

      > .canceled-table-body {
        box-sizing: border-box;
        width: 1189px;
        height: 170px;
        margin: 2px 2px 15px;
        border-radius: 5px;

        > .canceled-info-top {
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
            display: inline-block;
            width: 160px;
            text-align: center;
          }
        }

        > .canceled-info-bottom {
          display: flex;
          flex: 7;
          box-sizing: border-box;
          padding: 25px 30px 0;
          font-size: 12px;

          > .info-left {
            flex: 2;
            box-sizing: border-box;

            > .text-info {
              line-height: 22px;
            }
          }

          > .info-middle {
            flex: 2;
            box-sizing: border-box;
            margin-left: 30px;

            > .text-info {
              line-height: 22px;
            }
          }

          > .info-right {
            flex: 3;
            box-sizing: border-box;
            margin-left: 30px;

            > .text-info {
              line-height: 22px;

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
      }

      > .no-data {
        width: 1189px;
        height: 432px;
        margin: 2px 2px 15px;
        line-height: 432px;
      }
    }

    &.night {
      > .canceled-order-content {
        > .canceled-table-head {
          border: 1px solid #485776;
          color: #a9bed4;
          background-color: $mainContentNightBgColor;
          box-shadow: -2px 3px 5px 1px #191e28;
        }

        > .canceled-table-body {
          border: 1px solid #485776;
          background-color: $mainContentNightBgColor;

          > .canceled-info-top {
            color: #9da5b3;
            background-color: $mainContentNightBgColor;
          }

          > .canceled-info-bottom {
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
      > .canceled-order-content {
        > .canceled-table-head {
          color: $fontColorSecondaryOfDay;
          background-color: $mainDayBgColor;
          box-shadow: 0 0 6px $boxShadowColorOfDay;
        }

        > .canceled-table-body {
          background-color: $mainDayBgColor;
          box-shadow: 0 0 6px $boxShadowColorOfDay;

          > .canceled-info-top {
            color: $dayMainTitleColor;
            background-color: $mainDayBgColor;
          }

          > .canceled-info-bottom {
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
              > .text-blue {
                color: $mainColor;
              }

              > .cancel-time {
                color: $dayMainTitleColor;
              }
            }
          }
        }

        > .no-data {
          color: $dayMainTitleColor;
          background-color: $mainDayBgColor;
          box-shadow: 0 0 6px $boxShadowColorOfDay;
        }
      }
    }
  }
</style>
