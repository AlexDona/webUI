<template>
  <div
    class="fiat-completed-order-box personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="completed-order-content">
      <el-table
        :data="completedOrdersList"
        :default-expand-all="true"
        empty-text="暂无数据"
        width="800"
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
          width="150px"
        >
          <template slot-scope="scope">
            {{scope.row.orderSequence}}
          </template>
        </el-table-column>
        <el-table-column
          label="类型"
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
        >
          <template slot-scope="scope">
            {{ scope.row.coinName }}
          </template>
        </el-table-column>
        <el-table-column
          label="价格"
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
          width="160px"
        >
          <template slot-scope="scope">
            {{timeFormatting(scope.row.createTime)}}
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        background
        v-show="completedOrdersList.length"
        layout="prev, pager, next"
        :current-page="legalTradePageNum"
        :page-count="legalTradePageTotals"
        @current-change="changeCurrentPage"
      >
      </el-pagination>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {timeFilter} from '../../../utils'
import {createNamespacedHelpers, mapState} from 'vuex'
import {changeCurrentPageForLegalTrader} from '../../../utils/commonFunc'
const {mapMutations} = createNamespacedHelpers('personal')
export default {
  components: {},
  // props,
  data () {
    return {
      // completedOrdersList: []
    }
  },
  created () {
    require('../../../../static/css/list/Personal/FiatCoinContent/FiatCoinCompletedOrder.css')
    require('../../../../static/css/theme/day/Personal/FiatCoinContent/FiatCoinCompletedOrderDay.css')
    require('../../../../static/css/theme/night/Personal/FiatCoinContent/FiatCoinCompletedOrderNight.css')
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_LEGAL_PAGE',
      'SET_LEGAL_TENDER_REFLASH_STATUS'
    ]),
    // 分页
    changeCurrentPage (e) {
      changeCurrentPageForLegalTrader(e, 'COMPLETED', this)
    },
    // 1.0 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      legalTraderCompletedList: state => state.personal.legalTraderCompletedList,
      legalTraderCompletedReflashStatus: state => state.personal.legalTraderCompletedReflashStatus,
      legalTradePageTotals: state => state.personal.legalTradePageTotals,
      legalTradePageNum: state => state.personal.legalTradePageNum

    }),
    completedOrdersList () {
      return this.legalTraderCompletedList
    }
  },
  watch: {
    legalTraderCompletedList (newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal.scss";
  .fiat-completed-order-box{
    >.completed-order-content{
      .red{
        color: #D45858;
      }
      .green{
        color: #008069;
      }
      .completed-info{
        display: flex;
        flex: 7;
        color: #9DA5B3;
        &::after{
          /*content: '';*/
          /*width: 5px;*/
          /*height: 5px;*/
          /*position: absolute;*/
          /*right: 0;*/
          /*top: 0px;*/
          /*bottom: 0px;*/
          /*background-color: red;*/
        }
        >.completed-info-left{
          flex: 2;
          border-right: 1px solid #262F38;
          >.order-info-left{
            // margin-left: 50px;
            // line-height: 1.5rem;
            line-height: 20px;
            >.pay-info{
              color: #5E95EC;
            }
          }
        }
        >.completed-info-middle{
          flex: 2;
          border-right: 1px solid #262F38;
          >.order-info-middle{
            margin-left: 50px;
            // line-height: 1.5rem;
            line-height: 20px;
            >.buyer-seller-info{
              color: #5E95EC;
            }
          }
        }
        >.completed-info-right{
          flex: 3;
          >.order-info-right{
            margin-left: 50px;
            // line-height: 1.5rem;
            line-height: 20px;
            >.confirm-time{
              color: #5E95EC;
            }
          }
        }
      }
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      >.background-color{
        background-color: #1E2636;
        >.fiat-color{
          color: #338FF5;
        }
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      >.background-color{
        background-color: #CCCCCC;
      }
      .completed-info{
        display: flex;
        flex: 7;
        color: #9DA5B3;
        >.completed-info-left{
          flex: 2;
          border-right: 1px solid rgba(38,47,56,0.1);
          >.order-info-left{
            line-height: 20px;
            >.pay-info{
              color: #5E95EC;
            }
          }
        }
        >.completed-info-middle{
          flex: 2;
          border-right: 1px solid rgba(38,47,56,0.1);
          >.order-info-middle{
            margin-left: 50px;
            // line-height: 1.5rem;
            line-height: 20px;
            >.buyer-seller-info{
              color: #5E95EC;
            }
          }
        }
        >.completed-info-right{
          flex: 3;
          >.order-info-right{
            margin-left: 50px;
            // line-height: 1.5rem;
            line-height: 20px;
            >.confirm-time{
              color: #5E95EC;
            }
          }
        }
      }
    }
  }
</style>
