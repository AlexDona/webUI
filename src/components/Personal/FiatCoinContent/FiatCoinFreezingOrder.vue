<template>
  <div
    class="fiat-freezing-order-box personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="freezing-order-content">
      <!--表头属性-->
      <div class="freezing-table-head display-flex">
        <span class="item order-time">
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
        <span class="item order-time">
          <!--下单时间-->
          {{$t('M.otc_stocks_ordertime')}}
        </span>
      </div>
      <!--表格-->
      <div
        class="freezing-table-body"
        v-for="(item,index) in OTCFreezingOrderList"
        :key="index"
      >
        <!--表格上部分-->
        <div class="freezing-info-top display-flex">
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
          <span class="item order-time">{{timeFormatting(item.createTime)}}
          </span>
        </div>
        <!--表格下部分-->
        <div class="freezing-info-bottom">
          <div class="info-left">
            <p class="text-info text-blue">
              <!--付款信息-->
              {{$t('M.otc_index_js2')}}
            </p>
            <p class="text-info">
              <!--买家已付款，卖家有异议申请冻结订单-->
              {{$t('M.otc_freeze')}}
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
      <!--分页-->
      <el-pagination
        background
        v-show="OTCFreezingOrderList.length"
        layout="prev, pager, next"
        :current-page="legalTradePageNum"
        :page-count="legalTradePageTotals"
        @current-change="changeCurrentPage"
      >
      </el-pagination>
      <div class="no-data" v-if="!OTCFreezingOrderList.length">
        <!--暂无数据-->
        {{$t('M.comm_no_data')}}
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {timeFilter} from '../../../utils'
import {changeCurrentPageForLegalTrader} from '../../../utils/commonFunc'
import {createNamespacedHelpers, mapState} from 'vuex'
const {mapMutations} = createNamespacedHelpers('personal')
export default {
  components: {},
  // props,
  data () {
    return {
    }
  },
  created () {
    require('../../../../static/css/list/Personal/FiatCoinContent/FiatCoinFreezingOrder.css')
    require('../../../../static/css/theme/day/Personal/FiatCoinContent/FiatCoinFreezingOrderDay.css')
    require('../../../../static/css/theme/night/Personal/FiatCoinContent/FiatCoinFreezingOrderNight.css')
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'SET_LEGAL_TENDER_REFLASH_STATUS',
      'CHANGE_LEGAL_PAGE'
    ]),
    // 分页
    changeCurrentPage (e) {
      changeCurrentPageForLegalTrader(e, 'TRADING', this)
    },
    // 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      legalTraderForzenList: state => state.personal.legalTraderForzenList,
      legalTradePageTotals: state => state.personal.legalTradePageTotals,
      legalTradePageNum: state => state.personal.legalTradePageNum
    }),
    OTCFreezingOrderList () {
      return this.legalTraderForzenList
    }
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal.scss";
  .fiat-freezing-order-box{
    >.freezing-order-content{
      >.freezing-table-head{
        box-sizing: border-box;
        height: 35px;
        line-height: 35px;
        border-radius: 5px;
        margin-bottom: 5px;
        >.item{
          display: inline-block;
          text-align: center;
        }
        >.order-time {
          width: 170px;
        }
      }
      >.freezing-table-body{
        box-sizing: border-box;
        height: 170px;
        border-radius: 5px;
        margin-bottom: 15px;
        >.freezing-info-top{
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
        >.freezing-info-bottom{
          box-sizing: border-box;
          display: flex;
          flex: 4;
          padding: 30px 30px 0 30px;
          >.info-left{
            flex: 1;
            box-sizing: border-box;
            >.text-info{
              line-height: 20px;
            }
          }
          >.info-middle{
            flex: 1;
            box-sizing: border-box;
            margin-left: 30px;
            >.text-info{
              line-height: 20px;
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
        height: 345px;
        line-height: 345px;
        text-align: center;
        background-color: #1E2636;
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
      >.freezing-order-content{
        >.freezing-table-head{
          background-color: $nightMainBgColor;
          color: #617499;
          border: 1px solid #262F38;
          box-shadow: -2px 3px 5px 1px #191E28;
        }
        >.freezing-table-body{
          background-color: $nightMainBgColor;
          border: 1px solid #262F38;
          >.freezing-info-top{
            background-color: $nightMainBgColor;
            color: #617499;
            border-radius: 5px;
            .red{
              color: #D45858;
            }
            .green{
              color: #008069;
            }
          }
          >.freezing-info-bottom{
            border-top: 1px solid #262F38;
            padding: 30px 30px 0 30px;
            color: #9DA5B3;
            >.info-left{
              border-right: 1px solid #262F38;
            }
            >.info-middle{
              border-right: 1px solid #262F38;
              >.text-blue{
                color: #5E95EC;
              }
            }
            >.info-right{
              border-right: 1px solid #262F38;
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
      >.freezing-order-content{
        >.freezing-table-head{
          background-color: #fff;
          color: #617499;
          border: 1px solid  rgba(72,87,118,0.1);
          box-shadow: -2px 3px 5px 1px #191E28;
        }
        >.freezing-table-body{
          background-color: #fff;
          border: 1px solid rgba(72,87,118,0.1);
          >.freezing-info-top{
            background-color: #fff;
            color: #617499;
            .red{
              color: #D45858;
            }
            .green{
              color: #008069;
            }
          }
          >.freezing-info-bottom{
            border-top: 1px solid rgba(72,87,118,0.1);
            color: #9DA5B3;
            >.info-left{
              border-right: 1px solid rgba(72,87,118,0.1);
              >.text-blue{
                color: #5E95EC;
              }
            }
            >.info-middle{
              border-right: 1px solid rgba(72,87,118,0.1);
              >.text-blue{
                color: #5E95EC;
              }
            }
            >.info-right{
              border-right: 1px solid rgba(38,47,56,0.1);
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
