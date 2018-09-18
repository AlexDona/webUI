<template>
  <div class="otc-report-form-statistics-box otc">
    <!-- 1.0 导航 -->
    <NavCommon/>
    <!-- 2.0 -->
    <div class="report-form-statistics-content">
      <!-- 2.1 报表统计标题 -->
      <div class="report-form-title font-size20 padding-l15 font-weight700">
        报表统计
      </div>
      <!-- 2.2 筛选条件 -->
      <div class="report-form-filtrate">
        <span class="filtrate-text font-size14">
          交易币种
        </span>
        <span class="currency-input">
          <el-select
            v-model="activitedTraderCoinId"
            @change="changeCoinId"
            clearable
          >
            <el-option
              v-for="(item,index) in traderCoinList"
              :key="index"
              :value="item.coinId"
              :label="item.name"
            >
              {{ item.name }}
            </el-option>
          </el-select>
        </span>
        <span class="filtrate-text font-size14">
          交易法币
        </span>
        <span class="legal-tender-input">
          <el-select
            v-model="activitedtraderCurrencyCoinsId"
            @change="changeCurrencyCoinsId"
            clearable
          >
            <el-option
              v-for="(item,index) in traderCurrencyCoinsList"
              :key="index"
              :value="item.id"
              :label="item.name"
            >
              {{ item.name }}
            </el-option>
          </el-select>
        </span>
      </div>
      <!-- 2.3 资产配置 -->
      <div class="report-form-asset">
        <div class="title padding-l15 border-radius5">
          资产配置
        </div>
        <div class="content font-size18">
          <!-- 总资产可用币种 -->
          <span>{{total}}</span>
          <span>{{activitedTraderCoinName}}</span>
          <span>≈</span>
          <!-- 总资产法币 -->
          <span>{{totalAssets}}</span>
          <span>{{activitedtraderCurrencyCoinsName}}</span>
        </div>
      </div>
      <!-- 2.4 购买和销售 -->
      <div class="report-form-buy-sell">
        <div class="common buy">
          <div class="head padding-l15 border-radius5">
            购买
          </div>
          <div class="body">
            <div class="together border-radius5 day">
              <div class="left">
                <span class="round font-size12">
                  当日<br />交易
                </span>
              </div>
              <div class="right">
                <p>
                  <span>购买数量:</span><span class="data">{{ buyDayMap.count }}{{ activitedTraderCoinName }}</span>
                </p>
                <p>
                  <span>购买均价:</span><span class="data"> {{ buyDayMap.average }}{{ activitedtraderCurrencyCoinsName }}</span>
                </p>
                <p>
                  <span>支出金额:</span><span class="data"> {{ buyDayMap.amount }}{{ activitedtraderCurrencyCoinsName }}</span>
                </p>
                <p>
                  <span>成交订单:</span><span class="data"> {{ buyDayMap.num }}笔</span>
                </p>
              </div>
            </div>
            <div class="together border-radius5 week">
              <div class="left">
                <span class="round font-size12">
                  本周<br />交易
                </span>
              </div>
              <div class="right">
                <p>
                  <span>购买数量:</span><span class="data"> {{ buyWeekMap.count }}{{ activitedTraderCoinName }}</span>
                </p>
                <p>
                  <span>购买均价:</span><span class="data">{{ buyWeekMap.average }}{{ activitedtraderCurrencyCoinsName }}</span>
                </p>
                <p>
                  <span>支出金额:</span><span class="data">{{ buyWeekMap.amount }}{{ activitedtraderCurrencyCoinsName }}</span>
                </p>
                <p>
                  <span>成交订单:</span><span class="data"> {{ buyWeekMap.num }}笔</span>
                </p>
              </div>
            </div>
            <div class="together border-radius5 month">
              <div class="left">
                <span class="round font-size12">
                  本月<br />交易
                </span>
              </div>
              <div class="right">
                <p>
                  <span>购买数量:</span><span class="data">{{ buyMonthMap.count }}{{ activitedTraderCoinName }}</span>
                </p>
                <p>
                  <span>购买均价:</span><span class="data"> {{ buyMonthMap.average }}{{ activitedtraderCurrencyCoinsName }}</span>
                </p>
                <p>
                  <span>支出金额:</span><span class="data"> {{ buyMonthMap.amount }}{{ activitedtraderCurrencyCoinsName }}</span>
                </p>
                <p>
                  <span>成交订单:</span><span class="data"> {{ buyMonthMap.num }}笔</span>
                </p>
              </div>
            </div>
            <div class="together border-radius5 history">
              <div class="left">
                <span class="round font-size12">
                  历史<br />交易
                </span>
              </div>
              <div class="right">
                <p>
                  <span>购买数量:</span><span class="data"> {{ buyHistoryMap.count }}{{ activitedTraderCoinName }}</span>
                </p>
                <p>
                  <span>购买均价:</span><span class="data">{{ buyHistoryMap.average }}{{ activitedtraderCurrencyCoinsName }}</span>
                </p>
                <p>
                  <span>支出金额:</span><span class="data">{{ buyHistoryMap.amount }}{{ activitedtraderCurrencyCoinsName }}</span>
                </p>
                <p>
                  <span>成交订单:</span><span class="data"> {{ buyHistoryMap.num }}笔</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="common sell">
          <div class="head padding-l15 border-radius5">
            销售
          </div>
          <div class="body">
            <div class="together border-radius5 day">
              <div class="left">
                <span class="round font-size12">
                  当日<br />交易
                </span>
              </div>
              <div class="right">
                <p>
                  <span>购买数量:</span><span class="data">{{ sellDayMap.count }}{{ activitedTraderCoinName }}</span>
                </p>
                <p>
                  <span>购买均价:</span><span class="data">{{ sellDayMap.average }}{{ activitedtraderCurrencyCoinsName }}</span>
                </p>
                <p>
                  <span>支出金额:</span><span class="data">{{ sellDayMap.amount }}{{ activitedtraderCurrencyCoinsName }}</span>
                </p>
                <p>
                  <span>成交订单:</span><span class="data">{{ sellDayMap.num }}笔</span>
                </p>
              </div>
            </div>
            <div class="together border-radius5 week">
              <div class="left">
                <span class="round font-size12">
                  本周<br />交易
                </span>
              </div>
              <div class="right">
                <p>
                  <span>购买数量:</span><span class="data"> {{ sellWeekMap.count }}{{ activitedTraderCoinName }}</span>
                </p>
                <p>
                  <span>购买均价:</span><span class="data"> {{ sellWeekMap.average }}{{ activitedtraderCurrencyCoinsName }}</span>
                </p>
                <p>
                  <span>支出金额:</span><span class="data">{{ sellWeekMap.amount }}{{ activitedtraderCurrencyCoinsName }}</span>
                </p>
                <p>
                  <span>成交订单:</span><span class="data">{{ sellWeekMap.num }}笔</span>
                </p>
              </div>
            </div>
            <div class="together border-radius5 month">
              <div class="left">
                <span class="round font-size12">
                  本月<br />交易
                </span>
              </div>
              <div class="right">
                <p>
                  <span>购买数量:</span><span class="data"> {{ sellMonthMap.count }}{{ activitedTraderCoinName }}</span>
                </p>
                <p>
                  <span>购买均价:</span><span class="data"> {{ sellMonthMap.average }}{{ activitedtraderCurrencyCoinsName }}</span>
                </p>
                <p>
                  <span>支出金额:</span><span class="data"> {{ sellMonthMap.amount }}{{ activitedtraderCurrencyCoinsName }}</span>
                </p>
                <p>
                  <span>成交订单:</span><span class="data"> {{ sellMonthMap.num }}{{ activitedTraderCoinName }}笔</span>
                </p>
              </div>
            </div>
            <div class="together border-radius5 history">
              <div class="left">
                <span class="round font-size12">
                  历史<br />交易
                </span>
              </div>
              <div class="right">
                <p>
                  <span>购买数量:</span><span class="data"> {{ sellHistoryMap.count }}{{ activitedTraderCoinName }}</span>
                </p>
                <p>
                  <span>购买均价:</span><span class="data"> {{ sellHistoryMap.average }}{{ activitedtraderCurrencyCoinsName }}</span>
                </p>
                <p>
                  <span>支出金额:</span><span class="data"> {{ sellHistoryMap.amount }}{{ activitedtraderCurrencyCoinsName }}</span>
                </p>
                <p>
                  <span>成交订单:</span><span class="data"> {{ sellHistoryMap.num }}笔</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 2.5 订单详情 -->
      <div class="report-form-details">
        <!-- 2.5.1 标题 -->
        <div class="title padding-l15 border-radius5">
          订单详情
        </div>
        <!-- 主要内容 -->
        <div class="content">
          <!-- 2.5.2 选择日期 -->
          <div class="date">
            <!-- 左侧日历 -->
            <div class="select-date">
              <span class="text">日期</span>
              <span class="date-picker">
                <!--开始日期-->
                <el-date-picker
                  placeholder="选择日期"
                  v-model="value1"
                  type="date"
                  value-format="yyyy-MM-dd"
                  @change="startTime"
                >
                </el-date-picker>
                <span class="date-short-line">-</span>
                <!--结束日期-->
                <el-date-picker
                  placeholder="选择日期"
                  v-model="value2"
                  value-format="yyyy-MM-dd"
                  type="date"
                  @change="endTime"
                >
                </el-date-picker>
              </span>
            </div>
            <!-- 右侧单选日期按钮 -->
            <div class="radio-date">
              <el-radio-group v-model="activedRadioId" @change="radioChouse">
                <el-radio :label="1">当日</el-radio>
                <el-radio :label="2">本周</el-radio>
                <el-radio :label="3">本月</el-radio>
                <el-radio :label="4">历史</el-radio>
              </el-radio-group>
            </div>
          </div>
          <!-- 2.5.3 订单表格详情 -->
          <div class="order-table">
            <el-table
              :data = "orderInfoList"
              style = "width: 100%"
              empty-text="暂无数据"
            >
              <!-- 交易日期 -->
              <el-table-column
                label = "交易日期"
                width="180"
              >
                <template slot-scope = "scope">
                    <div>{{timeFormatting(scope.row.createTime)}}</div>
                </template>
              </el-table-column>
              <!-- 订单号 -->
              <el-table-column
                label = "订单号"
              >
                <template slot-scope = "scope">
                  <div>{{scope.row.orderSequence}}</div>
                </template>
              </el-table-column>
              <!-- 交易类型 -->
              <el-table-column
                label = "交易类型"
              >
                <template slot-scope = "scope">
                  <div
                    v-if="scope.row.orderType === 'BUY'"
                    :class="{red:scope.row.orderType === 'BUY'}"
                  >
                    购买
                  </div>
                  <div
                    v-if="scope.row.orderType === 'SELL'"
                    :class="{green:scope.row.orderType === 'SELL'}"
                  >
                    出售
                  </div>
                </template>
              </el-table-column>
              <!-- 资金类型 -->
              <el-table-column
                label = "资金类型"
              >
                <template slot-scope = "scope">
                  <div>{{scope.row.currencyName}}</div>
                </template>
              </el-table-column>
              <!-- 数量 -->
              <el-table-column
                label = "数量"
              >
                <template slot-scope = "scope">
                  <div>{{scope.row.pickCount}}</div>
                </template>
              </el-table-column>
              <!-- 单价 -->
              <el-table-column
                label = "单价"
              >
                <template slot-scope = "scope">
                  <div>{{scope.row.price}}</div>
                </template>
              </el-table-column>
              <!-- 总金额 -->
              <el-table-column
                label = "总金额"
              >
                <template slot-scope = "scope">
                  <div>{{scope.row.payAmount}}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!--分页-->
          <div class="page">
            <el-pagination
              background
              v-show="orderInfoList.length"
              layout="prev, pager, next"
              :page-count="totalPages"
              @current-change="changeCurrentPage"
            >
            </el-pagination>
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
import {getOTCAvailableCurrency, getMerchantAvailablelegalTender, getOTCMerchantsOrdersList, getOTCReportFormStatisticsData} from '../../utils/api/OTC'
import NavCommon from '../Common/HeaderCommon'
import FooterCommon from '../Common/FooterCommon'
import IconFontCommon from '../Common/IconFontCommon'
import {timeFilter} from '../../utils'
import {createNamespacedHelpers, mapState} from 'vuex'
import {returnAjaxMessage} from '../../utils/commonFunc'
const {mapMutations} = createNamespacedHelpers('OTC')
export default {
  components: {
    NavCommon, //  头部导航
    FooterCommon, //  底部
    IconFontCommon //  字体图标
  },
  data () {
    return {
      // 分页
      pageSize: 10,
      currentPage: 1, // 当前页码
      totalPages: 1, // 总页数
      // 1.0 广告管理筛选下拉框数组--交易币种
      traderCoinList: [],
      activitedTraderCoinId: '', // 选中的交易币种id
      activitedTraderCoinName: '', // 选中的交易币种name
      // 2.0 广告管理筛选下拉框数组--交易法币
      traderCurrencyCoinsList: [],
      activitedtraderCurrencyCoinsId: '', // 选中的交易法币id
      activitedtraderCurrencyCoinsName: '', // 选中的交易法币name
      value1: '', // 默认开始时间
      value2: '', // 默认结束时间
      activedRadioId: '', // 单选按钮时间
      totalAssets: '', // 总资产
      total: '',
      // 订单详情
      orderInfoList: [],
      buyDayMap: {}, // 购买当日交易
      buyHistoryMap: {}, // 购买历史交易
      buyMonthMap: {}, // 购买当月交易
      buyWeekMap: {}, // 购买本周交易
      sellDayMap: {}, // 出售当日交易
      sellHistoryMap: {}, // 出售历史交易
      sellMonthMap: {}, // 出售本月交易
      sellWeekMap: {} // 出售本周交易
    }
  },
  async created () {
    require('../../../static/css/list/OTC/OTCReportFormStatistics.css')
    require('../../../static/css/theme/day/OTC/OTCReportFormStatisticsDay.css')
    require('../../../static/css/theme/night/OTC/OTCReportFormStatisticsNight.css')
    // 1.0 otc可用币种查询
    this.getOTCAvailableCurrencyList()
    // 2.0 查询可用法币币种列表
    // this.getMerchantAvailablelegalTenderList()
    // 订单详情列表
    // this.getOTCEntrustingOrdersRevocation()
    // 报表统计主页
    // this.getOTCReportFormStatistics()
  },
  mounted () {
  },
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      // 'CHANGE_OTC_MERCHANT_AND_COMMON_MINCOUNT'
    ]),
    // 分页
    changeCurrentPage (pageNum) {
      console.log(pageNum)
      this.currentPage = pageNum
      this.getOTCEntrustingOrdersRevocation()
    },
    // 1.0 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
    },
    //  2.0 otc可用币种查询
    async getOTCAvailableCurrencyList () {
      const data = await getOTCAvailableCurrency({
        partnerId: this.partnerId
      })
      console.log('otc可用币种查询')
      console.log(data)
      // 提示信息
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑
        this.traderCoinList = data.data.data
        // 设置币种默认选中值
        this.activitedTraderCoinId = this.traderCoinList[0].coinId
        // 设置币种默认选中值的名称
        this.activitedTraderCoinName = this.traderCoinList[0].name
        // 重新请求列表
        // this.getOTCReportFormStatistics()
        // 表格渲染
        // this.getOTCEntrustingOrdersRevocation()
        // 法币列表
        this.getMerchantAvailablelegalTenderList()
      }
    },
    //  2.1 改变可用币种类型
    changeCoinId (e) {
      // console.log(e)
      this.activitedTraderCoinId = e
      this.traderCoinList.forEach(item => {
        // console.log(item)
        // console.log(item.coinId)
        if (e === item.coinId) {
          // console.log(item.name)
          this.activitedTraderCoinName = item.name
          console.log(this.activitedTraderCoinName)
        }
      })
      this.getOTCReportFormStatistics()
      this.getOTCEntrustingOrdersRevocation()
    },
    //  3.0 查询 可用法币 币种列表
    async getMerchantAvailablelegalTenderList () {
      const data = await getMerchantAvailablelegalTender({
        partnerId: this.partnerId
      })
      console.log('查询 可用法币 币种列表')
      console.log(data)
      // 提示信息
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑 将币种列表赋值
        this.traderCurrencyCoinsList = data.data.data
        // 设置法币默认选中值
        this.activitedtraderCurrencyCoinsId = this.traderCurrencyCoinsList[0].id
        // 设置法币默认选中值的name
        this.activitedtraderCurrencyCoinsName = this.traderCurrencyCoinsList[0].shortName
        // 重新请求列表
        // this.getOTCReportFormStatistics()
        // 表格渲染
        this.getOTCEntrustingOrdersRevocation()
      }
    },
    //  3.1 改变 可用法币 币种类型
    changeCurrencyCoinsId (e) {
      this.activitedtraderCurrencyCoinsId = e
      this.traderCurrencyCoinsList.forEach(item => {
        // console.log(item)
        // console.log(item.coinId)
        if (e === item.id) {
          this.activitedtraderCurrencyCoinsName = item.shortName
        }
      })
      this.getOTCReportFormStatistics()
      this.getOTCEntrustingOrdersRevocation()
    },
    startTime (e) {
      this.value1 = e
      this.activedRadioId = ''
      this.getOTCEntrustingOrdersRevocation()
    },
    endTime (e) {
      this.value2 = e
      this.activedRadioId = ''
      this.getOTCEntrustingOrdersRevocation()
    },
    radioChouse (e) {
      // console.log(e)
      this.activedRadioId = e
      if (e == '4') {
        this.value1 = ''
        this.value2 = ''
      }
      // console.log(this.value1)
      // console.log(this.value2)
      this.getOTCEntrustingOrdersRevocation()
    },
    // 报表统计的主页面
    async getOTCReportFormStatistics () {
      let data = await getOTCReportFormStatisticsData({
        // 币种
        coinId: this.activitedTraderCoinId,
        // 法币
        currencyId: this.activitedtraderCurrencyCoinsId
      })
      // 提示信息
      console.log('资产信息')
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑
        // 总资产人名币赋值
        this.totalAssets = data.data.data.totalAssets
        this.total = data.data.data.total
        // 当天交易
        this.buyDayMap = data.data.data.buyDayMap
        // 购买历史交易赋值
        this.buyHistoryMap = data.data.data.buyHistoryMap
        // 购买本月赋值
        this.buyMonthMap = data.data.data.buyMonthMap
        // 购买本周赋值
        this.buyWeekMap = data.data.data.buyWeekMap
        // 出售当天赋值
        this.sellDayMap = data.data.data.sellDayMap
        // 出售历史赋值
        this.sellHistoryMap = data.data.data.sellHistoryMap
        // 出售当月赋值
        this.sellMonthMap = data.data.data.sellMonthMap
        // 出售本周赋值
        this.sellWeekMap = data.data.data.sellWeekMap
      }
    },
    // 页面加载时请求接口渲染订单详情列表
    async getOTCEntrustingOrdersRevocation () {
      let data = await getOTCMerchantsOrdersList({
        // 当前页数
        pageNum: this.currentPage,
        // 每页条数
        pageSize: this.pageSize,
        // 币种
        coinId: this.activitedTraderCoinId,
        // 法币
        currencyId: this.activitedtraderCurrencyCoinsId,
        // 开始时间
        startTime: this.value1,
        // 结束时间
        endTime: this.value2,
        // 日期类型
        dateType: this.activedRadioId
      })
      // 提示信息
      console.log('报表列表')
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑 重新渲染列表
        this.orderInfoList = data.data.data.list
        // 分页
        this.totalPages = data.data.data.pages - 0
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      // 商户id
      partnerId: state => state.common.partnerId,
      // 测试拿到userinfo
      userInfo: state => state.personal.userInfo
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
@import url(../../../static/css/scss/OTC/OTCReportFormStatistics.scss);
.otc-report-form-statistics-box{
  background-color: #121824;
  >.report-form-statistics-content{
    width: 1150px;
    margin: 70px auto;
    padding-top: 50px;
    margin-bottom: 10px;
    >.report-form-title{
      height: 30px;
      line-height: 30px;
      color: #338FF5;
      border-left: 3px solid #338FF5;
      margin-bottom: 30px;
    }
    >.report-form-filtrate{
      >.filtrate-text{
        color: #9DA5B3;
        margin-right: 20px;
      }
      >.currency-input{
        margin-right: 50px;
      }
      >.legal-tender-input{
      }
    }
    >.report-form-asset{
      color: #338FF5;
      background-color: #1E2636;
      margin-top: 20px;
      >.title{
        height: 40px;
        line-height: 40px;
        border: 1px solid #262F38;
        box-shadow: 0px 4px 6px #191E28;
      }
      >.content{
        text-align: center;
        height: 160px;
        line-height: 160px;
        border: 1px solid #262F38;
        border-top: 0;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
      }
    }
    >.report-form-buy-sell{
      display: flex;
      flex: 2;
      margin-top: 20px;
      >.common{
        background-color: #1E2636;
        >.head{
          width: 570px;
          height: 40px;
          color: #338FF5;
          line-height: 40px;
          border: 1px solid #262F38;
          box-shadow: 0px 4px 6px #191E28;
        }
        >.body{
          width: 570px;
          height: 420px;
          padding: 20px 18px 0 18px;
          border: 1px solid #262F38;
          border-top: 0;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          >.together{
            width: 250px;
            height: 164px;
            border: 1px solid #262F38;
            display: flex;
            /*padding: 10px 5px 0px 5px;*/
            padding-top: 10px;
            >.left{
              flex: 1;
              box-sizing: border-box;
              text-align: center;
              position: relative;
              color: #D45858;
              >.round{
                box-sizing: border-box;
                display: inline-block;
                padding-top: 9px;
                width: 50px;
                height: 50px;
                background-color: #3B3139;
                border-radius: 50px;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
              }
            }
            >.right{
              flex: 2;
              // line-height: 2rem;
              line-height: 35px;
              color: #9DA5B3;
              .data{
                color: #D45858;
              }
            }
          }
        }
      }
      >.buy{
        flex: 1;
        margin-right: 10px;
      }
      >.sell{
        flex: 1;
        >.body{
          .together{
            >.left{
              color: #008069;
              >.round{
                background-color: #28403D;
              }
            }
            >.right{
              .data{
                color: #008069 !important;
              }
            }
          }
        }
      }
    }
    >.report-form-details{
      background-color: #1E2636;
      margin-top: 20px;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      >.title{
        height: 40px;
        line-height: 40px;
        color: #338FF5;
        box-shadow: 0px 4px 6px #191E28;
      }
      >.content{
        // height: 344px;
        >.date{
          height: 50px;
          line-height: 50px;
          margin-top: 30px;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          >.select-date{
            >.text{
              color: #9DA5B3;
              margin-right: 10px;
            }
            >.date-picker{
              >.date-short-line{
                margin: 0 7px;
              }
            }
          }
          >.radio-date{
            color: #46505F;
          }
        }
        >.order-table{
          margin-top: 20px;
          padding: 0 55px 0 43px;
          .red{
            color: #D45858;
          }
          .green{
            color: #008069;
          }
        }
        .page{
          text-align: center;
          padding: 10px 0;
        }
      }
    }
  }
}
</style>
