<template>
  <div class="otc-merchants-orders-box otc">
    <!-- 1.0 导航 -->
    <NavCommon/>
    <!-- 2.0 商家订单 -->
    <div class="otc-merchants-orders-content">
      <!-- 2.1 大标题商家订单 -->
      <div class="merchants-title font-size20 padding-l15 font-weight700">
        商家订单
      </div>
      <!-- 2.2 商家订单主体内容 -->
      <div class="merchants-orders-main">
        <!-- 上部分筛选条件 -->
        <div class="orders-main-top">
          <span class="filtrate-text font-size14">交易类型</span>
          <span class="style-input">
            <el-select
              v-model="activitedMerchantsOrdersTraderStyleList"
              @change="changeMerchantsOrdersTraderStyleList"
            >
              <el-option
                v-for="item in merchantsOrdersTraderStyleList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </span>
          <span class="filtrate-text font-size14">状态</span>
          <span class="status-input">
            <el-select
              v-model="activitedMerchantsOrdersStatusList"
              @change="changeMerchantsOrdersStatusList"
            >
              <el-option
                v-for="item in merchantsOrdersStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </span>
          <span class="filtrate-text font-size14">日期</span>
          <span class="date-picker">
            <!--开始日期-->
            <el-date-picker
              placeholder="选择日期"
              v-model="value1"
              type="date"
              value-format="yyyy-MM-dd"
              @change="startDate"
            >
            </el-date-picker>
            <span class="date-short-line">-</span>
            <!--结束日期-->
            <el-date-picker
              placeholder="选择日期"
              v-model="value2"
              value-format="yyyy-MM-dd"
              type="date"
              @change="endDate"
            >
            </el-date-picker>
          </span>
          <span class="inquire-button">
            <el-button type="primary" @click="findFilter">查询</el-button>
            <el-button type="primary" @click="resetCondition">重置</el-button>
          </span>
          <!-- <span class="all-clear cursor-pointer">
            <span class="clear-text font-size12">全部清除筛选</span>
          </span> -->
        </div>
        <!-- 下部分表格内容 -->
        <div class="orders-main-bottom">
          <!-- 2.3 订单管理-->
          <div class="otc-order-manage">
            <el-tabs
              :tab-position = "tabPosition"
              @tab-click = "toggleTabPane"
              v-model = "activeName"
            >
              <!-- 2.2.1 交易中的订单 -->
              <el-tab-pane name = "first">
                <span slot="label">
                  <i
                    class="el-icon-caret-right otc-tab-pane-arrow-right"
                    v-show="activeName === 'first'">
                  </i>
                  <IconFontCommon
                    iconName="icon-shalou"
                  />
                  交易中订单
                </span>
                <OTCTradingOrder ref='OTCTradingOrder'></OTCTradingOrder>
              </el-tab-pane>
              <!-- 2.2.2 已完成订单 -->
              <el-tab-pane name = "second">
                <span slot="label">
                  <i
                    class="el-icon-caret-right otc-tab-pane-arrow-right"
                    v-show="activeName === 'second'">
                  </i>
                  <IconFontCommon
                    iconName="icon-msnui-task-complete"
                  />
                  已完成订单
                </span>
                <OTCCompletedOrder></OTCCompletedOrder>
              </el-tab-pane>
              <!-- 2.2.3 已取消订单 -->
              <el-tab-pane name = "third">
                <span slot="label">
                  <i
                    class="el-icon-caret-right otc-tab-pane-arrow-right"
                    v-show="activeName === 'third'">
                  </i>
                  <IconFontCommon
                    iconName="icon-cancel_order"
                  />
                  已取消订单
                </span>
                <OTCCanceledOrder></OTCCanceledOrder>
              </el-tab-pane>
              <!-- 2.2.4 冻结中订单 -->
              <el-tab-pane name = "fourth">
                <span slot="label">
                  <i
                    class="el-icon-caret-right otc-tab-pane-arrow-right"
                    v-show="activeName === 'fourth'">
                  </i>
                  <IconFontCommon
                    iconName="icon-dongjie"
                  />
                  冻结中订单
                </span>
                <OTCFreezingOrder></OTCFreezingOrder>
              </el-tab-pane>
              <!-- 2.2.5 委托订单 -->
              <el-tab-pane name = "fifth">
                <span slot="label">
                  <i
                    class="el-icon-caret-right otc-tab-pane-arrow-right"
                    v-show="activeName === 'fifth'">
                  </i>
                  <IconFontCommon
                    iconName="icon-daohang2"
                  />
                  委托订单
                </span>
                <OTCEntrustOrder></OTCEntrustOrder>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
    <!-- 3.0 底部 -->
    <FooterCommon/>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import NavCommon from '../Common/HeaderCommon'
import FooterCommon from '../Common/FooterCommon'
import IconFontCommon from '../Common/IconFontCommon'
import {timeFilter} from '../../utils'
// import {getOTCAvailableCurrency, getOTCPutUpOrders} from '../../utils/api/apiDoc'
import OTCTradingOrder from './OTCTradingOrder'
import OTCCompletedOrder from './OTCCompletedOrder'
import OTCCanceledOrder from './OTCCanceledOrder'
import OTCFreezingOrder from './OTCFreezingOrder'
import OTCEntrustOrder from './OTCEntrustOrder'
// import {returnAjaxMessage} from '../../utils/commonFunc'
// import {createNamespacedHelpers, mapState} from 'vuex'
// const {mapMutations} = createNamespacedHelpers('OTC')
export default {
  components: {
    NavCommon, //  头部导航
    FooterCommon, //  底部
    IconFontCommon, //  字体图标
    OTCTradingOrder, //  交易中订单
    OTCCompletedOrder, //  已完成订单
    OTCCanceledOrder, //  已取消订单
    OTCFreezingOrder, //  冻结中订单
    OTCEntrustOrder //  委托订单
  },
  data () {
    return {
      activeName: 'first', // 选中的tab面板的序号
      tabPosition: 'left', //  订单管理面板标签方向状态
      // 1.0 商家订单筛选下拉框数组--交易类型
      activitedMerchantsOrdersTraderStyleList: '', // 选中的筛选项
      merchantsOrdersTraderStyleList: [
        {
          value: 'BUY',
          label: '购买'
        },
        {
          value: 'SELL',
          label: '出售'
        }
      ],
      // 2.0 商家订单筛选下拉框数组--状态
      activitedMerchantsOrdersStatusList: '', // 选中的筛选项
      merchantsOrdersStatusList: [
        {
          value: 'ENTRUSTED',
          label: '已上架'
        },
        {
          value: 'CANCELED',
          label: '已下架'
        },
        {
          value: 'COMPLETED',
          label: '已完成'
        }
      ],
      value1: '', // 默认开始时间
      value2: '', // 默认结束时间
      // 商家订单列表
      merchantsOrdersList: [
        {
          id: 1,
          traderTime: 1302486032000,
          orderId: '20180515001',
          buySellStatus: 1, // 1:买 2：卖
          moneyStyle: 'CNY',
          payStyle: 1, // 1:支付宝 2：微信 3：银行卡 4：某某 5：啥啥
          transactionPrice: '251.25',
          tradingVolume: '1.2358',
          totalMoney: '5268.25',
          orderStatus: '已完成',
          otherName: '张无忌',
          complaintRecord: '无'
        },
        {
          id: 2,
          traderTime: 1302486032000,
          orderId: '20180515001',
          buySellStatus: 2, // 1:买 2：卖
          moneyStyle: 'CNY',
          payStyle: 2, // 1:支付宝 2：微信 3：银行卡 4：某某 5：啥啥
          transactionPrice: '251.25',
          tradingVolume: '1.2358',
          totalMoney: '5268.25',
          orderStatus: '已完成',
          otherName: '刘二黑',
          complaintRecord: '无'
        },
        {
          id: 3,
          traderTime: 1302486032000,
          orderId: '20180515001',
          buySellStatus: 1, // 1:买 2：卖
          moneyStyle: 'CNY',
          payStyle: 3, // 1:支付宝 2：微信 3：银行卡 4：某某 5：啥啥
          transactionPrice: '251.25',
          tradingVolume: '1.2358',
          totalMoney: '5268.25',
          orderStatus: '已完成',
          otherName: '赵敏',
          complaintRecord: '无'
        }
      ]
    }
  },
  created () {
    require('../../../static/css/list/OTC/OTCMerchantsOrders.css')
    require('../../../static/css/theme/day/OTC/OTCMerchantsOrdersDay.css')
    require('../../../static/css/theme/night/OTC/OTCMerchantsOrdersNight.css')
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'date')
    },
    // 选中的交易类型赋值
    changeMerchantsOrdersTraderStyleList (e) {
      this.activitedMerchantsOrdersTraderStyleList = e
    },
    // 选中的状态赋值
    changeMerchantsOrdersStatusList (e) {
      this.activitedMerchantsOrdersStatusList = e
    },
    // 初始日期赋值
    startDate (e) {
      this.value1 = e
    },
    // 结束日期赋值
    endDate (e) {
      this.value2 = e
    },
    // findFilter () {
    //   let param = {
    //     A:this.activitedMerchantsOrdersTraderStyleList, //获取选中的
    //     B:this.activitedMerchantsOrdersStatusList,
    //     C:this.value1,
    //     D:this.value2
    //   }
    //   if (this.activeName == 'first') {
    //     //当选中交易中订单时触发
    //      // this.$ref.OTCTradingOrder.
    //   } else if (this.activeName == 'second') {

    //   } else if (this.activeName == 'third') {

    //   } else if (this.activeName == 'fourth') {

    //   } else if (this.activeName == 'fifth') {

    //   }
    // },
    resetCondition () {
      this.activitedMerchantsOrdersTraderStyleList = ''
      this.activitedMerchantsOrdersStatusList = ''
      this.value1 = ''
      this.value2 = ''
    }
  },
  filter: {},
  computed: {},
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  @import url(../../../static/css/scss/OTC/OTCMerchantsOrders.scss);
  .otc-merchants-orders-box{
    background-color: #1D2331;
    >.otc-merchants-orders-content{
      width: 1150px;
      height: 1000px;
      margin: 70px auto;
      padding-top: 50px;
      >.merchants-title{
        height: 30px;
        line-height: 30px;
        color: #338FF5;
        border-left: 3px solid #338FF5;
        margin-bottom: 30px;
      }
      >.merchants-orders-main{
        >.orders-main-top{
          height: 60px;
          line-height: 60px;
          margin-bottom: 25px;
          padding-left: 10px;
          >.filtrate-text{
            color: #9DA5B3;
            margin-right: 10px;
          }
          >.style-input{
            margin-right: 30px;
          }
          >.status-input{
            margin-right: 30px;
          }
          >.date-picker{
            // margin-right: 80px;
            margin-right: 200px;
            >.date-short-line{
              margin: 0 3px;
            }
          }
          >.inquire-button{
            // margin-right: 100px;
          }
          >.all-clear{
            color: #338FF5;
          }
        }
        >.orders-main-bottom{
          >.otc-order-manage{
            height: 1200px;
            margin-top: 5px;
            .otc-tab-pane-arrow-right{
              position: absolute;
              right: -12px;
              top: 27px;
              font-size: 20px;
              color: #338FF5;
            }
            .icon{
              position: absolute;
              left: 35px;
              top: 22px;
            }
          }
        }
      }
    }
  }
</style>
