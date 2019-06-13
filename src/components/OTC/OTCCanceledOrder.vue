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
        class="no-data"
        v-show="!otcCanceledOrderList.length"
      >
        <!-- 暂无数据 -->
        {{$t('M.comm_no_data')}}
      </div>
    </div>
    <!--分页-->
    <div class="page">
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
      // 分页
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
        status: 'CANCELED', // 状态 (交易中 TRADING 已完成 COMPLETED  已取消  CANCELED 冻结中 FROZEN)
        pageNum: this.currentPage,
        pageSize: this.pageSize
      })
      console.log('请求已取消订单列表')
      console.log(data)
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
  @import "../../../static/css/scss/OTC/OTCCenter.scss";
  @import "../../../static/css/scss/index.scss";

  .otc-canceled-order-box {
    > .canceled-order-content {
      > .canceled-table-head {
        box-sizing: border-box;
        width: 1043px;
        height: 35px;
        margin-bottom: 15px;
        border-radius: 5px;
        line-height: 35px;

        > .item {
          display: inline-block;
          width: 140px;
          text-align: center;
        }
      }

      > .canceled-table-body {
        box-sizing: border-box;
        width: 1043px;
        height: 170px;
        margin-bottom: 15px;
        border-radius: 5px;

        > .canceled-info-top {
          height: 40px;
          border-radius: 5px;
          line-height: 40px;

          > .item {
            display: inline-block;
            width: 140px;
            text-align: center;
          }
        }

        > .canceled-info-bottom {
          display: flex;
          flex: 7;
          box-sizing: border-box;
          padding: 15px 30px 0;

          > .info-left {
            flex: 2;
            box-sizing: border-box;

            > .text-info {
              line-height: 20px;
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

      > .no-data {
        width: 1043px;
        height: 432px;
        line-height: 432px;
        text-align: center;
      }
    }

    > .page {
      text-align: center;
    }

    &.night {
      > .canceled-order-content {
        > .canceled-table-head {
          border: 1px solid #485776;
          color: #a9bed4;
          background-color: #1c1f32;
          box-shadow: -2px 3px 5px 1px #191e28;
        }

        > .canceled-table-body {
          border: 1px solid #485776;
          background-color: #1c1f32;

          > .canceled-info-top {
            color: #9da5b3;
            background-color: #1c1f32;

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
          color: rgba(255, 255, 255, .8);
          background-color: $mainContentNightBgColor;
        }
      }
    }

    &.day {
      > .canceled-order-content {
        > .canceled-table-head {
          border: 1px solid #ecf1f8;
          color: #617499;
          background-color: $mainDayColor;
        }

        > .canceled-table-body {
          border: 1px solid #ecf1f8;
          background-color: $mainDayColor;

          > .canceled-info-top {
            color: #333;
            background-color: $mainDayColor;

            .red {
              color: #d45858;
            }

            .green {
              color: #008069;
            }
          }

          > .canceled-info-bottom {
            border-top: 1px solid rgba(38, 47, 56, .1);
            color: #7d90ac;

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

              > .cancel-time {
                color: #333;
              }
            }
          }
        }

        > .no-data {
          border: 1px solid rgba(97, 116, 153, .1);
          color: #333;
          background-color: $mainDayColor;
        }
      }
    }
  }
</style>
