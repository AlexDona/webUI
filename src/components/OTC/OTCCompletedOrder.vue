<template>
  <div
    class="otc-completed-order-box otc"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="completed-order-content">
      <!-- 表格 -->
      <div class="tables">
        <el-table
          :data="completedOrdersList"
          :default-expand-all="true"
          :empty-text="$t('M.comm_no_data')"
          v-loading="loading"
          element-loading-background="rgba(0, 0, 0, 0.6)"
        >
          <div>
            <el-table-column type="expand">
              <template slot-scope="s">
                <div class="completed-info">
                  <!-- 左侧 -->
                  <div class="completed-info-left">
                    <!-- 付款信息 -->
                    <p class="order-info-left">
                      <span class="pay-info">
                        {{$t('M.otc_index_js2')}}
                      </span>
                    </p>
                    <!-- 姓名 -->
                    <p class="order-info-left">
                      <!-- 姓名 ：展示的是卖家的名字-->
                      <span>{{$t('M.otc_name')}}：</span>
                      <span>{{s.row.sellName}}</span>
                    </p>
                    <!-- 付款方式 -->
                    <p class="order-info-left">
                      <span>{{$t('M.otc_alipay_type')}}：</span>
                      <!-- 判断付款方式 -->
                      <span v-show="s.row.payType === 'Alipay'">
                        {{$t('M.comm_alipay')}}
                      </span>
                      <span v-show="s.row.payType === 'Bankcard'">
                        {{$t('M.comm_bank')}}
                      </span>
                      <span v-show="s.row.payType === 'WestUnion'">
                        {{$t('M.comm_xilian')}}
                      </span>
                      <span v-show="s.row.payType === 'PAYPAL'">
                        PAYPAL
                      </span>
                      <span v-show="s.row.payType === 'Wechat'">
                        {{$t('M.comm_weixin')}}
                      </span>
                    </p>
                    <!-- 付款账号 -->
                    <p class="order-info-left">
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
                      <span>{{s.row.payAcctount}}</span>
                    </p>
                  </div>
                  <!-- 中间 -->
                  <div class="completed-info-middle">
                    <p class="order-info-middle">
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
                      <span class="confirm-time">
                        {{$t('M.otc_tradeOver_complate')}}
                      </span>
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
                  </div>
                </div>
              </template>
            </el-table-column>
          </div>
          <!-- 订单号 -->
          <el-table-column
            :label="$t('M.otc_MerchantsOrders_orderNum')"
          >
            <template slot-scope="s">
              {{s.row.orderSequence}}
            </template>
          </el-table-column>
          <!-- 类型 -->
          <el-table-column
            :label="$t('M.otc_cancelOrder_type')"
            width="118"
          >
            <template slot-scope="s">
              <span
                v-if="s.row.orderType === 'BUY'"
                :class="{ red: s.row.orderType === 'BUY' }"
              >
                <!-- 买入 -->
                {{$t('M.comm_buy')}}
              </span>
              <span
                v-if="s.row.orderType === 'SELL'"
                :class="{ green: s.row.orderType === 'SELL' }"
              >
                <!-- 卖出 -->
                {{$t('M.comm_sell')}}
              </span>
            </template>
          </el-table-column>
          <!-- 币种 -->
          <el-table-column
            :label="$t('M.comm_currency')"
            width="118"
          >
            <template slot-scope="s">
              {{ s.row.coinName }}
            </template>
          </el-table-column>
          <!-- 价格 -->
          <el-table-column
            :label="$t('M.otc_index_price')"
            width="118"
          >
            <template slot-scope="s">
              {{ s.row.price }}({{ s.row.currencyName }})
            </template>
          </el-table-column>
          <!-- 数量 -->
          <el-table-column
            :label="$t('M.comm_count')"
          >
            <template slot-scope="s">
              {{ s.row.pickCount }}({{ s.row.coinName }})
            </template>
          </el-table-column>
          <!-- 总金额 -->
          <el-table-column
            :label="$t('M.otc_canceled_total')"
          >
            <template slot-scope="s">
              {{ (s.row.price * s.row.pickCount).toFixed(2)}}({{ s.row.currencyName }})
            </template>
          </el-table-column>
          <!-- 下单时间 -->
          <el-table-column
            :label="$t('M.otc_stocks_ordertime')"
          >
            <template slot-scope="s">
              {{timeFormatting(s.row.createTime)}}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--分页-->
      <div class="page">
        <el-pagination
          background
          v-show="completedOrdersList.length"
          layout="prev, pager, next"
          :page-count="totalPages"
          @current-change="changeCurrentPage"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {timeFilter} from '../../utils'
import {getOTCCompletedOrders} from '../../utils/api/OTC'
import {returnAjaxMsg} from '../../utils/commonFunc'
import {mapState} from 'vuex'
export default {
  components: {},
  data () {
    return {
      loading: true, // loading
      // 分页
      pageSize: 5, // 每页展示的条数
      currentPage: 1, // 当前页码
      totalPages: 1, // 总页数
      completedOrdersList: [] // 完成订单列表
    }
  },
  created () {
    require('../../../static/css/list/OTC/OTCCompletedOrder.css')
    require('../../../static/css/theme/day/OTC/OTCCompletedOrderDay.css')
    require('../../../static/css/theme/night/OTC/OTCCompletedOrderNight.css')
    // 1.0 请求已完成订单列表:只有登录了才调用
    if (this.isLogin) {
      this.getOTCCompletedOrdersList()
    }
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 0.0 分页改变事件
    changeCurrentPage (pageNum) {
      this.currentPage = pageNum
      this.getOTCCompletedOrdersList()
    },
    // 1.0 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
    },
    // 2.0 请求已完成订单列表
    async getOTCCompletedOrdersList () {
      this.loading = true
      const data = await getOTCCompletedOrders({
        status: 'COMPLETED', // 状态 (交易中 TRADING 已完成 COMPLETED  已取消  CANCELED 冻结中 FROZEN)
        pageNum: this.currentPage,
        pageSize: this.pageSize
      })
      // console.log('已完成订单')
      // console.log(data)
      // 提示信息
      if (!(returnAjaxMsg(data, this, 0))) {
        this.loading = false
        return false
      } else {
        // 返回数据正确的逻辑
        this.loading = false
        let completedOrdersListData = data.data.data
        this.completedOrdersList = completedOrdersListData.list
        // 分页
        this.totalPages = completedOrdersListData.pages - 0
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
.otc-completed-order-box{
  >.completed-order-content{
    min-height: 500px;
    .red{
      // color: #D45858;
    }
    .green{
      // color: #008069;
    }
    .page{
      text-align: center;
      padding: 10px 0;
    }
    .completed-info{
      display: flex;
      flex: 7;
      // color: #9DA5B3;
      >.completed-info-left{
        flex: 2;
        // border-right: 1px solid #262F38;
        >.order-info-left{
          line-height: 20px;
          >.pay-info{
            // color: #5E95EC;
          }
        }
      }
      >.completed-info-middle{
        flex: 2;
        // border-right: 1px solid #262F38;
        >.order-info-middle{
          margin-left: 50px;
          line-height: 20px;
          >.buyer-seller-info{
            // color: #5E95EC;
          }
        }
      }
      >.completed-info-right{
        flex: 3;
        >.order-info-right{
          margin-left: 50px;
          line-height: 20px;
          >.confirm-time{
            // color: #5E95EC;
          }
        }
      }
    }
  }
  &.night{
    >.completed-order-content{
      .red{
        color: #D45858;
      }
      .green{
        color: #008069;
      }
      .page{
      }
      .completed-info{
        color: #9DA5B3;
        >.completed-info-left{
          border-right: 1px solid #262F38;
          >.order-info-left{
            >.pay-info{
              color: #5E95EC;
            }
          }
        }
        >.completed-info-middle{
          border-right: 1px solid #262F38;
          >.order-info-middle{
            >.buyer-seller-info{
              color: #5E95EC;
            }
          }
        }
        >.completed-info-right{
          >.order-info-right{
            >.confirm-time{
              color: #5E95EC;
            }
          }
        }
      }
    }
  }
  &.day{
    >.completed-order-content{
      .red{
        color: #D45858;
      }
      .green{
        color: #008069;
      }
      .page{
      }
      .completed-info{
        // color: #9DA5B3;
        color: #7D90AC;
        >.completed-info-left{
          border-right: 1px solid rgba(38,47,56,0.1);
          >.order-info-left{
            >.pay-info{
              color: #5E95EC;
            }
          }
        }
        >.completed-info-middle{
        border-right: 1px solid rgba(38,47,56,0.1);
          >.order-info-middle{
            >.buyer-seller-info{
              color: #5E95EC;
            }
          }
        }
        >.completed-info-right{
          >.order-info-right{
            >.confirm-time{
              color: #5E95EC;
            }
          }
        }
      }
    }
  }
}
</style>
