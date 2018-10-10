<template>
  <div
    class="otc-freezing-order-box otc"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div
      class="freezing-order-content"
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0.6)"
    >
      <!--表头属性-->
      <div class="freezing-table-head">
        <!-- 订单号 -->
        <span class="item">{{$t('M.otc_MerchantsOrders_orderNum')}}</span>
        <!-- 类型 -->
        <span class="item">{{$t('M.otc_cancelOrder_type')}}</span>
        <!-- 币种 -->
        <span class="item">{{$t('M.comm_currency')}}</span>
        <!-- 价格 -->
        <span class="item">{{$t('M.otc_index_price')}}</span>
        <!-- 数量 -->
        <span class="item">{{$t('M.comm_count')}}</span>
        <!-- 总金额 -->
        <span class="item">{{$t('M.otc_canceled_total')}}</span>
        <!-- 下单时间 -->
        <span class="item">{{$t('M.otc_stocks_ordertime')}}</span>
      </div>
      <!--表格-->
      <div
        class="freezing-table-body"
        v-for="(item,index) in otcFreezingOrderList"
        :key="index"
      >
        <!--表格上部分-->
        <div class="freezing-info-top">
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
            <!-- 卖出 -->
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
        <div class="freezing-info-bottom">
          <div class="info-left">
            <!-- 付款信息 -->
            <p class="text-info text-blue">{{$t('M.otc_index_js2')}}</p>
            <!-- 买家已付款，卖家有异议申请冻结订单 -->
            <p class="text-info">{{$t('M.otc_freeze')}}</p>
          </div>
          <div class="info-middle">
            <!-- 卖家信息 -->
            <p class="text-info text-blue">{{$t('M.otc_stocks_seller')}}</p>
            <p class="text-info">
              <!-- 姓名 -->
              <span>{{$t('M.otc_name')}}：</span><span>{{item.sellName}}</span>
            </p>
            <p class="text-info">
              <!-- 卖家手机号 -->
              <span>{{$t('M.otc_trading_sellphone')}}：</span><span>{{item.sellPhone}}</span>
            </p>
          </div>
          <div class="info-right">
            <!-- <p class="text-info text-blue">冻结时间</p> -->
            <!-- 申诉冻结，等待处理 -->
            <p class="text-info text-blue">{{$t('M.otc_complaint_frezzing')}}</p>
            <p class="text-info">{{timeFormatting(item.freezeTime)}}</p>
          </div>
          <div class="info-reason">
            <!-- 申诉原因 -->
            <p class="text-info text-blue">{{$t('M.otc_complaint_appeal_reason')}}</p>
            <p class="text-info">{{item.appealCause}}</p>
          </div>
        </div>
      </div>
      <div
        class="no-data"
        v-if="!otcFreezingOrderList.length"
      >
        <!-- 暂无数据 -->
        {{$t('M.comm_no_data')}}
      </div>
      <!--分页-->
      <div class="page">
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
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {timeFilter} from '../../utils'
import {getOTCFrezzingOrders} from '../../utils/api/OTC'
import {returnAjaxMessage} from '../../utils/commonFunc'
import {mapState} from 'vuex'
export default {
  components: {},
  // props,
  data () {
    return {
      loading: true,
      // 分页
      pageSize: 5,
      currentPage: 1, // 当前页码
      totalPages: 1, // 总页数
      // OTC冻结订单列表
      otcFreezingOrderList: []
    }
  },
  created () {
    require('../../../static/css/list/OTC/OTCFreezingOrder.css')
    require('../../../static/css/theme/day/OTC/OTCFreezingOrderDay.css')
    require('../../../static/css/theme/night/OTC/OTCFreezingOrderNight.css')
    // 1.0 请求冻结中订单列表:只有登录了才调用
    if (this.isLogin) {
      this.getOTCFrezzingOrdersList()
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
      this.getOTCFrezzingOrdersList()
    },
    // 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
      // return timeFilter(date, 'BIH')
    },
    // 2.0 请求冻结中订单列表
    async getOTCFrezzingOrdersList () {
      this.loading = true
      const data = await getOTCFrezzingOrders({
        status: 'FROZEN', // 状态 (交易中 TRADING 已完成 COMPLETED  已取消  CANCELED 冻结中 FROZEN)
        pageNum: this.currentPage,
        pageSize: this.pageSize
      })
      console.log('冻结中订单')
      console.log(data)
      // 提示信息
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑
        this.loading = false
        this.otcFreezingOrderList = data.data.data.list
        // 分页
        this.totalPages = data.data.data.pages - 0
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
  // @import url(../../../static/css/scss/OTC/OTCFreezingOrder.scss);
  @import "../../../static/css/scss/OTC/OTCCenter.scss";
  @import "../../../static/css/scss/index.scss";
  .otc-freezing-order-box{
    >.freezing-order-content{
      min-height: 472px;
      >.freezing-table-head{
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
      >.freezing-table-body{
        box-sizing: border-box;
        width: 1043px;
        height: 170px;
        // background-color: #202A33;
        // border: 1px solid #262F38;
        border-radius: 5px;
        margin-bottom: 15px;
        >.freezing-info-top{
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
        >.freezing-info-bottom{
          box-sizing: border-box;
          // border-top: 1px solid #262F38;
          display: flex;
          flex: 4;
          padding: 30px 30px 0 30px;
          // color: #9DA5B3;
          >.info-left{
            flex: 1;
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
            flex: 1;
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
            flex: 1;
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
          >.info-reason{
            flex: 1;
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
        padding-bottom: 20px;
      }
    }
    &.night{
      >.freezing-order-content{
      >.freezing-table-head{
        background-color: $mainContentNightBgColor;
        color: #A9BED4;
        border: 1px solid #485776;
        // box-shadow: -2px 3px 5px 1px #191E28;
        >.item{
        }
      }
      >.freezing-table-body{
        background-color: $mainContentNightBgColor;
        border: 1px solid #485776;
        >.freezing-info-top{
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
        >.freezing-info-bottom{
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
            border-right: 1px solid #262F38;
            >.text-info{
            }
            >.text-blue{
              color: #5E95EC;
            }
          }
          >.info-reason{
            >.text-info{
            }
            >.text-blue{
              color: #5E95EC;
            }
          }
        }
      }
      >.no-data{
        background-color: $mainContentNightBgColor;
        color: rgba(255, 255, 255, 0.8);
      }
    }
    }
    &.day{
      >.freezing-order-content{
      >.freezing-table-head{
        background-color: $mainDayColor;
        color: #617499;
        border: 1px solid #ECF1F8;
        >.item{
        }
      }
      >.freezing-table-body{
        background-color: $mainDayColor;
        border: 1px solid #ECF1F8;
        >.freezing-info-top{
          color: #333;
          .red{
            color: #D45858;
          }
          .green{
            color: #008069;
          }
          >.item{
          }
        }
        >.freezing-info-bottom{
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
            border-right: 1px solid rgba(38,47,56,0.1);
            >.text-info{
            }
            >.text-blue{
              color: #5E95EC;
            }
          }
          >.info-reason{
            >.text-info{
            }
            >.text-blue{
              color: #5E95EC;
            }
          }
        }
      }
      >.no-data{
        background-color: #fff;
        color: #333333;
        border: 1px solid #ECF1F8;
      }
    }
    }
  }
</style>
