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
        v-model="activeName"
        :tab-position = "tabPosition"
        @tab-click = "getLegalTradeData(activeName)"
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
               v-model="startTime"
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
               v-model="endTime"
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
              <el-button
                type="primary"
                @click="getLegalTradeData(activeName)"
              >查询</el-button>
              <!--<el-button type="primary" @click="resetCondition">重置</el-button>-->
            </span>
           </div>
        </div>
        <el-tab-pane
          label="交易中的订单"
          name="TRADING"
        >
          <FiatCoinTradingOrder ref = "tradeOrder"/>
        </el-tab-pane>
        <el-tab-pane
          label="已完成订单"
          name="COMPLETED"
        >
          <FiatCoinCompletedOrder ref = "cancelledOrder"/>
        </el-tab-pane>
        <el-tab-pane
          label="已取消订单"
          name="CANCELED"
        >
          <FiatCoinCanceledOrder ref = "completedOrder"/>
        </el-tab-pane>
        <el-tab-pane
          label="冻结中订单"
          name="FROZEN"
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
  getQueryAllOrdersList,
  getOTCEntrustingOrders
  // getOTCMerchantsOrdersList
} from '../../../utils/api/personal'
import {returnAjaxMessage} from '../../../utils/commonFunc'
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
      activeName: 'TRADING',
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
    // console.log(this.userInfo.userInfo.partnerId)
    this.getOTCAvailableCurrencyList()
    this.getMerchantAvailablelegalTenderList()
    // console.log(this.USER_ASSETS_LIST)
    this.getLegalTradeData(this.activeName)
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
      'USER_ASSETS_LIST',
      'SET_LEGAL_TENDER_LIST',
      'SET_LEGAL_TENDER_REFLASH_STATUS'
    ]),
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
    // startDate (e) {
    //   this.value1 = e
    // },
    // // 结束 日期赋值
    // endDate (e) {
    //   this.value2 = e
    // },
    resetCondition () {
      this.activitedMerchantsOrdersTraderStyleList = ''
      this.activitedMerchantsOrdersCoin = ''
      this.activitedMerchantsOrdersCurrency = ''
      this.activitedMerchantsOrdersStatusList = ''
      this.startTime = ''
      this.endTime = ''
      // this.getLegalTradeData()
    },
    // 页面加载时请求接口渲染列表
    async getLegalTradeData (activeName) {
      if (activeName === 'entrust-orders') {
        const params = {
          status: 'ENTRUSTED'
        }
        const data = await getOTCEntrustingOrders(params)
        if (!returnAjaxMessage(data, this)) {
          return false
        } else {
          console.log(data)
          this.SET_LEGAL_TENDER_LIST({
            type: activeName,
            data: data.data.data.list
          })
          // console.log(this.legalTraderTradingList)
          this.SET_LEGAL_TENDER_REFLASH_STATUS({
            type: activeName,
            status: false
          })
        }
      } else {
        let params = {
          // 币种
          coinId: this.activitedMerchantsOrdersCoin,
          // 法币
          currencyId: this.activitedMerchantsOrdersCurrency,
          // 状态
          status: activeName,
          // 开始时间
          startTime: this.startTime,
          // 结束时间
          endTime: this.endTime,
          // 类型
          tradeType: this.activitedMerchantsOrdersTraderStyleList
        }
        console.log(params)
        const data = await getQueryAllOrdersList(params)
        if (!returnAjaxMessage(data, this)) {
          return false
        } else {
          console.log(data)
          this.SET_LEGAL_TENDER_LIST({
            type: activeName,
            data: data.data.data.list
          })
          console.log(this.legalTraderTradingList)
          this.SET_LEGAL_TENDER_REFLASH_STATUS({
            type: activeName,
            status: false
          })
        }
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      withdrawDepositList: state => state.common.withdrawDepositList,
      legalTraderTradingList: state => state.personal.legalTraderTradingList,
      legalTraderTradingReflashStatus: state => state.personal.legalTraderTradingReflashStatus,
      legalTraderEntrustReflashStatus: state => state.personal.legalTraderEntrustReflashStatus,
      userInfo: state => state.user.loginStep1Info // 用户详细信息
      // fiatMoneyOrdersName: state => state.personal.fiatMoneyOrdersName
    })
  },
  watch: {
    legalTraderTradingReflashStatus (newVal) {
      console.log(newVal)
      if (newVal) {
        this.getLegalTradeData(this.activeName)
      }
    },
    legalTraderEntrustReflashStatus (newVal) {
      if (newVal) {
        this.getLegalTradeData(this.activeName)
      }
    }
  }
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
