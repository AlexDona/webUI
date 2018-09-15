<template>
  <div
    class="fiat-freezing-order-box personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="freezing-order-content">
      <!--表头属性-->
      <div class="freezing-table-head display-flex">
        <span class="item order-time">订单号</span>
        <span class="item flex1">类型</span>
        <span class="item flex1">币种</span>
        <span class="item flex1">价格</span>
        <span class="item flex1">数量</span>
        <span class="item flex1">总金额</span>
        <span class="item order-time">下单时间</span>
      </div>
      <!--表格-->
      <div
        class="freezing-table-body"
        v-for="(item,index) in getOTCFreezingOrderList"
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
            买入
          </span>
          <!-- 类型卖出 -->
          <span
            class="item flex1"
            v-if="item.orderType === 'SELL'"
            :class="{ green: item.orderType === 'SELL' }"
          >
            卖出
          </span>
          <!-- 币种 -->
          <span class="item flex1">{{item.coinName}}</span>
          <!-- 价格 -->
          <span class="item flex1">{{item.price}}({{ item.currencyName }})</span>
          <!-- 数量 -->
          <span class="item flex1">{{item.pickCount}}({{ item.coinName }})</span>
          <!-- 总金额 -->
          <span class="item flex1">{{(item.price*item.pickCount).toFixed(2)}}({{ item.currencyName }})</span>
          <!-- 下单时间 -->
          <span class="item order-time">{{timeFormatting(item.createTime)}}</span>
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
        </div>
      </div>
      <div class="no-data" v-if="!getOTCFreezingOrderList.length">暂无数据</div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {timeFilter} from '../../../utils'
import {getQueryAllOrdersList} from '../../../utils/api/personal'
import {returnAjaxMessage} from '../../../utils/commonFunc'
import {createNamespacedHelpers, mapState} from 'vuex'
const {mapMutations} = createNamespacedHelpers('personal')
export default {
  components: {},
  // props,
  data () {
    return {
      // OTC冻结订单列表
      getOTCFreezingOrderList: []
    }
  },
  created () {
    require('../../../../static/css/list/Personal/FiatCoinContent/FiatCoinFreezingOrder.css')
    require('../../../../static/css/theme/day/Personal/FiatCoinContent/FiatCoinFreezingOrderDay.css')
    require('../../../../static/css/theme/night/Personal/FiatCoinContent/FiatCoinFreezingOrderNight.css')
    // 1.0 请求冻结中订单列表
    // this.getOTCFrezzingOrdersList()
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([]),
    // 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
      // return timeFilter(date, 'BIH')
    },
    // 2.0 请求冻结中订单列表
    async getOTCFrezzingOrdersList () {
      const data = await getQueryAllOrdersList({
        status: 'FROZEN' // 状态 (交易中 TRADING 已完成 COMPLETED  已取消  CANCELED 冻结中 FROZEN)
        // pageNum: '1',
        // pageSize: '10'
      })
      // console.log(data)
      // 提示信息
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑
        this.getOTCFreezingOrderList = data.data.data.list
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
  @import "../../../../static/css/scss/Personal/FiatCoinContent/FiatCoinFreezingOrder.scss";
  .fiat-freezing-order-box{
    >.freezing-order-content{
      >.freezing-table-head{
        box-sizing: border-box;
        /*width: 1043px;*/
        height: 35px;
        line-height: 35px;
        background-color: #1E2636;
        color: #617499;
        border: 1px solid #262F38;
        border-radius: 5px;
        margin-bottom: 5px;
        /*box-shadow:底边阴影;*/
        box-shadow: -2px 3px 5px 1px #191E28;
        >.item{
          display: inline-block;
          /*width: 140px;*/
          text-align: center;
        }
        >.order-time {
          width: 170px;
        }
      }
      >.freezing-table-body{
        box-sizing: border-box;
        /*width: 1043px;*/
        height: 170px;
        background-color: #1E2636;
        border: 1px solid #262F38;
        border-radius: 5px;
        margin-bottom: 15px;
        >.freezing-info-top{
          height: 40px;
          line-height: 40px;
          background-color: #1E2636;
          color: #617499;
          border-radius: 5px;
          .red{
            color: #D45858;
          }
          .green{
            color: #008069;
          }
          >.item{
            display: inline-block;
            /*width: 140px;*/
            text-align: center;
          }
          >.order-time {
            width: 170px;
          }
        }
        >.freezing-info-bottom{
          box-sizing: border-box;
          border-top: 1px solid #262F38;
          display: flex;
          flex: 7;
          padding: 30px 30px 0 30px;
          color: #9DA5B3;
          >.info-left{
            flex: 2;
            box-sizing: border-box;
            border-right: 1px solid #262F38;
            >.text-info{
              // line-height: 1.5rem;
              line-height: 20px;
            }
            >.text-blue{
              color: #5E95EC;
            }
          }
          >.info-middle{
            flex: 2;
            box-sizing: border-box;
            border-right: 1px solid #262F38;
            margin-left: 30px;
            >.text-info{
              // line-height: 1.5rem;
              line-height: 20px;
            }
            >.text-blue{
              color: #5E95EC;
            }
          }
          >.info-right{
            flex: 3;
            box-sizing: border-box;
            margin-left: 30px;
            >.text-info{
              // line-height: 1.5rem;
              line-height: 20px;
            }
            >.text-blue{
              color: #5E95EC;
            }
          }
        }
      }
      >.no-data{
        /*width: 1043px;*/
        height: 432px;
        line-height: 432px;
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
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      >.background-color{
        background-color: #CCCCCC;
      }
    }
  }
</style>
