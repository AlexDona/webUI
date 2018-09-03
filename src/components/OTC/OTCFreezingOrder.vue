<template>
  <div class="otc-freezing-order-box otc">
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
          <span class="item">{{item.orderId}}</span>
          <!-- 类型 买入 -->
          <span
            class="item"
            v-if="item.style === '买入'"
            :class="{ red: item.style === '买入' }"
          >
            {{item.style}}
          </span>
          <!-- 类型卖出 -->
          <span
            class="item"
            v-if="item.style === '卖出'"
            :class="{ green: item.style === '卖出' }"
          >
            {{item.style}}
          </span>
          <!-- 币种 -->
          <span class="item">{{item.coinName}}</span>
          <!-- 价格 -->
          <span class="item">{{item.price}}</span>
          <!-- 数量 -->
          <span class="item">{{item.sum}}</span>
          <!-- 总金额 -->
          <span class="item">{{item.totalMoney}}</span>
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
              <span>姓名：</span><span>{{item.buyerName}}</span>
            </p>
            <p class="text-info">
              <span>卖家手机号：</span><span>{{item.buyerPhone}}</span>
            </p>
          </div>
          <div class="info-right">
            <p class="text-info text-blue">冻结时间</p>
            <p class="text-info">{{timeFormatting(item.freezingTime)}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {timeFilter} from '../../utils'
import {getOTCFrezzingOrders} from '../../utils/api/apiDoc'
import {returnAjaxMessage} from '../../utils/commonFunc'
export default {
  components: {},
  // props,
  data () {
    return {
      // OTC冻结订单列表
      getOTCFreezingOrderList: [
        {
          orderId: '20180812111111',
          style: '买入',
          coinName: 'BTC',
          price: '567812.12',
          sum: '0.0012345',
          totalMoney: '20180812123456',
          createTime: 1523756432000,
          sellerName: '张三封',
          sellerPhone: '15711111111',
          buyerName: '任付伟',
          buyerPhone: '15722222222',
          freezingTime: 1523756432000
        },
        {
          orderId: '20180812222222',
          style: '卖出',
          coinName: 'BTC',
          price: '567812.12',
          sum: '0.0012345',
          totalMoney: '20180812123456',
          createTime: 1523756432000,
          sellerName: '张三封',
          sellerPhone: '15711111111',
          buyerName: '任付伟',
          buyerPhone: '15722222222',
          freezingTime: 1523756432000
        },
        {
          orderId: '20180812222222',
          style: '卖出',
          coinName: 'BTC',
          price: '567812.12',
          sum: '0.0012345',
          totalMoney: '20180812123456',
          createTime: 1523756432000,
          sellerName: '张三封',
          sellerPhone: '15711111111',
          buyerName: '任付伟',
          buyerPhone: '15722222222',
          freezingTime: 1523756432000
        }
      ]
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
    // 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
    },
    // 2.0 请求冻结中订单列表
    async getOTCFrezzingOrdersList () {
      const data = await getOTCFrezzingOrders({
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
      }
    }
  },
  filter: {},
  computed: {},
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  @import url(../../../static/css/scss/OTC/OTCFreezingOrder.scss);
  .otc-freezing-order-box{
    .freezing-order-content{
      .freezing-table-head{
        box-sizing: border-box;
        width: 1043px;
        height: 35px;
        line-height: 35px;
        background-color: #202A33;
        color: #617499;
        border: 1px solid #262F38;
        border-radius: 5px;
        margin-bottom: 5px;
        /*box-shadow:底边阴影;*/
        box-shadow: -2px 3px 5px 1px #191E28;
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
        background-color: #202A33;
        border: 1px solid #262F38;
        border-radius: 5px;
        margin-bottom: 15px;
        >.freezing-info-top{
          height: 40px;
          line-height: 40px;
          background-color: #202A33;
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
            width: 140px;
            text-align: center;
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
    }
  }
</style>
