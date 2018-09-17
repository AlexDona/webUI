<template>
  <div
    class="otc-freezing-order-box otc"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="freezing-order-content">
      <!--表头属性-->
      <div class="freezing-table-head">
        <span class="item">订单号</span>
        <span class="item">类型</span>
        <span class="item">币种</span>
        <span class="item">价格</span>
        <span class="item">数量</span>
        <span class="item">总金额</span>
        <span class="item">下单时间</span>
      </div>
      <!--表格-->
      <div
        class="freezing-table-body"
        v-for="(item,index) in getOTCFreezingOrderList"
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
            买入
          </span>
          <!-- 类型卖出 -->
          <span
            class="item"
            v-if="item.orderType === 'SELL'"
            :class="{ green: item.orderType === 'SELL' }"
          >
            卖出
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
            <p class="text-info text-blue">付款信息</p>
            <p class="text-info">买家已付款，卖家有异议申请冻结订单</p>
          </div>
          <div class="info-middle">
            <p class="text-info text-blue">卖家信息</p>
            <p class="text-info">
              <span>姓名：</span><span>{{item.sellName}}</span>
            </p>
            <p class="text-info">
              <span>卖家手机号：</span><span>{{item.sellPhone}}</span>
            </p>
          </div>
          <div class="info-right">
            <p class="text-info text-blue">冻结时间</p>
            <p class="text-info">{{timeFormatting(item.freezeTime)}}</p>
          </div>
          <div class="info-reason">
            <p class="text-info text-blue">申诉原因</p>
            <p class="text-info">{{item.appealCause}}</p>
          </div>
        </div>
      </div>
      <div class="no-data" v-if="!getOTCFreezingOrderList.length">暂无数据</div>
      <!--分页-->
      <div class="page">
        <el-pagination
          background
          v-show="getOTCFreezingOrderList.length"
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
      // 分页
      currentPage: 1, // 当前页码
      totalPages: 1, // 总页数
      // OTC冻结订单列表
      getOTCFreezingOrderList: []
    }
  },
  created () {
    require('../../../static/css/list/OTC/OTCFreezingOrder.css')
    require('../../../static/css/theme/day/OTC/OTCFreezingOrderDay.css')
    require('../../../static/css/theme/night/OTC/OTCFreezingOrderNight.css')
    // 1.0 请求冻结中订单列表
    this.getOTCFrezzingOrdersList()
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
      const data = await getOTCFrezzingOrders({
        status: 'FROZEN', // 状态 (交易中 TRADING 已完成 COMPLETED  已取消  CANCELED 冻结中 FROZEN)
        pageNum: this.currentPage,
        pageSize: '5'
      })
      console.log('冻结中订单')
      console.log(data)
      // 提示信息
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑
        this.getOTCFreezingOrderList = data.data.data.list
        // 分页
        this.totalPages = data.data.data.pages - 0
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  // @import url(../../../static/css/scss/OTC/OTCFreezingOrder.scss);
  @import "../../../static/css/scss/OTC/OTCFreezingOrder.scss";
  .otc-freezing-order-box{
    >.freezing-order-content{
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
        background-color: #1E2636;
        color: #A9BED4;
        border: 1px solid #485776;
        // box-shadow: -2px 3px 5px 1px #191E28;
        >.item{
        }
      }
      >.freezing-table-body{
        background-color: #1E2636;
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
        background-color: #1E2636;
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
      }
    }
    }
  }
</style>
