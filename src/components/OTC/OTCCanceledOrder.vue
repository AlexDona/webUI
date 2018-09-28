<template>
  <div
    class="otc-canceled-order-box otc"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="canceled-order-content">
      <!--表头属性-->
      <div class="canceled-table-head">
        <span class="item">{{$t('M.otc_MerchantsOrders_orderNum')}}</span>
        <span class="item">{{$t('M.otc_cancelOrder_type')}}</span>
        <span class="item">{{$t('M.comm_currency')}}</span>
        <span class="item">{{$t('M.otc_index_price')}}</span>
        <span class="item">{{$t('M.comm_count')}}</span>
        <span class="item">{{$t('M.otc_canceled_total')}}</span>
        <span class="item">{{$t('M.otc_stocks_ordertime')}}</span>
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
          <span class="item">{{item.orderSequence}}</span>
          <!-- 类型 买入 -->
          <span
            class="item"
            v-if="item.orderType === 'BUY'"
            :class="{ red: item.orderType === 'BUY' }"
          >
          <!-- 买入 -->
           {{$t('M.comm_buy')}}
          </span>
          <!-- 类型卖出 -->
          <span
            class="item"
            v-if="item.orderType === 'SELL'"
            :class="{ green: item.orderType === 'SELL' }"
          >
           {{$t('M.comm_sell')}}
          </span>
          <!-- 币种 -->
          <span class="item">{{item.coinName}}</span>
          <!-- 价格 -->
          <span class="item">{{item.price}}({{ item.currencyName }})</span>
          <!-- 数量 -->
          <span class="item">{{item.pickCount}}({{ item.coinName }})</span>
          <!-- 总金额 -->
          <span class="item">{{(item.price*item.pickCount).toFixed(2)}}({{ item.currencyName }})</span>
          <!-- 下单时间 -->
          <span class="item">{{timeFormatting(item.createTime)}}</span>
        </div>
        <!--表格下部分-->
        <div class="canceled-info-bottom">
          <div class="info-left">
            <p class="text-info text-blue">{{$t('M.otc_index_js2')}}</p>
            <p class="text-info">{{$t('M.otc_overtime')}}</p>
          </div>
          <div class="info-middle">
            <p class="text-info text-blue">{{$t('M.otc_stocks_seller')}}</p>
            <p class="text-info">
              <span>{{$t('M.otc_name')}}：</span><span>{{item.sellName}}</span>
            </p>
            <p class="text-info">
              <span>{{$t('M.otc_trading_sellphone')}}：</span><span>{{item.sellPhone}}</span>
            </p>
          </div>
          <div class="info-right">
            <!-- <p class="text-info text-blue">超时未支付，订单取消</p> -->
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
            <!-- <p class="text-info cancel-time">{{timeFormatting(item.cancelTime)}}</p> -->
            <!-- <p class="text-info cancel-time">状态</p> -->
          </div>
        </div>
      </div>
      <div
        class="no-data"
        v-if="!otcCanceledOrderList.length"
      >
        <!-- 暂无数据 -->
        {{$t('M.comm_no_data')}}
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
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {timeFilter} from '../../utils'
import {mapState} from 'vuex'
import {getOTCCanceledOrders} from '../../utils/api/OTC'
import {returnAjaxMessage} from '../../utils/commonFunc'
export default {
  components: {},
  // props,
  data () {
    return {
      // 分页
      pageSize: 5,
      currentPage: 1, // 当前页码
      totalPages: 1, // 总页数
      // OTC取消订单列表
      otcCanceledOrderList: []
    }
  },
  created () {
    require('../../../static/css/list/OTC/OTCCanceledOrder.css')
    require('../../../static/css/theme/day/OTC/OTCCanceledOrderDay.css')
    require('../../../static/css/theme/night/OTC/OTCCanceledOrderNight.css')
    // 1.0 请求已取消订单列表:只有登录了才调用
    if (this.isLogin) {
      this.getOTCCanceledOrdersList()
    }
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 分页
    changeCurrentPage (pageNum) {
      console.log(pageNum)
      this.currentPage = pageNum
      this.getOTCCanceledOrdersList()
    },
    // 1.0 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
    },
    // 2.0 请求已取消订单列表
    async getOTCCanceledOrdersList () {
      const data = await getOTCCanceledOrders({
        status: 'CANCELED', // 状态 (交易中 TRADING 已完成 COMPLETED  已取消  CANCELED 冻结中 FROZEN)
        pageNum: this.currentPage,
        pageSize: this.pageSize
      })
      console.log('请求已取消订单列表')
      console.log(data)
      // 提示信息
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑
        this.otcCanceledOrderList = data.data.data.list
        // 分页
        this.totalPages = data.data.data.pages - 0
        console.log('取消订单')
        console.log(this.otcCanceledOrderList)
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
  .otc-canceled-order-box{
    >.canceled-order-content{
      min-height: 500px;
      >.canceled-table-head{
        box-sizing: border-box;
        width: 1043px;
        height: 35px;
        line-height: 35px;
        // background-color: #202A33;
        // color: #617499;
        // border: 1px solid #262F38;
        border-radius: 5px;
        margin-bottom: 15px;
        // box-shadow: -2px 3px 5px 1px #191E28;
        >.item{
          display: inline-block;
          width: 140px;
          text-align: center;
        }
      }
      >.canceled-table-body{
        box-sizing: border-box;
        width: 1043px;
        height: 170px;
        // background-color: #202A33;
        // border: 1px solid #262F38;
        border-radius: 5px;
        margin-bottom: 15px;
        >.canceled-info-top{
          height: 40px;
          line-height: 40px;
          // background-color: #202A33;
          // color: #617499;
          border-radius: 5px;
          .red{
            // color: #D45858;
          }
          .green{
            // color: #008069;
          }
          >.item{
            display: inline-block;
            width: 140px;
            text-align: center;
          }
        }
        >.canceled-info-bottom{
          box-sizing: border-box;
          // border-top: 1px solid #262F38;
          display: flex;
          flex: 7;
          padding: 30px 30px 0 30px;
          // color: #9DA5B3;
          >.info-left{
            flex: 2;
            box-sizing: border-box;
            // border-right: 1px solid #262F38;
            >.text-info{
              line-height: 20px;
            }
            >.text-blue{
              // color: #5E95EC;
            }
          }
          >.info-middle{
           flex: 2;
            box-sizing: border-box;
            // border-right: 1px solid #262F38;
            margin-left: 30px;
            >.text-info{
              line-height: 20px;
            }
            >.text-blue{
              // color: #5E95EC;
            }
          }
          >.info-right{
            flex: 3;
            box-sizing: border-box;
            margin-left: 30px;
            >.text-info{
              line-height: 20px;
            }
            >.text-blue{
              // color: #5E95EC;
            }
          }
        }
      }
      >.no-data{
        width: 1043px;
        height: 432px;
        line-height: 432px;
        text-align: center;
        // background-color: #202A33;
      }
      >.page{
        text-align: center;
        padding: 5px 0 15px 0;
      }
    }
    &.night{
      >.canceled-order-content{
        >.canceled-table-head{
          background-color: #1E2636;
          color: #A9BED4;
          border: 1px solid #485776;
          >.item{
          }
        }
        >.canceled-table-body{
          background-color: #1E2636;
          border: 1px solid #485776;
          >.canceled-info-top{
            background-color: #1E2636;
            color: #9DA5B3;
            .red{
              color: #D45858;
            }
            .green{
              color: #008069;
            }
            >.item{
            }
          }
          >.canceled-info-bottom{
            border-top: 1px solid #262F38;
            color: #9DA5B3;
            >.info-left{
              border-right: 1px solid #262F38;
              >.text-info{
              }
              >.text-blue{
                color: #5E95EC;
              }
            }
            >.info-middle{
              border-right: 1px solid #262F38;
              >.text-info{
              }
              >.text-blue{
                color: #5E95EC;
              }
            }
            >.info-right{
              >.text-info{
              }
              >.text-blue{
                color: #5E95EC;
              }
            }
          }
        }
        >.no-data{
          background-color: $mainNightBgColor;
          color: rgba(255, 255, 255, 0.8);
        }
        >.page{
        }
      }
    }
    &.day{
      >.canceled-order-content{
        >.canceled-table-head{
          background-color: $mainDayColor;
          color: #617499;
          border: 1px solid #ECF1F8;
          >.item{
          }
        }
        >.canceled-table-body{
          background-color: $mainDayColor;
          border: 1px solid #ECF1F8;
          >.canceled-info-top{
            background-color: $mainDayColor;
            color: #333333;
            .red{
              color: #D45858;
            }
            .green{
              color: #008069;
            }
            >.item{
            }
          }
          >.canceled-info-bottom{
            border-top: 1px solid rgba(38,47,56,0.1);
            color: #7D90AC;
            >.info-left{
              border-right: 1px solid rgba(38,47,56,0.1);
              >.text-info{
              }
              >.text-blue{
                color: #5E95EC;
              }
            }
            >.info-middle{
              border-right: 1px solid rgba(38,47,56,0.1);
              >.text-info{
              }
              >.text-blue{
                color: #5E95EC;
              }
            }
            >.info-right{
              >.text-info{
              }
              >.text-blue{
                color: #5E95EC;
              }
              >.cancel-time{
                color: #333333;
              }
            }
          }
        }
        >.no-data{
          background-color: $mainDayColor;
          color: #333333;
          border: 1px solid rgba(97,116,153,0.1);
        }
        >.page{
        }
      }
    }
  }
</style>
