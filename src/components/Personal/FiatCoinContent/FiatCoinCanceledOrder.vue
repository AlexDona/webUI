<template>
  <div
    class="fiat-canceled-order-box personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="canceled-order-content">
      <!--&lt;!&ndash;表头属性&ndash;&gt;-->
      <div class="canceled-table-head display-flex">
        <span class="item flex1">
          <!--订单号-->
          {{$t('M.otc_MerchantsOrders_orderNum')}}
        </span>
        <span class="item flex1">
          <!--类型-->
          {{$t('M.otc_cancelOrder_type')}}
        </span>
        <span class="item flex1">
          <!--币种-->
          {{$t('M.comm_currency')}}
        </span>
        <span class="item flex1">
          <!--价格-->
          {{$t('M.otc_index_price')}}
        </span>
        <span class="item flex1">
          <!--数量-->
          {{$t('M.comm_count')}}
        </span>
        <span class="item flex1">
          <!--总金额-->
          {{$t('M.otc_canceled_total')}}
        </span>
        <span class="item flex1">
          <!--下单时间-->
          {{$t('M.otc_stocks_ordertime')}}
        </span>
      </div>
      <!--表格-->
      <div
        class="canceled-table-body"
        v-for="(item,index) in OTCCanceledOrderList"
        :key="index"
      >
        <!--表格上部分-->
        <div class="canceled-info-top display-flex">
          <!-- 订单号 -->
          <span class="item order-time">{{item.orderSequence}}</span>
          <!-- 类型 买入 -->
          <span
            class="item flex1"
            v-if="item.orderType === 'BUY'"
            :class="{ red: item.orderType === 'BUY' }"
          >
            <!--买入-->
            {{$t('M.comm_buy')}}
          </span>
          <!-- 类型卖出 -->
          <span
            class="item flex1"
            v-if="item.orderType === 'SELL'"
            :class="{ green: item.orderType === 'SELL' }"
          >
            <!--卖出-->
            {{$t('M.comm_sell')}}
          </span>
          <!-- 币种 -->
          <span class="item flex1">
            {{item.coinName}}
          </span>
          <!-- 价格 -->
          <span class="item flex1">
            {{item.price}}({{ item.currencyName }})
          </span>
          <!-- 数量 -->
          <span class="item flex1">
            {{item.pickCount}}({{ item.coinName }})
          </span>
          <!-- 总金额 -->
          <span class="item flex1">
            {{(item.price*item.pickCount).toFixed(2)}}({{ item.currencyName }})
          </span>
          <!-- 下单时间 -->
          <span class="item order-time">
            {{timeFormatting(item.createTime)}}
          </span>
        </div>
        <!--表格下部分-->
        <div class="canceled-info-bottom">
          <div class="info-left">
            <p class="text-info text-blue">
              <!--付款信息-->
              {{$t('M.otc_index_js2')}}
            </p>
            <p class="text-info">
              <!--卖家超时未付款，系统自动取消-->
              {{$t('M.otc_overtime')}}
            </p>
          </div>
          <div class="info-middle">
            <p class="text-info text-blue">
              <!--卖家信息-->
              {{$t('M.otc_stocks_seller')}}
            </p>
            <p class="text-info">
              <span>
                <!--姓名-->
                {{$t('M.otc_name')}}：
              </span><span>
              {{item.sellName}}
            </span>
            </p>
            <p class="text-info">
              <span>
                <!--卖家手机号-->
                {{$t('M.otc_trading_sellphone')}}：
              </span><span>
              {{item.sellPhone}}
            </span>
            </p>
          </div>
          <div class="info-right">
            <p class="text-info text-blue">
              <!--取消时间-->
              {{$t('M.otc_canceled_cancel')}}
            </p>
            <p class="text-info">
              {{timeFormatting(item.cancelTime)}}
            </p>
          </div>
        </div>
      </div>
      <div
        class="no-data"
        v-if="!OTCCanceledOrderList.length"
      >
        <!--暂无数据-->
        {{$t('M.comm_no_data')}}
      </div>
      <!--分页-->
      <el-pagination
        background
        v-show="OTCCanceledOrderList.length"
        layout="prev, pager, next"
        :page-count="legalTradePageTotals"
        :current-page="legalTradePageNum"
        @current-change="changeCurrentPage"
      >
      </el-pagination>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {timeFilter} from '../../../utils'
// import {mapState, mapMutations} from 'vuex'
import {changeCurrentPageForLegalTrader} from '../../../utils/commonFunc'
import {createNamespacedHelpers, mapState} from 'vuex'
const {mapMutations} = createNamespacedHelpers('personal')
export default {
  components: {},
  // props,
  data () {
    return {}
  },
  created () {
    require('../../../../static/css/list/Personal/FiatCoinContent/FiatCoinCanceledOrder.css')
    require('../../../../static/css/theme/day/Personal/FiatCoinContent/FiatCoinCanceledOrderDay.css')
    require('../../../../static/css/theme/night/Personal/FiatCoinContent/FiatCoinCanceledOrderNight.css')
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
      changeCurrentPageForLegalTrader(e, 'CANCELED', this)
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
      legalTraderCanceledList: state => state.personal.legalTraderCanceledList,
      legalTradePageTotals: state => state.personal.legalTradePageTotals,
      legalTradePageNum: state => state.personal.legalTradePageNum
    }),
    OTCCanceledOrderList () {
      return this.legalTraderCanceledList
    }
  },
  watch: {

  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal.scss";
  .fiat-canceled-order-box{
    >.canceled-order-content{
      >.canceled-table-head{
        box-sizing: border-box;
        height: 35px;
        line-height: 35px;
        border-radius: 5px;
        margin-bottom: 5px;
        >.item{
          display: inline-block;
          text-align: center;
        }
      }
      >.canceled-table-body{
        box-sizing: border-box;
        height: 170px;
        border-radius: 5px;
        margin-bottom: 15px;
        >.canceled-info-top{
          height: 40px;
          line-height: 40px;
          border-radius: 5px;
          >.item{
            display: inline-block;
            text-align: center;
          }
          >.order-time {
            width: 170px;
          }
        }
        >.canceled-info-bottom{
          box-sizing: border-box;
          display: flex;
          flex: 7;
          padding: 30px 30px 0 30px;
          color: #9DA5B3;
          >.info-left{
            flex: 2;
            box-sizing: border-box;
            >.text-info{
              line-height: 20px;
            }
          }
          >.info-middle{
            flex: 2;
            box-sizing: border-box;
            margin-left: 30px;
            >.text-info{
              line-height: 20px;
            }
          }
          >.info-right{
            flex: 3;
            box-sizing: border-box;
            margin-left: 30px;
            >.text-info{
              line-height: 20px;
            }color: #5E95EC;
            }
          }
        }
      >.no-data{
        height: 345px;
        line-height: 345px;
        text-align: center;
      }
      }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      >.background-color{
        background-color: $nightMainBgColor;
        >.fiat-color{
          color: #338FF5;
        }
      }
      >.canceled-order-content{
        >.canceled-table-head{
          box-sizing: border-box;
          background-color: $nightMainBgColor;
          color: #617499;
          border: 1px solid #262F38;
          box-shadow: -2px 3px 5px 1px #191E28;
        }
        >.canceled-table-body{
          background-color: $nightMainBgColor;
          border: 1px solid #262F38;
          >.canceled-info-top{
            background-color: $nightMainBgColor;
            color: #617499;
            .red{
              color: #D45858;
            }
            .green{
              color: #008069;
            }
          }
          >.canceled-info-bottom{
            border-top: 1px solid #262F38;
            color: #9DA5B3;
            >.info-left{
              flex: 2;
              border-right: 1px solid #262F38;
              >.text-blue{
                color: #5E95EC;
              }
            }
            >.info-middle{
              border-right: 1px solid #262F38;
              >.text-blue{
                color: #5E95EC;
              }
            }
            >.info-right{
              >.text-blue{
                color: #5E95EC;
              }
            }
          }
        }
        >.no-data{
          background-color: $nightMainBgColor;
        }
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      >.background-color{
        background-color: #CCCCCC;
      }
      >.canceled-order-content{
        >.canceled-table-head{
          background-color: $dayBgColor;
          color: #617499;
          border: 1px solid rgba(38,47,56,0.1);
          box-shadow: -2px 3px 5px 1px #191E28;h: 150px;
        }
        >.canceled-table-body{
          background-color: $dayBgColor;
          border: 1px solid rgba(38,47,56,0.1);
          >.canceled-info-top{
            background-color: $dayBgColor;
            color: #617499;
            .red{
              color: #D45858;
            }
            .green{
              color: #008069;
            }
          }
          >.canceled-info-bottom {
            border-top: 1px solid rgba(38,47,56,0.1);
            color: #9DA5B3;
            >.info-left{
              border-right: 1px solid rgba(38,47,56,0.1);
              >.text-blue{
                color: #5E95EC;
              }
            }
            >.info-middle{
              border-right: 1px solid rgba(38,47,56,0.1);
              >.text-blue{
                color: #5E95EC;
              }
            }
            >.info-right{
              >.text-blue{
                color: #5E95EC;
              }
            }
          }
        }
        >.no-data{
          background-color: $dayBgColor;
        }
      }
    }
  }
</style>
