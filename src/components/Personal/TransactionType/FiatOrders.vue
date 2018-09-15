<template>
  <div
    class="fiat-orders personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="personal-height background-color line-height40 personal-height40 font-size16">
      <span class="padding-left15 fiat-color font-weight600">法币订单</span>
    </header>
    <div class="fiat-main background-color min-height500 margin-top9">
      <el-tabs
        v-model="fiatMoneyOrdersName"
        :tab-position = "tabPosition"
        @tab-click = "statusSwitchPanel"
      >
        <!-- 上部分筛选条件 -->
        <div class="orders-main-top">
          <div class="main-top-type trade-type float-left">
            <span class="filtrate-text font-size14">类型</span>
            <span class="style-input">
              <el-select
                v-model="activitedMerchantsOrdersTraderStyleList"
                @change="changeMerchantsOrdersTraderStyleList"
                clearable
                placeholder="全部"
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
          </div>
          <div class="main-top-type trade-type float-left">
           <span class="filtrate-text font-size14">币种</span>
           <span class="status-input">
           <el-select
             v-model="activitedMerchantsOrdersCoin"
             @change="changeMerchantsOrdersCoin"
             clearable
             placeholder="全部"
           >
             <el-option
               v-for="(item,index) in merchantsOrdersCoinList"
               :key="index"
               :label="item.name"
               :value="item.coinId"
             >
             </el-option>
           </el-select>
          </span>
          </div>
          <div class="main-top-type">
            <span class="filtrate-text font-size14">货币</span>
            <span class="status-input">
              <el-select
                v-model="activitedMerchantsOrdersCurrency"
                @change="changeMerchantsOrdersCurrency"
                clearable
                placeholder="全部"
              >
                <el-option
                  v-for="(item,index) in merchantsOrdersCurrencyList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </span>
           </div>
          <div class="main-top-type trade-data float-left">
            <span class="filtrate-text font-size14">起止日期</span>
            <span class="date-picker">
             <!--开始日期-->
             <el-date-picker
               placeholder="选择日期"
               v-model="value1"
               type="date"
               value-format="yyyy-MM-dd"
               @change="startDate"
               clearable
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
               clearable
             >
             </el-date-picker>
            </span>
          </div>
          <div class="main-top-type float-left">
             <span class="inquire-button">
              <el-button type="primary" @click="findFilter">查询</el-button>
              <!--<el-button type="primary" @click="resetCondition">重置</el-button>-->
            </span>
           </div>
        </div>
        <el-tab-pane
          label="交易中的订单"
          name="trade-order"
        >
          <FiatCoinTradingOrder ref = "tradeOrder"/>
        </el-tab-pane>
        <el-tab-pane
          label="已完成订单"
          name="completed-order"
        >
          <FiatCoinCompletedOrder ref = "cancelledOrder"/>
        </el-tab-pane>
        <el-tab-pane
          label="已取消订单"
          name="cancelled-order"
        >
          <FiatCoinCanceledOrder ref = "completedOrder"/>
        </el-tab-pane>
        <el-tab-pane
          label="冻结中订单"
          name="pending-order"
        >
          <FiatCoinFreezingOrder ref = "pendingOrder"/>
        </el-tab-pane>
        <el-tab-pane
          label="委托订单"
          name="entrust-orders"
        >
          <FiatCoinEntrustOrder ref = "entrustOrders"/>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import FiatCoinTradingOrder from '../FiatCoinContent/FiatCoinTradingOrder'
import FiatCoinCanceledOrder from '../FiatCoinContent/FiatCoinCanceledOrder'
import FiatCoinCompletedOrder from '../FiatCoinContent/FiatCoinCompletedOrder'
import FiatCoinFreezingOrder from '../FiatCoinContent/FiatCoinFreezingOrder'
import FiatCoinEntrustOrder from '../FiatCoinContent/FiatCoinEntrustOrder'
import {createNamespacedHelpers, mapState} from 'vuex'
import {timeFilter} from '../../../utils'
import IconFontCommon from '../../Common/IconFontCommon'
import {
  getOTCAvailableCurrency,
  getMerchantAvailablelegalTender,
  getOTCMerchantsOrdersList
} from '../../../utils/api/personal'
import {returnAjaxMessage, getAllList} from '../../../utils/commonFunc'
const {mapMutations} = createNamespacedHelpers('personal')
export default {
  components: {
    IconFontCommon, //  字体图标
    FiatCoinTradingOrder, //  交易中订单
    FiatCoinCanceledOrder, //  已完成订单
    FiatCoinCompletedOrder, //  已取消订单
    FiatCoinFreezingOrder, //  冻结中订单
    FiatCoinEntrustOrder //  委托订单
  },
  // props,
  data () {
    return {
      // activeName: 'first',
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
      // 商家订单筛选下拉框 币种
      activitedMerchantsOrdersCoin: '',
      merchantsOrdersCoinList: [],
      // 商家订单筛选下拉框 法币
      activitedMerchantsOrdersCurrency: '',
      merchantsOrdersCurrencyList: [],
      // 2.0 商家订单筛选下拉框数组--状态
      activitedMerchantsOrdersStatusList: '', // 选中的筛选项
      merchantsOrdersStatusList: [
        {
          value: 'PAYED',
          label: '已付款'
        },
        {
          value: 'PICKED',
          label: '未付款'
        },
        {
          value: 'COMPLETED ',
          label: '已完成'
        },
        {
          value: 'CANCELED',
          label: '已取消'
        },
        {
          value: 'FROZEN',
          label: '已冻结'
        }
      ],
      startTime: '', // 默认开始时间
      endTime: '', // 默认结束时间
      // 商家订单列表
      merchantsOrdersList: []
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/TransactionType/FiatOrders.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/TransactionType/FiatOrdersDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/TransactionType/FiatOrdersNight.css')
    console.log(this.userInfo.userInfo.partnerId)
    this.getOTCAvailableCurrencyList()
    this.getMerchantAvailablelegalTenderList()
    console.log(this.USER_ASSETS_LIST)
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_OTC_AVAILABLE_CURRENCY_NAME',
      'CHANGE_OTC_AVAILABLE_CURRENCY_ID',
      'CHANGE_OTC_AVAILABLE_PARTNER_COIN_ID',
      'USER_ASSETS_LIST'
    ]),
    // tab面板切换
    statusSwitchPanel (tab) {
      getAllList(this.$route, this.$message)
      // switch (tab.name) {
      //   case 'trade-order':
      //     // 交易中的订单列表展示
      //     this.$refs.tradeOrder.getOTCTradingOrdersList()
      //     break
      //   case 'completed-order':
      //     // 已完成订单列表展示
      //     this.$refs.cancelledOrder.getOTCCompletedOrdersList()
      //     break
      //   case 'cancelled-order':
      //     // 已取消订单列表查询
      //     this.$refs.completedOrder.getOTCCanceledOrdersList()
      //     break
      //   case 'pending-order':
      //     // 冻结中订单列表展示
      //     this.$refs.pendingOrder.getOTCFrezzingOrdersList()
      //     break
      //   case 'entrust-orders':
      //     // 委托订单列表展示
      //     this.$refs.entrustOrders.getOTCEntrustingOrdersList()
      //     break
      // }
    },
    // 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'date')
    },
    // 页面加载时 可用币种查询
    async getOTCAvailableCurrencyList () {
      const data = await getOTCAvailableCurrency({
        partnerId: this.userInfo.userInfo.partnerId
      })
      console.log('可用币种列表')
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑
        this.merchantsOrdersCoinList = data.data.data
      }
    },
    // 页面加载时 可用法币查询
    async getMerchantAvailablelegalTenderList () {
      const data = await getMerchantAvailablelegalTender({
        partnerId: this.userInfo.userInfo.partnerId
      })
      console.log('可用法币')
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑
        this.merchantsOrdersCurrencyList = data.data.data
      }
    },
    // 选中交易 类型 赋值
    changeMerchantsOrdersTraderStyleList (e) {
      this.activitedMerchantsOrdersTraderStyleList = e
    },
    // 选中 币种 状态赋值
    changeMerchantsOrdersCoin (e) {
      this.activitedMerchantsOrdersCoin = e
    },
    // 选中 货币 状态赋值
    changeMerchantsOrdersCurrency (e) {
      this.activitedMerchantsOrdersCurrency = e
    },
    // 选中 状态 赋值
    changeMerchantsOrdersStatusList (e) {
      this.activitedMerchantsOrdersStatusList = e
    },
    // 初始 日期赋值
    startDate (e) {
      this.value1 = e
    },
    // 结束 日期赋值
    endDate (e) {
      this.value2 = e
    },
    // 点击查询按钮
    findFilter (tab) {
      switch (tab.name) {
        case 'trade-order':
          // 交易中的订单列表展示
          this.$refs.tradeOrder.getOTCTradingOrdersList()
          break
        case 'completed-order':
          // 已完成订单列表展示
          this.$refs.cancelledOrder.getOTCCompletedOrdersList()
          break
        case 'cancelled-order':
          // 已取消订单列表查询
          this.$refs.completedOrder.getOTCCanceledOrdersList()
          break
        case 'pending-order':
          // 冻结中订单列表展示
          this.$refs.pendingOrder.getOTCFrezzingOrdersList()
          break
        case 'entrust-orders':
          // 委托订单列表展示
          this.$refs.entrustOrders.getOTCEntrustingOrdersList()
          break
      }
      // this.getOTCEntrustingOrdersRevocation()
    },
    resetCondition () {
      this.activitedMerchantsOrdersTraderStyleList = ''
      this.activitedMerchantsOrdersCoin = ''
      this.activitedMerchantsOrdersCurrency = ''
      this.activitedMerchantsOrdersStatusList = ''
      this.startTime = ''
      this.endTime = ''
      this.getOTCEntrustingOrdersRevocation()
    },
    // 页面加载时请求接口渲染列表
    async getOTCEntrustingOrdersRevocation () {
      let data = await getOTCMerchantsOrdersList({
        // 页数
        // pageNum: 0,
        // 每页条数
        // pageSize: 0,
        // 币种
        coinId: this.activitedMerchantsOrdersCoin,
        // 法币
        currencyId: this.activitedMerchantsOrdersCurrency,
        // 状态
        status: this.activitedMerchantsOrdersStatusList,
        // 开始时间
        startTime: this.startTime,
        // 结束时间
        endTime: this.endTime,
        // 类型
        tradeType: this.activitedMerchantsOrdersTraderStyleList
      })
      // 提示信息
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑 重新渲染列表
        this.merchantsOrdersList = data.data.data.list
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      withdrawDepositList: state => state.common.withdrawDepositList,
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      fiatMoneyOrdersName: state => state.personal.fiatMoneyOrdersName
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/TransactionType/CoinOrders";
.fiat-orders {
  .fiat-main {
    .orders-main-top{
      height: 100px;
      margin-bottom: 25px;
      padding: 0 25px;
      .trade-type {
        width: 250px;
      }
      .trade-data {
        width: 500px;
      }
      .main-top-type {
        height: 50px;
        line-height: 50px;
        >.filtrate-text {
          margin-right: 5px;
        }
        >.style-input {}
        >.date-picker {}
        .date-short-line {
          margin: 0 25px;
        }
        >.inquire-button {}
      }
      >.filtrate-text{
        color: #9DA5B3;
        // margin-right: 10px;
      }
      >.style-input{
        // margin-right: 30px;
      }
      >.status-input{
        // margin-right: 30px;
      }
      >.date-picker{
        // margin-right: 80px;
        // margin-right: 200px;
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
