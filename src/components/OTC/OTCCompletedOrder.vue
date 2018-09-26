<template>
  <div
    class="otc-completed-order-box otc"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="completed-order-content">
      <div class="tables">
        <el-table
          :data="completedOrdersList"
          :default-expand-all="true"
          empty-text="暂无数据"
        >
          <div>
            <el-table-column type="expand">
              <template slot-scope="props">
                <div class="completed-info">
                  <!-- 左侧 -->
                  <div class="completed-info-left">
                    <p class="order-info-left">
                      <span class="pay-info">付款信息</span>
                    </p>
                    <p class="order-info-left">
                      <span>姓名：</span>
                      <span>{{props.row.buyName}}</span>
                    </p>
                    <p class="order-info-left">
                      <span>付款方式：</span>
                      <!-- 判断付款方式 -->
                      <span v-if="props.row.payType === 'alipay'">支付宝</span>
                      <span v-if="props.row.payType === 'bank'">银行卡</span>
                      <span v-if="props.row.payType === 'xilian'">西联汇款</span>
                      <span v-if="props.row.payType === 'paypal'">PAYPAL</span>
                      <span v-if="props.row.payType === 'weixin'">微信</span>
                      <!-- <span>{{props.row.payType}}</span> -->
                    </p>
                    <p class="order-info-left">
                      <span>银行卡账号：</span>
                      <span>{{props.row.payAcctount}}</span>
                    </p>
                  </div>
                  <!-- 中间 -->
                  <div class="completed-info-middle">
                    <p class="order-info-middle">
                      <span class="buyer-seller-info">卖家信息</span>
                    </p>
                    <p class="order-info-middle">
                      <span>姓名：</span>
                      <span>{{props.row.sellName}}</span>
                    </p>
                    <p class="order-info-middle">
                      <span>卖家手机号：</span>
                      <span>{{props.row.sellPhone}}</span>
                    </p>
                  </div>
                  <!-- 右侧 -->
                  <div class="completed-info-right">
                    <p class="order-info-right">
                      <span class="confirm-time">确认时间</span>
                    </p>
                    <p class="order-info-right">
                      <span>付款确认时间：</span>
                      <span>{{props.row.payTime}}</span>
                    </p>
                    <p class="order-info-right">
                      <span>收款确认时间：</span>
                      <span>{{props.row.confirmTime ? props.row.confirmTime : props.row.completeTime}}</span>
                    </p>
                  </div>
                </div>
              </template>
            </el-table-column>
          </div>
          <el-table-column
            label="订单号"
          >
            <template slot-scope="scope">
              {{scope.row.orderSequence}}
            </template>
          </el-table-column>
          <el-table-column
            label="类型"
            width="118"
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.orderType === 'BUY'"
                :class="{ red: scope.row.orderType === 'BUY' }"
              >
                买入
              </span>
              <span
                v-if="scope.row.orderType === 'SELL'"
                :class="{ green: scope.row.orderType === 'SELL' }"
              >
                卖出
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="币种"
            width="118"
          >
            <template slot-scope="scope">
              {{ scope.row.coinName }}
            </template>
          </el-table-column>
          <el-table-column
            label="价格"
            width="118"
          >
            <template slot-scope="scope">
              {{ scope.row.price }}({{ scope.row.currencyName }})
            </template>
          </el-table-column>
          <el-table-column
            label="数量"
          >
            <template slot-scope="scope">
              {{ scope.row.pickCount }}({{ scope.row.coinName }})
            </template>
          </el-table-column>
          <el-table-column
            label="总金额"
          >
            <template slot-scope="scope">
              {{ (scope.row.price*scope.row.pickCount).toFixed(2)}}({{ scope.row.currencyName }})
            </template>
          </el-table-column>
          <el-table-column
            label="下单时间"
          >
            <template slot-scope="scope">
              {{timeFormatting(scope.row.createTime)}}
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
import {returnAjaxMessage} from '../../utils/commonFunc'
import {mapState} from 'vuex'
export default {
  components: {},
  // props,
  data () {
    return {
      // 分页
      pageSize: 5,
      currentPage: 1, // 当前页码
      totalPages: 1, // 总页数
      completedOrdersList: []
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
    // 分页
    changeCurrentPage (pageNum) {
      console.log(pageNum)
      this.currentPage = pageNum
      this.getOTCCompletedOrdersList()
    },
    // 1.0 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
    },
    // 2.0 请求已完成订单列表
    async getOTCCompletedOrdersList () {
      const data = await getOTCCompletedOrders({
        status: 'COMPLETED', // 状态 (交易中 TRADING 已完成 COMPLETED  已取消  CANCELED 冻结中 FROZEN)
        pageNum: this.currentPage,
        pageSize: this.pageSize
      })
      // 提示信息
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑
        this.completedOrdersList = data.data.data.list
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
// @import url(../../../static/css/scss/OTC/OTCCompletedOrder.scss);
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
