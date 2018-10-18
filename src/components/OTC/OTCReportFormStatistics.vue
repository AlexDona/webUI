<template>
  <div
    class="otc-report-form-statistics-box otc"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <!-- 1.0 导航 -->
    <NavCommon/>
    <!-- 2.0 -->
    <div class="report-form-statistics-content">
      <!-- 2.1 报表统计标题 -->
      <div class="report-form-title font-size20 padding-l15 font-weight700">
        <!-- 报表统计 -->
        {{$t('M.otc_formStatistics')}}
      </div>
      <!-- 2.2 筛选条件 -->
      <div class="report-form-filtrate">
        <!-- 交易币种 -->
        <span class="filtrate-text font-size14">
          {{$t('M.otc_trade')}}{{$t('M.comm_currency')}}
        </span>
        <span class="currency-input">
          <el-select
            v-model="activitedTraderCoinId"
            :no-data-text="$t('M.comm_no_data')"
            @change="changeCoinId"
          >
            <el-option
              v-for="(item,index) in traderCoinList"
              :key="index"
              :value="item.coinId"
              :label="item.name"
            >
            </el-option>
          </el-select>
        </span>
        <!-- 交易法币 -->
        <span class="filtrate-text font-size14">
          {{$t('M.otc_trade')}}{{$t('M.comm_coin')}}
        </span>
        <span class="legal-tender-input">
          <el-select
            v-model="activitedtraderCurrencyCoinsId"
            :no-data-text="$t('M.comm_no_data')"
            @change="changeCurrencyCoinsId"
          >
            <el-option
              v-for="(item,index) in traderCurrencyCoinsList"
              :key="index"
              :value="item.id"
              :label="language == 'zh_CN'? item.name : item.shortName"
            >
            </el-option>
          </el-select>
        </span>
      </div>
      <!-- 2.3 资产配置 -->
      <div
        class="report-form-asset"
        v-loading="formStatisticsLoading"
        element-loading-background="rgba(0, 0, 0, 0.6)"
      >
        <div class="title padding-l15 border-radius5">
          {{$t('M.otc_formStatistics_asset')}}
        </div>
        <div
          class="content font-size18"
        >
          <!-- 币种总资产 -->
          <span>{{total}}</span>
          <span>{{activitedTraderCoinName}}</span>
          <span v-if="totalAssets">≈</span>
          <!-- 法币总资产 -->
          <span v-if="totalAssets">{{totalAssets}}</span>
          <span v-if="totalAssets">
            {{activitedtraderCurrencyCoinsName}}
          </span>
        </div>
      </div>
      <!-- 2.4 购买和销售 -->
      <div
        class="report-form-buy-sell"
        v-loading="formStatisticsLoading"
        element-loading-background="rgba(0, 0, 0, 0.6)"
      >
        <!-- 购买 -->
        <div class="common buy">
          <!-- 头 -->
          <div class="head padding-l15 border-radius5">
            {{$t('M.comm_buying')}}
          </div>
          <!-- 内容 -->
          <div class="body">
            <!-- 当日 -->
            <div class="together border-radius5 day">
              <div class="left">
                <span class="round font-size12">
                  {{$t('M.otc_formStatistics_date')}}
                  <br />
                  {{$t('M.otc_trade')}}
                </span>
              </div>
              <div class="right">
                <p>
                  <span>{{$t('M.comm_buying')}}{{$t('M.comm_count')}}:</span>
                  <span class="data">
                    {{ buyDayMap.count }}{{ activitedTraderCoinName }}
                  </span>
                </p>
                <p>
                  <span>
                    {{$t('M.comm_buying')}}{{$t('M.otc_formStatistics_average')}}:
                  </span>
                  <span class="data">
                    {{ buyDayMap.average }}{{ activitedtraderCurrencyCoinsName }}
                  </span>
                </p>
                <p>
                  <span>{{$t('M.otc_formStatistics_amount_paid')}}:</span>
                  <span class="data">
                    {{ buyDayMap.amount }}{{ activitedtraderCurrencyCoinsName }}
                  </span>
                </p>
                <p>
                  <span>
                    {{$t('M.otc_formStatistics_turnover')}}{{$t('M.comm_order')}}:
                  </span>
                  <span class="data"> {{ buyDayMap.num }}{{$t('M.comm_stock')}}</span>
                </p>
              </div>
            </div>
            <!-- 当周 -->
            <div class="together border-radius5 week">
              <div class="left">
                <span class="round font-size12">
                  {{$t('M.otc_formStatistics_week')}}<br />{{$t('M.comm_deal')}}
                </span>
              </div>
              <div class="right">
                <p>
                  <span>{{$t('M.comm_buying')}}{{$t('M.comm_count')}}:</span>
                  <span class="data"> {{ buyWeekMap.count }}{{ activitedTraderCoinName }}</span>
                </p>
                <p>
                  <span>{{$t('M.comm_buying')}}{{$t('M.otc_formStatistics_average')}}:</span>
                  <span class="data">{{ buyWeekMap.average }}{{ activitedtraderCurrencyCoinsName }}</span>
                </p>
                <p>
                  <span>{{$t('M.otc_formStatistics_amount_paid')}}:</span>
                  <span class="data">{{ buyWeekMap.amount }}{{ activitedtraderCurrencyCoinsName }}</span>
                </p>
                <p>
                  <span>{{$t('M.otc_formStatistics_turnover')}}{{$t('M.comm_order')}}:</span>
                  <span class="data"> {{ buyWeekMap.num }}{{$t('M.comm_stock')}}</span>
                </p>
              </div>
            </div>
            <!-- 当月 -->
            <div class="together border-radius5 month">
              <div class="left">
                <span class="round font-size12">
                  {{$t('M.otc_formStatistics_mouth')}}<br />{{$t('M.comm_deal')}}
                </span>
              </div>
              <div class="right">
                <p>
                  <span>{{$t('M.comm_buying')}}{{$t('M.comm_count')}}:</span>
                  <span class="data">{{ buyMonthMap.count }}{{ activitedTraderCoinName }}</span>
                </p>
                <p>
                  <span>{{$t('M.comm_buying')}}{{$t('M.otc_formStatistics_average')}}:</span>
                  <span class="data"> {{ buyMonthMap.average }}{{ activitedtraderCurrencyCoinsName }}</span>
                </p>
                <p>
                  <span>{{$t('M.otc_formStatistics_amount_paid')}}:</span>
                  <span class="data"> {{ buyMonthMap.amount }}{{ activitedtraderCurrencyCoinsName }}</span>
                </p>
                <p>
                  <span>{{$t('M.otc_formStatistics_turnover')}}{{$t('M.comm_order')}}:</span>
                  <span class="data"> {{ buyMonthMap.num }}{{$t('M.comm_stock')}}</span>
                </p>
              </div>
            </div>
            <!-- 历史 -->
            <div class="together border-radius5 history">
              <div class="left">
                <span class="round font-size12">
                  {{$t('M.otc_formStatistics_history')}}<br />{{$t('M.comm_deal')}}
                </span>
              </div>
              <div class="right">
                <p>
                  <span>{{$t('M.comm_buying')}}{{$t('M.comm_count')}}:</span>
                  <span class="data"> {{ buyHistoryMap.count }}{{ activitedTraderCoinName }}</span>
                </p>
                <p>
                  <span>{{$t('M.comm_buying')}}{{$t('M.otc_formStatistics_average')}}:</span>
                  <span class="data">{{ buyHistoryMap.average }}{{ activitedtraderCurrencyCoinsName }}</span>
                </p>
                <p>
                  <span>{{$t('M.otc_formStatistics_amount_paid')}}:</span>
                  <span class="data">{{ buyHistoryMap.amount }}{{ activitedtraderCurrencyCoinsName }}</span>
                </p>
                <p>
                  <span>{{$t('M.otc_formStatistics_turnover')}}{{$t('M.comm_order')}}:</span>
                  <span class="data"> {{ buyHistoryMap.num }}{{$t('M.comm_stock')}}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- 销售 -->
        <div class="common sell">
          <!-- 头 -->
          <div class="head padding-l15 border-radius5">
            {{$t('M.otc_sell')}}
          </div>
          <!-- 内容 -->
          <div class="body">
            <!-- 当日 -->
            <div class="together border-radius5 day">
              <div class="left">
                <span class="round font-size12">
                  {{$t('M.otc_formStatistics_date')}}
                  <br />
                  {{$t('M.comm_deal')}}
                </span>
              </div>
              <div class="right">
                <p>
                  <span>{{$t('M.comm_buying')}}{{$t('M.comm_count')}}:</span>
                  <span class="data">{{ sellDayMap.count }}{{ activitedTraderCoinName }}</span>
                </p>
                <p>
                  <span>{{$t('M.comm_buying')}}{{$t('M.otc_formStatistics_average')}}:</span>
                  <span class="data">{{ sellDayMap.average }}{{ activitedtraderCurrencyCoinsName }}</span>
                </p>
                <p>
                  <span>{{$t('M.otc_formStatistics_amount_paid')}}:</span>
                  <span class="data">{{ sellDayMap.amount }}{{ activitedtraderCurrencyCoinsName }}</span>
                </p>
                <p>
                  <span>{{$t('M.otc_formStatistics_turnover')}}{{$t('M.comm_order')}}:</span>
                  <span class="data">{{ sellDayMap.num }}{{$t('M.comm_stock')}}</span>
                </p>
              </div>
            </div>
            <!-- 当周 -->
            <div class="together border-radius5 week">
              <div class="left">
                <span class="round font-size12">
                 {{$t('M.otc_formStatistics_week')}}<br />{{$t('M.comm_deal')}}
                </span>
              </div>
              <div class="right">
                <p>
                  <span>{{$t('M.comm_buying')}}{{$t('M.comm_count')}}:</span>
                  <span class="data"> {{ sellWeekMap.count }}{{ activitedTraderCoinName }}</span>
                </p>
                <p>
                  <span>{{$t('M.comm_buying')}}{{$t('M.otc_formStatistics_average')}}:</span>
                  <span class="data"> {{ sellWeekMap.average }}{{ activitedtraderCurrencyCoinsName }}</span>
                </p>
                <p>
                  <span>{{$t('M.otc_formStatistics_amount_paid')}}:</span>
                  <span class="data">{{ sellWeekMap.amount }}{{ activitedtraderCurrencyCoinsName }}</span>
                </p>
                <p>
                  <span>{{$t('M.otc_formStatistics_turnover')}}{{$t('M.comm_order')}}:</span>
                  <span class="data">{{ sellWeekMap.num }}{{$t('M.comm_stock')}}</span>
                </p>
              </div>
            </div>
            <!-- 当月 -->
            <div class="together border-radius5 month">
              <div class="left">
                <span class="round font-size12">
                  {{$t('M.otc_formStatistics_mouth')}}<br />{{$t('M.comm_deal')}}
                </span>
              </div>
              <div class="right">
                <p>
                  <span>{{$t('M.comm_buying')}}{{$t('M.comm_count')}}:</span>
                  <span class="data"> {{ sellMonthMap.count }}{{ activitedTraderCoinName }}</span>
                </p>
                <p>
                  <span>{{$t('M.comm_buying')}}{{$t('M.otc_formStatistics_average')}}:</span>
                  <span class="data"> {{ sellMonthMap.average }}{{ activitedtraderCurrencyCoinsName }}</span>
                </p>
                <p>
                  <span>{{$t('M.otc_formStatistics_amount_paid')}}:</span>
                  <span class="data"> {{ sellMonthMap.amount }}{{ activitedtraderCurrencyCoinsName }}</span>
                </p>
                <p>
                  <span>{{$t('M.otc_formStatistics_turnover')}}{{$t('M.comm_order')}}:</span>
                  <span class="data"> {{ sellMonthMap.num }}{{$t('M.comm_stock')}}</span>
                </p>
              </div>
            </div>
            <!-- 历史 -->
            <div class="together border-radius5 history">
              <div class="left">
                <span class="round font-size12">
                  {{$t('M.otc_formStatistics_history')}}<br />{{$t('M.comm_deal')}}
                </span>
              </div>
              <div class="right">
                <p>
                  <span>{{$t('M.comm_buying')}}{{$t('M.comm_count')}}:</span>
                  <span class="data"> {{ sellHistoryMap.count }}{{ activitedTraderCoinName }}</span>
                </p>
                <p>
                  <span>{{$t('M.comm_buying')}}{{$t('M.otc_formStatistics_average')}}:</span>
                  <span class="data"> {{ sellHistoryMap.average }}{{ activitedtraderCurrencyCoinsName }}</span>
                </p>
                <p>
                  <span>{{$t('M.otc_formStatistics_amount_paid')}}:</span>
                  <span class="data"> {{ sellHistoryMap.amount }}{{ activitedtraderCurrencyCoinsName }}</span>
                </p>
                <p>
                  <span>{{$t('M.otc_formStatistics_turnover')}}{{$t('M.comm_order')}}:</span>
                  <span class="data"> {{ sellHistoryMap.num }}{{$t('M.comm_stock')}}</span>
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
          {{$t('M.otc_formStatistics_orderDeatil')}}
        </div>
        <!-- 主要内容 -->
        <div class="content">
          <!-- 2.5.2 选择日期 -->
          <div class="date">
            <!-- 左侧日历 -->
            <div class="select-date">
              <span class="text">{{$t('M.otc_MerchantsOrders_date')}}</span>
              <span class="date-picker">
                <!--开始日期-->
                <el-date-picker
                  :placeholder="$t('M.otc_MerchantsOrders_chouse') + $t('M.otc_MerchantsOrders_date')"
                  v-model="startTimeValue"
                  type="date"
                  value-format="yyyy-MM-dd"
                  @change="startTime"
                >
                </el-date-picker>
                <span class="date-short-line">-</span>
                <!--结束日期-->
                <el-date-picker
                  :placeholder="$t('M.otc_MerchantsOrders_chouse') + $t('M.otc_MerchantsOrders_date')"
                  v-model="endTimeValue"
                  value-format="yyyy-MM-dd"
                  type="date"
                  @change="endTime"
                >
                </el-date-picker>
              </span>
            </div>
            <!-- 右侧单选日期按钮 -->
            <div class="radio-date">
              <el-radio-group
                v-model="activedRadioId"
                @change="radioChouse"
              >
                <el-radio :label="1">
                  {{$t('M.otc_formStatistics_date')}}
                </el-radio>
                <el-radio :label="2">
                  {{$t('M.otc_formStatistics_week')}}
                </el-radio>
                <el-radio :label="3">
                  {{$t('M.otc_formStatistics_mouth')}}
                </el-radio>
                <el-radio :label="4">
                  {{$t('M.otc_formStatistics_history')}}
                </el-radio>
              </el-radio-group>
            </div>
          </div>
          <!-- 2.5.3 订单表格详情 -->
          <div class="order-table">
            <el-table
              :data = "orderInfoList"
              style = "width: 100%"
              :empty-text="$t('M.comm_no_data')"
              v-loading="orderDetailsLoading"
              element-loading-background="rgba(0, 0, 0, 0.6)"
            >
              <!-- 交易日期 -->
              <el-table-column
                :label = "$t('M.otc_transaction_data')"
                width="180"
              >
                <template slot-scope = "scope">
                  <div>{{timeFormatting(scope.row.createTime)}}</div>
                </template>
              </el-table-column>
              <!-- 订单号 -->
              <el-table-column
                :label = "$t('M.otc_MerchantsOrders_orderNum')"
              >
                <template slot-scope = "scope">
                  <div>{{scope.row.orderSequence}}</div>
                </template>
              </el-table-column>
              <!-- 交易类型 -->
              <el-table-column
                :label = "$t('M.otc_type_ransaction')"
              >
                <template slot-scope = "scope">
                  <div
                    v-if="scope.row.orderType === 'BUY'"
                    :class="{red:scope.row.orderType === 'BUY'}"
                  >
                    {{$t('M.comm_buying')}}
                  </div>
                  <div
                    v-if="scope.row.orderType === 'SELL'"
                    :class="{green:scope.row.orderType === 'SELL'}"
                  >
                    {{$t('M.comm_offering')}}
                  </div>
                </template>
              </el-table-column>
              <!-- 资金类型 -->
              <el-table-column
                :label = "$t('M.otc_type_capital')"
              >
                <template slot-scope = "scope">
                  <div>{{scope.row.currencyName}}</div>
                </template>
              </el-table-column>
              <!-- 数量 -->
              <el-table-column
                :label = "$t('M.comm_count')"
              >
                <template slot-scope = "scope">
                  <div>{{scope.row.pickCount}}</div>
                </template>
              </el-table-column>
              <!-- 单价 -->
              <el-table-column
                :label = "$t('M.otc_index_UnitPrice')"
              >
                <template slot-scope = "scope">
                  <div>{{scope.row.price}}</div>
                </template>
              </el-table-column>
              <!-- 总金额 -->
              <el-table-column
                :label = "$t('M.otc_canceled_total ')"
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
    <keep-aline><FooterCommon/></keep-aline>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {getOTCAvailableCurrency, getMerchantAvailablelegalTender, getOTCMerchantsOrdersList, getOTCReportFormStatisticsData} from '../../utils/api/OTC'
import NavCommon from '../Common/HeaderCommonForPC'
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
      formStatisticsLoading: false,
      orderDetailsLoading: false,
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
      startTimeValue: '', // 默认开始时间
      endTimeValue: '', // 默认结束时间
      activedRadioId: '', // 单选按钮时间
      totalAssets: '', // 法币总资产
      total: '', // 币种总资产
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
    await this.getOTCAvailableCurrencyList()
    // 2.0 查询可用法币币种列表
    await this.getMerchantAvailablelegalTenderList()
    // 订单详情列表
    this.getOTCEntrustingOrdersRevocation()
    // 报表统计主页
    this.getOTCReportFormStatistics()
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
      this.orderDetailsLoading = true
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
        // this.getMerchantAvailablelegalTenderList()
      }
    },
    //  2.1 改变可用币种类型
    changeCoinId (e) {
      this.formStatisticsLoading = true
      this.orderDetailsLoading = true
      this.activitedTraderCoinId = e
      this.traderCoinList.forEach(item => {
        if (e === item.coinId) {
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
        // this.getOTCEntrustingOrdersRevocation()
      }
    },
    //  3.1 改变 可用法币 币种类型
    changeCurrencyCoinsId (e) {
      this.activitedtraderCurrencyCoinsId = e
      this.traderCurrencyCoinsList.forEach(item => {
        if (e === item.id) {
          this.activitedtraderCurrencyCoinsName = item.shortName
        }
      })
      this.formStatisticsLoading = true
      this.getOTCReportFormStatistics()
      this.orderDetailsLoading = true
      this.getOTCEntrustingOrdersRevocation()
    },
    // 开始时间赋值
    startTime (e) {
      this.startTimeValue = e
      this.activedRadioId = ''
      console.log(e)
      if (this.endTimeValue) {
        if (this.startTimeValue > this.endTimeValue) {
          this.$message({ // message: '开始时间不能大于结束时间',
            message: this.$t('M.otc_time_limit'),
            type: 'error'
          })
          return false
        }
      }
      this.orderDetailsLoading = true
      this.getOTCEntrustingOrdersRevocation()
    },
    // 结束时间赋值
    endTime (e) {
      this.endTimeValue = e
      this.activedRadioId = ''
      console.log(e)
      if (this.startTimeValue) {
        if (this.startTimeValue > this.endTimeValue) {
          this.$message({ // message: '开始时间不能大于结束时间',
            message: this.$t('M.otc_time_limit'),
            type: 'error'
          })
          return false
        }
      }
      this.orderDetailsLoading = true
      this.getOTCEntrustingOrdersRevocation()
    },
    // 右侧单选日期按钮change事件
    radioChouse (e) {
      this.activedRadioId = e
      if (e == '4') {
        this.startTimeValue = ''
        this.endTimeValue = ''
      }
      this.orderDetailsLoading = true
      this.getOTCEntrustingOrdersRevocation()
    },
    // 报表统计的主页面
    async getOTCReportFormStatistics () {
      this.formStatisticsLoading = true
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
        this.formStatisticsLoading = false
        return false
      } else {
        this.formStatisticsLoading = false
        let getData = data.data.data
        // 返回数据正确的逻辑
        // 法币总资产
        this.totalAssets = getData.totalAssets
        // 币种总资产
        this.total = getData.total
        // 当天交易
        this.buyDayMap = getData.buyDayMap
        // 购买历史交易赋值
        this.buyHistoryMap = getData.buyHistoryMap
        // 购买本月赋值
        this.buyMonthMap = getData.buyMonthMap
        // 购买本周赋值
        this.buyWeekMap = getData.buyWeekMap
        // 出售当天赋值
        this.sellDayMap = getData.sellDayMap
        // 出售历史赋值
        this.sellHistoryMap = getData.sellHistoryMap
        // 出售当月赋值
        this.sellMonthMap = getData.sellMonthMap
        // 出售本周赋值
        this.sellWeekMap = getData.sellWeekMap
      }
    },
    // 页面加载时请求接口渲染订单详情列表
    async getOTCEntrustingOrdersRevocation () {
      this.orderDetailsLoading = true
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
        startTime: this.startTimeValue,
        // 结束时间
        endTime: this.endTimeValue,
        // 日期类型
        dateType: this.activedRadioId
      })
      // 提示信息
      console.log('报表列表')
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        this.orderDetailsLoading = false
        return false
      } else {
        // 返回数据正确的逻辑 重新渲染列表
        this.orderDetailsLoading = false
        this.orderInfoList = data.data.data.list
        // 分页
        this.totalPages = data.data.data.pages - 0
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      language: state => state.common.language,
      // 商户id
      partnerId: state => state.common.partnerId,
      theme: state => state.common.theme,
      // 测试拿到userinfo
      userInfo: state => state.personal.userInfo
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
@import "../../../static/css/scss/index";
.otc-report-form-statistics-box{
  >.report-form-statistics-content{
    width: 1150px;
    margin: 70px auto;
    padding-top: 50px;
    margin-bottom: 10px;
    >.report-form-title{
      height: 30px;
      line-height: 30px;
      // color: #338FF5;
      // border-left: 3px solid #338FF5;
      margin-bottom: 30px;
    }
    >.report-form-filtrate{
      >.filtrate-text{
        // color: #9DA5B3;
        margin-right: 20px;
      }
      >.currency-input{
        margin-right: 50px;
      }
      >.legal-tender-input{
      }
    }
    >.report-form-asset{
      // color: #338FF5;
      // background-color: #1E2636;
      margin-top: 20px;
      >.title{
        height: 40px;
        line-height: 40px;
        // border: 1px solid #262F38;
        // box-shadow: 0px 4px 6px #191E28;
      }
      >.content{
        text-align: center;
        height: 160px;
        line-height: 160px;
        // border: 1px solid #262F38;
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
        // background-color: #1E2636;
        border-radius: 5px;
        >.head{
          width: 570px;
          height: 40px;
          // color: #338FF5;
          line-height: 40px;
          // border: 1px solid #262F38;
          // box-shadow: 0px 4px 6px #191E28;
        }
        >.body{
          width: 570px;
          height: 420px;
          padding: 20px 18px 0 18px;
          // border: 1px solid #262F38;
          border-top: 0;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          >.together{
            width: 250px;
            height: 164px;
            // border: 1px solid #262F38;
            display: flex;
            padding-top: 10px;
            >.left{
              flex: 1;
              box-sizing: border-box;
              text-align: center;
              position: relative;
              // color: #D45858;
              >.round{
                box-sizing: border-box;
                display: inline-block;
                padding-top: 9px;
                width: 50px;
                height: 50px;
                // background-color: #3B3139;
                border-radius: 50px;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
              }
            }
            >.right{
              flex: 2;
              line-height: 35px;
              // color: #9DA5B3;
              .data{
                // color: #D45858;
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
              // color: #008069;
              >.round{
                // background-color: #28403D;
              }
            }
            >.right{
              .data{
                // color: #008069 !important;
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
        // color: #338FF5;
        // box-shadow: 0px 4px 6px #191E28;
      }
      >.content{
        >.date{
          height: 50px;
          line-height: 50px;
          margin-top: 30px;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          >.select-date{
            >.text{
              // color: #9DA5B3;
              margin-right: 10px;
            }
            >.date-picker{
              >.date-short-line{
                margin: 0 7px;
              }
            }
          }
          >.radio-date{
            // color: #46505F;
          }
        }
        >.order-table{
          margin-top: 20px;
          padding: 0 55px 0 43px;
          .red{
            // color: #D45858;
          }
          .green{
            // color: #008069;
          }
        }
        .page{
          text-align: center;
          padding: 10px 0;
        }
      }
    }
  }
  &.night{
    background-color: $mainNightBgColor;
    >.report-form-statistics-content{
      >.report-form-title{
        color: #338FF5;
        border-left: 3px solid #338FF5;
      }
      >.report-form-filtrate{
        >.filtrate-text{
          color: #9DA5B3;
        }
        >.currency-input{
        }
        >.legal-tender-input{
        }
      }
      >.report-form-asset{
        color: #338FF5;
        background-color: #1C1F32;
        >.title{
          border: 1px solid #1C1F32;
          box-shadow: 0px 4px 6px #191E28;
        }
        >.content{
          border: 1px solid #1C1F32;
        }
      }
      >.report-form-buy-sell{
        >.common{
          background-color: #1C1F32;
          >.head{
            color: #338FF5;
            // border: 1px solid #23263C;
            box-shadow: 0px 4px 6px #191E28;
          }
          >.body{
            border: 1px solid #23263C;
            >.together{
              border: 1px solid #23263C;
              >.left{
                color: #D45858;
                >.round{
                  background-color: #3B3139;
                }
              }
              >.right{
                color: #9DA5B3;
                .data{
                  color: #D45858;
                }
              }
            }
          }
        }
        >.buy{
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
        // background-color: #1E2636;
        background-color: #1C1F32;
        >.title{
          color: #338FF5;
        }
        >.content{
          >.date{
            >.select-date{
              >.text{
                color: #9DA5B3;
              }
              >.date-picker{
                >.date-short-line{
                }
              }
            }
            >.radio-date{
              color: #46505F;
            }
          }
          >.order-table{
            .red{
              color: #D45858;
            }
            .green{
              color: #008069;
            }
          }
          .page{
          }
        }
      }
    }
  }
  &.day{
    background-color: $mainDayBgColor;
    >.report-form-statistics-content{
      >.report-form-title{
        color: #338FF5;
        border-left: 3px solid #338FF5;
      }
      >.report-form-filtrate{
        >.filtrate-text{
          color: #9DA5B3;
        }
        >.currency-input{
        }
        >.legal-tender-input{
        }
      }
      >.report-form-asset{
        color: #338FF5;
        background-color: #1E2636;
        >.title{
          border: 1px solid #262F38;
          box-shadow: 0px 4px 6px #191E28;
        }
        >.content{
          border: 1px solid #262F38;
        }
      }
      >.report-form-buy-sell{
        >.common{
          background-color: #1E2636;
          >.head{
            color: #338FF5;
            border: 1px solid #262F38;
            box-shadow: 0px 4px 6px #191E28;
          }
          >.body{
            border: 1px solid #262F38;
            >.together{
              border: 1px solid #262F38;
              >.left{
                color: #D45858;
                >.round{
                  background-color: #3B3139;
                }
              }
              >.right{
                color: #7D90AC;
                .data{
                  color: #D45858;
                }
              }
            }
          }
        }
        >.buy{
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
        // background-color: #1E2636;
        >.title{
          color: #338FF5;
        }
        >.content{
          >.date{
            >.select-date{
              >.text{
                color: #9DA5B3;
              }
              >.date-picker{
                >.date-short-line{
                }
              }
            }
            >.radio-date{
              color: #46505F;
            }
          }
          >.order-table{
            .red{
              color: #D45858;
            }
            .green{
              color: #008069;
            }
          }
          .page{
          }
        }
      }
    }
  }
}
</style>
